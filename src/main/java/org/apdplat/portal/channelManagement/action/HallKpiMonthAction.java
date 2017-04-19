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
@Namespace("/hallKpiMonth")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_hall_kpi_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_hall_kpi.jsp")
})
public class HallKpiMonthAction extends BaseAction {
	private File uploadFile;
	private String time;

	@Resource
	DataSource dataSource;

	public void importToResult() throws Exception {
		    User user = UserHolder.getCurrentLoginUser();
		    Org org=user.getOrg();
		    String regionCode=org.getRegionCode();
			String delRepeat = "DELETE FROM PMRT.TAB_MRT_BUS_HALL_PKI_MON WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"'";
			SpringManager.getUpdateDao().update(delRepeat);
			String importToResult = "INSERT INTO PMRT.TAB_MRT_BUS_HALL_PKI_MON(                      "+
					"           DEAL_DATE                                            "+
					"          ,GROUP_ID_1                                           "+
					"          ,GROUP_ID_1_NAME                                      "+
					"          ,HQ_CHAN_CODE                                         "+
					"          ,HQ_CHAN_NAME                                         "+
					"          ,KPI_NAME                                             "+
					"          ,KPI_WAIGHT                                           "+
					"          ,KPI_SCORE                                            "+
					"          ,LOGIN_NAME                                           "+
					"       )                                                        "+
					"SELECT T1.DEAL_DATE                                             "+
					"       ,T2.GROUP_ID_1                                           "+
					"       ,T2.GROUP_ID_1_NAME                                      "+
					"       ,T3.HQ_CHAN_CODE                                         "+
					"       ,T3.GROUP_ID_4_NAME                                      "+
					"       ,T1.KPI_NAME                                             "+
					"       ,T1.KPI_WAIGHT                                           "+
					"       ,T1.KPI_SCORE                                            "+
					"       ,T1.LOGIN_NAME                                           "+
					"FROM PMRT.TAB_MRT_BUS_HALL_PKI_MON_TEMP T1                      "+
					"JOIN PCDE.TB_CDE_REGION_CODE T2                                 "+
					"ON   (T1.GROUP_ID_1=T2.GROUP_ID_1)                              "+
					"JOIN PCDE.TB_CDE_CHANL_HQ_CODE T3                               "+
					"ON   (T1.HQ_CHAN_CODE=T3.HQ_CHAN_CODE)                          "+
					"WHERE T1.DEAL_DATE='"+time+"' AND T1.GROUP_ID_1='"+regionCode+"'";
			SpringManager.getUpdateDao().update(importToResult);
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		String regionName=org.getRegionName();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_MRT_BUS_HALL_PKI_MON_TEMP";
		String field="DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME,LOGIN_NAME,HQ_CHAN_CODE,KPI_NAME,KPI_WAIGHT,KPI_SCORE";
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
				String delSql ="DELETE FROM "+resultTableName+" WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"'";
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);  
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +2 ;// 去掉2行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values('"+time+"','"+regionCode+"','"+regionName+"','"+username+"',?,?,?,?)";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						if(cstart==0&&cend==4){
							pre.setString(1,getCellValue(row.getCell(0)));
							pre.setString(2,getCellValue(row.getCell(1)));
							pre.setString(3,getCellValue(row.getCell(2)));
							pre.setString(4,getCellValue(row.getCell(3)));
						}else{
							err.add("导入第"+(y+1)+"条记录失败,存在多余或缺少的字段！");
							Struts2Utils.getRequest().setAttribute("err", err);
							return "error";
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					String r=isPass(regionCode);
					if(r!=null){
						err.add(r);
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
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
	
	public String isPass(String regionCode){
		String sql="SELECT T.HQ_CHAN_NAME                                                                          "+
				"FROM  PMRT.TAB_MRT_BUS_HALL_PKI_MON_TEMP T                                                        "+
				"WHERE NOT EXISTS (SELECT 1 FROM PCDE.TB_CDE_CHANL_HQ_CODE T1 WHERE T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)"+
				" AND T.DEAL_DATE='"+time+"' AND T.GROUP_ID_1='"+regionCode+"'";
		List<Map<String,String>> l=SpringManager.getFindDao().find(sql);
		if(l!=null&&l.size()>0){
			for(int i=0;i<l.size();i++){
				return "营业厅编码"+l.get(i)+"不存在，请检查！";
			}
		}
		sql="SELECT HQ_CHAN_NAME FROM (                                                                                    "+
				"SELECT T.HQ_CHAN_NAME,SUM(REPLACE(T.KPI_WAIGHT,'%'))KPI_WAIGHT FROM  PMRT.TAB_MRT_BUS_HALL_PKI_MON_TEMP T "+
				"WHERE  T.DEAL_DATE= '"+time+"' AND T.GROUP_ID_1='"+regionCode+"'                                          "+
				"GROUP BY T.HQ_CHAN_NAME                                                                                   "+
				") WHERE KPI_WAIGHT>40                                                                                     "+
				"GROUP BY HQ_CHAN_NAME HAVING COUNT(1)>1                                                                   ";
		List<Map<String,String>> m=SpringManager.getFindDao().find(sql);
		if(m!=null&&m.size()>0){
				return "权重超过40%，请检查！";
		}
		sql="SELECT HQ_CHAN_CODE FROM  PMRT.TAB_MRT_BUS_HALL_PKI_MON_TEMP T      "+
				"WHERE  T.DEAL_DATE= '"+time+"' AND T.GROUP_ID_1='"+regionCode+"'"+
				"AND REPLACE(T.KPI_WAIGHT,'%')<T.KPI_SCORE                       ";
		List<Map<String,String>> n=SpringManager.getFindDao().find(sql);
		if(n!=null&&n.size()>0){
			return n.get(0).get("HQ_CHAN_CODE")+"的得分大于权重，请检查！";
	     }
		return null;
	}
	
	public void downfile() {
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_hall_kpi.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_hall_kpi.xls");
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
