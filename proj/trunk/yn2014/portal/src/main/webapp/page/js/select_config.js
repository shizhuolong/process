var request=new JSRequest();
$(document).ready(function() { 
    initPage(); 
});

//初始化
function initPage() {
    var type = request.getParameter("op"); 
    if (type == 'add') {
        initAddSelect();
    } else if (type == 'update' || type == 'view') { 
        initUpdateSelect(type); 
    } else {
        $("#loading").hide();
        $("#alertWord").html("请先登录!").show(); 
    }
}
 
//新增初始化数据 
function initAddSelect() {
    document.title = "查询条件码表配置-增加";
    var levels = $("#levels").val();
    var data1 = "levels=" + levels;
    $.ajax({
        type: "post",
        url: rootPath+"/page/selectConfig!initAddSelect.action",
        data: data1,
        dataType: "json",
        success: function(response) {
            var s = response.page.select;
            $("#selID").val(s.selID);  
            //输出模板
            var html = "";
            for (var i = 0; i < 10; i++) {
               html+='<tr id="tabPage_'+i+'"></tr>';
            }
            $("#tabPageHtmls").html(html); 
            //初始化tab
            var initLevels=1;
            $("#levels").val(initLevels);
            $("#levelsLast").val(initLevels);
            $("#levelsMax").val(initLevels);
            $("#tabNow").val(0);  
            initTabAndPage(0, initLevels);
            $("#loading").hide();  
        }
    });
}

//新增-初始化tab数据
function initTabAndPage(levls1, levls2) {  
    var html = "";
    for (var i = 0; i < levls2; i++) {
        html += '<a href="javascript:void(0)" id="levels_' + i + '" onclick="changeTab(' + i + ')" style="color:#366fa9">第' + (i + 1) + '级</a>&#12288;';
    }
    $("#levelsTab").html(html);
    $("#leveltd").show();

    //(b)初始化页面
    var tabPageHtml = $("#tabPageHtml").html();  
    var tabNow = $("#tabNow").val(); 
    var obj = new Object();
    for (var tab = levls1; tab < levls2; tab++) { 
        var objStr = "obj.tab='" + tab + "';obj.isTestSql='0'; obj.selSql=''; obj.title='请输入标题'; obj.nameY=''; obj.decimals='2';" + "obj.canvasPadding='15'; obj.width='30%'; obj.height='300px';"; //清除文本框中的模板值,默认值为空
        eval(objStr);
        $("#tabPage_" + tab).html(repTemp(obj, tabPageHtml)).hide();
        $("#isTestSql_" + tab).val(0); 
        outPutRow(3, tab);   
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
    $("#selConfig").show();
    $("#levels_" + tab).css("color", "red"); //点击当前Tab红色显示 
    
    var type = request.getParameter("op"); 
    if(type == 'add'){
        $("#preview").show(); 
        $("#saveConfig").show();
    }   
}

//更新-初始化tab数据
function initUpdateSelect(type) {
    document.title = "查询条件码表配置-更新";
    var tabNow = $("#tabNow").val();
    $("#loadWord_" + tabNow).html("正在初始化页面...");
    $("#loading_" + tabNow).show(); 
    var selID = request.getParameter("selID"); 
    if (selID == null || selID == "") {
        selID = 0;
    }
    if (type == "sqlTmp") {//查找sql模板
    	selID = $("#selID").val();
    }else{
       $("#selID").val(selID); 
    }  
    var data1 = "selID=" + selID; 
    $.ajax({
        type: "post",
        url: rootPath+"/page/selectConfig!initUpdateSelect.action",
        data: data1,
        dataType: "json",
        success: function(response) {  
            var s = response.page.select;
            var list = response.page.list; 
            //初始化tab
            var levels = s.levels;
            levels = parseInt(levels);
            $("#levels").val(levels);
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
                html += '<a href="javascript:void(0)" id="levels_' + i + '" onclick="changeTab(' + i + ')" style="color:#366fa9">第' + (i + 1) + '级</a>&#12288;';
            }
            $("#levelsTab").html(html);
            $("#leveltd").show();
            var tabPageHtml = $("#tabPageHtml").html(); 
            html = "";
            var obj = new Object();
            for (var tab = 0; tab < list.length; tab++) { 
                html = repTemp(list[tab], tabPageHtml); 
                eval("obj.tab='" + tab + "';" + "obj.isTestSql='1';");
                html = repTemp(obj, html);
                $("#tabPage_" + tab).html(html); 
                if (tab != 0) {
                    $("#tabPage_" + tab).hide(); 
                } 
            }  
            $("#levels_0").css("color", "red"); 
            $("#tabPage_0").show(); 
            $("#selConfig").show();  
            if (type == "sqlTmp") {//查找sql模板 
		        $("#selID").val(0);//清除
		    }else{
		    	$("#selID").val(s.selID);
		    } 
            $("#loading_" + tabNow).hide();
            $("#loading").hide();
            initPageData(response);  
            if(type == 'update'){
               $("#preview").show(); 
               $("#saveConfig").show();
            }else if(type == 'view'){
               view();
            }
        }
    });
}

