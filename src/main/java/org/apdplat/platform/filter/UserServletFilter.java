package org.apdplat.platform.filter;

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

import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.log.APDPlatLogger;
import org.slf4j.MDC;

public class UserServletFilter implements Filter {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private List<String> ignore = Arrays.asList(new String[]{"/login.jsp","/exception.jsp","/autoLogin.jsp","/exceptionForAutoLogin.jsp","/common/otherSysLogin!login.action","/appinterfaces/","/sso-protect"});

	private final String USER_KEY = "username";
	  
	  public void destroy() {
	  }

	  public void doFilter(ServletRequest req, ServletResponse res,
			  FilterChain chain) throws IOException, ServletException {

		  HttpServletRequest request = (HttpServletRequest) req;
		  HttpServletResponse response = (HttpServletResponse) res;
		  boolean successfulRegistration = false;

		  User user= UserHolder.getCurrentLoginUser();
		  // Please note that we could have also used a cookie to 
		  // retrieve the user name
		  String requestURI = request.getRequestURI();
		  if(ignore!=null){
			  for(String url: ignore){
				if (requestURI.startsWith(request.getContextPath()+url) ) {
					chain.doFilter(request, response);
					return ;
				}
			  }
		  }
		  
		  if(user == null) {
			  logger.info(request.getServletPath()+"--->"+request.getSession().getId()+"------>"+user);
			  response.sendRedirect(request.getContextPath()+"/login.jsp");
			  return;
		  }
		  
		  try {
			  String username = user.getUsername();
			  successfulRegistration = registerUsername(username);
			  chain.doFilter(request, response);
		  } finally {
		      if (successfulRegistration) {
		    	  MDC.remove(USER_KEY);
		      }
	    }
	  }

	  public void init(FilterConfig arg0) throws ServletException {
	  }
	  
	  /**
	   * Register the user in the MDC under USER_KEY.
	   * 
	   * @param username
	   * @return true id the user can be successfully registered
	   */
	  private boolean registerUsername(String username) {
	    if (username != null && username.trim().length() > 0) {
	      MDC.put(USER_KEY, username);
	      return true;
	    }
	    return false;
	  }

}
