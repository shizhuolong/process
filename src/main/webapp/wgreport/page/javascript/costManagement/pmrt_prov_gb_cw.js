var click_flag = 0;
var _execute = $.Project.execute; 
var defaultMsgDom = $('#searchTime');
var tablecode = ["czsr","yhqf","yyqf","yyys","yysk","yytf","yhyckye","yj","qdbt","ggxcf","khfwwx","yhhqcb","sdwy","fzf","zxf",
                 "sjsr","sjxscb","kcb","jrktf","jrzd","ict","yyypf",
                 "bgf","clf","hyf","zdf",
                 "clsyf","txf","qt","gross_profits"];
var querydate = "";
var endquerydate = "";
jQuery(function($){
	$("#search").click(searchClick);
	//querydate = deal_date;
	querydate = $.trim($("#searchTime").val());
	endquerydate = $.trim($("#endTime").val());
	initTable(); 
	//excel导出
	$("#button_excel").click(downsaction);
	$("#button_all_excel").click(downsAll);
	
});

function initTable(){
	var sql = "SUM(T.CZSR) CZSR,SUM(YHQF) AS YHQF,SUM(YYQF) AS YYQF,SUM(YYYS) AS YYYS,SUM(YYSK) AS YYSK,SUM(YYTF) AS YYTF,SUM(YHYCKYE) AS YHYCKYE,SUM(T.YJ) YJ,SUM(T.QDBT) QDBT,SUM(T.GGXCF) GGXCF,SUM(T.KHFWWX) KHFWWX,SUM(T.YHHQCB) YHHQCB,SUM(T.SDWY) SDWY,SUM(T.FZF) FZF,SUM(T.ZXF) ZXF," +
			"SUM(T.SJSR) SJSR, SUM(T.SJXSCB) SJXSCB, SUM(T.KCB) KCB, SUM(T.JRKTF) JRKTF, SUM(T.JRZD) JRZD, SUM(T.ICT) ICT,SUM(YYYPF) AS YYYPF," +
			"SUM(T.BGF) BGF,SUM(T.CLF) CLF,SUM(T.HYF) HYF," +
			"SUM(T.ZDF) ZDF,SUM(T.CLSYF) CLSYF,SUM(T.TXF) TXF,SUM(T.QT) QT,SUM(T.GROSS_PROFITS) GROSS_PROFITS " +
			"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE BETWEEN '"+querydate+"' AND '"+endquerydate+"' ";
	if(group_level == 0) {
		sql = "SELECT '云南省' AS groupname,T.GROUP_ID_0 AS groupid," + sql +
		" AND T.GROUP_ID_0 = '86000' AND T.G_LEVEL = 'Province' " +
		"GROUP BY '云南省',T.GROUP_ID_0";
	}else if(group_level == 1){
		sql = "SELECT T.GROUP_ID_1_NAME AS groupname,T.GROUP_ID_1 AS groupid," + sql +
			" AND T.GROUP_ID_1 = '"+group_id+"' AND T.G_LEVEL = 'Region' " +
			" GROUP BY T.GROUP_ID_1, T.GROUP_ID_1_NAME " +
			"ORDER BY T.GROUP_ID_1";
	}else if(group_level == 2) {
		sql = "SELECT T.GROUP_ID_2_NAME AS groupname,T.GROUP_ID_2 AS groupid," + sql +
		" AND T.GROUP_ID_2 = '"+group_id+"'AND T.G_LEVEL = 'City' " +
		" GROUP BY T.GROUP_ID_2, T.GROUP_ID_2_NAME " +
		" ORDER BY T.GROUP_ID_2";
	}else if(group_level == 3) {
		sql = "SELECT T.GROUP_ID_3_NAME AS groupname,T.GROUP_ID_3 AS groupid," + sql +
		" AND T.GROUP_ID_3 = '"+group_id+"'AND T.G_LEVEL = 'Group' " +
		" GROUP BY T.GROUP_ID_3, T.GROUP_ID_3_NAME " +
		" ORDER BY T.GROUP_ID_3";
	}else {
		sql = "SELECT T.GROUP_ID_4_NAME|| '(' || T.HQ_CHANL_CODE || ')' AS groupname,T.GROUP_ID_4 AS groupid," + sql +
		" AND T.GROUP_ID_4 = '"+group_id+"'AND T.G_LEVEL = 'Point' " +
		" GROUP BY T.GROUP_ID_4, T.GROUP_ID_4_NAME || '(' || T.HQ_CHANL_CODE || ')' " +
		" ORDER BY T.GROUP_ID_4";
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
	temp += "<thead >" +
			"<tr><th rowspan='2' class='attend_th'>营销架构</th>" +
			"<th colspan='7' class='attend_th'>收入项</th>" +
			"<th rowspan='2' class='attend_th'>佣金</th>" +
			"<th rowspan='2' class='attend_th'>渠道补贴</th>" +
			"<th rowspan='2' class='attend_th'>广告宣传费</th>" +
			"<th rowspan='2' class='attend_th'>客户服务及维系成本</th>" +
			"<th rowspan='2' class='attend_th'>用户获取成本</th>" +
			"<th rowspan='2' class='attend_th'>水电物业费</th>" +
			"<th rowspan='2' class='attend_th'>房租</th>" +
			"<th rowspan='2' class='attend_th'>装修费</th>" +
			"<th rowspan='2' class='attend_th'>手机收入</th>" +
			"<th rowspan='2' class='attend_th'>手机销售成本</th>" +
			"<th rowspan='2' class='attend_th'>卡成本</th>" +
			"<th rowspan='2' class='attend_th'>接入开通费</th>" +
			"<th rowspan='2' class='attend_th'>接入终端</th>" +
			"<th rowspan='2' class='attend_th'>ICT成本</th>" +
			"<th rowspan='2' class='attend_th'>营业用品费用</th>" +
			"<th colspan='7'>行政办公费</th>" +
			"<th rowspan='2' class='attend_th'>毛利润(收人项-成本项)</th>" +
			"<tr>" +
			"<th class='attend_th'>出账收入</th>" +
			"<th class='attend_th'>用户欠费</th>" +
			"<th class='attend_th'>营业欠费</th>" +
			"<th class='attend_th'>营业应收</th>" +
			"<th class='attend_th'>营业收款</th>" +
			"<th class='attend_th'>营业退费</th>" +
			"<th class='attend_th'>用户预存款余额</th>" +
			"<th class='attend_th'>1.办公费</th>" +
			"<th class='attend_th'>2.差旅费</th>" +
			"<th class='attend_th'>3.会议费</th>" +
			"<th class='attend_th'>4.招待费</th>" +
			"<th class='attend_th'>5.车辆使用费</th>" +
			"<th class='attend_th'>6.通信费</th>" +
			"<th class='attend_th'>7.其他</th>" +
			"</tr></thead>";
	temp +=	"<tbody id='tableIcon'>";
	var array_area;
	var area_name;
	var area_code;
	
	if(data == undefined || data == null || data == '' || data.length < 1){
		temp+=("<tr><td colspan='25' style='text-align:center;color: red'>对不起，没有匹配到您想要的数据！</td></tr>");
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
    if(show_level>=5 || (group_level==4 && show_level>2)){
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
	   /* var sql = "T.CZSR,T.YJ,T.GGXCF,T.KHFWWX,T.YHHQCB,T.SDWY,T.FZF,T.ZXF," +
	    "T.SJSR, T.SJXSCB, T.KCB, T.JRKTF, T.JRZD, T.ICT," +
	    		"T.BGF,T.CLF,T.HYF," +
		"T.ZDF,T.CLSYF,T.TXF,T.QT,T.GROSS_PROFITS " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE='"+querydate+"' ";*/
	    var sql = "SUM(T.CZSR) CZSR,SUM(YHQF) AS YHQF,SUM(YYQF) AS YYQF,SUM(YYYS) AS YYYS,SUM(YYSK) AS YYSK,SUM(YYTF) AS YYTF,SUM(YHYCKYE) AS YHYCKYE,SUM(T.YJ) YJ,SUM(T.QDBT) QDBT,SUM(T.GGXCF) GGXCF,SUM(T.KHFWWX) KHFWWX,SUM(T.YHHQCB) YHHQCB,SUM(T.SDWY) SDWY,SUM(T.FZF) FZF,SUM(T.ZXF) ZXF," +
		"SUM(T.SJSR) SJSR, SUM(T.SJXSCB) SJXSCB, SUM(T.KCB) KCB, SUM(T.JRKTF) JRKTF, SUM(T.JRZD) JRZD, SUM(T.ICT) ICT,SUM(YYYPF) AS YYYPF," +
		"SUM(T.BGF) BGF,SUM(T.CLF) CLF,SUM(T.HYF) HYF," +
		"SUM(T.ZDF) ZDF,SUM(T.CLSYF) CLSYF,SUM(T.TXF) TXF,SUM(T.QT) QT,SUM(T.GROSS_PROFITS) GROSS_PROFITS " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE BETWEEN '"+querydate+"' AND '"+endquerydate+"' ";
		if(_level == 0) {
			sql = "SELECT '云南省' AS groupname,T.GROUP_ID_0 AS groupid," + sql +
			" AND T.GROUP_ID_0 = '86000' AND T.G_LEVEL = 'Province' " +
			"GROUP BY '云南省',T.GROUP_ID_0";
		}else if(_level == 1){
			sql = "SELECT T.GROUP_ID_1_NAME AS groupname,T.GROUP_ID_1 AS groupid," + sql +
			" AND T.GROUP_ID_0 = '"+query_code+"' AND T.G_LEVEL = 'Region' " +
			" GROUP BY T.GROUP_ID_1, T.GROUP_ID_1_NAME " +
			" ORDER BY T.GROUP_ID_1";
		}else if(_level == 2) {
			sql = "SELECT T.GROUP_ID_2_NAME AS groupname,T.GROUP_ID_2 AS groupid," + sql +
			" AND T.GROUP_ID_1 = '"+query_code+"'AND T.G_LEVEL = 'City' " +
			" GROUP BY T.GROUP_ID_2, T.GROUP_ID_2_NAME " +
			" ORDER BY T.GROUP_ID_2";
		}else if(_level == 3) {
			sql = "SELECT T.GROUP_ID_3_NAME AS groupname,T.GROUP_ID_3 AS groupid," + sql +
			" AND T.GROUP_ID_2 = '"+query_code+"'AND T.G_LEVEL = 'Group' " +
			" GROUP BY T.GROUP_ID_3, T.GROUP_ID_3_NAME " +
			" ORDER BY T.GROUP_ID_3";
		}else {
			sql = "SELECT T.GROUP_ID_4_NAME|| '(' || T.HQ_CHANL_CODE || ')' AS groupname,T.GROUP_ID_4 AS groupid," + sql +
			" AND T.GROUP_ID_3 = '"+query_code+"'AND T.G_LEVEL = 'Point' " +
			" GROUP BY T.GROUP_ID_4, T.GROUP_ID_4_NAME || '(' || T.HQ_CHANL_CODE || ')' " +
			" ORDER BY T.GROUP_ID_4";
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
       if(next_level>=4 || (group_level==4 && next_level==2)){
           trStr += "<td style='text-align:left;'><span class='root' style='margin-left:"+marg+"px; width:300px;' id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' class='root' onclick=showSub(this);>"+name+"</a></span></td>";
       }else{
    	   trStr += "<td style='text-align:left;white-space:nowrap;width:300px;'><span class='sub_on' style='margin-left:"+marg+"px;'  id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' class='sub_on' onclick=showSub(this);>"+name+"</a></span></td>";
       }

       for(var j=0;j<tablecode.length;j++){
			var tmp = data[i][tablecode[j]];
			if(tmp!=null){
				tmp = numberFormat(data[i][tablecode[j]]);
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


function searchClick() {
	querydate = $.trim($("#searchTime").val());
	endquerydate = $.trim($("#endTime").val());
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
	 var qdate = $.trim($("#searchTime").val());
	 showtext="主体财务报表-"+qdate;
	 _loadExcel({
			startRow:2,
			startCol:0,
			cols:-1,
			excelModal:'pmrt_prov_gb_cw.xls',
			sheetname:showtext,
			excelData:context
		},null,showtext);
	 
}

function _loadAllExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}



//导出全部
function downsAll() {
	var qdate = $.trim($("#searchTime").val());
	var endQDate = $.trim($("#endSearchTime").val());
	/*var sql = "SELECT T.GROUP_ID_1_NAME,T.GROUP_ID_2_NAME,T.GROUP_ID_3_NAME," +
			"CASE WHEN T.GROUP_ID_4_NAME IS NOT NULL THEN T.GROUP_ID_4_NAME|| '(' || T.HQ_CHANL_CODE || ')' ELSE T.GROUP_ID_4_NAME END," +
			"T.CZSR,T.YJ,T.GGXCF,T.KHFWWX,T.YHHQCB,T.SDWY,T.FZF,T.ZXF," +
			"T.SJSR, T.SJXSCB, T.KCB, T.JRKTF, T.JRZD, T.ICT," +
			"T.BGF,T.CLF,T.HYF,T.ZDF,T.CLSYF,T.TXF," +
			"T.QT,T.GROSS_PROFITS FROM PMRT.TB_MRT_PROV_GB_CW T " +
			"WHERE T.DEAL_DATE = '"+qdate+"'";*/
	var col = "SUM(T.CZSR) CZSR,SUM(YHQF) AS YHQF,SUM(YYQF) AS YYQF,SUM(YYYS) AS YYYS,SUM(YYSK) AS YYSK,SUM(YYTF) AS YYTF,SUM(YHYCKYE) AS YHYCKYE,SUM(T.YJ) YJ,SUM(T.QDBT) QDBT,SUM(T.GGXCF) GGXCF,SUM(T.KHFWWX) KHFWWX,SUM(T.YHHQCB) YHHQCB," +
			"SUM(T.SDWY) SDWY,SUM(T.FZF) FZF,SUM(T.ZXF) ZXF,SUM(T.SJSR) SJSR,SUM(T.SJXSCB) SJXSCB,SUM(T.KCB) KCB," +
			"SUM(T.JRKTF) JRKTF,SUM(T.JRZD) JRZD,SUM(T.ICT) ICT,SUM(YYYPF) AS YYYPF,SUM(T.BGF) BGF,SUM(T.CLF) CLF,SUM(T.HYF) HYF," +
			"SUM(T.ZDF) ZDF,SUM(T.CLSYF) CLSYF,SUM(T.TXF) TXF,SUM(T.QT) QT,SUM(T.GROSS_PROFITS) GROSS_PROFITS ";
	var precol = "t.group_id_1 || t.group_id_2||t.group_id_3||t.hq_chanl_code AS gid";
	var groupBySql = ",t.group_id_1 || t.group_id_2||t.group_id_3||t.hq_chanl_code"; 
	var sql = "";
	if(group_level == 0) {
		sql = "SELECT '86000' AS gid,max('云南省'),'云南省' AS GROUPNAME," + col +" " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
		"AND T.GROUP_ID_0 = '86000' AND T.G_LEVEL = 'Province' " +
		"GROUP BY '云南省','86000' " +
		" UNION ALL " +
		"SELECT "+precol+",max('地市'),T.GROUP_ID_1_NAME AS GROUPNAME," + col + " " +
				"FROM PMRT.TB_MRT_PROV_GB_CW T " +
				"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
				"AND T.GROUP_ID_0 = '86000' AND T.G_LEVEL = 'Region' " +
				"GROUP BY T.GROUP_ID_1_NAME" + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('区县'),T.GROUP_ID_2_NAME AS GROUPNAME," + col + " " +
				"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
				"AND T.G_LEVEL = 'City' " +
				"GROUP by T.GROUP_ID_2_NAME " + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('网格'),G.GROUP_ID_3_NAME AS GROUPNAME," + col + " " +
				"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_GROUP_CODE G " +
				"ON (T.GROUP_ID_3 = G.GROUP_ID_3) " +
				"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' AND T.G_LEVEL = 'Group' " +
				"GROUP BY G.GROUP_ID_3_NAME " + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('渠道'),G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' AS GROUPNAME," + col +" " +
				"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_CHANL_HQ_CODE G " +
				"ON (T.GROUP_ID_4 = G.GROUP_ID_4) " +
				"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' AND T.G_LEVEL = 'Point' " +
				"GROUP BY G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' " + groupBySql;
	}else if(group_level == 1){
		sql = "SELECT "+precol+",max('地市'),T.GROUP_ID_1_NAME AS GROUPNAME," + col + " " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
		"AND T.GROUP_ID_1 = '"+group_id+"' AND T.G_LEVEL = 'Region' " +
		"GROUP BY T.GROUP_ID_1_NAME " + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('区县'),T.GROUP_ID_2_NAME AS GROUPNAME," + col + " " +
				"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
				"AND T.GROUP_ID_1 = '"+group_id+"' AND T.G_LEVEL = 'City' " +
				"GROUP BY T.GROUP_ID_2_NAME" + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('网格'),G.GROUP_ID_3_NAME AS GROUPNAME," + col + " " +
				"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_GROUP_CODE G " +
				"ON (T.GROUP_ID_3 = G.GROUP_ID_3) " +
				"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
				"AND G.GROUP_ID_1='"+group_id+"' AND T.G_LEVEL = 'Group' " +
				"GROUP BY G.GROUP_ID_3_NAME " + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('渠道'),G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' AS GROUPNAME," + col +" " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_CHANL_HQ_CODE G " +
		"ON (T.GROUP_ID_4 = G.GROUP_ID_4) " +
		"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' AND " +
				" G.GROUP_ID_1 = '"+group_id+"' " +
				" AND T.G_LEVEL = 'Point' " +
		"GROUP BY G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')'" + groupBySql;
		
		//sql = sql + " T.GROUP_ID_1='"+group_id+"' ";
	}else if(group_level == 2) {
		sql = "SELECT "+precol+",max('区县'),T.GROUP_ID_2_NAME AS GROUPNAME," + col + " " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
		"AND T.GROUP_ID_1 = '"+group_id+"' AND T.G_LEVEL = 'City' " +
		"GROUP BY T.GROUP_ID_2_NAME" + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('网格'),G.GROUP_ID_3_NAME AS GROUPNAME," + col + " " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_GROUP_CODE G " +
		"ON (T.GROUP_ID_3 = G.GROUP_ID_3) " +
		"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
		"AND G.GROUP_ID_2='"+group_id+"' AND T.G_LEVEL = 'Group' " +
		"GROUP BY G.GROUP_ID_3_NAME " +groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('渠道'),G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' AS GROUPNAME," + col +" " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_CHANL_HQ_CODE G " +
		"ON (T.GROUP_ID_4 = G.GROUP_ID_4) " +
		"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' AND " +
				" G.GROUP_ID_2 = '"+group_id+"' " +
				" AND T.G_LEVEL = 'Point' " +
		"GROUP BY  G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' " +groupBySql;
		//sql = sql + " T.GROUP_ID_2='"+group_id+"' ";
	}else if(group_level == 3) {
		sql = "SELECT "+precol+",max('网格'),G.GROUP_ID_3_NAME AS GROUPNAME," + col + " " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_GROUP_CODE G " +
		"ON (T.GROUP_ID_3 = G.GROUP_ID_3) " +
		"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' " +
		"AND G.GROUP_ID_3='"+group_id+"' AND T.G_LEVEL = 'Group' " +
		"GROUP BY G.GROUP_ID_3_NAME " + groupBySql +
		" UNION ALL " +
		"SELECT "+precol+",max('渠道'),G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' AS GROUPNAME," + col +" " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_CHANL_HQ_CODE G " +
		"ON (T.GROUP_ID_4 = G.GROUP_ID_4) " +
		"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' AND " +
				" G.GROUP_ID_3 = '"+group_id+"' " +
				" AND T.G_LEVEL = 'Point' " +
		"GROUP BY G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' " +groupBySql;
		//sql = sql + " T.GROUP_ID_3='"+group_id+"' ";
	}else {
		sql = "SELECT "+precol+",max('渠道'),G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' AS GROUPNAME," + col +" " +
		"FROM PMRT.TB_MRT_PROV_GB_CW T LEFT JOIN PCDE.TB_CDE_CHANL_HQ_CODE G " +
		"ON (T.GROUP_ID_4 = G.GROUP_ID_4) " +
		"WHERE T.DEAL_DATE BETWEEN '"+qdate+"' AND '"+endQDate+"' AND " +
				" G.GROUP_ID_4 = '"+group_id+"' " +
				" AND T.G_LEVEL = 'Point' " +
		"GROUP BY G.GROUP_ID_4_NAME || '(' || G.HQ_CHAN_CODE || ')' " +groupBySql;
		//sql = sql + " T.GROUP_ID_4='"+group_id+"' ";
	}
	//sql = sql + "ORDER BY T.GROUP_ID_1, T.GROUP_ID_2, T.GROUP_ID_3, T.GROUP_ID_4";
	showtext="主体财务报表-"+qdate;
	 _loadAllExcel({
			startRow:2,
			startCol:0,
			cols:-1,
			excelModal:'pmrt_prov_gb_cw_all.xls',
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
