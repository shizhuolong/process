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
		title=[["组织架构","经营模式","厅类型","自有厅当日新增用户发展量","","","","","","","","","全网当日新增用户发展量","","","","","","","","","自有厅本月累计新增用户发展量","","","","","","","","","全网本月累计新增用户发展量","","","","","","","",""],
		       ["","","","七彩金惠19元","七彩金惠39元","七彩乐红59元","七彩乐红89元","七彩蓝尊119元","七彩蓝尊139元及以上套餐","七彩流量日租卡","合计发展量","占移网发展的比重（剔除小流量卡）","七彩金惠19元","七彩金惠39元","七彩乐红59元","七彩乐红89元","七彩蓝尊119元","七彩蓝尊139元及以上套餐","七彩流量日租卡","合计发展量","占移网发展的比重（剔除小流量卡）","七彩金惠19元","七彩金惠39元","七彩乐红59元","七彩乐红89元","七彩蓝尊119元","七彩蓝尊139元及以上套餐","七彩流量日租卡","合计发展量","占移网发展的比重（剔除小流量卡）","七彩金惠19元","七彩金惠39元","七彩乐红59元","七彩乐红89元","七彩蓝尊119元","七彩蓝尊139元及以上套餐","七彩流量日租卡","合计发展量","占移网发展的比重（剔除小流量卡）"]
			];
		field=["OPERATE_TYPE","CHNL_TYPE","QC_19_NUM","QC_39_NUM","QC_59_NUM","QC_89_NUM","QC_119_NUM","QC_139_NUM","QC_RZK_NUM","ALL_QC_NUM","ALL_QC_HB","QQD_QC_19_NUM","QQD_QC_39_NUM","QQD_QC_59_NUM","QQD_QC_89_NUM","QQD_QC_119_NUM","QQD_QC_139_NUM","QQD_QC_RZK_NUM","QQD_ALL_QC_NUM","QQD_ALL_HB","QC_19_NUM1","QC_39_NUM1","QC_59_NUM1","QC_89_NUM1","QC_119_NUM1","QC_139_NUM1","QC_RZK_NUM1","ALL_QC_NUM1","ALL_QC_HB1","QQD_QC_19_NUM1","QQD_QC_39_NUM1","QQD_QC_59_NUM1","QQD_QC_89_NUM1","QQD_QC_119_NUM1","QQD_QC_139_NUM1","QQD_QC_RZK_NUM1","QQD_ALL_QC_NUM1","QQD_ALL_HB1"];
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
			var chnlType=$("#chnlType").val();
			var flag = $("#flag").val();
			var groupBy = "";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT BUS_HALL_NAME AS ROW_NAME , HQ_CHAN_CODE AS ROW_ID,CHNL_TYPE,"+getNextSql()+" AND GROUP_ID_1= '"+code+"'";
					groupBy= " GROUP BY BUS_HALL_NAME, HQ_CHAN_CODE, OPERATE_TYPE,CHNL_TYPE  ";
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
					groupBy =   "  GROUP BY GROUP_ID_1,                                                                           "+
								"           GROUP_ID_1_NAME,                                                                      "+
								"           QQD_QC_19_NUM,                                                                        "+
								"           QQD_QC_39_NUM,                                                                        "+
								"           QQD_QC_59_NUM,                                                                        "+
								"           QQD_QC_89_NUM,                                                                        "+
								"           QQD_QC_119_NUM,                                                                       "+
								"           QQD_QC_139_NUM,                                                                       "+
								"           QQD_QC_RZK_NUM,                                                                       "+
								"           QQD_ALL_QC_NUM,                                                                       "+
								"           QQD_ALL_NUM,                                                                          "+
								"           QQD_QC_19_NUM1,                                                                       "+
								"           QQD_QC_39_NUM1,                                                                       "+
								"           QQD_QC_59_NUM1,                                                                       "+
								"           QQD_QC_89_NUM1,                                                                       "+
								"           QQD_QC_119_NUM1,                                                                      "+
								"           QQD_QC_139_NUM1,                                                                      "+
								"           QQD_QC_RZK_NUM1,                                                                      "+
								"           QQD_ALL_QC_NUM1,                                                                      "+
								"           QQD_ALL_NUM1                                                                          ";
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=getSumSql()+' AND GROUP_ID_1=\''+region+'\'';
					groupBy =   "  GROUP BY GROUP_ID_1,                                                                           "+
								"           GROUP_ID_1_NAME,                                                                      "+
								"           QQD_QC_19_NUM,                                                                        "+
								"           QQD_QC_39_NUM,                                                                        "+
								"           QQD_QC_59_NUM,                                                                        "+
								"           QQD_QC_89_NUM,                                                                        "+
								"           QQD_QC_119_NUM,                                                                       "+
								"           QQD_QC_139_NUM,                                                                       "+
								"           QQD_QC_RZK_NUM,                                                                       "+
								"           QQD_ALL_QC_NUM,                                                                       "+
								"           QQD_ALL_NUM,                                                                          "+
								"           QQD_QC_19_NUM1,                                                                       "+
								"           QQD_QC_39_NUM1,                                                                       "+
								"           QQD_QC_59_NUM1,                                                                       "+
								"           QQD_QC_89_NUM1,                                                                       "+
								"           QQD_QC_119_NUM1,                                                                      "+
								"           QQD_QC_139_NUM1,                                                                      "+
								"           QQD_QC_RZK_NUM1,                                                                      "+
								"           QQD_ALL_QC_NUM1,                                                                      "+
								"           QQD_ALL_NUM1                                                                          ";
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionCode!=""){
				preField+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				preField+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				preField += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			if(chnlType!=""){
				preField += " AND CHNL_TYPE ='"+chnlType+"' ";
			}
			var sql=preField+groupBy;
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

function getNextSql(){
	var dealDate = $("#dealDate").val();
	var sql = 	
				"        OPERATE_TYPE,                                                                       "+
				"        CHNL_TYPE,                                                                          "+
				"        SUM(NVL(QC_19_NUM, 0)) QC_19_NUM,                                                   "+
				"        SUM(NVL(QC_39_NUM, 0)) QC_39_NUM,                                                   "+
				"        SUM(NVL(QC_59_NUM, 0)) QC_59_NUM,                                                   "+
				"        SUM(NVL(QC_89_NUM, 0)) QC_89_NUM,                                                   "+
				"        SUM(NVL(QC_119_NUM, 0)) QC_119_NUM,                                                 "+
				"        SUM(NVL(QC_139_NUM, 0)) QC_139_NUM,                                                 "+
				"        SUM(NVL(QC_RZK_NUM, 0)) QC_RZK_NUM,                                                 "+
				"        SUM(NVL(ALL_QC_NUM, 0)) ALL_QC_NUM,                                                 "+
				"        PODS.GET_RADIX_POINT(CASE                                                           "+
				"                               WHEN SUM(NVL(ALL_NUM, 0)) <> 0 THEN                          "+
				"                                SUM(NVL(ALL_QC_NUM, 0)) * 100 / SUM(NVL(ALL_NUM, 0))        "+
				"                             END || '%',                                                    "+
				"                             2) ALL_QC_HB,                                                  "+
				"        SUM(NVL(QC_19_NUM1, 0)) QC_19_NUM1,                                                 "+
				"        SUM(NVL(QC_39_NUM1, 0)) QC_39_NUM1,                                                 "+
				"        SUM(NVL(QC_59_NUM1, 0)) QC_59_NUM1,                                                 "+
				"        SUM(NVL(QC_89_NUM1, 0)) QC_89_NUM1,                                                 "+
				"        SUM(NVL(QC_119_NUM1, 0)) QC_119_NUM1,                                               "+
				"        SUM(NVL(QC_139_NUM1, 0)) QC_139_NUM1,                                               "+
				"        SUM(NVL(QC_RZK_NUM1, 0)) QC_RZK_NUM1,                                               "+
				"        SUM(NVL(ALL_QC_NUM1, 0)) ALL_QC_NUM1,                                               "+
				"        PODS.GET_RADIX_POINT(CASE                                                           "+
				"                               WHEN SUM(NVL(ALL_NUM1, 0)) <> 0 THEN                         "+
				"                                SUM(NVL(ALL_QC_NUM1, 0)) * 100 / SUM(NVL(ALL_NUM1, 0))      "+
				"                             END || '%',                                                    "+
				"                             2) ALL_QC_HB1                                                  "+
				"   FROM PMRT.TB_MRT_BUS_QC_DEV_DAY                                                          "+
				"  WHERE DEAL_DATE = '"+dealDate+"'                                                          ";
	return sql;
}

function getSumSql() {
	var dealDate = $("#dealDate").val();
	 var s=	 " SELECT GROUP_ID_1 AS ROW_ID,                                                                    "+
			 "        GROUP_ID_1_NAME AS ROW_NAME,                                                             "+
			 "        '——' AS OPERATE_TYPE,                                                                    "+
			 "        '——' AS CHNL_TYPE,                                                                       "+
			 "        SUM(NVL(QC_19_NUM, 0)) QC_19_NUM,                                                        "+
			 "        SUM(NVL(QC_39_NUM, 0)) QC_39_NUM,                                                        "+
			 "        SUM(NVL(QC_59_NUM, 0)) QC_59_NUM,                                                        "+
			 "        SUM(NVL(QC_89_NUM, 0)) QC_89_NUM,                                                        "+
			 "        SUM(NVL(QC_119_NUM, 0)) QC_119_NUM,                                                      "+
			 "        SUM(NVL(QC_139_NUM, 0)) QC_139_NUM,                                                      "+
			 "        SUM(NVL(QC_RZK_NUM, 0)) QC_RZK_NUM,                                                      "+
			 "        SUM(NVL(ALL_QC_NUM, 0)) ALL_QC_NUM,                                                      "+
			 "        PODS.GET_RADIX_POINT(CASE                                                                "+
			 "                               WHEN SUM(NVL(ALL_NUM, 0)) <> 0 THEN                               "+
			 "                                SUM(NVL(ALL_QC_NUM, 0)) * 100 / SUM(NVL(ALL_NUM, 0))             "+
			 "                             END || '%',                                                         "+
			 "                             2) ALL_QC_HB,                                                       "+
			 "        NVL(QQD_QC_19_NUM, 0) QQD_QC_19_NUM,                                                     "+
			 "        NVL(QQD_QC_39_NUM, 0) QQD_QC_39_NUM,                                                     "+
			 "        NVL(QQD_QC_59_NUM, 0) QQD_QC_59_NUM,                                                     "+
			 "        NVL(QQD_QC_89_NUM, 0) QQD_QC_89_NUM,                                                     "+
			 "        NVL(QQD_QC_119_NUM, 0) QQD_QC_119_NUM,                                                   "+
			 "        NVL(QQD_QC_139_NUM, 0) QQD_QC_139_NUM,                                                   "+
			 "        NVL(QQD_QC_RZK_NUM, 0) QQD_QC_RZK_NUM,                                                   "+
			 "        NVL(QQD_ALL_QC_NUM, 0) QQD_ALL_QC_NUM,                                                   "+
			 "  	  PODS.GET_RADIX_POINT(CASE                                                                "+
			 "  									WHEN NVL(QQD_ALL_NUM, 0) <> 0 THEN                         "+  
			 "  									NVL(QQD_ALL_QC_NUM, 0) * 100 / NVL(QQD_ALL_NUM, 0)         "+ 
			 "  								END || '%',                                                    "+   
			 "  								2) QQD_ALL_HB,                                                 "+
			 "        SUM(NVL(QC_19_NUM1, 0)) QC_19_NUM1,                                                      "+
			 "        SUM(NVL(QC_39_NUM1, 0)) QC_39_NUM1,                                                      "+
			 "        SUM(NVL(QC_59_NUM1, 0)) QC_59_NUM1,                                                      "+
			 "        SUM(NVL(QC_89_NUM1, 0)) QC_89_NUM1,                                                      "+
			 "        SUM(NVL(QC_119_NUM1, 0)) QC_119_NUM1,                                                    "+
			 "        SUM(NVL(QC_139_NUM1, 0)) QC_139_NUM1,                                                    "+
			 "        SUM(NVL(QC_RZK_NUM1, 0)) QC_RZK_NUM1,                                                    "+
			 "        SUM(NVL(ALL_QC_NUM1, 0)) ALL_QC_NUM1,                                                    "+
			 "        PODS.GET_RADIX_POINT(CASE                                                                "+
			 "                               WHEN SUM(NVL(ALL_NUM1, 0)) <> 0 THEN                              "+
			 "                                SUM(NVL(ALL_QC_NUM1, 0)) * 100 / SUM(NVL(ALL_NUM1, 0))           "+
			 "                             END || '%',                                                         "+
			 "                             2) ALL_QC_HB1,                                                      "+
			 "        NVL(QQD_QC_19_NUM1, 0) QQD_QC_19_NUM1,                                                   "+
			 "        NVL(QQD_QC_39_NUM1, 0) QQD_QC_39_NUM1,                                                   "+
			 "        NVL(QQD_QC_59_NUM1, 0) QQD_QC_59_NUM1,                                                   "+
			 "        NVL(QQD_QC_89_NUM1, 0) QQD_QC_89_NUM1,                                                   "+
			 "        NVL(QQD_QC_119_NUM1, 0) QQD_QC_119_NUM1,                                                 "+
			 "        NVL(QQD_QC_139_NUM1, 0) QQD_QC_139_NUM1,                                                 "+
			 "        NVL(QQD_QC_RZK_NUM1, 0) QQD_QC_RZK_NUM1,                                                 "+
			 "        NVL(QQD_ALL_QC_NUM1, 0) QQD_ALL_QC_NUM1,                                                 "+
			 "        PODS.GET_RADIX_POINT(CASE                                                                "+
			 "                               WHEN NVL(QQD_ALL_NUM1, 0) <> 0 THEN                               "+
			 "                                NVL(QQD_ALL_QC_NUM1, 0) * 100 / NVL(QQD_ALL_NUM1, 0)             "+
			 "                             END || '%',                                                         "+
			 "                             2) QQD_ALL_HB1                                                      "+
			 "   FROM PMRT.TB_MRT_BUS_QC_DEV_DAY                                                               "+
			 "  WHERE DEAL_DATE = '"+dealDate+"'                                                               ";
		return s;
}



function downsAll() {
	var orderBy= " ORDER BY GROUP_ID_1,HQ_CHAN_CODE ";
	var groupBy= " GROUP BY DEAL_DATE,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,GROUP_ID_1,OPERATE_TYPE,CHNL_TYPE ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var chnlType=$("#chnlType").val();
	var where ="";
	var preField = " SELECT DEAL_DATE,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,"+	getNextSql();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND GROUP_ID_1='"+region+"' ";
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
	var sql = preField + where+groupBy+orderBy;
	var showtext = '七彩套餐用户发展日表' + dealDate;
	title=[["账期","地市","营业厅","渠道编码","经营模式","厅类型","自有厅当日新增用户发展量","","","","","","","","","自有厅本月累计新增用户发展量","","","","","","","",""],
	       ["","","","","","","七彩金惠19元","七彩金惠39元","七彩乐红59元","七彩乐红89元","七彩蓝尊119元","七彩蓝尊139元及以上套餐","七彩流量日租卡","合计发展量","占移网发展的比重（剔除小流量卡）","七彩金惠19元","七彩金惠39元","七彩乐红59元","七彩乐红89元","七彩蓝尊119元","七彩蓝尊139元及以上套餐","七彩流量日租卡","合计发展量","占移网发展的比重（剔除小流量卡）"]
		];
	downloadExcel(sql,title,showtext);
}
