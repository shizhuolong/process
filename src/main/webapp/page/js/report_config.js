var request = new JSRequest();
var loginno = "";
var setting = {
		check: {
			enable: true,
			chkStyle: "checkbox",
			chkboxType: { "Y": "", "N": "" }
		},
		view: {
			dblClickExpand: true
		},data: {
			simpleData: {
				enable: true,
				idKey:"id",
				pIdKey: "pid"//父节点id
			},key: {
				name: "name"
			}
		},async: {
			enable: true,//true表示采用异步加载
			url: rootPath+"/page/reportConfig!initAddExcel.action",
			dataFilter: filterData,
			autoParam: ["id=parId"]
		},callback:{
			onCheck:checkMenu
		}
};
$(document).ready(function() { 
    initPage(); //首次进入页面初始化  
});

//初始化
function initPage() {
	loginno=request.getParameter("loginno");
    $("#loginno").val(loginno); 
    var type = request.getParameter("op");
    if (type == 'add') {
       initAddExcel();
    } else if (type == 'update') { 
        initUpdateExcel(); 
    } else {
        $("#loading").hide();
        $("#alertWord").html("请先登录!").show(); 
    } 
}

//新增初始化数据 
function initAddExcel() {
    document.title = "增加";
    //输出模板
    var html = "";
    for (var i = 0; i < 10; i++) {
       html+='<tr id="tabPage_'+i+'"></tr>';
    }
    $("#tabPageHtmls").html(html); 
    //初始化tab
    var initLevels=1;
    $('#levels option').each(function() { 
        if (initLevels == $(this).val()) {
            $(this).attr("selected", "true");
        }
    }); 
    $("#levelsLast").val(initLevels);
    $("#levelsMax").val(initLevels);
    $("#tabNow").val(0); //当前tab默认为0(第1级)  
    initTabAndPage(0, initLevels);
    $("#loading").hide();
    html='<textarea name="pageTitle" style="font-size:13px;" cols="12" rows="12"></textarea>';
    $("#pageTitlesHtml2").val(html);//存放多行,切换使用
    initList();
}

//新增初始化数据
function initTabAndPage(levls1, levls2) { 
    var html = "";
    for (var i = 0; i < levls2; i++) {
        html += '<a href="javascript:void(0)" id="levels_' + i + '" onclick="changeTab(' + i + ')" style="color:#366fa9">报表' + (i + 1) + '</a>&#12288;';
    }
    $("#levelsTab").html(html);
    $("#leveltd").show();
    //初始化页面
    var tabPageHtml = $("#tabPageHtml").html(); //Tab页面模板 
    var tabNow = $("#tabNow").val(); 
    var obj = new Object();
    for (var tab = levls1; tab < levls2; tab++) { 
        var objStr = "obj.tab='" + tab + "';obj.isTestSql='0'; obj.loginno='" + loginno + "'; obj.tableName='\"\"'"; 
        eval(objStr);
        $("#tabPage_" + tab).html(repTemp(obj, tabPageHtml)).hide();  
        $("#isTestSql_" + tab).val(0);  
        outPutRow(3, tab);  
        if(tab!=0){ 
        } 
        findOwner(tab);
        isShowCfg(tab,-1);
    }
    var tab = $("#tabNow").val();
    tab = parseInt(tab);
    if (tab >= levls2) {  
        $("#levels_" + (levls2 - 1)).css("color", "red");
        $("#tabPage_" + tab).hide();  
        tab = levls2 - 1;
    }
    $("#tabNow").val(tab);
    $("#tabPage_" + tab).show();
    $("#levels_" + tab).css("color", "red");  
    $("#modelExplain").show();
}

//更新初始化数据
function initUpdateExcel() {
    document.title = "更新";
    var tabNow = $("#tabNow").val();
    $("#loadWord_" + tabNow).html("正在初始化页面...");
    $("#loading_" + tabNow).show(); 
    var groupNo = request.getParameter("groupNo");
    if (groupNo == null || groupNo == "") {
        groupNo = 0;
    }
    var reportID = request.getParameter("reportID");
    $("#reportID").val(reportID);//保存reportID保存的时候传入后台
    var data1 = "groupNo=" + groupNo+ "&loginno="+loginno; 
    $.ajax({
        type: "post",
        url: rootPath+"/page/reportConfig!initUpdateExcel.action",
        data: data1,
        dataType: "json",
        success: function(response) { 
            var e = response.page.excel;
            var list3 = response.page.lists[3];
            //初始化tab
            var levels = e.levels;
            levels = parseInt(levels);
            $('#levels option').each(function() { 
	            if (levels == $(this).val()) {
	                $(this).attr("selected", "true");
	            }
	        });
            $("#levelsLast").val(levels);
            $("#levelsMax").val(levels);
            $("#tabNow").val(0); //当前tab;      
            //输出模板
            var html = "";
            for (var i = 0; i < 10; i++) {
               html+='<tr id="tabPage_'+i+'"></tr>';
            }
            $("#tabPageHtmls").html(html);            
            
            html="";
            for (var i = 0; i < levels; i++) {
                html += '<a href="javascript:void(0)" id="levels_' + i + '" onclick="changeTab(' + i + ')" style="color:#366fa9">报表' + (i + 1) + '</a>&#12288;';
            } 
            $("#levelsTab").html(html);
            $("#leveltd").show();

            var tabPageHtml = $("#tabPageHtml").html(); 
            html = "";
            var obj = new Object();
            for (var tab = 0; tab < list3.length; tab++) { 
                html = repTemp(list3[tab], tabPageHtml);
                eval("obj.tab='" + tab + "';" + "obj.isTestSql='1';obj.loginno='" + loginno + "';");  
                html = repTemp(obj, html);
                $("#tabPage_" + tab).html(html); 
                if (tab != 0) {
                    $("#tabPage_" + tab).hide(); 
                }
                findOwner(tab);
            }  
            $("#levels_0").css("color", "red");  
            $("#tabPage_0").show();  
            $("#groupNo").val(e.groupNo);
            $("#loading_" + tabNow).hide();
            $("#loading").hide();
            $("#modelExplain").show();
            initPageData(response);  
        }
    });
}

