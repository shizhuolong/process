jQuery(function(){
	//excel导出
	$("#exceldown").click(downsAll);
	regionSelect();
	/**
	 * 此方法和main.js中的方法重叠【2013-06-25】
	 */
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
	var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO," +
			"T.SUBSCRIPTION_ID,T.SERVICE_NUM,T.JOIN_DATE,T.OPERATOR_ID, " +
			"T.OFFICE_ID,T.PRODUCT_ID,T.ITEMCODE,T.ITEMDESC,T.ITEMVALUE," +
			"T.DEVELOPER_ID,T.HQ_CHANL_CODE,T.HQ_CHAN_NAME, T.FD_CHANL_CODE," +
			"T.SOURCE_CRE,T.SOURCE_CODE,T.HQ_RATIO,T.HQ_CRE,T.UNIT_RATIO," +
			"T.UNIT_CRE,T.UNIT_MONEY FROM " +
			"PMRT.TB_MRT_JCDY_JKXSJF_DAY T "+
			" WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' ";
			/*if(group_level == 1) {
			}else if(group_level==2) {
				sql += "AND T.GROUP_ID_1 = '"+group_id+"' ";
			}else if(group_level == 3) {
				sql += "AND T.UNIT_ID = '"+group_id+"' ";
			}else {
				sql += " 1=2";
			}*/
	if(group_level == 1) {
	}else if(group_level==2) {
		sql += " AND T.GROUP_ID_1 = '"+group_id+"' ";
	}else{
		var hrIds=_jf_power(hrId,endDate);
		if(hrIds!=""){
		   sql+=" and T.HR_NO in("+hrIds+") ";
		}
	}	
			sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	init(sql);
	function init(sql){ 
		var head="";
		head +="<tr class='attend_th'>" +
				"<th class='attend_th'>帐期</th><th class='attend_th'>地市名称</th>" +
				"<th class='attend_th'>营服中心</th><th class='attend_th'>人员姓名</th>" +
				"<th class='attend_th'>HR编码</th><th class='attend_th'>用户编号</th>" +
				"<th class='attend_th'>用户号码</th><th class='attend_th'>入网时间</th>" +
				"<th class='attend_th'>操作员工号</th><th class='attend_th'>部门编码</th>" +
				"<th class='attend_th'>套餐编码</th><th class='attend_th'>业务编码</th>" +
				"<th class='attend_th'>业务描述</th><th class='attend_th'>指标值</th>" +
				"<th class='attend_th'>发展人编码</th><th class='attend_th'>所属渠道</th>" +
				"<th class='attend_th'>渠道名称</th><th class='attend_th'>总部渠道编码</th>" +
				"<th class='attend_th'>原始积分</th><th class='attend_th'>原始编码</th>" +
				"<th class='attend_th'>渠道系数</th><th class='attend_th'>乘渠道系数后积分</th>" +
				"<th class='attend_th'>区域系数</th><th class='attend_th'>乘区域系数后积分</th>"+
				"<th class='attend_th'>积分金额</th>"+
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
		var service_num =$.trim($("#service_num").val());
		var itemdesc=$.trim($("#itemdesc").val());
		var fsql = getSelect();
		var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO," +
		"T.SUBSCRIPTION_ID,T.SERVICE_NUM,T.JOIN_DATE,T.OPERATOR_ID, " +
		"T.OFFICE_ID,T.PRODUCT_ID,T.ITEMCODE,T.ITEMDESC,T.ITEMVALUE," +
		"T.DEVELOPER_ID,T.HQ_CHANL_CODE,T.HQ_CHAN_NAME, T.FD_CHANL_CODE," +
		"T.SOURCE_CRE,T.SOURCE_CODE,T.HQ_RATIO,T.HQ_CRE,T.UNIT_RATIO," +
		"T.UNIT_CRE,T.UNIT_MONEY FROM " +
		"PMRT.TB_MRT_JCDY_JKXSJF_DAY T " +
		"WHERE T.DEAL_DATE  BETWEEN '"+startDate+"' AND '"+endDate+"' " + fsql;
		if(service_num!=null && service_num.length != 0){
			sql+="AND T.SERVICE_NUM = '"+service_num+"' ";
		}
		/*if(group_level == 1) {
		}else if(group_level==2) {
			sql += " AND T.GROUP_ID_1 = '"+group_id+"' ";
		}else if(group_level == 3) {
			sql += " AND T.UNIT_ID = '"+group_id+"' ";
		}else {
			sql += " 1=2 ";
		}*/
		if(group_level == 1) {
		}else if(group_level==2) {
			sql += " AND T.GROUP_ID_1 = '"+group_id+"' ";
		}else{
			var hrIds=_jf_power(hrId,endDate);
			if(hrIds!=""){
			   sql+=" and T.HR_NO in("+hrIds+") ";
			}
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
			$("#tableData tbody").empty().append("<tr><td colspan='35' style='text-align: center;'>没有查询到您想要的数据</td></tr>");
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
				if(j > 17 && (strn[j]==null || strn[j]=="0" || strn[j]=="")){
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
	var sql = "SELECT T.DEAL_DATE,T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO," +
	"T.SUBSCRIPTION_ID,T.SERVICE_NUM,T.JOIN_DATE,T.OPERATOR_ID, " +
	"T.OFFICE_ID,T.PRODUCT_ID,T.ITEMCODE,T.ITEMDESC,T.ITEMVALUE," +
	"T.DEVELOPER_ID,T.HQ_CHANL_CODE,T.HQ_CHAN_NAME, T.FD_CHANL_CODE," +
	"T.SOURCE_CRE,T.SOURCE_CODE,T.HQ_RATIO,T.HQ_CRE,T.UNIT_RATIO," +
	"T.UNIT_CRE,T.UNIT_MONEY FROM " +
	"PMRT.TB_MRT_JCDY_JKXSJF_DAY T "+
	"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' " + fsql;
	if(service_num!=null && service_num.length != 0){
		sql+="AND T.SERVICE_NUM = '"+service_num+"' ";
	}
	/*if(group_level == 1) {
	}else if(group_level==2) {
		sql += " AND T.GROUP_ID_1 = '"+group_id+"' ";
	}else if(group_level == 3) {
		sql += " AND T.UNIT_ID = '"+group_id+"' ";
	}else {
		sql += " 1=2 ";
	}*/
	if(group_level == 1) {
	}else if(group_level==2) {
		sql += " AND T.GROUP_ID_1 = '"+group_id+"' ";
	}else{
		var hrIds=_jf_power(hrId,endDate);
		if(hrIds!=""){
		   sql+=" and T.HR_NO in("+hrIds+") ";
		}
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
	   var _head=['帐期','地市名称','营服中心','人员姓名','HR编码','用户编号','用户号码','入网时间','操作员工号','部门编码',
	              '套餐编码','业务编码','业务描述','指标值','发展人编码','所属渠道','渠道名称','渠道编码',
	              '原始积分','原始编码','渠道系数','乘渠道系数后积分','区域系数','乘区域系数后积分','积分金额'];
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
