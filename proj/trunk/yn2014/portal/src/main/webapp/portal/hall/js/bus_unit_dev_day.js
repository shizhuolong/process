$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_UNIT_DEV_DAY"));
	var title=[["组织架构","营服ID","区县营服","渠道编码","渠道名称","本月移动网累计发展数","上月同期移动网累计发展数","移动网发展数累计环比","本月移动网发展数","上月同期当月移动网发展数","移动网发展数环比","本月2I2C累计发展数","上月同期2I2C累计发展数","2I2C发展数累计环比","本月2I2C发展数","上月同期当月2I2C发展数","2I2C发展数环比","本月行业应用卡累计发展数","上月同期行业应用卡累计发展数","行业应用卡发展数累计环比","本月行业应用卡发展数","上月同期当月行业应用卡发展数","行业应用卡发展数环比","本月宽带累计发展数","上月同期宽带累计发展数","宽带发展数累计环比","本月宽带发展数","上月同期当月宽带发展数","宽带发展数环比","本月专租线累计发展数","上月同期专租线累计发展数","专租线发展数累计环比","本月专租线发展数","上月同期当月专租线发展数","专租线发展数环比"]];
	var field=["ROW_NAME","UNIT_ID","UNIT_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","THIS_YW_NUM1","THIS_YW_NUML1","THIS_YW_NUM_HB1","THIS_YW_NUM","THIS_YW_NUML","THIS_YW_NUM_HB","THIS_2I2C_NUM1","THIS_2I2C_NUML1","THIS_2I2C_NUM_HB1","THIS_2I2C_NUM","THIS_2I2C_NUML","THIS_2I2C_NUM_HB","THIS_HYYYK_NUM1","THIS_HYYYK_NUML1","THIS_HYYYK_NUM_HB1","THIS_HYYYK_NUM","THIS_HYYYK_NUML","THIS_HYYYK_NUM_HB","THIS_KD_NUM1","THIS_KD_NUML1","THIS_KD_NUM_HB1","THIS_KD_NUM","THIS_KD_NUML","THIS_KD_NUM_HB","THIS_ZZX_NUM1","THIS_ZZX_NUML1","THIS_ZZX_NUM_HB1","THIS_ZZX_NUM","THIS_ZZX_NUML","THIS_ZZX_NUM_HB"];
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		field:field,
		css:[{gt:6,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var where="WHERE DEAL_DATE='"+dealDate+"'";
			var where1="WHERE DEAL_DATE= TO_CHAR(ADD_MONTHS(TO_DATE('"+dealDate+"','YYYYMMDD'),-1),'YYYYMMDD')";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省，显示市
					
				}else if(orgLevel==3){//点击市，展示营服
					where+=" AND GROUP_ID_1='"+code+"'";
					where1+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服，展示渠道
					where+=" AND UNIT_ID='"+code+"'";
					where1+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(orgLevel,where,where1);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					where1+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND UNIT_ID='"+code+"'";
					where1+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(orgLevel,where,where1);
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

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var code=$("code").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	var where1="WHERE DEAL_DATE= TO_CHAR(ADD_MONTHS(TO_DATE('"+dealDate+"','YYYYMMDD'),-1),'YYYYMMDD')";
	if (orgLevel == 1) {//省
		
	} else if(orgLevel==2){//市
		where += " AND GROUP_ID_1='"+code+"'";
		where1 += " AND GROUP_ID_1='"+code+"'";
	} else if(orgLevel==3){//营服
		where += " AND UNIT_ID='"+code+"'";
		where1 += " AND UNIT_ID='"+code+"'";
	} else{
		where += " AND 1=2";
	}
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
		where1+=" AND UNIT_ID='"+unitCode+"'";
	}
	var sql = getDownSql(where,where1);
	var showtext = '营服数发展日报-' + dealDate;
	var title=[["地市","营服ID","区县营服","渠道编码","渠道名称","本月移动网累计发展数","上月同期移动网累计发展数","移动网发展数累计环比","本月移动网发展数","上月同期当月移动网发展数","移动网发展数环比","本月2I2C累计发展数","上月同期2I2C累计发展数","2I2C发展数累计环比","本月2I2C发展数","上月同期当月2I2C发展数","2I2C发展数环比","本月行业应用卡累计发展数","上月同期行业应用卡累计发展数","行业应用卡发展数累计环比","本月行业应用卡发展数","上月同期当月行业应用卡发展数","行业应用卡发展数环比","本月宽带累计发展数","上月同期宽带累计发展数","宽带发展数累计环比","本月宽带发展数","上月同期当月宽带发展数","宽带发展数环比","本月专租线累计发展数","上月同期专租线累计发展数","专租线发展数累计环比","本月专租线发展数","上月同期当月专租线发展数","专租线发展数环比"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where,where1){
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
		where1+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(orgLevel==1){
		return "SELECT  T1.GROUP_ID_0 ROW_ID                                                                         "+
		"       ,'云南省' ROW_NAME                                                                            "+
		"       ,'--' UNIT_ID                                                                                 "+
		"       ,'--' UNIT_NAME                                                                               "+
		"       ,'--' HQ_CHAN_CODE                                                                            "+
		"       ,'--' GROUP_ID_4_NAME                                                                         "+
		"       ,NVL(T1.THIS_YW_NUM1,0)   THIS_YW_NUM1                                                        "+
		"       ,NVL(T2.THIS_YW_NUM1,0)   THIS_YW_NUML1                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM1,0),NVL(T2.THIS_YW_NUM1,0),2)   THIS_YW_NUM_HB1           "+
		"       ,NVL(T1.THIS_YW_NUM,0)   THIS_YW_NUM                                                          "+
		"       ,NVL(T2.THIS_YW_NUM,0)   THIS_YW_NUML                                                         "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM,0),NVL(T2.THIS_YW_NUM,0),2)   THIS_YW_NUM_HB              "+
		"       ,NVL(T1.THIS_2I2C_NUM1,0)   THIS_2I2C_NUM1                                                    "+
		"       ,NVL(T2.THIS_2I2C_NUM1,0)   THIS_2I2C_NUML1                                                   "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM1,0),NVL(T2.THIS_2I2C_NUM1,0),2)   THIS_2I2C_NUM_HB1     "+
		"       ,NVL(T1.THIS_2I2C_NUM,0)   THIS_2I2C_NUM                                                      "+
		"       ,NVL(T2.THIS_2I2C_NUM,0)   THIS_2I2C_NUML                                                     "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM,0),NVL(T2.THIS_2I2C_NUM,0),2)   THIS_2I2C_NUM_HB        "+
		"       ,NVL(T1.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUM1                                                  "+
		"       ,NVL(T2.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUML1                                                 "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM1,0),NVL(T2.THIS_HYYYK_NUM1,0),2)   THIS_HYYYK_NUM_HB1  "+
		"       ,NVL(T1.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUM                                                    "+
		"       ,NVL(T2.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUML                                                   "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM,0),NVL(T2.THIS_HYYYK_NUM,0),2)   THIS_HYYYK_NUM_HB     "+
		"       ,NVL(T1.THIS_KD_NUM1,0)   THIS_KD_NUM1                                                        "+
		"       ,NVL(T2.THIS_KD_NUM1,0)   THIS_KD_NUML1                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM1,0),NVL(T2.THIS_KD_NUM1,0),2)   THIS_KD_NUM_HB1           "+
		"       ,NVL(T1.THIS_KD_NUM,0)   THIS_KD_NUM                                                          "+
		"       ,NVL(T2.THIS_KD_NUM,0)   THIS_KD_NUML                                                         "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM,0),NVL(T2.THIS_KD_NUM,0),2)   THIS_KD_NUM_HB              "+
		"       ,NVL(T1.THIS_ZZX_NUM1,0)   THIS_ZZX_NUM1                                                      "+
		"       ,NVL(T2.THIS_ZZX_NUM1,0)   THIS_ZZX_NUML1                                                     "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM1,0),NVL(T2.THIS_ZZX_NUM1,0),2)   THIS_ZZX_NUM_HB1        "+
		"       ,NVL(T1.THIS_ZZX_NUM,0)   THIS_ZZX_NUM                                                        "+
		"       ,NVL(T2.THIS_ZZX_NUM,0)   THIS_ZZX_NUML                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM,0),NVL(T2.THIS_ZZX_NUM,0),2)   THIS_ZZX_NUM_HB           "+
		"FROM (                                                                                               "+
		"      SELECT  GROUP_ID_0                                                                             "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                               "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                               "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                            "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                             "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                              "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                             "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                             "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                          "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                           "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                            "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                 "+
		        where+
		"      GROUP BY  GROUP_ID_0                                                                           "+
		")T1                                                                                                  "+
		"LEFT JOIN (                                                                                          "+
		"      SELECT  GROUP_ID_0                                                                             "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                               "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                               "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                            "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                             "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                              "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                             "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                             "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                          "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                           "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                            "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                 "+
		        where1+
		"      GROUP BY  GROUP_ID_0                                                                           "+
		")T2 ON(T1.GROUP_ID_0=T2.GROUP_ID_0)                                                                  ";
	}else if(orgLevel==2){
		return "SELECT                                                                                              "+
		"       T1.GROUP_ID_1 ROW_ID                                                                         "+
		"       ,T1.GROUP_ID_1_NAME ROW_NAME                                                                 "+
		"       ,'--' UNIT_ID                                                                                "+
		"       ,'--' UNIT_NAME                                                                              "+
		"       ,'--' HQ_CHAN_CODE                                                                           "+
		"       ,'--' GROUP_ID_4_NAME                                                                        "+
		"       ,NVL(T1.THIS_YW_NUM1,0)   THIS_YW_NUM1                                                       "+
		"       ,NVL(T2.THIS_YW_NUM1,0)   THIS_YW_NUML1                                                      "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM1,0),NVL(T2.THIS_YW_NUM1,0),2)   THIS_YW_NUM_HB1          "+
		"       ,NVL(T1.THIS_YW_NUM,0)   THIS_YW_NUM                                                         "+
		"       ,NVL(T2.THIS_YW_NUM,0)   THIS_YW_NUML                                                        "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM,0),NVL(T2.THIS_YW_NUM,0),2)   THIS_YW_NUM_HB             "+
		"       ,NVL(T1.THIS_2I2C_NUM1,0)   THIS_2I2C_NUM1                                                   "+
		"       ,NVL(T2.THIS_2I2C_NUM1,0)   THIS_2I2C_NUML1                                                  "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM1,0),NVL(T2.THIS_2I2C_NUM1,0),2)   THIS_2I2C_NUM_HB1    "+
		"       ,NVL(T1.THIS_2I2C_NUM,0)   THIS_2I2C_NUM                                                     "+
		"       ,NVL(T2.THIS_2I2C_NUM,0)   THIS_2I2C_NUML                                                    "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM,0),NVL(T2.THIS_2I2C_NUM,0),2)   THIS_2I2C_NUM_HB       "+
		"       ,NVL(T1.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUM1                                                 "+
		"       ,NVL(T2.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUML1                                                "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM1,0),NVL(T2.THIS_HYYYK_NUM1,0),2)   THIS_HYYYK_NUM_HB1 "+
		"       ,NVL(T1.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUM                                                   "+
		"       ,NVL(T2.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUML                                                  "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM,0),NVL(T2.THIS_HYYYK_NUM,0),2)   THIS_HYYYK_NUM_HB    "+
		"       ,NVL(T1.THIS_KD_NUM1,0)   THIS_KD_NUM1                                                       "+
		"       ,NVL(T2.THIS_KD_NUM1,0)   THIS_KD_NUML1                                                      "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM1,0),NVL(T2.THIS_KD_NUM1,0),2)   THIS_KD_NUM_HB1          "+
		"       ,NVL(T1.THIS_KD_NUM,0)   THIS_KD_NUM                                                         "+
		"       ,NVL(T2.THIS_KD_NUM,0)   THIS_KD_NUML                                                        "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM,0),NVL(T2.THIS_KD_NUM,0),2)   THIS_KD_NUM_HB             "+
		"       ,NVL(T1.THIS_ZZX_NUM1,0)   THIS_ZZX_NUM1                                                     "+
		"       ,NVL(T2.THIS_ZZX_NUM1,0)   THIS_ZZX_NUML1                                                    "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM1,0),NVL(T2.THIS_ZZX_NUM1,0),2)   THIS_ZZX_NUM_HB1       "+
		"       ,NVL(T1.THIS_ZZX_NUM,0)   THIS_ZZX_NUM                                                       "+
		"       ,NVL(T2.THIS_ZZX_NUM,0)   THIS_ZZX_NUML                                                      "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM,0),NVL(T2.THIS_ZZX_NUM,0),2)   THIS_ZZX_NUM_HB          "+
		"FROM (                                                                                              "+
		"      SELECT  GROUP_ID_0                                                                            "+
		"             ,GROUP_ID_1                                                                            "+
		"             ,GROUP_ID_1_NAME                                                                       "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                              "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                              "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                           "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                            "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                             "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                            "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                            "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                         "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                          "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                           "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                "+
		    where+
		"      GROUP BY  GROUP_ID_0                                                                          "+
		"               ,GROUP_ID_1                                                                          "+
		"               ,GROUP_ID_1_NAME                                                                     "+
		")T1                                                                                                 "+
		"LEFT JOIN (                                                                                         "+
		"      SELECT  GROUP_ID_0                                                                            "+
		"             ,GROUP_ID_1                                                                            "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                              "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                              "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                           "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                            "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                             "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                            "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                            "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                         "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                          "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                           "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                "+
		         where1+
		"      GROUP BY  GROUP_ID_0                                                                          "+
		"               ,GROUP_ID_1                                                                          "+
		")T2 ON(T1.GROUP_ID_1=T2.GROUP_ID_1)                                                                 ";
	}else if(orgLevel==3){
		return "SELECT                                                                                         "+
		"        T1.UNIT_ID ROW_ID                                                                             "+
		"       ,T1.UNIT_NAME ROW_NAME                                                                         "+
		"       ,T1.UNIT_ID                                                                                    "+
		"       ,T1.UNIT_NAME,'--' HQ_CHAN_CODE,'--' GROUP_ID_4_NAME                                           "+
		"       ,NVL(T1.THIS_YW_NUM1,0)   THIS_YW_NUM1                                                         "+
		"       ,NVL(T2.THIS_YW_NUM1,0)   THIS_YW_NUML1                                                        "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM1,0),NVL(T2.THIS_YW_NUM1,0),2)   THIS_YW_NUM_HB1            "+
		"       ,NVL(T1.THIS_YW_NUM,0)   THIS_YW_NUM                                                           "+
		"       ,NVL(T2.THIS_YW_NUM,0)   THIS_YW_NUML                                                          "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM,0),NVL(T2.THIS_YW_NUM,0),2)   THIS_YW_NUM_HB               "+
		"       ,NVL(T1.THIS_2I2C_NUM1,0)   THIS_2I2C_NUM1                                                     "+
		"       ,NVL(T2.THIS_2I2C_NUM1,0)   THIS_2I2C_NUML1                                                    "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM1,0),NVL(T2.THIS_2I2C_NUM1,0),2)   THIS_2I2C_NUM_HB1      "+
		"       ,NVL(T1.THIS_2I2C_NUM,0)   THIS_2I2C_NUM                                                       "+
		"       ,NVL(T2.THIS_2I2C_NUM,0)   THIS_2I2C_NUML                                                      "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM,0),NVL(T2.THIS_2I2C_NUM,0),2)   THIS_2I2C_NUM_HB         "+
		"       ,NVL(T1.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUM1                                                   "+
		"       ,NVL(T2.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUML1                                                  "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM1,0),NVL(T2.THIS_HYYYK_NUM1,0),2)   THIS_HYYYK_NUM_HB1   "+
		"       ,NVL(T1.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUM                                                     "+
		"       ,NVL(T2.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUML                                                    "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM,0),NVL(T2.THIS_HYYYK_NUM,0),2)   THIS_HYYYK_NUM_HB      "+
		"       ,NVL(T1.THIS_KD_NUM1,0)   THIS_KD_NUM1                                                         "+
		"       ,NVL(T2.THIS_KD_NUM1,0)   THIS_KD_NUML1                                                        "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM1,0),NVL(T2.THIS_KD_NUM1,0),2)   THIS_KD_NUM_HB1            "+
		"       ,NVL(T1.THIS_KD_NUM,0)   THIS_KD_NUM                                                           "+
		"       ,NVL(T2.THIS_KD_NUM,0)   THIS_KD_NUML                                                          "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM,0),NVL(T2.THIS_KD_NUM,0),2)   THIS_KD_NUM_HB               "+
		"       ,NVL(T1.THIS_ZZX_NUM1,0)   THIS_ZZX_NUM1                                                       "+
		"       ,NVL(T2.THIS_ZZX_NUM1,0)   THIS_ZZX_NUML1                                                      "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM1,0),NVL(T2.THIS_ZZX_NUM1,0),2)   THIS_ZZX_NUM_HB1         "+
		"       ,NVL(T1.THIS_ZZX_NUM,0)   THIS_ZZX_NUM                                                         "+
		"       ,NVL(T2.THIS_ZZX_NUM,0)   THIS_ZZX_NUML                                                        "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM,0),NVL(T2.THIS_ZZX_NUM,0),2)   THIS_ZZX_NUM_HB            "+
		"FROM (                                                                                                "+
		"      SELECT  GROUP_ID_0                                                                              "+
		"             ,GROUP_ID_1                                                                              "+
		"             ,GROUP_ID_1_NAME                                                                         "+
		"             ,UNIT_ID                                                                                 "+
		"             ,UNIT_NAME                                                                               "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                                "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                                "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                             "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                              "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                               "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                              "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                              "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                           "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                            "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                             "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                  "+
		         where+
		"      GROUP BY  GROUP_ID_0                                                                            "+
		"               ,GROUP_ID_1                                                                            "+
		"               ,GROUP_ID_1_NAME                                                                       "+
		"               ,UNIT_ID                                                                               "+
		"               ,UNIT_NAME                                                                             "+
		")T1                                                                                                   "+
		"LEFT JOIN (                                                                                           "+
		"      SELECT  GROUP_ID_0                                                                              "+
		"             ,GROUP_ID_1                                                                              "+
		"             ,GROUP_ID_1_NAME                                                                         "+
		"             ,UNIT_ID                                                                                 "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                                "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                                "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                             "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                              "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                               "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                              "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                              "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                           "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                            "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                             "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                  "+
		        where1+
		"      GROUP BY  GROUP_ID_0                                                                            "+
		"               ,GROUP_ID_1                                                                            "+
		"               ,GROUP_ID_1_NAME                                                                       "+
		"               ,UNIT_ID                                                                               "+
		")T2 ON(T1.UNIT_ID=T2.UNIT_ID)                                                                         ";
	}else{
		return "SELECT                                                                                        "+
		"        T1.HQ_CHAN_CODE ROW_ID                                                                       "+
		"       ,T1.GROUP_ID_4_NAME ROW_NAME                                                                  "+
		"       ,T1.UNIT_ID                                                                                   "+
		"       ,T1.UNIT_NAME                                                                                 "+
		"       ,T1.HQ_CHAN_CODE                                                                              "+
		"       ,T1.GROUP_ID_4_NAME                                                                           "+
		"       ,NVL(T1.THIS_YW_NUM1,0)   THIS_YW_NUM1                                                        "+
		"       ,NVL(T2.THIS_YW_NUM1,0)   THIS_YW_NUML1                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM1,0),NVL(T2.THIS_YW_NUM1,0),2)   THIS_YW_NUM_HB1           "+
		"       ,NVL(T1.THIS_YW_NUM,0)   THIS_YW_NUM                                                          "+
		"       ,NVL(T2.THIS_YW_NUM,0)   THIS_YW_NUML                                                         "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM,0),NVL(T2.THIS_YW_NUM,0),2)   THIS_YW_NUM_HB              "+
		"       ,NVL(T1.THIS_2I2C_NUM1,0)   THIS_2I2C_NUM1                                                    "+
		"       ,NVL(T2.THIS_2I2C_NUM1,0)   THIS_2I2C_NUML1                                                   "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM1,0),NVL(T2.THIS_2I2C_NUM1,0),2)   THIS_2I2C_NUM_HB1     "+
		"       ,NVL(T1.THIS_2I2C_NUM,0)   THIS_2I2C_NUM                                                      "+
		"       ,NVL(T2.THIS_2I2C_NUM,0)   THIS_2I2C_NUML                                                     "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM,0),NVL(T2.THIS_2I2C_NUM,0),2)   THIS_2I2C_NUM_HB        "+
		"       ,NVL(T1.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUM1                                                  "+
		"       ,NVL(T2.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUML1                                                 "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM1,0),NVL(T2.THIS_HYYYK_NUM1,0),2)   THIS_HYYYK_NUM_HB1  "+
		"       ,NVL(T1.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUM                                                    "+
		"       ,NVL(T2.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUML                                                   "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM,0),NVL(T2.THIS_HYYYK_NUM,0),2)   THIS_HYYYK_NUM_HB     "+
		"       ,NVL(T1.THIS_KD_NUM1,0)   THIS_KD_NUM1                                                        "+
		"       ,NVL(T2.THIS_KD_NUM1,0)   THIS_KD_NUML1                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM1,0),NVL(T2.THIS_KD_NUM1,0),2)   THIS_KD_NUM_HB1           "+
		"       ,NVL(T1.THIS_KD_NUM,0)   THIS_KD_NUM                                                          "+
		"       ,NVL(T2.THIS_KD_NUM,0)   THIS_KD_NUML                                                         "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM,0),NVL(T2.THIS_KD_NUM,0),2)   THIS_KD_NUM_HB              "+
		"       ,NVL(T1.THIS_ZZX_NUM1,0)   THIS_ZZX_NUM1                                                      "+
		"       ,NVL(T2.THIS_ZZX_NUM1,0)   THIS_ZZX_NUML1                                                     "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM1,0),NVL(T2.THIS_ZZX_NUM1,0),2)   THIS_ZZX_NUM_HB1        "+
		"       ,NVL(T1.THIS_ZZX_NUM,0)   THIS_ZZX_NUM                                                        "+
		"       ,NVL(T2.THIS_ZZX_NUM,0)   THIS_ZZX_NUML                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM,0),NVL(T2.THIS_ZZX_NUM,0),2)   THIS_ZZX_NUM_HB           "+
		"FROM (                                                                                               "+
		"      SELECT  GROUP_ID_0                                                                             "+
		"             ,GROUP_ID_1                                                                             "+
		"             ,GROUP_ID_1_NAME                                                                        "+
		"             ,UNIT_ID                                                                                "+
		"             ,UNIT_NAME                                                                              "+
		"             ,GROUP_ID_4_NAME                                                                        "+
		"             ,HQ_CHAN_CODE                                                                           "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                               "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                               "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                            "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                             "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                              "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                             "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                             "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                          "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                           "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                            "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                 "+
		     where+
		"      GROUP BY  GROUP_ID_0                                                                           "+
		"               ,GROUP_ID_1                                                                           "+
		"               ,GROUP_ID_1_NAME                                                                      "+
		"               ,UNIT_ID                                                                              "+
		"               ,UNIT_NAME                                                                            "+
		"               ,GROUP_ID_4_NAME                                                                      "+
		"               ,HQ_CHAN_CODE                                                                         "+
		")T1                                                                                                  "+
		"LEFT JOIN (                                                                                          "+
		"      SELECT  GROUP_ID_0                                                                             "+
		"             ,GROUP_ID_1                                                                             "+
		"             ,GROUP_ID_1_NAME                                                                        "+
		"             ,UNIT_ID                                                                                "+
		"             ,HQ_CHAN_CODE                                                                           "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                               "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                               "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                            "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                             "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                              "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                             "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                             "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                          "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                           "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                            "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                 "+
		     where1+
		"      GROUP BY  GROUP_ID_0                                                                           "+
		"               ,GROUP_ID_1                                                                           "+
		"               ,GROUP_ID_1_NAME                                                                      "+
		"               ,UNIT_ID                                                                              "+
		"               ,HQ_CHAN_CODE                                                                         "+
		")T2 ON(T1.HQ_CHAN_CODE=T2.HQ_CHAN_CODE)                                                              ";
	}
  }

	function getDownSql(where,where1){
		return "SELECT                                                                                        "+
		"        T1.GROUP_ID_1_NAME                                                                           "+
		"       ,T1.UNIT_ID                                                                                   "+
		"       ,T1.UNIT_NAME                                                                                 "+
		"       ,T1.HQ_CHAN_CODE                                                                              "+
		"       ,T1.GROUP_ID_4_NAME                                                                           "+
		"       ,NVL(T1.THIS_YW_NUM1,0)   THIS_YW_NUM1                                                        "+
		"       ,NVL(T2.THIS_YW_NUM1,0)   THIS_YW_NUML1                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM1,0),NVL(T2.THIS_YW_NUM1,0),2)   THIS_YW_NUM_HB1           "+
		"       ,NVL(T1.THIS_YW_NUM,0)   THIS_YW_NUM                                                          "+
		"       ,NVL(T2.THIS_YW_NUM,0)   THIS_YW_NUML                                                         "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_YW_NUM,0),NVL(T2.THIS_YW_NUM,0),2)   THIS_YW_NUM_HB              "+
		"       ,NVL(T1.THIS_2I2C_NUM1,0)   THIS_2I2C_NUM1                                                    "+
		"       ,NVL(T2.THIS_2I2C_NUM1,0)   THIS_2I2C_NUML1                                                   "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM1,0),NVL(T2.THIS_2I2C_NUM1,0),2)   THIS_2I2C_NUM_HB1     "+
		"       ,NVL(T1.THIS_2I2C_NUM,0)   THIS_2I2C_NUM                                                      "+
		"       ,NVL(T2.THIS_2I2C_NUM,0)   THIS_2I2C_NUML                                                     "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_2I2C_NUM,0),NVL(T2.THIS_2I2C_NUM,0),2)   THIS_2I2C_NUM_HB        "+
		"       ,NVL(T1.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUM1                                                  "+
		"       ,NVL(T2.THIS_HYYYK_NUM1,0)   THIS_HYYYK_NUML1                                                 "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM1,0),NVL(T2.THIS_HYYYK_NUM1,0),2)   THIS_HYYYK_NUM_HB1  "+
		"       ,NVL(T1.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUM                                                    "+
		"       ,NVL(T2.THIS_HYYYK_NUM,0)   THIS_HYYYK_NUML                                                   "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_HYYYK_NUM,0),NVL(T2.THIS_HYYYK_NUM,0),2)   THIS_HYYYK_NUM_HB     "+
		"       ,NVL(T1.THIS_KD_NUM1,0)   THIS_KD_NUM1                                                        "+
		"       ,NVL(T2.THIS_KD_NUM1,0)   THIS_KD_NUML1                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM1,0),NVL(T2.THIS_KD_NUM1,0),2)   THIS_KD_NUM_HB1           "+
		"       ,NVL(T1.THIS_KD_NUM,0)   THIS_KD_NUM                                                          "+
		"       ,NVL(T2.THIS_KD_NUM,0)   THIS_KD_NUML                                                         "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_KD_NUM,0),NVL(T2.THIS_KD_NUM,0),2)   THIS_KD_NUM_HB              "+
		"       ,NVL(T1.THIS_ZZX_NUM1,0)   THIS_ZZX_NUM1                                                      "+
		"       ,NVL(T2.THIS_ZZX_NUM1,0)   THIS_ZZX_NUML1                                                     "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM1,0),NVL(T2.THIS_ZZX_NUM1,0),2)   THIS_ZZX_NUM_HB1        "+
		"       ,NVL(T1.THIS_ZZX_NUM,0)   THIS_ZZX_NUM                                                        "+
		"       ,NVL(T2.THIS_ZZX_NUM,0)   THIS_ZZX_NUML                                                       "+
		"       ,PMRT.LINK_RATIO(NVL(T1.THIS_ZZX_NUM,0),NVL(T2.THIS_ZZX_NUM,0),2)   THIS_ZZX_NUM_HB           "+
		"FROM (                                                                                               "+
		"      SELECT  GROUP_ID_0                                                                             "+
		"             ,GROUP_ID_1                                                                             "+
		"             ,GROUP_ID_1_NAME                                                                        "+
		"             ,UNIT_ID                                                                                "+
		"             ,UNIT_NAME                                                                              "+
		"             ,GROUP_ID_4_NAME                                                                        "+
		"             ,HQ_CHAN_CODE                                                                           "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                               "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                               "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                            "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                             "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                              "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                             "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                             "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                          "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                           "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                            "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                 "+
		     where+
		"      GROUP BY  GROUP_ID_0                                                                           "+
		"               ,GROUP_ID_1                                                                           "+
		"               ,GROUP_ID_1_NAME                                                                      "+
		"               ,UNIT_ID                                                                              "+
		"               ,UNIT_NAME                                                                            "+
		"               ,GROUP_ID_4_NAME                                                                      "+
		"               ,HQ_CHAN_CODE                                                                         "+
		")T1                                                                                                  "+
		"LEFT JOIN (                                                                                          "+
		"      SELECT  GROUP_ID_0                                                                             "+
		"             ,GROUP_ID_1                                                                             "+
		"             ,GROUP_ID_1_NAME                                                                        "+
		"             ,UNIT_ID                                                                                "+
		"             ,HQ_CHAN_CODE                                                                           "+
		"             ,NVL(SUM(THIS_YW_NUM    ),0)  THIS_YW_NUM                                               "+
		"             ,NVL(SUM(THIS_KD_NUM    ),0)  THIS_KD_NUM                                               "+
		"             ,NVL(SUM(THIS_HYYYK_NUM ),0)  THIS_HYYYK_NUM                                            "+
		"             ,NVL(SUM(THIS_2I2C_NUM  ),0)  THIS_2I2C_NUM                                             "+
		"             ,NVL(SUM(THIS_ZZX_NUM   ),0)  THIS_ZZX_NUM                                              "+
		"             ,NVL(SUM(THIS_YW_NUM1    ),0)  THIS_YW_NUM1                                             "+
		"             ,NVL(SUM(THIS_KD_NUM1    ),0)  THIS_KD_NUM1                                             "+
		"             ,NVL(SUM(THIS_HYYYK_NUM1 ),0)  THIS_HYYYK_NUM1                                          "+
		"             ,NVL(SUM(THIS_2I2C_NUM1  ),0)  THIS_2I2C_NUM1                                           "+
		"             ,NVL(SUM(THIS_ZZX_NUM1   ),0)  THIS_ZZX_NUM1                                            "+
		"      FROM  PMRT.TB_MRT_UNIT_DEV_DAY                                                                 "+
		     where1+
		"      GROUP BY  GROUP_ID_0                                                                           "+
		"               ,GROUP_ID_1                                                                           "+
		"               ,GROUP_ID_1_NAME                                                                      "+
		"               ,UNIT_ID                                                                              "+
		"               ,HQ_CHAN_CODE                                                                         "+
		")T2 ON(T1.HQ_CHAN_CODE=T2.HQ_CHAN_CODE)                                                              ";
	}
	
	function getLastMonth(dealDate){
		var year=dealDate.substr(0,4);
	    var month=dealDate.substr(4,6);
	    if(month=='01'){
	    	return (year-1)+'12';
	    }
	   return dealDate-1;
	}

	function getFristMonth(dealDate){
		var year=dealDate.substr(0,4);
		return year+'01';
	}

	function getLastYearSameMonth(dealDate){
		var year=dealDate.substr(0,4);
	    var month=dealDate.substr(4,6);
	    return (year-1)+month;
	}

	function getLastYearEndMonth(dealDate){
		var year=dealDate.substr(0,4);
		return (year-1)+'12';
	}
