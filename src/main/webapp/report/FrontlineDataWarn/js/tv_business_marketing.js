var nowData = [];

var title=[["组织架构","非智慧沃家存量且联系电话为非联通出账用户数"]];		
var field=["IS_ACCT"];


var report=null;
var qdate="";
var orderBy="";
$(function(){
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		/*lock:1,*/
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
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
			var sql="";
			var dealDate=$("#dealDate").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var hqName = $.trim($("#hqName").val());
			//权限
			var orgLevel=$("#orgLevel").val();
			var code=$("#code").val();
			//where条件
			var where="";
			//groupby条件
			var groupBy="";
			var hrId = $("#hrId").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					sql="	SELECT T.GROUP_ID_1 AS ROW_ID, T.GROUP_ID_1_NAME AS ROW_NAME, '<a onclick=\"showDetail('''||T.GROUP_ID_1_NAME||''','''||GROUP_ID_1||''','''||"+orgLevel+"||''');\">' || SUM(T.IS_ACCT) || '</a>' AS IS_ACCT "+
						"	  FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T                             "+
						"	 WHERE T.FALG = 02                                                                     "+
						"	   AND T.IS_ACCT = 1                                                                   ";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
				}else if(orgLevel==3){
					sql=
						"	SELECT T.UNIT_ID AS ROW_ID, T.UNIT_NAME AS ROW_NAME,'<a onclick=\"showDetail('''||T.UNIT_NAME||''','''||UNIT_ID||''','''||"+orgLevel+"||''');\">' || SUM(T.IS_ACCT) || '</a>' AS IS_ACCT "+
						"	  FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T                    "+
						"	 WHERE T.FALG = 02                                                            "+
						"	   AND T.IS_ACCT = 1                                                          "+
						"  	   AND T.GROUP_ID_1='"+code+"'";
					groupBy=" GROUP BY  UNIT_ID ,T.UNIT_NAME";
				}else if(orgLevel==4){
					sql=
						"	SELECT T.HR_ID AS ROW_ID, T.HQ_NAME AS ROW_NAME, '<a onclick=\"showDetail('''||T.HQ_NAME||''','''||HR_ID||''','''||"+orgLevel+"||''');\">' || SUM(T.IS_ACCT) || '</a>' AS IS_ACCT "+
						"	  FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T                 "+
						"	 WHERE T.FALG = 02                                                         "+
						"	   AND T.IS_ACCT = 1                                                       "+
						"      AND T.UNIT_ID='"+code+"'";
					groupBy=" GROUP BY T.HR_ID, T.HQ_NAME";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				if(orgLevel==1){//省   展示省
					sql="	SELECT '86000' AS ROW_ID, '全省' AS ROW_NAME, SUM(T.IS_ACCT) AS IS_ACCT"+
						"	  FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T           "+
						"	 WHERE T.FALG = 02                                                   "+
						"	   AND T.IS_ACCT = 1                                                 ";
				}else if(orgLevel==2){//市
					sql="	SELECT T.GROUP_ID_1 AS ROW_ID, T.GROUP_ID_1_NAME AS ROW_NAME, SUM(T.IS_ACCT) AS IS_ACCT "+
						"	  FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T                             "+
						"	 WHERE T.FALG = 02                                                                     "+
						"	   AND T.IS_ACCT = 1                                                                   "+
						"      AND T.GROUP_ID_1 ='"+code+"'";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
				}else if(orgLevel==3){//营服中心 看地市
					sql="	SELECT T.UNIT_ID AS ROW_ID, T.UNIT_NAME AS ROW_NAME,SUM(T.IS_ACCT) AS IS_ACCT "+
						"	  FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T                    "+
						"	 WHERE T.FALG = 02                                                            "+
						"	   AND T.IS_ACCT = 1                                                          "+
						"  	 AND T.UNIT_ID IN("+_unit_relation(code)+") ";
					groupBy=" GROUP BY  UNIT_ID ,T.UNIT_NAME";
				}else if(level==4){
					sql="	SELECT T.HR_ID AS ROW_ID, T.HQ_NAME AS ROW_NAME, SUM(T.IS_ACCT) AS IS_ACCT "+
						"	  FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T                 "+
						"	 WHERE T.FALG = 02                                                         "+
						"	   AND T.IS_ACCT = 1                                                       "+
						"      AND T.HR_ID='"+hrId+"'";
					groupBy=" GROUP BY T.HR_ID, T.HQ_NAME";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
					if (regionCode != '') {
						sql += " AND T.GROUP_ID_1 = '" + regionCode + "'";
					}
					if (unitCode != '') {
						sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
					}
					if (hqName != '') {
						sql += " AND  T.CUSTOMER_NAME LIKE '%" + hqName + "%'";
					}
					if (groupBy != '') {
						sql += groupBy;
					}
					if (orderBy != '') {
						sql = "select * from( " + sql + ") t " + orderBy;
					}
		var d=query(sql);
		
		return {data:d,extra:{orgLevel:orgLevel}};
		}	
	});
	  report.showSubRow();
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		
	$("#searchBtn").click(function(){
	    report.showSubRow();
	});
});
//大理州分公司,16002,2
function showDetail(groupName,groupId,orgLevel){
	var dealDate = $("#dealDate").val();
	var url=$("#ctx").val()+"/report/FrontlineDataWarn/jsp/tv_business_marketing_detail.jsp?groupId="+groupId+"&orgLevel="+orgLevel+"&groupName="+groupName+"&dealDate="+dealDate;
	window.parent.openWindow('"'+groupName+'"TV业务营销清单明细',null,url);
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var dealDate=$("#dealDate").val();
	
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqName = $.trim($("#hqName").val());
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var sql="	SELECT T.DEAL_DATE,			"+		//--账期
			"	       T.GROUP_ID_1_NAME,   "+		//--分公司
			"	       T.UNIT_NAME,         "+		//--营服名
			"	       T.HQ_NAME,           "+		//--渠道经理
			"	       T.GROUP_ID_2_NAME,   "+		//--归属地
			"	       T.DEVICE_NUMBER,     "+		//--宽带账号
			"	       T.CUSTOMER_NAME,     "+		//--用户名
			"	       T.STD_6_NAME,        "+		//--装机地址
			"	       T.CONTACT_PHONE,     "+		//--联系电话
			"	       T.PRODUCT_NAME,      "+		//--套餐
			"	       T.INNET_DATE,        "+		//--入网时间
			"	       T.TEL AS DEVICE_NUMBE,"+		//--捆绑号码
			"	       T.STATUS_NAME,       "+		//--状态
			"	       T.EXCH_NAME,         "+		//--局站
			"	       T.INPUT_TYPE,        "+		//--接入方式
			"	       T.SPEED_M,           "+		//--速率
			"	       T.HQ_CHAN_CODE,      "+		//--发展渠道
			"	       T.ADVANCE_FEE        "+		//--预存款余额
			"	FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T "+
			"	WHERE FALG=02 				"+
			"   AND IS_ACCT=1				";


	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(hqName!=''){
		sql+=" AND  T.CUSTOMER_NAME LIKE '%"+hqName+"%'";
	}
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" 1=2";
	}
	var title=[["账期","分公司","营服名","渠道经理","归属地","宽带账号","用户名","装机地址","联系电话","套餐","入网时间","捆绑手机号码","状态","局站","接入方式","宽带速率","发展渠道","预存款余额"]];		
		
	showtext = 'TV业务营销清单-'+dealDate;
	downloadExcel(sql,title,showtext);
}
