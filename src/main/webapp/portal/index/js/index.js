$(function(){
	  // 路径配置
    require.config({
        paths: {
            echarts: $("#ctx").val()+'/portal/index/echarts/build/dist'
        }
    });
	var myMenu = new SDMenu("my_menu");
	myMenu.init();
	
	//查询收入与发展
	searchIncomeAndDev();
	//日发展量趋势图表
	showIncomeDevChart();
	//日收入趋势图表
	showNetIncomeChart();
	//最新公告
	listBulls();
	//文件下载列表
	indexDocList();
	//游离渠道数量
	freeChannel();
	//游离小区数量
	freeCommunity();
	//佣金下载
	searchYj();
	//实时发展
	searchRealTimeDev();
	//待办工单数
	qryTodoWorkOrderNum();
	//显示渠道分布地图
	showChanlMap();
	//显示基站地图分布
	showStationMap();
	//销售排名
	showXsph();
	//积分排名
	showJfph();
	//团队薪酬
	showJfxc();
	//我的积分
	showWdjf();
	
	//处理薪酬信息滚动条问题
	$("#topTabs").tabs({
		onSelect:function(title){
			if(title=='团队薪酬'){
				$("#xcfbWin").attr("src",$("#xcfbWin").attr("src"));
			}
		}
	});
});
//团队薪酬
//获取数据
function query(sql){
	var ls=[];
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
           "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			ls=data;
	   		}
	    }
	});
	return ls;
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

