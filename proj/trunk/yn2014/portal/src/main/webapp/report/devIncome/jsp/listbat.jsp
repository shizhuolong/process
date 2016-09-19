<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>测试报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
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
					<td width="5%" style="padding-left: 10px;">渠道名称：</td>
					<td width="20%"><input class="default-text-input wper80"
						id="chanlName" name="chanlName" type="text" /></td>
					<td width="5%">渠道编码：</td>
					<td width="20%"><input class="default-text-input wper80"
						id="chanlCode" name="chanlCode" type="text" /></td>
					<td width="8%"><a class="default-btn" href="#" id="addBtn">新增</a>
				</tr>
				<tr height="35px">
					<td width="5%" style="padding-left: 10px;">营服中心：</td>
					<td width="20%"><input class="default-text-input wper80"
						id="unitName" name="unitName" type="text" /></td>
					<td width="5%">是否有效：</td>
					<td width="20%"><select id="status"
						class="default-text-input wper40" name="status"
						style="float: left;">
							<option value="">全部</option>
							<option value="1">有效</option>
							<option value="0">无效</option>
					</select> <a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 48px;">查询</a></td>
					<td><a class="default-btn" href="#" id="exportBtn">导出</a></td>
				</tr>
			</table>
		</form>
		<div class="default-dt dt-autoH" >
			<div class="sticky-wrap">
				<table class="default-table sticky-enabled">
					<thead id="dataHead">
						<tr>
							<th class="first" rowspan="2">营销架构</th>
							<th colspan="7">2G当日发展</th>
							<th colspan="7">3G当日发展</th>
							<th colspan="7">4G当日发展</th>
							<th colspan="6">固网宽带当日发展</th>
							<th colspan="6">2G累计发展</th>
							<th colspan="6">3G累计发展</th>
							<th colspan="7">4G累计发展</th>
							<th colspan="6">固网宽带累计发展</th>
							<th colspan="7">2G累计收入</th>
							<th colspan="7">3G累计收入</th>
							<th colspan="7">4G累计收入</th>
							<th colspan="6">固网宽带累计收入</th>
							<th colspan="2">集客专注线发展</th>
							<th colspan="1">专租线收入</th>
		<!-- 
		
