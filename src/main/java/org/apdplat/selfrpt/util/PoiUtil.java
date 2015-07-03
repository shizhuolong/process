package org.apdplat.selfrpt.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;

//导出Excel文件 工具类 (使用poi.jar)
@SuppressWarnings("deprecation")
public class PoiUtil {
	private static HSSFRow row;
	private static HSSFCell cell;
	private static HSSFCellStyle cellStyle;

	// 设置单元格样式(水平和垂直对齐)
	public static HSSFCellStyle setCenterStyle(HSSFWorkbook book) {
		HSSFCellStyle cellStyle = book.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		cellStyle.setVerticalAlignment(HSSFCellStyle.ALIGN_CENTER);
		return cellStyle;
	} 

	public static HSSFCellStyle setBoldStyle(HSSFWorkbook book) {
		HSSFCellStyle cellStyle = book.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		cellStyle.setVerticalAlignment(HSSFCellStyle.ALIGN_CENTER);
		HSSFFont f = book.createFont();
		f.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 加粗
		cellStyle.setFont(f);
		return cellStyle;
	}

	// 设置单元格的样式
	public static void setCellStyle(HSSFRow row, HSSFCell cell, HSSFCellStyle cellStyle) {
		PoiUtil.row = row;
		PoiUtil.cell = cell;
		PoiUtil.cellStyle = cellStyle;
	}

	// 设置单元格值(字符型)
	public static void setValue(int i, String value) {
		cell = row.createCell(i);
		cell.setCellStyle(cellStyle); // 把式样设置到cell中
		cell.setCellValue(value);
	}

	// 设置单元格值(double型)
	public static void setValue(int i, double value) {
		cell = row.createCell(i);
		cell.setCellStyle(cellStyle); // 把式样设置到cell中
		cell.setCellValue(value);
	} 

