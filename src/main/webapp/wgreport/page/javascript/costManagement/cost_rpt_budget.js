var click_flag = 0;
var _execute = $.Project.execute; 
var defaultMsgDom = $('#searchTime');
var tablecode = ["grid_type","grid_level","income_total","income_2g", "income_3g","income_gw","budget_total",
                 "comm_amount","qdbt_amount","ads_amount","cus_user_amount","caruse_amount",
                 "entertain_amount","administrative_amount","travel_amount","letter_amount",
                 "house_amount","other_rent_amount","water_amount","property_amount","other_amount"];
var querydate = "";
var enddate = "";
jQuery(function($){
	$("#search").click(searchClick);
	querydate = $("#searchTime").val();
	enddate = $("#endTime").val();
	initTable(); 
	//excel导出
	$("#button_excel").click(downsaction);
	$("#button_all_excel").click(downsAll);
	
});

function initTable(){
	
	var sql = "MAX('—') GRID_TYPE," +
			"MAX('—') GRID_LEVEL," +
			"sum(INCOME_TOTAL) INCOME_TOTAL,"+
			"SUM(T1.INCOME_2G) INCOME_2G," +
			"SUM(T1.INCOME_3G) INCOME_3G," +
			"SUM(T1.INCOME_GW) INCOME_GW," +
			"SUM(T1.BUDGET_TOTAL) BUDGET_TOTAL," +
			"SUM(T1.COMM_AMOUNT) COMM_AMOUNT," +
			"SUM(T1.QDBT_AMOUNT) QDBT_AMOUNT," +
			"SUM(T1.ADS_AMOUNT) ADS_AMOUNT," +
			"SUM(T1.CUS_USER_AMOUNT) CUS_USER_AMOUNT," +
			"SUM(T1.CARUSE_AMOUNT) CARUSE_AMOUNT," +
			"SUM(T1.ENTERTAIN_AMOUNT) ENTERTAIN_AMOUNT," +
			"SUM(T1.ADMINISTRATIVE_AMOUNT) ADMINISTRATIVE_AMOUNT," +
			"SUM(T1.TRAVEL_AMOUNT) TRAVEL_AMOUNT," +
			"SUM(T1.LETTER_AMOUNT) LETTER_AMOUNT," +
			"SUM(T1.HOUSE_AMOUNT) HOUSE_AMOUNT," +
			"SUM(T1.OTHER_RENT_AMOUNT) OTHER_RENT_AMOUNT," +
			"SUM(T1.WATER_AMOUNT) WATER_AMOUNT," +
			"SUM(T1.PROPERTY_AMOUNT) PROPERTY_AMOUNT," +
			"SUM(T1.OTHER_AMOUNT) OTHER_AMOUNT," +
			"T1.group_id_"+group_level+" groupid " +
			"FROM PMRT.TB_MRT_COST_RPT_BUDGET T1 ";
	
		//var wheresql = " WHERE t1.GROUP_ID_"+group_level+"='"+group_id+"' AND t1.DEAL_DATE='"+querydate+"' ";
	var wheresql = " WHERE t1.GROUP_ID_"+group_level+"='"+group_id+"' AND t1.DEAL_DATE between '"+querydate+"' and '"+enddate+"' ";
		var groupbySql = " GROUP BY t1.group_id_"+group_level +" order by groupid";
		if(group_level == 0) {
			sql = "SELECT max('云南省') as groupname," + sql + wheresql + groupbySql;
		}else if(group_level == 1) {
			sql = "SELECT max(t1.group_id_"+group_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else if(group_level == 2) {
			sql = "SELECT max(t1.group_id_"+group_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else{
			sql = "SELECT group_id_3_name as groupname, CASE WHEN GRID_TYPE='1' THEN '城区或县城' WHEN GRID_TYPE='2' THEN '乡镇' " +
					"WHEN GRID_TYPE='3' THEN '城乡混合' WHEN GRID_TYPE='4' THEN '派驻' " +
					"ELSE '' END AS GRID_TYPE,GRID_LEVEL,INCOME_TOTAL,INCOME_2G,INCOME_3G,INCOME_GW," +
					"BUDGET_TOTAL,COMM_AMOUNT,QDBT_AMOUNT,ADS_AMOUNT,CUS_USER_AMOUNT," +
					"CARUSE_AMOUNT,ENTERTAIN_AMOUNT,ADMINISTRATIVE_AMOUNT,TRAVEL_AMOUNT," +
					"LETTER_AMOUNT,HOUSE_AMOUNT,OTHER_RENT_AMOUNT,WATER_AMOUNT," +
					"PROPERTY_AMOUNT,OTHER_AMOUNT,group_id_3 as groupid " +
					"FROM PMRT.TB_MRT_COST_RPT_BUDGET " + wheresql + groupbySql;
		}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:path+"/public!queryList.action",
		data:{
			sql:sql
		},
		error:function(){
			alert("网络延迟");
		},
		success:function(data){
			if(data == undefined || data == null || data == '' || data.length < 1){
				var preMon = getPreMonth(querydate);
				if(getPreMonth(deal_date) == preMon) {
					querydate = preMon;
					initTable();
					$("#searchTime").val(preMon);
					$("#endTime").val(preMon);
				}else {
					addTable(data,group_level);
				}
			}else{
				addTable(data,group_level);
			}
		}
	});
}
function addTable(data,level) {
	var mon = $("#searchTime").val();
	var preMon = getPreMonth(mon);
	var temp = "";
	temp += "<thead ><tr><th rowspan='2' class='attend_th'>营销架构</th><th rowspan='2' class='attend_th'>网格属性</th>" +
			"<th rowspan='2' class='attend_th'>网格等级</th>" +
			"<th colspan='4'>出帐收入</th><th rowspan='2' class='attend_th'>费用合计</th>" +
			
			"<th rowspan='2' class='attend_th'>佣金</th><th rowspan='2' class='attend_th'>渠道补贴</th>" +
			"<th rowspan='2' class='attend_th'>广告宣传费</th><th rowspan='2' class='attend_th'>客户维系和用户获取费</th>" +
			"<th rowspan='2' class='attend_th'>车辆使用费</th><th rowspan='2' class='attend_th'>招待费</th>" +
			"<th rowspan='2' class='attend_th'>办公费</th><th rowspan='2' class='attend_th'>差旅费</th>" +
			"<th rowspan='2' class='attend_th'>通信费</th><th rowspan='2' class='attend_th'>房租</th>" +
			"<th rowspan='2' class='attend_th'>其他租赁费</th><th rowspan='2' class='attend_th'>水电</th>" +
			"<th rowspan='2' class='attend_th'>物管</th><th rowspan='2' class='attend_th'>其他</th></tr>" +
			//"</tr>" + 
			
			"</tr></th><th class='attend_th'>小计</th><th class='attend_th'>2G</th>" +
			"<th class='attend_th'>3G</th><th class='attend_th'>固网</th></tr>" +
			"</thead>";
	temp +=	"<tbody id='tableIcon'>";
	var array_area;
	var area_name;
	var area_code;
	
	if(data == undefined || data == null || data == '' || data.length < 1){
		temp+=("<tr><td colspan='19' style='text-align:center;color: red'>对不起，没有匹配到您想要的数据！</td></tr>");
		click_flag = 0;
	}else{
		var rowNum = data.length;
		for(var i=0; i<rowNum; i++){
			area_name = data[i]["groupname"];
			area_code = data[i]["groupid"];
			temp += "<tr>";
			if(group_level==4){
				//营销架构列
				temp += "<td style='text-align:left;'><span style='margin-left:15px;width:300px;' class='root' id='showArea_"+level+"_"+area_code+"' hasChildren='false' value='"+area_name+"'><a href='javascript:void(0)' class='root'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
			}else{
				//营销架构列
				temp += "<td style='text-align:left;white-space:nowrap;width:300px;'><span style='margin-left:15px' class='sub_on' id='showArea_"+level+"_"+area_code+"' hasChildren='false' value='"+area_name+"'><a href='javascript:void(0)' class='sub_on'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
			}
			
			for(var j=0;j<tablecode.length;j++){
				var tmpval = data[i][tablecode[j]];
				if(tmpval!=null){
					if(tablecode[j]=='grid_type') {
						tmpval = data[i][tablecode[j]];
					}else {
						tmpval = numberFormat(data[i][tablecode[j]]);
					}
				}else{
					tmpval = "—";
				}
				//temp = addEle(temp,tablecode[j],area_code,level,$("#searchTime").val(),area_name,tmpval);
				temp += "<td style='text-align: center;'>"+tmpval+"</td>";
			}
			 		//"<td style='text-align:center'><a href='javascript:void(0)' path='jsp/comm/sub_commissiondetail.jsp?query_groupid="+area_code+"&query_level="+level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+area_name+"明细' >明细</a> | "+
			/*temp +="<td style='text-align:center'><a href='javascript:void(0)' path='jsp/comm/sub_commission2Gdetail.jsp?query_groupid="+area_code+"&query_level="+level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+area_name+"2G用户明细' >2G用户明细</a> | " +
							"<a href='javascript:void(0)' path='jsp/comm/sub_commission3Gdetail.jsp?query_groupid="+area_code+"&query_level="+level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+area_name+"3G用户明细' >3G用户明细</a></td>";*/
			temp += "</tr>";
		}
	}
	
	temp += "</tbody>";
	$("#tableData").html(temp);
//	$("tbody tr:visible:even").removeClass("spec");
//	$("tbody tr:visible:even").addClass("spec");
	
	$("tbody tr").removeClass("spec");
	$("tbody tr:visible:even").addClass("spec");
	click_flag = 0;
}

