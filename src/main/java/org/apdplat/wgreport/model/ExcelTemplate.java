package org.apdplat.wgreport.model;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.Region;
import org.apdplat.wgreport.support.exporter.ExportException;
import org.apdplat.wgreport.util.IOUtil;
import org.apdplat.wgreport.util.StringUtil;


public class ExcelTemplate {
	static Log logger = LogFactory.getLog(ExcelTemplate.class);
	private int startRow;
	private int startCol;
	private int cols = -1;
	private List data;
	private File excelModalFile;
	private File exportFile;
	private List name;
	private List firstname;
	private List span;
    private String sheetName;
	public int getStartRow() {
		return startRow;
	}

	public void setStartRow(int startRow) {
		this.startRow = startRow;
	}

	public int getStartCol() {
		return startCol;
	}

	public void setStartCol(int startCol) {
		this.startCol = startCol;
	}

	public int getCols() {
		return cols;
	}

	public List getName() {
		return name;
	}

	public void setName(List name) {
		this.name = name;
	}

	public void setCols(int cols) {
		this.cols = cols;
	}

	public List getData() {
		return data;
	}

	public void setData(List data) {
		this.data = data;
	}

	public File getExcelModalFile() {
		return excelModalFile;
	}

	public void setExcelModalFile(File excelModalFile) {
		this.excelModalFile = excelModalFile;
	}

	public File getExportFile() {
		return exportFile;
	}

	public void setExportFile(File exportFile) {
		this.exportFile = exportFile;
	}
	
	public List getFirstname() {
		return firstname;
	}

	public void setFirstname(List firstname) {
		this.firstname = firstname;
	}

	public List getSpan() {
		return span;
	}

	public void setSpan(List span) {
		this.span = span;
	}

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public void print() {
		FileInputStream fileIn = null;
		FileOutputStream fileOut = null;
		HSSFWorkbook wb = new HSSFWorkbook();
		String str="^[-+]?\\d+|[-+]?(\\d*\\.)?\\d+";
		try {
			fileIn = new FileInputStream(excelModalFile);
			HSSFSheet sheet = wb.createSheet(sheetName);
			HSSFRow row0 = sheet.createRow(0);
			HSSFCellStyle  dateStyle = wb.createCellStyle();
		
			for(int t = 0 ; t < name.size() ; t++){
				 row0.createCell(t).setCellValue((String)name.get(t));
			}
			HSSFRow row;
			int size = data.size();
			for (int i = 0, imax = size; i < imax; i++) {
				row = sheet.createRow(i+1);
				Object[] os = (Object[]) data.get(i);
				for (int j = 0; j < name.size(); j++) {
					if (cols > -1 && (j >= cols))
						break;
					String _value;
					if(StringUtil.isNull(os[j])){
						_value = "";
					}else{
					 _value = os[j].toString();
					}
					Object value;
					if (_value.matches(str)){
						//value=Double.parseDouble(_value);
						value=_value;
					}else {
						value=_value;
					}
					if(value instanceof String){
						row.createCell(j).setCellValue((String)value);
					}
					else if(value instanceof Long){
						row.createCell(j).setCellValue((Long)value);
					}
					else if(value instanceof Integer){
						row.createCell(j).setCellValue((Integer)value);
					}
					else if(value instanceof Date){
						row.createCell(j).setCellValue((Date)value);
					}
					else if(value instanceof Calendar){
						row.createCell(j).setCellValue((Calendar)value);
					}
					else if(value instanceof Boolean){
						row.createCell(j).setCellValue((Boolean)value);
					}
					else if(value instanceof Double){
						row.createCell(j).setCellValue((Double)value);
					}
				}
			}
			// Write the output to a file
			fileOut = new FileOutputStream(exportFile);
			wb.write(fileOut);
		} catch (IOException e) {
			throw new ExportException(e);
		} finally {
			IOUtil.close(fileOut);
			IOUtil.close(fileIn);
		}
	}
	public void println() {
		FileInputStream fileIn = null;
		FileOutputStream fileOut = null;
		HSSFWorkbook wb = new HSSFWorkbook();
		String str="^[-+]?\\d+|[-+]?(\\d*\\.)?\\d+";
		try {
			fileIn = new FileInputStream(excelModalFile);
			HSSFSheet sheet = wb.createSheet(sheetName);
			HSSFRow row0 = sheet.createRow(0);
			HSSFCellStyle  dateStyle = wb.createCellStyle();
			
			for(int t = 0 ; t < name.size() ; t++){
				row0.createCell(t).setCellValue((String)name.get(t));
			}
			HSSFRow row;
			int size = data.size();
			for (int i = 0, imax = size; i < imax; i++) {
				row = sheet.createRow(i+1);
				List os = (List) data.get(i);
				for (int j = 0; j < name.size(); j++) {
					if (cols > -1 && (j >= cols))
						break;
					String _value;
					if(StringUtil.isNull(os.get(j))){
						_value = "";
					}else{
						_value = os.get(j).toString().replaceAll( "\\s+ ", " ");
					}
					Object value;
					if (_value.matches(str)){
						//value=Double.parseDouble(_value);
						value=_value;
					}else {
						value=_value;
					}
					if(value instanceof String){
						row.createCell(j).setCellValue((String)value);
					}
					else if(value instanceof Long){
						row.createCell(j).setCellValue((Long)value);
					}
					else if(value instanceof Integer){
						row.createCell(j).setCellValue((Integer)value);
					}
					else if(value instanceof Date){
						row.createCell(j).setCellValue((Date)value);
					}
					else if(value instanceof Calendar){
						row.createCell(j).setCellValue((Calendar)value);
					}
					else if(value instanceof Boolean){
						row.createCell(j).setCellValue((Boolean)value);
					}
					else if(value instanceof Double){
						row.createCell(j).setCellValue((Double)value);
					}
				}
			}
			// Write the output to a file
			fileOut = new FileOutputStream(exportFile);
			wb.write(fileOut);
		} catch (IOException e) {
			throw new ExportException(e);
		} finally {
			IOUtil.close(fileOut);
			IOUtil.close(fileIn);
		}
	}
	
