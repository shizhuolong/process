var title=[["组织架构","渠道编码","渠道名称","经营模式","厅类型","总任务数","分配任务数","任务查看率","登网完成率","当日登网用户数","累计登网用户数"]];
var field=["TOTAL_TASK_NUM","ALLOT_TASK_NUM","TASK_RATIO","DW_RATIO","DW_NUM","DW_NUM1"];
$(function(){
	var maxDate=getMaxDate("PODS.TAB_ODS_2TO4_DW_NUM_DAY")
	$("#dealDate").val(maxDate);
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["ROW_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","OPERATE_TYPE","CHNL_TYPE"].concat(field),
		css:[{gt:6,css:LchReport.RIGHT_ALIGN}, {array:[5],css:LchReport.NORMAL_STYLE}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var region='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var where=" WHERE T1.DEAL_DATE = '"+dealDate+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					level=2;
				}else if(orgLevel==3){//点击市
					where+=" AND GROUP_ID_1='"+code+"'";
					level=3;
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				region=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=1;
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+region+"'";
					level=2;
				}else if(orgLevel==3){//营服
					orgLevel=2;
					where+=" AND GROUP_ID_1='"+region+"'";
					level=2;
				}else {
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			sql=getSql(level,where);
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	var where=" WHERE T1.DEAL_DATE = '"+dealDate+"'";
	var regionCode=$("#regionCode").val();
	var is_yyt=$("#is_yyt").val();
	var opeType=$("#opeType").val();
	var hqChanCode=$.trim($("#hqChanCode").val());
	if (orgLevel == 1) {//省
		
	} else if(orgLevel == 2||orgLevel == 3){//市
		where += " AND T1.GROUP_ID_1='"+region+"'";
	} else{
		where+=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND T1.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(is_yyt!=''){
		where+=" AND T1.IS_YYT = '"+is_yyt+"'";
	}
	if(opeType!=''){
		where+=" AND T1.OPERATE_TYPE = '"+opeType+"'";
	}
	if(hqChanCode!=''){
		where+=" AND T1.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	var sql = " SELECT GROUP_ID_1_NAME,HQ_CHAN_CODE,GROUP_ID_4_NAME,OPERATE_TYPE,CHNL_TYPE,"+field.join(",")+" FROM PODS.TAB_ODS_2TO4_DW_NUM_DAY T1"+where;
	var showtext = '2G升4G活动-' + dealDate;
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var is_yyt=$("#is_yyt").val();
	var opeType=$("#opeType").val();
	var hqChanCode=$.trim($("#hqChanCode").val());
	
	if(regionCode!=''){
		where+=" AND T1.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(is_yyt!=''){
		where+=" AND T1.IS_YYT = '"+is_yyt+"'";
	}
	if(opeType!=''){
		where+=" AND T1.OPERATE_TYPE = '"+opeType+"'";
	}
	if(hqChanCode!=''){
		where+=" AND T1.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	if(orgLevel==1){
		return " SELECT '云南省' ROW_NAME,'86000' ROW_ID,'--' HQ_CHAN_CODE,'--' GROUP_ID_4_NAME,'--' OPERATE_TYPE,'--' CHNL_TYPE,'--' IS_YYT,"+getSumSql()+" FROM PODS.TAB_ODS_2TO4_DW_NUM_DAY T1"+where+
		"GROUP BY T1.DEAL_DATE";
	}else if(orgLevel==2){
		return " SELECT GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' GROUP_ID_4_NAME,'--' OPERATE_TYPE,'--' CHNL_TYPE,'--' IS_YYT,"+getSumSql()+" FROM PODS.TAB_ODS_2TO4_DW_NUM_DAY T1"+where+
		"GROUP BY T1.DEAL_DATE,T1.GROUP_ID_1,T1.GROUP_ID_1_NAME";
	}else if(orgLevel==3){
		return " SELECT GROUP_ID_4_NAME ROW_NAME,HQ_CHAN_CODE ROW_ID,HQ_CHAN_CODE,GROUP_ID_4_NAME,OPERATE_TYPE,CHNL_TYPE,IS_YYT,"+getSumSql()+" FROM PODS.TAB_ODS_2TO4_DW_NUM_DAY T1"+where+
		"GROUP BY T1.DEAL_DATE,T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.HQ_CHAN_CODE,T1.GROUP_ID_4_NAME,T1.OPERATE_TYPE,T1.CHNL_TYPE,T1.IS_YYT";
	}
  }

function getSumSql(){
	return "  SUM(NVL(T1.TOTAL_TASK_NUM,0))TOTAL_TASK_NUM                                  "+
	"              ,SUM(NVL(T1.ALLOT_TASK_NUM,0))ALLOT_TASK_NUM                            "+
	"              ,SUM(NVL(T1.FIND_TASK_NUM,0))FIND_TASK_NUM                              "+
	"              ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.ALLOT_TASK_NUM,0))=0 THEN 0 "+
	"                                          ELSE SUM(NVL(T1.FIND_TASK_NUM,0))*100       "+
	"                                            /SUM(NVL(T1.ALLOT_TASK_NUM,0)) END        "+
	"                                     ,'FM9999990.99')) ||'%'TASK_RATIO                "+
	"             ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.ALLOT_TASK_NUM,0))=0 THEN 0  "+
	"                                          ELSE  SUM(NVL(T1.DW_NUM1,0))*100            "+
	"                                            /SUM(NVL(T1.ALLOT_TASK_NUM,0)) END        "+
	"                                     ,'FM9999990.99')) ||'%' DW_RATIO                 "+
	"            ,SUM(NVL(T1.DW_NUM,0))DW_NUM                                              "+
	"            ,SUM(NVL(T1.DW_NUM1,0))DW_NUM1                                            ";
}
