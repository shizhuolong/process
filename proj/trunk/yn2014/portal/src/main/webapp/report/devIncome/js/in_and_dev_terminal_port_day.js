var nowData = [];
var report = null;
$(function() {
	 $("#searchBtn").click(function(){
		$("#exportPageBtn").parent().remove();
		var title = getTitle();
		var field = getField();
		report = new LchReport({
			title : title,
			field : field,
			css:[{gt:3,css:LchReport.RIGHT_ALIGN}],
			rowParams : [/*"HR_NO","USER_NAME"*/],//第一个为rowId
			content : "lchcontent",
			orderCallBack : function(index, type) {
				orderBy = " order by " + field[index] + " " + type + " ";
				search(0);
			},
			getSubRowsCallBack : function($tr) {
				return {
					data : nowData,
					extra : {}
				};
			}
		});
		search(0);
		});
	 $("#searchBtn").trigger("click");
});

var pageSize = 15;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var startDate = $("#startDate").val();
	var endDate	  = $("#endDate").val();
	var sql = "";
	//获得查询sql
	if(startDate==endDate){
		sql = getSqlSame();
	}else{
		sql = getsqlDefent();
	}
		
	
	var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	/*//排序
	if (orderBy != '') {
		sql += orderBy;
	}*/


	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
}

