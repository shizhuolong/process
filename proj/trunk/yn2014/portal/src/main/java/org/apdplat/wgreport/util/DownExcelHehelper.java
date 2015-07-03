package org.apdplat.wgreport.util;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.apdplat.wgreport.model.ExcelTemplate;
import org.apdplat.wgreport.support.servlets.SpringServlet;


public class DownExcelHehelper {

	public static Object downpageTemplate(Map md,List datalist,List listname) {
		String excelModalFile = (String) md.get("excelModal");
		String exportFile = UUIDUtil.generate() + ".xls";
		int startRow = NumberUtil.toInt(md.get("startRow"));
		int startCol = NumberUtil.toInt(md.get("startCol"));
		int cols = NumberUtil.toInt(md.get("cols"));
        String sheetname=(String) md.get("sheetname");
		/*String excelModalFolder = Config.getProperty("Folder.excelModal");
		String downFolder = Config.getProperty("Folder.down");*/
        String excelModalFolder = "/wgreport/excelModal";
		String downFolder = "/wgreport/download";

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
		ee.println();
		return exportFile;
	}
	public static Object downDataBaseSingleTemplate(Map md,List datalist,List listname) {
		String excelModalFile = (String) md.get("excelModal");
		String exportFile = UUIDUtil.generate() + ".xls";
		int startRow = NumberUtil.toInt(md.get("startRow"));
		int startCol = NumberUtil.toInt(md.get("startCol"));
		int cols = NumberUtil.toInt(md.get("cols"));
        String sheetname=(String) md.get("sheetname");
		//List excelData = (List) md.get("excelData");

		/*String excelModalFolder = Config.getProperty("Folder.excelModal");
		String downFolder = Config.getProperty("Folder.down");*/
        String excelModalFolder = "/wgreport/excelModal";
		String downFolder = "/wgreport/download";

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
	public static Object downMoreDataBaseTemplate(Map md,List datalist,List listname,List typename,List typespan) {
		String excelModalFile = (String) md.get("excelModal");
		String exportFile = UUIDUtil.generate() + ".xls";
		int startRow = NumberUtil.toInt(md.get("startRow"));
		int startCol = NumberUtil.toInt(md.get("startCol"));
		int cols = NumberUtil.toInt(md.get("cols"));
		/*String excelModalFolder = Config.getProperty("Folder.excelModal");
		String downFolder = Config.getProperty("Folder.down");*/
		String excelModalFolder = "/wgreport/excelModal";
		String downFolder = "/wgreport/download";
		
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
	
}