//更新初始化数据:输出并选择相应表单
function initPageData(response) {
    var opt_text="不验证;不能为空;必须是整数;必须是实数;必须联通手机号";
    opt_text=opt_text.split(";");    
    var list = response.page.lists[0]; //查询条件
    var list1 = response.page.lists[1]; //字段编辑 
    var list2 = response.page.lists[2]; //格式设置
    var list3 = response.page.lists[3]; //表结构信息 
    for (var tab = 0; tab < list3.length; tab++) {
        var e = list3[tab]; 
        var reportID = e.reportID;
		var reportName = e.reportName;  
		var tableName= e.tableName;
		var tableType= e.tableType;
		var reportSql = e.reportSql;  //查询数据SQL,还原逗号
		var editInfos = e.editInfo.split(";");  
		var operateType = e.operateType;//.split(";")
		var pageTitles = e.pageTitles.split(";");
		var isMoreHead = e.isMoreHead; 
		var whereInfos = e.whereInfo.split(";");
		var isMoreWheres = e.isMoreWhere.split(";");
		var showIndexs = e.showIndex.split(";");   
		var orderIndexs = e.orderIndex.split(";"); 
		var groupIndexs = e.groupIndex.split(";");
		var dataFormats = e.dataFormat;
		if(dataFormats!="" && dataFormats!=null){
			dataFormats=dataFormats.split(";");
		}
		var importIndexs = e.importIndex.split(";"); 
		var onlyIndexs = e.onlyIndex.split(";");
		var checkIndexs = e.checkIndex.split(";"); 
		var operateData = e.operateData;//.split(";"); 
		var modelExcel = e.modelExcel.split(";");;
		var reportExplain = e.reportExplain;
		var whereColnames = e.whereColname.split(";");
		
		var colNames = e.colNames.split(";");
		var colName = e.colName.split(";");
		var colTypes = e.colTypes.split(";");
		var colRemarks = e.colRemarks.split(";"); 
		var tripIndex = e.tripIndex.split(";");
		var funcIndex = e.funcIndex.split(";");
		var datafuncIndex=e.datafuncIndex.split(";");
		var tripDownVal=e.tripDown.split(";");
		
        var colNum = colNames.length; //字段个数  (read from 表结构)
        var oldColNum = colName.length; //字段个数
        var isAdd = e.isAdd;
        var isUpdate = e.isUpdate;
        var beginRow = e.beginRow;
        var reportPath = e.reportPath;
        var menu=reportPath.split(";");
        $("#reportPath").val(reportPath);
        $("#menuId").val(menu[1]);
        $("#tableName2_" + tab).val(tableName); //初始化使用        
        if(tableType=="table"){ 
        	tableName=tableName.substring(tableName.indexOf(".")+1,tableName.length)+" [表]";
        }else if(tableType=="view"){ 
        	tableName=tableName.substring(tableName.indexOf(".")+1,tableName.length)+" [视图]";
        }         
        $("#tableName_" + tab).val(tableName);
        
        $("#beginRow_" + tab).val(beginRow);
        $("#reportName").val(reportName); 
        $("#reportExplain").html(reportExplain);   
        if(modelExcel[0]==1){
        	$("#modelExcel").html(modelExcel[1]);
        	$("#modelExcel").attr("href","../jsp/downExcel.jsp?filePath=/page/excelModel/download/&fileName="+modelExcel[1]+"&display="+modelExcel[1]);  
        }else if(modelExcel[0]==2){
        	$("#modelExcel2").val(modelExcel[1]);
        }	

        var colNameHtml = "", colTypeHtml = "", colRemarkHtml = "", pageTitleHtml = "",condNameHtml="",whereInfoHtml = "", showIndexHtml = "", orderIndexHtml = "", groupIndexHtml = "", dataFormatHtml = "",
        	importIndexHtml = "",onlyIndexHtml = "", checkIndexHtml = "", editInfoHtml = "", operateDataHtml = "", checked = "", display = "",tripIndexHtml="",funcIndexHtml="",tirpOptHtml="",funcOptHtml="",datafuncIndexHtml="",tripDownHtml="";
        for (var i = 0; i < colNum; i++) {  
            if(isMoreHead==1){//多行表头
                pageTitles[i]=colRemarks[i];
                if(pageTitles[i]==''){
                	pageTitles[i]=colNames[i];
                }
            }
            colNameHtml += '<div class="cols"><input name="colName_' + tab + '" size="10" value="' + colNames[i] + '" title=' + colNames[i] + ' /></div>';
            colTypeHtml += '<div class="cols"><input name="colType_' + tab + '" size="9" value="' + colTypes[i] + '" title=' + colNames[i] + ' readonly/></div>';
            colRemarkHtml += '<div class="cols"><input name="colRemark_' + tab + '" size="10" value="' + colRemarks[i] + '" readonly/></div>';
            pageTitleHtml += '<div class="cols" title="' + colNames[i] + '"><input name="colName_' + tab + '" size="12" value="' + pageTitles[i] + '"/></div>';
            var optHtml="",nextCol="",tripOpt='<option title="" value="-1" >无</option>',funcOpt='<option title="" value="-1" >无</option>',datafuncOpt='<option title="" value="-1" >无</option>' ;  
            if(whereInfos[i]!=undefined&&whereInfos[i]!=""){//如果条件不为空取出条件名称（放在最后面）
            	var condNameVal=whereInfos[i].substr(whereInfos[i].lastIndexOf(",")+1);
            	if(condNameVal==0){
            		condNameVal="";
            	}
            	 condNameHtml += '<div class="cols"><input name="condName_' + tab + '" size="12" value="'+condNameVal+'"/></div>';
            }else{
            	condNameHtml += '<div class="cols"><input name="condName_' + tab + '" size="12" value=""/></div>';
            }
            var tempLen=0;
            if(i<oldColNum)
            	tempLen = whereInfos[i].split(",").length;
            if(whereInfos[i]!=undefined && ((whereInfos[i].indexOf("c2")>=0 || whereInfos[i].indexOf("c3")>=0) || (whereInfos[i].indexOf("s,")>=0 && tempLen==4))){//智能匹配和数据权限(s,90,group_id_2)去掉字段名
            	whereInfos[i]=whereInfos[i].substr(0,whereInfos[i].lastIndexOf(","));  
            }
        	whereInfos[i]=whereInfos[i].substr(0,whereInfos[i].lastIndexOf(","));  //后面加了条件名称截掉by yangjian
            for (var j = 0; j < list.length; j++) { 
                checked="";  
                nextCol="";
            	if (list[j].selValue == whereInfos[i]) {checked = "selected"; } 
            	if(list[j].selValue.indexOf("s,")>=0){
            		nextCol=",传递"+list[j].colNames; 
            	} 
            	optHtml+='<option title="' + list[j].selText + nextCol + '" value="'+list[j].selValue+'" '+checked+'>'+list[j].selText+'</option>';
            }
            
            //下钻option
            for(var m = 0; m < colNum; m++){
            	checked="";
            	if(tripIndex[i]==m){checked = "selected";} 
            	tripOpt+='<option title="" value="'+m+'" '+checked+'>'+colNames[m]+'</option>';
            }
            //函数option
            checked="";
            if(funcIndex[i]==0){
            	checked="selected";
            }
            funcOpt+='<option title="" value="0" '+checked+'>SUM</option>';
            display="none";
            checked="";
            if(isMoreWheres[i]==1){ checked = "checked"; display="yes"; }
            if(whereInfos[i]!=undefined&&whereInfos[i].indexOf("yyyy")==-1 && whereInfos[i]!=0){ display="yes"; }
            
            whereInfoHtml+='<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;"><select name="whereInfo_' + tab + '" id="whereInfo_' + tab + '_'+i+'" style="width:115px;" onchange="changeWhereInfo(\''+tab+'_'+i+'\')">'+optHtml+' </select>'+
            			   ' <input type="checkbox" name="isMoreWhere_' + tab + '" id="isMoreWhere_' + tab + '_'+i+'" title="可多选,' + colNames[i] +'" '+checked+' style="display:'+display+';"/></div>';
           
            checked = "";
            for (var j = 0; j < showIndexs.length; j++) {
                if (i == showIndexs[j]) { checked = "checked"; break; }
            }
            showIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="showIndex_' + tab + '" id="showIndex_' + tab + '_'+i+'" type="checkbox" value="' + i + '" ' + checked + '/></div>';
			
            checked = "";
            for (var j = 0; j < orderIndexs.length; j++) {
                if (i == orderIndexs[j] && orderIndexs[j]!="") { checked = "checked"; break; }
            }            
            orderIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="orderIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
             
            checked = "";
            for (var j = 0; j < groupIndexs.length; j++) {
                if (i == groupIndexs[j] && groupIndexs[j]!="") { checked = "checked"; break; }
            }
            groupIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="groupIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
            
            var optHtml='<div><input type="button" value="确定" class="b_foot" onclick="getDataFormat(\'' + tab + '_'+i +'\')"> <input type="button" value="关闭" class="b_foot" onclick="hidePop2(\''+tab + '_'+i+'\')"></div>',selText="",selVal="";    
            selText=""; 
            selVal=""; 
            for (var j = 0; j < list2.length; j++) { 
                checked="";
                if (dataFormats!=null && dataFormats!=undefined && dataFormats[i]!=undefined){
                	var tmp=dataFormats[i].split(",");
                	for(var j2=0;j2<tmp.length;j2++){
                	   if (tmp[j2]==list2[j].selValue) { 
                    	  checked = "checked";  
                    	  selText+=list2[j].selText+",";
                    	  selVal+=list2[j].selValue+","; 
                        } 
                	 }
                } 
            	optHtml+='<div id="dataFormat_' + tab + '_'+i+'" style="font-size:13px;padding-top:2px;padding-left:2px;"><input type="checkbox" value="' + list2[j].selValue + '" ' + checked + ' style="margin-right:2px;"/>' + list2[j].selText + '</div>';	
            }
            if(selText!=""){ 
            	selText=selText.substring(0, selText.length-1); 
            	selVal=selVal.substring(0, selVal.length-1); 
            }else{
            	selText="无"; 
                selVal="0"; 
            }    
            dataFormatHtml+='<div class="cols"><input id="dataFormat1_' + tab + '_'+i + '" title="' + colNames[i]+','+selText +'" value="'+selText+'" selVal="'+selVal+'" onclick="showPop2(\''+tab + '_'+i+'\')" type="text"  style="width:80px;"/> <span id="dataFormat2_' + tab + '_'+i + '" class="showDataPop21"> '+optHtml+' </span></div>';   
 
            checked = "";
            for (var j = 0; j < importIndexs.length; j++) {
                if (i == importIndexs[j]) { checked = "checked"; break; }
            }
            importIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="importIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
            
            checked = "";
            for (var j = 0; j < onlyIndexs.length; j++) {
                if (i == onlyIndexs[j]) { checked = "checked"; break; }
            }
            onlyIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="onlyIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
             
            var optHtml=""; 
            for (var j = 0; j < opt_text.length; j++) {
                checked="";
                if (j == checkIndexs[i]) { checked = "selected"; }
             	 optHtml+='<option title="'+opt_text[j]+'" value="'+j+'" '+checked+'>'+opt_text[j]+'</option>';
            }  
            checkIndexHtml+='<div class="cols" title="' + colNames[i] + '"><select name="checkIndex_' + tab + '" style="width:88px;">'+optHtml+' </select></div>';
			
            var optHtml="",nextCol="";    
            for (var j = 0; j < list1.length; j++) { 
                checked="";
            	if (list1[j].selValue == editInfos[i]) { checked = "selected";  }
            	nextCol="";
            	if(list1[j].selValue.indexOf("s,")>=0){
            		nextCol=",更新"+list1[j].colNames;
            	}else if(j==1 || j==2){ //增加title提示
            		nextCol=list1[j].colNames;
            	}
            	optHtml+='<option title="' + list1[j].selText + nextCol + '" value="'+list1[j].selValue+'" '+checked+'>'+list1[j].selText+'</option>';
            }
            editInfoHtml+='<div class="cols" title="' + colNames[i] +'"><select name="editInfo_' + tab + '" style="width:115px;">'+optHtml+' </select></div>';                 
            if(0 ==datafuncIndex[i])
            	datafuncOpt+='<option title="" value="0" selected>千分位+2位小数位</option>';
            else
            	datafuncOpt+='<option title="" value="0">千分位+2位小数位</option>';
            if(1 ==datafuncIndex[i])
            	datafuncOpt+='<option title="" value="1" selected>千分位</option>';
            else
            	datafuncOpt+='<option title="" value="1">千分位</option>';
            tripIndexHtml += '<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;"><select name="tripIndex_' + tab + '" id="tripIndex_' + tab + '_'+i+'"  onfocus="initTripOption(\''+tab+'\',this);" style="width:115px;">'+tripOpt+'  </select></div>';
            funcIndexHtml += '<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;"><select name="funcIndex_' + tab + '" id="funcIndex_' + tab + '_'+i+'" style="width:60px;">'+funcOpt+' </select></div>';
            datafuncIndexHtml+='<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;style="display:none;""><select name="datafuncIndex_' + tab + '" id="datafuncIndex_' + tab + '_'+i+'" style="width:115px;">'+datafuncOpt+' </select></div>';
            
            tripDownHtml+='<div class="cols"><input name="tripDown_' + tab + '" size="12" type="text" value="'+(isNotBlank(tripDownVal[i])?tripDownVal[i]:"")+'"/></div>';
        }
        $("#colName_" + tab).html(colNameHtml);
        $("#colType_" + tab).html(colTypeHtml);
        $("#colRemark_" + tab).html(colRemarkHtml); 
        $("#condName_" + tab).html(condNameHtml);//显示条件名称
        $("#whereInfo_" + tab).html(whereInfoHtml);
        $("#showIndex_" + tab).html(showIndexHtml);  
        $("#orderIndex_" + tab).html(orderIndexHtml); 
        $("#groupIndex_" + tab).html(groupIndexHtml); 
        $("#dataFormat_" + tab).html(dataFormatHtml);
        $("#importIndex_" + tab).html(importIndexHtml); 
        $("#onlyIndex_" + tab).html(onlyIndexHtml); 
        $("#checkIndex_" + tab).html(checkIndexHtml);  
        $("#editInfo_" + tab).html(editInfoHtml);
        $("#tripIndex_" + tab).html(tripIndexHtml);
        $("#funcIndex_" + tab).html(funcIndexHtml);
        $("#datafuncIndex_" + tab).html(datafuncIndexHtml)
        $("#tripDown_" + tab).html(tripDownHtml)
        
        html='<textarea name="pageTitle" style="font-size:13px;" cols="12" rows="13">'+e.pageTitles+'</textarea>';
        if(isMoreHead==1){//多行表头,保存单行供切换
           $("#pageTitle_" + tab).html(html); 
           $("#isMoreHead_" + tab).attr("checked","true"); 
        }else{
           $("#pageTitle_" + tab).html(pageTitleHtml);  
        }
        $("#pageTitlesHtml").val(pageTitleHtml);//存放单行,切换使用
        $("#pageTitlesHtml2").val(html);//存放多行,切换使用 
        $("#operateType_" + tab+" [name=operateType]:checkbox").each(function() {
	        if (operateType.indexOf($(this).val()) >= 0) {
	            $(this).attr("checked",true);
	        }else{
	            $(this).attr("checked",false);
	        }
	    });
        if(isAdd==1){//导入
        	operateDataHtml='<option value="-1">所有用户</option><option value="0">导入用户本人</option> ';//+operateDataHtml;
            $("#operateData_" + tab).html(operateDataHtml);
            $("#isAddCol_" + tab+" option").each(function() {
    	        if ($(this).val()==isAdd) {
    	            $(this).attr("selected",true);
    	        } 
    	    }); 
            
            $("#operateData_" + tab+" option").each(function() {
    	        if ($(this).val()==operateData) {
    	            $(this).attr("selected",true);
    	        } 
    	    }); 
        }
        $("#isUpdate_" + tab+" option").each(function() {
	        if ($(this).val()==isUpdate) {
	            $(this).attr("selected",true);
	        } 
	    });
    } 
    isShowCfg(0,isAdd);
}