function getsqlDefent(){
	var startDate = $("#startDate").val();
	var endDate	  = $("#endDate").val();
	
	var regionCode	= $("#regionCode").val();
	var chnlCode	= $.trim($("#chnlCode").val());
	var operateType = $("#operateType").val();
	var unitType	= $("#unitType").val();
	//权限
	var orgLevel = $("#orgLevel").val();
	var code	 = $("#code").val();
	var region	 = $("#region").val();

	var sql=" SELECT GROUP_ID_1_NAME                                                                                        "+	//
			"       ,BUS_HALL_NAME                                                                                          "+	//
			"       ,OPERATE_TYPE                                                                                           "+	//
			"       ,CHNL_TYPE                                                                                              "+	//
			"       ,NVL(SUM(THIS_YW_DEV),0)     	AS 	THIS_YW_DEV															"+	//--移动网
			"       ,NVL(SUM(THIS_2G_DEV),0)      AS 	THIS_2G_DEV															"+	//--其中4G
			"       ,NVL(SUM(THIS_3G_DEV),0)      AS 	THIS_3G_DEV															"+	//--其中4G
			"       ,NVL(SUM(THIS_4G_DEV),0)      AS	THIS_4G_DEV															"+	//--其中4G
			"       ,NVL(SUM(THIS_QCALL_DEV),0)  	AS	THIS_QCALL_DEV														"+	//--其中七彩套餐
			"       ,NVL(SUM(THIS_NET_DEV),0)     AS	THIS_NET_DEV														"+	//--固网
			"       ,NVL(SUM(THIS_GWKD_DEV),0)    AS	THIS_GWKD_DEV														"+	//--其中宽带
			"       ,NVL(SUM(THIS_WJDS_DEV),0)    AS	THIS_WJDS_DEV														"+	//--其中沃家电视
			"       ,NVL(SUM(THIS_ALL_DEV),0)     AS	THIS_ALL_DEV														"+	//--日发展
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_DEV),0)<>0                                              "+	//
			"             THEN (NVL(SUM(THIS_YW_DEV),0)-NVL(SUM(LAST_YW_DEV),0))*100/NVL(SUM(LAST_YW_DEV),0)                "+	//
			"             ELSE 0                                                                                            "+	//
			"             END  || '%',2)    AS ACC_SEQ_MOBLE         														"+	//--移动网
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_2G_DEV),0)<>0 	                                            "+	//
			"             THEN (NVL(SUM(THIS_2G_DEV),0)-NVL(SUM(LAST_2G_DEV),0))*100/NVL(SUM(LAST_2G_DEV),0)    	        "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)   AS ACC_SEQ_2G         															"+	//--2G环比
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_3G_DEV),0)<>0 	                                            "+	//
			"             THEN (NVL(SUM(THIS_3G_DEV),0)-NVL(SUM(LAST_3G_DEV),0))*100/NVL(SUM(LAST_3G_DEV),0)    	        "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)   AS ACC_SEQ_3G        															"+	//--3G环比            
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_4G_DEV),0)<>0 	                                            "+	//
			"             THEN (NVL(SUM(THIS_4G_DEV),0)-NVL(SUM(LAST_4G_DEV),0))*100/NVL(SUM(LAST_4G_DEV),0)    	        "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)   AS ACC_SEQ_4G         															"+	//--4G环比
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_QCALL_DEV),0)<>0 	                                        "+	//
			"             THEN (NVL(SUM(THIS_QCALL_DEV),0)-NVL(SUM(LAST_QCALL_DEV),0))*100/NVL(SUM(LAST_QCALL_DEV),0)  	    "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)    AS ACC_SEQ_QC         															"+	//--七彩套餐环比
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_DEV),0)<>0 	                                        "+	//
			"             THEN (NVL(SUM(THIS_NET_DEV),0)-NVL(SUM(LAST_NET_DEV),0))*100/NVL(SUM(LAST_NET_DEV),0)    	        "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)    AS ACC_SEQ_GW        															"+	//--固网环比
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_GWKD_DEV),0)<>0 	                                        "+	//
			"             THEN (NVL(SUM(THIS_GWKD_DEV),0)-NVL(SUM(LAST_GWKD_DEV),0))*100/NVL(SUM(LAST_GWKD_DEV),0)    	    "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)     AS ACC_SEQ_KD       															"+	//--宽带环比
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_WJDS_DEV),0)<>0 	                                        "+	//
			"             THEN (NVL(SUM(THIS_WJDS_DEV),0)-NVL(SUM(LAST_WJDS_DEV),0))*100/NVL(SUM(LAST_WJDS_DEV),0)    	    "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)    AS ACC_SEQ_WJDS         														"+	//--沃家电视环比
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_ALL_DEV),0)<>0 	                                        "+	//
			"             THEN (NVL(SUM(THIS_ALL_DEV),0)-NVL(SUM(LAST_ALL_DEV),0))*100/NVL(SUM(LAST_ALL_DEV),0)    	        "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)    AS ACC_SEQ_XJ        															"+	//--环比 
			"       ,NVL(SUM(THIS_YW_SR),0)     	AS	THIS_YW_SR 															"+	//	--移网
			"       ,NVL(SUM(THIS_2G_SR),0)    	AS 	THIS_2G_SR																"+	//--其中2G
			"       ,NVL(SUM(THIS_3G_SR),0)    	AS 	THIS_3G_SR																"+	//--其中3G
			"       ,NVL(SUM(THIS_4G_SR),0)    	AS 	THIS_4G_SR																"+	//--其中4G
			"       ,NVL(SUM(THIS_NET_SR),0)     	AS 	THIS_NET_SR															"+	//	--固网
			"       ,NVL(SUM(THIS_GWKD_SR),0)    	AS 	THIS_GWKD_SR														"+	//	--其中宽带
			"       ,NVL(SUM(THIS_ALL_SR),0)     	AS 	THIS_ALL_SR															"+	//	--当日
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_SR),0)<>0                                               "+	//
			"             THEN (NVL(SUM(THIS_YW_SR),0)-NVL(SUM(LAST_YW_SR),0))*100/NVL(SUM(LAST_YW_SR),0)                   "+	//
			"             ELSE 0                                                                                            "+	//
			"             END  || '%',2)         AS ACC_SEQ2_MOBLE															"+	//--移网
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_2G_SR),0)<>0 	                                            "+	//
			"             THEN (NVL(SUM(THIS_2G_SR),0)-NVL(SUM(LAST_2G_SR),0))*100/NVL(SUM(LAST_2G_SR),0)    	            "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)         AS ACC_SEQ2_2G																"+	//--2G
			"             ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_3G_SR),0)<>0 	                                    "+	//
			"             THEN (NVL(SUM(THIS_3G_SR),0)-NVL(SUM(LAST_3G_SR),0))*100/NVL(SUM(LAST_3G_SR),0)    	            "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)         AS ACC_SEQ2_3G																"+	//--3G
			"             ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_4G_SR),0)<>0 	                                    "+	//
			"             THEN (NVL(SUM(THIS_4G_SR),0)-NVL(SUM(LAST_4G_SR),0))*100/NVL(SUM(LAST_4G_SR),0)    	            "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)         AS ACC_SEQ2_4G																"+	//--4G      
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_SR),0)<>0 	                                            "+	//
			"             THEN (NVL(SUM(THIS_NET_SR),0)-NVL(SUM(LAST_NET_SR),0))*100/NVL(SUM(LAST_NET_SR),0)    	        "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)         AS ACC_SEQ2_GW																"+	//--固网  
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_ALL_SR),0)<>0 	                                            "+	//
			"             THEN (NVL(SUM(THIS_ALL_SR),0)-NVL(SUM(LAST_ALL_SR),0))*100/NVL(SUM(LAST_ALL_SR),0)    	        "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)            AS ACC_SEQ2_XJ															"+	//--小计环比  
			"       ,NVL(SUM(TYPE1_DEV),0)      AS TYPE1_DEV 																"+	//	--日发展 
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_TYPE1_DEV),0)<>0 	                                        "+	//
			"             THEN (NVL(SUM(TYPE1_DEV),0)-NVL(SUM(LAST_TYPE1_DEV),0))*100/NVL(SUM(LAST_TYPE1_DEV),0)    	    "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)     AS TERM_COUNT_TYPE1_SEQ       													"+	//--环比
			"       ,NVL(SUM(TYPE3_DEV),0)   AS TYPE3_DEV																	"+	//	--日发展
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_TYPE3_DEV),0)<>0 	                                        "+	//
			"             THEN (NVL(SUM(TYPE3_DEV),0)-NVL(SUM(LAST_TYPE3_DEV),0))*100/NVL(SUM(LAST_TYPE3_DEV),0)    	    "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)     AS  TERM_COUNT_TYPE3_SEQ      													"+	//--环比
			"       ,NVL(SUM(TYPE_ALL),0)    AS TYPE_ALL       																"+	//--日发展       
			"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_TYPEALL_DEV),0)<>0 	                                    "+	//
			"             THEN (NVL(SUM(TYPE_ALL),0)-NVL(SUM(LAST_TYPEALL_DEV),0))*100/NVL(SUM(LAST_TYPEALL_DEV),0)    	    "+	//
			"             ELSE 0	                                                                                        "+	//
			"             END  || '%',2)     AS  TERM_COUNT_TOTAL_SEQ      													"+	//--环比                        
			" FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL WHERE DEAL_DATE BETWEEN '"+startDate+"'  AND '"+endDate+"'              ";//
			
	if(regionCode!=''){
		sql+=" AND  GROUP_ID_1='"+regionCode+"'";
	}
	if(chnlCode!=''){
		sql+=" AND  HQ_CHAN_CODE ='"+chnlCode+"'";
	}
	if(operateType!=''){
		sql+=" AND  OPERATE_TYPE ='"+operateType+"'";
	}
	if(unitType!=''){
		sql+=" AND  CHNL_TYPE ='"+unitType+"'";
	}
	/*if(userPhone!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+userPhone+"')>0 ";
	}*/
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else{
		sql+=" 1=2";
	}
	sql+=" GROUP BY GROUP_ID_1_NAME,BUS_HALL_NAME,OPERATE_TYPE,CHNL_TYPE ";
	return sql;
}


