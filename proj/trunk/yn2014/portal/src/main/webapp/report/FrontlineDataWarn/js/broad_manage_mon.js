var field=["BROAD_NUM","BROAD_NUM_RATIO","BROAD_NUM_RANK","XDSL_BROAD_NUM","LAN_BROAD_NUM","EOC_BROAD_NUM","FTTH_BROAD_NUM","SPEED_LESS_10","SPEED_LESS_20","SPEED_LESS_50","SPEED_GREAT_50","SMART_BSS_NUM","SMART_CBSS_NUM","SMART_NUM","SMART_NUM_RATIO","SMART_NUM_RANK","TV_NUM","TV_NUM_RATIO","ACCT_BROAD_NUM","ACCT_BROAD_NUM_RATIO","ACCT_BROAD_NUM_RANK","ACCT_XDSL_BROAD_NUM","ACCT_LAN_BROAD_NUM","ACCT_EOC_BROAD_NUM","ACCT_FTTH_BROAD_NUM","ACCT_SPEED_LESS_10","ACCT_SPEED_LESS_20","ACCT_SPEED_LESS_50","ACCT_SPEED_GREAT_50","ACCT_SMART_BSS_NUM","ACCT_SMART_CBSS_NUM","ACCT_SMART_NUM","ACCT_SMART_NUM_RATIO","ACCT_SMART_NUM_RANK","ACCT_SMART_PERME_RATIO","ACCT_SMART_PERME_RANK","ACCT_TV_NUM","ACCT_TV_PERME_RATIO","ACCT_TV_PERME_RANK","SR_BROAD_NUM","SR_BROAD_NUM_RATIO","SR_BROAD_NUM_RANK","SR_XDSL_BROAD_NUM","SR_LAN_BROAD_NUM","SR_EOC_BROAD_NUM","SR_FTTH_BROAD_NUM","SR_SPEED_LESS_10","SR_SPEED_LESS_20","SR_SPEED_LESS_50","SR_SPEED_GREAT_50","SR_SMART_BSS_NUM","SR_SMART_CBSS_NUM","SR_SMART_NUM","SR_SMART_NUM_RATIO","SR_SMART_NUM_RANK","SR_TV_NUM","SR_TV_NUM_RATIO","SR_TV_NUM_RANK"];
var title=[["组织架构","宽带用户发展数","","","","","","","","","","","智慧沃家用户发展数","","","","","TV用户发展数","","宽带出账用户数","","","","","","","","","","","智慧沃家出账用户数","","","","","","","TV用户出账用户数","","","宽带出账收入","","","","","","","","","","","智慧沃家出账收入","","","","","TV出账收入","",""],
           ["","小计","环比","环比排名","XDSL","LAN","EOC","FTTH","<=10M","10< X<= 20M","20< X<= 50M","X>50M","BSS","CBSS","小计","环比","环比排名","发展数","环比","小计","环比","环比排名","XDSL","LAN","EOC","FTTH","<=10M","10< X<= 20M","20< X<= 50M","X>50M","BSS","CBSS","小计","环比","环比排名","渗透率","渗透率排名","出账用户数","渗透率","渗透率排名","小计","环比","环比排名","XDSL","LAN","EOC","FTTH","<=10M","10< X<= 20M","20< X<= 50M","X>50M","BSS","CBSS","小计","环比","环比排名","出账收入","环比","环比排名"]];

var report=null;
var qdate="";
var orderBy="";
$(function(){
	 qdate=$("#month").val();
	 
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
		qdate=$("#month").val();
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
	showtext = '宽带经营月报' + qdate;
	var title=[["组织架构","","","宽带用户发展数","","","","","","","","","","","智慧沃家用户发展数","","","","","TV用户发展数","","宽带出账用户数","","","","","","","","","","","智慧沃家出账用户数","","","","","","","TV用户出账用户数","","","宽带出账收入","","","","","","","","","","","智慧沃家出账收入","","","","","TV出账收入","",""],
	           ["地市","营服","渠道","小计","环比","环比排名","XDSL","LAN","EOC","FTTH","<=10M","10< X<= 20M","20< X<= 50M","X>50M","BSS","CBSS","小计","环比","环比排名","发展数","环比","小计","环比","环比排名","XDSL","LAN","EOC","FTTH","<=10M","10< X<= 20M","20< X<= 50M","X>50M","BSS","CBSS","小计","环比","环比排名","渗透率","渗透率排名","出账用户数","渗透率","渗透率排名","小计","环比","环比排名","XDSL","LAN","EOC","FTTH","<=10M","10< X<= 20M","20< X<= 50M","X>50M","BSS","CBSS","小计","环比","环比排名","出账收入","环比","环比排名"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel){
 return field.join(",")+" FROM PMRT.TAB_MRT_BROAD_MANAGE_MON PARTITION(P"+qdate+")";
}

function getDownSql(){
    return "SELECT                        "+
	"       GROUP_ID_1_NAME               "+
	"      ,UNIT_NAME                     "+
	"      ,HQ_CHAN_NAME,                  "+
	    field.join(",")                    +
	" FROM PMRT.TAB_MRT_BROAD_MANAGE_MON PARTITION(P"+qdate+")";
}