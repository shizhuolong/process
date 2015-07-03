<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<%
	String contextPath = request.getContextPath();
	String account = request.getParameter("account");
	String password = request.getParameter("password");
	
	//String account = "GZTH2371";
	//String password = "499e14f5ca39aa69798d2a4bb2bb440a";
%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>广东联通代收费系统</title>
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="extjs/js/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="extjs/js/ext-all.js"></script>
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
        var account='<%=account%>';
        var password='<%=password%>';
        
        
        //登录
        function login() {
        	
             var url = 'j_spring_security_check';
             Ext.Ajax.request({
                 url : url,
                 params : {
                     j_username : account,
                     j_password : password,
                     otherSys	: 'yes'
                 },
                 method : 'POST',
                 success:function(response, opts){
                    if(response.getResponseHeader('login_success') || response.responseText.length > 20) {
                         location.replace(contextPath+"/platform/index.jsp");
                         return;
                     }  
                 },
                 failure: function(response, opts) {
                     location.replace("platform/index.jsp");
                 }
             });
        }
    </script>

</head>
<body onload="login();">
正在跳转......
</body>
</html>