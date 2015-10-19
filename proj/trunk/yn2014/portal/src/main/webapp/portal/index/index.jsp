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
	String curMonthJfpm = new SimpleDateFormat("yyyyMM").format(c.getTime());
	Calendar ca = Calendar.getInstance();
	ca.add(Calendar.DATE, -1);
	String lastday = new SimpleDateFormat( "yyyy年MM月dd日").format(ca.getTime());
	
	ca.add(Calendar.DATE, 1);
	ca.add(Calendar.MONTH,-1);
	String prevMonth=new SimpleDateFormat( "yyyy年MM月").format(ca.getTime());
	
	Calendar cahour = Calendar.getInstance();
	String toNowHour=new SimpleDateFormat( "yyyy年MM月dd日00时-yyyy年MM月dd日HH时").format(cahour.getTime());
	
	String time=new SimpleDateFormat("yyyyMM").format(cahour.getTime());
	
	Calendar caxc = Calendar.getInstance();
	caxc.add(Calendar.MONTH,-1);
	String xctime=new SimpleDateFormat("yyyyMM").format(caxc.getTime());
	
	Calendar cday = Calendar.getInstance();
	cday.add(Calendar.DATE,-1);
	String xcday=new SimpleDateFormat("yyyyMMdd").format(cday.getTime());
	
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
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script>
Array.prototype.contains=function(o){
	for(var i=0;i<this.length;i++){
		if(this[i]==o){
			return true;
		}
	}
	return false;
}
var moduleIds=[];
$(function(){
	 
     var sql="select moduleid from  portal.apdp_user_desk_element where userid='"+$("#userId").val()+"'";
	 var d=query(sql);
	 if(d&&d.length){
		$("#content").find(".sub-module,DIV[classType='left-module'],.center-module").hide();
		
		moduleIds=[];
	 	for(var i=0;i<d.length;i++){
	 		moduleIds[i]=d[i].MODULEID;
			$("#content").find("DIV[moduleid='"+d[i].MODULEID+"']").show();
		}
	 	var topFlag=false,bottomFlag=false;
	 	$("#topTabs").each(function(){
			$(this).find(".sub-module").each(function(){
				if(!moduleIds.contains($(this).attr("moduleid"))){
					var topTab=$("#topTabs").tabs('getTab',$(this).attr("subtitle"));
					if(topTab){
						topTab.panel('options').tab.hide();
					}
				}else{
					if(!topFlag){
						$("#topTabs").tabs('select',$(this).attr("subtitle"));
						topFlag=true;
					}
				}
			});
		});
	 	$("#bottomTabs").each(function(){
			$(this).find(".sub-module").each(function(){
				if(!moduleIds.contains($(this).attr("moduleid"))){
					var bottomTab=$("#bottomTabs").tabs('getTab',$(this).attr("subtitle"));
					if(bottomTab){
						bottomTab.panel('options').tab.hide();
					}
				}else{
					if(!bottomFlag){
						$("#bottomTabs").tabs('select',$(this).attr("subtitle"));
						bottomFlag=true;
					}
				}
			});
		});
	 }
});//$("#easyui-tabs").tabs('close','tab_name')

</script>

<script type="text/javascript" src="<%=request.getContextPath()%>/portal/index/js/index.js"></script>

