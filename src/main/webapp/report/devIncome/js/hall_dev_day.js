var report;
$(function(){
	var title=[["组织架构","厅数","发展","","","","收入","","","",],
	           ["","","日发展","月累计发展","单厅发展","累计发展环比","日收入","月累计收入","单厅收入","累计收入环比"]];
	var field=["ROW_NAME","HALLCOUNT","DAYDEV","MONDEV","HALLDEV","DEVRATE","DAYINC","MONINC","HALLINC","INCRATE"];
	$("#searchBtn").click(function(){
		report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	});
	report=new LchReport({
		title:title,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var code=$("#code").val();
			var regionCode=$("#regionCode").val();
			var where = "WHERE 1=1";
			var level;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//省进去点击市
					level=2;
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//地市或营服进去点击市
					level=2;
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=0;
					where+=" AND T.GROUP_ID_0=86000";
				}else if(orgLevel==2||orgLevel==3){//市
					level=1;
					code=region;
					orgLevel=2;
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}
			orgLevel++;
			
			var dealDate=$("#dealDate").val();
			where+=" AND T.DEAL_DATE='"+dealDate+"'";
			where+=" AND T.OPERATE_TYPE='自营'";
			if(regionCode!=""){
				where+=" AND T.GROUP_ID_1='"+regionCode+"'";
			}
			if(chanlCode!=""){
				where += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			var sql="";
			if(level<2){
				sql=getFristSql(where);
			}else{
				sql=getSecondSql(where,dealDate);
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
});

function getFristSql(where){
	var s="SELECT T1.GROUP_ID_1 ROW_ID,                                                                             "+
	"       T1.GROUP_ID_1_NAME ROW_NAME,                                                                        "+
	"       T1.厅数 hallCount,                                                                         "+
	"       T1.日发展 dayDev,                                                                          "+
	"       T1.月累计发展 monDev,                                                                      "+
	"       T1.单厅发展 hallDev,                                                                       "+
	"       T1.累计发展环比 devRate,                                                                   "+
	"       T0.日收入 dayInc,                                                                          "+
	"       T0.月累计收入 monInc,                                                                      "+
	"       T0.单厅收入 hallInc,                                                                       "+
	"       T0.累计收入环比 incRate                                                                    "+
	"  FROM (SELECT                                                                                    "+
	"              NVL(T.GROUP_ID_1,'合计') GROUP_ID_1,                                                "+
	"              NVL(T.GROUP_ID_1_NAME, '合计') GROUP_ID_1_NAME,                                     "+
	"               SUM(NVL(T.ALL_NUM, 0) - NVL(T.THIS_WX_NUM, 0)) 日发展,                             "+
	"               SUM(NVL(T.ALL_NUM1, 0) - NVL(T.THIS_WX_NUM1, 0)) 月累计发展,                       "+
	"               COUNT(1) 厅数,                                                                     "+
	"               ROUND(SUM(NVL(T.ALL_NUM1, 0) - NVL(T.THIS_WX_NUM1, 0)) /                           "+
	"                     COUNT(1),                                                                    "+
	"                     2) 单厅发展,                                                                 "+
	"               PMRT.LINK_RATIO(SUM(NVL(T.ALL_NUM1, 0) -                                           "+
	"                                   NVL(T.THIS_WX_NUM1, 0)),                                       "+
	"                               SUM(NVL(T.LAST_ALL_NUM1, 0) -                                      "+
	"                                   NVL(T.LAST_WX_NUM1, 0)),                                       "+
	"                               2) 累计发展环比                                                    "+
	"          FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY T                                                     "+
	                                      where                                                         +
	"         GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0, T.GROUP_ID_1,T.GROUP_ID_1_NAME))) T1  "+
	"  JOIN (SELECT                                                                                    "+
	"              NVL(T.GROUP_ID_1,'合计') GROUP_ID_1,                                                "+
	"              NVL(T.GROUP_ID_1_NAME, '合计') GROUP_ID_1_NAME,                                     "+
	"               SUM(NVL(T.ALL_SR, 0)) 日收入,                                                      "+
	"               SUM(NVL(T.ALL_SR1, 0)) 月累计收入,                                                 "+
	"               COUNT(1) 厅数,                                                                     "+
	"               ROUND(SUM(NVL(T.ALL_SR1, 0)) / COUNT(1), 2) 单厅收入,                              "+
	"               PMRT.LINK_RATIO(SUM(NVL(T.ALL_SR1, 0)),                                            "+
	"                               SUM(NVL(T.LAST_ALL1, 0)),                                          "+
	"                               2) 累计收入环比                                                    "+
	"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY T                                                  "+
	                                      where                                                         +
	"         GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0, T.GROUP_ID_1,T.GROUP_ID_1_NAME))) T0  "+
	"    ON (T1.GROUP_ID_1_NAME = T0.GROUP_ID_1_NAME)                                                  ";

	return s;
}

function getSecondSql(where,dealDate) {
	return "SELECT "+dealDate+" DEAL_DATE,                                                                               "+
	"       T1.GROUP_ID_1_NAME,                                                                                   "+
	"       T1.BUS_HALL_NAME ROW_NAME,                                                                            "+
	"       T1.HQ_CHAN_CODE,                                                                                      "+
	"       T1.厅数 hallCount,                                                                                    "+
	"       T1.日发展 dayDev,                                                                                     "+
	"       T1.月累计发展 monDev,                                                                                 "+
	"       T1.单厅发展 hallDev,                                                                                  "+
	"       T1.累计发展环比 devRate,                                                                              "+
	"       T0.日收入 dayInc,                                                                                     "+
	"       T0.月累计收入 monInc,                                                                                 "+
	"       T0.单厅收入 hallInc,                                                                                  "+
	"       T0.累计收入环比 incRate                                                                               "+
	"FROM (                                                                                                       "+
	"SELECT NVL(T.GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME                                                         "+
	"      ,NVL(T.HQ_CHAN_CODE,'合计') HQ_CHAN_CODE                                                               "+
	"      ,NVL(T.BUS_HALL_NAME,'合计')BUS_HALL_NAME                                                              "+
	"      ,SUM(NVL(T.ALL_NUM,0)-NVL(T.THIS_WX_NUM,0)) 日发展                                                     "+
	"      ,SUM(NVL(T.ALL_NUM1,0)-NVL(T.THIS_WX_NUM1,0)) 月累计发展                                               "+
	"      ,COUNT(1) 厅数                                                                                         "+
	"      ,ROUND(SUM(NVL(T.ALL_NUM1,0)-NVL(T.THIS_WX_NUM1,0))/COUNT(1),2)单厅发展                                "+
	"      ,PMRT.LINK_RATIO(SUM(NVL(T.ALL_NUM1,0)-NVL(T.THIS_WX_NUM1,0))                                          "+
	"              ,SUM(NVL(T.LAST_ALL_NUM1,0)-NVL(T.LAST_WX_NUM1,0)),2) 累计发展环比                             "+
	"FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY T                                                                          "+
	                                        where                                                                  +
	"GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.BUS_HALL_NAME))         "+
	")T1                                                                                                          "+
	"JOIN  (SELECT NVL(T.GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME                                                  "+
	"             ,NVL(T.HQ_CHAN_CODE,'合计') HQ_CHAN_CODE                                                        "+
	"             ,NVL(T.BUS_HALL_NAME,'合计')BUS_HALL_NAME                                                       "+
	"             ,SUM(NVL(T.ALL_SR,0)) 日收入                                                                    "+
	"             ,SUM(NVL(T.ALL_SR1,0)) 月累计收入                                                               "+
	"             ,COUNT(1) 厅数                                                                                  "+
	"             ,ROUND(SUM(NVL(T.ALL_SR1,0))/COUNT(1),2)单厅收入                                                "+
	"             ,PMRT.LINK_RATIO(SUM(NVL(T.ALL_SR1,0))                                                          "+
	"                    ,SUM(NVL(T.LAST_ALL1,0)),2) 累计收入环比                                                 "+
	"       FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY T                                                                "+
	                                        where                                                                  +
	"       GROUP BY GROUPING SETS (T.GROUP_ID_0,(T.GROUP_ID_0,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.BUS_HALL_NAME)) "+
	"       )T0                                                                                                   "+
	"ON (T1.HQ_CHAN_CODE=T0.HQ_CHAN_CODE)                                                                         ";
}

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var where ="WHERE 1=1";
	where+=" AND T.DEAL_DATE='"+dealDate+"'";
	where+=" AND T.OPERATE_TYPE='自营'";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND T.GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(chanlCode!=""){
		where += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = getSecondSql(where,dealDate);
	var showtext = '自营厅发展收入日通报' + dealDate;
	var title=[["账期","组织架构","","渠道编码","厅数","发展","","","","收入","","","",],
	           ["","地市","营业厅","","","日发展","月累计发展","单厅发展","累计发展环比","日收入","月累计收入","单厅收入","累计收入环比"]];
	downloadExcel(sql,title,showtext);
}
