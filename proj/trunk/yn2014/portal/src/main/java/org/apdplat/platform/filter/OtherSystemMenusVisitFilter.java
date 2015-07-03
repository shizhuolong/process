package org.apdplat.platform.filter;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.service.UserDetailsServiceImpl;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.SpringContextUtils;
import org.springframework.security.core.userdetails.UserDetails;

public class OtherSystemMenusVisitFilter implements Filter {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	private UserDetailsServiceImpl userDetailsServiceImpl;
	
	
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		String account = request.getParameter("staffId");
		String menuid = request.getParameter("menuid");
		String path = request.getContextPath();
		String visitPath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+request.getServletPath();
		logger.info(UserHolder.getCurrentUserLoginIp()+"------>"+account+" 从BSS侧访问"+visitPath);
		String []menuIdArr = new String[]{"1322","5942","5022","6023"};
		try {
			if (StringUtils.isBlank(account)) {
				throw new RuntimeException("自动登录失败：用户账号为空！");
			} else {
				if (userDetailsServiceImpl == null) {
					userDetailsServiceImpl = SpringContextUtils.getBean("userDetailsServiceImpl");
				}
				if (userDetailsServiceImpl != null) {
					UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(account);
					if(userDetails == null) {
						throw new RuntimeException("自动登录失败：用户不存在！");
					}
					UserHolder.saveUserDetailsToContext(userDetails,(HttpServletRequest) request);

				}
				visitPath = visitPath.replace("/otherSys", "");
				//String forwardPath = "";
				response.addHeader("P3P", "CP=CAO PSAOUR");
				if(Arrays.asList(menuIdArr).contains(menuid)) {
					response.sendRedirect(visitPath);
				}else {
					response.sendRedirect(path+"/exceptionForAutoLogin.jsp?errorFlag=1");
				}
				//request.getRequestDispatcher(forwardPath).forward(request, response);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			response.sendRedirect(path+"/exceptionForAutoLogin.jsp?errorFlag=2");
		}

	}

	public void init(FilterConfig arg0) throws ServletException {
	}

	public void destroy() {
	}

}
