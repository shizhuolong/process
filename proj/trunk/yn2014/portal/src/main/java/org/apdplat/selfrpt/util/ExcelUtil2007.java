package org.apdplat.selfrpt.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apdplat.selfrpt.model.Excel;
import org.apdplat.selfrpt.model.Page;

public class ExcelUtil2007 {
	public static String[] rex = { "", "^\\S+$", "^-?\\d+$", "^[-\\+]?[.\\d]*$", "^1(3[0-2]|5[56]|8[56])\\d{8}$" };
	public static String[] rexErrorMsg = { "不验证", "不能为空", "为空或不是整数", "为空或不是实数", "为空或非联通手机号" }; // 错误提示信息

	public static Page getDataListComm(Excel e) {
		String tableName = e.getTableName();
		String colName2 = e.getColNames(); 
		String importIndexs[] = e.getImportIndex().split(";");
		String checkIndexs[] = e.getCheckIndex().split(";");
		int beginRow = e.getBeginRow();
		String userID = e.getUserID();
		String userName = e.getUserName();
		String operateTime = e.getOperateTime();
		int sheetIndex = e.getSheetIndex();
		String filePath = e.getFilePath();

		// 读取excel数据
		@SuppressWarnings("resource")
		HSSFWorkbook book = new HSSFWorkbook();
		List<Object> errorList= new ArrayList<Object>(),errorList2= new ArrayList<Object>(),dataList= new ArrayList<Object>(); 
		InputStream is = null;
		int i = 0,j = 0, index = 0;
		String sql = "", cellContent = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			is = new FileInputStream(new File(filePath));
			Sheet sheet = book.getSheetAt(sheetIndex);// get到Sheet对象
			int rsColumns = importIndexs.length;  
			StringBuffer sb = new StringBuffer();
			boolean isRowNull, isRightCell, isRightData;
			for (Row row : sheet) {
				sb.setLength(0);
				index = 0;
				isRowNull = false;// 改行是不是全部为空
				errorList2.clear();//存放当前行的验证信息
				for (j = 0; j < rsColumns; j++) { 
					isRightCell = true;
					Cell cell = row.getCell(j); 
				 	cellContent = "";
					index = Integer.valueOf(checkIndexs[j]);
					if (cell != null) {
						if (cell.getCellType() == Cell.CELL_TYPE_STRING){ // 读取String
							cellContent = cell.getRichStringCellValue().toString();
						}else if(cell.getCellType() == Cell.CELL_TYPE_NUMERIC || cell.getCellType() == Cell.CELL_TYPE_FORMULA){
							cellContent = cell.getDateCellValue().toString(); 
							if (DateUtil.isCellDateFormatted(cell)) {// 读取日期格式
								cellContent = sdf.format(cell.getDateCellValue());  
							} else {// 读取数字和公式
								double namberValue = cell.getNumericCellValue();
								if (namberValue == (long) namberValue) { // 是整数，去掉小数点后面为都0的数据
									cellContent = String.valueOf((long) namberValue);
								} else {
									cellContent = String.valueOf(namberValue);
									if (cellContent.indexOf("E") > 0) { // 科学计数法
										BigDecimal db = new BigDecimal(cellContent);
										cellContent = db.toPlainString(); // 数据库若为字段为字符类,则和excel数字一致;若为字段数字型,数字很大10亿,则后面小数为保留4位完全一致
									}
								}
							} 
						}else if(cell.getCellType() == Cell.CELL_TYPE_BOOLEAN){ // 得到Boolean对象的方法
							cellContent = cell.getBooleanCellValue() + "";
						}else if(cell.getCellType() == Cell.CELL_TYPE_ERROR){
							cellContent = String.valueOf(cell.getErrorCellValue());
							isRightCell = false;
						}else {
							cellContent = "";
						} 
					}
					cellContent = cellContent.trim();
					cellContent = cellContent.replaceAll("\n", " ").replaceAll("'", "\""); //修改换行符,防止插入sql异常 
					if(cell!=null){
						System.out.print(cellContent +"("+cell.getCellType()+"), ");
					 }else{
						System.out.print(cellContent +"(EMPTY), ");
					 
					}
					
					if (i >= beginRow) {
						isRightData = ExcelUtil.checkData(rex[index], cellContent);
						if (isRightCell && isRightData) {
							sb.append("'" + cellContent + "',");
						} else {
							if (!isRightCell) { // 单元格公式错误 
								errorList2.add((char) (65 + j) + "" + (i + beginRow) + "@单元格(公式)错误 " + cellContent);
							} else {
								errorList2.add((char) (65 + j) + "" + (i + beginRow) + "@" + rexErrorMsg[index]);
							} 
						}
						if (!cellContent.equals("")) {
							isRowNull = true;
						}
					}
				}
				System.out.println();
				if (i >= beginRow && isRowNull) { // 若当前行不全为空，则从数据起始行开始读取数据
					if(sb.toString().length()>1){
						String value = sb.toString().substring(0, sb.toString().length() - 1);
						sql = "insert into " + tableName + "(" + colName2 + ") values (" + value + ",'" + operateTime + "','" + userName + "','" + userID + "',REPORT_CONFIG_SEQ.nextval)";
						dataList.add(sql);
					}
					errorList.addAll(errorList2);//不全为空才加入当前行的验证信息					
				}
				i++;
			}
		} catch (Exception e1) {
			e1.printStackTrace();
			errorList.add((char) (65 + j) + "" + (i + beginRow) + "@单元格(公式)错误 " + cellContent);
		} finally {
			try {
				if (is != null) {
					is.close();
				}
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
		Page page = new Page();
		page.setList(errorList);
		page.setList2(dataList);
		return page;
	} 
}
