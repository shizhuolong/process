var nowData = [];
var field=["DEAL_DATE","业务区","渠道编码","渠道名称","总交易笔数","总缴费笔数","总缴费金额","其中总活动缴费笔数","总号卡笔数","其中2G号卡","累计营收金额","新增交易笔数","其中新增活动缴费笔数","其中新增号卡笔数","其中新增2G号卡","新增营收金额","注销时间","安全卡号"];

var title=[["帐期","业务区","渠道编码","渠道名称","总交易笔数","总缴费笔数","总缴费金额","其中总活动缴费笔数","总号卡笔数","2G号卡","累计营收金额","新增交易笔数","其中新增活动缴费笔数","其中新增号卡笔数","新增2G号卡","新增营收金额","注销时间","安全卡号"]];
var report = null;
var orderBy="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:16,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
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
	
	$("#searchBtn").click(function(){
		search(0);
	});
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
	
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var chanlCode=$("#chanlCode").val();
	var chanlName=$("#chanlName").val();
	
	var day=dealDate;
	var month=day.substring(0,6);
	
	
	var where=" where 1=1 ";
	var sql="SELECT "+day+" as deal_date, T.* FROM (                                                                                       "+
	"select decode(a.业务区,'A','昆明','B','大理','C','红河','D','曲靖','E','玉溪',                                                             "+
	"'F','楚雄','G','丽江','H','西双版纳','I','德宏','J','昭通','K','临沧','L','怒江','M','迪庆',                                                 "+
	"'N','保山','O','文山','P','普洱','其他') 业务区 ,                                                                                         "+
	"c.渠道编码 ,c.渠道名称,                                                                                                                  "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+")) then 1 else 0 end) 总交易笔数,                                                     "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 like '%费%') then 1 else 0 end) 总缴费笔数,                             "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 like '%费%') then nvl(交易金额,0)  else 0 end) 总缴费金额,                "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 ='存费送费') then 1 else 0 end) 其中总活动缴费笔数,                        "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 like '%号卡销售%' )then 1 else 0 end) 总号卡笔数,                         "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 = '2G号卡销售' )then 1 else 0 end) 其中2G号卡,                            "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+")) then nvl(交易金额,0) else 0 end) 累计营收金额,                                        "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) then 1 else 0 end) 新增交易笔数,                                                     "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) and 交易类型 ='存费送费'  then 1 else 0 end) 其中新增活动缴费笔数,                        "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) and 交易类型 like '%号卡销售%'  then 1 else 0 end) 其中新增号卡笔数,                     "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+") and 交易类型 = '2G号卡销售' )then 1 else 0 end) 其中新增2G号卡,                           "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) then nvl(交易金额,0) else 0 end) 新增营收金额,A.注销时间,C.PSAMID||' ' 安全卡号           "+
	" from ptemp.GAO_MINI_sale a , PTEMP.GAO_MINI_CHANNEL C  WHERE a.注销时间 IS NULL  AND C.数据时间 is null and A.PSAMID =C.PSAMID           "+
	" group by c.渠道编码 ,c.渠道名称,A.业务区,A.注销时间,C.PSAMID                                                                               "+
	"order by 新增营收金额 desc,新增交易笔数 desc,总交易笔数 desc ) T                                                                             ";

	/*查询条件*/
	if(regionCode!=null&&regionCode!=""){
		var regionName=$("#regionCode").find("option:selected").text().substring(0,2);
		where+=" AND T.业务区 LIKE '%"+regionName+"%'";
	}
	if(chanlCode!=null&&chanlCode!=""){
		where+=" AND T.渠道编码 = '"+chanlCode+"'";
	}
	if(chanlName!=null&&chanlName!=""){
		where+=" AND T.渠道名称 LIKE '%"+chanlName+"%'";
	}
	sql = sql + where;
	
	
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {orderBy
		sql += orderBy;
	}

	sql = "select * from(" + sql+")";

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
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	var sql="";
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var chanlCode=$("#chanlCode").val();
	var chanlName=$("#chanlName").val();
	
	var day=dealDate;
	var month=day.substring(0,6);
	
	
	var where=" where 1=1 ";
	var sql="SELECT "+day+" as deal_date, T.* FROM (                                                                                       "+
	"select decode(a.业务区,'A','昆明','B','大理','C','红河','D','曲靖','E','玉溪',                                                             "+
	"'F','楚雄','G','丽江','H','西双版纳','I','德宏','J','昭通','K','临沧','L','怒江','M','迪庆',                                                 "+
	"'N','保山','O','文山','P','普洱','其他') 业务区 ,                                                                                         "+
	"c.渠道编码 ,c.渠道名称,                                                                                                                  "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+")) then 1 else 0 end) 总交易笔数,                                                     "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 like '%费%') then 1 else 0 end) 总缴费笔数,                             "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 like '%费%') then nvl(交易金额,0)  else 0 end) 总缴费金额,                "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 ='存费送费') then 1 else 0 end) 其中总活动缴费笔数,                        "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 like '%号卡销售%' )then 1 else 0 end) 总号卡笔数,                         "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+") and 交易类型 = '2G号卡销售' )then 1 else 0 end) 其中2G号卡,                            "+
	"sum(case when(substr(交易时间,1,6)=to_char("+month+")) then nvl(交易金额,0) else 0 end) 累计营收金额,                                        "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) then 1 else 0 end) 新增交易笔数,                                                     "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) and 交易类型 ='存费送费'  then 1 else 0 end) 其中新增活动缴费笔数,                        "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) and 交易类型 like '%号卡销售%'  then 1 else 0 end) 其中新增号卡笔数,                     "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+") and 交易类型 = '2G号卡销售' )then 1 else 0 end) 其中新增2G号卡,                           "+
	"sum(case when(substr(交易时间,1,8)=to_char("+day+")) then nvl(交易金额,0) else 0 end) 新增营收金额,A.注销时间,C.PSAMID||' ' 安全卡号           "+
	" from ptemp.GAO_MINI_sale a , PTEMP.GAO_MINI_CHANNEL C  WHERE a.注销时间 IS NULL  AND C.数据时间 is null and A.PSAMID =C.PSAMID           "+
	" group by c.渠道编码 ,c.渠道名称,A.业务区,A.注销时间,C.PSAMID                                                                               "+
	"order by 新增营收金额 desc,新增交易笔数 desc,总交易笔数 desc ) T                                                                             ";

	/*查询条件*/
	if(regionCode!=null&&regionCode!=""){
		var regionName=$("#regionCode").find("option:selected").text().substring(0,2);
		where+=" AND T.业务区 LIKE '%"+regionName+"%'";
	}
	if(chanlCode!=null&&chanlCode!=""){
		where+=" AND T.渠道编码 = '"+chanlCode+"'";
	}
	if(chanlName!=null&&chanlName!=""){
		where+=" AND T.渠道名称 LIKE '%"+chanlName+"%'";
	}
	sql = sql + where;

	sql = "select "+field.join(",") + " from( "+sql+")";
	
	showtext = '迷你厅业务量按渠道统计表-'+day;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////