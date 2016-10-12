var nowData;
var title = [["分公司","营服名","渠道经理","渠道名称","渠道编码","代理商","用户名（脱敏）","用户号码","用户ID","欠费","套餐ID","生命周期消费额（不含赠费）","入网时间","近三月平均出账收入（不含赠费）","上月出账收入（不含赠费）","持有终端类型","状态","状态时间","生效活动模式","合约ID","合约失效时间","上月语音适配度","上月流量适配度","适配维系活动ID"]];
var field = ["GROUP_ID_1_NAME","UNIT_NAME","NAME","HQ_CHAN_NAME","HQ_CHAN_CODE","AGENT_NAME","USER_X","DEVICE_NUMBER","SUBSCRIPTION_ID","OWE_FEE","PRODUCT_ID","LIFE_FEE","INNET_DATE","AVG_3_INCOME","LAST_INCOME","TERMINAL_TYPE","STATUS","STATUS_CHARGE_TIME","ACTIVE_SCHEME_TYPE","SCHEME_ID","INACTIVE_TIME","LAST_YUYIN_FIT","LAST_GPRS_FIT","WX_SCHEME_ID"];
var report = null;
var sql = "";
var dealDate = "";
var where="";
var orderBy="";

$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css : [ {
			gt : 7,
			css : LchReport.RIGHT_ALIGN
		} ],
		rowParams : [],
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " ORDER BY " + field[index] + " " + type;
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

	$("#searchBtn").click(function() {
		search(0);
	});
	 $("a").mousemove(function(e){
		   var text=$(this).text();
		   var top = e.pageY+5;
		   var left = e.pageX+5;
		   var sql="";
		   var data;
		   $("#detail").css({
		    "top" : top + "px",
		    "left": left+ "px"
		   });
		 if($(this).attr("name")=="product_id"){
			 sql="SELECT PRODUCT_NAME NAME FROM PTEMP.VIEW_ALL_PRODUCT_INFO WHERE PRODUCT_ID IN("+text+")";
		 }else{
			 sql="SELECT SCHEME_NAME NAME FROM PTEMP.VIEW_ALL_scheme_INFO WHERE SCHEME_ID IN("+text+")";
			
		 }
		 data=query(sql);
		 var name="";
		 if(data){
			 if(data.length == 1){
				 name+=data[0].NAME;
			 }else{
				 for(var i=0;i<data.lenth;i++){
					  if(i==data.length-1){
						  name+=data[i].NAME;
					  }else{
						  name+=data[i].NAME+",";
					  }
				  } 
			 }
		 }
		   $("#detail").text(name);
		   $("#detail").show();
		  });
		  
		  $("a").mouseout(function(){
		   $("#detail").empty().hide();
		  });
});

var pageSize = 15;
// 分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', // 上一页按钮里text
		next_text : '下页', // 下一页按钮里text
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

// 列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	sql = getsql();
	var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql + ")");
	var total = 0;
	if (cdata && cdata.length) {
		total = cdata[0].TOTAL;
	} else {
		return;
	}

	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	
	if(orderBy!=''){
		sql="select * from( "+sql+") t "+orderBy;
	}
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
	report.showSubRow();
	// /////////////////////////////////////////
	// $("#lch_DataHead").find("TH").unbind();
	// $("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	// /////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function() {
		var area = $(this).find("TD:eq(0)").find("A").text();
		if (area)
			$(this).find("TD:eq(0)").empty().text(area);
	});

}

