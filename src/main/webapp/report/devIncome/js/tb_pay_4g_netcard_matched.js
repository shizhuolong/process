var field=["OPERATE_TYPE","IS_USE_DEVICE","IS_USE_4GNETWORK","EXCESS_FEE","EXCESS_VOICE","EXCESS_FLOW","FLOW_NUM"];
var title=[["组织架构","经营模式","4G终端使用占比","4G网络使用占比","套餐月费超套占比","语音套餐超套占比","流量套餐超套占比","流量包定制占比"]];
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
			//地市编码
			var regionCode=$("#regionCode").val();
			//主厅编码
			var unitCode = $.trim($("#unitCode").val());
			//渠道编码
			var channelCode =$.trim($("#channelCode").val());
			//经营模式
			var operateType = $("#operateType").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=" SELECT T.UNIT_ID AS ROW_ID,T.UNIT_NAME AS ROW_NAME"+getSql();
					groupBy=" GROUP BY  UNIT_ID ,T.UNIT_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					preField=" SELECT T.HQ_CHAN_CODE AS ROW_ID ,T.YYT_NAME  AS ROW_NAME,T.OPERATE_TYPE"+getSql();
					groupBy=" GROUP BY T.HQ_CHAN_CODE,T.YYT_NAME,T.OPERATE_TYPE";
					where+="  AND T.UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#regionNum").val();
				var orgCode=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示省
					preField=" SELECT T.GROUP_ID_1 AS ROW_ID,T.GROUP_ID_1_NAME AS ROW_NAME,'--' AS OPERATE_TYPE"+getSql();
					/*where+=" AND T.DEAL_DATE='"+qdate+"'";*/
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
				}else if(orgLevel==2){//市
					preField=" SELECT T.UNIT_ID AS ROW_ID,T.UNIT_NAME AS ROW_NAME,'--' AS OPERATE_TYPE"+getSql();
					groupBy=" GROUP BY  UNIT_ID ,T.UNIT_NAME";
					where+="  AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心 看地市
					preField=" SELECT T.HQ_CHAN_CODE AS ROW_ID ,T.YYT_NAME  AS ROW_NAME,T.OPERATE_TYPE"+getSql();
					groupBy=" GROUP BY T.HQ_CHAN_CODE,T.YYT_NAME,T.OPERATE_TYPE";
					where+="  AND T.GROUP_ID_1='"+code+"' AND T.UNIT_ID='"+orgCode+"'";
					orgLevel--;
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			where+=" AND T.DEAL_DATE='"+qdate+"'";
			if(regionCode!=''){
				where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
			}
			if(unitCode!=''){
				where+=" AND T.UNIT_ID = '"+ unitCode+"'";
			}
			if(channelCode!=''){
				where+=" AND T.HQ_CHAN_CODE = '"+ channelCode+"'";
			}
			if(operateType!=''){
				where+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
			}
			
			var sql=preField+where+groupBy+order;
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
	var regionNum = $("#regionNum").val();
	//地市编码
	var regionCode=$("#regionCode").val();
	//主厅编码
	var unitCode = $.trim($("#unitCode").val());
	//渠道编码
	var channelCode =$.trim($("#channelCode").val());
	//经营模式
	var operateType = $("#operateType").val();
	var code =$("#code").val();
	var where=" ";
	//条件
	var sql = "SELECT T.DEAL_DATE,T.GROUP_ID_1_NAME,                                                                                                             "+
			"	   T.UNIT_NAME                                                                                                                     "+
			"      ,T.YYT_NAME                																							           "+
			"      ,T.HQ_CHAN_CODE            																							           "+
			"      ,T.OPERATE_TYPE            																							           "+
			"      ,ROUND(COUNT(CASE WHEN T.IS_USE_DEVICE=1 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'    AS IS_USE_DEVICE      "+
			"      ,ROUND(COUNT(CASE WHEN T.IS_USE_4GNETWORK=1 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%' AS IS_USE_4GNETWORK   "+
			"      ,ROUND(COUNT(CASE WHEN T.EXCESS_FEE>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'       AS EXCESS_FEE         "+
			"      ,ROUND(COUNT(CASE WHEN T.EXCESS_VOICE>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'     AS EXCESS_VOICE       "+
			"      ,ROUND(COUNT(CASE WHEN T.EXCESS_FLOW>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'      AS EXCESS_FLOW    	   "+
			"      ,ROUND(COUNT(CASE WHEN T.FLOW_NUM>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'         AS FLOW_NUM		   "+
			"FROM YNPAY.TB_PAY_4G_NETCARD_MATCHED T                                                                                                 "+
			"WHERE DEAL_DATE='"+qdate+"'";
	
	if(regionCode!=''){
		where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND T.UNIT_ID = '"+ unitCode+"'";
	}
	if(channelCode!=''){
		where+=" AND T.HQ_CHAN_CODE = '"+ channelCode+"'";
	}
	if(operateType!=''){
		where+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
	}
	
	
	sql+="GROUP BY T.DEAL_DATE,T.GROUP_ID_1_NAME,T.UNIT_NAME,T.HQ_CHAN_CODE "+
		"        ,T.YYT_NAME                                    "+
		"        ,T.HQ_CHAN_CODE                                "+
		"        ,T.OPERATE_TYPE                                ";
		
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		sql+=" ORDER BY T.GROUP_ID_1_NAME";
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='" + regionNum+"'";
	}else if(orgLevel==3){
		sql+=" and T.UNIT_ID ='" + code+"'";
	}
	title=[["账期","地市名称","营服中心","营业厅名称","渠道编码","经营模式","4G终端使用占比","4G网络使用占比","套餐月费超套占比","语音套餐超套占比","流量套餐超套占比","流量包定制占比"]];
	showtext = '自有厅4G机网卡匹配营销清单-'+qdate;
	downloadExcel(sql,title,showtext);
}

