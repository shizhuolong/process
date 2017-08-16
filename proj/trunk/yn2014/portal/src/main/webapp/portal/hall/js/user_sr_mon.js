$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TAB_MRT_TARGET_CH_MON")); 
	var title=[["组织架构","区县/营服","营服编码","营服属性","渠道状态","出账收入（剔除赠费退费）","","","","","","","同比","","","","","","","环比","","","","","",""],
	           ["","","","","","合计","移网","其中2I2C","专线","宽带","固话","其他","合计","移网","其中2I2C","专线","宽带","固话","其他","合计","移网","其中2I2C","专线","宽带","固话","其他"]];
	var field=["ROW_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE","STATE","SR_ALL_NUM","SR_YW_NUM","SR_2I2C_NUM","SR_ZZX_NUM","SR_BB_NUM","SR_NET_NUM","SR_OTHER_NUM","SR_ALL_ZB","SR_YW_ZB","SR_2I2C_ZB","SR_ZZX_ZB","SR_BB_ZB","SR_NET_ZB","SR_OTHER_ZB","SR_ALL_TB","SR_YW_TB","SR_2I2C_TB","SR_ZZX_TB","SR_BB_TB","SR_NET_TB","SR_OTHER_TB"];
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		field:field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var where="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击市，显示营服
					where+=" AND T.GROUP_ID_1='"+code+"'";
					orgLevel=3;
				}else if(orgLevel==3){//点击市，展示营服
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服，展示人
					where+=" AND T.UNIT_ID='"+code+"'";
				}else if(orgLevel==5){//点击人，展示渠道
					where+=" AND T.HR_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(orgLevel,where);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					
				}else if(orgLevel==2){//市
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND T.UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(orgLevel,where);
				orgLevel++;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var name = $.trim($("#name").val());
	var state = $.trim($("#state").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var unitType = $.trim($("#unitType").val());
	var where="";
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND T.UNIT_ID='"+unitCode+"'";
	}
	if(name!=""){
		where+=" AND T.AGENT_M_NAME LIKE '%"+name+"%'";
	}
	if(hq_chan_name!=""){
		where+=" AND T.GROUP_ID_4_NAME LIKE '%"+hq_chan_name+"%'";
	}
	if(state!=""){
		where+=" AND T.STATE LIKE '%"+state+"%'";
	}
	if(unitType!=""){
		where+=" AND T3.IS_FIVE_CLASS='"+unitType+"'";
	}
	var sql = getDownSql(where);
	var showtext = '用户收入月报-' + dealDate;
	var title=[["地市","区县/营服","营服编码","营服属性","渠道状态","渠道经理HR","渠道经理","渠道编码","渠道名称","出账收入（剔除赠费退费）","","","","","","","同比","","","","","","","环比","","","","","",""],
     ["","","","","","","","","","合计","移网","其中2I2C","专线","宽带","固话","其他","合计","移网","其中2I2C","专线","宽带","固话","其他","合计","移网","其中2I2C","专线","宽带","固话","其他"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var name = $.trim($("#name").val());
	var state = $.trim($("#state").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var unitType = $.trim($("#unitType").val());
	
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND T.UNIT_ID='"+unitCode+"'";
	}
	if(name!=""){
		where+=" AND T.AGENT_M_NAME LIKE '%"+name+"%'";
	}
	if(hq_chan_name!=""){
		where+=" AND T.GROUP_ID_4_NAME LIKE '%"+hq_chan_name+"%'";
	}
	if(state!=""){
		where+=" AND T.STATE LIKE '%"+state+"%'";
	}
	if(unitType!=""){
		where+=" AND T3.IS_FIVE_CLASS='"+unitType+"'";
	}
	
	if(orgLevel==1||orgLevel==2){
		return "SELECT T.ROW_ID                                                                                               "+
		"      ,T.ROW_NAME                                                                                             "+
		"      ,'--' UNIT_NAME                                                                                         "+
		"      ,'--' UNIT_ID                                                                                           "+
		"      ,'--' UNIT_TYPE                                                                                         "+
		"      ,'--' STATE                                                                                             "+
		"      ,T.SR_ALL_NUM                                                                                          "+
		"      ,T.SR_YW_NUM                                                                                           "+
		"      ,T.SR_2I2C_NUM                                                                                         "+
		"      ,T.SR_ZZX_NUM                                                                                          "+
		"      ,T.SR_BB_NUM                                                                                           "+
		"      ,T.SR_NET_NUM                                                                                          "+
		"      ,T.SR_OTHER_NUM                                                                                        "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T2.SR_ALL_NUM,2)     SR_ALL_ZB                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T2.SR_YW_NUM,2)       SR_YW_ZB                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T2.SR_2I2C_NUM,2)   SR_2I2C_ZB                                        "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T2.SR_ZZX_NUM,2)     SR_ZZX_ZB                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T2.SR_BB_NUM,2)       SR_BB_ZB                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T2.SR_NET_NUM,2)     SR_NET_ZB                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T2.SR_OTHER_NUM,2) SR_OTHER_ZB                                       "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T1.SR_ALL_NUM,2)     SR_ALL_TB                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T1.SR_YW_NUM,2)       SR_YW_TB                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T1.SR_2I2C_NUM,2)   SR_2I2C_TB                                        "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T1.SR_ZZX_NUM,2)     SR_ZZX_TB                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T1.SR_BB_NUM,2)       SR_BB_TB                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T1.SR_NET_NUM,2)     SR_NET_TB                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T1.SR_OTHER_NUM,2) SR_OTHER_TB                                       "+
		"FROM (                                                                                                        "+
		"      select t.group_id_1 ROW_ID,                                                                             "+
		"             t.group_id_1_name ROW_NAME,                                                                      "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                          "+
		"             sum(t.SR_2G_NUM) + sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)  SR_YW_NUM,                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                     "+
		"         LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                 "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                              "+
		"       where t.DEAL_DATE = "+dealDate+"                                                                       "+
		        where+
		"       group by t.group_id_1, t.group_id_1_name                                                               "+
		"      union all                                                                                               "+
		"      select t.group_id_0 ROW_ID,                                                                             "+
		"             '全省合计' ROW_NAME,                                                                             "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                     "+
		"         LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                 "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                              "+
		"       where t.DEAL_DATE = "+dealDate+"                                                                       "+
		        where+
		"       group by t.group_id_0                                                                                  "+
		") T                                                                                                           "+
		"LEFT JOIN (                                                                                                   "+
		"      select t.group_id_1 ROW_ID,                                                                             "+
		"             t.group_id_1_name ROW_NAME,                                                                      "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                     "+
		"         LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                 "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                              "+
		"       where t.DEAL_DATE = "+getLastMonth(dealDate)+"                                                         "+
		        where+
		"       group by t.group_id_1, t.group_id_1_name                                                               "+
		"      union all                                                                                               "+
		"      select t.group_id_0 ROW_ID,                                                                             "+
		"             '全省合计' ROW_NAME,                                                                             "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                     "+
		"         LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                 "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                              "+
		"       where t.DEAL_DATE = "+getLastMonth(dealDate)+"                                                         "+
		        where+
		"       group by t.group_id_0                                                                                  "+
		")T1 ON (T.ROW_ID=T1.ROW_ID)                                                                                   "+
		"LEFT JOIN (                                                                                                   "+
		"      select t.group_id_1 ROW_ID,                                                                             "+
		"             t.group_id_1_name ROW_NAME,                                                                      "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                     "+
		"         LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                 "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                              "+
		"       where t.DEAL_DATE = "+getLastYearSameMonth(dealDate)+"                                                 "+
		        where+
		"       group by t.group_id_1, t.group_id_1_name                                                               "+
		"      union all                                                                                               "+
		"      select t.group_id_0 ROW_ID,                                                                             "+
		"             '全省合计' ROW_NAME,                                                                             "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                     "+
		"         LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                 "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                              "+
		"       where t.DEAL_DATE = "+getLastYearSameMonth(dealDate)+"                                                 "+
		        where+
		"       group by t.group_id_0                                                                                  "+
		")T2 ON (T.ROW_ID=T2.ROW_ID)                                                                                   ";
	}else if(orgLevel==3){
		return "SELECT                                                                                                           "+
		"       T.ROW_ID                                                                                                  "+
		"      ,T.ROW_NAME                                                                                                "+
		"      ,T.ROW_NAME UNIT_NAME,T.ROW_ID UNIT_ID,T.UNIT_TYPE                                                         "+
		"      ,'--' STATE                                                                                                "+
		"      ,T.SR_ALL_NUM                                                                                             "+
		"      ,T.SR_YW_NUM                                                                                              "+
		"      ,T.SR_2I2C_NUM                                                                                            "+
		"      ,T.SR_ZZX_NUM                                                                                             "+
		"      ,T.SR_BB_NUM                                                                                              "+
		"      ,T.SR_NET_NUM                                                                                             "+
		"      ,T.SR_OTHER_NUM                                                                                           "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T2.SR_ALL_NUM,2)     SR_ALL_ZB                                            "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T2.SR_YW_NUM,2)       SR_YW_ZB                                             "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T2.SR_2I2C_NUM,2)   SR_2I2C_ZB                                           "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T2.SR_ZZX_NUM,2)     SR_ZZX_ZB                                            "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T2.SR_BB_NUM,2)       SR_BB_ZB                                             "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T2.SR_NET_NUM,2)     SR_NET_ZB                                            "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T2.SR_OTHER_NUM,2) SR_OTHER_ZB                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T1.SR_ALL_NUM,2)     SR_ALL_TB                                            "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T1.SR_YW_NUM,2)       SR_YW_TB                                             "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T1.SR_2I2C_NUM,2)   SR_2I2C_TB                                           "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T1.SR_ZZX_NUM,2)     SR_ZZX_TB                                            "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T1.SR_BB_NUM,2)       SR_BB_TB                                             "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T1.SR_NET_NUM,2)     SR_NET_TB                                            "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T1.SR_OTHER_NUM,2) SR_OTHER_TB                                          "+
		"FROM (                                                                                                           "+
		"      select t.group_id_1,                                                                                       "+
		"             t.group_id_1_name ,                                                                                 "+
		"             t.unit_id ROW_ID,                                                                                   "+
		"             t.unit_name ROW_NAME,                                                                               "+
		"             DECODE(T3.IS_FIVE_CLASS,0,'本部',1,'集团'                                                           "+
		"                                        ,2,'营业',3,'固网'                                                       "+
		"                                        ,5,'客服','其他') UNIT_TYPE ,                                            "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                             "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                              "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                            "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                             "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                              "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                             "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                             "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM          "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                        "+
		"        LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                     "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                                 "+
		"       where t.DEAL_DATE = "+dealDate+"                                                                          "+
		        where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T3.IS_FIVE_CLASS                           "+
		") T                                                                                                              "+
		"LEFT JOIN (                                                                                                      "+
		"      select t.group_id_1,                                                                                       "+
		"             t.group_id_1_name ,                                                                                 "+
		"             t.unit_id ROW_ID,                                                                                   "+
		"             t.unit_name ROW_NAME,                                                                               "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                             "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                              "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                            "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                             "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                              "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                             "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                             "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM          "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                        "+
		"       where t.DEAL_DATE = "+getLastMonth(dealDate)+"                                                            "+
		         where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME                                            "+
		")T1 ON (T.ROW_ID=T1.ROW_ID)                                                                                      "+
		"LEFT JOIN (                                                                                                      "+
		"      select t.group_id_1,                                                                                       "+
		"             t.group_id_1_name ,                                                                                 "+
		"             t.unit_id ROW_ID,                                                                                   "+
		"             t.unit_name ROW_NAME,                                                                               "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                             "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                              "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                            "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                             "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                              "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                             "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                             "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM          "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                        "+
		"       where t.DEAL_DATE = "+getLastYearSameMonth(dealDate)+"                                                    "+
		        where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME                                            "+
		")T2 ON (T.ROW_ID=T2.ROW_ID)                                                                                      ";
	}else if(orgLevel==4){
		return "SELECT T.ROW_ID                                                                                                    "+
		"      ,T.ROW_NAME                                                                                                  "+
		"      ,t.unit_id                                                                                                   "+
		"      ,t.unit_name                                                                                                 "+
		"      ,T.UNIT_TYPE                                                                                                 "+
		"      ,'--' STATE                                                                                                  "+
		"      ,T.SR_ALL_NUM                                                                                               "+
		"      ,T.SR_YW_NUM                                                                                                "+
		"      ,T.SR_2I2C_NUM                                                                                              "+
		"      ,T.SR_ZZX_NUM                                                                                               "+
		"      ,T.SR_BB_NUM                                                                                                "+
		"      ,T.SR_NET_NUM                                                                                               "+
		"      ,T.SR_OTHER_NUM                                                                                             "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T2.SR_ALL_NUM,2)     SR_ALL_ZB                                              "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T2.SR_YW_NUM,2)       SR_YW_ZB                                               "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T2.SR_2I2C_NUM,2)   SR_2I2C_ZB                                             "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T2.SR_ZZX_NUM,2)     SR_ZZX_ZB                                              "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T2.SR_BB_NUM,2)       SR_BB_ZB                                               "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T2.SR_NET_NUM,2)     SR_NET_ZB                                              "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T2.SR_OTHER_NUM,2) SR_OTHER_ZB                                            "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T1.SR_ALL_NUM,2)     SR_ALL_TB                                              "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T1.SR_YW_NUM,2)       SR_YW_TB                                               "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T1.SR_2I2C_NUM,2)   SR_2I2C_TB                                             "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T1.SR_ZZX_NUM,2)     SR_ZZX_TB                                              "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T1.SR_BB_NUM,2)       SR_BB_TB                                               "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T1.SR_NET_NUM,2)     SR_NET_TB                                              "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T1.SR_OTHER_NUM,2) SR_OTHER_TB                                            "+
		"FROM (                                                                                                             "+
		"      select t.group_id_1,                                                                                         "+
		"             t.group_id_1_name ,                                                                                   "+
		"             t.unit_id ,                                                                                           "+
		"             t.unit_name ,                                                                                         "+
		"             DECODE(T3.IS_FIVE_CLASS,0,'本部',1,'集团'                                                             "+
		"                                        ,2,'营业',3,'固网'                                                         "+
		"                                        ,5,'客服','其他') UNIT_TYPE ,                                              "+
		"             NVL(t.HR_ID,'WQDJL') ROW_ID,                                                                          "+
		"             NVL(t.AGENT_M_NAME,'无渠道经理') ROW_NAME,                                                            "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                               "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                              "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                               "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                               "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                               "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM            "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                          "+
		"        LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                       "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                                   "+
		"       where t.DEAL_DATE = "+dealDate+"                                                                            "+
		         where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,T.AGENT_M_NAME,T3.IS_FIVE_CLASS      "+
		") T                                                                                                                "+
		"LEFT JOIN (                                                                                                        "+
		"      select t.group_id_1,                                                                                         "+
		"             t.group_id_1_name ,                                                                                   "+
		"             t.unit_id ,                                                                                           "+
		"             t.unit_name ,                                                                                         "+
		"             NVL(t.HR_ID,'WQDJL') ROW_ID,                                                                          "+
		"             NVL(t.AGENT_M_NAME,'无渠道经理') ROW_NAME,                                                            "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                               "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                              "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                               "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                               "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                               "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM            "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                          "+
		"       where t.DEAL_DATE = "+getLastMonth(dealDate)+"                                                              "+
		         where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,T.AGENT_M_NAME                       "+
		")T1 ON (T.GROUP_ID_1=T1.GROUP_ID_1 AND T.UNIT_ID=T1.UNIT_ID AND T.ROW_ID=T1.ROW_ID)                                "+
		"LEFT JOIN (                                                                                                        "+
		"      select t.group_id_1,                                                                                         "+
		"             t.group_id_1_name ,                                                                                   "+
		"             t.unit_id ,                                                                                           "+
		"             t.unit_name ,                                                                                         "+
		"             NVL(t.HR_ID,'WQDJL') ROW_ID,                                                                          "+
		"             NVL(t.AGENT_M_NAME,'无渠道经理') ROW_NAME,                                                            "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                               "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                              "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                               "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                               "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                               "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM            "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                          "+
		"       where t.DEAL_DATE = "+getLastYearSameMonth(dealDate)+"                                                      "+
		        where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,T.AGENT_M_NAME                       "+
		")T2 ON (T.GROUP_ID_1=T2.GROUP_ID_1 AND T.UNIT_ID=T2.UNIT_ID AND T.ROW_ID=T2.ROW_ID)                                ";
	}else{
		return "SELECT                                                                                                                 "+
		"       T.ROW_NAME                                                                                                             "+
		"      ,T.ROW_ID                                                                                                               "+
		"      ,T.UNIT_NAME                                                                                                            "+
		"      ,T.UNIT_ID                                                                                                              "+
		"      ,T.UNIT_TYPE                                                                                                            "+
		"      ,T.STATE                                                                                                                "+
		"      ,T.SR_ALL_NUM                                                                                                          "+
		"      ,T.SR_YW_NUM                                                                                                           "+
		"      ,T.SR_2I2C_NUM                                                                                                         "+
		"      ,T.SR_ZZX_NUM                                                                                                          "+
		"      ,T.SR_BB_NUM                                                                                                           "+
		"      ,T.SR_NET_NUM                                                                                                          "+
		"      ,T.SR_OTHER_NUM                                                                                                        "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T2.SR_ALL_NUM,2)     SR_ALL_ZB                                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T2.SR_YW_NUM,2)       SR_YW_ZB                                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T2.SR_2I2C_NUM,2)   SR_2I2C_ZB                                                        "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T2.SR_ZZX_NUM,2)     SR_ZZX_ZB                                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T2.SR_BB_NUM,2)       SR_BB_ZB                                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T2.SR_NET_NUM,2)     SR_NET_ZB                                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T2.SR_OTHER_NUM,2) SR_OTHER_ZB                                                       "+
		"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T1.SR_ALL_NUM,2)     SR_ALL_TB                                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T1.SR_YW_NUM,2)       SR_YW_TB                                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T1.SR_2I2C_NUM,2)   SR_2I2C_TB                                                        "+
		"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T1.SR_ZZX_NUM,2)     SR_ZZX_TB                                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T1.SR_BB_NUM,2)       SR_BB_TB                                                          "+
		"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T1.SR_NET_NUM,2)     SR_NET_TB                                                         "+
		"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T1.SR_OTHER_NUM,2) SR_OTHER_TB                                                       "+
		"FROM (                                                                                                                        "+
		"      select t.group_id_1,                                                                                                    "+
		"             t.group_id_1_name ,                                                                                              "+
		"             t.unit_id ,                                                                                                      "+
		"             t.unit_name ,                                                                                                    "+
		"             DECODE(T3.IS_FIVE_CLASS,0,'本部',1,'集团'                                                                           "+
		"                                      ,2,'营业',3,'固网'                                                                         "+
		"                                      ,5,'客服','其他') UNIT_TYPE ,                                                              "+
		"             NVL(t.HR_ID,'WQDJL') HR_ID,                                                                                      "+
		"             NVL(t.AGENT_M_NAME,'无渠道经理')AGENT_M_NAME,                                                                       "+
		"             T.HQ_CHAN_CODE ROW_ID,                                                                                           "+
		"             T.STATE,                                                                                                         "+
		"             T.GROUP_ID_4_NAME ROW_NAME,                                                                                      "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM                       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                                     "+
		"        LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                                  "+
		"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                                              "+
		"       where t.DEAL_DATE = "+dealDate+"                                                                                       "+
		         where+                                         
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,                                                "+
		"                T.AGENT_M_NAME,T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME,T3.IS_FIVE_CLASS,T.STATE                                      "+
		") T                                                                                                                           "+
		"LEFT JOIN (                                                                                                                   "+
		"      select t.group_id_1,                                                                                                    "+
		"             t.group_id_1_name ,                                                                                              "+
		"             t.unit_id ,                                                                                                      "+
		"             t.unit_name ,                                                                                                    "+
		"             NVL(t.HR_ID,'WQDJL') HR_ID,                                                                                      "+
		"             NVL(t.AGENT_M_NAME,'无渠道经理')AGENT_M_NAME,                                                                       "+
		"             T.HQ_CHAN_CODE ROW_ID,                                                                                           "+
		"             T.GROUP_ID_4_NAME ROW_NAME,                                                                                      "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM                       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                                     "+
		"       where t.DEAL_DATE = '"+getLastMonth(dealDate)+"'                                                                       "+
		         where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,T.AGENT_M_NAME,T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME "+
		")T1 ON (T.GROUP_ID_1=T1.GROUP_ID_1 AND T.UNIT_ID=T1.UNIT_ID AND T.ROW_ID=T1.ROW_ID)                                           "+
		"LEFT JOIN (                                                                                                                   "+
		"      select t.group_id_1,                                                                                                    "+
		"             t.group_id_1_name ,                                                                                              "+
		"             t.unit_id ,                                                                                                      "+
		"             t.unit_name ,                                                                                                    "+
		"             NVL(t.HR_ID,'WQDJL') HR_ID,                                                                                      "+
		"             NVL(t.AGENT_M_NAME,'无渠道经理')AGENT_M_NAME,                                                                       "+
		"             T.HQ_CHAN_CODE  ROW_ID,                                                                                          "+
		"             T.GROUP_ID_4_NAME ROW_NAME,                                                                                      "+
		"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                                          "+
		"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                           "+
		"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                                         "+
		"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                                          "+
		"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                           "+
		"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                                          "+
		"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                                          "+
		"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM                       "+
		"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                                     "+
		"       where t.DEAL_DATE = '"+getLastYearSameMonth(dealDate)+"'                                                               "+
		        where+
		"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,T.AGENT_M_NAME,T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME "+
		")T2 ON (T.GROUP_ID_1=T2.GROUP_ID_1 AND T.UNIT_ID=T2.UNIT_ID AND T.ROW_ID=T2.ROW_ID)                                           ";
	}
  }

