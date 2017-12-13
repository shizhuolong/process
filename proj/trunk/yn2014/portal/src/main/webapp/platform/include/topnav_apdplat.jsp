<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<style type="text/css">
    .menu-desktop{
        background-image:url('images/desktop.gif')!important;
        background-repeat:no-repeat;
        background-position:10% 50%;
    }
</style>
<script type="text/javascript">
var path = "<%=path%>";
var initMenuId = "";
var initMenuName = "";
$(document).ready(function(){
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        async:false,
        url:path+'/module/module!query.action',
	    data:{
	    	node:'rootss',
	    	recursion:false
		},
        success:function(data){ 
        	var menuStr = '<li class="select" onclick="selectSwitch(this); "><a class="select" href="javascript:void(0);" onclick="switchFirstMenu(\'000\',\'工作台\');"><i class="navi-01"></i>工作台</a>';
        	var index = 2;
        	for(var i=0,len=data.length;i<len;i++) {
        		if(i == 0) {
        			initMenuId = data[i].id;
        			initMenuName = data[i].text; 
        			menuStr += '<li class=""   onclick="selectSwitch(this); "><a class="" href="#" onclick="switchFirstMenu(\''+data[i].id+'\',\''+data[i].text+'\');"><i class="navi-0'+index+'"></i>'+data[i].text+'</a></li>';
        		}else {
        			var txt = data[i].text;
        			var navindex = "";
        			if(txt == "任务管理") {
        				navindex = "2";
        			}else if(txt == "激励考核") {
        				navindex = "3";
        			}else if(txt == "统计分析") {
        				navindex = "4";
        			}else if(txt == "业务专题") {
        				navindex = "5";
        			}else if(txt == "负面清单") {
        				navindex = "6";
        			}else if(txt == "经营管控") {
        				navindex = "7";
        			}else if(txt == "资源管理") {
        				navindex = "8";
        			}else if(txt == "系统管理") {
        				navindex = "9";
        			}else if(txt == "预警监控") {
        				navindex = "9";
        			}
        			menuStr += '<li  class=""  onclick="selectSwitch(this); "><a class="" href="#" onclick="switchFirstMenu(\''+data[i].id+'\',\''+data[i].text+'\');"><i class="navi-0'+navindex+'"></i>'+data[i].text+'</a></li>';
        		}
        		index++;
        	}
        	$("#navi UL").html(menuStr);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest+"--"+textStatus+"--"+errorThrown);
        }
	});
})

</script>

<!--  
<li class="activeli"   onclick="selectSwitch(this); "><a href="#" onclick="switchFirstMenu('module-44','菜单一');" class="menu-desktop">菜单一</a></li>
<li class="commonli"   onclick="selectSwitch(this); "><a href="#" onclick="switchFirstMenu('module-45','菜单二');" class="menu-desktop">菜单二</a></li>
<li class="commonli"   onclick="selectSwitch(this); "><a href="#" onclick="switchFirstMenu('module-46','菜单三');" class="menu-desktop">菜单三</a></li>
<li class="commonli"   onclick="selectSwitch(this); "><a href="#" onclick="switchFirstMenu('module-46','菜单四');" class="menu-desktop">菜单四</a></li>
-->