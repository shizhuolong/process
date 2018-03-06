var report;
$(function(){
	var field=["ROW_NAME","ZY_4G","JK_4G","DZ_4G","SHST_4G","WB_4G","HJ_4G","ZY_3G","JK_3G","DZ_3G","SHST_3G","WB_3G","HJ_3G","ZY_2G","JK_2G","DZ_2G","SHST_2G","WB_2G","HJ_2G","ZY_QT","JK_QT","DZ_QT","SHST_QT","WB_QT","HJ_QT","ZY_YW","JK_YW","DZ_YW","SHST_YW","WB_YW","HJ_YW"];
	var title=[["分公司","4G网络出账收入","","","","","","3G网络出账收入","","","","","","2G网络出账收入","","","","","","其他用户出账收入","","","","","","移动网出账收入","","","","",""],
			   ["","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计"]];
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
		content:"lchcontent",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var region =$("#region").val();
			var code=$("#code").val();
			var orgLevel="";
			var hr_id=$("#hr_id").val();
			var regionCode=$("#regionCode").val();
			var isAll=$("#isAll").val();
			var dealDate=$("#dealDate").val();
			var where="";
			//条件
			if(isAll==1){
				where+= " FROM PODS.VIEW_ODS_WLKJ_CZSR_MON_ZX T1, "+
				" PCDE.TB_CDE_REGION_CODE T2 "+
				" WHERE DEAL_DATE= "+dealDate+" and T1.GROUP_ID_1=T2.GROUP_ID_1(+)";
			}else if(isAll==2){
				where+= " FROM PODS.VIEW_ODS_WLKJ_CZSR_TMP_ZL_ZX T1, "+
				" PCDE.TB_CDE_REGION_CODE T2 "+
				" WHERE DEAL_DATE= "+dealDate+" and T1.GROUP_ID_1=T2.GROUP_ID_1(+)";
			}else{
				where+= " FROM PODS.VIEW_ODS_WLKJ_CZSR_TMP_CL_ZX T1, "+
				" PCDE.TB_CDE_REGION_CODE T2 "+
				" WHERE DEAL_DATE= "+dealDate+" and T1.GROUP_ID_1=T2.GROUP_ID_1(+)";
			}
			if(regionCode!=''){
				where+= " AND T1.GROUP_ID_1 ='"+regionCode+"'";
			}
			
			//权限
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				if(orgLevel==2){
					where+=" AND T1.GROUP_ID_1='"+code+"'";
					where+=" AND UNIT_ID <>'-' ";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,orgLevel);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					
				}else if(orgLevel==2){//市
					where+=" AND T1.GROUP_ID_1='"+code+"'";
					orgLevel=1;
				}else if(orgLevel==3){//营服
					where+=" AND T1.UNIT_ID='"+code+"'";
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(where,orgLevel);
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

function getSql(where,orgLevel){
	if(orgLevel==1){
		preSql="select T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,T1.RANK";
		groupBy=" GROUP BY T1.GROUP_ID_1 ,T1.GROUP_ID_1_NAME,T1.RANK ORDER BY T1.RANK";
	}else if(orgLevel==2){
		preSql="select T1.GROUP_ID_1 GROUP_ID_1,T1.GROUP_ID_1_NAME GROUP_ID_1_NAME,T1.UNIT_ID ROW_ID,T1.UNIT_NAME ROW_NAME";
		groupBy=" GROUP BY T1.GROUP_ID_1 ,T1.GROUP_ID_1_NAME,T1.UNIT_ID,T1.UNIT_NAME";
	}
	var sql=preSql+
	"  ,SUM(ZY_4G) ZY_4G                              "+
	"  ,SUM(JK_4G) JK_4G                              "+
	"  ,SUM(DZ_4G) DZ_4G                              "+
	"  ,SUM(SHST_4G) SHST_4G                          "+
    "  ,SUM(WB_4G) WB_4G                              "+
	"  ,SUM(HJ_4G) HJ_4G                              "+
	"  ,SUM(ZY_3G) ZY_3G                              "+
	"  ,SUM(JK_3G) JK_3G                              "+
    "  ,SUM(DZ_3G) DZ_3G                              "+
	"  ,SUM(SHST_3G) SHST_3G                          "+
	"  ,SUM(WB_3G) WB_3G                              "+
	"  ,SUM(HJ_3G) HJ_3G                              "+
    "  ,SUM(ZY_2G) ZY_2G                              "+
	"  ,SUM(JK_2G) JK_2G                              "+
	"  ,SUM(DZ_2G) DZ_2G                              "+
	"  ,SUM(SHST_2G) SHST_2G                          "+
    "  ,SUM(WB_2G) WB_2G                              "+
	"  ,SUM(HJ_2G) HJ_2G                              "+
	"  ,SUM(ZY_QT) ZY_QT                              "+
	"  ,SUM(JK_QT) JK_QT                              "+
    "  ,SUM(DZ_QT) DZ_QT                              "+
	"  ,SUM(SHST_QT) SHST_QT                          "+
	"  ,SUM(WB_QT) WB_QT                              "+
	"  ,SUM(HJ_QT) HJ_QT                              "+
	"  ,SUM(ZY_4G+ZY_3G+ZY_2G+ZY_QT) ZY_YW            "+
    "  ,SUM(JK_4G+JK_3G+JK_2G+JK_QT) JK_YW            "+
    "  ,SUM(DZ_4G+DZ_3G+DZ_2G+DZ_QT) DZ_YW            "+
    "  ,SUM(SHST_4G+SHST_3G+SHST_2G+SHST_QT) SHST_YW  "+
    "  ,SUM(WB_4G+WB_3G+WB_2G+WB_QT) WB_YW            "+
    "  ,SUM(HJ_4G+HJ_3G+HJ_2G+HJ_QT) HJ_YW            "+
	where+groupBy;
	return sql;
}

function downsAll() {
	var field=["ROW_NAME","ZY_4G","JK_4G","DZ_4G","SHST_4G","WB_4G","HJ_4G","ZY_3G","JK_3G","DZ_3G","SHST_3G","WB_3G","HJ_3G","ZY_2G","JK_2G","DZ_2G","SHST_2G","WB_2G","HJ_2G","ZY_QT","JK_QT","DZ_QT","SHST_QT","WB_QT","HJ_QT","移动网出账用户数","","","","",""];
	var title=[["地市编码","地市名称","营服编码","营服名称","4G网络出账收入","","","","","","3G网络出账收入","","","","","","2G网络出账收入","","","","","","其他用户出账收入","","","","","","移动网出账收入","","","","",""],
			   ["","","","","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计"]];
	var regionCode=$("#regionCode").val();
	var isAll=$("#isAll").val();
	var dealDate=$("#dealDate").val();
	var orgLevel=$("#orgLevel").val();
	var where="";
	//条件
	if(isAll==1){
		where+= " FROM PODS.VIEW_ODS_WLKJ_CZSR_MON_ZX T1, "+
		" PCDE.TB_CDE_REGION_CODE T2 "+
		" WHERE DEAL_DATE= "+dealDate+" and T1.GROUP_ID_1=T2.GROUP_ID_1(+)";
	}else if(isAll==2){
		where+= " FROM PODS.VIEW_ODS_WLKJ_CZSR_TMP_ZL_ZX T1, "+
		" PCDE.TB_CDE_REGION_CODE T2 "+
		" WHERE DEAL_DATE= "+dealDate+" and T1.GROUP_ID_1=T2.GROUP_ID_1(+)";
	}else{
		where+= " FROM PODS.VIEW_ODS_WLKJ_CZSR_TMP_CL_ZX T1, "+
		" PCDE.TB_CDE_REGION_CODE T2 "+
		" WHERE DEAL_DATE= "+dealDate+" and T1.GROUP_ID_1=T2.GROUP_ID_1(+)";
	}
	if(regionCode!=''){
		where+= " AND T1.GROUP_ID_1 ='"+regionCode+"'";
	}
	
	if(orgLevel==1){//省
		
	}else if(orgLevel==2){//市
		where+=" AND T1.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){//营服
		where+=" AND T1.UNIT_ID='"+code+"'";
	}
	var downsql=getSql(where,3);
	showtext = "分渠道网络口径出账收入"+dealDate;
	downloadExcel(downsql,title,showtext);
}

function showDesc(){
	var url = $("#ctx").val()+"/report/reportNew/jsp/2i2c_local_extension_explain.jsp";
	art.dialog.open(url,{
		id:'bindDescDialog',
		width:'600px',
		height:'200px',
		lock:true,
		resize:false
	});
}