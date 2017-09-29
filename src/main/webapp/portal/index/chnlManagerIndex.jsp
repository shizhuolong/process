<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH,0);
	String prevMonth=new SimpleDateFormat("yyyyMM").format(ca.getTime());
	Date date=new Date();
	String year=new SimpleDateFormat("yyyy").format(ca.getTime());
	int month=date.getMonth()+1;
	int day = date.getDate();
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
/* 	Map<String,Object> m=(Map<String,Object>)request.getAttribute("m");
 */%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>工作台首页</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/public.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.ba-throttle-debounce.min.js"></script>
<script src="<%=request.getContextPath()%>/portal/index/echarts/build/dist/echarts.min.js?v=1"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
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
});

</script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/index/js/chnlManagerIndex.js?v=46"></script>
<style type="text/css">

#contentTop th,#contentTop td{
	border-left: 1px solid #e7d4b3;
	font-size: 12px;
	font-weight: bold;
	text-align: center;
	white-space: nowrap;
	border-bottom: 1px solid #c0e2ef;
	padding: 6px 12px;
	box-sizing: border-box;
}

TABLE {
	border-collapse: collapse;
	border-top: solid #e7d4b3 1px;
	border-right: solid #e7d4b3 1px;
	width: 100%;
}

.default-table {
    border-collapse: collapse;
    width: 90%;
    background: #fff;
}
.default-table tr:hover{background-color: #CAE1FF ;} 
.default-table td, .default-table th {
    padding: 0.4em 1em;
    /* text-align: left; */
	border-bottom:1px solid #c0e2ef;
}
</style>
</head>
<body>
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="prevMonth" value="<%=prevMonth%>">
<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
<input type="hidden" id="code" value="<%=org.getCode()%>">
<input type="hidden" id="orgId" value="<%=org.getId()%>">
<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
<input type="hidden" id="userId" value="<%=user.getId()%>">
<input type="hidden" id="userName" value="<%=user.getRealName()%>">
<div>
 	<div id="container">
         <div id="content" style="width:99%;">
         	<div id="cc" style="width:100%;height:350px;">
                 <div data-options="region:'west'" style="width:232px;height:500px;">
                 	<div id="left-menu">
                         <div id="left-menu">
                           <div id="textContent" style="text-align:center;">
                                    <%=year%>年<%=month%>月<%=day%>日
									</br><%=user.getRealName()%>你好：
									</br>截至<%=day%>日，累计发展移网 ${m.LJ_DEV_MOB_NUM}户
									</br>宽带${m.LJ_DEV_KD} 户，收入环比上月增长${m.ALL_SR_MOB_RATIO} 
						   </div> 
                            <div id="my_menu" style="margin-top:30px;" class="sdmenu">
                                 <div classType="left-module" moduleid="left-1" title="我的排名">
                                    <span id="jfTitle"><i class="menu-toDo"></i>排名</span>
                                   	<a style="color:#191970;" href="javascript:void(0);" id="unit_alljf">营服排名:${m.SR_UNIN_RANK}</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="unit_sl_alljf">州市排名: ${m.SR_REG_RANK}</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="wx_unit_cre">全省排名: ${m.SR_PRO_RANK}</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="all_jf">所属区县: <%=org.getOrgName()%></a>
                                     <a style="color:#191970;" href="javascript:void(0);" id="unit_sl_alljf">上级领导: ${m.NAME}</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="wx_unit_cre">上月KPI: ${m.KPI_RESULT}</a>
                                    <a style="color:#191970;" href="javascript:void(0);" id="all_jf">上月薪酬: ${m.BASE_KPI_SALARY}</a>  
                                </div> 
                                <div classType="left-module" moduleid="left-2" title="最新公告">
                                    <span id="bulls"><i class="menu-note"></i>最新公告</span>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
                 <div data-options="region:'center'" style="overflow:hidden;">
                        <div>
                 	       <table id="contentTop" style="color:#fc9612;">
                 	          <thead>
                 	              <tr>
                 	                  <th colspan="2">收入(年/元)</th><th colspan="3">发展(年/户)</th><th colspan="2">毛利(年/元)</th>
                 	              </tr>
                 	              <tr>
                 	                  <th>移动</th><th>宽固</th><th>移动</th><th>宽带</th><th>专租线</th><th>市场线</th><th>全成本</th>
                 	              </tr>
                 	          </thead>
                 	          <tbody style="color:red;">
                 	             
                 	          </tbody>
                 	       </table>
                 	     </div>
                 	 <div id="main" style="min-height:300px;text-align:center;">
                         <div class="main-area center-module" moduleid="center-1" title="年度任务完成率">
                         	<div class="title"></div>
                         	<div id="year_complete_chart" style="width:500px;height:300px;">
                            </div>
                         </div> 
                         <div class="main-area right-area center-module" moduleid="center-2" title="时序收入完成率">
                         	 <div class="title"></div>
                             <div id="hour_complete_chart" style="width:500px;height:300px;">
                             </div>
                         </div>
                         <div class="main-block center-module" moduleid="center-3" title="发展、收入..">
                             <div id="chose-place">
                                 <div id="bottomTabs" class="easyui-tabs" style="margin-top:10px; position:relative;">
                                     <div class="sub-module" moduleid="center-3-1" subtitle="发展、收入" title="发展、收入" style="padding:0;width: 800px;">
	                                    <div>
                                             <table class="default-table" id="income_dev" style="width:100%;">
                                                 <thead>
                                                     <tr>
														<th class="first">渠道编码</th>
														<th>渠道名称</th>
														<th>发展(年/户)</th>
														<th>收入(年/元)</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>        
                                             </table>
                                         </div>
                                     </div>
                                     
                                     <div class="sub-module" moduleid="center-3-2" subtitle="渠道占收比预警" title="占收比预警" style="padding:0;width: 800px;">
	                                    <div>
	                                         <button id="chnlYjRule" style="width:80px;height:20px;margin-top:5px;">规则</button>
	                                         <div style="display:none;" id="chnlYjImage">
	                                            <img src="<%=request.getContextPath()%>/images/chnlYjImage.png"/>
	                                         </div>
                                             <table class="default-table" id="chnl_yj" style="width:100%;">
                                                 <thead>
                                                     <tr>
														<th class="first">预警状态</th>
														<th>渠道名称</th>
														<th>渠道编码</th>
														<th>合作期(月)</th>
														<th>当年收入(元)</th>
														<th>当年成本(元)</th>
														<th>当年发展(户)</th>
														<th>当年成本占收比</th>
														<th>生命周期收入(元)</th>
														<th>生命周期成本(元)</th>
														<th>生命周期成本占收比</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>        
                                             </table>
                                         </div>
                                     </div>
                                     
                                      <div class="sub-module" moduleid="center-3-3" subtitle="积分排名" title="积分排名" style="padding:0;width: 800px;">
	                                    <div>
	                                         <button id="rules" style="width:80px;height:20px;margin-top:5px;">规则</button>
	                                         <div style="display:none;" id="ruleImage">
	                                            <img src="<%=request.getContextPath()%>/images/ruleImage.png"/>
	                                         </div>
                                             <table class="default-table" id="jfRank" style="width:100%;">
                                                 <thead>
                                                     <tr>
														<th class="first">地市</th>
														<th>营服</th>
														<th>区县分类</th>
														<th>HR编码</th>
														<th>姓名</th>
														<th>角色</th>
														<th>收入</th>
														<th>积分</th>
														<th>档位</th>
														<th>排名</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>
                                                </table> 
							                     <div id="pageDiv" class="page_count">
													<div class="page_count_left">
																	共有 <span id="totalCount"></span> 条数据
													</div>
								                    <div class="page_count_right">
														<div id="pagination"></div>
												    </div>	
												</div>								
                                         </div>
                                     </div>
                                     
                                 </div>
                             </div>
                         </div>
                       
                         <div class="main-area center-module" moduleid="center-6" title="市场线成本使用情况">
                         	<div class="title" style="background-color:#fc9612;color:#fff;">市场线成本使用情况</div>
                         	<div class="main-area-conFull" style="height: 260px;width: 300px;">
                              <table class="default-table" id="market_user" style="width:170%;">
                                                 <thead>
                                                     <tr>
														<th class="first">HR编码</th>
														<th>指标类型</th>
														<th>指标值</th>
														<th>排名</th>
													</tr>
                                                 </thead>
                                                 <tbody>
                                                 </tbody>        
                                             </table>
                             </div>
                         </div>
                         <div class="main-area right-area center-module" moduleid="center-7" title="年度发展用户">
                         	<div class="title" style="background-color:#fc9612;color:#fff;">年度发展用户</div>
                             <div class="main-area-conFull" style="height: 260px;width: 300px;">
                               <table class="default-table" id="dev_number" style="width:170%;">
                                                 <thead>
                                                     <tr>
														<th class="first">渠道编码</th>
														<th>渠道名称</th>
														<th>首充率</th>
														<th>二充率</th>
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
</body>
</html>