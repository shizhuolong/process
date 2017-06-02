package org.apdplat.portal.taskdis;

import java.text.SimpleDateFormat;
import java.util.Date;

public class OrderUtil {
	private static SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
	
	private static int seq=0;
	
	public static synchronized String randomBatchNo(){
		seq++;
		if(seq>=100000){
			seq=0;
		}
		return fmt.format(new Date())+"0000000000000000".substring(0,6-(seq+"").length())+seq;
	}
}
