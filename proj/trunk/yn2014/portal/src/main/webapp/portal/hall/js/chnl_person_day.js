$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TAB_MRT_CHNL_PERSON_DAY"));
	var title=[["组织架构","营服中心","人员姓名","渠道名称","渠道状态","营服类型","当日发展用户数","","","","","","","本月累计发展用户数","","","","","","","累计环比","累计同比"],
	           ["","","","","","","合计","移网","其中2I2C","专线","宽带","固话","其他","合计","移网","其中2I2C","专线","宽带","固话","其他","",""]];
	var field=["ROW_NAME","UNIT_NAME","AGENT_M_NAME","GROUP_ID_4_NAME","STATE","UNIT_TYPE","DEV_ALL_NUM","DEV_MOB_NUM","DEV_2I2C_NUM","DEV_ZZX_NUM","DEV_BB_NUM","DEV_NET_NUM","DEV_OTHER","DEV_ALL_NUM1","DEV_MOB_NUM1","DEV_2I2C_NUM1","DEV_ZZX_NUM1","DEV_BB_NUM1","DEV_NET_NUM1","DEV_OTHER1","LJ_HB","LJ_TB"];
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
			var dealDate=$("#dealDate").val();
			var where=" PARTITION(P"+dealDate+")T WHERE 1=1";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省，显示市
					where+=" AND T.GROUP_ID_0='86000'";
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
					where+=" AND T.GROUP_ID_0='86000'";
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
	var where=" PARTITION(P"+dealDate+")T WHERE 1=1";
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
		where+=" AND T.UNIT_TYPE='"+unitType+"'";
	}
	var sql = getDownSql(where);
	var showtext = '用户发展日报-' + dealDate;
	var title=[["地市","营服中心","人员姓名","渠道名称","渠道状态","营服类型","当日发展用户数","","","","","","","本月累计发展用户数","","","","","","","累计环比","累计同比"],
	           ["","","","","","","合计","移网","其中2I2C","专线","宽带","固话","其他","合计","移网","其中2I2C","专线","宽带","固话","其他","",""]];
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
		where+=" AND T.UNIT_TYPE='"+unitType+"'";
	}
	var preSql="";
	var groupBy="";
	if(orgLevel==1){
		preSql="SELECT '云南省' ROW_NAME                                     "+
		"      ,'86000' ROW_ID                                             "+
		"      ,'--' UNIT_NAME                                             "+
		"      ,'--' HQ_CHAN_CODE                                          "+
		"      ,'--' GROUP_ID_4_NAME                                       "+
		"      ,'--' HR_ID                                                 "+
		"      ,'--' AGENT_M_NAME                                          "+
		"      ,'--' STATE                                                 "+
		"      ,'--' UNIT_TYPE";    
		
		groupBy="GROUP BY T.GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT T.GROUP_ID_1_NAME ROW_NAME                          "+
		"      ,T.GROUP_ID_1 ROW_ID                                        "+
		"      ,'--' UNIT_NAME                                             "+
		"      ,'--' HQ_CHAN_CODE                                          "+
		"      ,'--' GROUP_ID_4_NAME                                       "+
		"      ,'--' HR_ID                                                 "+
		"      ,'--' AGENT_M_NAME                                          "+
		"      ,'--' STATE                                                 "+
		"      ,'--' UNIT_TYPE";    
		
		groupBy="GROUP BY T.GROUP_ID_1,"+
	    "         T.GROUP_ID_1_NAME    ";
	}else if(orgLevel==3){
		preSql="SELECT T.UNIT_NAME ROW_NAME                                "+
		"      ,T.UNIT_ID ROW_ID                                           "+
		"      ,T.UNIT_NAME||'('||T.UNIT_iD||')' UNIT_NAME                 "+
		"      ,'--' HQ_CHAN_CODE                                          "+
		"      ,'--' GROUP_ID_4_NAME"+
		"      ,'--' HR_ID                                                 "+
		"      ,'--' AGENT_M_NAME                                          "+
		"      ,'--' STATE                                                 "+
		"      ,T.UNIT_TYPE";    
		
		groupBy="GROUP BY          "+
	    "         T.GROUP_ID_1_NAME"+
	    "        ,T.UNIT_ID        "+
	    "        ,T.UNIT_NAME      "+
	    "        ,T.UNIT_TYPE      ";
	}else if(orgLevel==4){//人
		preSql="SELECT T.AGENT_M_NAME ROW_NAME                             "+
		"      ,T.HR_ID ROW_ID                                             "+
		"      ,T.UNIT_NAME||'('||T.UNIT_iD||')' UNIT_NAME                 "+
		"      ,'--' HQ_CHAN_CODE                                          "+
		"      ,'--' GROUP_ID_4_NAME"+
		"      ,T.HR_ID                                                    "+
		"      ,T.AGENT_M_NAME||'('||T.HR_ID||')' AGENT_M_NAME             "+
		"      ,'--' STATE                                                 "+
		"      ,T.UNIT_TYPE                                                ";
	
		groupBy="GROUP BY          "+
	    "         T.GROUP_ID_1_NAME"+
	    "        ,T.UNIT_ID        "+
	    "        ,T.UNIT_NAME      "+
	    "        ,T.UNIT_TYPE      "+	
	    "        ,T.HR_ID          "+
	    "        ,T.AGENT_M_NAME   ";
	    
	}else{
		preSql="SELECT T.GROUP_ID_4_NAME ROW_NAME                          "+
		"      ,T.HQ_CHAN_CODE ROW_ID                                      "+
		"      ,T.UNIT_NAME||'('||T.UNIT_iD||')' UNIT_NAME                 "+
		"      ,T.HQ_CHAN_CODE                                             "+
		"      ,T.GROUP_ID_4_NAME||'('||T.HQ_CHAN_CODE||')' GROUP_ID_4_NAME"+
		"      ,T.HR_ID                                                    "+
		"      ,T.AGENT_M_NAME||'('||T.HR_ID||')' AGENT_M_NAME             "+
		"      ,T.STATE                                                    "+
		"      ,T.UNIT_TYPE                                                ";
	   
		groupBy="GROUP BY          "+
	    "         T.GROUP_ID_1_NAME"+
	    "        ,T.UNIT_ID        "+
	    "        ,T.UNIT_NAME      "+
	    "        ,T.HQ_CHAN_CODE   "+
	    "        ,T.GROUP_ID_4_NAME"+
	    "        ,T.HR_ID          "+
	    "        ,T.AGENT_M_NAME   "+
	    "        ,T.STATE          "+
	    "        ,T.UNIT_TYPE      ";
	}
	return preSql+getSumSql()+where+groupBy;
  }

