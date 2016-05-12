var field=["CURDAY_DEVE_DRQPQS","CURDAY_DEVE_NUM","CURDAY_DEVE_HB","CURDAY_DEVE_LASTAVG","CURDAY_DEVE_3MON","CURDAY_DEVE_HALFYEAR","LESS_96_DRQPQS","LESS_96_NUM","LESS_96_HB","LESS_96_LASTAVG","LESS_96_3MON","LESS_96_HALFYEAR","MORE_96_DRQPQS","MORE_96_NUM","MORE_96_HB","MORE_96_LASTAVG","MORE_96_3MON","MORE_96_HALFYEAR"];
var title=[["组织架构","当日发展情况","","","","","","当日96以下套餐发展情况","","","","","","当日96以上套餐发展情况","","","","",""],
           ["","当日全盘趋势","发展量","日环比","上月平均变化","近三月日平均变化","近半年日平均变化","当日全盘趋势","发展量","日环比","上月平均变化","近三月日平均变化","近半年日平均变化","当日全盘趋势","发展量","日环比","上月平均变化","近三月日平均变化","近半年日平均变化"]];
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
			var preField='';
			var where=' WHERE 1 = 1';
			var groupBy='';
			var code='';
			var orgLevel='';
			qdate = $("#day").val();
			var regionName=$("#regionName").val();
			var unitName=$("#unitName").val();
			var unit_id_3_name=$.trim($("#unit_id_3_name").val());
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=" T.UNIT_ID_2_NAME ROW_NAME,T.UNIT_ID_2 ROW_ID,";
					groupBy=" GROUP BY T.UNIT_ID_2,T.UNIT_ID_2_NAME,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
					where+=" AND T.UNIT_ID_1='"+code+"'";
				}else if(orgLevel==3){
					preField=" T.UNIT_ID_3_NAME ROW_NAME,T.UNIT_ID_3 ROW_ID,";
					groupBy=" GROUP BY T.UNIT_ID_3,T.UNIT_ID_3_NAME,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
					where+=" AND T.UNIT_ID_2='"+code+"'";
				}else if(orgLevel==4){
					preField=" T.UNIT_ID_4_NAME ROW_NAME,T.UNIT_ID_4 ROW_ID,";
					groupBy=" GROUP BY T.UNIT_ID_4,T.UNIT_ID_4_NAME,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
					where+=" AND T.UNIT_ID_3='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示地市
					preField=" T.UNIT_ID_1_NAME ROW_NAME,T.UNIT_ID_1 ROW_ID,";
					groupBy=" GROUP BY T.UNIT_ID_1,T.UNIT_ID_1_NAME,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
				}else if(orgLevel==2){//市
					preField=" T.UNIT_ID_1_NAME ROW_NAME,T.UNIT_ID_1 ROW_ID,";
					groupBy=" GROUP BY T.UNIT_ID_1,T.UNIT_ID_1_NAME,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
					where+=" AND T.UNIT_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心
					preField=" T.UNIT_ID_2_NAME ROW_NAME,T.UNIT_ID_2 ROW_ID,";
					groupBy=" GROUP BY T.UNIT_ID_2,T.UNIT_ID_2_NAME,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
					where+=" AND T.UNIT_ID_2='"+code+"'";
				}else if(orgLevel==4){//网点
					preField=" T.UNIT_ID_3_NAME ROW_NAME,T.UNIT_ID_3 ROW_ID,";
					groupBy=" GROUP BY T.UNIT_ID_3,T.UNIT_ID_3_NAME,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
					where+=" AND T.UNIT_ID_3='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			where+=" AND T.DEAL_DATE='"+qdate+"'";
			if(regionName!=''){
				where+=" AND UNIT_ID_1_NAME = '"+regionName+"'";
			}
			if(unitName!=''){
				where+=" AND UNIT_ID_2_NAME = '"+unitName+"'";
			}
			if(unit_id_3_name!=''){
				where+=" AND T.UNIT_ID_3_NAME LIKE '%"+unit_id_3_name+"%'";
			}
			var sql='SELECT '+preField+getSumField()+where+groupBy;
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		$(".page_count").width($("#lch_DataHead").width());
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var preField=' T.DEAL_DATE,UNIT_ID_1_NAME,UNIT_ID_2_NAME,T.UNIT_ID_3_NAME,T.UNIT_ID_4_NAME,T.CHNL_CODE,';
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY T.UNIT_ID_1,T.UNIT_ID_2,T.UNIT_ID_3,T.UNIT_ID_4";
	var groupBy=" GROUP BY T.DEAL_DATE,T.UNIT_ID_1,T.UNIT_ID_1_NAME,T.UNIT_ID_2,T.UNIT_ID_2_NAME,T.UNIT_ID_3,T.UNIT_ID_3_NAME,T.UNIT_ID_4,T.UNIT_ID_4_NAME,T.CHNL_CODE,T.CURDAY_DEVE_DRQPQS,T.LESS_96_DRQPQS,T.MORE_96_DRQPQS";
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var unit_id_3_name=$.trim($("#unit_id_3_name").val());
	var fieldSql=getSumField();
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND T.UNIT_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where += " AND T.UNIT_ID_2='" + code + "' ";
	} else if (orgLevel == 4) {//网点
		where += " AND T.UNIT_ID_3='" + code + "' ";
	}
	where+=" AND T.DEAL_DATE='"+qdate+"'";
	if(regionName!=''){
		where+=" AND T.UNIT_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		where+=" AND T.UNIT_ID_2_NAME = '"+unitName+"'";
	}
	if(unit_id_3_name!=''){
		where+=" AND T.UNIT_ID_3_NAME LIKE '%"+unit_id_3_name+"%'";
	}
	var sql = 'SELECT ' + preField + fieldSql+where+groupBy+orderBy;
	showtext = '日预警报表' + qdate;
	var title=[["日期","地市","营服","网点","发展人","渠道编码","当日发展情况","","","","","","当日96以下套餐发展情况","","","","","","当日96以上套餐发展情况","","","","",""],
	           ["","","","","","","当日全盘趋势","发展量","日环比","上月平均变化","近三月日平均变化","近半年日平均变化","当日全盘趋势","发展量","日环比","上月平均变化","近三月日平均变化","近半年日平均变化","当日全盘趋势","发展量","日环比","上月平均变化","近三月日平均变化","近半年日平均变化"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function listRegions(){
	var sql="";
	//条件
	var sql = "SELECT DISTINCT T.UNIT_ID_1_NAME FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_DAY t where 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.UNIT_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID_2='"+code+"'";
	}else{
		sql+=" and 1=2 ";
	}
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
	var sql = "SELECT DISTINCT T.UNIT_ID_2_NAME FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_DAY t where 1=1 ";
	if(regionName!=''){
		sql+=" AND t.UNIT_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" AND t.UNIT_ID_1='"+code+"'";
		}else if(orgLevel==3){
			sql+=" AND t.UNIT_ID='"+code+"'";
		}else{
			sql+=" AND 1=2";
		}
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
function getSumField(){
	var fs = " T.CURDAY_DEVE_DRQPQS CURDAY_DEVE_DRQPQS                                                                                                                                       "+
	"       ,SUM(T.CURDAY_DEVE_NUM) CURDAY_DEVE_NUM                                                                                                                                          "+
	"       ,CASE WHEN SUM(T.CURDAY_DEVE_HB2)=0                                                                                                                                              "+
	"             THEN '--'                                                                                                                                                                  "+
	"             ELSE ROUND((SUM(T.CURDAY_DEVE_NUM)-SUM(T.CURDAY_DEVE_HB2))*100/SUM(T.CURDAY_DEVE_HB2),2)||'%' END CURDAY_DEVE_HB                                                           "+
	"       ,SUM(T.CURDAY_DEVE_NUM)-ROUND(SUM(T.CURDAY_DEVE_LASTAVG2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-1))),0) CURDAY_DEVE_LASTAVG  "+
	"       ,SUM(T.CURDAY_DEVE_NUM)-ROUND(SUM(T.CURDAY_DEVE_3MON2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-3))),0) CURDAY_DEVE_3MON        "+
	"       ,SUM(T.CURDAY_DEVE_NUM)-ROUND(SUM(T.CURDAY_DEVE_HALFYEAR2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-6))),0) CURDAY_DEVE_HALFYEAR"+
	"       ,T.LESS_96_DRQPQS LESS_96_DRQPQS                                                                                                                                                 "+
	"       ,SUM(T.LESS_96_NUM) LESS_96_NUM                                                                                                                                                  "+
	"       ,CASE WHEN SUM(T.LESS_96_HB2)=0                                                                                                                                                  "+
	"             THEN '--'                                                                                                                                                                  "+
	"             ELSE ROUND((SUM(T.LESS_96_NUM)-SUM(T.LESS_96_HB2))*100/SUM(T.LESS_96_HB2),2)||'%' END LESS_96_HB                                                                           "+
	"       ,SUM(T.LESS_96_NUM)-ROUND(SUM(T.LESS_96_LASTAVG2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-1))),0) LESS_96_LASTAVG        "+
	"       ,SUM(T.LESS_96_NUM)-ROUND(SUM(T.LESS_96_3MON2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-3))),0) LESS_96_3MON              "+
	"       ,SUM(T.LESS_96_NUM)-ROUND(SUM(T.LESS_96_HALFYEAR2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-6))),0) LESS_96_HALFYEAR      "+
	"       ,T.MORE_96_DRQPQS MORE_96_DRQPQS                                                                                                                                                 "+
	"       ,SUM(T.MORE_96_NUM) MORE_96_NUM                                                                                                                                                  "+
	"       ,CASE WHEN SUM(T.MORE_96_HB2)=0                                                                                                                                                  "+
	"             THEN '--'                                                                                                                                                                  "+
	"             ELSE ROUND((SUM(T.MORE_96_NUM)-SUM(T.MORE_96_HB2))*100/SUM(T.MORE_96_HB2),2)||'%' END MORE_96_HB                                                                           "+
	"       ,SUM(T.MORE_96_NUM)-ROUND(SUM(T.MORE_96_LASTAVG2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-1))),0) MORE_96_LASTAVG        "+
	"       ,SUM(T.MORE_96_NUM)-ROUND(SUM(T.MORE_96_3MON2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-3))),0) MORE_96_3MON              "+
	"       ,SUM(T.MORE_96_NUM)-ROUND(SUM(T.MORE_96_HALFYEAR2)/(LAST_DAY(TO_DATE('"+qdate+"','YYYYMMDD'))-LAST_DAY(ADD_MONTHS(TO_DATE('"+qdate+"','YYYYMMDD'),-6))),0) MORE_96_HALFYEAR      "+ 
	"FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_DAY T";  
	return fs;
}