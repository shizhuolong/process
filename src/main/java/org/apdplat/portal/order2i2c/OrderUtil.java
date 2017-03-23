package org.apdplat.portal.order2i2c;

import java.text.SimpleDateFormat;
import java.util.Date;

public class OrderUtil {
	private static SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
	private static SimpleDateFormat ddfmt = new SimpleDateFormat("yyyy年MM月dd日");
	private static SimpleDateFormat ssfmt = new SimpleDateFormat("HH:mm:ss");
	
	private static int seq=0;
	
	public static synchronized String randomTaskNo(){
		if(seq>=100000){
			seq=0;
		}
		return fmt.format(new Date())+"0000000000000000".substring(0,6-(seq+"").length())+seq;
	}
	
	public static String getTaskTitle(String regionName){
		return ddfmt.format(new Date())+regionName+"2I2C业务分配【"+ssfmt.format(new Date())+"】";
	}
}
