var request=new JSRequest();
var reportID=""; 
var loginno="";
var tripFlag=true;
$(function(){   // 开始加载
	$("body").mousedown(function(e){//调整表头由于固定和下面行不对齐问题
		if(3==e.which){//鼠标右键触发重新固定表头否则浏览器开销太大
			 //固定表头  
	        var tableWidth=$("#tableWidth").val();
	        if(tableWidth==0){
	        	tableWidth= $(window).width();//一直使用首次宽度，更准确
	        	$("#tableWidth").val(tableWidth);
	        } 
	        var len=$("#demoTable tbody").find("tr").length;
	        if(len<100){//太多行浏览器开销太大小于100行才调整
	        	FixTable("demoGrid1", 2, tableWidth, 430); //调整列对齐
	        }
		}
	});
	reportID=$("#reportID").val();  
	loginno=$("#loginno").val();
	initPage(); 
	changeTab(
		tab = ".tab",
		tabTitle = ".tab_title dl",
		tabBox = ".tab_box dl",	
		selected = "selected"
	);
});  
//得到当前年月
function getMonthVal(){
	var curretDate = new Date();
	var year =  curretDate.getFullYear();
	var month = curretDate.getMonth()+"";
	if("0" == month){
		month = "12";
		year = year-1;
	}
	year = year+"";
	if(month.length == 1)
		month = "0"+month;
	return year+month;
}
//得到选择的值
function getSelectedValues($div) {
	var selectedValues = "";
	var selectedNames = "";
	$div.find("input[name='checkbox']:checked").each(function (i, item) {
		selectedValues += $(this).val() + ",";
		selectedNames += $(this).parent().find("span").text()+",";
	});	
	selectedValues = selectedValues.substring(0, selectedValues.length-1);
	selectedNames = selectedNames.substring(0, selectedNames.length-1);
	$("#orgValues").val(selectedValues);
	$("#orgNames").val(selectedNames);
}

//判断滚动条是否到最底端的方法  
function isScrollBottom(obj) {   
    if (obj.scrollTop + obj.clientHeight === obj.scrollHeight) {  
        return true;  
    } else {  
        return false;  
    }  
}

//进入页面初始化
function initPage(){  
	var groupNo=$("#groupNo").val();
	var reportID=$("#reportID").val();
	var data1 = "groupNo=" + groupNo +"&reportID="+reportID+"&loginno="+loginno;
	$.ajax({
		type : 'post',
		url : rootPath+'/page/report!initPage.action', 
	    data: data1,
        dataType: "json",
        success: function(data) {
        	$("#loading").hide();
			var e=data.page.excel;  
			document.title=e.reportName;  
			$("#reportName").val(e.reportName);
			$("#tableName").val(e.tableName);
			$("#modelExcel").val(e.modelExcel);
			$("#pageTitles").val(e.pageTitles);
			$("#showIndex").val(e.showIndex);
			$("#orderIndex").val(e.orderIndex);  
			$("#groupIndex").val(e.groupIndex); 
			$("#dataFormat").val(e.dataFormat);	
			$("#modelExcel").val(e.modelExcel); 
			$("#whereColname").val(e.whereColname);
			$("#whereInfo").val(e.whereInfo); 
			$("#colNames").val(e.colNames); 
			$("#operateType").val(e.operateType);
			$("#operateData").val(e.operateData);
			
			//下钻下载层级展示
			var tripDownVal=e.tripDown;
			var _downHtml="";
			if(tripDownVal!=""){
				var tripDownSplit=tripDownVal.split(";");
				var colNameSplit=e.colName.split(";")
				for(var m=0;m<tripDownSplit.length;m++){
					if(tripDownSplit[m]!=""){
						if(_downHtml==""){
							_downHtml+='<div><table><tr><td><input disabled="disabled" name="checkbox" type="checkbox" checked="checked" value="'+colNameSplit[m]+'"><span>'+tripDownSplit[m]+'</span></td><td Style="width:170px;"></td></tr></table></div>';
						}else{
							_downHtml+='<div><table><tr><td><input checked="checked" name="checkbox" type="checkbox" value="'+colNameSplit[m]+'"><span>'+tripDownSplit[m]+'</span></td><td Style="width:170px;"></td></tr></table></div>';
						}
					}
				}
			}
			$("#selectServer-dialog").html(_downHtml);
			
			var colWidth=e.colWidth;
			$("#colWidth").val(e.colWidth); 
			if(colWidth!="" && colWidth.indexOf("@")>=0){
				colWidth=colWidth.split("@");
				$("#colWidth").val(colWidth[0]);
				$("#colWidthAll").val(colWidth[1]);
			}
			$("#isMoreHead").val(e.isMoreHead);
			$("#levelMain").val(1); 
			$("#selConfig").val(e.whereInfo); 
			$("#tripIndex").val(e.tripIndex);
			$("#colComment").val(e.colComment);
			$("#title_span1").html(e.reportName);
			$("#title_span2").html(e.reportName);  
			$("#datafuncIndex").val(e.datafuncIndex); 
			var whereInfo2=e.whereInfo.split(";");
			var colNames2=e.colNames.split(";");
			var pageTitles=e.pageTitles.split(";");
			var selTitles=e.pageTitles.split(";");
			var colComments=e.colComment.split(";");
			var list=data.page.list;  
			var html="",val=""; 			
			var html="<tr class='style3'>",frameColName="";
            var reportSel_temp=$("#reportSel_temp").html();
            var reportSel_temp2=$("#reportSel_temp2").html();
            var reportSel_temp3=$("#reportSel_temp3").html();
            var reportDate_temp=$("#reportDate_temp").html();
            var reportCharNum_temp=$("#reportCharNum_temp").html();
            var reportChar2_temp=$("#reportChar2_temp").html();
			var selConfig = "";
            selConfig=selConfig.split("@"); 
            var obj = new Object();
            var j=0,findNum=0;
            for (var i = 0; i < list.length; i++) { //主要是标题和数据 
               var selID = list[i].selID;
               var levelsMax = list[i].levelsMax; 
               var findData = list[i].findData; 
               var signType = list[i].signType;
               var levels = list[i].levels;//来着用户登录归属地等级
               var selTitle=pageTitles[i];//,list[i].selTitle
               var selType = list[i].selType;
               var isMore = list[i].isMore;
               var isFuzzyQuery = list[i].isFuzzyQuery; 
               var selValueIndex =list[i].selValue;
               var selTextIndex =list[i].selText;
               var selExplain = list[i].selExplain;
               var selSql = list[i].selSql;
               var isLeaf = list[i].isLeaf;
               if(signType!="0"){ 
            	   //取最后一位不为空为条件名称
            	   	 if(whereInfo2[i].substring(whereInfo2[i].lastIndexOf(",")+1, whereInfo2[i].length)!=""){
            	   		 selTitles[i]=whereInfo2[i].substring(whereInfo2[i].lastIndexOf(",")+1, whereInfo2[i].length);    
            	   	 }
                   if(selTitles[i]!=undefined&&selTitles[i]!=""&&selTitles[i].length==2){
                 	  selTitles[i]=selTitles[i].substring(0,1)+"&#12288;&#12288;"+selTitles[i].substring(1,2);
                   }
                   j++;
                   findNum++;
         		  if(selConfig.length>1){//url有值,只需要时间和地点?
             		  var tmp=selConfig[i].split(";"); //selConfig=d;201406@0;''@0;''@0;''@0;''@s;116;group_name;1;16134;广州;@0;''@0;''@0;''@0;''
             		  if(signType=='s'){
             			 findData=tmp[4]; 
             		  }else{
             			 findData=tmp[1]; 
             		  }
                   }             	  
                   if(signType=='s'){ //下拉框  
                      if(list[i].dataLevel==1){
                         if(levels>0){
                        	 findData=findData.split(";"); 
                             findData=findData[0]; 
                         } 
                         $("#selData").val(findData);
                      }
                      
                      var colNames =list[i].colNames.split(";");
                      var popWord=pageTitles[i]+"："; //selTitles[i]
                      if(levelsMax>1){//多层不需要文字提示  "101,102,103".indexOf(selID)>=0 
                      }else{
                    	 reportSel_temp=reportSel_temp2;//单层下拉框
                      } 
                      
                      if(selID=="104"){ //数据筛选
                      }	 
                      var objStr = "obj.popWord='" + popWord + "';obj.i="+i+"; obj.selTitles='"+selTitle+"'; obj.selID='"+selID+"'; obj.colName='"+colNames[selValueIndex]+"'; obj.levels='"+levels+"';" + "obj.data='"+findData+
                      			   "'; obj.levelsMax='"+levelsMax+"';obj.selValue='"+selValueIndex+"';obj.selText='"+selTextIndex+"';obj.isMore='"+isMore+"';obj.isFuzzyQuery='"+isFuzzyQuery+"';"; //清除文本框中的模板值,默认值为空
        			  eval(objStr);   
        			  html+=repTemp(obj, reportSel_temp);
                   }else if(signType=='d'){ //日期
                      var dateType = list[i].dateType;
                      if(reportID=='164' && dateType=='yyyy-MM-dd'){
                    	  findData='""';
                      }
                      var objStr = "obj.selTitles='" + selTitles[i] + "'; obj.i='"+i+"'; obj.dateType='"+dateType+"'; obj.data='"+findData+"';"; //清除文本框中的模板值,默认值为空
        			  eval(objStr);  
        			  html+=repTemp(obj, reportDate_temp);  
                   }else if(signType=='c' || signType=='n'){
                      var objStr = "obj.selTitles='" + selTitles[i] + "'; obj.i='"+i+"'; obj.dateType='"+dateType+"'; obj.data='"+findData+"';"; //清除文本框中的模板值,默认值为空
        			  eval(objStr);  
        			  html+=repTemp(obj, reportCharNum_temp);  
                   }else if(signType=='c2'){ 
                	  var colName =list[i].colNames; 
                	  var dataLevel =list[i].dataLevel; //2,code;2,name
                	  var readonly='""';
                	  if(dataLevel==""){
                		  dataLevel='""'; 
                	  }else{ 
                		  readonly="readonly";
                	  } 
                	  var selValue='""';
                	  if(dataLevel.indexOf("loginno")>0){
                		  selValue=list[i].findData;
                	  }
                	  var value='""';
                	  if("bill_cycle" == colName){
                		  value=getMonthVal();
                	  }else
                		  value='""';
                      var objStr = "obj.selID='"+selID+"'; obj.selTitles='" + selTitles[i] + "'; obj.i='"+i+"'; obj.dateType='"+dateType+"'; obj.data='"+findData+"'; obj.selValue='"+selValue+"'; obj.colName='"+colName+"'; obj.dataLevel='"+dataLevel+"'; obj.isMore='"+isMore+"'; obj.readonly='"+readonly+"';obj.selSql='"+selSql+"';obj.dateValue='"+value+"';"; //清除文本框中的模板值,默认值为空
                     
                      eval(objStr);  
         			  html+=repTemp(obj, reportChar2_temp);
                    }else if(signType=='c3'){ //数据权限只读
                      var dataLevel =list[i].dataLevel; 
                      findData=findData.split(";");
                      var selValue=findData[0]; 
                      findData=findData[1]; 
                      var objStr = "obj.selTitles='" + selTitles[i] +"'; obj.selID='"+selID+ "'; obj.i='"+i+"'; obj.dateType='"+dateType+"'; obj.data='"+findData+"'; obj.selValue='"+selValue+"'; obj.dataLevel='"+dataLevel+"';"; //清除文本框中的模板值,默认值为空
         			  eval(objStr);  
         			  html+=repTemp(obj, reportSel_temp3);  
                    } 
                   if(j>0 && j%4==0){ //每4个查询条件换行 
                   	html=""+html+"</tr><tr class='style3'>";
                   }
         	   }
               
            } 
            if(findNum>0 && findNum<=4){
            	var begin=html.toLowerCase().lastIndexOf("</td>");
            	html=html.substring(0, begin)+"<span>"+$(".search-div").html()+"</span>"+html.substring(begin,html.length);//插入查询条件，排版更好
            }else{
            	var colspan=4-(findNum%4); //避免ie有灰色背景
            	html+="<td colspan='"+colspan+"'><div>"+$(".search-div").html()+"</div></td>";
            }
            var begin=html.toLowerCase().lastIndexOf("<tr class='style3'>");
            var html2=html.substring(begin, html.length);
            if(html2!="<tr class='style3'>"){ //避免最后为空行
            	 html+="</tr>"; //若不是</tr>结尾需要加上 
            }else{
            	 html=html.substring(0, begin); //删除最后多余的tr
            } 
            html=html.replaceAll("null", "");
            $("#reportFindTr").html(html); 
            for (var i = 0; i < list.length; i++) { //主要是标题和数据 
                var selID = list[i].selID;
                var levelsMax = list[i].levelsMax;  
                var signType = list[i].signType; 
            	if(signType=='s' && levelsMax==1){ 
                	findSelect(selID,i);//数据权限优先处理,不能异步?
                } 
            } 
            var tripIndex = e.tripIndex.split(";");
            for(i=0;i<tripIndex.length;i++){
            	if(tripIndex[i] != "-1"){
            		tripFlag=false;
            	}
            }
            if(tripFlag){
            	$("#pageHtml").show();//翻页图标显示
            	querylist("first"); 
            }else{
            	$("#pageHtml").hide();//下钻图标隐藏
            	newQuerylist("1"); 
            }
		}
	});
}
 