//更新初始化数据:输出并选择相应表单
function initPageData(response) {
    var list = response.page.list; 
    var s = list[0];
    $("#selName").val(s.selName); 
    $("#selExplain").val(s.selExplain); 
    var obj = new Object();
    for (var tab = 0; tab < list.length; tab++) {
        var s = list[tab]; 
        var colNames = s.colNames;
        //(a)初始化sql,输出表单  
        colNames = colNames.split(";");  
        var colNum = colNames.length; //字段个数  
        var colTitlesHtml = "", selValueHtml = "", selTextHtml = "", nextIDHtml = "", optionHtml="", checked = ""; 
        for (var i = 0; i < colNum; i++) { 
            optionHtml+="<option value='"+i+"'>"+colNames[i]+"</option>"; 
        } 
        $("#selText_" + tab).html(optionHtml);
        $("#selValue_" + tab).html(optionHtml); 
        var selects="selType="+s.selType+";selValue="+s.selValue+";selText="+s.selText+";nextID="+s.nextID+";dataLevel="+s.dataLevel+
        	";isMore="+s.isMore+";isFuzzyQuery="+s.isFuzzyQuery+";useType="+s.useType;  
        selects=selects.split(";");
        var tmp="";
        for (var i = 0; i < selects.length; i++) { 
           tmp=selects[i].split("=");
           var str='_' + tab;
           if(i>4){ str=""; }//后面3个id没有tab下标
           $('#'+tmp[0]+str + ' option').each(function() {
	            if (tmp[1] == $(this).val()) {
	                $(this).attr("selected", "true");
	            }
	        });
        } 
    }  
}

//测试SQL
function testSql(tab) {
    var tabNow = $("#tabNow").val();
    $("#alertWord_" + tabNow).hide();
    $("#nextPop_" + tabNow).hide(); //隐藏下钻参数提示信息 
    $("#loadWord_" + tabNow).html("测试Sql中...");
    $("#loading_" + tabNow).show();
    var sql = $("#sql_" + tab).val();
    sql = sql.replace(/%/g, "#");
    var action = $("#action").val();
    var data1 = "sql=" + sql;
    $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {
            $("#loading_" + tabNow).hide();
            var flag = response.page.flag; //测试SQL是否成功,0表示失败,1表示成功 
            var errorMsg = response.page.errorMsg;
            if (flag == 0) {
                $("#sql_" + tab).css("bordercolor", "red");
                $("#alertWord_" + tabNow).html("SQL语法错误: " + errorMsg).show();
                $("#isTestSql_" + tab).val(0);
            } else {
                var color=$("#sql_" + tab).css("borderColor"); 
                if(color=="red"){
                   $("#sql_" + tab).css("borderColor", ""); //绑定编辑框，若修改，则还原颜色
                } 
                $("#alertWord_" + tabNow).html("SQL测试通过！").show().fadeOut(3500);
                $("#isTestSql_" + tab).val(1);
            }
            var page = response.page;
            var colNames = page.colNames;
            colNames = colNames.split(";");
            var optionHtml="";
            for (var i = 0; i < colNames.length; i++) { 
	            optionHtml+="<option value='"+i+"'>"+colNames[i]+"</option>";
	        } 
	        $("#selValue_" + tab).html(optionHtml); 
	        $("#selText_" + tab).html(optionHtml);
	        $("#nextID_" + tab).html(optionHtml); 
        }
    });
}

