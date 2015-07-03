<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.Date, java.util.Calendar, java.text.SimpleDateFormat"%>
<!DOCTYPE html>
<%
	String path = request.getContextPath();
 %>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" URIEncoding="UTF-8"/> 
	<title>报表配置</title>
	<script type="text/javascript" >
		// 定义全局变量
		var rootPath ="<%=path%>";  
	</script>
	<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/right.css"/> 
	<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/btn.css"/> <!-- 按钮样式 -->
	<link rel="stylesheet" href="<%=path%>/page/tree/zTreeStyle/zTreeStyle.css" type="text/css"/>
	<script type="text/javascript" src="<%=path%>/page/js/common/jquery-1.3.2.min.js"></script> 
	<script type="text/javascript" src="<%=path%>/page/js/common/ajaxupload.js"></script> 
	<script type="text/javascript" src="<%=path%>/page/tree/jquery.ztree.core-3.1.js"></script>
	<script type="text/javascript" src="<%=path%>/page/tree/jquery.ztree.excheck-3.1.js"></script>  
	<script type="text/javascript" src="<%=path%>/page/js/report_config.js"></script> 
	
</head>

<body>
<div>
<table width="100%" height="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="">
  <tr>
      <td colspan="2" width="17%" align="left" style="height:25px;padding:5px;padding-left:10px;color:#366fa9;font-size:13px;display:none;">  <!-- height:25px; -->
  		  <div id="leveltd" style="display:none;height:20px;"> 
	  		 <span id="levelsTab" style="font-weight:bold;"><a href="javascript:void(0)"  id="levels_0" onclick="changeTab(0)" style="color:red;">sheet1</a> &#12288;
	      	    <a href="javascript:void(0)" id="levels_1" onclick="changeTab(1)" style="color:#366fa9">sheet2</a> &#12288;
	      	    <a href="javascript:void(0)" id="levels_2" onclick="changeTab(2)" style="color:#366fa9">sheet3</a>&#12288;
	      	 </span>
	   	     <span title="sheet个数" style="display:yes;"><span style="font-weight:bold;margin-left:10px;">sheet个数:</span> 
	   	        <select id="levels" title="sheet个数" onchange="updateLevels(this)"><option value="1">1个</option><option value="2">2个</option><option value="3">3个</option><option value="4">4个</option>
	   	           <option value="5">5个</option><option value="6">6个</option><option value="7">7个</option><option value="8">8个</option><option value="9">9个</option><option value="10">10个</option></select>
	   	        	<span id="levelsPop" style="color:red"></span>		        
		        <input type="hidden" id="levelsLast" value="3"/>  <input type="hidden" id="levelsMax" value="3"/> 
	         </span> 
          </div>
          <span id="loading" style="margin-left:450px;"><img src="../images/loading/loading2.gif" width="18" height="18" class=""/>&nbsp;<span id="loadWord" style="font-weight:none">初始化页面...</span></span>
	      <span id="alertWord" style="display:none;margin-left:10px;color:red"></span> 
      </td>
  </tr> 
  <!-- tab level级数 结束 -->
  
  <!-- tab模板 开始 --> 
  <tr id="tabPageHtml"  style="display:none;">
    <td > 
    <table class="tableCls1" width="100%" cellpadding="0" cellspacing="1" bgcolor="#cfd0d2">   
       <tr>
          <td width="100%" rowspan="2" valign="top" >              
             <div class="columnScroll" style=""> 
	             <table class="tableCls1" width="100%" height="100%" border="1" bordercolor="#cfd0d2" style="border-collapse: collapse"  cellspacing="0" cellpadding="0" cellspacing="1">
		            <tr> <td colspan="20" style="padding:2px;padding-left:6px;" align="left"> 
		                  <span style="font-size:12px;">类型:</span><select id="isAddCol_{$tab}" title="" onchange="isTableCheck({$tab})"  > <option value="-1">报表</option></select>&#12288;		            	  
			                            数据库用户:<select id="owner_{$tab}" onchange="findOwner({$tab})"  style="width:110px;" title="请选择数据库用户"><option value="">-请选择-</option></select>
			              <select id="tableType_{$tab}" onchange="findAllTableName({$tab})" title="类型" style="display:none;"><option value="">-全部-</option> <option value="table">数据表</option> <option value="view">视图</option></select>
			              <input id="tableName_{$tab}" type="text" value="{$tableName}" style="width:320px;" onmousedown="showPop({$tab})" onkeyup="findAllTableName({$tab},1)" title="模糊匹配"/><input id="tableName2_{$tab}" type="hidden" value="{$tableName}"/><span id="showPop_{$tab}" class="showDataPop20"></span>  
			              <a href="javascript:void(0);" class="fn-option" onclick="findTabelName({$tab});"><span><b class="log-search"></b>查询</span></a>&#12288;
      					  <span id="loading_{$tab}" style="display:none;margin-left:5px;"><img src="../images/loading/loading2.gif" width="18" height="18" class=""/>&nbsp;<span id="loadWord_{$tab}" style="font-weight:none">测试Sql中...</span></span>
	      				  <span id="alertWord_{$tab}" style="display:none;margin-left:0px;color:red"></span>
			              <input id="isTestSql_{$tab}" name="isTestSql" type="hidden" value="{$isTestSql}"/><!--增加页面默认0,更新页面默认为1,若修改SQL，则修改0 -->     
			          </td> 
			        </tr>
			        <tr class="trBold" valign="middle" style="height:20px;padding-top:1px;">
			            <td colspan="3" align="center">表结构</td>
			            <td colspan="8" align="center">查询</td>
			            <td colspan="3" align="center" class="importIndex_{$tab}">导入</td>
			            <td rowspan="2" align="center" class="editInfo_{$tab}">字段编辑</td>
			            <td rowspan="2" align="left" width="13%" style="margin-left:3px;" class="operateType_{$tab}">操作权限  <span title="更多配置参数" style="cursor:pointer;" onclick="moreCfg()"><img src="../images/funPop.jpg" style="width:12px;height:14px;"/></span><span class="showDataPop6"></span>&#12288; </td>
			        </tr>
	             	<tr>
	                  <td width="8%" align="center">表字段名</td>
	                  <td width="7%" align="center">字段类型</td>
	                  <td width="8%" align="center">字段备注 <img src="../images/add.gif" style="cursor: pointer;" onclick="parent.openWindow('表字段备注信息管理','computer','<%=path%>/page/jsp/select_manage.jsp?loginno={$loginno}','')" /></td>
			          <td width="10%" align="center">报表表头<div><input id="isMoreHead_{$tab}" type="checkbox" value="0" title="多行表头" onclick="isMoreHead({$tab})"/>多行<a href="<%=path%>/page/jsp/help_excelHead.jsp" target="_blank"><img src="../images/help.png" style="border:0;"/></a></div></td> 
			          <td width="10%" align="center">查询条件显示名称</td>
			          <td width="12%" align="center">查询条件 <img src="../images/add.gif" style="cursor: pointer;" onclick="parent.openWindow('自定义查询条件','computer','<%=path%>/page/jsp/select_manage.jsp?loginno={$loginno}','')" /></td>
			          <td width="25" align="center" title="显示字段"><div>显示</div><input id="showIndexAll_{$tab}" type="checkbox" value="0" title="全选" onclick="dataALL('showIndex',{$tab})"/></td> 
			          <td width="25" align="center"><div>字段</div>排序</td>
			          <td width="30" align="center"><div>表格</div>合并</td>
			          <td align="center"><div>数据</div>处理</td>
			          <td align="center">下钻字段</td>
			          <td align="center"><div>函数</div></td>
			          <td align="center"><div>下钻层级下载</div></td>
			          <td align="center" style="display:none;"><div>数据处理</div></td>
			          <td align="center" title="导入字段" class="importIndex_{$tab}"><div>字段</div>导入</td> <!-- <input id="importIndexAll_{$tab}" type="checkbox" value="0" title="全选" onclick="dataALL('importIndex',{$tab})"/> -->
			          <td align="center" class="importIndex_{$tab}"><div>数据</div>唯一</td>
			          <td align="center" class="importIndex_{$tab}">字段验证</td>   
					</tr> 
				    <tr style="padding-bottom:10px;"> 
			          <td id="colName_{$tab}" align="center" valign="top"> 	 
		                <div style=""><input name="colName_{$tab}" size="10" value="" title="" readonly/></div>
			          </td> 
			          <td id="colType_{$tab}" align="center" valign="top"> 	 
		                <div style=""><input name="colType_{$tab}" size="9" value="" title="" readonly/></div>
			          </td>			         
			          <td id="colRemark_{$tab}" align="center" valign="top"> 	 
		                <div style=""><input name="colRemark_{$tab}" size="10" value="" readonly/></div>
			          </td>
			          <td id="pageTitle_{$tab}" class="pageTitle_{$tab}" align="center" valign="top"> 	 
		                <div style=""><input name="pageTitle_{$tab}" size="12" value=""/></div>
			          </td>  
			          <td id="condName_{$tab}" class="pageTitle_{$tab}" align="center" valign="top"> 	 
		                <div style=""><input name="condName_{$tab}" size="12" value=""/></div>
			          </td>   
			          <td id="whereInfo_{$tab}" align="left" valign="top">  
				         <div class="cols"><select name="whereInfo_{$tab}" style="width:115px;"><option value="0">无</option> <option value="yyyyMM">日期yyyyMM</option> <option value="yyyy-MM">日期yyyy-MM</option>
				         	 <option value="yyyyMMdd">日期yyyyMMdd</option> <option value="yyyy-MM-dd">日期yyyy-MM-dd</option> <option value="yyyy-MM-dd">日期yyyy-MM-dd</option></select></div> 
				      </td>   	
			          <td id="showIndex_{$tab}" align="center" valign="top"> 
				         <div class="cols"><input name="showIndex_{$tab}" type="checkbox" value="0" /></div>  
				      </td> 
				      <td id="orderIndex_{$tab}" align="center" valign="top"> 
				         <div class="cols"><input name="orderIndex_{$tab}" type="checkbox" value="0" /></div>  
				      </td>	
				      <td id="groupIndex_{$tab}" align="center" valign="top"> 
				         <div class="cols"><input name="groupIndex_{$tab}" type="checkbox" value="0" /></div> 
				      </td>	
				      <td id="dataFormat_{$tab}" align="center" valign="top"> 
				         <div id="dataFormat2_{$tab}" class="showDataPop21"></div> 
				      </td>
				       <td id="tripIndex_{$tab}"  align="center" valign="top"> 	 
		               	    <div class="cols"><select name="tripIndex_{$tab}" style="width:115px;"><option value="0">无</option></select> </div> 
			          </td>  
			          <td id="funcIndex_{$tab}"  align="center" valign="top"> 	 
		               	    <div class="cols"><select name="funcIndex_{$tab}" style="width:75px;"><option value="0">无</option></select> </div> 
			          </td> 
			          <td id="tripDown_{$tab}"  align="center" valign="top"> 	 
		               	    <div class="cols"><input name="tripDown_{$tab}" type="checkbox" value="0" /></div> 
			          </td> 
			          <td id="datafuncIndex_{$tab}"  align="center" valign="top" style="display:none;"> 	 
		               	    <div class="cols" style="display:none;"><select name="datafuncIndex_{$tab}" style="width:75px;"><option value="0">无</option></select> </div> 
			          </td>  
				      <td id="importIndex_{$tab}" align="center" valign="top"> 
				         	<div class="cols"><input name="importIndex_{$tab}" type="checkbox" value="0" /></div>
				      </td>	
				      <td id="onlyIndex_{$tab}" align="center" valign="top"> 
				         <div class="cols"><input name="onlyIndex_{$tab}" type="checkbox" value="0" /></div>
				      </td>
				      <td id="checkIndex_{$tab}" align="center" valign="top"> 
				         <div class="cols"><select name="checkIndex_{$tab}" style="width:88px;"><option value="0">不验证</option><option value="1">不能为空</option>
				         	<option value="2">必须是整数</option> <option value="3">必须是实数</option> <option value="4">必须联通手机号</option> </select></div> 
				      </td>	 
				      <td id="editInfo_{$tab}" align="center" valign="top">  
				         <div class="cols"><select name="editInfo_{$tab}" style="width:115px;"> <option value="noEdit">不能修改</option> <option value="0" title="文本框(单行输入)">文本框</option> <option value="textArea" title="编辑框(多行输入)">编辑框</option>
				         	 <option value="select1">下拉框2</option> <option value="select2">下拉框2</option> </select></div> 
				      </td>
				      <td id="operateType_{$tab}" align="left" valign="top" style="padding-left:5px;">  
				          <div class="operateType2_{$tab}">
				          	  <div>功能权限:</div> 
				              <div><input name="operateType" type="checkbox" value="import" checked/>导入</div> 
					          <div><input name="operateType" type="checkbox" value="edit" checked/>修改</div>            
				              <div><input name="operateType" type="checkbox" value="add" checked/>增加</div>   
				              <div><input name="operateType" type="checkbox" value="delete" checked/>删除</div> 
				          </div>
			              <div style="margin-top:10px;">查看数据权限:</div> 
			              <div><select id="operateData_{$tab}" style="width:98px;"><option value="-1">所有用户</option> <option value="0">导入用户本人</option> </select></div>
			              <div style="margin-top:10px;">导入数据:</div> 
			              <div><select id="isUpdate_{$tab}" style="width:98px;"><option value="1" title="历史数据删除，全部使用最新月数据">增量更新</option> <option value="0" title="自动更新历史数据和新增数据">覆盖更新</option></select></div>
			              <input type="hidden" id="beginRow_{$tab}" value="1"/>
				      </td> 
				    </tr> 
				         
				 </table>  
             </div>
          </td>
      </tr>   
   </table>
  </td> 
 </tr> 
