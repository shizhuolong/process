<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
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
	String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>测试报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>

</head>
<style>
	a.sub_off {
	    background: url("<%=request.getContextPath()%>/report/devIncome/images/a_sub_o.png") no-repeat scroll 0 0 transparent;
	    height: 22px;
	    padding-left: 22px;
	}
	a.sub_on {
	    background: url("<%=request.getContextPath()%>/report/devIncome/images/a_sub.png") no-repeat scroll 0 2px transparent;
	    height: 22px;
	    padding-left: 22px;
	}
	a.asc {
	    background: url("<%=request.getContextPath()%>/report/devIncome/images/asc.png") no-repeat scroll 0 0 transparent;
	    height: 22px;
	    cursor: pointer;
	    padding-left:24px;
	    z-index: 9999;
	}
	a.desc {
	    background: url("<%=request.getContextPath()%>/report/devIncome/images/desc.png") no-repeat scroll 0 0 transparent;
	    height: 22px;
	    cursor: pointer;
	    padding-left:24px;
	    z-index: 9999;
	}
</style>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<div id="container">
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" /> <input type="hidden"
				name="resultMap.rows" />
			<table width="100%" style="margin: 10px 0;">
				<tr height="35px">
					<td width="5%" style="padding-left: 10px;">账期：</td>
					<td width="20%">
						<input type="text"  class="Wdate default-text-input wper20" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=month %>" id="month">
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 48px;" onclick="showSub()">查询</a>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
		</form>
		<div class="default-dt dt-autoH" >
			<div class="sticky-wrap">
				<table class="default-table sticky-enabled"  >
					<thead id="dataHead">
						<tr>
							<th class="first" rowspan="2">营销架构</th>
							<th colspan="7" expand='true'>2G出账用户</th>
							<th colspan="7" expand='true'>3G出账用户</th>
							<th colspan="7" expand='true'>4G出帐用户</th>
							<th colspan="6" expand='true'>固网宽带出账用户</th>
							<th colspan="7" expand='true'>2G用户发展</th>
							<th colspan="7" expand='true'>3G用户发展</th>
							<th colspan="7" expand='true'>4G用户发展</th>
							<th colspan="6" expand='true'>固网宽带用户发展</th>
							<th colspan="7" expand='true'>2G出账收入</th>
							<th colspan="7" expand='true'>3G出账收入</th>
							<th colspan="7" expand='true'>4G出账收入</th>
							<th colspan="6" expand='true'>固网宽带出账收入</th>
							<th  rowspan="2">专租线发展</th>
							<th  rowspan="2">专租线收入</th>
							<th colspan="4">2G用户语音流量</th>
							<th colspan="4">3G用户语音流量</th>
							<th colspan="4">4G用户语音流量</th>	
						</tr>
						<tr>
							<th>长话王</th>
							<th>市话王</th>
							<th>包打王</th>
							<th>流量王</th>
							<th>极速卡</th>
							<th>其他</th>
							<th>合计</th>
							
							<th>单卡</th>
							<th>购机送费</th>
							<th>存费送机</th>
							<th>存费送费</th>
							<th>本省自备机</th>
							<th>上网卡</th>
							<th>合计</th>
													
							
							<th>本地单卡</th>
							<th>本地套餐合约惠机</th>
							<th>本地套餐存费送费</th>
							<th>全国套餐购机送费</th>
							<th>全国套餐存费送机</th>
							<th>全国套餐合约惠机</th>
							<th>合计</th>
												
							
							<th>ADSL</th>
							<th>LAN</th>
							<th>EOC</th>
							<th>FTTH</th>
							<th>其中10M及以上</th>
							<th>合计</th>
							
												
							<th>长话王</th>
							<th>市话王</th>
							<th>包打王</th>
							<th>流量王</th>
							<th>极速卡</th>
							<th>其他</th>
							<th>合计</th>
							
											
							
							<th>单卡</th>
							<th>购机送费</th>
							<th>存费送机</th>
							<th>存费送费</th>
							<th>本省自备机</th>
							<th>上网卡	</th>
							<th>合计</th>
													
							
							<th>本地单卡</th>
							<th>本地套餐合约惠机</th>
							<th>本地套餐存费送费</th>
							<th>全国套餐购机送费</th>
							<th>全国套餐存费送机</th>
							<th>全国套餐合约惠机</th>
							<th>合计</th>
												
							
							<th>ADSL</th>
							<th>LAN</th>
							<th>EOC</th>
							<th>FTTH</th>
							<th>其中10M及以上</th>
							<th>合计</th>
													
							
							<th>长话王</th>
							<th>市话王</th>
							<th>包打王</th>
							<th>流量王</th>
							<th>极速卡</th>
							<th>其他</th>
							<th>合计</th>
							
													
							
							<th>单卡</th>
							<th>购机送费</th>
							<th>存费送机</th>
							<th>存费送费</th>
							<th>本省自备机</th>
							<th>上网卡</th>
							<th>合计</th>
							
							
													
							
							<th>本地单卡</th>
							<th>本地套餐合约惠机</th>
							<th>本地套餐存费送费</th>
							<th>全国套餐购机送费</th>
							<th>全国套餐存费送机</th>
							<th>全国套餐合约惠机</th>
							<th>合计</th>
							
												
							
							<th>ADSL</th>
							<th>LAN</th>
							<th>EOC</th>
							<th>FTTH</th>
							<th>其中10M及以上</th>
							<th>合计</th>
							
								
										
							
							<th>通话分钟数</th>
							<th>MOU</th>
							<th>流量</th>
							<th>户均流量</th>
							
							<th>通话分钟数</th>
							<th>MOU</th>
							<th>流量</th>
							<th>户均流量</th>
							
							<th>通话分钟数</th>
							<th>MOU</th>
							<th>流量</th>
							<th>户均流量</th>
							
							
							
							
						</tr>
					</thead>
					<tbody id="dataBody">
						
					</tbody>
					
				</table>
			</div>
		</div>
	</div>