//测试SQL: 根据sql字段个数生成相应的表单
function outPutRow(page, tab) {
    var colNum = page.colNum; //字段个数 
    var colTitles = "", nextID = "", showIndex = "", axis2 = "", sign = "", fileData = "";
    var dataTitles = page.colNames;
    if(dataTitles==undefined){
      dataTitles="\"\"";
    }
	dataTitles = dataTitles.split(";"); 
    var pageCol = $('[name=colTitle_' + tab + ']').length;  
    var isClear=-1;
    if(colNum==undefined){
      pageCol=0;
      colNum=1;
      isClear=1;
    }
    //增加行,若页面总行数<字段数,则需动态追加行 
    var obj = new Object();
    if (pageCol < colNum) {
        for (var i = pageCol; i < colNum; i++) { 
        	var objStr = "obj.tab='" + tab + "';obj.value='" + dataTitles[i] + "';obj.title='" + dataTitles[i] + "';"; 
            eval(objStr);
            colTitles += repTemp(obj, $(".colTitles_temp").html());
            var objStr = "obj.value='" + i + "';obj.checked='';"; 
            eval(objStr);
            nextID += repTemp(obj, $(".nextID_temp").html());
            showIndex += repTemp(obj, $(".showIndex_temp").html());
            axis2 += repTemp(obj, $(".axis2_temp").html()); 
            eval("obj.value='\"\"';");
            sign += repTemp(obj, $(".sign_temp").html()); 
        }
        if(isClear==1){
            $("#colTitles_" + tab).html("");  
	        $("#nextID_" + tab).html("");  
	        $("#showIndex_" + tab).html("");  
	        $("#axis2_" + tab).html("");  
	        $("#sign_" + tab).html("");  
        }
        $("#colTitles_" + tab).html(colTitles); 
        $("#nextID_" + tab).html(nextID);
        $("#showIndex_" + tab).html(showIndex);
        $("#axis2_" + tab).html(axis2);
        $("#sign_" + tab).html(sign);
    }

    //(b)显示行(行数不够则增加，行数多余隐藏)	 
    var idNames = "colTitles,next,showIndex,axis2,sign,fileData";
    idNames = idNames.split(",");
    for (var i = 0; i < colNum; i++) { 
        for (var j = 0; j < idNames.length; j++) {
            $('#' + idNames[j] + '_' + tab + ' div :eq(' + i + ')').show();
        }
    }
    for (var i = colNum; i < pageCol; i++) { //隐藏多余行
        for (var j = 0; j < idNames.length; j++) {
            $('#' + idNames[j] + '_' + tab + ' div :eq(' + i + ')').hide();
        }
    }
    var colNames = page.colNames, value = "", i = 0;
    if (colNames != undefined) {
        colNames = colNames.split(";");
        $('#colTitles_' + tab + ' div input').each(function() {
            if ($(this).css("display").indexOf('inline') >= 0) {
                value = $(this).val();
                value = value.replaceAll(" ", ""); 
                if (value == "") {
                    $(this).val(colNames[i]);
                }
                i++;
            }
        });
    }
}

//预览查询条件码表: 验证表单并获取表单数据 
function getFormData(tab, flag) { 
    var selName = $("#selName").val();       
    var idNames="selText,selValue,nextID,dataLevel";
    idNames=idNames.split(",");
    var data1="";
    for(var i=0;i<idNames.length;i++){
       data1+="&"+idNames[i]+"="+$("#"+idNames[i]+"_"+tab).val();
    }
    idNames="selName,selType,isMore,isFuzzyQuery,useType,selExplain";
    idNames=idNames.split(","); 
    for(var i=0;i<idNames.length;i++){
       data1+="&"+idNames[i]+"="+$("#"+idNames[i]).val();
    } 
    var colNames="";
    $('#selValue_' + tab + ' option').each(function() {
    	if($(this).text().indexOf("请选择")==-1){
    		colNames += $(this).text()+";";  
    	} 
    });
    colNames=colNames.substr(0,colNames.length-1); 
    data1 += "&colNames=" +colNames;
    data1 = data1.replaceAll("%", "##"); 
    //验证表单  
    var tabNow = tab;// $("#tabNow").val(); 必须tab，否则验证错误，切换tab不能显示错误信息
    var sql = $("#sql_" + tab).val();
    var isTestSql = $("#isTestSql_" + tab).val();  
    if (sql == "" || sql.replace(/(^\s*)|(\s*$)/g, "") == "") { //删除左右两端的空格  
        $("#alertWord_" + tabNow).html("请输入SQL！").show();   
        return "0";
    } else if (isTestSql == 0) { //0表示未通过   
        $("#alertWord_" + tabNow).html('请点击"测试Sql"按钮,必须测试通过才能保存!').show();
        return "0"; 
    }else if (selName == "") {
        $("#alertWord_" + tabNow).html("请输入名称!").show();
        return "0";
    }
    return data1;
} 

