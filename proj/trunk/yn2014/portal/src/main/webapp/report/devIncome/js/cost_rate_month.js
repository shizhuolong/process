var field=[
           "COST_FEE",
           "BUDGET_MONGEY",
           "COST_BUDGET_RATE"
           ];
var orderBy='';	

$(function(){
	listRegions();
	
	var report=new LchReport({
		title:[["营销架构", "成本费用","预算费用","成本预算月占比"]],
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN},{eq:3,css:{color:"red",paddingRight:'10px'}}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			report.showSubRow();
		},afterShowSubRows:function(){
			$("#lch_DataHead").find("TH").unbind();
			$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var qdate = $.trim($("#time").val());
			var regionName=$("#regionName").val();
			var unitName=$("#unitName").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				
				if(orgLevel==2){//点击市
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//点击营服中心
					preField=" t.BUDGET_ITEM_CODE ROW_ID,t.BUDGET_ITEM_NAME ROW_NAME ";
					groupBy=' group by t.BUDGET_ITEM_CODE,t.BUDGET_ITEM_NAME ';
					where=' where t.unit_id=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where 1=1 ';
					orgLevel=2;
				}else if(orgLevel==2){//市
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//营服中心
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.unit_id=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+','+getSumSql(field)+' from pmrt.TB_MRT_COST_RATE_MON t ';
			
			
			if(where!=''&&qdate!=''){
				where+=' and  t.DEAL_DATE='+qdate+' ';
			}
			if(where!=''&&regionName!=''){
				where+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
			}
			if(where!=''&&unitName!=''){
				where+=" and t.UNIT_NAME = '"+unitName+"'";
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
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	$("#searchBtn").click(function(){
		report.showSubRow();
	});
});
function getSumSql(field) {
	var s = "";
	s+=" sum(t.cost_fee) cost_fee, ";
	s+=" sum(t.budget_mongey) budget_mongey, ";
	s+=" case sum(t.budget_mongey) when 0 then '-' else  ";
	s+=" to_char(sum(t.cost_fee)/sum(t.budget_mongey),'9g999g999g999g999g999g999g999g999g990d00') end COST_BUDGET_RATE  ";
	return s;

}
function getSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		s += field[i];
	}
	return s;
}
function listRegions(){
	var sql="";
	
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME from pmrt.TB_MRT_COST_RATE_MON t where 1=1 ";
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and 1=2 ";
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}
function listUnits(regionName){
	var $unit=$("#unitName");
	var sql = "select distinct t.UNIT_NAME from pmrt.TB_MRT_COST_RATE_MON t where 1=1 ";
	
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code;
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else{
			sql+=" and 1=2 ";
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_NAME
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_NAME + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var qdate = $.trim($("#time").val());
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	
	var preField=' t.DEAL_DATE,t.group_id_1_name,t.unit_name,t.BUDGET_ITEM_NAME ';
	var where='';
	var orderBy=" order by t.DEAL_DATE,t.group_id_1_name,t.unit_name,t.BUDGET_ITEM_NAME ";
	var fieldSql=/*field.join(",")*/"COST_FEE,BUDGET_MONGEY,case BUDGET_MONGEY when 0 then '-' else to_char(COST_FEE/BUDGET_MONGEY,'9g999g999g999g999g999g999g999g999g990d00') end COST_BUDGET_RATE ";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " where 1=1 ";
	} else if (orgLevel == 2) {//市
		where = " where t.GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where = " where t.unit_id='" + code + "' ";
	} else if (orgLevel >= 4) {//
		where = " where 1=2 ";
	}
	
	if(qdate!=''){
		where+=' and  t.DEAL_DATE='+qdate+' ';
	}
	if(regionName!=''){
		where+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		where+=" and t.UNIT_NAME = '"+unitName+"'";
	}

	var sql = 'select ' + preField + ',' + fieldSql
			+ ' from PMRT.TB_MRT_COST_RATE_MON t';
	if (where != '') {
		sql += where;
	}
	if(orderBy!=''){
		sql += orderBy;
	}
	
	showtext = '月累计成本预算占比-' + qdate;
	var title=[["帐期","地市名称","营服名称","科目名称","成本费用","预算费用","成本预算月占比"]];

	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////