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
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/importComm")
@Scope("prototype")
@Results({
	@Result(name="error", location="/portal/channelManagement/jsp/import_comm.jsp"),
	@Result(name="success", location="/portal/channelManagement/jsp/import_comm.jsp")
})
public class ImportCommAction extends BaseAction {
	private File uploadFile;
	private String time;
	private String table;
    private String field;
    private String headRows;
    private String fileName;
	@Resource
	DataSource dataSource;
	
	public String importToResult() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		String orgLevel=org.getOrgLevel();
		String username=user.getUsername();
		List<String> msg = new ArrayList<String>();
		int total=0;
		if (uploadFile == null) {
			msg.add("上传文件为空！");
		} else {
			FileInputStream in =null;
		    Workbook wb = null;
			Connection conn = null;
			PreparedStatement pre = null;
			try {
				conn = this.getCon();
				conn.setAutoCommit(false);
				String delSql="";
				// 上传时覆盖
				if(orgLevel.equals("1")){
					if(time!=null&&!time.equals("")){
						delSql = "DELETE FROM " + table
								+ " WHERE DEAL_DATE='" + time+"'";
					}else{
						delSql = "DELETE FROM " + table;
					}
				}else{
					if(time!=null&&!time.equals("")){
						delSql = "DELETE FROM " + table
								+ " WHERE DEAL_DATE='" + time+"' AND GROUP_ID_1='"+regionCode+"'";
					}else{
						delSql = "DELETE FROM " + table
								+ " WHERE GROUP_ID_1='"+regionCode+"'";
					}
				}
				
				String[] fields=field.split(",");
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);  
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +Integer.parseInt(headRows);// 去前几行标题
					int end = sheet.getLastRowNum();
					total=end;
					Row row;
					String sql = "INSERT INTO "+ table+"("+field+") values(";
					for(int i=0;i<fields.length;i++){
						if(i==0){
							sql+="?";
						}else{
							sql+=",?";
						}
					}
					sql+=")";
					pre=conn.prepareStatement(sql);
					int index=0;
					int count=0;
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();
						int cend = row.getLastCellNum();
						int fixFieldCount=0;
						for (int i = cstart; i < fields.length; i++) {
							   if(fields[i].equals("DEAL_DATE")){
								   pre.setString(i+1,time);
								   fixFieldCount++;
							   }else if(fields[i].equals("GROUP_ID_1")){
								   pre.setString(i+1,regionCode);
								   fixFieldCount++;
							   }else if(fields[i].equals("USERNAME")){
								   pre.setString(i+1,username);
								   fixFieldCount++;
							   }else if(fields[i].equals("CREATE_TIME")){
								   pre.setString(i+1,"sysdate");
								   fixFieldCount++;
							   }else{
								   pre.setString(i+1,getCellValue(row.getCell(i-fixFieldCount)));
							   }
						}
						pre.addBatch();
						index++;
						int max=end/1000;
						if(index%1000==0){
							pre.executeBatch();
							conn.commit();
							pre.clearBatch();
							index=0;
							count++;
						}
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					pre.clearBatch();
				}
			} catch (Exception e) {
				e.printStackTrace();
				msg.add(e.getMessage());
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
		if(msg.size()>0){
		   Struts2Utils.getRequest().setAttribute("msg", msg);
		   return "error";
		}
		msg.add("成功导入"+total+"条！");
		Struts2Utils.getRequest().setAttribute("msg", msg);
		return "success";
	}

	public void downfile() {
		File f=new File(this.request.getRealPath("/importUpload/"+fileName));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename="+fileName);
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

	public String getTable() {
		return table;
	}

	public void setTable(String table) {
		this.table = table;
	}

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getHeadRows() {
		return headRows;
	}

	public void setHeadRows(String headRows) {
		this.headRows = headRows;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
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
