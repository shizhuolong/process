<%@page import="org.apdplat.platform.util.DateUtil"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page  import="org.apdplat.module.security.model.User"%>
<%@page  import="org.apdplat.module.security.service.UserHolder"%>
<%@page  import="org.apdplat.module.system.service.PropertyHolder"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<%
response.addHeader("login_success","true");  
User loginUser=UserHolder.getCurrentLoginUser();
String username="匿名用户";
String realName="";
long userId=0;
String orgName="匿名组织架构";
long orgId=0;
String orgLevel = "";
String userPath="";
if(loginUser!=null){
    //设置用户的数据上传主目录
    userPath=request.getContextPath() + "/userfiles/"+loginUser.getId()+"/";
    request.getSession().setAttribute("userPath", userPath);
    orgName=loginUser.getOrg()==null?"匿名组织架构":loginUser.getOrg().getOrgName();
    orgId=loginUser.getOrg()==null?0:loginUser.getOrg().getId();
    username=loginUser.getUsername();
    realName=loginUser.getRealName();
    if(realName==null){
        realName=username;
    }
    userId=loginUser.getId();
    orgLevel = loginUser.getOrg().getOrgLevel();
}

//日期
	Calendar c=Calendar.getInstance();
	String today = new SimpleDateFormat( "yyyy年MM月dd日    ").format(c.getTime())+DateUtil.getZhWeekDay(c);

%>
<html  xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <!--<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />-->
        <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" /><!-- 解决IE9下左侧菜单树无法点击的问题 -->
        <title>基层责任单元服务支撑系统</title>
        <link rel="shortcut icon" href="../images/apdplat.ico" />
        <%@include file="include/common.jsp" %>
        <!-- <link rel="stylesheet" type="text/css" href="css/qq.css"/> -->
        <script type="text/javascript" src="js/onlineUser.js"></script>
        <!-- <script type="text/javascript" src="js/onlineChat.js"></script> -->
        <!-- <script type="text/javascript" src="js/indexPage_apdplat.js"></script> -->
        <script type="text/javascript" src="js/index.js"></script>
        <script type="text/javascript" src="js/modfiyPassword.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
        <script type="text/javascript">            
            var userPath="<%=userPath%>";
            var userId="<%=userId%>";
            var username="<%=username%>";
            var realName="<%=realName%>";
            var orgName="<%=orgName%>";
            var orgId="<%=orgId%>";
            var orgLevel="<%=orgLevel%>";
            
            var privileges='<%=loginUser.getAuthoritiesStr()%>';
            function isGranted(namespace,action,command){
                if(privileges.toString().indexOf("ROLE_SUPERMANAGER")!=-1){
                    return true;
                }
                var role="ROLE_MANAGER_"+namespace.toUpperCase().replace("/", "_")+"_"+process(action).toUpperCase()+"_"+command.toUpperCase();
                if(privileges.toString().indexOf(role)==-1){
                    return false;
                }
                return true;
            }
            function isGrantedNew(role){
                if(privileges.toString().indexOf("ROLE_SUPERMANAGER")!=-1){
                    return true;
                }
                if(privileges.toString().indexOf(role)==-1){
                    return false;
                }
                return true;
            }
            //用来保存在tab页面中打开的窗口
            var openingWindows=new Array();
            function refreshAll(){
                for(var i=0;i<openingWindows.length;i++){
                    if(openingWindows[i]!=undefined && openingWindows[i].closed==false){
                        openingWindows[i].refreshTheme();
                    }
                }
                refreshTheme();
            }
            
            function changeTime(){
                     document.getElementById("time").innerHTML = new Date().format('Y年n月j日  H:i:s');
            }
            //setInterval("changeTime()",1000);
            function selectSwitch(current){
                var lis=document.getElementsByTagName("li")
                for(var i=0;i<lis.length;i++){
                    if(lis[i].className=="select"){
                        lis[i].className="";
                        lis[i].getElementsByTagName("a")[0].className="";
                    }
                };
                current.className="select";
                current.getElementsByTagName("a")[0].className="select";
            }
            
            $(document).ready(function(){
            	
            	
            });
            function configDesk(){
            	//首先判断是否在首页，若不在首页则先打开首页
            	var $desc=$("#navi").find("LI:first");
            	if(!$desc.hasClass("select")){
            		selectSwitch($desc[0]);
            		switchFirstMenu('000','工作台');
            		$("#center-panel").find("#indexPage:visible").find("IFRAME").unbind().load(function(){
            			showConfigDialog();
            		});
            		
            	}else{
            		showConfigDialog();
            	}
            }
            function showConfigDialog(){
            	$("#center-panel").find("#indexPage:visible").find("IFRAME")[0].contentWindow.showConfigDialog(); 
            }
            function searchQA(even){
                openWindow('QA问题列表','computer', '<%=request.getContextPath()%>/portal/quest/jsp/comm_problem.jsp');
                switchFirstMenu('module-477161','预警监控');
            }
	</script>
    </head>
    <body id="apdplat_main">
    	<div id="container">
        <div id="loading-mask"></div>
        <div id="loading">
            <div class="loading-indicator"></div>
        </div>
        <div id="north"> 
            <div id="head">
            	<div id="logo"></div>
                <div id="navi">
                	<ul class="clearfix">
                    	<jsp:include page="include/topnav_apdplat.jsp"></jsp:include>
                    </ul>
                </div>
                <div id="head-info">
                	<ul class="head-info-date clearfix">
                        <li>欢迎您：<a href="javascript:void(0);"><%=realName %> | <%=orgName%></a><span>&nbsp;&nbsp;</span><%=today %></li>
                        <li><a href="javascript:void(0);" onclick="searchQA(this);"><i id="searchQA"></i>QA问题</a></li>
					</ul>
                    <ul class="head-info-user clearfix mt5">
                        <li><a href="javascript:void(0);" onclick="logout();"><i id="logout-icon"></i>退出</a></li>
                        <li><a href="javascript:void(0);" onclick='configDesk();'><i id="editPsw-icon"></i>工作台配置</a></li>
                        <li><a href="javascript:void(0);" onclick='ModifyWindow.show();'><i id="editPsw-icon"></i>修改密码</a></li>
                    	<li><span>服务热线：186-8790-6699&nbsp;&nbsp;&nbsp;QQ交流群：146461273</span></li>
                    </ul>
                </div>
            </div>
        </div>
	   </div>
    </body>
</html>