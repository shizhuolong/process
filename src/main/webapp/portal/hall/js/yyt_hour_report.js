$(function(){
	$("#dealDate").val(getMaxDate("PMRT.VIEW_MRT_ALL_DEV_HOUR"));
	var title=[["组织架构","渠道状态","移网","宽带","固话","专线","智慧沃家","沃家电视"]];
	var field=["ROW_NAME","CHNL_STATE","DEV_MOB","DEV_KD","DEV_GH","DEV_ZZX","DEV_ZHWJ","DEV_WJDS"];
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
			var where=" WHERE T.DEAL_DATE='"+dealDate+"'";
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
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var where=" WHERE T.DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND T.UNIT_ID='"+unitCode+"'";
	}
	if(name!=""){
		where+=" AND T.NAME LIKE '%"+name+"%'";
	}
	if(hq_chan_name!=""){
		where+=" AND T.GROUP_ID_4_NAME LIKE '%"+hq_chan_name+"%'";
	}
	var sql = getDownSql(where);
	var showtext = '产品实时销量-' + dealDate;
	var title=[["地市","营服中心","人员姓名","渠道名称","渠道状态","移网","宽带","固话","专线","智慧沃家","沃家电视"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var name = $.trim($("#name").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND T.UNIT_ID='"+unitCode+"'";
	}
	if(name!=""){
		where+=" AND T.NAME LIKE '%"+name+"%'";
	}
	if(hq_chan_name!=""){
		where+=" AND T.GROUP_ID_4_NAME LIKE '%"+hq_chan_name+"%'";
	}
	var preSql="";
	var groupBy="";
	if(orgLevel==1){
	    preSql="SELECT '云南省' ROW_NAME                                     "+
		"      ,'86000' ROW_ID                                             "+
		"      ,'--' CHNL_STATE                                            ";
		
	    groupBy=" GROUP BY T.GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT T.GROUP_ID_1_NAME ROW_NAME                          "+
		"      ,T.GROUP_ID_1 ROW_ID                                        "+
		"      ,'--' CHNL_STATE                                            ";
		
		groupBy=" GROUP BY T.GROUP_ID_1,"+
	    "         T.GROUP_ID_1_NAME     ";
	}else if(orgLevel==3){
		preSql="SELECT T.UNIT_NAME ROW_NAME                                "+
		"      ,T.UNIT_ID ROW_ID                                           "+
		"      ,'--' CHNL_STATE                                            ";
		
		groupBy="GROUP BY          "+
	    "         T.GROUP_ID_1_NAME"+
	    "        ,T.UNIT_ID        "+
	    "        ,T.UNIT_NAME      ";
	}else if(orgLevel==4){//人
		preSql="SELECT T.NAME ROW_NAME                                     "+
		"      ,T.HR_ID ROW_ID                                             "+
		"      ,'--' CHNL_STATE                                            ";
	
		groupBy="GROUP BY          "+
	    "         T.HR_ID          "+
	    "        ,T.NAME           ";
	    
	}else{
		preSql="SELECT T.GROUP_ID_4_NAME ROW_NAME                          "+
		"      ,T.HQ_CHAN_CODE ROW_ID                                      "+
		"      ,T.CHNL_STATE                                               ";
	   
		groupBy="GROUP BY          "+
	    "         T.HQ_CHAN_CODE   "+
	    "        ,T.GROUP_ID_4_NAME"+
	    "        ,T.CHNL_STATE     ";
	}
	return preSql+getSumSql()+where+groupBy;
  }

function getDownSql(where){
	var preSql="SELECT T.GROUP_ID_1_NAME                               "+
	"      ,T.UNIT_NAME||'('||T.UNIT_ID||')' UNIT_NAME                 "+
	"      ,T.NAME||'('||T.HR_ID||')' NAME                             "+
	"      ,T.GROUP_ID_4_NAME||'('||T.HQ_CHAN_CODE||')' GROUP_ID_4_NAME"+
	"      ,T.CHNL_STATE                                               ";
   
	var groupBy="GROUP BY      "+
    "         T.GROUP_ID_1_NAME"+
    "        ,T.UNIT_ID        "+
    "        ,T.UNIT_NAME      "+
    "        ,T.HQ_CHAN_CODE   "+
    "        ,T.GROUP_ID_4_NAME"+
    "        ,T.HR_ID          "+
    "        ,T.NAME           "+
    "        ,T.CHNL_STATE     ";
	
	return preSql+getSumSql()+where+groupBy;
}

function getSumSql(){
	return " ,SUM(NVL(T.DEV_2G,0)+NVL(T.DEV_3G,0)+NVL(T.DEV_4G,0)+NVL(T.DEV_WIFI,0)) DEV_MOB"+
	"      ,SUM(NVL(T.DEV_KD,0))DEV_KD                                               "+
	"      ,SUM(NVL(T.DEV_GH,0))DEV_GH                                               "+
	"      ,SUM(NVL(T.DEV_ZZX,0))DEV_ZZX                                             "+
	"      ,SUM(NVL(T.DEV_ZHWJ,0))DEV_ZHWJ                                           "+
	"      ,SUM(NVL(T.DEV_WJDS,0))DEV_WJDS                                           "+
	"FROM PMRT.VIEW_MRT_ALL_DEV_HOUR T                                               ";
}
