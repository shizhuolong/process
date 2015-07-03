package org.apdplat.selfrpt.util;

import java.io.File;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jxl.Cell;
import jxl.CellType;
import jxl.DateCell;
import jxl.LabelCell;
import jxl.NumberCell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;

import org.apdplat.selfrpt.model.Excel;
import org.apdplat.selfrpt.model.Page;


/** 
 *  excel通用导入: jxl导入
 *  预留扩展接口，导入个性化处理,url传递&sp=1参数即可
 */
public class ExcelUtil {

	public static String[] rex = { "", "^\\S+$", "^-?\\d+$", "^[-\\+]?[.\\d]*$", "^1(3[0-2]|5[56]|8[56])\\d{8}$" };
	public static String[] rexErrorMsg = { "不验证", "不能为空", "为空或不是整数", "为空或不是实数", "为空或非联通手机号" }; // 错误提示信息

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Page getDataList(Excel e){ 
		String sp=e.getSp(); 
		String reportID=e.getReportID();
		Page page=new Page();
		if(!sp.equals("1")){ //通用处理
			String fileName=e.getFileName();
			if(fileName.toLowerCase().indexOf(".xlsx")>0){ //Excel2007格式 
				page=ExcelUtil2007.getDataListComm(e);
			}else{//Excel2003格式 
				page= getDataListComm(e);
			}
			
		}else if(sp.equals("1") && reportID.equals("501")){ 
			System.out.println("导入个性化处理  reportID ="+reportID+",sp="+sp);
			page= getDataList_sp501(e); //函数名称规范: "getDataList_sp"+reportID编号组成
		}
		
		//对单元格按列排序,方便用户整列核对数据
		List errorList=page.getList();
		String [] error=new String[errorList.size()];
		for(int i=0;i<errorList.size();i++){
			error[i]=(String) errorList.get(i);
		}
		Arrays.sort(error); //单元格快速排序
		errorList=new ArrayList<String[]>();
		for(int i=0;i<error.length;i++){
			errorList.add(error[i]);
		} 
		page.setList(errorList);
		return page;			
	}
		
