var field=["SL_CRE_RATE","SL_SLL_RATE","ALL_SLL","SL_JF","FW_JF","ZZ_JF","ALL_SL_CRE","ALL_UNIT_CRE","ALL_UNIT_MONEY","LS_ALL_SLL","LS_SL_JF","LS_FW_JF","LS_ZZ_JF","LS_ALL_SL_CRE","LS_ALL_UNIT_CRE","LS_ALL_UNIT_MONEY"];
var orderBy='';	
$(function(){
	var report=new LchReport({
		title:[
["组织架构","总积分波动","受理量波动","本月受理量","本月基础积分","本月服务积分","本月增值业务积分","本月受理原始积分","本月调节受理积分","本月积分提成","上月受理量","上月基础积分","上月服务积分","上月增值业务积分","上月受理原始积分","上月调节受理积分","上月积分提成"]
		],
		field:["ROW_NAME"].concat(field),
		css:[
		     {gt:0,lt:2,css:{color:"#FF4500"}},
		     {gt:0,css:{textAlign:"right"}}
		    ],
		rowParams:["ROW_ID","ROW_NAME"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			if($tr&&$tr.attr("orgLevel")==4){
				var qdate = $.trim($("#time").val());
				var hrId=$tr.attr("row_id");
				var user=$tr.attr("row_name");
				var sql="select * from pmrt.tb_mrt_sljf_detail_alert_mon where hr_id='"+hrId+"' and thisny='"+qdate+"'";
				var d=query(sql);
				if(d&&d.length){
					var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
						+"<table><thead class='lch_DataHead'><tr><th>受理业务编码</th><th>受理业务描述</th><th>本月受理量 </th><th>上月受理量 </th></tr></thead><tbody class='lch_DataBody'>";
						for(var i=0;i<d.length;i++){
							//<th>本月账期</th><th>上月账期</th><th>HR编码</th>
								/*h+="<tr><td>"+isNull(d[i]["THISNY"])
								+"</td><td>"+isNull(d[i]["LASTNY"])
								+"</td><td>"+isNull(d[i]["HR_ID"])*/
								h+="</td><td>"+isNull(d[i]["BIGBUSI_CODE"])
								+"</td><td>"+isNull(d[i]["BIGBUSI_DESC"])
								+"</td><td>"+isNull(d[i]["THIS_SLL"])
								+"</td><td>"+isNull(d[i]["LAST_SLL"])
								+"</td></tr>";
						}
						h+="</tbody>"
						+"</table>"
						+"</div>";
						if(d.length>=1){
							art.dialog({
							    title: '月受理人员明细波动 -'+user+"("+qdate+")",
							    content: h,
							    padding: 0,
							    lock:true
							});
						}
				}
				return null;
			}
			
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var qdate = $.trim($("#time").val());
			var userName=$("#userName").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				
				if(orgLevel==2){//点击市
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//点击营服中心
					preField=" t.HR_NO ROW_ID,t.USER_NAME ROW_NAME ";
					groupBy=' group by t.HR_NO,t.USER_NAME ';
					where=' where t.unit_id=\''+code+"\' ";
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
					where=' where 1=1 ';//
					orgLevel=2;
				}else if(orgLevel==2){//市
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//营服中心
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.unit_id=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+','+getSumSql(field)+' from pmrt.tb_mrt_sljf_alert_mon t ';
			
			
			if(where!=''&&qdate!=''){
				where+=' and  t.THISNY='+qdate+' ';
			}
			if(where!=''&&userName!=''){
				where+=" and t.USER_NAME like '%"+userName+"%' ";
			}
			if(where!=''){
				sql+=where;
			}
			if(groupBy!=''){
				sql+=groupBy;
			}
			if(orderBy!=''){
				sql+=orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
});
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function getSumSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		if(field[i]=='SL_CRE_RATE'){
			s += "trim(to_char((SUM(" + field[6]
			+ ")-sum("+ field[13]+"))/sum("+ field[13]+"),'9g999g999g999g999g999g999g999g999g990d00')) " + field[i];
		}else if(field[i]=='SL_SLL_RATE'){
			s += "trim(to_char((SUM(" + field[2]
			+ ")-sum("+ field[9]+"))/sum("+ field[9]+"),'9g999g999g999g999g999g999g999g999g990d00')) " + field[i];
		}else{
			s += "trim(to_char(SUM(" + field[i]
			+ "),'9g999g999g999g999g999g999g999g999g990d00')) " + field[i];
		}
	}
	return s;

}
function getSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		s += field[i];
	}
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var qdate = $.trim($("#time").val());
	var userName=$("#userName").val();
	
	var preField=' t.group_id_1_name,t.unit_name,t.user_name,t.HR_NO,t.THISNY,t.LASTNY ';
	var where='';
	var orderBy=" order by t.group_id_1_name,t.unit_name,t.user_name,t.HR_NO,t.THISNY,t.LASTNY ";
	var fieldSql=field.join(",");
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " where 1=1 ";
	} else if (orgLevel == 2) {//市
		where = " where t.GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where = " where t.unit_id='" + code + "' ";
	} else if (orgLevel >= 4) {//
		where = " where 1=2 ";
	}
	if(where!=''&&qdate!=''){
		where+=' and  t.THISNY='+qdate+' ';
	}
	if(where!=''&&userName!=''){
		where+=" and t.USER_NAME like '%"+userName+"%' ";
	}

	var sql = 'select ' + preField + ',' + fieldSql
			+ ' from pmrt.tb_mrt_sljf_alert_mon t';
	if (where != '') {
		sql += where;
	}
	if(orderBy!=''){
		sql += orderBy;
	}
	
	showtext = '月受理波动报表-' + qdate;
	var title=[["地市名称","营服名称","姓名","HR编码","本月账期","上月账期","总积分波动","受理量波动","本月受理量","本月基础积分","本月服务积分","本月增值业务积分","本月受理原始积分","本月调节受理积分","本月积分提成","上月受理量","上月基础积分","上月服务积分","上月增值业务积分","上月受理原始积分","上月调节受理积分","上月积分提成"]];

	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////