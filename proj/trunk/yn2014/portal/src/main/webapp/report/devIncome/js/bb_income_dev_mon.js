var field=[
"BB_INCOME",
"ADSL_INCOME",
"LAN_INCOME",
"EOC_INCOME",
"FTTH_INCOME",

"BB_DEV_NUM",
"ADSL_DEV_NUM",
"LAN_DEV_NUM",
"EOC_DEV_NUM",
"FTTH_DEV_NUM",

"STOCK_NUM",
"ADSL_STOCK_NUM",
"LAN_STOCK_NUM",
"EOC_STOCK_NUM",
"FTTH_STOCK_NUM",

"ACCT_NUM",
"ACCT_ADSL_NUM",
"ACCT_LAN_NUM",
"ACCT_EOC_NUM",
"ACCT_FTTH_NUM"
];
var orderBy='';	
$(function(){
	$("#showMark").mouseenter(function(){ 
		$("#mark").show();
	}).mouseleave(function(){ 
		$("#mark").hide();
	}); 
	var report=new LchReport({
		title:[["营销架构","宽带收入","","","","","宽带发展量","","","","","宽带在网用户数","","","","","宽带出账用户数","","","",""],
		       ["","合计","ADSL收入","LAN收入","EOC收入","FTTH收入",
		        "合计","ADSL发展量","LAN发展量","EOC发展量","FTTH发展量",
		        "合计","ADSL在网用户数","LAN在网用户数","EOC在网用户数","FTTH在网用户数",
		        "合计","ADSL出账用户数","LAN出账用户数","EOC出账用户数","FTTH出账用户数"]],
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" order by row_name "+type+" ";
			}else if(index>0){
				orderBy=" order by "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var qdate = $.trim($("#time").val());
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var stdName=$("#stdName").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				
				if(orgLevel==2){//点击市
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//点击营服中心
					preField=" t.STD_M_NAME ROW_ID,nvl(t.STD_M_NAME,'无小区经理') ROW_NAME ";
					groupBy=' group by t.STD_M_NAME ';
					where=' where t.unit_id=\''+code+"\' ";
				}else if(orgLevel>=4){//点击渠道经理
					preField=' t.STD_6_ID ROW_ID,t.STD_6_NAME ROW_NAME ';
					groupBy=' group by t.STD_6_ID,t.STD_6_NAME ';
					if(code=='undefined'){
						where=' where t.STD_M_NAME is null and t.unit_id=\''+parentId+'\' ';
					}else{
						where=' where t.STD_M_NAME=\''+code+'\' and t.unit_id=\''+parentId+'\' ';
					}
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' NVL(T.GROUP_ID_1,\'86000\') ROW_ID, NVL(T.GROUP_ID_1_NAME,\'全省合计\') ROW_NAME';
					groupBy=' GROUP BY GROUPING SETS  ( T.DEAL_DATE,(T.GROUP_ID_1, T.GROUP_ID_1_NAME))';
					where=' where t.GROUP_ID_0=\''+code+"\' ";
					orgLevel=2;
				}else if(orgLevel==2){//市
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//营服中心
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=" where t.UNIT_ID IN("+_unit_relation(code)+") ";
				}else if(orgLevel>=4){//
					preField=" t.STD_6_ID ROW_ID,t.STD_6_NAME ROW_NAME";
					groupBy=' group by t.STD_6_ID,t.STD_6_NAME ';
					where=' where t.STD_6_ID=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+','+getSumSql(field)+' from PMRT.TAB_MRT_BB_INCOME_DEV_MON t ';
			
			
			if(where!=''&&qdate!=''){
				where+=' and  t.DEAL_DATE='+qdate+' ';
			}
			if(where!=''&&regionCode!=''){
				where+=" and t.GROUP_ID_1 = '"+regionCode+"'";
			}
			if(where!=''&&unitCode!=''){
				where+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
			}
			if(where!=''&&stdName!=''){
				where+=" and t.STD_6_NAME like '%"+stdName+"%'";
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
function getSumSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		if(i>4){
			s += "trim(to_char(SUM(" + field[i]
			+ "),'9g999g999g999g999g999g999g999g999g999')) " + field[i];
		}else{
			s += "trim(to_char(SUM(" + field[i]
			+ "),'9g999g999g999g999g999g999g999g999g990d00')) " + field[i];
		}
	}
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
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var qdate = $.trim($("#time").val());
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var stdName=$("#stdName").val();
	
	var preField=' t.group_id_1_name,t.unit_name,t.STD_M_NAME,t.STD_6_NAME,t.STD_6_ID,t.DEAL_DATE ';
	var where='';
	var orderBy=" order by t.group_id_1_name,t.unit_name,t.STD_M_NAME,t.STD_6_NAME,t.STD_6_ID,t.DEAL_DATE ";
	var fieldSql=field.join(",");
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " where t.GROUP_ID_0='" + code + "' ";
	} else if (orgLevel == 2) {//市
		where = " where t.GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where=" where t.UNIT_ID IN("+_unit_relation(code)+") ";
	} else if (orgLevel >= 4) {//
		where = " where t.STD_6_ID='" + code + "' ";
	}
	
	if(where!=''&&qdate!=''){
		where+=' and  t.DEAL_DATE='+qdate+' ';
	}
	if(where!=''&&regionCode!=''){
		where+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(where!=''&&unitCode!=''){
		where+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(where!=''&&stdName!=''){
		where+=" and t.STD_6_NAME like '%"+stdName+"%'";
	}
	
	var sql = 'select ' + preField + ',' + fieldSql
			+ ' from PMRT.TAB_MRT_BB_INCOME_DEV_MON t';
	if (where != '') {
		sql += where;
	}
	if(orderBy!=''){
		sql += orderBy;
	}
	
	showtext = '固网宽带发展收入月报-' + qdate;
	var title=[["营销架构","","","","","帐期",
	            "宽带收入","","","","","宽带发展量","","","","","宽带在网用户数","","","","","宽带出账用户数","","","",""
	            
	            ],
	           ["地市","营服中心","小区经理","小区名称","小区编码","",
	            
	            "合计","ADSL收入","LAN收入","EOC收入","FTTH收入",
		        "合计","ADSL发展量","LAN发展量","EOC发展量","FTTH发展量",
		        "合计","ADSL在网用户数","LAN在网用户数","EOC在网用户数","FTTH在网用户数",
		        "合计","ADSL出账用户数","LAN出账用户数","EOC出账用户数","FTTH出账用户数"
	            ]];

	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////