
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


@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class OrUploadAction extends BaseAction{
	
	private static final long serialVersionUID = 1L;
	private File uploadFile;
	private String time;
	private String regionCode;
	private String userId;
	
	@Resource
	DataSource dataSource;
	public void confirmTax(){
		boolean r=false;
		Connection conn=null;
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
				csql="DELETE FROM PTEMP.TB_TMP_JCDY_OUT_HR_SALARY WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"' AND TYPE='2'";
			}else{
				csql="DELETE FROM PTEMP.TB_TMP_JCDY_OUT_HR_SALARY WHERE DEAL_DATE='"+time+"' AND TYPE='1'";
			}
			
			SpringManager.getUpdateDao().update(csql);
			String sql="";
			if(type.equals("2")){
				sql="INSERT INTO PTEMP.TB_TMP_JCDY_OUT_HR_SALARY SELECT * FROM PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1='"+regionCode+"' AND TYPE='2'";
			}else{
				sql="INSERT INTO PTEMP.TB_TMP_JCDY_OUT_HR_SALARY SELECT * FROM PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND TYPE='1'";
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
		File f=new File(this.request.getRealPath("/report/devIncome/down/jcdy_out_hr_salary.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=jcdy_out_hr_salary.xls");
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
		String resultTableName="PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP";
		
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
				if(type.equals("2")){
					delSql="delete from "+resultTableName+" where deal_date='"+time+"' AND GROUP_ID_1='"+regionCode+"' AND TYPE='"+type+"'";
				}else{
					delSql="delete from "+resultTableName+" where deal_date='"+time+"' AND TYPE='"+type+"'";
				}
				//上传时覆盖
				SpringManager.getUpdateDao().update(delSql);
				FileInputStream in=new FileInputStream(uploadFile);
				HSSFWorkbook wb = new HSSFWorkbook(in);
				int sheetNum=wb.getNumberOfSheets();//得到sheet数量
				SimpleDateFormat s=new SimpleDateFormat("yyyyMMdd HH:mm:ss");
				System.out.println("准备导入...");
				String fields="TYPE,DEAL_DATE,GROUP_ID_1,CREATOR,CREATETIME,HR_NO,USER_NAME,OWN_COMPANY,OWN_ORG,POST_SALARY,JX_SALARY,SUBSIDY,FESTIVITY_PAY,OVERTIME_PAY,OTHER_PAY,SALARY_PAY_TOTAL,OTHER_COST_1,OTHER_COST_1_ITEM,HOUSING,INCOME_TAX,FACT_TOTAL,PROVIDE_AGE,BIRTH_FEE,UNEMPLOYE,TREATMENT,HURT_FEE,GJJ_FEE,DEDUCTED_TOTAL,BEGIN_DATE,DEDUCT_DATE,UNION_DUES,MANA_FEE,FAX_FEE,OTHER_MAN_PAY,NOTE,COST_TOTAL";
				if(sheetNum>0){
					HSSFSheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:"+sheet.getSheetName());
					
					int start=sheet.getFirstRowNum()+1;//去掉第一行标题
					int end=sheet.getLastRowNum();
					for(int y=start;y<=end;y++){
						Date date=new Date();
						String createTime=s.format(date);
						String sql="INSERT INTO "+resultTableName+"("+fields+")";
						String values=" VALUES('"+type+"','"+time+"','"+regionCode+"','"+userId+"','"+createTime+"',";
						HSSFRow row =sheet.getRow(y);
						if(row==null) continue;
						int cstart=row.getFirstCellNum();
						int cend=row.getLastCellNum();
						System.out.println(cstart+"："+cend);
						if(cstart==0&&cend==31){
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
					String hrNoNotExist="SELECT HR_NO FROM PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND TYPE='"+type+"' AND HR_NO NOT IN(SELECT DISTINCT HR_ID FROM PORTAL.TAB_PORTAL_QJ_PERSON)";
					List<Map<String,String>> l=SpringManager.getFindDao().find(hrNoNotExist);
					if(l!=null&&l.size()>0){
						for(int i=0;i<l.size();i++){
							err.add("hr编码"+l.get(i).get("HR_NO")+"错误，请核查！");
						}
					}
					String lsql="select distinct hr_no from PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP where deal_date='"+time+"' AND TYPE='"+type+"'";
					String rsql="select hr_no from PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP where deal_date='"+time+"' AND TYPE='"+type+"'";
					if(SpringManager.getFindDao().find(lsql).size()!=SpringManager.getFindDao().find(rsql).size()){
						err.add("导入的excel表中人员编号有重复数据");
					}
					String updateRegionCode="MERGE INTO PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP T1   "+
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
