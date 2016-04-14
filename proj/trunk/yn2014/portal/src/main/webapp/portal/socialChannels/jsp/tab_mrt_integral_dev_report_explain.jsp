<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>当期兑换报表口径说明</title>
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
			<h2>社会分等分级评等级备注：</h2>
			<p>新渠道评等级（第一步执行）</p>
			<p>1、合作月份<= 3个月 默认待评 补贴按70%计算</p>
			<p>2、合作月份>= 4个月 且 合作月份 <= 6个月取临近3个月平均积分 评定等级</p>
			<p>例：合作月份为4个月 ，则取 2月 3月 4月平均积分评定渠道等级</p>
			<p>等级标准：C D 2个等级</p>
			<p>C级 平均3个月积分>=20</p>
			<p>D级 平均3个月积分 < 20</p>
		</div>
		<div class="instructions">
			<h2>老渠道评等级（第二步执行）</h2>
			<p>1、合作月份 >= 6个月 每年06月账期12月账期进行等级评定</p>
			<p>例：</p>
			<p>201603月账期，渠道合作月份>=6个月，则取2015年7月 - 12月的平均积分进行评定等级</p>
			<p>201606月账期，渠道合作月份>=6个月，则达到评级时间点，取201601月-201606月的6个月平均积分进行评定等级</p>
			<p>等级标准：S A B C D 5个等级</p>
			<p>S级 平均6个月积分>= 1000</p>
			<p>A级 平均6个月积分>=600</p>
			<p>B级 平均6个月积分 >= 300</p>
			<p>C级 平均6个月积分 >= 20</p>
			<p>D级 平均6个月积分 < 20</p>
		</div>
	</div>
</body>
<script  type="text/javascript">
	$(".instructions").find("P").css({"text-indent":"40px","font-size":"14px","line-height":"150%"});
</script>
</html>