//查询
function searchData(flag){
	 if(tripFlag){//翻页
     	querylist(); 
	 }else{
     	newQuerylist(flag); //下钻
	 }
}

//查询数据
function newQuerylist(query){  
	$("#loadWord").html("加载数据...");
	$("#loading").show();
	$("#downExcel").hide(); 
	var reportID=$("#reportID").val();
	$("#reportId").val(reportID);
	var orderIndex=$("#orderIndex").val(); 
	var groupIndex=$("#groupIndex").val(); 
	var operateType=$("#operateType").val(); 
	var operateData=$("#operateData").val(); 
	var pageSize=$("#pageSize").val(); 
	var colNames=$("#colNames").val(); 
	var whereColname=$("#whereColname").val();
	var tripIndex = $("#tripIndex").val();
	var lastTripIndex = $("#lastTripIndex").val();
	var wheres=""; 
	var whereInfo=$("#whereInfo").val();
	var whereValues=getWhereValues(whereInfo);
	if(orderIndex==null || orderIndex==""){
		orderIndex="1,2";
	}
	var selConfig=getSelect();
	var data1 = "reportID=" + reportID +"&orderIndex="+orderIndex+"&groupIndex="+groupIndex+"&operateType="+operateType+"&operateData="+operateData+
				"&pageSize="+pageSize+"&wheres="+wheres+"&colNames="+colNames+"&whereColname="+whereColname+"&selConfig="+selConfig+"&tripIndex="+tripIndex+"&whereValues="
				+whereValues+"&lastTripIndex="+lastTripIndex;
	$.ajax({
		type : 'post',
		url : rootPath+'/page/report!newFindData.action',
	   	data : data1,
	    dataType: "json", 
		success: function(data){ 
			newFillTable(data,1,query);
			$("#action").val('/page/report!newFindData.action'); 
			$("#loading").hide();
		},error : function (XMLHttpRequest, textStatus, errorThrown) {
			alert("数据查询出错,请联系相关人员");
		}
	});
}

//查询数据
function querylist(type){  
	$("#loadWord").html("加载数据...");
	$("#loading").show();
	$("#downExcel").hide(); 
	var reportID=$("#reportID").val();
	var orderIndex=$("#orderIndex").val(); 
	var groupIndex=$("#groupIndex").val(); 
	var operateType=$("#operateType").val(); 
	var operateData=$("#operateData").val(); 
	var pageSize=$("#pageSize").val(); 
	var colNames=$("#colNames").val(); 
	var whereColname=$("#whereColname").val(); 
	var wheres=""; 
	if(orderIndex==null || orderIndex==""){
		orderIndex="1,2";
	}
	var selConfig=getSelect();
	var data1 = "reportID=" + reportID +"&orderIndex="+orderIndex+"&groupIndex="+groupIndex+"&operateType="+operateType+"&operateData="+operateData+
				"&pageSize="+pageSize+"&wheres="+wheres+"&colNames="+colNames+"&whereColname="+whereColname+"&selConfig="+selConfig;
	$.ajax({
		type : 'post',
		url : rootPath+'/page/report!findData.action',
	   	data : data1,
	    dataType: "json", 
		success: function(data){ 
			fillTable(data,type);
			$("#loading").hide();
			$("#action").val('/page/report!findData.action'); 
			//$("#loading").hide();
		},error : function (XMLHttpRequest, textStatus, errorThrown) {
			//$.unblockUI();
			alert("数据查询出错,请联系相关人员");
		}
	});
}

//查询数据，填充表格
function newFillTable(data,level,query) {
    // 清空表格所有内容 重新编织 
    var _table = "";
    var reportID = $("#reportID").val();
	$("#reportId").val(reportID);
    var funcIndexs = data.page.excel.funcIndex.split(";");
    var lastTripIndex = data.page.excel.tripIndex;
    $("#lastTripIndex").val(lastTripIndex);
    var isMoreHead = $("#isMoreHead").val();
    var pageTitles = $("#pageTitles").val();
    var columnName="";
    var pageTitles2 = pageTitles.split(";");
    var showIndex = data.page.excel.showIndex;
    var showIndex2 = showIndex.split(";");
    var datafuncIndex=$("#datafuncIndex").val().split(";");
    var colWidth = $("#colWidth").val();
    var colWidth2 = colWidth.split(";");
    var pageHtml = page1(data.page); 
    var operateType = $("#operateType").val();
    var dataFormat=$("#dataFormat").val(); 
    var dataFormat2="";
    if(dataFormat!=null){
    	dataFormat2= dataFormat.split(";");
    }
    var isDel = "yes",
    isEdit = "yes",
    isAdd = "yes";
    if (operateType.indexOf("delete") == -1) {
        isDel = "none"; 
    }
    if (operateType.indexOf("edit") == -1) {
        isEdit = "none"; 
    }
    if (operateType.indexOf("delete") >= 0) {
        isAdd = "none"; 
    }
    
    var _thead = "<tr>";
    var colNum=0; 
    $("#isMoreHead").val(isMoreHead);
    if(isMoreHead==-1){ //单行表头
    	for (var i = 0; i < showIndex2.length; i++) {
    		columnName += pageTitles2[showIndex2[i]];
    		if(i<showIndex2.length-1)columnName+=",";
    	if (colWidth2[showIndex2[i]] != undefined && colWidth2[showIndex2[i]] != "")   
            _thead += "<th style='text-align:center;border-color:#cebb9e; background-color:#ecd8c7;width:"+colWidth2[showIndex2[i]]+"px;'>" + pageTitles2[showIndex2[i]] + "</th>";
    		else
    		_thead += "<th style='text-align:center;border-color:#cebb9e; background-color:#ecd8c7;'>" + pageTitles2[showIndex2[i]] + "</th>";
        }
    	_thead +="</tr>";
    }else{ //多行表头
	    pageTitles = pageTitles.split("|");
	    showIndex = showIndex.split(";");
	    var tmp=""; 
	    for (var i = 0; i < pageTitles.length; i++) { 
	       _thead+="<tr>";
	       tmp=pageTitles[i].split(","); 
	       colNum=tmp.length;
	       for (var j = 0; j < tmp.length; j++) { 
	    	   if(tmp[j]!=undefined){
	    		   if (colWidth2[showIndex2[j]] != undefined && colWidth2[showIndex2[j]] != "") {
	    			   if(i!=pageTitles.length-1){
			    		   _thead+='<td align="center" valign="middle" style="text-align:center;border-color:#cebb9e; background-color:#ecd8c7;width:'+colWidth2[showIndex2[j]]+'px;">'+tmp[j]+'</td>';                                
			    	   }else{//最后一行可以 点击"排序"
			    		   _thead+='<td onclick="findReport(1,'+showIndex[j]+')" title="点击排序" style="text-align:center;border-color:#cebb9e; background-color:#ecd8c7;width:'+colWidth2[showIndex2[j]]+'px;">'+tmp[j]+'<span id="th_'+showIndex[j]+'" style="color:red"></span></td>';//↑↓ 
			    	   }
	    		   }else{
	    			   if(i!=pageTitles.length-1){
			    		   _thead+='<td align="center" valign="middle" style="text-align:center;border-color:#cebb9e; background-color:#ecd8c7;">'+tmp[j]+'</td>';                                
			    	   }else{//最后一行可以 点击"排序"
			    		   _thead+='<td onclick="findReport(1,'+showIndex[j]+')" title="点击排序" style="text-align:center;border-color:#cebb9e; background-color:#ecd8c7;">'+tmp[j]+'<span id="th_'+showIndex[j]+'" style="color:red"></span></td>';//↑↓ 
			    	   }
	    		   } 
	    	   } 
	       }  
	       _thead+="</tr>";
	    } 
	    columnName=$("#pageTitles").val();
    }
    $("#columnName").val(columnName);
    if(query=="1"){
    	 $("#reportHead").html(_thead);
    }
    var colNames = $("#colNames").val();
    var colNames2 = colNames.split(";");
    var in_time_index = -1,
    in_id_index = -1;
    for (var i = 0; i < colNames2.length; i++) {
        if (colNames2[i].toLowerCase() == 'in_time') {
            in_time_index = i; 
        } else if (colNames2[i].toLowerCase() == 'in_id') {
            in_id_index = i; 
        } 
    } 
    var style1 = "", width = "",  tr = "", trTmp = "",bgcolor="",dataTmp="",textAlign="";
    var list = data.page.list;
    var isSameLen = data.page.isSameLen;
    var dataMaxLen = data.page.dataMaxLen;
    var colTypes = data.page.colTypes;
    colTypes=colTypes.split(";"); 
    $("#fileName").val(data.page.excel.reportName);
    $("#expSql").val(data.page.sql);
    var flag = 0;
    var widthTable = 0;
    if (list.length > 0) {
        $.each(list,   function(i, n) {
            if (flag == 0) {
                $("#firstRid").val(n[in_id_index]); 
            }
            bgcolor="#FAFAFA"; //影响鼠标移到修改背景色
	    	if(i%2==0){
	    		bgcolor="#FFFFFF";
	    	} 
            trTmp = "<tr id='recoder_" + n[in_id_index] + "' class='style3' onmouseover=\"this.style.backgroundColor='#ffeeee'\" onmouseout=\"this.style.backgroundColor='#FFFFFF'\" >";
            for (var j = 0; j < showIndex2.length; j++) {
            	 textAlign = "left";
                 width = ""; 
                 dataTmp=n[j]; 
                 dataTmp=getDataFormat(showIndex2,isSameLen,dataMaxLen,j,dataTmp,colTypes[j],dataFormat2[showIndex2[j]]);//格式设置和对齐方式
                 dataTmp=dataTmp.split("@@");
                 textAlign=dataTmp[1]; 
                 if(textAlign==undefined||textAlign=="undefined"){
                	 textAlign = "right";
                 }
             	dataTmp=dataTmp[0]; 
                 if (colWidth2[showIndex2[j]] != undefined && colWidth2[showIndex2[j]] != "") { 
                     width = "width:" + colWidth2[showIndex2[j]] + "px; word-break:break-all; word-wrap:break-word;";
                 } else if (dataTmp.length > 100) { //字符很长，限制最大宽度，避免挤压导致其他列换行
                     width = "width:320px; word-break:break-all; word-wrap:break-word;"; 
                 }
                 if (dataTmp == " ") {
                     dataTmp = "&nbsp;&nbsp;"; 
                 }
                 
                 var tripIndex = data.page.excel.tripIndex;
                 var tripIndexs = tripIndex.split("`");
                 $("#location").val(tripIndexs[2]);
                 if(j==tripIndexs[2]){
                 	trTmp += " <td onmouseout=hideSpan(this); onmousemove=showSpan(this); style='background-color:"+bgcolor+";text-align:left;width:300px;" + width + "'><span class='showArea_"+level+"_"+n[j]+"' hasChildren='false' value='"+n[j]+"'>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' class='sub_on' onclick=showSub(this,'"+tripIndex+"','"+n[j]+"','"+tripIndexs[0]+":"+n[j]+"');>"+n[j]+"</a>&nbsp;&nbsp;&nbsp;&nbsp;<span style='cursor:pointer;font-size:12px;display:none;color:red;font-weight:bold;' name='spanName' onclick=downExcel(this,'"+tripIndex+"','"+n[j]+"','"+tripIndexs[0]+":"+n[j]+"','"+n[j]+"');>(下载)</span></span></td>";	
                 }else if (datafuncIndex[parseInt(showIndex2[j])]==0&&isNotBlank(n[j])){
                 	trTmp += "<td style='background-color:"+bgcolor+";text-align:" + textAlign + ";" + width + "'>"+dataTmp+"</td>";	
                 }else if (datafuncIndex[parseInt(showIndex2[j])]==1&&isNotBlank(n[j])){
                 	trTmp += "<td style='background-color:"+bgcolor+";text-align:" + textAlign + ";" + width + "'>"+dataTmp+"</td>";	
                 }else{
                 	trTmp += "<td style='background-color:"+bgcolor+";text-align:" + textAlign + ";" + width + "'>"+dataTmp+"</td>";                	
            	 }       	
            }
            trTmp = trTmp + "</tr> <input type='hidden' value='' id='recoder_val_" + n[in_id_index] + "'>";
            tr += trTmp; 
        }); 
        	
    } else { //影响固定行?
        tr = "<tr id='tr_noData' class='style3'><td colspan='" + parseInt(showIndex2.length + 2) + "' align='center' style='text-align:center;'>没有查询到数据</td></tr>"; //数据暂未导入,请先导入
    }
    for (var i = 0; i < showIndex2.length; i++) {
        if (colWidth2[showIndex2[i]] != undefined && colWidth2[showIndex2[i]] != "") {
            widthTable = widthTable + parseInt(colWidth2[showIndex2[i]]); 
        } 
    } 
    var width = parseInt(showIndex2.length + 2) * 105;  
    if (widthTable != 0) {
        width = widthTable; 
    } else if (width < 1100) { //最小宽度
        width = "1100";//固定表头不允许有100%
    }
    var colWidthAll=$("#colWidthAll").val(); 
    if(parseInt(width)<parseInt(colWidthAll)){//取表格总宽度
    	width=colWidthAll;
    }
    $("#demoTable").css("width",width+"px");
    var isFirstFind=$("#isFirstFind").val(); 
    $("#isFirstFind").val(1); 
    $(".reportBody").html(tr); 
     
    if(isMoreHead==1&&query=="1"){
    	rowColSpan('#reportHead',colNum+2);//合并表格
    } 
  //固定表头  
    var tableWidth=$("#tableWidth").val();
    if(tableWidth==0){
    	tableWidth= $(window).width();//一直使用首次宽度，更准确
    	$("#tableWidth").val(tableWidth);
    } 
    if(query=="1"){
    	setTimeout('FixTable("demoGrid1", 2, '+tableWidth+', 430)', 500);  
    }
    //从2开始,循环+2.  分组优先排序?
    var groupIndex = $("#groupIndex").val();
    if (groupIndex != null && groupIndex != "") {
        groupIndex = groupIndex.split(";")
        for (var i = 0; i < groupIndex.length; i++) {
            _w_table_rowspan('#demoTable', parseInt(groupIndex[i]) + 2); //_w_table_id,_w_table_colnum（对应的table的id，要合并的列数）
        } 
    }   

}


