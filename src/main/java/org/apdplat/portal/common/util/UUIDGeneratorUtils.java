package org.apdplat.portal.common.util;

import java.util.UUID;


public class UUIDGeneratorUtils {
	
	
	 public static synchronized String getUUID(){ 
	        String s = UUID.randomUUID().toString(); 
	        return s.replaceAll("-", ""); 
	    } 
}
