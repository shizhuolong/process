var title="";
var field="";
var startDate="";
var endDate="";
var orderBy="";
$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_BUS_DEV_DAY");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
	$("#searchBtn").click(function(){
		startDate=$("#startDate").val();
		endDate=$("#endDate").val();
		$("#exportPageBtn").parent().remove();
		if(startDate==endDate){
			title=[["州市","旗舰类厅","","","","","标准类厅","","","","","小型类厅","","","","","合计","","","","","",""],
			       ["","日发展","本月累计","较上月环比","其中合约用户","其中七彩蓝尊用户","日发展","本月累计","较上月环比","其中合约用户","其中七彩蓝尊用户","日发展","本月累计","较上月环比","其中合约用户","其中七彩蓝尊用户","日发展","本月累计","较上月环比","其中合约用户","合约占比","其中七彩蓝尊用户","七彩蓝尊占比"]];
			field=["GROUP_ID_1_NAME","QJT_ALL_NUM","QJT_ALL_NUM1","QJT_HB_ALL1","QJT_HY_NUM1","QJT_LZ_NUM1","BZ_ALL_NUM","BZ_ALL_NUM1","BZ_HB_ALL1","BZ_HY_NUM1","BZ_LZ_NUM1","XX_ALL_NUM","XX_ALL_NUM1","XX_HB_ALL1","XX_HY_NUM1","XX_LZ_NUM1","ALL_NUM","ALL_NUM1","HB_ALL1","HY_NUM1","HY_ZB","LZ_NUM1","LZ_ZB"];
		}else{
			title=[["州市","旗舰类厅","","","","标准类厅","","","","小型类厅","","","","合计","","","","",""],
			       ["","本月累计","较上月环比","其中合约用户","其中七彩蓝尊用户","本月累计","较上月环比","其中合约用户","其中七彩蓝尊用户","本月累计","较上月环比","其中合约用户","其中七彩蓝尊用户","本月累计","较上月环比","其中合约用户","合约占比","其中七彩蓝尊用户","七彩蓝尊占比"]];
			field=["GROUP_ID_1_NAME","QJT_ALL_NUM1","QJT_HB_ALL1","QJT_HY_NUM1","QJT_LZ_NUM1","BZ_ALL_NUM1","BZ_HB_ALL1","BZ_HY_NUM1","BZ_LZ_NUM1","XX_ALL_NUM1","XX_HB_ALL1","XX_HY_NUM1","XX_LZ_NUM1","ALL_NUM1","HB_ALL1","HY_NUM1","HY_ZB","LZ_NUM1","LZ_ZB"];
		}
		report = new LchReport({
			title : title,
			field : field,
			css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
			rowParams : [],//第一个为rowId
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
var pageSize = 17;
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
	var regionCode=$("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	var region = $("#code").val();
	var sql ="";
	var order = "";
	var groupBy = "";
	if(startDate==endDate){
		sql=getSameDateSql();
		order = " ORDER BY T.GROUP_ID_1 ";
	}else{
		sql=getDifferentDateSql();
		groupBy = " GROUP BY T.GROUP_ID_1_NAME, T.GROUP_ID_1 ";
		order = " ORDER BY T.GROUP_ID_1 ";
	}
	//条件
	if(""!=regionCode && null!=regionCode){
		sql+=" AND T.GROUP_ID_1  ='"+regionCode+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND T.GROUP_ID_1 ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	sql+=groupBy+order;
    sql="SELECT * FROM("+sql+") T"+orderBy;       
	var d = query(sql);
	nowData = d;
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSameDateSql() {
    var s=
    	"SELECT                                   "+
    	"       T.GROUP_ID_1_NAME                 "+
    	"      ,NVL(T.QJT_ALL_NUM,0)QJT_ALL_NUM   "+
    	"      ,NVL(T.QJT_ALL_NUM1,0)QJT_ALL_NUM1 "+
    	"      ,T.QJT_HB_ALL1                     "+
    	"      ,NVL(T.QJT_HY_NUM1,0)QJT_HY_NUM1   "+
    	"      ,NVL(T.QJT_LZ_NUM1,0)QJT_LZ_NUM1   "+
    	"                                         "+
    	"      ,NVL(T.BZ_ALL_NUM,0)BZ_ALL_NUM     "+
    	"      ,NVL(T.BZ_ALL_NUM1,0)BZ_ALL_NUM1   "+
    	"      ,T.BZ_HB_ALL1                      "+
    	"      ,NVL(T.BZ_HY_NUM1,0)BZ_HY_NUM1     "+
    	"      ,NVL(T.BZ_LZ_NUM1,0)BZ_LZ_NUM1     "+
    	"                                         "+
    	"      ,NVL(T.XX_ALL_NUM,0)XX_ALL_NUM     "+
    	"      ,NVL(T.XX_ALL_NUM1,0)XX_ALL_NUM1   "+
    	"      ,T.XX_HB_ALL1                      "+
    	"      ,NVL(T.XX_HY_NUM1,0)XX_HY_NUM1     "+
    	"      ,NVL(T.XX_LZ_NUM1,0)XX_LZ_NUM1     "+
    	"                                         "+
    	"      ,NVL(T.ALL_NUM,0)ALL_NUM           "+
    	"      ,NVL(T.ALL_NUM1,0)ALL_NUM1         "+
    	"      ,T.HB_ALL1                         "+
    	"      ,NVL(T.HY_NUM1,0)HY_NUM1           "+
    	"      ,T.HY_ZB                           "+
    	"      ,NVL(T.LZ_NUM1,0)LZ_NUM1           "+
    	"      ,T.LZ_ZB                           "+
    	"FROM  PMRT.TB_MRT_BUS_DEV_DAY T          "+
    	"WHERE T.DEAL_DATE='"+startDate+         "'";  
	return s;
}

function getDifferentDateSql() {
    var s=
    	"SELECT T.GROUP_ID_1,T.GROUP_ID_1_NAME                                                      "+
    	"      ,SUM(NVL(T.QJT_ALL_NUM,0))QJT_ALL_NUM1                                               "+
    	"      ,PMRT.LINK_RATIO(SUM(NVL(T.QJT_ALL_NUM,0)),SUM(NVL(T.QJT_LAST_NUM,0)),2) QJT_HB_ALL1 "+
    	"      ,SUM(NVL(T.QJT_HY_NUM,0))QJT_HY_NUM1                                                 "+
    	"      ,SUM(NVL(T.QJT_LZ_NUM,0))QJT_LZ_NUM1                                                 "+
    	"                                                                                           "+
    	"      ,SUM(NVL(T.BZ_ALL_NUM,0))BZ_ALL_NUM1                                                 "+
    	"      ,PMRT.LINK_RATIO(SUM(NVL(T.BZ_ALL_NUM,0)),SUM(NVL(T.BZ_LAST_NUM,0)),2) BZ_HB_ALL1    "+
    	"      ,SUM(NVL(T.BZ_HY_NUM,0))BZ_HY_NUM1                                                   "+
    	"      ,SUM(NVL(T.BZ_LZ_NUM,0))BZ_LZ_NUM1                                                   "+
    	"                                                                                           "+
    	"      ,SUM(NVL(T.XX_ALL_NUM,0))XX_ALL_NUM1                                                 "+
    	"      ,PMRT.LINK_RATIO(SUM(NVL(T.XX_ALL_NUM,0)),SUM(NVL(T.XX_LAST_NUM,0)),2) XX_HB_ALL1    "+
    	"      ,SUM(NVL(T.XX_HY_NUM,0))XX_HY_NUM1                                                   "+
    	"      ,SUM(NVL(T.XX_LZ_NUM,0))XX_LZ_NUM1                                                   "+
    	"                                                                                           "+
    	"      ,SUM(NVL(T.ALL_NUM,0))ALL_NUM1                                                       "+
    	"      ,PMRT.LINK_RATIO(SUM(NVL(T.ALL_NUM,0)),SUM(NVL(T.LAST_NUM,0)),2)HB_ALL1              "+
    	"      ,SUM(NVL(T.HY_NUM,0))HY_NUM1                                                         "+
    	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALL_NUM,0))=0 THEN 0                      "+
    	"                                  ELSE SUM(NVL(T.HY_NUM,0))/SUM(NVL(T.ALL_NUM,0)) END      "+
    	"                ,'FM9999990.999'))HY_ZB                                                    "+
    	"      ,SUM(NVL(T.LZ_NUM,0))LZ_NUM1                                                         "+
    	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALL_NUM,0))=0 THEN 0                      "+
    	"                                  ELSE SUM(NVL(T.LZ_NUM,0))/SUM(NVL(T.ALL_NUM,0)) END      "+
    	"                ,'FM9999990.999')) LZ_ZB                                                   "+
    	"FROM PMRT.TB_MRT_BUS_DEV_DAY T                                                             "+
    	"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                                ";

	return s;
}

function getSameDownSql(){
	var s="SELECT T.DEAL_DATE              "+
	"      ,T.GROUP_ID_1_NAME              "+
	"      ,T.HQ_CHAN_CODE                 "+
	"      ,T.HQ_CHAN_NAME                 "+
	"      ,T.CHNL_TYPE                    "+
	"      ,T.ALL_NUM                      "+
	"      ,T.ALL_NUM1                     "+
	"      ,T.HB_NUM1                      "+
	"      ,T.HY_NUM1                      "+
	"      ,T.HY_ZB1                       "+
	"      ,T.LZ_NUM1                      "+
	"      ,T.LZ_ZB1                       "+
	"FROM PMRT.TB_MRT_BUS_DEV_DETAIL_DAY T "+
	"WHERE T.DEAL_DATE='"+startDate+"'     ";
	return s;	
}

function getDifferentDownSql(){
	var s="SELECT                                                                                "+
	"      T.GROUP_ID_1_NAME                                                              "+
	"      ,T.HQ_CHAN_CODE                                                                 "+
	"      ,T.HQ_CHAN_NAME                                                                 "+
	"      ,T.CHNL_TYPE                                                                    "+
	"      ,SUM(NVL(T.ALL_NUM,0))ALL_NUM                                                   "+
	"      ,PMRT.LINK_RATIO(SUM(NVL(T.ALL_NUM,0)),SUM(NVL(T.LAST_NUM,0)),2) HB_NUM1        "+
	"      ,SUM(NVL(T.HY_NUM,0))HY_NUM1                                                    "+
	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALL_NUM,0))=0 THEN 0                 "+
	"                                  ELSE SUM(NVL(T.HY_NUM,0))/SUM(NVL(T.ALL_NUM,0)) END "+
	"                ,'FM9999990.999')) HY_ZB1                                             "+
	"      ,SUM(NVL(T.LZ_NUM,0))LZ_NUM                                                     "+
	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALL_NUM,0))=0 THEN 0                 "+
	"                                  ELSE SUM(NVL(T.LZ_NUM,0))/SUM(NVL(T.ALL_NUM,0)) END "+
	"                ,'FM9999990.999')) LZ_ZB1                                             "+
	"FROM PMRT.TB_MRT_BUS_DEV_DETAIL_DAY T                                                 "+
	"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                           ";
	return s;	
}

