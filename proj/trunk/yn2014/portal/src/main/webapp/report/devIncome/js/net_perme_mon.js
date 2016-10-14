var field=["HQ_CHAN_CODE","OPERATE_TYPE","USER_4G_ACCT","USER_ALL_ACCT","PERMEN_4G","ALL_4G_NET","MOB_ACCT_NUM","PERME_ALL_4G"];
var title=[["州市","渠道编码","经营模式","自营厅4G网络渗透率","","","全渠道4G网络渗透率","",""],
           ["","","","使用4G网络出帐用户数","移网出帐用户数","4G网络渗透率","使用4G网络出帐用户数","移网出帐用户数","4G网络渗透率"]];
var report=null;
var qdate="";
var orderBy="";
$(function(){
	 listRegions();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:2,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" ORDER BY ROW_NAME "+type+" ";
			}else if(index>0){
				orderBy=" ORDER BY "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where=' WHERE 1 = 1';
			var groupBy='';
			var order='';
			var code='';
			var orgLevel='';
			qdate = $("#month").val();
			var regionName=$("#regionName").val();
			var operate_type=$("#operate_type").val();
			var hq_chan_code=$.trim($("#hq_chan_code").val());
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
			    if(orgLevel==2||orgLevel==3||orgLevel==4){
					preField=" T.HQ_CHAN_NAME ROW_NAME,T.HQ_CHAN_CODE ROW_ID,T.HQ_CHAN_CODE,T.OPERATE_TYPE,";
					groupBy=" GROUP BY T.HQ_CHAN_CODE,T.HQ_CHAN_NAME,T.OPERATE_TYPE";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					order=" ORDER BY T.HQ_CHAN_CODE";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#regionCode").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示市
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' OPERATE_TYPE,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
				}else if(orgLevel==2){//市
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' OPERATE_TYPE,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心 看地市
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' OPERATE_TYPE,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			where+=" AND T.DEAL_DATE='"+qdate+"'";
			if(regionName!=''){
				where+=" AND T.GROUP_ID_1_NAME = '"+regionName+"'";
			}
			if(hq_chan_code!=''){
				where+=" AND T.HQ_CHAN_CODE = '"+hq_chan_code+"'";
			}
			if(operate_type!=''){
				where+=" AND T.OPERATE_TYPE = '"+operate_type+"'";
			}
			var sql='SELECT '+preField+getSumField()+where+groupBy+order;
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var preField=' T.DEAL_DATE,T.GROUP_ID_1_NAME,T.HQ_CHAN_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE,';
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE";
	var groupBy=" GROUP BY T.DEAL_DATE,T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.HQ_CHAN_NAME,T.OPERATE_TYPE";
	var regionName=$("#regionName").val();
	var operate_type=$("#operate_type").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var fieldSql=getSumField();
		
	//先根据用户信息得到前几个字段
	var code = $("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND T.GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where += " AND T.GROUP_ID_1='" + code + "' ";
	}else{
		where +=" AND 1=2";
	}
	where+=" AND T.DEAL_DATE='"+qdate+"'";
	if(regionName!=''){
		where+=" AND T.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(hq_chan_code!=''){
		where+=" AND T.HQ_CHAN_CODE = '"+hq_chan_code+"'";
	}
	if(operate_type!=''){
		where+=" AND T.OPERATE_TYPE = '"+operate_type+"'";
	}
	var sql = 'SELECT ' + preField + fieldSql+where+groupBy+orderBy;
	showtext = '自有厅4G渗透率支撑' + qdate;
	var title=[["账期","地市","营业厅名称","渠道编码","经营模式","自营厅4G网络渗透率","","","全渠道4G网络渗透率","",""],
	                     ["","","","","","","使用4G网络出帐用户数","移网出帐用户数","4G网络渗透率","使用4G网络出帐用户数","移网出帐用户数","4G网络渗透率"]];
	downloadExcel(sql,title,showtext);
}
function listRegions(){
	//条件
	var sql = "SELECT DISTINCT t.GROUP_ID_1_NAME FROM PMRT.TAB_MRT_4G_NET_PERME_MON t where 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND t.GROUP_ID_1="+regionCode;
	}else{
		sql+=" AND 1=2 ";
	}
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

function getSumField(){
	var fs = "      SUM(NVL(T.USER_4G_ACCT,0))USER_4G_ACCT                                           "+
	"      ,SUM(NVL(T.USER_ALL_ACCT,0))USER_ALL_ACCT                                                 "+
	"      ,ROUND(CASE WHEN SUM(NVL(T.USER_ALL_ACCT,0))=0 THEN 0                                     "+
	"                  ELSE SUM(NVL(T.USER_4G_ACCT,0))/SUM(NVL(T.USER_ALL_ACCT,0)) END               "+
	"                    ,2) PERMEN_4G                                                               "+
	"     ,SUM(DISTINCT  NVL(T.ALL_4G_NET,0))ALL_4G_NET                                              "+
	"     ,SUM(DISTINCT NVL(T.MOB_ACCT_NUM,0))MOB_ACCT_NUM                                           "+
	"     ,ROUND(CASE WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM,0))=0 THEN 0                              "+
	"                  ELSE SUM(DISTINCT NVL(T.ALL_4G_NET,0))/SUM(DISTINCT NVL(T.MOB_ACCT_NUM,0)) END"+
	"                    ,2) PERME_ALL_4G                                                            "+
	"FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                            ";                                                                              
	return fs;
}