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
	var dealDate=$("#dealDate").val();
		//省，地市
		title=[["组织架构","经营模式","自有厅","","","","","","","","","","全渠道","","","","","","","","",""],
		       ["","","当日合约办理量","本月累计合约办理量","累计环比","其中套餐96以上累计占比","当日存费送机办理量","本月累计存费送机办理量","当日合约惠机办理量","本月累计合约惠机办理量","当日沃享4G自备机办理量","本月累计沃享4G自备机办理量","当日合约办理量","本月累计合约办理量","累计环比","其中套餐96以上累计占比","当日存费送机办理量","本月累计存费送机办理量","当日合约惠机办理量","本月累计合约惠机办理量","当日沃享4G自备机办理量","本月累计沃享4G自备机办理量"]
			];
		field=["OPERATE_TYPE","HY_ALL_DEV","HY_ALL_DEV1","HY_ALL_HB1","HY_ALL_ZB1","CFSJ_ALL_DEV","CFSJ_ALL_DEV1","HYHJ_ALL_DEV","HYHJ_ALL_DEV1","WX4G_ZBJ","WX4G_ZBJ1","QQD_HY_ALL_DEV","QQD_HY_ALL_DEV1","QQD_HY_ALL_HB1","QQD_HY_ALLZB1","QQD_CFSJ_ALL_DEV","QQD_CFSJ_ALL_DEV1","QQD_HYHJ_ALL_DEV","QQD_HYHJ_ALL_DEV1","QQD_WX4G_ZBJ","QQD_WX4G_ZBJ1"];
		//营业厅
	/*	title=[["组织架构","经营模式","自有厅移动网活跃用户数","","","其中自有厅CBSS套餐活跃用户数","","","其中自有厅3G套餐活跃用户数","","","其中自有厅2G套餐活跃用户数","",""],
		       ["","","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化"]];
		field=["OPERATE_TYPE","THIS_YM_NUM","ZJ_YW_NUM","HB_YW","THIS_4G_NUM","ZJ_4G_NUM","HB_4G","THIS_3G_NUM","ZJ_3G_NUM","HB_3G","THIS_2G_NUM","ZJ_2G_NUM","HB_2G"];*/
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
			var preField='';
			var code='';
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var where=' WHERE DEAL_DATE='+dealDate;
			var flag=1;
			if(chanlCode!=""){
				flag=2;
			}
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					flag=2;
					preField=   " SELECT HQ_CHAN_CODE  AS ROW_ID,        "+
								"        BUS_HALL_NAME AS ROW_NAME,      "+
								"        OPERATE_TYPE,                   "+
								"        HY_ALL_DEV,                     "+
								"        HY_ALL_DEV1,                    "+
								"        HY_ALL_HB1,                     "+
								"        HY_ALL_ZB1,                     "+
								"        CFSJ_ALL_DEV,                   "+
								"        CFSJ_ALL_DEV1,                  "+
								"        HYHJ_ALL_DEV,                   "+
								"        HYHJ_ALL_DEV1,                  "+
								"        WX4G_ZBJ,                       "+
								"        WX4G_ZBJ1                       "+
								"   FROM PMRT.TB_MRT_BUS_HALL_HY_DAY_HZ  ";
	//
				   where+= "  AND GROUP_ID_1= '"+code+"' AND FLAG = "+flag ;
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=getSumSql();
					where+=" AND FLAG= "+flag ;
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=getSumSql();
					where=' AND GROUP_ID_1=\''+region+'\' AND FLAG='+flag ;
					orgLevel=2;
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
			var sql=preField+where;
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
	 var s=  " SELECT GROUP_ID_1 AS ROW_ID,           "+
			 "        GROUP_ID_1_NAME AS ROW_NAME,    "+
			 "        '-' AS OPERATE_TYPE,            "+
			 "        HY_ALL_DEV,                     "+
			 "        HY_ALL_DEV1,                    "+
			 "        HY_ALL_HB1,                     "+
			 "        HY_ALL_ZB1,                     "+
			 "        CFSJ_ALL_DEV,                   "+
			 "        CFSJ_ALL_DEV1,                  "+
			 "        HYHJ_ALL_DEV,                   "+
			 "        HYHJ_ALL_DEV1,                  "+
			 "        WX4G_ZBJ,                       "+
			 "        WX4G_ZBJ1,                      "+
			 "        QQD_HY_ALL_DEV,                 "+
			 "        QQD_HY_ALL_DEV1,                "+
			 "        QQD_HY_ALL_HB1,                 "+
			 "        QQD_HY_ALLZB1,                  "+
			 "        QQD_CFSJ_ALL_DEV,               "+
			 "        QQD_CFSJ_ALL_DEV1,              "+
			 "        QQD_HYHJ_ALL_DEV,               "+
			 "        QQD_HYHJ_ALL_DEV1,              "+
			 "        QQD_WX4G_ZBJ,                   "+
			 "        QQD_WX4G_ZBJ1                   "+
			 "   FROM PMRT.TB_MRT_BUS_HALL_HY_DAY_HZ  ";
		return s;
}

function downsAll() {
	var orderBy=" ORDER BY GROUP_ID_1,HQ_CHAN_CODE";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where ="";
	var preField = 	" SELECT DEAL_DATE,                     "+
					"        GROUP_ID_1_NAME,               "+
					"        BUS_HALL_NAME,                 "+
					"        HQ_CHAN_CODE,                  "+
					"        OPERATE_TYPE,                  "+
					"        HY_ALL_DEV,                    "+
					"        HY_ALL_DEV1,                   "+
					"        HY_ALL_HB1,                    "+
					"        HY_ALL_ZB1,                    "+
					"        CFSJ_ALL_DEV,                  "+
					"        CFSJ_ALL_DEV1,                 "+
					"        HYHJ_ALL_DEV,                  "+
					"        HYHJ_ALL_DEV1,                 "+
					"        WX4G_ZBJ,                      "+
					"        WX4G_ZBJ1                      "+
					"   FROM PMRT.TB_MRT_BUS_HALL_HY_DAY_HZ "+
					"  WHERE DEAL_DATE = '"+dealDate+"'     "+
					"    AND FLAG = 2                       ";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND T1.GROUP_ID_1='" + region + "' ";
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
	var sql = preField + where+orderBy;
	var showtext = '营业厅合约日报表' + dealDate;
	title=[["账期","分公司","营业厅","渠道编码","经营模式","当日合约办理量","本月累计合约办理量","累计环比","其中套餐96以上累计占比","当日存费送机办理量","本月累计存费送机办理量","当日合约惠机办理量","本月累计合约惠机办理量","当日沃享4G自备机办理量","本月累计沃享4G自备机办理量"]];
	downloadExcel(sql,title,showtext);
}
