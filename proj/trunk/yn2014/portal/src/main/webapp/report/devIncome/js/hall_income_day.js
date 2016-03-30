var field=["THIS_2G_SR","LAST_2G_SR","THIS_2G_SR1","LAST_2G_SR1","THIS_3G_SR","LAST_3G_SR","THIS_3G_SR1","LAST_3G_SR1","THIS_4G_SR","LAST_4G_SR","THIS_4G_SR1","LAST_4G_SR1","THIS_NET_SR","LAST_NET_SR","THIS_NET_SR1","LAST_NET_SR1","ALL_SR","LAST_ALL","ALL_SR1","LAST_ALL1"];
var title="";
var deal_date="";
var regionName="";
$(function(){
	listRegions();
	title=[["组织架构","2G收入（万元）","","","","3G收入（万元）","","","","4G收入（万元）","","","","固网（万元）","","","","合计（万元）","","",""],
	       ["","当日","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比"]];
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			deal_date = $("#time").val();
			regionName=$("#regionName").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=' T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,';
					groupBy=' GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ';
				}else if(orgLevel==3){//点击市
					preField=' T1.BUS_HALL_NAME ROW_NAME,';
					groupBy=' GROUP BY T1.BUS_HALL_NAME ';
					where=' AND T1.GROUP_ID_1=\''+code+'\'';
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' \'云南省 \' ROW_NAME,';
					groupBy=' GROUP BY T1.GROUP_ID_0';
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=' T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,';
					groupBy=' GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ';
					where=' AND T1.GROUP_ID_1=\''+code+'\'';
					orgLevel=3;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionName!=""){
				where+=" AND T1.GROUP_ID_1_NAME='"+regionName+"'";
			}
			var sql='SELECT'+preField+getSumSql()+where+groupBy;
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
function getSumSql() {
	var s="SUM(NVL(T1.THIS_2G_SR,0)) THIS_2G_SR                                                                                                          "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_2G_SR,0)) <> 0                                                                               "+
	"                                              THEN (SUM(NVL(T1.THIS_2G_SR,0))-SUM(NVL(T1.LAST_2G_SR,0)))*100 / SUM(NVL(T1.LAST_2G_SR,0))      "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_2G_SR                                            "+
	",SUM(NVL(T1.THIS_2G_SR1,0)) THIS_2G_SR1                                                                                                       "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_2G_SR1,0)) <> 0                                                                              "+
	"                                              THEN (SUM(NVL(T1.THIS_2G_SR1,0))-SUM(NVL(T1.LAST_2G_SR1,0)))*100 / SUM(NVL(T1.LAST_2G_SR1,0))   "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_2G_SR1                                           "+
	",SUM(NVL(T1.THIS_3G_SR,0)) THIS_3G_SR                                                                                                         "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_3G_SR,0)) <> 0                                                                               "+
	"                                              THEN (SUM(NVL(T1.THIS_3G_SR,0))-SUM(NVL(T1.LAST_3G_SR,0)))*100 / SUM(NVL(T1.LAST_3G_SR,0))      "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_3G_SR                                            "+
	",SUM(NVL(T1.THIS_3G_SR1,0)) THIS_3G_SR1                                                                                                       "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_3G_SR1,0)) <> 0                                                                              "+
	"                                              THEN (SUM(NVL(T1.THIS_3G_SR1,0))-SUM(NVL(T1.LAST_3G_SR1,0)))*100 / SUM(NVL(T1.LAST_3G_SR1,0))   "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_3G_SR1                                           "+
	",SUM(NVL(T1.THIS_4G_SR,0)) THIS_4G_SR                                                                                                         "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_4G_SR,0)) <> 0                                                                               "+
	"                                              THEN (SUM(NVL(T1.THIS_4G_SR,0))-SUM(NVL(T1.LAST_4G_SR,0)))*100 / SUM(NVL(T1.LAST_4G_SR,0))      "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_4G_SR                                            "+
	",SUM(NVL(T1.THIS_4G_SR1,0)) THIS_4G_SR1                                                                                                       "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_4G_SR1,0)) <> 0                                                                              "+
	"                                              THEN (SUM(NVL(T1.THIS_4G_SR1,0))-SUM(NVL(T1.LAST_4G_SR1,0)))*100 / SUM(NVL(T1.LAST_4G_SR1,0))   "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_4G_SR1                                           "+
	",SUM(NVL(T1.THIS_NET_SR,0)) THIS_NET_SR                                                                                                       "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_NET_SR,0)) <> 0                                                                              "+
	"                                              THEN (SUM(NVL(T1.THIS_NET_SR,0))-SUM(NVL(T1.LAST_NET_SR,0)))*100 / SUM(NVL(T1.LAST_NET_SR,0))   "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_NET_SR                                           "+
	",SUM(NVL(T1.THIS_NET_SR1,0)) THIS_NET_SR1                                                                                                     "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_NET_SR1,0)) <> 0                                                                             "+
	"                                              THEN (SUM(NVL(T1.THIS_NET_SR1,0))-SUM(NVL(T1.LAST_NET_SR1,0)))*100 / SUM(NVL(T1.LAST_NET_SR1,0))"+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_NET_SR1                                          "+
	",SUM(NVL(T1.ALL_SR,0)) ALL_SR                                                                                                                 "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_ALL,0)) <> 0                                                                                 "+
	"                                              THEN (SUM(NVL(T1.ALL_SR,0))-SUM(NVL(T1.LAST_ALL,0)))*100 / SUM(NVL(T1.LAST_ALL,0))              "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_ALL                                              "+
	",SUM(NVL(T1.ALL_SR1,0)) ALL_SR1                                                                                                               "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_ALL1,0)) <> 0                                                                                "+
	"                                              THEN (SUM(NVL(T1.ALL_SR1,0))-SUM(NVL(T1.LAST_ALL1,0)))*100 / SUM(NVL(T1.LAST_ALL1,0))           "+
	"                                              ELSE 0 END ,'FM99999999990.9999')) || '%' LAST_ALL1                                             "+
	"FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY T1 WHERE T1.DEAL_DATE='"+deal_date+"'";
	
	return s;
}

function listRegions(){
	//条件
	var sql = "select distinct t.GROUP_ID_1,t.GROUP_ID_1_NAME from PMRT.TB_MRT_BUS_HALL_INCOME_DAY t where 1=1";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}
	sql+=" order by t.group_id_1";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
	} else {
		alert("获取地市信息失败");
	}
}
function downsAll() {
	var preField=' T1.GROUP_ID_1_NAME,T1.BUS_HALL_NAME,';
	var where='';
	var orderBy=" ORDER BY T1.GROUP_ID_1,T1.BUS_HALL_NAME";
	var groupBy=" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.BUS_HALL_NAME"
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " AND T1.GROUP_ID_0='" + code + "' ";
	} else {//市
		where = " AND T1.GROUP_ID_1='" + code + "' ";
	} 
	if(regionName!=""){
		where+=" AND T1.GROUP_ID_1_NAME='"+regionName+"'";
	}
	var sql = 'SELECT' + preField + getSumSql()+where+groupBy+orderBy;
	var showtext = '营业厅收入报表' + deal_date;
	title=[["组织架构","渠道","2G收入（万元）","","","","3G收入（万元）","","","","4G收入（万元）","","","","固网（万元）","","","","合计（万元）","","",""],
	       ["","","当日","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比"]];
	downloadExcel(sql,title,showtext);
}
