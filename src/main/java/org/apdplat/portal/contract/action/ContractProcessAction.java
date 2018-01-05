package org.apdplat.portal.contract.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
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
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.portal.contract.service.ContractProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/contract")
@Scope("prototype")
public class ContractProcessAction extends BaseAction {
	
	@Autowired
    private ContractProcessService service;
	@Resource
	DataSource dataSource;
	
	private Map<String, String> resultMap=new HashMap<String,String>();
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private File uploadFile;
	private String isHavingFile;
        
	public void list() {
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String orgLevel=org.getOrgLevel();
        String regionCode = org.getRegionCode();
        resultMap.put("regionCode", regionCode);
        resultMap.put("orgLevel", orgLevel);
        Object result = service.list(resultMap);
        this.reponseJson(result);
	}
	
	public void importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
        String regionCode = org.getRegionCode();
        String regionName=org.getRegionName();
		String username=user.getUsername();
		String resMsg = "";
		String businessKey = request.getParameter("businessKey");
		String resultTableName = "PMRT.TAB_MRT_YSDZ_NEW_CHANL_TEMP";
		service.delTemp(regionCode);
		String field="GROUP_ID_1,GROUP_ID_1_NAME,USERNAME,CREATE_TIME,HQ_CHAN_CODE,HQ_CHAN_NAME,START_MONTH,"
		        + "END_MONTH,ASSESS_TARGET,YSDZ_XS,ZX_BT,HZ_MS,FW_FEE,RATE_THREE,RATE_SIX,RATE_NINE,RATE_TWELVE,ID,HZ_YEAR";
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
				service.delTemp(regionCode);
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
                    for(int i=0;i<15;i++){
                        sql+=",?";
                    }
                    sql+=")";					
                    pre=conn.prepareStatement(sql);
                    int start_year = 0;
                    int end_year = 0;
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
                                    if(i==2){
                                        start_year= getYear(getCellValue(row.getCell(i)));
                                    }
                                    if(i==3){
                                        end_year= getYear(getCellValue(row.getCell(i)));
                                    }
                                    
	                            }
	                            if(i>=9){
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
	                        pre.setString(14,uuid);
	                        pre.setInt(15, end_year-start_year);
	                        pre.addBatch();
	                    }
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					String lsql = "select HQ_CHAN_CODE, HQ_CHAN_NAME               "+
			                "  from PMRT.TAB_MRT_YSDZ_NEW_CHANL_TEMP t             "+
			                " where GROUP_ID_1="+regionCode+" AND (HQ_CHAN_CODE NOT IN"+
			                "       (SELECT HQ_CHAN_CODE                           "+
			                "          FROM PCDE.TAB_CDE_CHANL_HQ_CODE             "+
			                "         where CHNL_TYPE in ('专营-他建他营', '专营-自建他营')) "+
			                "    or HQ_CHAN_NAME NOT IN                            "+
			                "       (SELECT GROUP_ID_4_NAME                           "+
			                "          FROM pcde.tab_cde_chanl_hq_code             "+
			                "         where CHNL_TYPE in ('专营-他建他营', '专营-自建他营'))) ";
					resMsg += legalValid(lsql);
					String rsql="SELECT HQ_CHAN_CODE,HQ_CHAN_NAME FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL_TEMP WHERE "
			                + " HQ_CHAN_CODE IN(SELECT HQ_CHAN_CODE FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL WHERE GROUP_ID_1="+regionCode+" AND BUSINESS_KEY IS NOT NULL)"
			                +" AND GROUP_ID_1="+regionCode;
					resMsg += repeatValid(rsql);
					if (resMsg != null && !resMsg.equals("")){
					    this.reponseJson(resMsg);
					}else{
						resultMap.put("regionCode", regionCode);
						resultMap.put("businessKey", businessKey);
						service.importToResult(resultMap);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				resMsg+=(e.getMessage());
				try {
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
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
	    String ysdz_xs = request.getParameter("ysdz_xs");
	    String zx_bt = request.getParameter("zx_bt");
	    String hz_ms = request.getParameter("hz_ms");
	    String fw_fee = request.getParameter("fw_fee");
	    String id=UUIDGeneratorUtils.getUUID();
	    int hz_year = getYear(end_month)-getYear(start_month);
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
	    params.put("ysdz_xs", ysdz_xs);
	    params.put("zx_bt", zx_bt);
	    params.put("hz_ms", hz_ms);
	    params.put("fw_fee", fw_fee);
	    params.put("hz_year", String.valueOf(hz_year));
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
	                    +" WHERE "
	                    +" HQ_CHAN_CODE='"+hq_chan_code+"'";
	            String rmsg=repeatValid(rsql);
	            if(rmsg!=null&&rmsg.equals("")){
	                service.addChannel(params);
	            }else{
	                this.reponseJson("该渠道正在审核或已经审核通过，不允许重复添加！");
	            }
	        }else{
	            resultMsg+="渠道名称或渠道编码错误！";
	            this.reponseJson("渠道名称或渠道编码错误！");
	        }
	        
        } catch (Exception e) {
            e.printStackTrace();
            resultMsg+="渠道添加失败";
        }
	    this.reponseJson(resultMsg);
	}
	
	public void findById(){
	    String id=request.getParameter("id");
	    Map<String, Object> map = service.findById(id);
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
        String ysdz_xs = request.getParameter("ysdz_xs");
        String zx_bt = request.getParameter("zx_bt");
        String hz_ms = request.getParameter("hz_ms");
        String fw_fee = request.getParameter("fw_fee");
        int hz_year = getYear(end_month)-getYear(start_month);
        Map<String, String> params = new HashMap<String,String>();
        params.put("regionCode", regionCode);
        params.put("regionName", regionName);
        params.put("username", username);
        params.put("create_time", "sysdate");
        params.put("hq_chan_code", hq_chan_code);
        params.put("hq_chan_name", "'"+hq_chan_name+"'");
        params.put("start_month", start_month);
        params.put("end_month", end_month);
        params.put("assess_target", "'"+assess_target+"'");
        params.put("rate_three", "'"+rate_three+"'");
        params.put("rate_six", "'"+rate_six+"'");
        params.put("rate_nine", "'"+rate_nine+"'");
        params.put("rate_twelve", "'"+rate_twelve+"'");
        params.put("id", id);
        params.put("ysdz_xs", ysdz_xs);
        params.put("zx_bt", zx_bt);
        params.put("hz_ms", hz_ms);
        params.put("fw_fee", fw_fee);
        params.put("hz_year", String.valueOf(hz_year));
        String resultMsg="";
        try {
            service.updateChannel(params);
        } catch (Exception e) {
            e.printStackTrace();
            resultMsg="修改失败！";
        }
        this.reponseJson(resultMsg);
	}
	
	/**
	 * 提交审批 
	 */
	public void doSubmitTask() {
		ResultInfo info = new ResultInfo();
		try {
			String theme = request.getParameter("theme");
			String nextDealer = request.getParameter("nextDealer");
			if(StringUtils.isBlank(theme)) {
				throw new BusiException("工单主题不能为空！");
			}
			if(StringUtils.isBlank(nextDealer)) {
				throw new BusiException("请选择下一步审批人！");
			}
			Map<String, String> map = new HashMap<String, String>();
			map.put("title", theme);
			map.put("nextDealer", nextDealer);
			map.put("isHavingFile", isHavingFile);
			service.doSendOrder(map);
			info.setCode(ResultInfo._CODE_OK_);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg("工单提交审批失败！");
		}
		this.reponseJson(info);
	}
	
	//通过工单编号查询列表,用于非发起工单界面
	public void listByWorkNo() {
		try {
			String businessKey = request.getParameter("businessKey");
			if(businessKey == null || "".equals(businessKey)) {
				throw new BusiException("工单编号不空，查询数据失败！");
			}
			
			resultMap.put("businessKey", businessKey);
			Object result = service.listByWorkNo(resultMap);
			this.reponseJson(result);
		} catch(BusiException e) {
			logger.error(e.getMessage(), e);
			outJsonPlainString(response,"{\"msg\":\""+e.getMessage()+"\"}");
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("查询数据失败！",e);
			outJsonPlainString(response,"{\"msg\":\"查询数据失败！\"}");
		}
	}
	
	public void queryFiles(){
		String businessKey=request.getParameter("businessKey");
		List<Map<String,Object>> fileInformation = service.queryFiles(businessKey);
		this.reponseJson(fileInformation);
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
	        conn.close();
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
	            resMsg+="<br>以下渠道编码正在审批或已通过审批，不能重复导入：";
	            do{  
	                resMsg+="<br>"+rs.getString("HQ_CHAN_CODE");
	            } while(rs.next());
	        }
	        conn.close();
	        return resMsg;
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
		
	public void downloadExcelTemp() {
		String path = "/portal/channelManagement/down/import_channel.xls";
		String fileName = "import_channel.xls";
		try {
			this.download(path, fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void downloadFile() {
		String filePath = request.getParameter("filePath");
		String fileName = request.getParameter("fileName");
		try {
			filePath=URLDecoder.decode(filePath, "UTF-8"); 
			fileName=URLDecoder.decode(fileName, "UTF-8"); 
			this.download(filePath, fileName);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void download(String filePath, String fileName) throws IOException{
		HttpServletResponse response = ServletActionContext.getResponse();
		OutputStream outStream = null;
		InputStream inStream = null;
    	try {
    		filePath = URLDecoder.decode(filePath, "UTF-8");
    		fileName = URLDecoder.decode(fileName, "UTF-8");
	    	response.setContentType("application/x-msdownload"); 
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\""); 
	    	File ff = null; 
		    String dd = ServletActionContext.getServletContext().getRealPath(filePath); 
	    	ff=new File(dd);
	    	if (ff.exists()) { 
			    long filelength = ff.length(); 
			    inStream=new FileInputStream(dd);
			    outStream = response.getOutputStream();
			    //设置输出的格式 
			    response.reset(); 
			    response.setContentType("application/x-msdownload"); 
			    response.setContentLength((int)filelength); 
			    response.addHeader("Content-Disposition","attachment; filename=\"" + (new String(fileName.getBytes("gb2312"),"iso8859-1")) + "\""); 
			    //循环取出流中的数据 
			    byte []buffers=new byte[1024];  
				int len=0;  
				while((len=inStream.read(buffers))!=-1){  
					outStream.write(buffers,0,len);  
				} 
		    } 
	    }catch (UnsupportedEncodingException e) {
	    	logger.error(e.getMessage(),e);
		}catch(Exception e){ 
			logger.error(e.getMessage(),e);
	    } finally{
    		try {
    			if(inStream != null) {
    				inStream.close();
    			}
				if(outStream != null) {
					outStream.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			} 
		}
    }
	
	public Map<String, String> getResultMap() {
        return resultMap;
    }

    public void setResultMap(Map<String, String> resultMap) {
        this.resultMap = resultMap;
    }
    
    public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	public String getIsHavingFile() {
		return isHavingFile;
	}

	public void setIsHavingFile(String isHavingFile) {
		this.isHavingFile = isHavingFile;
	}
	
	public int getYear(String obj){
	    String year=obj.substring(0,4);
	    return Integer.parseInt(year);
	}

}

