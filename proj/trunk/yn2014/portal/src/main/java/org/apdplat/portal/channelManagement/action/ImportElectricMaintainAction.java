package org.apdplat.portal.channelManagement.action;

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
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/electricMaintain")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_electric1_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_electric1.jsp")
})
public class ImportElectricMaintainAction extends BaseAction {
	private File uploadFile;
	private String time;

	@Resource
	DataSource dataSource;

	public void importToResult() {
		/*String delRepeat = "DELETE PMRT.TAB_MRT_ELECTRIC_CHARGE_MON1 WHERE DEAL_DATE='"	+ time+ "'";
		SpringManager.getUpdateDao().update(delRepeat);
		String importToResult = "INSERT INTO PMRT.TAB_MRT_ELECTRIC_CHARGE_MON1 SELECT * FROM PMRT.TAB_ELECTRIC_CHARGE_MON1_TEMP WHERE DEAL_DATE='"+time+"'";
		SpringManager.getUpdateDao().update(importToResult);*/
		Connection conn =null;
		CallableStatement stmt=null;
		Connection conn1 =null;
		CallableStatement stmt1=null;
		//调用存储过程
		try {
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{call PMRT.PRC_MRT_IRON_IMPORT_GROUP(?,?,?,?)}");
			
			stmt.setString(1,time);
			stmt.setString(2,"TAB_ELECTRIC_CHARGE_MON1_TEMP");
			stmt.setString(3,"TAB_MRT_ELECTRIC_CHARGE_MON1");
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
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_ELECTRIC_CHARGE_MON1_TEMP";
		String field="DEAL_DATE,GROUP_ID_1,UNIT_ID,UNIT_NAME,USERNAME,ROOM_ADDR,ROOM_NAME,D_NUMBER,BEGIN_MONEY,THIS_MON_PRE,THIS_MON_PAY,END_YT_MONEY,GROUP_ID_1_NAME,AC_PREFIX,THIS_MON_YT,END_MON_DATE,ZZ_FAX,OIL_COMPANY,WATER_FEE,PER_WATER_FEE,THIS_NUM";
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
				String delSql = "DELETE FROM " + resultTableName
						+ " WHERE DEAL_DATE='" + time+"'";
				SpringManager.getUpdateDao().update(delSql);
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
					int start = sheet.getFirstRowNum() +3 ;// 去前3行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO PMRT.TAB_ELECTRIC_CHARGE_MON1_TEMP("+field+") values('"+time+"','','','','"+username+"',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum()+1;//排除第一列
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						for (int i = cstart; i < cend; i++) {
								pre.setString(i,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
						row=null;
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					importToResult();
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
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_electricMaintain.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_electricMaintain.xls");
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
