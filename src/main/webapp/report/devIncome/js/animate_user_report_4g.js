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
		title=[["组织架构","经营模式","本月活跃用户","","上月活跃用户","","本月较上月增减","","环比",""],
		       ["","","自有厅","全网","自有厅","全网","自有厅","全网","自有厅","全网"]
			];
		field=["OPERATE_TYPE","THIS_ALL_NUM","QQD_THIS_ALL_NUM","LAST_ALL_NUM","QQD_LAST_ALL_NUM","THIS_ALL_NUM_LAST","QQD_THIS_ALL_NUM_LAST","OWN_HALL_SEQ","WHOLE_NETWORK"];
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
			var flag = $("#flag").val();
			var groupBy = "";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT HQ_CHAN_CODE  AS ROW_ID,BUS_HALL_NAME AS ROW_NAME "+getNextSql()+" AND GROUP_ID_1= '"+code+"'";
					groupBy= "  GROUP BY HQ_CHAN_CODE,BUS_HALL_NAME,OPERATE_TYPE  ";
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
					groupBy = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,QQD_THIS_ALL_NUM,QQD_LAST_ALL_NUM "; 
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=getSumSql()+' AND GROUP_ID_1=\''+region+'\'';
					groupBy = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,QQD_THIS_ALL_NUM,QQD_LAST_ALL_NUM "; 
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
	var sql = 	"       ,OPERATE_TYPE                                                                                                      "+
				"       ,SUM(NVL(THIS_ALL_NUM,0))  AS THIS_ALL_NUM                                                                         "+
				"       ,SUM(NVL(LAST_ALL_NUM,0))  AS LAST_ALL_NUM                                                                         "+
				"       ,SUM(NVL(THIS_ALL_NUM,0))-SUM(NVL(LAST_ALL_NUM,0)) AS THIS_ALL_NUM_LAST                                            "+
				"       ,PODS.GET_RADIX_POINT(CASE WHEN  SUM(NVL(LAST_ALL_NUM,0))<>0                                                       "+
				"                                  THEN (SUM(NVL(THIS_ALL_NUM,0))-SUM(NVL(LAST_ALL_NUM,0)))*100/SUM(NVL(LAST_ALL_NUM,0))   "+
				"                                  ELSE 0 END ||'%',2)  AS OWN_HALL_SEQ                                                    "+
				" FROM PMRT.TB_MRT_BUS_4G_ACTIVE_MON T WHERE DEAL_DATE '"+dealDate+"'                                                      ";
	return sql;
}

function getSumSql() {
	var dealDate = $("#dealDate").val();
	 var s=	 " SELECT GROUP_ID_1 AS ROW_ID                                                                                              "+
			 "       ,GROUP_ID_1_NAME AS ROW_NAME                                                                                       "+
			 "       ,'--' AS OPERATE_TYPE                                                                                              "+
			 "       ,SUM(NVL(THIS_ALL_NUM,0)) AS THIS_ALL_NUM                                                                          "+
			 "       ,NVL(QQD_THIS_ALL_NUM,0)  AS QQD_THIS_ALL_NUM                                                                      "+
			 "       ,SUM(NVL(LAST_ALL_NUM,0)) AS LAST_ALL_NUM                                                                          "+
			 "       ,NVL(QQD_LAST_ALL_NUM,0)  AS QQD_LAST_ALL_NUM                                                                      "+
			 "       ,SUM(NVL(THIS_ALL_NUM,0))-SUM(NVL(LAST_ALL_NUM,0)) AS THIS_ALL_NUM_LAST                                            "+
			 "       ,NVL(QQD_THIS_ALL_NUM,0)-NVL(QQD_LAST_ALL_NUM,0) AS QQD_THIS_ALL_NUM_LAST                                          "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN  SUM(NVL(LAST_ALL_NUM,0))<>0                                                       "+
			 "                                  THEN (SUM(NVL(THIS_ALL_NUM,0))-SUM(NVL(LAST_ALL_NUM,0)))*100/SUM(NVL(LAST_ALL_NUM,0))   "+
			 "                                  ELSE 0 END ||'%',2) AS OWN_HALL_SEQ                                                     "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN  NVL(QQD_LAST_ALL_NUM,0)<>0                                                        "+
			 "                                  THEN (NVL(QQD_THIS_ALL_NUM,0)-NVL(QQD_LAST_ALL_NUM,0))*100/NVL(QQD_LAST_ALL_NUM,0)      "+
			 "                                  ELSE 0 END ||'%',2) AS WHOLE_NETWORK                                                    "+
			 " FROM PMRT.TB_MRT_BUS_4G_ACTIVE_MON WHERE DEAL_DATE ='"+dealDate+"'                                                       ";
		return s;
}



function downsAll() {
	var orderBy=" ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE";
	var groupBy= "  GROUP BY T.DEAL_DATE ,T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where ="";
	var preField = " SELECT T.DEAL_DATE,T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,T.HQ_CHAN_CODE"+	getNextSql();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND T.GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND T.OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = preField + where+groupBy+orderBy;
	var showtext = '4G网活跃用户通报' + dealDate;
	title=[["账期","地市名称","营业厅名称","营业厅编码","经营模式","本月活跃用户","","上月活跃用户","","本月较上月增减","","环比",""],
	       ["","","","","","自有厅","全网","自有厅","全网","自有厅","全网","自有厅","全网"]
		];
	downloadExcel(sql,title,showtext);
}
