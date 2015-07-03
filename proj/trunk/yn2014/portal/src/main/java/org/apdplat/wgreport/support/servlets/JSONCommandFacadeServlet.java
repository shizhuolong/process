package org.apdplat.wgreport.support.servlets;

import java.io.IOException;
import java.io.Writer;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apdplat.wgreport.commands.CommandFactory;
import org.apdplat.wgreport.commands.HttpCommand;
import org.apdplat.wgreport.util.JSONUtil;
import org.apdplat.wgreport.util.NumberUtil;


public class JSONCommandFacadeServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// response.setCharacterEncoding("UTF-8");// web 2.4 API
		response.setContentType("text/javascript;charset=UTF-8");

		HttpCommand cmd = null;
		String cmdStr = request.getParameter("cmd");
		if (cmdStr == null)
			cmdStr = "0";
		else
			cmdStr = cmdStr.trim();
		if (cmdStr.matches("\\d+"))
			cmd = CommandFactory.getHttpCommand(NumberUtil.toInt(cmdStr));
		else {
			cmd = CommandFactory.getHttpCommand(cmdStr);
		}

		String json = request.getParameter("json");
		Object paraObject = JSONUtil.toJava(URLDecoder.decode(json, "UTF-8"));

		cmd.setHttpServletRequest(request);
		cmd.setHttpServletResponse(response);

		Object result = cmd.process(paraObject);

		Writer writer = response.getWriter();
		String temp = JSONUtil.toJson(result);
		writer.write(temp);
		writer.close();

	}

}
