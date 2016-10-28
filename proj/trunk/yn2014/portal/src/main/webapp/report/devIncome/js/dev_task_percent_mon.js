var nowData = [];
var title=[["地市","营服中心","HR编码","人员姓名","人员类型","任务指标","任务数","完成数","完成率"]
];
var field=["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","USER_TYPE_DESC","TAEGET_NAME","UP_TARGET_NUM","FINISH_DEV","PER_CENT"];
var orderBy = ' order by to_number(t.finish_dev/case to_number(nvl(t.UP_TARGET_NUM,0)) when 0 then -1 else to_number(nvl(t.UP_TARGET_NUM,0)) end   ) desc,t.HR_ID,t.USER_TYPE_DESC desc ';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:5,css:LchReport.RIGHT_ALIGN}],
		rowParams : ["HR_ID","USER_TYPE_DESC","TAEGET_NAME"],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			if(index==8){
				orderBy = " order by PER_CENT1 " + type + " ";
			}else{
				orderBy = " order by " + field[index] + " " + type + " ";
			}
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
	
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$("#userName").val();
	var targetName=$("#targetName").val();
		
	var view="";
	view+=" select t.DEAL_date,                                              ";
	view+="        t.DATE_VALUE task_mon,                                    ";
	view+="        t.group_id_1,                                             ";
	view+="        t.group_id_1_name,                                        ";
	view+="        t.unit_id,                                                ";
	view+="        t.unit_name,                                              ";
	view+="        t.TARGET_CODE,                                            ";
	view+="        t.TARGET_TYPE,                                            ";
	view+="        t.TAEGET_NAME,                                            ";
	view+="        to_number(nvl(t.UP_TARGET_NUM,0)) UP_TARGET_NUM,          ";
	view+="        t.USER_TYPE_DESC,                                         ";
	view+="        t.HR_ID,                                                  ";
	view+="        t.NAME,                                                   ";
	view+="        to_number(nvl(f.DEV,0)) finish_dev,                       ";
	view+="        f.deal_date finish_date,                                  ";
	view+="        case                                                      ";
	view+="          when to_number(nvl(t.UP_TARGET_NUM, 0)) = 0 then        ";
	view+="           '-' || '%'                                             ";
	view+="          else                                                    ";
	view+="           round(to_number(nvl(f.DEV, 0)) /                       ";
	view+="                 to_number(nvl(t.UP_TARGET_NUM, 0)),              ";
	view+="                 4) * 100 || '%'                                  ";
	view+="        end per_cent,                                             ";
	view+="        case                                                      ";
	view+="          when to_number(nvl(t.UP_TARGET_NUM, 0)) = 0 then        ";
	view+="           -1                                                     ";
	view+="          else                                                    ";
	view+="           round(to_number(nvl(f.DEV, 0)) /                       ";
	view+="                 to_number(nvl(t.UP_TARGET_NUM, 0)),              ";
	view+="                 4) * 100                                         ";
	view+="        end per_cent1                                             ";
	view+="                                                                  ";
	view+="   from V_PERSON_TASK_DETAIL t                                    ";
	view+="   left join V_PERSON_TASK_FINISH_DETAIL f                        ";
	view+="     on t.HR_ID = f.hr_no                                         ";
	view+="    and upper(t.TARGET_CODE) = upper(f.TARGET_CODE)               ";
	view+="  where t.DATE_VALUE = "+time+"                                   ";
	view+="    and f.deal_date = "+time+"                                    ";
	view+="    and t.TARGET_TYPE = 'devnum'                                  ";
	view+="    and t.TARGET_CODE in ('2gf', '3gf', '4gf')                    ";
	
//条件
	var sql = " from("+view+" ) t where 1=1 ";
	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(targetName!=''){
		sql+=" and t.TARGET_CODE = '"+targetName+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
		
	var csql = sql;
	var cdata = query("select count(*) total" + csql);
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

	sql = "select * " + sql;

	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
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
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$("#userName").val();
	var targetName=$("#targetName").val();
		
	var view="";
	view+=" select t.DEAL_date,                                              ";
	view+="        t.DATE_VALUE task_mon,                                    ";
	view+="        t.group_id_1,                                             ";
	view+="        t.group_id_1_name,                                        ";
	view+="        t.unit_id,                                                ";
	view+="        t.unit_name,                                              ";
	view+="        t.TARGET_CODE,                                            ";
	view+="        t.TARGET_TYPE,                                            ";
	view+="        t.TAEGET_NAME,                                            ";
	view+="        t.UP_TARGET_NUM,                                          ";
	view+="        t.USER_TYPE_DESC,                                         ";
	view+="        t.HR_ID,                                                  ";
	view+="        t.NAME,                                                   ";
	view+="        f.DEV finish_dev,                                         ";
	view+="        f.deal_date finish_date,                                  ";
	view+="        case                                                      ";
	view+="          when to_number(nvl(t.UP_TARGET_NUM, 0)) = 0 then        ";
	view+="           '-' || '%'                                             ";
	view+="          else                                                    ";
	view+="           round(to_number(nvl(f.DEV, 0)) /                       ";
	view+="                 to_number(nvl(t.UP_TARGET_NUM, 0)),              ";
	view+="                 4) * 100 || '%'                                  ";
	view+="        end per_cent                                              ";
	view+="                                                                  ";
	view+="   from V_PERSON_TASK_DETAIL t                                    ";
	view+="   left join V_PERSON_TASK_FINISH_DETAIL f                        ";
	view+="     on t.HR_ID = f.hr_no                                         ";
	view+="    and upper(t.TARGET_CODE) = upper(f.TARGET_CODE)               ";
	view+="  where t.DATE_VALUE = "+time+"                                   ";
	view+="    and f.deal_date = "+time+"                                    ";
	view+="    and t.TARGET_TYPE = 'devnum'                                  ";
	view+="    and t.TARGET_CODE in ('2gf', '3gf', '4gf')                    ";
	
//条件
	var sql = " select "+field.join(",")+" from("+view+" ) t where 1=1 ";
	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(targetName!=''){
		sql+=" and t.TARGET_CODE = '"+targetName+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	var showtext = '任务完成追踪分析';
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////