	public static Page getDataListComm(Excel e){ 
		String tableName=e.getTableName();
		String colName2=e.getColNames();  
		String importIndexs[]=e.getImportIndex().split(";");
		String checkIndexs[]=e.getCheckIndex().split(";");
		int beginRow= e.getBeginRow();
		String userID=e.getUserID();
		String userName=e.getUserName();
		String operateTime=e.getOperateTime();
		int sheetIndex=e.getSheetIndex();
		String filePath=e.getFilePath();
		
		//读取excel数据
		Workbook book = null;
		List<Object> errorList= new ArrayList<Object>(),errorList2= new ArrayList<Object>(),dataList= new ArrayList<Object>(); 
		try {
			WorkbookSettings bookset=new WorkbookSettings();
			bookset.setEncoding("GBK"); //关键代码，解决中文乱码
			book=Workbook.getWorkbook(new File(filePath),bookset); 
			Sheet sheet = book.getSheet(sheetIndex);//0
			int rsColumns =  importIndexs.length; 
			int rsRows = sheet.getRows(); 
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			String sql="",cellContent="";
			StringBuffer sb=new  StringBuffer();
			int index=0;
			boolean isRowNull,isRightCell,isRightData;
			for (int i = 0; i < rsRows; i++) {
				sb.setLength(0);
				index=0;
				isRowNull=false;//改行是不是全部为空 
				errorList2.clear();//存放当前行的验证信息
				for (int j = 0; j < rsColumns; j++) {
					isRightCell =true;
					Cell cell = sheet.getCell(j, i);// 对单元进行处理  
					cellContent="";
					index = Integer.valueOf(checkIndexs[j]);
					if (cell.getType() == CellType.LABEL || cell.getType() == CellType.STRING_FORMULA || cell.getType() == CellType.DATE_FORMULA){
					    LabelCell labelCell = (LabelCell) cell;  
					    cellContent = labelCell.getString();    
					    if(ExcelUtil.isPercent(cellContent)){
					    	cellContent=ExcelUtil.percentToDouble(cellContent);
						}
					}else if (cell.getType() == CellType.NUMBER || cell.getType() == CellType.NUMBER_FORMULA) {  
					    NumberCell numberCell = (NumberCell) cell;  
					    double namberValue = numberCell.getValue();  
					    if(namberValue==(long) namberValue){ //是整数，去掉小数点后面为都0的数据
					    	cellContent=String.valueOf((long) namberValue);
					    }else{
					    	 cellContent = String.valueOf(namberValue);
					    	 if(cellContent.indexOf("E")>0){ //科学计数法
					    		 BigDecimal db = new BigDecimal(cellContent);
						    	 cellContent = db.toPlainString(); //数据库若为字段为字符类,则和excel数字一致;若为字段数字型,数字很大10亿,则后面小数为保留4位完全一致
					    	 }
					    }   
					}else if (cell.getType() == CellType.DATE) {  
					    DateCell dateCell = (DateCell) cell;   
					    cellContent=sdf.format(dateCell.getDate());//兼容excel日期和月份格式数据
					} else if (cell.getType() == CellType.EMPTY){ 
						cellContent=""; 
					} else if (cell.getType() == CellType.FORMULA_ERROR || cell.getType() == CellType.ERROR){//公式错误 
						cellContent=cell.getContents(); 
						isRightCell =false;
					} else {
						cellContent=cell.getContents(); 
						 if(cellContent==null){
							 cellContent=""; 
						 }
					}
					cellContent=cellContent.trim();
					cellContent = cellContent.replaceAll("\n", " ").replaceAll("'", "\""); //修改换行符,防止插入sql异常
					System.out.print(cellContent+"("+cell.getType()+"), ");
					if(i>=beginRow){
						isRightData = checkData(rex[index], cellContent);
						if (isRightCell && isRightData) {
							sb.append("'"+cellContent+"',");
						}else{
							if(!isRightCell){ //单元格公式错误
								errorList2.add((char)(65+j)+""+(i+beginRow)+"@单元格(公式)错误 "+cellContent);
							}else { 
								errorList2.add((char)(65+j)+""+(i+beginRow)+"@"+rexErrorMsg[index]); 
							}
						}
						if(!cellContent.trim().equals("")){
							isRowNull=true;
						}
					} 
				}
				System.out.println();
				if(i>=beginRow && isRowNull){ //若当前行不全为空，则从数据起始行开始读取数据 
					if(sb.toString().length()>1){
						String value=sb.toString().substring(0,sb.toString().length()-1); 
						sql="insert into "+tableName+"("+colName2 + ") values ("+value+",'"+operateTime+"','"+userName+"','"+userID+"',REPORT_CONFIG_SEQ.nextval)"; 
						dataList.add(sql);
					} 
					errorList.addAll(errorList2);//不全为空才加入当前行的验证信息
				} 
			}  				
		} catch (Exception e1) { 
			e1.printStackTrace();
		}finally{
			book.close();  
		}  
		Page page=new Page(); 
		page.setList(errorList);
		page.setList2(dataList);
		return page;
	}
	
	public Page getDataListComm2007(Excel e){
		Page page=new Page(); 
		return page;
	}
	 
	
	public static Page getDataList_sp501(Excel excel){ //个性化开发,函数名称规范: "getDataList_sp"+reportID编号组成
		Page page=new Page();
		return page;
	} 
	
	
	public static boolean checkData(String rex, String strData) {
		boolean flag = true;
		if (!"".equals(rex) && null != rex) {
			Pattern p1 = Pattern.compile(rex);// 判断数字
			Matcher m = p1.matcher(strData);
			flag = m.matches();
		}
		return flag;
	}
	
	public static boolean isPercent(String strData) { 
		String rex2=rex[3];
		boolean flag = false;
		if (strData.indexOf("%")>0 && !"".equals(rex2) && null != rex2) { 
			strData=strData.substring(0, strData.length()-1); //去掉百分符号
			Pattern p1 = Pattern.compile(rex2);// 判断数字
			Matcher m = p1.matcher(strData);
			flag = m.matches(); 
		}  
		return flag;
	}
	
	public static String percentToDouble(String strData) {  
		double data=0; 
		strData=strData.substring(0, strData.length()-1); //去掉百分符号  
		data=Double.valueOf(strData)/100;
		strData=String.valueOf(data);
		if(strData.indexOf("E")>0){ //科学计数法
   		 BigDecimal db = new BigDecimal(data);
   		 strData = db.toPlainString(); //数据库若为字段为字符类,则和excel数字一致;若为字段数字型,数字很大10亿,则后面小数为保留4位完全一致
   	    }
		System.out.println(strData); 
		return String.valueOf(strData);
	}
	
	
	
}