//下钻生成tr
function showSub(objs,upTripIndex,colValue,tripWheres){
	var obj = $(objs);
	if("true" == obj.parent().attr("hasChildren")){
	   var area_id=obj.parent().attr("class");
	   var area_code=area_id.substring(11);
	   var area_level=area_id.substring(9,10);
	   array_tr = $("[class*="+area_code+"]").not($("."+area_id)).parent().parent();
	   var _level_next=parseInt(area_level)+1;//点击层的下一层的level
	   var array_next = $("[class^=showArea_"+_level_next+"_"+area_code+"]").parent().parent();//如果显示则只显示点击层的下一层	
	   if(array_next.is(":visible")){
	        array_tr.hide();
	        //固定表头  
	        var tableWidth=$("#tableWidth").val();
	        if(tableWidth==0){
	        	tableWidth= $(window).width();//一直使用首次宽度，更准确
	        	$("#tableWidth").val(tableWidth);
	        } 
	       	//FixTable("demoGrid1", 2, '+tableWidth+', 430);
		    $("."+area_id).find("a").attr("class","sub_on");
		    $(obj).focus();
	    }else{
	    	array_tr.hide();
	    	array_next.show();
	        $("."+area_id).find("a").attr("class","sub_off");
	    }
    }else{
	   showArea(upTripIndex,colValue,obj,tripWheres);
    } 
}

//下钻下载
function downExcel(element,upTripIndex,colValue,tripWheres,fName){
	var tripIndex = "",showIndex = "",funcIndex="";  	
	var area_id = $(element).parent().attr("class");
	var firstName = area_id.substring(11);
	var ids=area_id.split('_');
	var levl=ids[1];//获取点击下钻行的层级；
	var _level=parseInt(levl)+1;
	var whereInfo=$("#whereInfo").val();
	var whereValues=getWhereValues(whereInfo);
	var isMoreHead=$("#isMoreHead").val();
	var selConfig=getSelect();
	$("#expForm").attr("action",rootPath+"/page/expExcel!downExcel.action?selConfig="+encodeURIComponent(encodeURIComponent(selConfig))+"&tripIndex="+upTripIndex+"&colValue="+colValue+"&tripWhere="+encodeURIComponent(encodeURIComponent(tripWheres))+"&reportID="+$("#reportID").val()+"&tripLevel="+_level+"&whereValues="+whereValues+"&name="+encodeURIComponent(encodeURIComponent(fName))+"&isMoreHead="+isMoreHead);
	$("#expForm").submit();
}
//下钻
function showArea(upTripIndex,colValue,element,tripWheres){
	var list = null;
	var tripIndex = "",showIndex = "",funcIndex="";  	
	var area_id = element.parent().attr("class");
	var firstName = area_id.substring(11);
	var ids=area_id.split('_');
	var levl=ids[1];//获取点击下钻行的层级；
	var _level=parseInt(levl)+1;
	var whereInfo=$("#whereInfo").val();
	var whereValues=getWhereValues(whereInfo);
	var selConfig=getSelect();
	var isSameLen="";
	var dataMaxLen="";
	var colTypes="";
	
	$.ajax({
      type:"POST",
      dataType:'json',
      cache:false,
      async:false,
      url:rootPath+'/page/report!showSub.action',
	  data:{selConfig:selConfig,tripIndex:upTripIndex,columnName:colValue,tripWhere:tripWheres,reportID:$("#reportID").val(),tripLevel:_level,whereValues:whereValues},
      error:function(){
      },beforeSend:function(){
	    	$("#MessageLayer").show();
	      },
      success:function(data){
      	list = data.page.list;
      	tripIndex = data.page.excel.tripIndex;
      	showIndex = data.page.excel.showIndex;
      	funcIndex = data.page.excel.funcIndex;
      	isSameLen = data.page.isSameLen;
        dataMaxLen = data.page.dataMaxLen;
        colTypes = data.page.colTypes;
        colTypes=colTypes.split(";"); 
      },
	    complete:function(XMLHttpRequest,textStatus){
	    $("#MessageLayer").hide();
    }
});
	var _tr = element.parent().parent().parent();
	if(!isNotBlank(list)){
		$(element).attr("class","root");
      alert("对不起，没有下一级可供钻取！");
      return;
  }
 
  var trStr = "";
  var marg = 12 * _level;
  var tempValue="";
 var datafuncIndex=$("#datafuncIndex").val().split(";");
 var textAlign="",width="",dataTmp="",bgcolor="";
 var dataFormat=$("#dataFormat").val(); 
 var dataFormat2="";
 if(dataFormat!=null){
 	dataFormat2= dataFormat.split(";");
 }
 var colWidth = $("#colWidth").val();
 var colWidth2 = colWidth.split(";");
  $.each(list,function(i,n){
	  var length = list[0].length;
      var tripIndexs = tripIndex.split("`");
      var showIndexs = showIndex.split(";");
      var funcIndexs = funcIndex.split(";");
      bgcolor="#FAFAFA"; //影响鼠标移到修改背景色
	  if(i%2==0){
	  	bgcolor="#FFFFFF";
	  } 
      trStr += "<tr id='recoder_" + i + "' class='style3' onmouseover=\"this.style.backgroundColor='#ffeeee'\" onmouseout=\"this.style.backgroundColor='#FFFFFF'\">";
      for(j=0;j<length;j++){
    	  textAlign = "left";
          width = ""; 
          dataTmp=n[j]; 
          if(colTypes[j]!=undefined){
        	  dataTmp=getDataFormat(showIndexs,isSameLen,dataMaxLen,j,dataTmp,colTypes[j],dataFormat2[showIndexs[j]]);//格式设置和对齐方式
          }
          dataTmp=dataTmp.split("@@");
          textAlign=dataTmp[1]; 
          if(textAlign==undefined||textAlign=="undefined"){
         	 textAlign = "right";
          }
          dataTmp=dataTmp[0]; 
          if (colWidth2[showIndexs[j]] != undefined && colWidth2[showIndexs[j]] != "") { 
              width = "width:" + colWidth2[showIndexs[j]] + "px; word-break:break-all; word-wrap:break-word;";
          } else if (dataTmp.length > 100) { //字符很长，限制最大宽度，避免挤压导致其他列换行
              width = "width:320px; word-break:break-all; word-wrap:break-word;"; 
          }
          if (dataTmp == " ") {
              dataTmp = "&nbsp;&nbsp;"; 
          }
          
    	  if(j == tripIndexs[2]){
    		  var _tripWheres = tripWheres+";"+tripIndexs[0]+":"+list[i][j];
    		  trStr += "<td  onmousemove=showSpan(this);  onmouseout=hideSpan(this);  style='background-color:"+bgcolor+";text-align:left;width:300px;" + width + "'><span class='showArea_"+_level+"_"+firstName+"_"+list[i][j]+"' style='margin-left:"+marg+"px' hasChildren='false' value='"+list[i][j]+"'><a href='javascript:void(0)' class='sub_on'  onclick=showSub(this,'"+tripIndex+"','"+list[i][j]+"','"+_tripWheres+"');>"+list[i][j]+"</a>&nbsp;&nbsp;&nbsp;&nbsp;<span style='cursor:pointer;font-size:12px;display:none;color:red;font-weight:bold;' name='spanName' onclick=downExcel(this,'"+tripIndex+"','"+list[i][j]+"','"+_tripWheres+"','"+n[j]+"');>(下载)</span></span></td>"; 
    	  }else if (datafuncIndex[parseInt(showIndexs[j])]==0&&isNotBlank(n[j])){
    		  trStr += "<td style='background-color:"+bgcolor+";text-align:" + textAlign + ";" + width + "'><span class='showArea_"+_level+"_"+firstName+"_"+list[i][j]+"'  hasChildren='false' value='"+list[i][j]+"'>"+dataTmp+"</span></td>"; 
    	  }else if (datafuncIndex[parseInt(showIndexs[j])]==1&&isNotBlank(n[j])){
    		  trStr += "<td  style='background-color:"+bgcolor+";text-align:" + textAlign + ";" + width + "'><span class='showArea_"+_level+"_"+firstName+"_"+list[i][j]+"'  hasChildren='false' value='"+list[i][j]+"'>"+dataTmp+"</span></td>"; 
    	  }else
              trStr += "<td  style='background-color:"+bgcolor+";text-align:" + textAlign + ";" + width + "'><span class='showArea_"+_level+"_"+firstName+"_"+list[i][j]+"'  hasChildren='false' value='"+list[i][j]+"'>"+dataTmp+"</span></td>";
      
      }
      trStr += "</tr>";
  });
  _tr.after(trStr);
  //固定表头  
  var tableWidth=$("#tableWidth").val();
  if(tableWidth==0){
  	tableWidth= $(window).width();//一直使用首次宽度，更准确
  	$("#tableWidth").val(tableWidth);
  } 
  //FixTable("demoGrid1", 2, '+tableWidth+', 430);//下钻调整浏览器开销太大
  $("."+area_id).attr("hasChildren","true");
  $("."+area_id).find("a").attr("class","sub_off");
  $(obj).focus();
}
//显示span
function showSpan(obj){
	hideSpan();
	$(obj).find("span").show(); 
}
//隐藏span
function hideSpan(obj){
	$("span[name='spanName']").hide(); 
	$(obj).find("span").show(); 
}
//查询数据，填充表格
function fillTable(data,type) {
    // 清空表格所有内容 重新编织  
    var _table = "";
    var columnName="";
    var reportID = $("#reportID").val();
    var pageTitles = $("#pageTitles").val();
    var pageTitles2 = pageTitles.split(";");
    var showIndex = $("#showIndex").val(); 
    var showIndex2 = showIndex.split(";");
    var dataFormat=$("#dataFormat").val(); 
    var dataFormat2="";
    if(dataFormat!=null){
    	dataFormat2= dataFormat.split(";");
    }
    var isMoreHead = $("#isMoreHead").val();
    var colWidth = $("#colWidth").val();
    var colWidth2 = colWidth.split(";");
    var pageHtml = page(data.page); 
    $("#fileName").val(data.page.excel.reportName);
    $("#expSql").val(data.page.sql);
    var operateType = $("#operateType").val();
    var isDel = "yes",
    isEdit = "yes",
    isAdd = "yes";
    if (operateType.indexOf("delete") == -1) {
        isDel = "none"; 
    }
    if (operateType.indexOf("edit") == -1) {
        isEdit = "none"; 
    }
    if (operateType.indexOf("delete") >= 0) {
        isAdd = "none"; 
    }
    
    var _thead = "",colNum=0; 
    if(isMoreHead==-1){ //单行表头
    	for (var i = 0; i < showIndex2.length; i++) {
    		columnName += pageTitles2[showIndex2[i]];
    		if(i<showIndex2.length-1)columnName+=",";
            _thead += "<th style='text-align:center;border-color:#cebb9e; background-color:#ecd8c7;'>" + pageTitles2[showIndex2[i]] + "</th>";
        }
    }else{ //多行表头
	    pageTitles = pageTitles.split("|");
	    showIndex = showIndex.split(";");
	    var tmp=""; 
	    for (var i = 0; i < pageTitles.length; i++) {  
	       _thead+="<tr>";
	       tmp=pageTitles[i].split(","); 
	       colNum=tmp.length;
	       for (var j = 0; j < tmp.length; j++) { 
	    	   if(tmp[j]!=undefined){
	    		   if(i!=pageTitles.length-1){
		    		   _thead+='<td align="center" valign="middle" style="text-align:center;border-color:#cebb9e; background-color:#ecd8c7;">'+tmp[j]+'</td>';                                
		    	   }else{//最后一行可以 点击"排序"
		    		   _thead+='<td onclick="findReport(1,'+showIndex[j]+')" title="点击排序" style="text-align:center;border-color:#cebb9e; background-color:#ecd8c7;">'+tmp[j]+'<span id="th_'+showIndex[j]+'" style="color:red"></span></td>';//↑↓ 
		    	   }
	    	   } 
	       }  
	       _thead+="</tr>";
	    } 
	    columnName=$("#pageTitles").val();
    }
    $("#columnName").val(columnName);
    $("#reportHead").html(_thead);
    
    var colNames = $("#colNames").val();
    var colNames2 = colNames.split(";");
    var in_time_index = -1, in_id_index = -1;
    for (var i = 0; i < colNames2.length; i++) {
        if (colNames2[i].toLowerCase() == 'in_time') {
            in_time_index = i; 
        } else if (colNames2[i].toLowerCase() == 'in_id') {
            in_id_index = i; 
        } 
    } 
    var width = "",  tr = "", trTmp = "",bgcolor="",textAlign = "", dataTmp="";
    var list = data.page.list;
    var isSameLen = data.page.isSameLen;
    var dataMaxLen = data.page.dataMaxLen;
    var colTypes = data.page.colTypes;
    colTypes=colTypes.split(";"); 
    var flag = 0;
    var widthTable = 0;
    if (list.length > 0) {
        $.each(list,  function(i, n) {
        	bgcolor="#FAFAFA"; //影响鼠标移到修改背景色
	    	if(i%2==0){ bgcolor="#FFFFFF"; } 
            if (flag == 0) { $("#firstRid").val(n[in_id_index]);  } 
            trTmp = "<tr id='recoder_" + n[in_id_index] + "' class='style3' onmouseover=\"this.style.backgroundColor='#ffffff'\" onmouseout=\"this.style.backgroundColor='#FFFFFF'\" ><td style='text-align:center;display:" + isDel + ";' width='25px'><input type='checkbox' name='recoder' value='" + n[in_id_index] + "," + n[in_time_index] + "'/></td>";
            for (var j = 0; j < showIndex2.length; j++) {
                textAlign = "left";
                width = ""; 
                dataTmp=n[showIndex2[j]]; 
                dataTmp=getDataFormat(showIndex2,isSameLen,dataMaxLen,j,dataTmp,colTypes[showIndex2[j]],dataFormat2[showIndex2[j]]);//格式设置和对齐方式
                dataTmp=dataTmp.split("@@");
                textAlign=dataTmp[1]; 
            	dataTmp=dataTmp[0]; 
                if (colWidth2[showIndex2[j]] != undefined && colWidth2[showIndex2[j]] != "") { 
                    width = "width:" + colWidth2[showIndex2[j]] + "px; word-break:break-all; word-wrap:break-word;";
                } else if (dataTmp.length > 100) { //字符很长，限制最大宽度，避免挤压导致其他列换行
                    width = "width:320px; word-break:break-all; word-wrap:break-word;"; 
                }
                if (dataTmp == " ") {
                    dataTmp = "&nbsp;&nbsp;"; 
                }
                trTmp += "<td style='background-color:"+bgcolor+";text-align:" + textAlign + ";" + width + "'>" + dataTmp + "</td>";
            }            
            trTmp = trTmp + "</tr> <input type='hidden' value='' id='recoder_val_" + n[in_id_index] + "'>"; //"<tr>"+
            tr += trTmp;  
        }); 
    } else { //影响固定行?
        tr = "<tr id='tr_noData' class='style3'><td colspan='" + parseInt(showIndex2.length + 2) + "' align='center' style='text-align:left;padding-left:450px;height:280px;valign:top;font-weight:bold;'>没有数据!</td></tr>"; //数据暂未导入,请先导入
    }
    for (var i = 0; i < showIndex2.length; i++) {
        if (colWidth2[showIndex2[i]] != undefined && colWidth2[showIndex2[i]] != "") {
            widthTable = widthTable + parseInt(colWidth2[showIndex2[i]]); 
        } 
    } 
    var width = parseInt(showIndex2.length + 2) * 105;  
    if (widthTable != 0) {
        width = widthTable; 
    } else if (width < 1100) { //最小宽度
        width = "1100";//固定表头不允许有100%
    }
    var colWidthAll=$("#colWidthAll").val(); 
    if(parseInt(width)<parseInt(colWidthAll)){//取表格总宽度
    	width=colWidthAll;
    }
    $("#demoTable").css("width",width+"px"); 
    
    var isFirstFind=$("#isFirstFind").val(); 
    $("#isFirstFind").val(1); 
    $(".reportBody").html(tr);  
    if(isMoreHead==1&&type=="first"){//第一次进入页面才合并
    	rowColSpan('#reportHead',colNum+2);//合并表格
    }  
    //从2开始,循环+2.  分组优先排序?
    if (list.length > 1) {//大于1条记录才需要合并
	    var groupIndex = $("#groupIndex").val();
	    if (groupIndex != null && groupIndex != "") {
	        groupIndex = groupIndex.split(";")
	        for (var i = 0; i < groupIndex.length; i++) {//翻页最后页有问题，隐藏了第1列? 是否去掉checke
	            _w_table_rowspan('#demoTable', parseInt(groupIndex[i]) + 2); //_w_table_id,_w_table_colnum（对应的table的id，要合并的列数）
	        } 
	    }   
    }
    //固定表头  
    setTimeout('FixTable("demoGrid1", 2, $(window).width()-2, 462)', 500);  
	$("#bodyHtml").attr("overflow-x","hidden");
	$("#bodyHtml").attr("overflow-y","hidden");
}

