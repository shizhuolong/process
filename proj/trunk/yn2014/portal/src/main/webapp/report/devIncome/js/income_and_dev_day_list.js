var nowData = [];
var field = ["GROUP_ID_4_NAME",    //      渠道（小区）名称   
             
             "DEV_2_CHW_NUM",    //      长话王发展量              
             "DEV_2_SHW_NUM",    //      市话王发展量              
             "DEV_2_BDW_NUM",    //      包打王发展量              
             "DEV_2_LLW_NUM",    //      流量王发展量              
             "DEV_2_JSK_NUM",    //      极速卡发展量              
             "DEV_2_OT_NUM",     //      2G其他发展量              
             "DEV_2G_NUM",       //      2G发展量   
                              //
                              //
             "DEV_3_DK_NUM",     //      3G单卡发展量              
             "DEV_3_GJSF_NUM",   //      购机送费发展量            
             "DEV_3_CFSJ_NUM",   //      存费送机发展量            
             "DEV_3_CFSF_NUM",   //      存费送费发展量            
             "DEV_3_ZBJ_NUM",    //      本省自备机发展量          
             "DEV_3_SWK_NUM",    //      上网卡发展量              
             "DEV_3_OT_NUM",     //      3G其他发展量              
             "DEV_3G_NUM",       //      3G发展量 
                              //
                              //
                              //
             "DEV_4_BDDK_NUM",   //      本地单卡发展量            
             "DEV_4_HYHJ_NUM",   //      本地套餐合约惠机发展量    
             "DEV_4_CFSF_NUM",   //      本地套餐存费送费发展量    
             "DEV_4_GJSF_NUM",   //      全国套餐购机送费发展量    
             "DEV_4_CFSJ_NUM",   //      全国套餐存费送机发展量    
             "DEV_4_HYHJ1_NUM",  //      全国套餐合约惠机发展量    
             "DEV_4_CFSF1_NUM",  //      全国套餐存费送费发展量    
             "DEV_4_OT_NUM",     //      4G其他发展量              
             "DEV_4G_NUM",       //      4G发展量  
                              //
                              //
             "DEV_ADSL_NUM",     //      ADSL发展量                
             "DEV_LAN_NUM",      //      LAN发展量                 
             "DEV_EOC_NUM",      //      EOC发展量                 
             "DEV_FTTH_NUM",     //      FTTH发展量                               
             "DEV_10M_NUM",      //      10M以上宽带发展量 
             "DEV_BB_NUM",       //      宽带发展量 
                              //
                              //
             "DEV_2_CHW_NUM1",   //      (月累计)长话王发展量      
             "DEV_2_SHW_NUM1",   //      (月累计)市话王发展量      
             "DEV_2_BDW_NUM1",   //      (月累计)包打王发展量      
             "DEV_2_LLW_NUM1",   //      (月累计)流量王发展量      
             "DEV_2_JSK_NUM1",   //      (月累计)极速卡发展量      
             "DEV_2_OT_NUM1",    //      (月累计)2G其他发展量      
             "DEV_2G_NUM1",      //      (月累计)2G发展量 
                              //
                              //
             "DEV_3_DK_NUM1",    //      (月累计)3G单卡发展量      
             "DEV_3_GJSF_NUM1",  //      (月累计)购机送费发展量    
             "DEV_3_CFSJ_NUM1",  //      (月累计)存费送机发展量    
             "DEV_3_CFSF_NUM1",  //      (月累计)存费送费发展量    
             "DEV_3_ZBJ_NUM1",   //      (月累计)本省自备机发展量  
             "DEV_3_SWK_NUM1",   //      (月累计)上网卡发展量      
             "DEV_3_OT_NUM1",    //      (月累计)3G其他发展量      
             "DEV_3G_NUM1",      //      (月累计)3G发展量 
                              //
                              //
             "DEV_4_BDDK_NUM1",  //      (月累计)本地单卡发展量    
             "DEV_4_HYHJ_NUM1",  //      (月累计)本地套餐合约惠机发展量 
             "DEV_4_CFSF_NUM1",  //      (月累计)本地套餐存费送费发展量 
             "DEV_4_GJSF_NUM1",  //      (月累计)全国套餐购机送费发展量 
             "DEV_4_CFSJ_NUM1",  //      (月累计)全国套餐存费送机发展量 
             "DEV_4_HYHJ1_NUM1", //      (月累计)全国套餐合约惠机发展量 
             "DEV_4_CFSF1_NUM1", //      (月累计)全国套餐存费送费发展量 
             "DEV_4_OT_NUM1",    //      (月累计)4G其他发展量      
             "DEV_4G_NUM1",      //      (月累计)4G发展量 
                              //
                              //
             "DEV_ADSL_NUM1",    //      (月累计)ADSL发展量        
             "DEV_LAN_NUM1",     //      (月累计)LAN发展量         
             "DEV_EOC_NUM1",     //      (月累计)EOC发展量         
             "DEV_FTTH_NUM1",    //      (月累计)FTTH发展量 
             "DEV_10M_NUM1",     //      (月累计)10M以上宽带发展量        
             "DEV_BB_NUM1",      //      (月累计)宽带发展量    
                              //
                              //
             "SR_2_CHW_NUM",     //      长话王收入                
             "SR_2_SHW_NUM",     //      市话王收入                
             "SR_2_BDW_NUM",     //      包打王收入                
             "SR_2_LLW_NUM",     //      流量王收入                
             "SR_2_JSK_NUM",     //      极速卡收入                
             "SR_2_OT_NUM",      //      2G其他收入                
             "SR_2G_NUM",        //      2G收入  
                              //
                              //
             "SR_3_DK_NUM",      //      3G单卡收入                
             "SR_3_GJSF_NUM",    //      购机送费收入              
             "SR_3_CFSJ_NUM",    //      存费送机收入              
             "SR_3_CFSF_NUM",    //      存费送费收入              
             "SR_3_ZBJ_NUM",     //      本省自备机收入            
             "SR_3_SWK_NUM",     //      上网卡收入                
             "SR_3_OT_NUM",      //      3G其他收入                
             "SR_3G_NUM",        //      3G收入   
                              //
             "SR_4_BDDK_NUM",    //      本地单卡收入              
             "SR_4_HYHJ_NUM",    //      本地套餐合约惠机收入      
             "SR_4_CFSF_NUM",    //      本地套餐存费送费收入      
             "SR_4_GJSF_NUM",    //      全国套餐购机送费收入      
             "SR_4_CFSJ_NUM",    //      全国套餐存费送机收入      
             "SR_4_HYHJ1_NUM",   //      全国套餐合约惠机收入      
             "SR_4_CFSF1_NUM",   //      全国套餐存费送费收入      
             "SR_4_OT_NUM",      //      4G其他收入                
             "SR_4G_NUM",        //      4G收入    
                              //
             "SR_ADSL_NUM",      //      ADSL收入                  
             "SR_LAN_NUM",       //      LAN收入                   
             "SR_EOC_NUM",       //      EOC收入                   
             "SR_FTTH_NUM",      //      FTTH收入     
             "SR_10M_NUM",       //      10M以上宽带收入             
             "SR_BB_NUM",        //      宽带收入    
                              //
             "DEV_ZZX_NUM",      //      专租线发展量              
             "DEV_ZZX_NUM1",     //      (月累计)专租线发展量      
             "SR_ZZX_NUM"];      //      专租线收入                
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : [["渠道（小区）名称","2G当日发展","","","","","","","3G当日发展","","","","","","","","4G当日发展","","","","","","","","","固网宽带当日发展","","","","","","2G累计发展","","","","","","","3G累计发展","","","","","","","","4G累计发展","","","","","","","","","固网宽带累计发展","","","","","","2G累计收入","","","","","","","3G累计收入","","","","","","","","4G累计收入","","","","","","","","","固网宽带累计收入","","","","","","集客专租线发展","","专租线收入"],
			       ["","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","当日发展","累计发展","累计收入"]]
		,
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
		sql += "  from PMRT.TAB_MRT_TARGET_CH_DAY partition(P"+month+") t where  t.unit_id='" + unitId
				+ "' and t.per_type='" + agentType
				+ "' and  t.AGENT_M_USERID='" + agentId + "' ";
	} else {
		sql += "  from PMRT.TAB_MRT_TARGET_CH_DAY partition(P"+month+") t where  t.unit_id='" + unitId
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
	if (pageNumber == 1) {
		report.showAllCols(0);
	}
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
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
		sql += "  from PMRT.TAB_MRT_TARGET_CH_DAY partition(P"+month+") t where  t.unit_id='" + unitId
				+ "' and t.per_type='" + agentType
				+ "' and t.AGENT_M_USERID='" + agentId + "' ";
	} else {
		sql += "  from PMRT.TAB_MRT_TARGET_CH_DAY partition(P"+month+") t where t.unit_id='" + unitId
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
	var title=
	[["营销架构","","","","","","","","日期","2G当日发展","","","","","","","3G当日发展","","","","","","","","4G当日发展","","","","","","","","","固网宽带当日发展","","","","","","2G累计发展","","","","","","","3G累计发展","","","","","","","","4G累计发展","","","","","","","","","固网宽带累计发展","","","","","","2G累计收入","","","","","","","3G累计收入","","","","","","","","4G累计收入","","","","","","","","","固网宽带累计收入","","","","","","集客专租线发展","","专租线收入"],
     ["地市","营服中心","人员","类型","HR编码","渠道（小区）名称","渠道（小区）状态","渠道（小区）编码","","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","当日发展","累计发展","累计收入"]];
	
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////