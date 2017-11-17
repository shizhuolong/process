var nowData = [];
var report = null;
var field=["DEAL_DATE","REGION_NAME_ABBR","UNIT_NAME","HR_ID","NAME","JOB","SALAY_NUM","AWARD_NUM","MERIT","KPI_COE","SALARY"];
var title=[["账期","地市","营服","HR编码","姓名","岗位","固定薪酬","专线奖励","绩效提成","KPI系数","薪酬"]];
var dealDate="";
var downSql="";
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
	var sql=getSql();
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
		var hr_id=$(this).find("TD:eq(3)").text();
		var gdxc=$(this).find("TD:eq(6)").text();
		var zxjl=$(this).find("TD:eq(7)").text();
		var jxtc=$(this).find("TD:eq(8)").text();
		var kpixs=$(this).find("TD:eq(9)").text();
		$(this).find("TD:eq(6)").html("<a hr_id='"+hr_id+"' style='color:blue;cursor:pointer;' onclick=gdxc(this)>"+gdxc+"</a>");
		$(this).find("TD:eq(7)").html("<a hr_id='"+hr_id+"' style='color:blue;cursor:pointer;' onclick=zxjl(this)>"+zxjl+"</a>");
		$(this).find("TD:eq(8)").html("<a hr_id='"+hr_id+"' style='color:blue;cursor:pointer;' onclick=jxtc(this)>"+jxtc+"</a>");
		$(this).find("TD:eq(9)").html("<a hr_id='"+hr_id+"' style='color:blue;cursor:pointer;' onclick=kpixs(this)>"+kpixs+"</a>");
	});
}

