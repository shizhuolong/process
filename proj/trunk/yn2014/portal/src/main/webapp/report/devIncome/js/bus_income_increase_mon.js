var field=["HQ_CHAN_CODE","OPERATE_TYPE","THIS_2G_INCOME","INCREASE_2G_INCOME","HB_2G","THIS_3G_INCOME","INCREASE_3G_INCOME","HB_3G","THIS_4G_INCOME","INCREASE_4G_INCOME","HB_4G","THIS_NET_INCOME","INCREASE_NET_INCOME","HB_NET","THIS_KD_INCOME","INCREASE_KD_INCOME","HB_KD","THIS_FUSE_INCOME","INCREASE_FUSE_INCOME","HB_FUSE","THIS_ALL_INCOME","INCREASE_ALL_INCOME","HB_ALL"];
var title=[["组织架构","渠道编码","经营模式","2G业务（万元）","","","3G业务（万元）","","","4G业务（万元）","","","固网（万元）","","","其中：宽带（万元）","","","其中：融合（万元）","","","合计（万元）","",""],
           ["","","","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比"]];
var report=null;
var startDate="";
var endDate="";
var operateType="";
$(function(){
	report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where='';
			var groupBy='';
			var orderBy='';
			var code='';
			var orgLevel='';
			startDate=$("#startDate").val();
			endDate=$("#endDate").val();
			operateType=$("#operateType").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=' GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,\'\' HQ_CHAN_CODE,\'\' OPERATE_TYPE,';
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
					where=' AND GROUP_ID_0=\''+code+'\'';
					orderBy=' ORDER BY GROUP_ID_1';
				}else if(orgLevel==3){//点击市
					preField=' UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,\'\' HQ_CHAN_CODE,\'\' OPERATE_TYPE,';
					groupBy=' GROUP BY UNIT_ID,UNIT_NAME ';
					where=' AND GROUP_ID_1=\''+code+'\'';
					orderBy=' ORDER BY UNIT_ID';
				}else if(orgLevel==4){//点击营服
					preField=' BUS_NAME ROW_NAME,HQ_CHAN_CODE,OPERATE_TYPE,';
					groupBy=' GROUP BY BUS_NAME,HQ_CHAN_CODE,OPERATE_TYPE';
					where=' AND UNIT_ID=\''+code+'\'';
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' \'云南省 \' ROW_NAME,\'86000\' ROW_ID,\'\' HQ_CHAN_CODE,\'\' OPERATE_TYPE,';
					groupBy=' GROUP BY GROUP_ID_0';
					orgLevel++;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=' GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,\'\' HQ_CHAN_CODE,\'\' OPERATE_TYPE,';
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
					where=' AND GROUP_ID_1=\''+code+'\'';
					orgLevel=3;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			var sql='SELECT'+preField+getSql()+where+groupBy+orderBy;
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
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
	});
});