	// 插入图片
	public static void addImg(HSSFWorkbook book, HSSFSheet sheet,
			String picPath, int rows, int cols) {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		BufferedImage bImg = null; 
		File file = new File(picPath); 
		try {
			bImg = ImageIO.read(file);
			ImageIO.write(bImg, "jpg", bos);
			HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
			HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 0, 0, (short) 0, 0, (short) cols, rows);
			patriarch.createPicture(anchor, book.addPicture(bos.toByteArray(), HSSFWorkbook.PICTURE_TYPE_JPEG));

		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("io erorr : " + e.getMessage());
		} finally {
			if (bos != null) {
				try {
					bImg.flush();
					bos.flush();
					bos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	// 写入excel文件
	public static void write(HSSFWorkbook book, String filePath) {
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(filePath);
			book.write(fos);
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("io erorr : " + e.getMessage());
		} finally {
			if (fos != null) {
				try {
					fos.flush();
					fos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	public static float[] getDataMaxLen(float[] dataMaxLen) {
		for (int i = 0; i < dataMaxLen.length; i++) {
			if (dataMaxLen[i] < 3) {
				dataMaxLen[i] = 2000 + dataMaxLen[i] * 500;
			} else if (dataMaxLen[i] < 5) {
				dataMaxLen[i] = 2000 + dataMaxLen[i] * 450;// 450-480
			} else if (dataMaxLen[i] < 10) {
				dataMaxLen[i] = 2000 + dataMaxLen[i] * 350;// 350-380
			} else if (dataMaxLen[i] < 15) {
				dataMaxLen[i] = 2000 + dataMaxLen[i] * 300;// 250-280
			} else {
				dataMaxLen[i] = 2000 + dataMaxLen[i] * 280;
			}
		}
		return dataMaxLen;
	}

	public static float[] getDataMaxLen(String indexs,String colTypes,float[] dataMaxLen) {
		String []colTypes2=colTypes.split(";");
		String []indexs2=indexs.split(";");
		for (int i = 0; i < indexs2.length; i++) {
			int index=Integer.valueOf(indexs2[i]);
			if (dataMaxLen[index] < 3) {
				dataMaxLen[index] = 2000 + dataMaxLen[index] * 550;
			} else if (dataMaxLen[index] < 5) {
				dataMaxLen[index] = 2000 + dataMaxLen[index] * 500;// 450-480
			} else if (dataMaxLen[index] < 10) {
				dataMaxLen[index] = 2000 + dataMaxLen[index] * 400;// 350-380
			} else if (dataMaxLen[index] < 15) {
				dataMaxLen[index] = 2000 + dataMaxLen[index] * 300;// 250-280
			} else {
				dataMaxLen[index] = 2000 + dataMaxLen[index] * 200;
			}
			if(colTypes2[index].equals("number")){
				dataMaxLen[index]=dataMaxLen[index]/1.1f;
			}
		}
		return dataMaxLen;
	}
	
	public static int[] getPicRowCols(String fileName, int cols) {
		File file = new File(fileName);
		int[] rowCols = { 17, 12 };
		BufferedImage sourceImg = null;
		try {
			sourceImg = javax.imageio.ImageIO.read(file);
			if (sourceImg != null) { // 如果是图片类型的文件,否则sourceImg值为null
				int height = sourceImg.getHeight();
				rowCols[0] = (int) Math.floor(height / 17);

				int width = sourceImg.getWidth();
				rowCols[1] = width / 62; // 宽屏浏览器导出是否误差比较大???还是根据列数而变化
				rowCols[1] = rowCols[1] - cols;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return rowCols;
	} 
	
	public static String [] getTitle(String title){
		String[] titles = title.split("\\|");
		String[] titles2 = titles[0].split(",");
		String[] titles3 = new String[titles2.length];
		System.out.println(" tmp.length=" + titles2.length);
		String[][] titles4 = new String[titles.length][titles2.length];
		for (int i = 0; i < titles.length; i++) {
			String[] tmp = titles[i].split(",");
			for (int j = 0; j < tmp.length; j++) {
				titles4[i][j] = tmp[j];
			}
		}

		for (int i = 0; i < titles2.length; i++) { // 列
			boolean flag = false;
			String str = titles4[0][i];
			for (int j = 0; j < titles.length; j++) {// 行
				if (!str.equals(titles4[j][i])) {
					flag = true;
					break;
				}
			}
			if (flag) {
				str = "";
				for (int j = 0; j < titles.length; j++) {// 行
					str += titles4[j][i] + "_";
				}
				str = str.substring(0, str.length() - 1);
			}
			titles3[i] = str;
		}   
		//删除列重复数据
		for(int i=0;i<titles3.length;i++){
			String tmp[]=titles3[i].split("_");
			String now=tmp[0],str=now;
			for(int j=1;j<tmp.length;j++){
				if(!now.equals(tmp[j])){
					str+="_"+tmp[j];
					now=tmp[j];
				}
			}
			titles3[i]=str;
			System.out.println("str[" + i + "]=" + str);
		}
		return titles3;
			
	}

	public static HSSFSheet getSheetHead(HSSFSheet sheet,
			HSSFCellStyle cellStyle, String[] titles) {
		try {
			HSSFRow row = sheet.createRow((short) 0);
			HSSFCell cell = row.createCell(0);
			int rows_max = 0;
			for (int i = 0; i < titles.length; i++) {
				String h = titles[i];
				if (h.split("_").length > rows_max) {
					rows_max = h.split("_").length;
				}
			}
			Map<String,Object> map = new HashMap<String,Object>();
			for (int k = 0; k < rows_max; k++) {
				row = sheet.createRow((short) k);
				if (k == 0) {
					cell = row.createCell(0);
					cell.setCellStyle(cellStyle);
					cell.setCellValue("序号");
					sheet.addMergedRegion(new Region(k , (short) 0, k + rows_max-1, (short) 0));
				}
				for (int i = 0; i < titles.length; i++) {
					String titlesTemp = titles[i];
					String[] s = titlesTemp.split("_");
					String sk = "";
					int num = i ;
					if (s.length == 1) {
						cell = row.createCell(num);
						cell.setCellStyle(cellStyle);
						sheet.addMergedRegion(new Region(0, (short) (num),  rows_max-1, (short) (num)));
						sk = titlesTemp;
						cell.setCellValue(sk);
					} else {
						cell = row.createCell(num);
						cell.setCellStyle(cellStyle);
						int cols = 0;
						if (map.containsKey(titlesTemp)) {
							continue;
						}
						for (int d = 0; d <= k; d++) {
							if (d != k) {
								sk += s[d] + "_";
							} else {
								sk += s[d];
							}
						}
						if (map.containsKey(sk)) {
							continue;
						}
						for (int j = 0; j < titles.length; j++) {
							if (titles[j].indexOf(sk) != -1) {
								cols++;
							}
						}
						cell.setCellStyle(cellStyle);
						cell.setCellValue(s[k]);
						sheet.addMergedRegion(new Region(k, (short) num, k, (short) (num + cols - 1)));
						if (sk.equals(titlesTemp)) {
							sheet.addMergedRegion(new Region(k, (short) num, k + rows_max - s.length, (short) num));
						}
					}
					if (s.length > k) {
						if (!map.containsKey(sk)) {
							String key = "";
							if (k > 0) {
								key = sk;
							} else {
								key = s[k];
							}
							map.put(key, null);
						}
					}
				}
			} 
			
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return sheet;
	}
	
	// 判断是否数字
	public static boolean isNumber(String str) {
		if (str != null && str.trim().matches("^[-\\+]?\\d+(\\.\\d*)?|\\.\\d+$")) {// 非数字字符将红色显示
			return true;
		} else {
			return false;
		}
	}
}
