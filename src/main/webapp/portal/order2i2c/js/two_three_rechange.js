var nowData = [];
var title=[["系统单号","城市","号码","导入次数(第几次导入)","外呼前余额","联系电话","类型","活动开始时间","活动结束时间","实时余额","回访人","回访时间","回访失败","回访成功"]];
var field=["ID","CITY_NAME","DEVICE_NUMBER","INPUT_NUM","BALANCE","CONNECT_PHONE","CON_TYPE","START_TIME","END_TIME","FEE","NAME","VISIT_TIME","IS_FAIL","IS_SUCC"];

var orderBy="";
var report = null;
var downSql="";
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
$(function() {
	report = new LchReport({
		title : [["外呼记录"].concat(title[0])],
		field : [""].concat(field),
		rowParams : ["ID"],//第一个为rowId
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};  
		},
		orderCallBack : function(index, type) {
			search(0);
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
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var deviceNumber=$("#deviceNumber").val();
	var userId=$("#userId").val();
	orderBy = " ORDER BY DEVICE_NUMBER ,INPUT_NUM DESC";
	var sql="SELECT ID                    "+
	"      ,CITY_NAME                      "+
	"      ,DEVICE_NUMBER                  "+
	"      ,INPUT_NUM                      "+
	"      ,BALANCE                        "+
	"      ,CONNECT_PHONE                  "+
	"      ,CON_TYPE                       "+
	"      ,START_TIME                     "+
	"      ,END_TIME                       "+
	"      ,FEE                            "+
	"      ,NAME                           "+
	"      ,VISIT_TIME                     "+
	"      ,IS_FAIL                        "+
	"      ,IS_SUCC                        "+
	"FROM PMRT.VIEW_MRT_2I2C_VISIT_DETAIL  "+
	" WHERE DEAL_DATE="+dealDate +
	" AND NAME_ID='"+userId+"' ";
	if(deviceNumber!=''){
		sql+=" AND DEVICE_NUMBER='"+deviceNumber+"'       ";
	}
	//排序
	if (orderBy != '') {
		sql ="SELECT * FROM ("+sql+")"+ orderBy;
	}
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt ) ttt where ttt.r>" + start +"and r<=" + end;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	if(total<=0) return ;
		$("#lch_DataBody").find("TR").each(function(){
			var $oper=$(this).find("TD:eq(0)");
			var id=$oper.parent().attr("id");
			var $a=$("<a href='javascript:void(0);' onclick='showVisit(\""+id+"\")'>查看</a>");
			$oper.empty().html($a);
		});
}

function addVisit(orderNo){
	var outName=$("#outName").val();
	var remark=$("#remark").val();
	var other_cause=$("#other_cause").val();
	var sql="INSERT INTO PODS.TAB_ODS_2I2C_REMARK SELECT SYSDATE,'"+orderNo+"','"+outName+"','"+remark+"','"+other_cause+"','3' FROM DUAL";
	var d=query(sql);
	art.dialog({id:'d'+orderNo}).close();
	showVisit(orderNo);
}

function showVisit(orderNo){
	var d=query("select * from PODS.TAB_ODS_2I2C_REMARK where order_no='"+orderNo+"' order by insert_time desc");
	
	if(d==null) d=[];
	
	var h="";
	
	h+="<table style='margin-top:12px;' class='lch_DataBody'><tr>";
	h+="<td>外呼状态<select class='default-text-input wper80' id='outName'>"+listOutName()+"</select></td></tr>";
	h+="<tr><td>其他原因<textarea cols=20 rows=2 id='other_cause'></textarea></td>";
	h+="<tr><td>外呼描述<textarea cols=20 rows=2 id='remark'></textarea></td>";
	h+="<tr><td><a class='default-btn  mr10' href='#' onclick='addVisit(\""+orderNo+"\")' id='addBtn'>添加</a></td>";
	h+="</tr></table>";
	
	h+="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
	+"<table><thead class='lch_DataHead'><tr><th>外呼时间</th><th>外呼状态</th><th>外呼描述</th><th>其他原因</th></tr></thead><tbody class='lch_DataBody'>";
	for(var i=0;i<d.length;i++){
		h=h+"<tr><td>"+isNull(d[i]["INSERT_TIME"])+"</td><td>"+isNull(d[i]["OUTBOUND"])+"</td><td>"+isNull(d[i]["REMARK"])+"</td><td>"+isNull(d[i]["OTHER_CAUSE"])+"</td></tr>";
	}
	if(d.length==0){
		h+="<tr><td colspan=4>暂无记录</td></tr>";
	}
	h+="</tbody>"
	+"</table>";
	
	art.dialog({
		title: '外呼记录',
		id:'d'+orderNo,
		content: h,
		padding: 0,
		lock:true
	});
}

function listOutName(){
	var sql = "SELECT DISTINCT T.OUT_NAME FROM PODS.TAB_ODS_2I2C_OUTBOUND T WHERE T.IS_TYPE=3 AND T.OUT_NAME IS NOT NULL";
	var h = '';
	var d=query(sql);
	if (d) {
		for (var i = 0; i < d.length; i++) {
			h += '<option value="' + d[i].OUT_NAME + '">' + d[i].OUT_NAME + '</option>';
		}
	}
	return h;
}

function exportAll(){
	downloadExcel(downSql,title,"二三充回访明细");
}

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}