var nowData = [];
var title=[["HR编码","人员姓名","人员薪酬（元）","","","",""],
           ["","","固定薪酬","基础KPI绩效","积分提成奖励","专项奖励","合计"]
];
var field=["HR_ID","NAME","FIXED_SALARY","BASE_SALARY","JF_SALARY","SPECIAL_AWARD","ALL_SALARY"];
var orderBy = '';
var report = null;
$(function() {
	//listRegions();
	report = new LchReport({
		title : title,
		field : field,
		rowParams : ["DEAL_DATE","HR_ID","UNIT_ID","USER_TYPE"],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 12;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var time=$("#time").val();
	var month=$("#month").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
//条件
	var sql = " from PMRT.TB_MRT_JCDY_HR_SALARY_MON t where 1=1 ";
	if(month!=''){
		sql+=" and t.DEAL_DATE= '"+month+"'";
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else {
		//1-营服中心责任人、6-营业厅主人、7-行业总监
		var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.TAB_PORTAL_QJ_PERSON T WHERE t.deal_date='"+month+"' and T.HR_ID='"+hrId+"'";///---
		var rd=query(rsql);
		if(rd&&rd.length){
			var hrsql="";
			for(var i=0;i<rd.length;i++){
				var v=rd[i]["USER_CODE"];
				var tsql="";
				if(v==1){
					tsql+=" select tt.hr_no                                                      ";
					tsql+="   from pmrt.TB_JCDY_JF_ALL_MON tt                                    ";
					tsql+=" where tt.unit_id = '"+code+"'                                        ";
					tsql+="   and tt.deal_date = '"+month+"'                                     ";
					tsql+=" union                                                                ";
					tsql+=" select '"+hrId+"' from dual  ";
				}else if(v==6){
					tsql+=" SELECT distinct hr_id                                                ";
					tsql+="   FROM portal.tab_portal_mag_person                                  ";
					tsql+=" where hq_chan_code in (                                              ";
					tsql+="   SELECT distinct hq_chan_code                                       ";
					tsql+="     FROM portal.tab_portal_mag_person                                ";
					tsql+="   where hr_id = '"+hrId+"'   and deal_date='"+month+"'                ";///---
					tsql+="     and hq_chan_code is not null                                     ";
					tsql+=" )  and deal_date='"+month+"'                                          ";///---      
				}else if(v==7){
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a                                ";
					tsql+=" where a.f_hr_id in (                                                 ";
					tsql+="       select hr_id                                                   ";
					tsql+="         from portal.tab_portal_grp_person t                          ";
					tsql+="       where t.user_type = 1   and t.deal_date='"+month+"'             ";///---
					tsql+=" )  and a.deal_date='"+month+"'                                        ";///---
					tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
					tsql+=" union                                                                ";
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"' and t.deal_date='"+month+"'      ";///---
				}
				if(tsql!=""&&hrsql!=""){
					hrsql+=" union "+tsql;
				}else{
					hrsql+=tsql;
				}
			}
			if(hrsql!=""){
				sql+=" and t.HR_ID in("+hrsql+")";
			}else{
				sql+=" and t.HR_ID='"+hrId+"'";
			}
		}else{
			sql+=" and t.HR_ID='"+hrId+"'";
		}
	}
 	var csql = sql;
	var cdata = query("select count(*) total" + csql);
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select * " + sql;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
	
	$("#lch_DataBody").find("TR").each(function(){
		//固定薪酬
		var $gdTd=$(this).find("TD:eq(2)");
		if(!$gdTd.text()||$.trim($gdTd.text())==''||$.trim($gdTd.text())=='0'){}else{
			$gdTd.html("<a href='#' >"+$gdTd.text()+"</a>");
			$gdTd.click(function(){
				var date=$gdTd.parent().attr("deal_date");
				var hrId=$gdTd.parent().attr("hr_id");
				var sql="select t.*,case t.user_type when 2 then '外包' when  1 then '合同内' end myuser_type  from pods.TB_ODS_JCDY_HR_SALARY t where t.hr_no='"+hrId+"' and t.deal_date='"+date+"'";
				var d=query(sql);
				if(d&&d.length){
					var h="<div style='padding:12px;padding-right:12px;max-height:300px;width:400px;overflow-y:auto;overflow-x:hidden;'>"
						+"<table><thead class='lch_DataHead lch_DataBody'>"
		 
						+"<tr><th style='width:100px;text-align:left;'>员工工号</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["HR_NO"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>姓名</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["USER_NAME"])+"</td></tr>"
						// +"<tr><th style='width:100px;text-align:left;'>岗位等级</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["POST_LEVEL"])+"</td></tr>"
						// +"<tr><th style='width:100px;text-align:left;'>薪档</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["SALARY_LEVEL"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>岗位工资</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["POST_SALARY"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>综合补贴</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["GENERAL_SUBS"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>合计</th><td style='width:100px;text-align:center;'>"+(parseFloat(isNull(d[0]["GENERAL_SUBS"]?d[0]["GENERAL_SUBS"]:0))+parseFloat(isNull(d[0]["POST_SALARY"]?d[0]["POST_SALARY"]:0)))+"</td></tr>"
						+"</thead></table></div>";
					art.dialog({
					    title: '固定薪酬详细信息',
					    content: h,
					    padding: 0,
					    lock:true
					});
				}else{
					alert("获取固定薪酬详细信息失败");
				}
			});
		}
		//专项奖励     专项奖励=绩效工资非经常项目1+绩效工资非经常项目2+其他奖励1+其他奖励2
		var $zxTd=$(this).find("TD:eq(5)");
		if(!$zxTd.text()||$.trim($zxTd.text())==''||$.trim($zxTd.text())=='0'){}else{
			$zxTd.html("<a href='#' >"+$zxTd.text()+"</a>");
			$zxTd.click(function(){
				var date=$zxTd.parent().attr("deal_date");
				var hrId=$zxTd.parent().attr("hr_id");
				var sql="select t.*,case t.user_type when 2 then '外包' when  1 then '合同内' end myuser_type  from pods.TB_ODS_JCDY_HR_SALARY t where t.hr_no='"+hrId+"' and t.deal_date='"+date+"'";
				var d=query(sql);
				if(d&&d.length){
					var h="<div style='padding:12px;padding-right:12px;max-height:300px;width:400px;overflow-y:auto;overflow-x:hidden;'>"
						+"<table><thead class='lch_DataHead lch_DataBody'>"
		 
						+"<tr><th style='width:100px;text-align:left;'>员工工号</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["HR_NO"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>姓名</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["USER_NAME"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>绩效工资非经常项目1</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["MERIT_PAY_1"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>绩效工资非经常项目2</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["MERIT_PAY_2"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>其他奖励1</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["OTHER_PAY_1"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>其他奖励2</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["OTHER_PAY_2"])+"</td></tr>"
						 +"<tr><th style='width:100px;text-align:left;'>合计</th><td style='width:100px;text-align:center;'>"+(parseFloat(isNull(d[0]["MERIT_PAY_1"]?d[0]["MERIT_PAY_1"]:0))+parseFloat(isNull(d[0]["MERIT_PAY_2"]?d[0]["MERIT_PAY_2"]:0))+parseFloat(isNull(d[0]["OTHER_PAY_1"]?d[0]["OTHER_PAY_1"]:0))+parseFloat(isNull(d[0]["OTHER_PAY_2"]?d[0]["OTHER_PAY_2"]:0)))+"</td></tr>"
						+"</thead></table></div>";
					art.dialog({
					    title: '专项奖励详细信息',
					    content: h,
					    padding: 0,
					    lock:true
					});
				}else{
					alert("获取专项奖励详细信息失败");
				}
			});
		}
		//基础KPI绩效
		var $kpiTd=$(this).find("TD:eq(3)");
		if(!$kpiTd.text()||$.trim($kpiTd.text())==''||$.trim($kpiTd.text())=='0'){}else{
			$kpiTd.html("<a href='#' >"+$kpiTd.text()+"</a>");
			$kpiTd.click(function(){
				var date=$kpiTd.parent().attr("deal_date");
				var hrId=$kpiTd.parent().attr("hr_id");
				var uId=$kpiTd.parent().attr("unit_id");
				var where ="  where t.deal_date='"+date+"' and t.unit_id='"+uId+"' and t.hr_id='"+hrId+"' ";
				var sql="";
				
				sql+="  select HR_ID,                                                                             ";
				sql+="         KPI_NAME,                                                                          ";
				sql+="         KPI_WEIGHT*100||'%' KPI_WEIGHT,                                                                        ";
				sql+="         KPI_VALUE KPI_VALUE,                                                                         ";
				sql+="         nvl(KPI_WEIGHT, 0) * nvl(KPI_VALUE, 0) MUT_VALUE,0 am12,0 ammon,0 BUDGET_ML,0 BUDEGET_COST, 2 ordernum                        ";
				sql+="    from PODS.TB_JCDY_KPI_RULE_MON t                                                        ";
				sql+=where;
				sql+="  union                                                                                     ";
				sql+="  select nvl(t.task_dev, 0) || '',                                                         ";
				sql+="         nvl(t.dev_count, 0) || '',                                                        ";
				sql+="         nvl(t.task_income, 0)|| '',                                                            ";
				sql+="         nvl(t.total_fee, 0) ,nvl(t.owefee, 0),nvl(t.AMOUNT_12,0),nvl(t.AMOUNT_MONTH,0),                                                              ";
				sql+="        nvl(t.BUDGET_ML,0),nvl(t.BUDEGET_COST,0),1 ordernum                                                       ";
				sql+="    from PODS.TB_ODS_KPI_ALL_MON t                                                         ";
				sql+=where;
				sql+="  UNION                                                                                     ";
				sql+="  select HR_ID, NULL, BASE_SALARY|| '', t.MUT_VALUE , t.MUT_VALUE * BASE_SALARY,0,0,0,0,3 ordernum      ";
				sql+="    from PODS.TB_JCDY_KPI_RESULT_MON t,                                                     ";
				sql+="         (select '',                                                                        ";
				sql+="                 '',                                                                        ";
				sql+="                 0,                                                                         ";
				sql+="                 0,                                                                         ";
				sql+="                 sum(nvl(KPI_WEIGHT, 0) * nvl(KPI_VALUE, 0)) MUT_VALUE                      ";
				sql+="            from PODS.TB_JCDY_KPI_RULE_MON t                                                ";
				sql+=where;
				sql+="           group by t.deal_date, t.unit_id, t.hr_id) t                                     ";
				sql+=where;
				
				var d=query("select * from ("+  sql+") order by ordernum ");
				var zszb=query("select KPI_NAME||':'||KPI_SCORE zszb from PMRT.TAB_MRT_JCDY_KPI_QJ_MON t where t.deal_date='"+date+"' and t.hr_id='"+hrId+"'");
				var zs1="";
				var zs2="";
				if(zszb&&zszb.length){
					for(var j=0;j<zszb.length;j++){
						if(j<2){
							zs1+="<td>"+zszb[j]["ZSZB"]+"</td>";
						}else{
							zs2+="<td>"+zszb[j]["ZSZB"]+"</td>";
						}
					}
				}
				if(zs2!=''){
					zs2="<tr>"+zs2+"</tr>"
				}
				if(d&&d.length){
					var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
						+"<table><tbody class='lch_DataBody'><tr><td>HR编码:"+isNull(d[1]["HR_ID"])+"</td><td>发展任务数:"+isNull(d[0]["HR_ID"])+"</td><td>实际发展数:"+isNull(d[0]["KPI_NAME"])+"</td><td>收入任务:"+isNull(d[0]["KPI_WEIGHT"])+"</td><td>出账收入:"+isNull(d[0]["KPI_VALUE"])+"</td><td>欠费:"+isNull(d[0]["MUT_VALUE"])+"</td><tr>"
						+"<tr><td>去年12月分收入:"+isNull(d[0]["AM12"])+"</td><td>本年累计月收入:"+isNull(d[0]["AMMON"])+"</td><td>毛利:"+isNull(d[0]["BUDGET_ML"])+"</td><td>成本预算:"+isNull(d[0]["BUDEGET_COST"])+"</td>"+zs1+"</tr>"+zs2+"<tbody></table>"
						+"<table><thead class='lch_DataHead'><tr><th>KPI指标名称</th><th>KPI指标权重</th><th>KPI指标值</th><th>KPI指标值*KPI指标权重</th></tr></thead><tbody class='lch_DataBody'>";
						for(var i=1;i<d.length;i++){
								if(i==d.length-1){
									h+="<tr><td>KPI基础薪酬合计"
									+"</td><td>基础薪酬:"+isNull(d[i]["KPI_WEIGHT"])
									+"</td><td>指标合计:"+isNull(d[i]["KPI_VALUE"])
									+"</td><td>KPI绩效:"+isNull(d[i]["MUT_VALUE"])
									+"</td></tr>";
								}else{
									//h+="<tr><td>"+isNull(d[i]["HR_ID"])
									h+="<tr><td>"+isNull(d[i]["KPI_NAME"])
									+"</td><td>"+isNull(d[i]["KPI_WEIGHT"])
									+"</td><td>"+isNull(d[i]["KPI_VALUE"])
									+"</td><td>"+isNull(d[i]["MUT_VALUE"])
									+"</td></tr>";
								}
								
						}
						
						h+="</tbody>"
						+"</table>"
						+"<br/><a href='#' onclick='javascript: parent.openWindow(\"KPI指标详细说明\",\"kpidesc\",\""+$("#ctx").val()+"/report/devIncome/jsp/kpidesc.htm\");'>查看KPI指标详细说明</a><br/>"
						+"</div>";
						if(d.length>=1){
							art.dialog({
							    title: '基础KPI绩效详细信息',
							    content: h,
							    padding: 0,
							    lock:true
							});
						}
				}else{
					alert("获取基础KPI绩效详细信息失败");
				}
			});
		}
		
		//业绩提成单击处理
		var $yjTd=$(this).find("TD:eq(4)");
		if(!$yjTd.text()||$.trim($yjTd.text())==''||$.trim($yjTd.text())=='0'){
			return;
		}
		$yjTd.html("<a href='#' >"+$yjTd.text()+"</a>");
		$yjTd.click(function(){
			var date=$yjTd.parent().attr("deal_date");
			var hrId=$yjTd.parent().attr("hr_id");
			var uId=$yjTd.parent().attr("unit_id");
			var js=$yjTd.parent().attr("user_type");
			var jss=[];
			var isResp=0;
			if(js&&js.length){
				jss=js.split(",");
				for(var i=0;i<jss.length;i++){
					if($.trim(jss[i])=='营服中心责任人'){
						isResp=1;
						break;
					}
				}
				for(var i=0;i<jss.length;i++){
					if($.trim(jss[i])=='营业厅主任'){
						if(isResp!=1){
							isResp=2;
						}
						break;
					}
				}
			}
			var sql="";
			if(isResp==0){
				//判断
				sql="";
				sql+=" select '销售积分' type,t.HJXSJF sl,t.HQ_ALLJF tj,tr.UNIT_RATIO qy,t.UNIT_ALLJF qytj,t.UNIT_ALLJF*10 sumxc from pmrt.TB_JCDY_JF_ALL_MON t left join PCDE.TAB_CDE_GROUP_CODE tr on tr.unit_id=t.unit_id ";
				sql+=" WHERE T.HR_NO='"+hrId+"' AND DEAL_DATE='"+date+"'  ";//AND HJXSJF>0
				sql+=" UNION ALL ";
				sql+=" select '受理积分' type, t.SL_ALLJF sl,t.SL_SVR_ALL_CRE tj,tr.UNIT_RATIO qy,t.UNIT_SL_ALLJF qytj,t.UNIT_SL_ALLJF*10 sumxc from pmrt.TB_JCDY_JF_ALL_MON t left join PCDE.TAB_CDE_GROUP_CODE tr on tr.unit_id=t.unit_id ";
				sql+=" WHERE T.HR_NO='"+hrId+"' AND DEAL_DATE='"+date+"' ";//AND SL_ALLJF>0 
				sql+=" UNION ALL ";
				sql+=" select '维系积分' type, CRE sl,HQ_CRE tj,tr.unit_ratio qy,UNIT_CRE qytj,UNIT_CRE*10  sumxc from pmrt.TB_MRT_JCDY_WX_ALL_MON t left join PCDE.TAB_CDE_GROUP_CODE tr on tr.unit_id=t.unit_id ";
				sql+=" WHERE T.HR_ID='"+hrId+"' AND DEAL_DATE='"+date+"' ";
				
				
				var d=query(sql);
				
				if(d&&d.length){
					var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
						+"<table><thead class='lch_DataHead'><tr><th>积分类型</th><th>原始积分</th><th>渠道（服务）调节后积分</th><th>区域系数</th><th>区域调节后积分</th><th>积分提成奖励（元）</th></tr></thead><tbody class='lch_DataBody'>";
						var sh="";
						var sumqy=0;
						var sumxc=0;
						for(var i=0;i<d.length;i++){
								h+="<tr><td>"+isNull(d[i]["TYPE"])
								+"</td><td>"+isNull(d[i]["SL"])
								+"</td><td>"+isNull(d[i]["TJ"])
								+"</td><td>"+isNull(d[i]["QY"])
								+"</td><td>"+isNull(d[i]["QYTJ"])
								+"</td><td>"+isNull(d[i]["SUMXC"])
								+"</td></tr>";
								sumqy+=d[i]["QYTJ"];
								sumxc+=d[i]["SUMXC"];
						}
						
						if(d.length>=2){
							sh+="<tr><td colspan='4' style='text-align:center;'>合计"
							+"</td><td>"+roundN(sumqy,2)
							+"</td><td>"+roundN(sumxc,2)
							+"</td></tr>";
						}
						h+=sh+"</tbody>"
						+"</table>"
						+"<font color='red' size='2'>业绩提成（积分薪酬）="
						+"[(销售积分×渠道调节系数×区域调节系数)+(受理积分×服务调节系数×区域调节系数)+(专租线提成×渠道调节系数×区域调节系数)+(维系积分×渠道或服务调节系数×区域调节系数)]×积分单价<br/>"
						+"备：以上积分中专租线提成已包括在销售积分中，当前积分单价=10元\/分</font><br/>"
						+"</div>";
						if(d.length>=1){
							art.dialog({
							    title: '业绩提成详细信息',
							    content: h,
							    padding: 0,
							    lock:true
							});
						}
				}else{
					alert("获取业绩提成信息失败");
				}
			}else if(isResp==1){
				//系数获取
				var rasql="select nvl(t.unit_manager_ratio,1) radio from PCDE.TAB_CDE_GROUP_CODE t where t.unit_id='"+uId+"'";
				var rad=query(rasql);
				var radio=1;
				if(rad&&rad.length){
					radio=rad[0]["RADIO"];
				}
				//营服中心负责人单独处理
				sql="";
				sql+="   select t.hr_id,                                                ";
				sql+="          max(t.name) name,                                                 ";
				sql+="          round(sum(NVL(tr.UNIT_ALLJF, 0)), 2) xs,      ";
				sql+="          round(sum(nvl(tr.unit_sl_alljf, 0)), 2) sl,   ";
				sql+="          round(sum(nvl(tr.wx_unit_cre, 0)), 2) wx,   ";
				sql+="          round(sum(nvl(tr.all_jf, 0)), 2) xssl,        ";
				sql+="          round(sum(nvl(tr.all_jf_money, 0)), 2) xsslm  ";
				sql+="     from PMRT.TB_MRT_JCDY_HR_SALARY_MON t                        ";
				sql+="     left join (select *                                          ";
				sql+="                  from pmrt.TB_JCDY_JF_ALL_MON         ";//pmrt.TB_MRT_JCDY_SALUNIT_DETAIL_MON
				sql+="                 where deal_date = '"+date+"'                     ";
				sql+="                   and unit_id = '"+uId+"') tr                       ";
				sql+="       on tr.hr_no = t.hr_id                                      ";
				sql+="    where t.unit_id = '"+uId+"'                                   ";
				sql+="      and t.hr_id != '"+hrId+"'                                    ";
				sql+="      and t.deal_date = '"+date+"'   group by t.hr_id                             ";
				sql+="   union all                                                      ";
				sql+="   select null hr_id,                                             ";
				sql+="          '平均' name,                                              ";
				sql+="          round(avg(nvl(xs, 0)), 2) xs,            ";
				sql+="          round(avg(nvl(sl, 0)), 2) sl,            ";
				sql+="          round(avg(nvl(wx, 0)), 2) wx,            ";
				sql+="          round(avg(nvl(xssl, 0)), 2) xssl,        ";
				sql+="          round(avg(nvl(xsslm, 0)), 2)*3 xsslm       ";
				sql+="     from (select t.hr_id,                                        ";
				sql+="                  max(t.name) name,                                         ";
				sql+="                  sum(NVL(tr.UNIT_ALLJF, 0)) xs,                       ";
				sql+="                  sum(nvl(tr.unit_sl_alljf, 0)) sl,                    ";
				sql+="          		sum(nvl(tr.wx_unit_cre, 0))  wx,   ";
				sql+="                  sum(nvl(tr.all_jf, 0)) xssl,                         ";
				sql+="                  sum(nvl(tr.all_jf_money, 0)) xsslm                   ";
				sql+="             from PMRT.TB_MRT_JCDY_HR_SALARY_MON t                ";
				sql+="             left join (select *                                  ";
				sql+="                         from pmrt.TB_JCDY_JF_ALL_MON  ";
				sql+="                        where deal_date = '"+date+"'              ";
				sql+="                          and unit_id = '"+uId+"') tr                ";
				sql+="               on tr.hr_no = t.hr_id                              ";
				sql+="            where t.unit_id = '"+uId+"'                           ";
				sql+="              and t.hr_id != '"+hrId+"'                           ";
				sql+="              and t.deal_date = '"+date+"' group by t.hr_id)      ";
				sql+="                                                                  ";
				
				var d=query(sql);
				
				if(d&&d.length){
					var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
						+"<table><thead class='lch_DataHead'><tr><th>姓名</th><th>销售积分</th><th>受理积分</th><th>维系积分</th><th>总积分</th><th>积分提成奖励（元）</th></tr></thead><tbody class='lch_DataBody'>";
				
						for(var i=0;i<d.length;i++){
							if(d[i]["NAME"]=='平均'){
								h+="<tr><td>"+isNull(d[i]["NAME"])
								+"</td><td>"+isNull(d[i]["XS"])
								+"</td><td>"+isNull(d[i]["SL"])
								+"</td><td>"+isNull(d[i]["WX"])
								+"</td><td>"+isNull(d[i]["XSSL"])
								+"</td><td>"+isNull(d[i]["XSSLM"])
								+"</td></tr>";
							}else{
								h+="<tr><td>"+isNull(d[i]["NAME"])
								+"</td><td>"+isNull(d[i]["XS"])
								+"</td><td>"+isNull(d[i]["SL"])
								+"</td><td>"+isNull(d[i]["WX"])
								+"</td><td>"+isNull(d[i]["XSSL"])
								+"</td><td>"+isNull(d[i]["XSSLM"])
								+"</td></tr>";
							}	
						}
						h+="</tbody>"
						+"</table>"
						+"<font color='red' size='2'>备：营服中心负责人的业绩提成=该营服中心下所有人员（除负责人外）业绩提成的平均值*"+radio+"</font><br/>"
						+"</div>";
						if(d.length>=1){
							art.dialog({
							    title: '业绩提成详细信息',
							    content: h,
							    padding: 0,
							    lock:true
							});
						}
				}else{
					alert("获取业绩提成信息失败");
				}
			}else if(isResp==2){
				//系数获取
				var rasql="select nvl(t.unit_head_ratio,1) radio from PCDE.TAB_CDE_GROUP_CODE t where t.unit_id='"+uId+"'";
				var rad=query(rasql);
				var radio=1;
				if(rad&&rad.length){
					radio=rad[0]["RADIO"];
				}
				//营业厅主任单独处理
				sql="";
				sql+=" select t.hr_id, t.name, t.jf_salary jf                                ";
				sql+="   from (select t.*, 1 orderNum                                        ";
				sql+="           from PMRT.TB_MRT_JCDY_HR_SALARY_MON t                       ";
				sql+="          where deal_date = '"+date+"'                                   ";
				sql+="            and t.hr_id <> '"+hrId+"'                                   ";
				sql+="            and t.hr_id in                                             ";
				sql+="                (SELECT distinct hr_id                                 ";
				sql+="                   FROM portal.tab_portal_mag_person                   ";
				sql+="              where f_hr_id in( '"+hrId+"'))  and deal_date='"+date+"'                         ";
				sql+="         union                                                         ";
				sql+="         select t.*, 2 orderNum                                        ";
				sql+="           from PMRT.TB_MRT_JCDY_HR_SALARY_MON t                       ";
				sql+="          where deal_date = '"+date+"'                                   ";
				sql+="            and t.hr_id = '"+hrId+"') t                                 ";
				sql+="  order by t.orderNum                                                  ";
				
				
				var d=query(sql);
				
				if(d&&d.length){
					var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
						+"<table><thead class='lch_DataHead'><tr><th>姓名</th><th>积分薪酬</th></tr></thead><tbody class='lch_DataBody'>";
				
						for(var i=0;i<d.length;i++){
								h+="<tr><td>"+isNull(d[i]["NAME"])
								+"</td><td>"+isNull(d[i]["JF"])
								+"</td></tr>";	
						}
						h+="</tbody>"
						+"</table>"
						+"<font color='red' size='2'>备：营业厅主任的业绩提成=该营业厅下所有人员（包括营业厅主任）业绩提成的平均值*"+radio+"</font><br/>"
						+"</div>";
						if(d.length>=1){

							art.dialog({
							    title: '业绩提成详细信息',
							    content: h,
							    padding: 0,
							    lock:true
							});
						}
				}else{
					alert("获取业绩提成信息失败");
				}
			}
		});
	});
}


function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