//保存"当前"
function saveConfig(tab,type2) { 
    var tabNow = $("#tabNow").val();
    $("#nextPop_" + tabNow).hide();
    $("#showSql_" + tabNow).hide();
    var type = request.getParameter("op");
    var action = rootPath+"/page/selectConfig!saveConfig.action"; 
    var sql = $("#sql_" + tab).val();
    sql = sql.replaceAll("%", "##");     
    var data1 = getFormData(tab, 'save'); //验证表单并获取表单数据
    var tabNow = $("#tabNow").val();  
    if (data1 == "0") {
        return false; //验证失败
    }
    var selID = $("#selID").val();
    var levelsMax = $("#levels").val();
    data1 = "selID=" + selID + "&levels=" + tab + "&levelsMax=" + levelsMax + "&sql=" + sql + data1; 
    $("#loading2").show();
    $("#loadWord2").html("正在保存...").show();
    $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {
            $("#loading2").hide();
    	    $("#loadWord2").hide();
            var flag = response.page.flag; 
            if (flag == 1) {
                $("#alertWord2").html("保存成功！").show().fadeOut(5000); 
                var s=response.page.select; 
                $("#selID").val(s.selID);
                if(type2=='view'){
                	view();
                }
            } else {
                $("#alertWord2").html("保存失败,请与管理员联系！").show();
            }
        }
    });
}

//保存"全部"
function saveConfigAll(type) {
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
            saveConfig(i,type);
        }
    } else {
        $("#alertWord_" + tabNow).show();
    } 
}

//预览
function view(){ 
  var levelsMax=$("#levels").val();
  var isMore=$("#isMore").val(); 
  if(levelsMax==1 && isMore==-1){
	  findSelect();
  }else{
	  var selName=$("#selName").val();
	  $("#selName2").val(selName).show(); 
	  $("#selView").hide();
	  $("#alertWord2").hide();
  }  
}

