var report;
$(function(){
	var title=[["组织架构","渠道编码","经营模式","自有厅当日发展三无极低用户数","自有厅当日累计发展用户","","","全网当日发展三无极低用户数","全网当日累计发展用户","","","自有厅当日发展CBSS套餐三无极低用户数","自有厅CBSS套餐当日累计发展用户","","","全网当日发展CBSS套餐三无极低用户数","全网CBSS套餐当日累计发展用户","","","自有厅当日发展2G套餐三无极低用户数","自有厅23G套餐当日累计发展用户","","","全网当日发展2G套餐三无极低用户数","全网23G套餐当日累计发展用户","",""],
	           ["","","","","三无及极低用户数","三无及极低用户占比","其中三无用户数","","三无及极低用户数","三无及极低用户占比","其中三无用户数","","三无及极低用户数","三无及极低用户占比","其中三无用户数","","三无及极低用户数","三无及极低用户占比","其中三无用户数","","三无及极低用户数","三无及极低用户占比","其中三无用户数","","三无及极低用户数","三无及极低用户占比","其中三无用户数"]];
	var field=["ROW_NAME","HQ_CHAN_CODE","OPERATE_TYPE","SWJD_ALL_NUM","SWJD_ALL_NUM1","SW_ALL_NUM1_HB","SW_ALL_NUM1","QQD_SWJD_ALL_NUM","QQD_SWJD_ALL_NUM1","QQD_SWJD_ALL_NUM1_HB","QQD_SW_ALL_NUM1","SWJD_4G_NUM","SWJD_4G_NUM1","SWJD_4G_NUM1_HB","SW_4G_NUM1","QQD_SWJD_4G_NUM","QQD_SWJD_4G_NUM1","QQD_SWJD_4G_NUM1","QQD_SW_4G_NUM1","SWJD_23G_NUM","SWJD_23G_NUM1","SWJD_23G_NUM1_HB","SW_23G_NUM1","QQD_SWJD_23G_NUM","QQD_SWJD_23G_NUM1","QQD_SWJD_23G_NUM1","QQD_SW_23G_NUM1"];
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_YWUSER_ZT_DAY"));
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
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var code=$("#code").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var where = "WHERE 1=1";
			var level;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//省进去点击市
					level=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//地市或营服进去点击市
					level=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=0;
					where+=" AND GROUP_ID_0=86000";
				}else if(orgLevel==2||orgLevel==3){//市
					level=1;
					code=region;
					orgLevel=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}
			orgLevel++;
			
			var dealDate=$("#dealDate").val();
			where+=" AND DEAL_DATE='"+dealDate+"'";
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			var sql="";
			if(level<2){
				sql=getFristSql(where);
			}else{
				sql=getSecondSql(where);
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

function getFristSql(where){
	var s="SELECT GROUP_ID_1 ROW_ID                                                         "+
	"      ,GROUP_ID_1_NAME ROW_NAME                                                          "+
	",'--' HQ_CHAN_CODE,'--' OPERATE_TYPE                                                     "+
	"      ,SUM(NVL(SWJD_ALL_NUM,0))               SWJD_ALL_NUM                               "+
	"      ,SUM(NVL(SWJD_ALL_NUM1,0))              SWJD_ALL_NUM1                              "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM1,0))<>0                            "+
	"                                 THEN SUM(NVL(SWJD_ALL_NUM1,0))*100/SUM(NVL(ALL_NUM1,0)) "+
	"                                 ELSE 0 END || '%'  ,2)           SW_ALL_NUM1_HB         "+
	"      ,SUM(NVL(SW_ALL_NUM1,0))                 SW_ALL_NUM1                               "+
	"      ,NVL(QQD_SWJD_ALL_NUM,0)                 QQD_SWJD_ALL_NUM                          "+
	"      ,NVL(QQD_SWJD_ALL_NUM1,0)                QQD_SWJD_ALL_NUM1                         "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_ALL_NUM1,0)<>0                             "+
	"                                 THEN NVL(QQD_SWJD_ALL_NUM1,0)*100/NVL(QQD_ALL_NUM1,0)   "+
	"                                 ELSE 0 END || '%'  ,2)     QQD_SWJD_ALL_NUM1_HB         "+
	"      ,NVL(QQD_SW_ALL_NUM1,0)                  QQD_SW_ALL_NUM1                           "+
	"      ,SUM(NVL(SWJD_4G_NUM,0))                 SWJD_4G_NUM                               "+
	"      ,SUM(NVL(SWJD_4G_NUM1,0))                SWJD_4G_NUM1                              "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM1,0))<>0                            "+
	"                                 THEN SUM(NVL(SWJD_4G_NUM1,0))*100/SUM(NVL(ALL_NUM1,0))  "+
	"                                 ELSE 0 END || '%'  ,2)     SWJD_4G_NUM1_HB              "+
	"      ,SUM(NVL(SW_4G_NUM1,0))                  SW_4G_NUM1                                "+
	"      ,NVL(QQD_SWJD_4G_NUM,0)                  QQD_SWJD_4G_NUM                           "+
	"      ,NVL(QQD_SWJD_4G_NUM1,0)                QQD_SWJD_4G_NUM1                           "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_ALL_NUM1,0)<>0                             "+
	"                                 THEN NVL(QQD_SWJD_4G_NUM1,0)*100/NVL(QQD_ALL_NUM1,0)    "+
	"                                 ELSE 0 END || '%'  ,2)     QQD_SWJD_4G_NUM1             "+
	"      ,NVL(QQD_SW_4G_NUM1,0)                   QQD_SW_4G_NUM1                            "+
	"      ,SUM(NVL(SWJD_23G_NUM,0))                SWJD_23G_NUM                              "+
	"      ,SUM(NVL(SWJD_23G_NUM1,0))               SWJD_23G_NUM1                             "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM,0))<>0                             "+
	"                                 THEN SUM(NVL(SWJD_23G_NUM1,0))*100/SUM(NVL(ALL_NUM1,0)) "+
	"                                 ELSE 0 END || '%'  ,2)     SWJD_23G_NUM1_HB             "+
	"      ,SUM(NVL(SW_23G_NUM1,0))                 SW_23G_NUM1                               "+
	"      ,NVL(QQD_SWJD_23G_NUM,0)                 QQD_SWJD_23G_NUM                          "+
	"      ,NVL(QQD_SWJD_23G_NUM1,0)                QQD_SWJD_23G_NUM1                         "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_ALL_NUM1,0)<>0                             "+
	"                                 THEN NVL(QQD_SWJD_23G_NUM1,0)*100/NVL(QQD_ALL_NUM1,0)   "+
	"                                 ELSE 0 END || '%'  ,2)     QQD_SWJD_23G_NUM1            "+
	"      ,NVL(QQD_SW_23G_NUM1,0)                  QQD_SW_23G_NUM1                           "+
	"FROM PMRT.TB_MRT_BUS_YWUSER_ZT_DAY " +where+
	"GROUP BY GROUP_ID_1                                                                      "+
	"         ,GROUP_ID_1_NAME                                                                "+
	"         ,QQD_SWJD_ALL_NUM                                                               "+
	"         ,QQD_ALL_NUM                                                                    "+
	"         ,QQD_SWJD_4G_NUM                                                                "+
	"         ,QQD_SWJD_23G_NUM                                                               "+
	"         ,QQD_SWJD_ALL_NUM1                                                              "+
	"         ,QQD_SW_ALL_NUM1                                                                "+
	"         ,QQD_ALL_NUM1                                                                   "+
	"         ,QQD_SWJD_4G_NUM1                                                               "+
	"         ,QQD_SW_4G_NUM1                                                                 "+
	"         ,QQD_SWJD_23G_NUM1                                                              "+
	"         ,QQD_SW_23G_NUM1                                                                ";
	return s;
}

