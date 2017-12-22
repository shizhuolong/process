var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","LAST_HQ_NUM_ALL","THIS_HQ_NUM_ALL" ,"JZ_HQ_NUM_ALL" ,"HB_ALL" ,"LAST_HQ_NUM_HZT" ,"THIS_HQ_NUM_HZT" ,"JZ_HQ_NUM_HZT" ,"HB_HZT" ,"LAST_HQ_NUM_ZJTY" ,"THIS_HQ_NUM_ZJTY" ,"JZ_HQ_NUM_ZJTY" ,"HB_ZJTY" ,"LAST_HQ_NUM_BLQD" ,"THIS_HQ_NUM_BLQD" ,"JZ_HQ_NUM_BLQD" ,"HB_BLQD" ,"LAST_HQ_NUM_SHZX" ,"THIS_HQ_NUM_SHZX" ,"JZ_HQ_NUM_SHZX" ,"HB_SHZX"];
var title=[["州市","渠道新增汇总","","","","合作厅、专营店、社区沃店","","","","其中：自建他营模式渠道","","","","便利型渠道","","","","社会直销渠道","","",""],
           ["","上月渠道数量（家）","本月渠道数量（家）","渠道净增","渠道数量环比","上月渠道数量（家）","本月渠道数量（家）","渠道净增","渠道数量环比","上月渠道数量（家）","本月渠道数量（家）","渠道净增","渠道数量环比","上月渠道数量（家）","本月渠道数量（家）","渠道净增","渠道数量环比","上月渠道数量（家）","本月渠道数量（家）","渠道净增","渠道数量环比"]];
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 25;
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
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	
	var dealDate=$("#dealDate").val();
	var where = "WHERE STATUS=10 " +
			    "GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0,T1.REGION_NAME_ABBR))";
	
	var sql=getSql();
	sql+=where;
	downSql=sql;
	
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
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

function getSql(){
	var dealDate=$("#dealDate").val();
	var sql="SELECT NVL(T1.REGION_NAME_ABBR,'全省') GROUP_ID_1_NAME                                                                                                                                                                     "+
	//     --渠道新增汇总                                                                                                                                                                                                       "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')< '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'                                                                                                          "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             LAST_HQ_NUM_ALL                                                                                                                                                                         "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<= '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'                                                                                                         "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             THIS_HQ_NUM_ALL                                                                                                                                                                         "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')= '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'                                                                                                          "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             JZ_HQ_NUM_ALL                                                                                                                                                                           "+
	"      ,PMRT.LINK_RATIO(COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<= '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'                                                                                         "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END) ,                                                                                                                                                                                   "+
	"                       COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')< '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'                                                                                          "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END)                                                                                                                                                                                     "+
	"                       ,2)        HB_ALL                                                                                                                                                                                   "+
	//      --合作厅、专营店、社区沃店                                                                                                                                                                                          "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')< '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME IN('合作营业厅','专营店/专区')                                                        "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             LAST_HQ_NUM_HZT                                                                                                                                                                         "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<= '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME IN('合作营业厅','专营店/专区')                                                       "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             THIS_HQ_NUM_HZT                                                                                                                                                                         "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')= '"+dealDate+"'  AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME IN('合作营业厅','专营店/专区')                                                       "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             JZ_HQ_NUM_HZT                                                                                                                                                                           "+
	"      ,PMRT.LINK_RATIO(COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<= '"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME IN('合作营业厅','专营店/专区')                                       "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END) ,                                                                                                                                                                                   "+
	"                       COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<'"+dealDate+"'  AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME IN('合作营业厅','专营店/专区')                                       "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END)                                                                                                                                                                                     "+
	"                       ,2)        HB_HZT                                                                                                                                                                                   "+
	//      --其中：自建他营模式渠道                                                                                                                                                                                            "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<'"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME ='合作营业厅' AND CHN_CDE_4_NAME = '资源买断型自建他营-合作厅'                        "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             LAST_HQ_NUM_ZJTY                                                                                                                                                                        "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME ='合作营业厅' AND CHN_CDE_4_NAME = '资源买断型自建他营-合作厅'                       "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             THIS_HQ_NUM_ZJTY                                                                                                                                                                        "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'  AND CHN_CDE_3_NAME ='合作营业厅' AND CHN_CDE_4_NAME = '资源买断型自建他营-合作厅'                       "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             JZ_HQ_NUM_ZJTY                                                                                                                                                                          "+
	"      ,PMRT.LINK_RATIO(COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME ='合作营业厅' AND CHN_CDE_4_NAME = '资源买断型自建他营-合作厅'       "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END) ,                                                                                                                                                                                   "+
	"                       COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<'"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'  AND CHN_CDE_3_NAME ='合作营业厅' AND CHN_CDE_4_NAME = '资源买断型自建他营-合作厅'       "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END)                                                                                                                                                                                     "+
	"                       ,2)        HB_ZJTY                                                                                                                                                                                  "+
