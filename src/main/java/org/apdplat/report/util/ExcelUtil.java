package org.apdplat.report.util;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apdplat.report.devIncome.dao.CommanDao;

public class ExcelUtil {
	private static int sheetSize=10000;
	public static void main(String[] args) throws Exception {

		FileOutputStream os = new FileOutputStream("D:\\workbook.xls");
		int l = 0;
		String titles = "账期,地市名称,移动宽带发展通报,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,||,,移动宽带发展合计,,,,,,,,3G自备机升级版,,,,,,,4G新发展,,,,,,,,,,,沃快,,,,,,,其它,,,,,,,小流量卡,||,,分公司上报,,实际完成,,,,完成率 ,,分公司上报,,实际完成,,,完成率 ,,分公司上报,,实际完成,,,完成率 ,,其中套餐占比,,,,分公司上报,,实际完成,,,完成率 ,,分公司上报,,实际完成,,,完成率 ,,当日,累计||,,当日,累计,当日,本月累计,上月累计,环比,当日,累计,当日,累计,当日,累计,环比,当日,累计,当日,累计,当日,累计,环比,当日,累计,本月累计66及以下套餐占比,本月累计76套餐占比,本月累计106及以上套餐占比,本月累计组合套餐占比,当日,累计,当日,累计,环比,当日,累计,当日,累计,当日,累计,环比,当日,累计,,";
		String[] rs = titles.split("\\|\\|");
		List<String[]> ls = new ArrayList<String[]>();
		for (String s : rs) {
			String[] ss = s.split(",", -1);
			ls.add(ss);
			l = ss.length;
		}
		List<String[]> ds = new ArrayList<String[]>();
		for (int y = 0; y < 10000; y++) {
			String[] d = new String[l];
			for (int i = 0; i < l; i++) {
				d[i] = "(" + y + "," + i + ")";
			}
			ds.add(d);
		}
		exportExcel(os, ls, ds);
		os.close();
	}
	private static void createSheet(HSSFWorkbook wb,int index,List<String[]> titles,List<String[]> datas){
		// 创建Excel的工作sheet,对应到一个excel文档的tab
				HSSFSheet sheet = wb.createSheet("sheet"+(index+1));

				// 创建标题样式
				HSSFCellStyle titleStyle = wb.createCellStyle();
				titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				titleStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
				titleStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				titleStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				titleStyle.setLeftBorderColor(HSSFColor.BLACK.index);
				titleStyle.setRightBorderColor(HSSFColor.BLACK.index);
				titleStyle.setTopBorderColor(HSSFColor.BLACK.index);
				titleStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				titleStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				titleStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				titleStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				// 创建body样式
				HSSFCellStyle bodyStyle = wb.createCellStyle();
				bodyStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				bodyStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				bodyStyle.setFillForegroundColor(HSSFColor.WHITE.index);
				bodyStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				bodyStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setLeftBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setRightBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setTopBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				bodyStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				bodyStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				bodyStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);