	public void printxml(){
		 
		
	}
  

	public void createText(OutputStreamWriter writer,List list){
		try {
			for (int i =0;i<list.size(); i++) {
				Object[] os = (Object[]) list.get(i);
				String rows=createrowtxt(os);
				writer.write(rows);
			}
		} catch (Exception e) {}	
	}
	
	public String createrowtxt(Object[] obj){
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<obj.length-1;i++){
			String _value;
			if(StringUtil.isNull(obj[i])){
				_value = "";
			}else{
			 _value = obj[i].toString();
			}
			sb.append(_value);
			sb.append("\t");
			if(i==obj.length-2){
				sb.append("\r\n");
			}
		}
		return sb.toString();
	}
	public String createrowtxt(List obj){
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<obj.size();i++){
			String _value;
			if(StringUtil.isNull(obj.get(i))){
				_value = "";
			}else{
				_value = obj.get(i).toString();
			}
			sb.append(_value);
			sb.append("\t");
			if(i==obj.size()-1){
				sb.append("\r\n");
			}
		}
		return sb.toString();
	}
	
	public void createSheet(OutputStreamWriter writer,List list,int num){
		try {
			
			writer.write("<Worksheet ss:Name=\""+sheetName+num+"\">");
			writer.write("<Table >");
			String head=craterow(name);
			writer.write(head);
			for (int i =0;i<list.size(); i++) {
				Object[] os = (Object[]) list.get(i);
				String rows=craterow(os);
				writer.write(rows);
			}
			writer.write("</Table>");
			writer.write(createoption());
			writer.write("</Worksheet>");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public String craterow(Object[] obj){
		StringBuffer row=new StringBuffer();
		String str="^[-+]?\\d+|[-+]?(\\d*\\.)?\\d+";
		String type="";
		row.append("<Row>");
		for(int i=0;i<obj.length-1;i++){
			String _value;
			if(StringUtil.isNull(obj[i])){
				_value = "";
			}else{
				_value = obj[i].toString().replace("/", "\\");
				_value = _value.replace("<", "(");
				_value = _value.replace(">", ")");
			}
		    type="String";
			row.append(" <Cell><Data ss:Type=\"");
			row.append(type+"\">");
			row.append(_value);
			row.append("</Data></Cell>");
		}
		row.append(" </Row>");
		return row.toString();
	}
	
	public String craterow(List list){
		StringBuffer sb=new StringBuffer();
		String str="^[-+]?\\d+|[-+]?(\\d*\\.)?\\d+";
		String type="";
		sb.append("<Row>");
		for(int i=0;i<list.size();i++){
			String _value = list.get(i).toString();
			if(_value.indexOf("/")!=-1){
				_value = _value.replace("/", "\\");
			}
			if(_value.indexOf("<")!=-1){
				_value = _value.replace("<", "(");
			}
			if(_value.indexOf(">")!=-1){
				_value = _value.replace(">", ")");
			}
			sb.append(" <Cell><Data ss:Type=\"String\">");
			sb.append(_value);
			sb.append("</Data></Cell>");
		}
		sb.append(" </Row>");
		return sb.toString();
	}
	
	public String createoption(){
		String str="<WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">"+
                   "<ProtectObjects>False</ProtectObjects>"+
                   "<ProtectScenarios>False</ProtectScenarios>"+
                   "</WorksheetOptions>";
		return str;
	}
	
	public String createhead(){
		StringBuffer sb= new StringBuffer();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		sb.append("<?xml version=\"1.0\" ?><?mso-application progid=\"Excel.Sheet\"?><Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"");
		sb.append(" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\"");
		sb.append(" xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\" xmlns:html=\"http://www.w3.org/TR/REC-html40\">");
		sb.append(" <DocumentProperties xmlns=\"urn:schemas-microsoft-com:office:office\">  <Author>si-tech</Author>  <LastAuthor>si-tech</LastAuthor>");
		sb.append(" <Created>");
		sb.append(dateFormat.format(new Date()));
		sb.append("T03:44:52Z</Created><Company>si-tech</Company><Version>11.9999</Version></DocumentProperties>");
		sb.append("<ExcelWorkbook xmlns=\"urn:schemas-microsoft-com:office:excel\"><WindowHeight>6195</WindowHeight><WindowWidth>10635</WindowWidth><WindowTopX>240</WindowTopX><WindowTopY>30</WindowTopY><ActiveSheet>1</ActiveSheet>");
		sb.append("<ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook>");
		sb.append("<Styles><Style ss:ID=\"Default\" ss:Name=\"Normal\"><Alignment ss:Vertical=\"Center\"/><Borders/><Font/><Interior/><NumberFormat/><Protection/></Style></Styles>");

		return sb.toString();
	}
	
	public void printMore() {
		FileInputStream fileIn = null;
		FileOutputStream fileOut = null;
		HSSFWorkbook wb = new HSSFWorkbook();
		String str="^[-+]?\\d+|[-+]?(\\d*\\.)?\\d+";
		try {
			fileIn = new FileInputStream(excelModalFile);
			HSSFSheet sheet = wb.createSheet("result");
			HSSFRow row0 = sheet.createRow(0);
			HSSFRow row1 = sheet.createRow(1);
			HSSFCellStyle  dateStyle = wb.createCellStyle();
			
			int type_span=span.size();
			int typespan[]=new int[type_span];
			for(int a=0;a<type_span;a++){
				if(a==0){
					typespan[a]=Integer.parseInt(span.get(a).toString());
				}else{
					typespan[a]=Integer.parseInt(span.get(a).toString())+typespan[a-1];
				}
			}
			int temp=0;
			for(int i=0;i<type_span;i++){
				sheet.addMergedRegion(new CellRangeAddress(0,(short)(1+temp),0,(short)(typespan[i])));
				//修改于20150227
				//sheet.addMergedRegion(new Region(0,(short)(1+temp),0,(short)(typespan[i])));
				row0.createCell(temp+1).setCellValue((String)firstname.get(i));
				temp=typespan[i];
			}
			for(int t = 0 ; t < name.size() ; t++){
				 row1.createCell(t).setCellValue((String)name.get(t));
			}
			HSSFRow row;
			int size = data.size();
			for (int i = 0, imax = size; i < imax; i++) {
				row = sheet.createRow(i+2);
				Object[] os = (Object[]) data.get(i);
				for (int j = 0; j < name.size(); j++) {
					if (cols > -1 && (j >= cols))
						break;
					String _value;
					if(StringUtil.isNull(os[j])){
						_value = "";
					}else{
					 _value = os[j].toString();
					}
					Object value;
					if (_value.matches(str)){
						value=Double.parseDouble(_value);
					}else {
						value=_value;
					}
					if(value instanceof String){
						row.createCell(j).setCellValue((String)value);
					}
					else if(value instanceof Long){
						row.createCell(j).setCellValue((Long)value);
					}
					else if(value instanceof Integer){
						row.createCell(j).setCellValue((Integer)value);
					}
					else if(value instanceof Date){
						row.createCell(j).setCellValue((Date)value);
					}
					else if(value instanceof Calendar){
						row.createCell(j).setCellValue((Calendar)value);
					}
					else if(value instanceof Boolean){
						row.createCell(j).setCellValue((Boolean)value);
					}
					else if(value instanceof Double){
						row.createCell(j).setCellValue((Double)value);
					}
				}
			}
			// Write the output to a file
			fileOut = new FileOutputStream(exportFile);
			wb.write(fileOut);
		} catch (IOException e) {
			throw new ExportException(e);
		} finally {
			IOUtil.close(fileOut);
			IOUtil.close(fileIn);
		}
	}

}
