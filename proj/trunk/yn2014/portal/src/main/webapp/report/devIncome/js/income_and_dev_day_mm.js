var field=[
   "LAST_DEV_2G_NUM","DEV_2G_NUM","MM_DEV_2G_NUM",
   "LAST_DEV_3G_NUM","DEV_3G_NUM","MM_DEV_3G_NUM",
   "LAST_DEV_4G_NUM","DEV_4G_NUM","MM_DEV_4G_NUM",
   "LAST_DEV_BB_NUM","DEV_BB_NUM","MM_DEV_BB_NUM",
   "LAST_DEV_ZZX_NUM","DEV_ZZX_NUM","MM_DEV_ZZX_NUM",
   "LAST_DEV_NET_NUM","DEV_NET_NUM","MM_DEV_NET_NUM",
   "LAST_DEV_2G_NUM1","DEV_2G_NUM1","MM_DEV_2G_NUM1",
   "LAST_DEV_3G_NUM1","DEV_3G_NUM1","MM_DEV_3G_NUM1",
   "LAST_DEV_4G_NUM1","DEV_4G_NUM1","MM_DEV_4G_NUM1",
   "LAST_DEV_BB_NUM1","DEV_BB_NUM1","MM_DEV_BB_NUM1",
   "LAST_DEV_ZZX_NUM1","DEV_ZZX_NUM1","MM_DEV_ZZX_NUM1",
   "LAST_DEV_NET_NUM1","DEV_NET_NUM1","MM_DEV_NET_NUM1",
   "LAST_SR_2G_NUM","SR_2G_NUM","MM_SR_2G_NUM",
   "LAST_SR_3G_NUM","SR_3G_NUM","MM_SR_3G_NUM",
   "LAST_SR_4G_NUM","SR_4G_NUM","MM_SR_4G_NUM",
   "LAST_SR_BB_NUM","SR_BB_NUM","MM_SR_BB_NUM",
   "LAST_SR_ZZX_NUM","SR_ZZX_NUM","MM_SR_ZZX_NUM",
   "LAST_SR_NET_NUM","SR_NET_NUM","MM_SR_NET_NUM"
    ];

function getSumField(){
	var fs = "";
	for (var i = 0; i < field.length; i++) {
		if (fs.length > 0) {
			fs += ",";
		}
		if(field[i].startWith("MM_")){
			var f=field[i].substring(3);
			fs += "case sum(LAST_" + f
					+ ") when 0 then '-%' else to_char((nvl(sum(" + f
					+ "),0)-sum(LAST_" + f + "))*100/sum(LAST_"
					+ f + "),'fm99999999999990.00')||'%' end "
					+ field[i];
		} else {
			fs += "sum(" + field[i] + ") " + field[i];
		}
	}

	return fs;
}
var orderBy='';	
$(function(){
	
	var sumSql=getSumField();
	var report=new LchReport({
		title:[
["营销架构","2G新发展用户数","","","3G新发展用户数","","","4G新发展用户数","","","宽带新发展用户数","","","专租线新发展用户数","","","固化新发展用户数","","","2G累计发展量","","","3G累计发展量","","","4G累计发展量","","","宽带累计发展量","","","专租线累计发展量","","","固话累计发展量","","","2G出账收入","","","3G出账收入","","","4G出账收入","","","宽带出账收入","","","专租线出账收入","","","固化出账收入","",""]
,["",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比",
"昨日","今日","环比"]
		],
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN},{array:[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54],css:LchReport.SUM_STYLE}],
		rowParams:["ROW_ID","PER_TYPE"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" order by row_name "+type+" ";
			}else if(index>0){
				orderBy=" order by "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
			$("#lch_DataBody").find("TR").each(function(){
				for(var i=1;i<=18;i++){
				 var obj=$(this).find("td:eq("+3*i+")");	
				 if(parseFloat(obj.text())>20){
					 obj.css("color","red");
				 };
				}
			});
		},
		afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").each(function(){
				for(var i=1;i<=18;i++){
				 var obj=$(this).find("td:eq("+3*i+")");	
				 if(parseFloat(obj.text())>20){
					 obj.css("background-color","red");
				 };
				}
			});
		},
		getSubRowsCallBack:function($tr){
			if($tr&&$tr.attr("orgLevel")==4){
				showAgentList($tr);
				return null;
			}
			
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var qdate = $.trim($("#month").val());
			var provinceSql="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				
				if(orgLevel==2){//点击市
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//点击营服中心
					preField=" t.AGENT_M_USERID ROW_ID,t.AGENT_M_NAME||'('|| case t.PER_TYPE when '1' then '客户经理' when '2' then '渠道经理' else '小区经理' end ||')' ROW_NAME,t.PER_TYPE ";
					groupBy=' group by t.AGENT_M_USERID,t.AGENT_M_NAME,t.PER_TYPE ';
					where=' where t.unit_id=\''+code+"\' ";
				}else if(orgLevel>=4){//点击渠道经理
					preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME ';
					groupBy=' group by t.group_id_4,t.group_id_4_name ';
					if(code=='undefined'){
						where=' where t.AGENT_M_USERID is null and t.unit_id=\''+parentId+'\' ';
					}else{
						where=' where t.AGENT_M_USERID=\''+code+'\' and t.unit_id=\''+parentId+'\' ';
					}
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_0=\''+code+"\' ";
					orgLevel=2;
					
					provinceSql=' union all select t.group_id_0 ROW_ID,\'全省合计\' ROW_NAME,'+sumSql+' from PMRT.TAB_MRT_TARGET_CH_DAY t ';
					provinceSql+=' where t.GROUP_ID_0=\''+code+'\'  and  t.DEAL_DATE='+qdate+' ';
					provinceSql+=' group by t.group_id_0 ';
				}else if(orgLevel==2){//市
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//营服中心
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.unit_id=\''+code+"\' ";
				}else if(orgLevel>=4){//
					preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME';
					groupBy=' group by t.group_id_4,t.group_id_4_name ';
					where=' where t.GROUP_ID_4=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+','+sumSql+' from PMRT.TAB_MRT_TARGET_CH_DAY partition(P'+qdate+') t ';
			
			
			/*if(where!=''&&qdate!=''){
				where+=' and  t.DEAL_DATE='+qdate+' ';
			}*/
			if(where!=''){
				sql+=where;
			}
			if(groupBy!=''){
				sql+=groupBy;
			}
			
			if(provinceSql!=""){
				sql+=provinceSql;
			}
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	report.showAllCols(0);
	$("#lch_DataBody").find("TR").each(function(){
		for(var i=1;i<=18;i++){
		 var obj=$(this).find("td:eq("+3*i+")");	
		 if(parseFloat(obj.text())>20){
			 obj.css("background-color","red");
		 };
		}
	});

	$("#searchBtn").click(function(){
		report.showSubRow();
		report.showAllCols(0);
		$("#lch_DataBody").find("TR").each(function(){
			for(var i=1;i<=18;i++){
			 var obj=$(this).find("td:eq("+3*i+")");	
			 if(parseFloat(obj.text())>20){
				 obj.css("background-color","red");
			 };
			}
		});
	});
});
/**
 * 查看渠道经理下的渠道列表
 * @param 
 * @return
 */
