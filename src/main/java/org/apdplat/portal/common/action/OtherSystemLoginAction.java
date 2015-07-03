package org.apdplat.portal.common.action;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.service.UserDetailsServiceImpl;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.SpringContextUtils;
import org.springframework.security.core.userdetails.UserDetails;

public class OtherSystemLoginAction extends BaseAction {

	private static final long serialVersionUID = -8664643982726027204L;
	private static final APDPlatLogger LOG = new APDPlatLogger(OtherSystemLoginAction.class);
	
	private UserDetailsServiceImpl userDetailsServiceImpl;
	
	public void login() throws IOException, ServletException {
		
		String account = request.getParameter("user-account");
		String referer = request.getHeader("Referer");
		LOG.info("Referer------------------------------>"+request.getHeader("Referer"));
		try {
			/*if(null == referer) {
				throw new RuntimeException("非法访问，禁止登录系统！");
			}else {
				//判断是否从bss或营业厅系统连接过来
				if(referer.indexOf("132.121.80.201")==-1 && referer.indexOf("132.120.115.102")==-1) {
					throw new RuntimeException("非法访问，禁止登录系统！");
				}
			}*/
			if(StringUtils.isBlank(account)) {
				throw new RuntimeException("用户账号不正确！");
			}else {
				String password = "";
		        if (userDetailsServiceImpl == null) {
		            userDetailsServiceImpl = SpringContextUtils.getBean("userDetailsServiceImpl");
		        }
		        if (userDetailsServiceImpl != null) {
		            UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(account);
	            	UserHolder.saveUserDetailsToContext(userDetails, (HttpServletRequest) request);
	            	
	            	password = userDetails.getPassword();
		        }
		        //request.getRequestDispatcher("/autoLogin.jsp").forward(request, response);
		        response.sendRedirect(request.getContextPath()+"/autoLogin.jsp?account="+account+"&password="+password);
			}
		}catch(Exception e) {
			LOG.error(e.getMessage(), e);
			throw e;
		}
		
	}
}
