var field=[
           "FIXED_SALARY",
           "BASE_SALARY",
           "JF_SALARY",
           "SPECIAL_AWARD",
           "ALL_SALARY",
           "MONTH_RATE",
           "YEAR_RATE"];
var title=[[
            "组织架构",
            "营业厅人员薪酬（元）",
            "",
            "",
            "",
            "",
            "环比",
            ""  ],
           ["",
            "固定薪酬",
            "KPI绩效",
            "积分提成",
            "专项奖励",
            "合计",
            "月环比",
            "年累计环比"  ]];
var orderBy = '  ';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		field : ["ROW_NAME"].concat(field),
		rowParams : ["ROW_ID"],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			
		},
		getSubRowsCallBack : function($tr) {
			var hrId=$("#hrId").val();
			var time=$("#time").val();
			var regionName=$("#regionName").val();
			var hallName=$("#hallName").val();
			var userName=$("#userName").val();
			
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var nextLevel='';
			
			if($tr){
				code=$tr.attr("row_id");
				nextLevel=parseInt($tr.attr("orgLevel"));
				if(nextLevel==2){//点击市
					preField=' t.HALL_ID ROW_ID,t.HALL_NAME ROW_NAME';
					groupBy=' group by t.HALL_ID,t.HALL_NAME ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(nextLevel==3){//点击营业厅
					preField=" t.hr_id ROW_ID,t.name ROW_NAME ";
					groupBy=' group by t.hr_id,t.name ';
					where=' where t.hall_id=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
				nextLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where 1=1 ';
					nextLevel=2;
				}else if(orgLevel==2){//市
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
					nextLevel=2;
				}else if(orgLevel>=3){//
					preField=' t.hr_id ROW_ID,t.name ROW_NAME';
					groupBy=' group by t.hr_id,t.name ';
					
					var hrIds=_jf_power(hrId,time);
					if(hrIds&&hrIds!=""){
					  where=" where t.HR_ID in("+hrIds+") ";
					}else{
					  where=" where 1=2 ";	 
					}
					nextLevel=5;
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+','+getSumSql(field)+'  from PMRT.TB_MRT_YYT_SALARY_MON t ';
			
			
			
			if(time!=''){
				where+=" and t.DEAL_DATE="+time;
			}
			if(regionName!=''){
				where+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
			}
			if(hallName!=''){
				where+=" and t.HALL_NAME = '"+hallName+"'";
			}
			if(userName!=''){
				where+=" and t.NAME like '%"+userName+"%'";
			}
			
			if(where!=''){
				sql+=where;
			}
			if(groupBy!=''){
				sql+=groupBy;
			}
			if(orderBy!=''){
				sql+=orderBy;
			}
			
			var d=query(sql);
			return {data:d,extra:{orgLevel:nextLevel}};
		}
	});
	report.showSubRow();
	$("#searchBtn").click(function(){
		report.showSubRow();
	});
});
function getSumSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		if(field[i]=="MONTH_RATE"){
			s += "case nvl(SUM(LAST_MONTH_SALARY),0) when 0 then '100%' else trim(to_char(SUM(ALL_SALARY)/SUM(LAST_MONTH_SALARY)*100,'9g999g999g999g999g999g999g999g999g999'))||'%' end " + field[i];
		}else if(field[i]=="YEAR_RATE"){
			s += "case nvl(SUM(LAST_YEAR_SALARY),0) when 0 then '100%' else trim(to_char(SUM(THIS_YEAR_SALARY)/SUM(LAST_YEAR_SALARY)*100,'9g999g999g999g999g999g999g999g999g999'))||'%' end " + field[i];
		}else{
			s += "trim(to_char(SUM(" + field[i]
			+ "),'9g999g999g999g999g999g999g999g999g990d00')) " + field[i];
		}
	}
	return s;

}
function listRegions(){
	var sql="";
	var time=$("#time").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME AREA_NAME from PMRT.TB_MRT_YYT_SALARY_MON t where 1=1 ";
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].AREA_NAME
					+ '" selected >'
					+ d[0].AREA_NAME + '</option>';
			listUnits(d[0].AREA_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].AREA_NAME + '">' + d[i].AREA_NAME + '</option>';
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
	var $unit=$("#hallName");
	var time=$("#time").val();
	var sql = "select distinct t.HALL_NAME UNIT_NAME from PMRT.TB_MRT_YYT_SALARY_MON t where 1=1 ";
	
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code;
		}else{
			 var hrIds=_jf_power(hrId,time);
			 if(hrIds&&hrIds!=""){
			   sql+=" and t.HR_ID in("+hrIds+") ";
			 }else{
			   sql+=" and 1=2 ";	 
			 }
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
		alert("获取营业厅信息失败");
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
	var field=["DEAL_DATE",
	           "GROUP_ID_1_NAME",
	           "HALL_ID",
	           "HALL_NAME",
	           "HR_ID",
	           "NAME",
	           "FIXED_SALARY",
	           "BASE_SALARY",
	           "JF_SALARY",
	           "SPECIAL_AWARD",
	           "ALL_SALARY",
	           "MONTH_RATE",
	           "YEAR_RATE"];
	var title=[["账期",
	            "地市名称",
	            "营业厅编码",
	            "营业厅名称",
	            "HR编码",
	            "姓名",
	            "营业厅人员薪酬（元）",
	            "",
	            "",
	            "",
	            "",
	            "环比",
	            ""  ],
	           ["",
	            "",
	            "",
	            "",
	            "",
	            "",
	            "固定薪酬",
	            "KPI绩效",
	            "积分提成",
	            "专项奖励",
	            "合计",
	            "月环比",
	            "年累计环比"  ]];
	var sql="";
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var hallName=$("#hallName").val();
	var userName=$("#userName").val();
	//条件
	var sql = " from PMRT.TB_MRT_YYT_SALARY_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(hallName!=''){
		sql+=" and t.HALL_NAME = '"+hallName+"'";
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
		 if(hrIds&&hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select "+field.join(",")+ sql;
	showtext = '营业厅人员薪酬-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////