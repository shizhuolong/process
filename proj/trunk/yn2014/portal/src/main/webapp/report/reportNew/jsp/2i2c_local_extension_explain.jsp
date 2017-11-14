<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>2I2C地推推广说明</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
</head>
<body class="" >
    <div>
        <div class="instructions">
            <h2>说明</h2>
            <p>1、以上数据从10月20日开始计算。</p>
            <p>2、公司员工首充激励计入人工成本，推广费计入营销成本。</p>
            <p>3、非公司员工推广费、首充激励均计入营销成本。</p>
            <p>4、有销量区县/营服数指累计首充用户达到10户以上的区县/营服。</p>
            <p>5、有销量人数指单个发展人发展2户以上，并首充20元以上的人数。</p>
            <p>6、当天指选择首充查询的结束时间数据，当月指选择查询的开始至结束间数据，<br>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当月指2017年10月20日至查询的结束时间。</p>
        </div>
    </div>
</body>
<script  type="text/javascript">
    $(".instructions").find("P").css({"text-indent":"40px","font-size":"14px","line-height":"150%"});
</script>
</html>