function getSecondSql(where) {
	return "SELECT HQ_CHAN_CODE                                                                "+
	"      ,BUS_HALL_NAME ROW_NAME                                                             "+
	"      ,OPERATE_TYPE                                                                       "+
	"      ,SUM(NVL(SWJD_ALL_NUM,0))               SWJD_ALL_NUM                                "+
	"      ,SUM(NVL(SWJD_ALL_NUM1,0))              SWJD_ALL_NUM1                               "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM1,0))<>0                             "+
	"                                 THEN SUM(NVL(SWJD_ALL_NUM1,0))*100/SUM(NVL(ALL_NUM1,0))  "+
	"                                 ELSE 0 END || '%'  ,2)           SW_ALL_NUM1_HB          "+
	"								                                                           "+
	"      ,SUM(NVL(SW_ALL_NUM1,0))                 SW_ALL_NUM1                                "+
	"                                                                                          "+
	"      ,'--' QQD_SWJD_ALL_NUM                                                              "+
	"      ,'--' QQD_SWJD_ALL_NUM1                                                             "+
	"      ,'--' QQD_SWJD_ALL_NUM1_HB                                                          "+
	"      ,'--' QQD_SW_ALL_NUM1                                                               "+
	"      ,SUM(NVL(SWJD_4G_NUM,0))                 SWJD_4G_NUM                                "+
	"      ,SUM(NVL(SWJD_4G_NUM1,0))                SWJD_4G_NUM1                               "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM1,0))<>0                             "+
	"                                 THEN SUM(NVL(SWJD_4G_NUM1,0))*100/SUM(NVL(ALL_NUM1,0))   "+
	"                                 ELSE 0 END || '%'  ,2)     SWJD_4G_NUM1_HB               "+
	"      ,SUM(NVL(SW_4G_NUM1,0))                  SW_4G_NUM1                                 "+
	"                                                                                          "+
	"      ,'--' QQD_SWJD_4G_NUM                                                               "+
	"      ,'--' QQD_SWJD_4G_NUM1                                                              "+
	"      ,'--' QQD_SWJD_4G_NUM1                                                              "+
	"      ,'--' QQD_SW_4G_NUM1                                                                "+
	"      ,SUM(NVL(SWJD_23G_NUM,0))                SWJD_23G_NUM                               "+
	"      ,SUM(NVL(SWJD_23G_NUM1,0))               SWJD_23G_NUM1                              "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM,0))<>0                              "+
	"                                 THEN SUM(NVL(SWJD_23G_NUM1,0))*100/SUM(NVL(ALL_NUM1,0))  "+
	"                                 ELSE 0 END || '%'  ,2)     SWJD_23G_NUM1_HB              "+
	"      ,SUM(NVL(SW_23G_NUM1,0))                 SW_23G_NUM1                                "+
	"                                                                                          "+
	"      ,'--' QQD_SWJD_23G_NUM                                                              "+
	"      ,'--' QQD_SWJD_23G_NUM1                                                             "+
	"      ,'--' QQD_SWJD_23G_NUM1                                                             "+
	"      ,'--' QQD_SW_23G_NUM1                                                               "+
	"FROM PMRT.TB_MRT_BUS_YWUSER_ZT_DAY " +where+
	"GROUP BY HQ_CHAN_CODE                                                                     "+
	"         ,BUS_HALL_NAME                                                                   "+
	"         ,OPERATE_TYPE                                                                    ";
}

