var nowData = [];

var title=[["地市","营业厅名称","营业厅编码","收入任务","毛利任务","发展任务","保有率任务","终端任务"]
];
var field=["GROUP_ID_1_NAME","GROUP_ID_4_NAME","HQ_CHAN_CODE","TASK_INCOME","TASK_GROSS","TASK_DEV","TASK_RETEN","TASK_TERMINAL"];
var orderBy = ' order by HQ_CHAN_CODE asc ';
var report = null;

var curPage=0;
$(function() {
	report = new LchReport({
		title : [title[0].concat(["操作"])],
		field : field.concat([""]),
		//css:[{gt:3,css:LchReport.RIGHT_ALIGN},{eq:8,css:LchReport.SUM_PART_STYLE}],
		rowParams : ["HQ_CHAN_CODE","DEAL_DATE","STATUS"],//第一个为rowId
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
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var busCode=$("#busCode").val();
//条件
	var sql = " from PMRT.TAB_MRT_BUS_LIST_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+dealDate;
	}
	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(busCode!=''){
		sql+=" AND T.HQ_CHAN_CODE ='"+busCode+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		sql+=" 1=2 "
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
		var orgLevel=$("#orgLevel").val();
		var status=$(this).attr("status");
		var dealDate=$(this).attr("deal_date");
		var busCode=$(this).attr("hq_chan_code");
		var curDealDate=$("#time").val();
		if(orgLevel==2&&(status==1 || dealDate==curDealDate)){
			var $oper=$(this).find("TD:last").html("<a href='javascript:void(0);' onclick='updateTask($(this).parent().parent())'>保存</a>");
			var $income=$(this).find("TD:eq(3)");
			$income.html("<input type='text' value='"+$income.text()+"'/>元");
			var $cross=$(this).find("TD:eq(4)");
			$cross.html("<input type='text' value='"+$cross.text()+"'/>元");
			var $dev=$(this).find("TD:eq(5)");
			$dev.html("<input type='text' value='"+$dev.text()+"'/>户");
			var $reten=$(this).find("TD:eq(6)");
			$reten.html("<input type='text' value='"+$reten.text()+"'/>%");
			var $terminal=$(this).find("TD:eq(7)");
			$terminal.html("<input type='text' value='"+$terminal.text()+"'/>户");
		
		}
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
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="";
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var busCode=$("#busCode").val();
//条件
	var sql = " from PMRT.TAB_MRT_BUS_LIST_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+dealDate;
	}
	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(busCode!=''){
		sql+=" AND T.HQ_CHAN_CODE ='"+busCode+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		sql+=" 1=2 "
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	sql = "select DEAL_DATE,"+field.join(",")+",LOGIN_NAME,INSERT_TIME,UPDAT_TIME "+ sql;
	
	var downTitle=[["账期"].concat(title[0]).concat(["修改人","排产时间","修改时间"])
	];
	showtext = '营业厅排产-'+dealDate;
	downloadExcel(sql,downTitle,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function updateTask($row){
	var dealDate=$row.attr("deal_date");
	var busCode=$row.attr("hq_chan_code");
	
	var income=$row.find("TD:eq(3)").find("INPUT").val();
	var cross=$row.find("TD:eq(4)").find("INPUT").val();
	var dev=$row.find("TD:eq(5)").find("INPUT").val();
	var reten=$row.find("TD:eq(6)").find("INPUT").val();
	var terminal=$row.find("TD:eq(7)").find("INPUT").val();
	
	if(isNaN(income)||income<0){
		alert("收入任务只能输入大于或等于0的数字");
		$row.find("TD:eq(3)").find("INPUT").focus();
		return ;//非负数--元
	}
	if(isNaN(cross)){
		alert("毛利任务只能输入数字");
		$row.find("TD:eq(4)").find("INPUT").focus();
		return ;//数字正负都可以--元
	}
	if(isNaN(dev)||dev<0||!/^\d+$/.test(dev+"")){
		alert("发展任务只能输入大于或等于0的整数");
		$row.find("TD:eq(5)").find("INPUT").focus();
		return ;//非负整数--户
	}
	if(isNaN(reten)||reten<0||reten>100){
		alert("保有率任务只能输入0到100的数字");
		$row.find("TD:eq(6)").find("INPUT").focus();
		return ;//[0-100]--%
	}
	if(isNaN(terminal)||terminal<0||!/^\d+$/.test(terminal+"")){
		alert("终端任务只能输入大于或等于0的数字");
		$row.find("TD:eq(7)").find("INPUT").focus();
		return ;//非负整数--户
	}
	
	$.ajax({
		type:"POST",
		dataType:'json',
		async:true,
		cache:false,
		url:$("#ctx").val()+"/taskManagement/busSchedule_updateTask.action",
		data:{
           "dealDate":dealDate,
           "busCode":busCode,
			"items.TASK_INCOME":income,
			"items.TASK_GROSS":cross,
			"items.TASK_DEV":dev,
			"items.TASK_RETEN":reten,
			"items.TASK_TERMINAL":terminal
	   	}, 
	   	success:function(data){
	   		if(data&&data.code=="OK"){
	   			alert("修改成功");
	   		}else{
	   			alert("修改失败");
	   		}
	   		search(curPage);
	    }
	});
}