function showSub(element){//element：被点击的元素
	if(0 != click_flag){
        return;
    }
    var _this = $(element);
    var area_id = _this.parent().attr("id");
    var area_code = area_id.substring(11);
    var area_level = area_id.substring(9,10);            //被点元素所在层级
    var show_level = (parseInt(area_level) + 1) + "";    //要展示的层级
    if(show_level>3 || (group_level==3 && show_level>4)){
        alert("对不起，没有下一级数据可供钻取！");
        return;
    }
	    
    var array_code = area_id.split("_");
    var query_code = array_code[array_code.length - 1];
	    
	var array_tr;
	var array_next;
	var next_tr;
		
	var _level = parseInt(show_level);
	//判断是否有子节点，有则隐藏或显示，无则插入
    if("true" == _this.parent().attr("hasChildren")){
	    array_tr = $("[id*="+area_code+"]").not($("#"+area_id)).parent().parent();
	    array_next = $("[id^=showArea_"+show_level+"_"+area_code+"]");
	    next_tr = array_next.parent().parent();
	    if(array_next.is(":visible")){
	        array_tr.hide();
	        array_next.css("visibility","hidden");
	        $("#"+area_id).find("a").attr("class","sub_on");
	        //新增
	        $("#"+area_id).removeClass("sub");//移除+样式
	        $("#"+area_id).attr("class","sub_on");//改成-样式
	    }else{
	        array_tr.hide();
	        next_tr.show();
	        array_next.css("visibility","visible");
	        $("#"+area_id).find("a").attr("class","sub");
	        $("#"+area_id).removeClass("sub_on");//移除+样式
	        $("#"+area_id).attr("class","sub");//改成-样式
	    }
	}else{//准备数据查询下一级
	    click_flag = 1;
	    
	    var sql = "MAX('—') GRID_TYPE," +
		"MAX('—') GRID_LEVEL," +
		"sum(INCOME_TOTAL) INCOME_TOTAL,"+
		"SUM(T1.INCOME_2G) INCOME_2G," +
		"SUM(T1.INCOME_3G) INCOME_3G," +
		"SUM(T1.INCOME_GW) INCOME_GW," +
		"SUM(T1.BUDGET_TOTAL) BUDGET_TOTAL," +
		"SUM(T1.COMM_AMOUNT) COMM_AMOUNT," +
		"SUM(T1.QDBT_AMOUNT) QDBT_AMOUNT," +
		"SUM(T1.ADS_AMOUNT) ADS_AMOUNT," +
		"SUM(T1.CUS_USER_AMOUNT) CUS_USER_AMOUNT," +
		"SUM(T1.CARUSE_AMOUNT) CARUSE_AMOUNT," +
		"SUM(T1.ENTERTAIN_AMOUNT) ENTERTAIN_AMOUNT," +
		"SUM(T1.ADMINISTRATIVE_AMOUNT) ADMINISTRATIVE_AMOUNT," +
		"SUM(T1.TRAVEL_AMOUNT) TRAVEL_AMOUNT," +
		"SUM(T1.LETTER_AMOUNT) LETTER_AMOUNT," +
		"SUM(T1.HOUSE_AMOUNT) HOUSE_AMOUNT," +
		"SUM(T1.OTHER_RENT_AMOUNT) OTHER_RENT_AMOUNT," +
		"SUM(T1.WATER_AMOUNT) WATER_AMOUNT," +
		"SUM(T1.PROPERTY_AMOUNT) PROPERTY_AMOUNT," +
		"SUM(T1.OTHER_AMOUNT) OTHER_AMOUNT," +
		"T1.group_id_"+_level+" groupid " +
		"FROM PMRT.TB_MRT_COST_RPT_BUDGET T1 ";

		//var wheresql = " WHERE t1.GROUP_ID_"+area_level+"='"+query_code+"' AND t1.DEAL_DATE='"+querydate+"' ";
	    var wheresql = " WHERE t1.GROUP_ID_"+area_level+"='"+query_code+"' AND t1.DEAL_DATE between '"+querydate+"' and '"+enddate+"' ";
		var groupbySql = " GROUP BY t1.group_id_"+_level +" order by groupid ";
		if(_level == 0) {
			sql = "SELECT max('云南省') as groupname," + sql + wheresql + groupbySql;
		}else if(_level == 1) {
			sql = "SELECT max(t1.group_id_"+_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else if(_level == 2) {
			sql = "SELECT max(t1.group_id_"+_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else{
			sql = "SELECT T1.group_id_3_name as groupname, CASE WHEN T1.GRID_TYPE='1' THEN '城区或县城' WHEN T1.GRID_TYPE='2' THEN '乡镇' " +
					"WHEN T1.GRID_TYPE='3' THEN '城乡混合' WHEN T1.GRID_TYPE='4' THEN '派驻' " +
					"ELSE '' END AS GRID_TYPE,T1.GRID_LEVEL,T1.INCOME_TOTAL,T1.INCOME_2G,T1.INCOME_3G,T1.INCOME_GW," +
					"T1.BUDGET_TOTAL,T1.COMM_AMOUNT,T1.QDBT_AMOUNT,T1.ADS_AMOUNT,T1.CUS_USER_AMOUNT," +
					"T1.CARUSE_AMOUNT,T1.ENTERTAIN_AMOUNT,T1.ADMINISTRATIVE_AMOUNT,T1.TRAVEL_AMOUNT," +
					"T1.LETTER_AMOUNT,T1.HOUSE_AMOUNT,T1.OTHER_RENT_AMOUNT,T1.WATER_AMOUNT," +
					"T1.PROPERTY_AMOUNT,T1.OTHER_AMOUNT,T1.group_id_3 as groupid " +
					"FROM PMRT.TB_MRT_COST_RPT_BUDGET T1 " + wheresql + " order by groupid ";
		}
	    
	    
		$.ajax({
	        type:"POST",
	        dataType:'json',
	        cache:false,
	        url:path+"/public!queryList.action",
		    data:{
				sql:sql
			},
	        error:function(){
	        	alert("网络延迟");
	        },
	        success:function(data){
	        	showArea(data,_level,_this);
	        }
		});
	    	
	   
	}
}


function showArea(data, next_level, oElement){
	var area_id = oElement.parent().attr("id");
	var area_code = area_id.substring(11);
	var _tr = oElement.parent().parent().parent();
	var rowNum = data.length;
	var name;
	var code;
	var marg = 0;
	var trStr = "";
	var open=0;
	for(var i=0; i<rowNum; i++){
		name = data[i]["groupname"];
	    code = data[i]["groupid"];
	    marg = 16 * (next_level) + 15;
	    if(isNotBlank(code)){
	    	open=1;
	    }
       trStr += "<tr>";
       //营销架构列
       if(next_level>=3 || (group_level==3 && next_level==3)){
           trStr += "<td style='text-align:left;'><span class='root' style='margin-left:"+marg+"px; width:300px;' id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' class='root' onclick=showSub(this);>"+name+"</a></span></td>";
       }else{
    	   trStr += "<td style='text-align:left;white-space:nowrap;width:300px;'><span class='sub_on' style='margin-left:"+marg+"px;'  id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' class='sub_on' onclick=showSub(this);>"+name+"</a></span></td>";
       }

       for(var j=0;j<tablecode.length;j++){
			var tmp = data[i][tablecode[j]];
			if(tmp!=null){
				if(tablecode[j]=='grid_type') {
					tmp = data[i][tablecode[j]];
				}else {
					tmp = numberFormat(data[i][tablecode[j]]);
				}
			}else{
				tmp = "—";
			}
			//trStr = addEle(trStr,tablecode[j],code,next_level,$("#searchTime").val(),name,tmp);
			trStr += "<td style='text-align: center;'>"+tmp+"</td>";
		}
       trStr += "</tr>";
        //"<td><a href='javascript:void(0)' path='jsp/comm/sub_commissiondetail.jsp?query_groupid="+code+"&query_level="+next_level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+name+"明细' >明细</a> | "
       /*trStr += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/comm/sub_commission2Gdetail.jsp?query_groupid="+code+"&query_level="+next_level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+name+"2G用户明细' >2G用户明细</a> | "
       		   +"<a href='javascript:void(0)' path='jsp/comm/sub_commission3Gdetail.jsp?query_groupid="+code+"&query_level="+next_level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+name+"3G用户明细' >3G用户明细</a></td>";*/
   }
	if(open==1){
		_tr.after(trStr);
	}else{
		 click_flag = 0;
	     $("#"+area_id).find("a").attr("class","root");
//		       alert("对不起，没有下一级可供钻取！");
	     return;
	}
   $("tbody tr").removeClass("spec");
   $("tbody tr:visible:even").addClass("spec");
   $("#"+area_id).attr("hasChildren","true");
   $("#"+area_id).find("a").attr("class","sub");
   $("#"+area_id).removeClass("sub_on");//移除+样式
   $("#"+area_id).attr("class","sub");//改成-样式
   click_flag = 0;
}

function addEle(temp,code,groupid,level,searchTime,area_name,tmpval){
	switch (code) {
		case "g3_single_card" :   //3G单卡
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+searchTime+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G单卡明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_single_card_last" :   //3G上月单卡
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+getPreMonth(searchTime)+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G单卡明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_store_phone" :   //3G存费送机
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+searchTime+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G存费送机明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_store_phone_last" :   //3G上月存费送机
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+getPreMonth(searchTime)+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G存费送机明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_buy_phone_cont" :  //3G购机送费
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+searchTime+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G购机送费明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_buy_phone_cont_last" :  //3G上月购机送费
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+getPreMonth(searchTime)+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G购机送费明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_owned_phon_cont" : //3G存费送费
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+searchTime+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G存费送费明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_owned_cont_last" : //3G上月存费送费
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+getPreMonth(searchTime)+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G存费送费明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_wifi_dev" : //3G上网卡
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GwifiDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+searchTime+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G上网卡明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g3_wifi_dev_last" : //3G上月上网卡
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_3GwifiDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+getPreMonth(searchTime)+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"3G上网卡明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g2_dev" : //2G销量
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_2GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+searchTime+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"2G销量明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		case "g2_dev_last" : //2G上月销量
			temp += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/develop/2G_3G_salesAnalysis_2GcodeDetail.jsp?" +
					"query_groupid="+groupid+"&query_level="+level+"&searchTime="+getPreMonth(searchTime)+"&type="+code+"' onclick='uit.tabs.add(this);return false;' " +
					"code='"+area_name+"2G销量明细'  title='点击查看明细'>"+tmpval+"</a></td>";
			break;
		default :
			temp += "<td style='text-align: center;'>"+tmpval+"</td>";
	}
	return temp;
}

function searchClick() {
    querydate = $("#searchTime").val();
    enddate = $("#endTime").val();
	initTable();
}


function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}


//导出excel
function downsaction(){	
	 var context=[];
	 var tbody=$("#tableIcon").children();
	 var t;
	 $.each(tbody,function(i){
		var text=[];
		var tr=$(this).children();
		$.each(tr,function(j){
			text.push($(this).html().replace( /(\&nbsp;)|(<[^>]+>)/ig, ''));
		});
		context.push(text);
	 });
	 showtext="result";
	 _loadExcel({
			startRow:2,
			startCol:0,
			cols:-1,
			excelModal:'cost_rpt_budget.xls',
			sheetname:showtext,
			excelData:context
		},null,'下载数据');
	 
}

function _loadAllExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}

