var field=["DEV_NUM","DEV_LINK_RATIO","DEV_FINISH_RATE","DEV_FINISH_RANK","USER_INCOME_NUM","USER_INCOME_RATIO","ACTIVE_NUM","ACTIVE_NUM_RATIO","INCOME_SW","INCOME_SW_RATIO","DEV_SW","DEV_SW_RATIO","LAST_DEV_NUM","LEAVE_NUM_RATIO","INCOME_NUM","INCOME_NUM_RATIO","INCOME_FINISH_RATE","INCOME_FINISH_RANK"];
var title=[["组织机构","用户发展数","","用户发展数排产目标完成率","","有计费收入用户数","","活跃用户数","","有计费收入用户中三无用户数","","发展用户中三无用户数","","流失用户数","","计费收入","","计费收入排产目标完成率",""],
           ["","本期","环比","完成率","排名","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","完成率","排名"]];

var report=null;
var qdate="";
var orderBy="";
$(function(){
	 listRegions();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		/*lock:1,*/
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" ORDER BY ROW_NAME "+type;
			}else if(index>0){
				orderBy=" ORDER BY "+field[index-1]+" "+type;
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where=' WHERE 1 = 1';
			qdate=$("#day").val();
			var code='';
			var orgLevel='';
			var regionName=$("#regionName").val();
			var unitName=$("#unitName").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					where+=" AND LEV=2 AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					preField="SELECT HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME,";
					where+=" AND LEV=3 AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示地市
					preField="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
					where+=" AND LEV=1";
				}else if(orgLevel==2){//市,进去看营服
					preField="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					where+=" AND LEV=2 AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心,进去看渠道
					preField="SELECT HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME,";
					where+=" AND LEV=3 AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}	
			orgLevel++;
			if(regionName!=''){
				where+=" AND GROUP_ID_1_NAME = '"+regionName+"'";
			}
			if(unitName!=''){
				if(orgLevel>=4){//营服人员点查询，展示渠道
					where=" WHERE LEV=3 AND UNIT_NAME = '"+unitName+"'";
				}else{//省级和市级人员如果选了营服点查询，省级查询结果收缩到地市，市级收缩到营服
					where=" WHERE LEV=2 AND UNIT_NAME = '"+unitName+"'";//营服
				}
				
			}
			
			var sql =preField+getSql()+where;
			
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
	var where=' WHERE LEV = 3';
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where += " AND UNIT_ID='" + code + "' ";
	} else {
		
	}
	if(regionName!=''){
		where+=" AND GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		where+=" AND UNIT_NAME = '"+unitName+"'";
	}
	
	var sql =  getDownSql()+where+orderBy;
	showtext = '经营日报表' + qdate;
	var title=[["组织机构","","","用户发展数","","用户发展数排产目标完成率","","有计费收入用户数","","活跃用户数","","有计费收入用户中三无用户数","","发展用户中三无用户数","","流失用户数","","计费收入","","计费收入排产目标完成率",""],
	           ["地市","营服","渠道","本期","环比","完成率","排名","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","完成率","排名"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function listRegions(){
	var sql="";
	//条件
	var sql = "SELECT DISTINCT T.GROUP_ID_1_NAME FROM PMRT.TAB_MRT_DEV_INCOME_MANAGE_DAY T WHERE 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else{
		sql+=" AND 1=2 ";
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
		$area.empty().append($(h));
		$area.change(function() {
			listUnits($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}
function listUnits(regionName){
	var $unit=$("#unitName");
	var sql = "SELECT DISTINCT T.UNIT_NAME FROM PMRT.TAB_MRT_DEV_INCOME_MANAGE_DAY T WHERE 1=1 AND UNIT_NAME IS NOT NULL";
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
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
		$unit.empty().append($(h));
	} else {
		alert("获取营服信息失败");
	}
}
function getSql(orgLevel){
 return "DEV_NUM                       "+
 "      ,DEV_LINK_RATIO                "+
 "      ,DEV_FINISH_RATE               "+
 "      ,DEV_FINISH_RANK               "+
 "      ,USER_INCOME_NUM               "+
 "      ,USER_INCOME_RATIO             "+
 "      ,ACTIVE_NUM                    "+
 "      ,ACTIVE_NUM_RATIO              "+
 "      ,INCOME_SW                     "+
 "      ,INCOME_SW_RATIO               "+
 "      ,DEV_SW                        "+
 "      ,DEV_SW_RATIO                  "+
 "      ,LAST_DEV_NUM                  "+
 "      ,LEAVE_NUM_RATIO               "+
 "      ,INCOME_NUM                    "+
 "      ,INCOME_NUM_RATIO              "+
 "      ,INCOME_FINISH_RATE            "+
 "      ,INCOME_FINISH_RANK            "+
 "FROM PMRT.TAB_MRT_DEV_INCOME_MANAGE_DAY PARTITION(P"+qdate+")";
}

function getDownSql(){
    return "SELECT                        "+
	"       GROUP_ID_1_NAME               "+
	"      ,UNIT_NAME                     "+
	"      ,HQ_CHAN_NAME                  "+
	"      ,DEV_NUM                       "+
	"      ,DEV_LINK_RATIO                "+
	"      ,DEV_FINISH_RATE               "+
	"      ,DEV_FINISH_RANK               "+
	"      ,USER_INCOME_NUM               "+
	"      ,USER_INCOME_RATIO             "+
	"      ,ACTIVE_NUM                    "+
	"      ,ACTIVE_NUM_RATIO              "+
	"      ,INCOME_SW                     "+
	"      ,INCOME_SW_RATIO               "+
	"      ,DEV_SW                        "+
	"      ,DEV_SW_RATIO                  "+
	"      ,LAST_DEV_NUM                  "+
	"      ,LEAVE_NUM_RATIO               "+
	"      ,INCOME_NUM                    "+
	"      ,INCOME_NUM_RATIO              "+
	"      ,INCOME_FINISH_RATE            "+
	"      ,INCOME_FINISH_RANK            "+
	"FROM PMRT.TAB_MRT_DEV_INCOME_MANAGE_DAY PARTITION(P"+qdate+")";
}