ACCT_2_CHW_NUM   NUMBER        Y                长话王出账用户数 
ACCT_2_SHW_NUM   NUMBER        Y                市话王出账用户数 
ACCT_2_BDW_NUM   NUMBER        Y                包打王出账用户数 
ACCT_2_LLW_NUM   NUMBER        Y                流量王出账用户数 
ACCT_2_JSK_NUM   NUMBER        Y                极速卡出账用户数 
ACCT_2_OT_NUM    NUMBER        Y                2G其他出账用户数 
ACCT_2G_NUM      NUMBER        Y                2G出账用户数  
ACCT_3_DK_NUM    NUMBER        Y                3G单卡出账用户数 
ACCT_3_GJSF_NUM  NUMBER        Y                购机送费出账用户数 
ACCT_3_CFSJ_NUM  NUMBER        Y                存费送机出账用户数 
ACCT_3_CFSF_NUM  NUMBER        Y                存费送费出账用户数 
ACCT_3_ZBJ_NUM   NUMBER        Y                本省自备机出账用户数 
ACCT_3_SWK_NUM   NUMBER        Y                上网卡出账用户数 
ACCT_3G_NUM      NUMBER        Y                3G出账用户数  
ACCT_4_BDDK_NUM  NUMBER        Y                本地单卡出账用户数 
ACCT_4_HYHJ_NUM  NUMBER        Y                本地套餐合约惠机出账用户数 
ACCT_4_CFSF_NUM  NUMBER        Y                本地套餐存费送费出账用户数 
ACCT_4_GJSF_NUM  NUMBER        Y                全国套餐购机送费出账用户数 
ACCT_4_CFSJ_NUM  NUMBER        Y                全国套餐存费送机出账用户数 
ACCT_4_HYHJ1_NUM NUMBER        Y                全国套餐合约惠机出账用户数 
ACCT_4G_NUM      NUMBER        Y                4G出账用户数  
ACCT_ADSL_NUM    NUMBER        Y                ADSL出账用户数 
ACCT_LAN_NUM     NUMBER        Y                LAN出账用户数 
ACCT_EOC_NUM     NUMBER        Y                EOC出账用户数 
ACCT_FTTH_NUM    NUMBER        Y                FTTH出账用户数 
ACCT_BB_NUM      NUMBER        Y                宽带出账用户数 
ACCT_10M_NUM     NUMBER        Y                10M以上宽带出账用户数 
DEV_2_CHW_NUM    NUMBER        Y                长话王发展量  
DEV_2_SHW_NUM    NUMBER        Y                市话王发展量  
DEV_2_BDW_NUM    NUMBER        Y                包打王发展量  
DEV_2_LLW_NUM    NUMBER        Y                流量王发展量  
DEV_2_JSK_NUM    NUMBER        Y                极速卡发展量  
DEV_2_OT_NUM     NUMBER        Y                2G其他发展量  
DEV_2G_NUM       NUMBER        Y                2G发展量      
DEV_3_DK_NUM     NUMBER        Y                3G单卡发展量  
DEV_3_GJSF_NUM   NUMBER        Y                购机送费发展量 
DEV_3_CFSJ_NUM   NUMBER        Y                存费送机发展量 
DEV_3_CFSF_NUM   NUMBER        Y                存费送费发展量 
DEV_3_ZBJ_NUM    NUMBER        Y                本省自备机发展量 
DEV_3_SWK_NUM    NUMBER        Y                上网卡发展量  
DEV_3G_NUM       NUMBER        Y                3G发展量      
DEV_4_BDDK_NUM   NUMBER        Y                本地单卡发展量 
DEV_4_HYHJ_NUM   NUMBER        Y                本地套餐合约惠机发展量 
DEV_4_CFSF_NUM   NUMBER        Y                本地套餐存费送费发展量 
DEV_4_GJSF_NUM   NUMBER        Y                全国套餐购机送费发展量 
DEV_4_CFSJ_NUM   NUMBER        Y                全国套餐存费送机发展量 
DEV_4_HYHJ1_NUM  NUMBER        Y                全国套餐合约惠机发展量 
DEV_4G_NUM       NUMBER        Y                4G发展量      
DEV_ADSL_NUM     NUMBER        Y                ADSL发展量    
DEV_LAN_NUM      NUMBER        Y                LAN发展量     
DEV_EOC_NUM      NUMBER        Y                EOC发展量     
DEV_FTTH_NUM     NUMBER        Y                FTTH发展量    
DEV_BB_NUM       NUMBER        Y                宽带发展量    
DEV_10M_NUM      NUMBER        Y                10M以上宽带发展量 
SR_2_CHW_NUM     NUMBER(12,2)  Y                长话王收入    
SR_2_SHW_NUM     NUMBER(12,2)  Y                市话王收入    
SR_2_BDW_NUM     NUMBER(12,2)  Y                包打王收入    
SR_2_LLW_NUM     NUMBER(12,2)  Y                流量王收入    
SR_2_JSK_NUM     NUMBER(12,2)  Y                极速卡收入    
SR_2_OT_NUM      NUMBER(12,2)  Y                2G其他收入    
SR_2G_NUM        NUMBER(12,2)  Y                2G收入        
SR_3_DK_NUM      NUMBER(12,2)  Y                3G单卡收入    
SR_3_GJSF_NUM    NUMBER(12,2)  Y                购机送费收入  
SR_3_CFSJ_NUM    NUMBER(12,2)  Y                存费送机收入  
SR_3_CFSF_NUM    NUMBER(12,2)  Y                存费送费收入  
SR_3_ZBJ_NUM     NUMBER(12,2)  Y                本省自备机收入 
SR_3_SWK_NUM     NUMBER(12,2)  Y                上网卡收入    
SR_3G_NUM        NUMBER(12,2)  Y                3G收入        
SR_4_BDDK_NUM    NUMBER(12,2)  Y                本地单卡收入  
SR_4_HYHJ_NUM    NUMBER(12,2)  Y                本地套餐合约惠机收入 
SR_4_CFSF_NUM    NUMBER(12,2)  Y                本地套餐存费送费收入 
SR_4_GJSF_NUM    NUMBER(12,2)  Y                全国套餐购机送费收入 
SR_4_CFSJ_NUM    NUMBER(12,2)  Y                全国套餐存费送机收入 
SR_4_HYHJ1_NUM   NUMBER(12,2)  Y                全国套餐合约惠机收入 
SR_4G_NUM        NUMBER(12,2)  Y                4G收入        
SR_ADSL_NUM      NUMBER(12,2)  Y                ADSL收入      
SR_LAN_NUM       NUMBER(12,2)  Y                LAN收入       
SR_EOC_NUM       NUMBER(12,2)  Y                EOC收入       
SR_FTTH_NUM      NUMBER(12,2)  Y                FTTH收入      
SR_BB_NUM        NUMBER(12,2)  Y                宽带收入      
SR_10M_NUM       NUMBER(12,2)  Y                10M以上宽带收入 
DEV_ZZX_NUM      NUMBER        Y                专租线发展量  
SR_ZZX_NUM       NUMBER(12,2)  Y                专租线收入    
CALL_TIME_2G     NUMBER(12,2)  Y                2G通话时长    
MOU_2G           NUMBER(12,2)  Y                2GMOU         
FLOW_2G          NUMBER(10,2)  Y                2G流量        
AVG_FLOW_2G      NUMBER(10,2)  Y                2G户均流量    
CALL_TIME_3G     NUMBER(12,2)  Y                3G通话时长    
MOU_3G           NUMBER(12,2)  Y                3GMOU         
FLOW_3G          NUMBER(10,2)  Y                3G流量        
AVG_FLOW_3G      NUMBER(10,2)  Y                3G户均流量    
CALL_TIME_4G     NUMBER(12,2)  Y                4G通话时长    
MOU_4G           NUMBER(12,2)  Y                4GMOU         
FLOW_4G          NUMBER(10,2)  Y                4G流量        
AVG_FLOW_4G      NUMBER(10,2)  Y                4G户均流量    
		
		 -->												
													
							
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
							<th>本省自备机</th>
							<th>存费送费</th>
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
							<th>合计</th>
							
											
							
							<th>单卡</th>
							<th>购机送费</th>
							<th>存费送机</th>
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
							<th>本省自备机</th>
							<th>存费送费</th>
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
							
								
							
							<th>当日发展</th>
							<th>累计发展</th>
							
							<th>累计收入</th>
							
							
							
							
						</tr>
					</thead>
					<tbody id="dataBody">
						<tr rowId="0" rowLevel="1" parentId="">
							<td><a class="sub_on" onclick="showSub(this)" style="margin-left:24px;">昆明分公司</a></td>
							<td>渠道编码</td>
							<td>地市</td>
							<td>营服中心</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
						</tr>
						<tr rowId="1" parentId="0" rowLevel="2" style="display:none;">
							<td><a class="sub_on" onclick="showSub(this)">官渡区</a></td>
							<td>渠道编码</td>
							<td>地市</td>
							<td>营服中心</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
						</tr>
						<tr rowId="2" parentId="0"  rowLevel="2" style="display:none;">
							<td><a class="sub_on" onclick="showSub(this)" >西山区</a></td>
							<td>渠道编码</td>
							<td>地市</td>
							<td>营服中心</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
						</tr>
						<tr rowId="3" parentId="0" rowLevel="2" style="display:none;">
							<td><a class="sub_on" onclick="showSub(this)" >盘龙区</a></td>
							<td>渠道编码</td>
							<td>地市</td>
							<td>营服中心</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
						</tr>
						<tr rowId="4" parentId="0" rowLevel="2" style="display:none;">
							<td><a class="sub_on" onclick="showSub(this)">五华区</a></td>
							<td>渠道编码</td>
							<td>地市</td>
							<td>营服中心</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
							<td>上级渠道名称</td>
							<td>渠道经理</td>
							<td>渠道经理电话</td>
							<td>操作</td>
						</tr>
					</tbody>
					
				</table>
			</div>
		</div>
	</div>
