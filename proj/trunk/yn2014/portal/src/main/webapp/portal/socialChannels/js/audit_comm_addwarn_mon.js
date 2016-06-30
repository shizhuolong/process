var field=["ADD_TOTAL_DEV","ADD_TOTAL_EFFECTIVE","ADD_TOTAL_JTNUM","ADD_TOTAL_XHNUM","ADD_TOTAL_SWNUM","ADD_TOTAL_JDNUM","ADD_LESS_96_DEV","ADD_LESS_96_EFFECTIVE","ADD_LESS_96_JTNUM","ADD_LESS_96_XHNUM","ADD_LESS_96_SWNUM","ADD_LESS_96_JDNUM","ADD_MORE_96_DEV","ADD_MORE_96_EFFECTIVE","ADD_MORE_96_JTNUM","ADD_MORE_96_XHNUM","ADD_MORE_96_SWNUM","ADD_MORE_96_JDNUM"];
var title=[["组织架构","发展质量总表","","","","","","96以下套餐发展质量","","","","","","96以上套餐发展质量","","","","",""],
           ["","发展总量","有效率","降套","销户","三无","极低","发展总量","有效率","降套","销户","三无","极低","发展总量","有效率","降套","销户","三无","极低"]];
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
			if(orgLevel<=4){
				groupBy=" GROUP BY UNIT_ID_"+(orgLevel-1)+",UNIT_ID_"+(orgLevel-1)+"_NAME,ADD_TOTAL_EFFECTIVE_LEV"+(orgLevel-1)+",ADD_LESS_96_EFFECTIVE_LEV"+(orgLevel-1)+",ADD_MORE_96_EFFECTIVE_LEV"+(orgLevel-1);
			}
			order=" ORDER BY UNIT_ID_"+(orgLevel-1);
			var sql =getSql(orgLevel)+where+groupBy+order;
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
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY UNIT_ID_1,UNIT_ID_2,UNIT_ID_3,CHNL_CODE,UNIT_ID_4";
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
	var sql =  getDownSql()+where+orderBy;
	showtext = '月累计预警报表' + qdate;
	var title=[["账期","地市","营服","网点","渠道编码","姓名","发展人编码","发展质量总表","","","","","","96以下套餐发展质量","","","","","","96以上套餐发展质量","","","","",""],
	           ["","","","","","","","发展总量","有效率","降套","销户","三无","极低","发展总量","有效率","降套","销户","三无","极低","发展总量","有效率","降套","销户","三无","极低"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function listRegions(){
	var sql="";
	//条件
	var sql = "SELECT DISTINCT T.UNIT_ID_1_NAME FROM YNPAY.TB_PAY_AUDIT_COMM_ADDWARN_MON t where 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.UNIT_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID_2='"+code+"'";
	}else if(orgLevel==4){
		sql+=" and t.UNIT_ID_3='"+code+"'";
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
	var sql = "SELECT DISTINCT T.UNIT_ID_2_NAME FROM YNPAY.TB_PAY_AUDIT_COMM_ADDWARN_MON t where 1=1 ";
	if(regionName!=''){
		sql+=" AND t.UNIT_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" AND t.UNIT_ID_1='"+code+"'";
		}else if(orgLevel==3){
			sql+=" AND t.UNIT_ID_2='"+code+"'";
		}else if(orgLevel==4){
			sql+=" AND t.UNIT_ID_3='"+code+"'";
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
	var fs="";
	if(orgLevel<=4){
        fs="SELECT UNIT_ID_"+(orgLevel-1)+" ROW_ID,UNIT_ID_"+(orgLevel-1)+"_NAME ROW_NAME," +
        "SUM(ADD_TOTAL_DEV) ADD_TOTAL_DEV,                "+
        "ADD_TOTAL_EFFECTIVE_LEV"+(orgLevel-1)+" ADD_TOTAL_EFFECTIVE,"+
        "SUM(ADD_TOTAL_JTNUM) ADD_TOTAL_JTNUM,            "+
        "SUM(ADD_TOTAL_XHNUM) ADD_TOTAL_XHNUM,            "+
        "SUM(ADD_TOTAL_SWNUM) ADD_TOTAL_SWNUM,            "+
        "SUM(ADD_TOTAL_JDNUM) ADD_TOTAL_JDNUM,            "+
        "SUM(ADD_LESS_96_DEV) ADD_LESS_96_DEV,            "+
        "ADD_LESS_96_EFFECTIVE_LEV"+(orgLevel-1)+" ADD_LESS_96_EFFECTIVE,"+
        "SUM(ADD_LESS_96_JTNUM) ADD_LESS_96_JTNUM,        "+
        "SUM(ADD_LESS_96_XHNUM) ADD_LESS_96_XHNUM,        "+
        "SUM(ADD_LESS_96_SWNUM) ADD_LESS_96_SWNUM,        "+
        "SUM(ADD_LESS_96_JDNUM) ADD_LESS_96_JDNUM,        "+
        "SUM(ADD_MORE_96_DEV) ADD_MORE_96_DEV,            "+
        "ADD_MORE_96_EFFECTIVE_LEV"+(orgLevel-1)+" ADD_MORE_96_EFFECTIVE,"+
        "SUM(ADD_MORE_96_JTNUM) ADD_MORE_96_JTNUM,        "+
        "SUM(ADD_MORE_96_XHNUM) ADD_MORE_96_XHNUM,        "+
        "SUM(ADD_MORE_96_SWNUM) ADD_MORE_96_SWNUM,        "+
        "SUM(ADD_MORE_96_JDNUM) ADD_MORE_96_JDNUM         "+
        "FROM YNPAY.TB_PAY_AUDIT_COMM_ADDWARN_MON    ";
	}else{
		fs = "SELECT                               "+
		"       UNIT_ID_4_NAME ROW_NAME,           "+
		"       UNIT_ID_4 ROW_ID,                  "+
		"       ADD_TOTAL_DEV,                     "+
		"       ADD_TOTAL_EFFECTIVE,               "+
		"       ADD_TOTAL_JTNUM,                   "+
		"       ADD_TOTAL_XHNUM,                   "+
		"       ADD_TOTAL_SWNUM,                   "+
		"       ADD_TOTAL_JDNUM,                   "+
		"       ADD_LESS_96_DEV,                   "+
		"       ADD_LESS_96_EFFECTIVE,             "+
		"       ADD_LESS_96_JTNUM,                 "+
		"       ADD_LESS_96_XHNUM,                 "+
		"       ADD_LESS_96_SWNUM,                 "+
		"       ADD_LESS_96_JDNUM,                 "+
		"       ADD_MORE_96_DEV,                   "+
		"       ADD_MORE_96_EFFECTIVE,             "+
		"       ADD_MORE_96_JTNUM,                 "+
		"       ADD_MORE_96_XHNUM,                 "+
		"       ADD_MORE_96_SWNUM,                 "+
		"       ADD_MORE_96_JDNUM                  "+
		"  FROM YNPAY.TB_PAY_AUDIT_COMM_ADDWARN_MON";
    }
	return fs;
}
function getDownSql(){
	var fs = "SELECT DEAL_DATE,                "+
	"       UNIT_ID_1_NAME,                    "+
	"       UNIT_ID_2_NAME,                    "+
	"       UNIT_ID_3_NAME,                    "+
	"       CHNL_CODE,                         "+
	"       UNIT_ID_4_NAME,                    "+
	"       UNIT_ID_4,                         "+
	"       ADD_TOTAL_DEV,                     "+
	"       ADD_TOTAL_EFFECTIVE,               "+
	"       ADD_TOTAL_JTNUM,                   "+
	"       ADD_TOTAL_XHNUM,                   "+
	"       ADD_TOTAL_SWNUM,                   "+
	"       ADD_TOTAL_JDNUM,                   "+
	"       ADD_LESS_96_DEV,                   "+
	"       ADD_LESS_96_EFFECTIVE,             "+
	"       ADD_LESS_96_JTNUM,                 "+
	"       ADD_LESS_96_XHNUM,                 "+
	"       ADD_LESS_96_SWNUM,                 "+
	"       ADD_LESS_96_JDNUM,                 "+
	"       ADD_MORE_96_DEV,                   "+
	"       ADD_MORE_96_EFFECTIVE,             "+
	"       ADD_MORE_96_JTNUM,                 "+
	"       ADD_MORE_96_XHNUM,                 "+
	"       ADD_MORE_96_SWNUM,                 "+
	"       ADD_MORE_96_JDNUM                  "+
	"  FROM YNPAY.TB_PAY_AUDIT_COMM_ADDWARN_MON";
	return fs;
}