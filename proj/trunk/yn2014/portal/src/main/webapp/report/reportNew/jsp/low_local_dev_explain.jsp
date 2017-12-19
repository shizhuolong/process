<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>双低说明</title>
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
            <p>1、以上数据从12月01号开始计算。</p>
            <p>2、根据首充时间，发展量算在对应的日期上。</p>
            <p>3、日首充发展数：当日首充>=10元的用户数。</p>
            <p>4、闪电购转化率：首充10及以上的闪电购订单数/闪电购总订单数（累计）。</p>
            <p>5、马上购转化率：首充10及以上的马上购订单数/马上购总订单数（累计）。</p>
            <p>6、日效能人数：当日首充>=20元的发展人数。</p>
        </div>
    </div>
</body>
<script  type="text/javascript">
    $(".instructions").find("P").css({"text-indent":"40px","font-size":"14px","line-height":"150%"});
</script>
</html>