function getDownSql(where){
	var preSql="SELECT T.GROUP_ID_1_NAME"+
	"      ,T.UNIT_NAME||'('||T.UNIT_iD||')' UNIT_NAME                 "+
	"      ,T.AGENT_M_NAME||'('||T.HR_ID||')' AGENT_M_NAME             "+
	"      ,T.GROUP_ID_4_NAME||'('||T.HQ_CHAN_CODE||')' GROUP_ID_4_NAME"+
	"      ,T.STATE                                                    "+
	"      ,T.UNIT_TYPE                                                ";
   
	var groupBy="GROUP BY      "+
    "         T.GROUP_ID_1_NAME"+
    "        ,T.UNIT_ID        "+
    "        ,T.UNIT_NAME      "+
    "        ,T.HQ_CHAN_CODE   "+
    "        ,T.GROUP_ID_4_NAME"+
    "        ,T.HR_ID          "+
    "        ,T.AGENT_M_NAME   "+
    "        ,T.STATE          "+
    "        ,T.UNIT_TYPE      ";
	
	return preSql+getSumSql()+where+groupBy;
}

function getSumSql(){
	return " ,SUM(NVL(T.DEV_ALL_NUM,0))DEV_ALL_NUM                                                                                        "+
	"      ,SUM(NVL(T.DEV_MOB_NUM,0))DEV_MOB_NUM                                                                                   "+
	"      ,SUM(NVL(T.DEV_2I2C_NUM,0))DEV_2I2C_NUM                                                                                 "+
	"      ,SUM(NVL(T.DEV_ZZX_NUM,0))DEV_ZZX_NUM                                                                                   "+
	"      ,SUM(NVL(T.DEV_BB_NUM,0))DEV_BB_NUM                                                                                     "+
	"      ,SUM(NVL(T.DEV_NET_NUM,0))DEV_NET_NUM                                                                                   "+
	"      ,SUM(NVL(T.DEV_OTHER,0))DEV_OTHER                                                                                       "+
	"      ,SUM(NVL(T.DEV_ALL_NUM1,0))DEV_ALL_NUM1                                                                                 "+
	"      ,SUM(NVL(T.DEV_MOB_NUM1,0))DEV_MOB_NUM1                                                                                 "+
	"      ,SUM(NVL(T.DEV_2I2C_NUM1,0))DEV_2I2C_NUM1                                                                               "+
	"      ,SUM(NVL(T.DEV_ZZX_NUM1,0))DEV_ZZX_NUM1                                                                                 "+
	"      ,SUM(NVL(T.DEV_BB_NUM1,0))DEV_BB_NUM1                                                                                   "+
	"      ,SUM(NVL(T.DEV_NET_NUM1,0))DEV_NET_NUM1                                                                                 "+
	"      ,SUM(NVL(T.DEV_OTHER1,0))DEV_OTHER1                                                                                     "+
	"      ,TRIM('.'FROM TO_CHAR(CASE WHEN SUM(NVL(T.HB_DEV_ALL_NUM1,0))=0 THEN 0                                                  "+
	"                                 ELSE (SUM(NVL(T.DEV_ALL_NUM1,0)-NVL(T.HB_DEV_ALL_NUM1,0)))*100/SUM(NVL(T.HB_DEV_ALL_NUM1,0)) "+
	"                                 END,'FM999990.99')) ||'%' LJ_HB                                                              "+
	"      ,TRIM('.'FROM TO_CHAR(CASE WHEN SUM(NVL(T.TB_DEV_ALL_NUM1,0))=0 THEN 0                                                  "+
	"                                 ELSE (SUM(NVL(T.DEV_ALL_NUM1,0)-NVL(T.TB_DEV_ALL_NUM1,0)))*100/SUM(NVL(T.TB_DEV_ALL_NUM1,0)) "+
	"                                 END,'FM999990.99')) ||'%' LJ_TB                                                              "+
	"FROM PMRT.TAB_MRT_CHNL_PERSON_DAY                                                                                             ";
}
