var title;
var field;
var startDate="";
var endDate="";
var regionName="";
var operateType="";
var sumSql="";
$(function(){
	listRegions();
	search();
	$("#searchBtn").click(function(){
		$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		search();
	});
});
function search(){
	startDate=$("#startDate").val();
	endDate=$("#endDate").val();
	if(startDate==endDate){
		title=[["组织架构","经营模式","移动网发展","","","固网发展","","","移动网+固网发展","","","其中智慧沃家发展","","","其中七彩流量日租卡发展量","",""],
		       ["","","当日","本月累计","累计环比","当日","本月累计","累计环比","当日","本月累计","累计环比","当日","本月累计","累计环比","当日","本月累计","占发展比"]];
		field=["OPERATE_TYPE","THIS_YW_NUM","THIS_YW_NUM1","HB1_THIS_YW","THIS_NET_NUM","THIS_NET_NUM1","HB1_THIS_NET","THIS_YWGW_NUM","THIS_YWGW_NUM1","HB1_THIS_YWGW","THIS_ZHWJ_NUM","THIS_ZHWJ_NUM1","HB1_THIS_ZHWJ","THIS_QC_NUM","THIS_QC_NUM1","ZB_QC"];
	    sumSql=getSumSql();
	}else{
		title=[["组织架构","经营模式","移动网发展","","固网发展","","移动网+固网发展","","其中智慧沃家发展","","其中七彩流量日租卡发展量",""],
		       ["","","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","占发展比"]];
		field=["OPERATE_TYPE","THIS_YW_NUM","HB1_THIS_YW","THIS_NET_NUM","HB1_THIS_NET","THIS_YWGW_NUM","HB1_THIS_YWGW","THIS_ZHWJ_NUM","HB1_THIS_ZHWJ","THIS_QC_NUM","ZB_QC"];
		sumSql=getSumSql1();
	}
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
			var regionCode =$("#regionCode").val();
			var chnlCode = $("#chnlCode").val();
			regionName=$("#regionName").val();
			operateType=$("#operateType").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=' T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,\'--\' AS OPERATE_TYPE,';
					groupBy=' GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ';
				}else if(orgLevel==3){//点击市
					preField=' T1.BUS_HALL_NAME ROW_NAME,OPERATE_TYPE AS OPERATE_TYPE,';
					groupBy=' GROUP BY T1.BUS_HALL_NAME ,T1.OPERATE_TYPE';
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
					preField=' \'云南省 \' ROW_NAME,\'86000\' ROW_ID,\'--\' AS OPERATE_TYPE,';
					groupBy=' GROUP BY T1.GROUP_ID_0';
					orgLevel=2;
				}else if(orgLevel==2){//市
					preField=' T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,\'--\' AS OPERATE_TYPE,';
					groupBy=' GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ';
					where=' AND T1.GROUP_ID_1=\''+code+'\'';
					orgLevel=3;
				}else if(orgLevel==3){
					preField=' T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,\'--\' AS OPERATE_TYPE,';
					groupBy=' GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ';
					where=' AND T1.GROUP_ID_1=\''+regionCode+'\'';
					orgLevel=3;
				}else{

					return {data:[],extra:{}};
				}
			}
			if(regionName!=""){
				where+=" AND T1.GROUP_ID_1_NAME='"+regionName+"' ";
			}
			if(operateType!=""){
				where+=" AND T1.OPERATE_TYPE='"+operateType+"' ";
			}
			if(chnlCode!=""){
				where += " AND T1.HQ_CHAN_CODE ='"+chnlCode+"' ";
			}
			var sql='SELECT'+preField+sumSql+where+groupBy;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	
}
function getSumSql() {
	var s=
		"       SUM(NVL(T1.THIS_YW_NUM, 0)) THIS_YW_NUM, 																"+	//--当日移网发展
		"       SUM(NVL(T1.THIS_YW_NUM1, 0)) THIS_YW_NUM1,															 	"+	//--本月移网发展累计
		"       PODS.GET_RADIX_POINT(CASE                                                                               "+	//
		"                              WHEN SUM(NVL(T1.LAST_YW_NUM1, 0)) <> 0 THEN                                      "+	//
		"                               (SUM(NVL(T1.THIS_YW_NUM1, 0)) - SUM(NVL(T1.LAST_YW_NUM1, 0))) * 100 /           "+	//
		"                               SUM(NVL(T1.LAST_YW_NUM1, 0))                                                    "+	//
		"                              ELSE                                                                             "+	//
		"                               0                                                                               "+	//
		"                            END || '%',                                                                        "+	//
		"                            2) HB1_THIS_YW, 																	"+	//--移网发展累计环比
		"       SUM(NVL(T1.THIS_NET_NUM, 0)) THIS_NET_NUM, 																"+	//--当日固网发展
		"       SUM(NVL(T1.THIS_NET_NUM1, 0)) THIS_NET_NUM1, 															"+	//--本月固网发展累计
		"       PODS.GET_RADIX_POINT(CASE                                                                               "+	//
		"                              WHEN SUM(NVL(T1.LAST_NET_NUM1, 0)) <> 0 THEN                                     "+	//
		"                               (SUM(NVL(T1.THIS_NET_NUM1, 0)) - SUM(NVL(T1.LAST_NET_NUM1, 0))) * 100 /         "+	//
		"                               SUM(NVL(T1.LAST_NET_NUM1, 0))                                                   "+	//
		"                              ELSE                                                                             "+	//
		"                               0                                                                               "+	//
		"                            END || '%',                                                                        "+	//
		"                            2) HB1_THIS_NET, 																	"+	//--固网发展累计环比
		"       SUM(NVL(T1.THIS_YWGW_NUM, 0)) THIS_YWGW_NUM, 															"+	//--当日移网+固网发展
		"       SUM(NVL(T1.THIS_YWGW_NUM1, 0)) THIS_YWGW_NUM1, 															"+	//--本月移网+固网发展累计
		"       PODS.GET_RADIX_POINT(CASE                                                                               "+	//
		"                              WHEN SUM(NVL(T1.LAST_YWGW_NUM1, 0)) <> 0 THEN                                    "+	//
		"                               (SUM(NVL(T1.THIS_YWGW_NUM1, 0)) - SUM(NVL(T1.LAST_YWGW_NUM1, 0))) * 100 /       "+	//
		"                               SUM(NVL(T1.LAST_YWGW_NUM1, 0))                                                  "+	//
		"                              ELSE                                                                             "+	//
		"                               0                                                                               "+	//
		"                            END || '%',                                                                        "+	//
		"                            2) HB1_THIS_YWGW, 																	"+	//--移网+固网发展累计环比             
		"       SUM(NVL(T1.THIS_ZHWJ_NUM, 0)) THIS_ZHWJ_NUM, 															"+	//--当日移网发展
		"       SUM(NVL(T1.THIS_ZHWJ_NUM1, 0)) THIS_ZHWJ_NUM1, 															"+	//--本月移网发展累计
		"       PODS.GET_RADIX_POINT(CASE                                                                               "+	//
		"                              WHEN SUM(NVL(T1.LAST_ZHWJ_NUM1, 0)) <> 0 THEN                                    "+	//
		"                               (SUM(NVL(T1.THIS_ZHWJ_NUM1, 0)) - SUM(NVL(T1.LAST_ZHWJ_NUM1, 0))) * 100 /       "+	//
		"                               SUM(NVL(T1.LAST_ZHWJ_NUM1, 0))                                                  "+	//
		"                              ELSE                                                                             "+	//
		"                               0                                                                               "+	//
		"                            END || '%',                                                                        "+	//
		"                            2) HB1_THIS_ZHWJ, 																	"+	//--移网发展累计环比
		"       SUM(NVL(T1.THIS_QC_NUM, 0)) THIS_QC_NUM, 																"+	//--七彩流量日租卡发展量
		"       SUM(NVL(T1.THIS_QC_NUM1, 0)) THIS_QC_NUM1, 																"+	//--七彩流量日租卡本月累计发展量
		"       PODS.GET_RADIX_POINT(CASE                                                                               "+	//
		"                              WHEN SUM(NVL(T1.THIS_YWGW_NUM1, 0)) <> 0 THEN                                    "+	//
		"                               SUM(NVL(THIS_QC_NUM, 0)) * 100 / SUM(NVL(T1.THIS_YWGW_NUM1, 0))                 "+	//
		"                              ELSE                                                                             "+	//
		"                               0                                                                               "+	//
		"                            END || '%',                                                                        "+	//
		"                            2) ZB_QC                                                                           "+	//
		"  FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY T1                                                                         "+	//
		" WHERE T1.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                                                  ";	//

	return s;
}

