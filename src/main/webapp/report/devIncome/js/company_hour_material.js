var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","DAY_1","DAY_2","DAY_3","DAY_4","DAY_5","DAY_6","DAY_7","DAY_8","DAY_9","DAY_10","DAY_11","DAY_12","DAY_13","DAY_14","DAY_15","DAY_16","DAY_17","DAY_18","DAY_19","DAY_20","DAY_21","DAY_22","DAY_23","DAY_24","DAY_25","DAY_26","DAY_27","DAY_28","DAY_29","DAY_30","DAY_31","DAY_ALL"];
var title=[["账期","分公司","营服中心","1日","2日","3日","4日","5日","6日","7日","8日","9日","10日","11日","12日","13日","14日","15日","16日","17日","18日","19日","20日","21日","22日","23日","24日","25日","26日","27日","28日","29日","30日","31日","合计"]];
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
	var sql =getSql();

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

function getSql(){
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$.trim($("#unitCode").val());
	var code =$("#code").val();
	var sql = 	"SELECT DEAL_DATE,                                                     "+
				"       GROUP_ID_1_NAME,                                               "+
				"       UNIT_NAME,                                                     "+
				"       SUM(DAY_1 ) AS DAY_1 ,                                         "+
				"       SUM(DAY_2 ) AS DAY_2 ,                                         "+
				"       SUM(DAY_3 ) AS DAY_3 ,                                         "+
				"       SUM(DAY_4 ) AS DAY_4 ,                                         "+
				"       SUM(DAY_5 ) AS DAY_5 ,                                         "+
				"       SUM(DAY_6 ) AS DAY_6 ,                                         "+
				"       SUM(DAY_7 ) AS DAY_7 ,                                         "+
				"       SUM(DAY_8 ) AS DAY_8 ,                                         "+
				"       SUM(DAY_9 ) AS DAY_9 ,                                         "+
				"       SUM(DAY_10) AS DAY_10,                                         "+
				"       SUM(DAY_11) AS DAY_11,                                         "+
				"       SUM(DAY_12) AS DAY_12,                                         "+
				"       SUM(DAY_13) AS DAY_13,                                         "+
				"       SUM(DAY_14) AS DAY_14,                                         "+
				"       SUM(DAY_15) AS DAY_15,                                         "+
				"       SUM(DAY_16) AS DAY_16,                                         "+
				"       SUM(DAY_17) AS DAY_17,                                         "+
				"       SUM(DAY_18) AS DAY_18,                                         "+
				"       SUM(DAY_19) AS DAY_19,                                         "+
				"       SUM(DAY_20) AS DAY_20,                                         "+
				"       SUM(DAY_21) AS DAY_21,                                         "+
				"       SUM(DAY_22) AS DAY_22,                                         "+
				"       SUM(DAY_23) AS DAY_23,                                         "+
				"       SUM(DAY_24) AS DAY_24,                                         "+
				"       SUM(DAY_25) AS DAY_25,                                         "+
				"       SUM(DAY_26) AS DAY_26,                                         "+
				"       SUM(DAY_27) AS DAY_27,                                         "+
				"       SUM(DAY_28) AS DAY_28,                                         "+
				"       SUM(DAY_29) AS DAY_29,                                         "+
				"       SUM(DAY_30) AS DAY_30,                                         "+
				"       SUM(DAY_31) AS DAY_31,                                         "+
				"       SUM(DAY_ALL) AS  DAY_ALL                                       "+
				"  FROM PMRT.TAB_MRT_BMS_FAV_INCOME_REPORT PARTITION(P"+dealDate+")    "+
				" WHERE 1=1 ";
	


	// 权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
	
	}else if(orgLevel==2){
	sql+=" AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
	sql+=" AND T.UNIT_ID='"+code+"'";
	}else{
	sql+=" AND 1=2";
	}
	// 条件查询
	if(regionCode!=''){
	sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
	sql+=" AND UNIT_ID ='"+unitCode+"'";
	}
	sql+=" GROUP BY DEAL_DATE, GROUP_ID_1, GROUP_ID_1_NAME, UNIT_ID, UNIT_NAME  "+
	" ORDER BY GROUP_ID_1,UNIT_ID  ";
	return sql;
}
 
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	//var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","HR_ID_NAME","FD_CHNL_ID","DEV_CHNL_NAME","FEE","INIT_ID","BD_TYPE"];
	var title=[["账期","分公司","营服中心","1日","2日","3日","4日","5日","6日","7日","8日","9日","10日","11日","12日","13日","14日","15日","16日","17日","18日","19日","20日","21日","22日","23日","24日","25日","26日","27日","28日","29日","30日","31日","合计"]];

	var sql=getSql();
	showtext = '宽带工时材料费日报表-'+dealDate;
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

