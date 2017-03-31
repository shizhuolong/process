var field=["HQ_CHAN_CODE","OPERATE_TYPE","THIS_2G_INCOME","INCREASE_2G_INCOME","HB_2G","THIS_3G_INCOME","INCREASE_3G_INCOME","HB_3G","THIS_4G_INCOME","INCREASE_4G_INCOME","HB_4G","THIS_NET_INCOME","INCREASE_NET_INCOME","HB_NET","THIS_KD_INCOME","INCREASE_KD_INCOME","HB_KD","THIS_FUSE_INCOME","INCREASE_FUSE_INCOME","HB_FUSE","THIS_ALL_INCOME","INCREASE_ALL_INCOME","HB_ALL"];
var title=[["组织架构","渠道编码","经营模式","2G业务（万元）","","","3G业务（万元）","","","4G业务（万元）","","","固网（万元）","","","其中：宽带（万元）","","","其中：融合（万元）","","","合计（万元）","",""],
           ["","","","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比"]];
var report=null;
var dealDate="";
$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_INCOME_INCREASE_MON"));
	report=new LchReport({
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
			var groupBy='';
			var code='';
			var orgLevel='';
			var level;
			dealDate=$("#dealDate").val();
			var where=" WHERE DEAL_DATE='"+dealDate+"'";
			var where1=" WHERE DEAL_DATE='"+getLastMonth(dealDate)+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=' T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,\'\' HQ_CHAN_CODE,\'\' OPERATE_TYPE,';
					where+=' AND GROUP_ID_0=\''+code+'\'';
					where1+=' AND GROUP_ID_0=\''+code+'\'';
					level=2;
				}else if(orgLevel==3){//点击市
					where+=' AND GROUP_ID_1=\''+code+'\'';
					where1+=' AND GROUP_ID_1=\''+code+'\'';
					level=3;
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' \'云南省 \' ROW_NAME,\'86000\' ROW_ID,\'\' HQ_CHAN_CODE,\'\' OPERATE_TYPE,';
					where+=" AND GROUP_ID_0='"+code+"'";
					where1+=" AND GROUP_ID_0='"+code+"'";
					level=1;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=' T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,\'\' HQ_CHAN_CODE,\'\' OPERATE_TYPE,';
					where+=' AND GROUP_ID_1=\''+code+'\'';
					where1+=' AND GROUP_ID_1=\''+code+'\'';
					orgLevel=2;
					level=2;
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			var sql="";
			if(preField!=""){
				sql='SELECT '+getSql(preField,level,where,where1);
			}else{
				sql=getSql('',level,where,where1);
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
	$("#searchBtn").click(function(){
	    report.showSubRow();
	});
});

function getSql(preField,orgLevel,where,where1) {
	var operateType=$("#operateType").val();
	var regionCode=$("#regionCode").val();
	dealDate=$("#dealDate").val();
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
		where1+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	
	if(orgLevel==1){
	return preField+"       T.THIS_2G_INCOME,                                            "+
	"       T.THIS_2G_INCOME-T1.THIS_2G_INCOME INCREASE_2G_INCOME,                       "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                   "+
	"                      WHEN T1.THIS_2G_INCOME <> 0 THEN                              "+
	"                       (T.THIS_2G_INCOME-T1.THIS_2G_INCOME) * 100 /                 "+
	"                        T1.THIS_2G_INCOME                                           "+
	"                      ELSE                                                          "+
	"                       0                                                            "+
	"                    END,                                                            "+
	"                    'FM99999999990.99')) || '%' HB_2G,                              "+
	"       T.THIS_3G_INCOME,                                                            "+
	"       T.THIS_3G_INCOME-T1.THIS_3G_INCOME INCREASE_3G_INCOME,                       "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                   "+
	"                      WHEN T1.THIS_3G_INCOME <> 0 THEN                              "+
	"                       (T.THIS_3G_INCOME-T1.THIS_3G_INCOME) * 100 /                 "+
	"                        T1.THIS_3G_INCOME                                           "+
	"                      ELSE                                                          "+
	"                       0                                                            "+
	"                    END,                                                            "+
	"                    'FM99999999990.99')) || '%' HB_3G,                              "+
	"       T.THIS_4G_INCOME,                                                            "+
	"       T.THIS_4G_INCOME-T1.THIS_4G_INCOME INCREASE_4G_INCOME,                       "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                   "+
	"                      WHEN T1.THIS_4G_INCOME <> 0 THEN                              "+
	"                       (T.THIS_4G_INCOME-T1.THIS_4G_INCOME) * 100 /                 "+
	"                        T1.THIS_4G_INCOME                                           "+
	"                      ELSE                                                          "+
	"                       0                                                            "+
	"                    END,                                                            "+
	"                    'FM99999999990.99')) || '%' HB_4G,                              "+
	"       T.THIS_NET_INCOME,                                                           "+
	"       T.THIS_NET_INCOME-T1.THIS_NET_INCOME INCREASE_NET_INCOME,                    "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                   "+
	"                      WHEN T1.THIS_NET_INCOME <> 0 THEN                             "+
	"                       (T.THIS_NET_INCOME-T1.THIS_NET_INCOME) * 100 /               "+
	"                        T1.THIS_NET_INCOME                                          "+
	"                      ELSE                                                          "+
	"                       0                                                            "+
	"                    END,                                                            "+
	"                    'FM99999999990.99')) || '%' HB_NET,                             "+
	"       T.THIS_KD_INCOME,                                                            "+
	"       T.THIS_KD_INCOME-T1.THIS_KD_INCOME INCREASE_KD_INCOME,                       "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                   "+
	"                      WHEN T1.THIS_KD_INCOME <> 0 THEN                              "+
	"                       (T.THIS_KD_INCOME-T1.THIS_KD_INCOME) * 100 /                 "+
	"                        T1.THIS_KD_INCOME                                           "+
	"                      ELSE                                                          "+
	"                       0                                                            "+
	"                    END,                                                            "+
	"                    'FM99999999990.99')) || '%' HB_KD,                              "+
	"       T.THIS_FUSE_INCOME,                                                          "+
	"       T.THIS_FUSE_INCOME-T1.THIS_FUSE_INCOME INCREASE_FUSE_INCOME,                 "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                   "+
	"                      WHEN T1.THIS_FUSE_INCOME <> 0 THEN                            "+
	"                       (T.THIS_FUSE_INCOME-T1.THIS_FUSE_INCOME) * 100 /             "+
	"                        T1.THIS_FUSE_INCOME                                         "+
	"                      ELSE                                                          "+
	"                       0                                                            "+
	"                    END,                                                            "+
	"                    'FM99999999990.99')) || '%' HB_FUSE,                            "+
	"       T.THIS_ALL_INCOME,                                                           "+
	"       T.THIS_ALL_INCOME-T1.THIS_ALL_INCOME INCREASE_ALL_INCOME,                    "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                   "+
	"                      WHEN T1.THIS_ALL_INCOME <> 0 THEN                             "+
	"                       (T.THIS_ALL_INCOME-T1.THIS_ALL_INCOME) * 100 /               "+
	"                        T1.THIS_ALL_INCOME                                          "+
	"                      ELSE                                                          "+
	"                       0                                                            "+
	"                    END,                                                            "+
	"                    'FM99999999990.99')) || '%' HB_ALL                              "+
	"  FROM (SELECT GROUP_ID_0,                                                          "+
	"               SUM(NVL(THIS_2G_INCOME, 0)) THIS_2G_INCOME,                          "+
	"               SUM(NVL(THIS_3G_INCOME, 0)) THIS_3G_INCOME,                          "+
	"               SUM(NVL(THIS_4G_INCOME, 0)) THIS_4G_INCOME,                          "+
	"               SUM(NVL(THIS_NET_INCOME, 0)) THIS_NET_INCOME,                        "+
	"               SUM(NVL(THIS_KD_INCOME, 0)) THIS_KD_INCOME,                          "+
	"               SUM(NVL(THIS_FUSE_INCOME, 0)) THIS_FUSE_INCOME,                      "+
	"               SUM(NVL(THIS_ALL_INCOME, 0)) THIS_ALL_INCOME                         "+
	"        FROM PMRT.TB_MRT_BUS_INCOME_INCREASE_MON                                    "+
	            where+
	"        GROUP BY GROUP_ID_0                                                         "+
	"        )T                                                                          "+
	"        LEFT JOIN (SELECT GROUP_ID_0,                                               "+
	"               SUM(NVL(THIS_2G_INCOME, 0)) THIS_2G_INCOME,                          "+
	"               SUM(NVL(THIS_3G_INCOME, 0)) THIS_3G_INCOME,                          "+
	"               SUM(NVL(THIS_4G_INCOME, 0)) THIS_4G_INCOME,                          "+
	"               SUM(NVL(THIS_NET_INCOME, 0)) THIS_NET_INCOME,                        "+
	"               SUM(NVL(THIS_KD_INCOME, 0)) THIS_KD_INCOME,                          "+
	"               SUM(NVL(THIS_FUSE_INCOME, 0)) THIS_FUSE_INCOME,                      "+
	"               SUM(NVL(THIS_ALL_INCOME, 0)) THIS_ALL_INCOME                         "+
	"        FROM PMRT.TB_MRT_BUS_INCOME_INCREASE_MON                                    "+
	            where1+ 
	"        GROUP BY GROUP_ID_0                                                         "+
	"        )T1                                                                         "+
	"        ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                              ";
	}else if(orgLevel==2){
		return preField+"       T.THIS_2G_INCOME,                                      "+
		"       T.THIS_2G_INCOME-T1.THIS_2G_INCOME INCREASE_2G_INCOME,                 "+
		"       TRIM('.' FROM TO_CHAR(CASE                                             "+
		"                      WHEN T1.THIS_2G_INCOME <> 0 THEN                        "+
		"                       (T.THIS_2G_INCOME-T1.THIS_2G_INCOME) * 100 /           "+
		"                        T1.THIS_2G_INCOME                                     "+
		"                      ELSE                                                    "+
		"                       0                                                      "+
		"                    END,                                                      "+
		"                    'FM99999999990.99')) || '%' HB_2G,                        "+
		"       T.THIS_3G_INCOME,                                                      "+
		"       T.THIS_3G_INCOME-T1.THIS_3G_INCOME INCREASE_3G_INCOME,                 "+
		"       TRIM('.' FROM TO_CHAR(CASE                                             "+
		"                      WHEN T1.THIS_3G_INCOME <> 0 THEN                        "+
		"                       (T.THIS_3G_INCOME-T1.THIS_3G_INCOME) * 100 /           "+
		"                        T1.THIS_3G_INCOME                                     "+
		"                      ELSE                                                    "+
		"                       0                                                      "+
		"                    END,                                                      "+
		"                    'FM99999999990.99')) || '%' HB_3G,                        "+
		"       T.THIS_4G_INCOME,                                                      "+
		"       T.THIS_4G_INCOME-T1.THIS_4G_INCOME INCREASE_4G_INCOME,                 "+
		"       TRIM('.' FROM TO_CHAR(CASE                                             "+
		"                      WHEN T1.THIS_4G_INCOME <> 0 THEN                        "+
		"                       (T.THIS_4G_INCOME-T1.THIS_4G_INCOME) * 100 /           "+
		"                        T1.THIS_4G_INCOME                                     "+
		"                      ELSE                                                    "+
		"                       0                                                      "+
		"                    END,                                                      "+
		"                    'FM99999999990.99')) || '%' HB_4G,                        "+
		"       T.THIS_NET_INCOME,                                                     "+
		"       T.THIS_NET_INCOME-T1.THIS_NET_INCOME INCREASE_NET_INCOME,              "+
		"       TRIM('.' FROM TO_CHAR(CASE                                             "+
		"                      WHEN T1.THIS_NET_INCOME <> 0 THEN                       "+
		"                       (T.THIS_NET_INCOME-T1.THIS_NET_INCOME) * 100 /         "+
		"                        T1.THIS_NET_INCOME                                    "+
		"                      ELSE                                                    "+
		"                       0                                                      "+
		"                    END,                                                      "+
		"                    'FM99999999990.99')) || '%' HB_NET,                       "+
		"       T.THIS_KD_INCOME,                                                      "+
		"       T.THIS_KD_INCOME-T1.THIS_KD_INCOME INCREASE_KD_INCOME,                 "+
		"       TRIM('.' FROM TO_CHAR(CASE                                             "+
		"                      WHEN T1.THIS_KD_INCOME <> 0 THEN                        "+
		"                       (T.THIS_KD_INCOME-T1.THIS_KD_INCOME) * 100 /           "+
		"                        T1.THIS_KD_INCOME                                     "+
		"                      ELSE                                                    "+
		"                       0                                                      "+
		"                    END,                                                      "+
		"                    'FM99999999990.99')) || '%' HB_KD,                        "+
		"       T.THIS_FUSE_INCOME,                                                    "+
		"       T.THIS_FUSE_INCOME-T1.THIS_FUSE_INCOME INCREASE_FUSE_INCOME,           "+
		"       TRIM('.' FROM TO_CHAR(CASE                                             "+
		"                      WHEN T1.THIS_FUSE_INCOME <> 0 THEN                      "+
		"                       (T.THIS_FUSE_INCOME-T1.THIS_FUSE_INCOME) * 100 /       "+
		"                        T1.THIS_FUSE_INCOME                                   "+
		"                      ELSE                                                    "+
		"                       0                                                      "+
		"                    END,                                                      "+
		"                    'FM99999999990.99')) || '%' HB_FUSE,                      "+
		"       T.THIS_ALL_INCOME,                                                     "+
		"       T.THIS_ALL_INCOME-T1.THIS_ALL_INCOME INCREASE_ALL_INCOME,              "+
		"       TRIM('.' FROM TO_CHAR(CASE                                             "+
		"                      WHEN T1.THIS_ALL_INCOME <> 0 THEN                       "+
		"                       (T.THIS_ALL_INCOME-T1.THIS_ALL_INCOME) * 100 /         "+
		"                        T1.THIS_ALL_INCOME                                    "+
		"                      ELSE                                                    "+
		"                       0                                                      "+
		"                    END,                                                      "+
		"                    'FM99999999990.99')) || '%' HB_ALL                        "+
		"  FROM (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                         "+
		"               SUM(NVL(THIS_2G_INCOME, 0)) THIS_2G_INCOME,                    "+
		"               SUM(NVL(THIS_3G_INCOME, 0)) THIS_3G_INCOME,                    "+
		"               SUM(NVL(THIS_4G_INCOME, 0)) THIS_4G_INCOME,                    "+
		"               SUM(NVL(THIS_NET_INCOME, 0)) THIS_NET_INCOME,                  "+
		"               SUM(NVL(THIS_KD_INCOME, 0)) THIS_KD_INCOME,                    "+
		"               SUM(NVL(THIS_FUSE_INCOME, 0)) THIS_FUSE_INCOME,                "+
		"               SUM(NVL(THIS_ALL_INCOME, 0)) THIS_ALL_INCOME                   "+
		"        FROM PMRT.TB_MRT_BUS_INCOME_INCREASE_MON                              "+
		                     where+                                                    
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                        "+
		"        )T                                                                    "+
		"        LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,              "+
		"               SUM(NVL(THIS_2G_INCOME, 0)) THIS_2G_INCOME,                    "+
		"               SUM(NVL(THIS_3G_INCOME, 0)) THIS_3G_INCOME,                    "+
		"               SUM(NVL(THIS_4G_INCOME, 0)) THIS_4G_INCOME,                    "+
		"               SUM(NVL(THIS_NET_INCOME, 0)) THIS_NET_INCOME,                  "+
		"               SUM(NVL(THIS_KD_INCOME, 0)) THIS_KD_INCOME,                    "+
		"               SUM(NVL(THIS_FUSE_INCOME, 0)) THIS_FUSE_INCOME,                "+
		"               SUM(NVL(THIS_ALL_INCOME, 0)) THIS_ALL_INCOME                   "+
		"        FROM PMRT.TB_MRT_BUS_INCOME_INCREASE_MON                              "+
		                     where1+                                                    
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                        "+
		"        )T1                                                                   "+
		"        ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                        ";
	}else{
		return "SELECT T.GROUP_ID_1_NAME,                                                     "+
		"       T.BUS_NAME ROW_NAME，                                                                                                                                                                            "+
		"       T.HQ_CHAN_CODE,                                                               "+
		"       '--' OPERATE_TYPE,                                                            "+
		"       T.THIS_2G_INCOME,                                                             "+
		"       T.THIS_2G_INCOME-T1.THIS_2G_INCOME INCREASE_2G_INCOME,                        "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                    "+
		"                      WHEN T1.THIS_2G_INCOME <> 0 THEN                               "+
		"                       (T.THIS_2G_INCOME-T1.THIS_2G_INCOME) * 100 /                  "+
		"                        T1.THIS_2G_INCOME                                            "+
		"                      ELSE                                                           "+
		"                       0                                                             "+
		"                    END,                                                             "+
		"                    'FM99999999990.99')) || '%' HB_2G,                               "+
		"       T.THIS_3G_INCOME,                                                             "+
		"       T.THIS_3G_INCOME-T1.THIS_3G_INCOME INCREASE_3G_INCOME,                        "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                    "+
		"                      WHEN T1.THIS_3G_INCOME <> 0 THEN                               "+
		"                       (T.THIS_3G_INCOME-T1.THIS_3G_INCOME) * 100 /                  "+
		"                        T1.THIS_3G_INCOME                                            "+
		"                      ELSE                                                           "+
		"                       0                                                             "+
		"                    END,                                                             "+
		"                    'FM99999999990.99')) || '%' HB_3G,                               "+
		"       T.THIS_4G_INCOME,                                                             "+
		"       T.THIS_4G_INCOME-T1.THIS_4G_INCOME INCREASE_4G_INCOME,                        "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                    "+
		"                      WHEN T1.THIS_4G_INCOME <> 0 THEN                               "+
		"                       (T.THIS_4G_INCOME-T1.THIS_4G_INCOME) * 100 /                  "+
		"                        T1.THIS_4G_INCOME                                            "+
		"                      ELSE                                                           "+
		"                       0                                                             "+
		"                    END,                                                             "+
		"                    'FM99999999990.99')) || '%' HB_4G,                               "+
		"       T.THIS_NET_INCOME,                                                            "+
		"       T.THIS_NET_INCOME-T1.THIS_NET_INCOME INCREASE_NET_INCOME,                     "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                    "+
		"                      WHEN T1.THIS_NET_INCOME <> 0 THEN                              "+
		"                       (T.THIS_NET_INCOME-T1.THIS_NET_INCOME) * 100 /                "+
		"                        T1.THIS_NET_INCOME                                           "+
		"                      ELSE                                                           "+
		"                       0                                                             "+
		"                    END,                                                             "+
		"                    'FM99999999990.99')) || '%' HB_NET,                              "+
		"       T.THIS_KD_INCOME,                                                             "+
		"       T.THIS_KD_INCOME-T1.THIS_KD_INCOME INCREASE_KD_INCOME,                        "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                    "+
		"                      WHEN T1.THIS_KD_INCOME <> 0 THEN                               "+
		"                       (T.THIS_KD_INCOME-T1.THIS_KD_INCOME) * 100 /                  "+
		"                        T1.THIS_KD_INCOME                                            "+
		"                      ELSE                                                           "+
		"                       0                                                             "+
		"                    END,                                                             "+
		"                    'FM99999999990.99')) || '%' HB_KD,                               "+
		"       T.THIS_FUSE_INCOME,                                                           "+
		"       T.THIS_FUSE_INCOME-T1.THIS_FUSE_INCOME INCREASE_FUSE_INCOME,                  "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                    "+
		"                      WHEN T1.THIS_FUSE_INCOME <> 0 THEN                             "+
		"                       (T.THIS_FUSE_INCOME-T1.THIS_FUSE_INCOME) * 100 /              "+
		"                        T1.THIS_FUSE_INCOME                                          "+
		"                      ELSE                                                           "+
		"                       0                                                             "+
		"                    END,                                                             "+
		"                    'FM99999999990.99')) || '%' HB_FUSE,                             "+
		"       T.THIS_ALL_INCOME,                                                            "+
		"       T.THIS_ALL_INCOME-T1.THIS_ALL_INCOME INCREASE_ALL_INCOME,                     "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                    "+
		"                      WHEN T1.THIS_ALL_INCOME <> 0 THEN                              "+
		"                       (T.THIS_ALL_INCOME-T1.THIS_ALL_INCOME) * 100 /                "+
		"                        T1.THIS_ALL_INCOME                                           "+
		"                      ELSE                                                           "+
		"                       0                                                             "+
		"                    END,                                                             "+
		"                    'FM99999999990.99')) || '%' HB_ALL                               "+
		"  FROM (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,BUS_NAME,          "+
		"               SUM(NVL(THIS_2G_INCOME, 0)) THIS_2G_INCOME,                           "+
		"               SUM(NVL(THIS_3G_INCOME, 0)) THIS_3G_INCOME,                           "+
		"               SUM(NVL(THIS_4G_INCOME, 0)) THIS_4G_INCOME,                           "+
		"               SUM(NVL(THIS_NET_INCOME, 0)) THIS_NET_INCOME,                         "+
		"               SUM(NVL(THIS_KD_INCOME, 0)) THIS_KD_INCOME,                           "+
		"               SUM(NVL(THIS_FUSE_INCOME, 0)) THIS_FUSE_INCOME,                       "+
		"               SUM(NVL(THIS_ALL_INCOME, 0)) THIS_ALL_INCOME                          "+
		"        FROM PMRT.TB_MRT_BUS_INCOME_INCREASE_MON                                     "+
		            where+ 
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,BUS_NAME         "+
		"        )T                                                                           "+
		"        LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,BUS_NAME,            "+
		"               SUM(NVL(THIS_2G_INCOME, 0)) THIS_2G_INCOME,                           "+
		"               SUM(NVL(THIS_3G_INCOME, 0)) THIS_3G_INCOME,                           "+
		"               SUM(NVL(THIS_4G_INCOME, 0)) THIS_4G_INCOME,                           "+
		"               SUM(NVL(THIS_NET_INCOME, 0)) THIS_NET_INCOME,                         "+
		"               SUM(NVL(THIS_KD_INCOME, 0)) THIS_KD_INCOME,                           "+
		"               SUM(NVL(THIS_FUSE_INCOME, 0)) THIS_FUSE_INCOME,                       "+
		"               SUM(NVL(THIS_ALL_INCOME, 0)) THIS_ALL_INCOME                          "+
		"        FROM PMRT.TB_MRT_BUS_INCOME_INCREASE_MON                                     "+
		            where+ 
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,BUS_NAME         "+
		"        )T1                                                                          "+
		"        ON(T.BUS_NAME = T1.BUS_NAME)                                               ";
	}
  }

function downsAll() {
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var region=$("#region").val();
	var orgLevel = $("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	if (orgLevel == 1) {//省
		where += " AND GROUP_ID_0='" + code + "' ";
	} else {//市
		where += " AND GROUP_ID_1='" + region + "' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	var sql = getSql('',3,where);
	var showtext = '出帐收入净增统计月报表' + dealDate;
	var title=[["地市","营业厅名称","渠道编码","经营模式","2G业务（万元）","","","3G业务（万元）","","","4G业务（万元）","","","固网（万元）","","","其中：宽带（万元）","","","其中：融合（万元）","","","合计（万元）","",""],
	           ["","","","","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比","出帐收入","较上月净增","环比"]];
	downloadExcel(sql,title,showtext);
}
function getLastMonth(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    if(month=='01'){
    	return (year-1)+'12';
    }
   return dealDate-1;
}