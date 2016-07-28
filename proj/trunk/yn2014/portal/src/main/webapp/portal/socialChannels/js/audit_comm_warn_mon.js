var field=["TOTAL_DEV","TOTAL_DEV_EFF","TOTAL_JT","TOTAL_XH","TOTAL_SW","TOTAL_JD","LESS_96_DEV","LESS_96_DEV_EFF","LESS_96_JT","LESS_96_XH","LESS_96_SW","LESS_96_JD","MORE_96_DEV","MORE_96_DEV_EFF","MORE_96_JT","MORE_96_XH","MORE_96_SW","MORE_96_JD"];
var title=[["组织架构","发展质量总表","","","","","","96以下套餐发展质量","","","","","","96以上套餐发展质量","","","","",""],
           ["","成功参与活动量","有效率","降套","销户","三无","极低","成功参与活动量","有效率","降套","销户","三无","极低","成功参与活动量","有效率","降套","销户","三无","极低"]];
var report=null;
var qdate="";
var orderBy="";
$(function(){
	 listRegions();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		/*lock:1,*/
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
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
			var where=' WHERE 1 = 1';
			var groupBy='';
			var code='';
			var orgLevel='';
			var order='';
			qdate = $("#mon").val();
			var startDevMonth = $("#startDevMonth").val();
			var endDevMonth = $("#endDevMonth").val();
			var regionName=$("#regionName").val();
			var unitName=$("#unitName").val();
			var unit_id_3_name=$.trim($("#unit_id_3_name").val());
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel>4){//发展人级别
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel>4){//发展人级别
					return {data:[],extra:{}};
				}
			}	
			orgLevel++;
			//权限
			where+=" AND UNIT_ID_"+(orgLevel-2)+"='"+code+"'";
			where+=" AND DEAL_DATE='"+qdate+"'";
			if(regionName!=''){
				where+=" AND UNIT_ID_1_NAME = '"+regionName+"'";
			}
			if(unitName!=''){
				where+=" AND UNIT_ID_2_NAME = '"+unitName+"'";
			}
			if(unit_id_3_name!=''){
				where+=" AND UNIT_ID_3_NAME LIKE '%"+unit_id_3_name+"%'";
			}
			if(startDevMonth!="" && (endDevMonth!="")){
				where+=" AND DEV_DATE BETWEEN "+startDevMonth+" AND "+endDevMonth;
			}else if(startDevMonth!="" && (endDevMonth=="")){
				where+=" AND DEV_DATE BETWEEN "+startDevMonth+" AND "+qdate;
			}else if(startDevMonth=="" && (endDevMonth!="")){
				where+=" AND DEV_DATE BETWEEN 0 "+ " AND "+endDevMonth;
			}else{
				
			}
			var sql =getSql(orgLevel,where);
			if(orderBy!=''){
				sql="select * from( "+sql+") "+orderBy;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
	});
	$("#remark").click(function(){
		$("#remarkDiv").show();
		$("#remarkDiv").dialog({
			title : '备注',
			width : 600,
			height : 350,
			closed : false,
			cache : false,
			modal : false,
			maximizable : true
		});
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var where=' WHERE 1 = 1';
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var unit_id_3_name=$.trim($("#unit_id_3_name").val());
	var startDevMonth = $("#startDevMonth").val();
	var endDevMonth = $("#endDevMonth").val();	
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	where+=" AND UNIT_ID_"+(orgLevel-1)+"='"+code+"'";
	where+=" AND DEAL_DATE='"+qdate+"'";
	if(regionName!=''){
		where+=" AND UNIT_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		where+=" AND UNIT_ID_2_NAME = '"+unitName+"'";
	}
	if(unit_id_3_name!=''){
		where+=" AND UNIT_ID_3_NAME LIKE '%"+unit_id_3_name+"%'";
	}
	if(startDevMonth!="" && (endDevMonth!="")){
		where+=" AND DEV_DATE BETWEEN "+startDevMonth+" AND "+endDevMonth;
	}else if(startDevMonth!="" && (endDevMonth=="")){
		where+=" AND DEV_DATE BETWEEN "+startDevMonth+" AND "+qdate;
	}else if(startDevMonth=="" && (endDevMonth!="")){
		where+=" AND DEV_DATE BETWEEN 0 "+ " AND "+endDevMonth;
	}else{
		
	}
	var sql =  getDownSql(where);
	showtext = '月预警报表' + qdate;
	var title=[["账期","地市","营服","网点","渠道编码","姓名","发展人编码","发展质量总表","","","","","","96以下套餐发展质量","","","","","","96以上套餐发展质量","","","","",""],
	           ["","","","","","","","成功参与活动量","有效率","降套","销户","三无","极低","成功参与活动量","有效率","降套","销户","三无","极低","成功参与活动量","有效率","降套","销户","三无","极低"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function listRegions(){
	var sql="";
	//条件
	var sql = "SELECT DISTINCT T.UNIT_ID_1_NAME FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_MON t where 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	sql+=" AND UNIT_ID_"+(orgLevel-1)+"='"+code+"'";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID_1_NAME
					+ '" selected >'
					+ d[0].UNIT_ID_1_NAME + '</option>';
			listUnits(d[0].UNIT_ID_1_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID_1_NAME + '">' + d[i].UNIT_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}
function listUnits(regionName){
	var $unit=$("#unitName");
	var sql = "SELECT DISTINCT T.UNIT_ID_2_NAME FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_MON t where 1=1 ";
	if(regionName!=''){
		sql+=" AND t.UNIT_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		sql+=" AND UNIT_ID_"+(orgLevel-1)+"='"+code+"'";
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID_2_NAME
					+ '" selected >'
					+ d[0].UNIT_ID_2_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID_2_NAME + '">' + d[i].UNIT_ID_2_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}
function getSql(orgLevel,where){
	var	fs = "SELECT UNIT_ID_"+(orgLevel-1)+" ROW_ID,UNIT_ID_"+(orgLevel-1)+"_NAME ROW_NAME                                                                         "+
	"      ,NVL(TOTAL_DEV,0) TOTAL_DEV                                                                                                                              "+
    "      ,CASE WHEN NVL(TOTAL_DEV,0)=0 THEN '-'                                                                                                                   "+
	"       ELSE ROUND((NVL(TOTAL_DEV,0)-NVL(TOTAL_EFFECTIVE,0))*100/NVL(TOTAL_DEV,0),2) ||'%' END TOTAL_DEV_EFF                                                    "+
	"      ,NVL(TOTAL_JT,0)  TOTAL_JT                                                                                                                               "+
	"      ,NVL(TOTAL_XH,0)  TOTAL_XH                                                                                                                               "+
	"      ,NVL(TOTAL_SW,0)  TOTAL_SW                                                                                                                               "+
	"      ,NVL(TOTAL_JD,0)  TOTAL_JD                                                                                                                               "+
	"      ,NVL(LESS_96_DEV,0) LESS_96_DEV                                                                                                                          "+
	"      ,CASE WHEN NVL(LESS_96_DEV,0)=0 THEN '-'                                                                                                                 "+
	"       ELSE ROUND((NVL(LESS_96_DEV,0)-NVL(LESS_96_EFFECTIVE,0))*100/NVL(LESS_96_DEV,0),2) ||'%' END LESS_96_DEV_EFF                                            "+
	"      ,NVL(LESS_96_JT,0)  LESS_96_JT                                                                                                                           "+
	"      ,NVL(LESS_96_XH,0)  LESS_96_XH                                                                                                                           "+
	"      ,NVL(LESS_96_SW,0)  LESS_96_SW                                                                                                                           "+
	"      ,NVL(LESS_96_JD,0)  LESS_96_JD                                                                                                                           "+
	"      ,NVL(MORE_96_DEV,0) MORE_96_DEV                                                                                                                          "+
	"      ,CASE WHEN NVL(MORE_96_DEV,0)=0 THEN '-'                                                                                                                 "+
	"       ELSE ROUND((NVL(MORE_96_DEV,0)-NVL(MORE_96_EFFECTIVE,0))*100/NVL(MORE_96_DEV,0),2) ||'%' END MORE_96_DEV_EFF                                            "+
	"      ,NVL(MORE_96_JT,0)  MORE_96_JT                                                                                                                           "+
	"      ,NVL(MORE_96_XH,0)  MORE_96_XH                                                                                                                           "+
	"      ,NVL(MORE_96_SW,0)  MORE_96_SW                                                                                                                           "+
	"      ,NVL(MORE_96_JD,0)  MORE_96_JD                                                                                                                           "+
		"FROM(                                                                                                                                                          "+
		"     SELECT UNIT_ID_"+(orgLevel-1)+",UNIT_ID_"+(orgLevel-1)+"_NAME                                                                                             "+
		"           ,COUNT(NUMBER_USER_ID) TOTAL_DEV                                                                                                                    "+
		"           ,COUNT(CASE WHEN IS_JT=1 THEN NUMBER_USER_ID END ) TOTAL_JT                                                                                         "+
		"           ,COUNT(CASE WHEN IS_XH=1 THEN NUMBER_USER_ID END ) TOTAL_XH                                                                                         "+
		"           ,COUNT(CASE WHEN IS_SW=1 THEN NUMBER_USER_ID END ) TOTAL_SW                                                                                         "+
		"           ,COUNT(CASE WHEN IS_JD=1 THEN NUMBER_USER_ID END ) TOTAL_JD                                                                                         "+
		"           ,COUNT(DISTINCT(CASE WHEN IS_JT=1 OR IS_XH=1 OR IS_SW=1 OR IS_JD=1 THEN NUMBER_USER_ID END)) TOTAL_EFFECTIVE                                        "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT<96 THEN NUMBER_USER_ID END) LESS_96_DEV                                                                               "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_JT=1 THEN NUMBER_USER_ID END ) LESS_96_JT                                                                   "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_XH=1 THEN NUMBER_USER_ID END ) LESS_96_XH                                                                   "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_SW=1 THEN NUMBER_USER_ID END ) LESS_96_SW                                                                   "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_JD=1 THEN NUMBER_USER_ID END ) LESS_96_JD                                                                   "+
		"           ,COUNT(DISTINCT(CASE WHEN PRODUCT_RENT<96 AND (IS_JT=1 OR IS_XH=1 OR IS_SW=1 OR IS_JD=1) THEN NUMBER_USER_ID END)) LESS_96_EFFECTIVE                "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 THEN NUMBER_USER_ID END) MORE_96_DEV                                                                              "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_JT=1 THEN NUMBER_USER_ID END ) MORE_96_JT                                                                  "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_XH=1 THEN NUMBER_USER_ID END ) MORE_96_XH                                                                  "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_SW=1 THEN NUMBER_USER_ID END ) MORE_96_SW                                                                  "+
		"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_JD=1 THEN NUMBER_USER_ID END ) MORE_96_JD                                                                  "+
		"           ,COUNT(DISTINCT(CASE WHEN PRODUCT_RENT>=96 AND (IS_JT=1 OR IS_XH=1 OR IS_SW=1 OR IS_JD=1) THEN NUMBER_USER_ID END)) MORE_96_EFFECTIVE               "+
		"           FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_MON "+where                                                                                                        +
		"           GROUP BY UNIT_ID_"+(orgLevel-1)+",UNIT_ID_"+(orgLevel-1)+"_NAME                                                                                     "+                                      
		") ORDER BY UNIT_ID_"+(orgLevel-1);                                                                                                                            
    return fs;
}

function getDownSql(where){
	var	fs = "SELECT DEAL_DATE,UNIT_ID_1_NAME,UNIT_ID_2_NAME,UNIT_ID_3_NAME,CHNL_CODE,UNIT_ID_4_NAME,UNIT_ID_4                                                          "+
	"      ,NVL(TOTAL_DEV,0) TOTAL_DEV                                                                                                                              "+
    "      ,CASE WHEN NVL(TOTAL_DEV,0)=0 THEN '-'                                                                                                                   "+
	"       ELSE ROUND((NVL(TOTAL_DEV,0)-NVL(TOTAL_EFFECTIVE,0))*100/NVL(TOTAL_DEV,0),2) ||'%' END TOTAL_DEV_EFF                                                    "+
	"      ,NVL(TOTAL_JT,0)  TOTAL_JT                                                                                                                               "+
	"      ,NVL(TOTAL_XH,0)  TOTAL_XH                                                                                                                               "+
	"      ,NVL(TOTAL_SW,0)  TOTAL_SW                                                                                                                               "+
	"      ,NVL(TOTAL_JD,0)  TOTAL_JD                                                                                                                               "+
	"      ,NVL(LESS_96_DEV,0) LESS_96_DEV                                                                                                                          "+
	"      ,CASE WHEN NVL(LESS_96_DEV,0)=0 THEN '-'                                                                                                                 "+
	"       ELSE ROUND((NVL(LESS_96_DEV,0)-NVL(LESS_96_EFFECTIVE,0))*100/NVL(LESS_96_DEV,0),2) ||'%' END LESS_96_DEV_EFF                                            "+
	"      ,NVL(LESS_96_JT,0)  LESS_96_JT                                                                                                                           "+
	"      ,NVL(LESS_96_XH,0)  LESS_96_XH                                                                                                                           "+
	"      ,NVL(LESS_96_SW,0)  LESS_96_SW                                                                                                                           "+
	"      ,NVL(LESS_96_JD,0)  LESS_96_JD                                                                                                                           "+
	"      ,NVL(MORE_96_DEV,0) MORE_96_DEV                                                                                                                          "+
	"      ,CASE WHEN NVL(MORE_96_DEV,0)=0 THEN '-'                                                                                                                 "+
	"       ELSE ROUND((NVL(MORE_96_DEV,0)-NVL(MORE_96_EFFECTIVE,0))*100/NVL(MORE_96_DEV,0),2) ||'%' END MORE_96_DEV_EFF                                            "+
	"      ,NVL(MORE_96_JT,0)  MORE_96_JT                                                                                                                           "+
	"      ,NVL(MORE_96_XH,0)  MORE_96_XH                                                                                                                           "+
	"      ,NVL(MORE_96_SW,0)  MORE_96_SW                                                                                                                           "+
	"      ,NVL(MORE_96_JD,0)  MORE_96_JD                                                                                                                           "+
	"FROM(                                                                                                                                                          "+
	"     SELECT DEAL_DATE,UNIT_ID_1,UNIT_ID_1_NAME,UNIT_ID_2,UNIT_ID_2_NAME,UNIT_ID_3,UNIT_ID_3_NAME,CHNL_CODE,UNIT_ID_4,UNIT_ID_4_NAME                            "+
	"           ,COUNT(NUMBER_USER_ID) TOTAL_DEV                                                                                                                    "+
	"           ,COUNT(CASE WHEN IS_JT=1 THEN NUMBER_USER_ID END ) TOTAL_JT                                                                                         "+
	"           ,COUNT(CASE WHEN IS_XH=1 THEN NUMBER_USER_ID END ) TOTAL_XH                                                                                         "+
	"           ,COUNT(CASE WHEN IS_SW=1 THEN NUMBER_USER_ID END ) TOTAL_SW                                                                                         "+
	"           ,COUNT(CASE WHEN IS_JD=1 THEN NUMBER_USER_ID END ) TOTAL_JD                                                                                         "+
	"           ,COUNT(DISTINCT(CASE WHEN IS_JT=1 OR IS_XH=1 OR IS_SW=1 OR IS_JD=1 THEN NUMBER_USER_ID END)) TOTAL_EFFECTIVE                                        "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT<96 THEN NUMBER_USER_ID END) LESS_96_DEV                                                                               "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_JT=1 THEN NUMBER_USER_ID END ) LESS_96_JT                                                                   "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_XH=1 THEN NUMBER_USER_ID END ) LESS_96_XH                                                                   "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_SW=1 THEN NUMBER_USER_ID END ) LESS_96_SW                                                                   "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT<96 AND IS_JD=1 THEN NUMBER_USER_ID END ) LESS_96_JD                                                                   "+
	"           ,COUNT(DISTINCT(CASE WHEN PRODUCT_RENT<96 AND (IS_JT=1 OR IS_XH=1 OR IS_SW=1 OR IS_JD=1) THEN NUMBER_USER_ID END)) LESS_96_EFFECTIVE                "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 THEN NUMBER_USER_ID END) MORE_96_DEV                                                                              "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_JT=1 THEN NUMBER_USER_ID END ) MORE_96_JT                                                                  "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_XH=1 THEN NUMBER_USER_ID END ) MORE_96_XH                                                                  "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_SW=1 THEN NUMBER_USER_ID END ) MORE_96_SW                                                                  "+
	"           ,COUNT(CASE WHEN PRODUCT_RENT>=96 AND IS_JD=1 THEN NUMBER_USER_ID END ) MORE_96_JD                                                                  "+
	"           ,COUNT(DISTINCT(CASE WHEN PRODUCT_RENT>=96 AND (IS_JT=1 OR IS_XH=1 OR IS_SW=1 OR IS_JD=1) THEN NUMBER_USER_ID END)) MORE_96_EFFECTIVE               "+
	"           FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_MON "+where                                                                                                        +
	"           GROUP BY DEAL_DATE,UNIT_ID_1,UNIT_ID_1_NAME,UNIT_ID_2,UNIT_ID_2_NAME,UNIT_ID_3,UNIT_ID_3_NAME,CHNL_CODE,UNIT_ID_4,UNIT_ID_4_NAME                                                            "+                                      
	") ORDER BY UNIT_ID_1,UNIT_ID_2,UNIT_ID_3,CHNL_CODE,UNIT_ID_4                                                                                                   ";
    return fs;
}