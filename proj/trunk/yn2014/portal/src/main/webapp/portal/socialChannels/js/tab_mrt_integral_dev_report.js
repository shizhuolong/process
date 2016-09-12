var field=["ALL_JF_TOTAL","ALL_JF_QS","ALL_JF_YF","ALL_JF_YFSF","ALL_JF","COMM","ALL_JF_CX","COMM_CX","ALL_JF_FCX","COMM_FCX","LJ_JF_TOTAL","LJ_JF_QS","LJ_JF_DH","LJ_COMM","LJ_JF_DH_CX","LJ_COMM_CX","LJ_JF_DH_FCX","LJ_COMM_FCX","IS_JF_SPLUS","IS_JF_SPLUS_CX","IS_JF_SPLUS_FCX","IS_JF","IS_JF_CX","IS_COMM_CX","IS_JF_FCX","IS_COMM_FCX","BJ_COMM","IS_JF_YZF","IS_JF_LJ_ALL","IS_JF_LJ_DH","IS_COMM_LJ_DH","IS_JF_SPLUS_ALL","UP_JF_CX","UP_JF_FCX"];
var title=[["组织架构","本月计算积分","本月清算积分","本月延付积分","本月延付释放积分","本月计算积分","","","","","","本年累计积分","","","","","","","","","","","当期兑换积分","","","","","","","渠道生命周期内累计积分","","","","",""],
           ["","","","","","本月合计积分","本月合计金额","本月实算积分(促销)","本月实算金额（促销)","本月实算积分(非促销)","本月实算金额（非促销）","本年计算积分","本年清算积分","本年实算积分","本年实算金额","本年实算积分(促销)","本年实算金额(促销)","本年实算积分(非促销)","本年实算金额(非促销)","本年未兑换总积分","本年未兑换总积分（促销）","本年未兑换总积分（非促销）","本期手工录入积分（合计）","本期手工录入积分（促销）","本期录入折算金额（促销）","本期手工录入积分（非促销）","本期录入折算金额（非促销）","本期补结金额","本期预付积分（非促销）","自201506累计实算总积分","自201506累计已兑总积分","自2015年06月累计已兑金额","自201506累计剩余未兑积分","累计最大可录总积分（促销）","累计最大可录总积分（非促销）"]];
