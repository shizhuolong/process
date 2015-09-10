var nowData = [];
	var field = [ "GROUP_ID_4_NAME", "ACCT_2_CHW_NUM", "ACCT_2_SHW_NUM",
			"ACCT_2_BDW_NUM", "ACCT_2_LLW_NUM", "ACCT_2_JSK_NUM",
			"ACCT_2_OT_NUM", "ACCT_2G_NUM", "ACCT_3_DK_NUM", "ACCT_3_GJSF_NUM",
			"ACCT_3_CFSJ_NUM", "ACCT_3_CFSF_NUM", "ACCT_3_ZBJ_NUM",
			"ACCT_3_SWK_NUM", "ACCT_3_OT_NUM",///
			"ACCT_3G_NUM", "ACCT_4_BDDK_NUM", "ACCT_4_HYHJ_NUM",
			"ACCT_4_CFSF_NUM", "ACCT_4_GJSF_NUM", "ACCT_4_CFSJ_NUM",
			"ACCT_4_HYHJ1_NUM", "ACCT_4_CFSF1_NUM",//
			"ACCT_4_OT_NUM",//
			"ACCT_4G_NUM", "ACCT_ADSL_NUM", "ACCT_LAN_NUM", "ACCT_EOC_NUM",
			"ACCT_FTTH_NUM", "ACCT_10M_NUM", "ACCT_BB_NUM", "DEV_2_CHW_NUM",
			"DEV_2_SHW_NUM", "DEV_2_BDW_NUM", "DEV_2_LLW_NUM", "DEV_2_JSK_NUM",
			"DEV_2_OT_NUM", "DEV_2G_NUM", "DEV_3_DK_NUM", "DEV_3_GJSF_NUM",
			"DEV_3_CFSJ_NUM", "DEV_3_CFSF_NUM", "DEV_3_ZBJ_NUM",
			"DEV_3_SWK_NUM", "DEV_3_OT_NUM",///
			"DEV_3G_NUM", "DEV_4_BDDK_NUM", "DEV_4_HYHJ_NUM", "DEV_4_CFSF_NUM",
			"DEV_4_GJSF_NUM", "DEV_4_CFSJ_NUM", "DEV_4_HYHJ1_NUM",
			"DEV_4_CFSF1_NUM",//
			"DEV_4_OT_NUM",//
			"DEV_4G_NUM", "DEV_ADSL_NUM", "DEV_LAN_NUM", "DEV_EOC_NUM",
			"DEV_FTTH_NUM", "DEV_10M_NUM", "DEV_BB_NUM", "SR_2_CHW_NUM",
			"SR_2_SHW_NUM", "SR_2_BDW_NUM", "SR_2_LLW_NUM", "SR_2_JSK_NUM",
			"SR_2_OT_NUM", "SR_2G_NUM", "SR_3_DK_NUM", "SR_3_GJSF_NUM",
			"SR_3_CFSJ_NUM", "SR_3_CFSF_NUM", "SR_3_ZBJ_NUM", "SR_3_SWK_NUM",
			"SR_3_OT_NUM",/////
			"SR_3G_NUM", "SR_4_BDDK_NUM", "SR_4_HYHJ_NUM", "SR_4_CFSF_NUM",
			"SR_4_GJSF_NUM", "SR_4_CFSJ_NUM", "SR_4_HYHJ1_NUM",
			"SR_4_CFSF1_NUM",//全国套餐存费送费
			"SR_4_OT_NUM",//其他
			"SR_4G_NUM", "SR_ADSL_NUM", "SR_LAN_NUM", "SR_EOC_NUM",
			"SR_FTTH_NUM", "SR_10M_NUM", "SR_BB_NUM", "DEV_ZZX_NUM",
			"SR_ZZX_NUM","DEV_NET_NUM","SR_NET_NUM", "CALL_TIME_2G", "MOU_2G", "FLOW_2G", "AVG_FLOW_2G",
			"CALL_TIME_3G", "MOU_3G", "FLOW_3G", "AVG_FLOW_3G", "CALL_TIME_4G",
			"MOU_4G", "FLOW_4G", "AVG_FLOW_4G" ];
	var orderBy = '';
	var report = null;
	$(function() {
		report = new LchReport({
			title : [
					[ "渠道（小区）名称", "2G出账用户", "2G出账用户", "2G出账用户", "2G出账用户",
							"2G出账用户", "2G出账用户", "2G出账用户", "3G出账用户", "3G出账用户",
							"3G出账用户", "3G出账用户", "3G出账用户", "3G出账用户", "3G出账用户",
							"3G出账用户",//
							"4G出帐用户", "4G出帐用户", "4G出帐用户", "4G出帐用户", "4G出帐用户",
							"4G出帐用户", "4G出帐用户", "4G出帐用户", "4G出帐用户",//
							"固网宽带出账用户", "固网宽带出账用户", "固网宽带出账用户", "固网宽带出账用户",
							"固网宽带出账用户", "固网宽带出账用户",

							"2G用户发展", "2G用户发展", "2G用户发展", "2G用户发展", "2G用户发展",
							"2G用户发展", "2G用户发展", "3G用户发展", "3G用户发展", "3G用户发展",
							"3G用户发展", "3G用户发展", "3G用户发展", "3G用户发展", "3G用户发展",
							"4G用户发展", "4G用户发展", "4G用户发展", "4G用户发展", "4G用户发展",
							"4G用户发展", "4G用户发展", "4G用户发展", "4G用户发展",

							"固网宽带用户发展", "固网宽带用户发展", "固网宽带用户发展", "固网宽带用户发展",
							"固网宽带用户发展", "固网宽带用户发展", "2G出账收入", "2G出账收入",
							"2G出账收入", "2G出账收入", "2G出账收入", "2G出账收入", "2G出账收入",
							"3G出账收入", "3G出账收入", "3G出账收入", "3G出账收入", "3G出账收入",
							"3G出账收入", "3G出账收入", "3G出账收入", "4G出账收入", "4G出账收入",
							"4G出账收入", "4G出账收入", "4G出账收入", "4G出账收入", "4G出账收入",
							"4G出账收入", "4G出账收入",

							"固网宽带出账收入", "固网宽带出账收入", "固网宽带出账收入", "固网宽带出账收入",
							"固网宽带出账收入", "固网宽带出账收入", "专租线发展", "专租线收入","固话发展量","固话收入",
							"2G用户语音流量", "2G用户语音流量", "2G用户语音流量", "2G用户语音流量",
							"3G用户语音流量", "3G用户语音流量", "3G用户语音流量", "3G用户语音流量",
							"4G用户语音流量", "4G用户语音流量", "4G用户语音流量", "4G用户语音流量" ],
					[ "渠道（小区）名称", "长话王", "市话王", "包打王", "流量王", "极速卡", "其他",
							"合计",/*2G出账*/
							"单卡", "购机送费", "存费送机", "存费送费", "本省自备机", "上网卡", "其他",
							"合计",/*3G出账*/
							"本地单卡", "本地套餐合约惠机", "本地套餐存费送费", "全国套餐购机送费",
							"全国套餐存费送机", "全国套餐合约惠机", "全国套餐存费送费", "其他", "合计",/*4G*/
							"ADSL", "LAN", "EOC", "FTTH", "其中10M及以上", "合计",

							"长话王", "市话王", "包打王", "流量王", "极速卡", "其他", "合计",/*2G发展*/
							"单卡", "购机送费", "存费送机", "存费送费", "本省自备机", "上网卡", "其他",
							"合计",/*3G*/
							"本地单卡", "本地套餐合约惠机", "本地套餐存费送费", "全国套餐购机送费",
							"全国套餐存费送机", "全国套餐合约惠机", "全国套餐存费送费", "其他", "合计",/*4G*/

							"ADSL", "LAN", "EOC", "FTTH", "其中10M及以上", "合计",
							"长话王", "市话王", "包打王", "流量王", "极速卡", "其他", "合计",/*2G收入*/
							"单卡", "购机送费", "存费送机", "存费送费", "本省自备机", "上网卡", "其他",
							"合计",/*3G*/
							"本地单卡", "本地套餐合约惠机", "本地套餐存费送费", "全国套餐购机送费",
							"全国套餐存费送机", "全国套餐合约惠机", "全国套餐存费送费", "其他", "合计",/*4G*/
							"ADSL", "LAN", "EOC", "FTTH", "其中10M及以上", "合计",
							"专租线发展", "专租线收入","固话发展量","固话收入","通话分钟数", "MOU", "流量", "户均流量",
							"通话分钟数", "MOU", "流量", "户均流量", "通话分钟数", "MOU", "流量",
							"户均流量" ]

			],
			field : field,
			css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
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

		var fieldSql = newField.join(",");

		var sql = 'select ' + preField + ',' + fieldSql + sql;

		if (orderBy != '') {
			sql += orderBy;
		}

		showtext = '用户发展收入月报-' + qdate;
		var title=[["营销架构","","","","","","","","帐期","2G出账用户","","","","","","","3G出账用户","","","","","","","","4G出帐用户","","","","","","","","","固网宽带出账用户","","","","","","2G用户发展","","","","","","","3G用户发展","","","","","","","","4G用户发展","","","","","","","","","固网宽带用户发展","","","","","","2G出账收入","","","","","","","3G出账收入","","","","","","","","4G出账收入","","","","","","","","","固网宽带出账收入","","","","","","专租线发展","专租线收入","固话发展量","固话收入","2G用户语音流量","","","","3G用户语音流量","","","","4G用户语音流量","","",""],
		           ["地市","营服中心","人员","类型","HR编码","渠道（小区）名称","渠道（小区）状态","渠道（小区）编码","","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","","","","","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流量","户均流量"]];

		downloadExcel(sql,title,showtext);
	}
	/////////////////////////下载结束/////////////////////////////////////////////