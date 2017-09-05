package org.apdplat.tooutsys.action;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.workflow.common.BaseAction;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/tojf")
public class ToJfAction  extends BaseAction{
	private static final String TOKEN_KEY_SUFFIX="_Key";
	public void redirect(){
		ServletContext  app= ServletActionContext.getServletContext();
		User u=UserHolder.getCurrentLoginUser();
		String userName=u.getUsername();
		try {
			String token=UUID.randomUUID().toString().replaceAll("-", "");
			app.setAttribute(this.getTokenKey(userName), token);
			String redirectUrl = ServletActionContext.getRequest().getParameter("redirectUrl");
			if(redirectUrl==null)
				throw new Exception("跳转URL不能为空");
			
			if(redirectUrl.indexOf("?")!=-1){
				redirectUrl=redirectUrl+"&loginId="+this.getUserName()+"&token="+token;
			}else{
				redirectUrl=redirectUrl+"?loginId="+this.getUserName()+"&token="+token;
			}
			
			ServletActionContext.getResponse().sendRedirect(redirectUrl);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void redirectToReport(){
		ServletContext  app= ServletActionContext.getServletContext();
		User u=UserHolder.getCurrentLoginUser();
		String userName=u.getUsername();
		try {
			String loginUrl="http://130.86.11.242:8888/dss3/noLand.do?staffId="+userName+"&pageNo=1000020354";
			ServletActionContext.getResponse().sendRedirect(loginUrl);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void valid(){
		ServletContext  app= ServletActionContext.getServletContext();
		
		Map<String,Object> r=new HashMap<String,Object>();
		try {
			String loginId=ServletActionContext.getRequest().getParameter("loginId");
			String token=ServletActionContext.getRequest().getParameter("token");
			
			String priToken=(String)app.getAttribute(this.getTokenKey(loginId));
			if(priToken!=null&&priToken.equals(token)){
				r.put("ok", true);
				r.put("msg", "验证通过");
			}else{
				r.put("ok", false);
				r.put("msg", "验证不通过");
			}
		} catch (Exception e) {
			e.printStackTrace();
			r.put("ok", false);
			r.put("msg", "验证不通过");
		}
		this.reponseJson(r);
	}
	private String getTokenKey(String userName){
		String tokenKey=userName+TOKEN_KEY_SUFFIX;
		return tokenKey;
	}
	private String getUserName(){
		User u=UserHolder.getCurrentLoginUser();
		String userName=u.getUsername();
		return userName;
	}
}