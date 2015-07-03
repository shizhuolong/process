package org.apdplat.wgreport.commands;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface HttpCommand {
	public Object process(Object o);

	public void setHttpServletRequest(HttpServletRequest request);

	public void setHttpServletResponse(HttpServletResponse response);
}
