package org.apdplat.portal.common;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class BaseBean {
	
	protected int start;
	protected int end;
	
	
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getEnd() {
		return end;
	}
	public void setEnd(int end) {
		this.end = end;
	}
	
	public String toString() {
		return ReflectionToStringBuilder.toString(this);

	}
	

}