//导出全部
function downsAll() {
	var qdate = $.trim($("#searchTime").val());
	var endqdate = $.trim($("#endTime").val());
	var sql = "SELECT T1.GROUP_ID_1_NAME,T1.GROUP_ID_2_NAME,T1.GROUP_ID_3_NAME,CASE " +
			"WHEN T1.GRID_TYPE = '1' THEN '城区或县城' WHEN T1.GRID_TYPE = '2' THEN '乡镇' " +
			"WHEN T1.GRID_TYPE = '3' THEN '城乡混合' WHEN T1.GRID_TYPE = '4' THEN '派驻' " +
			"ELSE '' END AS GRID_TYPE,T1.GRID_LEVEL,T1.INCOME_TOTAL,T1.INCOME_2G,T1.INCOME_3G," +
			"T1.INCOME_GW,T1.BUDGET_TOTAL,T1.COMM_AMOUNT,T1.QDBT_AMOUNT,T1.ADS_AMOUNT," +
			"T1.CUS_USER_AMOUNT,T1.CARUSE_AMOUNT,T1.ENTERTAIN_AMOUNT,T1.ADMINISTRATIVE_AMOUNT," +
			"T1.TRAVEL_AMOUNT,T1.LETTER_AMOUNT,T1.HOUSE_AMOUNT,T1.OTHER_RENT_AMOUNT," +
			"T1.WATER_AMOUNT,T1.PROPERTY_AMOUNT,T1.OTHER_AMOUNT " +
			"FROM PMRT.TB_MRT_COST_RPT_BUDGET T1 " +
			//"WHERE T1.GROUP_ID_"+group_level+" = '"+group_id+"' AND T1.DEAL_DATE = '"+qdate+"' " +
			"WHERE T1.GROUP_ID_"+group_level+" = '"+group_id+"' AND T1.DEAL_DATE between '"+qdate+"' and '"+endqdate+"' " +
			"ORDER BY group_id_1,group_id_2,group_id_3 ";
	
	showtext="result";
	 _loadAllExcel({
			startRow:2,
			startCol:0,
			cols:-1,
			excelModal:'cost_rpt_budget_all.xls',
			sheetname:showtext,
			query:sql
		},null,'网格费用预算展现数据导出');
}