</table></div>        


<!--(4)tab模板替换并输出 -->
<div><table id="tabPageHtmls" width="100%"> </table></div>
<div id="modelExplain" style="margin-top:-22px;height:40px;display:none;" >
 <table id="tabPageHtmls2" class="tableCls1" width="100%" cellpadding="0" cellspacing="1" bgcolor="#cfd0d2"> <!-- 模板，目录，导入说明  tab共用 -->
   <tr>  
     <td align="left" width="62%" style="padding-left:10px;"> 
        <div style="padding-bottom:5px;"><span id="modelExcel1" style="display:none;">Excel模板 <select id="modelExcelType" onchange="modelExcelType()" title="请选择Excel模板类型"><option value="0" title="默认勾选的报表表头作为模板">默认</option> <option value="1" title="上传Excel模板文件,多行表头使用">上传模板</option> <option value="2" title="根据用户归属地下载相关数据">Sql取数</option></select></span>
           <span id="uploadFile" style="display:none;"><input type="button" class="b_foot"  value="上传" class="btn2" id="upload_button"/> <a href="javascript:void(0)" id="modelExcel">暂无</a> </span> 
           <input id="modelExcel2" type="text" style="display:none;width:320px;"  value="select group_id,group_name from pods.t_cde_chl_msg t where t.group_id_3=:'24326' order by group_id" title="请修改sql,根据用户归属地下载相关模板数据"/></div>  
         <div style="margin-top:2px;"><span style="font-size:12px;">名称:</span><span><input type="text" id="reportName" value="请输入名称" style="width:100px;"/></span>&#12288;
         	<span style="margin-top:2px;" title="存放目录" id="reportPath">存放目录：<input type ="text" onclick="showMenu(this);" id="menuId" /> </span></div>
         <div style="margin-top:2px;"> <a href="javascript:void(0);" class="fn-option" onclick="viewConfig()"><span>预览</span></a>&#12288;<a href="javascript:void(0);" class="fn-option" onclick="saveConfigAll()"><span>保存</span></a>
	    	 <span id="loading2" style="display:none;margin-left:5px;"><img src="../images/loading/loading2.gif" width="18" height="18" class=""/>&nbsp;<span id="loadWord2" style="font-weight:none"> </span></span>
	    	 <span id="alertWord2" style="display:none;margin-left:5px;color:red"></span> 
	   	 </div>
    </td>
    <td><textarea id="reportExplain" style="width:98%;height:50px;font-size:12px;">备注说明</textarea></td>
  </tr>	     
 </table>
</div>
<iframe id="viewReportID" src=""  width="100%" height="320" frameborder="0" style="display:none;margin-top:25px;"></iframe> <!-- ../../importExcel_list.jsp?reportID=123 -->

<input id="loginno" type="hidden" value=""/>  
<input id="action" name="action" type="hidden" value="<%=path%>/page/reportConfig!findTabelName.action"/> 
<input id="tabNow" name="tabNow" type="hidden" value="0"/>
<input id="groupNo" name="groupNo" type="hidden" value=""/>  
<input id="reportID" name="reportID" type="hidden" value=""/> 
<input id="pageTitlesHtml" type="hidden" value=""/> <!-- 单行 -->
<input id="pageTitlesHtml2" type="hidden" value=""/> <!-- 多行 -->
<div id="menuContent" style="display:none; position: absolute;z-index: 99">
	<ul id="treeDemo" class="ztree"  style="border: 1px solid #617775;background: white;width:140px;height:220px;overflow-y:scroll;overflow-x:auto;"></ul>
</div>
</body>
</html>