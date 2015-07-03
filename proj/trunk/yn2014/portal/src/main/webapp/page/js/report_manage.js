$(function(){   // 开始加载
	querylist(); // 查询 
});  

//查询数据
function querylist(){  
	var reportID=$("#reportID").val();
	var pageSize=$("#pageSize").val(); 
	var wheres="";
	$("#loadWord").html("加载数据...");
	$("#loading").show();
	$.ajax({
		url : rootPath+'/page/reportConfig!findConfig.action',
	   	data : { loginno:$("#loginno").val() },
	   	type : 'post',
	   	dataType : 'json',
	   	async : false,
	   	contentType: "application/x-www-form-urlencoded; charset=UTF-8",  
		success: function(data){ 
			fillTable(data);
		},complete: function(xhr){
			//$.unblockUI();
		},error : function (XMLHttpRequest, textStatus, errorThrown) {
			//$.unblockUI();
			alert("数据查询出错,请联系相关人员");
		}
	});
}

//查询数据，填充表格
function fillTable(data){
	// 清空表格所有内容 重新编织 
	   var loginno=$("#loginno").val();
	   var _grid = $("#demoGrid1");		
	   _grid.empty();
	   var _table =  ""; 
	   var pageTitles2="序号;功能名称;集成路径;创建人;创建时间;操作";//pageTitles;  ;时间
	   pageTitles2=pageTitles2.split(";");
	   var _thead ="";
	   for(var i=0;i<pageTitles2.length;i++){
		   _thead+="<th style='border-color:#cebb9e; background-color:#ecd8c7;text-align:center;'>"+pageTitles2[i]+"</th>"; //width:"+widths[i]+"%
	   }
	   _thead="<thead>"+_thead+"</thead>";
	   var style1=""; 
		var tr = "",trTmp="",path1="",path2="",path3="";  
		var list=data.page.list; 
		if (list.length > 0) { 
			  for(var i=0; i<list.length;i++){  
				  path1=rootPath+"/page/jsp/report.jsp?groupNo="+list[i].groupNo+"&reportID="+list[i].reportID+"&loginno="+loginno; 					
				  path2=rootPath+"/page/jsp/report_config.jsp?op=update&groupNo="+list[i].groupNo+"&reportID="+list[i].reportID+"&rootPath="+rootPath+"&loginno="+loginno; 	 
				  path3=rootPath+"/page/jsp/report_config.jsp?op=add"+"&loginno="+loginno; 	 
				  trTmp="<tr id='reportTr_"+list[i].reportID+"'  class='style3' onmouseover=\"this.style.backgroundColor='#ffeeee'\" onmouseout=\"this.style.backgroundColor='#FFFFFF'\"><td style='text-align:center;'>"+(i+1)+"</td> <td style='text-align:left;' title='点击查看'><a href='#none' id='config_exp' onclick=\"parent.openWindow(\'"+list[i].reportName+"\',\'computer\',\'"+path1+"\',\'\')\" style='color:#FF0000'> "+list[i].reportName+"</a></td> "+
				  "<td>/page/jsp/report.jsp?groupNo="+list[i].groupNo+"&reportID="+list[i].reportID+"</td> <td style='text-align:center;'>"+list[i].createUserid+"</td> <td style='text-align:center;'>"+list[i].createTime.substring(0,10)+"</td></td>"+
				  "<td style='text-align:center;'>"+ 
				  "<a href='#none' id='config_exp' onclick=\"parent.openWindow(\'"+list[i].reportName+"\',\'computer\',\'"+path2+"\',\'\')\">修改</a>&#12288;"+//</td></tr>
				  "<a href='#none' id='config_exp' onclick='delConfig(\""+list[i].groupNo+"\",\""+list[i].reportID+"\",\""+list[i].levels+"\")'>删除</a></td></tr>";
				    tr += trTmp; 
			  } 
		}else{
			tr =  "<tr  class='style3'><td colspan='"+pageTitles2.length+"' align='center' style='text-align:center;'>没有查询到数据</td></tr>";
		}  
		_table = "<table id='demoTable' style='width:98%' cellpadding='0' cellspacing='1' bgcolor='#CEBB9E'>" + _thead + "<tbody>" + tr + "</tbody>" + "</table>"; 
		_grid.append(_table);  
		$("#loading").hide();  
}