function getSqlSame(){
	var startDate = $("#startDate").val();
	var endDate	  = $("#endDate").val();
	
	var regionCode	= $("#regionCode").val();
	var chnlCode	= $.trim($("#chnlCode").val());
	var operateType = $("#operateType").val();
	var unitType	= $("#unitType").val();
	//权限
	var orgLevel = $("#orgLevel").val();
	var code	 = $("#code").val();
	var region	 = $("#region").val();
	var sql = 	" SELECT GROUP_ID_1_NAME,                                                                                 "+
				"        BUS_HALL_NAME,                                                                                   "+
				"        OPERATE_TYPE,                                                                                    "+
				"        CHNL_TYPE,                                                                                       "+
				"        NVL(SUM(THIS_YW_DEV), 0) AS THIS_YW_DEV,                                                         "+
				"        NVL(SUM(THIS_2G_DEV), 0) AS THIS_2G_DEV,                                                         "+
				"        NVL(SUM(THIS_3G_DEV), 0) AS THIS_3G_DEV,                                                         "+
				"        NVL(SUM(THIS_4G_DEV), 0) AS THIS_4G_DEV,                                                         "+
				"        NVL(SUM(THIS_QCALL_DEV), 0) AS THIS_QCALL_DEV,                                                   "+
				"        NVL(SUM(THIS_YW_DEV1), 0) AS THIS_YW_DEV1,                                                       "+
				"        NVL(SUM(THIS_2G_DEV1), 0) AS THIS_2G_DEV1,                                                       "+
				"        NVL(SUM(THIS_3G_DEV1), 0) AS THIS_3G_DEV1,                                                       "+
				"        NVL(SUM(THIS_4G_DEV1), 0) AS THIS_4G_DEV1,                                                       "+
				"        NVL(SUM(THIS_QCALL_DEV1), 0) AS THIS_QCALL_DEV1,                                                 "+
				"        NVL(SUM(THIS_NET_DEV), 0) AS THIS_NET_DEV,                                                       "+
				"        NVL(SUM(THIS_GWKD_DEV), 0) AS THIS_GWKD_DEV,                                                     "+
				"        NVL(SUM(THIS_WJDS_DEV), 0) AS THIS_WJDS_DEV,                                                     "+
				"        NVL(SUM(THIS_NET_DEV1), 0) AS THIS_NET_DEV1,                                                     "+
				"        NVL(SUM(THIS_GWKD_DEV1), 0) AS THIS_GWKD_DEV1,                                                   "+
				"        NVL(SUM(THIS_WJDS_DEV1), 0) AS THIS_WJDS_DEV1,                                                   "+
				"        NVL(SUM(THIS_ALL_DEV), 0) AS THIS_ALL_DEV,                                                       "+
				"        NVL(SUM(THIS_ALL_DEV1), 0) AS THIS_ALL_DEV1,                                                     "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_YW_DEV1), 0) <> 0 THEN                                  "+
				"                                (NVL(SUM(THIS_YW_DEV1), 0) - NVL(SUM(LAST_YW_DEV1), 0)) * 100 /          "+
				"                                NVL(SUM(LAST_YW_DEV1), 0)                                                "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_MOBLE,                                                        "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_2G_DEV1), 0) <> 0 THEN                                  "+
				"                                (NVL(SUM(THIS_2G_DEV1), 0) - NVL(SUM(LAST_2G_DEV1), 0)) * 100 /          "+
				"                                NVL(SUM(LAST_2G_DEV1), 0)                                                "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_2G,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_3G_DEV1), 0) <> 0 THEN                                  "+
				"                                (NVL(SUM(THIS_3G_DEV1), 0) - NVL(SUM(LAST_3G_DEV1), 0)) * 100 /          "+
				"                                NVL(SUM(LAST_3G_DEV1), 0)                                                "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_3G,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_4G_DEV1), 0) <> 0 THEN                                  "+
				"                                (NVL(SUM(THIS_4G_DEV1), 0) - NVL(SUM(LAST_4G_DEV1), 0)) * 100 /          "+
				"                                NVL(SUM(LAST_4G_DEV1), 0)                                                "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_4G,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_QCALL_DEV1), 0) <> 0 THEN                               "+
				"                                (NVL(SUM(THIS_QCALL_DEV1), 0) - NVL(SUM(LAST_QCALL_DEV1), 0)) * 100 /    "+
				"                                NVL(SUM(LAST_QCALL_DEV1), 0)                                             "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_QC,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_NET_DEV1), 0) <> 0 THEN                                 "+
				"                                (NVL(SUM(THIS_NET_DEV1), 0) - NVL(SUM(LAST_NET_DEV1), 0)) * 100 /        "+
				"                                NVL(SUM(LAST_NET_DEV1), 0)                                               "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_GW,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_GWKD_DEV1), 0) <> 0 THEN                                "+
				"                                (NVL(SUM(THIS_GWKD_DEV1), 0) - NVL(SUM(LAST_GWKD_DEV1), 0)) * 100 /      "+
				"                                NVL(SUM(LAST_GWKD_DEV1), 0)                                              "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_KD,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_WJDS_DEV1), 0) <> 0 THEN                                "+
				"                                (NVL(SUM(THIS_WJDS_DEV1), 0) - NVL(SUM(LAST_WJDS_DEV1), 0)) * 100 /      "+
				"                                NVL(SUM(LAST_WJDS_DEV1), 0)                                              "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_WJDS,                                                         "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_ALL_DEV1), 0) <> 0 THEN                                 "+
				"                                (NVL(SUM(THIS_ALL_DEV1), 0) - NVL(SUM(LAST_ALL_DEV1), 0)) * 100 /        "+
				"                                NVL(SUM(LAST_ALL_DEV1), 0)                                               "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ_XJ,                                                           "+
				"        NVL(SUM(THIS_YW_SR), 0) AS THIS_YW_SR,                                                           "+
				"        NVL(SUM(THIS_2G_SR), 0) AS THIS_2G_SR,                                                           "+
				"        NVL(SUM(THIS_3G_SR), 0) AS THIS_3G_SR,                                                           "+
				"        NVL(SUM(THIS_4G_SR), 0) AS THIS_4G_SR,                                                           "+
				"        NVL(SUM(THIS_YW_SR1), 0) AS THIS_YW_SR1,                                                         "+
				"        NVL(SUM(THIS_2G_SR1), 0) AS THIS_2G_SR1,                                                         "+
				"        NVL(SUM(THIS_3G_SR1), 0) AS THIS_3G_SR1,                                                         "+
				"        NVL(SUM(THIS_4G_SR1), 0) AS THIS_4G_SR1,                                                         "+
				"        NVL(SUM(THIS_NET_SR), 0) AS THIS_NET_SR,                                                         "+
				"        NVL(SUM(THIS_GWKD_SR), 0) AS THIS_GWKD_SR,                                                       "+
				"        NVL(SUM(THIS_NET_SR1), 0) AS THIS_NET_SR1,                                                       "+
				"        NVL(SUM(THIS_GWKD_SR1), 0) AS THIS_GWKD_SR1,                                                     "+
				"        NVL(SUM(THIS_ALL_SR), 0) AS THIS_ALL_SR,                                                         "+
				"        NVL(SUM(THIS_ALL_SR1), 0) AS THIS_ALL_SR1,                                                       "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_YW_SR1), 0) <> 0 THEN                                   "+
				"                                (NVL(SUM(THIS_YW_SR1), 0) - NVL(SUM(LAST_YW_SR1), 0)) * 100 /            "+
				"                                NVL(SUM(LAST_YW_SR1), 0)                                                 "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ2_MOBLE,                                                       "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_2G_SR1), 0) <> 0 THEN                                   "+
				"                                (NVL(SUM(THIS_2G_SR1), 0) - NVL(SUM(LAST_2G_SR1), 0)) * 100 /            "+
				"                                NVL(SUM(LAST_2G_SR1), 0)                                                 "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ2_2G,                                                          "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_3G_SR1), 0) <> 0 THEN                                   "+
				"                                (NVL(SUM(THIS_3G_SR1), 0) - NVL(SUM(LAST_3G_SR1), 0)) * 100 /            "+
				"                                NVL(SUM(LAST_3G_SR1), 0)                                                 "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ2_3G,                                                          "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_4G_SR1), 0) <> 0 THEN                                   "+
				"                                (NVL(SUM(THIS_4G_SR1), 0) - NVL(SUM(LAST_4G_SR1), 0)) * 100 /            "+
				"                                NVL(SUM(LAST_4G_SR1), 0)                                                 "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ2_4G,                                                          "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_NET_SR1), 0) <> 0 THEN                                  "+
				"                                (NVL(SUM(THIS_NET_SR1), 0) - NVL(SUM(LAST_NET_SR1), 0)) * 100 /          "+
				"                                NVL(SUM(LAST_NET_SR1), 0)                                                "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ2_GW,                                                          "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_GWKD_SR1), 0) <> 0 THEN                                 "+
				"                                (NVL(SUM(THIS_GWKD_SR1), 0) - NVL(SUM(LAST_GWKD_SR1), 0)) * 100 /        "+
				"                                NVL(SUM(LAST_GWKD_SR1), 0)                                               "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ2_GWKD,                                                        "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(LAST_ALL_SR1), 0) <> 0 THEN                                  "+
				"                                (NVL(SUM(THIS_ALL_SR1), 0) - NVL(SUM(LAST_ALL_SR1), 0)) * 100 /          "+
				"                                NVL(SUM(LAST_ALL_SR1), 0)                                                "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS ACC_SEQ2_XJ,                                                          "+
				"        NVL(SUM(TYPE1_DEV), 0) AS TYPE1_DEV,                                                             "+
				"        NVL(SUM(TYPE1_DEV1), 0) AS TYPE1_DEV1,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(TYPE1_DEVL), 0) <> 0 THEN                                    "+
				"                                (NVL(SUM(TYPE1_DEV1), 0) - NVL(SUM(TYPE1_DEVL), 0)) * 100 /              "+
				"                                NVL(SUM(TYPE1_DEVL), 0)                                                  "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS TERM_COUNT_TYPE1_SEQ,                                                 "+
				"        NVL(SUM(TYPE3_DEV), 0) AS TYPE3_DEV,                                                             "+
				"        NVL(SUM(TYPE3_DEV1), 0) AS TYPE3_DEV1,                                                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(TYPE3_DEVL), 0) <> 0 THEN                                    "+
				"                                (NVL(SUM(TYPE3_DEV1), 0) - NVL(SUM(TYPE3_DEVL), 0)) * 100 /              "+
				"                                NVL(SUM(TYPE3_DEVL), 0)                                                  "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS TERM_COUNT_TYPE3_SEQ,                                                 "+
				"        NVL(SUM(TYPE_ALL), 0) AS TYPE_ALL,                                                               "+
				"        NVL(SUM(TYPE_ALL1), 0) AS TYPE_ALL1,                                                             "+
				"        PODS.GET_RADIX_POINT(CASE                                                                        "+
				"                               WHEN NVL(SUM(TYPE_ALLL), 0) <> 0 THEN                                     "+
				"                                (NVL(SUM(TYPE_ALL1), 0) - NVL(SUM(TYPE_ALLL), 0)) * 100 /                "+
				"                                NVL(SUM(TYPE_ALLL), 0)                                                   "+
				"                               ELSE                                                                      "+
				"                                0                                                                        "+
				"                             END || '%',                                                                 "+
				"                             2) AS TERM_COUNT_TOTAL_SEQ                                                  "+
				"   FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                 "+
				"  WHERE DEAL_DATE BETWEEN '"+startDate+"'  AND '"+endDate+"'                                             ";
	if(regionCode!=''){
		sql+=" AND  GROUP_ID_1='"+regionCode+"'";
	}
	if(chnlCode!=''){
		sql+=" AND  HQ_CHAN_CODE ='"+chnlCode+"'";
	}
	if(operateType!=''){
		sql+=" AND  OPERATE_TYPE ='"+operateType+"'";
	}
	if(unitType!=''){
		sql+=" AND  CHNL_TYPE ='"+unitType+"'";
	}
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql += " AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql += " AND GROUP_ID_1='"+region+"'";
	}else{
		sql += " 1=2";
	}
	sql += " GROUP BY GROUP_ID_1_NAME,BUS_HALL_NAME,OPERATE_TYPE,CHNL_TYPE ";
	//sql += " GROUP BY GROUP_ID_1_NAME,BUS_HALL_NAME,OPERATE_TYPE,CHNL_TYPE ";                                                                                       ";
	return sql;
}

