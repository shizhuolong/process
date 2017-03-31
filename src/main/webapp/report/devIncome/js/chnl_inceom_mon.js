var nowData = [];
var field=["ZY_2G","JK_2G","DZ_2G","SH_2G","WB_2G","ALL_2G","ZY_3G","JK_3G","DZ_3G","SH_3G","WB_3G","ALL_3G","ZY_4G","JK_4G","DZ_4G","SH_4G","WB_4G","ALL_4G","ZY_KD","JK_KD","DZ_KD","SH_KD","WB_KD","ALL_KD","ZY_NET","JK_NET","DZ_NET","SH_NET","WB_NET","ALL_NET","ZY_ZZX","JK_ZZX","DZ_ZZX","SH_ZZX","WB_ZZX","ALL_ZZX","DZ_2I2C"];
var title=[["账期","分公司","2G出账收入（指标序号：A1）","","","","","","3G出账收入（指标序号：A2）","","","","","","4G出账收入（指标序号：A3）","","","","","","宽带出账收入（指标序号：A4）","","","","","","固话出账收入（指标序号：A5）","","","","","","专租线出账收入（不含ICT）宽带出账收入（指标序号：A6）","","","","","","其中2I2C"],
           ["","","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","电子渠道"],
           ["","指标序号","A1.1","A1.2","A1.3","A1.4","A1.5","A1.6","A2.1","A2.2","A2.3","A2.4","A2.5","A2.6","A3.1","A3.2","A3.3","A3.4","A3.5","A3.6","A4.1","A4.2","A4.3","A4.4","A4.5","A4.6","A5.1","A5.2","A5.3","A5.4","A5.5","A5.6","A6.1","A6.2","A6.3","A6.4","A6.5","A6.6",""]];
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : ["DEAL_DATE","GROUP_ID_1_NAME"].concat(field),
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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

function search() {
	var sql= getsql();
	downSql=sql;
	var d = query(sql);
	nowData = d;
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var dealDate=$("#dealDate").val();
	var showtext = '分渠道主营业务收入换算月报-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getsql(){
	var dealDate = $("#dealDate").val();
	var orgLevel = $("#orgLevel").val();
	var code =$("#code").val();
	var regionCode =$("#regionCode").val();
	var sr_type =$("#sr_type").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(sr_type!=""){
		where+=" AND SR_TYPE='"+sr_type+"'";
	}
	//权限
	if(orgLevel==1){
		where+=" AND GROUP_ID_0='"+code+"'";
	}else if(orgLevel==2){
		where+=" AND GROUP_ID_1 ='"+code+"' ";
	}else{
		where+=" AND 1=2";
	}
	if(sr_type!=""){
		return "SELECT DEAL_DATE,GROUP_ID_1_NAME,"+field.join(",")+" FROM PMRT.VIEW_MRT_CHNL_INCOME_MON "+where; 
	}
	return "SELECT DEAL_DATE,NVL(GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME,"+getSumSql()+" FROM PMRT.VIEW_MRT_CHNL_INCOME_MON "+where+" GROUP BY DEAL_DATE, GROUP_ID_1,GROUP_ID_1_NAME ORDER BY GROUP_ID_1";
}

function getSumSql(){
	var s="";
	for(var i=0;i<field.length;i++){
		if(s.length>0){
			s+=",";
	    }
		s+="SUM("+field[i]+") "+field[i];
	}
	return s;
}

 