function exportExcel2(){
	var tripIndex=$("#tripIndex").val(),flag=false;
	tripIndex=tripIndex.split(";"); 
	for(var i=0;i<tripIndex.length;i++){ 
		if(tripIndex[i]!="-1"){
			flag=true;
			break;
		} 
	} 
	if(flag){//有下钻层级
		if("1"==$("#repType").val())
			$("#selectServer-dialog").html('<div><table><tr><td><input checked="checked" name="checkbox" type="checkbox" value="region_name" disabled><span>地市</span></td><td Style="width:200px;"></td></tr></table></div><div><table><tr><td><input name="checkbox" type="checkbox"  value="city_name"><span>区县</span></td><td Style="width:200px;"></td></tr></table></div>');
		art.dialog({
			title:"请选择维度",
			width:"300px",
			follow:document.getElementById('exportExcel'),
			content: document.getElementById('selectServer-dialog'),
			id:"expExcelId",
			button:[{
				value:"导出",
				focus:true,
				callback:function(){
				getSelectedValues($("#selectServer-dialog"));
				$("#loadWord").html("正在导出数据...");
				$("#loading").show();
				$("#expForm").attr("action",rootPath+"/page/expExcel!expExcel.action");
				$("#expForm").submit();
				$("#loading").hide();
			}
			},{
				value:"取消"
			}]
		});
	}else{ //无下钻
		var reportID=$("#reportID").val();
		var orderIndex=$("#orderIndex").val(); 
		var groupIndex=$("#groupIndex").val(); 
		var operateType=$("#operateType").val(); 
		var operateData=$("#operateData").val(); 
		var pageSize=$("#pageSize").val(); 
		var colNames=$("#colNames").val(); 
		var whereColname=$("#whereColname").val(); 
		var wheres="";
		if(orderIndex==null || orderIndex==""){
			orderIndex="1,2";
		}
		var selConfig=getSelect(); 
		var isMore=$("#isMoreHead").val();
		if(isMore==1){//多表头
			$("#loadWord2").html("正在导出数据...");
			$("#loadWord2").show();
			$("#expForm").attr("action",rootPath+"/page/expExcel!expMorePageExcel.action?reportID="+reportID+"&orderIndex="+orderIndex+"&groupIndex="+groupIndex+"&operateType="+operateType+"&operateData="+operateData+"&wheres="+encodeURIComponent(encodeURIComponent(wheres))+"&colNames="+encodeURIComponent(encodeURIComponent(colNames))+"&whereColname="+encodeURIComponent(encodeURIComponent(whereColname))+"&selConfig="+selConfig);
			$("#expForm").submit();
			$("#loadWord2").hide();
			$.unblockUI();
		}else{//单表头
			$("#loadWord2").html("正在导出数据...");
			$("#loading2").show();
			$("#downExcel").hide();  
			$.ajax({
				url :rootPath+'/page/report!exportExcel.action' ,
			   	data : {reportID:reportID, orderIndex:orderIndex, groupIndex:groupIndex, operateType:operateType,
			   			operateData:operateData, pageSize:pageSize, wheres:wheres, colNames:colNames, whereColname:whereColname, selConfig:selConfig
				   	},
			   	type : 'post',
			   	dataType : 'json',
			   	async : false,
			   	contentType: "application/x-www-form-urlencoded; charset=UTF-8",  
				success: function(data){  
					$("#loading2").fadeOut(1000);
					var fileName=data.page.fileName; 
					window.location.href=rootPath+"/page/jsp/downExcel.jsp?filePath=/page/down/&fileName="+fileName;//+"&filedisplay="+filedisplay; 
				 }
			});
		}
	}
	
}

//下载
function exportExcel3(){
	getSelectedValues($("#selectServer-dialog"));
	$("#loadWord").html("正在导出数据...");
	$("#loading").show();
	$("#expForm").attr("action",rootPath+"/page/expExcel!expExcel.action");
	$("#expForm").submit();
	$("#loading").hide();
	$.unblockUI();
}

//单层下拉框查询数据,来源report_view.js
function findSelect(selID,i){
   var nextData = $("#rptWhere_"+selID).attr("data");
   var levels = $("#rptWhere_"+selID).attr("levels");
   var levelsMax = $("#rptWhere_"+selID).attr("levelsMax");
   levels=parseInt(levels)+1;//从1开始
   var action = rootPath+"/page/selectConfig!findSelect.action";   
   var data1 = "selID="+selID+"&levels="+levels+"&levelsMax="+levelsMax+"&nextData="+nextData;
   $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {
		   var s = response.page.select;
	       var selValue = s.selValue; //查询条件值字段序号
	       var selText = s.selText;
	       var list = response.page.list; //报表信息
           var html=''; 
           if(list.length>1){ //有多个
        	   html='<option value="" title="全部">-全部-</option>'; 
           }
           for (var j = 0; j < list.length; j++) { 
               var data = (list[j] + "").split(","); 
               html+='<option value="'+data[selValue]+'" title="'+data[selText]+'">'+data[selText]+'</option>';  
           } 
           $("#rptWhere_"+selID).html(html);
	   }
	});
}