//查询表名
function findTabelName(tab) {  
	$("#loading_" + tab).show();
    $("#loadWord_" + tab).html("查找表信息中..."); 
    $("#alertWord_" + tab).html("").hide();
    
    var owner=$("#owner_" + tab).val();
    var tableName = owner+"."+$("#tableName_" + tab).val(); 
    tableName=tableName.substring(0,tableName.indexOf(" "));
    if(owner==""){
    	$("#loading_" + tab).hide();
    	$("#alertWord_" + tab).html("请选择数据库用户").show();
    	return;
    }else if(tableName.indexOf(".")<=0){
    	$("#loading_" + tab).hide();
    	$("#alertWord_" + tab).html("请选择数据表或视图").show(); 
    	return;
    }
    tableName=tableName.replaceAll(" ","");	
    tableName=tableName.toUpperCase();
    var isAddCol=$("#isAddCol_" + tab).val(); 
    var action = $("#action").val();
    var data1 = "tableName=" + tableName+"&isAddCol="+isAddCol;
    $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {
            $("#loading_" + tab).hide();
            $("#alertWord_" + tab).hide();
            var flag = response.page.flag;   
            var errorMsg = response.page.errorMsg;
            if (flag == 0) {
                $("#alertWord_" + tab).html("表不存在,请仔细检查!").show();
                $("#isTestSql_" + tab).val(0);
            } else {
                $("#alertWord_" + tab).html("获取表信息成功!").show().fadeOut(3500);
                $("#isTestSql_" + tab).val(1);
                isTableCheck(tab);
            }
            var page = response.page;
            outPutRow(page, tab); //输出表单
        }
    });
}


