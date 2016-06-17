var field=["ALL_FEE","S_FEE","A_FEE","B_FEE","C_FEE","D_FEE","E_FEE","ALL_NUM","S_NUM","A_NUM","B_NUM","C_NUM","D_NUM","E_NUM","ALL_QD","S_QD","A_QD","B_QD","C_QD","D_QD","E_QD"];
var title=[["地域","分等分级社会渠道当期出账收入","","","","","","","分等分级社会渠道当期发展用户数","","","","","","","分等分级社会渠道当期渠道数","","","","","",""],
           ["","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增"]];
var report=null;
var qdate="";
var orderBy="";
$(function(){
	 listRegions();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
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
			var preField='';
			var where=' WHERE 1 = 1';
			var groupBy='';
			var order='';
			var code='';
			var orgLevel='';
			qdate = $("#month").val();
			var regionName=$("#regionName").val();
			var unitId=$("#unitId").val();
			var hrId=$.trim($("#hrId").val());
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=" GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,";
					groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
					order=" ORDER BY GROUP_ID_1";
				}else if(orgLevel==3){
					preField=" UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,";
					groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
					where+=" AND GROUP_ID_1='"+code+"'";
					order=" ORDER BY UNIT_ID";
				}else if(orgLevel==4){
					preField=" GROUP_ID_4_NAME ROW_NAME,GROUP_ID_4 ROW_ID,";
					groupBy=" GROUP BY GROUP_ID_4,GROUP_ID_4_NAME";
					where+=" AND UNIT_ID='"+code+"'";
					order=" ORDER BY GROUP_ID_4";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示省
					preField=" '云南省' ROW_NAME,'86000' ROW_ID,";
				}else if(orgLevel==2){//市
					preField=" GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,";
					groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心 
					preField=" UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,";
					groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
					where+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			if(regionName!=''){
				where+=" AND GROUP_ID_1 = '"+regionName+"'";
			}
			if(hrId!=''){
				where+=" AND HR_ID = '"+hrId+"'";
			}
			if(unitId!=''){
				where+=" AND UNIT_ID = '"+unitId+"'";
			}
			var sql='SELECT '+preField+getSumField()+" PARTITION(P"+qdate+")"+where+groupBy+order;
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
	var preField=' DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,GROUP_ID_4_NAME,';
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,GROUP_ID_4";
	var groupBy=" GROUP BY DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,GROUP_ID_4, GROUP_ID_4_NAME";
	var regionName=$("#regionName").val();
	var unitId=$("#unitId").val();
	var hrId=$.trim($("#hrId").val());
	var fieldSql=getSumField();
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where += " AND UNIT_ID='" + code + "' ";
	} else if (orgLevel == 4) {//渠道
		where += " AND GROUP_ID_4='" + code + "' ";
	}else{
		where +=" AND 1=2";
	}
	if(regionName!=''){
		where+=" AND GROUP_ID_1 = '"+regionName+"'";
	}
	if(hrId!=''){
		where+=" AND HR_ID = '"+hrId+"'";
	}
	if(unitId!=''){
		where+=" AND UNIT_ID = '"+unitId+"'";
	}
	var sql = 'SELECT ' + preField + fieldSql+" PARTITION(P"+qdate+")"+where+groupBy+orderBy;
	showtext = '分等分级社会渠道统计报表' + qdate;
	var title=[["账期","地市","营服中心","渠道","分等分级社会渠道当期出账收入","","","","","","","分等分级社会渠道当期发展用户数","","","","","","","分等分级社会渠道当期渠道数","","","","","",""],
	           ["","","","","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增"]];
	downloadExcel(sql,title,showtext);
}

function listRegions(){
	var sql="";
	//条件
	var sql = "SELECT DISTINCT t.GROUP_ID_1,t.GROUP_ID_1_NAME from PMRT.TAB_MRT_INTEGRAL_USER_TJ t where 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else if(orgLevel==4){
		sql+=" and t.GROUP_ID_4='"+code+"'";
	}else{
		
	}
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
	var $unit=$("#unitId");
	var sql = "select distinct t.UNIT_ID,t.UNIT_NAME from PMRT.TAB_MRT_INTEGRAL_USER_TJ t where 1=1 ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1='"+code+"'";
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else if(orgLevel==4){
			sql+=" and t.GROUP_ID_4='"+code+"'";
		}else{
			
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
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
		alert("获取营服中心信息失败");
	}
}

function getSumField(){
 var fs = "SUM(ALL_FEE) ALL_FEE,"+  
	"SUM(S_FEE) S_FEE,    "+
	"SUM(A_FEE) A_FEE,    "+
	"SUM(B_FEE) B_FEE,    "+
	"SUM(C_FEE) C_FEE,    "+
	"SUM(D_FEE) D_FEE,    "+
	"SUM(E_FEE) E_FEE,    "+
	"SUM(ALL_NUM) ALL_NUM,"+  
	"SUM(S_NUM) S_NUM,    "+
	"SUM(A_NUM) A_NUM,    "+
	"SUM(B_NUM) B_NUM,    "+
	"SUM(C_NUM) C_NUM,    "+
	"SUM(D_NUM) D_NUM,    "+
	"SUM(E_NUM) E_NUM,    "+
	"SUM(ALL_QD) ALL_QD,  "+
	"SUM(S_QD) S_QD,      "+
	"SUM(A_QD) A_QD,      "+
	"SUM(B_QD) B_QD,      "+
	"SUM(C_QD) C_QD,      "+
	"SUM(D_QD) D_QD,      "+
	"SUM(E_QD) E_QD       "+
	"FROM PMRT.TAB_MRT_INTEGRAL_USER_TJ                                                                              ";  
	return fs;
}