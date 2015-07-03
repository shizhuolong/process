var request=new JSRequest(); 
$(document).ready(function() {  
	findAllSelConfig(); 
	$("#selName").click(function(){
		$("#selName").val("");
	});
});
   
//初始化查询条件和查询条件配置信息,分日期和下拉框(分省和地市)
function findAllSelConfig() {
   $("#loading2").show();
   $("#loadWord2").html("加载").show();  
   var loginno=$("#loginno").val();
   var currentPage=$("#currentPage").val(); 
   var selName=$("#selName").val(); 
   if(selName=='请输入查询条件名称'){
	   selName="";
   }  
   var data1="loginno="+loginno+"&currentPage="+currentPage+"&selName="+selName;
   $.ajax({
        type: "post",
        url: rootPath+"/page/selectConfig!findAllSelConfig.action",
        data: data1,
        dataType: "json",
        success: function(response) { 
            $("#loading2").hide();
            $("#loadWord2").hide();  
            var list = response.page.list;  
            var selTemp=$("#sel_temp").html(); 
            var html="";
            for (var j = 0; j < list.length; j++) {  
                html+=repTemp(list[j], selTemp);  
            } 
            $("#sel").html(html);
            $("#pageHtml").html(page(response.page));
   		}
    });
}

function delSel(selID,selName){ //单层下拉框查询数据 
	var configWord="您确认是否删除"+selName+"查询条件?";
	if(confirm(configWord)) {
		var loginno=$("#loginno").val();
		   var data1="loginno="+loginno+"&selID="+selID;
		   $.ajax({
		        type: "post",
		        url: rootPath+"/page/selectConfig!delSel.action",
		        data: data1,
		        dataType: "json",
		        success: function(response) { 
				   var flag = response.page.flag;  
		           if(flag==1){
		             alert("查询条件删除成功!");
		           }else if(flag==-1){
		             alert("查询条件删除失败!");
		           }else if(flag==-2){
		             alert("你无权删除该查询条件!");
		           } 
		           findAllSelConfig(); 
			   }
			});
	}
}

//分页(跨层下钻弹出的页面):输出分页按钮
function page(obj) { 
    var html =""; 
	html += '  <span style="padding-left:10px;"> <input type="button" onclick="goPage1(\'first\')" class="first" value="" title="首页"/>'+ 
			'   <input type="button" onclick="goPage1(\'pre\')" class="pre" value="" title="上一页"/>'+ 
			'   <input type="button" onclick="goPage1(\'next\')" class="next" value="" title="下一页"/>'+ 
			'   <input type="button" onclick="goPage1(\'last\')" class="last" style="" value="" title="尾页"/>&#12288;</span>'+ 
			'<span class="style4" >第<span style="color:red;font-weight:bold;">' + obj.currentPage + '</span>/' + obj.maxPage + '页，共<strong>' + obj.maxRow + '</strong>条</span>'+
			'<span id="loading3" style="display:none;margin-left:50px;"><img src="../images/loading/loading2.gif" class="img1"/>&nbsp;<span id="loadWord" style="font-size:11px;">加载</span></span>';
    $("#currentPage").val(obj.currentPage);//暂存hidden中 
	$("#maxPage").val(obj.maxPage);
	$("#maxRow").val(obj.maxRow); 
	return html;
}


//分页(跨层下钻弹出的页面)：点击分页按钮
function goPage1(pageTab) {
	$("#loading3").show();
	var maxPage = parseInt($("#maxPage").val());
	var currentPage = parseInt($("#currentPage").val());
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
	$("#currentPage").val(currentPage);  	
	findAllSelConfig();
}

 
//显示SQL
function showSql() { 
    if ($("#showSql2").css("display").indexOf('inline') < 0) {
        $("#showSql2").show();
    } else {
        $("#showSql2").hide();
    }
}

//各行颜色和红升绿降颜色
function changeRowColor(){ 
    var i=1;
    $('#reportBody tr').each(function() {  
    	if(i%2==0){
    	   $(this).find("td").css("background-color","#f9f9f9");//隔行变色
    	}
    	var id=$(this).attr("id");
    	$('#'+id+' td').each(function() {  
    		var text=$(this).text();
    		if(text.indexOf("%")>0){
    			if(text.indexOf("-")>=0){//百分数红升绿降
    				$(this).css("color","green");
    			}else{
    				$(this).css("color","red");
    			} 
    		}
    	}); 	
    	i++; 
    }); 
}

//鼠标移动变色	
var tdColor="";
function onmouseoverTr(id){ 
	tdColor=$("#tr_"+id).find("td").css("background-color");
	$("#tr_"+id).find("td").css("background-color","#ffeeee"); 
}

function onmouseoutTr(id){  
	$("#tr_"+id).find("td").css("background-color",tdColor); 
}

function onmouseoutTr2(){  
	$("tr[id^='tr_']").css("background-color","#FFFFFF");  
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
 
//验证实数 
function isNumber(str){
	 var patten = /^-?\d+\.?\d*$/;  
	 var isNum =patten.test(str);
	 return isNum;
}