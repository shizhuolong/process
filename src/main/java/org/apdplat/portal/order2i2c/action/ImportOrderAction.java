package org.apdplat.portal.order2i2c.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/order")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/order2i2c/jsp/import_order_list.jsp"),
	@Result(name="error", location="/portal/order2i2c/jsp/import_order.jsp")
})
public class ImportOrderAction extends BaseAction {
	private File uploadFile;

	@Resource
	DataSource dataSource;

	public String importToResult(String txdate,String group_id_1,String login_name) {
		Connection conn =null;
		CallableStatement stmt=null;
		String result1="0";
		String result2="0";
		//调用存储过程
		try {
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{CALL PODS.PRC_ODS_2I2C_LEAD_DAY(?,?,?,?,?)}");
			stmt.setString(1,txdate);
			stmt.setString(2,group_id_1);
			stmt.setString(3,login_name);
			stmt.registerOutParameter(4,java.sql.Types.VARCHAR);
			stmt.registerOutParameter(5,java.sql.Types.VARCHAR);
			stmt.executeUpdate();
			result1=stmt.getString(4);
			if(result1.equals("0")){
				return result1;
			}
			result2=stmt.getString(5);
			return result2;
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				if(conn!=null)
				   conn.close();
				if(stmt!=null)
					stmt.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result2;
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String username=user.getUsername();
		String regionCode=org.getRegionCode();
		String regionName=org.getRegionName();
		List<String> err = new ArrayList<String>();
		Date d = new Date();  
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");  
	    String dealDate = sdf.format(d);  
		String resultTableName = "PODS.TAB_ODS_2I2C_LEAD_DAY_TEMP";
		String field="INSERT_TIME,GROUP_ID_0,GROUP_ID_0_NAME,GROUP_ID_1,GROUP_ID_1_NAME,LOGIN_NAME,TEMP_NUM,ORDER_NO,ORDER_TIME,CITY_NAME,SHOOP_OFF,SHOOP_RECE,ORDER_STATUS,CUST_NAME,CARD_ID,BOOK_NUM,SEX,AGE,PRODUCT_NAME,SHOOP_NAME,SERVICE_NUMBER,ADDR_NAME,LOG_TRACK,ACTIVE_STATUS,ACTIVE_WAIT,ACTIVE_TIME,REMARK_NAME,REFUND_TIME,SEND_TIME,SIGN_TIME,LOG_COMP,ORDER_NUM,REFUND_WHY,NOTE_DETAIL,AUDIT_CODE,SEND_CODE,ACTIVE_CODE,REFER,ACTIVE_REFER";
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
				// 上传时覆盖
				String delSql = "DELETE FROM " + resultTableName
						+ " WHERE login_name='" + username+"'";
				
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);
				int sheetNum = wb.getNumberOfSheets();
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +1 ;
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+resultTableName+"("+field+") values(sysdate,'86000','云南','"+regionCode+"','"+regionName+"','"+username+"','',"+"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						if(cend!=32){
							err.add("列数量不对，请严格按照标准模板导入！");
							Struts2Utils.getRequest().setAttribute("err", err);
							return "error";
						}
						for (int i = cstart; i < cend; i++) {
							pre.setString(i+1,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					String result=importToResult(dealDate,regionCode,username);
					if(result.equals("0")){//存过执行成功
						
					}else{
						err.add(result);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				err.add(e.getMessage());
			}finally{
				try {
					if(conn!=null)
					conn.close();
					if(wb!=null)
					wb.close();
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
		File f=new File(ServletActionContext.getServletContext().getRealPath("/portal/order2i2c/down/import_order.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_order.xls");
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
		return value;
	}
	
}
