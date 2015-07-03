var click_flag = 0;
var _execute = $.Project.execute; 
var defaultMsgDom = $('#searchTime');
var tablecode = ["day_new_dev","day_go_num","day_on_num","day_income","mon_new_dev","mon_income"];
var querydate = ""; //查询日期
var firstday = "";  //当前日期第一天
var lastfirstday = ""; //上月日期第一天
var lastquerydate = "";
var finalday =""; //上月日期最后一天
var daytemp = 0;

jQuery(function($){
	$("#search").click(searchClick);
	querydate = deal_date; //当前日期
	initTable(); 
	//excel导出
	$("#button_excel").click(downsaction);
	$("#button_all_excel").click(downsAll);
});

function initTable(){
	var sql = "sum(t1.DAY_NEW_DEV) DAY_NEW_DEV,sum(t1.DAY_GO_NUM) DAY_GO_NUM,sum(t1.DAY_ON_NUM) DAY_ON_NUM, " +
			"sum(t1.DAY_INCOME) DAY_INCOME,sum(t1.MON_NEW_DEV) MON_NEW_DEV,sum(t1.MON_INCOME) MON_INCOME,  " +
			"T1.GROUP_ID_"+group_level+" GROUPID " +
			"FROM pmrt.TB_MRT_4G_DEV_INCOME_CHNL_DAY T1 "+
			"WHERE t1.group_id_"+group_level+"='"+group_id+"' AND t1.DEAL_DATE='"+querydate+"' " +
			"group by t1.group_id_"+group_level+" order by groupid";
	if(group_level == 0) {
		sql = "SELECT max('云南省') as groupname," + sql;
	}else {
		sql = "SELECT max(t1.group_id_"+group_level+"_name) as groupname,"+sql;
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#path").val()+"/public!queryList.action",
		data:{
			sql:sql
		},
		error:function(){
			alert("网络延迟");
		},
		success:function(data){
			if(data == undefined || data == null || data == '' || data.length < 1){
				var preDay = getYestoday(querydate);
				if(getYestoday(deal_date) == preDay) {
					querydate = preDay;
					initTable();
					$("#searchTime").val(preDay);
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
	var temp = "";
	temp += "<thead ><tr><th class='attend_th'>营销架构</th><th class='attend_th'>日期</th>" +
			"<th class='attend_th'>4G当日发展</th>" +
			"<th class='attend_th'>4G当日离网</th>" +
			"<th class='attend_th'>4G当日在网</th>" +
			"<th class='attend_th'>4G当日收入</th>" +
			"<th class='attend_th'>4G月累计发展</th>" +
			"<th class='attend_th'>4G月累计收入</th>" +
			"</tr></thead>";
	temp +=	"<tbody id='tableIcon'>";
	var array_area;
	var area_name;
	var area_code;
	
	if(data == undefined || data == null || data == '' || data.length < 1){
		temp+=("<tr><td colspan='13' style='text-align:center;color: red'>对不起，没有匹配到您想要的数据！</td></tr>");
		click_flag = 0;
	}else{
		var rowNum = data.length;
		for(var i=0; i<rowNum; i++){
			area_name = data[i]["groupname"];
			area_code = data[i]["groupid"];
			temp += "<tr>";
			if(group_level==5){
				//营销架构列
				temp += "<td style='text-align:left;'><span style='margin-left:15px;width:300px;' class='root' id='showArea_"+level+"_"+area_code+"' hasChildren='false' title='"+area_name+"' value='"+area_name+"'><a href='javascript:void(0)' class='root'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
			}else{
				//营销架构列
				temp += "<td style='text-align:left;white-space:nowrap;width:300px;'><span style='margin-left:15px;' class='sub_on' id='showArea_"+level+"_"+area_code+"' hasChildren='false' value='"+area_name+"'><a href='javascript:void(0)' class='sub_on'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
			}
			temp += "<td>"+querydate+"</td>";
			for(var j=0;j<tablecode.length;j++){
				var tmpval = data[i][tablecode[j]];
				
				if(tmpval!=null){
					tmpval = numberFormat(data[i][tablecode[j]]);
				}else{
					tmpval = "-";
				}
				temp += "<td>"+tmpval+"</td>";
			}
			temp += "</tr>";
		}
	}
	
	temp += "</tbody>";
	$("#tableData").html(temp);
	
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
    if(show_level>=5 || (group_level==5 && show_level>2)){
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
	    var sql = "sum(t1.DAY_NEW_DEV) DAY_NEW_DEV,sum(t1.DAY_GO_NUM) DAY_GO_NUM,sum(t1.DAY_ON_NUM) DAY_ON_NUM, " +
		"sum(t1.DAY_INCOME) DAY_INCOME,sum(t1.MON_NEW_DEV) MON_NEW_DEV,sum(t1.MON_INCOME) MON_INCOME,  " +
	    "T1.group_id_"+_level+" AS groupid " +
		"FROM pmrt.TB_MRT_4G_DEV_INCOME_CHNL_DAY T1 "+
		"where t1.group_id_"+area_level+"='"+query_code+"' AND t1.DEAL_DATE='"+querydate+"' " +
		"group by t1.group_id_"+_level+" order by groupid ";

		if(_level == 0) {
			sql = "SELECT max('云南省') as groupname," + sql;
		}else {
			sql = "SELECT max(t1.group_id_"+_level+"_name) as groupname,"+sql;
		}
		$.ajax({
	        type:"POST",
	        dataType:'json',
	        cache:false,
	        url:$("#path").val()+"/public!queryList.action",
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
       if(next_level==4 || (group_level==5 && next_level==2)){
           trStr += "<td style='text-align:left;'><span class='root' style='margin-left:"+marg+"px;width:300px;' id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"'><a href='javascript:void(0)' class='root' onclick=showSub(this);>"+name+"</a></span></td>";
       }else{
           trStr += "<td style='text-align:left;white-space:nowrap;width:300px;'><span class='sub_on' style='margin-left:"+marg+"px;' id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"'><a href='javascript:void(0)' class='sub_on' onclick=showSub(this);>"+name+"</a></span></td>";
       }
       trStr += "<td>"+querydate+"</td>";
       for(var j=0;j<tablecode.length;j++){
			var tmp = data[i][tablecode[j]];
			if(tmp!=null){
				tmp = numberFormat(data[i][tablecode[j]]);
			}else{
				tmp = "-";
			}
			trStr += "<td>"+tmp+"</td>";
		}
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
	initTable();
}

function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}

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
	 showtext= '4G用户发展与收入汇总日报页面数据-'+querydate;
	 _loadExcel({
			startRow:2,
			startCol:0,
			cols:-1,
			excelModal:'income_4g_dev_day.xls',
			sheetname:showtext,
			excelData:context
		},null,showtext);
	 
	 
}


function downsAll() {
	var qdate = $.trim($("#searchTime").val());
	 var sql = "SELECT T1.group_id_1_name,T1.group_id_2_name,T1.group_id_3_name," +
	 		"T1.group_id_4_name,T1.HQ_CHAN_CODE,T1.DEAL_DATE, T1.DAY_NEW_DEV,t1.DAY_GO_NUM,t1.DAY_ON_NUM, " +
	 		"T1.DAY_INCOME,t1.MON_NEW_DEV,t1.MON_INCOME  " +
	 		"FROM pmrt.TB_MRT_4G_DEV_INCOME_CHNL_DAY T1 " +
	 		"WHERE T1.DEAL_DATE = '"+qdate+"' and T1.group_id_"+group_level+"='"+group_id+"' " +
	 		 " order by T1.group_id_1,T1.group_id_2,T1.group_id_3,T1.group_id_4 ";
	 showtext= '4G用户发展与收入汇总日报全量数据-'+querydate;
	 _loadAllExcel({
			startRow:2,
			startCol:0,
			cols:-1,
			excelModal:'income_4g_dev_day_all.xls',
			sheetname:showtext,
			query:sql
		},null,showtext);
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

function getYestoday(date){  
	//如果日期格式是:yyyy-mm-dd
	//var date = date.split('-');
	//var today = new Date().setFullYear(+date[0], +date[1]-1, +date[2]);    //第二个参数减1因为月份是0~11
	//如果日期格式是：yyyymmdd
	date = date + "";
	var year = date.substr(0,4);
	var month = date.substr(4,2);
	var day = date.substr(6,2);
	var today = new Date().setFullYear(year, month-1, +day);
	var yesterday = new Date(today - 24 * 60 * 60 * 1000);
	var y = yesterday.getFullYear().toString();
	var m = (yesterday.getMonth() + 1).toString();
	var d = yesterday.getDate().toString();
	if(m.length<2) m = "0" + m;
	if(d.length<2) d = "0" + d;
	return y + m + d;
} 

function getPreMonth(currMonth) {
	currMonth = currMonth + "";
	var year = currMonth.substr(0,4);
	var mon = currMonth.substr(4,6);
	//var day = currMonth.substr(6,8);

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

//获取当月第一天
function getFirstDay( aday ) {
	var ayear = aday.substring(0,4);
	var amonth = aday.substring(4,6);
	firstday = ayear+amonth + "01";	
}

//获取 当月最后一天
function getFinalDay( aday ) {
	
}

//获取 上月第一天
function getLastFirstDay( aday ) {
	var ayear = aday.substring(0,4);
	var amonth = aday.substring(4,6) -1;
	/*var temp = amonth.substring(0,1);*/
	
	if(amonth == 0){
		amonth = "12";
		ayear = ayear -1;
	} else if(amonth != 10 && amonth != 11) {
		amonth = "0" + amonth;
	}

	lastfirstday =  ayear + amonth + "01";
}

//获取 上月最后一天
function getLastFinalDay( aday ) {
	var ayear = aday.substring(0,4);
	var amonth = aday.substring(4,6) -1;
	if(amonth == 0){
		amonth = "12";
		ayear = ayear -1;
	} else if(amonth != 10 && amonth != 11) {
		amonth = "0" + amonth;
	}
	
	finalday= ayear + amonth + new Date(ayear,amonth,0).getDate();
}

//比较当前日期和上月最后一天的大小
function countTemp( aday ){
	var ayear = aday.substring(0,4);
	var amonth = aday.substring(4,6) -1;
	var day = aday.substring(6,8);
	lday = new Date(ayear,amonth,0).getDate();
	
	daytemp = lday - day;	
}

//计算上个月的当前日期
function getLastQueryDate(aday){
	var ayear = aday.substring(0,4);
	var amonth = aday.substring(4,6) -1;
	var day = aday.substring(6,8);
	/*var temp = amonth.substring(0,1);*/
	
	if(amonth == 0){
		amonth = "12";
		ayear = ayear -1;
	} else if(amonth != 10 && amonth != 11) {
		amonth = "0" + amonth;
	}

	lastquerydate =  ayear + amonth + day;
}


/**
 * 切换显示与隐藏效果
 * @returns
 */
function amethod(obj) {				
	$(obj).toggle("fast");	
	/*var temp = getSelect();
	
	//alert(" temp" + temp);
	//alert(temp.length)
	
	if(temp.length == 0){
		$(".ct").append("<span class='03'>全部,</span>")
	}*/
}

function _loadAllExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}