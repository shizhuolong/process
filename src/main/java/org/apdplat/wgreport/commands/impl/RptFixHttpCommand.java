package org.apdplat.wgreport.commands.impl;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apdplat.wgreport.commands.HttpCommand;
import org.apdplat.wgreport.common.SpringManager;
import org.apdplat.wgreport.model.ExcelTemplate;
import org.apdplat.wgreport.support.preferense.Config;
import org.apdplat.wgreport.support.servlets.SpringServlet;
import org.apdplat.wgreport.util.MapUtil;
import org.apdplat.wgreport.util.NumberUtil;
import org.apdplat.wgreport.util.UUIDUtil;


public class RptFixHttpCommand extends AbstractHttpCommand implements HttpCommand {
	
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
		Map md = MapUtil.getMap(o);
		int type = NumberUtil.toInt(md.get("type"));
		Map data = MapUtil.getMap(md.get("data"));
		String query = (String)data.get("query");
		Object [] values = null;
		
		switch (type) {
			case 0:
				break;
			case 1: //分页数据列表
				//result = _pageData(data);
				int first = NumberUtil.toInt(data.get("first"));
				int limit = NumberUtil.toInt(data.get("limit"));
				
				return SpringManager.getArrayFindDao().find(query, first, limit);
			case 2: //计算总页数
				int cnt = SpringManager.getArrayFindDao().count(query,values);
				return cnt;
			case 11: //单表头下载
				return downExcel(data);
			case 12: //双表头下载
				return downScaDoubleHeadExcel(data);
			default: //普通数组查询
				return SpringManager.getArrayFindDao().find(query);
		}
		return null;
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
	
	
	//多表头下载
	public Object downScaDoubleHeadExcel(Object data) {
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
		
		List listname=(List)md.get("contname");
		List typename=(List)md.get("typename");
		List typespan=(List)md.get("typespan");
		return _downWithTemplateDoubleHead(md,listdata,listname,typename,typespan);
	}
	
	protected Object _downWithTemplateDoubleHead(Map md,List datalist,List listname,List typename,List typespan) {
		String excelModalFile = (String) md.get("excelModal");
		String exportFile = UUIDUtil.generate() + ".xls";
		int startRow = NumberUtil.toInt(md.get("startRow"));
		int startCol = NumberUtil.toInt(md.get("startCol"));
		int cols = NumberUtil.toInt(md.get("cols"));

		//List excelData = (List) md.get("excelData");

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
		ee.setFirstname(typename);
		ee.setName(listname);
		
		ee.setSpan(typespan);
		ee.setExcelModalFile(new File(excelModalFile));
		ee.setExportFile(new File(exportFile));
		ee.printMore();

		return exportFile;
	}
	
	
	/*获取分页数据列表
	protected List _pageData(Object data) {
		Map md = MapUtil.getMap(data);
		int first = NumberUtil.toInt(md.get("first"));
		int limit = NumberUtil.toInt(md.get("limit"));
		String query = (String) md.get("query");
		//return getArrayFindDao().find(qf.getQuery(), qf.getParameters(), first, limit);
		return SpringManager.getArrayFindDao().find(query, first, limit);
		
	}
	
	//获取sql语句
	protected String _getQuery(String key, Map md) {
		String query = null;
		String queryKey = (String) md.get(key);
		if (StringUtil.isNotNull(queryKey))
			query = Config.getProperty(queryKey);
		
		if (StringUtil.isNull(query))
			query = (String) md.get("query");
		return StringUtil.nullTrim(query);
	}
	*/
	
	
	
}
