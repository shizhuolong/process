package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/base")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_base_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_base.jsp")
})
public class ImportBaseAction extends BaseAction {
	private File uploadFile;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Resource
	DataSource dataSource;

	public void importToResult() throws SQLException {
		    User user = UserHolder.getCurrentLoginUser();
		    Org org=user.getOrg();
		    String regionCode=org.getRegionCode();
		    String businessKey=request.getParameter("businessKey");
		    String delRepeatSql="";
		    String uSql="";
		    if(businessKey==null||businessKey.equals("")){//未发送的工单重导
		    	SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHssSSS");
				businessKey = "YN-"+format.format(new Date()); //订单编号
		    	delRepeatSql = "DELETE AGENTS.TAB_MRT_YYT_ZD_BASE WHERE GROUP_ID_1='"+ regionCode+"' AND STATUS='0'";
		    }else{//退回来的工单重导，保留工单编号
		    	delRepeatSql = "DELETE AGENTS.TAB_MRT_YYT_ZD_BASE WHERE GROUP_ID_1='"+ regionCode+"' AND WORK_FLOW_CODE='"+businessKey+"' AND STATUS IN('0','3')";
		    }
		    uSql="UPDATE AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP SET WORK_FLOW_CODE='"+businessKey+"' WHERE GROUP_ID_1='"+ regionCode+"' AND STATUS='0'";
			SpringManager.getUpdateDao().update(uSql);
			SpringManager.getUpdateDao().update(delRepeatSql);
			String importToResult = "INSERT INTO AGENTS.TAB_MRT_YYT_ZD_BASE SELECT * FROM AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP WHERE GROUP_ID_1='"+ regionCode+"' AND STATUS='0'";
			SpringManager.getUpdateDao().update(importToResult);
			/*Connection conn =null;
			CallableStatement stmt=null;
			//调用存储过程
			conn = dataSource.getConnection();
			Date date=new Date();
			SimpleDateFormat ss=new SimpleDateFormat("yyyymm");
			String mon=ss.format(date);
			stmt = conn.prepareCall("{CALL PMRT.PRC_MRT_YYT_ZD(?,?,?)}");
			stmt.setString(1,org.getRegionCode());
			stmt.setString(2,mon);
			stmt.registerOutParameter(3,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			conn.close();
			stmt.close();*/
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		String regionName=org.getRegionName();
		String username=user.getUsername();
		String realname=user.getRealName();
		List<String> err = new ArrayList<String>();
		String resultTableName = "AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP";
		String field="IS_BACK,STATUS,CREATE_TIME,GROUP_ID_1,GROUP_ID_1_NAME,USER_NAME,REALNAME,ZD_BRAND,ZD_TYPES,ZD_MEMORY,ZD_COLOR,ZD_IEMI,YYT_HQ_NAME,YYT_CHAN_CODE,SUP_HQ_NAME,SUP_HQ_CODE,IN_PRICE,OUT_PRICE";
		if (uploadFile == null) {
			err.add("上传文件为空！");
			Struts2Utils.getRequest().setAttribute("err", err);
			return "error";
		} else {
			FileInputStream in =null;
		    Workbook wb = null;
			Connection conn = null;
			PreparedStatement pre = null;
			try {
				conn = this.getCon();
				conn.setAutoCommit(false);
				//Sheet hssfSheet = wb.getSheetAt(0);  //示意访问sheet  
				// 上传时覆盖
				String delSql = "DELETE FROM " + resultTableName
						+ " WHERE GROUP_ID_1='"+regionCode+"'";
				
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);  
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				logger.info("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					logger.info("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +1 ;// 去前1行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values('0','0',sysdate"+",'"+regionCode+"','"+regionName+"','"+username+"','"+realname+"'";
					for(int i=0;i<11;i++){
						sql+=",?";
					}
					sql+=")";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();//排除第一列
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						for (int i = cstart; i < cend; i++) {
							    if(i==4){
							    	if(getCellValue(row.getCell(i)).contains("E14")){
							    		err.add("模板不是文本格式，请将数字列转换为文本格式再导入！");
							    		Struts2Utils.getRequest().setAttribute("err", err);
										return "error";
							    	}
							    }
							    if(i>8){
							    	if(getCellValue(row.getCell(i)).equals("")){
							    		err.add("进货价与零售价不能为空，请检查！");
							    		Struts2Utils.getRequest().setAttribute("err", err);
										return "error";
							    	}
							    	if(getCellValue(row.getCell(i)).contains(".0")){
							    		err.add("模板不是文本格式，请将数字列转换为文本格式再导入！");
							    		Struts2Utils.getRequest().setAttribute("err", err);
										return "error";
							    	}
							    	if(Integer.parseInt(getCellValue(row.getCell(10)))<Integer.parseInt(getCellValue(row.getCell(9)))){
							    		err.add("零售价不能低于进货价，请检查！");
							    		Struts2Utils.getRequest().setAttribute("err", err);
										return "error";
							    	}
							    }
								pre.setString(i+1,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					String isNullSql="SELECT ZD_BRAND,                                                      "+
							"       ZD_TYPES,                                                      "+
							"       ZD_COLOR,                                                      "+
							"       ZD_IEMI,                                                       "+
							"       YYT_HQ_NAME,                                                   "+
							"       YYT_CHAN_CODE,                                                 "+
							"       SUP_HQ_NAME,                                                   "+
							"       SUP_HQ_CODE,                                                   "+
							"       IN_PRICE,                                                      "+
							"       OUT_PRICE                                                      "+
							"  FROM AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP                                  "+
							" WHERE GROUP_ID_1='"+regionCode+"' AND (ZD_BRAND IS NULL OR ZD_TYPES IS NULL OR ZD_COLOR IS NULL OR   "+
							"       ZD_IEMI IS NULL OR YYT_HQ_NAME IS NULL OR YYT_CHAN_CODE IS NULL"+
							"       OR SUP_HQ_NAME IS NULL OR SUP_HQ_CODE IS NULL                  "+
							"       OR IN_PRICE IS NULL OR OUT_PRICE IS NULL                       "+
							"     )                                                                ";
					List<Map<String,String>> l=SpringManager.getFindDao().find(isNullSql);
					if(l!=null&&l.size()>0){
						err.add("模板中有空的字段，请检查！");
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
					
					String isRepeatTemp="SELECT ZD_IEMI FROM(SELECT ZD_IEMI,count(*) c FROM AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP WHERE GROUP_ID_1='"+regionCode+"' GROUP BY ZD_IEMI) WHERE c>1";
					l=SpringManager.getFindDao().find(isRepeatTemp);
					if(l!=null&&l.size()>0){
						err.add("终端串号："+l.get(0).get("ZD_IEMI")+"在模板中重复，请检查！");
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
					String checkYytCode="SELECT YYT_CHAN_CODE                            "+
							"    FROM AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP                      "+
							"   WHERE GROUP_ID_1 = '"+regionCode+"'                      "+
							"     AND YYT_CHAN_CODE NOT IN (SELECT hq_chan_code          "+
							"                             FROM AGENTS.TB_CDE_OPERATE_TYPE_VIEW T"+
							"                            WHERE T.DEAL_DATE = TO_CHAR(ADD_MONTHS(SYSDATE,-1), 'yyyymm')"+
							"                            AND T.OPERATE_TYPE='自营')    ";
					l=SpringManager.getFindDao().find(checkYytCode);
					if(l!=null&&l.size()>0){
						err.add("营业厅编码："+l.get(0).get("YYT_CHAN_CODE")+"不存在于库中,请检查！");
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
					String checkSupCode="SELECT SUP_HQ_CODE FROM AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP WHERE GROUP_ID_1 = '"+regionCode+"' AND SUP_HQ_CODE NOT IN(select HQ_CHAN_CODE FROM AGENTS.TAB_CDE_CHANL_HQ_CODE_VIEW)";
					l=SpringManager.getFindDao().find(checkSupCode);
					if(l!=null&&l.size()>0){
     					err.add("供应商编码："+l.get(0).get("SUP_HQ_CODE")+"不存在于库中,请检查！");
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
					String isRepeatSql="SELECT ZD_IEMI FROM AGENTS.TAB_MRT_YYT_ZD_BASE_TEMP WHERE GROUP_ID_1='"+regionCode+"' AND ZD_IEMI IN(SELECT ZD_IEMI FROM AGENTS.TAB_MRT_YYT_ZD_BASE WHERE (STATUS = 2 OR STATUS=1) AND IS_BACK<>2)";
					l=SpringManager.getFindDao().find(isRepeatSql);
					String repeatMsg="";
					if(l!=null&&l.size()>0){
						for(int i=0;i<l.size();i++){
							if(i==0){
								repeatMsg+=l.get(i).get("ZD_IEMI");
							}else{
								repeatMsg+=","+l.get(i).get("ZD_IEMI");
							}
						}
						err.add("终端串码为："+repeatMsg+"已存在于库中或正在审批中，请检查！");
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
					importToResult();
				}
			} catch (Exception e) {
				logger.info(e.getMessage());
				e.printStackTrace();
				err.add(e.getMessage());
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
		if(err.size()>0){
		   Struts2Utils.getRequest().setAttribute("err", err);
		   return "error";
		}
		return "success";
	}

	public void downfile() {
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_base.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_base.xls");
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
		return value.replaceAll("\\s*", "");
	}
	
}