//获取查询条件的值，并替换sql模板的参数,根据替换后的sql查询数据,来源report_view.js
function getSelect(end) {  
    var levelMain = $("#levelMain").val();
    var selConfig = $("#selConfig").val();
    if(end==undefined){//报表查询
    	end=selConfig.length;
    }
    var groupIndex = $("#groupIndex").val(); 
    selConfig = selConfig.split(";");
    var selData = "", findData = "", levels = "", colName = "";
    var nextData = request.getParameter("nextData"); //"会大客户中心;4";
    var nextData2 = decodeURI(nextData);
    nextData2 = nextData2.split(";");
    var isAdd=true;
    for (var i = 0; i < selConfig.length; i++) {
        //3个架构选择参数的层级?  
        var tmp = selConfig[i].split(",");
        if(i>end){//智能匹配查询
            //break;//不能退出	,否则后面的日期等类型的查询条件无法获取?
        	isAdd=false;
        }	 
        selData += tmp[0] + ";"; //下拉框类型  
        colName = "";
        if (tmp[0] == 's') {
            colName = $("#rptWhere_" + tmp[1]).attr("colName"); //_"+i
            levels = $("#rptWhere_" + tmp[1]).attr("levels");
            var levelsMax = $("#rptWhere_" + tmp[1]).attr("levelsMax");
            var findData = $("#rptWhere_" + tmp[1]).attr("data");
            if (findData != undefined && findData.indexOf("---") >= 0) {
                findData = findData.split(",");
                var tmp2 = "",
                findData2 = "";
                for (var j = 0; j < findData.length; j++) {
                    tmp2 = findData[j].split("---");
                    findData2 += tmp2[0] + ","; 
                }
                findData = findData2.substring(0, findData2.length - 1); 
            }
            var findData2 = $("#rptWhere_" + tmp[1]).attr("data");   
            if (tmp[1] == '101') {
                if ((findData2 != null && findData2 != "")) {
                    findData = findData2;
                    levelMain = $("#rptWhere_" + tmp[1]).attr("levels");
                    if (levelMain == "0") {
                        $("#levelMain").val(1); 
                    } else {
                        $("#levelMain").val(parseInt(levelMain) + 1); //新增,由select_config2.js getSelect2(selID)传递 
                    }
                    if (levelMain > 0) { 
                    }
                    levels = levelMain;
                    $("#levelsTable2").val(levels); 
                } else if (findData != null && findData != "") {
                    if (findData != '' && findData != '40000001') {
                        levels = parseInt(levels); 
                    } else {
                        levels = groupIndex;   
                    }
                    levels = parseInt(levels);
                    var levels3 = parseInt(levels) + 1;
                    $("#levelMain").val(levels3);
                    $("#levelsTable2").val(levels);
                } 
            }
            if (findData == "" || findData == null) {
                findData = "''"; 
            }
            if (groupIndex != null && groupIndex.replaceAll(" ", "") != "") {
                levels = parseInt(levels) + parseInt(groupIndex); 
            }
            value = $("#rptWhere_" + tmp[1]).val(); //多层的中文提示popWord
            if (levelsMax == 1) {//如果是单层下拉框，且为空
                findData = $("#rptWhere_" + tmp[1]).val(); 
                if(tmp[1] == '116'){ 
                	var levels3 = $("#rptWhere_" + tmp[1]).attr("levels");
                	if(levels3==1){//地市级
                		findData=$("#rptWhere_" + tmp[1]).attr("data");//提前初始化下拉框?
                	}
                }
                value = $("#rptWhere_" + tmp[1]).attr("title"); 
            }
           
            if (nextData2 != "" && nextData2[i] != undefined) { //下钻报表传递过来 && nextData2[i]!=""
                value = nextData2[i]; 
            } 
            selData += tmp[1] + ";" + colName + ";" + levels + ";" + findData + ";" + value;
            //下拉框类型+下拉框id+下拉框value字段名+当前层级+下拉框值: d;20130801@s;101;1;40000001@s;102;1;''@s;103;1;''
            if (tmp[1] == '101' && findData != '' && findData != '40000001') {
                if (levels == '') { //为什么营销架构全选为空
                    levels = 0; 
                } 
            }
        } else {
            findData = $("#rptWhere_" + i).val();
            if (nextData2 != "" && nextData2[i] != undefined) { //下钻报表传递过来 nextData2[i]!=""
                findData = nextData2[i]; 
            }
            if (findData == "" || findData == null) {
                findData = "''"; 
            }
            if (tmp[0] == 'c2'){ 
            	var selValue=$("#rptWhere_"+i).attr("selValue");
            	if(selValue!=undefined && selValue!=""){ //数据权限
            		findData = selValue;
            	}
        		var matchtype=$("#rptWhere_"+i).attr("matchtype"); //选择为精确匹配(1)，输入为模糊匹配(-1)
            	if(matchtype==undefined){
            		matchtype = "''"; 
            	}
            	if(isAdd){
            		findData+=";"+matchtype;  
                }else{
                	findData=";'';''";  
                }
            }else if (tmp[0] == 'c3'){
            	var selValue=$("#rptWhere_"+i).attr("selValue"); //选择为精确匹配(1)，输入为模糊匹配(-1)
            	if(selValue!=undefined && selValue!=""){
            		findData = selValue; 
            	}
            }	
            selData += findData;  
        } 
        selData += "@"; 
    }
    selData = selData.substr(0, selData.length - 1);
    return selData; 
}


//分页:输出分页按钮
function page(obj) {//封装在一个对象里 
	var html ="";
	html +=
			'  <span style="padding-left:10px;"> <input type="button" onclick="goPage1(\'first\')" class="first" value="" title="首页"/>'+ 
			'   <input type="button" onclick="goPage1(\'pre\')" class="pre" value="" title="上一页"/>'+ 
			'   <input type="button" onclick="goPage1(\'next\')" class="next" value="" title="下一页"/>'+ 
			'   <input type="button" onclick="goPage1(\'last\')" class="last" style="" value="" title="尾页"/>&#12288;'+ 
			'<span class="style4">第<span style="color:red;font-weight:bold;">' + obj.currentPage + '</span>/' + obj.maxPage + '页，共<strong>' + obj.maxRow + '</strong>条</span></span>';//+
	$("#pageHtml").html(html);		 
    $("#currentPage").val(obj.currentPage);//暂存hidden中 
	$("#maxPage").val(obj.maxPage);
	$("#maxRow").val(obj.maxRow); 
	return html;
}
//分页:输出分页按钮
function page1(obj) {//封装在一个对象里 
	var html ="";
	html += 
			'  <span style="padding-left:10px;"> <input type="button" onclick="goPage3(\'first\')" class="first" value="" title="首页"/>'+ 
			'   <input type="button" onclick="goPage3(\'pre\')" class="pre" value="" title="上一页"/>'+ 
			'   <input type="button" onclick="goPage3(\'next\')" class="next" value="" title="下一页"/>'+ 
			'   <input type="button" onclick="goPage3(\'last\')" class="last" style="" value="" title="尾页"/>&#12288;'+ 
			'<span class="style4">第<span style="color:red;font-weight:bold;">' + obj.currentPage + '</span>/' + obj.maxPage + '页，共<strong>' + obj.maxRow + '</strong>条</span></span>';//+
	$("#pageHtml").html(html);		 
    $("#currentPage").val(obj.currentPage);//暂存hidden中 
	$("#maxPage").val(obj.maxPage);
	$("#maxRow").val(obj.maxRow); 
	return html;
}
//查询智能匹配值
function findDistinct(i,mouseOrKey) { 
	$(".showDataPop19").hide();
	var reportID=$("#reportID").val();  
	var operateData=$("#operateData").val(); 
	var pageSize=$("#pageSize").val(); 
	var colNames=$("#colNames").val();  
	var selID = $("#rptWhere_"+i).attr("selID"); 
	var colName = $("#rptWhere_"+i).attr("colName"); 
	var dataLevel = $("#rptWhere_"+i).attr("dataLevel");   
	var isMore = $("#rptWhere_"+i).attr("isMore");
	var value=$("#rptWhere_"+i).val();//暂存
	var value2=value;
	var matchtype=$("#rptWhere_"+i).attr("matchtype");
	if(mouseOrKey=='mouse' && matchtype=="1" ){ //当鼠标按下，且没有按下键盘操作时，查询所有distinct值 && matchtype=="1"
		var selConfig=getSelect(i-1); //将页面第1个到i-1(不含自己)个查询条件给智能匹配sql的where条件
		value="";//不传递后台 
	}else{ 
		$("#rptWhere_"+i).attr("matchtype","-1");//findDistinct()查询都是模糊匹配,放前面
		$("#rptWhere_"+i).attr("selValue","");//清除上次选择的值
		var selConfig=getSelect(i); //将页面第1个到i个查询条件给智能匹配sql的where条件
		$("#rptWhere_"+i).val(value);//删除空格
	} 	
	var selConfigLast=$("#showPop_"+i).attr("selConfigLast"); 
	if(selConfigLast==selConfig){ //若查询条件和上次没变化，则不查询数据库 && isFindOk==true. 优化:选择后删除多一次查询？
		$("#showPop_"+i+" .popDistinct").each(function() {  
	       if($(this).html()==value2 && $(this).html()!=""){  
	           $(this).css("background-color","#3399ff");
	       };  
	    }); 
		$("#showPop_"+i).show();
		return;
	}else{
		$("#showPop_"+i).attr("selConfigLast",selConfig); 
		$("#showPop_"+i).html('<div><img src="'+rootPath+'/page/images/loading/load.gif" class=""/>正在查询</div>').show();
	}
	var dataType=""; 
	if(dataLevel.indexOf(",")>=0){//数据权限 
		dataLevel=dataLevel.split(",");
		dataType=dataLevel[1];
		dataLevel=dataLevel[0];
	}
	
	var data1 = "loginno="+loginno+"&reportID=" + reportID +"&operateData="+operateData+"&currentPage=1&pageSize="+pageSize+"&colNames="+colNames+
				"&value="+value+"&colName="+colName+"&selID="+selID+"&dataLevel="+dataLevel+"&selConfig="+selConfig; 
    var action = rootPath+"/page/report!findDistinct.action"; 
    $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {  
	       var list = response.page.list; //报表信息
           var html='',maxLen=0,bgColor="",selValue="";
           var value=$("#rptWhere_"+i).val();
           if(isMore==1){ //多选:分单层/多层
               html+='<div style="margin-top:2px;"><input type="checkbox" title="全选/不选" id="selAll_'+i+'" onclick="selAll('+i+')"/><span id="sel_'+i+'_-1" onclick="clearDistinct('+i+')" onmouseover="changeBgColor('+i+',-1,\'over\')" onmouseout="changeBgColor('+i+',-1,\'out\')" class="popDistinct" style="padding-top:2px;padding-left:3px;width:150px;" title="全部">全部</span></div>';
            }else{
         	   html+='<div style="margin-top:2px;"><span id="sel_'+i+'_-1" onclick="clearDistinct('+i+')" onmouseover="changeBgColor('+i+',-1,\'over\')" onmouseout="changeBgColor('+i+',-1,\'out\')" class="popDistinct" style="padding-top:2px;padding-left:3px;width:50px;" title="全部">全部</span></div>';
            }
           for (var j = 0; j < list.length; j++) {  
               var data = (list[j] + "").split(","); 
               if(data[0].length>maxLen){
            	   maxLen=data[0].length; 
               }
               bgColor="";
               if(data[0]==value && data[0]!=""){//模拟下拉框，当前选中值修改背景色，
            	   bgColor="background-color:#3399ff;";
               }  
               if(dataLevel>=2 && dataType!='name'){//数据权限,selValue传递值为地市id或名称 
            	   selValue=data[1];//地市id //if(dataType=='name'){ selValue=data[0]; }
               }else{
            	   selValue=data[0];//地市名称
               } 
               if(data[0]==null || (data[0]!=undefined && data[0].replaceAll(" ","")=="")){
            	   data[0]="空值";
            	   selValue="空值";
               }  
               if(isMore==1){ //多选:分单层/多层
            	   html+='<div id="sel_'+i+'_'+j+'" i="'+i+'" selText="'+selValue+'" selValue="'+data[0]+'" isMore="'+isMore+'" onmouseover="changeBgColor('+i+','+j+',\'over\')" onmouseout="changeBgColor('+i+','+j+',\'out\')" class="popDistinct" style="padding:0px;'+bgColor+'"><input type="checkbox" value="sel_'+i+'_'+j+'" onclick="unSelAll('+i+')" title="多选"/>'+
            	   		 '<span style="font-size:13px;margin-left:1px;cursor:pointer;" onclick="getDistinct(\'sel_'+i+'_'+j+'\',\'-1\')" title="'+selValue+' [点击单选]" >'+selValue+'</span></div>'; 
               }else{
            	   html+='<div title="'+selValue+'" id="sel_'+i+'_'+j+'" i="'+i+'" selText=\''+selValue+'\'" selValue=\''+data[0]+'\' isMore="'+isMore+'" onclick="getDistinct(\'sel_'+i+'_'+j+'\',\''+isMore+'\')" onmouseover="changeBgColor('+i+','+j+',\'over\')" onmouseout="changeBgColor('+i+','+j+',\'out\')" class="popDistinct" style="font-size:13px;margin-left:2px;cursor:pointer;'+bgColor+'">'+selValue+'</div>'; 
               } 
           } 
           if(maxLen<6){//自动调整弹出层宽度
        	   maxLen=140;
           }else if(maxLen<10){
        	   maxLen=180;
           }else if(maxLen<15){
        	   maxLen=210;
           }else if(maxLen<20){
        	   maxLen=240;
           }else {//最大230px
        	   maxLen=260;
           } 
           $("#showPop_"+i).css("width",maxLen); //+20
           var maxRow=response.page.maxRow; 
           if(maxRow<3){
        	   $("#showPop_"+i).css("height",120); 
           }else if(maxRow<15){
        	   $("#showPop_"+i).css("height",260); 
           }else{
        	   $("#showPop_"+i).css("height",280); 
           }
           
           var currentPage2=response.page.currentPage;
           var maxPage2=response.page.maxPage;
           $("#showPop_"+i).attr("currentPage",currentPage2);
           $("#showPop_"+i).attr("maxPage",maxPage2);
           $("#showPop_"+i).attr("mouseOrKey",mouseOrKey);
           var pageHtml="",endPageHtml="";
           if(maxPage2>1){ 
        	   pageHtml='<span title="第'+currentPage2+'页,共'+maxPage2+'页" >——— <span style="color:red;font-weight:bold;">'+currentPage2+'</span>/'+maxPage2+' ———</span>';
           } 
           var closes="";
           if(isMore==1){//多选
        	   closes='<div style="margin-top:5px;"> <input type="button" value="确定" class="b_foot2" onclick="getDistinct('+i+',\''+isMore+'\')"/><input type="button" value="关闭" class="b_foot2" onclick="hideDistinct('+i+')"/></div>';
	       }else{
	       }
           html=closes+' <div>'+pageHtml+'</div>'+html+endPageHtml;//关闭按钮 
           $("#showPop_"+i).html(html).show();   
           
           var isAddScroll=$("#showPop_"+i).attr("isAddScroll");
           if(maxPage2>1 && isAddScroll!="true"){//只允许绑定1次滚动条
        	   $("#showPop_"+i).scroll(function(e) { 
                   if (isScrollBottom(this)) {// 滚动到底端了加载内容    
            	      appendDistinct(i);
                   } 
               });
        	   $("#showPop_"+i).attr("isAddScroll","true");
           } 
	   }
	}); 
}