function getDownSql(where) {
	return "SELECT GROUP_ID_1_NAME                                                             "+
	"      ,BUS_HALL_NAME,DEAL_DATE,HQ_CHAN_CODE                                               "+
	"      ,OPERATE_TYPE                                                                       "+
	"      ,SUM(NVL(SWJD_ALL_NUM,0))               SWJD_ALL_NUM                                "+
	"      ,SUM(NVL(SWJD_ALL_NUM1,0))              SWJD_ALL_NUM1                               "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM1,0))<>0                             "+
	"                                 THEN SUM(NVL(SWJD_ALL_NUM1,0))*100/SUM(NVL(ALL_NUM1,0))  "+
	"                                 ELSE 0 END || '%'  ,2)           SW_ALL_NUM1_HB          "+
	"								                                                           "+
	"      ,SUM(NVL(SW_ALL_NUM1,0))                 SW_ALL_NUM1                                "+
	"      ,SUM(NVL(SWJD_4G_NUM,0))                 SWJD_4G_NUM                                "+
	"      ,SUM(NVL(SWJD_4G_NUM1,0))                SWJD_4G_NUM1                               "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM1,0))<>0                             "+
	"                                 THEN SUM(NVL(SWJD_4G_NUM1,0))*100/SUM(NVL(ALL_NUM1,0))   "+
	"                                 ELSE 0 END || '%'  ,2)     SWJD_4G_NUM1_HB               "+
	"      ,SUM(NVL(SW_4G_NUM1,0))                  SW_4G_NUM1                                 "+
	"      ,SUM(NVL(SWJD_23G_NUM,0))                SWJD_23G_NUM                               "+
	"      ,SUM(NVL(SWJD_23G_NUM1,0))               SWJD_23G_NUM1                              "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ALL_NUM,0))<>0                              "+
	"                                 THEN SUM(NVL(SWJD_23G_NUM1,0))*100/SUM(NVL(ALL_NUM1,0))  "+
	"                                 ELSE 0 END || '%'  ,2)     SWJD_23G_NUM1_HB              "+
	"      ,SUM(NVL(SW_23G_NUM1,0))                 SW_23G_NUM1                                "+
	"FROM PMRT.TB_MRT_BUS_YWUSER_ZT_DAY " +where+
	"GROUP BY DEAL_DATE,GROUP_ID_1_NAME,HQ_CHAN_CODE                                                                     "+
	"         ,BUS_HALL_NAME                                                                   "+
	"         ,OPERATE_TYPE                                                                    ";
}

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where ="WHERE 1=1";
	where+=" AND DEAL_DATE='"+dealDate+"'";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
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
	var sql = getDownSql(where);
	var showtext = '移动网发展用户质态日报表' + dealDate;
	var title=[["组织架构","","账期","渠道编码","经营模式","自有厅当日发展三无极低用户数","自有厅当日累计发展用户","","","自有厅当日发展CBSS套餐三无极低用户数","自有厅CBSS套餐当日累计发展用户","","","自有厅当日发展2G套餐三无极低用户数","自有厅23G套餐当日累计发展用户","",""],
	           ["地市","营业厅","","","","","三无及极低用户数","三无及极低用户占比","其中三无用户数","","三无及极低用户数","三无及极低用户占比","其中三无用户数","","三无及极低用户数","三无及极低用户占比","其中三无用户数"]];
	downloadExcel(sql,title,showtext);
}
