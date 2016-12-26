var field=["HQ_CHAN_CODE","OPERATE_TYPE","USER_4G_ACCT","USER_ALL_ACCT","PERMEN_4G","ALL_4G_NET","MOB_ACCT_NUM","PERME_ALL_4G"];
var title=[["州市","渠道编码","经营模式","自营厅4G网络渗透率","","","全渠道4G网络渗透率","",""],
           ["","","","使用4G网络出帐用户数","移网出帐用户数","4G网络渗透率","使用4G网络出帐用户数","移网出帐用户数","4G网络渗透率"]];
var report=null;
var qdate="";
var orderBy="";
$(function(){
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:2,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" ORDER BY ROW_NAME "+type+" ";
			}else if(index>0){
				orderBy=" ORDER BY "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var groupBy='';
			var order='';
			var code='';
			var orgLevel='';
			qdate = $("#month").val();
			var where=" WHERE T.DEAL_DATE='"+qdate+"'";
			var regionCode=$("#regionCode").val();
			var operate_type=$("#operate_type").val();
			var hq_chan_code=$.trim($("#hq_chan_code").val());
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=" SELECT T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' OPERATE_TYPE,"+getSumField();
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
				}else if(orgLevel==3||orgLevel==4){
			    	preField=" SELECT T.HQ_CHAN_NAME ROW_NAME,T.HQ_CHAN_CODE ROW_ID,T.HQ_CHAN_CODE,T.OPERATE_TYPE,			  "+
							 "      SUM(NVL(T.USER_4G_ACCT,0))USER_4G_ACCT                                           		  "+
							 "      ,SUM(NVL(T.USER_ALL_ACCT,0))USER_ALL_ACCT                                                 "+
							 "      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.USER_ALL_ACCT,0))=0 THEN 0                     "+
							 "                  ELSE SUM(NVL(T.USER_4G_ACCT,0))*100/SUM(NVL(T.USER_ALL_ACCT,0)) END           "+
							 "                   ,'FM9999990.99')) ||'%' PERMEN_4G                                            "+
							 "     ,'—' AS ALL_4G_NET                                              						      "+
							 "     ,'—' AS MOB_ACCT_NUM                                           							  "+
							 "     ,'—' AS PERME_ALL_4G                                                                       "+
							 "FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                            ";
					groupBy+=" GROUP BY T.HQ_CHAN_CODE,T.HQ_CHAN_NAME,T.OPERATE_TYPE";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					order=" ORDER BY T.HQ_CHAN_CODE";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示省
					preField=" SELECT '云南省' ROW_NAME,T.GROUP_ID_0 ROW_ID,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' OPERATE_TYPE,"+getSumField();
					groupBy=" GROUP BY T.GROUP_ID_0";
				}else if(orgLevel==2){//市
					preField=" SELECT T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' OPERATE_TYPE,"+getSumField();
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心 看地市
					preField=" SELECT T.GROUP_ID_1_NAME ROW_NAME,T.GROUP_ID_1 ROW_ID,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' OPERATE_TYPE,"+getSumField();
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			if(regionCode!=''){
				where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
			}
			if(hq_chan_code!=''){
				where+=" AND T.HQ_CHAN_CODE = '"+hq_chan_code+"'";
			}
			if(operate_type!=''){
				where+=" AND T.OPERATE_TYPE = '"+operate_type+"'";
			}
			var sql=preField+where+groupBy+order;
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	$("#searchBtn").click(function(){
	    report.showSubRow();
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var where=' ';
	var orderBy=" ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE";
	var groupBy=" GROUP BY T.DEAL_DATE,T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.HQ_CHAN_NAME,T.OPERATE_TYPE";
	var regionCode=$("#regionCode").val();
	var operate_type=$("#operate_type").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var fieldSql=getSumField();
		
	//先根据用户信息得到前几个字段
	var region = $("#region").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND T.GROUP_ID_1='" + region + "' ";
	} else if (orgLevel == 3) {//营服中心
		where += " AND T.GROUP_ID_1='" + region + "' ";
	}else{
		where +=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hq_chan_code!=''){
		where+=" AND T.HQ_CHAN_CODE = '"+hq_chan_code+"'";
	}
	if(operate_type!=''){
		where+=" AND T.OPERATE_TYPE = '"+operate_type+"'";
	}
	var sql = 	" SELECT T.DEAL_DATE,T.GROUP_ID_1_NAME,T.HQ_CHAN_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE, "+
				"      SUM(NVL(T.USER_4G_ACCT,0))USER_4G_ACCT                                        "+
				"      ,SUM(NVL(T.USER_ALL_ACCT,0))USER_ALL_ACCT                                     "+
				"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.USER_ALL_ACCT,0))=0 THEN 0         "+
				"                  ELSE SUM(NVL(T.USER_4G_ACCT,0))*100/SUM(NVL(T.USER_ALL_ACCT,0)) END "+
				"                   ,'FM9999990.99')) ||'%' PERMEN_4G   		                     "+
				"FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                "+
				" WHERE T.DEAL_DATE='"+qdate+"'"+where+groupBy+orderBy;
	showtext = '自有厅4G渗透率支撑' + qdate;
	var title=[["账期","地市","营业厅名称","渠道编码","经营模式","自营厅4G网络渗透率","",""],
	             ["","","","","","使用4G网络出帐用户数","移网出帐用户数","4G网络渗透率"]];
	downloadExcel(sql,title,showtext);
}

function getSumField(){
	var fs = "      SUM(NVL(T.USER_4G_ACCT,0))USER_4G_ACCT                                           "+
	"      ,SUM(NVL(T.USER_ALL_ACCT,0))USER_ALL_ACCT                                                 "+
	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.USER_ALL_ACCT,0))=0 THEN 0                     "+
	"                  ELSE SUM(NVL(T.USER_4G_ACCT,0))*100/SUM(NVL(T.USER_ALL_ACCT,0)) END           "+
	"                    ,'FM99990.99')) ||'%' PERMEN_4G                                             "+
	"     ,SUM(DISTINCT  NVL(T.ALL_4G_NET,0))ALL_4G_NET                                              "+
	"     ,SUM(DISTINCT NVL(T.MOB_ACCT_NUM,0))MOB_ACCT_NUM                                           "+
	"     ,TRIM('.'FROM TO_CHAR(CASE WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM,0))=0 THEN 0               "+
	"                  ELSE SUM(DISTINCT NVL(T.ALL_4G_NET,0))*100/SUM(DISTINCT NVL(T.MOB_ACCT_NUM,0)) END"+
	"                    ,'FM99990.99'))||'%' PERME_ALL_4G                                             "+
	"FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                            ";                                                                              
	return fs;
}