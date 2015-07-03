package org.apdplat.selfrpt.util;

import javax.servlet.*;
import javax.servlet.http.*;

import org.springframework.beans.factory.annotation.Autowired;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.List;

/**
 * @author yangj
 * 导出EXCEL
 */
public class ExpExcel extends HttpServlet{
	
	private static final long serialVersionUID = 1L;
	@Autowired
	private JdbcUtil jdbc; 
	
	  protected void doPost(HttpServletRequest req,HttpServletResponse res)
	    throws ServletException,IOException {
	        doGet(req,res);
	    }
	    protected void doGet(HttpServletRequest req,HttpServletResponse res)
	    throws ServletException,IOException{
	    	String sql = req.getParameter("expSql");
	        String fileName = req.getParameter("fileName");
	        String columnName = req.getParameter("columnName");
	        List<String[]> list = jdbc.findList(sql);
	    	exportExcel(res,list,fileName,columnName);
	    }
    	public  void exportExcel(HttpServletResponse response,List<String[]> list,String fileName,String columnName) {
    		String[] columnNames = null;
    		if(null != columnName&&!"null".equals(columnName)&&!"".equals(columnName))
    			columnNames = columnName.split(",");
    		try {
    			fileName = new String((fileName+".xls").getBytes("gb2312"),"iso8859-1");
    		} catch (UnsupportedEncodingException e1) {
    			e1.printStackTrace();
    		}
    		response.reset();
    		response.setContentType("application/x-msdownload;charset=utf-8");
    		response.addHeader("Content-Disposition","attachment; filename=\"" +fileName + "\"");
    		if(list != null){
    			StringBuffer sb = new StringBuffer();
    			Object[] o = (Object[]) list.get(0);
    			try{		
    			PrintWriter pw = response.getWriter();
    			sb.append("<?xml version=\"1.0\"encoding=\"utf-8\"?>");
    			sb.append("\n");
    			sb.append("<?mso-application progid=\"Excel.Sheet\"?>");
    			sb.append("\n");
    			sb.append("<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"");
    			sb.append("\n");
    			sb.append("  xmlns:o=\"urn:schemas-microsoft-com:office:office\"");
    			sb.append("\n");
    			sb.append(" xmlns:x=\"urn:schemas-microsoft-com:office:excel\"");
    			sb.append("\n");
    			sb.append(" xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"");
    			sb.append("\n");
    			sb.append(" xmlns:html=\"http://www.w3.org/TR/REC-html40\">");
    			sb.append("\n");
    			sb.append(" <Styles>\n");
    			sb.append("  <Style ss:ID=\"Default\" ss:Name=\"Normal\">\n");
    			sb.append("   <Alignment ss:Vertical=\"Center\"/>\n");
    			sb.append("   <Borders/>\n");
    			sb.append("   <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Size=\"12\"/>\n");
    			sb.append("   <Interior/>\n");
    			sb.append("   <NumberFormat/>\n");
    			sb.append("   <Protection/>\n");
    			sb.append("  </Style>\n");
    			sb.append(" </Styles>\n");
    			int recordcount = 50000;
    			int currentRecord = 0;
    			int i = 1;
    			int col=o.length;//取得列数 
    			String colnames[] = null ;
    	        if(null != columnNames)
    	        	colnames = columnNames;
    			for(int j=0;j<list.size();j++){
    					if ((currentRecord == recordcount|| currentRecord == 0)
    							&& i != 0) {
    						currentRecord = 0;
    						pw.write(sb.toString());
    						sb.setLength(0);
    						if(i>1){
    							sb.append("</Table><WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">");
    							sb.append("<ProtectObjects>False</ProtectObjects>");
    							sb.append("<ProtectScenarios>False</ProtectScenarios>");
    							sb.append("</WorksheetOptions></Worksheet>");
    						}
    						sb.append("<Worksheet ss:Name=\"Sheet" + i / recordcount
    								+ "\">");
    						sb.append("\n");
    						sb.append("<Table ss:ExpandedColumnCount=\"" + col
    								+ "\" ss:ExpandedRowCount=\"" + recordcount
    								+ "\" x:FullColumns=\"1\" x:FullRows=\"1\">");
    						sb.append("\n");
    					}
    					sb.append("<Row>");
    					if(currentRecord == 0)						
    						getColName(col,sb,colnames);
    					getData(col,sb,(Object[])list.get(j));					
    					sb.append("</Row>");
    					if (i % 5000 == 0) {
    						pw.write(sb.toString());
    						pw.flush();
    						sb.setLength(0);
    					}
    					sb.append("\n");
    					currentRecord++;
    					i++;
    			}
    			pw.write(sb.toString());
    			sb.setLength(0);
    			sb.append("</Table>");
    			sb.append("<WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">");
    			sb.append("\n");
    			sb.append("<ProtectObjects>False</ProtectObjects>");
    			sb.append("\n");
    			sb.append("<ProtectScenarios>False</ProtectScenarios>");
    			sb.append("\n");
    			sb.append("</WorksheetOptions>");
    			sb.append("\n");
    			sb.append("</Worksheet>");
    			sb.append("</Workbook>");
    			sb.append("\n");
    			pw.write(sb.toString());
    			pw.flush();
    			pw.close();
    		} catch (FileNotFoundException e) {
    			e.printStackTrace();
    		} catch (IOException e) {
    			e.printStackTrace();
    		}catch(SQLException e){
    			e.printStackTrace();
    		}catch(Exception e){
    			e.printStackTrace();
    		}finally{
    		}
    	}  		
    }
    	
    	private void getData(int col,StringBuffer sb,Object[] obj) throws SQLException{
    		for (int k = 0; k < col; k++) {			
    			sb.append("<Cell><Data ss:Type=\"String\">"+obj[k]+"</Data></Cell>");
    			sb.append("\n");
    		}
    	}
    	
    	private void getColName(int col,StringBuffer sb,String[] colnames ){
    		if(null != colnames){
    			for (int j = 0; j < col; j++) {
        			sb.append("<Cell><Data ss:Type=\"String\">"+colnames[j]+"</Data></Cell>");
        			System.out.println(colnames[j]);
        			sb.append("\n");
        		}
        		sb.append("</Row><Row>");
    		}
    	}    
}

