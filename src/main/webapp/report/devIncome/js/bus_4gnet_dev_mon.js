var report;
$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_4GNET_DEV_MON"));
	var title=[["组织架构","渠道编码","经营模式","自有厅4G网络新增用户数","","","","","","","全网4G网络新增用户数","","","","","",""],
	           ["","","","当月新增","当月新增同期增减量","当月新增同期增减比","其中当月发展数","其中存量用户数","新增中96及以上套餐用户数","新增中96及以上套餐用户数占比","当月新增","当月新增同期增减量","当月新增同期增减比","其中当月发展数","其中存量用户数","新增中96及以上套餐用户数","新增中96及以上套餐用户数占比"]];
	var field=["ROW_NAME","HQ_CHAN_CODE","OPERATE_TYPE","THIS_4GNET_NEW","THIS_4GNET_CHANGE","THIS_4GNET_HB","THIS_NEW_ALL","THIS_CL_NUM","THIS_ALL_96NEW","THIS_4GNET_ZB","QQD_THIS_4GNET_NEW","QQD_THIS_4GNET_CHANGE","QQD_THIS_4GNET_HB","QQD_THIS_NEW_ALL","QQD_THIS_CL_NUM","QQD_THIS_ALL_96NEW","QQD_THIS_4GNET_HB"];
	$("#searchBtn").click(function(){
		report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	});
	report=new LchReport({
		title:title,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var code=$("#code").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var where = "WHERE 1=1";
			var level;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//省进去点击市
					level=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//地市或营服进去点击市
					level=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=0;
					where+=" AND GROUP_ID_0=86000";
				}else if(orgLevel==2||orgLevel==3){//市
					level=1;
					code=region;
					orgLevel=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}
			orgLevel++;
			
			var dealDate=$("#dealDate").val();
			where+=" AND DEAL_DATE='"+dealDate+"'";
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			var sql="";
			if(level<2){
				sql=getFristSql(where);
			}else{
				sql=getSecondSql(where);
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

function getFristSql(where){
	var s="SELECT GROUP_ID_1 ROW_ID,                                                                                                    "+
	"      GROUP_ID_1_NAME ROW_NAME,                                                                                              "+
	"      '--' HQ_CHAN_CODE,                                                                                                     "+
	"      '--' OPERATE_TYPE,                                                                                                     "+
	"      SUM(NVL(THIS_4GNET_NEW,0))                              THIS_4GNET_NEW                                                 "+
	"      ,SUM(NVL(THIS_4GNET_NEW,0))-SUM(NVL(LAST_4GNET_NEW,0))   THIS_4GNET_CHANGE                                             "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_4GNET_NEW,0))<>0                                                          "+
	"                                 THEN (SUM(NVL(THIS_4GNET_NEW,0))-SUM(NVL(LAST_4GNET_NEW,0)))*100/SUM(NVL(LAST_4GNET_NEW,0)) "+
	"                                 ELSE 0 END                                                                                  "+
	"                                 || '%',2)                   THIS_4GNET_HB                                                   "+
	"      ,SUM(NVL(THIS_NEW_ALL,0))                                THIS_NEW_ALL                                                  "+
	"      ,SUM(NVL(THIS_CL_NUM,0))                                 THIS_CL_NUM                                                   "+
	"      ,SUM(NVL(THIS_ALL_96NEW,0))                              THIS_ALL_96NEW                                                "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_ALL_NUM,0))<>0                                                            "+
	"                                 THEN  SUM(NVL(THIS_ALL_96NEW,0))*100/SUM(NVL(THIS_ALL_NUM,0))                               "+
	"                                 ELSE 0 END                                                                                  "+
	"                                 || '%',2)                   THIS_4GNET_ZB                                                   "+
	"      ,NVL(QQD_THIS_4GNET_NEW,0)                                  QQD_THIS_4GNET_NEW                                         "+
	"      ,NVL(QQD_THIS_4GNET_NEW,0)-NVL(QQD_LAST_4GNET_NEW,0)   QQD_THIS_4GNET_CHANGE                                           "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_LAST_4GNET_NEW,0)<>0                                                           "+
	"                                 THEN (NVL(QQD_THIS_4GNET_NEW,0)-NVL(QQD_LAST_4GNET_NEW,0))*100/NVL(QQD_LAST_4GNET_NEW,0)    "+
	"                                 ELSE 0 END                                                                                  "+
	"                                 || '%',2)                         QQD_THIS_4GNET_HB                                         "+
	"      ,NVL(QQD_THIS_NEW_ALL,0)                                QQD_THIS_NEW_ALL                                               "+
	"      ,NVL(QQD_THIS_CL_NUM,0)                                 QQD_THIS_CL_NUM                                                "+
	"      ,NVL(QQD_THIS_ALL_96NEW,0)                              QQD_THIS_ALL_96NEW                                             "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_THIS_ALL_NUM,0)<>0                                                             "+
	"                                      THEN  NVL(QQD_THIS_ALL_96NEW,0)*100/NVL(QQD_THIS_ALL_NUM,0)                            "+
	"                                      ELSE 0 END                                                                             "+
	"                                      || '%',2)                   QQD_THIS_4GNET_HB                                          "+
	"FROM PMRT.TB_MRT_BUS_4GNET_DEV_MON                                                                                           "+
	                                                       where                                                                   +
	" GROUP BY GROUP_ID_1                                                                                                         "+
	"        ,GROUP_ID_1_NAME                                                                                                     "+
	"        ,QQD_THIS_4GNET_NEW                                                                                                  "+
	"        ,QQD_LAST_4GNET_NEW                                                                                                  "+
	"        ,QQD_THIS_NEW_ALL                                                                                                    "+
	"        ,QQD_THIS_CL_NUM                                                                                                     "+
	"        ,QQD_THIS_ALL_96NEW                                                                                                  "+
	"        ,QQD_THIS_ALL_NUM                                                                                                    ";
	return s;
}

