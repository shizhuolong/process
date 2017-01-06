
package org.apdplat.portal.channelManagement.action;

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
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


@Controller
@Scope("prototype")
public class UserOrderAction extends BaseAction{
	
	private static final long serialVersionUID = 1L;
	private File uploadFile;
	
	@Resource
	DataSource dataSource;
	
	public void importToResult(){
		boolean r=false;
		Connection conn =null;
		CallableStatement stmt=null;
		try{
			User user = UserHolder.getCurrentLoginUser();
			String username =user.getUsername();
			String dsql="DELETE FROM PMRT.TB_USER_ORDER_DETAIL WHERE ORDER_NO IN (SELECT ORDER_NO FROM PMRT.TB_USER_ORDER_DETAIL"+ 
					" WHERE ORDER_NO IN(SELECT ORDER_NO FROM PMRT.TB_USER_ORDER_DETAIL_TEMP WHERE IN_USER_NAME='"+username+"')  "+
					") AND IN_USER_NAME='"+username+"'                                                                          ";
			SpringManager.getUpdateDao().update(dsql);
			String sql="INSERT INTO PMRT.TB_USER_ORDER_DETAIL SELECT * FROM PMRT.TB_USER_ORDER_DETAIL_TEMP WHERE IN_USER_NAME='"+username+"'";
			SpringManager.getUpdateDao().update(sql);
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
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_user_order.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_user_order.xls");
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
	
	public String importToTemp(){
		User user = UserHolder.getCurrentLoginUser();
		String username =user.getUsername();
		List<String> err=new ArrayList<String>();
		String resultTableName="PMRT.TB_USER_ORDER_DETAIL_TEMP";
		if(uploadFile==null){
			err.add("上传文件为空");
		}else{
			try{
				//上传时覆盖
				String delSql="DELETE FROM "+resultTableName+" WHERE IN_USER_NAME='"+username+"'";
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
						String inTime=s.format(date);
						String sql="INSERT INTO "+resultTableName;
						String values=" VALUES(";
						HSSFRow row =sheet.getRow(y);
						if(row==null) continue;
						int cstart=row.getFirstCellNum();
						int cend=row.getLastCellNum();
						System.out.println(cstart+":"+cend);
						for(int i=cstart;i<cend;i++){
							if(i==cstart){
								values+=getCellValue(row.getCell(i));
							}else{
								values+=","+getCellValue(row.getCell(i));
							}
						}
						values+=",'"+inTime+"','"+username+"',''";
						values+=")";
						int n=SpringManager.getUpdateDao().update(sql+values);
						if(n<=0){
							err.add("导入第"+(y+1)+"条记录失败");
						}
					  }
					}
				wb.close();
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
	
	private String getCellValue(HSSFCell cell){
		String value="''";
		if(cell==null){
			return value;
		}
		int cellType=cell.getCellType();
		if(cellType==HSSFCell.CELL_TYPE_STRING){//HSSFCell.CELL_TYPE_BLANK HSSFCell.CELL_TYPE_BOOLEAN HSSFCell.CELL_TYPE_ERROR HSSFCell.CELL_TYPE_FORMULA HSSFCell.CELL_TYPE_NUMERIC HSSFCell.CELL_TYPE_STRING
			value="'"+cell.getStringCellValue()+"'";
		}else if(cellType==HSSFCell.CELL_TYPE_NUMERIC){
			if(HSSFDateUtil.isCellDateFormatted(cell)){
				value="'"+new SimpleDateFormat("yyyy年MM月dd日").format(cell.getDateCellValue())+"'";
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