				// 创建body样式
				HSSFCellStyle bottomStyle = wb.createCellStyle();
				bottomStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				bottomStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				bottomStyle.setFillForegroundColor(HSSFColor.WHITE.index);
				bottomStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				bottomStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setLeftBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setRightBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setTopBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				bottomStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				bottomStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				bottomStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				
				createHeader(sheet, titleStyle, titles);
				createBody(sheet, bodyStyle,bottomStyle, datas, titles.size(),index);
	}
	private static void createPageSheet(HSSFWorkbook wb,int index,List<String[]> titles,CommanDao db,String sql){
		// 创建Excel的工作sheet,对应到一个excel文档的tab
				HSSFSheet sheet = wb.createSheet("sheet"+(index+1));

				// 创建标题样式
				HSSFCellStyle titleStyle = wb.createCellStyle();
				titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				titleStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
				titleStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				titleStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				titleStyle.setLeftBorderColor(HSSFColor.BLACK.index);
				titleStyle.setRightBorderColor(HSSFColor.BLACK.index);
				titleStyle.setTopBorderColor(HSSFColor.BLACK.index);
				titleStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				titleStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				titleStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				titleStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				// 创建body样式
				HSSFCellStyle bodyStyle = wb.createCellStyle();
				bodyStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				bodyStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				bodyStyle.setFillForegroundColor(HSSFColor.WHITE.index);
				bodyStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				bodyStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setLeftBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setRightBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setTopBorderColor(HSSFColor.BLACK.index);
				bodyStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				bodyStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				bodyStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				bodyStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				
				// 创建body样式
				HSSFCellStyle bottomStyle = wb.createCellStyle();
				bottomStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				bottomStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				bottomStyle.setFillForegroundColor(HSSFColor.WHITE.index);
				bottomStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				bottomStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setLeftBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setRightBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setTopBorderColor(HSSFColor.BLACK.index);
				bottomStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				bottomStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				bottomStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				bottomStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				
				createHeader(sheet, titleStyle, titles);
			    createPageBody(sheet, bodyStyle,bottomStyle,db,sql, titles.size(),index,titles.get(0).length);
	}
	public static void exportPageExcel(OutputStream os, List<String[]> titles,CommanDao db,String sql) throws IOException{
		HSSFWorkbook wb = new HSSFWorkbook();
		List<String[]> datas = db.findList("select count(*) from("+sql+")");
		int total=0;
		if(datas!=null&&datas.size()>0){
			try{
				total=Integer.parseInt(datas.get(0)[0]);
			}catch(Exception e){}
		}
		int tIndex=total/sheetSize;
		if(total%sheetSize!=0){
			tIndex++;
		}
		
		for(int i=0;i<tIndex;i++){
			createPageSheet(wb,i,titles,db,sql);
		}
		wb.write(os);
	}
	public static void exportExcel(OutputStream os, List<String[]> titles,
			List<String[]> datas) throws IOException {
		// 创建Excel的工作书册 Workbook,对应到一个excel文档
		HSSFWorkbook wb = new HSSFWorkbook();
		// 创建Excel的工作sheet,对应到一个excel文档的tab
		/*HSSFSheet sheet = wb.createSheet("sheet1");

		// 创建标题样式
		HSSFCellStyle titleStyle = wb.createCellStyle();
		titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		titleStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
		titleStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		titleStyle.setBottomBorderColor(HSSFColor.BLACK.index);
		titleStyle.setLeftBorderColor(HSSFColor.BLACK.index);
		titleStyle.setRightBorderColor(HSSFColor.BLACK.index);
		titleStyle.setTopBorderColor(HSSFColor.BLACK.index);
		titleStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		titleStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		titleStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		titleStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		// 创建body样式
		HSSFCellStyle bodyStyle = wb.createCellStyle();
		bodyStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		bodyStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		bodyStyle.setFillForegroundColor(HSSFColor.WHITE.index);
		bodyStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		bodyStyle.setBottomBorderColor(HSSFColor.WHITE.index);
		bodyStyle.setLeftBorderColor(HSSFColor.BLACK.index);
		bodyStyle.setRightBorderColor(HSSFColor.BLACK.index);
		bodyStyle.setTopBorderColor(HSSFColor.BLACK.index);
		bodyStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		bodyStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		bodyStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		bodyStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);

		// 创建body样式
		HSSFCellStyle bottomStyle = wb.createCellStyle();
		bottomStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		bottomStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		bottomStyle.setFillForegroundColor(HSSFColor.WHITE.index);
		bottomStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		bottomStyle.setBottomBorderColor(HSSFColor.WHITE.index);
		bottomStyle.setLeftBorderColor(HSSFColor.BLACK.index);
		bottomStyle.setRightBorderColor(HSSFColor.BLACK.index);
		bottomStyle.setTopBorderColor(HSSFColor.BLACK.index);
		bottomStyle.setBorderBottom(HSSFCellStyle.BORDER_NONE);
		bottomStyle.setBorderLeft(HSSFCellStyle.BORDER_NONE);
		bottomStyle.setBorderRight(HSSFCellStyle.BORDER_NONE);
		bottomStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);

		createHeader(sheet, titleStyle, titles);
		createBody(sheet, bodyStyle,bottomStyle, datas, titles.size());*/
		if(datas!=null){
			sheetSize=50000;
			int l=datas.size();
			int tIndex=l/sheetSize;
			if(l%sheetSize!=0){
				tIndex++;
			}
			for(int i=0;i<tIndex;i++){
				createSheet(wb,i,titles,datas);
			}
		}
		wb.write(os);
	}

	public static void createHeader(HSSFSheet sheet, HSSFCellStyle titleStyle,
			List<String[]> headData) {
		/**
		 * 合并相同标题的表头，采用横向优先法
		 */
		int tcy = headData.size();
		if (tcy <= 0)
			return;
		int tcx = headData.get(0).length;
		int[][] flag = new int[tcy][tcx];
		for (int y = 0; y < tcy; y++) {
			HSSFRow row = sheet.createRow(y);
			for (int x = 0; x < tcx; x++) {
				HSSFCell cell = row.createCell(x);
				cell.setCellStyle(titleStyle);

				if (flag[y][x] == 1)
					continue;
				int dx = 1, dy = 1;
				String t = headData.get(y)[x];
				for (int i = 1; (x + i) < tcx; i++) {
					if (flag[y][x + i] == 1)
						continue;
					String tnew = headData.get(y)[x + i];
					if (t.equals(tnew) || tnew.trim().equals("")) {
						dx++;
					} else {
						break;
					}
				}
				for (int j = 1; (y + j) < tcy; j++) {
					boolean eq = true;
					for (int i = 0; i < dx; i++) {
						String tnew = headData.get(y + j)[x + i];
						if (!t.equals(tnew) && !tnew.trim().equals("")) {
							eq = false;
							break;
						}
					}
					if (eq) {
						dy++;
					} else {
						break;
					}
				}
				sheet.addMergedRegion(new CellRangeAddress(y, y + dy - 1, x, x
						+ dx - 1));
				cell.setCellValue(headData.get(y)[x]);
				for (int j = 0; j < dy; j++)
					for (int i = 0; i < dx; i++)
						flag[y + j][x + i] = 1;
			}
		}
	}

	public static void createBody(HSSFSheet sheet, HSSFCellStyle style,HSSFCellStyle bottomStyle,
			List<String[]> bodyData, int startRow,int sheetIndex) {
		int start=sheetIndex*sheetSize;
		int end=(sheetIndex+1)*sheetSize;
		int tcy = bodyData.size();
		if(end>tcy){
			end=tcy;
		}
		if (tcy <= 0)
			return;
		
		
		int tcx = bodyData.get(0).length;
		for (int y = start; y < end; y++) {
			HSSFRow row = sheet.createRow((y-start) + startRow);
			for (int x = 0; x < tcx; x++) {
				HSSFCell cell = row.createCell(x);
				cell.setCellStyle(style);
				String value=bodyData.get(y)[x];
				if(value!=null){
					 //判断data是否为数值型
                    boolean isNum = value.matches("^(-?\\d+)(\\.\\d+)?$");
                    //判断data是否为整数（小数部分是否为0）
                    boolean isInteger=value.toString().matches("^[-\\+]?[\\d]*$");
                    //判断data是否为百分数（是否包含“%”）
                    boolean isPercent=value.toString().contains("%");
                    if(isNum  && !isPercent){
                    	if (isInteger) {
                    		 style.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,#0"));  
                        }else{
                            style.setDataFormat(HSSFDataFormat.getBuiltinFormat("0.0"));  
                        } 
                    	 cell.setCellStyle(style);
                       	 cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
                       	 cell.setCellValue(Double.valueOf(value));
                    }else{
                    	cell.setCellValue(value);
                    }
				}
			}
		}
		/*for (int y = end; y <= end; y++) {
			HSSFRow row = sheet.createRow((y-start) + startRow);
			for (int x = 0; x < tcx; x++) {
				HSSFCell cell = row.createCell(x);
				cell.setCellStyle(bottomStyle);
			}
		}*/

	}
	public static void createPageBody(HSSFSheet sheet, HSSFCellStyle style,HSSFCellStyle bottomStyle,
			CommanDao db,String  sql, int startRow,int sheetIndex,int xwidth) {
		int start=sheetIndex*sheetSize;
		int end=(sheetIndex+1)*sheetSize;
		
		String pageSql="select ttt.* from ( select tt.*,rownum r from (" + sql
				+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
		List<String[]> bodyData=db.findList(pageSql);
		
		
		int tcy = bodyData.size();
		
		System.out.println(tcy);
		if (tcy <= 0)
			return;
		int tcx = bodyData.get(0).length-1;
		
		if(tcx>xwidth) tcx=xwidth;
		for (int y = 0; y < tcy; y++) {
			HSSFRow row = sheet.createRow(y+ startRow);
			for (int x = 0; x < tcx; x++) {
				HSSFCell cell = row.createCell(x);
				//if(y==tcy-1){//如果是最后一行
				//	cell.setCellStyle(bottomStyle);
				//}else{
					cell.setCellStyle(style);
				//}
				cell.setCellValue(bodyData.get(y)[x]);
			}
		}
		/*for (int y = tcy; y <= tcy; y++) {
			HSSFRow row = sheet.createRow(y + startRow);
			for (int x = 0; x < tcx; x++) {
				HSSFCell cell = row.createCell(x);
				cell.setCellStyle(bottomStyle);
			}
		}*/
		for (int x = 0; x < tcx; x++) {
			sheet.autoSizeColumn(x,true);
			sheet.setColumnWidth(x, sheet.getColumnWidth(x)+200);
		}
		

	}
}
