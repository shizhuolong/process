var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","PAY_CHNL_ID","PAY_CHNL_NAME","CHANNEL_ID","CHANNEL_NAME","PAY_MONTH","SETT_CYCLE","REMAIN_FEE","CAN_PAY_FEE","BAD_FEE","ALREADY_PAY_FEE"];
var title=[["账期","地市分公司","结算渠道","结算对象名称","发展渠道编码","发展渠道名称","支付账期","佣金账期","未支付总额","可发起净额","在途净额","已支付成功金额"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{eq:5,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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
	
	
	var dealDate=$("#dealDate").val();
	//支付账期
	var payDate = $("#payDate").val();
	//佣金账期
	var comDate = $("#comDate").val();
	var regionCode=$("#regionCode").val();
	var channelCode=$.trim($("#channelCode").val());
	var sql = 	"SELECT T.DEAL_DATE,                      "+
				"       T.GROUP_ID_1_NAME,                "+
				"       T.PAY_CHNL_ID,                    "+
				"       T.PAY_CHNL_NAME,                  "+
				"       T.CHANNEL_ID,                     "+
				"       T.CHANNEL_NAME,                   "+
				"       T.PAY_MONTH,                      "+
				"       T.SETT_CYCLE,                     "+
				"       T.REMAIN_FEE,                     "+
				"       T.CAN_PAY_FEE,                    "+
				"       T.BAD_FEE,                        "+
				"       T.ALREADY_PAY_FEE                 "+
				"  FROM PMRT.TAB_MRT_PAY_REMAIN_DETAIL T "+
				" WHERE T.DEAL_DATE = '"+dealDate+"'      ";


	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else if(orgLevel==4){
		sql+=" AND T.GROUP_ID_4='"+code+"'";
	}
	//条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(payDate!=''){
		sql += " AND T.PAY_MONTH ='"+payDate+"'";
	}
	if(comDate!=''){
		sql += " AND T.SETT_CYCLE ='"+comDate+"'";
	}
	if(channelCode!=''){
		sql+=" AND T.CHANNEL_ID ='"+channelCode+"'";
	}
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	/*///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
*/	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

 
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	//var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","HR_ID_NAME","FD_CHNL_ID","DEV_CHNL_NAME","FEE","INIT_ID","BD_TYPE"];
	var title=[["账期","地市分公司","结算渠道","结算对象名称","发展渠道编码","发展渠道名称","支付账期","佣金账期","未支付总额","可发起净额","在途净额","已支付成功金额"]];

	var dealDate=$("#dealDate").val();
	//支付账期
	var payDate = $("#payDate").val();
	//佣金账期
	var comDate = $("#comDate").val();
	var regionCode=$("#regionCode").val();
	var channelCode=$.trim($("#channelCode").val());
	var sql = 	"SELECT T.DEAL_DATE,                      "+
				"       T.GROUP_ID_1_NAME,                "+
				"       T.PAY_CHNL_ID,                    "+
				"       T.PAY_CHNL_NAME,                  "+
				"       T.CHANNEL_ID,                     "+
				"       T.CHANNEL_NAME,                   "+
				"       T.PAY_MONTH,                      "+
				"       T.SETT_CYCLE,                     "+
				"       T.REMAIN_FEE,                     "+
				"       T.CAN_PAY_FEE,                    "+
				"       T.BAD_FEE,                        "+
				"       T.ALREADY_PAY_FEE                 "+
				"  FROM PMRT.TAB_MRT_PAY_REMAIN_DETAIL T "+
				" WHERE T.DEAL_DATE = '"+dealDate+"'      ";


	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else if(orgLevel==4){
		sql+=" AND T.GROUP_ID_4='"+code+"'";
	}
	//条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(payDate!=''){
		sql += " AND T.PAY_MONTH ='"+payDate+"'";
	}
	if(comDate!=''){
		sql += " AND T.SETT_CYCLE ='"+comDate+"'";
	}
	if(channelCode!=''){
		sql+=" AND T.CHANNEL_ID ='"+channelCode+"'";
	}
	showtext = '渠道费用结余报表-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



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
            //listUnits(d[0].GROUP_ID_1);
        } else {
            h += '<option value="" selected>请选择</option>';
            for (var i = 0; i < d.length; i++) {
                h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
            }
        }
        var $area = $("#regionCode");
        var $h = $(h);
        $area.empty().append($h);
       /* $area.change(function() {
            listUnits($(this).attr('value'));
        });*/
    } else {
        alert("获取地市信息失败");
    }
}

/************查询营服中心***************/
/*function listUnits(region){
    var $unit=$("#unitCode");
    var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1 ";
    if(region!=''){
        sql+=" AND T.GROUP_ID_1='"+region+"' ";
        //权限
        var orgLevel=$("#orgLevel").val();
        var code=$("#code").val();
        *//**查询营服中心编码条件是有地市编码，***//*
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
}*/

