<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
   String path=request.getContextPath();
   String username=request.getParameter("username");
   String returnurl=request.getParameter("returnurl");
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>验证码</title>
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
    <style type="text/css">
       #codeDiv { 
		        top:30%;          
				left:40%;          
				width:300px;
				height:150px;
				background-color:#e9871e;
				text-align:center;
				position:absolute;
       }  
    </style>
  </head>
  
  <body>
    	<div id="codeDiv">
		   <div style="background-color:#e9871e;margin-top:50px;">
			   <span>验证码正在发送中...请稍等！</span>
			   <input type="text" id="checkCode" name="checkCode" style="margin-left:10px;"/>
			   <input type="button" id="sendBtn" onclick="login();" value="登录" style="margin-right:10px;margin-top:10px;"/>
		   </div>
    	</div>
    	<script type="text/javascript">
    	  sendCode();
    	  function sendCode(){
    		  var username="<%=username%>";
    		  var path="<%=path%>";
    		  $.ajax({
          		url: path+'/sendCode/send-code!sendCode.action',
  		        type: 'post',
  		        dataType: 'json',
  		        async:false,
  		        data: {
  		        	username: username
  		        },
  		        success: function (r) {
  		        	if(r!="验证码发送成功,请查看手机！"){
  		        		alert(r);
  		        	}
  		        }
  		    });
    	  }
    	  
    	  function login(){
    		  if($("#checkCode").val()==""){
    			  return;
    		  }
    		  var username="<%=username%>";
    		  var checkCode=$("#checkCode").val();
    		  var path="<%=path%>";
    		  $.ajax({
            		url: path+'/sendCode/send-code!login.action',
    		        type: 'post',
    		        dataType: 'json',
    		        async:false,
    		        data: {
    		        	username: username,
    		        	checkCode:checkCode
    		        },
    		        success: function (r) {
    		        	if(r=="success"){
    		        		var returnurl="<%=returnurl%>";
        		    		document.location=returnurl.replace("/sso-protect", "");
    		        	}else{
    		        		alert(r);
    		        	}
    		        }
    		    });
    	  }
    	</script>
  </body>
</html>