//根据表字段个数生成相应的表单,优化智能默认选择
function outPutRow(page, tab) { 
	if(page.colNames==undefined){
	   return;
	} 
	var colNames = page.colNames.split(";");
	var colTypes = page.colTypes.split(";");
	var colRemarks = page.colRemarks.split(";"); 		
    var colNum = colNames.length; //字段个数 
    var colNameHtml = "", colTypeHtml = "", colRemarkHtml = "", pageTitleHtml="", pageTitles="",condNameHtml="",whereInfoHtml = "",showIndexHtml = "",orderIndexHtml = "", 
    	groupIndexHtml = "",dataFormatHtml = "",importIndexHtml = "",onlyIndexHtml = "", checkIndexHtml = "",   editInfoHtml = "", operateDataHtml = "", checked="",display="",tripIndexHtml = "",
    	tripOption = "<option title='' value='-1' >无</option>",funcIndexHtml = "",datafuncIndexHtml="",tripDownHtml="";
        var opt_text="不验证;不能为空;必须是整数;必须是实数;必须联通手机号";
	    opt_text=opt_text.split(";"); 
	    var checked = "",nextCol="";
	    var pageTitle2 = "", pageTitles = "";
	    $('#pageTitle_' + tab + ' div input').each(function() { //input才有display=none
	        if ($(this).css("display").indexOf('inline') >= 0) {
	            pageTitle2 += $(this).val() + ";";  
	        }
	    }); 
	    pageTitle2 = pageTitle2.substr(0, pageTitle2.length - 1); 
	    pageTitle2 = pageTitle2.split(";");
	    var list = page.lists[0];
	    var list2 = page.lists[2];//数据处理
	    
        for (var j = 0; j < colNum; j++){
        	tripOption += '<option title="" value="'+j+'" >'+colNames[j]+'</option>';
        }
        for (var i = 0; i < colNum; i++) { //pageCol 
       		colNameHtml += '<div class="cols"><input name="colName_' + tab + '" size="10" value="' + colNames[i] + '" /></div>';
            colTypeHtml += '<div class="cols"><input name="colType_' + tab + '" size="10" value="' + colTypes[i] + '" readonly/></div>';
            colRemarkHtml += '<div class="cols"><input name="colRemark_' + tab + '" size="12" value="' + colRemarks[i] + '" readonly/></div>';
            if(colRemarks[i]!=""){
               pageTitles=colRemarks[i];//若有备注优先使用
            }else if(pageTitle2[i]!="" && pageTitle2[i]!=undefined){
                pageTitles=pageTitle2[i];//若已有标题，则不变
            }else{
               pageTitles=colNames[i];//使用字段名
            }  
            pageTitleHtml += '<div class="cols" title="' + colNames[i] + '"><input name="colName_' + tab + '" size="12" value="' + pageTitles + '"/></div>';           
            condNameHtml += '<div class="cols"><input name="condName_' + tab + '" size="12" value=""/></div>';
            var optHtml="";   
            for (var j = 0; j < list.length; j++) { 
                checked="";
            	if (("timest;acct_period;deal_date;bill_cycle;".indexOf(colNames[i])>=0 || colRemarks[i].indexOf("账期")>=0) && j==4) {
                	checked = "selected"; 
                }
            	nextCol="";
            	if(list[j].selValue.indexOf("s,")>=0){
            		nextCol=",传递"+list[j].colNames;
            	}
            	optHtml+='<option title="' + list[j].selText + nextCol + '" value="'+list[j].selValue+'" '+checked+'>'+list[j].selText+'</option>';
            }  
            whereInfoHtml+='<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;"><select name="whereInfo_' + tab + '" id="whereInfo_' + tab + '_'+i+'" style="width:115px;" onchange="changeWhereInfo(\''+tab+'_'+i+'\')">'+optHtml+' </select>'+
            			   ' <input type="checkbox" name="isMoreWhere_' + tab + '" id="isMoreWhere_' + tab + '_'+i+'" title="可多选,' + colNames[i] +'" style="display:none;"/></div>';
             
            checked = "";
            if(colNames[i]!="in_user_id" && colNames[i]!="in_id"){//其他字段都选中 "in_user_id;in_id".indexOf(colNames[i]) == -1
            	checked = "checked";
            }
            showIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="showIndex_' + tab + '" id="showIndex_' + tab + '_'+i+'" type="checkbox" value="' + i + '" ' + checked + '/></div>';
             
            checked = "";
            if(i<2){//默认选择前2个字段
            	checked = "checked";
            }
            orderIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="orderIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
           
            checked = "";
            groupIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="groupIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
            
            var optHtml='<div><input type="button" value="确定" class="b_foot" onclick="getDataFormat(\'' + tab + '_'+i +'\')"> <input type="button" value="关闭" class="b_foot" onclick="hidePop2(\''+tab + '_'+i+'\')"></div>',selText="",selVal="";    
            for (var j = 0; j < list2.length; j++) { 
                checked="";
                selText="无"; 
                selVal="0"; 
            	optHtml+='<div id="dataFormat_' + tab + '_'+i+'" style="font-size:13px;padding-top:2px;padding-left:2px;"><input type="checkbox" value="' + list2[j].selValue + '" ' + checked + ' style="margin-right:2px;"/>' + list2[j].selText + '</div>';	
            }          
            dataFormatHtml+='<div class="cols"><input id="dataFormat1_' + tab + '_'+i + '" title="' + colNames[i]+','+selText +'" value="'+selText+'" selVal="'+selVal+'" onclick="showPop2(\''+tab + '_'+i+'\')" type="text"  style="width:80px;"/> <span id="dataFormat2_' + tab + '_'+i + '" class="showDataPop21"> '+optHtml+' </span></div>';   
           
            checked = "";
            if(colNames[i]!="in_time" && colNames[i]!=="in_user_name" && colNames[i]!="in_user_id" && colNames[i]!="in_id"){ //"in_time;in_user_name;in_user_id;in_id".indexOf(colNames[i]) == -1 要严格匹配，否则导入user_name字段不会默认选中
            	checked = "checked";
            }
            importIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="importIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
          
            checked = ""; 
            onlyIndexHtml += '<div class="cols" title="' + colNames[i] + '"><input name="onlyIndex_' + tab + '" type="checkbox" value="' + i + '" ' + checked + '/></div>';
          
            var optHtml=""; 
            for (var j = 0; j < opt_text.length; j++) {
                checked="";
                if (colTypes[i].indexOf("number")>=0 && colTypes[i].indexOf(",")>=0 && j==3 && colNames[i]!='in_id') { //实数
                	checked = "selected"; 
                }else if (colTypes[i].indexOf("number")>=0 && j==2 && colNames[i]!='in_id') {
                	checked = "selected"; 
                }
             	optHtml+='<option title="'+opt_text[j]+'" value="'+j+'" '+checked+'>'+opt_text[j]+'</option>';
            }  
            checkIndexHtml+='<div class="cols" title="' + colNames[i] + '"><select name="checkIndex_' + tab + '" style="width:95px;">'+optHtml+' </select></div>';
			 
            var optHtml="";   
            for (var j = 0; j < list2.length; j++) { 
                checked="";
            	if (j==0 || (("timest;acct_period;deal_date;bill_cycle".indexOf(colNames[i])>=0 || colRemarks[i].indexOf("账期")>=0) && j==5)) {
                	checked = "selected"; 
                }
            	nextCol="";
            	if(list2[j].selValue.indexOf("s,")>=0){
            		nextCol=",更新"+list2[j].colNames;
            	}else if(j==1 || j==2){ //增加title提示
            		nextCol=list2[j].colNames;
            	}
            	optHtml+='<option title="' + list2[j].selText + nextCol + '" value="'+list2[j].selValue+'" '+checked+'>'+list2[j].selText+'</option>';
            }
            editInfoHtml+='<div class="cols" title="' + colNames[i] + '"><select name="editInfo_' + tab + '" style="width:115px;">'+optHtml+' </select></div>'; 
            operateDataHtml+='<option  title="指定归属地字段" value="1;'+colNames[i]+'" >'+colNames[i]+'</option>';               
            tripIndexHtml += '<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;"><select name="tripIndex_' + tab + '" id="tripIndex_' + tab + '_'+i+'" style="width:115px;" onfocus="initTripOption(\''+tab+'\',this);">'+tripOption+'  </select></div>';
            funcIndexHtml += '<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;"><select name="funcIndex_' + tab + '" id="funcIndex_' + tab + '_'+i+'" style="width:60px;"><option title="" value="0" >SUM</option><option title="" value="-1" >无</option></select></div>';
            datafuncIndexHtml+='<div class="cols" title="' + colNames[i] +'" style="white-space:nowrap;style="display:none;""><select name="datafuncIndex_' + tab + '" id="datafuncIndex_' + tab + '_'+i+'" style="width:115px;"><option title="" value="0" >千分位+2位小数位</option><option title="" value="1" >千分位</option><option title="" value="-1" >无</option></select></div>';
            tripDownHtml+='<div class="cols"><input name="tripDown_' + tab + '" size="12" type="text" value=""/></div>';
        }
        $("#colName_" + tab).html(colNameHtml);
        $("#colType_" + tab).html(colTypeHtml);
        $("#colRemark_" + tab).html(colRemarkHtml);
        $("#condName_" + tab).html(condNameHtml);//显示条件名称
        $("#pageTitle_" + tab).html(pageTitleHtml);
        $("#whereInfo_" + tab).html(whereInfoHtml); 
        $("#showIndex_" + tab).html(showIndexHtml); 
        $("#orderIndex_" + tab).html(orderIndexHtml);
        $("#groupIndex_" + tab).html(groupIndexHtml);
        $("#dataFormat_" + tab).html(dataFormatHtml);
        $("#importIndex_" + tab).html(importIndexHtml);
        $("#onlyIndex_" + tab).html(onlyIndexHtml);
        $("#checkIndex_" + tab).html(checkIndexHtml); 
        $("#editInfo_" + tab).html(editInfoHtml);
        $("#tripIndex_" + tab).html(tripIndexHtml);
        $("#funcIndex_" + tab).html(funcIndexHtml);
        $("#datafuncIndex_" + tab).html(datafuncIndexHtml);       
        $("#operateData_" + tab).html(operateDataHtml);
        $("#tripDown_" + tab).html(tripDownHtml);
      
}
//重新排序字段
function initTripOption(tab,obj){
	var optionHtml = "<option title='' value='-1' >无</option>"
    $('#colName_'+tab+' div input').each(function(j,item) { 
        if ($(this).css("display").indexOf('inline') >= 0) {
        	optionHtml += '<option title="" value="'+j+'" >'+$(this).val()+'</option>';
        }
    }); 
    $(obj).empty().append(optionHtml);
}
//得到验证表单并获取表单数据 
function getFormData(tab, flag) {
	var reportName=$("#reportName").val();
	var owner=$("#owner_" + tab).val();
    var tableName=$("#tableName_" + tab).val(); 
    var tableName2=tableName;
    var tableType="table";
    if(tableName.indexOf("视图")>0){
    	tableType="view";
    }
    tableName=owner+"."+tableName.substring(0,tableName.indexOf(" "));  
    var isAddCol=$("#isAddCol_" + tab).val(); //是否追加字段

    //标题
    var pageTitle = "",isMoreHead = -1,tripDown=""; 
    if($("#isMoreHead_" + tab).attr("checked")) {
        isMoreHead = 1; //选中
        pageTitle=$('#pageTitle_' + tab+' textarea').val();
    }else{
	    $('#pageTitle_' + tab + ' div input').each(function() { 
	        if ($(this).css("display").indexOf('inline') >= 0) {
	            pageTitle += $(this).val() + ";"; 
	        }
	    }); 
	    pageTitle = pageTitle.substr(0, pageTitle.length - 1); 
    }
    
    //存表字段  begin
    var colName = "";
    $('#colName_' + tab + ' div input').each(function() { 
        if ($(this).css("display").indexOf('inline') >= 0) {
        	colName += $(this).val() + ";"; 
        }
    }); 
    colName = colName.substr(0, colName.length - 1);    
    //存表字段  end
    
    $('#tripDown_' + tab + ' div input').each(function() { 
        if ($(this).css("display").indexOf('inline') >= 0) {
        	tripDown += $(this).val() + ";"; 
        }
    }); 
    tripDown = tripDown.substr(0, tripDown.length - 1);
    //函数 begin
    var funcIndex = "";
    $('#funcIndex_' + tab + ' div select').each(function() { 
        if ($(this).css("display").indexOf('inline') >= 0) {
        	funcIndex += $(this).val() + ";"; 
        }
    }); 
    funcIndex = funcIndex.substr(0, funcIndex.length - 1);    
    //函数end
    //千分位处理
    var datafuncIndex="";
    $('#datafuncIndex_' + tab + ' div select').each(function() { 
        if ($(this).css("display").indexOf('inline') >= 0) {
        	datafuncIndex += $(this).val() + ";"; 
        }
    }); 
    datafuncIndex = datafuncIndex.substr(0, datafuncIndex.length - 1);  
  //千分位处理
    var idNames = "showIndex,orderIndex,groupIndex,importIndex,onlyIndex"; 
    idNames = idNames.split(",");
    var idNames2 = ['', '', '', '', '', '', '', '', '']; 
    for (var i = 0; i < idNames.length; i++) {
        $('#' + idNames[i] + '_' + tab + ' [name=' + idNames[i] + '_' + tab + ']:checkbox:checked').each(function() {
            if ($(this).css("display").indexOf('inline') >= 0) {
                idNames2[i] += $(this).val() + ";";
            }
        });
        idNames2[i] = idNames2[i].substr(0, idNames2[i].length - 1);
    } 
    var showIndex = idNames2[0];
    var orderIndex = idNames2[1]; 
    var groupIndex = idNames2[2]; 
    var importIndex = idNames2[3]; 
    var onlyIndex = idNames2[4];
    var dataFormat = "";
    $("#dataFormat_" + tab + " input[id^='dataFormat1_']").each(function() { // [name=dataFormat1_' + tab + ']
        if ($(this).css("display").indexOf('inline') >= 0) {
        	dataFormat += $(this).attr("selVal") + ";"; 
        }
    });
    dataFormat = dataFormat.substr(0, dataFormat.length - 1); 
    
    var checkIndex = "";
    $('#checkIndex_' + tab + ' div select').each(function() { 
        if ($(this).css("display").indexOf('inline') >= 0) {
            checkIndex += $(this).val() + ";"; 
        }
    });
    checkIndex = checkIndex.substr(0, checkIndex.length - 1);
    
    var whereInfo = "",i=0;
    $('#whereInfo_' + tab + ' div select').each(function() { 
        if ($(this).css("display").indexOf('inline') >= 0) {
        	if($(this).val()=='c2' || $(this).val().indexOf("c3,")>=0 || $(this).val().indexOf("s,")>=0){ //智能匹配需要保存对应的字段名
        		whereInfo += $(this).val(); 
        		var j=0;
        		$('#colName_' + tab + ' div input').each(function() { 
        	        if ($(this).css("display").indexOf('inline') >= 0 && i==j) {
        	        	whereInfo += ","+$(this).val();
        	        }
        	        j++;
        	    }); 
        	}else{
        		whereInfo += $(this).val() ;
        	}
        	//加上条件显示名称
    		var m=0;
    		$('#condName_' + tab + ' div input').each(function() { 
    	        if ($(this).val()!=""&& i==m) {//如果显示名称不为空
    	        	whereInfo += ","+$(this).val() + ";"; 
    	        }else if($(this).val()==""&&i==m){//如果名称为空加上分号
    	        	whereInfo+=",;";
    	        }
    	        m++;
    	    }); 
        	i++;
        }
    });
    whereInfo = whereInfo.substr(0, whereInfo.length - 1); 
    //下钻参数
    var tripInfo = "";
    $('#tripIndex_' + tab +' div select').each(function(){
    	tripInfo += $(this).val() + ";";
    });
    tripInfo = tripInfo.substr(0,tripInfo.length-1);
    var isMoreWhere="";
    $('#whereInfo_' + tab + ' [name=isMoreWhere_' + tab + ']:checkbox').each(function() {//:checked
    	if($(this).attr("checked")){
    		isMoreWhere += "1;";
    	}else{
    		isMoreWhere += "0;";
    	}  
    });
    isMoreWhere = isMoreWhere.substr(0, isMoreWhere.length - 1); 
    var editInfo = "";
    $('#editInfo_' + tab + ' div select').each(function() { 
        if ($(this).css("display").indexOf('inline') >= 0) {
            editInfo += $(this).val() + ";"; 
        }
    });
    editInfo = editInfo.substr(0, editInfo.length - 1);
  	var operateType="";
  	$("#operateType_" + tab+" [name=operateType]:checkbox").each(function() { 
        if ($(this).attr("checked")) {
            operateType += $(this).val() + ";"; 
        } 
    });
    operateType = operateType.substr(0, operateType.length - 1); 
    var operateData=$("#operateData_" + tab).val();  
    var isUpdate=$("#isUpdate_" + tab).val();
  	var reportPath="",reportPathName="",i=0;
  	reportPath=$('#reportPath').val();
    var type = request.getParameter("op"); 
    var reportExplain=$("#reportExplain").val();
	var data1 = "&reportName=" + reportName +"&reportPath=" + reportPath + "&tableType=" + tableType + "&tableName=" + tableName + "&isAddCol=" + isAddCol + "&pageTitle=" + pageTitle +"&isMoreHead=" + isMoreHead + "&showIndex=" + showIndex  + "&orderIndex=" + orderIndex + "&groupIndex=" + groupIndex + "&dataFormat=" + dataFormat +"&importIndex=" +importIndex + "&onlyIndex=" +onlyIndex +
				"&checkIndex=" +checkIndex +"&whereInfo=" + whereInfo + "&isMoreWhere=" + isMoreWhere + "&editInfo=" + editInfo + "&operateType=" + operateType + "&operateData=" + operateData + "&isUpdate=" + isUpdate + "&reportExplain=" + reportExplain + "&tripInfo="+tripInfo+ "&colName="+colName+"&funcIndex="+funcIndex+"&datafuncIndex="+datafuncIndex+"&tripDown="+tripDown ;
	data1 = data1.replaceAll("%", "##"); 
	var tabNow = $("#tabNow").val();
	if (flag == 'save') { 
        tabNow= tab;
    } 
 	
    //验证表单  
    var isTestSql = $("#isTestSql_" + tab).val();  
    if (reportName == "") {
        $("#alertWord_" + tabNow).html("请输入报表名称!").show(); 
        return "0";
    } else if (owner == "") {
        $("#alertWord_" + tabNow).html("请选择数据库用户").show();
        return "0";
    }  else if (tableName2 == "") {
        $("#alertWord_" + tabNow).html("请选择数据表或视图").show();
        return "0";
    } else if (isTestSql == 0) {
        $("#alertWord_" + tabNow).html("表不存在,请仔细检查!").show();
        return "0";
    } else if (pageTitle.indexOf(";;") >= 0 || pageTitle.substr(pageTitle.length - 1, 1) == ';') { //若有1个字段名没有输入    
        $("#alertWord_" + tabNow).html("请输入页面标题!").show();
        return "0";
    } else if (showIndex == "") { 
        $("#alertWord_" + tabNow).html("请选择页面显示字段!").show();
        return "0";
    } else if (tableType=='table' && importIndex == "") { 
    }  
    return data1;
}