function findSelect(){
   //分单层和多层.
   $("#loading2").show();
   $("#loadWord2").html("加载数据...").show();    
   var selID=$("#selID").val();   
   var levels=1;
   var levelsMax=$("#levels").val();  
   var nextData="";//nextData可以有多个"字段名1:字段值1;字段名2:字段值2",分号分隔 
   var action = rootPath+"/page/selectConfig!findSelect.action";   
   var data1="selID="+selID+"&levels="+levels+"&nextData="+nextData;
   $("#selView").hide();
   $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {
            $("#loading2").hide();
            $("#loadWord2").hide(); 
            var tab=0;
            var s = response.page.select; 
            var levels = s.levels;
            var selValue = $("#selValue_"+tab).val();//查询条件值字段序号
            var selText = $("#selText_"+tab).val();//查询条件显示值字段序号 
            if(levelsMax==1 && $("#isMore").val()==-1){//(1)单层单选
                var list = response.page.list; //报表信息
	            var html=""; 
	            for (var i = 0; i < list.length; i++) { 
	                var data = (list[i] + "").split(","); 
	                html+='<option value="'+data[selValue]+'">'+data[selText]+'</option>';  
	            } 
	            html="<select id='sel' style='width:130px;'>"+html+"</select>";
	            $("#selView").html(html).show();   
	            $("#selView").removeClass("showDataPop8"); 
            }else{//(2)多选 
                var list = response.page.list; //报表信息
	            var html=""; 
	            for (var i = 0; i < list.length; i++) { 
	                var data = (list[i] + "").split(","); 
                    var style=' data="'+data[selValue]+'" levelMain="'+levels+'" '; //取消浏览器右击弹出菜单 frameID="'+frameID+'" levelMain="'+levelMain+'" oncontextmenu="return false"
                    var sign="|";
                    if(i==list.length-1){//最后一个符号不同
	                   sign='<span style="margin-top:0px;">|</span>'; //position:absolute; &nbsp;
	                }
	                if(levelsMax==1){//(2.1)单层多选，直接显示select查询条件
	                   html+='<div style="text-align:left;white-space:nowrap;margin-top:0px;" id="tr_'+i+'" isShow="-1" '+style+'><input type="checkbox"/>'+data[selText]+'</div>'; //style放外面,点击表格弹出跨层
	                }else{ //(2.2)多层多选(树),显示div级联下拉
	                   html+='<div style="text-align:left;white-space:nowrap;margin-top:0px;" id="tr_'+i+'" isShow="-1" '+style+'>'+sign+'<span style="margin-left:-4px;">-</span><img src="../images/add.gif" onclick="nextData('+i+',2)" title="点击展开" class="img2"/><input type="checkbox" value="tr_'+i+'"/>'+data[selText]+'</div>'; //style放外面,点击表格弹出跨层
	                } 
                } 
	            if($("#isFuzzyQuery").val()==1){//若多选
	              html='<div style="margin-top:5px;" title="从下列选项中筛选相关选项"><input type="text" value="模糊查询" id="optionWord" onkeyup="findOption()" onFocus="clearOptionWord()" onBlur="addOptionWord()"/></div>'+html;
	            }
	            html='<div style="margin-top:5px;"><input type="checkbox" title="全选/不选"/> <input type="button" value="确定" class="b_foot" onclick="getSelect()"/> <input type="button" value="取消" class="b_foot" onclick="hiddenBtn(\'selView\')"/></div>'+html;
	            $("#selView").addClass("showDataPop8");  
	            $("#selView").html(html).show();  
            } 
         }
    });
}

