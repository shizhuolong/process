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
@Namespace("/ironAbility")
@Scope("prototype")
@Results({
	@Result(name="success", location="/report/devIncome/jsp/iron_ability_mon.jsp"),
	@Result(name="error", location="/report/devIncome/jsp/import_iron_ability_mon.jsp")
})
public class IronAbilityAction extends BaseAction {
	private File uploadFile;
	private String time;

	@Resource
	DataSource dataSource;

	public void importToResult() throws SQLException {
		    User user = UserHolder.getCurrentLoginUser();
		    Org org=user.getOrg();
		    String regionCode=org.getRegionCode();
			String delRepeat = "DELETE PMRT.TAB_MRT_IRON_ABILITY_MON WHERE DEAL_DATE='"+ time+ "' AND GROUP_ID_1='"+ regionCode+"'";
			SpringManager.getUpdateDao().update(delRepeat);
			String importToResult = "INSERT INTO PMRT.TAB_MRT_IRON_ABILITY_MON SELECT * FROM PMRT.TAB_MRT_IRON_ABILITY_MON_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+ regionCode+"'";
			SpringManager.getUpdateDao().update(importToResult);
			Connection conn =null;
			CallableStatement stmt=null;
			//调用存储过程
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{CALL PMRT.PRC_MRT_IRON_UNIT_REFRESH(?,?)}");
			stmt.setString(1,time);
			stmt.registerOutParameter(2,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			conn.close();
			stmt.close();
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_MRT_IRON_ABILITY_MON_TEMP";
		String field="CREATE_TIME,GROUP_ID_1,USERNAME,IRON_TYPE,DEAL_DATE,BUSI_CONF_CODE,CARRIEROPERATOR,GROUP_ID_1_NAME,UNIT_NAME,P_ADDR_CODE,ACC_CITY,ADDR_REGION,IRON_ADDR_NAME,IRON_ADDR_CODE,CONF_CODE,BUSI_TYPE,SVR_BEGIN_TIME,BUSI_SCENE,WIND_PRESS,PRODUCT_TYPE,ROOM_TYPE,ELECT_Y_FEE,OIL_ELECT_TYPE,OIL_ELECT_Y_FEE,TEN_PER_FEE,CELL_FEE,PRODUCT_UNIT_NUM1,FACT_HIGH,RRU_BBU1,OTHER_SHARE1,IRON_STAND_FEE1,PRODUCT_UNIT_NUM2,HIGHS,RRU_BBU2,OTHER_SHARE2,IRON_STAND_FEE2,PRODUCT_UNIT_NUM3,FACT_HIGH3,RRU_BBU3,OTHER_SHARE3,IRON_STAND_FEE3,IRON_END_NUMS,IRON_BEGIN_DATE1,IRON_SHARE_RATIO1,IRON_BEGIN_DATE2,IRON_SHARE_RATIO2,IRON_STAND_FEE123,ROOM_STAND_FEE1,ROOM_STAND_FEE2,ROOM_STAND_FEE3,ROOM_END_NUMS,ROOM_BEGIN_DATE1,ROOM_SHARE_RATIO1,ROOM_BEGIN_DATE2,ROOM_SHARE_RATIO2,ROOM_STAND_FEE123,STAND_PRICE1,STAND_PRICE2,STAND_PRICE3,IRON_STORE_NUM,SHARE_BEGIN_DATE1,SHARE_BEGIN_RATIO1,SHARE_BEGIN_DATE2,SHARE_BEGIN_RATIO2,PT_STAND_FEE123,BBU_FEE,SVR_FEE1,SVR_FEE2,SVR_FEE3,WH_SHARE_NUMS,WH_SHERE_BEGIN_DATE1,WH_SHERE_BEGIN_RATIO1,WH_SHERE_BEGIN_DATE2,WH_SHERE_BEGIN_RATIO2,WH_RATIO_MONEY123,PLACE_FEE,PLACE_SHARE_NUM,PLACE_BEGIN_DATE1,PLACE_BEGIN_RATIO1,PLACE_BEGIN_DATE2,PLACE_BEGIN_RATIO2,PLACE_RATIO_MONEY,ELECT_IN_FEE,ELECT_IN_NUM,ELECT_IN_DATE1,ELECT_IN_RATIO1,ELECT_IN_DATE2,ELECT_IN_RATIO2,ELECT_IN_RATIO_MONEY,WLAN_FEE,WBO_FEE,OTHER_FEE1,PRODUCT_FEE_SUM,PRODUCT_FEE_MON_SUM,CONF_STATE,CHANGE_FEE,FEE_ITEM_CHANGE_ZF,FEE_ITEM_CHANGE,FEE_ITEM_CHANGE_RESON,FEE_ITEM_ZY_MONEY";
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
					int start = sheet.getFirstRowNum() +1 ;// 去前1行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values(sysdate,'"+regionCode+"','"+username+"'";
					for(int i=0;i<97;i++){
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
							   if(i==1){
								   pre.setString(i+1,time);
							   }else{
								   pre.setString(i+1,getCellValue(row.getCell(i)));
							   }
						}
						pre.addBatch();
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
		File f=new File(this.request.getRealPath("/report/devIncome/down/import_iron_ability_mon.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_iron_ability_mon.xls");
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
