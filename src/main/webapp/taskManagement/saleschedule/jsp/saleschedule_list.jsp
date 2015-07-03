<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	Calendar c=Calendar.getInstance();
	String year=new SimpleDateFormat("yyyy").format(c.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>销量排产</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath() %>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath() %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=request.getContextPath() %>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath() %>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath() %>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath() %>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath() %>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/platform/theme/js/jquery.ba-throttle-debounce.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/platform/theme/js/jquery.stickyheader.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
</head>
<body>
	<div id="smartForm">
		<div id="container">
			<div id="content">
				<div id="cc" style="width:100%;height:350px;">
					<div data-options="region:'center'">
						<div id="main" class="clearfix">
							<div class="main-block">
								<div class="title"><i></i>销量排产任务</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
                                    <tr>
                                       <th style="width: 50px;">年份：</th>
                                       <td style="width: 80px;">
                                       		<input readonly="readonly" type="text" style="width:80px" class="Wdate" id="sale_search_year_1"  name="sale_datepi"  value="<%=year %>"  onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyy'})"/>
                    					</td>
                                        <th style="width: 50px;">状态：</th>
                                        <td style="width: 120px;">
                                        	<select class="default-text-input w90" name="">
                                        		<option value="">全部</option>
                                        		<option value="审核中">审核中</option>
                                        		<option value="未下发">未下发</option>
                                        	</select>
                                        </td>
                                        <td>
                                        	<a class="default-btn fLeft mr10" href="#">查询</a>
                                        	<a class="default-gree-btn fRight mr10" href="<%=request.getContextPath()%>/saleSchedule/sale-schedule!addSaleScheduleInput.action">新增</a>
                                        </td>
                                    </tr>
                                </table>
                                <div class="default-dt dt-autoH">
                               	<div class="no-js-table">
                                    <table class="overflow-y">
                                    	<thead>
                                            <tr>
                                                <th>地市</th>
                                                <th>时间</th>
                                                <th>创建人</th>
                                                <th>创建时间</th>
                                                <th>状态</th>
                                                <th>指标名称</th>
                                                <th>业务类型</th>
                                                <th>任务数</th>
                                                <th>操作</th>
                                                <th>查看</th>
                                                <th>查看历史</th>
                                            </tr>
                                         </thead>
                                         <tbody>
                                            <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                             <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                            <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                            <tr>
                                                <td>Sample #1</td><td>23</td><td>88</td><td>8</td><td>2</td><td>67</td><td>83</td><td>81</td><td>37</td><td>91</td><td>96</td>
                                            </tr>
                                         </tbody>
                                         <tr>
											<td colspan="11">
												</div>
													<div class="page_count">
														<div class="page_count_left">
															共有 <span id="totalCount"></span> 条数据
														</div>
						
														<div class="page_count_right">
															<div id="pagination"></div>
														</div>
													</div>
												</div>
											</td>
										</tr>
                                    </table>
                                 </div>
                            </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>