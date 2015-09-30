var nowData = [];
var field=[
           "GROUP_ID_4_NAME",
           "LAST_ACCT_2G_NUM",
           "ACCT_2G_NUM",
           "MM_ACCT_2G_NUM",

           "LAST_ACCT_3G_NUM",
           "ACCT_3G_NUM",
           "MM_ACCT_3G_NUM",

           "LAST_ACCT_4G_NUM",
           "ACCT_4G_NUM",
           "MM_ACCT_4G_NUM",

           "LAST_ACCT_BB_NUM",
           "ACCT_BB_NUM",
           "MM_ACCT_BB_NUM",

           "LAST_DEV_2G_NUM",
           "DEV_2G_NUM",
           "MM_DEV_2G_NUM",

           "LAST_DEV_3G_NUM",
           "DEV_3G_NUM",
           "MM_DEV_3G_NUM",

           "LAST_DEV_4G_NUM",
           "DEV_4G_NUM",
           "MM_DEV_4G_NUM",

           "LAST_DEV_BB_NUM",
           "DEV_BB_NUM",
           "MM_DEV_BB_NUM",

           "LAST_DEV_ZZX_NUM",
           "DEV_ZZX_NUM",
           "MM_DEV_ZZX_NUM",

           "LAST_DEV_NET_NUM",
           "DEV_NET_NUM",
           "MM_DEV_NET_NUM",

           "LAST_SR_2G_NUM",
           "SR_2G_NUM",
           "MM_SR_2G_NUM",

           "LAST_SR_3G_NUM",
           "SR_3G_NUM",
           "MM_SR_3G_NUM",

           "LAST_SR_4G_NUM",
           "SR_4G_NUM",
           "MM_SR_4G_NUM",

           "LAST_SR_BB_NUM",
           "SR_BB_NUM",
           "MM_SR_BB_NUM",

           "LAST_SR_ZZX_NUM",
           "SR_ZZX_NUM",
           "MM_SR_ZZX_NUM",

           "LAST_SR_NET_NUM",
           "SR_NET_NUM",
           "MM_SR_NET_NUM"
           ];
	var orderBy = '';
	var report = null;
	$(function() {
		report = new LchReport({
			title : [
					["小区名称","2G出账用户数","","","3G出账用户数","","","4G出账用户数","","","宽带出账用户数","","","2G新发展用户数","","","3G新发展用户数","","","4G新发展用户数","","","宽带新发展用户数","","","专租线新发展用户数","","","固话新发展用户数","","","2G出账收入","","","3G出账收入","","","4G出账收入","","","宽带出账收入","","","专租线出账收入","","","固话出账收入","",""]
,["",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比",
"上月","本月","环比"]

			],
			field : field,
			css:[{gt:0,css:LchReport.RIGHT_ALIGN},{array:[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48],css:LchReport.SUM_STYLE}],
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
	function getFieldSql(field){
		var fs = "";

		for (var i = 0; i < field.length; i++) {
			if (fs.length > 0) {
				fs += ",";
			}
			if(field[i].startWith("MM_")){
				var f=field[i].substring(3);
				fs += "case LAST_" + f
						+ " when 0 then '-%' else to_char((nvl(" + f
						+ ",0)-LAST_" + f + ")*100/LAST_" + f
						+ ",'fm99999999999990.00')||'%' end " + field[i];
			} else {
				fs += field[i];
			}
		}

		return fs;
	}
	//列表信息
	function search(pageNumber) {
		pageNumber = pageNumber + 1;
		var start = pageSize * (pageNumber - 1);
		var end = pageSize * pageNumber;
		var unitId = $("#unitId").val();
		var agentId = $("#agentId").val();
		var month = $("#month").val();
		var agentType = $("#agentType").val();

		var sql = "";
		if (agentId != 'undefined') {
			sql += "  from PMRT.TAB_MRT_TARGET_CH_MON t where t.deal_date='"
					+ month + "' and t.unit_id='" + unitId
					+ "' and t.per_type='" + agentType
					+ "' and  t.AGENT_M_USERID='" + agentId + "' ";
		} else {
			sql += "  from PMRT.TAB_MRT_TARGET_CH_MON t where t.deal_date='"
					+ month + "' and t.unit_id='" + unitId
					+ "' and t.per_type='" + agentType
					+ "' and t.AGENT_M_USERID is null ";
		}

		var csql = sql;
		var cdata = query("select count(*) total" + csql);
		var total = 0;
		if (cdata && cdata.length) {
			total = cdata[0].TOTAL;
		} else {
			return;
		}

		//排序
		if (orderBy != '') {
			sql += orderBy;
		}

		sql = "select "+getFieldSql(field) + sql;

		sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
				+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
		var d = query(sql);
		if (pageNumber == 1) {
			initPagination(total);
		}
		nowData = d;

		report.showSubRow();
		///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		if (pageNumber == 1) {
			report.showAllCols(0);
		}
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
		
		$("#lch_DataBody").find("TR").each(function(){
			var area=$(this).find("TD:eq(0)").find("A").text();
			if(area)
				$(this).find("TD:eq(0)").empty().text(area);
		});
	}
	/////////////////////////下载开始/////////////////////////////////////////////
	function downsAll() {
		var qdate = $.trim($("#month").val());
		var unitId = $("#unitId").val();
		var agentId = $("#agentId").val();
		var month = $("#month").val();
		var agentType = $("#agentType").val();

		var sql = "";
		if (agentId != 'undefined') {
			sql += "  from PMRT.TAB_MRT_TARGET_CH_MON t where t.deal_date='"
					+ month + "' and t.unit_id='" + unitId
					+ "' and t.per_type='" + agentType
					+ "' and t.AGENT_M_USERID='" + agentId + "' ";
		} else {
			sql += "  from PMRT.TAB_MRT_TARGET_CH_MON t where t.deal_date='"
					+ month + "' and t.unit_id='" + unitId
					+ "' and t.per_type='" + agentType
					+ "' and t.AGENT_M_USERID is null ";
		}

		var preField = ' t.group_id_1_name,t.unit_name,t.agent_m_name,case t.PER_TYPE when \'1\' then \'客户经理\' when \'2\' then \'渠道经理\' else \'小区经理\' end  PER_TYPE ,t.HR_ID,t.group_id_4_name,t.state,t.HQ_CHAN_CODE,t.DEAL_DATE ';
		var orderBy = " order by t.group_id_1_name,t.unit_name,t.agent_m_name,t.PER_TYPE ,t.HR_ID,t.group_id_4_name,t.HQ_CHAN_CODE,t.DEAL_DATE ";

		var newField = [];
		for (var i = 1; i < field.length; i++) {
			newField[i - 1] = field[i];
		}

		var fieldSql =getFieldSql(newField);

		var sql = 'select ' + preField + ',' + fieldSql + sql;

		if (orderBy != '') {
			sql += orderBy;
		}

		showtext = '全业务环比月报表-' + qdate;
		var title=[["营销架构","","","","","","","","帐期","2G出账用户数","","","3G出账用户数","","","4G出账用户数","","","宽带出账用户数","","","2G新发展用户数","","","3G新发展用户数","","","4G新发展用户数","","","宽带新发展用户数","","","专租线新发展用户数","","","固话新发展用户数","","","2G出账收入","","","3G出账收入","","","4G出账收入","","","宽带出账收入","","","专租线出账收入","","","固话出账收入","",""],
		           ["地市","营服中心","人员","类型","HR编码","渠道（小区）名称","渠道（小区）状态","渠道（小区）编码","",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比",
		            "上月","本月","环比"
		            ]];
		downloadExcel(sql,title,showtext);
	}
	/////////////////////////下载结束/////////////////////////////////////////////