function showWdjf(){
	var startDate=$("#time").val();
	var deal_date=$("#xcday").val();
	var hrId=$("#hrId").val();
	var wdjf=query("SELECT SUM(NVL(T1.UNIT_ALLJF,0)) UNIT_ALLJF, SUM(NVL(T1.UNIT_SL_ALLJF,0)) UNIT_SL_ALLJF, SUM(NVL(T1.WX_UNIT_CRE,0)) WX_UNIT_CRE, SUM(NVL(T1.ALL_JF,0)) ALL_JF FROM PMRT.TB_JCDY_JF_ALL_DAY T1 WHERE T1.DEAL_DATE BETWEEN '"+startDate+"01' AND '"+deal_date+"' AND T1.HR_NO='"+hrId+"'");
	if(wdjf&&wdjf.length>0&&wdjf[0]){
		$("#unit_alljf").text("区域调节销售积分: "+wdjf[0].UNIT_ALLJF);
		$("#unit_sl_alljf").text("区域调节受理积分: "+wdjf[0].UNIT_SL_ALLJF);
		$("#wx_unit_cre").text("维系积分: "+wdjf[0].WX_UNIT_CRE);
		$("#all_jf").text("总积分: "+wdjf[0].ALL_JF);
	}
}
function showJfxc(){
	var time=$("#xctime").val();
	var hrId=$("#hrId").val();
	
	var tsql="select max(t.deal_date) deal_date from PODS.TB_ODS_JCDY_HR_SALARY t where t.hr_no='"+hrId+"'";
	if(hrId&&hrId!='null'){
		var td=query(tsql);
		if(td&&td.length>0&&td[0]){
			time=td[0]["DEAL_DATE"];
			$("#xcTitle").html('<i class="menu-toDo"></i>我的薪酬('+time+')');
			$("#xctime").val(time);
		}
	}
	//动态处理公众薪酬
	var orgLevel=$("#orgLevel").val();
	var src=$("#ctx").val()+"/report/devIncome/jsp/jcdy_hr_salary_mon_index.jsp?cxmonth="+time;
	if(orgLevel<3){
		src=$("#ctx").val()+"/report/devIncome/jsp/tb_mrt_jcdy_hr_salary_mon.jsp?cxmonth="+time;
	}
	$("#xcfbWin").attr("src",src);
	
	var uId='';
	var sql="select * from PMRT.TB_MRT_JCDY_HR_SALARY_MON t ";
	if(time!=''){
		sql+=" where t.DEAL_DATE="+time;
	}
	if(hrId!=''&&hrId&&hrId!=null&&hrId!='null'){
		$("#xc_hrNo").text("HR编码: "+hrId);
			var jfd=query("SELECT FACT_TOTAL FROM PODS.TB_ODS_JCDY_HR_SALARY WHERE DEAL_DATE ="+time+ " AND HR_NO='"+hrId+"'");
		if(jfd&&jfd.length>0&&jfd[0]){
			$("#fact_total").text("实发合计: "+jfd[0].FACT_TOTAL);
		}
	}
	sql+=" and t.HR_ID='"+hrId+"'";
	$.ajax({
		type:"POST",
		dataType:'json',
		async:true,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
           "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			uId=data[0].UNIT_ID;
	   			uType=data[0].USER_TYPE;
	   			$("#xc_gdxc").text("固定薪酬: "+data[0].FIXED_SALARY);
	   			//////////
	   			//固定薪酬
	   			$("#xc_gdxc").click(function(){
	   					var date=time;
	   					var sql="select t.*,case t.user_type when 2 then '外包' when  1 then '合同内' end myuser_type  from pods.TB_ODS_JCDY_HR_SALARY t where t.hr_no='"+hrId+"' and t.deal_date='"+date+"'";
	   					$.ajax({
	   						type:"POST",
	   						dataType:'json',
	   						async:true,
	   						cache:false,
	   						url:$("#ctx").val()+"/devIncome/devIncome_query.action",
	   						data:{
	   				           "sql":sql
	   					   	}, 
	   					   	success:function(d){
		   					   	if(d&&d.length){
			   						var h="<div style='padding:12px;padding-right:12px;max-height:300px;width:400px;overflow-y:auto;overflow-x:hidden;'>"
			   							+"<table><thead class='lch_DataHead lch_DataBody'>"
			   							+"<tr><th style='width:100px;text-align:left;'>员工工号</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["HR_NO"])+"</td></tr>"
			   							 +"<tr><th style='width:100px;text-align:left;'>姓名</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["USER_NAME"])+"</td></tr>"
			   							 +"<tr><th style='width:100px;text-align:left;'>岗位工资</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["POST_SALARY"])+"</td></tr>"
			   							 +"<tr><th style='width:100px;text-align:left;'>综合补贴</th><td style='width:100px;text-align:center;'>"+isNull(d[0]["GENERAL_SUBS"])+"</td></tr>"
			   							 +"<tr><th style='width:100px;text-align:left;'>合计</th><td style='width:100px;text-align:center;'>"+(parseFloat(isNull(d[0]["GENERAL_SUBS"]?d[0]["GENERAL_SUBS"]:0))+parseFloat(isNull(d[0]["POST_SALARY"]?d[0]["POST_SALARY"]:0)))+"</td></tr>"
			   							+"</thead></table></div>";
			   						art.dialog({
			   						    title: '我的薪酬详细信息',
			   						    content: h,
			   						    padding: 0,
			   						    lock:true
			   						});
			   					}else{
			   						alert("获取我的薪酬详细信息失败");
			   					}
	   					   	}
	   					});
	   			});	   			
	   			//////////
	   			$("#xc_kpi").text("KPI绩效: "+data[0].BASE_SALARY);
	   			$("#xc_kpi").click(function(){
					var date=time;
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
					var zszb=query("select KPI_NAME||':'||KPI_SCORE zszb from PMRT.TAB_MRT_JCDY_KPI_QJ_MON t where t.hr_id='"+hrId+"'");
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
							+"<br/>"
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
	   			//////////
	   			$("#xc_jftc").text("提成奖励: "+data[0].JF_SALARY);
	   			$("#xc_jftc").click(function(){
	   				var date=time;
	   				var js=uType;
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
	   					sql+=" WHERE T.HR_NO='"+hrId+"' AND DEAL_DATE='"+date+"' AND HJXSJF>0 ";
	   					sql+=" UNION ALL ";
	   					sql+=" select '受理积分' type, t.SL_ALLJF sl,t.SL_SVR_ALL_CRE tj,tr.UNIT_RATIO qy,t.UNIT_SL_ALLJF qytj,t.UNIT_SL_ALLJF*10 sumxc from pmrt.TB_JCDY_JF_ALL_MON t left join PCDE.TAB_CDE_GROUP_CODE tr on tr.unit_id=t.unit_id ";
	   					sql+=" WHERE T.HR_NO='"+hrId+"' AND DEAL_DATE='"+date+"' AND SL_ALLJF>0 ";
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
	   					sql+="          round(avg(nvl(xsslm, 0)), 2)*"+radio+" xsslm       ";
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
	   					sql+="              where f_hr_id in( '"+hrId+"'))                           ";
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
	   			//////////
	   			$("#xc_zxjl").text("专项奖励: "+data[0].SPECIAL_AWARD);
	   			$("#xc_zxjl").click(function(){
					var date=time;
					var sql="select t.*,case t.user_type when 2 then '外包' when  1 then '合同内' end myuser_type  from pods.TB_ODS_JCDY_HR_SALARY t where t.hr_no='"+hrId+"' and t.deal_date='"+date+"'";
					$.ajax({
   						type:"POST",
   						dataType:'json',
   						async:true,
   						cache:false,
   						url:$("#ctx").val()+"/devIncome/devIncome_query.action",
   						data:{
   				           "sql":sql
   					   	}, 
   					   	success:function(d){
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
   					   	}
					});
				});
	   			//////////
	   			$("#xc_sum").text("合计: "+data[0].ALL_SALARY);
	   		}
	    }
	});
	
}
//游离渠道
function freeChannel(){
	$.ajax({
		url:$("#ctx").val()+"/index/index_freeChannel.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			$("#freechannel").html('游离渠道：'+data);
		}
	});
}

function searchfreeChannel(element) {
	
	var text = $(element).text();
	if(text == '游离渠道：0') {
		return;
	}
	var lis=parent.document.getElementById("navi").getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
        if(lis[i].className=="select1"){
            lis[i].className="";
            lis[i].getElementsByTagName("a")[0].className="";
        }
        if(i==8) {
        	lis[i].className="select1";
        	lis[i].getElementsByTagName("a")[0].className="select";
        }
    };
    parent.openWindow('游离渠道','computer', $("#ctx").val()+'/warningAndMonitor/freeChannel!index.action');
	parent.switchFirstMenu('module-477161','预警监控');
}

//游离小区
function freeCommunity(){
	$.ajax({
		url:$("#ctx").val()+"/index/index_freeCommunity.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			$("#freecommunity").html('游离小区：'+data);
		}
	});
}

function searchfreeCommunity(element) {
	
	var text = $(element).text();
	if(text == '游离小区：0') {
		return;
	}
	var lis=parent.document.getElementById("navi").getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
		if(lis[i].className=="select1"){
			lis[i].className="";
			lis[i].getElementsByTagName("a")[0].className="";
		}
		if(i==8) {
			lis[i].className="select1";
			lis[i].getElementsByTagName("a")[0].className="select";
		}
	};
	parent.openWindow('游离小区','computer', $("#ctx").val()+'/warningAndMonitor/freeCommunity!index.action');
	parent.switchFirstMenu('module-477161','预警监控');
}

//文件下载列表
function indexDocList() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_listDoc.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data != null && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					//str+="<a target='_blank' href='"+$("#ctx").val()+"/docManagement/docManager_downfile.action?id="+data[i].ID+"' id='"+data[i].ID+"'>"+data[i].OLDNAME+"</a>";
					str+="<a href='#' onclick='downDoc(\""+data[i].ID+"\");'>"+data[i].OLDNAME+"</a>";
				}
			}
			$("#indexDocList").after(str);
			if(str==""){
				$("#indexDocList").parent().addClass("collapsed");
			}
		}
	});
}
//待办工单数
function qryTodoWorkOrderNum() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_qryTodoWorkOrderNum.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			$("#workOrderNum").html('待办：'+data);
		}
	});
}