function getSecondSql(where) {
	return "SELECT DEAL_DATE                                                                                                             "+
	"      ,GROUP_ID_1_NAME                                                                                                       "+
	"      ,BUS_HALL_NAME ROW_NAME                                                                                                "+
	"      ,HQ_CHAN_CODE                                                                                                          "+
	"      ,OPERATE_TYPE                                                                                                          "+
	"      ,SUM(NVL(THIS_4GNET_NEW,0))                              THIS_4GNET_NEW                                                "+
	"      ,SUM(NVL(THIS_4GNET_NEW,0))-SUM(NVL(LAST_4GNET_NEW,0))   THIS_4GNET_CHANGE                                             "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_4GNET_NEW,0))<>0                                                          "+
	"                                 THEN (SUM(NVL(THIS_4GNET_NEW,0))-SUM(NVL(LAST_4GNET_NEW,0)))*100/SUM(NVL(LAST_4GNET_NEW,0)) "+
	"                                 ELSE 0 END                                                                                  "+
	"                                 || '%',2)                   THIS_4GNET_HB                                                   "+
	"      ,SUM(NVL(THIS_NEW_ALL,0))                                THIS_NEW_ALL                                                  "+
	"      ,SUM(NVL(THIS_CL_NUM,0))                                 THIS_CL_NUM                                                   "+
	"      ,SUM(NVL(THIS_ALL_96NEW,0))                              THIS_ALL_96NEW                                                "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_ALL_NUM,0))<>0                                                            "+
	"                                 THEN  SUM(NVL(THIS_ALL_96NEW,0))*100/SUM(NVL(THIS_ALL_NUM,0))                               "+
	"                                 ELSE 0 END                                                                                  "+
	"                                 || '%',2)                   THIS_4GNET_ZB                                                   "+
	"          ,'--' QQD_THIS_4GNET_NEW                                                                                           "+
	"          ,'--' QQD_THIS_4GNET_CHANGE                                                                                        "+
	"          ,'--' QQD_THIS_4GNET_HB                                                                                            "+
	"          ,'--' QQD_THIS_NEW_ALL                                                                                             "+
	"          ,'--' QQD_THIS_CL_NUM                                                                                              "+
	"          ,'--' QQD_THIS_ALL_96NEW                                                                                           "+
	"          ,'--' QQD_THIS_4GNET_HB                                                                                            "+
	"FROM PMRT.TB_MRT_BUS_4GNET_DEV_MON                                                                                           "+
	                                                   where                                                                       +
	" GROUP BY DEAL_DATE,GROUP_ID_1_NAME,HQ_CHAN_CODE                                                                             "+
	"        ,BUS_HALL_NAME                                                                                                       "+
	"        ,OPERATE_TYPE                                                                                                        ";
}

function getDownSql(where) {
	return "SELECT DEAL_DATE                                                                                                             "+
	"      ,GROUP_ID_1_NAME                                                                                                       "+
	"      ,BUS_HALL_NAME ROW_NAME                                                                                                "+
	"      ,HQ_CHAN_CODE                                                                                                          "+
	"      ,OPERATE_TYPE                                                                                                          "+
	"      ,SUM(NVL(THIS_4GNET_NEW,0))                              THIS_4GNET_NEW                                                "+
	"      ,SUM(NVL(THIS_4GNET_NEW,0))-SUM(NVL(LAST_4GNET_NEW,0))   THIS_4GNET_CHANGE                                             "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_4GNET_NEW,0))<>0                                                          "+
	"                                 THEN (SUM(NVL(THIS_4GNET_NEW,0))-SUM(NVL(LAST_4GNET_NEW,0)))*100/SUM(NVL(LAST_4GNET_NEW,0)) "+
	"                                 ELSE 0 END                                                                                  "+
	"                                 || '%',2)                   THIS_4GNET_HB                                                   "+
	"      ,SUM(NVL(THIS_NEW_ALL,0))                                THIS_NEW_ALL                                                  "+
	"      ,SUM(NVL(THIS_CL_NUM,0))                                 THIS_CL_NUM                                                   "+
	"      ,SUM(NVL(THIS_ALL_96NEW,0))                              THIS_ALL_96NEW                                                "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_ALL_NUM,0))<>0                                                            "+
	"                                 THEN  SUM(NVL(THIS_ALL_96NEW,0))*100/SUM(NVL(THIS_ALL_NUM,0))                               "+
	"                                 ELSE 0 END                                                                                  "+
	"                                 || '%',2)                   THIS_4GNET_ZB                                                   "+
	"FROM PMRT.TB_MRT_BUS_4GNET_DEV_MON                                                                                           "+
	                                                   where                                                                       +
	" GROUP BY DEAL_DATE,GROUP_ID_1_NAME,HQ_CHAN_CODE                                                                             "+
	"        ,BUS_HALL_NAME                                                                                                       "+
	"        ,OPERATE_TYPE                                                                                                        ";
}

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where ="WHERE 1=1";
	where+=" AND DEAL_DATE='"+dealDate+"'";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = getDownSql(where);
	var showtext = '全渠道4G网络新增用户数' + dealDate;
	var title=[["账期","组织架构","","渠道编码","经营模式","自有厅4G网络新增用户数","","","","","",""],
	           ["","地市","营业厅","","","当月新增","当月新增同期增减量","当月新增同期增减比","其中当月发展数","其中存量用户数","新增中96及以上套餐用户数","新增中96及以上套餐用户数占比"]];
	downloadExcel(sql,title,showtext);
}