var report=null;
var time="";
var orderBy="";
$(function(){
	 listRegions();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"lchcontent",
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
			var groupBy='';
			var order='';
			var preSql='';
			time=$("#time").val();
			var regionName=$("#regionName").val();
			var unitName=$("#unitName").val();
			var userName=$.trim($("#userName").val());
			var hr_id=$.trim($("#hr_id").val());
			var fd_chnl_id=$.trim($("#fd_chnl_id").val());
			var integral_grade=$.trim($("#integral_grade").val());
			var state=$("#state").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
					where+=" AND GROUP_ID_1='"+code+"'";
					order=" ORDER BY UNIT_ID";
				}else if(orgLevel==3){
					preSql="SELECT HR_ID ROW_ID,HR_ID_NAME ROW_NAME,";
					groupBy=" GROUP BY HR_ID,HR_ID_NAME";
					where+=" AND UNIT_ID='"+code+"'";
					order=" ORDER BY HR_ID";
				}else if(orgLevel==4){
					preSql="SELECT GROUP_ID_4 ROW_ID,GROUP_ID_4_NAME ROW_NAME,";
					groupBy=" GROUP BY GROUP_ID_4,GROUP_ID_4_NAME";
					where+=" AND HR_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){
					preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
					groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
					where+=" AND GROUP_ID_0='"+code+"'";
					order=" ORDER BY GROUP_ID_1";
				}else if(orgLevel==2){
					preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
					where+=" AND GROUP_ID_1='"+code+"'";
					order=" ORDER BY UNIT_ID";
				}else if(orgLevel==3){
					preSql="SELECT HR_ID ROW_ID,HR_ID_NAME ROW_NAME,";
					groupBy=" GROUP BY HR_ID,HR_ID_NAME";
					where+=" AND UNIT_ID='"+code+"'";
					order=" ORDER BY HR_ID";
				}else if(orgLevel==4){
					preSql="SELECT GROUP_ID_4 ROW_ID,GROUP_ID_4_NAME ROW_NAME,";
					groupBy=" GROUP BY GROUP_ID_4,GROUP_ID_4_NAME";
					where+=" AND GROUP_ID_4='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}	
			orgLevel++;
			if(regionName!=''){
				where+=" AND GROUP_ID_1_NAME = '"+regionName+"'";
			}
			if(unitName!=''){
				where+=" AND UNIT_NAME = '"+unitName+"'";
			}
			if(userName!=''){
				where+=" AND HR_ID_NAME LIKE '%"+userName+"%'";
			}
			if(hr_id!=''){
				where+=" AND HR_ID='"+hr_id+"'";
			}
			if(fd_chnl_id!=''){
				where+=" AND FD_CHNL_ID LIKE '%"+fd_chnl_id+"%'";
			}
			if(integral_grade!=''){
				where+=" AND INTEGRAL_GRADE='"+integral_grade+"'";
			}
			if(state!=''){
				where+=" AND STATE='"+state+"'";
			}
			var sql =preSql+getSumSql()+where+groupBy+order;
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
	var order='';
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$.trim($("#userName").val());
	var hr_id=$.trim($("#hr_id").val());
	var fd_chnl_id=$.trim($("#fd_chnl_id").val());
	var integral_grade=$.trim($("#integral_grade").val());
	var state=$("#state").val();
	
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if(regionName!=''){
		where+=" AND GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		where+=" AND UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		where+=" AND HR_ID_NAME LIKE '%"+userName+"%'";
	}
	if(hr_id!=''){
		where+=" AND HR_ID='"+hr_id+"'";
	}
	if(fd_chnl_id!=''){
		where+=" AND FD_CHNL_ID LIKE '%"+fd_chnl_id+"%'";
	}
	if(integral_grade!=''){
		where+=" AND INTEGRAL_GRADE='"+integral_grade+"'";
	}
	if(state!=''){
		where+=" AND STATE='"+state+"'";
	}
	//权限
	if(orgLevel==1){
		where+=" AND GROUP_ID_0='"+code+"'";
		order=" ORDER BY GROUP_ID_1,UNIT_ID,HR_ID,GROUP_ID_4";
	}else if(orgLevel==2){
		where+=" AND GROUP_ID_1='"+code+"'";
		order=" ORDER BY UNIT_ID,HR_ID,GROUP_ID_4";
	}else if(orgLevel==3){
		where+=" AND UNIT_ID='"+code+"'";
		order=" ORDER BY HR_ID,GROUP_ID_4";
	}else{
		sql+=" AND GROUP_ID_4='"+code+"'";
	}
	var sql =  "SELECT DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,HR_ID,HR_ID_NAME,FD_CHNL_ID,DEV_CHNL_NAME,DEPT_TYPE,HZ_MONTH,INTEGRAL_GRADE,"+
	           field.join(",")+" FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT PARTITION(p"+time+")"+where+order;
	showtext = '当期兑换报表' + time;
	var title=[["账期","地市","基层单元","HR编码","人员名","渠道编码","渠道名","渠道属性","合作月份","渠道等级","本月计算积分","本月清算积分","本月延付积分","本月延付释放积分","本月计算积分","","","","","","本年累计积分","","","","","","","","","","","当期兑换积分","","","","","","","渠道生命周期内累计积分","","","","",""],
	           ["","","","","","","","","","","","","","","本月合计积分","本月合计金额","本月实算积分(促销)","本月实算金额（促销)","本月实算积分(非促销)","本月实算金额（非促销）","本年计算积分","本年清算积分","本年实算积分","本年实算金额","本年实算积分(促销)","本年实算金额(促销)","本年实算积分(非促销)","本年实算金额(非促销)","本年未兑换总积分","本年未兑换总积分（促销）","本年未兑换总积分（非促销）","本期手工录入积分（合计）","本期手工录入积分（促销）","本期录入折算金额（促销）","本期手工录入积分（非促销）","本期录入折算金额（非促销）","本期补结金额","本期预付积分（非促销）","自201506累计实算总积分","自201506累计已兑总积分","自2015年06月累计已兑金额","自201506累计剩余未兑积分","累计最大可录总积分（促销）","累计最大可录总积分（非促销）"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function listRegions(){
	var sql = "SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT T WHERE 1=1 ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else{
		sql+=" AND 1=2";
	}
	sql += " ORDER BY T.GROUP_ID_1";
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
	var sql = "SELECT DISTINCT T.UNIT_ID,T.UNIT_NAME FROM  PMRT.TAB_MRT_INTEGRAL_DEV_REPORT T WHERE 1=1 ";
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" AND T.GROUP_ID_1="+code+"'";
		}else if(orgLevel==3){
			sql+=" AND T.UNIT_ID='"+code+"'";
		}else{
			sql+=" AND 1=2";
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	sql += " ORDER BY T.UNIT_ID";
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
		alert("获取营服中心信息失败！");
	}
}
function getSumSql(){
	var s="";
	for(var i=0;i<field.length;i++){
		if(s.length>0){
				s+=",";
	    }
		s+="SUM("+field[i]+") "+field[i];
	}
	return s+" FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT PARTITION(p"+time+")";
}
function showLevelExp(){
	var url = $("#ctx").val()+"/portal/socialChannels/jsp/tab_mrt_integral_dev_report_explain.jsp";
	art.dialog.open(url,{
		id:'bindPersonDialog',
		width:'800px',
		height:'400px',
		lock:true,
		resize:false
	});
}