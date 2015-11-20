var nowData = [];
var title=[["基层单元","人员姓名","HR编码","地市","账期","角色类型",
            "发展","","","","",
            "收入","","","","",
            "欠费","","","","",
            "存量","","","","",
            "毛利","","","","",
            "营业考核","",
            
            "省级KPI权重",
            "省级KPI得分",
            "自设KPI得分",
            "汇总KPI得分",
            "基础绩效基数（元）",
            "基础绩效薪酬（元）"
            ],
           ["","","","","","",
            "发展任务","发展完成","发展任务完成率","发展KPI得分","发展KPI权重",
            "收入任务","收入完成","收入任务完成率","收入KPI得分","收入KPI权重",
            "欠费","本月累计达到收入","欠费率","欠费KPI得分","欠费KPI权重",
            "上年12月收入 ","存量收入","存量收入保有率","存量KPI得分","存量KPI权重",
            "毛利预算","毛利完成","毛利任务完成率","毛利KPI得分","毛利KPI权重",
            "考核得分权重","考核得分值",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
            ]
];

var field=["UNIT_NAME","NAME","HR_ID","GROUP_ID_1_NAME","DEAL_DATE","USER_ROLE",
           "TASK_DEV","DEV_COUNT","DEV_COMPLETE","DEV_KPI_VALUE","DEV_KPI_WEIGHT","TASK_INCOME","TOTAL_FEE","INCOME_COMPLETE","IN_KPI_VALUE","IN_KPI_WEIGHT","OWEFEE","AMOUNT_MONTH","OWEFEE_RATE","OWE_KPI_VALUE","OWE_KPI_WEIGHT","AMOUNT_12","AMOUNT_ALL","STOCK_RATE","STOCK_KPI_VALUE","STOCK_KPI_WEIGHT","BUDEGET_TASK","BUDGET_ML","ML_COMPLETE","ML_KPI_VALUE","ML_KPI_WEIGHT","KHDF_WEIGHT","KHDF_VALUE","PROV_KPI_WEIGHT","PROV_KPI_SCORE","CUSTOM_KPI","KPI_RESULT","BASE_SALARY","BASE_KPI_SALARY"];
var orderBy = '';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		lock:3,
		css:[{gt:5,css:LchReport.RIGHT_ALIGN},{eq:1,css:{minWidth:'100px'}},{eq:3,css:{minWidth:'140px'}}],
		tableCss:{leftWidth:350},
		rowParams : ["DEAL_DATE","HR_ID","UNIT_ID","USER_ROLE"],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 15;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
//条件
	var sql = " from PMRT.TB_MRT_KPI_REPORT_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 "; 
		 }
	}
	
	
	
	var csql = sql;
	var cdata = query("select count(*) total" + csql);
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select * " + sql;

	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
function listRegions(){
	var sql="";
	var time=$("#time").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME from PMRT.TB_MRT_KPI_REPORT_MON t where 1=1 ";
	if(time!=''){
		//sql+=" and t.DEAL_DATE="+time;
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
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
	var time=$("#time").val();
	var sql = "select distinct t.UNIT_NAME from PMRT.TB_MRT_KPI_REPORT_MON t where 1=1 ";
	if(time!=''){
		//sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code;
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else{
			sql+=" and t.HR_ID='"+hrId+"'";
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_NAME
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_NAME + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var title=[["地市","基层单元","账期","HR编码","人员姓名","角色类型",
	            "发展","","","","",
	            "收入","","","","",
	            "欠费","","","","",
	            "存量","","","","",
	            "毛利","","","","",
	            "营业考核","",
	            
	            "省级KPI权重",
	            "省级KPI得分",
	            "自设KPI得分",
	            "汇总KPI得分",
	            "基础绩效基数（元）",
	            "基础绩效薪酬（元）"
	            ],
	           ["","","","","","",
	            "发展任务","发展完成","发展任务完成率","发展KPI得分","发展KPI权重",
	            "收入任务","收入完成","收入任务完成率","收入KPI得分","收入KPI权重",
	            "欠费","本月累计达到收入","欠费率","欠费KPI得分","欠费KPI权重",
	            "上年12月收入 ","存量收入","存量收入保有率","存量KPI得分","存量KPI权重",
	            "毛利预算","毛利完成","毛利任务完成率","毛利KPI得分","毛利KPI权重",
	            "考核得分权重","考核得分值",
	            "",
	            "",
	            "",
	            "",
	            "",
	            "",
	            ""
	            ]
	];
	var field=["GROUP_ID_1_NAME","UNIT_NAME","DEAL_DATE","HR_ID","NAME","USER_ROLE",
	           "TASK_DEV","DEV_COUNT","DEV_COMPLETE","DEV_KPI_VALUE","DEV_KPI_WEIGHT","TASK_INCOME","TOTAL_FEE","INCOME_COMPLETE","IN_KPI_VALUE","IN_KPI_WEIGHT","OWEFEE","AMOUNT_MONTH","OWEFEE_RATE","OWE_KPI_VALUE","OWE_KPI_WEIGHT","AMOUNT_12","AMOUNT_ALL","STOCK_RATE","STOCK_KPI_VALUE","STOCK_KPI_WEIGHT","BUDEGET_TASK","BUDGET_ML","ML_COMPLETE","ML_KPI_VALUE","ML_KPI_WEIGHT","KHDF_WEIGHT","KHDF_VALUE","PROV_KPI_WEIGHT","PROV_KPI_SCORE","CUSTOM_KPI","KPI_RESULT","BASE_SALARY","BASE_KPI_SALARY"];
	var sql="";
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	//条件
	var sql = " from PMRT.TB_MRT_KPI_REPORT_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 "; 
		 }
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select "+field.join(",") + sql;
	
	showtext = 'KPI汇总月报-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////