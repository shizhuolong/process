<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
     User user = UserHolder.getCurrentLoginUser();
     Org org = user.getOrg();
     String path = request.getContextPath();
     Calendar ca=Calendar.getInstance();
 	 ca.add(Calendar.DATE, 0);
 	 String time=new SimpleDateFormat("yyyyMMdd HH:mm").format(ca.getTime());
 	 String endDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
 	 ca.add(Calendar.DATE, -7);
 	 String startDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>销售终端管理</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css">
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=path%>/portal/channelManagement/js/sales_manager_list.js?v=78"></script>
<script type="text/javascript">
	var privileges='<%=user.getAuthoritiesStr()%>';
	function isGrantedNew(role){
	    if(privileges.toString().indexOf("ROLE_SUPERMANAGER")!=-1){
	        return true;
	    }
	    if(privileges.toString().indexOf(role)==-1){
	        return false;
	    }
	    return true;
	}
</script>
</head>
<body style="overflow-x:auto;margin:5px;margin-top:0;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="username" value="<%=user.getUsername()%>">
	<div class="search-div">
				<table style="margin: 0px 0; border:none;width:100%;font-size:100%">
					<tr>
						<td style="text-align:right;width:50px;">开始：</td>
						<td>
							<input type="text"  class="Wdate default-text-input wper80" readonly="readonly"
							onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})" value="<%=startDate%>" id="startDate">
						</td>
						<td style="text-align:right;width:50px;">结束：</td>
						<td>
							<input type="text"  class="Wdate default-text-input wper80" readonly="readonly"
							onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})" value="<%=endDate%>" id="endDate">
						</td>
						<td style="text-align:right;width:50px;">地市：</td>
						<td>
						     <select name="regionCode" id="regionCode" class="default-text-input wper100">
								<option value=''>请选择</option>
						     </select>
					    </td>
					    <td style="text-align:right;width:50px;">营业厅：</td>
						<td>
						     <input name="hallName" id="hallName" class="default-text-input wper100"/>
					    </td>
					     <td style="text-align:right;width:50px;">串号：</td>
						<td>
						     <input name="s_zd_iemi" id="s_zd_iemi" class="default-text-input wper100"/>
					    </td>
					    <td style="text-align:right;width:60px;">订单类型：</td>
						<td style="width:80px;">
						     <select name="order_type" id="order_type" class="default-text-input wper100">
								<option value=''>全部</option>
								<option value='0' selected>销售单</option>
								<option value='1'>换机单</option>
								<option value='2'>退货单</option>
						     </select>
					    </td>
					    <td width="1%">
						   <a class="default-btn" href="#" id="searchBtn"
						    style="float: right; margin-right: 18px;">查询</a>
					    </td>
					    <td width="1%" id="addTd">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="addBtn" onclick="add()">新增</a>
					    </td> 
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="exportBtn" onclick="exportData()">导出</a>
					    </td>
					</tr>
				</table>
	</div>
	<div id="lchcontent" style="margin-top:5px;">
	</div>
	<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
	</div>
	
	<div style="display:none;" id="addDiv">
	   <table class="default-table sticky-enabled" style="width:100%;border-collapse:separate; border-spacing:0px 20px;">
	       <form id="addForm" method="post">
	         <input type="hidden" id="group_id_1" name="resultMap.group_id_1"/>
	         <input type="hidden" id="order_code" name="resultMap.order_code"/>
	         <input type="hidden" id="old_zd_iemi" name="resultMap.old_zd_iemi"/>
	         <input type="hidden" id="is_back" name="resultMap.is_back"/>
 		       <tr>
 		          <td>终端串号</td>
		          <td>
			          <input id="zd_iemi" name="resultMap.zd_iemi" required="true" class="easyui-validatebox" missingMessage="终端串号不能为空"/>
		          </td>
		          <td>地市</td>
		          <td>
			          <input id="group_id_1_name" readonly="true" name="resultMap.group_id_1_name" required="true" class="easyui-validatebox" missingMessage="地市不能为空"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>营业厅</td>
		          <td>
			          <input id="yyt_hq_name" readonly="true" name="resultMap.yyt_hq_name" required="true" class="easyui-validatebox" missingMessage="营业厅不能为空"/>
		          </td>
		          <td>营业厅编码</td>
		          <td>
			          <input id="yyt_chan_code" readonly="true" name="resultMap.yyt_chan_code" required="true" class="easyui-validatebox" missingMessage="营业厅编码不能为空"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>供应商</td>
		          <td>
			          <input id="sup_hq_name" readonly="true" name="resultMap.sup_hq_name" required="true" class="easyui-validatebox" missingMessage="供应商不能为空"/>
		          </td>
		          <td>供应商编码</td>
		          <td>
			          <input id="sup_hq_code" readonly="true" name="resultMap.sup_hq_code" class="easyui-validatebox"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>是否调价</td>
		          <td>
			          <select id="is_change_price" name="resultMap.is_change_price">
			            <option value="是">是</option>
			            <option value="否" selected>否</option>
			          </select>
		          </td>
		          <td>受理时间</td>
		          <td>
			          <input id="acc_time" style="width: 157px;" type="text" name="resultMap.acc_time" class="Wdate default-text-input wper80" readonly="true"
						value="<%=time%>" onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd HH:mm',isShowClear:false})">
		          </td>
		       </tr>
		       <tr>
 		          <td>终端品牌</td>
		          <td>
			          <input id="zd_brand" readonly="true" name="resultMap.zd_brand" required="true" class="easyui-validatebox" missingMessage="终端品牌不能为空"/>
		          </td>
		          <td>终端型号</td>
		          <td>
			          <input id="zd_types" readonly="true" name="resultMap.zd_types" required="true" class="easyui-validatebox" missingMessage="终端型号不能为空"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>进货价</td>
		          <td>
			          <input id="in_price" readonly="true" precision="2" name="resultMap.in_price" required="true" class="easyui-validatebox" missingMessage="进货价不能为空"/>
		          </td>
		          <td>零售价</td>
		          <td>
			          <input id="out_price" readonly="true" precision="2" name="resultMap.out_price" required="true" class="easyui-validatebox" missingMessage="零售价不能为空"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>销售毛利</td>
		          <td>
			          <input id="sale_ml" readonly="true" precision="2" name="resultMap.sale_ml" required="true" class="easyui-validatebox"/>
		          </td>
		          <td>营业厅毛利</td>
		          <td>
			          <input id="yyt_ml" readonly="true" precision="2" name="resultMap.yyt_ml" required="true" class="easyui-validatebox"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>营销成本</td>
		          <td>
			          <input id="yx_cost" readonly="true" precision="2" name="resultMap.yx_cost" required="true" class="easyui-validatebox"/>
		          </td>
		          <td>营业厅利润</td>
		          <td>
			          <input id="yyt_profit" readonly="true" precision="2" name="resultMap.yyt_profit" required="true" class="easyui-validatebox"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>用户号码</td>
		          <td>
			          <input id="service_num" readonly="true" name="resultMap.service_num" />
		          </td>
		          <td>发展人信息</td>
		          <td>
			          <input id="developer_id" name="resultMap.developer_id" required="true" class="easyui-validatebox" missingMessage="发展人信息不能为空"/>
		          </td>
		       </tr>
		       <tr>
 		          <td>营业员工位</td>
		          <td>
			          <input id="operator_id" name="resultMap.operator_id" required="true" class="easyui-validatebox" missingMessage="营业员工位不能为空" />
		          </td>
		       </tr>
		       <tr>
	                <td colspan="4">
		                <a href="#" style="margin-left: 200px;" class="default-btn fLeft mr10" id="saveBtn" onclick="save();">提交</a>
	                </td>
			   </tr>
	       </form>
	     </table> 
	</div>
  </body>
</html>