//保存"单个"tab页
function saveConfig(tab,type) {
	var rName=$("#reportName").val();
	if(type!="view"){//不是预览才要验证
		if(rName==""||rName=="请输入名称"){
			alert("请填写报表名称");
			$("#reportName").focus();
			return false;
		}
	}
    var tabNow = $("#tabNow").val();  
    var action = rootPath+"/page/reportConfig!saveConfig.action"; 
    var data1 = getFormData(tab, 'save'); //验证表单并获取表单数据 
    var tabNow = $("#tabNow").val();
    if (data1 == "0") { 
        $("#loading_" + tabNow).hide();
        return false; //验证失败
    }
    if(type=='save'){
    	$("#loadWord2").html("正在保存,请稍后...").show(); 
    }else if(type=='view'){ 
    	$("#loadWord2").html("正在预览中...").show();  
    }    
    $("#loading2").show();
    var groupNo = $("#groupNo").val();
    var levelsMax = $("#levels").val();
    var beginRow = $("#beginRow_" + tab).val();
    var reportID=$("#reportID").val();
    var data1 = "loginno="+loginno+"&reportID="+reportID+"&groupNo=" + groupNo + "&levels=" + tab + "&levelsMax=" + levelsMax + "&beginRow=" + beginRow + "&type=" + type + data1;
    $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {
            var flag = response.page.flag;
            var reportID = response.page.excel.reportID;
            var groupNo = response.page.excel.groupNo;
            var reportName = response.page.excel.reportName;
            if(type=='save'){
            	if (flag == 1) {
                    $("#alertWord2").html("保存成功！").show().fadeOut(5000); 
                } else {
                    $("#alertWord2").html("保存失败,请与管理员联系！").show();
                }
            	$("#reportID").val(reportID);
            	$("#groupNo").val(groupNo);
            }else if(type=='view'){
            	$("#viewReportID").attr("src",rootPath+"/page/jsp/report.jsp?loginno="+loginno+"groupNo="+groupNo+"&reportID="+reportID).show(); 
            }
            $("#loading2").hide();
        }
    });
}

