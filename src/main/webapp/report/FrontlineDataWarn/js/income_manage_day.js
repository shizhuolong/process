var field=["DEV_NUM","DEV_LINK_RATIO","DEV_FINISH_RATE","DEV_FINISH_RANK","USER_INCOME_NUM","USER_INCOME_RATIO","ACTIVE_NUM","ACTIVE_NUM_RATIO","INCOME_SW","INCOME_SW_RATIO","DEV_SW","DEV_SW_RATIO","LAST_DEV_NUM","LEAVE_NUM_RATIO","INCOME_NUM","INCOME_NUM_RATIO","INCOME_FINISH_RATE","INCOME_FINISH_RANK"];
var title=[["组织机构","用户发展数","","用户发展数排产目标完成率","","有计费收入用户数","","活跃用户数","","有计费收入用户中三无用户数","","发展用户中三无用户数","","流失用户数","","计费收入","","计费收入排产目标完成率",""],
           ["","本期","环比","完成率","排名","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","完成率","排名"]];

var report=null;
var qdate="";
var orderBy="";
$(function(){
	 qdate=$("#day").val();
	 $("#remark").click(function() {
		$("#remarkDiv").show();
		$("#remarkDiv").dialog({
			title : '口径',
			width : 600,
			height : 350,
			closed : false,
			cache : false,
			modal : false,
			maximizable : true
		});
	});
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
			var code='';
			var orgLevel='';
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
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
					where+=" AND LEV=3 AND UNIT_ID IN("+_unit_relation(code)+") ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			orgLevel++;
			if(regionCode!=''){
				where+=" AND GROUP_ID_1 = '"+regionCode+"'";
			}
			if(unitCode!=''){
				if(orgLevel>=4){//营服人员点查询，展示渠道
					where=" WHERE LEV=3 AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
				}else{//省级和市级人员如果选了营服点查询，省级查询结果收缩到地市，市级收缩到营服
					where=" WHERE LEV=2 AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
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
	
	$("#searchBtn").click(function(){
		qdate=$("#day").val();
	    report.showSubRow();
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var where=' WHERE LEV = 3';
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	} else {
		
	}
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	
	var sql =  getDownSql()+where+orderBy;
	showtext = '经营日报表' + qdate;
	var title=[["组织机构","","","用户发展数","","用户发展数排产目标完成率","","有计费收入用户数","","活跃用户数","","有计费收入用户中三无用户数","","发展用户中三无用户数","","流失用户数","","计费收入","","计费收入排产目标完成率",""],
	           ["地市","营服","渠道","本期","环比","完成率","排名","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","本期","环比","完成率","排名"]];
	downloadExcel(sql,title,showtext);
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