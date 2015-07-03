package org.apdplat.selfrpt.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
	public static long getBegin2EndDay(String beginDateStr, String endDateStr) {//结束-开始日期相差天数
		long day = 0;
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date beginDate = format.parse(beginDateStr);
			Date endDate = format.parse(endDateStr);
			day = (endDate.getTime() - beginDate.getTime())/ (24 * 60 * 60 * 1000);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return day;
	}
	
	public static String getLastYear(String dataFormat) {
		String dealDate="";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");  
        Calendar calendar = Calendar.getInstance();    
        calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR) - 1);  //取得上一个月时间  
        dealDate=sdf.format(calendar.getTime()); 
		return dealDate;
	}
	
	public static String getLastMonth() { //上个月
		String dealDate="";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");  
        Calendar calendar = Calendar.getInstance();    
        calendar.set(Calendar.MONDAY, calendar.get(Calendar.MONDAY) - 1);  //取得上一个月时间  
        dealDate=sdf.format(calendar.getTime()); 
		return dealDate;
	} 
	
	public static String getLastMonth(String date) { //参数date日期的上个月
		int year=Integer.valueOf(date.substring(0,4));
		int month=Integer.valueOf(date.substring(4,6)); 
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");  
        Calendar calendar = Calendar.getInstance();   
        calendar.set(year, month, 1); 
        calendar.add(Calendar.MONTH, 0); 
        date=sdf.format(calendar.getTime()); 
		return date;
	} 
	 
	public static String getLastMonth2(String date) { //参数date日期的上个月 导入完成情况
		int year=Integer.valueOf(date.substring(0,4));
		int month=Integer.valueOf(date.substring(4,6)); 
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");  
        Calendar calendar = Calendar.getInstance();   
        calendar.set(year, month, 1); 
        calendar.add(Calendar.MONTH, 0); 
        date=sdf.format(calendar.getTime()); 
		return date;
	}  
	
	public static String getLastDay() {//前一天
		String dealDate="";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
        Calendar calendar = Calendar.getInstance();     
        calendar.set(Calendar.DAY_OF_MONTH, calendar.get(Calendar.DAY_OF_MONTH) - 1); 
        dealDate=sdf.format(calendar.getTime());
		return dealDate;
	} 
	
	public static String getLastDay(String dataFormat) {//前一天
		String dealDate="";
		SimpleDateFormat sdf = new SimpleDateFormat(dataFormat);  //"yyyy-MM-dd"
        Calendar calendar = Calendar.getInstance();     
        calendar.set(Calendar.DAY_OF_MONTH, calendar.get(Calendar.DAY_OF_MONTH) - 1); 
        dealDate=sdf.format(calendar.getTime());
		return dealDate;
	} 
	
	public static String getDate(String dateType,String i2) {	
		Integer i=Integer.valueOf(i2);
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);  
		dateType=dateType.substring(dateType.length()-2,dateType.length());   
        Calendar calendar = Calendar.getInstance();   
		if(dateType.equals("yy")){
		   calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR) +i);   
		}else if(dateType.equals("MM")){
		   calendar.set(Calendar.MONDAY, calendar.get(Calendar.MONDAY) +i);
		}else if(dateType.equals("dd")){
		   calendar.set(Calendar.DAY_OF_MONTH, calendar.get(Calendar.DAY_OF_MONTH) +i);
		}
		String dealDate=sdf.format(calendar.getTime());  
		return dealDate;
	}
	
	
}
