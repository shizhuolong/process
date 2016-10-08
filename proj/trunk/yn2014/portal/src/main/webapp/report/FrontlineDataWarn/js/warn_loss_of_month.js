var nowData = [];
/*var title=[["组织架构","非智慧沃家<br>存量且联系电话为非联通出账用户数","归属地","宽带账号","用户名","装机地址","联系电话","套餐","入网时间","捆绑手机号码","状态","局站","接入方式","宽带速率","发展渠道","预存款余额"]];		
var field=["IS_ACCT","GROUP_ID_2_NAME","DEVICE_NUMBER","CUSTOMER_NAME","STD_6_NAME","CONTACT_PHONE","PRODUCT_NAME","INNET_DATE","DEVICE_NUMBE","STATUS_NAME","EXCH_NAME","INPUT_TYPE","SPEED_M","HQ_CHAN_CODE","ADVANCE_FEE"];
*/

var title=[["组织架构","流失用户数","","用户流失率","","流失收入","","收入流失率","","欠费","","出账率",""],
           ["","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减"]];		
var field=["LOSE_NUM","HB_LOSE_NUM","RATE_LOSE_NUM","HB1_LOSE_NUM","LOSE_SR","HB_LOSE_SR","RATE_LOSE_SR","HB1_LOSE_SR","QF","HB_QF","RATE_ACCT","HB1_ACCT_NUM"];
//ROW_ID
//ROW_NAME
//LOSE_NUM		--流失用户数
//HB_LOSE_NUM		--流失用户环比
//RATE_LOSE_NUM	--用户流失率
//HB1_LOSE_NUM	--用户流失率环比增减
//LOSE_SR			--流失收入
//HB_LOSE_SR		--流失收入环比
//RATE_LOSE_SR	--收入流失率
//HB1_LOSE_SR		--流失收入率环比增减
//QF				--欠费 
//HB_QF			--欠费环比
//RATE_ACCT		--出账率
//HB1_ACCT_NUM	--出账率环比增减 