function gdxc(obj){
	var hr_id=$(obj).attr("hr_id");
	var sql="SELECT HR_NO,USER_NAME,POST_SALARY,ZH,ALL_NUM FROM PMRT.VIEW_MRT_CHNL_AWARD_MON WHERE DEAL_DATE="+dealDate+" AND HR_NO='"+hr_id+"'";
    var r=query(sql);
    var h="<thead><th style='background-color:#FC9513;color:white;height:25px;' colspan='2'>固定薪酬信息</th></thead><tbody>";
    if(r!=null&&r.length>0){
    	h+="<tr><td style='background-color:#FC9513;color:white;'>员工HR编码</td><td>"+r[0].HR_NO+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>姓名</td><td>"+r[0].USER_NAME+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>岗位工资</td><td>"+r[0].POST_SALARY+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>综合补贴</td><td>"+r[0].ZH+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>合计</td><td>"+r[0].ALL_NUM+"</td></tr></tbody>";
    }
    $("#detailTable").empty().append($(h));
	$("#detailDiv").show();
	$('#detailDiv').dialog({
		title : '固定薪酬信息',
		width : 350,
		height : 200,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function zxjl(obj){
	var hr_id=$(obj).attr("hr_id");
	var sql="SELECT HR_NO,USER_NAME,SPECIAL_PAY,ALL_NUM FROM PMRT.VIEW_MRT_CHNL_AWARD_MON WHERE DEAL_DATE="+dealDate+" AND HR_NO='"+hr_id+"'";
    var r=query(sql);
    var h="<thead><th style='background-color:#FC9513;color:white;height:25px;' colspan='2'>专项奖励信息</th></thead><tbody>";
    if(r!=null&&r.length>0){
    	h+="<tr><td style='background-color:#FC9513;color:white;'>员工HR编码</td><td>"+r[0].HR_NO+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>姓名</td><td>"+r[0].USER_NAME+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>专项奖励</td><td>"+r[0].SPECIAL_PAY+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>合计</td><td>"+r[0].SPECIAL_PAY+"</td></tr></tbody>";
    }
    $("#detailTable").empty().append($(h));
	$("#detailDiv").show();
	$('#detailDiv').dialog({
		title : '专项奖励信息',
		width : 350,
		height : 200,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function jxtc(obj){
	var hr_id=$(obj).attr("hr_id");
	var sql="SELECT HR_NO,USER_NAME		                         "+
	",PODS.GET_RADIX_POINT(UNIT_ALLJF, 2) AS UNIT_ALLJF		     "+
	",PODS.GET_RADIX_POINT(UNIT_SL_ALLJF, 2) AS UNIT_SL_ALLJF	 "+
	",PODS.GET_RADIX_POINT(WX_UNIT_CRE, 2) AS WX_UNIT_CRE		 "+
	",PODS.GET_RADIX_POINT(SERVICE_UNIT_JF, 2) AS SERVICE_UNIT_JF"+	
	",PODS.GET_RADIX_POINT(ALL_JF, 2) AS ALL_JF		             "+
	",PODS.GET_RADIX_POINT(ALL_JF, 2)*10 AS ALL_NUM		         "+
	"FROM PMRT.TB_JCDY_JF_ALL_MON		                         "+
	" WHERE DEAL_DATE="+dealDate+" AND HR_NO='"+hr_id+"'         ";
    var r=query(sql);
    var h="<thead><th style='background-color:#FC9513;color:white;height:25px;' colspan='2'>绩效提成信息</th></thead><tbody>";
    if(r!=null&&r.length>0){
    	h+="<tr><td style='background-color:#FC9513;color:white;'>公式</td><td>计薪积分*10</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>员工HR编码</td><td>"+r[0].HR_NO+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>姓名</td><td>"+r[0].USER_NAME+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>销售区域积分</td><td>"+r[0].UNIT_ALLJF+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>受理区域积分</td><td>"+r[0].UNIT_SL_ALLJF+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>维系区域积分</td><td>"+r[0].WX_UNIT_CRE+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>客服区域积分</td><td>"+r[0].SERVICE_UNIT_JF+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>计薪合计</td><td>"+r[0].ALL_JF+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;'>绩效提成</td><td>"+r[0].ALL_NUM+"</td></tr></tbody>";
    }
    $("#detailTable").empty().append($(h));
	$("#detailDiv").show();
	$('#detailDiv').dialog({
		title : '绩效提成信息',
		width : 350,
		height : 280,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function kpixs(obj){
	var hr_id=$(obj).attr("hr_id");
	var sql="SELECT HR_ID            "+
	"      ,NAME                     "+
	"      ,SCORE                    "+
	"      ,MAX_SCORE                "+
	"      ,MIN_SCORE                "+
	"      ,KPI_COE                  "+
	"FROM  PMRT.VIEW_MRT_CHNL_COE_MON"+
	" WHERE DEAL_DATE="+dealDate+" AND HR_ID='"+hr_id+"'";

    var r=query(sql);
    var h="<thead><th style='background-color:#FC9513;color:white;height:25px;' colspan='2'>KPI系数信息</th></thead><tbody>";
    if(r!=null&&r.length>0){
    	h+="<tr><td style='background-color:#FC9513;color:white;width:100px;'>公式</td><td>0.9+0.2*((本岗位KPI考核得分-同岗位KPI考核最低分）/（同岗位KPI最高分-同岗位KPI考核最低分))</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;width:100px;'>员工HR编码</td><td>"+r[0].HR_ID+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;width:100px;'>姓名</td><td>"+r[0].NAME+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;width:100px;'>考核得分</td><td>"+r[0].SCORE+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;width:100px;'>最高分</td><td>"+r[0].MAX_SCORE+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;width:100px;'>最低分</td><td>"+r[0].MIN_SCORE+"</td></tr>"
    	   +"<tr><td style='background-color:#FC9513;color:white;width:100px;'>KPI系数</td><td>"+r[0].KPI_COE+"</td></tr></tbody>";
    }
    $("#detailTable").empty().append($(h));
	$("#detailDiv").show();
	$('#detailDiv').dialog({
		title : 'KPI系数信息',
		width : 450,
		height : 280,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function getSql(){
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var name=$.trim($("#name").val());
	var hrId=$("#hrId").val();
	var where=" WHERE T.DEAL_DATE='"+dealDate+"'";
	if(orgLevel==3){
		where+=" AND T.HR_ID IN '"+_jf_power(hrId,dealDate)+"'";
	}
    if(regionCode!=""){
    	where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
    if(unitCode!=""){
    	where+=" AND T.UNIT_ID='"+unitCode+"'";
    }
    if(name!=""){
    	where+=" AND T.NAME LIKE '%"+name+"%'";
    }
    var sql="SELECT "+field.join(",")+" FROM PMRT.VIEW_MRT_CHNL_SALARY_MON T"+where+" ORDER BY T.GROUP_ID_1,T.UNIT_ID";
	return sql;                                      
}

function downsAll(){
	var showtext = "计算薪酬-"+dealDate;
	downloadExcel(downSql,title,showtext);
}