//分页:输出分页按钮
function page(obj) {//封装在一个对象里 
	var html ='<span><input type="button" value="删除" onclick="delDataByID()" style="width:45px;height:20px;"></span>'+ 
			'  <span style="padding-left:10px;"> <input type="button" onclick="goPage1(\'first\')" class="first" value="" title="首页"/>'+ 
			'   <input type="button" onclick="goPage1(\'pre\')" class="pre" value="" title="上一页"/>'+ 
			'   <input type="button" onclick="goPage1(\'next\')" class="next" value="" title="下一页"/>'+ 
			'   <input type="button" onclick="goPage1(\'last\')" class="last" style="" value="" title="尾页"/>&#12288;'+ 
			'   <span style="font-size:13px">转到第<input id="goPage" name="goPage" type="text" size="2" class="pageText" style="border:2px solid #96b4ef;"/>页&nbsp;<input type="button" onclick="goPage2()" class="next" value="" title="跳转"/></span>'+
			'<span class="style4">&nbsp;当前第<span style="color:red;font-weight:bold;">' + obj.currentPage + '</span>/' + obj.maxPage + '页，共<strong>' + obj.maxRow + '</strong>条记录</span></span>';
    $("#currentPage").val(obj.currentPage);//暂存hidden中 
	$("#maxPage").val(obj.maxPage);
	$("#maxRow").val(obj.maxRow); 
	$("#loading").hide();  
	return html;
}

//点击分页按钮
function goPage1(pageTab) {
	$("#loadWord").html("加载数据...");
	$("#loading").show();
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
	var pageSize=$("#pageSize").val();  
	var wheres2="";
	var data1 = "currentPage=" + currentPage +"&pageSize="+pageSize+"&reportID="+reportID+"&"+ wheres2;
	$.ajax( {
		type : "post",
		url : rootPath+action, 
		data : data1,
		dataType : "json",
		success : function(response) { 
            fillTable(response);
		}
	});
}

//跳转到某页 
function goPage2() { 
	$("#loadWord").html("加载数据...");
    $("#loading").show();
    var action = $("#action").val(); 
    var goPage = $("#goPage").val();
    var goPageInt = isNaN(goPage) ? 1 : parseInt(goPage);
    var maxPage = parseInt($("#maxPage").val());
    if (goPage == '' || isNaN(goPage)) {
    	alert("输入的页码不正确，请重新输入！");
    	$('#goPage').val('');
    	$('#goPage').focus();
    	$("#loading").hide();
    }else { 
    	var goPageInt = parseInt(goPage);
    	goPage = goPageInt<1 ? 1 : goPageInt;
    	goPage = goPage<maxPage ? goPage : maxPage;
    	var reportID=$("#reportID").val(); 
    	var pageSize=$("#pageSize").val();  
		var wheres2="";
		var data1 = "currentPage=" + goPage +"&pageSize="+pageSize+"&reportID="+reportID+"&"+ wheres2;
        $.ajax({
            type: "post",
            url: rootPath+action,
            data: data1,
            dataType: "json",
            success: function(response){ 
                fillTable(response);
            }
        });
    }
}

//下载excel模板
function downExcelModel(){
	if(confirm("你确定要下载模板吗？")){			
		var alias = reportName+".xls";  
		var path =  "/page/excelModel/download/"+modelExcel;
		var url = [rootPath+'/fileDownload','?path=',path,'&alias='+alias].join('');			   		
		window.location.href = url; 
	}
}

function hideDivPop(){ 
	$("#importExcelMsg").html("");
	$(".divPop").hide(); 
}


//删除配置
function delConfig(groupNo,reportID,levels){ 
	if(confirm("您确定是否删除?")){	
		var data1 = "groupNo=" + groupNo + "&reportID=" + reportID + "&levels=" + levels;
		  $.ajax({
		      type: "post",
		      url: rootPath+"/page/reportConfig!delConfig.action",
		      data: data1,
		      dataType: "json",
		      success: function(response){
			      var flag=response.page.flag;
			  	  if(flag==1){
			  		  $("#reportTr_"+reportID).hide();
			  	  }else{
			  		  alert("删除失败!");
			  	  }
		      }
		  });
	} 
}
//是否是数值
function isNumber(str){//验证实数 
	 var patten = /^-?\d+\.?\d*$/;  
	 var isNum =patten.test(str);
	 return isNum; 
}
	
//全选
function checkAll(element) {
	if(($(element).attr("checked"))) {
		$("input[name='recoder']").each(function(){
			$(this).attr("checked",true);
		})
	}else {
		$("input[name='recoder']").each(function(){
			$(this).attr("checked",false);
		})
	}
}

//制作固定表格
function mkGrid(){
	new superTable("demoTable", {
		cssSkin: "sOrange",
		headerRows: 1
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

String.prototype.replaceAll = function(s1, s2) {
 return this.replace(new RegExp(s1, "gm"), s2);
}