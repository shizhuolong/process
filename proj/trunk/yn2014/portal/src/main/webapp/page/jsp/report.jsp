<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.User,org.apdplat.module.security.service.UserHolder,java.util.Date, java.util.Calendar, java.text.SimpleDateFormat"%>
<!DOCTYPE html>
<%
	String path = request.getContextPath();
	String yyyyMM = new SimpleDateFormat("yyyyMM").format(new Date()).toString();
	
	Calendar c = Calendar.getInstance(); 
	c.add(Calendar.MONTH, -1);
	String yyyyMM2 = new SimpleDateFormat("yyyyMM").format(c.getTime()); //上一个月
	String yyyyMM3 = new SimpleDateFormat("yyyy-MM").format(c.getTime());
	String groupNo=request.getParameter("groupNo"); 
	String reportID=request.getParameter("reportID");
	String sp=request.getParameter("sp"); 
	User user = UserHolder.getCurrentLoginUser();
	String loginno =user.getUsername();
	String repType=request.getParameter("repType"); 
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> 
<title></title> 
<script type="text/javascript" >
	// 定义全局变量
	var rootPath = "<%=path%>";  
	var yyyyMM2=<%=yyyyMM2%>;
	var yyyyMM3=<%=yyyyMM3%>; 
</script>

<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/reset.css" />
<link type="text/css" rel="stylesheet" href="<%=path%>/page/rcss/common.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/table2.css" />  
<link type="text/css" rel="stylesheet" href="<%=path%>/page/js/date/skin/WdatePicker.css"> 
<link type="text/css" rel="stylesheet" href="<%=path%>/page/css/btn.css">  
<link type="text/css" rel="stylesheet" href="<%=path%>/page/css/right.css">  <!-- 导致火狐浏览器显示表格很窄 --> 
<link type="text/css" rel="stylesheet" href="<%=path%>/page/js/artDialog-5.0.4/skins/default.css"> 