//多层下钻
function nextData(id,levelMain) {
   var levelsMax=$("#levels").val();    
   var isShow=$("#tr_"+id).attr("isShow"); 
   var isSkip=0; 
   isShow=parseInt(isShow);
   if(isShow==-1){ //isShow=-1 查询出数据，1显示数据,0隐藏数据
      //查询数据   
      $("#loading2").show();
      $("#loadWord2").html("加载数据...").show();
   }else if(isShow==0){ 
     $("[id^='tr_"+id+"_']").each(function() { //显示下级 
          var id2=$(this).attr("id");  
          var id3=id2.replace("tr_"+id+"_",""); 
          if(isNumber(id3)){//只显示下一级
             $(this).show(); 
             id2=id2.substr(3,id2.length); 
             $("#tr_"+id2+" td:first").attr("title","点击下钻");
          } 
     });
     $("#tr_"+id).attr("isShow",1); 
     $("#tr_"+id+" img").attr("src","../images/extend.jpg"); 
     $("#tr_"+id+" img").attr("title","点击折叠");
     return;
   }else if(isShow==1){  
     $("[id^='tr_"+id+"_']").each(function() { //隐藏下级
          $(this).hide(); //隐藏全部
          var id2=$(this).attr("id");  
          id2=id2.substr(3,id2.length); 
          var isShow2=$("#tr_"+id2).attr("isShow"); 
          if(isShow2==1){ //以前有数据,需要修改成0,其他保持-1
             $("#tr_"+id2+" img").attr("src","../images/add.gif"); 
     		 $("#tr_"+id2+" img").attr("title","点击展开");
             $("#tr_"+id2).attr("isShow",0); 
          } 
     });     
     $("#tr_"+id).attr("isShow",0);
     $("#tr_"+id+" img").attr("src","../images/add.gif"); 
     $("#tr_"+id+" img").attr("title","点击展开");
     $("#tr_"+id+" td:first").attr("title","点击下钻");
     return;
   } 
   $("#td_"+id).css("font-weight","bold")
   $("#tr_"+id+" td:first").attr("title","正在下钻中...");
   $("#loading2").show();
   $("#loadWord2").html("加载数据...").show();   
   var selID=$("#selID").val();
   var nextData=$("#tr_"+id).attr("data"); //nextData可以有多个"字段名1:字段值1;字段名2:字段值2",分号分隔 
   var levels=levelMain;
   var action = rootPath+"/page/selectConfig!findSelect.action";   
   var data1="selID="+selID+"&levels="+levels+"&nextData="+nextData; 
   var space="|"; 
   for(var i=1;i<levels;i++){ 
      space+="<span style='width:10px;padding:10px;'></span>|"; 
   } 
   $("#space").val(space); 
   $.ajax({
        type: "post",
        url: action,
        data: data1,
        dataType: "json",
        success: function(response) {
            $("#loading2").hide();
            $("#loadWord2").hide(); 
            var tab=0;
            var s = response.page.select;
            var levels = s.levels;
            var selValue = $("#selValue_"+tab).val();//s.selValue; //查询条件值字段序号
            var selText = $("#selText_"+tab).val();//s.selText; //查询条件显示值字段序号 
            var list = response.page.list; //报表信息  
            $("#tr_"+id).attr("isShow",1); 
            $("#tr_"+id+" img").attr("src","../images/extend.jpg"); 
            $("#tr_"+id+" img").attr("title","点击折叠");
            
            if(list==""){//没查到数据把图标改下
            	 $("#td_"+id).attr("class","root");
            	 return false;
            } 
            var html=""; 
            levelMain=parseInt(levelMain)+1; //为下级做准备  
            for(var i = 0; i < list.length; i++) { 
                var data = (list[i] + "").split(","); 
                var style=' data="'+data[selValue]+'" levelMain="'+levels+'" '; //取消浏览器右击弹出菜单 frameID="'+frameID+'" levelMain="'+levelMain+'" oncontextmenu="return false"
                if(i==list.length-1){//最后一个符号不同
                   space=space.substr(0,space.length-1)+'<span style="margin-top:0px;">|</span>'; //position:absolute; &nbsp;
                }
                if(levelMain<=levelsMax){//最后一级不用下钻
			       html+='<div style="text-align:left;white-space:nowrap;margin-top:0px;" id="tr_'+id+'_'+i+'" isShow="-1" '+style+'>'+space+'<span style="margin-left:-4px;">-</span><img src="../images/add.gif" onclick="nextData(\''+id+"_"+i+'\','+levelMain+')" title="点击展开" class="img2"/><input type="checkbox" value="tr_'+id+'_'+i+'"/>'+data[selText]+'</div>'; //style放外面,点击表格弹出跨层
                }else{
			       html+='<div style="text-align:left;white-space:nowrap;margin-top:0px;" id="tr_'+id+'_'+i+'" isShow="-1" '+style+'>'+space+'<span style="margin-left:-4px;">-</span><input type="checkbox" value="tr_'+id+'_'+i+'"/>'+data[selText]+'</div>'; //style放外面,点击表格弹出跨层
			    }
            } 
             $("#tr_"+id).after(html);  
         }
    });
}

//确定按钮
function getSelect(){ 
  $("#alertWord2").hide();
  var idNameLast="",texts="",datas="",isOk=1;
  $("[id^='tr_'] :checkbox:checked").each(function() {
      var idName=$(this).val();
      if(idNameLast==""){//首次保存
        idNameLast=idName;
      }
      if(idName.length!=idNameLast.length){ //必须选择同层.
         $("#alertWord2").html("必须选择相同层级!").show(); 
         isOk=0;
         return false;
      }
      var text=$("#"+idName).text();
      var data=$("#"+idName).attr("data");
      text=text.substring(text.lastIndexOf("-")+1,text.length); 
      texts += text+",";
      datas += data+",";
   });  
   if(isOk==1){
       texts=texts.substring(0,texts.length-1);
       datas=datas.substring(0,datas.length-1);
       if(texts==""){
         texts=$("#selName").val();       
       }
	   $("#selName2").val(texts); 
	   $("#selName2").attr("data",datas); 
	   $("#selView").hide();
   }
}

//取消按钮
function hiddenBtn(name) { 
    $("#"+name).hide();  
} 

//模糊查询
function findOption() {
  var optionWord=$("#optionWord").val();  
  $("[id^='tr_']").each(function() {//#selView  
      var text=$(this).text();
      if(text.indexOf(optionWord)!=-1){//存在
         $(this).show(); 
      }else{
         $(this).hide(); 
      } 
   }); 
}

//删除提示信息
function clearOptionWord() {
  var optionWord=$("#optionWord").val(); 
  if(optionWord=='模糊查询'){
     $("#optionWord").val("");
  }
}