</head>
<body>
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="prevMonth" value="<%=prevMonth%>">
<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
<input type="hidden" id="code" value="<%=org.getCode()%>">
<input type="hidden" id="orgId" value="<%=org.getId()%>">
<input type="hidden" id="time" value="<%=time%>">
<input type="hidden" id="xctime" value="<%=xctime%>">
<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
<input type="hidden" id="userId" value="<%=user.getId()%>">
<input type="hidden" id="xcday" value="<%=xcday%>">
<input type="hidden" id="curMonthJfpm" value="<%=curMonthJfpm%>">
<div>
 	<div id="container">
         <div id="content" style="width:99%;">
         	<div id="cc" style="width:100%;height:350px;">
                 <div data-options="region:'west'" style="width:232px;">
                 	<div id="left-menu">
                         <div id="left-menu">
                            <div id="my_menu" class="sdmenu">
                            	<div classType="left-module" moduleid="left-1" title="我的薪酬">
                                	<style>
                             TABLE{
			border-collapse: collapse;
			border-top:solid #e7d4b3 1px;
			border-right:solid #e7d4b3  1px;
			width:100%;
		}
        .lch_DataHead TR TH{
			height:30px;
			background: none repeat scroll 0 0 #ffecc8;
		}
		.lch_DataBody TR:hover {
			background-color: rgba(129, 208, 177, 0.3);
		}
		.lch_DataHead TR TH,.lch_DataBody TR TD{
			border-left: 1px solid #e7d4b3;
			color: #d28531;
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			white-space: nowrap;
			border-bottom: 1px solid #c0e2ef;
			padding: 6px 12px;
			box-sizing: border-box;
		}
		.lch_DataBody TR{
			background-color: #fff;
		}
		.lch_DataBody TR TD{
			text-align: left;
    		color: #717171;
    		font-family: "微软雅黑",Arial,"Simsun",sans-serif,SimSun,"宋体",Heiti,"黑体";
    		font-weight: normal;
		}
		.myClass{
			color:#fc9215;
		}
                                	</style>
                                
                                    <span id="xcTitle"><i class="menu-toDo"></i>我的薪酬(<%=xctime %>)</span>
                                   	<a style="color:#191970;" href="javascript:void(0);" id="xc_hrNo">HR编码: </a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="xc_gdxc">固定薪酬: 0</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="xc_kpi">KPI绩效: 0</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="xc_jftc">提成奖励: 0</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="xc_zxjl">专项奖励: 0</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="xc_sum">合计:0</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="fact_total">实发合计:0</a>
                                </div>
                                 <div classType="left-module" moduleid="left-2" title="我的积分">
                                    <span id="jfTitle"><i class="menu-toDo"></i>我的积分(<%=time %>)</span>
                                   	<a style="color:#191970;" href="javascript:void(0);" id="unit_alljf">区域调节销售积分:0 </a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="unit_sl_alljf">区域调节受理积分: 0</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="wx_unit_cre">维系积分: 0</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="all_jf">总积分: 0</a>
                                </div>
                                <div classType="left-module" moduleid="left-3" title="待办工作">
                                    <span><i class="menu-toDo"></i>待办工作</span>
                                    <a href="javascript:void(0);" onclick="openOrderWindow(this)" id="workOrderNum"></a>
                                </div>
                                <div classType="left-module" moduleid="left-4" title="游离渠道">
                                    <span><i class="menu-toDo"></i>游离渠道</span>
                                    <a href="javascript:void(0);" onclick="searchfreeChannel(this)" id="freechannel">游离渠道:0</a>
                                    <a href="javascript:void(0);" onclick="searchfreeCommunity(this)" id="freecommunity">游离小区:0</a>
                                </div>
                                
                                <div classType="left-module" moduleid="left-5" title="最新公告">
                                    <span id="bulls"><i class="menu-note"></i>最新公告</span>
                                </div>
                                <div classType="left-module" moduleid="left-6" title="文件下载">
                                    <span id="indexDocList"><i class="menu-fileDl"></i>文件下载</span>
                                </div>
                                <div classType="left-module" moduleid="left-7" title="访问统计">
                                    <span id="indexAccessList"><i class="menu-note"></i>访问统计</span>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
                 <div data-options="region:'center'" style="overflow:hidden;">
                 	 <div id="main" style="min-height:300px;">
							<div class="main-block center-module" moduleid="center-1" title="渠道、基站、薪酬。。。">
								<div id="chose-place">
									<div id="topTabs" class="easyui-tabs"
										style="height: 500px; margin-top: 0px; position: relative;">
										<div class="sub-module" moduleid="center-1-1" subtitle="渠道分布" title="渠道分布" style="padding: 0;">
											<!--  ul id="chose-place-count" class="bold clearfix">
												<li>渠道分布<i class="fa830b"></i></li>
											</ul-->
											<div class="default-dt dt-autoH">
												<div id="qdfbFrame" class="myItem"
													style="position: absolute; top: 50px; height: 120px; width: 200px; border: solid #c3c3c3 1px; left: 795px; float: right; z-index: 99999; background-color: white;">
													<div style="margin: 5px;" class="title">
														<i></i>渠道分布
													</div>
													<div style="margin: 5px;">
														<img
															src="<%=request.getContextPath()%>/portal/index/images/location_red16.png" />--上月无销量
													</div>
													<div style="margin: 5px;">
														<img
															src="<%=request.getContextPath()%>/portal/index/images/location16.png" />--上月有销量
													</div>
													<div style="margin: 10px; font-size: 12px;">
														<input style="vertical-align: -2px;" type="checkbox"
															name="zhch" value="10" checked />&nbsp;正常&nbsp; <input
															style="vertical-align: -2px;" type="checkbox"
															name="qsuan" value="11" />&nbsp;清算&nbsp; <input
															style="vertical-align: -2px;" type="checkbox" name="zhzh"
															value="12" />&nbsp;终止
													</div>
												</div>
												<div id="qdfb" class="myItem"
													style="height: 500px; width: 100%; position: absolute; z-index: 8888;"></div>
											</div>
										</div>
										<div class="sub-module" moduleid="center-1-2" subtitle="基站分布" title="基站分布" style="padding: 0;">
											<!-- ul id="chose-place-count" class="bold clearfix">
												<li>基站分布<i class="fa830b"></i></li>
											</ul-->
											<div class="default-dt dt-autoH">
												<div id="jzfbFrame" class="myItem"
													style="position: absolute; top: 50px; height: 60px; width: 200px; border: solid #c3c3c3 1px; left: 795px; float: right; z-index: 99999; background-color: white;">
													<div style="margin: 5px;" class="title">
														<i></i>基站分布
													</div>
													<div style="margin: 10px; font-size: 12px;">
														<input style="vertical-align: -2px;" type="checkbox"
															name="2G" value="2G" checked />&nbsp;2G&nbsp; <input
															style="vertical-align: -2px;" type="checkbox" name="3G"
															value="3G" />&nbsp;3G&nbsp;
													</div>
												</div>
												<div id="jzfb" class="myItem"
													style="height: 500px; width: 100%; position: absolute; z-index: 8888;"></div>
											</div>
										</div>
										<a id="arrow-down" class="arrow-down-map"
											style="display: block;"></a>
										<div class="sub-module" moduleid="center-1-3" subtitle="团队薪酬" title="团队薪酬" style="padding: 0;">
											<div class="default-dt dt-autoH" style="margin-top: 15px;">
												<div id="xcfb" class="myItem"
													style="height: 500px; width: 100%; position: absolute; z-index: 8888;">
													<iframe name="xcfbWin" id="xcfbWin" scrolling="auto"
														frameborder="0" width="100%" height="100%" src=""></iframe>
												</div>
											</div>
										</div>
										<div class="sub-module" moduleid="center-1-4" subtitle="积分排名" title="积分排名" style="padding: 0;">
											<ul id="chose-place-count" class="bold clearfix">
												<li>本月积分排名—<i class="fa830b"><%=curMonth%></i></li>
											</ul>
											<div class="default-dt dt-autoH">
												<table class="default-table" style="" id="jfphTable">
													<thead>
														<tr>
															<th class="first">地市</th>
															<th>营服中心</th>
															<th>人员姓名</th>
															<th>本月销售积分</th>
															<th>本月受理积分</th>
															<th>本月维系积分</th>
															<th>本月累计积分</th>
															<th>本月累计薪酬</th>
															<th>本月全省排名</th>
															<th>本月地市排名</th>
															<th>本月营服中心排名</th>
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
                         <div class="main-area center-module" moduleid="center-2" title="日发展量趋势">
                         	<div class="title"><i></i>日发展量趋势—<%=curMonth%></div>
                         	<div class="main-area-conFull" id="income_dev_chart" style="height: 280px;width: 515px;">
                             </div>
                         </div>
                         <div class="main-area right-area center-module" moduleid="center-3" title="日收入趋势">
                         	<div class="title"><i></i>日收入趋势—<%=curMonth %></div>
                             <div class="main-area-conFull" id="net_income_chart" style="height: 280px;width: 515px;">
                             </div>
                         </div>
                         <div class="main-area center-module" moduleid="center-4" title="佣金分布">
                         	<div class="title"><i></i>佣金分布—<%=prevMonth %></div>
                         	<div class="main-area-conFull" id="yjfb" style="height: 280px;width: 515px;">
                             </div>
                         </div>
                         <div class="main-area right-area center-module" moduleid="center-5" title="佣金占比">
                         	<div class="title"><i></i>佣金占比—<%=prevMonth %></div>
                             <div class="main-area-conFull" id="yjzb" style="height: 280px;width: 515px;">
                             </div>
                         </div>
                         <div class="main-block center-module" moduleid="center-6" title="发展、佣金、排名。。。">
                             <div id="chose-place">
                                 <!-- <div class="title-o"><i>分析与收入日分析</i></div> -->
                                 <div id="bottomTabs" class="easyui-tabs" style="width:100%;height:580px; margin-top:10px; position:relative;">
                                     <div class="sub-module" moduleid="center-6-1" subtitle="发展与收入日分析" title="发展与收入日分析" style="padding:0;">
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
                                    <div class="sub-module" moduleid="center-6-2" subtitle="佣金总览" title="佣金总览" style="padding:0;">
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
                                     
                                     <div class="sub-module" moduleid="center-6-3" subtitle="日实时发展" title="日实时发展" style="padding:0;">
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
                                     
                                     
                                     <div class="sub-module" moduleid="center-6-4" subtitle="销售排名" title="销售排名" style="padding:0;">
                                     	<ul id="chose-place-count" class="bold clearfix">
	                                        <li>本月销售排名—<i class="fa830b"><%=curMonth %></i></li>
	                                    </ul>
                                         <div class="default-dt dt-autoH">
                                             <table class="default-table"  style=" " id="xsphTable">
                                                 <thead>	 	 	 	
                                                     <tr>
														<th class="first" rowspan='2'>地市</th>
														<th rowspan='2'>营服中心</th>
														<th rowspan='2'>人员姓名</th>
														<th colspan='5'>发展量</th>
														<th rowspan='2'>本月全省排名</th>
														<th rowspan='2'>本月地市排名</th>
														<th rowspan='2'>本月营服中心排名</th>
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
                 $("#arrow-down").toggle(function(){
                	 $(this).addClass("arrow-up-map").removeClass("arrow-down-map");
         			 $(this).parent().animate({height:"35px"});
                 },function(){
                	 $(this).addClass("arrow-down-map").removeClass("arrow-up-map");
                	 $(this).parent().animate({height:"500px"});
                 });
                 
                 //
                 function showConfigDialog(){
                	 var l="";
                	 $("#content").find("DIV[classType='left-module']").each(function(){
                		 l+="<input style='margin-top:10px;margin-left:10px;' type='checkbox' moduleid='"+$(this).attr("moduleid")+"' />"+$(this).attr("title")+"<br/>";
                	 });
                	 var r="";
                	 $("#content").find(".center-module").each(function(){
                		 r+="<input style='margin-top:10px;margin-left:10px;' type='checkbox' moduleid='"+$(this).attr("moduleid")+"' />"+$(this).attr("title")+"<br/>";
                		 var hasSub=false;
                		 var pThis=this;
                		 $(this).find(".sub-module").each(function(i){
                			 if(i==0){
                				 r+=">>";
                			 }
                			 hasSub=true;
                			 r+="<input style='margin-left:5px;margin-top:10px;' type='checkbox' pid='"+$(pThis).attr("moduleid")+"' moduleid='"+$(this).attr("moduleid")+"' />"+$(this).attr("subtitle");
                		 });
                		 if(hasSub){
                			 r+="<br/>";
                		 }
                	 });
                	 var h="<div id='configDialog' style='padding:12px;padding-right:12px;'>"
                		 +"<table><thead class='lch_DataHead lch_DataBody'>"
                		 	+"<tr><th>左侧栏</th><th>右侧栏</th></tr>"
							+"<tr><td style='width:150px;text-align:left;'>"+l
							+"</td>"
							+"<td style='width:320px;text-align:left;'>"+r
							+"</td></tr>"
							+'<tr><td colspan="2" style="text-align:center;"><a class="default-btn" href="#" id="saveBtn" style="float:right;">保存</a></td></tr>'
						+"</thead></table>"	 
						
                	 +"</div>";
						art.dialog({
						    title: '工作台配置',
						    content: h,
						    padding: 0,
						    lock:true
						});
						//初始化
						var sql="select moduleid from  portal.apdp_user_desk_element where userid='"+$("#userId").val()+"'";
						var d=query(sql);
						if(d&&d.length){
							for(var i=0;i<d.length;i++){
								$("#configDialog").find("INPUT[moduleid='"+d[i].MODULEID+"']").attr("checked",'true');
							}
						}
						$("#saveBtn").click(function(){
							var ids="";
							$("#configDialog").find("INPUT[type='checkbox']:checked").each(function(){
								if(ids!=""){
									ids+=",";
								}
								ids+=$(this).attr("moduleid");
							});
							ids="'"+ids+"'";
							$.ajax({
								type:"POST",
								dataType:'json',
								async:false,
								cache:false,
								url:$("#ctx").val()+"/index/index_saveDesk.action",
								data:{
						           "moduleIds":ids
							   	}, 
							   	success:function(data){
							    	parent.switchFirstMenu('000','工作台');
							    }
							});
						});
						$("#configDialog").find("INPUT[type='checkbox']").click(function(){
							if($(this).attr("checked")!=undefined){
								$("#configDialog").find("INPUT[moduleid='"+$(this).attr("pid")+"']").attr("checked",'true');
							}else{
								var l=$("#configDialog").find("INPUT[pid='"+$(this).attr("moduleid")+"']:checked").length;
								if(l>0){
									$(this).attr("checked",'true');
								}
							}
							
						});
                 }
             </script>
         </div>
    </div>
</div>
</body>
</html>