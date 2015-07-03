<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.Date, java.util.Calendar, java.text.SimpleDateFormat"%>
<!DOCTYPE html>
<%
	String path = request.getContextPath();
 %>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" URIEncoding="UTF-8"/> 
	<title>查询条件配置</title>
	<script type="text/javascript" >
		// 定义全局变量
		var rootPath ="<%=path%>";  
	</script>
	<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/right.css"/> 
	<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/btn.css"/> <!-- 按钮样式 -->
	<script type="text/javascript" src="<%=path%>/page/js/common/jquery-1.3.2.min.js"></script> 
	<script type="text/javascript" src="<%=path%>/page/js/select_config.js"></script>  
</head>

<body>
<div>
<table width="100%" height="100%" border="0" align="center" cellpadding="0" cellspacing="0">
  <!-- 页面右侧 开始 -->
  <tr>   
   <td width="100%" height="100%" align="left" valign="top" border="1">     
    <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> 
      <tr><td height="24"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>  
	      <td width="100%" height="24" valign="middle" style="padding-left:2px;" background="../images/tab_05.gif"><img src="../images/tb.gif" width="14" height="14"/> 
	       <span class="style1"><strong>&nbsp;</strong>查询条件配置</span></td> <!-- 当前位置: -->
	  </tr>  
    </table></td>
   </tr>   
  
  <!-- (1)tab level级数 开始 -->
  <tr>
      <td colspan="2" width="17%" align="left" style="height:25px;padding:5px;padding-left:10px;color:#366fa9;font-size:13px;"> 
  		  <span id="loading" style="margin-left:480px;"><img src="../images/loading/loading2.gif" class="img1"/>&nbsp;<span id="loadWord" style="font-weight:none">初始化页面...</span></span>
	      <span id="alertWord" style="display:none;margin-left:80px;color:red"></span>
  		  <div id="leveltd" style="display:none;height:20px;"><!-- 查询条件下钻级数: -->
	  		 <span id="levelsTab" style="font-weight:bold;"><a href="javascript:void(0)"  id="levels_0" onclick="changeTab(0)" style="color:red;">1级</a> &#12288;
	      	    <a href="javascript:void(0)" id="levels_1" onclick="changeTab(1)" style="color:#366fa9">2级</a> &#12288;
	      	    <a href="javascript:void(0)" id="levels_2" onclick="changeTab(2)" style="color:#366fa9">3级</a>&#12288;
	      	 </span>
	   	     <span title="层级数"><span style="font-weight:bold;margin-left:0px;">层级数:</span>
	   	        <select id="levels" title="层级数" onchange="updateLevels(this)"><option value="1">1级</option><option value="2">2级</option>
	   	           <option value="3">3级</option><option value="4">4级</option><option value="5">5级</option><option value="6">6级</option><option value="7">7级</option><option value="8">8级</option></select>
	   	        <!-- <input type="text" id="levels" value="3" style="width:15px;height:13px;text-align:center" onblur="updateLevels(this)"/> --><span id="levelsPop" style="color:red"></span>		        
		        <input type="hidden" id="levelsLast" value="3"/>  <input type="hidden" id="levelsMax" value="3"/> 
	         </span>  
	         <span title="选择查询条件模板" style="cursor:pointer;" onclick="showSqlTmp()"><img src="../images/funPop.jpg" style="width:12px;height:14px;"/></span><span class="showDataPop6"></span>&#12288;
	      	 <span title="智能分析平台操作手册.doc" style="cursor:pointer;"><a href="./downExcel.jsp?filePath=/page/down/doc/&fileName=help.doc&filedisplay=report_help.doc" ><img src="../images/help.png" style="border:0;"/></a></span></div> <!-- 图片+操作手册文档下载链接 -->
      </td>
  </tr> 
  <!-- (1)tab level级数 结束 -->
 
  <!-- (2)tab模板 开始 --> 
  <tr id="tabPageHtml"  style="display:none;">
    <td width="70%"> 
    <table class="tableCls1" width="100%"  cellpadding="0" cellspacing="1" bgcolor="#cfd0d2">   
      <tr style="">
          <td style="padding:2px;padding-left:6px;" align="left" valign="top">                
              <div title="" style="margin:2px;">说明:当前级选择<span style="color:red">传递值</span>字段给下级,下级使用<span style="color:red">=:</span>接收上级<span style="color:red">传递值</span> </div>
	      	  <!-- <div id="selConfig_{$tab}"  class="columnScroll3" style="float:left;width:98%;padding-top:0px;height:1px;"> </div>  -->
              <span><textarea id="sql_{$tab}" style="width:98%;height:88px;font-size:15px;" >{$selSql}</textarea></span> <!-- onkeyup  ="setFinds(event)" -->
              <input id="isTestSql_{$tab}" name="isTestSql" type="hidden" value="{$isTestSql}"/>
              <input id="abc_{$tab}" type="hidden" value=""/> <input id="abc2_{$tab}" type="hidden" value=""/>
           
          </td> 
          <td width="30%" rowspan="6" valign="top" >
             <table width="100%" height="30" cellpadding="0" cellspacing="1" bgcolor="#cfd0d2" style="margin-left:-3px;margin-top:-3px;">
                <tr valign="middle" title=""><td height="21"><span style="margin-right:2px;">下拉框设置</span></td></tr>
                <tr valign="middle" title="一般为name名称字段"><td height="24"><span style="margin-right:2px;">显 示 值</span><span class="cols"><select id="selText_{$tab}"><option value=''>-请选择-</option></select></span></td></tr>
                <tr valign="middle" title="一般为id或code编码字段,传递给报表where条件或下层级"><td height="26"><span style="margin-right:2px;">传 递 值</span><span class="cols"><select id="selValue_{$tab}"><option value=''>-请选择-</option></select></span></td></tr>
		        <tr valign="middle" title=""><td height="24" ><span style="margin-right:2px;">数据权限</span><span class="cols"><select id="dataLevel_{$tab}" style="width:130px;"><option value="-1">无</option><option value="0" title="多层级(树),比如营销架构">有</option><option value="2,code">2级(地市ID)</option><option value="3,code">3级(区县ID)</option>
		      	<option value="4,code">4级(营服中心ID)</option><option value="5,code">5级(网格ID)</option><option value="6,code">6级(网点ID)</option><option value="2,name">2级(地市名称)</option><option value="3,name">3级(区县名称)</option><option value="8,loginno" title="用户登录账号">用户账号</option></select></span></td></tr> <!-- <option value="8,userid" title="用户ID">用户ID</option> -->
		        <tr valign="middle" style="display:none;"><td height="26" title="传递给下一级查询条件使用"><span style="margin-right:10px;">下级传递值</span><span class="cols"><select id="nextID_{$tab}"><option value=''>-请选择-</option></select></span></td></tr> 
		     </table> 
          </td>
      </tr>  
      <tr>
         <td align="left" colspan="2" style="height:20px;padding-left:300px;padding-right:200px;">		           
      	    <span style="padding:3px;"><input class="b_foot" type="button" name="testSql" id="testSql" value="测试Sql" onclick="testSql({$tab})"/>&#12288;<input class="b_foot" id="ruleMatch_{$tab}" type="button" value="自动匹配" title="根据规则自动匹配其他层级的sql,字段名等" onclick="ruleMatch()" style="display:none;"/></span>  
      	    <span id="loading_{$tab}" style="display:none;margin-left:10px;"><img src="../images/loading/loading2.gif" class="img1"/>&nbsp;<span id="loadWord_{$tab}" style="font-weight:none">测试Sql中...</span></span>
	        <span id="alertWord_{$tab}" style="display:none;margin-left:10px;color:red"></span>
	        <span id="nextPop_{$tab}" title="鼠标点击当前查询条件传递的数据" style="display:none;margin-left:80px;">下钻ID:</span>
	           <a href="javascript:void(0);" id="showSql_{$tab}" onMouseOver="showSql()" style="display:none;">查看SQL</a> <span id="showSql2_{$tab}" onmouseout="hideSql()" class="showDataPop2"> </span>  
         </td> 
      </tr> 
    </tabel>     		    
    <!-- 查询条件参数设置: 名称/备注等 <table></table>-->
      
   </table>
  </td> 
 </tr>
 <!-- (2)tab模板 结束 -->  
  </table>
  </td>
  <!-- 页面右侧 结束 -->  
  </tr>