function downsDetail(){
	var regionNum = $("#regionNum").val();
	//地市编码
	var regionCode=$("#regionCode").val();
	//主厅编码
	var unitCode = $.trim($("#unitCode").val());
	//渠道编码
	var channelCode =$.trim($("#channelCode").val());
	//经营模式
	var operateType = $("#operateType").val();
	var code =$("#code").val();
	var where=" ";
	//条件
	var sql = "SELECT T.DEAL_DATE,                     "+
			"       T.GROUP_ID_1_NAME,               "+
			"       T.UNIT_NAME,                     "+
			"       T.YYT_NAME,                      "+
			"       T.HQ_CHAN_CODE,                  "+
			"       T.SUBSCRIPTION_ID,               "+
			"       T.OPERATE_TYPE,                  "+
			"       T.DEVICE_NUMBER,                 "+
			"       T.IS_USE_DEVICE,                 "+
			"       T.IS_USE_4GNETWORK,              "+
			"       T.INNET_DATE,                    "+
			"       T.PRODUCT_NAME,                  "+
			"       T.EXCESS_FEE,                    "+
			"       T.EXCESS_VOICE,                  "+
			"       T.EXCESS_FLOW,                   "+
			"       T.FLOW_NUM                       "+
			"  FROM YNPAY.TB_PAY_4G_NETCARD_MATCHED T "+
			" WHERE DEAL_DATE = '"+qdate+"'          ";
			
	if(regionCode!=''){
		where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND T.UNIT_ID = '"+ unitCode+"'";
	}
	if(channelCode!=''){
		where+=" AND T.HQ_CHAN_CODE = '"+ channelCode+"'";
	}
	if(operateType!=''){
		where+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		sql+=" ORDER BY T.GROUP_ID_1_NAME";
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='" + regionNum+"'";
	}else if(orgLevel==3){
		sql+=" and T.UNIT_ID ='" + code+"'";
	}
	title=[["账期","地市名称","营服中心","营业厅名称","渠道编码","用户编码","经营模式","用户号码","4G终端是否使用","4G网络是否使用","入网时间","使用套餐","套餐月费超套额度","语音套餐超套额度","流量套餐超套额度","流量包定制数"]];
	showtext = '自有厅4G机网卡匹配营销清单(明细)-'+qdate;
	downloadExcel(sql,title,showtext);
}