function appendDistinct(i) { 
	var isAllowFind=$("#showPop_"+i).attr("isAllowFind");//防止重复加载数据
	if(isAllowFind=="false"){ //正在查找，必须等查找完后才修改状态为false，才能再次查询
		return;
	} 
	$("#showPop_"+i).attr("isAllowFind","false");  
	var currentPage=$("#showPop_"+i).attr("currentPage");
	currentPage=parseInt(currentPage)+1;
    var maxPage=$("#showPop_"+i).attr("maxPage");
    if(currentPage<=maxPage){
    	var mouseOrKey=$("#showPop_"+i).attr("mouseOrKey");
    	var reportID=$("#reportID").val();  
    	var operateData=$("#operateData").val(); 
    	var pageSize=$("#pageSize").val(); 
    	var colNames=$("#colNames").val(); 
    	var selID = $("#rptWhere_"+i).attr("selID"); 
    	var dataLevel = $("#rptWhere_"+i).attr("dataLevel"); 
    	var isMore = $("#rptWhere_"+i).attr("isMore");
    	var colName = $("#rptWhere_"+i).attr("colName"); 
    	var value=$("#rptWhere_"+i).val();//暂存
    	if(mouseOrKey=='mouse'){ 
    		var selConfig=getSelect(i-1); //将页面第1个到i-1(不含自己)个查询条件给智能匹配sql的where条件 
    		value="";//不传递后台 
    	}else{ 
    		$("#rptWhere_"+i).attr("matchtype","-1");//findDistinct()查询都是模糊匹配,放前面
    		var selConfig=getSelect(i); //将页面第1个到i个查询条件给智能匹配sql的where条件
    	} 
    	var dataType="";
    	if(dataLevel.indexOf(",")>=0){//数据权限 
    		dataLevel=dataLevel.split(",");
    		dataType=dataLevel[1]
    		dataLevel=dataLevel[0];
    	}
    	var data1 = "reportID=" + reportID +"&operateData="+operateData+"&currentPage="+currentPage+"&pageSize="+pageSize+"&colNames="+colNames+
    				"&value="+value+"&colName="+colName+"&selID="+selID+"&dataLevel="+dataLevel+"&selConfig="+selConfig; 
        var action = rootPath+"/page/report!findDistinct.action";
        $.ajax({
            type: "post",
            url: action,
            data: data1,
            dataType: "json",
            success: function(response) {  
    	       var list = response.page.list; //报表信息
               var html="",bgColor="",selValue="";
               var value=$("#rptWhere_"+i).val();
               var firstRow=(currentPage - 1) * pageSize;
               for (var j = 0; j < list.length; j++) {  
                   var data = (list[j] + "").split(",");   
                   if(dataLevel>=2 && dataType=='code'){//数据权限,selValue传递值为地市id或名称 
                	   selValue=data[1];//地市id 
                   }else{
                	   selValue=data[0];//地市名称
                   } 
                   if(isMore==1){ //多选:分单层/多层
                	   html+='<div id="sel_'+i+'_'+firstRow+'" i="'+i+'" selText=\''+selValue+'\'" selValue=\''+data[0]+'\' isMore="'+isMore+'" onmouseover="changeBgColor('+i+','+firstRow+',\'over\')" onmouseout="changeBgColor('+i+','+firstRow+',\'out\')" class="popDistinct" style="padding:3px;'+bgColor+'"><input type="checkbox" value="sel_'+i+'_'+firstRow+'" onclick="unSelAll('+i+')" title="多选"/>'+
                	   '<span style="font-size:13px;margin-left:2px;cursor:pointer;" onclick="getDistinct(\'sel_'+i+'_'+j+'\',\'-1\')" title="'+selValue+'[单选]" >'+selValue+'</span></div>'; 
                   }else{
                	   html+='<div title="'+selValue+'" id="sel_'+i+'_'+firstRow+'" i="'+i+'" selText=\''+selValue+'\'" selValue=\''+data[0]+'\' isMore="'+isMore+'" onclick="getDistinct(\'sel_'+i+'_'+firstRow+'\',\''+isMore+'\')" onmouseover="changeBgColor('+i+','+firstRow+',\'over\')" onmouseout="changeBgColor('+i+','+firstRow+',\'out\')" class="popDistinct" style="font-size:13px;margin-left:2px;cursor:pointer;'+bgColor+'">'+selValue+'</div>'; 
                   }
                   firstRow++; 
               } 
               var currentPage2=response.page.currentPage;
               var maxPage2=response.page.maxPage; 
               $("#showPop_"+i).attr("currentPage",currentPage2);
               $("#showPop_"+i).attr("maxPage",maxPage2);
               $("#showPop_"+i).attr("isAllowFind","true");  
               html='<div title="第'+currentPage2+'页,共'+maxPage2+'页">——— <span style="color:red;font-weight:bold;">'+currentPage2+'</span>/'+maxPage2+' ———</div>'+html;
               $("#showPop_"+i).append(html); 
               $("#showPop_"+i).scrollTop( $("#showPop_"+i).scrollTop()+130); //滚动条下移一点。 
    	   }
    	}); 
    } 
}


//模仿级联查询效果,前面智能匹配选项变动后,检查后面的智能匹配选项,若后面选项没有报表数据，则直接清除，避免手工删除.
function checkDistinct(begin) {  
	var reportID=$("#reportID").val();  
	var operateData=$("#operateData").val(); 
	var pageSize=$("#pageSize").val(); 
	var colNames=$("#colNames").val();   
	var selConfig=getSelect();
	var data1 = "reportID=" + reportID +"&operateData="+operateData+"&pageSize=3&colNames="+colNames+"&selConfig="+selConfig+"&operateType=checkDistinct&begin="+begin; 
    var action = rootPath+"/page/report!checkDistinct.action"; 
    $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {   
    		var clearIndex = response.page.result; 
    		if(clearIndex!=null){
    			clearIndex=clearIndex.split(",");
	    		for (var i = 0; i < clearIndex.length; i++) {
	    			$("#rptWhere_"+clearIndex[i]).val("");  
	    			$("#rptWhere_"+clearIndex[i]).attr("title","");
	    			$("#rptWhere_"+clearIndex[i]).attr("selValue","");//数据权限
	    		}
    		} 
	   }
	}); 
}

//点击某个选项
function getDistinct(id,isMore) {//i,selText,selValue 
	var i=0,len=0,len2=0;
	if(isMore!=1){//单选  
		i=$("#"+id).attr("i");
		var selText=$("#"+id).attr("selText");//地市名称,显示值
		var selValue=$("#"+id).attr("selValue");//地市id或地市名称,传递值
		$("#rptWhere_"+i).val(selText);
		$("#rptWhere_"+i).attr("title",selText); 
		$("#rptWhere_"+i).attr("selValue",selValue); //查询条件传递
		$("#showPop_"+i).hide();
		$("#rptWhere_"+i).attr("matchtype","1"); 
		var isMore2=$("#"+id).attr("isMore");
		if(isMore2==1){//多选里的单选
			var id2=id.split("_"); 
			id2=id2[1];
			i=id2;
			$("[id^='showPop_"+id2+"'] :checkbox").attr("checked",false);
			$("#"+id +" :checkbox").attr("checked",true);
		}
	}else{//多选
		i=id;
		var idNameLast="",texts="",datas="",isOk=1,len=0;
	    $("[id='showPop_"+id+"'] :checkbox:checked").each(function() {//#selView  
	      var idName=$(this).val();
	      if(idName!="on"){//排除全选/反选复选框
	    	  if(idNameLast==""){//首次保存
	  	        idNameLast=idName;
	  	      }
	  	      if(idName.split("_").length!=idNameLast.split("_").length){ //必须选择同层.
	  	    	 alert("必须选择相同层级!"); 
	  	         isOk=0;
	  	         return false;
	  	      }
	  	      
	  	      var selText=$("#"+idName).attr("selText");//地市名称,显示值
	  		  var selValue=$("#"+idName).attr("selValue");//地市id或地市名称,传递值
	  	      texts += selText+",";
	  	      datas += selValue+",";
	  	      len++; 
	      } 
	   });  
	   if(isOk==1){//验证通过
		   if(len>=1000){
	  	      alert("选项最多选择1000个！若1个选项都不选择，默认查询“全部”选项数据！");
	  	      return;
	  	   }
	       texts=texts.substring(0,texts.length-1);
	       datas=datas.substring(0,datas.length-1);
	       if(texts==""){
	         texts=$("#selName").val();       
	       }
	       $("#rptWhere_"+i).val(texts); 
	       $("#rptWhere_"+i).attr("title",texts); 
	       $("#rptWhere_"+i).attr("selValue",datas); 
	       $("#showPop_"+id).hide();
	   } 
	} 
	i=parseInt(i);//必须转换
	checkDistinct(i+1);//begin,鼠标选择或者点击关闭按钮(模糊查询输入完后)时检查后面选项.
}

function hideDistinct(i) {
	$("#showPop_"+i).hide();//.fadeOut(600)不能立即隐藏,否则点击选项获取不到值，文本框onblur事件快于弹出层onclick事件
	checkDistinct(i+1);//begin,鼠标选择或者点击关闭按钮(模糊查询输入完后)时检查后面选项.
} 

function clearDistinct(i) { 
	$("#rptWhere_"+i).val("");
	$("#rptWhere_"+i).attr("title",""); 
	$("#rptWhere_"+i).attr("selValue","");  
	
	$("#showPop_"+i).hide(); 
	$("[id^='showPop_"+i+"'] :checkbox").attr("checked",false);//取消多选
	
}

