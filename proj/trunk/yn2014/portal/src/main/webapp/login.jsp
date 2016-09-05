<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page  import="org.apdplat.module.security.service.OnlineUserService"%>
<%@page  import="org.apdplat.module.security.service.SpringSecurityService"%>
<%@page  import="org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter"%>
<%@page  import="org.apdplat.module.security.service.UserDetailsServiceImpl"%>
<%@page  import="org.apdplat.module.system.service.PropertyHolder"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<%
response.addHeader("login","true");  
//供记录用户登录日志使用
String userAgent=request.getHeader("User-Agent");
request.getSession().setAttribute("userAgent", userAgent);
if(!SpringSecurityService.isSecurity()){
    //如果没有启用安全机制则直接进入主界面
    response.sendRedirect("platform/index.jsp");
    return;
}
String name=OnlineUserService.getUsername(request.getSession(true).getId());
if(!"匿名用户".equals(name)){
    //用户已经等登录直接进入主界面
    response.sendRedirect("platform/index.jsp");
    return;
}

String message="";
String state=request.getParameter("state");
if(state!=null){
    response.addHeader("state",state);  
}
if("checkCodeError".equals(state)){
    response.addHeader("checkCodeError","true");  
    message="验证码错误";
    response.getWriter().write(message);
    response.getWriter().flush();
    response.getWriter().close();
    return;
}

String SPRING_SECURITY_LAST_USERNAME = UserDetailsServiceImpl.SPRING_SECURITY_LAST_USERNAME;
String lastUsername="";
if(SPRING_SECURITY_LAST_USERNAME != null){
    lastUsername = SPRING_SECURITY_LAST_USERNAME;
    if(request.getParameter("login_error")!=null){
    	response.addHeader("login_error","true");
    	return;
        /*String tip=UserDetailsServiceImpl.getMessage(lastUsername);
        if(tip!=null){
            message=tip;
            response.addHeader("login_error","true");  
            response.getWriter().write(message);
            response.getWriter().flush();
            response.getWriter().close();
            return;
        }*/
    }
 }
