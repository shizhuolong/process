package org.apdplat.portal.common.util;

import java.text.SimpleDateFormat;
import java.util.Date;


public class OrderIdUtils {
	
	
	 public static synchronized String getOrderId(){ 
		    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSSS");
			String orderId = format.format(new Date())+(int)(Math.random()*10);
	        return orderId; 
	    } 

}