function getSumSql1() {
	var s=
		"       SUM(NVL(T1.THIS_YW_NUM, 0)) THIS_YW_NUM,                   															"+		//--当日移网发展
		"       PODS.GET_RADIX_POINT(CASE                                                                                           "+		//
		"                      WHEN SUM(NVL(T1.LAST_YW_NUM, 0)) <> 0 THEN                                                           "+		//
		"                       (SUM(NVL(T1.THIS_YW_NUM, 0))-SUM(NVL(T1.LAST_YW_NUM, 0))) * 100 /SUM(NVL(T1.LAST_YW_NUM, 0))        "+		//
		"                      ELSE                                                                                                 "+		//
		"                       0                                                                                                   "+		//
		"                    END || '%',2)  HB1_THIS_YW,                                                                            "+		//--移网发展累计环比
		"       SUM(NVL(T1.THIS_NET_NUM, 0)) THIS_NET_NUM,                                                                          "+		//--当日固网发展
		"                                                                                                                           "+		//
		"       PODS.GET_RADIX_POINT(CASE                                                                                           "+		//
		"                      WHEN SUM(NVL(T1.LAST_NET_NUM, 0)) <> 0 THEN                                                          "+		//
		"                       (SUM(NVL(T1.THIS_NET_NUM, 0))-SUM(NVL(T1.LAST_NET_NUM, 0))) * 100 /SUM(NVL(T1.LAST_NET_NUM, 0))     "+		//
		"                      ELSE                                                                                                 "+		//
		"                       0                                                                                                   "+		//
		"                    END || '%',2)  HB1_THIS_NET,                                                                           "+		//--固网发展累计环比
		"       SUM(NVL(T1.THIS_YWGW_NUM, 0)) THIS_YWGW_NUM,                   														"+		//--当日移网+固网发展
		"                                                                                                                           "+		//
		"       PODS.GET_RADIX_POINT(CASE                                                                                           "+		//
		"                      WHEN SUM(NVL(T1.LAST_YWGW_NUM, 0)) <> 0 THEN                                                         "+		//
		"                       (SUM(NVL(T1.THIS_YWGW_NUM, 0))-SUM(NVL(T1.LAST_YWGW_NUM, 0))) * 100 /SUM(NVL(T1.LAST_YWGW_NUM, 0))  "+		//
		"                      ELSE                                                                                                 "+		//
		"                       0                                                                                                   "+		//
		"                    END || '%',2)  HB1_THIS_YWGW,                                                               			"+		//--移网+固网发展累计环比             
		"       SUM(NVL(T1.THIS_ZHWJ_NUM, 0)) THIS_ZHWJ_NUM,                  														"+		//--当日移网发展
		"                                                                                                                           "+		//
		"       PODS.GET_RADIX_POINT(CASE                                                                                           "+		//
		"                      WHEN SUM(NVL(T1.LAST_ZHWJ_NUM, 0)) <> 0 THEN                                                         "+		//
		"                       (SUM(NVL(T1.THIS_ZHWJ_NUM, 0))-SUM(NVL(T1.LAST_ZHWJ_NUM, 0))) * 100 /SUM(NVL(T1.LAST_ZHWJ_NUM, 0))  "+		//
		"                      ELSE                                                                                                 "+		//
		"                       0                                                                                                   "+		//
		"                    END || '%',2)  HB1_THIS_ZHWJ,                                                                    		"+		//--移网发展累计环比
		"       SUM(NVL(T1.THIS_QC_NUM, 0))  THIS_QC_NUM,                                                                           "+		//--七彩流量日租卡发展量
		"                                                                                                                           "+		//
		"       PODS.GET_RADIX_POINT(CASE                                                                                           "+		//
		"                      WHEN SUM(NVL(T1.THIS_YWGW_NUM, 0)) <> 0 THEN                                                         "+		//
		"                        SUM(NVL(THIS_QC_NUM,0))* 100 /SUM(NVL(T1.THIS_YWGW_NUM, 0))                                        "+		//
		"                      ELSE                                                                                                 "+		//
		"                       0                                                                                                   "+		//
		"                    END || '%',2)    ZB_QC                                                                                 "+		//--七彩流量日租卡环比
		"  FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY T1                                                                                     "+		//
		" WHERE T1.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                                                              ";		//

	return s;
}
function listRegions(){
	//条件
	var sql = "select distinct t.GROUP_ID_1,t.GROUP_ID_1_NAME from PMRT.TB_MRT_BUS_HALL_DEV_DAY t where 1=1";
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
	var preField=' T1.DEAL_DATE,T1.GROUP_ID_1_NAME,T1.BUS_HALL_NAME,T1.HQ_CHAN_CODE,T1.OPERATE_TYPE,';
	var where='';
	var orderBy=" ORDER BY T1.DEAL_DATE,T1.GROUP_ID_1,T1.HQ_CHAN_CODE";
	var groupBy=" GROUP BY T1.DEAL_DATE,T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.BUS_HALL_NAME,T1.HQ_CHAN_CODE,T1.OPERATE_TYPE";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var regionCode =$("#regionCode").val();
	var chnlCode = $("#chnlCode").val();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND T1.GROUP_ID_1='" + regionCode + "' ";
	} 
	if(regionName!=""){
		where+=" AND T1.GROUP_ID_1_NAME='"+regionName+"'";
	}
	if(operateType!=""){
		where+=" AND T1.OPERATE_TYPE='"+operateType+"'";
	}
	if(chnlCode!=""){
		where += " AND T1.HQ_CHAN_CODE ='"+chnlCode+"' ";
	}
	var sql = 'SELECT' + preField + sumSql+where+groupBy+orderBy;
	var showtext = '营业厅发展报表' + startDate+"-"+endDate;
	if(startDate==endDate){
		title=[["开始账期","地市","营业厅","渠道编码","经营模式","移动网发展","","","固网发展","","","移动网+固网发展","","","其中智慧沃家发展","","","其中七彩流量日租卡发展量","",""],
		       ["","","","","","当日","本月累计","累计环比","当日","本月累计","累计环比","当日","本月累计","累计环比","当日","本月累计","累计环比","当日","本月累计","占发展比"]];
	}else{
		title=[["开始账期","地市","营业厅","渠道编码","经营模式","移动网发展","","固网发展","","移动网+固网发展","","其中智慧沃家发展","","其中七彩流量日租卡发展量",""],
		       ["","","","","","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","占发展比"]];
	}
	/*title=[["账期","组织架构","渠道","经营模式","2G发展","","","","3G发展","","","","4G发展","","","","固网发展","","","","维系","","","","合计(含维系)","","",""],
		       ["","","","","当日","当日环比","累计","累计环比","当日","当日环比","累计","累计环比","当日","当日环比","累计","累计环比","当日","当日环比","累计","累计环比","当日","当日环比","累计","累计环比","当日","当日环比","累计","累计环比"]];*/
	downloadExcel(sql,title,showtext);
}
