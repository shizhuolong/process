var field=[
           "DEV_NUM",
           "INCOME_NUM",
           "DEV_2G_NUM",
           "DEV_3G_NUM",
           "DEV_WIFI_NUM",
           "DEV_4G_NUM",
           "SR_2G_NUM",
           "SR_3G_NUM",
           "SR_WIFI_NUM",
           "SR_4G_NUM",
           "STOCK_2G_NUM",
           "STOCK_3G_NUM",
           "STOCK_WIFI_NUM",
           "STOCK_4G_NUM",
           "CREDIT_NUM",
           "ACCT_NUM_2G",
           "ACCT_NUM_3G",
           "ACCT_NUM_WIFI",
           "ACCT_NUM_4G",
           
           "GIVE_2G_NUM",
           "GIVE_3G_NUM",
           "GIVE_WIFI_NUM",
           "GIVE_4G_NUM",
           
           "RETURN_2G_NUM",
           "RETURN_3G_NUM",
           "RETURN_WIFI_NUM",
           "RETURN_4G_NUM"
           
           ];
var orderBy='';	
$(function(){
	$("#showMark").mouseenter(function(){ 
		$("#mark").show();
	}).mouseleave(function(){ 
		$("#mark").hide();
	}); 
var report=new LchReport({
		title:[
["营销架构",
 
 "总览","",
 "发展","","","",
 "收入","","","",
 "全量用户数","","","",
 "挂账金额",
 "出账用户数","","","",
 "赠费","","","",
 "退费","","",""
 ],
["",
 "移网总发展","移网总收入",
 "2G发展",
 "3G发展",
 "上网卡发展",
 "4G发展",
 
 "2G收入",
 "3G收入",
 "上网卡收入",
 "4G收入",
 
 "全量2G用户数",
 "全量3G用户数",
 "全量上网卡用户数",
 "全量4G用户数",
 
 "",
 
 "2G出账用户数",
 "3G出账用户数",
 "上网卡出账用户数",
 "4G出账用户数",
 
 "2G赠送话费",
 "3G赠送话费",
 "上网卡赠送话费",
 "4G赠送话费",
 
 "2G退费",
 "3G退费",
 "上网卡退费",
 "4G退费"
 ]
		],
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
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				
				if(orgLevel==2){//点击市
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//点击营服中心
					preField=" t.AGENT_M_NAME ROW_ID,t.AGENT_M_NAME ROW_NAME ";
					groupBy=' group by t.AGENT_M_NAME ';
					where=' where t.unit_id=\''+code+"\' ";
				}else if(orgLevel>=4){//点击渠道经理
					preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME ';
					groupBy=' group by t.group_id_4,t.group_id_4_name ';
					if(code=='undefined'){
						where=' where t.AGENT_M_NAME is null and t.unit_id=\''+parentId+'\' ';
					}else{
						where=' where t.AGENT_M_NAME=\''+code+'\' and t.unit_id=\''+parentId+'\' ';
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
					preField=' NVL(t.group_id_1,\'86000\') ROW_ID,NVL(t.group_id_1_name,\'全省合计\') ROW_NAME';
					groupBy=' GROUP BY GROUPING SETS  ( T.GROUP_ID_0,(t.group_id_1, t.group_id_1_name)) ';
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
					preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME';
					groupBy=' group by t.group_id_4,t.group_id_4_name ';
					where=' where t.GROUP_ID_4=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+','+getSumSql(field)+' from PMRT.VIEW_MRT_INCOME_DEV_CH_MON t ';
						
			where+=' and t.DEAL_DATE BETWEEN \''+startDate+'\' AND \''+endDate+'\'';
			if(where!=''&&regionCode!=''){
				where+=" and t.GROUP_ID_1 = '"+regionCode+"'";
			}
			if(where!=''&&unitCode!=''){
				where+=" and t.UNIT_ID IN("+_unit_relation(unitCode)+") ";
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
		if(field[i].startWith("ACCT_")||field[i].startWith("STOCK_")||field[i].startWith("DEV_")){
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
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	
	var preField=' t.group_id_1_name,t.unit_name,t.AGENT_M_NAME,t.group_id_4_name,t.HQ_CHAN_CODE,t.DEAL_DATE ';
	var where='';
	var orderBy=" order by t.group_id_1_name,t.unit_name,t.AGENT_M_NAME,t.group_id_4_name,t.HQ_CHAN_CODE,t.DEAL_DATE ";
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
		where = " where t.GROUP_ID_4='" + code + "' ";
	}
	where+=' and t.DEAL_DATE BETWEEN \''+startDate+'\' AND \''+endDate+'\'';
	if(where!=''&&regionCode!=''){
		where+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(where!=''&&unitCode!=''){
		where+=" and t.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}

	var sql = 'select ' + preField + ',' + fieldSql
			+ ' from PMRT.VIEW_MRT_INCOME_DEV_CH_MON t';
	if (where != '') {
		sql += where;
	}
	if(orderBy!=''){
		sql += orderBy;
	}
	
	showtext = '移网发展收入月报-' + startDate+'-'+endDate;
	var title=[["营销架构","","","","","帐期",
	            
	            "总览","",
	            "发展","","","",
	            "收入","","","",
	            "全量用户数","","","",
	            "挂账金额",
	            "出账用户数","","","",
	            "赠费","","","",
	            "退费","","",""
	            ],
	           ["地市","营服中心","人员","渠道名称","渠道编码","",
	            
	            "移网总发展","移网总收入",
	            
	            "2G发展",
	            "3G发展",
	            "上网卡发展",
	            "4G发展",
	            "2G收入",
	            "3G收入",
	            "上网卡收入",
	            "4G收入",
	            "全量2G用户数",
	            "全量3G用户数",
	            "全量上网卡用户数",
	            "全量4G用户数",
	            "",
	            "2G出账用户数",
	            "3G出账用户数",
	            "上网卡出账用户数",
	            "4G出账用户数",
	            
	            "2G赠送话费",
	            "3G赠送话费",
	            "上网卡赠送话费",
	            "4G赠送话费",
	            
	            "2G退费",
	            "3G退费",
	            "上网卡退费",
	            "4G退费"
	            ]];

	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////