//保存"全部" 
function saveConfigAll() {
    var levels = $("#levels").val();
    var levelsLast = $("#levelsLast").val();
    var datas = "",
    data1 = "",
    validateOk = 1;
    for (var i = 0; i < levels; i++) {
        var data1 = getFormData(i, 'save'); 
        if (data1 == "0") {
            changeTab(i);
            validateOk = 0;
            break;
        }
    }
    if (validateOk == 1) { 
        for (var i = 0; i < levels; i++) {
            saveConfig(i,'save');
        }
    } else {
        $("#alertWord_" + tabNow).show();
    }
}

//切换tab 
function changeTab(tab) {
    var tabNow = $("#tabNow").val(); 
    var levels = $("#levels").val();
    levels = parseInt(levels);
    for (var j = 0; j <= levels; j++) {
        if (tab == j) {
            $("#levels_" + j).css("color", "red"); //点击当前Tab红色显示
            $("#tabPage_" + j).show(); 
        } else {
            $("#levels_" + j).css("color", "#366fa9");
            $("#tabPage_" + j).hide(); 
        } 
    }   
    $("#tabNow").val(tab);
}

//修改levels级数 
function updateLevels() { 
    $("#alertWord_" + tabNow).hide();
    var levels = $("#levels").val();
    var levelsLast = $("#levelsLast").val(); //提示信息使用
    var levelsMax = $("#levelsMax").val(); //是否新增  
    //新增或删除tab   
    $("#levelsPop").html("");
    levels = parseInt(levels);  
    levelsLast = parseInt(levelsLast);
    levelsMax = parseInt(levelsMax);
    if (levels == levelsMax) {  
        initTabAndPage(levelsMax, levels); 
    } else if (levels <= levelsLast) {  
        var del = "由" + levelsLast + "级修改成" + levels + "，修改后将删除";
        for (var i = levels; i < levelsLast; i++) {
            del += '报表' + (i + 1) + ',';
        }
        del = del.substr(0, del.length - 1) + "，\n您确定是否删除？";
        if (levels != levelsLast && window.confirm(del)) { 
            initTabAndPage(levelsMax, levels); 
        } else {
        	$('#levels option').each(function() { 
	            if (levelsLast == $(this).val()) {
	                $(this).attr("selected", "true");
	            }
	        });
            return false; 
        }
    } else if (levels > levelsMax) {  
        initTabAndPage(levelsMax, levels); 
        $("#levelsMax").val(levels); 
    }
    $("#levelsLast").val(levels);
    return true; 
}
 