function downsAll() {
	var regionCode=$("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	var region = $("#region").val();
	var sql ="";
	var showtext = "";
	var groupBy="";
	if(startDate==endDate){
		sql=getSameDownSql();
		showtext ='自营厅发展日通报('+startDate+")";
		title=[["账期","地市","营业厅编码","营业厅名称","厅类型","日发展","本月累计","较上月环比","其中合约用户","合约占比","其中七彩蓝尊用户","七彩蓝尊占比"]];
	}else{
		sql=getDifferentDownSql();
		showtext ='自营厅发展日通报(' + startDate+"~"+endDate+")";
		groupBy=" GROUP BY                                                                     "+
		"      T.GROUP_ID_1_ID,T.GROUP_ID_1_NAME                                              "+
		"      ,T.HQ_CHAN_CODE                                                                 "+
		"      ,T.HQ_CHAN_NAME                                                                 "+
		"      ,T.CHNL_TYPE                                                                    ";
		title=[["地市","营业厅编码","营业厅名称","厅类型","本月累计","较上月环比","其中合约用户","合约占比","其中七彩蓝尊用户","七彩蓝尊占比"]];
	}
	//条件
	if(""!=regionCode){
		sql+=" AND T.GROUP_ID_1_ID  ='"+regionCode+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND T.GROUP_ID_1_ID ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	sql+=groupBy+" ORDER BY T.GROUP_ID_1_ID";
	downloadExcel(sql,title,showtext);
}
