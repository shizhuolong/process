var field=["OPERATE_TYPE","HQ_CHAN_CODE","ZL_INCOME_2G","CL_INCOME_2G","ZL_INCOME_3G","CL_INCOME_3G","ZL_INCOME_4G","CL_INCOME_4G","ZL_INCOME_NETWORK","CL_INCOME_NETWORK","ZL_INCOME_NETW","CL_INCOME_NETW","ZL_INCOME_RH","CL_INCOME_RH","ZL_INCOME_TOTAL","CL_INCOME_TOTAL","ZL_INCOME_2G_ADD","CL_INCOME_2G_ADD","ZL_INCOME_3G_ADD","CL_INCOME_3G_ADD","ZL_INCOME_4G_ADD","CL_INCOME_4G_ADD","ZL_INCOME_NETWORK_ADD","CL_INCOME_NETWORK_ADD","ZL_INCOME_NETW_ADD","CL_INCOME_NETW_ADD","ZL_INCOME_RH_ADD","CL_INCOME_RH_ADD","ZL_INCOME_TOTAL_ADD","CL_INCOME_TOTAL_ADD"];
var title=[
			["组织架构","经营模式","渠道编码","本月","","","","","","","","","","","","","","截止本月累计值","","","","","","","","","","","","",""],
			["","","","2G业务","","3G业务","","4G业务","","固网","","其中：宽带","","其中：融合","","合计","","2G业务","","3G业务","","4G业务","","固网","","其中：宽带","","其中：融合","","合计","",""],
			["","","","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量"]
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
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql="SELECT GROUP_ID_1 AS  ROW_ID,GROUP_ID_1_NAME AS  ROW_NAME,"+getSql();
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
					/*where=' AND GROUP_ID_0=\''+code+'\'';*/
					orderBy=' ORDER BY GROUP_ID_1';
				}else if(orgLevel==3){//点击市
					
					sql=" SELECT YYT_NAME              AS ROW_NAME,  "+
						"        '--'          		   AS ROW_ID,    "+
						"        HQ_CHAN_CODE          			,    "+
						"        OPERATE_TYPE,                       "+
						"        ZL_INCOME_2G,                       "+
						"        CL_INCOME_2G,                       "+
						"        ZL_INCOME_3G,                       "+
						"        CL_INCOME_3G,                       "+
						"        ZL_INCOME_4G,                       "+
						"        CL_INCOME_4G,                       "+
						"        ZL_INCOME_NETWORK,                  "+
						"        CL_INCOME_NETWORK,                  "+
						"        ZL_INCOME_NETW,                     "+
						"        CL_INCOME_NETW,                     "+
						"        ZL_INCOME_RH,                       "+
						"        CL_INCOME_RH,                       "+
						"        ZL_INCOME_TOTAL,                    "+
						"        CL_INCOME_TOTAL,                    "+
						"        ZL_INCOME_2G_ADD,                   "+
						"        CL_INCOME_2G_ADD,                   "+
						"        ZL_INCOME_3G_ADD,                   "+
						"        CL_INCOME_3G_ADD,                   "+
						"        ZL_INCOME_4G_ADD,                   "+
						"        CL_INCOME_4G_ADD,                   "+
						"        ZL_INCOME_NETWORK_ADD,              "+
						"        CL_INCOME_NETWORK_ADD,              "+
						"        ZL_INCOME_NETW_ADD,                 "+
						"        CL_INCOME_NETW_ADD,                 "+
						"        ZL_INCOME_RH_ADD,                   "+
						"        CL_INCOME_RH_ADD,                   "+
						"        ZL_INCOME_TOTAL_ADD,                "+
						"        CL_INCOME_TOTAL_ADD                 "+
						"   FROM PMRT.TB_MRT_BUS_HALL_CLINCOME_MON   ";
						
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
			where +=" AND DEAL_DATE='"+dealDate+"'"
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(regionCode!=''){
				 where +=" AND GROUP_ID_1='"+regionCode+"'";
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

function getSql() {
	var s=	"		'--' AS OPERATE_TYPE,"+
			"		'--' AS HQ_CHAN_CODE,"+
			"       SUM(NVL(ZL_INCOME_2G, 0)) AS ZL_INCOME_2G,                      "+
			"       SUM(NVL(CL_INCOME_2G, 0)) AS CL_INCOME_2G,                      "+
			"       SUM(NVL(ZL_INCOME_3G, 0)) AS ZL_INCOME_3G,                      "+
			"       SUM(NVL(CL_INCOME_3G, 0)) AS CL_INCOME_3G,                      "+
			"       SUM(NVL(ZL_INCOME_4G, 0)) AS ZL_INCOME_4G,                      "+
			"       SUM(NVL(CL_INCOME_4G, 0)) AS CL_INCOME_4G,                      "+
			"       SUM(NVL(ZL_INCOME_NETWORK, 0)) AS ZL_INCOME_NETWORK,            "+
			"       SUM(NVL(CL_INCOME_NETWORK, 0)) AS CL_INCOME_NETWORK,            "+
			"       SUM(NVL(ZL_INCOME_NETW, 0)) AS ZL_INCOME_NETW,                  "+
			"       SUM(NVL(CL_INCOME_NETW, 0)) AS CL_INCOME_NETW,                  "+
			"       SUM(NVL(ZL_INCOME_RH, 0)) AS ZL_INCOME_RH,                      "+
			"       SUM(NVL(CL_INCOME_RH, 0)) AS CL_INCOME_RH,                      "+
			"       SUM(NVL(ZL_INCOME_TOTAL, 0)) AS ZL_INCOME_TOTAL,                "+
			"       SUM(NVL(CL_INCOME_TOTAL, 0)) AS CL_INCOME_TOTAL,                "+
			"       SUM(NVL(ZL_INCOME_2G_ADD, 0)) AS ZL_INCOME_2G_ADD,              "+
			"       SUM(NVL(CL_INCOME_2G_ADD, 0)) AS CL_INCOME_2G_ADD,              "+
			"       SUM(NVL(ZL_INCOME_3G_ADD, 0)) AS ZL_INCOME_3G_ADD,              "+
			"       SUM(NVL(CL_INCOME_3G_ADD, 0)) AS CL_INCOME_3G_ADD,              "+
			"       SUM(NVL(ZL_INCOME_4G_ADD, 0)) AS ZL_INCOME_4G_ADD,              "+
			"       SUM(NVL(CL_INCOME_4G_ADD, 0)) AS CL_INCOME_4G_ADD,              "+
			"       SUM(NVL(ZL_INCOME_NETWORK_ADD, 0)) AS ZL_INCOME_NETWORK_ADD,    "+
			"       SUM(NVL(CL_INCOME_NETWORK_ADD, 0)) AS CL_INCOME_NETWORK_ADD,    "+
			"       SUM(NVL(ZL_INCOME_NETW_ADD, 0)) AS ZL_INCOME_NETW_ADD,          "+
			"       SUM(NVL(CL_INCOME_NETW_ADD, 0)) AS CL_INCOME_NETW_ADD,          "+
			"       SUM(NVL(ZL_INCOME_RH_ADD, 0)) AS ZL_INCOME_RH_ADD,              "+
			"       SUM(NVL(CL_INCOME_RH_ADD, 0)) AS CL_INCOME_RH_ADD,              "+
			"       SUM(NVL(ZL_INCOME_TOTAL_ADD, 0)) AS ZL_INCOME_TOTAL_ADD,        "+
			"       SUM(NVL(CL_INCOME_TOTAL_ADD, 0)) AS CL_INCOME_TOTAL_ADD         "+
			"  FROM PMRT.TB_MRT_BUS_HALL_CLINCOME_MON                               ";
	return s;
}

function downsAll() {
	var dealDate = $("#dealDate").val();
	var operateType=$("#operateType").val();
	
	//地市编码
	var region= $("#region").val();
	//地市选项框获取到的地市编码
	var regionCode = $("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	var where=" ";
	var sql = 	"SELECT DEAL_DATE,                           "+
				"       GROUP_ID_1_NAME,                     "+
				"       YYT_NAME,                            "+
				"       HQ_CHAN_CODE,                        "+
				"       OPERATE_TYPE,                        "+
				"       ZL_INCOME_2G,                        "+
				"       CL_INCOME_2G,                        "+
				"       ZL_INCOME_3G,                        "+
				"       CL_INCOME_3G,                        "+
				"       ZL_INCOME_4G,                        "+
				"       CL_INCOME_4G,                        "+
				"       ZL_INCOME_NETWORK,                   "+
				"       CL_INCOME_NETWORK,                   "+
				"       ZL_INCOME_NETW,                      "+
				"       CL_INCOME_NETW,                      "+
				"       ZL_INCOME_RH,                        "+
				"       CL_INCOME_RH,                        "+
				"       ZL_INCOME_TOTAL,                     "+
				"       CL_INCOME_TOTAL,                     "+
				"       ZL_INCOME_2G_ADD,                    "+
				"       CL_INCOME_2G_ADD,                    "+
				"       ZL_INCOME_3G_ADD,                    "+
				"       CL_INCOME_3G_ADD,                    "+
				"       ZL_INCOME_4G_ADD,                    "+
				"       CL_INCOME_4G_ADD,                    "+
				"       ZL_INCOME_NETWORK_ADD,               "+
				"       CL_INCOME_NETWORK_ADD,               "+
				"       ZL_INCOME_NETW_ADD,                  "+
				"       CL_INCOME_NETW_ADD,                  "+
				"       ZL_INCOME_RH_ADD,                    "+
				"       CL_INCOME_RH_ADD,                    "+
				"       ZL_INCOME_TOTAL_ADD,                 "+
				"       CL_INCOME_TOTAL_ADD                  "+
				"  FROM PMRT.TB_MRT_BUS_HALL_CLINCOME_MON T  "+
				" WHERE DEAL_DATE = '"+dealDate+"'           ";
	
	if(regionCode!=''){
		where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	
	/*if(channelCode!=''){
		where+=" AND T.HALL_ID = '"+ channelCode+"'";
	}*/
	if(operateType!=''){
		where+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
	}
	
	sql+=where;
	
	if(orgLevel==1){
		sql+=" ORDER BY T.GROUP_ID_1";
	}else{
		sql += " AND GROUP_ID_1='" + region + "' ";
	}

	var showtext = '自有营业厅增存量收入统计月报表' + dealDate;
	var title=[
				["账期","地市","营业厅名称","渠道编码","经营模式","本月","","","","","","","","","","","","","","截止本月累计值","","","","","","","","","","","","",""],
				["","","","","","2G业务","","3G业务","","4G业务","","固网","","其中：宽带","","其中：融合","","合计","","2G业务","","3G业务","","4G业务","","固网","","其中：宽带","","其中：融合","","合计","",""],
				["账期","地市","营业厅名称","渠道编码","经营模式","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量","增量","存量"]
	           ];
	downloadExcel(sql,title,showtext);
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