function openOrderWindow(element) {
	
	var text = $(element).text();
	if(text == '待办：0') {
		return;
	}
	var lis=parent.document.getElementById("navi").getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
        if(lis[i].className=="select1"){
            lis[i].className="";
            lis[i].getElementsByTagName("a")[0].className="";
        }
        if(i==5) {
        	lis[i].className="select1";
        	lis[i].getElementsByTagName("a")[0].className="select";
        }
    };
    parent.openWindow('工单列表','computer','/portal/workflow/workorder/activityApproval/processApprove/processApprove.jsp');
	parent.switchFirstMenu('module-377341','经营管控');
}

function downDoc(docId){
	docId = encodeURI(encodeURI(docId));
	window.location.href = $("#ctx").val()+"/docManagement/docManager_downDoc.action?id="+docId;
}
//最新公告
function listBulls() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_listBulls.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data != null && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					str+="<a style='padding-right:5px;' href='javascript:void(0);' onclick='showBull(\""+data[i].BULLETINID+"\")' id='"+data[i].BULLETINID+"'><table><tr><td width='65%'>"+firstNChar(data[i].BULLNAME,7)+"</td><td>"+data[i].CREATETIME+"</td></tr></table></a>";
				}
			}
			$("#bulls").after(str);
			if(str==""){
				$("#bulls").parent().addClass("bulls");
			}
		}
	});
}
function firstNChar(s,n){
	if(!s){s=""};
	if(s.length>n){
		return s.substring(0,n)+"...";
	}else{
		return s;
	}
}
function showBull(id){
	$.ajax({
		url:$("#ctx").val()+"/index/index_getBullById.action",
		type:'POST',
		dataType:'json',
		data:{
	           "id":id
		},
		success:function(data){
			if(data&&data.length>0){
				var c="<div style='width:530px;height:320px;overflow:auto;padding:20px 25px;'>";
					c+="<div>";
				c+=data[0].BULLETINDESC;
					c+="</div><br/>";
					c+="<div style='line-height:26px;'>";
					c+="	<h1>附件：</h1>";
					if(data[0].ACCESSORYNAME){
						var attachNames=data[0].ACCESSORYNAME.split("&&");
						var attachUrl=data[0].ATTACHMENTS.split("&&");
						for(var i=0;i<attachNames.length;i++){
							c+="<a target='_blank' href='"+$("#ctx").val()+"/bullManagement/bullManager_downfile.action?downUrl="+attachUrl[i]+"&downName="+encodeURI(encodeURI(attachNames[i]))+"'>"+attachNames[i]+"</a><br/>";
						}
					}else{
						c+="没有附件";
					}
					
					
					c+="</div>";
				c+="</div>";
				
				art.dialog({
				    title: data[0].BULLNAME,
				    content: c,
				    width:530,
				    height:320,
				    padding: 0,
				    lock:true
				});

			}
		}
	});
	/*var url = $("#ctx").val()+"/index/index_getBullById.action?id="+id;
	//art.dialog.data('id',id);
	art.dialog.open(url,{
		id:'bullDialog',
		width:'530px',
		height:'320px',
		lock:true,
		resize:false
	});*/
}
//日收入趋势图表
function showNetIncomeChart() {
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
	        ],
	        function(ec) {
	        	//初始化echarts图表
	        	var myChart = ec.init(document.getElementById('net_income_chart'));
	        	//图表显示提示信息
	        	myChart.showLoading({
	        	    text : "图表数据正在努力加载...",
	        	    effect : 'ring',
	        	    x : 'center',
	        	    y : 'center',
	        	    textStyle : {
	        	        fontSize : 16
	        	    }
	        	});
	        	var option = {
	        		title:{
	        			text:'日净增收入(元)',
	        			textStyle:{
	        				fontSize:12,
	        				fontWeight: 'bolder',
	        				color:'#6c6b6b'
	        			}
	        		},
	        		tooltip:{
	        			trigger: 'axis'
	        		},
	        		color:['#ff6347','#1e90ff','#ba55d3','#40e0d0','#ff7f50','#6495ed','#ff00ff'],
	        		legend:{
	        			data:['2G','3G']
	        		},
	        		xAxis:[{
	        			type:'category',
	        			data : ['']
	        		}],
	        		yAxis:[{
	        			type:'value'
	        		}],
	        		series:[]
	        	};
	        	$.ajax({
	        		url:$("#ctx").val()+"/index/index_listNetIncomeChart.action",
	        		type:'POST',
	        		dataType:'json',
	        		async:true,
	        		success:function(result){
	        			if(result.categoryList.length>0){
	        				option.legend.data = result.legend;
	        				option.xAxis[0].data = result.categoryList;
	        				option.series = result.seriesList;
	        			} else {
	        				option.series = [{"data":[0],"id":1,"name":"2G","type":"scatter"}];
	        				option.xAxis[0].data = [""];
	        			}
	        			myChart.hideLoading();
	        			// 为echarts对象加载数据 
	        			myChart.setOption(option);
	        		
	        			
	        		}
	        	});
	        }
	 );
}

