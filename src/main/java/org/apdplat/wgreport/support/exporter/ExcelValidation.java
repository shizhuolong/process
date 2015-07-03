package org.apdplat.wgreport.support.exporter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddressList;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apdplat.wgreport.util.IOUtil;


public class ExcelValidation {
	private int startRow;
	private int startCol;
	private int cols = -1;
	private List data;
	private File excelModalFile;
	private File exportFile;

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

	public void print() {
		FileInputStream fileIn = null;
		FileOutputStream fileOut = null;
		try {
			fileIn = new FileInputStream(excelModalFile);
			POIFSFileSystem fs = new POIFSFileSystem(fileIn);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			
			HSSFSheet sheet = wb.getSheetAt(0);
			
			HSSFRow _modalRow = sheet.getRow(startRow); //获取第一行对象
			
			HSSFCell _modalCell = null;
			
			HSSFRow _currentRow = null;
			HSSFCell _currentCell = null;

			HSSFCellStyle _rowStyle = _modalRow.getRowStyle(); //获取第一行样式
			if (_rowStyle == null)
				_rowStyle = wb.createCellStyle();
			int size = data.size();
			if (size == 0) {// 删除模式行
				sheet.removeRow(_modalRow);
			}
			for (int i = 0, imax = size; i < imax; i++) {
				_currentRow = sheet.getRow(startRow + i);
				if (_currentRow == null)
					_currentRow = sheet.createRow(startRow + i);
				
				_currentRow.setRowStyle(_rowStyle);
				
				Object[] obj = (Object[]) data.get(i);
				int a = 0;
				for(int j = 0; j < obj.length; j++){
					String[] str = obj[j].toString().split(":");
					
					Object  key  = str[0];
					
					String str1="";
					
					if(str.length>1)
						str1 = str[1];
					
					String[] value=null;
					
					if(!str1.equals(""))
						value= str1.split(",");
					
					if (cols > -1 && (j >= cols))
						break;
		    		
		    		_modalCell = _modalRow.getCell(startCol + j);

					_currentCell = _currentRow.getCell(startCol + j);
					if (_currentCell == null)
						_currentCell = _currentRow.createCell(startCol + j);
					if (_modalCell != null) {
						_currentCell.setCellStyle(_modalCell.getCellStyle());
						_currentCell
								.setCellComment(_modalCell.getCellComment());
					}

					if (key == null) {
						_currentCell.setCellType(HSSFCell.CELL_TYPE_BLANK);
					} else if (key instanceof Boolean) {
						_currentCell.setCellValue(((Boolean) key)
								.booleanValue());
					} else if (key instanceof Number) {
						_currentCell.setCellValue(((Number) key)
								.doubleValue());
					} else if (key instanceof Date) {
						_currentCell.setCellValue((Date) key);
					} else
					{
						_currentCell.setCellValue(new HSSFRichTextString(key
								.toString()));
					
						if(str1.length()<255 && value!=null && !str1.equals("")){
							//调用接口方法加载数据有效性
							HSSFDataValidation  data_validation = setDataValidation(1, (short)(1), j,(short)(j),value);    	   

					         sheet.addValidationData(data_validation); // 添加到sheet页
						}
						
					}
				}
				
			    
			}
			

			HSSFSheet sheet2 = wb.getSheetAt(1);
			HSSFRow _modalRow2 = sheet2.getRow(startRow); //获取第一行对象

			HSSFCell _modalCell2 = null;
			
			HSSFRow _currentRow2 = null;
			HSSFCell _currentCell2 = null;
			
			if (size == 0) {// 删除模式行
				sheet2.removeRow(_modalRow2);
			}
			for (int i = 0, imax = size; i < imax; i++) {
				Object[] obj = (Object[]) data.get(i);
				for(int j = 0; j < obj.length; j++){
					
					_currentRow2 = sheet2.getRow(startRow + i);
					
					if (_currentRow2 == null)
						_currentRow2 = sheet2.createRow(startRow + i);
					
					_currentRow2.setRowStyle(_rowStyle);
					
					String[] str = obj[j].toString().split(":");
					
					Object  key  = str[0];
					
					String str1="";
					
					if(str.length>1)
						str1 = str[1];
					
					String[] value=null;
					
					if(!str1.equals(""))
						value= str1.split(",");
					
					if (cols > -1 && (j >= cols))
						break;
		    		
		    		_modalCell2 = _modalRow2.getCell(startCol + j);

					_currentCell2 = _currentRow2.getCell(startCol + j);
					if (_currentCell2 == null)
						_currentCell2 = _currentRow2.createCell(startCol + j);
					if (_modalCell2 != null) {
						_currentCell2.setCellStyle(_modalCell2.getCellStyle());
						_currentCell2
								.setCellComment(_modalCell2.getCellComment());
					}

					if (key == null) {
						_currentCell2.setCellType(HSSFCell.CELL_TYPE_BLANK);
					} else if (key instanceof Boolean) {
						_currentCell2.setCellValue(((Boolean) key)
								.booleanValue());
					} else if (key instanceof Number) {
						_currentCell2.setCellValue(((Number) key)
								.doubleValue());
					} else if (key instanceof Date) {
						_currentCell2.setCellValue((Date) key);
					} else
					{
						_currentCell2.setCellValue(new HSSFRichTextString(key
								.toString()));
					
						if(!str1.equals("")){
							for(int k = 0 ;k < value.length; k ++){
								Object value1= value[k];
								_currentRow2 = sheet2.getRow(k+1);
								if (_currentRow2 == null)
									_currentRow2 = sheet2.createRow(k+1);

								_currentCell2 = _currentRow2.getCell(j);
								if (_currentCell2 == null)
									_currentCell2 = _currentRow2.createCell( j);
							
								if (value1 == null) {
									_currentCell2.setCellType(HSSFCell.CELL_TYPE_BLANK);
								} else if (value1 instanceof Boolean) {
									_currentCell2.setCellValue(((Boolean) value1)
											.booleanValue());
								} else if (value1 instanceof Number) {
									_currentCell2.setCellValue(((Number) value1)
											.doubleValue());
								} else if (value1 instanceof Date) {
									_currentCell2.setCellValue((Date) value1);
								} else
								{
									_currentCell2.setCellValue(new HSSFRichTextString(value1
											.toString()));
								}
							}
						}
						
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
	
	
	public HSSFDataValidation setDataValidation(int beginRowindex, short beginColindex,   
            int endRowindex, short endColindex, String[] strArray) {   
  
		  DVConstraint constraint = DVConstraint.createExplicitListConstraint(strArray);
		  
        // 设置数据有效性加载在哪个单元格上。   
        // 四个参数分别是：起始行、终止行、起始列、终止列   
        CellRangeAddressList regions = new CellRangeAddressList(beginRowindex,   
        		beginColindex, endRowindex, endColindex);   
  
        // 数据有效性对象   
        HSSFDataValidation data_validation = new HSSFDataValidation(regions, constraint);   
        // data_validation.createErrorBox("Invalidate!", "please input again!");   
  
       return  data_validation;
    }   
  

}