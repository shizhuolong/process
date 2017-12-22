package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.portal.channelManagement.service.ImportChannelService;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.portal.unsupported.service.UnsupportedService;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/channel")
@Scope("prototype")
/*@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_channel_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_channel_excel.jsp")
})*/
public class ImportChannelAction extends BaseAction {
	private File uploadFile;
	private String time;
	@Autowired
    private ImportChannelService importChannelService;
	private Map<String, String> resultMap=new HashMap<String,String>();


	public Map<String, String> getResultMap() {
        return resultMap;
    }

    public void setResultMap(Map<String, String> resultMap) {
        this.resultMap = resultMap;
    }

    @Resource
	DataSource dataSource;

	public void importToResult() {
	    User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String regionCode = org.getRegionCode();
		String importToResult = "INSERT INTO PMRT.TAB_MRT_YSDZ_NEW_CHANL SELECT * FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL_TEMP WHERE GROUP_ID_1='"+regionCode+"'";
		SpringManager.getUpdateDao().update(importToResult);
		
	}
	
	public void importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
        String regionCode = org.getRegionCode();
        String regionName=org.getRegionName();
		String username=user.getUsername();
		String resMsg = "";
		String resultTableName = "PMRT.TAB_MRT_YSDZ_NEW_CHANL_TEMP";
		String field="GROUP_ID_1,GROUP_ID_1_NAME,USERNAME,CREATE_TIME,HQ_CHAN_CODE,HQ_CHAN_NAME,START_MONTH,"
		        + "END_MONTH,ASSESS_TARGET,RATE_THREE,RATE_SIX,RATE_NINE,RATE_TWELVE,ID";
		if (uploadFile == null) {
		    resMsg="上传文件为空！";
		} else {
			FileInputStream in =null;
		    Workbook wb = null;
			Connection conn = null;
			PreparedStatement pre = null;
			try {
				conn = this.getCon();
				conn.setAutoCommit(false); 
				// 上传时覆盖
				String delSql = "DELETE FROM " + resultTableName +" WHERE GROUP_ID_1="+regionCode;
						
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +2 ;// 去前2行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values("+regionCode+",'"+regionName+"','"+username+"',sysdate";
                    for(int i=0;i<10;i++){
                        sql+=",?";
                    }
                    sql+=")";					
                    pre=conn.prepareStatement(sql);
						for (int y = start; y <= end; y++) {
	                        row = sheet.getRow(y);
	                        if (row == null)
	                            continue;
	                        int cstart = row.getFirstCellNum();
	                        int cend = row.getLastCellNum();
	                        System.out.println(cstart + ":" + cend);
	                        for (int i = cstart; i < cend; i++) {
	                            if(i>=2&&i<5){
	                                String pattern="(^\\d+\\.?\\d+$)?";
                                    String content=getCellValue(row.getCell(i));
                                    boolean isMatch = Pattern.matches(pattern, content);
                                    if(!isMatch){
                                        resMsg+="<br>"+"第"+y+"行不是数字";
                                    }
	                            }
	                            if(i>=5){
	                                String pattern="(^\\d+\\.?\\d+\\%$)?";
	                                String content=getCellValue(row.getCell(i));
	                                boolean isMatch = Pattern.matches(pattern, content);
	                                if(!isMatch){
	                                    resMsg+="<br>"+"第"+y+"行不是百分数";
	                                }
	                            }
	                            pre.setString(i+1,getCellValue(row.getCell(i)));
	                        }
	                        String uuid=UUIDGeneratorUtils.getUUID();
	                        pre.setString(10,uuid);
	                        pre.addBatch();
	                    }
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					String lsql = "select HQ_CHAN_CODE, HQ_CHAN_NAME                     "+
			                "  from PMRT.TAB_MRT_YSDZ_NEW_CHANL_TEMP t             "+
			                " where HQ_CHAN_CODE NOT IN                            "+
			                "       (SELECT HQ_CHAN_CODE                           "+
			                "          FROM pcde.tab_cde_chanl_hq_code             "+
			                "         where CHNL_TYPE in ('专营-他建他营', '专营-自建他营')) "+
			                "    or HQ_CHAN_NAME NOT IN                            "+
			                "       (SELECT GROUP_ID_4_NAME                           "+
			                "          FROM pcde.tab_cde_chanl_hq_code             "+
			                "         where CHNL_TYPE in ('专营-他建他营', '专营-自建他营')) ";
					resMsg += legalValid(lsql);
					String rsql="SELECT HQ_CHAN_CODE,HQ_CHAN_NAME FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL_TEMP WHERE "
			                + " HQ_CHAN_CODE IN(SELECT HQ_CHAN_CODE FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL WHERE IS_VALID=1)"
			                +" AND GROUP_ID_1="+regionCode;
					resMsg += repeatValid(rsql);
					if (resMsg != null && !resMsg.equals("")){
					    this.reponseJson(resMsg);
					}else{
					    importToResult();
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				resMsg+=(e.getMessage());
			}finally{
				try {
					conn.close();
					if(wb instanceof XSSFWorkbook){
						in.close();
					}else{
						 wb.close();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		this.reponseJson(resMsg);
	}
	
	//校验渠道名称和渠道编码
	private String legalValid(String sql)
            throws Exception, SQLException {
        Connection conn;
        Statement pre;
        String resMsg="";
        conn = this.getCon();
        pre = conn.createStatement();
        ResultSet rs = pre.executeQuery(sql);
        if(rs.next()){
            resMsg+="以下渠道编码或渠道名称不正确：";
            do{  
                resMsg+="<br>"+rs.getString("HQ_CHAN_CODE")+" ，"+rs.getString("HQ_CHAN_NAME");
            } while(rs.next());
        }
        return resMsg;
    }
	
	//校验渠道编码是否重复
    private String repeatValid(String sql)
            throws Exception, SQLException {
        Connection conn;
        Statement pre;
        String resMsg="";
        conn = this.getCon();
        pre = conn.createStatement();
        ResultSet rs = pre.executeQuery(sql);
        if(rs.next()){
            resMsg+="以下渠道编码正在审批或已经通过审批，不能重复导入：";
            do{  
                resMsg+="<br>"+rs.getString("HQ_CHAN_CODE");
            } while(rs.next());
        }
        return resMsg;
    }

	public void downfile() {
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_channel.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=importChannel.xls");
			byte[] b=new byte[1024];
			int size=is.read(b);
			while(size>0){
				os.write(b,0,size);
				size=is.read(b);
			}
		}catch(IOException e){
			e.printStackTrace();
			if(null==os){
				try {
					os=resp.getOutputStream();
				} catch (IOException e1) {}
			}
		}finally{
			if(is!=null){
				try{ is.close();}catch(Exception e1){}
			}
			if(os!=null){
				try{ os.close();}catch(Exception e2){}
			}
		}
	}
	
	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	private String getCellValue(Cell cell){
		String value="";
		if(cell==null){
			return value;
		}
		int cellType=cell.getCellType();
		if(cellType==HSSFCell.CELL_TYPE_STRING){
			value=cell.getStringCellValue()+"";
		}else if(cellType==HSSFCell.CELL_TYPE_NUMERIC){
			if(HSSFDateUtil.isCellDateFormatted(cell)){
				value=new SimpleDateFormat("yyyy年MM月dd日").format(cell.getDateCellValue())+"";
			}else{
				value=cell.getNumericCellValue()+"";
			}
		}else if(cellType==HSSFCell.CELL_TYPE_BLANK){
			
		}else if(HSSFCell.CELL_TYPE_FORMULA==cellType){
			try {
				value = String.valueOf(cell.getNumericCellValue());
			} catch (IllegalStateException e) {
				value = String.valueOf(cell.getRichStringCellValue());
			}
			System.out.print("\t" + value);
		}
		return value;
	}
	
	public void list() {
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String code = org.getCode();
        resultMap.put("code", code);
 
        Object result = importChannelService.list(resultMap);
        this.reponseJson(result);
	}
	
	//添加渠道
	public void addChannel(){
	    User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String regionCode = org.getRegionCode();
        String regionName=org.getRegionName();
        String username=user.getUsername();
	    String hq_chan_code = request.getParameter("hq_chan_code");
	    String hq_chan_name = request.getParameter("hq_chan_name");
	    String start_month = request.getParameter("start_month");
	    String end_month = request.getParameter("end_month");
	    String assess_target = request.getParameter("assess_target");
	    String rate_three = request.getParameter("rate_three");
	    String rate_six = request.getParameter("rate_six");
	    String rate_nine = request.getParameter("rate_nine");
	    String rate_twelve = request.getParameter("rate_twelve");
	    String id=UUIDGeneratorUtils.getUUID();
	    Map<String, String> params = new HashMap<String,String>();
	    params.put("regionCode", regionCode);
	    params.put("regionName", regionName);
	    params.put("username", username);
	    params.put("create_time", "sysdate");
	    params.put("hq_chan_code", hq_chan_code);
	    params.put("hq_chan_name", hq_chan_name);
	    params.put("start_month", start_month);
	    params.put("end_month", end_month);
	    params.put("assess_target", assess_target);
	    params.put("rate_three", rate_three);
	    params.put("rate_six", rate_six);
	    params.put("rate_nine", rate_nine);
	    params.put("rate_twelve", rate_twelve);
	    params.put("id", id);
	    String resultMsg="";
	    try {
	        String lsql="SELECT HQ_CHAN_CODE,GROUP_ID_4_NAME HQ_CHAN_NAME FROM pcde.tab_cde_chanl_hq_code "
	                + " where CHNL_TYPE in ('专营-他建他营', '专营-自建他营') " 
	                + " and HQ_CHAN_CODE='"+hq_chan_code+"'"
	                + " and GROUP_ID_4_NAME='"+hq_chan_name+"' ";
	        String msg=legalValid(lsql);
	        if(!(msg!=null&&msg.equals(""))){
	            String rsql="SELECT HQ_CHAN_CODE FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL "
	                    +" WHERE IS_VALID=1 "
	                    +" AND GROUP_ID_1="+regionCode
	                    +" AND HQ_CHAN_CODE='"+hq_chan_code+"'";
	            String rmsg=repeatValid(rsql);
	            if(rmsg!=null&&rmsg.equals("")){
	                importChannelService.addChannel(params);
	            }else{
	                this.reponseJson("改渠道已经在审核或审核通过，不允许重复添加！");
	            }
	        }else{
	            resultMsg+="渠道名称或渠道编码错误！";
	            this.reponseJson("渠道名称或渠道编码错误！");
	        }
	        
        } catch (Exception e) {
            e.printStackTrace();
            resultMsg+=e.getMessage();
        }
	    this.reponseJson(resultMsg);
	}
	
	public void findById(){
	    String id=request.getParameter("id");
	    Map<String, Object> map = importChannelService.findById(id);
	    this.reponseJson(map);
	}
	
	public void updateChannel(){
	    User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String regionCode = org.getRegionCode();
        String regionName=org.getRegionName();
        String username=user.getUsername();
        String hq_chan_code = request.getParameter("hq_chan_code");
        String hq_chan_name = request.getParameter("hq_chan_name");
        String start_month = request.getParameter("start_month");
        String end_month = request.getParameter("end_month");
        String assess_target = request.getParameter("assess_target");
        String rate_three = request.getParameter("rate_three");
        String rate_six = request.getParameter("rate_six");
        String rate_nine = request.getParameter("rate_nine");
        String rate_twelve = request.getParameter("rate_twelve");
        String id = request.getParameter("id");
        Map<String, String> params = new HashMap<String,String>();
        params.put("regionCode", regionCode);
        params.put("regionName", regionName);
        params.put("username", username);
        params.put("create_time", "sysdate");
        params.put("hq_chan_code", hq_chan_code);
        params.put("hq_chan_name", hq_chan_name);
        params.put("start_month", start_month);
        params.put("end_month", end_month);
        params.put("assess_target", assess_target);
        params.put("rate_three", rate_three);
        params.put("rate_six", rate_six);
        params.put("rate_nine", rate_nine);
        params.put("rate_twelve", rate_twelve);
        params.put("id", id);
        String resultMsg="";
        /* try {
            String lsql="SELECT HQ_CHAN_CODE,GROUP_ID_4_NAME HQ_CHAN_NAME FROM pcde.tab_cde_chanl_hq_code "
                    + " where CHNL_TYPE in ('专营-他建他营', '专营-自建他营') " 
                    + " and HQ_CHAN_CODE='"+hq_chan_code+"'"
                    + " and GROUP_ID_4_NAME='"+hq_chan_name+"' ";
            String msg=legalValid(lsql);
            if(!(msg!=null&&msg.equals(""))){
                String rsql="SELECT HQ_CHAN_CODE FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL "
                        +" WHERE IS_VALID=1 "
                        +" AND GROUP_ID_1="+regionCode
                        +" AND HQ_CHAN_CODE='"+hq_chan_code+"'";
                String rmsg=repeatValid(rsql);
                if(rmsg!=null&&rmsg.equals("")){
                    importChannelService.updateChannel(params);
                }else{
                    this.reponseJson("改渠道已经在审核或审核通过，不允许重复添加！");
                }
            }else{
                resultMsg+="渠道名称或渠道编码错误！";
                this.reponseJson("渠道名称或渠道编码错误！");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            resultMsg+=e.getMessage();
        }*/
        try {
            importChannelService.updateChannel(params);
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
            resultMsg="修改失败！";
        }
            
        this.reponseJson(resultMsg);
	}
}
