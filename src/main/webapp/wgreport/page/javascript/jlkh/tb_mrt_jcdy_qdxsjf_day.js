var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","USER_NAME","HR_NO","SUBSCRIPTION_ID","SERVICE_NUM","JOIN_DATE","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","PRODUCT_NAME","ITEMCODE","ITEMDESC","ITEMVALUE","DEVELOPER_ID","HQ_CHANL_CODE","HQ_CHAN_NAME","SOURCE_CRE","HQ_RATIO","HQ_CRE","UNIT_RATIO","UNIT_CRE","UNIT_MONEY"];
var title=[['帐期','地市名称','营服中心','人员姓名','HR编码','用户编码','用户号码','入网时间','操作员工号','部门ID','套餐编码',"套餐名称",'指标编码','指标描述','指标值','发展人编码','所属渠道','渠道名称','原始积分','渠道系数','乘渠道系数后积分','区域系数','乘区域系数后积分','积分金额']];
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
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var sql = getSql();
	//var cdata = query("select count(*) total from(" + sql+")");
	var totalSql= "SELECT COUNT(*) TOTAL FROM PMRT.TB_MRT_JCDY_QDXSJF_DAY T WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' "+getWhere();
	var cdata = query(totalSql);
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
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	
	var sql=  
			" SELECT T.DEAL_DATE,                                          "+
			"        T.AREA_NAME,                                          "+
			"        T.UNIT_NAME,                                          "+
			"        T.USER_NAME,                                          "+
			"        T.HR_NO,                                              "+
			"        T.SUBSCRIPTION_ID,                                    "+
			"        T.SERVICE_NUM,                                        "+
			"        T.JOIN_DATE,                                          "+
			"        T.OPERATOR_ID,                                        "+
			"        T.OFFICE_ID,                                          "+
			"        T.PRODUCT_ID,                                         "+
			"        T.PRODUCT_NAME,                                         "+ //套餐名称
			"        T.ITEMCODE,                                           "+
			"        T.ITEMDESC,                                           "+
			"        T.ITEMVALUE,                                          "+
			"        T.DEVELOPER_ID,                                       "+
			"        T.HQ_CHANL_CODE,                                      "+
			"        T.HQ_CHAN_NAME,                                       "+
			"        T.SOURCE_CRE,                                         "+
			"        T.HQ_RATIO,                                           "+
			"        T.HQ_CRE,                                             "+
			"        T.UNIT_RATIO,                                         "+
			"        T.UNIT_CRE,                                           "+
			"        T.UNIT_MONEY                                          "+
			"   FROM PMRT.TB_MRT_JCDY_QDXSJF_DAY T                         "+
			"  WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' "+
			getWhere();
	sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	return sql;
}