<script type="text/javascript" src="<%=path%>/page/js/common/jquery-1.6.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/page/js/date/WdatePicker.js"></script>   
<script type="text/javascript" src="<%=path%>/page/js/select_config.js"></script> 
<script type="text/javascript" src="<%=path %>/page/js/common/tableSpan.js"></script>
<script type="text/javascript" src="<%=path %>/page/js/common/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/page/js/artDialog-5.0.4/artDialog.min.js"></script>
<script type="text/javascript" src="<%=path%>/page/js/report.js"></script>
<style type="text/css">
h1 { color: #F90; font-size: 14px; font-weight: bold; margin: 8px; }
p { margin: 8px; }
.first{background: url(../images/page/first.gif) no-repeat center;}
.pre{background: url(../images/page/prev.gif) no-repeat center;}
.next{background: url(../images/page/next.gif) no-repeat center;}
.last{background: url(../images/page/last.gif) no-repeat center;}
#pageHtml span input { margin: 0 2px;  width: 15px; height: 12px; border: 0px; cursor: pointer; } 

.divPop { /*显示SQL*/
	display: none; /*yes*/
	overflow-x: hidden;
	overflow-y: scroll;
	position: absolute;
	clear: left;
	margin-top: 5px;  
	padding: 3px;
	background: #FFFFFF;
	border: 1px solid #ccc;
	margin-left: -68px;
	width: 235px;
	height: 170px;
	z-index:5;
}
.input-form tr td{
  background-color: #ffffff; 
 /* border-color:#cebb9e; */
  border :1px solid #cebb9e;
  border-collapse:collapse; 
}
thead td{
  font-weight:bold;
}

.gridcell{ padding:5px;} 
  .fakeContainer {
     float: left;
     margin: 5px; 
     border: solid 1px #ccc;
     width: 630px;
     height: 250px;
     background-color: #ffffff;
     overflow: hidden;
 }
 
.itemList {
     border: solid 1px #cccccc;
     overflow: hidden;
     width: 100%;
     border-collapse: collapse;
 }
.itemList td {
     padding: 0px 0px 0px 0px;
     color: #444444;
     border: solid 1px #cccccc;
     text-align: center;
     line-height: 20px;
 }
 .selected {
     background-color: #fdee88;
 }
 .hovertr {
     background-color: #fff8c7;
 }
 .errortd {
     border: dashed 1px red;
 }
</style>
 
</head>

<body onmousedown="isHidePop(event,true)" style="overflow-x:hidden;overflow-y:hidden;"> 
<div id="selView"> </div> <!-- 弹出层查询条件 -->
<div class="search-div" style="margin-top:1px;height:25px;margin-top:0px;display:none;"> 	
	<a href="javascript:void(0);" class="fn-option" id="searchBtn" onclick="searchData('2')"><span><b class="log-search"></b>查询</span></a>
    <a href="javascript:void(0);" class="fn-option" id="exportExcel" onclick="exportExcel2()"><span><b class="log-ru"></b>导出</span></a>
	<span id="loading" style="display:none;"><img src="<%=path%>/page/images/loading/load.gif" class=""/><span id="loadWord" style="font-size:12px;"></span></span>
	<span style="margin-left:0px;"><select id="viewSelect_test" levels="1" style="display:none;"></select> </span>
	<span id="eidtError" style="margin-left:100px;color:red"></span>
</div>		               

<div  style="margin-top:1px;height:25px; display:none;">
	<ul class="left"> 
	   <table id="findTable" cellpadding="0" cellspacing="1" width="100%">
	      <!-- 模板规范:_temp结尾,放输出id的前面-->
	      <tr style="display:none;" id="reportSel_temp"> <td>{$selTitles} <input id="rptWhere_{$selID}" type="text" value="" selID="{$selID}" colName="{$colName}" levels="{$levels}" data="{$data}" levelsMax="{$levelsMax}" selValue="{$selValue}" selText="{$selText}" isMore="{$isMore}" isFuzzyQuery="{$isFuzzyQuery}" title="{$selTitles}" onclick="findSelect2('{$selID}')" class="ipt-txt" style="width:70px;margin-right:8px;"/> 
	      		<input id="selLevelsMax_{$selID}" type="hidden" value="{$levelsMax}"/> </td></tr> 
	      <tr style="display:none;" id="reportSel_temp2"> <td>{$selTitles} <span onmousedown="isHidePop(event,false)"><select id="rptWhere_{$selID}" selID="{$selID}" colName="{$colName}" levels="{$levels}" data="{$data}" levelsMax="{$levelsMax}" title="{$selTitles}" style="width:70px;margin-right:8px;"><option value="">-请选择-</option></select></span></td></tr>  
	      <tr style="display:none;" id="reportDate_temp"> <td>{$selTitles} <input id="rptWhere_{$i}" type="text" value="{$data}" onclick="WdatePicker({skin:'whyGreen',dateFmt:'{$dateType}'})" class="Wdate" style="width:75px;margin-right:8px;"/></td> </tr>
	      <tr style="display:none;" id="reportCharNum_temp"> <td>{$selTitles} <input id="rptWhere_{$i}" type="text" value="" class="ipt-txt" style="width:70px;margin-right:8px;"/></td></tr>
	      <tr style="display:none;" id="reportChar2_temp"> <td>{$selTitles} <span onmousedown="isHidePop(event,false)"><input id="rptWhere_{$i}" type="text"  selID="{$selID}" colName="{$colName}" dataLevel="{$dataLevel}" selValue="{$selValue}" isMore="{$isMore}" matchtype="1"  value="{$dateValue}" {$readonly} title="智能匹配" class="ipt-txt" style="width:140px;margin-right:8px;" onmousedown="findDistinct('{$i}','mouse')" onkeyup="findDistinct('{$i}','key')" /><span id="showPop_{$i}" class="showDataPop19" > <!-- matchtype=1 保证第2次点击选中上次的下拉框值 -->
	      		<span id="closePop_{$i}" title="关闭" style="margin-left:80px;" onclick="hideDistinct('{$i}')"><img src="<%=path%>/page/images/del2.png" /> </span></span></span>
	      </td></tr> <!-- onclick="this.select();" -->
	      <tr style="display:none;" id="reportSel_temp3"> <td>{$selTitles} <input id="rptWhere_{$i}" type="text" value="{$data}" selID="{$selID}" dataLevel="{$dataLevel}" selValue="{$selValue}" title="{$selTitles}" class="ipt-txt" style="width:70px;margin-right:8px;" readonly></td></tr>  
	      <tr id="reportBtn_temp" style="display:none;"> </tr>   
	     </table> 
	  </ul>
     
	<ul id="reportFind" class="right" style="margin-top:0px;">   </ul>
 <div class="clr"></div>
</div>

   <table  style='width:100%; font-family: 微软雅黑;margin-bottom:3px;' cellpadding='0' cellspacing='1' bgcolor='#c5c5c5'> <!--  bgcolor='#CEBB9E' -->
     <!-- <thead id="reportHead"></thead> 必须id，否则合并单元格异常 -->
     <tbody id="reportFindTr"></tbody> <!-- 必须class,否则不能显示表格数据,固定表头需要用id,避免重复失效 -->
    </table> 
     
   <div id="demoGrid1"   style="padding-bottom:0px;height:800px;"> 
     <table id='demoTable' style='width:1000px; font-family: 微软雅黑;' cellpadding='0' cellspacing='1' bgcolor='#CEBB9E'>
	     <thead id="reportHead"></thead> <!--  必须id，否则合并单元格异常 -->
	     <tbody class="reportBody"></tbody> <!-- 必须class,否则不能显示表格数据,固定表头需要用id,避免重复失效 -->
     </table>  
   </div> <!-- class="scrollDiv1"  -->
   <span id="pageHtml" style="margin-left:0px;margin-bottom:0px;"></span> <!-- padding-bottom:2px; -->
   <span id="loading2" style="display:none;margin-left:10px;"><img src="<%=path%>/page/images/loading/load.gif" class=""/><span id="loadWord2" style="font-size:12px;"></span></span>
   <form id="expForm"  method="POST">
		<input type='hidden' name="expSql" id="expSql" />
		<input type='hidden' name="fileName" id="fileName" />
		<input type='hidden' name="columnName" id="columnName" />
		<input type='hidden' name="orgValues" id="orgValues" />
		<input type='hidden' name="orgNames" id="orgNames" />
		<input type='hidden' name="isMoreHead" id="isMoreHead" />
		<input type='hidden' name="location" id="location" />
		<input type='hidden' name="reportId" id="reportId" />	
	</form>
		<div id="selectServer-dialog" Style="display:none;" >
			<!--<div><table><tr><td><input checked="checked" name="checkbox" type="checkbox" value="group_id_1_name" disabled><span>地市</span></td><td Style="width:170px;"></td></tr></table></div>
			<div><table><tr><td><input name="checkbox" type="checkbox"  value="unit_name"><span>营服中心</span></td><td Style="width:170px;"></td></tr></table></div>
			<div><table><tr><td><input name="checkbox" type="checkbox"  value="agent_m_name"><span>渠道经理</span></td><td Style="width:170px;"></td></tr></table></div>
			<div><table><tr><td><input name="checkbox" type="checkbox"  value="group_id_4_name"><span>渠道</span></td><td Style="width:170px;"></td></tr></table></div>
			<div><table><tr><td><input name="checkbox" type="checkbox"  value="hq_chan_code"><span>渠道编码</span></td><td Style="width:200px;"></td></tr></table></div>
				 	<div><table><tr><td><input  name="checkbox" type="checkbox"  value="chnl_name"><span>渠道</span></td><td Style="width:200px;"></td></tr></table></div>
			-->
		</div>
    <input id="action" type="hidden" value="/page/report!findData.action"/>  
    <input id="path" type="hidden"  value="<%=path%>"/>
    <input id="loginno" type="hidden" value="<%=loginno%>"/>
    <input id="groupNo" type="hidden" value="<%=groupNo%>"/> 
    <input id="reportID" type="hidden" value="<%=reportID%>"/> 
    <input id="sp" type="hidden" value="<%=sp%>"/>  
	<input id="firstRid" type="hidden" value="0"/>     
	<input id="nowMonth" type="hidden" value="<%=yyyyMM%>"/>   
	<input id="currentPage" type="hidden" value="1"/>
	<input id="pageSize" type="hidden" value="15"/>
	<input id="maxPage" type="hidden" value="1"/>  
	<input id="maxRow" type="hidden" value="0"/>
	
	<input id="tableName" type="hidden" value=""/>
    <input id="reportName" type="hidden" value=""/>  
    <input id="pageTitles" type="hidden" value=""/>  
    <input id="showIndex" type="hidden" value=""/> 
    <input id="orderIndex" type="hidden" value=""/> 
    <input id="groupIndex" type="hidden" value=""/> 
    <input id="dataFormat" type="hidden" value=""/>
    <input id="tripIndex" type="hidden" value=""/>  
    <input id="lastTripIndex" type="hidden" value=""/>  
    <input id="modelExcel" type="hidden" value=""/>
    <input id="whereColname" type="hidden" value=""/> 
    <input id="whereInfo" type="hidden" value=""/>
    <input id="colNames" type="hidden" value=""/> 
    <input id="operateType" type="hidden" value=""/>
    <input id="operateData" type="hidden" value=""/>
    <input id="colWidth" type="hidden" value=""/>
    <input id="colWidthAll" type="hidden" value=""/>      
    
    <!-- 来源report_view.jsp 下拉框初始化 -->
    <input id="selTitles" type="hidden" value=""/>  
	<input id="selConfig" type="hidden" value=""/> 
	<input id="findData" type="hidden" value=""/>  
	<input id="selID" type="hidden" value=""/>
	<input id="frameColName" type="hidden" value=""/> <!-- 主维度 下拉框value字段名 -->
	<input id="frameID2" type="hidden" value=""/>     <!-- 次维度 --> 
	<input id="rptLevelsMax" type="hidden" value="0"/> 
	<input id="levelMain" type="hidden" value="0"/>   <!-- 主维度层级 -->
	<input id="levelsTable2" type="hidden" value="0"/> 
	<input id="levelSec" type="hidden" value="0"/>    <!-- 次维度层级 -->
	<input id="selIndex" type="hidden" value=""/>     <!-- 点击下拉框暂存 -->
	<input id="lastShowPop" type="hidden" value="a"/>  
	<input id="selData" type="hidden" value="" />
	<input id="selLevel" type="hidden"  value="" />
	<input id="isFirst" type="hidden"  value="1" />
	<input id="orderNo" type="hidden"  value="-1" />
	<input id="colMaxLen" type="hidden"  value="0" />
	<input id="isMoreHead" type="hidden" value=""/>
	<input id="colNum" type="hidden" value=""/> 
	<input id="isFirstFind" type="hidden" value="0"/>
	<input id="tableWidth" type="hidden" value="0"/>
	<input id="showPopNow" type="hidden" value="0"/>
	<input id="tripWhere" type="hidden" value="0"/> 
	<input id="colComment" type="hidden" value="0"/>
	<input id="datafuncIndex" type="hidden" value="0"/>
	<input id="repType" type="hidden" value="<%=repType%>"/>
	
</body>
</html>