//若为空则还原提示信息
function addOptionWord() {
  var optionWord=$("#optionWord").val(); 
  if(optionWord.replaceAll(" ","")==''){
     $("#optionWord").val("模糊查询");
  }
}

function showSqlTmp() { //查找reportID小于10的报表模板
	  var isShow=$(".showDataPop6").css("display");
	  if(isShow=="none"){
	     var html="<div onclick='findSqlTmp(105)' style='cursor: pointer;'>查询条件模板-单层</div>"+
	              "<div onclick='findSqlTmp(101)' style='cursor: pointer;'>查询条件模板-多层</div>";  
	     $(".showDataPop6").html(html).show();
	  }else{
	     $(".showDataPop6").hide();
	  } 
	}
	function findSqlTmp(selID) { 
	  $("#selID").val(selID); 
	  initUpdateSelect('sqlTmp'); 
	  $(".showDataPop6").hide();
	}
	

//切换tab 
function changeTab(tab) {
    var tabNow = $("#tabNow").val();
    $("#nextPop_" + tab).hide(); 
    $("#showSql_" + tab).hide();
    $("#picNames").hide();
    var levels = $("#levels").val();
    levels = parseInt(levels);
    for (var j = 0; j <= levels; j++) {
        if (tab == j) {
            $("#levels_" + j).css("color", "red"); 
            $("#tabPage_" + j).show();
        } else {
            $("#levels_" + j).css("color", "#366fa9");
            $("#tabPage_" + j).hide(); 
        }
        $("#nextBackData_" + j).val(""); //清除数据
    }

    //更新页面显示第1张图 
    var type = request.getParameter("op");
    var isTestSql = $("#isTestSql_" + tab).val();
    if (type == 'update' && isTestSql == "1") { 
    }
    $("#tabNow").val(tab);
}

//修改levels级数 
function updateLevels() { 
    var levels = $("#levels").val();
    var levelsLast = $("#levelsLast").val(); 
    var levelsMax = $("#levelsMax").val();  
    var reg = /^([1-9]\d*)$/;
    if (!reg.test(levels) || levels < 1 || levels > 10) { 
        $("#levelsPop").html("请输入1-10之间的正整数").show().fadeOut(3000);
        $("#levels").val(levelsLast);
        return false;
    } else { //合法
        $("#levelsPop").html("");
        levels = parseInt(levels); 
        levelsLast = parseInt(levelsLast);
        levelsMax = parseInt(levelsMax);
        if (levels == levelsMax) { 
            initTabAndPage(levelsMax, levels); 
        } else if (levels <= levelsLast) {
            var del = "由" + levelsLast + "级修改成" + levels + "级，修改后将删除";
            for (var i = levels; i < levelsLast; i++) {
                del += '第' + (i + 1) + '级,';
            }
            del = del.substr(0, del.length - 1) + "，\n您确定是否删除？";
            if (levels != levelsLast && window.confirm(del)) {
                initTabAndPage(levelsMax, levels);
            } else {
                $("#levels").val(levelsLast);
                return false; 
            }
        } else if (levels > levelsMax) {
            initTabAndPage(levelsMax, levels);
            $("#levelsMax").val(levels); 
        }
        $("#levelsLast").val(levels);
        return true;
    }
}

//显示SQL
function showSql() {
    var tabNow = $("#tabNow").val();
    if ($('#showSql2_' + tabNow).css("display").indexOf('inline') < 0) {
        $("#showSql2_" + tabNow).show();
    } else {
        $("#showSql2_" + tabNow).hide();
    }
}

//隐藏SQL
function hideSql() {
    var tabNow = $("#tabNow").val();
    $("#showSql2_" + tabNow).hide();  
}


//将json数据替换页面中的模板
function repTemp(obj, template) { 
    if (template != null) {
        template = template.replace(new RegExp("%7B", 'g'), "{").replace(new RegExp("%7D", 'g'), "}"); 
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

//获取选中复选框的值
function getCheckVal(tab, name, type) {
    var val = "", sonNode = "";
    if (type == 'input') { 
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

//验证实数 
function isNumber(str){
	 var patten = /^-?\d+\.?\d*$/;  
	 var isNum =patten.test(str);
	 return isNum;
}