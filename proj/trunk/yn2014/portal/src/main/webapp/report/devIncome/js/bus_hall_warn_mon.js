var field=["HQ_CHAN_CODE","OPERATE_TYPE","MOB_LEAVE_NUM","NET_LEAVE_NUM","MOB_PHONE_ACCT_NUM","MOB_PHONE_ACCT_ZB"];
var title=[["组织架构","营业厅编码","经营模式","移网流失用户数","宽带离网用户数","移网手机出账用户数","移网手机出账合约用户数占比"]];
var report=null;
var qdate="";
var orderBy="";
$(function(){
	 listRegions();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		/*lock:1,*/
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
				if(orgLevel==2){
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					order=" ORDER BY T.GROUP_ID_1";
				}else if(orgLevel==3){
					preField=" T.BUS_NAME ROW_NAME,T.HQ_CHAN_CODE ROW_ID,T.HQ_CHAN_CODE HQ_CHAN_CODE,T.OPERATE_TYPE OPERATE_TYPE,";
					groupBy=" GROUP BY T.HQ_CHAN_CODE,T.BUS_NAME,T.OPERATE_TYPE";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					order=" ORDER BY T.HQ_CHAN_CODE";
				}else if(orgLevel==4){
					preField=" T.BUS_NAME ROW_NAME,T.HQ_CHAN_CODE ROW_ID,T.HQ_CHAN_CODE HQ_CHAN_CODE,T.OPERATE_TYPE OPERATE_TYPE,";
					groupBy=" GROUP BY T.HQ_CHAN_CODE,T.BUS_NAME,T.OPERATE_TYPE";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					order=" ORDER BY T.HQ_CHAN_CODE";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#regionCode").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示省
					preField=" '云南省' ROW_NAME,'86000' ROW_ID,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,";
				}else if(orgLevel==2){//市
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心 看地市
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,";
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
	var preField=' T.DEAL_DATE,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.BUS_NAME,T.OPERATE_TYPE,';
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE";
	var groupBy=" GROUP BY T.DEAL_DATE,T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.BUS_NAME,T.OPERATE_TYPE";
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
	showtext = '营业厅离网预警用户统计报表' + qdate;
	var title=[["账期","地市","营业厅编码","营业厅名称","经营模式","移网流失用户数","宽带离网用户数","移网手机出账用户数","移网手机出账合约用户数占比"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function downsDetail() {
	var sql="SELECT DEAL_DATE,GROUP_ID_1_NAME,HQ_CHAN_CODE,BUS_NAME,SUBSCRIPTION_ID,DEVICE_NUMBER,NET_TYPE,USER_NAME,INNET_DATE,PRODUCT_NAME,INCOME_NUM,USER_TYPE,SCHEME_NAME,FLOW_NAME FROM PMRT.TB_MRT_BUS_HALL_LAST_PERSON T";
	var code = $("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	var regionName=$("#regionName").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var where=" WHERE 1=1";
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
		where+=" AND T.GROUP_ID_1_NAME LIKE '%"+regionName+"%'";
	}
	if(hq_chan_code!=''){
		where+=" AND T.HQ_CHAN_CODE = '"+hq_chan_code+"'";
	}
	sql += where+" ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE";
	showtext = '营业厅离网预警用户统计明细' + qdate;
	var title=[["账期","地市名称","营业厅编码","营业厅名称","用户编码","用户名称","网别","用户姓名","入网时间","套餐名称","收入","用户类型","合约名称","订购流量包"]];
	downloadExcel(sql,title,showtext);
}
function listRegions(){
	var sql="";
	//条件
	var sql = "SELECT DISTINCT t.GROUP_ID_1_NAME FROM PMRT.TB_MRT_BUS_HALL_WARN_MON t where 1=1 ";
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
	var fs = " SUM(NVL(T.MOB_LEAVE_NUM,0))MOB_LEAVE_NUM,                                                                "+
	"       SUM(NVL(T.NET_LEAVE_NUM,0))NET_LEAVE_NUM,                                                                   "+
	"       SUM(NVL(T.MOB_PHONE_ACCT_NUM,0))MOB_PHONE_ACCT_NUM,                                                         "+
	"       TRIM('.'FROM TO_CHAR(CASE WHEN SUM(NVL(MOB_ACCT_NUM,0))<>0                                                  "+
	"                                             THEN SUM(NVL(MOB_PHONE_ACCT_NUM,0))/SUM(NVL(MOB_ACCT_NUM,0))ELSE 0 END"+
	"                                               ,'FM999990.99')) MOB_PHONE_ACCT_ZB                                  "+
	"FROM PMRT.TB_MRT_BUS_HALL_WARN_MON T                                                                               ";  
	return fs;
}