function getWhere(){
	//权限
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var hrId = $("#hrId").val();
	//条件
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var regionCode = $("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var userPhone= $("#userPhone").val();
	var userName = $("#userName").val();
	var itemdesc = $("#itemdesc").val();
	
	var sql="";
	
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
	if(userPhone!=''){
		sql+=" AND SERVICE_NUM LIKE '%"+userPhone+"%'";
	}
	if(userName!=''){
		sql+= " AND USER_NAME LIKE '%"+userName+"%'";
	}
	if(itemdesc!=''){
		sql+= " AND ITEMDESC LIKE '%"+itemdesc+"%'";
	}
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var sql = getSql();
	showtext = '集客经理积分日明细-('+startDate+"~"+endDate+")";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////












/*jQuery(function(){
	var cols = ["deal_date","area_name","unit_name","user_name","hr_no",
	            "subscription_id","service_num","join_date","operator_id","office_id","product_id","itemcode",
	            "itemdesc","itemvalue","developer_id","hq_chanl_code","hq_chan_name","source_cre","hq_ratio",
	            "hq_cre","unit_ratio","unit_cre","unit_money"];
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
	var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO,T.SUBSCRIPTION_ID," +
			"T.SERVICE_NUM,T.JOIN_DATE,T.OPERATOR_ID,T.OFFICE_ID,T.PRODUCT_ID,T.ITEMCODE,T.ITEMDESC," +
			"T.ITEMVALUE,T.DEVELOPER_ID,T.HQ_CHANL_CODE,T.HQ_CHAN_NAME,T.SOURCE_CRE,T.HQ_RATIO," +
			"T.HQ_CRE,T.UNIT_RATIO,T.UNIT_CRE,T.UNIT_MONEY FROM PMRT.TB_MRT_JCDY_QDXSJF_DAY T " +
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
				"<th class='attend_th'>营服中心</th><th class='attend_th'>人员姓名</th>" +
				"<th class='attend_th'>HR编码</th><th class='attend_th'>用户编码</th>" +
				"<th class='attend_th'>用户号码</th><th class='attend_th'>入网时间</th>" +
				"<th class='attend_th'>操作员工号</th><th class='attend_th'>部门ID</th>" +
				"<th class='attend_th'>套餐编码</th><th class='attend_th'>指标编码</th>" +
				"<th class='attend_th'>指标描述</th><th class='attend_th'>指标值</th>" +
				"<th class='attend_th'>发展人编码</th><th class='attend_th'>所属渠道</th>" +
				"<th class='attend_th'>渠道名称</th><th class='attend_th'>原始积分</th>" +
				"<th class='attend_th'>渠道系数</th><th class='attend_th'>乘渠道系数后积分</th>" +
				"<th class='attend_th'>区域系数</th><th class='attend_th'>乘区域系数后积分</th>" +
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
		var service_num = $.trim($("#service_num").val());
		var itemdesc=$.trim($("#itemdesc").val());
		var fsql = getSelect();
		var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO,T.SUBSCRIPTION_ID," +
		"T.SERVICE_NUM,T.JOIN_DATE,T.OPERATOR_ID,T.OFFICE_ID,T.PRODUCT_ID,T.ITEMCODE,T.ITEMDESC," +
		"T.ITEMVALUE,T.DEVELOPER_ID,T.HQ_CHANL_CODE,T.HQ_CHAN_NAME,T.SOURCE_CRE,T.HQ_RATIO," +
		"T.HQ_CRE,T.UNIT_RATIO,T.UNIT_CRE,T.UNIT_MONEY FROM PMRT.TB_MRT_JCDY_QDXSJF_DAY T " +
		"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' " + fsql;
		if(service_num!=null && service_num.length != 0){
			sql+="AND T.SERVICE_NUM = '"+service_num+"' ";
		}
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
			sql+=" AND ITEMDESC LIKE '%"+itemdesc+"%' ";
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
	var service_num = $.trim($("#service_num").val());
	var itemdesc=$.trim($("#itemdesc").val());
	var fsql = getSelect();
	var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO,T.SUBSCRIPTION_ID," +
	"T.SERVICE_NUM,T.JOIN_DATE,T.OPERATOR_ID,T.OFFICE_ID,T.PRODUCT_ID,T.ITEMCODE,T.ITEMDESC," +
	"T.ITEMVALUE,T.DEVELOPER_ID,T.HQ_CHANL_CODE,T.HQ_CHAN_NAME,T.SOURCE_CRE,T.HQ_RATIO," +
	"T.HQ_CRE,T.UNIT_RATIO,T.UNIT_CRE,T.UNIT_MONEY FROM PMRT.TB_MRT_JCDY_QDXSJF_DAY T " +
	"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' " + fsql;
	if(service_num!=null && service_num.length != 0){
		sql+="AND T.SERVICE_NUM = '"+service_num+"' ";
	}
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
		sql+=" AND ITEMDESC LIKE '%"+itemdesc+"%' ";
	}
	sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	
	var showtext="Sheet";
	   var showtext1="result";
	   var _head=['帐期','地市名称','营服中心','人员姓名','HR编码','用户编码','用户号码','入网时间','操作员工号','部门ID',
	              '套餐编码','指标编码','指标描述','指标值','发展人编码','所属渠道','渠道名称','原始积分',
	              '渠道系数','乘渠道系数后积分','区域系数','乘区域系数后积分','积分金额'];
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