function showAgentList($tr){
	var agentId=$tr.attr("row_id");
	var unitId=$tr.attr("parentId");
	var $unit=$("#lch_DataBody").find("TR[row_id='"+unitId+"']");
	var perType=$tr.attr("PER_TYPE");
	var month = $.trim($("#month").val());
	var text=$unit.find("TD:eq(0)").find("A:eq(0)").text()+"->"+$tr.find("TD:eq(0)").find("A:eq(0)").text();
	var url=$("#ctx").val()+"/report/devIncome/jsp/income_and_dev_day_mm_list.jsp?agentId="+agentId+"&unitId="+unitId+"&month="+month+"&agentType="+perType;
	window.parent.openWindow(text,null,url);
}
/////////////////////////下载开始/////////////////////////////////////////////
function getdownField(){
	var fs = "";

	for (var i = 0; i < field.length; i++) {
		if (fs.length > 0) {
			fs += ",";
		}
		if(field[i].startWith("MM_")){
			var f=field[i].substring(3);
			fs += "case LAST_" + f
					+ " when 0 then '-%' else to_char((nvl(" + f
					+ ",0)-LAST_" + f + ")*100/LAST_" + f
					+ ",'fm99999999999990.00')||'%' end " + field[i];
		} else {
			fs += field[i];
		}
	}

	return fs;
}
function downsAll() {
	var qdate = $.trim($("#month").val());
	
	var preField=' t.group_id_1_name,t.unit_name,t.agent_m_name,case t.PER_TYPE when \'1\' then \'客户经理\' when \'2\' then \'渠道经理\' else \'小区经理\' end  PER_TYPE ,t.HR_ID,t.group_id_4_name,t.state,t.HQ_CHAN_CODE,t.DEAL_DATE ';
	var where='';
	var orderBy=" order by t.group_id_1_name,t.unit_name,t.agent_m_name,t.PER_TYPE ,t.HR_ID,t.group_id_4_name,t.HQ_CHAN_CODE,t.DEAL_DATE ";
	var fieldSql=getdownField();
	
	
	
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " where t.GROUP_ID_0='" + code + "' ";
	} else if (orgLevel == 2) {//市
		where = " where t.GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where = " where t.unit_id='" + code + "' ";
	} else if (orgLevel >= 4) {//
		where = " where t.GROUP_ID_4='" + code + "' ";
	}
	/*if(where!=''&&qdate!=''){
		where+=' and  t.DEAL_DATE='+qdate+' ';
	}*/

	var sql = 'select ' + preField + ',' + fieldSql
			+ ' from PMRT.TAB_MRT_TARGET_CH_DAY partition(P'+qdate+') t';
	if (where != '') {
		sql += where;
	}
	if(orderBy!=''){
		sql="select * from( "+sql+") t "+orderBy;
	}
	
	showtext = '全业务环比日报表-' + qdate;
	var title=[["营销架构","","","","","","","","帐期","2G新发展用户数","","","3G新发展用户数","","","4G新发展用户数","","","宽带新发展用户数","","","专租线新发展用户数","","","固化新发展用户数","","","2G累计发展量","","","3G累计发展量","","","4G累计发展量","","","宽带累计发展量","","","专租线累计发展量","","","固话累计发展量","","","2G出账收入","","","3G出账收入","","","4G出账收入","","","宽带出账收入","","","专租线出账收入","","","固化出账收入","",""],
	           ["地市","营服中心","人员","类型","HR编码","渠道（小区）名称","渠道（小区）状态","渠道（小区）编码","",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比",
	            "昨日","今日","环比"
	            ]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////