function getTitle(){
	var title=[];
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(startDate==endDate){
		title=[["分公司","营业厅","经营模式","厅类型","业务发展","","","","","","","","","","","","","","","","","","","","","","","","","","","收入","","","","","","","","","","","","","","","","","","","","","终端销量","","","","","","","",""],
		       ["","","","","移动网","","","","","","","","","","固网","","","","","","小计","","累计环比","","","","","","","","","移动网","","","","","","","","固网","","","","小计","","累计环比","","","","","","","模式一","","","模式三","","","小计","",""],
		       ["","","","","日发展","","","","","月累计","","","","","日发展","","","月累计","","","","","","","","","","","","","","日收入","","","","月累计","","","","日收入","","月累计","","","","","","","","","","","","","","","","","","",""],
		       ["","","","","移动网","其中2G","其中3G","其中4G","其中七彩套餐","移动网","其中2G","其中3G","其中4G","其中七彩套餐","固网","其中宽带","其中沃家电视","固网","其中宽带","其中沃家电视","日收入","月累计","移网","其中2G","其中3G","其中4G","其中七彩套餐","固网","其中宽带","其中沃家电视","小计环比","移动网","其中2G收入","其中3G收入","其中4G收入","移动网","其中2G收入","其中3G收入","其中4G收入","固网","其中宽带收入","固网","其中宽带收入","日收入","月累计","移动网","其中2G收入","其中3G收入","其中4G收入","固网","其中宽带收入","小计","日发展","月累计","环比","日发展","月累计","环比","日发展","月累计","环比"]
			 ];
	}else{
		title=[
				["分公司","营业厅","经营模式（自营/柜台外包)","厅类型(旗舰/标准/小型） ","业务发展","","","","","","","","","","","","","","","","","","收入","","","","","","","","","","","","","终端销量","","","","",""],
				["","","","","移动网","","","","","固网","","","小计","累计环比","","","","","","","","","移动网","","","","固网","","累计环比","","","","","","","模式一","","模式三","","小计",""],
				["","","","","月累计","","","","","月累计","","","月累计","","","","","","","","","","月累计","","","","月累计","","","","","","","","","","","","","",""],
				["","","","","移动网","其中2G","其中3G","其中4G","其中七彩套餐","固网","其中宽带","其中沃家电视","","移网","其中2G","其中3G","其中4G","其中七彩套餐","固网","其中宽带","其中沃家电视","小计环比","移动网","其中2G收入","其中3G收入","其中4G收入","固网","其中宽带收入","移动网","其中2G收入","其中3G收入","其中4G收入","固网","其中宽带收入","小计","累计","环比","累计","环比","累计","环比"]
		       ];
	}
	return title;
}

