package org.apdplat.portal.order2i2c.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/order2i2c/jsp/import_low_balance_maintain_list.jsp"),
	@Result(name="error", location="/portal/order2i2c/jsp/import_low_balance_maintain.jsp")
})
public class LowBalanceMaintainAction extends BaseAction {
	private File uploadFile;
	private String time;
	
	/*public void importToResult() {
		String delRepeat = "DELETE PMRT.TAB_MRT_RENT_ALL_MON WHERE DEAL_DATE='"	+ time+ "' AND GROUP_ID_1='"+regionCode+"'";
		SpringManager.getUpdateDao().update(delRepeat);
		String importToResult = "INSERT INTO PMRT.TAB_MRT_RENT_ALL_MON SELECT * FROM PMRT.TAB_MRT_RENT_ALL_MON_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"'";
		SpringManager.getUpdateDao().update(importToResult);
		Connection conn =null;
		CallableStatement stmt=null;
		Connection conn1 =null;
		CallableStatement stmt1=null;
		//调用存储过程
		try {
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{call PMRT.PRC_MRT_IRON_IMPORT_GROUP(?,?,?,?)}");
			
			stmt.setString(1,time);
			stmt.setString(2,"TAB_MRT_RENT_ALL_MON_TEMP");
			stmt.setString(3,"TAB_MRT_RENT_ALL_MON");
			stmt.registerOutParameter(4,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			//调用存储过程
			conn1 = dataSource.getConnection();
			stmt1 = conn1.prepareCall("{call PMRT.PRC_MRT_IRON_UNIT_REFRESH(?,?)}");
			stmt1.setString(1,time);
			stmt1.registerOutParameter(2,java.sql.Types.DECIMAL);
			stmt1.executeUpdate();
			conn1.close();
			stmt1.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}*/
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Calendar ca=Calendar.getInstance();
	    String time=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_MRT_2I2C_VISIT_INPUT";
		String field="DEAL_DATE,INPUT_USER,DEVICE_NUMBER,SUBSCRIPTION_ID,BALANCE,UPDATE_TIME,INNET_TIME,PRO_NAME,COUNTY_ID,PRO_CODE,CITY_NAME,CONNECT_PHONE,SEND_TIME,CON_TYPE,TOTAL_FEE,JF_TIMES,TRIGGER_RESON,MESSAGE_CONTENT,START_TIME,END_TIME";
		if (uploadFile == null) {
			err.add("上传文件为空！");
		} else {
			String fileType=request.getParameter("fileType");
			FileInputStream in =null;
		    Workbook wb = null;
			Connection conn = null;
			PreparedStatement pre = null;
			try {
				conn = this.getCon();
				conn.setAutoCommit(false); 
				// 上传时覆盖
				
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);
				/*if(fileType.equals(".xlsx")){
					wb = new XSSFWorkbook(in);
				}else{
					wb = new HSSFWorkbook(in);
				}*/
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +1 ;// 去前4行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO PMRT.TAB_MRT_2I2C_VISIT_INPUT ("+field+") values("+time+",'"+username+"'";
					for(int i=0;i<18;i++){
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
							pre.setString(i+1,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
//					importToResult();
				}
			} catch (Exception e) {
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
		File f=new File(this.request.getRealPath("/portal/order2i2c/down/import_low_balance.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_low_balance.xls");
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
