package org.apdplat.wgreport.commands.impl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apdplat.wgreport.commands.HttpCommand;
import org.apdplat.wgreport.common.SpringManager;
import org.apdplat.wgreport.support.db.FindSupport;
import org.apdplat.wgreport.support.db.UpdateSupport;
import org.apdplat.wgreport.util.StringUtil;

public abstract class AbstractHttpCommand implements HttpCommand {
	final Log logger = LogFactory.getLog(getClass());
	HttpServletRequest request;
	HttpServletResponse response;

	public abstract Object process(Object o);

	public void setHttpServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public void setHttpServletResponse(HttpServletResponse response) {
		this.response = response;
	}

	/**
	 * 获取用户id
	 * 
	 * @return 用户id
	 */
	protected String getUserid() {
		return StringUtil.nullTrim(getFromSession("j_userid"));
	}
	protected String getPhone() {
		return request.getParameter("phoneno");
	}
	protected String getstaffCode() {
		return request.getParameter("staffCode");
	}

	/**
	 * 从session中获得属性
	 * 
	 * @param attrName
	 *            属性名
	 * @return session中存储的值
	 */
	protected Object getFromSession(String attrName) {
		HttpSession session = request.getSession();
		return session.getAttribute(attrName);
	}

	/**
	 * 设置session属性
	 * 
	 * @param attrName
	 * @param value
	 */
	protected void setSessionAttribute(String attrName, Object value) {
		HttpSession session = request.getSession();
		session.setAttribute(attrName, value);
	}

	protected FindSupport getFindDao() {
		return SpringManager.getFindDao();
	}

	protected FindSupport getArrayFindDao() {
		return SpringManager.getArrayFindDao();
	}

	protected UpdateSupport getUpdateDao() {
		return SpringManager.getUpdateDao();
	}
}