//模拟下拉框，鼠标移动，取消下拉选项以前选中的背景色 
var isMouseMove=0;
function changeBgColor(i,j,flag) {
	var j2=-1; 
	$("#showPop_"+i+" .popDistinct").each(function() { 
       if(j==j2 && flag=='over'){ 
           $(this).css("background-color","#3399ff");
       }else{
          $(this).css("background-color","#FFFFFF");
       }
       j2++;  
    }); 
}


//(8-2)点击分页按钮
function goPage1(pageTab) {
	$("#loadWord2").html("加载数据...");
	$("#loading2").show();
	$("#downExcel").hide();
	var action = $("#action").val(); 
	var maxPage = parseInt($("#maxPage").val());
	var currentPage = parseInt($("#currentPage").val());
	var currentPage2 = currentPage;
	if (pageTab == "first") {
		currentPage = 1;
	} else if (pageTab == "pre") {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
		} else {
			currentPage = 1;
		}
	} else if (pageTab == "next") {
		if (currentPage < maxPage) {
			currentPage = currentPage + 1;
		} else {
			currentPage = maxPage;
		}
	} else if (pageTab == "last") {
		currentPage = maxPage;
	}
	var reportID=$("#reportID").val(); 
	var orderIndex=$("#orderIndex").val();
	var groupIndex=$("#groupIndex").val(); 
	var operateType=$("#operateType").val(); 
	var operateData=$("#operateData").val();
	var colNames=$("#colNames").val(); 
	var whereColname=$("#whereColname").val(); 
	var wheres2=""; 
	if(orderIndex==null || orderIndex==""){
		orderIndex="1,2";
	}
	var selConfig=getSelect(); 
	var data1 = "reportID="+reportID+"&orderIndex="+orderIndex+"&groupIndex="+groupIndex+"&operateType="+operateType+"&operateData="+operateData+
				"&currentPage="+currentPage+ "&colNames="+colNames+"&whereColname="+whereColname+"&wheres="+wheres2+"&selConfig="+selConfig;
	$.ajax( {
		type : "post",
		url : rootPath+action,
		data : data1,
		dataType : "json",
		success : function(response) { 
            fillTable(response);
            $("#loading2").hide();
		}
	});
}
//(8-2)点击分页按钮
function goPage3(pageTab) {
	$("#loadWord2").html("加载数据...");
	$("#loading2").show();
	$("#downExcel").hide();
	var action = $("#action").val(); 
	var maxPage = parseInt($("#maxPage").val());
	var currentPage = parseInt($("#currentPage").val());
	var currentPage2 = currentPage;
	if (pageTab == "first") {
		currentPage = 1;
	} else if (pageTab == "pre") {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
		} else {
			currentPage = 1;
		}
	} else if (pageTab == "next") {
		if (currentPage < maxPage) {
			currentPage = currentPage + 1;
		} else {
			currentPage = maxPage;
		}
	} else if (pageTab == "last") {
		currentPage = maxPage;
	}
	var reportID=$("#reportID").val(); 
	var orderIndex=$("#orderIndex").val();
	var groupIndex=$("#groupIndex").val(); 
	var operateType=$("#operateType").val(); 
	var operateData=$("#operateData").val();
	var expSql = $("#expSql").val();
	var colNames=$("#colNames").val(); 
	var whereColname=$("#whereColname").val(); 
	var wheres2="";
	if(orderIndex==null || orderIndex==""){
		orderIndex="1,2";
	}
	var selConfig=getSelect(); 
	var data1 = "reportID="+reportID+"&orderIndex="+orderIndex+"&groupIndex="+groupIndex+"&operateType="+operateType+"&operateData="+operateData+
				"&currentPage="+currentPage+ "&colNames="+colNames+"&whereColname="+whereColname+"&wheres="+wheres2+"&selConfig="+selConfig+"&expSql="+expSql;
	$.ajax( {
		type : "post",
		url : rootPath+action,
		data : data1,
		dataType : "json",
		success : function(response) { 
            newFillTable(response);
            $("#loading2").hide();
		}
	});
}
//跳转到某页 
function goPage2() { 
	$("#loadWord2").html("加载数据...");
    $("#loading2").show();
    $("#downExcel").hide();
    var action = $("#action").val(); 
    var goPage = $("#goPage").val();
    var goPageInt = isNaN(goPage) ? 1 : parseInt(goPage);
    var maxPage = parseInt($("#maxPage").val());
    if (goPage == '' || isNaN(goPage)) {
    	alert("输入的页码不正确，请重新输入！");
    	$('#goPage').val('');
    	$('#goPage').focus();
    	$("#loading2").hide();
    }else { 
    	var goPageInt = parseInt(goPage);
    	goPage = goPageInt<1 ? 1 : goPageInt;
    	goPage = goPage<maxPage ? goPage : maxPage;
    	var reportID=$("#reportID").val(); 
    	var orderIndex=$("#orderIndex").val();
    	var groupIndex=$("#groupIndex").val();
    	var operateType=$("#operateType").val(); 
    	var operateData=$("#operateData").val();
    	var colNames=$("#colNames").val(); 
    	var whereColname=$("#whereColname").val();
		var wheres2=""; 
		if(orderIndex==null || orderIndex==""){
			orderIndex="1,2";
		}
		var selConfig=getSelect();
		var data1 = "reportID="+reportID+"&orderIndex="+orderIndex+"&groupIndex="+groupIndex+"&operateType="+operateType+"&operateData="+operateData+
					"&currentPage="+goPage+"&colNames="+colNames+"&whereColname="+whereColname+"&wheres="+ wheres2+"&selConfig="+selConfig;
        $.ajax({
            type: "post",
            url: rootPath+action,
            data: data1,
            dataType: "json",
            success: function(response){ 
                fillTable(response);
                $("#loading2").hide();
            }
        });
    }
}

function hideDivPop(){ 
	$("#importExcelMsg").html("");
	$(".divPop").hide(); 
}

function isNumber(str){//验证实数 
	 var patten = /^-?\d+\.?\d*$/;  
	 var isNum =patten.test(str);
	 return isNum;
}
	
function _w_table_rowspan(_w_table_id,_w_table_colnum){//（对应的table的id，要合并的列数）
    _w_table_firsttd = "";    
    _w_table_currenttd = "";   
    _w_table_SpanNum = 0;    
    _w_table_Obj = $(_w_table_id + " tr td:nth-child(" + _w_table_colnum + ")");  
    _w_table_Obj.each(function(i){   
         if(i==0){    
            _w_table_firsttd = $(this);   
            _w_table_SpanNum = 1;    
         }else{   
             _w_table_currenttd = $(this); 
             if(_w_table_firsttd.text()==_w_table_currenttd.text()){   
                 _w_table_SpanNum++;   
             _w_table_currenttd.hide(); //remove();    
                 _w_table_firsttd.attr("rowSpan",_w_table_SpanNum);   
            }else{    
              _w_table_firsttd = $(this);  
                 _w_table_SpanNum = 1;  
           }  
       } 
     });    
}


//制作固定表格
function mkGrid(){
	new superTable("demoTable", {
		cssSkin: "sOrange",
		headerRows: 1,
		fixedCols: 1
	});
}
	
	
//tab页
function changeTab(tab,tabTitle,tabBox,selected){
	$(tab).each(function(){//对所有滑动门块进行遍历
		$(this).find(tabTitle).eq(0).addClass(selected);//默认给第一个加样式
		$(this).find(tabBox).eq(0).show().siblings().hide();//默认显示第一个模块，隐藏其他模块
	});
	
	$(tabTitle).click(function(){//tab点击操作
		$(this).addClass(selected).siblings().removeClass(selected);//点击加样式，移除其他兄弟节点的样式
		num = $(this).parents(tab).find(tabTitle).index($(this));//获得被点击的序号
		$(this).parents(tab).find(tabBox).eq(num).show().siblings().hide();//显示对应的模块，隐藏其他模块
	});
}
	
function getWheres(idNames,idFather) { 
	var wheres="",tmp=""; 
	if(idNames!=""){
		var idNames2=idNames.split(";");
		for(var i=0;i<idNames2.length;i++){
			tmp=$(idFather+" #"+idNames2[i]).val();
			if (tmp != undefined && tmp != '') {
			    idNames2[i] = idNames2[i].replaceAll(":", "："); 
			    idNames2[i] = idNames2[i].replaceAll(";", "；"); 
				wheres += idNames2[i]+":"+tmp+";";
			}
		}
		wheres=wheres.substr(0,wheres.length-1); 
	} 
	return wheres;
}

function isEdit(colName){  
	colName=colName.toLowerCase();
	var noEditColName="in_time,in_user_name,in_user_id,in_id";
	noEditColName=noEditColName.split(",");
	var flag=true;
	for(var i=0;i<noEditColName.length;i++){
		if(noEditColName[i]==colName){
			flag=false;
			break;
		}
	}	
	return flag;
}

////////js工具类//////
//(1)将json数据替换页面中的模板
function repTemp(obj, template) { 
  if (template != null) {
      template = template.replace(new RegExp("%7B", 'g'), "{").replace(new RegExp("%7D", 'g'), "}"); 
      for (var i in obj) {
          if (i != undefined && i != "") {
              template = template.replace(new RegExp("\\{\\$" + i + "}", 'g'), obj[i]);
              //template = template.replace(new RegExp("tp_"+i+"_", 'g'), obj[i]);  
          }
      }
  }
  return template;
}

String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}


//(2)URL处理, 获取URL中的参数
function JSRequest(_url) {
    this.url = document.URL;
    if (_url) {
        this.url = _url;
    }

    this.reg = new RegExp("(http|https|ftp)://([-a-z0-9_.]+)(/[-a-z0-9_.!/@&=\+,.~%\$\?]*)", "gmi");
    this.reg.test(this.url);

    this.HostName = RegExp.$2; //域名
    this.Protocal = RegExp.$1; //url协议
    this.PathAndQuery = RegExp.$3; //路径和查询参数
    this.Path = this.url.indexOf('?') > 0 ? RegExp.$3.substring(0, RegExp.$3.indexOf('?')) : RegExp.$3; //路径
    this.QueryString = this.url.indexOf('?') > 0 ? RegExp.$3.substring(RegExp.$3.indexOf('?') + 1) : ''; //查询参数
}

//获取Url的查询参数值
JSRequest.prototype.getParameter = function(name) {
    if (/\?(.+)$/.test(this.url)) {
        var ta = RegExp.$1;
        var r = new RegExp(name + "=([^&]+)", "gmi");
        if (r.test(ta)) {
            return unescape(RegExp.$1);
        } else {
            return '';
        }
    } else {
        return '';
    }
}
 
//(3)验证实数 
function isNumber(str){
	 var patten = /^-?\d+\.?\d*$/;  
	 var isNum =patten.test(str);
	 return isNum;
}

function trim(str){  //删除前后空格
    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
} 

//智能匹配 全选和反选按钮
function selAll(i) { //修改通用  
    var checkeds = $('#selAll_'+i).attr("checked"); 
    if(checkeds==undefined){
    	checkeds=false;
    } 
    $("[id^='showPop_"+i+"'] :checkbox").attr("checked", checkeds);
} 

//将数值四舍五入(保留2位小数)后千位逗号分隔 
function formatCurrency(num,decimals2) { //decimals小数位数,默认2位
	var num2=Math.pow(10,decimals2);
    num = num.toString().replace(/\$|\,/g, '');
    // 如果不是数字，不用转换
    if(isNaN(num)) {
    	return num;
    }   
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*num2 + 0.50000000001);
    
    var cents = num % num2; //取num 除以100的余数，也就是原来数据的小数点后两位。
    num = Math.floor(num/num2).toString();
    
    if(cents < 10) {
    	cents = "0" + cents; //将小数部分格式确定为两位（补零）
    }  
    

    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) { //整数部分每三位数加一个,分隔
    	num = num.substring(0, num.length-(4*i+3)) + ',' + num.substring(num.length-(4*i+3));
    }   
    
    
    if(parseInt(decimals2)>0){
    	num=(((sign) ? '' : '-') + num + '.' + cents); 
	}else {
		num=(((sign) ? '' : '-') + num);
	}
    return num;
}


