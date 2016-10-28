var field=["DEAL_DATE",
           "GROUP_ID_1_NAME",
           "UNIT_NAME",
           "HQ_CHAN_CODE",
           "GROUP_ID_4_NAME",
           "NAME",
           "HR_ID",
           "USER_ROLE",
           "MANU",
           "TELETYPE",
           "SUB_ORDER",
           "ORDER_PRICE",
           "ORDER_MONEY",
           "ORDER_AMOUNT",
           "CRE",
           "ALL_CRE"];
var title=[["账期",
            "地市",
            "营服中心",
            "渠道编码",
            "渠道名称",
            "用户姓名",
            "HR编码",
            "用户角色",
            "品牌",
            "机型",
            "订单号",
            "订货单价",
            "订单金额",
            "订单数",
            "积分",
            "总积分" ]];
var nowData = [];
var orderBy = ' order by GROUP_ID_1_NAME,UNIT_NAME,NAME,SUB_ORDER ';
var report = null;
$(function() {
	listManus();
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
	var channlName=$("#channlName").val();
	var userName=$("#userName").val();
	var manu=$("#manu").val();
	//条件
	var sql = " FROM pmrt.TB_MRT_JCDY_WYG_MON T WHERE  T.DEAL_DATE="+time;
	
	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(channlName!=''){
		sql+=" and t.GROUP_ID_4_NAME like '%"+channlName+"%'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(manu!=''){
		sql+=" and t.MANU ='"+manu+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
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
function listManus(){
	var sql="";
	//条件
	var sql = "select distinct t.MANU MANU from pmrt.TB_MRT_JCDY_WYG_MON t where 1=1 ";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].MANU
					+ '" selected >'
					+ d[0].MANU + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].MANU + '">' + d[i].MANU + '</option>';
			}
		}
		var $area = $("#manu");
		var $h = $(h);
		$area.empty().append($h);
	} else {
		alert("获取信息失败");
	}
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
	var channlName=$("#channlName").val();
	var userName=$("#userName").val();
	var manu=$("#manu").val();
	//条件
	var sql = " from pmrt.TB_MRT_JCDY_WYG_MON t where  t.DEAL_DATE="+time;

	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(channlName!=''){
		sql+=" and t.GROUP_ID_4_NAME like '%"+channlName+"%'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(manu!=''){
		sql+=" and t.MANU ='"+manu+"'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select "+field.join(",")+ sql;
	showtext = '沃易购众筹积分明细-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////