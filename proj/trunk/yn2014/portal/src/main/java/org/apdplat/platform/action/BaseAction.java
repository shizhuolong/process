package org.apdplat.platform.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.Cell;
import jxl.CellType;
import jxl.DateCell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.json.JSONUtil;

import com.opensymphony.xwork2.ActionSupport;
public class BaseAction extends ActionSupport {

	private static final long serialVersionUID = 1L;
	
	protected Integer curPage = Integer.valueOf(1);
	protected Integer pageSize = Integer.valueOf(15);
	protected HttpServletRequest request = ServletActionContext.getRequest();
	protected HttpServletResponse response = ServletActionContext.getResponse();
	
	
	protected void outJsonPlainString(HttpServletResponse response, String json){
		 
		//response.setContentType("text/json;charset=UTF-8");
		//设置编码及文件格式   
		response.setContentType("text/html;charset=UTF-8");
		//设置不使用缓存   
		response.setHeader("Cache-Control","no-cache"); 
		try {
		  outString(response, json);
		} catch (Exception e) {
		  e.printStackTrace();
		}
	}
	 
	private void outString(HttpServletResponse response, String str){
		
		PrintWriter out;
		try
		{
		  out = response.getWriter();
		  out.println(str);
		  out.flush();
		  out.close();
		} catch (IOException e) {
		  e.printStackTrace();
		}
	}
	
	public void reponseJson(Object object) {
		try {
		String text=JSONUtil.serialize(object);
		HttpServletResponse response = ServletActionContext.getResponse();
		//设置编码及文件格式   
		response.setContentType("text/html;charset=UTF-8");
		//设置不使用缓存   
        response.setHeader("Cache-Control","no-cache"); 
			response.getWriter().write(text);
			response.getWriter().flush();   
	        response.getWriter().close(); 
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public List<String[]> getExcel(File file,int sheetCount){
 	   List<String[]> list = new ArrayList<String[]>();
 	   InputStream fs = null;
 	   Workbook workBook = null;
 	     
 	     try {
 	         // 加载excel文件
 	         fs = new FileInputStream(file);
 	         // 得到 workbook
 	             workBook = Workbook.getWorkbook(fs);
 	        } catch (FileNotFoundException e) {
 	         e.printStackTrace();
 	        } catch (BiffException e) {
 	         e.printStackTrace();
 	        } catch (IOException e) {
 	         e.printStackTrace();
 	        }

 	           // 取得sheet，如果你的workbook里有多个sheet 可以利用 wb.getSheets()方法来得到所有的。
 	        // getSheets() 方法返回 Sheet[] 数组 然后利用数组来操作。就是多次循环的事。
 	        Sheet sheet = workBook.getSheet(sheetCount);//这里只取得第一个sheet的值，默认从0开始
 	        int columns = sheet.getColumns();//查看sheet的列
 	        int rows = sheet.getRows();//查看sheet的行
 	        Cell cell = null;//就是单个单元格
 	        // 开始循环，取得 cell 里的内容，这里都是按String来取的 为了省事，具体你自己可以按实际类型来取。或者都按
 	        // String来取。然后根据你需要强制转换一下。
 	        String[] str = new String[0];
 	        for (int i = 0; i < sheet.getRows(); i++) {
 	        	str = new String[columns];
	    	        for (int j = 0; j < sheet.getColumns(); j++) {
	    	          cell = sheet.getCell(j, i);
	    	          if(cell.getType()==CellType.DATE || cell.getType()==CellType.DATE_FORMULA){
	    	              if(cell.getContents()!=null){ 
	    	            	  SimpleDateFormat ds = new SimpleDateFormat("yyyy-MM-dd");
	    	                  DateCell dc = (DateCell)cell;
	    	                  Date date = dc.getDate();
			    	          Calendar c=Calendar.getInstance(); 
			    	          c.setTime(date);
			    	          c.add(Calendar.HOUR, -8);//解析excel的时候会默认当前输入的时间为格林威治时间，需要转为当前时区的时间（之前8小时）
			    	          str[j] =  ds.format(c.getTime());      
	    	              }
	    	             }else{
	    	            	 str[j] = cell.getContents();
	    	             }
	    	          }
 	          list.add(str);//将每行的字符串用一个String类型的集合保存。
 	        }
 	        workBook.close();//记得关闭
 	       return list;
 	}

	public Connection getCon() throws Exception{
    	InputStream in= BaseAction.class.getResourceAsStream("/db.local.properties");
		Properties cp=new Properties();
		cp.load(in);
		String driver = cp.getProperty("db.driver");//"oracle.jdbc.driver.OracleDriver";
		String strUrl = cp.getProperty("db.url");//"jdbc:oracle:thin:@135.64.0.200:1521:Rx"; 
		String username = cp.getProperty("db.username");
		String password = cp.getProperty("db.password");
		 Connection conn = null;
		 Class.forName(driver);
		conn = DriverManager.getConnection(strUrl,username,password);
		return conn;
    }
	
	public Integer getCurPage() {
		return curPage;
	}

	public void setCurPage(Integer curPage) {
		this.curPage = curPage;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	
	
	
}