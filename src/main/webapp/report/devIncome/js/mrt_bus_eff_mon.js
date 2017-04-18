var nowData = [];
var title=[["营业厅基础信息","","","","","","","","","","","","","","","","","","","","","","累计用户开账收入（取数口径为累计用户在本月开账收入，开账收入中应扣除赠费、系统调整。","","","","","","","","","","","","","","","","","","","2015年新增用户开账收入（取数口径为15年新发展用户在本月开账收入，开账收入中应扣除赠费、系统调整。","","","","","","","","","","","","","","","","","","","累计用户渠道费用（填列当月账期的应付确认数）","","","15年新发展用户渠道费用（填列当月账期的应付确认数）","","","用户发展量（按产品填列当月发展数量）","","","","","","","","","","","","","","","","","","","用户离网量（填列当月此渠道下的用户离网数量和平均在网时长）","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""," 业务受理量（填列当月渠道办理各项业务的笔数） ","","","","","","","","","","缴费（填列本渠道的当月受理的用户缴纳的话费，仅指缴纳成功的部分，一卡充按张数及面值视同为缴费一并统计）","","","","老用户合约续约量（填列此渠道老用户办理合约的数量，包括续约用户，分合约方式）","","","","","","","","","","月房租","物业管理费用","紧密外包","合同及派遣人工成本","水电费","装修费","安保费","终端补贴(剩余法)","终端补贴(公允法)"],
           ["","","","","","","","","","","","","","","","","","","","","","","2g","3G","","","","","","","4g","","","","","","","固网","","","","2g","3G","","","","","","","4g","","","","","","","固网","","","","佣金（集中渠道）","紧密型佣金（BSS管理的属于紧密型的佣金）","渠道补贴（集中渠道）","佣金（集中渠道）","紧密型佣金（BSS管理的属于紧密型的佣金）","渠道补贴（集中渠道）","2g","3G","","","","","","","4g","","","","","","","固网","","","","2g","","3G","","","","","","","","","","","","","","4g","","","","","","","","","","","","","","固网","","","","","","","","","","","","","","","","","","自助终端","","营业员","","3g","","","","4g","","","","固网","","","","","","","","","",""],
           ["地市","营业厅编码","营业厅名称","营业厅（地址）","营业厅下挂渠道编码","营业厅下挂渠道名称","区域（市级/县级/乡镇/乡镇以下）","渠道启用时间","营业厅类型（自有产权、租用、自有+租用）","运营模式（自营、柜台外包、他营）","厅类型（旗舰、标准、小型）","经营者名称（自营、代理商名称）","代理商进驻厅的开始时间","房屋合同起始日期","房屋合同截止日期","合同年租金（万元）","建筑面积（M2）","营业厅人数（联通方）","代理商或厂家驻店人数","自助终端数量（台）","厅经理姓名","店长联系方式","2g单卡","3g单卡","3g存费送机","3g购机送费","3g存费送费","本省自备机","上网卡","其他","4g单卡","4g存费送机","4g购机送费","合约惠机","4g存费送费","上网卡","其他","宽带","固话","固移融合","其他","2g单卡","3g单卡","3g存费送机","3g购机送费","3g存费送费","本省自备机","上网卡","其他","4g单卡","4g存费送机","4g购机送费","合约惠机","4g存费送费","上网卡","其他","宽带","固话","固移融合","其他","佣金（集中渠道）","紧密型佣金（BSS管理的属于紧密型的佣金）","","佣金（集中渠道）","紧密型佣金（BSS管理的属于紧密型的佣金）","","2g单卡","3g单卡","3g存费送机","3g购机送费","3g存费送费","本省自备机","上网卡","其他","4g单卡","4g存费送机","4g购机送费","3g存费送费","合约惠机","上网卡","其他","宽带","固话","固移融合","其他","2g单卡","平均在网时长","3g单卡","3g单卡平均在网时长","3g存费送机","3g存费送机平均在网时长","3g购机送费","3g购机送费平均在网时长","3g存费送费","3g存费送费平均在网时长","本省自备机","本省自备机平均在网时长","上网卡","上网卡平均在网时长","其他","其他平均在网时长","4g单卡","4g单卡平均在网时长","4g存费送机","4g存费送机平均在网时长","4g购机送费","4g购机送费平均在网时长","4g存费送费","4g存费送费平均在网时长","合约惠机","合约惠机平均在网时长","上网卡","上网卡平均在网时长","其他","其他平均在网时长","宽带","宽带平均在网时长","固话","固话平均在网时长","固移融合","固移融合平均在网时长","其他","其他平均在网时长","开户","业务变更","过户","销户","补办卡","退费","打发票及账单","积分兑换","活动受理","其他","缴费笔次","缴费金额","缴费笔次","缴费金额","3g存费送机","3g购机送费","3g存费送费","本省自备机","4g存费送机","4g购机送费","4g存费送费","合约惠机","宽带续费","固移融合续费","","","","","","","","",""],
           ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
           ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
           ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
           ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
           ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]];
