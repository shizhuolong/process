<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	Calendar c=Calendar.getInstance();
	c.add(Calendar.DATE, -1);
	String curMonth = new SimpleDateFormat("yyyy年MM月").format(c.getTime());
	Calendar ca = Calendar.getInstance();
	ca.add(Calendar.DATE, -1);
	String lastday = new SimpleDateFormat( "yyyy年MM月dd日").format(ca.getTime());
	
	ca.add(Calendar.DATE, 1);
	ca.add(Calendar.MONTH,-1);
	String prevMonth=new SimpleDateFormat( "yyyy年MM月").format(ca.getTime());
	
	Calendar cahour = Calendar.getInstance();
	String toNowHour=new SimpleDateFormat( "yyyy年MM月dd日00时-yyyy年MM月dd日HH时").format(cahour.getTime());
	
	String time=new SimpleDateFormat("yyyyMM").format(cahour.getTime());
	
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>工作台首页</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/public.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.ba-throttle-debounce.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.stickyheader.js"></script>
<%-- <script type="text/javascript" src="<%=request.getContextPath()%>/portal/index/echarts/build/dist/echarts-all.js"></script> --%>
<script src="<%=request.getContextPath()%>/portal/index/echarts/build/dist/echarts.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=LoQz3WDvhfXEVMZ53qowzIQP"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/index/js/index.js"></script>
</head>
<body>
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="prevMonth" value="<%=prevMonth%>">
<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
<input type="hidden" id="code" value="<%=org.getCode()%>">
<input type="hidden" id="orgId" value="<%=org.getId()%>">
<input type="hidden" id="time" value="<%=time%>">
<div>
 	<div id="container">
         <div id="content" style="width:99%;">
         	<div id="cc" style="width:100%;height:350px;">
                 <div data-options="region:'west'" style="width:232px;">
                 	<div id="left-menu">
                         <div id="left-menu">
                            <div id="my_menu" class="sdmenu">
                                <div>
                                    <span><i class="menu-toDo"></i>待办工作</span>
                                    <a href="javascript:void(0);" onclick="openOrderWindow(this)" id="workOrderNum"></a>
                                </div>
                                <div>
                                    <span><i class="menu-toDo"></i>游离渠道</span>
                                    <a href="javascript:void(0);" onclick="searchfreeChannel(this)" id="freechannel">游离渠道:0</a>
                                </div>
                                <div>
                                    <span id="bulls"><i class="menu-note"></i>最新公告</span>
                                </div>
                                <div>
                                    <span id="indexDocList"><i class="menu-fileDl"></i>文件下载</span>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
                 <div data-options="region:'center'">
                     <div id="main">
                      
                     	 <div style="width: 97%;float: left;border:1px solid #e7d4b3;padding:1%;margin-bottom:10px;">
                         	 <div class="title"><i></i>渠道分布<div class="arrow-up-map" style="float:right;">&nbsp;</div></div>
                             <div class="main-area-conFull" style="height: 500px;width: 1000px;">
                             	<div id="qdfbFrame" style="position:absolute;top:50px;height: 100px;width: 200px;border:solid #c3c3c3 1px;left:795px;float:right;z-index:99999;background-color:white;">
                             		<div style="margin:5px;"><img src="<%=request.getContextPath() %>/portal/index/images/location_red16.png"" />--上月无销量</div>
                             		<div style="margin:5px;"><img src="<%=request.getContextPath() %>/portal/index/images/location16.png"" />--上月有销量</div>
                             		<div style="margin:10px;font-size:12px;">
                             			<input style="vertical-align:-2px;" type="checkbox" name="zhch" value="10" checked/>&nbsp;正常&nbsp;
                             			<input style="vertical-align:-2px;" type="checkbox" name="qsuan" value="11"/>&nbsp;清算&nbsp;
                             			<input style="vertical-align:-2px;" type="checkbox" name="zhzh" value="12"/>&nbsp;终止
                             		</div>
                             	</div>
                             	<div id="qdfb" style="height: 500px;width: 980px;position:absolute;z-index:8888;"></div>
                             	
                             </div>
                         </div> 
                         <div class="main-area">
                         	<div class="title"><i></i>日发展量趋势—<%=curMonth %></div>
                         	<div class="main-area-conFull" id="income_dev_chart" style="height: 280px;width: 525px;">
                             </div>
                         </div>
                         <div class="main-area right-area">
                         	<div class="title"><i></i>日收入趋势—<%=curMonth %></div>
                             <div class="main-area-conFull" id="net_income_chart" style="height: 280px;width: 525px;">
                             </div>
                         </div>
                         <div class="main-area">
                         	<div class="title"><i></i>佣金分布—<%=prevMonth %></div>
                         	<div class="main-area-conFull" id="yjfb" style="height: 280px;width: 525px;">
                             </div>
                         </div>
                         <div class="main-area right-area">
                         	<div class="title"><i></i>佣金占比—<%=prevMonth %></div>
                             <div class="main-area-conFull" id="yjzb" style="height: 280px;width: 525px;">
                             </div>
                         </div>
                         <div class="main-block">
                             <div id="chose-place">
                                 <!-- <div class="title-o"><i>分析与收入日分析</i></div> -->
                                 <div class="easyui-tabs" style="width:100%;height:580px; margin-top:10px; position:relative;">
                                     <div title="发展与收入日分析" style="padding:0;">
                                     	<ul id="chose-place-count" class="bold clearfix">
	                                        <li>发展与收入日分析—<i class="fa830b"><%=lastday %></i></li>
	                                    </ul>
                                         <div class="default-dt dt-autoH">
                                             <table class="default-table"  style=" " id="income_dev">
                                                 <thead>
                                                     <tr>
														<th class="first">组织架构</th>
														<th>2G发展(户)</th>
														<th>2G收入(元)</th>
														<th>3G发展(户)</th>
														<th>3G收入(元)</th>
														<th>4G发展(户)</th>
														<th>4G收入(元)</th>
														<th>发展合计(户)</th>
														<th>收入合计(元)</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>        
                                             </table>
                                         </div>
                                     </div>
                                    <div title="佣金总览" style="padding:0;">
                                     	<ul id="chose-place-count" class="bold clearfix">
	                                        <li>佣金总览—<i class="fa830b"><%=prevMonth %></i></li>
	                                    </ul>
                                         <div class="default-dt dt-autoH">
                                             <table class="default-table"  style=" " id="Yj">
                                                 <thead>
                                               	 	 	 	 	 	 	
                                                     <tr>
														<th class="first">组织架构</th>
														<th>2G佣金(元)</th>
														<th>3G佣金(元)</th>
														<th>固网佣金(元)</th>
														<th>融合佣金(元)</th>
														<th>渠道补贴佣金(元)</th>
														<th>其他佣金(元)</th>
														<th>总佣金(元)</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>        
                                             </table>
                                         </div>
                                     </div>
                                     
                                     <div title="日实时发展" style="padding:0;">
                                     	<ul id="chose-place-count" class="bold clearfix">
	                                        <li>日实时发展—<i class="fa830b"><%=toNowHour %></i></li>
	                                    </ul>
                                         <div class="default-dt dt-autoH">
                                             <table class="default-table"  style=" " id="ssfzTable">
                                                 <thead>	 	 	 	
                                                     <tr>
														<th class="first">组织架构</th>
														<th>2G发展</th>
														<th>3G发展</th>
														<th>上网卡发展</th>
														<th>发展合计</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>        
                                             </table>
                                         </div>
                                     </div>
                                     
                                     
                                     <div title="销售排行" style="padding:0;">
                                     	<ul id="chose-place-count" class="bold clearfix">
	                                        <li>本月销售排行—<i class="fa830b"><%=curMonth %></i></li>
	                                    </ul>
                                         <div class="default-dt dt-autoH">
                                             <table class="default-table"  style=" " id="xsphTable">
                                                 <thead>	 	 	 	
                                                     <tr>
														<th class="first" rowspan='2'>地市</th>
														<th rowspan='2'>营服中心</th>
														<th rowspan='2'>人员姓名</th>
														<th colspan='5'>发展量</th>
														<th rowspan='2'>本月全省排行</th>
														<th rowspan='2'>本月地市排行</th>
														<th rowspan='2'>本月营服中心排行</th>
													</tr>
													<tr>
														<th>2G</th>
														<th>3G</th>
														<th>4G</th>
														<th>上网卡</th>
														<th>合计</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>        
                                             </table>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
             <script type="text/javascript">
                 $(function(){
                     $('#cc').layout();
                     setHeight();
                 });
                 
                 function addItem(){
                     $('#cc').layout('panel','center').append('<p>More Panel Content.</p>');
                     setHeight();
                 }
                 
                 function removeItem(){
                     $('#cc').layout('panel','center').find('p:last').remove();
                     setHeight();
                 }
                 
                 function setHeight(){
                     var c = $('#cc');
                     var p = c.layout('panel','center');	// get the center panel
                     var oldHeight = p.panel('panel').outerHeight();
                     p.panel('resize', {height:'auto'});
                     var newHeight = p.panel('panel').outerHeight();
                     c.layout('resize',{
                         height: (c.height() + newHeight - oldHeight)
                     });
                 }
             </script>
         </div>
    </div>
</div>
</body>
</html>