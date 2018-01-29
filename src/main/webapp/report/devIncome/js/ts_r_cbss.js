var nowData = [];
var title=[["地市","营业厅名称","渠道编号","HR编码","厅长姓名","厅终端毛利","厅终端毛利分享额度<br/>（厅终端毛利*50%）","厅终端毛利可分享积分额度<br/>（厅终端毛利分享额度/10）","厅本月可用成本额度<br/>（厅终端毛利*25%）","操作"]];
var field=["AREA","CHANNEL_NAME","CHANNEL_ID","HR_ID","HR_ID_NAME","ZDML","ZDMLFX_FEE","ZDMLFX_JF","CB_FEE","OPERATE"];
var orderBy = " ORDER BY GROUP_ID_1,CHANNEL_ID";
var report = null;
var downSql="";
var initDate="";
var dealDate="";
$(function() {
	initDate=$("#dealDate").val();
	$("#dealDate").val(getMaxDate("PMRT.TAB_MRT_TS_R_CBSS"));
	$("#dealDate").blur(function(){
		search(0);
	});
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:2,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],
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
	dealDate=$("#dealDate").val();
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var sql=getSql(orgLevel,code);
	downSql=getDownSql(orgLevel,code);
	sql+= orderBy;
	downSql+=orderBy;
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var showtext = '自营厅终端顺价销售积分表-'+dealDate;
    title=[["地市","营业厅名称","渠道编号","HR编码","厅长姓名","厅终端毛利","厅终端毛利分享额度（厅终端毛利*50%）","厅终端毛利可分享积分额度（厅终端毛利分享额度/10）","厅本月可用成本额度（厅终端毛利*25%）"]];
	downloadExcel(downSql,title,showtext);
}

function getSql(orgLevel,code){
	var field1=["AREA","CHANNEL_NAME","CHANNEL_ID","HR_ID","HR_ID_NAME","ZDML","ZDMLFX_FEE","ZDMLFX_JF","CB_FEE"];
	if(orgLevel==1){
		return " SELECT "+field1.join(",")+",'' OPERATE FROM PMRT.TAB_MRT_TS_R_CBSS WHERE 1=1 AND DEAL_DATE='"+dealDate+"'";
	}else if(orgLevel==2){
		return " SELECT "+field1.join(",")+",'' OPERATE FROM PMRT.TAB_MRT_TS_R_CBSS WHERE 1=1 AND DEAL_DATE='"+dealDate+"' AND GROUP_ID_1='"+code+"'";
	}else{
		if(isCanEdit()){
			return " SELECT "+field1.join(",")+",'<a style=\"color:blue;\" channel_id='"+"|| CHANNEL_ID ||"+"' area='"+"|| AREA || "+"' channel_name='"+"|| CHANNEL_NAME || "+"' zdmlfx_jf='"+"|| TO_CHAR(ZDMLFX_JF,'FM99990.99999') || ' onclick=\"toEdit(this);\">分配</a>' OPERATE FROM PMRT.TAB_MRT_TS_R_CBSS WHERE 1=1 AND DEAL_DATE='"+dealDate+"' AND UNIT_ID IN("+_unit_relation(code)+")";
		}else{
			return " SELECT "+field1.join(",")+",'' OPERATE FROM PMRT.TAB_MRT_TS_R_CBSS WHERE 1=1 AND DEAL_DATE='"+dealDate+"' AND UNIT_ID IN("+_unit_relation(code)+")";
		}
	}
}

function getDownSql(orgLevel,code){
	var field1=["AREA","CHANNEL_NAME","CHANNEL_ID","HR_ID","HR_ID_NAME","ZDML","ZDMLFX_FEE","ZDMLFX_JF","CB_FEE"];
	if(orgLevel==1){
		return " SELECT "+field1.join(",")+" FROM PMRT.TAB_MRT_TS_R_CBSS WHERE 1=1 AND DEAL_DATE='"+dealDate+"'";
	}else if(orgLevel==2){
		return " SELECT "+field1.join(",")+" FROM PMRT.TAB_MRT_TS_R_CBSS WHERE 1=1 AND DEAL_DATE='"+dealDate+"' AND GROUP_ID_1='"+code+"'";
	}else{
		return " SELECT "+field1.join(",")+" FROM PMRT.TAB_MRT_TS_R_CBSS WHERE 1=1 AND DEAL_DATE='"+dealDate+"' AND UNIT_ID IN("+_unit_relation(code)+")";
	}
}

function isCanEdit(){
	var day=$("#day").val().substr(6,8); 
	if(parseInt(day)<=24){
		if(initDate==dealDate){
			var hrId=$("#hrId").val();
			var s=" SELECT HR_ID FROM PMRT.TAB_MRT_TS_R_CBSS WHERE DEAL_DATE='"+dealDate+"' AND HR_ID='"+hrId+"'";//hrId存在才有修改权限
			var r=query(s);
			if(s&&s.length>0){
				return true;
			}
			return false;
		}
	}
	return false;
}

function toEdit(obj){
	var area=$(obj).attr("area");
	var channel_name=$(obj).attr("channel_name");
	var channel_id=$(obj).attr("channel_id");
	var zdmlfx_jf=$(obj).attr("zdmlfx_jf");
	art.dialog.data('dealDate',dealDate);
	art.dialog.data('area',area);
	art.dialog.data('channel_name',channel_name);
	art.dialog.data('channel_id',channel_id);
	art.dialog.data('zdmlfx_jf',zdmlfx_jf);
	var url = $("#ctx").val()+"/report/devIncome/jsp/ts_r_cbss_update.jsp";
	art.dialog.open(url,{
		id:'update',
		width:'6000px',
		/*height:'1000px',*/
		padding:'0 0',
		lock:true,
		resize:false,
		title:'录入'
	});
}
