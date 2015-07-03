package org.apdplat.workflow.util;

import java.text.SimpleDateFormat;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

public class DateJsonValueProcessor implements JsonValueProcessor{

	
	private SimpleDateFormat sf;
	
	
	public DateJsonValueProcessor(String formatType){
		sf = new SimpleDateFormat(formatType);
	}
	

	public SimpleDateFormat getSf() {
		return sf;
	}

	public void setSf(SimpleDateFormat sf) {
		this.sf = sf;
	}


	@Override
	public Object processArrayValue(Object date, JsonConfig arg1) {
		  if(date!=null) return sf.format(date);
		   else return date;
	}

	@Override
	public Object processObjectValue(String arg0, Object date, JsonConfig arg2) {
		 if(date!=null) return sf.format(date);
		   else return date;
	}
	

}
