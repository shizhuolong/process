package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
@Namespace("/ghUpload")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_ghUpload_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_ghUpload.jsp")
})
public class GhUploadAction extends BaseAction {
	private File uploadFile;
	private String time;

	@Resource
	DataSource dataSource;

	public void importToResult() throws Exception {
		    User user = UserHolder.getCurrentLoginUser();
		    Org org=user.getOrg();
		    String regionCode=org.getRegionCode();
			String delRepeat = "DELETE FROM PMRT.TB_MRT_CLOSE_COST WHERE DEAL_DATE='"+time+"' AND HQ_CHAN_CODE IN(SELECT HQ_CHAN_CODE FROM PCDE.TB_CDE_CHANL_HQ_CODE WHERE GROUP_ID_1='"+regionCode+"') ";
			SpringManager.getUpdateDao().update(delRepeat);
			String importToResult = "INSERT INTO PMRT.TB_MRT_CLOSE_COST SELECT * FROM PMRT.TB_MRT_CLOSE_COST_TEMP WHERE DEAL_DATE= '"+time+"' AND HQ_CHAN_CODE IN(SELECT HQ_CHAN_CODE FROM PCDE.TB_CDE_CHANL_HQ_CODE WHERE GROUP_ID_1='"+regionCode+"') ";
			SpringManager.getUpdateDao().update(importToResult);
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TB_MRT_CLOSE_COST_TEMP";
		String field="DEAL_DATE,HQ_CHAN_CODE,CLOSE_OUT,LABOR_COST";
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
				String delSql ="DELETE FROM "+resultTableName+" WHERE DEAL_DATE='"+time+"' AND HQ_CHAN_CODE IN(SELECT HQ_CHAN_CODE FROM PCDE.TB_CDE_CHANL_HQ_CODE WHERE GROUP_ID_1='"+regionCode+"')";
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);  
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +3 ;// 去掉3行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values('"+time+"',?,?,?)";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						if(cstart==0&&cend==9){
							pre.setString(1,getCellValue(row.getCell(4)));
							pre.setString(2,getCellValue(row.getCell(7)));
							pre.setString(3,getCellValue(row.getCell(8)));
						}else{
							err.add("导入第"+(y+1)+"条记录失败,存在多余或缺少的字段");
							Struts2Utils.getRequest().setAttribute("err", err);
							return "error";
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
