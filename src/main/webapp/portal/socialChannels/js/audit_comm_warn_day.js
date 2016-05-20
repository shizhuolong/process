var field=["CURDAY_DEVE_DRQPQS","TOATAL_TODAY_LEV3","TOATAL_DEVE_HBLEV3","TOATAL_LASTMONAVGLVE3","TOATAL_3MONAVGLEV3","TOATAL_HALFYEARAVGLEV3","LESS_96_DRQPQS",
           "LESS_96_TODAY_LEV3","LESS_96_HBLEV3","LESS_96_LASTMONAVGLVE3","LESS_96_3MONAVGLEV3","LESS_96_HALFYEARAVGLEV3","MORE_96_DRQPQS","MORE_96_TODAY_LEV3",
           "MORE_96_HBLEV3","MORE_96_LASTMONAVGLVE3","MORE_96_3MONAVGLEV3","MORE_96_HALFYEARAVGLEV3"];
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
					where+=" AND UNIT_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND UNIT_ID_2='"+code+"'";
				}else if(orgLevel==4){
					where+=" AND UNIT_ID_3='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示地市
					where+=" AND UNIT_ID_0='"+code+"'";
				}else if(orgLevel==2){//市
					where+=" AND UNIT_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心
					where+=" AND UNIT_ID_2='"+code+"'";
				}else if(orgLevel==4){//网点
					where+=" AND UNIT_ID_3='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}	
			orgLevel++;
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
			var sql="SELECT * FROM (" + getSql(orgLevel)+where+") WHERE RN=1";
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
	//$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY UNIT_ID_1,UNIT_ID_2,UNIT_ID_3,UNIT_ID_4";
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var unit_id_3_name=$.trim($("#unit_id_3_name").val());
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND UNIT_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where += " AND UNIT_ID_2='" + code + "' ";
	} else if (orgLevel == 4) {//网点
		where += " AND UNIT_ID_3='" + code + "' ";
	}
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
	var sql = "SELECT * FROM (" + getDownSql()+where+orderBy+") WHERE RN=1";
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
function getSql(orgLevel){
	var fs = "SELECT UNIT_ID_"+(orgLevel-1)+"_NAME ROW_NAME,"+
	"UNIT_ID_"+(orgLevel-1)+" ROW_ID,                       "+
	"    CURDAY_DEVE_DRQPQS,                                "+
	"    TOATAL_TODAY_LEV3,                                 "+
	"    TOATAL_DEVE_HBLEV3,                                "+
	"    TOATAL_LASTMONAVGLVE3,                             "+
	"    TOATAL_3MONAVGLEV3,                                "+
	"    TOATAL_HALFYEARAVGLEV3,                            "+
	"    LESS_96_DRQPQS,                                    "+
	"    LESS_96_TODAY_LEV3,                                "+
	"    LESS_96_HBLEV3,                                    "+
	"    LESS_96_LASTMONAVGLVE3,                            "+
	"    LESS_96_3MONAVGLEV3,                               "+
	"    LESS_96_HALFYEARAVGLEV3,                           "+
	"    MORE_96_DRQPQS,                                    "+
	"    MORE_96_TODAY_LEV3,                                "+
	"    MORE_96_HBLEV3,                                    "+
	"    MORE_96_LASTMONAVGLVE3,                            "+
	"    MORE_96_3MONAVGLEV3,                               "+
	"    MORE_96_HALFYEARAVGLEV3,                           "+
	"    ROW_NUMBER() OVER (PARTITION BY UNIT_ID_"+(orgLevel-1)+" ORDER BY UNIT_ID_"+(orgLevel-1)+") RN"+
	" FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_DAY";
	return fs;
}

function getDownSql(){
	var fs = "SELECT DEAL_DATE,UNIT_ID_1_NAME,UNIT_ID_2_NAME,UNIT_ID_3_NAME,UNIT_ID_4_NAME,CHNL_CODE"+
	"    CURDAY_DEVE_DRQPQS,                                "+
	"    TOATAL_TODAY_LEV3,                                 "+
	"    TOATAL_DEVE_HBLEV3,                                "+
	"    TOATAL_LASTMONAVGLVE3,                             "+
	"    TOATAL_3MONAVGLEV3,                                "+
	"    TOATAL_HALFYEARAVGLEV3,                            "+
	"    LESS_96_DRQPQS,                                    "+
	"    LESS_96_TODAY_LEV3,                                "+
	"    LESS_96_HBLEV3,                                    "+
	"    LESS_96_LASTMONAVGLVE3,                            "+
	"    LESS_96_3MONAVGLEV3,                               "+
	"    LESS_96_HALFYEARAVGLEV3,                           "+
	"    MORE_96_DRQPQS,                                    "+
	"    MORE_96_TODAY_LEV3,                                "+
	"    MORE_96_HBLEV3,                                    "+
	"    MORE_96_LASTMONAVGLVE3,                            "+
	"    MORE_96_3MONAVGLEV3,                               "+
	"    MORE_96_HALFYEARAVGLEV3,                           "+
	"    ROW_NUMBER() OVER (PARTITION BY UNIT_ID_4 ORDER BY UNIT_ID_4) RN"+
	" FROM YNPAY.TB_PAY_AUDIT_COMM_WARN_DAY";
	return fs;
}