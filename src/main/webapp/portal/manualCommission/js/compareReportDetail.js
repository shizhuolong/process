var nowData = [];
var field ;
var title;
var orderBy = '';
var report = null;
$(function() {
		field=[ "DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","DEV_CHNL_ID","DEV_CHNL_NAME","ITEM","BD_TYPE_ID","BD_TYPE","INIT_NUM","INIT_FEE","SUCCESS_NUM","SUCCESS_FEE","FAIL_NUM","FAIL_FEE_YL","FAIL_FEE_SL","FAIL_FEE_XY","INIT_ID_JZ","FEE_JZ","INIT_ID_YS","FEE_YS","IS_SUCCESS","REMARKS" ];
		title= [ [ "账期","地市","营服","渠道编码","渠道名","科目","比对项目","比对备注","工单数","工单金额","成功工单数","成功工单金额","失败工单数","应录金额","实录金额","差异金额","集中工单号","集中工单金额","原始工单号","原始工单金额","比对代码","比对结果" ] ];
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
//			orderBy = " order by " + field[index] + " " + type + " ";
//			search(0);
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
	/*$("#workOrder").keyup(function(){
		var workOrder = $("#workOrder").val();
		if(workOrder!=''){
			queryWorkOrder();	
		}
	});*/
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

/*function  queryWorkOrder(){
	var workOrder = $("#workOrder").val();
	var dealDate = $("#dealDate").val();
	var sql="SELECT INIT_ID_JZ                        "+
			"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T"+
			" WHERE DEAL_DATE = "+dealDate+"          "+
			" AND T.INIT_ID_JZ LIKE '%"+workOrder+"%' ";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length != 0) {overflow:hidden;
			h += '<div style="width:170px;height:80px; overflow:scroll; border:1px solid;">';
			for (var i = 0; i < d.length; i++) {
				h += '<p>'+d[i].INIT_ID_JZ+'</p>';
			}
		}
		h+="</div>";
		var $area = $("#showWorkOrder");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).attr('value'));
		});
	}
}
	*/

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var dealDate = $("#dealDate").val();
	var channelCode = $("#channelCode").val();
	var regionCode =$("#regionCode").val();
	var unitCode =$("#unitCode").val();
	var workOrder = $("#workOrder").val();
//条件
	var sql ="SELECT T.DEAL_DATE,                        "+
				"       T.GROUP_ID_1_NAME,                  "+
				"       T.UNIT_NAME,                        "+
				"       T.DEV_CHNL_ID,                      "+
				"       T.DEV_CHNL_NAME,                    "+
				"       T.ITEM,                             "+
				"       T.BD_TYPE_ID,                       "+
				"       T.BD_TYPE,                          "+
				"       T.INIT_NUM,                         "+
				"       T.INIT_FEE,                         "+
				"       T.SUCCESS_NUM,                      "+
				"       T.SUCCESS_FEE,                      "+
				"       T.FAIL_NUM,                         "+
				"       T.FAIL_FEE_YL,                      "+
				"       T.FAIL_FEE_SL,                      "+
				"       T.FAIL_FEE_XY,                      "+
				"       T.INIT_ID_JZ,                       "+
				"       T.FEE_JZ,                           "+
				"       T.INIT_ID_YS,                       "+
				"       T.FEE_YS,                           "+
				"       T.IS_SUCCESS,                       "+
				"       T.REMARKS                           "+
				"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T  "+
				" WHERE DEAL_DATE = '"+dealDate+"'";
	if(''!=regionCode){
		sql+=" AND T. GROUP_ID_1 = '"+regionCode+"'";
	}
	if(''!=unitCode){
		sql+=" AND T.UNIT_ID = '"+unitCode+"'";
	}
	if(''!=channelCode){
		sql+=" AND T.DEV_CHNL_ID = '"+channelCode+"'";
	}
	if(''!=workOrder){
		sql+=" AND T.INIT_ID_JZ LIKE'%"+workOrder+"%'";
	}
	var csql = sql;
	/*old*/
	/*var cdata = query("select count(*) total " + csql);*/
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	orderBy=" ORDER BY T.DEV_CHNL_ID";
	if (orderBy != '') {
		sql += orderBy;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
//function roundN(number,fractionDigits){   
//    with(Math){   
//        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
//    }   
//}   


/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate = $("#dealDate").val();
	var channelCode = $("#channelCode").val();
	var regionCode =$("#regionCode").val();
	var unitCode =$("#unitCode").val();
	var workOrder = $("#workOrder").val();
//条件
	var sql ="SELECT T.DEAL_DATE,                        "+
				"       T.GROUP_ID_1_NAME,                  "+
				"       T.UNIT_NAME,                        "+
				"       T.DEV_CHNL_ID,                      "+
				"       T.DEV_CHNL_NAME,                    "+
				"       T.ITEM,                             "+
				"       T.BD_TYPE_ID,                       "+
				"       T.BD_TYPE,                          "+
				"       T.INIT_NUM,                         "+
				"       T.INIT_FEE,                         "+
				"       T.SUCCESS_NUM,                      "+
				"       T.SUCCESS_FEE,                      "+
				"       T.FAIL_NUM,                         "+
				"       T.FAIL_FEE_YL,                      "+
				"       T.FAIL_FEE_SL,                      "+
				"       T.FAIL_FEE_XY,                      "+
				"       T.INIT_ID_JZ,                       "+
				"       T.FEE_JZ,                           "+
				"       T.INIT_ID_YS,                       "+
				"       T.FEE_YS,                           "+
				"       T.IS_SUCCESS,                       "+
				"       T.REMARKS                           "+
				"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T  "+
				" WHERE DEAL_DATE = '"+dealDate+"'";
	if(''!=regionCode){
		sql+=" AND T. GROUP_ID_1 = '"+regionCode+"'";
	}
	if(''!=unitCode){
		sql+=" AND T.UNIT_ID = '"+unitCode+"'";
	}
	if(''!=channelCode){
		sql+=" AND T.DEV_CHNL_ID = '"+channelCode+"'";
	}
	if(''!=workOrder){
		sql+=" AND T.INIT_ID_JZ LIKE'%"+workOrder+"%'";
	}
	title= [ [ "账期","地市","营服","渠道编码","渠道名","科目","比对项目","比对备注","工单数","工单金额","成功工单数","成功工单金额","失败工单数","应录金额","实录金额","差异金额","集中工单号","集中工单金额","原始工单号","原始工单金额","比对代码","比对结果"] ];
	showtext = '对比报表明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function listRegions(){
	var sql=" SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE  T WHERE 1=1 ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var region =$("#region").val();
	if(orgLevel==1){
		sql+="";
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1='"+code+"'";
	}else{
		sql+=" and T.GROUP_ID_1='"+region+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1"
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
		var $area = $("#regionCode");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).attr('value'));
		});
	} else {
		alert("获取地市信息失败");
	}
}

/************查询营服中心***************/
function listUnits(region){
	var $unit=$("#unitCode");
	var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1 ";
	if(region!=''){
		sql+=" AND T.GROUP_ID_1='"+region+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		/**查询营服中心编码条件是有地市编码，***/
		if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else if(orgLevel==4){
			sql+=" AND 1=2";
		}else{
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	
	sql+=" ORDER BY T.UNIT_ID"
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
		alert("获取基层单元信息失败");
	}
}