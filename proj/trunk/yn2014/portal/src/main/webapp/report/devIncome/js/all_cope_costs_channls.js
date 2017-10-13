$(function(){
	search();
	$("#searchBtn").click(function(){
		$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		search();
	});
});
function search(){
	var title=[["营销架构","渠道类型","净收入(出账收入-赠费-退费)","","","","","发展量","","","","","渠道支撑费用预提","","","发展佣金预提","","","","业务办理佣金预提","","","","","","","佣金合计","渠道费用占收比"],
	            ["","","2G","3G","4G","固网","合计","2G","3G","4G","固网","合计","房租","渠道补贴","装修费","一次性代办费","话费分成","奖罚佣金","小计","代收代办服务费","固网佣金","客服部维系（走手工佣金）","增值佣金","其他","手工调整（非系统计算）","小计","",""]
			  ];
	var field=["CHN_CDE_1_NAME","INCOME_2G","INCOME_3G","INCOME_4G", "INCOME_FIXED", "TOTAL_INCOME","DEV_2G","DEV_3G","DEV_4G","DEV_FIXED","TOTAL_DEV","RENT_CHARGE","SUBSIDIES_CHARGE","RENOVATION_CHARGE","ON_TIME_COMM", "BILL_SHARE_COMM", "R_AND_P_COMM","TOTAL_DEV_COMM","AGENCY_COMM","FIXED_COMM","MAINTAIN_COMM","VALUE_ADDED_COMM","OTHER_COMM","MANUAL_COMM","TOTAL_MANAGE_COMM","TOTAL_COMM","TOTALSALES"];
	var sumSql=getSumSql();
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField="";
			var where="";
			var groupBy="";
			var code="";
			var orgLevel="";
			var orderBy ="";
			var chn_cde_1_name=$("#chn_cde_1_name").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT MAX(GROUP_ID_1) AS ROW_ID,MAX(GROUP_ID_1_NAME) AS ROW_NAME, MAX('-') AS CHN_CDE_1_NAME,";
					groupBy =" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME ";
					orderBy =" ORDER BY GROUP_ID_1 ";
				}else if(orgLevel==3){//点击市
					preField=" SELECT MAX(UNIT_ID) AS ROW_ID,MAX(UNIT_NAME) AS ROW_NAME,MAX('-') AS CHN_CDE_1_NAME,";
					groupBy ="  GROUP BY UNIT_ID";
					where   =" AND T.GROUP_ID_1='"+code+"'";
					orderBy =" ORDER BY UNIT_ID ";
				}else if(orgLevel==4){
					preField=" SELECT MAX(GROUP_ID_4) AS ROW_ID,MAX(GROUP_ID_4_NAME) AS ROW_NAME, CHN_CDE_1_NAME,";
					groupBy =" GROUP BY GROUP_ID_4,CHN_CDE_1_NAME";
					where   =" AND T.UNIT_ID='"+code+"'";
					orderBy =" ORDER BY GROUP_ID_4 ";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" SELECT '云南省' AS ROW_NAME, '86000' AS ROW_ID,MAX('-') AS CHN_CDE_1_NAME, MAX('-') AS CHN_CDE_1_NAME,";
					orgLevel=2;
				}else if(orgLevel==2){//市
					preField=" SELECT MAX(GROUP_ID_1) AS ROW_ID,MAX(GROUP_ID_1_NAME) AS ROW_NAME, MAX('-') AS CHN_CDE_1_NAME,";
					groupBy =" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME ";
					orderBy =" ORDER BY GROUP_ID_1 ";
					where=" AND T.GROUP_ID_1='"+code+"'";
					orgLevel=3;
				}else if(orgLevel==3){
					preField=" SELECT MAX(UNIT_ID) AS ROW_ID,MAX(UNIT_NAME) AS ROW_NAME,MAX('-') AS CHN_CDE_1_NAME,";
					groupBy =" GROUP BY UNIT_ID";
					orderBy =" ORDER BY UNIT_ID ";
					where   =" AND T.UNIT_ID='"+code+"'";
					orgLevel=4;
				}else if(orgLevel==4){
					preField=" SELECT MAX(GROUP_ID_4) AS ROW_ID,MAX(GROUP_ID_4_NAME) AS ROW_NAME, CHN_CDE_1_NAME,";
					groupBy =" GROUP BY GROUP_ID_4,CHN_CDE_1_NAME";
					where   =" AND T.GROUP_ID_4='"+code+"'";
					orgLevel=5;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(chn_cde_1_name != null && chn_cde_1_name != "") {
				if(chn_cde_1_name == "0") {
					where += " AND T.CHN_CDE_1_NAME = '社会' ";
				}else if(chn_cde_1_name == "1") {
					where += " AND T.CHN_CDE_1_NAME = '自有' ";
				}
			}
			var sql= preField+sumSql+where+groupBy+orderBy;
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


function downsAll() {
	var preField=" SELECT T.DEAL_DATE,T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.CHN_CDE_1_NAME,HQ_CHANL_CODE,";
	var where="";
	var sumSql=getSumSql();
	/*var orderBy=" ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE";*/
	var groupBy=" GROUP BY T.DEAL_DATE,T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.CHN_CDE_1_NAME,HQ_CHANL_CODE";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var chn_cde_1_name=$("#chn_cde_1_name").val();
	var dealDate = $("#dealDate").val();
	if (orgLevel == 1) {//省
		
	}else if(orgLevel==2){//市或者其他层级
		where = " AND T.GROUP_ID_1='" + code + "' ";
	}else if(orgLevel==3){
		where = " AND T.UNIT_ID='" + code + "' ";
	}else if(orgLevel==4){
		where = " AND T.GROUP_ID_4='" + code + "' ";
	}else{
		return {data:[],extra:{}};
	}
	if(chn_cde_1_name != null && chn_cde_1_name != "") {
		if(chn_cde_1_name == "0") {
			where += " AND T.CHN_CDE_1_NAME = '社会' ";
		}else if(chn_cde_1_name == "1") {
			where += " AND T.CHN_CDE_1_NAME = '自有' ";
		}
	}
	var sql = preField + sumSql+where+groupBy;
	var showtext = '全成本渠道费用应付报表' + dealDate;
	var title=[["账期","地市","营服中心","渠道名称","渠道类型","渠道编码","净收入(出账收入-赠费-退费)","","","","","发展量","","","","","渠道支撑费用预提","","","发展佣金预提","","","","业务办理佣金预提","","","","","","","佣金合计","渠道费用占收比"],
	            ["","","","","","","2G","3G","4G","固网","合计","2G","3G","4G","固网","合计","房租","渠道补贴","装修费","一次性代办费","话费分成","奖罚佣金","小计","代收代办服务费","固网佣金","客服部维系（走手工佣金）","增值佣金","其他","手工调整（非系统计算）","小计","",""]
			  ];
	downloadExcel(sql,title,showtext);
}


function getSumSql() {
	var dealDate = $("#dealDate").val();
	var s=
			"        SUM(T.INCOME_2G) AS INCOME_2G,                                                             "+
			"        SUM(T.INCOME_3G) AS INCOME_3G,                                                             "+
			"        SUM(T.INCOME_4G) AS INCOME_4G,                                                             "+
			"        SUM(T.INCOME_FIXED) AS INCOME_FIXED,                                                       "+
			"        SUM(T.INCOME_2G) + SUM(T.INCOME_3G) + SUM(T.INCOME_4G) +                                   "+
			"        SUM(T.INCOME_FIXED) AS TOTAL_INCOME,                                                       "+
			"        SUM(T.DEV_2G) AS DEV_2G,                                                                   "+
			"        SUM(T.DEV_3G) AS DEV_3G,                                                                   "+
			"        SUM(T.DEV_4G) AS DEV_4G,                                                                   "+
			"        SUM(T.DEV_FIXED) AS DEV_FIXED,                                                             "+
			"        SUM(T.DEV_2G) + SUM(T.DEV_3G) + SUM(T.DEV_4G) + SUM(T.DEV_FIXED) AS TOTAL_DEV,             "+
			"        SUM(T.RENT_CHARGE) AS RENT_CHARGE,                                                         "+
			"        SUM(T.SUBSIDIES_CHARGE) AS SUBSIDIES_CHARGE,                                               "+
			"        SUM(T.RENOVATION_CHARGE) AS RENOVATION_CHARGE,                                             "+
			"        SUM(T.ON_TIME_COMM) AS ON_TIME_COMM,                                                       "+
			"        SUM(T.BILL_SHARE_COMM) AS BILL_SHARE_COMM,                                                 "+
			"        SUM(T.R_AND_P_COMM) AS R_AND_P_COMM,                                                       "+
			"        SUM(T.ON_TIME_COMM) + SUM(T.BILL_SHARE_COMM) + SUM(T.R_AND_P_COMM) AS TOTAL_DEV_COMM,      "+
			"        SUM(T.AGENCY_COMM) AS AGENCY_COMM,                                                         "+
			"        MAX('-') AS FIXED_COMM,                                                                    "+
			"        SUM(T.MAINTAIN_COMM) AS MAINTAIN_COMM,                                                     "+
			"        SUM(T.VALUE_ADDED_COMM) AS VALUE_ADDED_COMM,                                               "+
			"        SUM(T.OTHER_COMM) AS OTHER_COMM,                                                           "+
			"        SUM(T.MANUAL_COMM) AS MANUAL_COMM,                                                         "+
			"        SUM(T.AGENCY_COMM) + SUM(T.MAINTAIN_COMM) + SUM(T.VALUE_ADDED_COMM) +                      "+
			"        SUM(T.OTHER_COMM) + SUM(T.MANUAL_COMM) AS TOTAL_MANAGE_COMM,                               "+
			"        SUM(T.ON_TIME_COMM) + SUM(T.BILL_SHARE_COMM) + SUM(T.R_AND_P_COMM) +                       "+
			"        SUM(T.AGENCY_COMM) + SUM(T.MAINTAIN_COMM) + SUM(T.VALUE_ADDED_COMM) +                      "+
			"        SUM(T.OTHER_COMM) + SUM(T.MANUAL_COMM) AS TOTAL_COMM,                                      "+
			"        CASE                                                                                       "+
			"          WHEN SUM(T.INCOME_2G) + SUM(T.INCOME_3G) + SUM(T.INCOME_4G) +                            "+
			"               SUM(T.INCOME_FIXED) = 0 AND                                                         "+
			"               SUM(T.ON_TIME_COMM) + SUM(T.BILL_SHARE_COMM) +                                      "+
			"               SUM(T.R_AND_P_COMM) + SUM(T.AGENCY_COMM) +                                          "+
			"               SUM(T.MAINTAIN_COMM) + SUM(T.VALUE_ADDED_COMM) +                                    "+
			"               SUM(T.OTHER_COMM) + SUM(T.MANUAL_COMM) + SUM(T.RENT_CHARGE) +                       "+
			"               SUM(T.RENOVATION_CHARGE) + SUM(T.SUBSIDIES_CHARGE) != 0 THEN                        "+
			"           '有佣金无发展'                                                                          "+
			"          WHEN SUM(T.INCOME_2G) + SUM(T.INCOME_3G) + SUM(T.INCOME_4G) +                            "+
			"               SUM(T.INCOME_FIXED) = 0 AND                                                         "+
			"               SUM(T.ON_TIME_COMM) + SUM(T.BILL_SHARE_COMM) +                                      "+
			"               SUM(T.R_AND_P_COMM) + SUM(T.AGENCY_COMM) +                                          "+
			"               SUM(T.MAINTAIN_COMM) + SUM(T.VALUE_ADDED_COMM) +                                    "+
			"               SUM(T.OTHER_COMM) + SUM(T.MANUAL_COMM) + SUM(T.RENT_CHARGE) +                       "+
			"               SUM(T.RENOVATION_CHARGE) + SUM(T.SUBSIDIES_CHARGE) = 0 THEN                         "+
			"           '无发展无佣金'                                                                          "+
			"          ELSE                                                                                     "+
			"           ROUND(((SUM(T.ON_TIME_COMM) + SUM(T.BILL_SHARE_COMM) +                                  "+
			"                 SUM(T.R_AND_P_COMM) + SUM(T.AGENCY_COMM) +                                        "+
			"                 SUM(T.MAINTAIN_COMM) + SUM(T.VALUE_ADDED_COMM) +                                  "+
			"                 SUM(T.OTHER_COMM) + SUM(T.MANUAL_COMM) +                                          "+
			"                 SUM(T.RENT_CHARGE) + SUM(T.RENOVATION_CHARGE) +                                   "+
			"                 SUM(T.SUBSIDIES_CHARGE)) /                                                        "+
			"                 (SUM(T.INCOME_2G) + SUM(T.INCOME_3G) + SUM(T.INCOME_4G) +                         "+
			"                 SUM(T.INCOME_FIXED)) * 100),                                                      "+
			"                 2) || '%'                                                                         "+
			"        END AS TOTALSALES                                                                          "+
			"   FROM PMRT.TAB_MRT_COST_CHANL_PRE_MON T                                                          "+
			"   WHERE T.DEAL_DATE = '"+dealDate+"'                                                              ";
	return s;
}



//加载备注信息
function showRemark() {
	var dealDate = $.trim($("#dealDate").val());
	var orgLevel=$("#orgLevel").val();
	var region = $("#region").val();
	var sql = "SELECT A.DEAL_DATE,A.GROUP_ID_1_NAME," +
			"COUNT(1) CONTRACT_NUM,SUM(CASE " +
			"WHEN A.RENT_TYPE = '营业费用-租赁费' THEN A.COST_PAYABLE " +
			"ELSE 0 END) COST_PAYABLE,SUM(CASE " +
			"WHEN A.RENT_TYPE = '营业费用-修理维护费' THEN " +
			"A.COST_PAYABLE ELSE 0 END) MAINTENANCE_COST " +
			"FROM PODS.TB_ODS_HOUSERENT_INFO A WHERE A.CHANL_NAME IS NULL and A.DEAL_DATE='"+dealDate+"' ";
	if(orgLevel == 1) {
		
	}else {
		sql += " and  A.GROUP_ID_1='"+region+"' ";
	}
	sql += " GROUP BY A.DEAL_DATE, A.GROUP_ID_1_NAME";
	
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
			sql:sql
		},
		success:function(data){
			var content = "<tr>" +
					"<th>账期</th>" +
					"<th>地市</th>" +
					"<th>游离合同数量</th>" +
					"<th>营业费用-租赁费</th>" +
					"<th>营业费用-修理维护费</th>";
			if(data == undefined || data == null || data == '' || data.length < 1){
				content += "<tr>" +
				"<td colspan='4'>暂无数据</td>" +
				"</tr>";
			}else{
				for(var i=0; i<data.length; i++) {
					content += "<tr>";
					content += "<td>"+data[i]['DEAL_DATE']+"</td>";
					content += "<td>"+data[i]['GROUP_ID_1_NAME']+"</td>";
					content += "<td>"+data[i]['CONTRACT_NUM']+"</td>";
					content += "<td>"+data[i]['COST_PAYABLE']+"</td>";
					content += "<td>"+data[i]['MAINTENANCE_COST']+"</td>";
					content += "</tr>";
				}
			}
			$("#_remark").empty().append(content);
			$("#remark").show();
		}
	});
}
