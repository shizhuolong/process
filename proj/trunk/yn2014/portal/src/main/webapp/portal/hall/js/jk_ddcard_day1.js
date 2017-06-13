$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_JK_DDCARD_DEV_DAY_HZ"));
	var title=[["组织架构","营服编码","营服名称","渠道编码","渠道名称","当日发展","月累计"]];
	var field=["UNIT_ID","UNIT_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","DDCARD_DEV","DDCARD_DEV1"];
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
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var where=" WHERE DEAL_DATE='"+dealDate+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql=getSql(2,where);
				}else if(orgLevel==3){//点击市
					where+=" AND GROUP_ID_1='"+code+"'";
					sql=getSql(3,where);
				}else if(orgLevel==4){//点击营服
					where+=" AND UNIT_ID='"+code+"'";
					sql=getSql(4,where);
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql=getSql(1,where);
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					sql=getSql(2,where);
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID='"+code+"'";
					sql=getSql(3,where);
				}else{
					return {data:[],extra:{}};
				}
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
	var region=$("#region").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqChanCode=$("#hqChanCode").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=''){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hqChanCode!=''){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
	} 
	
	var sql = getDownSql(where);
	var showtext = '集客钉钉卡项目日统计-' + dealDate;
	var title=[["地市","营服编码","营服名称","渠道编码","渠道名称","当日发展","月累计"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqChanCode=$("#hqChanCode").val();
	if(regionCode!=''){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hqChanCode!=''){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	
	if(orgLevel==1){
		return "SELECT  GROUP_ID_0 ROW_ID,                  "+
		"        '云南省' ROW_NAME,                           "+
		"        '--' UNIT_ID,                              "+
		"        '--' UNIT_NAME,                            "+
		"       NVL(SUM(NVL(DDCARD_DEV,0)),0)  DDCARD_DEV   "+
		"       ,NVL(SUM(NVL(DDCARD_DEV1,0)),0)  DDCARD_DEV1"+
		" FROM PMRT.TB_MRT_JK_DDCARD_DEV_DAY_HZ             "+
		where+" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		return "SELECT  GROUP_ID_1 ROW_ID,                 "+
		"        GROUP_ID_1_NAME ROW_NAME,                 "+
		"       '--' UNIT_ID,                              "+
		"       '--' UNIT_NAME,                            "+
		"       '--' HQ_CHAN_CODE,                         "+
		"       '--' GROUP_ID_4_NAME                       "+
		"       ,NVL(SUM(NVL(DDCARD_DEV,0)),0) DDCARD_DEV  "+
		"       ,NVL(SUM(NVL(DDCARD_DEV1,0)),0) DDCARD_DEV1"+
		" FROM PMRT.TB_MRT_JK_DDCARD_DEV_DAY_HZ            "+
		where+" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
	}else if(orgLevel==3){
		return "SELECT  UNIT_ID ROW_ID                       "+
		"       ,UNIT_NAME ROW_NAME,                         "+
		"       UNIT_ID,                                     "+
		"       UNIT_NAME,                                   "+
		"       '--' HQ_CHAN_CODE,                           "+
		"       '--' GROUP_ID_4_NAME                         "+
		"       ,NVL(SUM(NVL(DDCARD_DEV,0)),0)    DDCARD_DEV "+
		"       ,NVL(SUM(NVL(DDCARD_DEV1,0)),0)  DDCARD_DEV1 "+
		"FROM PMRT.TB_MRT_JK_DDCARD_DEV_DAY_HZ               "+
		where+" GROUP BY UNIT_ID,UNIT_NAME";
    }else{
    	return "SELECT GROUP_ID_4_NAME ROW_NAME,"+
    	"       UNIT_ID,                      "+
    	"       UNIT_NAME ,                   "+
    	"       HQ_CHAN_CODE                  "+
    	"       ,GROUP_ID_4_NAME              "+
    	"       ,DDCARD_DEV                   "+
    	"       ,DDCARD_DEV1                  "+
    	"FROM PMRT.TB_MRT_JK_DDCARD_DEV_DAY_HZ"+
    	where;
    }
  }

	function getDownSql(where){
		return "SELECT GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,"+
				"HQ_CHAN_CODE,GROUP_ID_4_NAME         "+
		    	"       ,DDCARD_DEV                   "+
		    	"       ,DDCARD_DEV1                  "+
		    	"FROM PMRT.TB_MRT_JK_DDCARD_DEV_DAY_HZ"+
    	where;
	}
