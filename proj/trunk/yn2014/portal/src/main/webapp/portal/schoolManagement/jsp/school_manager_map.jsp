<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String dealDate=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/portal/schoolManagement/js/school_manager_map.js"></script>    
    <style type="text/css">
        body, html,#s-map{width: 100%;height: 100%;margin:0;font-family:"微软雅黑";font-size:14px;position:absolute;}
    </style>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=PnzjnWHKw1yvjOwCdFRRKjdP0pUnXG3i"></script>
    <title>校园管家</title>
</head>
<body>
    <input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
    <div align="center">
    <div class="ui-widget" align="center">
        <input id="serachText" type="text">
        <input id="uuid" type="hidden">
        <input id="secachBtn" type="button" value="查询">
    </div>
    <div id="s-map"></div>
    </div>
</body>
</html>
<script type="text/javascript">
    map = new BMap.Map("s-map");    // 创建Map实例
    map.centerAndZoom("昆明", 7);  // 初始化地图,设置中心点坐标和地图级别   
    map.setCurrentCity("昆明");  // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    
</script>