var report=null;
var qdate="";
var orderBy="";
$(function(){
	 listRegions();
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
			var orderBy=" ORDER BY T.ROW_ID ";
			var hrId = $("#hrId").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					sql="	SELECT UNIT_ID AS ROW_ID,UNIT_NAME AS ROW_NAME";
					where=" AND GROUP_ID_1='"+code+"'";
					groupBy=" GROUP BY  UNIT_ID ,UNIT_NAME";
				}else if(orgLevel==3){
					sql="	SELECT MOB_NAME AS ROW_ID, MOB_NAME AS ROW_NAME";
					where=" AND UNIT_ID='"+code+"'";
					groupBy=" GROUP BY  MOB_NAME ";
				}else if(orgLevel==4){
					sql="	SELECT HQ_CHAN_CODE AS ROW_ID, GROUP_ID_4_NAME AS ROW_NAME";
					where=" AND MOB_NAME='"+code+"'";
					groupBy=" GROUP BY HQ_CHAN_CODE, GROUP_ID_4_NAME";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				/*code=$("#regionNum").val();
				//组织架构编码
				var orgCode=$("#code").val();
				orgLevel=$("#orgLevel").val();*/
				if(orgLevel==1){//省   展示省
					sql="	SELECT GROUP_ID_1 AS ROW_ID,GROUP_ID_1_NAME AS ROW_NAME";
					//where =" 1=1";
					groupBy	=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
				}else if(orgLevel==2){//市
					sql="	SELECT UNIT_ID AS ROW_ID,UNIT_NAME AS ROW_NAME";
					where=" AND GROUP_ID_1='"+code+"'";
					groupBy=" GROUP BY  UNIT_ID ,UNIT_NAME";
				}else if(orgLevel==3){//营服中心 看地市
					sql="	SELECT MOB_NAME AS ROW_ID, MOB_NAME AS ROW_NAME";
					where=" AND UNIT_ID='"+code+"'";
					groupBy=" GROUP BY  MOB_NAME";
				}else if(level==4){
					sql="	SELECT HQ_CHAN_CODE AS ROW_ID, GROUP_ID_4_NAME AS ROW_NAME";
					where=" AND HR_ID='"+code+"'";
					groupBy=" GROUP BY HQ_CHAN_CODE, GROUP_ID_4_NAME";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			sql+=getSql()+" WHERE  DEAL_DATE ="+dealDate+where;
			if (regionCode != '') {
				sql += " AND GROUP_ID_1 = '" + regionCode + "'";
			}
			if (unitCode != '') {
				sql += " AND UNIT_ID = '" + unitCode + "'";
			}
			if (hqName != '') {
				sql += " AND  MOB_NAME LIKE '%" + hqName + "%'";
			}
			
			if (groupBy != '') {
				sql += groupBy;
			}
			//console.info(sql);
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
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
	});
});
//大理州分公司,16002,2
function getSql(){
	var sql="      ,SUM(NVL(LOSE_NUM,0))     AS LOSE_NUM                                                                                                                        "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LOSE_NUML,0)) <> 0                                                                                            "+
			"                                                    THEN (SUM(NVL(LOSE_NUM,0)) - SUM(NVL(LOSE_NUML,0)))*100 /SUM(NVL(LOSE_NUML,0))                                 "+
			"                                                    ELSE 0 END,'FM99999999990.9999')),2) || '%'             HB_LOSE_NUM                                            "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(ACCT_NUML,0)) <> 0                                                                                            "+
			"                                                    THEN SUM(NVL(LOSE_NUM,0))*100/SUM(NVL(ACCT_NUML,0))                                                            "+
			"                                                    ELSE 0 END,'FM99999999990.9999')),2) || '%'             RATE_LOSE_NUM                                          "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(ACCT_NUML,0))=0 AND SUM(NVL(ACCT_NUML2,0))= 0                                                                 "+
			"                                          THEN 0                                                                                                                   "+
			"                                          WHEN SUM(NVL(ACCT_NUML,0))<>0 AND SUM(NVL(ACCT_NUML2,0))=0                                                               "+
			"                                          THEN SUM(NVL(LOSE_NUM,0))*100/SUM(NVL(ACCT_NUML,0))                                                                      "+
			"                                          WHEN SUM(NVL(ACCT_NUML,0))=0 AND SUM(NVL(ACCT_NUML2,0))<>0                                                               "+
			"                                          THEN -SUM(NVL(LOSE_NUML,0))*100/SUM(NVL(ACCT_NUML2,0))                                                                   "+
			"                                                    ELSE SUM(NVL(LOSE_NUM,0))*100/SUM(NVL(ACCT_NUML,0))-SUM(NVL(LOSE_NUML,0))*100/SUM(NVL(ACCT_NUML2,0))           "+
			"                                                    END,'FM99999999990.9999')),2)   || '%'                   HB1_LOSE_NUM                                          "+
			"      ,SUM(NVL(LOSE_SR,0))    AS LOSE_SR                                                                                                                           "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(LOSE_SRL,0)) <> 0                                                                                             "+
			"                                                    THEN (SUM(NVL(LOSE_SR,0)) - SUM(NVL(LOSE_SRL,0)))*100 /SUM(NVL(LOSE_SRL,0))                                    "+
			"                                                    ELSE 0 END,'FM99999999990.9999')),2) || '%'             HB_LOSE_SR                                             "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(ACCT_SRL,0)) <> 0                                                                                             "+
			"                                                    THEN SUM(NVL(LOSE_SR,0))*100/SUM(NVL(ACCT_SRL,0))                                                              "+
			"                                                    ELSE 0 END,'FM99999999990.9999')),2) || '%'             RATE_LOSE_SR                                           "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(ACCT_SRL,0))=0 AND SUM(NVL(ACCT_SRL2,0))= 0                                                                   "+
			"                                          THEN 0                                                                                                                   "+
			"                                          WHEN SUM(NVL(ACCT_SRL,0))<>0 AND SUM(NVL(ACCT_SRL2,0))=0                                                                 "+
			"                                          THEN SUM(NVL(LOSE_SR,0))*100/SUM(NVL(ACCT_SRL,0))                                                                        "+
			"                                          WHEN SUM(NVL(ACCT_SRL,0))=0 AND SUM(NVL(ACCT_SRL2,0))<>0                                                                 "+
			"                                          THEN -SUM(NVL(LOSE_SRL,0))*100/SUM(NVL(ACCT_SRL2,0))                                                                     "+
			"                                                    ELSE SUM(NVL(LOSE_SR,0))*100/SUM(NVL(ACCT_SRL,0))-SUM(NVL(LOSE_SRL,0))*100/SUM(NVL(ACCT_SRL2,0))               "+
			"                                                    END,'FM99999999990.9999')),2)   || '%'                   HB1_LOSE_SR                                           "+
			"      ,SUM(NVL(QF,0))   AS QF                                                                                                                                      "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(QFL,0)) <> 0                                                                                                  "+
			"                                                    THEN (SUM(NVL(QF,0)) - SUM(NVL(QFL,0)))*100 /SUM(NVL(QFL,0))                                                   "+
			"                                                    ELSE 0 END,'FM99999999990.9999')),2) || '%'               HB_QF                                                "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(INNET_NUM,0)) <> 0                                                                                            "+
			"                                                    THEN SUM(NVL(ACCT_NUM,0))*100/SUM(NVL(INNET_NUM,0))                                                            "+
			"                                                    ELSE 0 END,'FM99999999990.9999')),2) || '%'               RATE_ACCT                                            "+
			"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(INNET_NUM,0))=0 AND SUM(NVL(INNET_NUML,0))= 0                                                                 "+
			"                                          THEN 0                                                                                                                   "+
			"                                          WHEN SUM(NVL(INNET_NUM,0))<>0 AND SUM(NVL(INNET_NUML,0))=0                                                               "+
			"                                          THEN SUM(NVL(ACCT_NUM,0))*100/SUM(NVL(INNET_NUM,0))                                                                      "+
			"                                          WHEN SUM(NVL(INNET_NUM,0))=0 AND SUM(NVL(INNET_NUML,0))<>0                                                               "+
			"                                          THEN -SUM(NVL(ACCT_NUML,0))*100/SUM(NVL(INNET_NUML,0))                                                                   "+
			"                                                    ELSE SUM(NVL(ACCT_NUM,0))*100/SUM(NVL(INNET_NUM,0))-SUM(NVL(ACCT_NUML,0))*100/SUM(NVL(INNET_NUML,0))           "+
			"                                                    END,'FM99999999990.9999')),2)   || '%'                   HB1_ACCT_NUM                                          "+                                                                                                                                 
			"	FROM PMRT.TB_MRT_WARN_USER_LOSE_MON                                                                                                                             ";
	return sql;
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
	var sql="	SELECT DEAL_DATE,			"+		
			"	       GROUP_ID_1_NAME,   	"+		
			"	       UNIT_NAME,         	"+		
			"	       MOB_NAME,           	"+		
			"	       GROUP_ID_4_NAME   	"+		
			getSql()+
			"	WHERE  DEAL_DATE =	"+dealDate;
			
			if (regionCode != '') {
				sql += " AND GROUP_ID_1 = '" + regionCode + "'";
			}
			if (unitCode != '') {
				sql += " AND UNIT_ID = '" + unitCode + "'";
			}
			if (hqName != '') {
				sql += " AND  MOB_NAME LIKE '%" + hqName + "%'";
			}
			
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and UNIT_ID='"+code+"'";
	}else if(orgLevel==4){
		sql+=" and HQ_CHAN_CODE='"+code+"'";
	}
	sql+="  GROUP BY DEAL_DATE, GROUP_ID_1_NAME, UNIT_NAME, MOB_NAME, GROUP_ID_4_NAME ";
	
	var title=[["账期","地市","营服中心","渠道经理","渠道名称","流失用户数","","用户流失率","","流失收入","","收入流失率","","欠费","","出账率",""],
	           ["","","","","","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减"]];			
	showtext = '月流失预警报表-'+dealDate;
	downloadExcel(sql,title,showtext);
}


