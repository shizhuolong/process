
package org.apdplat.report.devIncome.action;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class KpiUploadAction extends BaseAction{
	
	private static final long serialVersionUID = 1L;
	private File uploadFile;
	private String time;
	private String regionCode;
	private String userId;
	
	@Resource
	DataSource dataSource;
	public void confirmKpi(){
		boolean r=false;
		try{
			String time=request.getParameter("time");
			String userId=request.getParameter("userId");
			String regionCode=request.getParameter("regionCode");
			String importToResult="INSERT INTO PMRT.TAB_MRT_JCDY_KPI_QJ_MON                                                                      "+
					             "SELECT T1.DEAL_DATE,T2.GROUP_ID_1,T3.GROUP_ID_1_NAME,T2.UNIT_ID,T2.UNIT_NAME,T1.HR_ID,T0.USER_CODE,T1.KPI_NAME,"+
				                	"'',T1.KPI_SCORE,86000,T1.KPI_WEIGHT,T4.REALNAME,T1.LOGIN_NAME                                               "+
					              "FROM  PCDE.IS_KPI_TEMP T1                                                                                     "+
					             "JOIN  PORTAL.TAB_PORTAL_QJ_PERSON T0                                                                           "+
					             "ON    (T1.HR_ID=T0.HR_ID AND T0.DEAL_DATE='"+time+"')                                                          "+
					              "JOIN  PCDE.TAB_CDE_GROUP_CODE T2                                                                              "+
					              "ON    (T1.UNIT_ID=T2.UNIT_ID)                                                                                 "+
				            	 "JOIN PCDE.TB_CDE_REGION_CODE T3                                                                                "+
					             "ON   (T2.GROUP_ID_1=T3.GROUP_ID_1)                                                                             "+
					             "JOIN PORTAL.APDP_USER T4                                                                                       "+
				 	             "ON   (T1.HR_ID=T4.HR_ID)                                                                                       "+
					             "WHERE T1.GROUP_ID_1='"+regionCode+"' AND T1.DEAL_DATE='"+time+"'                                               ";
			SpringManager.getUpdateDao().update(importToResult);
			r=true;
		}catch(Exception e){
			e.printStackTrace();
			r=false;
		}
		Struts2Utils.renderJson("{\"ok\":"+r+"}", "no-cache");
	}
	
	public String importKpi(){
		List<String> err=new ArrayList<String>();
		String resultTableName="PCDE.IS_KPI_TEMP";
		if(uploadFile==null){
			err.add("上传文件为空");
		}else{
			try{
				//上传时覆盖
				String delSql="delete from "+resultTableName+" where deal_date='"+time+"' and group_id_1='"+regionCode+"'";
				SpringManager.getUpdateDao().update(delSql);
				FileInputStream in=new FileInputStream(uploadFile);
				HSSFWorkbook wb = new HSSFWorkbook(in);
				int sheetNum=wb.getNumberOfSheets();//得到sheet数量
				System.out.println("准备导入...");
				if(sheetNum>0){
					HSSFSheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:"+sheet.getSheetName());
					int start=sheet.getFirstRowNum()+1;//去掉第一行标题
					int end=sheet.getLastRowNum();
					for(int y=start;y<=end;y++){
						String sql="INSERT INTO PCDE.IS_KPI_TEMP(DEAL_DATE,GROUP_ID_1,LOGIN_NAME,UNIT_ID,UNIT_NAME,USER_NAME,HR_ID,KPI_NAME,KPI_SCORE,KPI_WEIGHT)";
						String values=" values('"+time+"','"+regionCode+"','"+userId+"'";
						HSSFRow row =sheet.getRow(y);
						if(row==null) continue;
						int cstart=row.getFirstCellNum();
						int cend=row.getLastCellNum();
						System.out.println(cstart+"："+cend);
						if(cstart==0&&cend==7){
							for(int i=cstart;i<cend;i++){
							  values+=","+getCellValue(row.getCell(i));
							}
							values+=")";
							
							int n=SpringManager.getUpdateDao().update(sql+values);
							if(n<=0){
								err.add("导入第"+(y+1)+"条记录失败");
							}
						}else{
							err.add("第"+(y+1)+"行的列数量不对");
						}
					}
					String trim="update PCDE.IS_KPI_TEMP T SET T.UNIT_ID=TRIM(T.UNIT_ID),T.HR_ID=TRIM(HR_ID),T.KPI_SCORE=TRIM(T.KPI_SCORE),T.KPI_WEIGHT=TRIM(T.KPI_WEIGHT)";
					System.out.println("trim开始-----------------------");
					SpringManager.getUpdateDao().update(trim);
					String isUnitIdError="SELECT T1.UNIT_ID,T1.UNIT_NAME FROM PCDE.IS_KPI_TEMP T1                                                                    "+
							             "WHERE NOT EXISTS (SELECT 1 FROM PCDE.tab_CDE_GROUP_CODE t2 where T1.UNIT_ID=T2.UNIT_ID AND T2.GROUP_ID_1='"+regionCode+"') "+
							             "AND T1.GROUP_ID_1='"+regionCode+"' AND T1.DEAL_DATE='"+time+"'                                                           ";
					List<Map<String,String>> uResult=SpringManager.getFindDao().find(isUnitIdError);
					if(uResult!=null&&!uResult.isEmpty()){
						for(Map<String,String> m:uResult){
							err.add("营服ID:"+m.get("unit_id")+"错误,请检查!");
						}
					}
					String isHrIdError="SELECT T1.HR_ID,T1.USER_NAME FROM PCDE.IS_KPI_TEMP T1                       "+
							         "WHERE NOT EXISTS (SELECT 1 FROM PORTAL.APDP_USER t2 where T1.HR_ID=T2.HR_ID) "+
							         "AND T1.GROUP_ID_1='"+regionCode+"' AND T1.DEAL_DATE='"+time+"'            ";
					List<Map<String,String>> hResult=SpringManager.getFindDao().find(isHrIdError);
					if(hResult!=null&&!hResult.isEmpty()){
						for(Map<String,String> m:hResult){
							err.add("HR编码:"+m.get("hr_id")+"错误,请检查!");
						}
					}
					String isCrossUnit="SELECT * FROM PCDE.IS_KPI_TEMP T1                                                                  "+
							          "JOIN (SELECT DISTINCT HR_ID,UNIT_ID FROM PORTAL.VIEW_U_PORTAL_PERSON WHERE DEAL_DATE='"+time+"') T2 "+
							          "ON   (T1.HR_ID=T2.HR_ID)                                                                           "+
							          "WHERE T1.GROUP_ID_1='"+regionCode+"' AND T1.DEAL_DATE='"+time+"' AND T1.UNIT_ID<>T2.UNIT_ID        ";
					List<Map<String,String>> cResult=SpringManager.getFindDao().find(isCrossUnit);
					if(cResult!=null&&!cResult.isEmpty()){
						for(Map<String,String> m:cResult){
							err.add("HR编码:"+m.get("hr_id")+"跨营服,请检查!");
						}
					}
					//结果表重新导入覆盖之前的数据
					String delRepeat="DELETE PMRT.TAB_MRT_JCDY_KPI_QJ_MON T                      "+
							         "WHERE T.DEAL_DATE='"+time+"' AND T.GROUP_ID_1='"+regionCode+"' "+
							         "AND   T.KPI_NAME IN (SELECT KPI_NAME FROM PCDE.IS_KPI_TEMP) "+
							         "AND   T.HR_ID IN (SELECT Hr_id FROM PCDE.IS_KPI_TEMP)       ";
					SpringManager.getUpdateDao().update(delRepeat);
					
					String kpiWeight="SELECT * FROM (                                                                  "+
							"SELECT HR_ID,SUM(KPI_WEIGHT)KPI_WEIGHT FROM (                                             "+
							"SELECT T1.HR_ID,REPLACE(T1.KPI_WEIGHT,'%') KPI_WEIGHT FROM PCDE.IS_KPI_TEMP T1            "+
							"WHERE T1.GROUP_ID_1='"+regionCode+"' AND T1.DEAL_DATE='"+time+"'                          "+
							"UNION ALL                                                                                 "+
							"SELECT T2.HR_ID,REPLACE(T2.KPI_WEIGHT,'%') KPI_WEIGHT FROM PMRT.Tab_Mrt_Jcdy_Kpi_Qj_Mon T2"+
							" WHERE T2.GROUP_ID_1='"+regionCode+"' AND T2.DEAL_DATE='"+time+"')                         "+
							"GROUP BY HR_ID ) WHERE KPI_WEIGHT>10                                                      ";	
					List<Map<String,String>> wResult=SpringManager.getFindDao().find(kpiWeight);
					if(wResult!=null&&!wResult.isEmpty()){
						for(Map<String,String> m:wResult){
							err.add("HR编码:"+m.get("hr_id")+"的权重超过10%,请检查!");
						}
					}
				}
			}catch (Exception e) {
				e.printStackTrace();
				err.add(e.getMessage());
			}
		}
		for(String s:err){
			System.out.println(s);
		}
		
		Struts2Utils.getRequest().setAttribute("err", err);
		request.setAttribute("time",time);
		request.setAttribute("userId",userId);
		request.setAttribute("regionCode",regionCode);
		if(err.size()>0){
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
	public String getRegionCode() {
		return regionCode;
	}
	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	private String getCellValue(HSSFCell cell){
		int cellType=cell.getCellType();
		String value="null";
		if(cellType==HSSFCell.CELL_TYPE_BLANK){
			value="";
		}else if(HSSFCell.CELL_TYPE_FORMULA==cellType){
			value = "";
			try {
				value = String.valueOf(cell.getNumericCellValue());
			} catch (IllegalStateException e) {
				value = String.valueOf(cell.getRichStringCellValue());
			}
		}else{
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			value="'"+cell.getStringCellValue()+"'";
		}
		return value;
	}
}
