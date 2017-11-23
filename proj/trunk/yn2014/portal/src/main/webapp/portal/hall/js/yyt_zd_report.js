var report = null;
var field=["NO_CHANGENUM_DAY","CHANGENUM_DAY","DAY_NUM","PROFIT_ALL","PROFIT_SHARE","ZD_COST","YYT_PROFIT"];
$(function(){
    $("#searchBtn").click(function(){
    	$("#exportPageBtn").parent().remove();
    	var title=[["组织架构","营业厅编码","营业厅名称","日-裸机销售（顺价销售）","日-裸机销售（带卡销售）","日-合计","毛利合计","毛利分享","营销成本","营业厅利润"]];
    	var startDate=$("#startDate").val();
		var endDate=$("#endDate").val();
    	if(startDate==endDate){
    		var title=[["组织架构","营业厅编码","营业厅名称","日-裸机销售（顺价销售）","日-裸机销售（带卡销售）","日-合计","毛利合计","毛利分享","营销成本","营业厅利润"]];
    	}else{
    		var title=[["组织架构","营业厅编码","营业厅名称","月-裸机销售（顺价销售）","月-裸机销售（带卡销售）","月-合计","月毛利合计","月毛利分享","月营销成本","月营业厅利润"]];
    	}
    	var	report=new LchReport({
    		title:title,
    		field:["ROW_NAME","YYT_HQ_CODE","YYT_HQ_NAME"].concat(field),
    		css:[{gt:5,css:LchReport.RIGHT_ALIGN}],
    		rowParams:["ROW_ID"],//第一个为rowId
    		content:"content",
    		orderCallBack:function(index,type){
    			
    		},afterShowSubRows:function(){
    			
    		},
    		getSubRowsCallBack:function($tr){
    			var sql='';
    			var code='';
    			var orgLevel='';
    			var startDate=$("#startDate").val();
    			var endDate=$("#endDate").val();
    			var where=" WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'";
    			if($tr){
    				code=$tr.attr("row_id");
    				orgLevel=parseInt($tr.attr("orgLevel"));
    				if(orgLevel==2){//点击省，显示市
    					
    				}else if(orgLevel==3){//点击市，展示营业厅
    					where+=" AND GROUP_ID_1='"+code+"'";
    				}else{
    					return {data:[],extra:{}}
    				}
    				sql=getSql(orgLevel,where);
    				orgLevel++;
    			}else{
    				//先根据用户信息得到前几个字段
    				code=$("#region").val();
    				orgLevel=$("#orgLevel").val();
    				if(orgLevel==1){//省
    					
    				}else if(orgLevel==2||orgLevel==3){//市
    					where+=" AND GROUP_ID_1='"+code+"'";
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
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var title=[["组织架构","营业厅编码","营业厅名称","日-裸机销售（顺价销售）","日-裸机销售（带卡销售）","日-合计","毛利合计","毛利分享","营销成本","营业厅利润"]];

    report=new LchReport({
		title:title,
		field:["ROW_NAME","YYT_HQ_CODE","YYT_HQ_NAME"].concat(field),
		css:[{gt:5,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var startDate=$("#startDate").val();
			var endDate=$("#endDate").val();
			var where=" WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省，显示市
					
				}else if(orgLevel==3){//点击市，展示营业厅
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(orgLevel,where);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					
				}else if(orgLevel==2||orgLevel==3){//市
					where+=" AND GROUP_ID_1='"+code+"'";
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
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var code=$("#region").val();
	var regionCode=$("#regionCode").val();
	var yyt_hq_code = $("#yyt_hq_code").val();
	var where=" WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'";
	if (orgLevel == 1) {//省
		
	} else if(orgLevel==2||orgLevel==3){//市
		where += " AND GROUP_ID_1='"+code+"'";
		
	} else{
		where += " AND 1=2";
	}
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(yyt_hq_code!=""){
		where+=" AND YYT_HQ_CODE LIKE '%"+yyt_hq_code+"%'";
	}
	var title=[["组织架构","时间","营业厅编码","营业厅名称","日-裸机销售（顺价销售）","日-裸机销售（带卡销售）","日-合计","毛利合计","毛利分享","营销成本","营业厅利润"]];
	var sql = getDownSql(where);
	var showtext = '营业厅终端销售统计-' + startDate+"-"+endDate;
	downloadExcel(sql,title,showtext);
}

function getSql(level,where){
	var regionCode=$("#regionCode").val();
	var yyt_hq_code = $("#yyt_hq_code").val();
	var sql="";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(yyt_hq_code!=""){
		where+=" AND YYT_HQ_CODE LIKE '%"+yyt_hq_code+"%'";
	}
	if(level==1){//省级
		sql="SELECT '云南省' ROW_NAME,'86000' ROW_ID,'--' YYT_HQ_CODE,'--' YYT_HQ_NAME,"+getSumSql()+" FROM PMRT.TAB_MRT_YYT_ZD_REPORT"+where;
	}else if(level==2){//地市级
		sql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' YYT_HQ_CODE,'--' YYT_HQ_NAME,"+getSumSql()+" FROM PMRT.TAB_MRT_YYT_ZD_REPORT"+where+" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
	}else{//厅级
		sql="SELECT YYT_HQ_CODE ROW_ID,YYT_HQ_NAME ROW_NAME,YYT_HQ_CODE,YYT_HQ_NAME,"+field.join(",")+" FROM PMRT.TAB_MRT_YYT_ZD_REPORT"+where;
	}
	return sql;
  }

function getDownSql(where){
    return sql="SELECT GROUP_ID_1_NAME,DEAL_DATE,YYT_HQ_CODE,YYT_HQ_NAME,"+field.join(",")+" FROM PMRT.TAB_MRT_YYT_ZD_REPORT"+where;
}
	
function getSumSql(){
	var s="";
	for(var i=0;i<field.length;i++){
		if(i==0){
			s+="SUM("+field[i]+") "+field[i];
		}else{
			s+=",SUM("+field[i]+") "+field[i];
		}
	}
	return s;
}
