
package org.apdplat.report.devIncome.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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


@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class ZZXUploadAction extends BaseAction{
	
	private static final long serialVersionUID = 1L;
	private File uploadFile;
	private String username;
	@Resource
	DataSource dataSource;
	public void importToResult(){
		boolean r=false;
		try{
			String csql="DELETE FROM PTEMP.TB_TMP_GWZZJZ_RATIO WHERE SUBSCRIPTION_ID IN (SELECT SUBSCRIPTION_ID FROM PTEMP.TB_TMP_GWZZJZ_RATIO_TEMP)";
			SpringManager.getUpdateDao().update(csql);
			String sql="insert into PTEMP.TB_TMP_GWZZJZ_RATIO select * from PTEMP.TB_TMP_GWZZJZ_RATIO_TEMP";
			SpringManager.getUpdateDao().update(sql);
			r=true;
		}catch(Exception e){
			e.printStackTrace();
			r=false;
		}
		Struts2Utils.renderJson("{\"ok\":"+r+"}", "no-cache");
	}
	/**
	 * 下载文件
	 * @throws IOException 
	 */
	public void downfile() {
		File f=new File(this.request.getRealPath("/report/devIncome/down/zzx_ratio.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=zzx_ratio.xls");
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
	public String importToTemplate(){
		
		List<String> err=new ArrayList<String>();
		String resultTableName="PTEMP.TB_TMP_GWZZJZ_RATIO_TEMP";
		if(uploadFile==null){
			err.add("上传文件为空");
		}else{
			try{
				//上传时覆盖
				String delSql="delete from "+resultTableName;
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
						String sql="insert into "+resultTableName+"(CREATOR,CREATE_TIME,SUBSCRIPTION_ID,DEVICE_NUMBER,RATIO,ITEMCODE,ITEMDESC,ACTIVE_TIME,INACTIVE_TIME)";
						String values=" values('"+username+"',sysdate";
						HSSFRow row =sheet.getRow(y);
						if(row==null) continue;
						int cstart=row.getFirstCellNum();
						int cend=row.getLastCellNum();
						System.out.println(cstart+"："+cend);
						if(cstart==0&&cend==9){
							for(int i=cstart+2;i<cend;i++){
								values+=","+getCellValue(row.getCell(i));
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
					String lsql="SELECT DISTINCT SUBSCRIPTION_ID FROM PTEMP.TB_TMP_GWZZJZ_RATIO_TEMP";
					String rsql="SELECT SUBSCRIPTION_ID FROM PTEMP.TB_TMP_GWZZJZ_RATIO_TEMP";
					if(SpringManager.getFindDao().find(lsql).size()!=SpringManager.getFindDao().find(rsql).size()){
						err.add("导入的excel中服务号码有重复数据");
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
		if(err.size()>0){
			return "error";
		}
		String fsql="update PTEMP.TB_TMP_GWZZJZ_RATIO_TEMP set ratio=to_char(ratio,'fm9999999990.00')";
		SpringManager.getUpdateDao().update(fsql);
		return "success";
	}
	public File getUploadFile() {
		return uploadFile;
	}
	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
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