/****
 * 查询地市
 */
function listRegions(){
    var sql=" SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE  T WHERE 1=1 ";
    var orgLevel=$("#orgLevel").val();
    var code=$("#code").val();
    var region =$("#regionNum").val();
    if(orgLevel==1){
        sql+="";
    }else if(orgLevel==2){
        sql+=" and T.GROUP_ID_1='"+code+"'";
    }else{
        sql+=" and T.GROUP_ID_1='"+region+"'";
    }
    sql+=" ORDER BY T.GROUP_ID_1"
    var d=query(sql);
    if (d) {
        var h = '';
        if (d.length == 1) {
            h += '<option value="' + d[0].GROUP_ID_1
                    + '" selected >'
                    + d[0].GROUP_ID_1_NAME + '</option>';
            listUnits(d[0].GROUP_ID_1);
        } else {
            h += '<option value="" selected>请选择</option>';
            for (var i = 0; i < d.length; i++) {
                h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
            }
        }
        var $area = $("#regionCode");
        var $h = $(h);
        $area.empty().append($h);
        $area.change(function() {
            listUnits($(this).attr('value'));
        });
    } else {
        alert("获取地市信息失败");
    }
}

/************查询营服中心***************/
function listUnits(region){
    var $unit=$("#unitCode");
    var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1 ";
    if(region!=''){
        sql+=" AND T.GROUP_ID_1='"+region+"' ";
        //权限
        var orgLevel=$("#orgLevel").val();
        var code=$("#code").val();
        /**查询营服中心编码条件是有地市编码，***/
        if(orgLevel==3){
            sql+=" and t.UNIT_ID='"+code+"'";
        }else if(orgLevel==4){
            sql+=" AND 1=2";
        }else{
        }
    }else{
        $unit.empty().append('<option value="" selected>请选择</option>');
        return;
    }

    sql+=" ORDER BY T.UNIT_ID"
    var d=query(sql);
    if (d) {
        var h = '';
        if (d.length == 1) {
            h += '<option value="' + d[0].UNIT_ID
                    + '" selected >'
                    + d[0].UNIT_NAME + '</option>';
        } else {
            h += '<option value="" selected>请选择</option>';
            for (var i = 0; i < d.length; i++) {
                h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME + '</option>';
            }
        }

        var $h = $(h);
        $unit.empty().append($h);
    } else {
        alert("获取基层单元信息失败");
    }
}
function getSql(){
	var s=",ROUND(COUNT(CASE WHEN T.IS_USE_DEVICE=1 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'     AS IS_USE_DEVICE    "+
		",ROUND(COUNT(CASE WHEN T.IS_USE_4GNETWORK=1 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'  AS IS_USE_4GNETWORK "+
		",ROUND(COUNT(CASE WHEN T.EXCESS_FEE>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'        AS EXCESS_FEE       "+
		",ROUND(COUNT(CASE WHEN T.EXCESS_VOICE>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'      AS EXCESS_VOICE     "+
		",ROUND(COUNT(CASE WHEN T.EXCESS_FLOW>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'       AS EXCESS_FLOW      "+
		",ROUND(COUNT(CASE WHEN T.FLOW_NUM>0 THEN SUBSCRIPTION_ID END)*100/COUNT(SUBSCRIPTION_ID),2) ||'%'          AS FLOW_NUM         "+
		" FROM YNPAY.TB_PAY_4G_NETCARD_MATCHED T ";
	return s;
}
