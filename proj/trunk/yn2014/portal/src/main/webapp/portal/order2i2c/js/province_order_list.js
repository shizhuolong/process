var nowData = [];
var title=[["地市","任务编号","任务名称","订单数量","分配方式","状态","是否入集中系统","分配人","操作"]];
var field=["GROUP_ID_1_NAME","WORK_NO","WORK_NAME","WORK_ORDER_NUM","ASS_WAY","STATUS","JZ_STATUS","OPERATOR",""];
var report = null;
var curPage=0;
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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
	curPage=pageNumber;
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var regionCode=$("#regionCode").val();
	var status=$("#status").val();
	var taskNo=$("#taskNo").val();
	
	var sql="";
	sql+="   select                                                                                                                   ";
	sql+="       t.work_no,                                                                                                           ";
	sql+="       t.work_name,                                                                                                         ";
	sql+="       case t.ass_way when '1' then '内部团队'||t.inner_num||'%'                                                              ";
	sql+="         else '内部团队订单绝对值量'||t.inner_num end ASS_WAY,                                                                  ";
	sql+="       decode(t.status,1,'待审批',2,'审批通过',3,'审批通过',0,'作废') status,                                                    ";
	sql+="       decode(t.jz_status,1,'已入集中系统',0,'未入集中系统') jz_status,                                                          ";
	sql+="       t.group_id_1_name,                                                                                                   ";
	sql+="       t.operator,                                                                                                          ";
	sql+="       (SELECT COUNT(T1.ORDER_NO) FROM  PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1 WHERE T1.WORK_NO=T.WORK_NO) WORK_ORDER_NUM     ";
	sql+="   from                                                                                                                     ";
	sql+="   PODS.TAB_ODS_2I2C_ASS_TASK t                                                                                             ";
	sql+="   where  1=1                                                                                                               ";
	if(regionCode!=''){
		sql+=" and t.group_id_1 ='"+regionCode+"'";
	}
	if(status!=''){
		sql+=" and t.status in "+status+"    ";
	}
	if(taskNo!=''){
		sql+=" and t.work_no ='"+taskNo+"'  ";
	}
	sql+="   order by  t.insert_time desc                                                                                             ";
	
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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
		
		var $td2=$(this).find("TD:eq(2)");
		var text=$td2.text();
		$td2.html("<a href='javascript:void(0);'>"+text+"</a>");
		$td2.click(function(){
			var workNo=$(this).parent().find("TD:eq(1)").text();
			var url=$("#ctx").val()+"/portal/order2i2c/jsp/distribute_view.jsp?workNo="+workNo;
			art.dialog.open(url,{
				title:'分配详情',
				width:'80%',
				height:410
			});
		});
		
		var $operTd=$(this).find("TD:last");
		var status=$(this).find("TD:eq(5)").text();
		if(status=='待审批'){
			var $agree=$("<a>同意</a>");
			var $cancel=$("<a>作废</a>");
			var $redis=$("<a>重新分配</a>");
			
			$agree.click(function(){
				var workNo=$(this).parent().parent().find("TD:eq(1)").text();
				agree(workNo);
			});
			$cancel.click(function(){
				var workNo=$(this).parent().parent().find("TD:eq(1)").text();
				cancel(workNo);
			});
			$redis.click(function(){
				var workNo=$(this).parent().parent().find("TD:eq(1)").text();
				redis(workNo);
			});
			
			$operTd.empty()
			.append($agree).append(" | ")
			.append($cancel).append(" | ")
			.append($redis);
			
		}
		
	});
	/////////////////////////////////////////////////////
	$("#lch_DataBody").find("TR").each(function(){
		
	});
}
function agree(workNo){
	if(!confirm("确定审批通过？")) return;
	$.ajax({
		type:"POST",
		async:true,
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!provinceAgree.action",
		data:{
		   "workNo":workNo
	   	}, 
	   	success:function(data){
	   		alert(data.msg);
	   		if(data.ok)
	   		search(curPage);
	   	},
	   	error:function(){
	   		alert("出错！");
		}
	});
}
function cancel(workNo){
	if(!confirm("确定作废？")) return;
	$.ajax({
		type:"POST",
		async:true,
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!provinceCancel.action",
		data:{
		   "workNo":workNo
	   	}, 
	   	success:function(data){
	   		alert(data.msg);
	   		if(data.ok)
	   		search(curPage);
	   	},
	   	error:function(){
	   		alert("出错！");
		}
	});
}
function redis(workNo){
	var url=$("#ctx").val()+"/portal/order2i2c/jsp/province_distribute.jsp?workNo="+workNo;
	art.dialog.open(url,{
		id:'redisDlg',
		title:'重新分配',
		width:'80%',
		height:410
	});
}