//预览
function viewConfig() { 
	saveConfig(0,'view');
}

//查找表信息列表
function findImportExcel() {
    document.title = "增加"; 
    $.ajax({
        type: "post",
        url: rootPath+"/page/reportConfig!findImportExcel.action",
        dataType: "json",
        success: function(response) {  
    		var list = response.page.list; 
    		var temp = $("#temp_dataList").html();  
    		var html = ""; 
    		for ( var i = 0; i < list.length; i++) { 
    			html += repTemp(list[i], temp);  
    		} 
    		$("#dataList").html(html).show();//输出数据      
        }
    });
}

//查询表用户
function findOwner(i){ 
   var owner=$("#owner_"+i).val();
   var tableType=$("#tableType_"+i).val();
   var tableName=$("#tableName_"+i).val();  
   var data1="owner="+owner+"&tableType="+tableType+"&tableName="+tableName;   
   var action = rootPath+"/page/reportConfig!findDBInfo.action";   
   $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {  
	   	   var tableName2=$("#tableName2_"+i).val();
	   	   var owner2="",select="";
	   	   if(tableName2!=""){
	   		   owner2=tableName2.substring(0,tableName2.indexOf("."));
		   	   tableName2=tableName2.substring(tableName2.indexOf(".")+1,tableName2.length);
	   	   } 
	       var list = response.page.list; //数据库用户
	       var list2 = response.page.list2; //数据表或视图名称
           var html='<option value="" title="请选择">-请选择-</option>'; 
           if(list!=null){
        	   for (var j = 0; j < list.length; j++) { 
	               var data = (list[j] + "").split(","); 
	               select="";
	               if(owner2==list[j].owner){
	            	   select="selected";
	               }
	               html+='<option value="'+list[j].owner+'" title="'+list[j].owner+'" '+select+'>'+list[j].owner+'</option>';  
	           }
	           $("#owner_"+i).html(html);
           }
           findAllTableName(i,0); //级联查询 
	   }
	});
}
//单层下拉框查询数据
function findAllTableName(i,isLike){ 
   var owner=$("#owner_"+i).val();
   if(owner!=""){
	   $("#loadWord_" + i).html("正在查询数据表或视图");
	   $("#loading_" + i).show();
   }  
   var tableType=$("#tableType_"+i).val();
   var tableName=$("#tableName_"+i).val(); 
   if(isLike==1 && tableName.indexOf(" ")>=0){
	   tableName=tableName.substring(0,tableName.indexOf(" "));
   }
   var data1="owner="+owner+"&tableType="+tableType+"&tableName="+tableName+"&isLike="+isLike;   
   var action = rootPath+"/page/reportConfig!findDBInfo.action";   
   $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) { 
	       $("#loading_" + i).hide(); 
	   	   var tableName=$("#tableName_"+i).val();
		   	if(tableName.indexOf("视图")>0){ 
				$("#isAddCol_"+i).hide();     
			}else if(tableName.indexOf("表")>0){ 
				$("#isAddCol_"+i).show();    
			}  
	       var list2 = response.page.list2,bgColor=""; //数据表或视图名称  
           if(list2!=null){
        	   var html='<div style="padding-left:265px;"><img src="../images/del3.png" onclick="hidePop('+i+')" style="cursor:pointer;" title="关闭"/></div>';//'<option value="" title="请选择">-请选择-</option>'; 
	           for (var j = 0; j < list2.length; j++) { 
	               var data = (list2[j] + "").split(","); 
	               bgColor="#FFFFFF";
	               var tableName2=list2[j].tableName;
	               tableName2=tableName2.substring(0,tableName2.indexOf("]")+1); 	              
	               if(tableName2==tableName){
	            	   bgColor="#3399ff";  
	               }
	               list2[j].tableName=list2[j].tableName.replaceAll("/r", "");//删除换行;
	               var tableName3=list2[j].tableName;  
	               if(tableName3.length>55){//防止备注信息太长
	            	   tableName3=list2[j].tableName.substr(0,55)+"...";
	               }
	               html+='<div id="sel_'+i+'_'+j+'" i="'+i+'" selText="'+tableName3+'" selValue="'+list2[j].tableName+'" title="'+list2[j].tableName+'" onclick="getTableName(\'sel_'+i+'_'+j+'\',\'-1\')" onmouseover="changeBgColor('+i+','+j+',\'over\')" onmouseout="changeBgColor('+i+','+j+',\'out\')" class="popDistinct" style="word-break:break-all;word-wrap:break-word;font-size:13px;color:#656565;cursor:pointer;background-color:'+bgColor+'">'+tableName3+'</div>';
	           }
	           $("#showPop_"+i).html(html);
	           isTableCheck(i,tableName);
           }
	   }
	});
}
//是否是表
function isTableCheck(i,tableName) {  
	if(tableName==undefined){
		tableName=$("#tableName_"+i).val(); //下拉框获取
		$("#isMoreHead_" + i).attr("checked",false);//取消多选 
		isMoreHead(i);
	}    
	if(tableName.indexOf("视图")>0){ 
		$("#isAddCol_"+i).hide();     
	}else if(tableName.indexOf("表")>0){ 
		$("#isAddCol_"+i).show();    
	}  
	var isAddCol=$("#isAddCol_"+i).val(),operateData=-1;
	if(isAddCol==1){
		$("#operateType_" + i+" [name=operateType]:checkbox").attr("checked",true);//默认选中导入和增删改查功能		
	}else{
		$("#operateType_" + i+" [name=operateType]:checkbox").attr("checked",false); //取消选中导入和增删改查功能		 
	}
	
	if(tableName.indexOf("表")>0 && isAddCol==1){
		operateData=0;
	}
	
	$("#operateData_" + i+" option").each(function() { //只有是表，且类型是"导入",才选中本人导入，否则所有用户
        if ($(this).val()==operateData) { //所有用户
            $(this).attr("selected",true); 
        }  
    });  
	isShowCfg(i,isAddCol);  
}
//是否展示这些
function isShowCfg(i,flag) { 
	var cfgCol="importIndex;onlyIndex;checkIndex;editInfo;operateType2;operateType;";
	cfgCol=cfgCol.split(";");
	for (var j = 0; j < cfgCol.length; j++) {
		if(flag==1){//true
			$("#"+cfgCol[j]+"_"+i).show();
			$("."+cfgCol[j]+"_"+i).show();
			$("#modelExcel1").show();
			$("#tabPageHtmls").css("width","1300px");
		}else{
			$("#"+cfgCol[j]+"_"+i).hide();
			$("."+cfgCol[j]+"_"+i).hide();
			$("#modelExcel1").hide();
			$("#tabPageHtmls").css("width","100%");
		} 
	} 
}
//多行表头
function isMoreHead(tab) {
  var isChecked=$("#isMoreHead_"+tab).attr("checked");
  if(isChecked){//已经选中，变单行   
     $("#pageTitlesHtml").val($("#pageTitle_" + tab).html());//暂存
     var str=$("#pageTitlesHtml2").val();
     str=str.replaceAll(";",","); 
     if(str.toLowerCase().indexOf("<textarea")==-1){
    	 str='<textarea name="pageTitle" style="font-size:13px;" cols="12" rows="12"></textarea>';
     } 
     $("#pageTitle_" + tab).html(str);
     $("input[name='whereTitle_" + tab+"']").show(); 
  }else{  
     $("#pageTitlesHtml2").val($("#pageTitle_" + tab).html()); 
     var html=$("#pageTitlesHtml").val();
     $("#pageTitle_" + tab).html(html); 
     $("input[name='whereTitle_" + tab+"']").hide();
  }
}
function changeWhereInfo(id) {
	var whereInfo=$("#whereInfo_"+id).val();
	var whereInfo2=$("#whereInfo_"+id).find(":selected").text(); 
	if(whereInfo.indexOf("yyyy")==-1 && whereInfo!=0){
		$("#isMoreWhere_"+id).show();
		$("#isMoreWhere_"+id).attr("checked",true);
	}else{
		$("#isMoreWhere_"+id).hide();
		$("#isMoreWhere_"+id).attr("checked",false);
	}
	if(whereInfo2.indexOf("[权限]")>=0){
		$("#isMoreWhere_"+id).attr("checked",true);
		if(whereInfo2.indexOf("ID[权限]")>=0 || whereInfo2.indexOf("编码[权限]")>=0){//地区ID[权限]
			$("#showIndex_"+id).attr("checked",false);//不显示
		}else{//地区名称[权限]
			$("#showIndex_"+id).attr("checked",true);//显示
		}	 
	} 
}
//过滤数据
function filterData(treeId, parentNode, data) {
	var childNodes = data.page.list;
	$.each(childNodes,function(i,item){
		if(parentNode.level<=5){
			item.isParent=true;
		}else{
			item.isParent=false;
			}
	});			
	return childNodes;
}
//展示
function showMenu(object) {
	var cityOffset = $(object).offset();
	$("#menuContent").css({left:(cityOffset.left) + "px", top:cityOffset.top + $(object).outerHeight() + "px"}).slideDown("fast");
	initList();
	$("body").bind("mousedown", onBodyDown);
}
//选择树复选框
function checkMenu(e, treeId, treeNode){
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = zTree.getCheckedNodes(true);
	if(nodes.length==0){
		$("#reportPath").val("");
		$("#menuId").val("");
	}
	for (var i=0;i<nodes.length;i++) {
		if(nodes[i]!=treeNode){//不是当前点击的节点取消选择
			zTree.checkNode(nodes[i],false,false);
		}else{
			$("#reportPath").val(treeNode.id+";"+treeNode.name);
			$("#menuId").val(treeNode.name);
		}
	}
}
//隐藏
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
//点击其他地方隐藏
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
//展示菜单树
function initList(){
	$.ajax({ 
        type: "POST", 
        url: rootPath+"/page/reportConfig!initAddExcel.action",
        dataType: "json",
        async: false,
		data:{
		},
		beforeSend:function(){
		},
		complete:function(XMLHttpRequest,textStatus){
      },error:function(res){
    	 alert("网络出错！");  
		},
      success: function (result) {
    	  var excel= result.page.excel;
          $("#groupNo").val(excel.groupNo); 
			var zNodes=result.page.list;
			$.each(zNodes,function(i,item){
	   			item.isParent=true;
	   			if(item.pid==""||item.pid==113){
		   			item.nocheck=true;
	   			}
	   		});	
		   	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		   	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		   	 zTree.expandAll(true);
		   	var menu=$("#reportPath").val();
		   	if(menu!=undefined&&menu!=""){
		   		var id=menu.split(";")[0];
		   		var treeNode = zTree.getNodeByParam("id",id, null);
		   		zTree.checkNode(treeNode,true,true);
		   	}
		}
	});
}

