package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.CallableStatement;
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
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/tencentDay")
@Scope("prototype")
@Results({
	@Result(name="success", location="/report/devIncome/jsp/import_tencent_day.jsp"),
	@Result(name="error", location="/report/devIncome/jsp/import_tencent_day.jsp")
})
public class ImportTencentAction extends BaseAction {
	private File uploadFile;
	private String time;

	@Resource
	DataSource dataSource;

	public int importToResult() throws SQLException {
			Connection conn =null;
			CallableStatement stmt=null;
			//调用存储过程
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{CALL PODS.PRC_ODS_AUG_TENCENT_DAY(?,?)}");
			stmt.setString(1,time);
			stmt.registerOutParameter(2,java.sql.Types.DECIMAL);
			int r=stmt.executeUpdate();
			conn.close();
			stmt.close();
			return r;
	}
	
	@SuppressWarnings({ "unused", "resource", "unchecked" })
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PODS.TAB_ODS_TENCENT_DAY_TEMP";
		String field="INSERT_TIME,DEAL_DATE,USER_NAME,PROVINCE,AREA_NAME,ORDER_ID,ICCID,ORDER_DATE,DEVICE_NUMBER,CUST_NAME,CERT_NUMBER,POST_ADDR,ORDER_CODE,SEX,AGE,ORDER_STATUS,PRODUCT_NAME,ORDER_NAME,CHANNEL_DATE,FILE_DURATION,CHARGEBACK_DATE,CHARGEBACK_REASON,USER_START,ACTIVE_STATUS,ACTIVE_DATE,CHANNEL_NAME,CHANNEL_ID,CHANNEL_AREA,OPEN_NAME,OPEN_DEVICE_NUMBER,OPEN_DEV_CODE,OPEN_CHANNEL_ID,OPEN_CHANNEL_NAME,ACTIVE_NAME,ACTIVE_DEVICE_NUMBER,ACTIVE_DEV_CODE,PAY_MODEL,IS_OVERTIME,REFEREE";
		SimpleDateFormat s=new SimpleDateFormat("yyyymmdd");
		time=s.format(new Date());
		long totalTime=0;
		int count=0;
		if (uploadFile == null) {
			err.add("上传文件为空！");
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
				String delSql = "DELETE FROM " + resultTableName;
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);  
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +1 ;// 去前1行标题
					int end = sheet.getLastRowNum();
					count=end;
					Row row=null;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values(sysdate,'"+time+"','"+username+"'";
					for(int i=0;i<36;i++){
						sql+=",?";
					}
					sql+=")";
					pre=conn.prepareStatement(sql);
					int preCount=500;//每500条执行插入
					int maxCount=end/preCount;//最大执行次数，每500条执行一次
					int cend = sheet.getRow(0).getLastCellNum();
					long startTime=System.currentTimeMillis();
					Cell c=null;
					for (int y = start; y <= end; y++) {
						System.out.println((y+1)+"条");
						row = sheet.getRow(y);
						if (row == null)
							continue;
						for (int i = 0; i < cend; i++) {
							 if(i==2||i==3||i==5||i==7||i==26||i==27||i==28||i==31||i==32||i==35){
							       c=row.getCell(i);	
								   if(getCellValue(c).contains("E")){
							    		err.add("模板不是文本格式，请将第"+(i+1)+"列转换为文本格式再导入,具体转换方法请看问题解决文档！");
							    		Struts2Utils.getRequest().setAttribute("err", err);
										return "error";
							    	}
							 }
						   pre.setString(i+1,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
                        if(y%preCount==0){
                        	pre.executeBatch();
                        	conn.commit();
						}
					}
					pre.executeBatch();//余数部分提交，至此所有数据插入完毕
					conn.commit();
					conn.setAutoCommit(true);
					long endTime=System.currentTimeMillis();
					totalTime=(endTime-startTime)/1000;
				    System.out.println(totalTime+"秒");
					String checkRepeat="SELECT ORDER_ID FROM PODS.TAB_ODS_TENCENT_DAY_TEMP GROUP BY ORDER_ID HAVING COUNT(*) > 1";
					
					List<Map<String,String>> l=SpringManager.getFindDao().find(checkRepeat);
					String msg="订单编号：";
					if(l!=null&&l.size()>0){
						for(int i=0;i<l.size();i++){
							if(i==0){
								msg+=l.get(i).get("ORDER_ID");
							}else{
								msg+="、"+l.get(i).get("ORDER_ID");
							}
						}
						msg+="在excel中重复，请检查！";
						err.add(msg);
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
					
					int r=importToResult();
					if(r!=1){
						err.add("程序存过PODS.PRC_ODS_AUG_TENCENT_DAY执行异常！");
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				if(e.getMessage().equals("无效的列索引")){
					err.add("请检查模板表头总列数是否与界面提供的模板一致！");
				}
				err.add(e.getMessage());
				try {
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}finally{
				try {
					    if(conn!=null)
					    conn.close();
					    if(wb!=null)
					    wb.close();
					    if(in!=null)
						in.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		if(err.size()>0){
		   Struts2Utils.getRequest().setAttribute("err", err);
		   return "error";
		}
		Struts2Utils.getRequest().setAttribute("success", "成功导入"+count+"条数据，用时"+totalTime+"秒！");
		return "success";
	}

	@SuppressWarnings("deprecation")
	public void downfile() {
		File f=new File(this.request.getRealPath("/report/devIncome/down/import_tencent_day.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_tencent_day.xls");
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
	
}
