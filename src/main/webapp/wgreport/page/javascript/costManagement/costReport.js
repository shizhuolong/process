var click_flag = 0;
var _execute = $.Project.execute; 
var defaultMsgDom = $('#searchTime');
var tablecode = ["grid_type","grid_level","income_2g", "income_3g", /*"income_3g_netcard",*/"income_hardlink","income_total","comm_2g",
                 "comm_3g","comm_hardlink","comm_business", "comm_total", "channel","ads_amount","cus_user_amount","caruse_amount",
                 "entertain_amount","administrative_amount","travel_amount","letter_amount","house_amount","other_rent_amount","water_amount",
                 "property_amount","other_amount","gridding_total"];
var querydate = "";
//var endQueryDate = "";

jQuery(function($){
	$("#search").click(searchClick);
	querydate = deal_date;
//	endQueryDate = end_dealDate;
	initTable(); 
	//excel导出
	$("#button_excel").click(downsaction);
	//导出全部
	$("#downloadExcelAll").click(downsAll);
	
});


function initTable(){
	var sql = "SELECT MAX(group_id_"+group_level+"_name) groupname,MAX('—') grid_type,MAX('—') grid_level," +
	"SUM(INCOME_2G) INCOME_2G,SUM(INCOME_3G) INCOME_3G," +
	/*"SUM(INCOME_3G_NETCARD) INCOME_3G_NETCARD," +*/
	"SUM(INCOME_HARDLINK) INCOME_HARDLINK,SUM(INCOME_TOTAL) INCOME_TOTAL,SUM(COMM_2G) COMM_2G," +
	"SUM(COMM_3G) COMM_3G,SUM(COMM_HARDLINK) COMM_HARDLINK,SUM(COMM_BUSINESS) COMM_BUSINESS," +
	"SUM(COMM_TOTAL) COMM_TOTAL,SUM(CHANNEL) CHANNEL,SUM(ADS_AMOUNT) ADS_AMOUNT," +
	"SUM(CUS_USER_AMOUNT) CUS_USER_AMOUNT,SUM(CARUSE_AMOUNT) CARUSE_AMOUNT," +
	"SUM(ENTERTAIN_AMOUNT) ENTERTAIN_AMOUNT,SUM(ADMINISTRATIVE_AMOUNT) ADMINISTRATIVE_AMOUNT," +
	"SUM(TRAVEL_AMOUNT) TRAVEL_AMOUNT,SUM(LETTER_AMOUNT) LETTER_AMOUNT," +
	"SUM(HOUSE_AMOUNT) HOUSE_AMOUNT,SUM(OTHER_RENT_AMOUNT) OTHER_RENT_AMOUNT," +
	"SUM(WATER_AMOUNT) WATER_AMOUNT,SUM(PROPERTY_AMOUNT) PROPERTY_AMOUNT," +
	"SUM(OTHER_AMOUNT) OTHER_AMOUNT,sum(GRIDDING_TOTAL) GRIDDING_TOTAL,group_id_"+group_level+" groupid " +
	"FROM PMRT.TB_MRT_COST_RPT_GRIDDINGALL " +
	"WHERE group_id_"+group_level+" = '"+group_id+"' AND deal_date = '"+querydate+"' " +
	"GROUP BY group_id_"+group_level+" ORDER BY groupid";
//	if(group_level == "0") {
//		sql = "SELECT MAX('中国联通云南分公司') AS GROUPNAME,T.GROUP_ID_0 AS GROUPID," + col +
//		" WHERE T.group_id_0 = '"+group_id+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
//		"GROUP BY GROUP_ID_0";
//	} else if(group_level == "1") {
//		sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS GROUPNAME,T.GROUP_ID_1 AS GROUPID," + col +
//		" WHERE T.group_id_1 = '"+group_id+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
//		"GROUP BY GROUP_ID_1 ORDER BY GROUPID";
//	}else if(group_level == "2") {
//		sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS GROUPID," + col +
//		" WHERE T.UNIT_ID = '"+group_id+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
//		"GROUP BY UNIT_ID ORDER BY GROUPID";
//	}else if(group_level >= 3) {
//		sql = "SELECT MAX('中国联通云南分公司') AS GROUPNAME,T.GROUP_ID_0 AS GROUPID," + col +
//		" WHERE 1=2 " +
//		"GROUP BY GROUP_ID_0";
//	}
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
					endQueryDate = preMon;
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
	temp += "<thead><tr><th class='attend_th'>营销架构</th><th class='attend_th'>网格属性</th>" +
	"<th class='attend_th'>网格等级</th><th class='attend_th'>2G出帐收入(元)</th>" +
	"<th class='attend_th'>3G出帐收入(元)</th>" +
	/*"<th class='attend_th'>上网卡出帐收入(元)</th>" +*/
	"<th class='attend_th'>固网出帐收入(元)</th><th class='attend_th'>出帐收入小计(元)</th>" +
	"<th class='attend_th'>2G佣金(元)</th><th class='attend_th'>3G佣金(元)</th>" +
	"<th class='attend_th'>固网佣金(元)</th><th class='attend_th'>融合业务佣金(元)</th>" +
	"<th class='attend_th'>佣金合计(元)</th><th class='attend_th'>渠道补贴(元)</th>" +
	"<th class='attend_th'>广告宣传费(元)</th><th class='attend_th'>维系(元)</th>" +
	"<th class='attend_th'>车辆使用费(元)</th><th class='attend_th'>招待费(元)</th>" +
	"<th class='attend_th'>办公费(元)</th><th class='attend_th'>差旅费(元)</th>" +
	"<th class='attend_th'>通信费(元)</th><th class='attend_th'>房租费(元)</th>" +
	"<th class='attend_th'>其他租赁费(元)</th><th class='attend_th'>水电费(元)</th>" +
	"<th class='attend_th'>物业管理费(元)</th><th class='attend_th'>其他(元)</th>" +
	"<th class='attend_th'>费用合计(元)</th></tr>" +
	"</thead>";
	
	temp +=	"<tbody id='tableIcon'>";
	var array_area;
	var area_name;
	var area_code;
	
	if(data == undefined || data == null || data == '' || data.length < 1){
		temp+=("<tr><td colspan='26' style='text-align:center;color: red'>对不起，没有匹配到您想要的数据！</td></tr>");
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
					tmpval = numberFormat(data[i][tablecode[j]]);
				}else{
					tmpval = "—";
				}
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
	    var sql = "";
	    if(_level == 3) {
	    	sql = "SELECT group_id_3_name groupname," +
	    			"CASE WHEN grid_type = '0' THEN '城区或者县域' " +
	    			"WHEN grid_type = '2' THEN '乡镇' " +
	    			"WHEN grid_type = '3' THEN '城乡混合' WHEN grid_type = '4' THEN '派驻' " +
	    			"ELSE '—' END AS GRID_TYPE," +
	    			"grid_level grid_level," +
	    			"INCOME_2G INCOME_2G,INCOME_3G INCOME_3G," +
	    			/*"INCOME_3G_NETCARD INCOME_3G_NETCARD," +*/
	    			"INCOME_HARDLINK INCOME_HARDLINK,INCOME_TOTAL INCOME_TOTAL,COMM_2G COMM_2G," +
	    			"COMM_3G COMM_3G,COMM_HARDLINK COMM_HARDLINK,COMM_BUSINESS COMM_BUSINESS," +
	    			"COMM_TOTAL COMM_TOTAL,CHANNEL CHANNEL,ADS_AMOUNT ADS_AMOUNT," +
	    			"CUS_USER_AMOUNT CUS_USER_AMOUNT,CARUSE_AMOUNT CARUSE_AMOUNT," +
	    			"ENTERTAIN_AMOUNT ENTERTAIN_AMOUNT,ADMINISTRATIVE_AMOUNT ADMINISTRATIVE_AMOUNT," +
	    			"TRAVEL_AMOUNT TRAVEL_AMOUNT,LETTER_AMOUNT LETTER_AMOUNT,HOUSE_AMOUNT HOUSE_AMOUNT," +
	    			"OTHER_RENT_AMOUNT OTHER_RENT_AMOUNT,WATER_AMOUNT WATER_AMOUNT," +
	    			"PROPERTY_AMOUNT PROPERTY_AMOUNT,OTHER_AMOUNT OTHER_AMOUNT,GRIDDING_TOTAL,group_id_"+_level+" groupid " +
	    			"FROM PMRT.TB_MRT_COST_RPT_GRIDDINGALL " +
	    			"WHERE group_id_"+area_level+" = '"+query_code+"' AND deal_date = '"+querydate+"' " +
	    			"ORDER BY groupid";
	    }else {
	    	sql = "SELECT MAX(group_id_"+_level+"_name) groupname,MAX('—') grid_type,MAX('—') grid_level," +
	    	"SUM(INCOME_2G) INCOME_2G,SUM(INCOME_3G) INCOME_3G," +
	    	/*"SUM(INCOME_3G_NETCARD) INCOME_3G_NETCARD," +*/
	    	"SUM(INCOME_HARDLINK) INCOME_HARDLINK,SUM(INCOME_TOTAL) INCOME_TOTAL,SUM(COMM_2G) COMM_2G," +
	    	"SUM(COMM_3G) COMM_3G,SUM(COMM_HARDLINK) COMM_HARDLINK,SUM(COMM_BUSINESS) COMM_BUSINESS," +
	    	"SUM(COMM_TOTAL) COMM_TOTAL,SUM(CHANNEL) CHANNEL,SUM(ADS_AMOUNT) ADS_AMOUNT," +
	    	"SUM(CUS_USER_AMOUNT) CUS_USER_AMOUNT,SUM(CARUSE_AMOUNT) CARUSE_AMOUNT," +
	    	"SUM(ENTERTAIN_AMOUNT) ENTERTAIN_AMOUNT,SUM(ADMINISTRATIVE_AMOUNT) ADMINISTRATIVE_AMOUNT," +
	    	"SUM(TRAVEL_AMOUNT) TRAVEL_AMOUNT,SUM(LETTER_AMOUNT) LETTER_AMOUNT," +
	    	"SUM(HOUSE_AMOUNT) HOUSE_AMOUNT,SUM(OTHER_RENT_AMOUNT) OTHER_RENT_AMOUNT," +
	    	"SUM(WATER_AMOUNT) WATER_AMOUNT,SUM(PROPERTY_AMOUNT) PROPERTY_AMOUNT," +
	    	"SUM(OTHER_AMOUNT) OTHER_AMOUNT,sum(GRIDDING_TOTAL) GRIDDING_TOTAL,group_id_"+_level+" groupid " +
	    	"FROM PMRT.TB_MRT_COST_RPT_GRIDDINGALL " +
	    	"WHERE group_id_"+area_level+" = '"+query_code+"' AND deal_date = '"+querydate+"' " +
	    	"GROUP BY group_id_"+_level+" ORDER BY groupid";
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
           trStr += "<td style='text-align:left;'><span class='root' style='margin-left:"+marg+"px; width:300px;padding-bottom: 3px;' id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' style='padding-bottom: 2px;' class='root' onclick=showSub(this);>"+name+"</a></span></td>";
       }else{
    	   trStr += "<td style='text-align:left;white-space:nowrap;width:300px;padding-bottom: 3px;'><span class='sub_on' style='margin-left:"+marg+"px;'  id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' style='padding-bottom: 2px;' class='sub_on' onclick=showSub(this);>"+name+"</a></span></td>";
       }

       for(var j=0;j<tablecode.length;j++){
			var tmp = data[i][tablecode[j]];
			if(tmp!=null){
				tmp = numberFormat(data[i][tablecode[j]]);
			}else{
				tmp = "—";
			}
			trStr += "<td style='text-align: center;'>"+tmp+"</td>";
		}
       trStr += "</tr>";
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


function searchClick() {
    querydate = $("#searchTime").val();
    endQueryDate = $("#endTime").val();
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
	 showtext= 'dataFile';
	 _loadExcel({
			startRow:1,
			startCol:0,
			cols:-1,
			excelModal:'cost_report.xls',
			sheetname:showtext,
			excelData:context
		},null,showtext);
	 
	 
}

function _loadAllExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
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

//导出全部
function downsAll() {
	var qdate = $.trim($("#searchTime").val());
	var sql = "SELECT group_id_1_name group_id_1_name,group_id_2_name group_id_2_name," +
			"group_id_3_name group_id_2_name," +
			"CASE WHEN grid_type = '0' THEN '城区或者县域' " +
			"WHEN grid_type = '2' THEN '乡镇' " +
			"WHEN grid_type = '3' THEN '城乡混合' WHEN grid_type = '4' THEN '派驻' " +
			"ELSE ' ' END AS GRID_TYPE," +
			"grid_level grid_level," +
	"INCOME_2G INCOME_2G,INCOME_3G INCOME_3G," +
	/*"INCOME_3G_NETCARD INCOME_3G_NETCARD," +*/
	"INCOME_HARDLINK INCOME_HARDLINK,INCOME_TOTAL INCOME_TOTAL,COMM_2G COMM_2G," +
	"COMM_3G COMM_3G,COMM_HARDLINK COMM_HARDLINK,COMM_BUSINESS COMM_BUSINESS," +
	"COMM_TOTAL COMM_TOTAL,CHANNEL CHANNEL,ADS_AMOUNT ADS_AMOUNT," +
	"CUS_USER_AMOUNT CUS_USER_AMOUNT,CARUSE_AMOUNT CARUSE_AMOUNT," +
	"ENTERTAIN_AMOUNT ENTERTAIN_AMOUNT,ADMINISTRATIVE_AMOUNT ADMINISTRATIVE_AMOUNT," +
	"TRAVEL_AMOUNT TRAVEL_AMOUNT,LETTER_AMOUNT LETTER_AMOUNT,HOUSE_AMOUNT HOUSE_AMOUNT," +
	"OTHER_RENT_AMOUNT OTHER_RENT_AMOUNT,WATER_AMOUNT WATER_AMOUNT," +
	"PROPERTY_AMOUNT PROPERTY_AMOUNT,OTHER_AMOUNT OTHER_AMOUNT,GRIDDING_TOTAL GRIDDING_TOTAL " +
	"FROM PMRT.TB_MRT_COST_RPT_GRIDDINGALL " +
	"WHERE group_id_"+group_level+" = '"+group_id+"' AND deal_date = '"+qdate+"' " +
	"ORDER BY group_id_1,group_id_2,group_id_3 ";
	 showtext="result";
	 _loadAllExcel({
			startRow:1,
			startCol:0,
			cols:-1,
			excelModal:'cost_reportAll.xls',
			sheetname:showtext,
			query:sql
		},null,'下载数据');
}