//日发展量趋势图表
function showIncomeDevChart() {
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
	        ],
		function(ec) {
			//初始化echarts图表
			var myChart = ec.init(document.getElementById('income_dev_chart'));
			//图表显示提示信息
			myChart.showLoading({
				text : "图表数据正在努力加载...",
				effect : 'ring',
				x : 'center',
				y : 'center',
				textStyle : {
					fontSize : 16
				}
			});
			var option = {
					title:{
						text:'日发展用户数(户)',
						textStyle:{
							fontSize:12,
							fontWeight: 'bolder',
							color:'#6c6b6b'
						}
					},
					tooltip:{
						trigger: 'axis'
					},
					color:['#40e0d0','#ff7f50','#6495ed','#ff00ff','#ff6347'],
					legend:{
						data:['2G','3G']
					},
					xAxis:[{
						type:'category',
						data : []
					}],
					yAxis:[{
						type:'value'
					}],
					series:[]
			};
			$.ajax({
				url:$("#ctx").val()+"/index/index_listIncomeAndDevChart.action",
				type:'POST',
				dataType:'json',
				async:true,
				success:function(result){
					if(result.categoryList.length>0){
						option.legend.data = result.legend;
						option.xAxis[0].data = result.categoryList;
						option.series = result.seriesList;
					} else {
						option.series = [{"data":[0],"id":1,"name":"2G","type":"scatter"}];
						option.xAxis[0].data = [""];
					}
					myChart.hideLoading();
					// 为echarts对象加载数据 
					myChart.setOption(option);	
				}
			});
		}
	);
}

//收入与发展
function searchIncomeAndDev() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_searchIncomeAndDev.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='9' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr>";
					str+="<td>"+data[i].GROUPNAME+"</td>";
					str+="<td>"+data[i].DEV_2G_NUM+"</td>";
					str+="<td>"+data[i].SR_2G_NUM+"</td>";
					str+="<td>"+data[i].DEV_3G_NUM+"</td>";
					str+="<td>"+data[i].SR_3G_NUM+"</td>";
					str+="<td>"+data[i].DEV_4G_NUM+"</td>";
					str+="<td>"+data[i].SR_4G_NUM+"</td>";
					str+="<td>"+data[i].TOTAL_DEV_NUM+"</td>";
					str+="<td>"+data[i].TOTAL_SR_NUM+"</td>";
					str+= "</tr>";
				}
			}
			$("#income_dev tbody").empty().append(str);
		}
	});
}

//佣金总览
var  yjx=[''];
var  yjy=[0];
var  yjzb=[];
function searchYj() {
	//if(!$("#Yj tbody").find("TR").length) return;
	$.ajax({
		url:$("#ctx").val()+"/index/index_searchYj.action",
		type:'POST',
		async:true,
		dataType:'json',
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='8' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr>";
					str+="<td>"+data[i].GROUPNAME+"</td>";
					str+="<td>"+data[i].TOTAL_2G+"</td>";
					str+="<td>"+data[i].TOTAL_3G+"</td>";
					str+="<td>"+data[i].TOTAL_NETWORK+"</td>";
					str+="<td>"+data[i].TOTAL_FLOW+"</td>";
					str+="<td>"+data[i].CHANL_SUBSIDY+"</td>";
					str+="<td>"+data[i].OTHER+"</td>";
					str+="<td>"+data[i].TOTAL+"</td>";
					str+= "</tr>";
					var ns=data[i].GROUPNAME.split("");
					ns=ns.join("\n");
					yjx[i]=ns;
					yjy[i]=data[i].TOTAL;
					if(data[i].FLAG==1){
						yjzb=[
						   {name:'2G佣金',value:data[i].TOTAL_2G},
						   {name:'3G佣金',value:data[i].TOTAL_3G},   
						   {name:'固网佣金',value:data[i].TOTAL_NETWORK},   
						   {name:'融合佣金',value:data[i].TOTAL_FLOW},   
						   {name:'渠道补贴佣金',value:data[i].CHANL_SUBSIDY},   
						   {name:'其他佣金',value:data[i].OTHER}  
						      ];
					}
				}
			}
			$("#Yj tbody").empty().append(str);
			showYj();
		}
	});
}
//显示佣金柱状图