function getsql() {
	dealDate = $("#dealDate").val();
	var regionCode = $("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var device_number = $.trim($("#device_number").val());
	var name = $.trim($("#name").val());
	
	// 权限
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	var order = "";
    where="WHERE 1=1";
	sql = "SELECT GROUP_ID_1_NAME                       "+
	"      ,UNIT_NAME                                   "+
	"      ,NAME                                        "+
	"      ,HQ_CHAN_NAME                                "+
	"      ,HQ_CHAN_CODE                                "+
	"      ,AGENT_NAME                                  "+
	"      ,USER_X                                      "+
	"      ,DEVICE_NUMBER                               "+
	"      ,SUBSCRIPTION_ID                             "+
	"      ,OWE_FEE                                     "+
	"      ,'<a style=\"color:blue;\" name=\"product_id\">'||PRODUCT_ID||'</a>' PRODUCT_ID"+
	"      ,LIFE_FEE                                    "+
	"      ,INNET_DATE                                  "+
	"      ,AVG_3_INCOME                                "+
	"      ,LAST_INCOME                                 "+
	"      ,TERMINAL_TYPE                               "+
	"      ,STATUS                                      "+
	"      ,STATUS_CHARGE_TIME                          "+
	"      ,ACTIVE_SCHEME_TYPE                          "+
	"      ,'<a style=\"color:blue;\" name=\"scheme_id\">'||SCHEME_ID||'</a>' SCHEME_ID"+
	"      ,INACTIVE_TIME                               "+
	"      ,LAST_YUYIN_FIT                              "+
	"      ,LAST_GPRS_FIT                               "+
	"      ,WX_SCHEME_ID                                "+
	"FROM PMRT.TAB_MRT_SUBS_LEAVE_MON PARTITION(P"+dealDate+")";     

	if (regionCode != '') {
		where += " AND GROUP_ID_1='" + regionCode + "'";
	}
	if (unitCode != '') {
		where += " AND UNIT_ID='" + unitCode + "'";
	}
	if (device_number != '') {
		where += " AND DEVICE_NUMBER='" + device_number + "'";
	}
	if (name != '') {
		where += " AND NAME='" + name + "'";
	}
	
	if (orgLevel == 1) {
		order = " ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	} else if (orgLevel == 2) {
		where += " AND GROUP_ID_1='" + code + "'";
		order = " ORDER BY UNIT_ID,HQ_CHAN_CODE";
	} else if (orgLevel == 3) {
		where += " AND UNIT_ID='" + code + "'";
		order = " ORDER BY HQ_CHAN_CODE";
	} else {
		where += " AND 1=2";
	}
	sql+=where+order;
	return sql;
}
function getDownSql(){
	var order = " ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	
	sql= "SELECT GROUP_ID_1_NAME,                         "+
	"       UNIT_NAME,                                    "+
	"       NAME,                                         "+
	"       HQ_CHAN_NAME,                                 "+
	"       HQ_CHAN_CODE,                                 "+
	"       AGENT_NAME,                                   "+
	"       USER_X,                                       "+
	"       DEVICE_NUMBER,                                "+
	"       SUBSCRIPTION_ID,                              "+
	"       OWE_FEE,                                      "+
	"       PRODUCT_NAME,                                 "+
	"       LIFE_FEE,                                     "+
	"       INNET_DATE,                                   "+
	"       AVG_3_INCOME,                                 "+
	"       LAST_INCOME,                                  "+
	"       TERMINAL_TYPE,                                "+
	"       STATUS,                                       "+
	"       STATUS_CHARGE_TIME,                           "+
	"       ACTIVE_SCHEME_TYPE,                           "+
	"       SCHEME_NAME,                                  "+
	"       INACTIVE_TIME,                                "+
	"       LAST_YUYIN_FIT,                               "+
	"       LAST_GPRS_FIT,                                "+
	"       WX_SCHEME                                     "+
	"  FROM PMRT.TAB_MRT_SUBS_LEAVE_MON PARTITION(P"+dealDate+")";
	sql+=where+order;
    return sql;
}
// /////////////////////////地市查询///////////////////////////////////////
function listRegions() {
	var sql = " SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PMRT.TAB_MRT_SUBS_LEAVE_MON T WHERE 1=1 AND T.GROUP_ID_1 IS NOT NULL";
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	if (orgLevel == 1) {

	} else if (orgLevel == 2) {
		sql += " AND T.GROUP_ID_1='" + code + "'";
	} else {
		sql += " AND T.UNIT_ID='" + code + "'";
	}
	sql += " ORDER BY T.GROUP_ID_1";
	var d = query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1 + '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">'
						+ d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionCode");
		$area.empty().append($(h));
		$area.change(function() {
			listUnits($(this).attr('value'));
		});
	} else {
		alert("获取地市信息失败");
	}
}

function listUnits(regionCode) {
	var $unit = $("#unitCode");
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	var sql = "SELECT DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PMRT.TAB_MRT_SUBS_LEAVE_MON T WHERE 1=1 ";
	if (regionCode != '') {
		sql += " AND T.GROUP_ID_1='" + regionCode + "' ";
		if (orgLevel == 1) {

		} else if (orgLevel == 2) {

		} else if (orgLevel == 3) {
			sql += " AND T.UNIT_ID='" + code + "'";
		} else {
			sql += " AND 1=2";
		}
	} else {
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}

	sql += " ORDER BY T.UNIT_ID";
	var d = query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID + '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME
						+ '</option>';
			}
		}
		$unit.empty().append($(h));
	} else {
		alert("获取营服中心信息失败");
	}
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	sql=getDownSql();
	var title = [["分公司","营服名","渠道经理","渠道名称","渠道编码","代理商","用户名（脱敏）","用户号码","用户ID","欠费","套餐","生命周期消费额（不含赠费）","入网时间","近三月平均出账收入（不含赠费）","上月出账收入（不含赠费）","持有终端类型","状态","状态时间","生效活动模式","合约名称","合约失效时间","上月语音适配度","上月流量适配度","适配维系活动"]];
	var showtext = '移动月流失预警清单-' + dealDate;
	downloadExcel(sql, title, showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////
