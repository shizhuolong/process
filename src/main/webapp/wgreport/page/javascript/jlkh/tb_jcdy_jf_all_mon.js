jQuery(function(){
	var cols = ["deal_date","area_name","unit_name","user_name","hr_no","user_role","g2sll","swsll","g3sll","g4sll","kdsll","allsll","g2jf","swjf","g3jf","g4jf","gwjf","zhwj_jf","kdxfjf","jtzzsrjf","ztjf","ztunitjf","hjxsjf","hq_alljf","unit_alljf","base_sljf","fw_jf","zzyw_jf","sl_alljf","sl_svr_all_cre","unit_sl_alljf","lyhzx_jf","cfyw_jf","zbjxy_jf","zfk_jf","llbdz_jf","wx_cre","wx_svr_cre","wx_unit_cre","all_jf","all_jf_money" ];
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
	var _limit=15;
	var sql = "SELECT DEAL_DATE,AREA_NAME,UNIT_NAME,USER_NAME,HR_NO,NVL(USER_ROLE,' ') USER_ROLE,G2SLL,SWSLL,G3SLL,G4SLL,KDSLL,ALLSLL,G2JF," +
			"SWJF,G3JF,G4JF,GWJF,ZHWJ_JF,KDXFJF,JTZZSRJF,ZTJF,ZTUNITJF,HJXSJF,HQ_ALLJF,UNIT_ALLJF,BASE_SLJF,FW_JF,ZZYW_JF,SL_ALLJF," +
			"SL_SVR_ALL_CRE,UNIT_SL_ALLJF ,LYHZX_JF,CFYW_JF,ZBJXY_JF,ZFK_JF,LLBDZ_JF,WX_CRE,WX_SVR_CRE,WX_UNIT_CRE,ALL_JF,ALL_JF_MONEY FROM PMRT.TB_JCDY_JF_ALL_MON " +
			"WHERE DEAL_DATE ="+deal_date;
			if(group_level == 1) {
			}else if(group_level==2) {
				sql += "AND GROUP_ID_1 = '"+group_id+"' ";
			}else if(group_level == 3) {
				sql += "AND UNIT_ID = '"+group_id+"' ";
			}else {
				sql += " 1=2 ";
			}
			sql+=" ORDER BY GROUP_ID_1"
	init(sql);
	function init(sql){ 
		var head="";
		head +="<tr class='attend_th'>" +
			"<th class='attend_th'>账期</th><th class='attend_th'>地市</th><th class='attend_th'>基层单元</th>" +
			"<th class='attend_th'>人员姓名</th><th class='attend_th'>hr编码</th><th class='attend_th'>角色类型</th><th class='attend_th'>2g发展量</th>" +
			"<th class='attend_th'>上网卡发展量</th><th class='attend_th'>3g发展量</th><th class='attend_th'>4g发展量</th>" +
			"<th class='attend_th'>宽带发展量</th><th class='attend_th'>总受理量</th><th class='attend_th'>2g发展积分</th>" +
			"<th class='attend_th'>上网卡发展积分</th><th class='attend_th'>3g发展积分</th><th class='attend_th'>4g发展积分</th>" +
			"<th class='attend_th'>固网发展积分</th><th class='attend_th'>智慧沃家积分</th><th class='attend_th'>宽带续费积分</th><th class='attend_th'>集团专租线积分</th>" +
			"<th class='attend_th'>原始质态积分</th><th class='attend_th'>调节后质态积分</th><th class='attend_th'>合计销售积分</th><th class='attend_th'>渠道调节销售积分</th>" +
			"<th class='attend_th'>区域调节销售积分</th><th class='attend_th'>基础服务积分</th><th class='attend_th'>服务积分</th>" +
			"<th class='attend_th'>增值业务积分</th><th class='attend_th'>总受理积分</th><th class='attend_th'>服务调节受理积分</th>" +
			"<th class='attend_th'>区域调节受理积分</th><th class='attend_th'>老用户专享积分</th><th class='attend_th'>存费业务积分</th><th class='attend_th'>自备机续约积分</th><th class='attend_th'>主副卡积分</th><th class='attend_th'>流量语音包定制积分</th><th class='attend_th'>维系积分</th><th class='attend_th'>维系服务积分</th><th class='attend_th'>维系区域积分</th><th class='attend_th'>总积分</th><th class='attend_th'>总积分金额</th>" +
		"</tr>";
		$("#tableData thead").empty(); 
		$("#tableData tbody").empty(); 
		$("#tableData thead").append(head);
		addTab(sql);
		
	}
	$("#search").click(function(){   
		$("#page-layer").remove();
		var deal_date = $.trim($("#deal_date").val());
		var city_name = $.trim($("#city_name").val());
		var user_name = $.trim($("#user_name").val());
		var unit_name = $.trim($("#unit_name").val());
		var fsql = getSelect();
		var sql = "SELECT DEAL_DATE,AREA_NAME,UNIT_NAME,USER_NAME,HR_NO,NVL(USER_ROLE,' ') USER_ROLE,G2SLL,SWSLL,G3SLL,G4SLL,KDSLL,ALLSLL,G2JF,SWJF," +
				"G3JF,G4JF,GWJF,ZHWJ_JF,KDXFJF,JTZZSRJF,ZTJF,ZTUNITJF,HJXSJF,HQ_ALLJF,UNIT_ALLJF,BASE_SLJF,FW_JF,ZZYW_JF,SL_ALLJF," +
				"SL_SVR_ALL_CRE,UNIT_SL_ALLJF ,LYHZX_JF,CFYW_JF,ZBJXY_JF,ZFK_JF,LLBDZ_JF,WX_CRE,WX_SVR_CRE,WX_UNIT_CRE,ALL_JF,ALL_JF_MONEY FROM PMRT.TB_JCDY_JF_ALL_MON " +
				"WHERE DEAL_DATE = " + deal_date +fsql;
		if(group_level == 1) {
		}else if(group_level==2) {
			sql += " AND GROUP_ID_1 = '"+group_id+"' ";
		}else if(group_level == 3) {
			sql += " AND UNIT_ID = '"+group_id+"' ";
		}else {
			sql += " 1=2 ";
		}
		if(unit_name != "") {
			sql += " AND UNIT_NAME LIKE '%"+unit_name+"%' ";
		}
		if(user_name != "") {
			sql += " AND USER_NAME LIKE '%"+user_name+"%' ";
		}
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
		filter = " and group_id_1 in ("+selectStr+") ";
	} else{
		filter = "";
	}
	return filter;
}

//导出excel
function downsAll(){
	
	var deal_date = $.trim($("#deal_date").val());
	var city_name = $.trim($("#city_name").val());
	var user_name = $.trim($("#user_name").val());
	var unit_name = $.trim($("#unit_name").val());
	var fsql = getSelect();
	var sql =  "SELECT DEAL_DATE,AREA_NAME,UNIT_NAME,USER_NAME,HR_NO,NVL(USER_ROLE,' ') USER_ROLE,G2SLL,SWSLL,G3SLL,G4SLL,KDSLL,ALLSLL,G2JF,SWJF," +
				"G3JF,G4JF,GWJF,ZHWJ_JF,KDXFJF,JTZZSRJF,ZTJF,ZTUNITJF,HJXSJF,HQ_ALLJF,UNIT_ALLJF,BASE_SLJF,FW_JF,ZZYW_JF,SL_ALLJF," +
				"SL_SVR_ALL_CRE,UNIT_SL_ALLJF ,LYHZX_JF,CFYW_JF,ZBJXY_JF,ZFK_JF,LLBDZ_JF,WX_CRE,WX_SVR_CRE,WX_UNIT_CRE,ALL_JF,ALL_JF_MONEY FROM PMRT.TB_JCDY_JF_ALL_MON " +
				"WHERE DEAL_DATE = " + deal_date +fsql ;
	if(group_level == 1) {
	}else if(group_level==2) {
		sql += " AND GROUP_ID_1 = '"+group_id+"' ";
	}else if(group_level == 3) {
		sql += " AND UNIT_ID = '"+group_id+"' ";
	}else {
		sql += " 1=2 ";
	}
	if(unit_name != "") {
		sql += " AND UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	if(user_name != "") {
		sql += " AND USER_NAME LIKE '%"+user_name+"%' ";
	}
	sql+=" ORDER BY GROUP_ID_1"
	var showtext="Sheet";
	   var showtext1="result";
	   var _head=['账期','地市','基层单元','人员姓名','hr编码','角色类型','2g发展量','上网卡发展量','3g发展量','4g发展量','宽带发展量','总受理量','2g发展积分','上网卡发展积分','3g发展积分','4g发展积分','固网发展积分','智慧沃家积分','宽带续费积分','集团专租线积分','质态积分','调节后质态积分','合计销售积分','渠道调节销售积分','区域调节销售积分','基础服务积分','服务积分','增值业务积分','总受理积分','服务调节受理积分','区域调节受理积分','老用户专享积分','存费业务积分','自备机续约积分','主副卡积分','流量语音包定制积分','维系积分','维系服务积分','维系区域积分','总积分','总积分金额'];
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
