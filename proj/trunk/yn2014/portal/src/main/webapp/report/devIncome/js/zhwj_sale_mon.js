var field=["HALL_ID","OPERATE_TYPE","BIND_NUMBER","SYSTEM_NAME","ZHWJ_NUM"];
var title=[["组织架构","主厅编码","经营模式","捆绑号码","系统标识","智慧沃家销量"]];
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
			//经营模式
			var operateType = $("#operateType").val();
			//主厅编码
			var hallId = $.trim($("#hallId").val());
			//捆绑号码
			var bandNumber = $.trim($("#bandNumber").val());
			//系统标识
			var systemName = $("#systemName").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HALL_ID,'--' OPERATE_TYPE,'--' BIND_NUMBER,'--' SYSTEM_NAME,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					order=" ORDER BY T.GROUP_ID_1";
				}else if(orgLevel==3){
					preField=" T.BUS_NAME ROW_NAME,T.HALL_ID ROW_ID,T.HALL_ID HALL_ID,T.OPERATE_TYPE OPERATE_TYPE,'--' BIND_NUMBER,'--' SYSTEM_NAME,";
					groupBy=" GROUP BY T.HALL_ID,T.BUS_NAME,T.OPERATE_TYPE";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					order=" ORDER BY T.HALL_ID";
				}else if(orgLevel==4){
					preField=" T.BUS_NAME ROW_NAME,T.HALL_ID HALL_ID,T.OPERATE_TYPE OPERATE_TYPE,T.BIND_NUMBER BIND_NUMBER,T.SYSTEM_NAME SYSTEM_NAME,";
					groupBy=" GROUP BY T.HALL_ID,T.BUS_NAME,T.OPERATE_TYPE,T.BIND_NUMBER,T.SYSTEM_NAME";
					where+=" AND T.HALL_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#regionCode").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示省
					preField=" '云南省' ROW_NAME,'86000' ROW_ID,'--' HALL_ID,'--' BUS_NAME,'--' OPERATE_TYPE,'--' BIND_NUMBER,'--' SYSTEM_NAME,";
				}else if(orgLevel==2){//市
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HALL_ID,'--' BUS_NAME,'--' OPERATE_TYPE,'--' BIND_NUMBER,'--' SYSTEM_NAME,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心 看地市
					preField=" T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HALL_ID,'--' BUS_NAME,'--' OPERATE_TYPE,'--' BIND_NUMBER,'--' SYSTEM_NAME,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					orgLevel--;
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			where+=" AND T.DEAL_DATE='"+qdate+"'";
			if(regionName!=''){
				where+=" AND T.GROUP_ID_1_NAME = '"+regionName+"'";
			}
			if(operateType!=''){
				where+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
			}
			if(hallId!=''){
				where+=" AND T.HALL_ID = '"+ hallId+"'";
			}
			if(bandNumber!=''){
				where+=" AND T.BIND_NUMBER = '"+ bandNumber+"'";
			}
			if(systemName!=''){
				where+=" AND T.SYSTEM_NAME = '"+ systemName+"'";
			}
			var sql='SELECT '+preField+"COUNT(1) ZHWJ_NUM FROM PMRT.TB_MRT_BUS_HALL_ZHWJ_SALE_MON T"+where+groupBy+order;
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
	var code =$("#regionCode").val();
	var regionName = $("#regionName").val();
	//经营模式
	var operateType = $("#operateType").val();
	//主厅编码
	var hallId = $.trim($("#hallId").val());
	//捆绑号码
	var bandNumber = $.trim($("#bandNumber").val());
	//系统标识
	var systemName = $("#systemName").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ='"+qdate+"'";
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(operateType!=''){
		sql+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
	}
	if(hallId!=''){
		sql+=" AND T.HALL_ID = '"+ hallId+"'";
	}
	if(bandNumber!=''){
		sql+=" AND T.BIND_NUMBER = '"+ bandNumber+"'";
	}
	if(systemName!=''){
		sql+=" AND T.SYSTEM_NAME = '"+ systemName+"'";
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else{
		sql+=" and T.GROUP_ID_1 =" + code;
	}
	title=[["账期","地市名称","主厅编码","下挂厅编码","营业厅名称","经营模式","用户标识","虚拟号码","捆绑号码","用户名称","客户地址","联系方式","套餐","入网时间","离网时间","局站","接入方式","宽带速率","办理产品ID","办理产品名称","产品说明","办理时间","系统标识(BS/CB)"]];
	showtext = '营业厅智慧沃家营销清单-'+qdate;
	downloadExcel(sql,title,showtext);
}
function listRegions(){
	var sql="";
	//条件
	var sql = "SELECT DISTINCT t.GROUP_ID_1_NAME FROM PMRT.TB_MRT_BUS_HALL_ZHWJ_SALE_MON t where 1=1 ";
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
function getSql(){
	var s="SELECT T.DEAL_DATE,                         "+
			"       T.GROUP_ID_1_NAME,                   "+
			"       T.HALL_ID,                           "+
			"       T.HQ_CHAN_CODE,                      "+
			"       T.BUS_NAME,                          "+
			"       T.OPERATE_TYPE,                      "+
			"       T.SUBSCRIPTION_ID,                   "+
			"       T.VIRTUAL_ID,                        "+
			"       T.BIND_NUMBER,                       "+
			"       T.USER_NAME,                         "+
			"       T.USER_ADDRES,                       "+
			"       T.DEVICE_NUMBER,                     "+
			"       T.PRODUCT_NAME,                      "+
			"       T.INNER_DATE,                        "+
			"       T.INACTIVE_TIME,                     "+
			"       T.BUREAU_ID,                         "+
			"       T.JOIN_TYPE,                         "+
			"       T.SPEED_NUM,                         "+
			"       T.PRODUCT_ID,                        "+
			"       T.PRODUCT_NAME1,                     "+
			"       T.PRODUCT_DESC,                      "+
			"       T.ACCEPR_DATE,                       "+
			"       T.SYSTEM_NAME                        "+
			"  FROM PMRT.TB_MRT_BUS_HALL_ZHWJ_SALE_MON T ";
	return s;
}