function showYj(){
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
	        ],
	        function(ec) {
	        	var myChart = ec.init(document.getElementById('yjfb'));
	        	var option = {
	        		    title : {
	        		        text: '佣金分布-'+$("#prevMonth").val(),
	        		        x:'center',
	        		        textStyle:{
	        					fontSize:12,
	        					fontWeight: 'bolder',
	        					color:'#6c6b6b'
	        				}
	        		    },
	        		    tooltip : {
	        		        trigger: ''
	        		    },
	        		    color:['#40e0d0','#ff7f50'],
	        		    calculable : true,
	        		    xAxis : [
	        		        {
	        		            type : 'category',
	        		            axisLabel: {interval:0 },
	        		            boundaryGap : true,
	        		            data : yjx
	        		        }
	        		    ],
	        		    yAxis : [
	        		        {
	        		            type : 'value',
	        		            axisLabel : {
	        		                formatter: '{value}'
	        		            }
	        		        }
	        		    ],
	        		    series : [
	        		        {
	        		            name:'',
	        		            type:'bar',
	        		            data:yjy,
	        		            itemStyle: {
	        		            	barBorderRadius:[10,10,0,0],
	        		            	label:{
	        		            		show:true,
	        		            		position:'outer'
	        		            	},
	        		                normal: {
	        		                    borderRadius: 10,
	        		                    /*color : (function (){
	        		                        var zrColor = require('zrender/tool/color');
	        		                        return zrColor.getLinearGradient(
	        		                            0, 0, 1000, 0,
	        		                            [[0, 'rgba(222,66,23,0.8)'],[1, 'rgba(200,43,166,0.8)']]
	        		                        )
	        		                    })()*/
	        		                    color:function(params) {
	        		                    	var colorList = ['#f0e229','#d971d4','#88d0fc','#31cc31','#d67a7d',
	        		                    	                 '#ff8052','#00CCCC','#CC0033','#00AA00','#880088',
	        		                    	                 '#FF9966','#6633CC','#339966','#FF9933','#FF66FF',
	        		                    	                 '#3366FF','#FF6666'
	        		                    	                 ];
	        		                    	return colorList[params.dataIndex];
	        		                    }
	        		                }
	        		            },
	        		            markLine : {
	        		                data : [
	        		                    {type : 'average', name: '平均值'}
	        		                ]
	        		            }
	        		        }
	        		    ]
	        		};
	        		                    
	        	myChart.setOption(option);
	        }
	);
	
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
	        ],
	        function(ec) {
	        	var myChart2 = ec.init(document.getElementById('yjzb'));
	        	var option2 = {
	        		      title : {
	        		          text: '佣金占比-'+$("#prevMonth").val(),
	        		          x:'center',
	        		          textStyle:{
	        						fontSize:12,
	        						fontWeight: 'bolder',
	        						color:'#6c6b6b'
	        				  }
	        		      },
	        		      calculable : true,
	        		      tooltip : {
	        		          trigger: 'item'
	        		      },
	        		     // color:['red', 'green','blueviolet','yellow','blue','black'],
	        		      legend: {
	        		          orient : 'vertical',
	        		          x : 'left',
	        		          data:['2G佣金','3G佣金','固网佣金','融合佣金','渠道补贴佣金','其他佣金']
	        		      },
	        		      series : [
	        		          {
	        		              name:'佣金占比',
	        		              type:'pie',
	        		              radius : '55%',
	        		              minAngle:10,
	        		              startAngle:-90,
	        		              center: ['50%', '50%'],
	        		              itemStyle: {
		        		                normal: {
		        		                    borderRadius: 10,
		        		                    color : function(params){
		        		                    	var colorList = [
		        		                    	                 '#f0e229','#d971d4','#88d0fc','#31cc31','#d67a7d',
		        		                    	                 '#ff8052'
		        		                    	                 ];
		        		                    	return colorList[params.dataIndex];
		        		                    }
		        		                }
		        		            },
	        		              data:yjzb
	        		          }
	        		      ]
	        		  };
	        		  myChart2.setOption(option2);
	        }
	);
}
//显示实时发展
function searchRealTimeDev() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_searchRealTimeDev.action",
		type:'POST',
		async:true,
		dataType:'json',
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='5' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr>";
					str+="<td>"+data[i].GROUPNAME+"</td>";
					str+="<td>"+data[i].DEV_G2+"</td>";
					str+="<td>"+data[i].DEV_G3+"</td>";
					str+="<td>"+data[i].DEV_WIFI+"</td>";
					str+="<td>"+data[i].DEV_ALL+"</td>";
					str+= "</tr>";
				}
			}
			$("#ssfzTable tbody").empty().append(str);
		}
	});
}

var status="'10'";
var status1="'2G'";

