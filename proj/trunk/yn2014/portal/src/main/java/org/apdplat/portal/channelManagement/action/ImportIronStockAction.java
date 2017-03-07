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
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Controller
@Scope("prototype")
public class ImportIronStockAction extends BaseAction {

	private static final long serialVersionUID = 1L;
	private File uploadFile;
	private String time;
	private String hallType;

	@Resource
	DataSource dataSource;

	public void importToResult() {
		    User user = UserHolder.getCurrentLoginUser();
		    Org org=user.getOrg();
		    String regionCode=org.getRegionCode();
			String delRepeat = "DELETE PMRT.TAB_MRT_IRON_STOCK_MON WHERE DEAL_DATE='"+ time+ "' AND GROUP_ID_1='"+ regionCode+"' AND HALL_TYPE='"+hallType+"'";
			SpringManager.getUpdateDao().update(delRepeat);
			String importToResult = "INSERT INTO PMRT.TAB_MRT_IRON_STOCK_MON SELECT * FROM PMRT.TAB_MRT_IRON_STOCK_MON_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+ regionCode+"' AND HALL_TYPE='"+hallType+"'";
			SpringManager.getUpdateDao().update(importToResult);
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_MRT_IRON_STOCK_MON_TEMP";
		String field="CREATE_TIME,DEAL_DATE,GROUP_ID_1,UNIT_ID,HALL_TYPE,USERNAME,GROUP_ID_1_NAME,UNIT_NAME,P_ADDR_CODE,BUSI_CONF_CODE,IRON_ADDR_CODE,NEED_CONF_CODE,OWN_ADDR_NAME,DETAIL_ADDR,LONGITUDE,LATITUDE,IRON_TYPE,ROOM_CONF,SHARE_INFO,HIGHS,LINE_NUM,SYS_NUM,RRU_ISON,SHARE_CLI_NUM,STOCK_CLI_NUM,ZERO_SIX,SVR_LEVEL,CELL_LONG,OIL_ELECT_TYPE,ELECT_SVR_MODE,IS_ELECT_SVR,OIL_SVR_MODE,ELECT_FEE,OIL_SVR_FEE,TEN_PER_FEE,BBU_SVR_FEE,CELL_FEE,OTHER_FEE,OTHER_FEE_DEC,OIL_STAND_FEE,ROOM_STAND_FEE,SVR_FEE,PRODUCT_UNIT_NUM,ELECT_IN_FEE,PLACE_FEE,SVR_FEE_RATIO,PLACE_FEE_RATIO,ELECT_IN_RATIO,IRON_SHARE_RATIO,ROOM_FEE_RATIO,SVR_BEGIN_DATE,SVR_END_DATE,PRO_SVR_FEE_NO,PRO_SVR_FEE,SVR_SOURCE_VALUE,PLACE_SOURCE_VALUE,ELECT_IN_VALUE,OIL_SOURCE_VALUE,OTHER_SOURCE_VALUE,OIL_SHARE_QUO1,OIL_SHARE_DATE1,ROOM_SHARE_QUO1,ROOM_SHARE_DATE1,OIL_SHARE_QUO,OIL_SHARE_DATE,ROOM_SHARE_QUO,ROOM_SHARE_DATE";
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
						+ " WHERE DEAL_DATE='" + time+"' AND GROUP_ID_1='"+regionCode+"' AND HALL_TYPE='"+hallType+"'";
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
					int start = sheet.getFirstRowNum() +2 ;// 去前2行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values(sysdate"+",'"+time+"','"+regionCode+"','','"+hallType+"','"+username+"'";
					for(int i=0;i<61;i++){
						sql+=",?";
					}
					sql+=")";
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
		request.setAttribute("time", time);
		if(err.size()>0){
		   Struts2Utils.getRequest().setAttribute("err", err);
		   return "error";
		}
		return "success";
	}

	public void downfile() {
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_iron_stock.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_iron_stock.xls");
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
	
	public String getHallType() {
		return hallType;
	}

	public void setHallType(String hallType) {
		this.hallType = hallType;
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
