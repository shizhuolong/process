var nowData = [];
var title=[["地市","营服中心","固定薪酬","基础kpi绩效","积分提成奖励","专项奖励","薪酬合计","实发数","全省排名"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","FIXED_SALARY","BASE_SALARY","JF_SALARY","SPECIAL_AWARD","ALL_SALARY","FACT_TOTAL","PRO_RANK"];
var orderBy = ' ORDER BY  ALL_SALARY DESC ';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
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
	
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize =12;
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
	
	var time=$("#month").val();
//条件
	var sql =   "select T.GROUP_ID_1_NAME,                      "+
				"       T.UNIT_NAME,                            "+
				"       T.FIXED_SALARY,                         "+
				"       T.BASE_SALARY,                          "+
				"       T.JF_SALARY,                            "+
				"       T.ALL_SALARY,                           "+
				"       T.SPECIAL_AWARD,                        "+
				"       T1.FACT_TOTAL,                          "+
				"       T1.PRO_RANK                             "+
				"  from (select GROUP_ID_1,                     "+
				"               GROUP_ID_1_NAME,                "+
				"               UNIT_ID,                        "+
				"               UNIT_NAME,                      "+
				"               SUM(FIXED_SALARY) FIXED_SALARY, "+
				"               SUM(BASE_SALARY) BASE_SALARY,   "+
				"               SUM(JF_SALARY) JF_SALARY,       "+
				"               SUM(ALL_SALARY) ALL_SALARY,     "+
				"               SUM(SPECIAL_AWARD) SPECIAL_AWARD"+
				"          from PMRT.TB_MRT_JCDY_HR_SALARY_MON T"+
				"         where 1 = 1                           ";
	var join=   " left join (select GROUP_ID_1,                                     "+
				"                    UNIT_ID,                                      "+
				"                    sum(FACT_TOTAL) FACT_TOTAL,                   "+
				"               RANK() OVER(ORDER BY SUM(FACT_TOTAL) DESC) PRO_RANK"+
				"               from PODS.TB_ODS_JCDY_HR_SALARY                    "+
				"              where 1 = 1                                         ";
	var sqlGroup=" GROUP BY GROUP_ID_1, GROUP_ID_1_NAME, UNIT_ID, UNIT_NAME";
	var sqlOrder="  ORDER BY ALL_SALARY DESC ";
	var joinGroup="   GROUP BY GROUP_ID_1, UNIT_ID ";
	if(time!=''){
		sql+=" and DEAL_DATE= '"+time+"'";
		join+=" and  DEAL_DATE= '"+time+"'";
		
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and  GROUP_ID_1="+code;
		join+=" and  GROUP_ID_1="+code;
	}
	
	var resultSql = sql + sqlGroup + sqlOrder + ") T" + join + joinGroup +") T1 ON T.UNIT_ID = T1.UNIT_ID ";
	alert(resultSql);
	var csql = resultSql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	
	sql = "select ttt.* from ( select tt.*,rownum r from ( " + resultSql
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
