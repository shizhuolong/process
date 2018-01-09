<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>云南联通2I2C地推情况说明</title>
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
            <h2>指标说明：</h2>
            <p>1、地推分类：轻触点指沃扫码中有效二二维码渠道数，地推专员指腾讯地推<p/>
            <p> 本部包含“临促”两字的发展人，仙缘先锋指校园指点渠道的发展量，其他部分均计全员。</p>
            <p>2、有效能数：指发展人数归属当天有首充的发展人数，首充金额大于10元。</p>
            <p>3、当天发展量：指发展人归属当天有销量人数，首充金额大于10元。</p>
            <p>4、累计发展量：指当月累计发展量。</p>
        </div>
    </div>
</body>
<script  type="text/javascript">
    $(".instructions").find("P").css({"text-indent":"40px","font-size":"14px","line-height":"150%"});
</script>
</html>