/*",COUNT(CASE WHEN TO_CHAR(CREATE_TIME, 'YYYYMM') < '"+dealDate+"'  "+
"           THEN T2.HQ_CHNL_ID                                "+
"       END) LAST_HQ_NUM_ZLLS                               "+
",COUNT(CASE WHEN TO_CHAR(CREATE_TIME, 'YYYYMM') <= '"+dealDate+"'  "+
"            THEN T2.HQ_CHNL_ID                                "+
"       END) THIS_HQ_NUM_ZLLS                           "+
",COUNT(CASE WHEN TO_CHAR(CREATE_TIME, 'YYYYMM') = '"+dealDate+"'  "+
 "           THEN T2.HQ_CHNL_ID                             "+
 "      END) JZ_HQ_NUM_ZLLS                               "+
 ",PMRT.LINK_RATIO(COUNT(CASE WHEN TO_CHAR(CREATE_TIME, 'YYYYMM') <= '"+dealDate+"'  "+
 "                           THEN T2.HQ_CHNL_ID                  "+
  "                          END)                               "+
  "               ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME, 'YYYYMM') < '"+dealDate+"'  "+
  "                          THEN T2.HQ_CHNL_ID                          "+
  "                          END),2) HB_ZLLS                              "+*/
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<'"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME ='代理点'                                                                             "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             LAST_HQ_NUM_BLQD                                                                                                                                                                        "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME ='代理点'                                                                            "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             THIS_HQ_NUM_BLQD                                                                                                                                                                        "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'  AND CHN_CDE_3_NAME ='代理点'                                                                            "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             JZ_HQ_NUM_BLQD                                                                                                                                                                          "+
	"      ,PMRT.LINK_RATIO(COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体'  AND CHN_CDE_3_NAME ='代理点'                                                           "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END) ,                                                                                                                                                                                   "+
	"                       COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<'"+dealDate+"'  AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='实体' AND CHN_CDE_3_NAME ='代理点'                                                            "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END)                                                                                                                                                                                     "+
	"                       ,2)        HB_BLQD                                                                                                                                                                                  "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<'"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='直销' AND CHN_CDE_3_NAME ='公众客户社会直销渠道'                                                               "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             LAST_HQ_NUM_SHZX                                                                                                                                                                        "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='直销' AND CHN_CDE_3_NAME ='公众客户社会直销渠道'                                                              "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             THIS_HQ_NUM_SHZX                                                                                                                                                                        "+
	"      ,COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='直销' AND CHN_CDE_3_NAME ='公众客户社会直销渠道'                                                               "+
	"                  THEN HQ_CHAN_CODE                                                                                                                                                                                        "+
	"                  END)             JZ_HQ_NUM_SHZX                                                                                                                                                                          "+
	"      ,PMRT.LINK_RATIO(COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<='"+dealDate+"' AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='直销' AND CHN_CDE_3_NAME ='公众客户社会直销渠道'                                              "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END) ,                                                                                                                                                                                   "+
	"                       COUNT(CASE WHEN TO_CHAR(CREATE_TIME,'YYYYMM')<'"+dealDate+"'  AND CHN_CDE_1_NAME ='社会' AND CHN_CDE_2_NAME ='直销' AND CHN_CDE_3_NAME ='公众客户社会直销渠道'                                              "+
	"                                  THEN HQ_CHAN_CODE                                                                                                                                                                        "+
	"                                  END)                                                                                                                                                                                     "+
	"                       ,2)        HB_SHZX                                                                                                                                                                                  "+
	"FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                                                                                                                                          "+
	"LEFT JOIN (SELECT HQ_CHNL_ID FROM PCDE.TB_CDE_CHAIN_CHANNEL_TREE) T2  "+
    "ON(T.HQ_CHAN_CODE=T2.HQ_CHNL_ID)                                      "+
	"JOIN PCDE.TB_CDE_REGION_CODE T1                                                                                                                                                                                            "+
	"ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                                                                                                                                                             ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "渠道拓展";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
