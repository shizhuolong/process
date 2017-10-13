package org.apdplat.portal.index.action;

import java.util.List;

import javax.servlet.ServletContext;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.index.bean.User;
import org.apdplat.portal.index.service.UserService;
import org.apdplat.portal.order2i2c.action.HttpSendMessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/sendCode")
@Scope("prototype")
public class SendCodeAction extends BaseAction {
	private static final long serialVersionUID = 1L;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
    @Autowired
    private UserService userService;
    
	public void sendCode() {
			try{
				String username=request.getParameter("username");
				List<User> user= userService.getUser(username);
				String phone="";
				if(user==null||user.size()>0){
					phone=user.get(0).getPhone();
					if(phone==null||phone.trim().equals("")){
						this.reponseJson("验证码发送失败,用户电话信息不存在！");
					}
				}else{
					this.reponseJson("用户名不存在！");
				}
				String code=Math.round(Math.random()*9000+1000)+"";
				String content="【云南基层1+1系统】，您的登录验证码是："+code+"";
				ServletContext app= request.getSession().getServletContext();
				String result=HttpSendMessageUtil.sendMessage(phone, content);
				app.setAttribute("smsCode_"+username, code);
				if(!"0".equals(result)){
					this.reponseJson("验证码发送失败，请重新操作！");
				}
				this.reponseJson("验证码发送成功,请查看手机！");
			}catch(Exception e){
				logger.info("验证码发送失败，请重新操作！");
				this.reponseJson("验证码发送失败，请重新操作！");
			}
	}
	
	public void login(){
		String username=request.getParameter("username");
		String checkCode=request.getParameter("checkCode"); 
		String appCode=(String)request.getSession().getServletContext().getAttribute("smsCode_"+username);
        if(checkCode.equals(appCode)){
        	this.reponseJson("success");
        }
        this.reponseJson("验证码错误，请查看手机！！");
	}
	
}