function getSql() {
	var s="SUM(NVL(THIS_2G_INCOME,0))THIS_2G_INCOME                                                       "+
	",SUM(NVL(INCREASE_2G_INCOME,0)) INCREASE_2G_INCOME                                                    "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LAST_2G_INCOME,0)) <> 0                                      "+
	"                            THEN SUM(NVL(INCREASE_2G_INCOME,0))*100 /SUM(NVL(LAST_2G_INCOME,0))       "+
	"                            ELSE 0 END,'FM99999999990.99')) || '%' HB_2G                              "+
	",SUM(NVL(THIS_3G_INCOME,0))THIS_3G_INCOME                                                             "+
	",SUM(NVL(INCREASE_3G_INCOME,0))INCREASE_3G_INCOME                                                     "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LAST_3G_INCOME,0)) <> 0                                      "+
	"                            THEN SUM(NVL(INCREASE_3G_INCOME,0))*100 / SUM(NVL(LAST_3G_INCOME,0))      "+
	"                            ELSE 0 END,'FM99999999990.99')) || '%'HB_3G                               "+
	",SUM(NVL(THIS_4G_INCOME,0))THIS_4G_INCOME                                                             "+
	",SUM(NVL(INCREASE_4G_INCOME,0))INCREASE_4G_INCOME                                                     "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LAST_4G_INCOME,0)) <> 0                                      "+
	"                            THEN SUM(NVL(INCREASE_4G_INCOME,0))*100/ SUM(NVL(LAST_4G_INCOME,0))       "+
	"                            ELSE 0 END,'FM99999999990.99')) || '%' HB_4G                              "+
	",SUM(NVL(THIS_NET_INCOME,0))THIS_NET_INCOME                                                           "+
	",SUM(NVL(INCREASE_NET_INCOME,0))INCREASE_NET_INCOME                                                   "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LAST_NET_INCOME,0))<> 0                                      "+
	"                            THEN SUM(NVL(INCREASE_NET_INCOME,0))*100 / SUM(NVL(LAST_NET_INCOME,0))    "+
	"                            ELSE 0 END,'FM99999999990.99')) || '%'HB_NET                              "+
	",SUM(NVL(THIS_KD_INCOME,0))THIS_KD_INCOME                                                             "+
	",SUM(NVL(INCREASE_KD_INCOME,0))INCREASE_KD_INCOME                                                     "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LAST_KD_INCOME,0)) <>0                                       "+
	"                            THEN SUM(NVL(INCREASE_KD_INCOME,0))*100 / SUM(NVL(LAST_KD_INCOME,0))      "+
	"                            ELSE 0 END,'FM99999999990.99')) || '%'HB_KD                               "+
	",SUM(NVL(THIS_FUSE_INCOME,0))THIS_FUSE_INCOME                                                         "+
	",SUM(NVL(INCREASE_FUSE_INCOME,0))INCREASE_FUSE_INCOME                                                 "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LAST_FUSE_INCOME,0)) <> 0                                    "+
	"                              THEN SUM(NVL(INCREASE_FUSE_INCOME,0))*100 / SUM(NVL(LAST_FUSE_INCOME,0))"+
	"                              ELSE 0 END,'FM99999999990.99')) || '%'HB_FUSE                           "+
	",SUM(NVL(THIS_ALL_INCOME,0))THIS_ALL_INCOME                                                           "+
	",SUM(NVL(INCREASE_ALL_INCOME,0))INCREASE_ALL_INCOME                                                   "+
	",TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LAST_ALL_INCOME,0)) <> 0                                     "+
	"                            THEN SUM(NVL(INCREASE_ALL_INCOME,0))*100 /SUM(NVL(LAST_ALL_INCOME,0))     "+
	"                            ELSE 0 END,'FM99999999990.99')) || '%'HB_ALL                              "+
	"FROM PMRT.TB_MRT_BUS_INCOME_INCREASE_MON                                                              "+
	" WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                                            ";
	return s;
}

function downsAll() {
	var preField=' DEAL_DATE,GROUP_ID_1_NAME,BUS_NAME,HQ_CHAN_CODE,OPERATE_TYPE,';
	var where='';
	var orderBy=" ORDER BY DEAL_DATE,GROUP_ID_1,UNIT_ID";
	var groupBy=" GROUP BY DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,BUS_NAME,HQ_CHAN_CODE,OPERATE_TYPE";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " AND GROUP_ID_0='" + code + "' ";
	} else {//市
		where = " AND GROUP_ID_1='" + code + "' ";
	} 

	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	var sql = 'SELECT' + preField + getSql()+where+groupBy+orderBy;
	var showtext = '出帐收入净增用户统计月报表' + startDate+"-"+endDate;
	var title=[["账期","地市","营业厅名称","渠道编码","经营模式","2G业务（万元）","","","3G业务（万元）","","","4G业务（万元）","","","固网（万元）","","","其中：宽带（万元）","","","其中：融合（万元）","","","合计（万元）","",""],
	           ["","","","","","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比"]];
	downloadExcel(sql,title,showtext);
}
