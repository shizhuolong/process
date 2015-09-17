jQuery(function(){
	var cols = ["deal_date","area_name","unit_name","user_name","hr_no","source_cre","hq_cre","unit_cre","unit_money" ];
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
	var sql = "SELECT t.DEAL_DATE,t.AREA_NAME,t.UNIT_NAME,t.USER_NAME,t.HR_NO,t.SOURCE_CRE,t.HQ_CRE,t.UNIT_CRE,t.UNIT_MONEY FROM PMRT.TB_MRT_JCDY_JKXSJF_TOTAL_MON t " +
			" WHERE t.DEAL_DATE ='"+deal_date+"' ";
			/*if(group_level == 1) {
			}else if(group_level==2) {
				sql += "AND GROUP_ID_1 = '"+group_id+"' ";
			}else if(group_level == 3) {
				sql += "AND UNIT_ID = '"+group_id+"' ";
			}else {
				sql += " 1=2 ";
			}*/
    if(group_level==1){
		
	}else if(group_level==2){
		sql += "AND t.GROUP_ID_1 = '"+group_id+"' ";
	}else{
		//1-营服中心责任人、6-营业厅主人、7-行业总监
		var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.HR_ID='"+hrId+"'";
		var rd=query(rsql);
		if(rd&&rd.length){
			var hrsql="";
			for(var i=0;i<rd.length;i++){
				var v=rd[i]["USER_CODE"];
				var tsql="";
				if(v==1){
					tsql+=" select tt.hr_no                                                      ";
					tsql+="   from pmrt.TB_JCDY_JF_ALL_MON tt                        ";
					tsql+=" where tt.unit_id = '"+group_id+"'                                            ";
					tsql+="   and tt.deal_date = '"+deal_date+"'                                      ";
					tsql+=" union                                                                ";
					tsql+=" select '"+hrId+"' from dual  ";
				}else if(v==6){//待改
					tsql+=" SELECT distinct hr_id                                                ";
					tsql+="   FROM portal.tab_portal_mag_person                                  ";
					tsql+=" where hq_chan_code in (                                              ";
					tsql+="   SELECT distinct hq_chan_code                                       ";
					tsql+="     FROM portal.tab_portal_mag_person                                ";
					tsql+="   where hr_id = '"+hrId+"'                                           ";
					tsql+="     and hq_chan_code is not null                                     ";
					tsql+=" )                                                                    ";      
				}else if(v==7){
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a                                ";
					tsql+=" where a.f_hr_id in (                                                 ";
					tsql+="       select hr_id                                                   ";
					tsql+="         from portal.tab_portal_grp_person t                          ";
					tsql+="       where t.user_type = 1                                          ";
					tsql+=" )                                                                    ";
					tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
					tsql+=" union                                                                ";
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"'       ";
				}
				if(tsql!=""&&hrsql!=""){
					hrsql+=" union "+tsql;
				}else{
					hrsql+=tsql;
				}
			}
			if(hrsql!=""){
				sql+=" and t.HR_NO in("+hrsql+")";
			}else{
				sql+=" and t.HR_NO='"+hrId+"'";
			}
		}else{
			sql+=" and t.HR_NO='"+hrId+"'";
		}
	}
	init(sql);
	function init(sql){ 
		var head="";
		head +="<tr class='attend_th'>" +
			"<th class='attend_th'>账期</th><th class='attend_th'>地市</th><th class='attend_th'>基层单元</th>" +
			"<th class='attend_th'>人员姓名</th><th class='attend_th'>HR编码</th><th class='attend_th'>原始积分</th>" +
			"<th class='attend_th'>渠道调节积分</th><th class='attend_th'>区域调节积分</th><th class='attend_th'>积分金额</th>" +
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
		var sql = "SELECT t.DEAL_DATE,t.AREA_NAME,t.UNIT_NAME,t.USER_NAME,t.HR_NO,t.SOURCE_CRE,t.HQ_CRE,t.UNIT_CRE,t.UNIT_MONEY FROM PMRT.TB_MRT_JCDY_JKXSJF_TOTAL_MON t" +
				  " WHERE t.DEAL_DATE = '" + deal_date +"' "+ fsql ;
		if(group_level == 1) {
		}else if(group_level==2) {
			sql += " AND t.GROUP_ID_1 = '"+group_id+"' ";
		}else{
			//1-营服中心责任人、6-营业厅主人、7-行业总监
			var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.HR_ID='"+hrId+"'";
			var rd=query(rsql);
			if(rd&&rd.length){
				var hrsql="";
				for(var i=0;i<rd.length;i++){
					var v=rd[i]["USER_CODE"];
					var tsql="";
					if(v==1){
						tsql+=" select tt.hr_no                                                      ";
						tsql+="   from pmrt.TB_JCDY_JF_ALL_MON tt                        ";
						tsql+=" where tt.unit_id = '"+group_id+"'                                            ";
						tsql+="   and tt.deal_date = '"+deal_date+"'                                      ";
						tsql+=" union                                                                ";
						tsql+=" select '"+hrId+"' from dual  ";
					}else if(v==6){//待改
						tsql+=" SELECT distinct hr_id                                                ";
						tsql+="   FROM portal.tab_portal_mag_person                                  ";
						tsql+=" where hq_chan_code in (                                              ";
						tsql+="   SELECT distinct hq_chan_code                                       ";
						tsql+="     FROM portal.tab_portal_mag_person                                ";
						tsql+="   where hr_id = '"+hrId+"'                                           ";
						tsql+="     and hq_chan_code is not null                                     ";
						tsql+=" )                                                                    ";      
					}else if(v==7){
						tsql+=" select distinct a.hr_id                                              ";
						tsql+="   from portal.tab_portal_grp_person a                                ";
						tsql+=" where a.f_hr_id in (                                                 ";
						tsql+="       select hr_id                                                   ";
						tsql+="         from portal.tab_portal_grp_person t                          ";
						tsql+="       where t.user_type = 1                                          ";
						tsql+=" )                                                                    ";
						tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
						tsql+=" union                                                                ";
						tsql+=" select distinct a.hr_id                                              ";
						tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"'       ";
					}
					if(tsql!=""&&hrsql!=""){
						hrsql+=" union "+tsql;
					}else{
						hrsql+=tsql;
					}
				}
				if(hrsql!=""){
					sql+=" and t.HR_NO in("+hrsql+")";
				}else{
					sql+=" and t.HR_NO='"+hrId+"'";
				}
			}else{
				sql+=" and t.HR_NO='"+hrId+"'";
			}
		}/*else if(group_level == 3) {
			sql += " AND UNIT_ID = '"+group_id+"' ";
		}else {
			sql += " 1=2 ";
		}*/
		
		if(unit_name != "") {
			sql += " AND t.UNIT_NAME LIKE '%"+unit_name+"%' ";
		}
		if(user_name != "") {
			sql += " AND t.USER_NAME LIKE '%"+user_name+"%' ";
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
		filter = " and t.group_id_1 in ("+selectStr+") ";
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
	var sql =  "SELECT t.DEAL_DATE,t.AREA_NAME,t.UNIT_NAME,t.USER_NAME,t.HR_NO,t.SOURCE_CRE,t.HQ_CRE,UNIT_CRE,t.UNIT_MONEY FROM PMRT.TB_MRT_JCDY_JKXSJF_TOTAL_MON t" +
				" WHERE t.DEAL_DATE = '" + deal_date+"' " + fsql;
	if(group_level == 1) {
	}else if(group_level==2) {
		sql += " AND t.GROUP_ID_1 = '"+group_id+"' ";
	}else{
		//1-营服中心责任人、6-营业厅主人、7-行业总监
		var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.HR_ID='"+hrId+"'";
		var rd=query(rsql);
		if(rd&&rd.length){
			var hrsql="";
			for(var i=0;i<rd.length;i++){
				var v=rd[i]["USER_CODE"];
				var tsql="";
				if(v==1){
					tsql+=" select tt.hr_no                                                      ";
					tsql+="   from pmrt.TB_JCDY_JF_ALL_MON tt                        ";
					tsql+=" where tt.unit_id = '"+group_id+"'                                            ";
					tsql+="   and tt.deal_date = '"+deal_date+"'                                      ";
					tsql+=" union                                                                ";
					tsql+=" select '"+hrId+"' from dual  ";
				}else if(v==6){//待改
					tsql+=" SELECT distinct hr_id                                                ";
					tsql+="   FROM portal.tab_portal_mag_person                                  ";
					tsql+=" where hq_chan_code in (                                              ";
					tsql+="   SELECT distinct hq_chan_code                                       ";
					tsql+="     FROM portal.tab_portal_mag_person                                ";
					tsql+="   where hr_id = '"+hrId+"'                                           ";
					tsql+="     and hq_chan_code is not null                                     ";
					tsql+=" )                                                                    ";      
				}else if(v==7){
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a                                ";
					tsql+=" where a.f_hr_id in (                                                 ";
					tsql+="       select hr_id                                                   ";
					tsql+="         from portal.tab_portal_grp_person t                          ";
					tsql+="       where t.user_type = 1                                          ";
					tsql+=" )                                                                    ";
					tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
					tsql+=" union                                                                ";
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"'       ";
				}
				if(tsql!=""&&hrsql!=""){
					hrsql+=" union "+tsql;
				}else{
					hrsql+=tsql;
				}
			}
			if(hrsql!=""){
				sql+=" and t.HR_NO in("+hrsql+")";
			}else{
				sql+=" and t.HR_NO='"+hrId+"'";
			}
		}else{
			sql+=" and t.HR_NO='"+hrId+"'";
		}
	}
	if(unit_name != "") {
		sql += " AND t.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	if(user_name != "") {
		sql += " AND t.USER_NAME LIKE '%"+user_name+"%' ";
	}
	
	var showtext="Sheet";
	   var showtext1="result";
	   var _head=['账期','地市','基层单元','人员姓名','HR编码','原始积分','渠道调节积分','区域调节积分','积分金额'];
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
