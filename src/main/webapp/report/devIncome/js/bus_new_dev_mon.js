var title="";
var field="";
$(function(){
	search();
	$("#searchBtn").click(function(){
		$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		search();
	});
});
function search(){
	title=[["自有营业厅新发展用户发展质量月报","","","","","","","","","","","","","","","","","","","","","","",""],
		       ["州市","厅数","经营模式（自营/柜台/他营)","分类(旗舰/标准/小型）","当月新发展用户发展质量","","","","","","","","","","累计新发展用户发展质量","","","","","","","","",""],
		       ["","","","","新增用户数","活跃用户数","占比","三无用户数","占比","极低用户数","占比","纯短信用户数","占比","正常服务用户","新增用户数","活跃用户数","占比","三无用户数","占比","极低用户数","占比","纯短信用户数","占比","正常服务用户"]];

	field=["ROW_NAME","HALL_COUNT","OPERATE_TYPE","CHNL_TYPE","DEV_NUM","ACTIVE_NUM","ZB_ACTIVE","SW_NUM","ZB_SW","JD_NUM","ZB_JD","CMS","ZB_CMS","NORMAL_NUM","DEV_NUM1","ACTIVE_NUM1","ZB_ACTIVE1","SW_NUM1","ZB_SW1","JD_NUM1","ZB_JD1","CMS1","ZB_CMS1","NORMAL_NUM1"];
	var report=new LchReport({
		title:title,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var code='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var chnlType=$("#chnlType").val();
			var where=" WHERE DEAL_DATE='"+dealDate+"'";
			var groupBy = "";
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,COUNT(DISTINCT HQ_CHAN_CODE) HALL_COUNT,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME"; 
					where+=" AND GROUP_ID_0=86000";
				}else if(orgLevel==3){//点击市
					preField=" HQ_CHAN_CODE ROW_ID,BUS_HALL_NAME ROW_NAME,'--' HALL_COUNT,OPERATE_TYPE,CHNL_TYPE,";
					groupBy = " GROUP BY BUS_HALL_NAME,HQ_CHAN_CODE,OPERATE_TYPE,CHNL_TYPE"; 
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,COUNT(DISTINCT HQ_CHAN_CODE) HALL_COUNT,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy = " GROUP BY GROUP_ID_0"; 
					where+=" AND GROUP_ID_0=86000";
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=" GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,COUNT(DISTINCT HQ_CHAN_CODE) HALL_COUNT,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME"; 
					where+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=3;
				}else{
					return {data:[],extra:{}};
				}
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
			if(chnlType!=""){
				where += " AND CHNL_TYPE ='"+chnlType+"' ";
			}
			
			var sql="SELECT "+preField+getSumSql()+where+groupBy;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
}

function getSumSql() {
	return " NVL(SUM(DEV_NUM),0)    DEV_NUM                      "+
	",NVL(SUM(ACTIVE_NUM ),0) ACTIVE_NUM                         "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM),0)<>0                           "+
	"      THEN NVL(SUM(ACTIVE_NUM),0)*100/NVL(SUM(DEV_NUM),0)   "+
	"      ELSE 0 END ||'%',2)     ZB_ACTIVE                     "+
	",NVL(SUM(SW_NUM),0)          SW_NUM                         "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM),0)<>0                           "+
	"      THEN NVL(SUM(SW_NUM),0)*100/NVL(SUM(DEV_NUM),0)       "+
	"      ELSE 0 END ||'%',2)   ZB_SW                           "+
	",NVL(SUM(JD_NUM),0)         JD_NUM                          "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM),0)<>0                           "+
	"      THEN NVL(SUM(JD_NUM),0)*100/NVL(SUM(DEV_NUM),0)       "+
	"      ELSE 0 END ||'%',2)    ZB_JD                          "+
	",NVL(SUM(CMS),0)             CMS                            "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM),0)<>0                           "+
	"      THEN NVL(SUM(CMS),0)*100/NVL(SUM(DEV_NUM),0)          "+
	"      ELSE 0 END ||'%',2)     ZB_CMS                        "+
	",NVL(SUM(NORMAL_NUM),0)     NORMAL_NUM                      "+
	",NVL(SUM(DEV_NUM1),0)    DEV_NUM1                           "+
	",NVL(SUM(ACTIVE_NUM1),0) ACTIVE_NUM1                        "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM1),0)<>0                          "+
	"      THEN NVL(SUM(ACTIVE_NUM1),0)*100/NVL(SUM(DEV_NUM1),0) "+ 
	"      ELSE 0 END ||'%',2)     ZB_ACTIVE1                    "+
	",NVL(SUM(SW_NUM1),0)          SW_NUM1                       "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM1),0)<>0                          "+
	"      THEN NVL(SUM(SW_NUM1),0)*100/NVL(SUM(DEV_NUM1),0)     "+
	"      ELSE 0 END ||'%',2)   ZB_SW1                          "+
	",NVL(SUM(JD_NUM1),0)         JD_NUM1                        "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM1),0)<>0                          "+
	"      THEN NVL(SUM(JD_NUM1),0)*100/NVL(SUM(DEV_NUM1),0)     "+
	"      ELSE 0 END ||'%',2)    ZB_JD1                         "+
	",NVL(SUM(CMS1),0)             CMS1                          "+
	",PODS.GET_RADIX_POINT(                                      "+
	" CASE WHEN NVL(SUM(DEV_NUM1),0)<>0                          "+
	"      THEN NVL(SUM(CMS1),0)*100/NVL(SUM(DEV_NUM1),0)        "+
	"      ELSE 0 END ||'%',2)     ZB_CMS1                       "+
	",NVL(SUM(NORMAL_NUM1),0)     NORMAL_NUM1 FROM PMRT.TB_MRT_BUS_NEW_DEV_ZL_MON";
}



function downsAll() {
	var orderBy= " ORDER BY GROUP_ID_1,HQ_CHAN_CODE";
	var groupBy= " GROUP BY DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,OPERATE_TYPE,CHNL_TYPE";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var chnlType=$("#chnlType").val();
	var where =" WHERE DEAL_DATE='"+dealDate+"'";
	var preField = " SELECT DEAL_DATE,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,COUNT(DISTINCT HQ_CHAN_CODE) HALL_COUNT,OPERATE_TYPE,CHNL_TYPE,"+	getSumSql();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where+= " AND GROUP_ID_1='"+region+"' ";
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
	if(chnlType!=""){
		where += " AND CHNL_TYPE ='"+chnlType+"' ";
	}
	var sql =preField + where+groupBy+orderBy;
	var showtext = '自有厅新发展用户发展质量月报' + dealDate;
	title=[["自有营业厅新发展用户发展质量月报","","","","","","","","","","","","","","","","","","","","","","","","","",""],
	       ["账期","地市","营业厅","渠道编码","厅数","经营模式（自营/柜台/他营)","分类(旗舰/标准/小型）","当月新发展用户发展质量","","","","","","","","","","累计新发展用户发展质量","","","","","","","","",""],
	       ["","","","","","","","新增用户数","活跃用户数","占比","三无用户数","占比","极低用户数","占比","纯短信用户数","占比","正常服务用户","新增用户数","活跃用户数","占比","三无用户数","占比","极低用户数","占比","纯短信用户数","占比","正常服务用户"]];
	downloadExcel(sql,title,showtext);
}
