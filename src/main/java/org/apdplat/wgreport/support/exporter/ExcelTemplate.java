package org.apdplat.wgreport.support.exporter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apdplat.wgreport.util.IOUtil;

/**
 * 根据模板导出excel
 * 
 * 
 */
public class ExcelTemplate {
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
			HSSFRow _modalRow = sheet.getRow(startRow);
			HSSFCell _modalCell = null;

			HSSFRow _currentRow = null;
			HSSFCell _currentCell = null;

			HSSFCellStyle _rowStyle = _modalRow.getRowStyle();
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
				Object[] os = (Object[]) data.get(i);
				for (int j = 0, jmax = os.length; j < jmax; j++) {
					if (cols > -1 && (j >= cols))
						break;
					Object _value = os[j];
					_modalCell = _modalRow.getCell(startCol + j);

					_currentCell = _currentRow.getCell(startCol + j);
					if (_currentCell == null)
						_currentCell = _currentRow.createCell(startCol + j);
					if (_modalCell != null) {
						_currentCell.setCellStyle(_modalCell.getCellStyle());
						_currentCell
								.setCellComment(_modalCell.getCellComment());
					}

					if (_value == null) {
						_currentCell.setCellType(HSSFCell.CELL_TYPE_BLANK);
					} else if (_value instanceof Boolean) {
						_currentCell.setCellValue(((Boolean) _value)
								.booleanValue());
					} else if (_value instanceof Number) {
						_currentCell.setCellValue(((Number) _value)
								.doubleValue());
					} else if (_value instanceof Date) {
						_currentCell.setCellValue((Date) _value);
					} else
						_currentCell.setCellValue(new HSSFRichTextString(_value
								.toString()));
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