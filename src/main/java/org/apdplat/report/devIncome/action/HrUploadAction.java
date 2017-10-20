
package org.apdplat.report.devIncome.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
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
public class HrUploadAction extends BaseAction{
	
	private static final long serialVersionUID = 1L;
	private File uploadFile;
	private String time;
	private String regionCode;
	private String userId;
	
	@Resource
	DataSource dataSource;
	public void confirmTax(){
		boolean r=false;
		Connection conn =null;
		CallableStatement stmt=null;
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String orgLevel=org.getOrgLevel();
		String type="";
		String regionCode="";
		if(orgLevel.equals("1")){//省级用户导入
			type="1";
		}else{//市级用户导入
			type="2";
			regionCode=org.getRegionCode();
		}
		try{
			String time=request.getParameter("time");
			String csql="";
			if(type.equals("2")){
				csql="DELETE FROM PTEMP.TB_TMP_JCDY_HR_SALARY WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"' AND TYPE='2'";
			}else{
				csql="DELETE FROM PTEMP.TB_TMP_JCDY_HR_SALARY WHERE DEAL_DATE='"+time+"' AND TYPE='1'";
			}
			
			SpringManager.getUpdateDao().update(csql);
			String sql="";
			if(type.equals("2")){
				sql="INSERT INTO PTEMP.TB_TMP_JCDY_HR_SALARY SELECT * FROM PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"' AND TYPE='2'";
			}else{
				sql="INSERT INTO PTEMP.TB_TMP_JCDY_HR_SALARY SELECT * FROM PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND TYPE='1'";
			}
			
			SpringManager.getUpdateDao().update(sql);
			/*//调用存储过程
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("call PMRT.PRC_MRT_JF_BASE_SALARY_MON(?,?,?)");
			stmt.setString(1,time+"08");
			stmt.setString(2,regionCode);
			stmt.registerOutParameter(3,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			int num=stmt.getInt(3);
			if(num!=0){
				r=false;
				return;
			}
			//////////*/
			r=true;
			Struts2Utils.renderJson("{\"ok\":"+r+"}", "no-cache");
		}catch(Exception e){
			e.printStackTrace();
			r=false;
		}finally{
			if(null!=stmt){
				try{
					stmt.close();
				}catch(Exception e){}
			}
			if(null!=conn){
				try{
					conn.close();
				}catch(Exception e){}
			}
		}
		
	}
	/**
	 * 下载文件
	 * @throws IOException 
	 */
	public void downfile() {
		File f=new File(this.request.getRealPath("/report/devIncome/down/tmp_jcdy_hr_salary.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=tmp_jcdy_hr_salary.xls");
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
	public String importTax(){
		List<String> err=new ArrayList<String>();
		String resultTableName="PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP";
		if(uploadFile==null){
			err.add("上传文件为空");
		}else{
			try{
				User user = UserHolder.getCurrentLoginUser();
				Org org=user.getOrg();
				String orgLevel=org.getOrgLevel();
				
				String type="";
				if(orgLevel.equals("1")){//省级用户导入
					type="1";
				}else{//市级用户导入
					type="2";
					regionCode=org.getRegionCode();
				}
				String delSql="";
				//上传时覆盖
				if(type.equals("2")){
					delSql="delete from "+resultTableName+" where deal_date='"+time+"' AND GROUP_ID_1='"+regionCode+"' AND TYPE='"+type+"'";
				}else{
					delSql="delete from "+resultTableName+" where deal_date='"+time+"' AND TYPE='"+type+"'";
				}
				SpringManager.getUpdateDao().update(delSql);
				FileInputStream in=new FileInputStream(uploadFile);
				HSSFWorkbook wb = new HSSFWorkbook(in);
				int sheetNum=wb.getNumberOfSheets();//得到sheet数量
				SimpleDateFormat s=new SimpleDateFormat("yyyyMMdd HH:mm:ss");
				String fields="TYPE,DEAL_DATE,GROUP_ID_1,CREATOR,CREATETIME,HR_NO,USER_NAME,OWN_ORG,DIS_NUM,SALARY_UNIT,SALARY_MONTH,POST_SALARY,MULTI_PAY,AREA_PAY,WARM_PAY,HOLD_SALAY,MON_SALARY_1,MON_SALARY_2,YEAR_SALARY,YEAR_SALARY_NOCOST,OVERTIME_PAY,MULTI_WY,MULTI_CB,NIGHT_PAY,FESTIVITY_PAY,SPECIAL_PAY,OTHER_TAX_PAY,UP_PAY,ADJUST_SALARY,POST_KH_PAY,JX_KH_PAY,OTHER1,OTHER2,OTHER_PLACE_PAY,GOV_SPECIAL_PAY,PETITION_POST_PAY,G3_PAY,NATIVE_LAN_PAY,HURT_PAY,CHINA_ONE_NO_TAX,CHINA_ONE_TAX,JT_NO_TAX,JT_TAX,FUNERAL_PENSION,COLLECTIVE_WELFARE,COVERALL,FAMILY_ALLOWANCE,SEVERANCE_PACKAGE,OTHER_SALA_NO_COST,OTHER_SALA_JT,TREATMENT,PROVIDE_AGE_NOTAX,PROVIDE_AGE_TAX,PROVIDE_AGE_COM,INDIVIDUAL,INDIVIDUAL_COM,PROVIDE_AGE_PER,PROVIDE_COM,TREATMENT_PER,TREATMENT_COM,UNEMPLOYE_PER,UNEMPLOYE_COM,HURT_COM,MATERNITY_COM,BIGMEDI_TAX,MON_BIGMEDI,BIGMEDI_PER,BIGMEDI_COM,PROVIDE_ADJUST_PER,PROVIDE_ADJUST_COM,TREATMENT_ADJUST_PER,TREATMENT_ADJUST_COM,UNEMPLOYE_ADJUST_PER,UNEMPLOYE_ADJUST_COM,HURT_ADJUST_COM,MATERNITY_ADJUST_COM,DIS_SOCIAL,HOUSING_PER,HOUSING_COM,HOUSING_ADUST_PER,HOUSING_ADUST_COM,BC_HOUSING_PER,BC_HOUSING_COM,LABOR_NO_TAX,LABOR_TAX,LABOUR_FEE,EDU_FEE,EDU_PAY,LABOR_ADJUST,EDU_ADJUST,INCOME_TAX_ADJUST,ADD_NO_TAX,OTHER_TAX,MANA_FEE,OTHER_ASSURANCE,SALARY_PAY_TOTAL,DEDUCTED_TOTAL,INCOME_TAX_DISS,YEAR_JJ_TAX,LEAVE_TAX,FACT_TOTAL,ALL_SALARY,SALARY_COST";
				System.out.println("准备导入...");
				if(sheetNum>0){
					HSSFSheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:"+sheet.getSheetName());
					
					int start=sheet.getFirstRowNum()+1;//去掉第一行标题
					int end=sheet.getLastRowNum();
					for(int y=start;y<=end;y++){
						Date date=new Date();
						String createTime=s.format(date);
						String sql="insert into "+resultTableName+"("+fields+")";
						String values=" values('"+type+"','"+time+"','"+regionCode+"','"+userId+"','"+createTime+"',";
						HSSFRow row =sheet.getRow(y);
						if(row==null) continue;
						int cstart=row.getFirstCellNum();
						int cend=row.getLastCellNum();
						System.out.println(cstart+"："+cend);
						if(cstart==0&&cend==98){
							for(int i=cstart;i<cend;i++){
								if(i==0){
									values+=getCellValue(row.getCell(i));
								}else{
									values+=","+getCellValue(row.getCell(i));
								}
							}
							values+=")";
							
							int n=SpringManager.getUpdateDao().update(sql+values);
							if(n<=0){
								err.add("导入第"+(y+1)+"条记录失败");
							}
						}else{
							err.add("第"+(y+1)+"行的列数量不对");
							continue;
						}
					}
					String hrNoNotExist="SELECT HR_NO FROM PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND TYPE='"+type+"' AND HR_NO NOT IN(SELECT DISTINCT HR_ID FROM PORTAL.TAB_PORTAL_QJ_PERSON)";
					List<Map<String,String>> l=SpringManager.getFindDao().find(hrNoNotExist);
					if(l!=null&&l.size()>0){
						for(int i=0;i<l.size();i++){
							err.add("hr编码"+l.get(i).get("HR_NO")+"错误，请核查！");
						}
					}
					String lsql="select distinct hr_no from PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP where deal_date='"+time+"' AND TYPE='"+type+"'";
					String rsql="select hr_no from PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP where deal_date='"+time+"' AND TYPE='"+type+"'";
					if(SpringManager.getFindDao().find(lsql).size()!=SpringManager.getFindDao().find(rsql).size()){
						err.add("导入的excel表中有员工工号重复数据");
					}
					String updateRegionCode="MERGE INTO PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP T1   "+
							"USING PORTAL.TAB_PORTAL_QJ_PERSON T2             "+
							"ON    (T1.HR_NO=T2.HR_ID AND T1.TYPE='"+type+"' AND T1.DEAL_DATE="+time+" AND T2.DEAL_DATE="+time+")"+
							"WHEN MATCHED THEN                                "+
							"  UPDATE SET T1.GROUP_ID_1=T2.GROUP_ID_1         ";
					
					SpringManager.getUpdateDao().update(updateRegionCode);
				}
				System.out.println("导入结束...");
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
		if(cellType==HSSFCell.CELL_TYPE_STRING){//HSSFCell.CELL_TYPE_BLANK HSSFCell.CELL_TYPE_BOOLEAN HSSFCell.CELL_TYPE_ERROR HSSFCell.CELL_TYPE_FORMULA HSSFCell.CELL_TYPE_NUMERIC HSSFCell.CELL_TYPE_STRING
			value="'"+cell.getStringCellValue()+"'";
		}else if(cellType==HSSFCell.CELL_TYPE_NUMERIC){
			if(HSSFDateUtil.isCellDateFormatted(cell)){
				value="'"+new SimpleDateFormat("yyyy年MM月dd日").format(cell.getDateCellValue())+"'";
			}else{
				value=cell.getNumericCellValue()+"";
			}
		}else if(cellType==HSSFCell.CELL_TYPE_BLANK){
			value="null";
		}else if(HSSFCell.CELL_TYPE_FORMULA==cellType){
			value = "";
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