function getField(){
	var field="";
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(startDate==endDate){
		field=[
		      "GROUP_ID_1_NAME","BUS_HALL_NAME","OPERATE_TYPE","CHNL_TYPE","THIS_YW_DEV","THIS_2G_DEV","THIS_3G_DEV","THIS_4G_DEV","THIS_QCALL_DEV","THIS_YW_DEV1","THIS_2G_DEV1","THIS_3G_DEV1","THIS_4G_DEV1","THIS_QCALL_DEV1","THIS_NET_DEV","THIS_GWKD_DEV","THIS_WJDS_DEV","THIS_NET_DEV1","THIS_GWKD_DEV1","THIS_WJDS_DEV1","THIS_ALL_DEV","THIS_ALL_DEV1","ACC_SEQ_MOBLE","ACC_SEQ_2G","ACC_SEQ_3G","ACC_SEQ_4G","ACC_SEQ_QC","ACC_SEQ_GW","ACC_SEQ_KD","ACC_SEQ_WJDS","ACC_SEQ_XJ","THIS_YW_SR","THIS_2G_SR","THIS_3G_SR","THIS_4G_SR","THIS_YW_SR1","THIS_2G_SR1","THIS_3G_SR1","THIS_4G_SR1","THIS_NET_SR","THIS_GWKD_SR","THIS_NET_SR1","THIS_GWKD_SR1","THIS_ALL_SR","THIS_ALL_SR1","ACC_SEQ2_MOBLE","ACC_SEQ2_2G","ACC_SEQ2_3G","ACC_SEQ2_4G","ACC_SEQ2_GW","ACC_SEQ2_GWKD","ACC_SEQ2_XJ","TYPE1_DEV","TYPE1_DEV1","TERM_COUNT_TYPE1_SEQ","TYPE3_DEV","TYPE3_DEV1","TERM_COUNT_TYPE3_SEQ","TYPE_ALL","TYPE_ALL1","TERM_COUNT_TOTAL_SEQ"
		      ];
	}else{
		field=[
			   "GROUP_ID_1_NAME","BUS_HALL_NAME","OPERATE_TYPE","CHNL_TYPE","THIS_YW_DEV","THIS_2G_DEV","THIS_3G_DEV","THIS_4G_DEV","THIS_QCALL_DEV","THIS_NET_DEV","THIS_GWKD_DEV","THIS_WJDS_DEV","THIS_ALL_DEV","ACC_SEQ_MOBLE","ACC_SEQ_2G","ACC_SEQ_3G","ACC_SEQ_4G","ACC_SEQ_QC","ACC_SEQ_GW","ACC_SEQ_KD","ACC_SEQ_WJDS","ACC_SEQ_XJ","THIS_YW_SR","THIS_2G_SR","THIS_3G_SR","THIS_4G_SR","THIS_NET_SR","THIS_GWKD_SR","THIS_ALL_SR","ACC_SEQ2_MOBLE","ACC_SEQ2_2G","ACC_SEQ2_3G","ACC_SEQ2_4G","ACC_SEQ2_GW","ACC_SEQ2_XJ","TYPE1_DEV","TERM_COUNT_TYPE1_SEQ","TYPE3_DEV","TERM_COUNT_TYPE3_SEQ","TYPE_ALL","TERM_COUNT_TOTAL_SEQ"
			  ];
	}
	return field;
}
////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate = $("#startDate").val();
	var endDate   = $("#endDate").val();
	var title = getTitle();
	var sql   = "";
	if(startDate==endDate){
		sql = getSqlSame();
	}else{
		sql = getsqlDefent();
	}
	showtext = '发展收入终端日通报厅明细-('+startDate+"~"+endDate+")";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////