<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.lch.report.dto.Equal"%>
<%@page import="com.lch.report.dto.Button"%>
<%@page import="com.lch.report.dto.Like"%>
<%@page import="java.util.List"%>
<%@page import="com.lch.report.dto.Condition"%>
<%@page import="com.lch.report.util.JsonUtil"%>
<%@page import="com.lch.report.dto.Report"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%
	String path=request.getContextPath();
	Report r=(Report) request.getAttribute("report");
%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title></title>
	<link type="text/css" rel="stylesheet" href="<%=path %>/lchreport/js/skin/WdatePicker.css">
	<link rel="stylesheet" type="text/css" href="<%=path %>/lchreport/css/tree-xy-show.css">
	<script type="text/javascript" src="<%=path %>/lchreport/js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=path %>/lchreport/js/tree-xy-show.js"></script>
	<script type="text/javascript" src="<%=path %>/lchreport/js/WdatePicker.js"></script>
	<style>
		
	</style>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=path %>"/>
	<div id="lchContent" style="position: absolute;width: 100%; height: 100%;margin:0;padding:0;">
		<div class="condition" >
			<form id="condition">
<%
	Condition cd=r.getCondition();
	if(cd!=null){
		for(Object o:cd.getConditions()){
			//模糊查询
			if(o instanceof Like){
				Like like=(Like) o;
%>
				<%=like.getDesc() %>:<input type="text" value='' name="<%=like.getColumn()%>"/>&nbsp;
<%			
			}else if(o instanceof Equal){
				Equal equal=(Equal) o;
				//下拉选择
				if(equal.getType().equals("select")){
%>
					<%=equal.getDesc() %>:<select  value='' cdtype='select' name="<%=equal.getColumn()%>" table="<%=equal.getTableName()%>">
					</select>
<%		
				}else if(equal.getType().equals("date")){
					Calendar ca=Calendar.getInstance();
					String time=new SimpleDateFormat(equal.getFormat()).format(ca.getTime());
%>
					<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'<%=equal.getFormat()%>'})" value="<%=time %>" name="<%=equal.getColumn() %>">
<%	
				}
			}else if(o instanceof Button){
				Button btn=(Button) o;
%>
				<input type="button" value='<%=btn.getValue() %>' onclick="<%=btn.getMethod()%>"/>&nbsp;
<%			
			}
		}
	}
%>
			</form>
		</div>
		</div>
		<div id="content">
		</div>
</body>
<script type="text/javascript">
var report=<%=JsonUtil.beanToJson(r)%>;
function getField(r){
	var f=[];
	if(r&&r.bind&&r.bind.length){
		var cls=r.bind[0].cols;
		for(var i=0;i<cls.length;i++){
			f[i]=cls[i].colName;
		}
	}
	return f;
}
function getPage(n){
	if(myReport){
		myReport.showSubRow();
	}
}
var report=null;
var field=getField(report);
$(function(){
	
	var orderBy='';	
	myReport=new LchReport({
		title:report.topTitle,
		field:["ROW_NAME"].concat(field),
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" order by row_name "+type+" ";
			}else if(index>0){
				orderBy=" order by "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	myReport.showSubRow();
///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var qdate = $.trim($("#month").val());
	
	var preField=' t.group_id_1_name,t.unit_name,t.agent_m_name,case t.PER_TYPE when \'1\' then \'客户经理\' when \'2\' then \'渠道经理\' else \'小区经理\' end  PER_TYPE ,t.HR_ID,t.group_id_4_name,t.state,t.HQ_CHAN_CODE,t.DEAL_DATE ';
	var where='';
	var orderBy=" order by t.group_id_1_name,t.unit_name,t.agent_m_name,t.PER_TYPE ,t.HR_ID,t.group_id_4_name,t.HQ_CHAN_CODE,t.DEAL_DATE ";
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
	var title=[["营销架构","","","","","","","","帐期","2G出账用户","","","","","","","3G出账用户","","","","","","","","4G出帐用户","","","","","","","","","固网宽带出账用户","","","","","","2G用户发展","","","","","","","3G用户发展","","","","","","","","4G用户发展","","","","","","","","","固网宽带用户发展","","","","","","2G出账收入","","","","","","","3G出账收入","","","","","","","","4G出账收入","","","","","","","","","固网宽带出账收入","","","","","","专租线发展","专租线收入","2G用户语音流量","","","","3G用户语音流量","","","","4G用户语音流量","","",""],
	           ["地市","营服中心","人员","类型","HR编码","渠道（小区）名称","渠道（小区）状态","渠道（小区）编码","","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","","","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流量","户均流量"]];

	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
	</script>
</html>