/****
 * 查询地市
 */
function listRegions(){
    var sql=" SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE  T WHERE 1=1 ";
    var orgLevel=$("#orgLevel").val();
    var code=$("#code").val();
    var region =$("#regionNum").val();
    if(orgLevel==1){
        sql+="";
    }else if(orgLevel==2){
        sql+=" and T.GROUP_ID_1='"+code+"'";
    }else{
        sql+=" and T.GROUP_ID_1='"+region+"'";
    }
    sql+=" ORDER BY T.GROUP_ID_1"
    var d=query(sql);
    if (d) {
        var h = '';
        if (d.length == 1) {
            h += '<option value="' + d[0].GROUP_ID_1
                    + '" selected >'
                    + d[0].GROUP_ID_1_NAME + '</option>';
            listUnits(d[0].GROUP_ID_1);
        } else {
            h += '<option value="" selected>请选择</option>';
            for (var i = 0; i < d.length; i++) {
                h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
            }
        }
        var $area = $("#regionCode");
        var $h = $(h);
        $area.empty().append($h);
        $area.change(function() {
            listUnits($(this).attr('value'));
        });
    } else {
        alert("获取地市信息失败");
    }
}

/************查询营服中心***************/
function listUnits(region){
    var $unit=$("#unitCode");
    var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1 ";
    if(region!=''){
        sql+=" AND T.GROUP_ID_1='"+region+"' ";
        //权限
        var orgLevel=$("#orgLevel").val();
        var code=$("#code").val();
        /**查询营服中心编码条件是有地市编码，***/
        if(orgLevel==3){
            sql+=" and t.UNIT_ID='"+code+"'";
        }else if(orgLevel==4){
            sql+=" AND 1=2";
        }else{
        }
    }else{
        $unit.empty().append('<option value="" selected>请选择</option>');
        return;
    }

    sql+=" ORDER BY T.UNIT_ID"
    var d=query(sql);
    if (d) {
        var h = '';
        if (d.length == 1) {
            h += '<option value="' + d[0].UNIT_ID
                    + '" selected >'
                    + d[0].UNIT_NAME + '</option>';
        } else {
            h += '<option value="" selected>请选择</option>';
            for (var i = 0; i < d.length; i++) {
                h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME + '</option>';
            }
        }

        var $h = $(h);
        $unit.empty().append($h);
    } else {
        alert("获取基层单元信息失败");
    }
}
