package org.apdplat.wgreport.util;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

public  class DateUtil {
	public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	public static String getDate(Date date, String pattern)
	{
		if(date == null)
			return "";
		if(pattern == null)
			pattern = DATE_FORMAT;
		DateFormat dateFormat = new SimpleDateFormat(pattern);
		return dateFormat.format(date);
	}
	public static Date parseDate(String date, String pattern)
    {
		if(date == null || date.length() <= 0){
			return null;
		}
		
		if(date.length() < 8)
		{
			date += "21";
		}
			
        SimpleDateFormat sdf = null;
        if(pattern == null || pattern.equals(""))
        {
            sdf = new SimpleDateFormat(DATE_FORMAT);
        }
        else
        {
            sdf = new SimpleDateFormat(pattern);
        }
        try
        {
            return sdf.parse(date);
        }
        catch(ParseException e)
        {
        	e.printStackTrace();
            return null;
        }
    }
	
	public static String getPreMon(String dealDate,int mons){
		int year = Integer.parseInt(dealDate.substring(0,4));
		int mon = Integer.parseInt(dealDate.substring(4,6));
		mon --;
		int day = 1;
		SimpleDateFormat   df   =   new   SimpleDateFormat("yyyyMMdd");   
		GregorianCalendar  gc   =   new   GregorianCalendar(year,mon,day);   
		gc.add(2, -mons);
		return df.format(gc.getTime()).substring(0, 6);
	}
	
	public static ArrayList getPreMons(int offset,int mons){
		ArrayList dateList = new ArrayList();
		Date date = new Date(); 
		SimpleDateFormat   format   =   new   SimpleDateFormat("yyyyMM");
		String dealDate = format.format(date);
		for(int i=0;i<mons;i++){
			dateList.add(getPreMon(dealDate,i+1));
		}
		return dateList;
	}
	
	public static String getYesterday(){
	    GregorianCalendar time1 = new GregorianCalendar();
	    time1.add(GregorianCalendar.DATE, -1);
	    return getTimeString(time1, "yyyy-MM-dd");
	}
	
	public static String getToday(){
	    GregorianCalendar time1 = new GregorianCalendar();
	    return getTimeString(time1, "yyyy-MM-dd");
	}
	
	public static String getBeforeYesterday(){
	    GregorianCalendar time1 = new GregorianCalendar();
	    time1.add(GregorianCalendar.DATE, -2);
	    return getTimeString(time1, "yyyy-MM-dd");
	}   
	public static String getLastMonth(){
	    GregorianCalendar time2 = new GregorianCalendar();
	    time2.add(GregorianCalendar.MONTH,-1);
	    return getTimeString(time2,"yyyyMM");    
	}
	public static String getLastMonth1(){
	    GregorianCalendar time1 = new GregorianCalendar();
	    time1.add(GregorianCalendar.DATE, -30);
	    return getTimeString(time1, "yyyy-MM-dd");     
	}

	public static String getBeginMonth(String str) {     
	    return str.substring(0,4) + "01" ;      
	}

	public static String getTimeString(Calendar date, String format) {
	    if (format == null || format.equals("")) format = "yyyy-MM-dd";
	    String rv = "";
	    try {
	        SimpleDateFormat df = new SimpleDateFormat(format);
	        rv = (String) df.format(date.getTime());
	    } catch (Exception ex) { }
	    return rv;
	}
}
