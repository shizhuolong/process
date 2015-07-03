package org.apdplat.workflow.common;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.json.JSONUtil;

import com.opensymphony.xwork2.ActionSupport;

public class BaseAction extends ActionSupport {

	private static final long serialVersionUID = 1L;
	
	protected Integer page = Integer.valueOf(1);
	protected Integer rows = Integer.valueOf(15);
	protected HttpServletRequest request;
	protected HttpServletResponse response;
	
	
	protected void outJsonPlainString(HttpServletResponse response, String json){
		 
		response.setContentType("text/plain;charset=UTF-8");
		try {
		  outString(response, json);
		} catch (Exception e) {
		  e.printStackTrace();
		}
	}
	 
	private void outString(HttpServletResponse response, String str){
		
		PrintWriter out;
		try
		{
		  out = response.getWriter();
		  out.println(str);
		  out.flush();
		  out.close();
		} catch (IOException e) {
		  e.printStackTrace();
		}
	}
	
	public void reponseJson(Object object) {
		try {
		String text=JSONUtil.serialize(object);
		HttpServletResponse response = ServletActionContext.getResponse();
		//设置编码及文件格式   
		response.setContentType("text/html;charset=UTF-8");
		//设置不使用缓存   
        response.setHeader("Cache-Control","no-cache"); 
			response.getWriter().write(text);
			response.getWriter().flush();   
	        response.getWriter().close(); 
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	
	public Integer getPage() {
		return page;
	}
	public void setPage(Integer page) {
		this.page = page;
	}
	public Integer getRows() {
		return rows;
	}
	public void setRows(Integer rows) {
		this.rows = rows;
	}
	public HttpServletRequest getRequest() {
		return ServletActionContext.getRequest();
	}
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
	public HttpServletResponse getResponse() {
		return ServletActionContext.getResponse();
	}
	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}
	
	
	
}