//点击某个选项
function getTableName(id) {//i,selText,selValue 
	var i=$("#"+id).attr("i");
	var selText=$("#"+id).attr("selText");//地市名称,显示值
	var selValue=$("#"+id).attr("selValue");//地市id或地市名称,传递值
	selValue=selValue.substring(0,selValue.lastIndexOf("]")+1);
	$("#tableName_"+i).val(selValue);
	$("#showPop_"+i).hide();	
	isTableCheck(i);
}

function showPop(i) {
	$("#showPop_"+i).show();	
	var tableName=$("#tableName_"+i).val();  
	$("#showPop_"+i+" .popDistinct").each(function() { 
		var tableName2=$(this).html();
        tableName2=tableName2.substring(0,tableName2.indexOf("]")+1); 	  
       if(tableName2==tableName){ 
           $(this).css("background-color","#3399ff"); 
       }else{
          $(this).css("background-color","#FFFFFF");
       }  
    }); 
}

function hidePop(i) {
	$("#showPop_"+i).hide();	 
}


function showPop2(id) { 
	$(".showDataPop21").hide();
	$("#dataFormat2_"+id).show();	
}

function hidePop2(id) {
	$("#dataFormat2_"+id).hide();	 
}


function getDataFormat(id){
	var text="",value=""; 
	$("#dataFormat_"+id+" input").each(function() {  
		if($(this).attr("checked")){
			text+=$(this).parent().text()+",";
			value+=$(this).val()+",";
		} 
	}); 
	if(text!=""){
		text=text.substring(0, text.length-1);
		value=value.substring(0, value.length-1);
	}
	$("#dataFormat1_"+id).val(text);
	$("#dataFormat1_"+id).attr("selVal",value);
	$("#dataFormat1_"+id).attr("title",text);
	$("#dataFormat2_"+id).hide(); 
}	


//模拟下拉框，鼠标移动，取消下拉选项以前选中的背景色 
var isMouseMove=0;
function changeBgColor(i,j,flag) {
	var j2=0; 
	$("#showPop_"+i+" .popDistinct").each(function() { 
       if(j==j2 && flag=='over'){ 
           $(this).css("background-color","#3399ff");
       }else{
          $(this).css("background-color","#FFFFFF");
       }
       j2++;  
    }); 
}

////////////js工具类函数/////////// 
function repTemp(obj, template) { 
    if (template != null) {
        template = template.replace(new RegExp("%7B", 'g'), "{").replace(new RegExp("%7D", 'g'), "}"); //火狐中转换"{"和"}"
        for (var i in obj) {
            if (i != undefined && i != "") {
                template = template.replace(new RegExp("\\{\\$" + i + "}", 'g'), obj[i]);
            }
        }
    }
    return template;
}

String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

//URL处理, 获取URL中的参数 
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

//全选和反选按钮
function dataALL(name,tab) { //修改通用  
    var checkeds = $('#'+name+'All_'+tab ).attr("checked"); 
    $('#' + name + '_' + tab + ' div input').each(function() { 
    	$(this).attr("checked", checkeds); 
    });
}

//获取选中复选框的值
function getCheckVal(tab, name, type) {
    var val = "", sonNode = "";
    if (type == 'input') { //文本框
        sonNode = ' div input';
    } else { //复选框
        sonNode = ' [name=' + name + '_' + tab + ']:checkbox:checked';
    }
    $('#' + name + '_' + tab + sonNode).each(function() {
        if ($(this).css("display").indexOf('inline') >= 0) {
            val += $(this).val() + ",";
        }
    });
    val = val.substr(0, val.length - 1);
    return val;
}
 function isNotBlank(obj){
	 return !(obj==undefined||obj==null||obj==""||obj=="undefined");
 }