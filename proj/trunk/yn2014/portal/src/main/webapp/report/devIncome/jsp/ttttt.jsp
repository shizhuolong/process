<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>ttt</title>
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
</head>
<style>
	
</style>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div id="lchcontent">
	</div>
<script>
    
$(function(){
	var field=["ORGNAME","CODE","AREA_NAME"];
	var orderBy="";
	var report=new LchReport({
		title:["机构名称","机构代码","地区名称"],
		field:field,
		rowParams:["ID"],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			orderBy=" order by "+field[index]+" "+type+" ";
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			if($tr){
				var sql="select t.id,t.orgname,t.code,t.area_name from portal.apdp_org t ";
				var id=$tr.attr("ID");
				var orgLevel=$tr.attr("orgLevel");
				sql+=" where t.parent_id= "+id+orderBy;
				var d=query(sql);
				orgLevel++;
				return {data:d,extra:{orgLevel:orgLevel}};
			}else{
				var sql="select t.id,t.orgname,t.code,t.area_name from portal.apdp_org t ";
				var id=1;
				sql+=" where t.id= "+id+orderBy;
				var d=query(sql);
				return {data:d,extra:{orgLevel:2}};
			}
		}
	});
	report.showSubRow();
});
</script>
</html>