String contextPath=org.apdplat.module.system.service.SystemListener.getContextPath();
String appName=PropertyHolder.getProperty("app.name");
String shortcut=PropertyHolder.getProperty("module.short.name");
%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>基层责任单元服务支撑系统</title>
    <link rel="shortcut icon" href="images/<%= shortcut %>.ico" />
    
    <!-- <link href="css/login-style.css" rel="stylesheet" type="text/css" /> -->
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/platform/theme/style/easyui.css"/>
	<link href="<%=request.getContextPath() %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="extjs/css/ext-all.css"/>
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="extjs/js/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="extjs/js/ext-all.js"></script>
    <script type="text/javascript" src="extjs/ux/Toast.js"></script>
    <script type="text/javascript" src="js/md5.js"></script>
    <script type="text/javascript">
        //解决Ext在ie9报错：不支持extjs对象的“createContextualFragment属性或方法”
        if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
            Range.prototype.createContextualFragment = function(html) {
                var frag = document.createDocumentFragment(),div = document.createElement("div");
                frag.appendChild(div);
                div.outerHTML = html;
                return frag;
            };
        }
        var contextPath='<%=contextPath%>';
        
        //刷新验证码
        function refeshCode() {
        	$("#checkCode").attr("src",contextPath+'/security/jcaptcha.png?rand="'+Math.random()+'"');
        }
        
        //登录
        function login() {
        	
        	var j_username = $.trim($("#j_username").val());
        	var j_password = $.trim($("#j_password").val());
        	var j_captcha = $.trim($("#j_captcha").val());
        	if(""==j_username || null==j_username) {
        		alert("账号不能为空!");
        		return;
        	}
        	if(""==j_password || null==j_password) {
        		alert("密码不能为空!");
        		return;
        	}
        	if(""==j_captcha || null==j_captcha) {
        		alert("验证码不能为空!");
        		return;
        	}
        	var loginTip=Ext.Msg.wait("正在登录......", '请稍候');
             var url = 'j_spring_security_check';
             j_password=hex_md5(j_password+'{用户信息}');
             Ext.Ajax.request({
                 url : url,
                 params : {
                     j_captcha  : j_captcha,
                     j_username : j_username,
                     j_password : j_password
                 },
                 method : 'POST',
                 success:function(response, opts){
                    if(response.getResponseHeader('login_success')) {
                       //  Ext.getCmp("loginWindow").hide();
                         //防止用户登录成功之后点击浏览器的后退按钮回到登录页面
                         //在浏览器的历史记录里面不记录登录页面
                         location.replace(contextPath+"/platform/index.jsp");
                         return;
                     }  
                     refeshCode();
                     $("#j_password").val("");
                     $("#j_captcha").val("");
                     $("#j_password").focus();
                     loginTip.hide();
                     if(response.getResponseHeader('checkCodeError')) {
                         Ext.ux.Toast.msg('登陆失败：','验证码错误，请重新登录!');  
                         return;
                     }  
                     if(response.getResponseHeader('login_error')) {
                    	 //var resp=response.responseText;
                         //Ext.ux.Toast.msg('登陆失败：',resp);  
                         Ext.ux.Toast.msg('登陆失败：','账号或密码错误，请重新登录!');  
                         return;
                     }  
                 },
                 failure: function(response, opts) {
                	 if(response.getResponseHeader('checkCodeError')) {
                         Ext.ux.Toast.msg('登陆失败：','验证码错误，请重新登录!');  
                     }  
                     if(response.getResponseHeader('login_error')) {
                    	 //var resp=response.responseText;
                         //Ext.ux.Toast.msg('登陆失败：',resp);  
                         Ext.ux.Toast.msg('登陆失败：','账号或密码错误，请重新登录!');  
                     }  
                     location.replace("platform/index.jsp");  
                 }
             });
        }
        
        function reset() {
        	
        	 $("#j_password").val("");
             $("#j_username").val("");
             $("#j_username").focus();
        }
        
        var logincount=0;
        function enterPress(e){ 
    		var e = e || window.event; 
    		if(e.keyCode == 13 &&logincount==0){ 
	    		login();
    		} 
    	}
    </script>

</head>
<body id="login_body_bg">
	<div id="login">
    	<div id="container">
			<div id="login-logo"></div>
            <div id="content">
				<div id="content-main">
            	<div id="login-ad">
                	<img src="<%=request.getContextPath() %>/platform/theme/images/login-ad.png" />
                </div>
                <div id="login-area">
                	<table>
                    	<tr>
                        	<td class="login-title-head-text">用户：</td>
                            <td>
                                <span class="log-icon-bg"><i class="log-user-icon"></i></span>
                                <input class="login-default-text-input .w190" name="" type="text" id="j_username"
                                 onkeypress="enterPress(event)"/>
                            </td>
                        </tr>
                        <tr>
                        	<td class="login-title-head-text">密码：</td>
                            <td>
                            	<span class="log-icon-bg"><i class="log-psw-icon"></i></span>
                                <input class="login-default-text-input .w190" name="" type="password" id="j_password"
                                onkeypress="enterPress(event)"/>
                            </td>
                        </tr>
                        <tr>
                        	<td class="login-title-head-text">验证码：</td>
                            <td>
                            	<span class="log-icon-bg"><i class="log-vcode-icon"></i></span>
                                <input class="login-default-text-input w100" name="" type="text" id="j_captcha" 
                                onkeypress="enterPress(event)"/>
                                <!-- <span><img src="images/v-code.png" style="vertical-align:middle;" /></span> -->
                                <span id="code">
                                	<a class="fr" href="javascript:refeshCode()"><img id="checkCode" src="<%=contextPath%>/security/jcaptcha.png?rand=<%Math.random();%>" alt="点击换一张" style="vertical-align:middle;"/></a>
                                </span>
                            </td>
                        </tr>
                        <tr>
                        	<td colspan="2" align="center">
                            	<a class="login-btn" onclick="login();" style="cursor: pointer;">
                            	</a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
		</div>
    </div>
</body>
</html>