var firstClick=true;
function showStationMap(){
	var zsIcon = new BMap.Icon($("#ctx").val()+"/portal/index/images/location16.png", new BMap.Size(16,
			16), {
		offset : new BMap.Size(8, 8),
		imageOffset : new BMap.Size(0, 0)
	});
	var zsRedIcon = new BMap.Icon($("#ctx").val()+"/portal/index/images/location_red16.png", new BMap.Size(16,
			16), {
		offset : new BMap.Size(8, 8),
		imageOffset : new BMap.Size(0, 0)
	});
	var zsIcon1 = new BMap.Icon($("#ctx").val()+"/portal/index/images/m0.png", new BMap.Size(53,
			52), {
		offset : new BMap.Size(26, 26),
		imageOffset : new BMap.Size(0, 0)
	});
	//////////////////////////////////
	var map1 = new BMap.Map("jzfb");
	map1.disableScrollWheelZoom();
	var top_left_control1 = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation1 = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	map1.addControl(top_left_control1);        
	map1.addControl(top_left_navigation1);   
	//处理悬浮层
	
	map1.centerAndZoom(new BMap.Point(101, 24.709), 7);
	map1.enableScrollWheelZoom();
	//////////////////////////////////
	
	setInterval(function() {$(".anchorBL").hide();}, 50);
	var isLoad1=false;
	
	$("#jzfbFrame").find("INPUT[type='checkbox']").click(function(){
		status1="";
		$("#jzfbFrame").find("INPUT[type='checkbox']:checked").each(function(){
			if(status1!=""){
				status1+=",";
			}
			status1+="'"+$(this).val()+"'";
		})
		if(status1==""){
			status1="''";
		}
		isLoad1=false;
		map1.centerAndZoom(new BMap.Point(101, 24.709), 7);
	});
//////////////////////////////////////
	// 地图加载完成时重新获取可视范围内的点
	map1.addEventListener('tilesloaded',function(){
		var bs = map1.getBounds(); // 获取可视区域
		var bssw = bs.getSouthWest(); // 可视区域左下角
		var bsne = bs.getNorthEast(); // 可视区域右上角
		var log0 = bssw.lng<bsne.lng?bssw.lng:bsne.lng;
		var log1 = bssw.lng>bsne.lng?bssw.lng:bsne.lng;
		var lat0 = bssw.lat<bsne.lat?bssw.lat:bsne.lat;
		var lat1 = bssw.lat>bsne.lat?bssw.lat:bsne.lat;
		var  dlat=lat1-lat0;

		if(dlat>2&&!isLoad1){
			map1.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listJZPositions.action",
				data:{
					flag:0//显示所有地市
					,status:status1
				},
				success : function(data) {
					isLoad1=true;
					if (data && data.length > 0) {
						for(var i=0;i<data.length;i++){
							///////////////
							var pt =new BMap.Point(data[i].LOG_NO, data[i].LAT_NO);
							var marker = new BMap.Marker(pt,{icon:zsIcon1});
							(function(){
						        var group = data[i].GROUP_ID_1;
						        marker.addEventListener('click',function(e){
						        	var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									map1.centerAndZoom(new BMap.Point(lon, lat), 10);
						        	
						        	$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_listJZPositions.action",
										data:{
											flag:1,//点击地市显示所有营服中心
											group:group
											,status:status1
										},
										success : function(d) {
											if(d&&d.length){
												isLoad1=false;
												map1.clearOverlays();
												for(var i=0;i<d.length;i++){
													var pt =new BMap.Point(d[i].LOG_NO, d[i].LAT_NO);
													var marker = new BMap.Marker(pt,{icon:zsIcon1});
													marker.addEventListener('click',function(e){
														var p=e.target;
														var lon=p.getPosition().lng;
														var lat=p.getPosition().lat;
														map1.centerAndZoom(new BMap.Point(lon, lat), 12);
													});
													
													
													map1.addOverlay(marker);
													
													var opts = {
														position : pt,   // 指定文本标注所在的地理位置
														offset   : new BMap.Size(-11, -10)    //设置文本偏移量
													}
													var label = new BMap.Label("&nbsp;"+d[i].NUM, opts);  // 创建文本标注对象
													label.setStyle({
														fontSize : "10px",
														border:'none',
														background:'transparent',
														textAlign:'center',
														height : "20px",
														lineHeight : "20px",
														fontFamily:"微软雅黑"
													});
													map1.addOverlay(label); 
												}
											}
										}
						        	});
								}); 
						    })();
							map1.addOverlay(marker);
							/////////////
							var opts = {
							  position : pt,   // 指定文本标注所在的地理位置
							  offset   : new BMap.Size(-11, -10)    //设置文本偏移量
							}
							var label = new BMap.Label(data[i].NUM, opts);  // 创建文本标注对象
								label.setStyle({
									 fontSize : "10px",
									 border:'none',
									 background:'transparent',
									 textAlign:'center',
									 height : "20px",
									 lineHeight : "20px",
									 fontFamily:"微软雅黑"
								 });
							map1.addOverlay(label); 
						}
					}
				}
			});
		}else if(dlat<=0.5){
			isLoad1=false;
			map1.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listJZPositions.action",
				data:{
					lat0:lat0,
					lat1:lat1,
					log0:log0,
					log1:log1,
					flag:2
					,status:status1
				},
				success : function(data) {
					if (data && data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (data[i] && data[i]['LOG_NO'] && data[i]['LAT_NO']) {
								var pt = new BMap.Point(data[i]['LOG_NO'],
										data[i]['LAT_NO']);
								var tzsIcon=zsIcon;
								if($.trim(data[i]["STATION_TYPE_CODE"])=='2G'){
									tzsIcon=zsIcon;
								}else{
									tzsIcon=zsRedIcon;
								}
								var marker = new BMap.Marker(pt,{icon:tzsIcon,title:data[i]['STATION_NAME']});
								marker.addEventListener('click',function(e){
									var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									
									$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_getJZPosition.action",
										data:{
											lat:lat,
											log:lon
										},
										success : function(chanl) {
											if(!chanl||chanl.length<=0) return;
											chanl=chanl[0];
											var h="<table>";
											h+="<tr>";
											h+="  <td style='width:60px;'>名称：</td><td>"+chanl["STATION_NAME"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>编码：</td><td>"+chanl["STATION_SERIAL"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>类型：</td><td>"+chanl["STATION_TYPE"]+"</td>"
											h+="</tr>";
											h+="</table>";
										
											var point = new BMap.Point(lon,lat);
											var opts = {
													title : "基站信息" , // 信息窗口标题
													enableMessage:false//设置允许信息窗发送短息
											};
											var infoWindow = new BMap.InfoWindow(h,opts);  // 创建信息窗口对象 
											map1.openInfoWindow(infoWindow,point); //开启信息窗口
											/*$('.chanlImg').onload = function (){
												infoWindow.redraw();
											}*/
										}
									});
								});
								map1.addOverlay(marker);
							}
						}
					}
				}
			});
		}
	});
}
function showChanlMap() {
	var zsIcon = new BMap.Icon($("#ctx").val()+"/portal/index/images/location16.png", new BMap.Size(16,
			16), {
		offset : new BMap.Size(8, 8),
		imageOffset : new BMap.Size(0, 0)
	});
	var zsRedIcon = new BMap.Icon($("#ctx").val()+"/portal/index/images/location_red16.png", new BMap.Size(16,
			16), {
		offset : new BMap.Size(8, 8),
		imageOffset : new BMap.Size(0, 0)
	});
	var zsIcon1 = new BMap.Icon($("#ctx").val()+"/portal/index/images/m0.png", new BMap.Size(53,
			52), {
		offset : new BMap.Size(26, 26),
		imageOffset : new BMap.Size(0, 0)
	});
	var map = new BMap.Map("qdfb");
	map.disableScrollWheelZoom();
	var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	map.addControl(top_left_control);        
	map.addControl(top_left_navigation);   
	map.centerAndZoom(new BMap.Point(101, 24.709), 7);
	map.enableScrollWheelZoom();
	
	
	
	setInterval(function() {$(".anchorBL").hide();}, 50);
	var isLoad=false;
	
	//
	
	
	$("#qdfbFrame").find("INPUT[type='checkbox']").click(function(){
		status="";
		$("#qdfbFrame").find("INPUT[type='checkbox']:checked").each(function(){
			if(status!=""){
				status+=",";
			}
			status+="'"+$(this).val()+"'";
		})
		if(status==""){
			status="''";
		}
		isLoad=false;
		map.centerAndZoom(new BMap.Point(101, 24.709), 7);
	});
	
	
	
	// 地图加载完成时重新获取可视范围内的点
	map.addEventListener('tilesloaded',function(){
		var bs = map.getBounds(); // 获取可视区域
		var bssw = bs.getSouthWest(); // 可视区域左下角
		var bsne = bs.getNorthEast(); // 可视区域右上角
		var log0 = bssw.lng<bsne.lng?bssw.lng:bsne.lng;
		var log1 = bssw.lng>bsne.lng?bssw.lng:bsne.lng;
		var lat0 = bssw.lat<bsne.lat?bssw.lat:bsne.lat;
		var lat1 = bssw.lat>bsne.lat?bssw.lat:bsne.lat;
		var  dlat=lat1-lat0;

		if(dlat>2&&!isLoad){
			map.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listChanlPositions.action",
				data:{
					flag:0//显示所有地市
					,status:status
				},
				success : function(data) {
					isLoad=true;
					if (data && data.length > 0) {
						for(var i=0;i<data.length;i++){
							///////////////
							var pt =new BMap.Point(data[i].LOG_NO, data[i].LAT_NO);
							var marker = new BMap.Marker(pt,{icon:zsIcon1});
							(function(){
						        var group = data[i].GROUP_ID_1;
						        marker.addEventListener('click',function(e){
						        	var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									map.centerAndZoom(new BMap.Point(lon, lat), 10);
						        	
						        	$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_listChanlPositions.action",
										data:{
											flag:1,//点击地市显示所有营服中心
											group:group
											,status:status
										},
										success : function(d) {
											if(d&&d.length){
												isLoad=false;
												map.clearOverlays();
												for(var i=0;i<d.length;i++){
													var pt =new BMap.Point(d[i].LOG_NO, d[i].LAT_NO);
													var marker = new BMap.Marker(pt,{icon:zsIcon1});
													marker.addEventListener('click',function(e){
														var p=e.target;
														var lon=p.getPosition().lng;
														var lat=p.getPosition().lat;
														map.centerAndZoom(new BMap.Point(lon, lat), 12);
													});
													
													
													map.addOverlay(marker);
													
													var opts = {
														position : pt,   // 指定文本标注所在的地理位置
														offset   : new BMap.Size(-11, -10)    //设置文本偏移量
													}
													var label = new BMap.Label("&nbsp;"+d[i].NUM, opts);  // 创建文本标注对象
													label.setStyle({
														fontSize : "10px",
														border:'none',
														background:'transparent',
														textAlign:'center',
														height : "20px",
														lineHeight : "20px",
														fontFamily:"微软雅黑"
													});
													map.addOverlay(label); 
												}
											}
										}
						        	});
								}); 
						    })();
							map.addOverlay(marker);
							/////////////
							var opts = {
							  position : pt,   // 指定文本标注所在的地理位置
							  offset   : new BMap.Size(-11, -10)    //设置文本偏移量
							}
							var label = new BMap.Label(data[i].NUM, opts);  // 创建文本标注对象
								label.setStyle({
									 fontSize : "10px",
									 border:'none',
									 background:'transparent',
									 textAlign:'center',
									 height : "20px",
									 lineHeight : "20px",
									 fontFamily:"微软雅黑"
								 });
							map.addOverlay(label); 
						}
					}
				}
			});
		}else if(dlat<=0.5){
			isLoad=false;
			map.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listChanlPositions.action",
				data:{
					lat0:lat0,
					lat1:lat1,
					log0:log0,
					log1:log1,
					flag:2
					,status:status
				},
				success : function(data) {
					if (data && data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (data[i] && data[i]['LOG_NO'] && data[i]['LAT_NO']) {
								var pt = new BMap.Point(data[i]['LOG_NO'],
										data[i]['LAT_NO']);
								var tzsIcon=zsIcon;
								if(data[i]["HASDEV"]){
									tzsIcon=zsIcon;
								}else{
									tzsIcon=zsRedIcon;
								}
								var marker = new BMap.Marker(pt,{icon:tzsIcon,title:data[i]['GROUP_ID_4_NAME']});
								marker.addEventListener('click',function(e){
									var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									
									$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_getChanlPosition.action",
										data:{
											lat:lat,
											log:lon
										},
										success : function(chanl) {
											if(!chanl||chanl.length<=0) return;
											chanl=chanl[0];
											var h="<table>";
											h+="<tr>";
											h+="  <td style='width:60px;'>名称：</td><td>"+chanl["GROUP_ID_4_NAME"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>编码：</td><td>"+chanl["HQ_CHAN_CODE"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>地址：</td><td>"+chanl["CHNL_ADDR"]+"</td>"
											h+="</tr>";
											h+="</table>";
										
											var point = new BMap.Point(lon,lat);
											var opts = {
													title : "渠道信息" , // 信息窗口标题
													enableMessage:false//设置允许信息窗发送短息
											};
											var infoWindow = new BMap.InfoWindow(h,opts);  // 创建信息窗口对象 
											map.openInfoWindow(infoWindow,point); //开启信息窗口
											/*$('.chanlImg').onload = function (){
												infoWindow.redraw();
											}*/
										}
									});
								});
								map.addOverlay(marker);
							}
						}
					}
				}
			});
		}
	});
	
	//$("#xctt").trigger("click");
}
//销售排名
function showXsph() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_listXsph.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='11' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr USER_NAME='"+isNull(data[i].USER_NAME)+"' HR_NO='"+isNull(data[i].HR_NO)+"'>";
					str+="<td>"+isNull(data[i].AREA_NAME)+"</td>";
					str+="<td>"+isNull(data[i].UNIT_NAME)+"</td>";
					str+="<td>"+isNull(data[i].USER_NAME)+"</td>";
					str+="<td>"+isNull(data[i].G2SLL)+"</td>";
					str+="<td>"+isNull(data[i].G3SLL)+"</td>";
					str+="<td>"+isNull(data[i].G4SLL)+"</td>";
					str+="<td>"+isNull(data[i].SWSLL)+"</td>";
					str+="<td>"+isNull(data[i].TOTAL_SLL)+"</td>";
					str+="<td>"+isNull(data[i].RANK)+"</td>";
					str+="<td>"+isNull(data[i].GROUP_RANK)+"</td>";
					str+="<td>"+isNull(data[i].UNIT_RANK)+"</td>";
					str+= "</tr>";
				}
			}
			$("#xsphTable tbody").empty().append(str);
			
			//
			$("#xsphTable tbody").find("TR").each(function(){
				var $tr=$(this);
				var $2g=$tr.find("TD:eq(3)");
				var $3g=$tr.find("TD:eq(4)");
				var $4g=$tr.find("TD:eq(5)");
				var $swk=$tr.find("TD:eq(6)");
				
				if(!$2g.text()||$.trim($2g.text())==''||$.trim($2g.text())=='0'){
					
				}else{
					$2g.html("<a href='#' >"+$2g.text()+"</a>");
					$2g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='2GDK','2GHY'";
						//window.parent.openWindow(userName+"-2G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-2G发展详细",
							width:'1200px',
							height:'420px',
							lock:true,
							resize:false
						});
					});
					
				}
				if(!$3g.text()||$.trim($3g.text())==''||$.trim($3g.text())=='0'){
					
				}else{
					$3g.html("<a href='#' >"+$3g.text()+"</a>");
					$3g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='3GDK','3GHY'";
						//window.parent.openWindow(userName+"-3G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-3G发展详细",
							width:'1200px',
							height:'420px',
							lock:true,
							resize:false
						});
					});
					
				}
				if(!$4g.text()||$.trim($4g.text())==''||$.trim($4g.text())=='0'){
					
				}else{
					$4g.html("<a href='#' >"+$4g.text()+"</a>");
					$4g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='4GDK','4GHY'";
						//window.parent.openWindow(userName+"-4G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-4G发展详细",
							width:'1200px',
							height:'420px',
							lock:true,
							resize:false
						});
					});
					
				}
				
				if(!$swk.text()||$.trim($swk.text())==''||$.trim($swk.text())=='0'){
					
				}else{
					$swk.html("<a href='#' >"+$swk.text()+"</a>");
					$swk.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list_swk.jsp?hrNo="+hrNo+"&time="+time+"&itemCode=";
						//window.parent.openWindow(userName+"-上网卡发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-上网卡发展详细",
							width:'1200px',
							height:'420px',
							lock:true,
							resize:false
						});
					});
					
				}
			});
		}
	});
}
//积分排名
function showJfph() {
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var time =$("#curMonthJfpm").val();
	if(orgLevel==1 || orgLevel==2){
		var thead="<tr><th>地市</th><th>营服中心</th><th>销售积分</th><th>受理积分</th><th>维系积分</th><th>总积分</th><th>总积分金额</th><th>省排名</th><th>地市排名</th></tr>";
		$("#jfphTable thead").empty().append(thead);
		
		var sql ="SELECT * FROM  PMRT.TB_MRT_JCDY_UNITJF_RANK_MON T WHERE T.DEAL_DATE='"+time+"'  ";
		if(orgLevel==1){
			sql+=" ORDER BY PRO_RANK,GROUP_RANK ASC,GROUP_ID_1,UNIT_ID";
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code+" ORDER BY PRO_RANK,GROUP_RANK ASC,GROUP_ID_1,UNIT_ID ";
		}else{
			
		}
		var data=query("select t.* from ("+sql+") t where rownum<17 ");
		var str='';
		if(data&&data.length>0){
			for(var i=0;i<data.length;i++){
				str+= "<tr>";
				str+="<td>"+isNull(data[i].AREA_NAME)+"</td>";
				str+="<td>"+isNull(data[i].UNIT_NAME)+"</td>";
				str+="<td>"+isNull(data[i].UNIT_ALLJF)+"</td>";
				str+="<td>"+isNull(data[i].UNIT_SL_ALLJF)+"</td>";
				str+="<td>"+isNull(data[i].WX_UNIT_CRE)+"</td>";
				str+="<td>"+isNull(data[i].ALL_JF)+"</td>";
				str+="<td>"+isNull(data[i].ALL_JF_MONEY)+"</td>";
				str+="<td>"+isNull(data[i].PRO_RANK)+"</td>";
				str+="<td>"+isNull(data[i].GROUP_RANK)+"</td>";
				str+= "</tr>";
			}
		}else{
			str+= "<tr>";
			str+= "<td colspan='9' align='center'>暂无数据</td>";
			str+= "</tr>";
		}
		$("#jfphTable tbody").empty().append(str);
	}else{
		$.ajax({
			url:$("#ctx").val()+"/index/index_listJfph.action",
			type:'POST',
			dataType:'json',
			async:true,
			success:function(data){
				var str = "";
				if(data==null || data.length==0) {
					str+= "<tr>";
					str+= "<td colspan='11' align='center'>暂无数据</td>";
					str+= "</tr>";
				} else {
					for(var i=0; i<data.length; i++) {
						str+= "<tr USER_NAME='"+isNull(data[i].USER_NAME)+"' HR_NO='"+isNull(data[i].HR_NO)+"'>";
						str+="<td>"+isNull(data[i].AREA_NAME)+"</td>";
						str+="<td>"+isNull(data[i].UNIT_NAME)+"</td>";
						str+="<td>"+isNull(data[i].USER_NAME)+"</td>";
						str+="<td>"+isNull(data[i].UNIT_ALLJF)+"</td>";
						str+="<td>"+isNull(data[i].UNIT_SL_ALLJF)+"</td>";
						str+="<td>"+isNull(data[i].WX_UNIT_CRE)+"</td>";
						str+="<td>"+isNull(data[i].ALL_JF)+"</td>";
						str+="<td>"+isNull(data[i].ALL_JF_MONEY)+"</td>";
						str+="<td>"+isNull(data[i].PRO_RANK)+"</td>";
						str+="<td>"+isNull(data[i].GROUP_RANK)+"</td>";
						str+="<td>"+isNull(data[i].UNIT_RANK)+"</td>";
						str+= "</tr>";
					}
				}
				$("#jfphTable tbody").empty().append(str);
	}
	
			
		
	});
}
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


