package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/mainIncome")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_main_income_list.jsp"),
	@Result(name="see", location="/portal/channelManagement/jsp/import_main_income_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_main_income.jsp"),
	@Result(name="index", location="/portal/channelManagement/jsp/income_mon_list.jsp")
})
public class ImportMainIncomeAction extends BaseAction {
	private File uploadFile;

	@Resource
	DataSource dataSource;
	public String dealDate;

	public String inStorage(){
		String delSql = "DELETE FROM PMRT.TAB_MRT_MAIN_INCOME_MON"+
				 " WHERE DEAL_DATE='"+dealDate+"'";
		SpringManager.getUpdateDao().update(delSql);
		String sql="INSERT INTO PMRT.TAB_MRT_MAIN_INCOME_MON SELECT * FROM PMRT.TAB_MRT_MAIN_INCOME_MON_TEMP WHERE DEAL_DATE='"+dealDate+"'";
		SpringManager.getUpdateDao().update(sql);
		return "index";
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_MRT_MAIN_INCOME_MON_TEMP";
		String field="IS_CONFIRM,INSERT_TIME,DEAL_DATE,LOGIN_NAME,GROUP_ID_1,GROUP_ID_1_NAME,ALL_INCOME_NUM,MOB_INCOME_NUM,INCOME_4G_NUM,INCOME_3G_NUM,INCOME_2G_NUM,INCOME_NET_NUM,NOT_ICT_NUM,INCOME_ICT_NUM,INCOME_IDT_NUM,HX_FLOW,HAND_3G,KM_ELE_FOMER,KM_ELE_APPOR,OTHER_AREA_ELE";
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
						+ " WHERE DEAL_DATE='"+dealDate+"'";
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);
				int sheetNum = wb.getNumberOfSheets();
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum()+3;
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+resultTableName+"("+field+") values('0',sysdate,'"+dealDate+"','"+username+"',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						for (int i = cstart; i < cend; i++) {
							pre.setString(i+1,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();//手动提交
					//String result=importToResult(dealDate,regionCode,username);
				}
			} catch (Exception e) {
				e.printStackTrace();
				try {
					conn.rollback();
				} catch (Exception e1) {
					e1.printStackTrace();
				}
				err.add(e.getMessage());
			}finally{
				try {
					if(conn!=null){
						conn.setAutoCommit(true);
						conn.close();
					}
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
		Struts2Utils.getRequest().setAttribute("dealDate", dealDate);
		return "success";
	}
    
	public void confirm(){
		try {
			String usql="UPDATE PMRT.TAB_MRT_MAIN_INCOME_MON SET IS_CONFIRM=1 WHERE DEAL_DATE='"+dealDate+"'";
			SpringManager.getUpdateDao().update(usql);
			this.reponseJson("确认成功！");
		} catch (Exception e) {
			e.printStackTrace();
			this.reponseJson("出现异常，确认失败！");
		}
	}
	
	public void downfile() {
		File f=new File(ServletActionContext.getServletContext().getRealPath("/portal/channelManagement/down/import_main_income.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_main_income.xls");
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
	
	public String getDealDate() {
		return dealDate;
	}

	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
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
		return value.trim();
	}
	
}