</table>
</div>


<!--(3)tab模板 替换并输出 -->
<div><table id="tabPageHtmls" width="100%"> </table></div>

<!--(4)查询条件配置参数设置: 名称/备注等 -->
<div id="selConfig" style="display:none;"> <!-- margin-top:-22px; -->
  <table class="tableCls1" id="picInfo" width="100%" cellpadding="0" cellspacing="1" bgcolor="#cfd0d2" style="margin-top:-1px;">
     <tr><td width="48%">
	      <div style="margin:2px;"><span title="查询条件配置名称">名称 <input type="text" id="selName" value="查询条件名称" style="width:98px;"/></span>&nbsp;
	        <span>类型 <select id="selType" style="width:100px;" title="查询条件类型"><option value="1">层级(树)</option> <option value="2">级联</option></select></span></div>  
	        <!-- 不能级联，应用需要与结果表对应字段,才知道传递值给哪个字段,即选择查询条件后，还须指定每层对应字段, <option value="1">单层</option> <option value="2">多层(树)</option> -->
	      <div style="margin:2px;margin-top:5px;"><span>选项 <select id="isMore" style="width:100px;" title="查询条件可选择单个或多个选项"><option value="-1">单选</option> <option value="1">多选</option></select></span>&nbsp;
		      <span title="若查询条件选项>100个,可使用它进行筛选快速定位" style="display:none;">模糊查询 <select id="isFuzzyQuery" style="width:40px;"><option value="-1">否</option> <option value="1">是</option></select></span>
		      <span>用途 <select id="useType" style="width:100px;" title="查询条件配置是公共使用/个人使用/禁止使用"><option value="1">公用</option> <option value="0">私用</option> <option value="-1">禁用</option></select></span> </div> 
	     </td> 
         <td><span><textarea id="selExplain" style="width:98%;height:48px;font-size:13px;">备注说明</textarea></span> </td>
     </tr>  
     <tr><td colspan="4" style="height:32px;" valign="middle">	 
        	<span id="preview" style="margin-left:10px;display:none;"><input class="b_foot" type="button" value="预览" onclick="saveConfigAll('view')" title="查看全部层级查询条件"/></span><!-- onclick="view('all')" -->
        	<span id="saveConfig" style="margin-left:10px;padding:3px;display:none;"><input class="b_foot" type="button" value="保存" onclick="saveConfigAll()" title="保存全部层级查询条件" /></span>
            <span><input type="text" id="selName2" onclick="findSelect()" style="width:90px;display:none"/></span>
			<span id="selView" class="showDataPop8"> </span> <!-- 多层 -->
			<span id="loading2" style="display:none;margin-left:5px;"><img src="../images/loading/loading2.gif" class="img1"/></span> <span id="loadWord2" style="font-weight:none"> </span>
	  	    <span id="alertWord2" style="display:none;margin-left:5px;color:red"></span>  
          </td> 
      </tr>  
 </table>
</div>

<div style="margin:0px 2px 5px 30px;"> </div>

<input id="action" type="hidden" value="<%=path%>/page/selectConfig!testSql.action"/> 
<input id="tabNow" type="hidden" value="0"/>
<input id="selID" type="hidden" value=""/> 
<input id="levelMain" type="hidden" value=""/> 
<input id="space" type="hidden" value=""/>
</body>
</html>