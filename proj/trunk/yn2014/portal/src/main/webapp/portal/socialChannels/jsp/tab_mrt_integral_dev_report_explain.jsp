<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
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
			<h2>社会分等分级优化评级规则（新规则）：</h2>
			<p>评级周期：<i>3个月</i></p>
			<p>评级时间：每年1月 4月 7月 10月进行等级评定，即12月 3月 6月 9月 报表账期</p>
			<p>评级规则：合作月份、新增渠道、历史渠道变更渠道属性</p>
			<p>评级说明：如若在非评级时间新增的社会实体属性渠道，默认待评等级</p>
			<p>1、合作月份=0，当如新增渠道标识，在评级时间</p>
			<p>公式：（评定期最近一个月实算积分)/1 >=20 则为C级，否则则为D级</p>
			<p>2、合作月份=1，非当月新增渠道标识，在评级时间</p>
			<p>公式： (评定期最近两个月实算积分)/2 >=20 则为C级，否则则为D级</p>
			<p>3、合作月份>=2且合作月份<=5，非当月新增渠道标识，在评级时间</p>
			<p>公式：(评定期最近三个月实算积分)/3 >=20 则为C级，否则则为D级</p>
			<p>4、合作月份>=6,实属老渠道,非本月新增渠道，在评级时间</p>
			<p>公式：(评定期最近三个月实算积分)/3 >=20 则为C级</p>
			<p>(评定期最近三个月实算积分)/3 >=300 则为B级</p>
			<p>(评定期最近三个月实算积分)/3 >=600 则为A级</p>
			<p>(评定期最近三个月实算积分)/3 >=1000 则为S级 否则则为D级</p>
			<p>5、合作月份>=6,实属老渠道,属本月新增渠道，在评级时间</p>
			<p>公式：当期实算积分/1 >=20 则为C级，否则则为D级</p>
			<p>6、非评级时间，渠道的等级则延续上一次评级的等级作为标准</p>
			<p>即：201603账期评级渠道为A级，则201604 201605两个账期则延续201603账期等级，即为A级</p>
			<h2>二、计算规则：</h2>
			<p>实算积分 = 当期计算积分+当期清算积分-当期延付积分+当期延付释放积分</p>
			<p>延付积分 = 黑匣子标识的用户计算积分</p>
			<p>延付释放积分 = 历史账期黑匣子标识，在当前账期取消黑匣子标识的用户计算积分，新增延付释放科目 SH1016</p>
			<h2>三、兑换规则:</h2>
			<p>S级 1.3倍 5元/分</p>
			<p>A级 1.2倍 5元/分</p>
			<p>B级 1.1倍 5元/分</p>
			<p>C级 1.0倍 5元/分</p>
			<p>D级 不可兑换</p>
			<p>待评 不可兑换</p>
			<h2>四、清算规则:</h2>
			<p>三无、极低用户占比 = 三无极低用户/当渠道发展用户数</p>
			<p>15%≦三无、极低用户占比<19% 清算积分=三无极低用户积分*0.4</p>
			<p>19%≦三无、极低用户占比<23% 清算积分=三无极低用户积分计算积分*0.8</p>
			<p>23%≦三无、极低用户占比 清算积分=三无极低用户积分计算积分*1.0</p>
		</div>
		<hr style="height:5px;background-color:#FF8C00;border:none">
		<div class="instructions">
			<h2>社会分等分级评等级备注（历史规则）：</h2>
			<p>新渠道评等级（第一步执行）</p>
			<p>1、合作月份<= 3个月 默认待评 补贴按70%计算</p>
			<p>2、合作月份>= 4个月 且 合作月份 <= 6个月取临近3个月平均积分 评定等级</p>
			<p>例：合作月份为4个月 ，则取 2月 3月 4月平均积分评定渠道等级</p>
			<p>等级标准：C D 2个等级</p>
			<p>C级 平均3个月积分>=20</p>
			<p>D级 平均3个月积分 < 20</p>
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