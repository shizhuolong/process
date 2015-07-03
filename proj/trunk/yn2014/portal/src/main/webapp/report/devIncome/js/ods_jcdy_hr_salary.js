var nowData = [];
var title=[["账期","员工工号","姓名","岗位等级","薪档","固定薪酬","","艰苦地区补贴","KPI绩效","积分提成","专项奖励","","","","加班工资","过节费","福利及补贴","","","","","","","应发合计数","养老保险缴费_个人","医疗保险缴费_个人","失业保险缴费_个人","住房公积金缴费_个人","补充养老保险缴费_个人","个人所得税","其他扣款1","其他扣款项","应扣合计数","实发数","人员类型"],
           ["","","","","","岗位工资","综合补贴","","","","绩效工资_非经常项目1","绩效工资_非经常项目2","其他奖励_非经常项目1","其他奖励_非经常项目2","","","独生子女费","综合补贴(WY物业)","综合补贴(WC误餐)","综合补贴(JT交通)","综合补贴(TX通信)","其他1","其他2","","","","","","","","","","","",""]];
var field=["DEAL_DATE","HR_NO","USER_NAME","POST_LEVEL","SALARY_LEVEL","POST_SALARY","GENERAL_SUBS","DIFFICULT_AREAS","KPI_SALARY","JF_SALARY","MERIT_PAY_1","MERIT_PAY_2","OTHER_PAY_1","OTHER_PAY_2","OVERTIME_PAY","FESTIVITY_PAY","CHINA_ONE_PAY","MULTI_WY","MULTI_WC","MULTI_JT","MULTI_TX","OTHER1","OTHER2","SALARY_PAY_TOTAL","PROVIDE_AGE","TREATMENT","UNEMPLOYE","HOUSING","SUPPLEMENTARY","INCOME_TAX","OTHER_COST_1","OTHER_COST_1_ITEM","DEDUCTED_TOTAL","FACT_TOTAL","USER_TYPE"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			//orderBy = " order by " + field[index] + " " + type + " ";
			//search(0);
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

var pageSize = 15;
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
	var userName=$.trim($("#userName").val());
//条件
	var sql = " from PODS.TB_ODS_JCDY_HR_SALARY where 1=1 ";
	if(time!=''){
		sql+=" and DEAL_DATE='"+time+"' ";
	}
	if(userName!=''){
		sql+=" and USER_NAME like '%"+userName+"%'";
	}
	
//权限
	/*var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		//sql+=" and t.UNIT_ID='"+code+"'";
	//}else{
		//1-营服中心责任人、6-营业厅主人、7-行业总监
		var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.HR_ID='"+hrId+"'";
		var rd=query(rsql);
		if(rd&&rd.length){
			var hrsql="";
			for(var i=0;i<rd.length;i++){
				var v=rd[i]["USER_CODE"];
				var tsql="";
				if(v==1){
					tsql+=" select tt.hr_no                                                      ";
					tsql+="   from pmrt.TB_MRT_JCDY_SALUNIT_DETAIL_MON tt                        ";
					tsql+=" where tt.unit_id = '"+code+"'                                            ";
					tsql+="   and tt.deal_date = '"+time+"'                                      ";
					tsql+=" union                                                                ";
					tsql+=" select '"+hrId+"' from dual  ";
				}else if(v==6){
					tsql+=" SELECT distinct hr_id                                                ";
					tsql+="   FROM portal.tab_portal_mag_person                                  ";
					tsql+=" where hq_chan_code in (                                              ";
					tsql+="   SELECT distinct hq_chan_code                                       ";
					tsql+="     FROM portal.tab_portal_mag_person                                ";
					tsql+="   where hr_id = '"+hrId+"'                                           ";
					tsql+="     and hq_chan_code is not null                                     ";
					tsql+=" )                                                                    ";      
				}else if(v==7){
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a                                ";
					tsql+=" where a.f_hr_id in (                                                 ";
					tsql+="       select hr_id                                                   ";
					tsql+="         from portal.tab_portal_grp_person t                          ";
					tsql+="       where t.user_type = 1                                          ";
					tsql+=" )                                                                    ";
					tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
					tsql+=" union                                                                ";
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"'       ";
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
	}*/
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
	var s="SELECT DEAL_DATE                                                                               "+
	",HR_NO                                                                                         "+
	",USER_NAME                                                                                     "+
	",POST_LEVEL                                                                                    "+
	",SALARY_LEVEL                                                                                  "+
	",POST_SALARY                                                                                   "+
	",GENERAL_SUBS                                                                                  "+
	",DIFFICULT_AREAS                                                                               "+
	",KPI_SALARY                                                                                    "+
	",JF_SALARY                                                                                     "+
	",MERIT_PAY_1                                                                                   "+
	",MERIT_PAY_2                                                                                   "+
	",OTHER_PAY_1                                                                                   "+
	",OTHER_PAY_2                                                                                   "+
	",OVERTIME_PAY                                                                                  "+
	",FESTIVITY_PAY                                                                                 "+
	",CHINA_ONE_PAY                                                                                 "+
	",MULTI_WY                                                                                      "+
	",MULTI_WC                                                                                      "+
	",MULTI_JT                                                                                      "+
	",MULTI_TX                                                                                      "+
	",OTHER1                                                                                        "+
	",OTHER2                                                                                        "+
	",SALARY_PAY_TOTAL                                                                              "+
	",PROVIDE_AGE                                                                                   "+
	",TREATMENT                                                                                     "+
	",UNEMPLOYE                                                                                     "+
	",HOUSING                                                                                       "+
	",SUPPLEMENTARY                                                                                 "+
	",INCOME_TAX                                                                                    "+
	",OTHER_COST_1                                                                                  "+
	",OTHER_COST_1_ITEM                                                                             "+
	",DEDUCTED_TOTAL                                                                                "+
	",FACT_TOTAL                                                                                    "+
	",CASE USER_TYPE WHEN 1.00 then '合同内' else '外包' end user_type " ;
	sql = s + sql;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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
}
/*function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   */
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="SELECT DEAL_DATE                                                                       "+
	",HR_NO                                                                                         "+
	",USER_NAME                                                                                     "+
	",POST_LEVEL                                                                                    "+
	",SALARY_LEVEL                                                                                  "+
	",POST_SALARY                                                                                   "+
	",GENERAL_SUBS                                                                                  "+
	",DIFFICULT_AREAS                                                                               "+
	",KPI_SALARY                                                                                    "+
	",JF_SALARY                                                                                     "+
	",MERIT_PAY_1                                                                                   "+
	",MERIT_PAY_2                                                                                   "+
	",OTHER_PAY_1                                                                                   "+
	",OTHER_PAY_2                                                                                   "+
	",OVERTIME_PAY                                                                                  "+
	",FESTIVITY_PAY                                                                                 "+
	",CHINA_ONE_PAY                                                                                 "+
	",MULTI_WY                                                                                      "+
	",MULTI_WC                                                                                      "+
	",MULTI_JT                                                                                      "+
	",MULTI_TX                                                                                      "+
	",OTHER1                                                                                        "+
	",OTHER2                                                                                        "+
	",SALARY_PAY_TOTAL                                                                              "+
	",PROVIDE_AGE                                                                                   "+
	",TREATMENT                                                                                     "+
	",UNEMPLOYE                                                                                     "+
	",HOUSING                                                                                       "+
	",SUPPLEMENTARY                                                                                 "+
	",INCOME_TAX                                                                                    "+
	",OTHER_COST_1                                                                                  "+
	",OTHER_COST_1_ITEM                                                                             "+
	",DEDUCTED_TOTAL                                                                                "+
	",FACT_TOTAL                                                                                    "+
	",CASE USER_TYPE WHEN 1.00 then '合同内' else '外包' end user_type FROM  PODS.TB_ODS_JCDY_HR_SALARY where 1=1 " ;
	
	var time=$("#time").val();
	var userName=$.trim($("#userName").val());
	//条件
	if(time!=''){
		sql+=" and DEAL_DATE='"+time+"'";
	}
	if(userName!=''){
		sql+=" and USER_NAME like '%"+userName+"%'";
	}
	var title=[["账期","员工工号","姓名","岗位等级","薪档","固定薪酬","","艰苦地区补贴","KPI绩效","积分提成","专项奖励","","","","加班工资","过节费","福利及补贴","","","","","","","应发合计数","养老保险缴费_个人","医疗保险缴费_个人","失业保险缴费_个人","住房公积金缴费_个人","补充养老保险缴费_个人","个人所得税","其他扣款1","其他扣款项","应扣合计数","实发数","人员类型"],
	           ["","","","","","岗位工资","综合补贴","","","","绩效工资_非经常项目1","绩效工资_非经常项目2","其他奖励_非经常项目1","其他奖励_非经常项目2","","","独生子女费","综合补贴(WY物业)","综合补贴(WC误餐)","综合补贴(JT交通)","综合补贴(TX通信)","其他1","其他2","","","","","","","","","","","",""]];
	showtext = '人员薪酬明细-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////