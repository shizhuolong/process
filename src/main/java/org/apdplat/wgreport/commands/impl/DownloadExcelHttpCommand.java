package org.apdplat.wgreport.commands.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apdplat.wgreport.commands.HttpCommand;
import org.apdplat.wgreport.common.SpringManager;
import org.apdplat.wgreport.model.ExcelTemplate;
import org.apdplat.wgreport.support.preferense.Config;
import org.apdplat.wgreport.support.servlets.SpringServlet;
import org.apdplat.wgreport.util.DownExcelHehelper;
import org.apdplat.wgreport.util.MapUtil;
import org.apdplat.wgreport.util.NumberUtil;
import org.apdplat.wgreport.util.UUIDUtil;


public class DownloadExcelHttpCommand extends AbstractHttpCommand implements HttpCommand {
	
	//获取昨日值
	public String getYesterday(){
		Calendar c=Calendar.getInstance();
	    //Calendar c1=Calendar.getInstance();
	    c.add(Calendar.DATE,-1);
	    //c1.add(Calendar.MONTH,-1);
	    String yesterday = new SimpleDateFormat( "yyyyMMdd").format(c.getTime());
	    //String mothed=new SimpleDateFormat( "yyyyMM ").format(c1.getTime());
	    //String year =new SimpleDateFormat( "yyyy").format(c.getTime());
		return yesterday;
	}
	

	@SuppressWarnings("unchecked")
	public Object process(Object o) {
		Map mp = MapUtil.getMap(o);
		int type = Integer.parseInt(mp.get("type").toString());
		Map  data =MapUtil.getMap(mp.get("data"));
		String query = (String)data.get("query");
		
		switch (type) {		
		case 0: //查
			return SpringManager.getArrayFindDao().find(query);
		case 1: //增
			return 0;
		case 2 : //删
			return 0;
		case 11: //单表头下载
			return downExcel(data);
		case 12: //单表头下载(分sheet页下载)
			return downExcelBySheet(data);
		case 13: //页面数据下载
			return otherdownExcel(data);
		default :
			return 0;
		}
		
	}

	//单表头下载
	public Object downExcel(Object data) {
		Map md = MapUtil.getMap(data);
		String sql = md.get("sql").toString();
		List listdata = SpringManager.getArrayFindDao().find(sql);
		
		//处理第一列，前提是第一列的内容要是 地名-编码 的格式
		for(Object[] objs:(List<Object[]>)listdata){
			if(objs!=null&&objs.length>0){
				String areaName=String.valueOf(objs[0]);
				if (areaName.lastIndexOf("-") != -1) {
					objs[0]=areaName.substring(0, areaName.lastIndexOf("-"));
				}
			}
			
		}
		
		List listname = (List) md.get("contname");
		return _downWithTemplate(md, listdata, listname);
	}
	
	protected Object _downWithTemplate(Map md, List datalist, List listname) {
		String excelModalFile = (String) md.get("excelModal");
		String exportFile = UUIDUtil.generate() + ".xls";
		int startRow = NumberUtil.toInt(md.get("startRow"));
		int startCol = NumberUtil.toInt(md.get("startCol"));
		int cols = NumberUtil.toInt(md.get("cols"));
		String sheetname = (String) md.get("sheetname");
		// List excelData = (List) md.get("excelData");
		
		String excelModalFolder = Config.getProperty("Folder.excelModal");
		String downFolder = Config.getProperty("Folder.down");

		excelModalFile = SpringServlet.getRealPath(excelModalFolder + "/"
				+ excelModalFile);
		exportFile = SpringServlet.getRealPath(downFolder + "/" + exportFile);
		ExcelTemplate ee = new ExcelTemplate();
		ee.setStartRow(startRow);
		ee.setStartCol(startCol);
		ee.setCols(cols);
		ee.setData(datalist);
		ee.setName(listname);
		ee.setSheetName(sheetname);
		ee.setExcelModalFile(new File(excelModalFile));
		ee.setExportFile(new File(exportFile));
		ee.print();
		return exportFile;
	}
	
	
	/**
	 * 
	* @Title: downExcel1
	* @Description: 单表头下载（分sheet页）
	* @param @param data
	* @param @return    
	* @return Object
	 */
	public Object downExcelBySheet(Object data) {
		
		Map md = MapUtil.getMap(data);
		String sql = md.get("sql").toString();
		List listname = (List) md.get("contname");
		String sheetname=(String) md.get("sheetname");
		
		int allsize=0;
    	int maxsize=40000;
    	
    	String createfilename=UUIDUtil.generate();
    	String exportFile =createfilename  + ".xls";
    	String downFolder = Config.getProperty("Folder.down");
    	exportFile = SpringServlet.getRealPath(downFolder + "/" + exportFile);
    	
    	List listall=SpringManager.getArrayFindDao().find("select count(*) from ("+sql+")");
		Object[] countobj=(Object[]) listall.get(0);
		allsize=Integer.parseInt(countobj[0].toString());
		List datalist;
		
		try {
		    if(allsize>10000){
		    	ExcelTemplate excel=new ExcelTemplate();
				excel.setName(listname);
			    excel.setSheetName(sheetname);
				OutputStreamWriter writer;
				writer = new OutputStreamWriter(new FileOutputStream(exportFile),"UTF-8");
				writer.write(excel.createhead());
				int len=allsize%maxsize==0?allsize/maxsize:allsize/maxsize+1;
				int less,more;
				for(int i=0;i<len;i++){
					 String datacon="";
					 if(i<len-1){
						 int all=maxsize*i+maxsize;
						 less = all;
						 more = maxsize*i;
					 }else{
					     less = allsize;
					     more = maxsize*i;
					 }
						 
					 datalist = SpringManager.getArrayFindDao().find("select * from ( select a.*,rownum r from("+sql+" )a  where rownum <="+less+" ) b where r>"+more);
					 excel.createSheet(writer, datalist, i);
						
				 }
				 writer.write("</Workbook>");
				 writer.flush();
				 writer.close();
				 return exportFile;
			}else{
				 String datacon="[["+allsize+"],[0]]"; 
				 datalist = SpringManager.getArrayFindDao().find("select * from ( select a.*,rownum r from("+sql+" )a  where rownum <="+allsize+" ) b where r>0");
			     return	_downWithTemplate(md,datalist,listname);
             } 
		  }catch (Exception e) {
			  e.printStackTrace(); 
		  }
		return _downWithTemplate(md, null, null);
	}
	
	public Object otherdownExcel(Object data){
		Map md = MapUtil.getMap(data);
		List listdata=(List)md.get("context");
		List listname=(List)md.get("head");
		return DownExcelHehelper.downpageTemplate(md,listdata,listname);
	}

}
