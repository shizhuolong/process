<%@ page language="java" import="org.dom4j.*" pageEncoding="UTF-8"%>
<%@page import="com.sso.hp.utils.XmlUtil"%>
<%@page import="com.sso.hp.utils.UserEntry"%>
<%@page import="com.sso.hp.utils.HttpUtil"%>
<%@page import="com.ynunicom.sso.AppConstant"%>
<%@page import="org.apache.struts2.ServletActionContext"%>
<%@page import="java.util.List"%> 

<%@page import="org.apdplat.platform.log.APDPlatLogger"%>
<%@page import="org.apdplat.module.security.service.UserDetailsServiceImpl"%>
<%@page import="org.apdplat.platform.util.SpringContextUtils"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.springframework.security.core.userdetails.UserDetails"%>



<%@page
	import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.ynunicom.sso.XmlUtil2"%>
<%@page import="com.ynunicom.sso.CheckSign2"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<script type="text/javascript" src="/sso-demo/scripts/jquery.js"></script>

<title>Success Page</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">

<%
	System.out.println("doc======================success page");
	UserDetails userDetails=null;
	String soap = request.getParameter("token");
	String returnurl = request.getParameter("return");
	//returnurl = returnurl + "?jobId="+jobId;
	System.out.println("returnurl" + "----------" + returnurl);
	String token = XmlUtil.GetToken(soap);
	boolean status = false;
	String error_info = "IDP处理出错";
	UserEntry userentry = null;
	System.out.println("token==" + token.length());
	if (token != null && token.length() > 0) {
		String url = AppConstant.checkAuthenticationPath + "?token=" + token + "&appid=" + AppConstant.appId; //"&appid=APP-e835fa18b1e72c0954a92066d292e619";
		System.out.println("url===" + url);
		Document doc = HttpUtil.XmlForSendRequest(url); //获取XML返回信息
		System.out.println("doc======================" + doc);
		String sePath = ServletActionContext.getServletContext().getRealPath("/sso-protect/server_rsa.cer");
		System.out.println(sePath + "sePath");
		boolean xm1 = XmlUtil.CheckSign(doc, sePath);
		System.out.println("xm1=" + xm1 + "===" + XmlUtil.CheckSign(doc, sePath));
	
		if (XmlUtil.CheckSign(doc, sePath)) {//校验签名
			String str = XmlUtil.GetStatus(doc);//获取返回SAML中的状态信息
			System.out.println("str=" + str);
			if (str != null && str.equals("urn:oasis:names:tc:SAML:2.0:status:Success")) {
				userentry = XmlUtil.get_userinfo(doc);//获取SAML中的用户信息
				status = true;
			} else if (str != null && str.equals("urn:oasis:names:tc:SAML:2.0:status:Responder")) {
				error_info = "IDP处理出错";
			} else if (str != null && str.equals("urn:oasis:names:tc:SAML:2.0:status:VersionMismatch")) {
				error_info = "请求版本错误";
			} else if (str != null && str.equals("urn:oasis:names:tc:SAML:2.0:status:PartialLogout")) {
				error_info = "其他站点已注销";
			} else if (str != null && str.equals("urn:oasis:names:tc:SAML:2.0:status:RequestDenied")) {
				error_info = "拒绝该SP的请求";
			} else if (str != null && str.equals("urn:oasis:names:tc:SAML:2.0:status:RequestDenied")) {
				error_info = "不支持的请求";
			} else if (str != null && str.equals("urn:oasis:names:tc:SAML:2.0:status:Forbid")) {
				error_info = "该账号不允许访问该应用系统";
			}
		}
		System.out.println(error_info + "=====error info");
	}
	if (status) {
		String userName=userentry.getUserid();
		APDPlatLogger LOG = new APDPlatLogger(this.getClass());
		UserDetailsServiceImpl userDetailsServiceImpl=null;
		userDetailsServiceImpl = SpringContextUtils.getBean("userDetailsServiceImpl");
		if (userDetailsServiceImpl != null) {
			try{
				userDetails = userDetailsServiceImpl.loadUserByUsername(userName);
			}catch(Exception e){
				e.printStackTrace();
			}
			if(userDetails!=null){
				UserHolder.saveUserDetailsToContext(userDetails, (HttpServletRequest) request);
			}else{
				error_info = "出错，系统不存在此用户，请联系基层责任单元服务支撑系统管理员";
			}
		}
	}
%>

<%
	if (!status || (status && userDetails == null)) {
%>
		<font color='red'><%=error_info%></font>
<%
	} else {
		if (returnurl != null && returnurl.length() > 0) {
			if(returnurl.contains("/portal/sso-protect/index.jsp")){
				returnurl="/portal/platform/index.jsp";
			}
%>
			<script type="text/javascript">document.location='<%=returnurl.replace("/sso-protect", "")%>';</script>
<%
		}
	}
%>

</html>