function getDataFormat(showIndex2,isSameLen,dataMaxLen,j,dataTmp,colTypesTmp,dataFormatTmp) {
	var percent="",decimals=2;//数字字符默认2位
    if(colTypesTmp!=undefined&&colTypesTmp.indexOf("number")>=0 ){//有小数位 
    	if(colTypesTmp.indexOf(",")>=0){
    		decimals=colTypesTmp.substring(colTypesTmp.indexOf(",")+1,colTypesTmp.length-1);//获取小数位 
    	}else {
    		decimals=0;//是整数，没有小数位
    	}                	
    }
    if(dataFormatTmp==null || dataFormatTmp==0){//无(默认)格式
    	 if (j!=0 && colTypesTmp.indexOf("number")>=0 ) {//数字右对齐 || (isNumber(n[showIndex2[j]]) && "216,217,218,".indexOf(reportID+",")>=0)
             textAlign = "right";  
             dataTmp=formatCurrency(dataTmp,decimals);
         }else if (isSameLen[showIndex2[j]] == true || dataMaxLen[showIndex2[j]] < 5) {
             textAlign = "center"; 
         }else if (dataTmp.indexOf("%")>0) { //有的字段为字符型,含数字和百分数           reportid='''暂时特殊处理           
        	 dataTmp2=dataTmp.replaceAll("%","");
             if(isNumber(dataTmp2)){//必须是数字+%
             	textAlign = "right"; 
             	if(dataTmp.indexOf(".")>0){ //保留4位小数
                 	dataTmp=dataTmp2.substr(0,dataTmp2.indexOf(".")+5); 
                 } 
             	dataTmp=dataTmp2+"%";  
             } 
         }  
    }else{
    	var formats=dataFormatTmp.split(",");
    	var textAlign="",dataTmp2;
    	for (var j2 = 0; j2 < formats.length; j2++) {
    		if(formats[j2]==10){ //自动对齐
    			
    		}else if(formats[j2]==11){//右对齐
    			textAlign = "right"; 
    		}else if(formats[j2]==12){//左对齐
    			textAlign = "left"; 
    		}else if(formats[j2]==13){//居中对齐
    			textAlign = "center";
    		}else if(formats[j2]==20){//2位小数
    			dataTmp=formatCurrency(dataTmp,2); 
    		}else if(formats[j2]==21){//4位小数
    			dataTmp=formatCurrency(dataTmp,4);
    		}else if(formats[j2]==22){//6位小数
    			dataTmp=formatCurrency(dataTmp,6);
    		}else if(formats[j2]==23){//8位小数
    			dataTmp=formatCurrency(dataTmp,8);
    		}else if(formats[j2]==24){//不限小数位 
    			dataTmp=formatCurrency(dataTmp,decimals);
    		}else if(formats[j2]==30){//千位分隔
    			dataTmp=formatCurrency(dataTmp,decimals);
    		}else if(formats[j2]==31){//百分符号%
    			dataTmp2=dataTmp.replaceAll("%","");
                if(isNumber(dataTmp2)){//必须是数字+% 
                	if(dataTmp.indexOf(".")>0){ //保留4位小数
                    	dataTmp=dataTmp2.substr(0,dataTmp2.indexOf(".")+5); 
                    } 
                	dataTmp=parseFloat(dataTmp2)*100+"%";  
                } 
    		}else if(formats[j2]==32){//红降绿升(百分数或数据)
    			dataTmp2=dataTmp.replaceAll("%","");
                if(isNumber(dataTmp2)){//必须是数字+% 
                	percent="";
                	if(dataTmp.indexOf("%")>=0){
                		percent="%";
                	}
                	if (parseInt(dataTmp2) >= 0) { //完成率不用红升率降
                		dataTmp="<span style='color:red'>"+dataTmp2+percent+"↗</font>";
                	}
                	if (parseInt(dataTmp2) < 0) {
                		dataTmp="<span style='color:green'>"+dataTmp2+percent+"↘</font>";
                	}
                }
    		}else if(formats[j2]==33){//人民币￥ 
                if(isNumber(dataTmp)){//必须是数字+% 
                	dataTmp=dataTmp+"￥";
                }
    		} 
    		if(formats[j2]>=20 && formats[j2]<=35){
    			textAlign = "right"; 
    		}
    	}
    }	
	return dataTmp+"@@"+textAlign;
}

//固定表头 支持IE6+，FF3.6+，Opera9+，Chrome9+
function FixTable(TableID, FixColumnNumber, width, height) { //TableID要锁定的Table的ID, FixColumnNumber要锁定列的个数 
	if ($("#" + TableID + "_tableLayout").length != 0) {
		$("#" + TableID + "_tableLayout").before($("#" + TableID));
		$("#" + TableID + "_tableLayout").empty();
	} else {
		$("#" + TableID).after( "<div id='" + TableID + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>"); //width:" + width + "px;'
	}
	$('<div id="' + TableID + '_tableFix"></div>' + '<div id="' + TableID + '_tableHead"></div>' + '<div id="' + TableID + '_tableColumn"></div>' + '<div id="' + TableID + '_tableData"></div>').appendTo( "#" + TableID + "_tableLayout");
	var oldtable = $("#" + TableID);
	var tableFixClone = oldtable.clone(true);     
	//造成id重复
	tableFixClone.attr("id", TableID + "_tableFixClone");//1
	$("#" + TableID + "_tableFix").append(tableFixClone);
	
	var tableHeadClone = oldtable.clone(true);
	tableHeadClone.attr("id", TableID + "_tableHeadClone");//2
	$("#" + TableID + "_tableHead").append(tableHeadClone);
	
	var tableColumnClone = oldtable.clone(true);
	tableColumnClone.attr("id", TableID + "_tableColumnClone");
	$("#" + TableID + "_tableColumn").append(tableColumnClone);
	$("#" + TableID + "_tableData").append(oldtable);
	
	$("#" + TableID + "_tableLayout table").each(function() {
		$(this).css("margin", "0");
	});
	
	
	var HeadHeight = $("#" + TableID + "_tableHead thead").height();
	HeadHeight += 2;
	$("#" + TableID + "_tableHead").css("height", HeadHeight);
	$("#" + TableID + "_tableFix").css("height", HeadHeight);
	var ColumnsWidth = 0;
	var ColumnsNumber = 0;
	
	//浏览器类型
	var browserType=""; 
    if(navigator.userAgent.indexOf("MSIE")>0) {  
	   browserType= "MSIE";  
    }else if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){  
	   browserType= "Firefox";  
    }else if(isSafari=navigator.userAgent.indexOf("Safari")>0) {  
	   browserType= "Safari";  
    }else if(isCamino=navigator.userAgent.indexOf("Camino")>0){  
	   browserType= "Camino";  
    }else if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0){  
	   browserType= "Gecko";  
    }   
	
	$("#" + TableID + "_tableColumn").css("width", ColumnsWidth);
	$("#" + TableID + "_tableFix").css("width", ColumnsWidth);
	var topPx2="";
	$("#" + TableID + "_tableData").scroll( function() { 
		$("#" + TableID + "_tableHead").scrollLeft( $("#" + TableID + "_tableData").scrollLeft());
		$("#" + TableID + "_tableColumn").scrollTop( $("#" + TableID + "_tableData").scrollTop());   
		if (isScrollBottom(this)) {//修复360,火狐和谷歌浏览器垂直滚动条到最下面表格变形?
			topPx2=$("#" + TableID + "_tableColumn").css("top");
			var topPx="";
			if(browserType== "MSIE"){ //360浏览器
				topPx="-64px";
			}else if (browserType== "Firefox"){ //火狐
				topPx="-66px";
			}else if(browserType== "Safari"){ //谷歌
				topPx="-70px"; 
			}
			$("#" + TableID + "_tableColumn").css("top", topPx); 
        } else {   
        	if(topPx2!=""){
        		$("#" + TableID + "_tableColumn").css("top", topPx2);//还原
        	}
        } 
	});  
	$("#" + TableID + "_tableFix").css( {
		"overflow" : "hidden",
		"position" : "relative",
		"z-index" : "50",  //不要修改
		"background-color" : "Silver"
	});
	$("#" + TableID + "_tableHead").css( {
		"overflow" : "hidden",
		"width" : width - 17,
		"position" : "relative",
		"z-index" : "45",
		"background-color" : "Silver"
	});
	$("#" + TableID + "_tableColumn").css( {
		"overflow" : "hidden",
		"height" : height - 17,
		"position" : "relative",
		"z-index" : "40",
		"background-color" : "Silver" 
	});
	$("#" + TableID + "_tableData").css( {
		"overflow" : "scroll",
		"width" : width,
		"height" : height,
		"position" : "relative",
		"z-index" : "35"
	});
	if ($("#" + TableID + "_tableHead").width() > $( "#" + TableID + "_tableFix table").width()) {
		$("#" + TableID + "_tableHead").css("width", $("#" + TableID + "_tableFix table").width());
		$("#" + TableID + "_tableData").css("width", $("#" + TableID + "_tableFix table").width() + 17);

	}
	if ($("#" + TableID + "_tableColumn").height() > $( "#" + TableID + "_tableColumn table").height()) { 
		$("#" + TableID + "_tableColumn").css("height", $("#" + TableID + "_tableColumn table").height());
//		$("#" + TableID + "_tableData").css("height", $("#" + TableID + "_tableColumn table").height() + 17); 
	}
	$("#" + TableID + "_tableFix").offset( $("#" + TableID + "_tableLayout").offset());
	$("#" + TableID + "_tableHead").offset( $("#" + TableID + "_tableLayout").offset());
	$("#" + TableID + "_tableColumn").offset( $("#" + TableID + "_tableLayout").offset());
	$("#" + TableID + "_tableData").offset( $("#" + TableID + "_tableLayout").offset()); 
	//var colNum=$("#colNum").val();
    //rowColSpan(TableID + "_tableHead",colNum+2);
}

//阻止事件冒泡的通用函数  
function stopBubble(e){ 
    //取消事件冒泡 
    var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
    if (e && e.stopPropagation) { 
     // this code is for Mozilla and Opera
     e.stopPropagation(); 
    } else if (window.event) { 
     // this code is for IE 
     window.event.cancelBubble = true; 
    } 
}

//模拟下拉框,失去焦点隐藏弹出层
function isHidePop(e,flag) { 
	//alert("i="+i+",flag="+flag);
	if(flag==true){ 
		$(".showDataPop19").hide();  
	}	 
	stopBubble(e); //阻止事件冒泡的通用函数  
}



//非空判断
function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='');
}


function formatQfw2 (num) {
		return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

function formatQfw (num) {
	return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

function getWhereValues(whereInfo){
	var whereValues="";
	var whereInfos=whereInfo.split(";");
	for(i=0;i<whereInfos.length;i++){
		var dataLevel = $("#rptWhere_"+i).attr("dataLevel"); //level与code/name组成
		var dataType="",selValue=""; 
		if(dataLevel!=null && dataLevel.indexOf(",")>=0){//数据权限 
			dataLevel=dataLevel.split(",");
			dataType=dataLevel[1];
			dataLevel=dataLevel[0];			
			if(dataLevel>=2 && dataType!='name'){//数据权限,XX编码
	    	   selValue=$("#rptWhere_"+i).attr("selValue");//地市id
	        }else{
	    	   selValue=$("#rptWhere_"+i).val();//地市名称
	        }
		} 	
		 
		if(whereInfos[i]!=0 && selValue!=""){ //""!=$("#rptWhere_"+i).val()
			var rptWheres=selValue.split(",");//$("#rptWhere_"+i).val().split(",");
			var rptWhere="'";
			for(j=0;j<rptWheres.length;j++){
				rptWhere+=rptWheres[j]+"','";
			}
			rptWhere=rptWhere.substring(0,rptWhere.length-2);
			whereValues+=i+":"+rptWhere+";";
		}
	}
	whereValues = whereValues.substring(0,whereValues.length-1);
	return whereValues;
}

// 创建用户列表 
function addItem(data) { 
    var tr = document.createElement('tr'); 
    var td = document.createElement('td'); 
    td.appendChild(document.createTextNode(data[0])); 
    tr.appendChild(td); 
    tbody.appendChild(tr); 
    if(++n % 10 == 0) progressing(); 
} 

//分时函数[*****] 
function timedChunk(items, process, context, callback) { 
    var todo = items.concat(), delay = 25; 
    setTimeout(function() { 
        var start = +new Date(); 
        do { 
            process.call(context, todo.shift()); 
        } while (todo.length > 0 && (+new Date() - start < 50));
        if(todo.length > 0) { 
            setTimeout(arguments.callee, 25); 
        } else if(callback) { 
            callback(); 
        } 
    }, delay); 
} 
// 分时加载 
function testTimed() { 
    resetBtn.disabled = true; 
    tradBtn.disabled = true; 
    timeBtn.disabled = true; 
    var start = +new Date(), end; 
    timedChunk(JSON_DATA, addItem, null, function() { 
        resetBtn.disabled = false; 
        end = +new Date(); 
        progress.innerHTML = (end - start) + ' ms'; 
    }); 
} 

