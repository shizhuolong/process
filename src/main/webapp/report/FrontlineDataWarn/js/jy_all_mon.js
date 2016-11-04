var field=["THIS_DEV_COUNTS","LAST_DEV_COUNTS","DEV_MON_RATE","DEV_COMPLETE_RATE","DEV_RANK","THIS_ACC_COUNTS","LAST_ACC_COUNTS","ACC_RATE","THIS_SR","LAST_SR","SR_MON_RATE","SR_COMPLETE_RATE","SR_RANK","THIS_YJ","LAST_YJ","YJ_RATE","THIS_QDBT","LAST_QDBT","QDBT_RATE","THIS_ZDBT","LAST_ZDBT","ZDBT_RATE","THIS_CCB","LAST_CCB","CCB_RATE","THIS_FZ","LAST_FZ","FZ_RATE","THIS_SDWY","LAST_SDWY","SDWY_RATE","THIS_GGXC","LAST_GGXC","GGXC_RATE","THIS_JRCB","LAST_JRCB","JRCB_RATE","THIS_YWYP","LAST_YWYP","YWYP_RATE","THIS_CLSY","LAST_CLSY","CLSY_RATE","THIS_ZDF","LAST_ZDF","ZDF_RATE","THIS_CLF","LAST_CLF","CLF_RATE","THIS_TXF","LAST_TXF","TXF_RATE","THIS_ALL","LAST_ALL","ALL_RATE","THIS_QF","LAST_QF","QF_RATE","THIS_ML","LAST_ML","ML_RATE","ML_RANK"];
var title=[["组织架构","用户发展数","","","用户发展完成率","","出账用户数","","","出账收入","","","出账收入完成率","","佣金","","","渠道补贴","","","终端补贴","","","卡成本","","","营业厅房租","","","水电物业费","","","广告宣传费","","","客户接入成本（含开通费及终端）","","","业务用品印制及材料费","","","车辆使用费","","","招待费","","","差旅费","","","通信费","","","成本合计","","","欠费","","","毛利","","","毛利排名"],
          ["","本期","上期","环比","完成率","排名","本期","上期","环比","本期","上期","环比","完成率","排名","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比",""]];

var report=null;
var qdate="";
var orderBy="";
$(function(){
	 qdate=$("#month").val();
	 
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
			var hq_name=$.trim($("#hq_name").val());
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=2";
				}else if(orgLevel==3){
					preField="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=3 AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){
					preField="SELECT HQ_HR ROW_ID,HQ_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=4 AND UNIT_ID='"+code+"'";
				}else if(orgLevel==5){
					preField="SELECT HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=5 AND HQ_HR='"+code+"'";
				}else if(orgLevel==8){
					preField="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=3 AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==9){
					preField="SELECT HQ_HR ROW_ID,HQ_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=4 AND UNIT_ID='"+code+"'";
				}else if(orgLevel==10){
					preField="SELECT HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=5 AND HQ_HR='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}else{
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   
					preField="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=1";
				}else if(orgLevel==2){//市,进去看地市
					preField="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=2 AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心,进去看营服
					preField="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					where+=" AND GROUP_TYPE=3 AND UNIT_ID IN("+_unit_relation(code)+") ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			orgLevel++;
			
			if(regionCode!=''){
				if(orgLevel==2){//省点查询
					preField="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
					where=" WHERE 1=1 AND GROUP_TYPE=2 AND GROUP_ID_1='"+regionCode+"'";
					orgLevel=8;
				}else if(orgLevel==3){//市点查询
					preField="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
					where=" WHERE 1=1 AND GROUP_TYPE=2 AND GROUP_ID_1='"+regionCode+"'";
					orgLevel=8;
				}else if(orgLevel==4){//营服点查询
					orgLevel=8;
				}
				where+=" AND GROUP_ID_1 = '"+regionCode+"'";
			}
			if(unitCode!=''){
				if(orgLevel==8){//所有层级点查询
					preField="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
					where=" WHERE 1=1 AND GROUP_TYPE=3 AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
					orgLevel=9;
				}
				where+=" AND UNIT_ID = '"+unitCode+"'";
			}
			if(hq_name!=''){
				if(orgLevel!=11){
					preField="SELECT HQ_HR ROW_ID,HQ_NAME ROW_NAME,";
					where=" WHERE 1=1 AND GROUP_TYPE=4 AND HQ_NAME LIKE '%"+hq_name+"%'";
					orgLevel=10;
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
	var where=' WHERE GROUP_TYPE = 5';
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_HR,HQ_CHAN_CODE";
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hq_name=$.trim($("#hq_name").val());
	
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
	if(hq_name!=''){
		where+=" AND HQ_NAME LIKE '%"+hq_name+"%'";
	}
	
	var sql =  getDownSql()+where+orderBy;
	showtext = '经营损益月报表' + qdate;
	var title=[["组织架构","","","","用户发展数","","","用户发展完成率","","出账用户数","","","出账收入","","","出账收入完成率","","佣金","","","渠道补贴","","","终端补贴","","","卡成本","","","营业厅房租","","","水电物业费","","","广告宣传费","","","客户接入成本（含开通费及终端）","","","业务用品印制及材料费","","","车辆使用费","","","招待费","","","差旅费","","","通信费","","","成本合计","","","欠费","","","毛利","","","毛利排名"],
    ["地市","营服","人员","渠道","本期","上期","环比","完成率","排名","本期","上期","环比","本期","上期","环比","完成率","排名","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比","本期","上期","环比",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel){
 return field.join(",")+" FROM PMRT.TB_MRT_JY_ALL_MON PARTITION(P"+qdate+")";
}

function getDownSql(){
    return "SELECT                        "+
	"       GROUP_ID_1_NAME               "+
	"      ,UNIT_NAME                     "+
	"      ,HQ_NAME                       "+
	"      ,HQ_CHAN_NAME,                 "+
	    field.join(",")                    +
	" FROM PMRT.TB_MRT_JY_ALL_MON PARTITION(P"+qdate+")";
}