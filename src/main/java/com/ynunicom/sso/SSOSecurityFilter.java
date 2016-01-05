package com.ynunicom.sso;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


/**
 * 单点登录过滤器
 * lyz
 * */
public class SSOSecurityFilter implements Filter {
	

	private List<String> ignore = Arrays.asList(new String[]{"/sso-protect/rediect_login.jsp","/sso-protect/success.jsp","/sso-protect/error.jsp","/service"});
	public void destroy() {
	}

	public void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) arg0;  
	    HttpServletResponse res = (HttpServletResponse) arg1;  
	  
		String requestURI = req.getRequestURI();
	    
	    if(ignore!=null){
			for(String url: ignore){
				if (requestURI.startsWith(req.getContextPath()+url) ) {
					arg2.doFilter(req, res);
					return ;

				}
			}
		}
	    
	    
	    String path = req.getContextPath();
	    String returnurl = req.getScheme()+"://"+req.getServerName()+":"+req.getServerPort()+path+req.getServletPath();
	    HttpSession session = req.getSession();  
	    if (session.getAttribute("__security_key") != null) {
	    	 res.sendRedirect(returnurl.replace("/sso-protect", "").replace("&", "?"));
	    } else {  
	        res.sendRedirect(path+"/sso-protect/"+"rediect_login.jsp?return="+returnurl);  
	    } 

	}
	public void init(FilterConfig arg0) throws ServletException {
	}
	
}