//格式化数值，每三位加逗号
function numberFormat(num){
    var head="";
	var end="";
	var total = String(num);
	total=total.replace(/(^\s*)|(\s*$)/g, "");
	if(total.charAt(total.length-1)=='%'){
		end="%";
		total=total.substr(0,total.length-1);
	}
	if(total.charAt(0)=='-'){
		head="-";
		total=total.substr(1);
	}
	 
	var arr_total = total.split('.');
	var len   = arr_total.length;
	 
	var b = String(arr_total[0]);
	var c = b.length;
	var gap = c%3;
	var step = parseInt(c/3);
	var outStr = b.substring(0,gap);
	for(var i=0; i<step; i++){
	   var showSep = ( i==0 && gap==0 )? '' : ',' ;
	   outStr += showSep+b.substring(gap,(gap+3));
	   gap+=3;
	}
	if( len>1 ){
	   outStr = outStr+'.'+arr_total[1]; 
	}
    return head+outStr+end;
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='');
}

function getPreMonth(currMonth) {
	currMonth = currMonth + "";
	var year = currMonth.substr(0,4);
	var mon = currMonth.substr(4);

	if(mon == '01') {
		year = year -1;
		mon = '12';
	}else{
		mon = mon - 1;
	}

	if((mon+"").length == 1) {
		mon = '0'+mon;
	}
	return year+mon;
}
