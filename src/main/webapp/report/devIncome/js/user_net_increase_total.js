var field=["YYT_NAME","HQ_CHAN_CODE","OPERATE_TYPE","INNET_NUM_2G","INNET_JZ_2G","INNET_NUM_2G_CHAIN","INNET_NUM_3G","INNET_JZ_3G","INNET_NUM_3G_CHAIN","INNET_NUM_4G","INNET_JZ_4G","INNET_NUM_4G_CHAIN","INNET_NUM_NETWORK","INNET_JZ_NETWORK","INNET_NUML_NETWORK_CHAIN","INNET_NUM_NETW","INNET_JZ_NETW","INNET_NUM_NETW_CHAIN","INNET_NUM_RH","INNET_JZ_RH","INNET_NUM_RH_CHAIN","INNET_NUM_TORTAL","INNET_JZ_TORTAL","INNET_NUM_TORTAL_CHAIN"];
var title=[
			["州市","营业厅","渠道编码","经营模式","2G业务","","","3G业务","","","4G业务","","","固网","","","其中：宽带","","","其中：融合","","","合计","",""],
			["","","","","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比"]
           ];
var report=null;

$(function(){
	var dealDate = '';
	var operateType='';
	var region= $("#region").val();
	var regionCode = '';
	listRegions();
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
			var sql='';
			var where=' WHERE 1=1 ';
			var groupBy='';
			var orderBy='';
			var code='';
			var orgLevel='';
			var channelCode='';
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql="SELECT GROUP_ID_1 AS  ROW_ID,GROUP_ID_1_NAME AS  ROW_NAME,"+getSql();
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
					/*where=' AND GROUP_ID_0=\''+code+'\'';*/
					orderBy=' ORDER BY GROUP_ID_1';
				}else if(orgLevel==3){//点击市
					sql=
						"SELECT YYT_NAME AS ROW_NAME, HQ_CHAN_CODE AS ROW_ID,"+getDownSql();
						where +="  AND GROUP_ID_1 = '"+code+"' ";
						orderBy=' ORDER BY HQ_CHAN_CODE';
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql="SELECT '云南省' AS ROW_NAME,GROUP_ID_0 AS ROW_ID,"+getSql();
					groupBy=' GROUP BY GROUP_ID_0';
					orgLevel++;
				}else if(orgLevel==2||orgLevel==3){//市
					sql=" SELECT GROUP_ID_1 AS  ROW_ID,GROUP_ID_1_NAME AS  ROW_NAME,"+getSql();
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
					where +=' AND GROUP_ID_1=\''+region+'\'';
					orgLevel=3;
				}else{
					return {data:[],extra:{}};
				}
			}
			operateType=$("#operateType").val();
			regionCode = $("#regionCode").val();
			dealDate=$("#dealDate").val();
			channelCode = $("#channelCode").val();
			where +=" AND DEAL_DATE='"+dealDate+"'"
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(regionCode!=''){
				 where +=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(channelCode!=''){
				 where +=" AND HQ_CHAN_CODE = '"+channelCode+"'";
			}
			 sql+=where+groupBy+orderBy;
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

function downsAll() {
	var dealDate = $("#dealDate").val();
	var operateType=$("#operateType").val();
	var channelCode=$("#channelCode").val();
	//地市编码
	var region= $("#region").val();
	//地市选项框获取到的地市编码
	var regionCode = $("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	var where=" ";
	var sql = 	"SELECT DEAL_DATE       AS DEAL_DATE,             "+
				"       GROUP_ID_1_NAME AS GROUP_ID_1_NAME,       "+
				getDownSql()+
				" WHERE DEAL_DATE = '"+dealDate+"'           ";
	
	if(regionCode!=''){
		where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(operateType!=''){
		where+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
	}
	if(channelCode!=''){
		 where +=" AND HQ_CHAN_CODE = '"+channelCode+"'";
	}
	sql+=where;
	
	if(orgLevel==1){
		sql+=" ORDER BY T.GROUP_ID_1";
	}else{
		sql += " AND GROUP_ID_1='" + region + "' ";
	}

	var showtext = '在网用户净增统计月报表' + dealDate;
	var title=[
				["账期","州市","营业厅","渠道编码","经营模式","2G业务","","","3G业务","","","4G业务","","","固网","","","其中：宽带","","","其中：融合","","","合计","",""],
				["","","","","","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比","在网用户数","较上月净增","环比"]
	           ];
	downloadExcel(sql,title,showtext);
}


function getSql() {
	var s=	
		"       '--' AS YYT_NAME ,                                		                                                        "+
		"       '--' AS HQ_CHAN_CODE ,                            		                                                        "+
		"       '--' AS OPERATE_TYPE ,                            		                                                        "+
		"       SUM(NVL(INNET_NUM_2G, 0)) 															AS INNET_NUM_2G,            "+
		"       SUM(NVL(INNET_JZ_2G, 0)) 															AS INNET_JZ_2G,             "+
		"       PMRT.LINK_RATIO(SUM(NVL(INNET_NUM_2G, 0)),SUM(NVL(INNET_NUML_2G, 0)), 2) 			AS INNET_NUM_2G_CHAIN,      "+
		"       SUM(NVL(INNET_NUM_3G, 0)) 															AS INNET_NUM_3G,            "+
		"       SUM(NVL(INNET_JZ_3G, 0)) 															AS INNET_JZ_3G,             "+
		"       PMRT.LINK_RATIO(SUM(NVL(INNET_NUM_3G, 0)),SUM(NVL(INNET_NUML_3G, 0)), 2) 			AS INNET_NUM_3G_CHAIN,      "+
		"       SUM(NVL(INNET_NUM_4G, 0)) 															AS INNET_NUM_4G,            "+
		"       SUM(NVL(INNET_JZ_4G, 0)) 															AS INNET_JZ_4G,             "+
		"       PMRT.LINK_RATIO(SUM(NVL(INNET_NUM_4G, 0)),SUM(NVL(INNET_NUML_4G, 0)), 2) 			AS INNET_NUM_4G_CHAIN,      "+
		"       SUM(NVL(INNET_NUM_NETWORK, 0)) 														AS INNET_NUM_NETWORK,       "+
		"       SUM(NVL(INNET_JZ_NETWORK, 0)) 														AS INNET_JZ_NETWORK,        "+
		"       PMRT.LINK_RATIO(SUM(NVL(INNET_NUM_NETWORK, 0)),SUM(NVL(INNET_NUML_NETWORK, 0)),2) 	AS INNET_NUML_NETWORK_CHAIN,"+  	
		"       SUM(NVL(INNET_NUM_NETW, 0)) 														AS INNET_NUM_NETW,          "+
		"       SUM(NVL(INNET_JZ_NETW, 0)) 															AS INNET_JZ_NETW,           "+
		"       PMRT.LINK_RATIO(SUM(NVL(INNET_NUM_NETW, 0)),SUM(NVL(INNET_NUML_NETW, 0)), 2)		AS INNET_NUM_NETW_CHAIN,    "+  	
		"       SUM(NVL(INNET_NUM_RH, 0)) 															AS INNET_NUM_RH,            "+
		"       SUM(NVL(INNET_JZ_RH, 0)) 															AS INNET_JZ_RH,             "+
		"       PMRT.LINK_RATIO(SUM(NVL(INNET_NUM_RH, 0)),SUM(NVL(INNET_NUML_RH, 0)), 2) 			AS INNET_NUM_RH_CHAIN,      "+
		"       SUM(NVL(INNET_NUM_TORTAL, 0)) 														AS INNET_NUM_TORTAL,        "+
		"       SUM(NVL(INNET_JZ_TORTAL, 0)) 														AS INNET_JZ_TORTAL,         "+
		"       PMRT.LINK_RATIO(SUM(NVL(INNET_NUM_TORTAL, 0)), SUM(NVL(INNET_NUML_TORTAL, 0)),2)	AS INNET_NUM_TORTAL_CHAIN   "+ 	
		"  FROM PMRT.TB_MRT_BUS_USER_INCREASE_MON                 		                                                        ";
	return s;
}


function getDownSql(){
	var sql="       YYT_NAME        AS YYT_NAME,                      "+
				"       HQ_CHAN_CODE    AS HQ_CHAN_CODE,              "+
				"       OPERATE_TYPE    AS OPERATE_TYPE,              "+
				"       INNET_NUM_2G      AS INNET_NUM_2G,            "+
				"       INNET_JZ_2G       AS INNET_JZ_2G,             "+
				"       HB_INNET_2G       AS INNET_NUM_2G_CHAIN,      "+
				"       INNET_NUM_3G      AS INNET_NUM_3G,            "+
				"       INNET_JZ_3G       AS INNET_JZ_3G,             "+
				"       HB_INNET_3G       AS INNET_NUM_3G_CHAIN,      "+
				"       INNET_NUM_4G      AS INNET_NUM_4G,            "+
				"       INNET_JZ_4G       AS INNET_JZ_4G,             "+
				"       HB_INNET_4G       AS INNET_NUM_4G_CHAIN,      "+
				"       INNET_NUM_NETWORK AS INNET_NUM_NETWORK,       "+
				"       INNET_JZ_NETWORK  AS INNET_JZ_NETWORK,        "+
				"       HB_INNET_NETWORK  AS INNET_NUML_NETWORK_CHAIN,"+
				"       INNET_NUM_NETW    AS INNET_NUM_NETW,          "+
				"       INNET_JZ_NETW     AS INNET_JZ_NETW,           "+
				"       HB_INNET_NETW     AS INNET_NUM_NETW_CHAIN,    "+
				"       INNET_NUM_RH      AS INNET_NUM_RH,            "+
				"       INNET_JZ_RH       AS INNET_JZ_RH,             "+
				"       HB_INNET_RH       AS INNET_NUM_RH_CHAIN,      "+
				"       INNET_NUM_TORTAL  AS INNET_NUM_TORTAL,        "+
				"       INNET_JZ_TORTAL   AS INNET_JZ_TORTAL,         "+
				"       HB_INNET_TORTAL   AS INNET_NUM_TORTAL_CHAIN   "+
				"  FROM PMRT.TB_MRT_BUS_USER_INCREASE_MON   T         ";
	return sql;
}


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
            //listUnits(d[0].GROUP_ID_1);
        } else {
            h += '<option value="" selected>请选择</option>';
            for (var i = 0; i < d.length; i++) {
                h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
            }
        }
        var $area = $("#regionCode");
        var $h = $(h);
        $area.empty().append($h);
       /* $area.change(function() {
            listUnits($(this).attr('value'));
        });*/
    } else {
        alert("获取地市信息失败");
    }
}