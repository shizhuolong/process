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
@Namespace("/maintain")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_maintain_station_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_maintain_station.jsp")
	
})
public class MainTainStationAction extends BaseAction {
	private File uploadFile;
	private String time;

	@Resource
	DataSource dataSource;

	public void importToResult() throws SQLException {
		    User user = UserHolder.getCurrentLoginUser();
		    Org org=user.getOrg();
		    String regionCode=org.getRegionCode();
			String delRepeat = "DELETE PODS.TAB_ODS_LAN_DW_STAND_MON WHERE DEAL_DATE='"+ time+ "' AND GROUP_ID_1='"+ regionCode+"'";
			SpringManager.getUpdateDao().update(delRepeat);
			String importToResult = "INSERT INTO PODS.TAB_ODS_LAN_DW_STAND_MON SELECT * FROM PODS.TAB_ODS_LAN_DW_STAND_MON_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+ regionCode+"'";
			SpringManager.getUpdateDao().update(importToResult);
			/*Connection conn =null;
			CallableStatement stmt=null;
			//调用存储过程
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{CALL PMRT.PRC_MRT_IRON_UNIT_REFRESH(?,?)}");
			stmt.setString(1,time);
			stmt.registerOutParameter(2,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			conn.close();
			stmt.close();*/
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PODS.TAB_ODS_LAN_DW_STAND_MON_TEMP";
		String field="INSERT_TIME,DEAL_DATE,GROUP_ID_1,UNIT_ID,OPERATE_NAME,GROUP_ID_1_NAME,UNIT_NAME,CC_CODE,ZHZ_NAME,DEP_TERR_CODE,SERVICE_NAME,ITEM_NAME,VOC_NAME,PALCE,REAL_DW_NUM,NOT_TAX_PRICE,DW_JT_NUM,MODIFY_SUM,CHECK_BEFORE_SUM";
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
				String delSql = "DELETE FROM " + resultTableName
						+ " WHERE DEAL_DATE='" + time+"' AND GROUP_ID_1='"+regionCode+"'";
				
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);  
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum()+1 ;// 去前1行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values(sysdate,'"+time+"','"+regionCode+"','','"+username+"'";
					for(int i=0;i<14;i++){
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
						    pre.setString(i+1,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					String sql1="UPDATE PODS.TAB_ODS_LAN_DW_STAND_MON_TEMP T SET T.UNIT_ID=(SELECT UNIT_ID FROM PCDE.TAB_CDE_GROUP_CODE WHERE UNIT_NAME=TRIM(T.UNIT_NAME))"+
                        "WHERE T.DEAL_DATE="+time+" AND UNIT_ID IS NULL";
					PreparedStatement ps = conn.prepareStatement(sql1);
					ps.executeUpdate();
					String sql2 ="select UNIT_NAME untiName from PODS.TAB_ODS_LAN_DW_STAND_MON_TEMP where UNIT_ID is null and DEAL_DATE='"+time+"' AND GROUP_ID_1="+regionCode;
					Statement st=conn.createStatement();
					ResultSet rs = st.executeQuery(sql2);
					if(rs.next()){
					    while(rs.next()){
					       err.add("营服名称错误:"+rs.getString("untiName")+"！ ");
					    }
//					    return "error";
					}
					else{importToResult();}
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
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_maintain_station.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_maintain_station.xls");
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