function getDownSql(where){
	var dealDate=$("#dealDate").val();
	return "SELECT                                                                                                                 "+
	"       T.GROUP_ID_1_NAME                                                                                                      "+
	"      ,T.UNIT_NAME                                                                                                            "+
	"      ,T.UNIT_ID                                                                                                              "+
	"      ,T.UNIT_TYPE                                                                                                            "+
	"      ,T.STATE                                                                                                                "+
	"      ,T.HR_ID,T.AGENT_M_NAME,T.ROW_ID,T.ROW_NAME"+
	"      ,T.SR_ALL_NUM                                                                                                          "+
	"      ,T.SR_YW_NUM                                                                                                           "+
	"      ,T.SR_2I2C_NUM                                                                                                         "+
	"      ,T.SR_ZZX_NUM                                                                                                          "+
	"      ,T.SR_BB_NUM                                                                                                           "+
	"      ,T.SR_NET_NUM                                                                                                          "+
	"      ,T.SR_OTHER_NUM                                                                                                        "+
	"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T2.SR_ALL_NUM,2)     SR_ALL_ZB                                                         "+
	"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T2.SR_YW_NUM,2)       SR_YW_ZB                                                          "+
	"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T2.SR_2I2C_NUM,2)   SR_2I2C_ZB                                                        "+
	"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T2.SR_ZZX_NUM,2)     SR_ZZX_ZB                                                         "+
	"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T2.SR_BB_NUM,2)       SR_BB_ZB                                                          "+
	"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T2.SR_NET_NUM,2)     SR_NET_ZB                                                         "+
	"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T2.SR_OTHER_NUM,2) SR_OTHER_ZB                                                       "+
	"      ,PMRT.LINK_RATIO(T.SR_ALL_NUM,T1.SR_ALL_NUM,2)     SR_ALL_TB                                                         "+
	"      ,PMRT.LINK_RATIO(T.SR_YW_NUM,T1.SR_YW_NUM,2)       SR_YW_TB                                                          "+
	"      ,PMRT.LINK_RATIO(T.SR_2I2C_NUM,T1.SR_2I2C_NUM,2)   SR_2I2C_TB                                                        "+
	"      ,PMRT.LINK_RATIO(T.SR_ZZX_NUM,T1.SR_ZZX_NUM,2)     SR_ZZX_TB                                                         "+
	"      ,PMRT.LINK_RATIO(T.SR_BB_NUM,T1.SR_BB_NUM,2)       SR_BB_TB                                                          "+
	"      ,PMRT.LINK_RATIO(T.SR_NET_NUM,T1.SR_NET_NUM,2)     SR_NET_TB                                                         "+
	"      ,PMRT.LINK_RATIO(T.SR_OTHER_NUM,T1.SR_OTHER_NUM,2) SR_OTHER_TB                                                       "+
	"FROM (                                                                                                                        "+
	"      select t.group_id_1,                                                                                                    "+
	"             t.group_id_1_name ,                                                                                              "+
	"             t.unit_id ,                                                                                                      "+
	"             t.unit_name ,                                                                                                    "+
	"             DECODE(T3.IS_FIVE_CLASS,0,'本部',1,'集团'                                                                           "+
	"                                      ,2,'营业',3,'固网'                                                                         "+
	"                                      ,5,'客服','其他') UNIT_TYPE ,                                                              "+
	"             NVL(t.HR_ID,'WQDJL') HR_ID,                                                                                      "+
	"             NVL(t.AGENT_M_NAME,'无渠道经理')AGENT_M_NAME,                                                                       "+
	"             T.HQ_CHAN_CODE ROW_ID,                                                                                           "+
	"             T.STATE,                                                                                                         "+
	"             T.GROUP_ID_4_NAME ROW_NAME,                                                                                      "+
	"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                                          "+
	"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                           "+
	"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                                         "+
	"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                                          "+
	"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                           "+
	"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                                          "+
	"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                                          "+
	"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM                       "+
	"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                                     "+
	"        LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3                                                                                  "+
	"        ON(T.UNIT_ID=T3.UNIT_ID)                                                                                              "+
	"       where t.DEAL_DATE = "+dealDate+"                                                                                       "+
	         where+                                         
	"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,                                                "+
	"                T.AGENT_M_NAME,T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME,T3.IS_FIVE_CLASS,T.STATE                                      "+
	") T                                                                                                                           "+
	"LEFT JOIN (                                                                                                                   "+
	"      select t.group_id_1,                                                                                                    "+
	"             t.group_id_1_name ,                                                                                              "+
	"             t.unit_id ,                                                                                                      "+
	"             t.unit_name ,                                                                                                    "+
	"             NVL(t.HR_ID,'WQDJL') HR_ID,                                                                                      "+
	"             NVL(t.AGENT_M_NAME,'无渠道经理')AGENT_M_NAME,                                                                       "+
	"             T.HQ_CHAN_CODE ROW_ID,                                                                                           "+
	"             T.GROUP_ID_4_NAME ROW_NAME,                                                                                      "+
	"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                                          "+
	"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                           "+
	"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                                         "+
	"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                                          "+
	"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                           "+
	"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                                          "+
	"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                                          "+
	"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM                       "+
	"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                                     "+
	"       where t.DEAL_DATE = '"+getLastMonth(dealDate)+"'                                                                       "+
	         where+
	"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,T.AGENT_M_NAME,T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME "+
	")T1 ON (T.GROUP_ID_1=T1.GROUP_ID_1 AND T.UNIT_ID=T1.UNIT_ID AND T.ROW_ID=T1.ROW_ID)                                           "+
	"LEFT JOIN (                                                                                                                   "+
	"      select t.group_id_1,                                                                                                    "+
	"             t.group_id_1_name ,                                                                                              "+
	"             t.unit_id ,                                                                                                      "+
	"             t.unit_name ,                                                                                                    "+
	"             NVL(t.HR_ID,'WQDJL') HR_ID,                                                                                      "+
	"             NVL(t.AGENT_M_NAME,'无渠道经理')AGENT_M_NAME,                                                                       "+
	"             T.HQ_CHAN_CODE  ROW_ID,                                                                                          "+
	"             T.GROUP_ID_4_NAME ROW_NAME,                                                                                      "+
	"             SUM(T.SR_ALL_NUM)                                         SR_ALL_NUM,                                          "+
	"             sum(t.SR_2G_NUM) +sum(t.SR_3G_NUM) + sum(t.SR_4G_NUM)   SR_YW_NUM,                                           "+
	"             SUM(T.SR_2I2C_NUM)                                        SR_2I2C_NUM,                                         "+
	"             SUM(T.SR_ZZX_NUM)                                         SR_ZZX_NUM,                                          "+
	"             sum(t.SR_BB_NUM)                                          SR_BB_NUM,                                           "+
	"             SUM(T.SR_NET_NUM)                                         SR_NET_NUM,                                          "+
	"             SUM(T.SR_ALL_NUM)-sum(t.SR_2G_NUM)-sum(t.SR_3G_NUM)-                                                          "+
	"             sum(t.SR_4G_NUM)-SUM(T.SR_ZZX_NUM)- sum(t.SR_BB_NUM) - SUM(T.SR_NET_NUM) SR_OTHER_NUM                       "+
	"        from PMRT.TAB_MRT_TARGET_CH_MON t                                                                                     "+
	"       where t.DEAL_DATE = '"+getLastYearSameMonth(dealDate)+"'                                                               "+
	        where+
	"       group by t.group_id_1, t.group_id_1_name,T.UNIT_ID,T.UNIT_NAME,T.HR_ID,T.AGENT_M_NAME,T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME "+
	")T2 ON (T.GROUP_ID_1=T2.GROUP_ID_1 AND T.UNIT_ID=T2.UNIT_ID AND T.ROW_ID=T2.ROW_ID)                                           ";

}

function getLastMonth(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    if(month=='01'){
    	return (year-1)+'12';
    }
   return dealDate-1;
}

function getFristMonth(dealDate){
	var year=dealDate.substr(0,4);
	return year+'01';
}

function getLastYearSameMonth(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    return (year-1)+month;
}

function getLastYearEndMonth(dealDate){
	var year=dealDate.substr(0,4);
	return (year-1)+'12';
}