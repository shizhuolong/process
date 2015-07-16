var click_flag = 0;
var _execute = $.Project.execute; 
var defaultMsgDom = $('#searchTime');
var tablecode = ["income_total","income_2g","income_3g", "income_4g","income_kd","income_zx",
                 "gridding_total","comm_total","comm_2g", "comm_3g", "comm_4g","comm_hardlink",
                 "comm_gy","fee_jmwb","channel","zdbt_amount","kvb_amount","fzf_amount",
                 "sdwyf_amount","ads_amount","ywypclf_amount","yhjr_amount",
                 "bgf_amount","clsyf_amount","zdf_amount","clf_amount","txf_amount","profit"];
var querydate = "";
var endQueryDate = "";

jQuery(function($){
	$("#search").click(searchClick);
	querydate = deal_date;
	endQueryDate = end_dealDate;
	initTable(); 
	//excel导出
	$("#button_excel").click(downsaction);
	
});


function initTable(sql){
	var col = 
		"SUM(NVL(T.INCOME_TOTAL, 0)) AS INCOME_TOTAL,    "+
		"SUM(NVL(T.INCOME_2G, 0)) AS INCOME_2G,          "+
		"SUM(NVL(T.INCOME_3G, 0)) AS INCOME_3G,          "+
		"SUM(NVL(T.INCOME_4G, 0)) AS INCOME_4G,          "+
		"SUM(NVL(T.INCOME_KD, 0)) AS INCOME_KD,          "+
		"SUM(NVL(T.INCOME_ZX, 0)) AS INCOME_ZX,          "+
		"SUM(NVL(T.GRIDDING_TOTAL, 0)) AS GRIDDING_TOTAL,"+
		"SUM(NVL(T.COMM_TOTAL, 0)) AS COMM_TOTAL,        "+
		"SUM(NVL(T.COMM_2G, 0)) AS COMM_2G,              "+
		"SUM(NVL(T.COMM_3G, 0)) AS COMM_3G,              "+
		"SUM(NVL(T.COMM_4G, 0)) AS COMM_4G,              "+
		"SUM(NVL(T.COMM_HARDLINK, 0)) AS COMM_HARDLINK,  "+
		"SUM(NVL(T.COMM_GY, 0)) AS COMM_GY,              "+
		"SUM(NVL(T.FEE_JMWB, 0)) AS FEE_JMWB,            "+
		"SUM(NVL(T.CHANNEL, 0)) AS CHANNEL,              "+
		"SUM(NVL(T.ZDBT_AMOUNT, 0)) AS ZDBT_AMOUNT,      "+
		"SUM(NVL(T.KVB_AMOUNT, 0)) AS KVB_AMOUNT,        "+
		"SUM(NVL(T.FZF_AMOUNT, 0)) AS FZF_AMOUNT,        "+
		"SUM(NVL(T.SDWYF_AMOUNT, 0)) AS SDWYF_AMOUNT,    "+
		"SUM(NVL(T.ADS_AMOUNT, 0)) AS ADS_AMOUNT,        "+
		"SUM(NVL(T.YWYPCLF_AMOUNT, 0)) AS YWYPCLF_AMOUNT,"+
		"SUM(NVL(T.YHJR_AMOUNT, 0)) AS YHJR_AMOUNT,      "+
		"SUM(NVL(T.BGF_AMOUNT, 0)) AS BGF_AMOUNT,        "+
		"SUM(NVL(T.CLSYF_AMOUNT, 0)) AS CLSYF_AMOUNT,    "+
		"SUM(NVL(T.ZDF_AMOUNT, 0)) AS ZDF_AMOUNT,        "+
		"SUM(NVL(T.CLF_AMOUNT, 0)) AS CLF_AMOUNT,        "+
		"SUM(NVL(T.TXF_AMOUNT, 0)) AS TXF_AMOUNT,        "+
		"SUM(NVL(T.PROFIT, 0)) AS PROFIT                 "+
		"FROM PMRT.TB_MRT_COST_UNIT_PROFIT T             ";
	var sql = "";
	if(group_level == "0") {
		sql = "SELECT MAX('中国联通云南分公司') AS GROUPNAME,T.GROUP_ID_0 AS GROUPID," + col +
		" WHERE T.group_id_0 = '"+group_id+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
		"GROUP BY GROUP_ID_0";
	} else if(group_level == "1") {
		sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS GROUPNAME,T.GROUP_ID_1 AS GROUPID," + col +
		" WHERE T.group_id_1 = '"+group_id+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
		"GROUP BY GROUP_ID_1 ORDER BY GROUPID";
	}else if(group_level == "2") {
		sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS GROUPID," + col +
		" WHERE T.UNIT_ID = '"+group_id+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
		"GROUP BY UNIT_ID ORDER BY GROUPID";
	}else if(group_level >= 3) {
		sql = "SELECT MAX('中国联通云南分公司') AS GROUPNAME,T.GROUP_ID_0 AS GROUPID," + col +
		" WHERE 1=2 " +
		"GROUP BY GROUP_ID_0";
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
	temp += "<thead>" +
			"<tr><th class='attend_th' rowspan='2'>营销架构</th>" +
			"<th class='attend_th' colspan='6'>出帐收入</th>" +
			"<th class='attend_th' rowspan='2'>成本费用合计</th>" +
			"<th class='attend_th' colspan='6'>佣金</th>" +
			"<th class='attend_th' rowspan='2'>紧密外包费用</th>" +
			"<th class='attend_th' rowspan='2'>渠道补贴</th>" +
			"<th class='attend_th' rowspan='2'>终端销售亏损</th>" +
			"<th class='attend_th' rowspan='2'>卡成本</th>" +
			"<th class='attend_th' rowspan='2'>房租(含装修费)</th>" +
			"<th class='attend_th' rowspan='2'>水电物业费</th>" +
			"<th class='attend_th' rowspan='2'>广告宣传费</th>" +
			"<th class='attend_th' rowspan='2'>业务用品印制及材料费</th>" +
			"<th class='attend_th' rowspan='2'>客户接入成本（含开通费及终端）</th>" +
			"<th class='attend_th' rowspan='2'>办公费</th>" +
			"<th class='attend_th' rowspan='2'>车辆使用费</th>" +
			"<th class='attend_th' rowspan='2'>招待费</th>" +
			"<th class='attend_th' rowspan='2'>差旅费</th>" +
			"<th class='attend_th' rowspan='2'>通信费</th>" +
			"<th class='attend_th' rowspan='2'>毛利润</th>" +
			"</tr><tr>" +
	"<th class='attend_th'>合计</th><th class='attend_th'>2G</th>" +
	"<th class='attend_th'>3G</th><th class='attend_th'>4G</th>" +
	"<th class='attend_th'>宽带</th><th class='attend_th'>租线</th>" +
	"<th class='attend_th'>合计</th><th class='attend_th'>2G</th>" +
	"<th class='attend_th'>3G</th><th class='attend_th'>4G</th>" +
	"<th class='attend_th'>固网</th><th class='attend_th'>公共佣金</th>" +
	"</tr>" +
	"</thead>";
	
	temp +=	"<tbody id='tableIcon'>";
	var array_area;
	var area_name;
	var area_code;
	
	if(data == undefined || data == null || data == '' || data.length < 1){
		temp+=("<tr><td colspan='28' style='text-align:center;color: red'>对不起，没有匹配到您想要的数据！</td></tr>");
		click_flag = 0;
	}else{
		var rowNum = data.length;
		for(var i=0; i<rowNum; i++){
			area_name = data[i]["groupname"];
			area_code = data[i]["groupid"];
			temp += "<tr>";
			if(group_level==2){
				//营销架构列
				temp += "<td style='text-align:left;'><span style='margin-left:15px;width:300px;padding-bottom: 3px;' class='root' id='showArea_"+level+"_"+area_code+"' hasChildren='false' value='"+area_name+"'><a href='javascript:void(0)' style='padding-bottom: 2px;' class='root'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
			}else{
				//营销架构列
				temp += "<td style='text-align:left;white-space:nowrap;width:300px;'><span style='margin-left:15px;padding-bottom: 3px;' class='sub_on' id='showArea_"+level+"_"+area_code+"' hasChildren='false' value='"+area_name+"'><a href='javascript:void(0)' style='padding-bottom: 2px;' class='sub_on'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
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
    if(show_level>2 || (group_level==2 && show_level>3)){
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
	    var col = 
	    	"SUM(NVL(T.INCOME_TOTAL, 0)) AS INCOME_TOTAL,    "+
	    	"SUM(NVL(T.INCOME_2G, 0)) AS INCOME_2G,          "+
	    	"SUM(NVL(T.INCOME_3G, 0)) AS INCOME_3G,          "+
	    	"SUM(NVL(T.INCOME_4G, 0)) AS INCOME_4G,          "+
	    	"SUM(NVL(T.INCOME_KD, 0)) AS INCOME_KD,          "+
	    	"SUM(NVL(T.INCOME_ZX, 0)) AS INCOME_ZX,          "+
	    	"SUM(NVL(T.GRIDDING_TOTAL, 0)) AS GRIDDING_TOTAL,"+
	    	"SUM(NVL(T.COMM_TOTAL, 0)) AS COMM_TOTAL,        "+
	    	"SUM(NVL(T.COMM_2G, 0)) AS COMM_2G,              "+
	    	"SUM(NVL(T.COMM_3G, 0)) AS COMM_3G,              "+
	    	"SUM(NVL(T.COMM_4G, 0)) AS COMM_4G,              "+
	    	"SUM(NVL(T.COMM_HARDLINK, 0)) AS COMM_HARDLINK,  "+
	    	"SUM(NVL(T.COMM_GY, 0)) AS COMM_GY,              "+
	    	"SUM(NVL(T.FEE_JMWB, 0)) AS FEE_JMWB,            "+
	    	"SUM(NVL(T.CHANNEL, 0)) AS CHANNEL,              "+
	    	"SUM(NVL(T.ZDBT_AMOUNT, 0)) AS ZDBT_AMOUNT,      "+
	    	"SUM(NVL(T.KVB_AMOUNT, 0)) AS KVB_AMOUNT,        "+
	    	"SUM(NVL(T.FZF_AMOUNT, 0)) AS FZF_AMOUNT,        "+
	    	"SUM(NVL(T.SDWYF_AMOUNT, 0)) AS SDWYF_AMOUNT,    "+
	    	"SUM(NVL(T.ADS_AMOUNT, 0)) AS ADS_AMOUNT,        "+
	    	"SUM(NVL(T.YWYPCLF_AMOUNT, 0)) AS YWYPCLF_AMOUNT,"+
	    	"SUM(NVL(T.YHJR_AMOUNT, 0)) AS YHJR_AMOUNT,      "+
	    	"SUM(NVL(T.BGF_AMOUNT, 0)) AS BGF_AMOUNT,        "+
	    	"SUM(NVL(T.CLSYF_AMOUNT, 0)) AS CLSYF_AMOUNT,    "+
	    	"SUM(NVL(T.ZDF_AMOUNT, 0)) AS ZDF_AMOUNT,        "+
	    	"SUM(NVL(T.CLF_AMOUNT, 0)) AS CLF_AMOUNT,        "+
	    	"SUM(NVL(T.TXF_AMOUNT, 0)) AS TXF_AMOUNT,        "+
	    	"SUM(NVL(T.PROFIT, 0)) AS PROFIT                 "+
	    	"FROM PMRT.TB_MRT_COST_UNIT_PROFIT T             ";
	    if(_level == 0) {
	    	sql = "SELECT MAX('中国联通云南分公司') AS GROUPNAME,T.GROUP_ID_0 AS GROUPID," + col +
			" WHERE T.group_id_0 = '"+query_code+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
			"GROUP BY GROUP_ID_0";
	    }else if(_level == 1) {
	    	sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS GROUPNAME,T.group_id_1 AS GROUPID," + col +
			" WHERE T.group_id_0 = '"+query_code+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
			"GROUP BY GROUP_ID_1 ORDER BY GROUPID";
	    } else if(_level == 2) {
	    	sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS GROUPID," + col +
			" WHERE T.group_id_1 = '"+query_code+"' AND T.DEAL_DATE BETWEEN '"+querydate+"' and '"+endQueryDate+"' " +
			"GROUP BY UNIT_ID ORDER BY GROUPID";
	    }else {
	    	sql = "SELECT MAX('中国联通云南分公司') AS GROUPNAME,T.GROUP_ID_0 AS GROUPID," + col +
			" WHERE 1=2 " +
			"GROUP BY GROUP_ID_0";
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
       if(next_level>=2 || (group_level==2 && next_level==3)){
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
			startRow:2,
			startCol:0,
			cols:-1,
			excelModal:'cost_report_lj.xls',
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