</body>
<script>
	$(function(){
		initHeadIndex($("#dataHead"));
		$("#dataHead").find("TR:eq(0)").find("TH").toggle(function(){
			showCols($(this),0);
		},function(){
			showCols($(this),1);
		});
		$("#dataHead").find("TR:eq(0)").find("TH").trigger("click");
		/*SELECT * FROM PMRT.TAB_MRT_TARGET_CH_MON*/
	});
	function initHeadIndex($head){
		var cy=$head.find("TR").length;
		if(cy<=0){return ;}
		var x0=new Array();
		for(var i=0;i<cy;i++){
			x0[i]=0;
		}
		$head.find("TR").each(function(y){
			$(this).find("TH").each(function(x){
				var dx=getColspan($(this));
				var dy=getRowspan($(this));
				$(this).attr("y",y);
				$(this).attr("x",x0[y]);
				$(this).attr("cy",dy);
				$(this).attr("cx",dx);
				for(var j=y;j<y+dy;j++)
					x0[j]=x0[j]+dx;
			});
		});
	}
	function showCols($th,type){
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
				}else{
					$(this).show();
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
	function showSub(a){
		if(!a){
			var sql='';
		}
		var $tr=$(a).parent().parent();
		var id=$tr.attr("rowId");
		if($(a).hasClass("sub_on")){
			$("#dataBody").find("TR[parentId='"+id+"']").show();
			$(a).removeClass("sub_on").addClass("sub_off");
		}else{
			$("#dataBody").find("TR[parentId='"+id+"']").hide();
			$(a).removeClass("sub_off").addClass("sub_on");
		}
		
		var rowId=$tr.attr("rowId");
		var parentId=$tr.attr("parentId");
		var rowLevel=$tr.attr("rowLevel");
		
	}
	//获取数据
	function query(sql){
		var ls=[];
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
		   		}else{
		   			alert("没有数据");
		   		}	
		    }
		});
		return ls;
	}
</script>
</html>