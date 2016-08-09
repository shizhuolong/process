
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

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.struts2.ServletActionContext;
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
		try{
			String time=request.getParameter("time");
			String userId=request.getParameter("userId");
			String regionCode=request.getParameter("regionCode");
			request.getAttribute("userId");
			String csql="DELETE FROM PTEMP.TB_TMP_JCDY_HR_SALARY WHERE  deal_date='"+time+"' AND GROUP_ID_1='"+regionCode+"'";
			SpringManager.getUpdateDao().update(csql);
			String sql="insert into PTEMP.TB_TMP_JCDY_HR_SALARY select * from PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP where creator='"+userId+"'";
			SpringManager.getUpdateDao().update(sql);
			//调用存储过程
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
			//////////
			r=true;
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
		Struts2Utils.renderJson("{\"ok\":"+r+"}", "no-cache");
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
				//上传时覆盖
				String delSql="delete from "+resultTableName+" where creator='"+userId+"'";
				SpringManager.getUpdateDao().update(delSql);
				FileInputStream in=new FileInputStream(uploadFile);
				HSSFWorkbook wb = new HSSFWorkbook(in);
				int sheetNum=wb.getNumberOfSheets();//得到sheet数量
				SimpleDateFormat s=new SimpleDateFormat("yyyyMMdd HH:mm:ss");
				System.out.println("准备导入...");
				if(sheetNum>0){
					HSSFSheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:"+sheet.getSheetName());
					
					int start=sheet.getFirstRowNum()+1;//去掉第一行标题
					int end=sheet.getLastRowNum();
					for(int y=start;y<=end;y++){
						Date date=new Date();
						String createTime=s.format(date);
						String sql="insert into "+resultTableName+"(DEAL_DATE,GROUP_ID_1,CREATOR,CREATETIME,HR_NO,USER_NAME,POST_LEVEL,SALARY_LEVEL,POST_SALARY,GENERAL_SUBS,DIFFICULT_AREAS,MERIT_PAY_1,MERIT_PAY_2,OTHER_PAY_1,OTHER_PAY_2,OVERTIME_PAY,FESTIVITY_PAY,CHINA_ONE_PAY,MULTI_WY,MULTI_WC,MULTI_JT,MULTI_TX,MULTI_DSR,OTHER2,SALARY_PAY_TOTAL,PROVIDE_AGE,TREATMENT,UNEMPLOYE,HOUSING,SUPPLEMENTARY,INCOME_TAX,OTHER_COST_1,OTHER_COST_1_ITEM,DEDUCTED_TOTAL,FACT_TOTAL)";
						String values=" values('"+time+"','"+regionCode+"','"+userId+"','"+createTime+"',";
						HSSFRow row =sheet.getRow(y);
						if(row==null) continue;
						int cstart=row.getFirstCellNum();
						int cend=row.getLastCellNum();
						System.out.println(cstart+"："+cend);
						if(cstart==0&&cend==32){
							for(int i=cstart+1;i<cend;i++){
								if(i==1){
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
					String lsql="select distinct hr_no from PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP where creator='"+userId+"'";
					String rsql="select hr_no from PTEMP.TB_TMP_JCDY_HR_SALARY_TEMP where creator='"+userId+"'";
					if(SpringManager.getFindDao().find(lsql).size()!=SpringManager.getFindDao().find(rsql).size()){
						err.add("导入的excel表中有重复数据");
					}
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