var field=["GROUP_ID_1_NAME","HALL_ID","BUS_HALL_NAME","YYT_ARRE_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","GROUP_ID_2_NAME","CREATE_TIME","YYT_TYPE","OPERATE_TYPE","T_TYPE","MANAGE_NAME","AGENT_INNER_TIME","PACT_CREATE_TIME","PACT_INACTIVE_TIME","PACT_MONEY","AREA_STRUCTURE","YYT_NUM","AGENT_NUM","SELF_SERVICE_NUM","T_MANAGE_NAME","PHONE","SR_ACC_2G","SR_ACC_3G_DK","SR_ACC_3G_CFSJ","SR_ACC_3G_GJSF","SR_ACC_3G_CFSF","SR_ACC_3G_ZBJ","SR_ACC_3G_SWK","SR_ACC_3G_OT","SR_ACC_4G_DK","SR_ACC_4G_CFSJ","SR_ACC_4G_GJSF","SR_ACC_4G_CFSF","SR_ACC_4G_HYHJ","SR_ACC_4G_SWK","SR_ACC_4G_OT","SR_ACC_NET_KD","SR_ACC_NET_GH","SR_ACC_NET_GYRH","SR_ACC_NET_OT","SR_NEW_2G","SR_NEW_3G_DK","SR_NEW_3G_CFSJ","SR_NEW_3G_GJSF","SR_NEW_3G_CFSF","SR_NEW_3G_ZBJ","SR_NEW_3G_SWK","SR_NEW_3G_OT","SR_NEW_4G_DK","SR_NEW_4G_CFSJ","SR_NEW_4G_GJSF","SR_NEW_4G_CFSF","SR_NEW_4G_HYHJ","SR_NEW_4G_SWK","SR_NEW_4G_OT","SR_NEW_NET_KD","SR_NEW_NET_GH","SR_NEW_NET_GYRH","SR_NEW_NET_OT","COMM_ACC_JZ","COMM_ACC_BSS","COMM_ACC_QDBT","COMM_NEW_JZ","COMM_NEW_BSS","COMM_NEW_QDBT","DEV_2G","DEV_3G_DK","DEV_3G_CFSJ","DEV_3G_GJSF","DEV_3G_CFSF","DEV_3G_ZBJ","DEV_3G_SWK","DEV_3G_OT","DEV_4G_DK","DEV_4G_CFSJ","DEV_4G_GJSF","DEV_4G_CFSF","DEV_4G_HYHJ","DEV_4G_SWK","DEV_4G_OT","DEV_NET_KD","DEV_NET_GH","DEV_NET_GYRH","DEV_NET_OT","ON_TIME_2G","ON_TIME_2G_AVG","ON_TIME_3G_DK","ON_TIME_3G_DK_AVG","ON_TIME_3G_CFSJ","ON_TIME_3G_CFSJ_AVG","ON_TIME_3G_GJSF","ON_TIME_3G_GJSF_AVG","ON_TIME_3G_CFSF","ON_TIME_3G_CFSF_AVG","ON_TIME_3G_ZBJ","ON_TIME_3G_ZBJ_AVG","ON_TIME_3G_SWK","ON_TIME_3G_SWK_AVG","ON_TIME_3G_OT","ON_TIME_3G_OT_AVG","ON_TIME_4G_DK","ON_TIME_4G_DK_AVG","ON_TIME_4G_CFSJ","ON_TIME_4G_CFSJ_AVG","ON_TIME_4G_GJSF","ON_TIME_4G_GJSF_AVG","ON_TIME_4G_CFSF","ON_TIME_4G_CFSF_AVG","ON_TIME_4G_HYHJ","ON_TIME_4G_HYHJ_AVG","ON_TIME_4G_SWK","ON_TIME_4G_SWK_AVG","ON_TIME_4G_OT","ON_TIME_4G_OT_AVG","ON_TIME_NET_KD","ON_TIME_NET_KD_AVG","ON_TIME_NET_GH","ON_TIME_NET_GH_AVG","ON_TIME_NET_GYRH","ON_TIME_NET_GYRH_AVG","ON_TIME_NET_OT","ON_TIME_NET_OT_AVG","ACCEPT_KH","ACCEPT_YWBG","ACCEPT_GH","ACCEPT_XH","ACCEPT_BBK","ACCEPT_TF","ACCEPT_FPZD","ACCEPT_JFDH","ACCEPT_HDSL","ACCEPT_OT","PAY_TER_SUM","PAY_TER_MONEY","PAY_PER_SUM","PAY_PER_MONEY","CON_3G_CFSJ","CON_3G_GJSF","CON_3G_CFSF","CON_3G_ZBJ","CON_4G_CFSJ","CON_4G_GJSF","CON_4G_CFSF","CON_4G_HYHJ","CON_NET_XF","CON_NET_GYRH","RENT_MON","RENT_MAN_MON","JMWB","PER_COST","WE_FEE","FIT_FEE","SECURITY","ZDBT","ZDBT1"];
var orderBy = " ORDER BY GROUP_ID_1,HALL_ID";
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN},{eq:2,css:LchReport.SUM_PART_STYLE}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			
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
	var yyt_code=$("#yyt_code").val();
	var yyt_name=$("#yyt_name").val();
//条件
	var sql = " SELECT "+field.join(",")+" FROM PMRT.TB_MRT_BUS_EFF_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(yyt_code!=''){
		sql+=" AND HQ_CHAN_CODE LIKE '%" +yyt_code+"%'";
	}
	if(yyt_name!=''){
		sql+=" AND BUS_HALL_NAME LIKE '%" +yyt_name+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
	sql += orderBy;
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var showtext = '营业厅效能基础数据月报-'+time;
	downloadExcel(downSql,title,showtext);
}