</body>
<script>
var field=["ACCT_2_CHW_NUM",  
           "ACCT_2_SHW_NUM",  
           "ACCT_2_BDW_NUM",  
           "ACCT_2_LLW_NUM",  
           "ACCT_2_JSK_NUM",  
           "ACCT_2_OT_NUM",   
           "ACCT_2G_NUM",     
           "ACCT_3_DK_NUM",   
           "ACCT_3_GJSF_NUM", 
           "ACCT_3_CFSJ_NUM", 
           "ACCT_3_CFSF_NUM", 
           "ACCT_3_ZBJ_NUM",  
           "ACCT_3_SWK_NUM",  
           "ACCT_3G_NUM",     
           "ACCT_4_BDDK_NUM", 
           "ACCT_4_HYHJ_NUM",  
           "ACCT_4_CFSF_NUM",  
           "ACCT_4_GJSF_NUM",  
           "ACCT_4_CFSJ_NUM",  
           "ACCT_4_HYHJ1_NUM", 
           "ACCT_4G_NUM",     
           "ACCT_ADSL_NUM",   
           "ACCT_LAN_NUM",    
           "ACCT_EOC_NUM",    
           "ACCT_FTTH_NUM",   
           "ACCT_10M_NUM", 
           "ACCT_BB_NUM",  
           "DEV_2_CHW_NUM",   
           "DEV_2_SHW_NUM",   
           "DEV_2_BDW_NUM",   
           "DEV_2_LLW_NUM",   
           "DEV_2_JSK_NUM",   
           "DEV_2_OT_NUM",    
           "DEV_2G_NUM",      
           "DEV_3_DK_NUM",    
           "DEV_3_GJSF_NUM",  
           "DEV_3_CFSJ_NUM",  
           "DEV_3_CFSF_NUM",  
           "DEV_3_ZBJ_NUM",   
           "DEV_3_SWK_NUM",   
           "DEV_3G_NUM",      
           "DEV_4_BDDK_NUM",  
           "DEV_4_HYHJ_NUM",  
           "DEV_4_CFSF_NUM",  
           "DEV_4_GJSF_NUM",  
           "DEV_4_CFSJ_NUM",  
           "DEV_4_HYHJ1_NUM", 
           "DEV_4G_NUM",      
           "DEV_ADSL_NUM",    
           "DEV_LAN_NUM",     
           "DEV_EOC_NUM",     
           "DEV_FTTH_NUM",       
           "DEV_10M_NUM",
           "DEV_BB_NUM", 
           "SR_2_CHW_NUM",    
           "SR_2_SHW_NUM",    
           "SR_2_BDW_NUM",    
           "SR_2_LLW_NUM",    
           "SR_2_JSK_NUM",    
           "SR_2_OT_NUM",     
           "SR_2G_NUM",       
           "SR_3_DK_NUM",     
           "SR_3_GJSF_NUM",   
           "SR_3_CFSJ_NUM",   
           "SR_3_CFSF_NUM",   
           "SR_3_ZBJ_NUM",    
           "SR_3_SWK_NUM",    
           "SR_3G_NUM",       
           "SR_4_BDDK_NUM",   
           "SR_4_HYHJ_NUM",   
           "SR_4_CFSF_NUM",   
           "SR_4_GJSF_NUM",   
           "SR_4_CFSJ_NUM",   
           "SR_4_HYHJ1_NUM",  
           "SR_4G_NUM",       
           "SR_ADSL_NUM",     
           "SR_LAN_NUM",      
           "SR_EOC_NUM",      
           "SR_FTTH_NUM",      
           "SR_10M_NUM", 
           "SR_BB_NUM",  
           "DEV_ZZX_NUM",     
           "SR_ZZX_NUM",      
           "CALL_TIME_2G",    
           "MOU_2G",          
           "FLOW_2G",         
           "AVG_FLOW_2G",     
           "CALL_TIME_3G",    
           "MOU_3G",          
           "FLOW_3G",         
           "AVG_FLOW_3G",    
           "CALL_TIME_4G",    
           "MOU_4G",          
           "FLOW_4G",        
           "AVG_FLOW_4G"];
    var sumSql=" sum(t.ACCT_2_CHW_NUM) ACCT_2_CHW_NUM,sum(t.ACCT_2_SHW_NUM) ACCT_2_SHW_NUM,sum(t.ACCT_2_BDW_NUM) ACCT_2_BDW_NUM,sum(t.ACCT_2_LLW_NUM) ACCT_2_LLW_NUM,sum(t.ACCT_2_JSK_NUM) ACCT_2_JSK_NUM,sum(t.ACCT_2_OT_NUM) ACCT_2_OT_NUM,sum(t.ACCT_2G_NUM) ACCT_2G_NUM,sum(t.ACCT_3_DK_NUM) ACCT_3_DK_NUM,sum(t.ACCT_3_GJSF_NUM) ACCT_3_GJSF_NUM,sum(t.ACCT_3_CFSJ_NUM) ACCT_3_CFSJ_NUM,sum(t.ACCT_3_CFSF_NUM) ACCT_3_CFSF_NUM,sum(t.ACCT_3_ZBJ_NUM) ACCT_3_ZBJ_NUM,sum(t.ACCT_3_SWK_NUM) ACCT_3_SWK_NUM,sum(t.ACCT_3G_NUM) ACCT_3G_NUM,sum(t.ACCT_4_BDDK_NUM) ACCT_4_BDDK_NUM,sum(t.ACCT_4_HYHJ_NUM) ACCT_4_HYHJ_NUM,sum(t.ACCT_4_CFSF_NUM) ACCT_4_CFSF_NUM,sum(t.ACCT_4_GJSF_NUM) ACCT_4_GJSF_NUM,sum(t.ACCT_4_CFSJ_NUM) ACCT_4_CFSJ_NUM,sum(t.ACCT_4_HYHJ1_NUM) ACCT_4_HYHJ1_NUM,sum(t.ACCT_4G_NUM) ACCT_4G_NUM,sum(t.ACCT_ADSL_NUM) ACCT_ADSL_NUM,sum(t.ACCT_LAN_NUM) ACCT_LAN_NUM,sum(t.ACCT_EOC_NUM) ACCT_EOC_NUM,sum(t.ACCT_FTTH_NUM) ACCT_FTTH_NUM,sum(t.ACCT_10M_NUM) ACCT_10M_NUM,sum(t.ACCT_BB_NUM) ACCT_BB_NUM,sum(t.DEV_2_CHW_NUM) DEV_2_CHW_NUM,sum(t.DEV_2_SHW_NUM) DEV_2_SHW_NUM,sum(t.DEV_2_BDW_NUM) DEV_2_BDW_NUM,sum(t.DEV_2_LLW_NUM) DEV_2_LLW_NUM,sum(t.DEV_2_JSK_NUM) DEV_2_JSK_NUM,sum(t.DEV_2_OT_NUM) DEV_2_OT_NUM,sum(t.DEV_2G_NUM) DEV_2G_NUM,sum(t.DEV_3_DK_NUM) DEV_3_DK_NUM,sum(t.DEV_3_GJSF_NUM) DEV_3_GJSF_NUM,sum(t.DEV_3_CFSJ_NUM) DEV_3_CFSJ_NUM,sum(t.DEV_3_CFSF_NUM) DEV_3_CFSF_NUM,sum(t.DEV_3_ZBJ_NUM) DEV_3_ZBJ_NUM,sum(t.DEV_3_SWK_NUM) DEV_3_SWK_NUM,sum(t.DEV_3G_NUM) DEV_3G_NUM,sum(t.DEV_4_BDDK_NUM) DEV_4_BDDK_NUM,sum(t.DEV_4_HYHJ_NUM) DEV_4_HYHJ_NUM,sum(t.DEV_4_CFSF_NUM) DEV_4_CFSF_NUM,sum(t.DEV_4_GJSF_NUM) DEV_4_GJSF_NUM,sum(t.DEV_4_CFSJ_NUM) DEV_4_CFSJ_NUM,sum(t.DEV_4_HYHJ1_NUM) DEV_4_HYHJ1_NUM,sum(t.DEV_4G_NUM) DEV_4G_NUM,sum(t.DEV_ADSL_NUM) DEV_ADSL_NUM,sum(t.DEV_LAN_NUM) DEV_LAN_NUM,sum(t.DEV_EOC_NUM) DEV_EOC_NUM,sum(t.DEV_FTTH_NUM) DEV_FTTH_NUM,sum(t.DEV_10M_NUM) DEV_10M_NUM,sum(t.DEV_BB_NUM) DEV_BB_NUM,sum(t.SR_2_CHW_NUM) SR_2_CHW_NUM,sum(t.SR_2_SHW_NUM) SR_2_SHW_NUM,sum(t.SR_2_BDW_NUM) SR_2_BDW_NUM,sum(t.SR_2_LLW_NUM) SR_2_LLW_NUM,sum(t.SR_2_JSK_NUM) SR_2_JSK_NUM,sum(t.SR_2_OT_NUM) SR_2_OT_NUM,sum(t.SR_2G_NUM) SR_2G_NUM,sum(t.SR_3_DK_NUM) SR_3_DK_NUM,sum(t.SR_3_GJSF_NUM) SR_3_GJSF_NUM,sum(t.SR_3_CFSJ_NUM) SR_3_CFSJ_NUM,sum(t.SR_3_CFSF_NUM) SR_3_CFSF_NUM,sum(t.SR_3_ZBJ_NUM) SR_3_ZBJ_NUM,sum(t.SR_3_SWK_NUM) SR_3_SWK_NUM,sum(t.SR_3G_NUM) SR_3G_NUM,sum(t.SR_4_BDDK_NUM) SR_4_BDDK_NUM,sum(t.SR_4_HYHJ_NUM) SR_4_HYHJ_NUM,sum(t.SR_4_CFSF_NUM) SR_4_CFSF_NUM,sum(t.SR_4_GJSF_NUM) SR_4_GJSF_NUM,sum(t.SR_4_CFSJ_NUM) SR_4_CFSJ_NUM,sum(t.SR_4_HYHJ1_NUM) SR_4_HYHJ1_NUM,sum(t.SR_4G_NUM) SR_4G_NUM,sum(t.SR_ADSL_NUM) SR_ADSL_NUM,sum(t.SR_LAN_NUM) SR_LAN_NUM,sum(t.SR_EOC_NUM) SR_EOC_NUM,sum(t.SR_FTTH_NUM) SR_FTTH_NUM,sum(t.SR_10M_NUM) SR_10M_NUM,sum(t.SR_BB_NUM) SR_BB_NUM,sum(t.DEV_ZZX_NUM) DEV_ZZX_NUM,sum(t.SR_ZZX_NUM) SR_ZZX_NUM,sum(t.CALL_TIME_2G) CALL_TIME_2G,case  sum(t.ACCT_2G_NUM) when 0 then 0 else  round( sum(t.CALL_TIME_2G)/sum(t.ACCT_2G_NUM),2) end MOU_2G,sum(t.FLOW_2G) FLOW_2G,case  sum(t.ACCT_2G_NUM) when 0 then 0 else  round( sum(t.FLOW_2G)/sum(t.ACCT_2G_NUM),2) end AVG_FLOW_2G,sum(t.CALL_TIME_3G) CALL_TIME_3G,case  sum(t.ACCT_3G_NUM) when 0 then 0 else  round( sum(t.CALL_TIME_3G)/sum(t.ACCT_3G_NUM),2) end MOU_3G,sum(t.FLOW_3G) FLOW_3G,case  sum(t.ACCT_3G_NUM) when 0 then 0 else  round( sum(t.FLOW_3G)/sum(t.ACCT_3G_NUM),2) end AVG_FLOW_3G,sum(t.CALL_TIME_4G) CALL_TIME_4G,case  sum(t.ACCT_4G_NUM) when 0 then 0 else round(sum(t.CALL_TIME_4G)/sum(t.ACCT_4G_NUM),2) end  MOU_4G,sum(t.FLOW_4G) FLOW_4G,case  sum(t.ACCT_4G_NUM) when 0 then 0 else round( sum(t.FLOW_4G)/sum(t.ACCT_4G_NUM),2) end  AVG_FLOW_4G ";
	$(function(){
		//sumSql=getSumField(field);
		initHeadIndex($("#dataHead"));
		$("#dataHead").find("TR:eq(0)").find("TH[expand='true']").toggle(function(){
			showCols($(this),0);
		},function(){
			showCols($(this),1);
		});
		showSub();
		//$("#dataHead").find("TR:eq(0)").find("TH").trigger("click");
		
	});
	function initHeadIndex($head){
		var cy=$head.find("TR").length;
		var cx=0;
		$head.find("TR:eq(0)").find("TH").each(function(){
			cx+=getColspan($(this));
		});
		if(cy<=0){return ;}
		var x0=new Array();
		for(var i=0;i<cy;i++){
			x0[i]=new Array();
			for(var j=0;j<cx;j++){
				x0[i][j]=0;
				
			}
		}
		$head.find("TR").each(function(y){
			var index=0;
			$(this).find("TH").each(function(x){
				var dx=getColspan($(this));
				var dy=getRowspan($(this));
				var newIndex=index;
				while(x0[y][index])
					index=index+x0[y][index];
				$(this).attr("y",y);
				$(this).attr("x",index);
				$(this).attr("cy",dy);
				$(this).attr("cx",dx);
				for(var i=y;i<y+dy;i++){
					x0[i][index]=x0[i][index]+dx;
				}	
			});
		});
		//绑定表头字段和添加排序按钮
		$head.find("TR").each(function(){
			$(this).find("TH").each(function(){
				var dx=getColspan($(this));
				var x=parseInt($(this).attr("x"));
				if(x==0){
					$(this).attr("field","ROW_NAME");
				}
				if(dx==1){
					$(this).attr("field",field[x-1]);
				}else{
					$(this).attr("field",field[x+dx-2]);
				}
			});
		});
		///////////////////////////////////排序开始////////////////////////////////////
		var $order=$("<a class='asc'>&nbsp;</a>");
		var $oldOrder=$("<a class='desc'>&nbsp;</a>");
		$head.find("TH[y='1'],TH[rowspan='2']").mouseenter(function(){
			if(!($(this).find(".asc").length||$(this).find(".desc").length)){
				$(this).append($order);
				$order.show();
				
				$order.unbind().click(function(){
					if($(this).hasClass("asc")){
						orderBy=" order by "+$(this).parent().attr("field")+" desc ";
						$oldOrder.removeClass("asc").addClass("desc");
						$order.removeClass("asc").addClass("desc");
					}else{
						orderBy=" order by "+$(this).parent().attr("field")+" asc ";
						$oldOrder.removeClass("desc").addClass("asc");
						$order.removeClass("desc").addClass("asc");
					}
					$oldOrder.appendTo($(this).parent("TH"));
					$order.appendTo($("body")).hide();
					$oldOrder.unbind().click(function(){
						if($(this).hasClass("asc")){
							orderBy=" order by "+$(this).parent().attr("field")+" desc ";
							$oldOrder.removeClass("asc").addClass("desc");
							$order.removeClass("asc").addClass("desc");
						}else{
							orderBy=" order by "+$(this).parent().attr("field")+" asc ";
							$oldOrder.removeClass("desc").addClass("asc");
							$order.removeClass("desc").addClass("asc");
						}
						showSub();
					});
					showSub();
					
				});
				$order.click(function(event){
		            event.stopPropagation();
		        });
				$oldOrder.click(function(event){
		            event.stopPropagation();
		        });
			}
		});
		
		$head.find("TH[y='1'],TH[rowspan='2']").bind({mouseleave:function(){
			$order.appendTo($("body"));
			$order.hide();
		}});
		//////////////////////////////////////////////////////////////////////////
	}

	function showCols($th,type){
		$th.attr("show",type);
		var cx=1,cy=1,x=0,y=0;//默认为第一单元格
		cx=parseInt($th.attr("cx"));
		cy=parseInt($th.attr("cy"));
		y=parseInt($th.attr("y"));
		x=parseInt($th.attr("x"));
		
		$th.parent().next().find("TH").each(function(){
			var thisX=parseInt($(this).attr("x"));
			if(thisX>=x&&thisX<=x+cx-1){
				if(type==0){
					$(this).hide();
					$th.find("A").remove();
					$th.prepend("<a class='sub_on'></a>");
				}else{
					$(this).show();
					$th.find("A").remove();
					$th.prepend("<a class='sub_off'></a>");
				}
			}
			if(type==0){
				$th.attr("rowspan",2);
			}else{
				$th.attr("rowspan",$th.attr("cy"));
			}
		});
				
		$("#dataBody").find("TR").each(function(){
			$(this).find("TD").each(function(thisX){
				if(thisX>=x&&thisX<x+cx-1){
					if(type==0){
						$(this).hide();
					}else{
						$(this).show();
					}
				}else if(thisX==x+cx-1){
					if(type==0){
						$(this).attr("colspan",cx);
					}else{
						$(this).attr("colspan",1);
					}
				}
			});
		});
	}
	
	//得到所占行数
	function getRowspan($th){
		if($th.attr("rowspan")){
			return parseInt($th.attr("rowspan"));
		}
		return 1;
	}
	//得到所占列数
	function getColspan($th){
		if($th.attr("colspan")){
			return parseInt($th.attr("colspan"));
		}
		return 1;
	}
	var orderBy='';
	//当a为null时获取初始层级
	function showSub(a){
		var preField='';
		var where='';
		var groupBy='';
		
		var code='';
		var orgLevel='';
		
		var qdate = $.trim($("#month").val());
		
		if(a){
			var $row=$(a).parent().parent();
			code=$row.attr("rowId");
			orgLevel=parseInt($row.attr("rowLevel"));
			var parentId=$row.attr("parentId");
			if(orgLevel==2){//点击市
				preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
				groupBy=' group by t.unit_id,t.unit_name ';
				where=' where t.GROUP_ID_1=\''+code+"\' ";
			}else if(orgLevel==3){//点击营服中心
				preField=' t.AGENT_M_USERID ROW_ID,t.AGENT_M_NAME ROW_NAME,t.PER_TYPE ';
				groupBy=' group by t.AGENT_M_USERID,t.AGENT_M_NAME,t.PER_TYPE ';
				where=' where t.unit_id=\''+code+"\' ";
			}else if(orgLevel>=4){//点击渠道经理
				preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME ';
				groupBy=' group by t.group_id_4,t.group_id_4_name ';
				if(code=='undefined'){
					where=' where t.AGENT_M_USERID is null and t.unit_id=\''+parentId+'\' ';
				}else{
					where=' where t.AGENT_M_USERID=\''+code+'\' and t.unit_id=\''+parentId+'\' ';
				}
			}else{
				alert("该级不可以下钻");
				return;
			}
			orgLevel++;
		}else{
			//先根据用户信息得到前几个字段
			code=$("#code").val();
			orgLevel=$("#orgLevel").val();
			if(orgLevel==1){//省
				preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
				groupBy=' group by t.group_id_1,t.group_id_1_name ';
				where=' where t.GROUP_ID_0=\''+code+"\' ";
				orgLevel=2;
			}else if(orgLevel==2){//市
				preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
				groupBy=' group by t.group_id_1,t.group_id_1_name ';
				where=' where t.GROUP_ID_1=\''+code+"\' ";
			}else if(orgLevel==3){//营服中心
				preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
				groupBy=' group by t.unit_id,t.unit_name ';
				where=' where t.unit_id=\''+code+"\' ";
			}else if(orgLevel>=4){//
				preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME';
				groupBy=' group by t.group_id_4,t.group_id_4_name ';
				where=' where t.GROUP_ID_4=\''+code+"\' ";
			}
		}	
		var sql='select '+preField+','+sumSql+' from PMRT.TAB_MRT_TARGET_CH_MON t';
		
		if(where!=''&&qdate!=''){
			where+=' and  t.DEAL_DATE='+qdate+' ';
		}
		if(where!=''){
			sql+=where;
		}
		if(groupBy!=''){
			sql+=groupBy;
		}
		if(orderBy!=''){
			sql+=orderBy;
		}
		
		if(!a){
			var d=query(sql);
			$("#dataBody").empty();
			for(var i=0;i<d.length;i++){
				var h="<tr rowId='"+d[i].ROW_ID+"' rowLevel='"+orgLevel+"' parentId=''><td><a class='sub_on' onclick='showSub(this)'>"+d[i].ROW_NAME+"</a></td>";
				for(var j=0;j<field.length;j++){
					h+="<td>"+isNull(d[i][field[j]])+"</td>";
				}
				h+="</tr>";
				$("#dataBody").append(h);
			}
		}else{
			var $sub=null;
			var hasSub=true;
			if(code=='undefined'){
				$sub=$(a).parent().parent().next();
				if($sub.length>0&&$sub.attr("parentId")=='undefined'){
					hasSub=true;
				}else{
					$sub=$(a).parent().parent();
					hasSub=false;
				}
			}else{
				$sub=$("#dataBody").find("TR[parentId='"+code+"']");
				if(!$sub.length){
					hasSub=false;
				}
				$sub=$("#dataBody").find("TR[rowId='"+code+"']");
			}
			
			if(!hasSub){
				var d=query(sql);
				if(d.length<=0){
					alert("该级已经不能下钻");
					return ;
				}
				var h="";
				for(var i=0;i<d.length;i++){
					if(orgLevel!=4){
						h+="<tr rowId='"+d[i].ROW_ID+"' rowLevel='"+orgLevel+"' parentId='"+code+"' style='display:none;'><td><a class='sub_on' onclick='showSub(this)' style='margin-left:"+((orgLevel-2)*24)+"px;'>"+d[i].ROW_NAME+"</a></td>";
						for(var j=0;j<field.length;j++){
							h+="<td>"+isNull(d[i][field[j]])+"</td>";
						}
						h+="</tr>";
					}else{
						h+="<tr rowId='"+d[i].ROW_ID+"' rowLevel='"+orgLevel+"' perType='"+d[i].PER_TYPE+"' parentId='"+code+"' style='display:none;'><td><a class='sub_off' onclick='showAgentList(this)' style='margin-left:"+((orgLevel-2)*24)+"px;'>"+d[i].ROW_NAME+"("+d[i].PER_TYPE+")"+"</a></td>";
						for(var j=0;j<field.length;j++){
							h+="<td>"+isNull(d[i][field[j]])+"</td>";
						}
						h+="</tr>";
					}
					
					
				}
				$sub.after(h);
			}
		}
		var $tr=$(a).parent().parent();
		var id=$tr.attr("rowId");
		if($(a).hasClass("sub_on")){
			if(id=='undefined'){
				var $next=$tr.next();
				while($next.attr("parentId")==id){
					$next.show();
					$next=$next.next();
				}
			}else{
				$("#dataBody").find("TR[parentId='"+id+"']").show();
			}
			$(a).removeClass("sub_on").addClass("sub_off");
		}else{
			if(id=='undefined'){
				var $next=$tr.next();
				while($next.attr("parentId")==id){
					hideSub($next);
					$next.hide();
					$next=$next.next();
				}
			}else{
				$("#dataBody").find("TR[parentId='"+id+"']").each(function(){
					hideSub($(this));
				});
				$("#dataBody").find("TR[parentId='"+id+"']").hide();
			}
			$(a).removeClass("sub_off").addClass("sub_on");
		}
		
		$("#dataHead").find("TR:eq(0)").find("TH[expand='true']").each(function(){
			var type=$(this).attr("show");
			showCols($(this),type);
		});
		//如果没有数据则
		if(!$("#dataBody").find("TR").length){
			$("#dataBody").append("<tr><td colspan='"+(field.length+1)+"'>暂无数据</td></tr>");
		}
		
		
	}
	function hideSub($tr){
		$tr.hide();
		$tr.find(".sub_off").removeClass("sub_off").addClass("sub_on");
		var id=$tr.attr("rowId");
		if(id=='undefined'){
			var $next=$tr.next();
			while($next.attr("parentId")==id){
				hideSub($next);
				$next.hide();
				$next=$next.next();
			}
		}else{
			$("#dataBody").find("TR[parentId='"+id+"']").each(function(){
				hideSub($(this));
			});
		}
	}
	//获取数据
	function query(sql){
		var ls=[];
		loadWidowMessage(1);
		$.ajax({
			type:"POST",
			dataType:'json',
			async:false,
			cache:false,
			url:$("#ctx").val()+"/devIncome/devIncome_query.action",
			data:{
	           "sql":sql
		   	}, 
		   	success:function(data){
		   		if(data&&data.length>0){
		   			ls=data;
		   		}
		    }
		});
		loadWidowMessage(0);
		return ls;
	}
	function getSumField(fs){
		var s="";
		for(var i=0;i<fs.length;i++){
			if(s.length>0){
				s+=",";
			}
			s+="sum(t."+fs[i]+") "+fs[i]
		}
		return " "+s+" "
	}
	/////////////////////////下载开始/////////////////////////////////////////////
	function _loadAllExcel(parameter,callback,excelName){
		$.Project.downExcelByTemplate2(parameter,callback,excelName,$(''));
	}
	function downsAll() {
		var qdate = $.trim($("#month").val());
		
		var preField=' t.group_id_1_name,t.unit_name,t.agent_m_name,t.group_id_4_name,t.DEAL_DATE ';
		var where='';
		var orderBy=' order by '+preField;
		var fieldSql=field.join(",");
		//先根据用户信息得到前几个字段
		var code = $("#code").val();
		var orgLevel = $("#orgLevel").val();
		if (orgLevel == 1) {//省
			where = " where t.GROUP_ID_0='" + code + "' ";
		} else if (orgLevel == 2) {//市
			where = " where t.GROUP_ID_1='" + code + "' ";
		} else if (orgLevel == 3) {//营服中心
			where = " where t.unit_id='" + code + "' ";
		} else if (orgLevel >= 4) {//
			where = " where t.GROUP_ID_4='" + code + "' ";
		}
		if(where!=''&&qdate!=''){
			where+=' and  t.DEAL_DATE='+qdate+' ';
		}

		var sql = 'select ' + preField + ',' + fieldSql
				+ ' from PMRT.TAB_MRT_TARGET_CH_MON t';
		if (where != '') {
			sql += where;
		}
		if(orderBy!=''){
			sql += orderBy;
		}
		
		showtext = '用户发展收入月报-' + qdate;
		_loadAllExcel({
			startRow : 2,
			startCol : 0,
			cols : -1,
			excelModal : 'income_and_dev_month_all.xls',
			sheetname : showtext,
			query : sql
		}, null, showtext);
	}
	function isNull(obj){
		if(obj == undefined || obj == null || obj == '') {
			return 0;
		}
		return obj;
	}
	/**
	 * 程序锁屏信息，1为加载，其他为去除锁屏信息
	 * @param flag
	 * @return
	 */
	function loadWidowMessage(flag){
		if(flag == 1){
			$.messager.progress({
				text:'正在处理数据，请稍等...',
				interval:100
			}); 
		}else{
			$.messager.progress('close'); 
		}
	}
	/**
	 * 查看渠道经理下的渠道列表
	 * @param 
	 * @return
	 */
	function showAgentList(a){
		var $tr=$(a).parent().parent();
		var agentId=$tr.attr("rowId");
		var unitId=$tr.attr("parentId");
		var $unit=$("#dataBody").find("TR[rowId='"+unitId+"']");
		var perType=$tr.attr("perType");
		var month = $.trim($("#month").val());
		var text=$unit.find("TD:eq(0)").find("A:eq(0)").text()+"->"+$(a).text();
		var url=$("#ctx").val()+"/report/devIncome/jsp/list_agent.jsp?agentId="+agentId+"&unitId="+unitId+"&month="+month+"&agentType="+perType;
		window.parent.openWindow(text,null,url);
	}
</script>
</html>