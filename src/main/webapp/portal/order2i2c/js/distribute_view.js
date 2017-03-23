var orders=[];
var teams=[];
var dis=[];
//获取数据
function query(sql){
	var ls=[];
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
           "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			ls=data;
	   		}
	    }
	});
	return ls;
}

$(function() {
	getAllOrders();
	initTeam();
});
function getAllOrders(){
	var sql="select * from PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL d where d.work_no='"+workNo+"'";
	orders=query(sql);
}
function initTeam(){
	var sql="";
	 sql+=" select  d.team_id ID,d.team_name name,count(d.order_no) order_num                ";
	 sql+=" from PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL d                                         ";
	 sql+=" where d.work_no='"+workNo+"'                                                     ";
	 sql+=" group by d.team_id,d.team_name                                                   ";
	teams=query(sql);
	
	for(var i=0;i<teams.length;i++){
		sql="";
		sql+="  select  d.name_id ID,d.name name,count(d.order_no) order_num        ";
		sql+="  from PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL d                            ";
		sql+="  where d.work_no='"+workNo+"'                                        ";
		sql+="  and d.team_id='"+teams[i].ID+"' group by d.name_id,d.name           ";
		teams[i].children=query(sql);
	}
	
	var t = "<li><span>订单总数</span><br/><a id='team_all' href='javascript:void(0);' onclick='showDetail(\"\",0)'>" + orders.length + "</a>";
	t += "<ul>"
	for ( var i = 0; i < teams.length; i++) {
		var team = teams[i];
		t += "<li><span>" + team.NAME + "</span><br/><a teamId='" + team.ID
				+ "'  href='javascript:void(0);' onclick='showDetail(\""+team.ID+"\",1)'>"+team.ORDER_NUM+"</a>";
		if (team.children && team.children.length) {
			t += "<ul>";
			for ( var j = 0; j < team.children.length; j++) {
				var subTeam = team.children[j];
				t += "<li><span>" + subTeam.NAME + "</span><br/><a teamId='"
						+ subTeam.ID + "'  href='javascript:void(0);' onclick='showDetail(\""+subTeam.ID+"\",2)'>"+subTeam.ORDER_NUM+"</a>";
			}
			t += "</ul>";
		}
		t += "</li>";
	}
	t += "</ul>"
	t += "</li>";
	$("#team").empty().html(t);
	$("#team").jOrgChart( {
		chartElement : '#chart',
		dragAndDrop : true
	});
	
	
	sql="select t.ass_way,t.inner_num from PODS.TAB_ODS_2I2C_ASS_TASK t where t.work_no='"+workNo+"'";
	var work=query(sql);
	var disType=work[0]["ASS_WAY"];
	var disValue=work[0]["INNER_NUM"];
	if(1==disType){
		$("#teamDesc").text("内部团队订单量百分比[0-100]（%）:");
	}else{
		$("#teamDesc").text("内部团队订单绝对值量[0-"+orders.length+"]:");
	}
	$("#disValue").val(disValue);
	$("input:radio[name='disType']").eq(disType-1).attr("checked","checked");
}
function showDetail(teamId,teamType){
	var url=path+"/portal/order2i2c/jsp/distribute_view_list.jsp?workNo="+workNo+"&teamType="+teamType+"&teamId="+teamId;
	art.dialog.open(url,{
		title:'分配明细',
		width:'70%',
		height:380
	});
}
function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}