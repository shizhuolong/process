var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","HR_NO","USER_NAME","HQ_CHAN_CODE","HQ_NAME","OPERATOR_ID","BUSI_ID","BUSI_DESC","SLL","BIGBUSI_CODE","BIGBUSI_DESC","CRE","SLCRE","UNIT_RATIO","UNTI_CRE","SVR_RATIO","SVR_CRE","UNIT_MONEY"];
var title=[['帐期','地市名称','营服中心','HR编码','人员姓名','渠道编码','渠道名称','操作员编码','业务编码','业务描述','受理量','业务大类','业务大类描述','原始积分','受理积分','区域调节系数','区域调节积分','服务调节系数','服务调节积分','积分金额']];
var nowData = [];
var report=null;
$(function() {
	 report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
		//css:[{gt:5,css:LchReport.RIGHT_ALIGN}],
		content : "content",
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
	
	var sql = getSql();
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
	//权限
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var hrId = $("#hrId").val();
	//条件
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var regionCode = $("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var userName = $("#userName").val();
	var itemdesc = $("#itemdesc").val();
	
	
	var sql=  
			" SELECT T.DEAL_DATE,                                          "+
			"        T.AREA_NAME,                                          "+
			"        T.UNIT_NAME,                                          "+
			"        T.HR_NO,                                              "+
			"        T.USER_NAME,                                          "+
			"        T.HQ_CHAN_CODE,                                       "+
			"        T.HQ_NAME,                                            "+
			"        T.OPERATOR_ID,                                        "+
			"        T.BUSI_ID,                                            "+
			"        T.BUSI_DESC,                                          "+
			"        T.SLL,                                                "+
			"        T.BIGBUSI_CODE,                                       "+
			"        T.BIGBUSI_DESC,                                       "+
			"        T.CRE,                                                "+
			"        T.SLCRE,                                              "+
			"        T.UNIT_RATIO,                                         "+
			"        T.UNTI_CRE,                                           "+
			"        T.SVR_RATIO,                                          "+
			"        T.SVR_CRE,                                            "+
			"        T.UNIT_MONEY                                          "+
			"   FROM PMRT.TB_MRT_JCDY_SLJF_INFO_DAY T                      "+
			"  WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' ";

	if(orgLevel==1){
		
	}else if(orgLevel == 2){
		sql += " AND GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel == 3) {
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else {
		sql += " 1=2 ";
	}	
			
	if(regionCode!=''){
		sql+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+= " AND USER_NAME LIKE '%"+userName+"%'";
	}
	if(itemdesc!=''){
		sql+= " AND T.BUSI_DESC LIKE '%"+itemdesc+"%'";
	}
	sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var sql = getSql();
	showtext = '营业人员积分日明细-('+startDate+"~"+endDate+")";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////














/*jQuery(function(){
	var cols = ["deal_date","area_name","unit_name","hr_no","user_name",
	            "hq_chan_code","hq_name","operator_id","busi_id","busi_desc","sll","bigbusi_code",
	            "bigbusi_desc","cre","slcre","unit_ratio","unti_cre","svr_ratio","svr_cre","unit_money"];
	//excel导出
	$("#exceldown").click(downsAll);
	regionSelect();
	*//**
	 * 此方法和main.js中的方法重叠【2013-06-25】
	 *//*
	$("#boxselect li input").click(function(){
	//$("#boxselect li input").on("click",function(){
		if($(this).is( ":checked" )){
			$(this).parent().parent().parent().find(".ct").find(".tmp").remove();
			$(this).parent().parent().parent().find(".ct").find("."+$(this).attr("class")).remove();
			$(this).parent().parent().parent().find(".ct").append("<span class='"+$(this).attr("class")+"' >"+$(this).val()+",</span>");
		}else{
			$(this).parent().parent().parent().find(".ct").find("."+$(this).attr("class")).remove();
		}
		if($("#boxselect input:checked ").length == 0){
			$(this).parent().parent().parent().find(".ct").append("<span class='tmp' >全部</span>");
		} 
	});
	var _limit=20;
	var startDate = deal_date;
	var endDate = deal_date;
	var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.HR_NO,T.USER_NAME,T.HQ_CHAN_CODE," +
			"T.HQ_NAME,T.OPERATOR_ID,T.BUSI_ID,T.BUSI_DESC,T.SLL,T.BIGBUSI_CODE,T.BIGBUSI_DESC," +
			"T.CRE,T.SLCRE,T.UNIT_RATIO,T.UNTI_CRE,T.SVR_RATIO,T.SVR_CRE,T.UNIT_MONEY " +
			"FROM PMRT.TB_MRT_JCDY_SLJF_INFO_DAY T " +
			"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' ";
			if(group_level == 1) {
			}else if(group_level==2) {
				sql += "AND T.GROUP_ID_1 = '"+group_id+"' ";
			}else if(group_level == 3) {
				sql += "AND T.UNIT_ID = '"+group_id+"' ";
			}else {
				sql += " 1=2 ";
			}
			sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	init(sql);
	function init(sql){ 
		var head="";
		head +="<tr class='attend_th'>" +
				"<th class='attend_th'>帐期</th><th class='attend_th'>地市名称</th>" +
				"<th class='attend_th'>营服中心</th><th class='attend_th'>HR编码</th>" +
				"<th class='attend_th'>人员姓名</th><th class='attend_th'>渠道编码</th>" +
				"<th class='attend_th'>渠道名称</th><th class='attend_th'>操作员编码</th>" +
				"<th class='attend_th'>业务编码</th><th class='attend_th'>业务描述</th>" +
				"<th class='attend_th'>受理量</th><th class='attend_th'>业务大类</th>" +
				"<th class='attend_th'>业务大类描述</th><th class='attend_th'>原始积分</th>" +
				"<th class='attend_th'>受理积分</th><th class='attend_th'>区域调节系数</th>" +
				"<th class='attend_th'>区域调节积分</th><th class='attend_th'>服务调节系数</th>" +
				"<th class='attend_th'>服务调节积分</th>" +
				"<th class='attend_th'>积分金额</th>" +
				"</tr>";
		$("#tableData thead").empty(); 
		$("#tableData tbody").empty(); 
		$("#tableData thead").append(head);
		addTab(sql);
	}
	$("#search").click(function(){   
		$("#page-layer").remove();
		var startDate = $.trim($("#startTime").val());
		var endDate = $.trim($("#endTime").val());
		var unit_name = $.trim($("#unit_name").val());
		var user_name = $.trim($("#user_name").val());
		var itemdesc=$.trim($("#itemdesc").val());
		var fsql = getSelect();
		var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.HR_NO,T.USER_NAME,T.HQ_CHAN_CODE," +
		"T.HQ_NAME,T.OPERATOR_ID,T.BUSI_ID,T.BUSI_DESC,T.SLL,T.BIGBUSI_CODE,T.BIGBUSI_DESC," +
		"T.CRE,T.SLCRE,T.UNIT_RATIO,T.UNTI_CRE,T.SVR_RATIO,T.SVR_CRE,T.UNIT_MONEY " +
		"FROM PMRT.TB_MRT_JCDY_SLJF_INFO_DAY T " +
		"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' " + fsql;
		if(group_level == 1) {
		}else if(group_level==2) {
			sql += " AND T.GROUP_ID_1 = '"+group_id+"' ";
		}else if(group_level == 3) {
			sql += " AND T.UNIT_ID = '"+group_id+"' ";
		}else {
			sql += " 1=2 ";
		}
		if(unit_name != "") {
			sql += " AND T.UNIT_NAME LIKE '%"+unit_name+"%' ";
		}
		if(user_name != "") {
			sql += " AND T.USER_NAME LIKE '%"+user_name+"%' ";
		}
		if(itemdesc!=""){
			sql+=" AND BUSI_DESC LIKE '%"+itemdesc+"%' ";
		}
		sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
		init(sql);
	});
	
	// 加载表格和分页组件
	function addTab(sql) {
		pageData($("#data"), "", sql, -1, function(res) {
			var len = res.length;
			_layer = _createLayer($("#data"), "", sql);
			if (len < _limit) {// 分页两种形式
					resetCount(_layer, len);
				} else {
					pageCount(_layer, sql);
				}
			});
	}
	// 创建分页组件
	function _createLayer(dom, head, sql) {
		var attachDom = $('#ana-img-buttons');
		var _pageLayer = new $.PageLayer(attachDom, {
			oncreate : function() {
				$(this.layer).css( {
					left :8
				});
			},
			go : function(opt) { 
				pageData($(dom), head, sql, opt.first, opt.callback);
			}
		});

		return _pageLayer;
	}
	// 每页条数
	function pageData(dom, head, sql, first, callback) {
		doFetch(3002, {
			type :1,
			data : {
				query :sql,
				first :first,
				limit :_limit
			}
		}, function(res) {
			_renderTable(head, res);
			if ($.isFunction(callback))
				callback.call(this, res);
		}, "正在加载,请稍后...", $(".work-div"));
	}

	// 总页数
	function pageCount(layer, sql) {
		var array_values = [];
		doFetch(3002, {
			type :2,
			data : {
				query :sql
			}
		}, function(res) {
			if (res == undefined || res == null || res == '') {
				click_flag = 0;
				alert("对不起，暂且没有匹配的数据!");
				return;
			} else {
				resetCount(layer, res);
			}
		}, "正在加载,请稍后...", $("#ana-img-buttons"));
	}
	// 渲染数据表
	function _renderTable(head, data) {
		if (data == undefined || data == null || data == '') {
			alert("对不起，暂且没有匹配的数据!");
			$("#tableData tbody").empty().append("<tr><td colspan='37' style='text-align: center;'>没有查询到您想要的数据</td></tr>");
			return;
		} else {
			renderTable(head, data);
		}
	}
	// 重置
	function resetCount(layer, count) {
		layer.reset( {
			count :count,
			limit :_limit
		});
		layer.show();
	}
	function renderTable(head, data) {
		$("#tableData tbody").empty();
		var res = "";
		var colNum = data[0].length;
		$.each(data, function(i, strn) {
			res += "<tr>";
			for ( var j = 0; j < colNum - 1; j++) {
				if(j > 12 && (strn[j]==null || strn[j]=="0" || strn[j]=="")){
					res += "<td style='text-align: left'>0</td>";   
				}else{
					if(strn[j] == null || strn[j] == "") {
						res += "<td style='text-align: left;'>&nbsp;</td>";
					}else {
						res += "<td style='text-align: left;'>" + strn[j] + "</td>";
					}
				}
			}  
			res += "</tr>";
		});
		$("#tableData tbody").append(res);
		$("#tableData tr:visible:even").addClass("spec");
	}
});

function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$(".work-div"));
}

function _execute(type, parameter, callback, msg, dom) {   
	$.Project.execute(type, parameter, callback, msg, dom);
}
// 执行查询
function doFetch(type, parameter, callback, msg, dom) {
	$.Project.execute(type, parameter, callback, msg, dom);
}
function regionSelect(){
	var sql = "";
	if(group_level == 2) {
		sql = "SELECT T.GROUP_ID_1, T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE T " +
				"WHERE T.GROUP_ID_1 = '"+group_id+"'";
	}else if(group_level == 3) {
		sql = "SELECT T.REGION_CODE AS GROUP_ID_1, T.REGION_NAME AS GROUP_ID_1_NAME " +
				"FROM PORTAL.APDP_ORG T WHERE T.ORGLEVEL = 3 AND T.CODE = '"+group_id+"'";
	}else if(group_level == 4) {
		sql = "SELECT T.REGION_CODE AS GROUP_ID_1, T.REGION_NAME AS GROUP_ID_1_NAME " +
				"FROM PORTAL.APDP_ORG T WHERE T.ORGLEVEL = 4 AND T.CODE = '"+group_id+"'";
	}else {
		sql = "SELECT T.GROUP_ID_1, T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE T " +
		"WHERE T.GROUP_ID_1 NOT IN ('16099', '86000') ORDER BY T.GROUP_ID_1";
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/public!queryList.action",
		data:{sql:sql},
		success:function(data){
			for(var i=0; i<data.length; i++){
				$("#boxselect").append("<li><input type='checkbox' class='"+data[i]["group_id_1_name"]+"' " +
						"value='"+data[i]["group_id_1_name"]+"' textvalue='"+data[i]["group_id_1"]+"' />"+data[i]["group_id_1_name"]+"</li>");
			}
		}
	});
}
function getSelect() {
	var filter = "";
	var selectStr = "";
	var sp = $("#boxselect input:checked ");
	var strLength = sp.length;
	if(strLength !=0 ){
		$.each(sp,function(i){
			if(i != strLength-1) {
				selectStr += "'" + $(this).attr("textvalue") +"' ,";
			}else {
				selectStr += "'" + $(this).attr("textvalue") +"'";
			}
		});
	}
	if(selectStr.length != 0){
		filter = " and T.group_id_1 in ("+selectStr+") ";
	} 
	return filter;
}

//导出excel
function downsAll(){
	
	var startDate = $.trim($("#startTime").val());
	var endDate = $.trim($("#endTime").val());
	var unit_name = $.trim($("#unit_name").val());
	var user_name = $.trim($("#user_name").val());
	var itemdesc=$.trim($("#itemdesc").val());
	var fsql = getSelect();
	var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.HR_NO,T.USER_NAME,T.HQ_CHAN_CODE," +
	"T.HQ_NAME,T.OPERATOR_ID,T.BUSI_ID,T.BUSI_DESC,T.SLL,T.BIGBUSI_CODE,T.BIGBUSI_DESC," +
	"T.CRE,T.SLCRE,T.UNIT_RATIO,T.UNTI_CRE,T.SVR_RATIO,T.SVR_CRE,T.UNIT_MONEY " +
	"FROM PMRT.TB_MRT_JCDY_SLJF_INFO_DAY T " +
	"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' " + fsql;
	if(group_level == 1) {
	}else if(group_level==2) {
		sql += " AND T.GROUP_ID_1 = '"+group_id+"' ";
	}else if(group_level == 3) {
		sql += " AND T.UNIT_ID = '"+group_id+"' ";
	}else {
		sql += " 1=2 ";
	}
	if(unit_name != "") {
		sql += " AND T.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	if(user_name != "") {
		sql += " AND T.USER_NAME LIKE '%"+user_name+"%' ";
	}
	if(itemdesc!=""){
		sql+=" AND BUSI_DESC LIKE '%"+itemdesc+"%' ";
	}
	sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	
	var showtext="Sheet";
	   var showtext1="result";
	   var _head=['帐期','地市名称','营服中心','HR编码','人员姓名','渠道编码','渠道名称','操作员编码','业务编码','业务描述',
	              '受理量','业务大类','业务大类描述','原始积分','受理积分','区域调节系数','区域调节积分','服务调节系数',
	              '服务调节积分','积分金额'];
	   _execute(3001,{type:12,
			     data:{
			    	  sql:sql,
			    	  contname:_head,
			    	  startRow:1,
			    	  startCol:0,
			    	  cols:-1,
			    	  sheetname:showtext,
			    	  excelModal:'reportModel.xls'
			     }     
		},function(res){
			 click_flag=0;
			 var url=[$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(showtext)?'':'&alias='+encodeURI(encodeURI(showtext1+'.xls'))].join('');
			 window.location.href=url;
		});
}

function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}
*/