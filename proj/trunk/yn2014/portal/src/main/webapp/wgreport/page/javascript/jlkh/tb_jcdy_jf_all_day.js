jQuery(function(){
	var cols = ["area_name","unit_name","user_name","hr_no",
	            "g2sll","swsll","g3sll","g4sll","kdsll","allsll","g2jf",
	            "swjf","g3jf","g4jf","gwjf","kdxfjf","jtzzsrjf","ztjf","hjxsjf",
	            "hq_alljf","unit_alljf","base_sljf","fw_jf",
	            "zzyw_jf","sl_alljf","sl_svr_all_cre","unit_sl_alljf","all_jf","all_jf_money"];
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
	var sql = "SELECT T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO,SUM(T.G2SLL) AS G2SLL,SUM(T.SWSLL) AS SWSLL," +
			"SUM(T.G3SLL) AS G3SLL,SUM(T.G4SLL) AS G4SLL,SUM(T.KDSLL) AS KDSLL,SUM(T.ALLSLL) AS ALLSLL,SUM(T.G2JF) AS G2JF," +
			"SUM(T.SWJF) AS SWJF,SUM(T.G3JF) AS G3JF,SUM(T.G4JF) AS G4JF,SUM(T.GWJF) AS GWJF,SUM(T.KDXFJF) AS KDXFJF,SUM(T.JTZZSRJF) AS JTZZSRJF," +
			"SUM(T.ZTJF) AS ZTJF,SUM(T.HJXSJF) AS HJXSJF,SUM(T.HQ_ALLJF) AS HQ_ALLJF,SUM(T.UNIT_ALLJF) AS UNIT_ALLJF," +
			"SUM(T.BASE_SLJF) AS BASE_SLJF,SUM(T.FW_JF) AS FW_JF,SUM(T.ZZYW_JF) AS ZZYW_JF,SUM(T.SL_ALLJF) AS SL_ALLJF," +
			"SUM(T.SL_SVR_ALL_CRE) AS SL_SVR_ALL_CRE,SUM(T.UNIT_SL_ALLJF) AS UNIT_SL_ALLJF," +
			"SUM(T.ALL_JF) AS ALL_JF,SUM(T.ALL_JF_MONEY) AS ALL_JF_MONEY FROM PMRT.TB_JCDY_JF_ALL_DAY T " +
			"WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' ";
			if(group_level == 1) {
			}else if(group_level==2) {
				sql += "AND T.GROUP_ID_1 = '"+group_id+"' ";
			}else if(group_level == 3) {
				sql += "AND T.UNIT_ID = '"+group_id+"' ";
			}else {
				sql += " 1=2 ";
			}
			sql += " GROUP BY T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO," +
					"T.GROUP_ID_1,T.UNIT_ID ORDER BY T.AREA_NAME";
	init(sql);
	function init(sql){ 
		var head="";
		head +="<tr class='attend_th'>" +
				"<th class='attend_th'>地市名称</th>" +
				"<th class='attend_th'>营服中心</th><th class='attend_th'>人员姓名</th>" +
				"<th class='attend_th'>HR编码</th><th class='attend_th'>2G发展量</th>" +
				"<th class='attend_th'>上网卡发展量</th><th class='attend_th'>3G发展量</th>" +
				"<th class='attend_th'>4G发展量</th><th class='attend_th'>宽带发展量</th>" +
				"<th class='attend_th'>总受理量</th><th class='attend_th'>2G发展积分</th>" +
				"<th class='attend_th'>上网卡发展积分</th><th class='attend_th'>3G发展积分</th><th class='attend_th'>4G发展积分</th>" +
				"<th class='attend_th'>固网发展积分</th><th class='attend_th'>宽带续费积分</th>" +
				"<th class='attend_th'>集团专租线积分</th><th class='attend_th'>质态积分</th>" +
				"<th class='attend_th'>合计销售积分</th><th class='attend_th'>渠道调节销售积分</th>" +
				"<th class='attend_th'>区域调节销售积分</th><th class='attend_th'>基础服务积分</th>" +
				"<th class='attend_th'>服务积分</th><th class='attend_th'>增值业务积分</th>" +
				"<th class='attend_th'>总受理积分</th><th class='attend_th'>服务调节受理积分</th>" +
				"<th class='attend_th'>区域调节受理积分</th><th class='attend_th'>总积分</th>" +
				"<th class='attend_th'>总积分金额</th>" +
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
		var fsql = getSelect();
		var sql = "SELECT T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO,SUM(T.G2SLL) AS G2SLL,SUM(T.SWSLL) AS SWSLL," +
		"SUM(T.G3SLL) AS G3SLL,SUM(T.G4SLL) AS G4SLL,SUM(T.KDSLL) AS KDSLL,SUM(T.ALLSLL) AS ALLSLL,SUM(T.G2JF) AS G2JF," +
		"SUM(T.SWJF) AS SWJF,SUM(T.G3JF) AS G3JF,SUM(T.G4JF) AS G4JF,SUM(T.GWJF) AS GWJF,SUM(T.KDXFJF) AS KDXFJF,SUM(T.JTZZSRJF) AS JTZZSRJF," +
		"SUM(T.ZTJF) AS ZTJF,SUM(T.HJXSJF) AS HJXSJF,SUM(T.HQ_ALLJF) AS HQ_ALLJF,SUM(T.UNIT_ALLJF) AS UNIT_ALLJF," +
		"SUM(T.BASE_SLJF) AS BASE_SLJF,SUM(T.FW_JF) AS FW_JF,SUM(T.ZZYW_JF) AS ZZYW_JF,SUM(T.SL_ALLJF) AS SL_ALLJF," +
		"SUM(T.SL_SVR_ALL_CRE) AS SL_SVR_ALL_CRE,SUM(T.UNIT_SL_ALLJF) AS UNIT_SL_ALLJF," +
		"SUM(T.ALL_JF) AS ALL_JF,SUM(T.ALL_JF_MONEY) AS ALL_JF_MONEY FROM PMRT.TB_JCDY_JF_ALL_DAY T " +
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
		sql += " GROUP BY T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO," +
		"T.GROUP_ID_1,T.UNIT_ID ORDER BY T.AREA_NAME";
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
				if(j > 4 && (strn[j]==null || strn[j]=="0" || strn[j]=="")){
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
	var fsql = getSelect();
	var sql = "SELECT T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO,SUM(T.G2SLL) AS G2SLL,SUM(T.SWSLL) AS SWSLL," +
	"SUM(T.G3SLL) AS G3SLL,SUM(T.G4SLL) AS G4SLL,SUM(T.KDSLL) AS KDSLL,SUM(T.ALLSLL) AS ALLSLL,SUM(T.G2JF) AS G2JF," +
	"SUM(T.SWJF) AS SWJF,SUM(T.G3JF) AS G3JF,SUM(T.G4JF) AS G4JF,SUM(T.GWJF) AS GWJF,SUM(T.KDXFJF) AS KDXFJF,SUM(T.JTZZSRJF) AS JTZZSRJF," +
	"SUM(T.ZTJF) AS ZTJF,SUM(T.HJXSJF) AS HJXSJF,SUM(T.HQ_ALLJF) AS HQ_ALLJF,SUM(T.UNIT_ALLJF) AS UNIT_ALLJF," +
	"SUM(T.BASE_SLJF) AS BASE_SLJF,SUM(T.FW_JF) AS FW_JF,SUM(T.ZZYW_JF) AS ZZYW_JF,SUM(T.SL_ALLJF) AS SL_ALLJF," +
	"SUM(T.SL_SVR_ALL_CRE) AS SL_SVR_ALL_CRE,SUM(T.UNIT_SL_ALLJF) AS UNIT_SL_ALLJF," +
	"SUM(T.ALL_JF) AS ALL_JF,SUM(T.ALL_JF_MONEY) AS ALL_JF_MONEY FROM PMRT.TB_JCDY_JF_ALL_DAY T " +
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
	sql += " GROUP BY T.AREA_NAME,T.UNIT_NAME,T.USER_NAME,T.HR_NO," +
	"T.GROUP_ID_1,T.UNIT_ID ORDER BY T.AREA_NAME";
	
	var showtext="Sheet";
	   var showtext1="result";
	   var _head=['地市名称','营服中心','人员姓名','HR编码','2G发展量','上网卡发展量','3G发展量','4G发展量','宽带发展量',
	              '总受理量','2G发展积分','上网卡发展积分','3G发展积分','4G发展积分','固网发展积分','宽带续费积分','集团专租线积分','质态积分',
	              '合计销售积分','渠道调节销售积分','区域调节销售积分','基础服务积分','服务积分','增值业务积分','总受理积分',
	              '服务调节受理积分','区域调节受理积分','总积分','总积分金额'];
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
