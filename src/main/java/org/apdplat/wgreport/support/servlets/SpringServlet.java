package org.apdplat.wgreport.support.servlets;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * web环境下使用,需要在web.xml中配置一个此Servlet的一个实例 spring
 * 初始化Servlet。辅助提供普通pojo方便的获取spring资源。
 * 
 * 
 */
public class SpringServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static ApplicationContext context;
	private static ServletContext servletContext;

	public void init() throws ServletException {
		context = WebApplicationContextUtils
				.getWebApplicationContext(getServletContext());
		servletContext = getServletContext();
	}

	/**
	 * 获得spring的context
	 * 
	 * @return ApplicationContext
	 */
	public static ApplicationContext getContext() {
		return context;
	}

	/**
	 * 获得web的ServletContext
	 * 
	 * @return ServletContext
	 */
	public static ServletContext getServletContext_() {
		return servletContext;
	}

	public static String getRealPath(String path) {
		return servletContext.getRealPath(path);
	}

	/**
	 * 获得spring的bean
	 * 
	 * @param beanName
	 *            id或name
	 * @return 实例
	 * @see ApplicationContext#getBean(String)
	 */
	public static Object getBean(String beanName) {
		return context.getBean(beanName);
	}
}
