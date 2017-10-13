var nowData = [];

var title=[["地市"	 ,"基层单元" ,"人员姓名" ,"hr编码","角色类型" ,"发展量"  ,""            ,""        ,""        ,""          ,"销售积分",    "","",""              		,""          ,""          ,""            ,""            ,""              		,""        ,""                		,""              		,""              		,""   ,""          ,""                		,""                		,""                		,""                		,"受理积分"    ,""            ,""        ,""              ,""                		,""                		,""                		,"维系积分"     		,""            ,""              		,""          ,""                  		,""        	,""            ,""            ,""            ,""                		,"客服积分"      ,"",""              ,""          ,""             ,""               ,""                		,""                    		,""                		,"总积分"      ,"总积分金额"],
		   [""    	 ,""         ,""         ,""      ,""         ,"2g发展量","上网卡发展量","3g发展量","4g发展量","宽带发展量","2g发展积分"  ,"上网卡发展<br/>积分","3g发展积分","4g发展积分","固网发展积分","宽带续费积分","集团专租线<br/>积分"	,"质态积分","裸机销售<br/>奖励积分"	,"沃易购众筹<br/>积分"	,"营业厅自提<br/>积分"	,"MINI厅积分","2次分配积分","手厅推广积分 ","小微渠道积分","销售原始<br/>积分合计"	,"渠道调节<br/>销售积分","质态区域<br/>调节积分","区域调节<br/>销售积分","总受理量"    ,"基础服务积分","服务积分","增值业务积分"  ,"受理原始<br/>积分合计"	,"服务调节<br/>受理积分","区域调节<br/>受理积分","老用户专享<br/>积分"	,"存费业务积分","自备机续约<br/>积分"	,"主副卡积分","流量语音包<br/>定制积分"	,"装维积分"	,"智慧沃家积分","维系服务积分","维系区域积分","维系原始<br/>积分合计"	,"业务单受理积分","投诉单受理积分","建单积分"  ,"话务积分"     ,"线上会话积分","2I2C积分"   ,"客服原始<br/>积分合计"	,"客服人员系数<br/>积分合计","客服区域积分<br/>合计",""            ,""          ]];
 var field=["AREA_NAME","UNIT_NAME","USER_NAME","HR_NO" ,"USER_ROLE","G2SLL"   ,"SWSLL"       ,"G3SLL"   ,"G4SLL"   ,"KDSLL"     ,"G2JF"        ,"SWJF"		   		,"G3JF"      ,"G4JF"      ,"GWJF"        ,"KDXFJF"      ,"JTZZSRJF"      		,"ZTJF"    ,"LJJL_JF"         		,"WYG_JF"        		,"ZTD_JF"        		,"MINI_JF","ACC2CFP_CRE","STTG_JF","ACCXW_CRE","HJXSJF"          		,"HQ_ALLJF"        		,"ZTUNITJF"        		,"UNIT_ALLJF"      		,"ALLSLL"      ,"BASE_SLJF"   ,"FW_JF"   ,"ZZYW_JF"       ,"SL_ALLJF"        		,"SL_SVR_ALL_CRE"  		,"UNIT_SL_ALLJF"   		,"LYHZX_JF"      		,"CFYW_JF"     ,"ZBJXY_JF"      		,"ZFK_JF"    ,"LLBDZ_JF"          		,"ZW_JF"     ,"ZHWJ_JF"     ,"WX_SVR_CRE"  ,"WX_UNIT_CRE" ,"WX_CRE"          		,"ACCSL_JF"      ,"ACCTS_JF"      ,"ACCJD_JF"  ,"ACCHW_JF"     ,"ACCLINE_JF"     ,"ACC2I2C_CRE","SERVICE_JF"      		,"SERVICE_HR_JF"       		,"SERVICE_UNIT_JF" 		,"ALL_JF"      ,"ALL_JF_MONEY"];
 var orderBy = '';
var report = null;
$(function() {
	listUserRole();
	report = new LchReport({
		title : title,
		field : field,
		lock:5,
		css:[
		     {gt:4,css:LchReport.RIGHT_ALIGN},
		     {array:[22,25,30,32,41,42,48,50,51,52],css:LchReport.NORMAL_STYLE}
		    ],
		tableCss:{leftWidth:555},
		rowParams : [],// 第一个为rowId
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

	$("#searchBtn").click(function() {
		search(0);
	});
});

var pageSize = 19;
// 分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', // 上一页按钮里text
		next_text : '下页', // 下一页按钮里text
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

// 列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var hrId=$("#hrId").val();
	var code=$("#code").val();
	var unitCode=$("#unitCode").val();
	var name=$.trim($("#name").val());
	var user_role=$.trim($("#user_role").val());
//条件
	var sql = "SELECT "+getSelectSql();
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(name!=''){
		sql+=" AND USER_NAME like '%"+name+"%'";
	}
	if(user_role!=''){
		sql+=" AND USER_ROLE LIKE '%"+user_role+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1 ='"+code+"'";
	}else{
		var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and HR_NO in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	var orderBy=" ORDER BY GROUP_ID_1, UNIT_ID";
	sql += orderBy;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSelectSql(){
	var time=$("#time").val();
	var sql=
		"     AREA_NAME, 				"+    //--  地市
		"     UNIT_NAME, 				"+    //--  基层单元
		"     USER_NAME, 				"+    //--  人员姓名
		"     HR_NO, 					"+    //-- HR编码
		"     USER_ROLE, 				"+    //--  人员角色
		"     G2SLL, 					"+    //-- 2G发展量
		"     SWSLL, 					"+    //-- 上网卡发展量
		"     G3SLL, 					"+    //-- 3G发展量
		"     G4SLL, 					"+    //-- 4G发展量
		"     KDSLL, 					"+    //-- 宽带发展量
		"     PODS.GET_RADIX_POINT(G2JF,2)			  AS G2JF,              "+//--  2G发展积分
		"     PODS.GET_RADIX_POINT(SWJF,2) 			  AS SWJF,              "+//--  上网卡发展积分
		"     PODS.GET_RADIX_POINT(G3JF,2) 			  AS G3JF,              "+//--  3G发展积分
		"     PODS.GET_RADIX_POINT(G4JF,2) 			  AS G4JF,              "+//--  4G发展积分
		"     PODS.GET_RADIX_POINT(GWJF,2) 			  AS GWJF,              "+//--  固网发展积分
		"     PODS.GET_RADIX_POINT(KDXFJF,2) 		  AS KDXFJF,            "+//--  宽带续费积分
		"     PODS.GET_RADIX_POINT(JTZZSRJF,2) 		  AS JTZZSRJF,          "+//-- 集团专租线积分
		"     PODS.GET_RADIX_POINT(ZTJF,2) 			  AS ZTJF,              "+//--  质态积分
		"     PODS.GET_RADIX_POINT(LJJL_JF,2) 		  AS LJJL_JF,           "+//--  裸机销售奖励积分
		"     PODS.GET_RADIX_POINT(WYG_JF,2) 		  AS WYG_JF,            "+//--  沃易购众筹积分
		"     PODS.GET_RADIX_POINT(ZTD_JF,2) 		  AS ZTD_JF,            "+//--  营业厅自提积分
		"     PODS.GET_RADIX_POINT(MINI_JF,2) 		  AS MINI_JF,           "+//--  MINI厅积分
		"     PODS.GET_RADIX_POINT(ACC2CFP_CRE,2) 	  AS ACC2CFP_CRE,       "+
		"     PODS.GET_RADIX_POINT(STTG_jf,2) 		  AS STTG_JF,           "+
		"     PODS.GET_RADIX_POINT(ACCXW_CRE,2) 	  AS ACCXW_CRE,           "+ //--小微渠道积分
		"     PODS.GET_RADIX_POINT(HJXSJF,2) 		  AS HJXSJF,            "+//--  合计销售积分
		"     PODS.GET_RADIX_POINT(HQ_ALLJF,2) 		  AS HQ_ALLJF,          "+//-- 渠道调节销售积分
		"     PODS.GET_RADIX_POINT(ZTUNITJF,2) 		  AS ZTUNITJF,          "+//-- 质态区域调节积分
		"     PODS.GET_RADIX_POINT(UNIT_ALLJF,2) 	  AS UNIT_ALLJF,        "+//-- 区域调节销售积分
		"     PODS.GET_RADIX_POINT(ALLSLL,2) 		  AS ALLSLL,            "+//--  总受理量
		"     PODS.GET_RADIX_POINT(BASE_SLJF,2) 	  AS BASE_SLJF,         "+//--  基础服务积分
		"     PODS.GET_RADIX_POINT(FW_JF,2) 		  AS FW_JF,             "+//-- 服务积分
		"     PODS.GET_RADIX_POINT(ZZYW_JF,2) 		  AS ZZYW_JF,           "+//-- 增值业务积分
		"     PODS.GET_RADIX_POINT(SL_ALLJF,2) 		  AS SL_ALLJF,          "+//-- 总受理积分
		"     PODS.GET_RADIX_POINT(SL_SVR_ALL_CRE,2)  AS SL_SVR_ALL_CRE,    "+//--  服务调节受理积分
		"     PODS.GET_RADIX_POINT(UNIT_SL_ALLJF,2)   AS UNIT_SL_ALLJF,     "+//-- 区域调节受理积分
		"     PODS.GET_RADIX_POINT(LYHZX_JF,2) 		  AS LYHZX_JF,          "+//-- 老用户专享积分
		"     PODS.GET_RADIX_POINT(CFYW_JF,2) 		  AS CFYW_JF,           "+//-- 存费业务积分
		"     PODS.GET_RADIX_POINT(ZBJXY_JF,2) 		  AS ZBJXY_JF,          "+//-- 自备机续约积分
		"     PODS.GET_RADIX_POINT(ZFK_JF,2) 		  AS ZFK_JF,            "+//--  主副卡积分
		"     PODS.GET_RADIX_POINT(LLBDZ_JF,2) 		  AS LLBDZ_JF,          "+//-- 流量语音包定制积分
		"     PODS.GET_RADIX_POINT(ZW_JF,2) 		  AS ZW_JF,             "+//-- 装维积分
		"     PODS.GET_RADIX_POINT(ZHWJ_JF,2) 		  AS ZHWJ_JF,           "+//-- 智慧沃家积分
		"     PODS.GET_RADIX_POINT(WX_SVR_CRE,2) 	  AS WX_SVR_CRE,        "+//-- 维系服务积分
		"     PODS.GET_RADIX_POINT(WX_UNIT_CRE,2) 	  AS WX_UNIT_CRE,       "+//--  维系区域积分
		"     PODS.GET_RADIX_POINT(WX_CRE,2) 		  AS WX_CRE,            "+//--  维系积分
		"     PODS.GET_RADIX_POINT(ACCSL_JF,2) 		  AS ACCSL_JF,          "+//--  业务单受理积分
		"     PODS.GET_RADIX_POINT(ACCTS_JF,2) 		  AS ACCTS_JF,          "+//--  投诉单受理积分
		"     PODS.GET_RADIX_POINT(ACCJD_JF,2) 		  AS ACCJD_JF,          "+//--  建单积分
		"     PODS.GET_RADIX_POINT(ACCHW_JF,2) 		  AS ACCHW_JF,          "+//--  话务积分
		"     PODS.GET_RADIX_POINT(ACCLINE_JF,2) 	  AS ACCLINE_JF,        "+//--  线上会话积分
		"     PODS.GET_RADIX_POINT(ACC2I2C_CRE,2) 	  AS ACC2I2C_CRE,       "+
		"     PODS.GET_RADIX_POINT(SERVICE_JF,2) 	  AS SERVICE_JF,        "+//--  客服原始积分合计
		"     PODS.GET_RADIX_POINT(SERVICE_HR_JF,2)   AS SERVICE_HR_JF,     "+//--  客服人员系数积分合计
		"     PODS.GET_RADIX_POINT(SERVICE_UNIT_JF,2) AS SERVICE_UNIT_JF,   "+//--  客服区域积分合计
		"     PODS.GET_RADIX_POINT(ALL_JF,2) 		  AS ALL_JF,            "+//--  总积分
		"     PODS.GET_RADIX_POINT(ALL_JF_MONEY,2) 	  AS ALL_JF_MONEY       "+//--  总积分金额
		"FROM PMRT.TB_JCDY_JF_ALL_MON   "+    
		" WHERE DEAL_DATE = '"+time+"'";
	return sql;
}


function listUserRole(){
	var sql="SELECT DISTINCT USER_ROLE FROM PMRT.TB_JCDY_JF_ALL_MON WHERE USER_ROLE IS NOT NULL";
	var html="";
	var data=query(sql);
	if(data){
		html="<option value=''>全部</option>";
		for(var i=0;i<data.length;i++){
			html+="<option value='"+data[i].USER_ROLE+"'>"+data[i].USER_ROLE+"</option>";
		}
	}else{
		alert("获取人员角色信息失败");
	}
	$("#user_role").empty().append(html);
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var hrId=$("#hrId").val();
	var code=$("#code").val();
	var unitCode=$("#unitCode").val();
	var name=$.trim($("#name").val());
	var user_role=$.trim($("#user_role").val());
	var title=[["账期","地市"	 ,"基层单元" ,"人员姓名" ,"hr编码","角色类型" ,"发展量"  ,""            ,""        ,""        ,""          ,"销售积分",    "","",""              		,""          ,""          ,""            ,""            ,""              		,""        ,""                		,""              		,""              		,""  ,""         ,""                		,""                		,""                		,""                		,"受理积分"    ,""            ,""        ,""              ,""                		,""                		,""                		,"维系积分"     		,""            ,""              		,""          ,""                  		,""        	,""            ,""            ,""            ,""                		,"客服积分"      ,"",""              ,""          ,""             ,""               ,""                		,""                    		,""                		,"总积分"      ,"总积分金额"],
	          		   ["","",""         ,""         ,""      ,""         ,"2g发展量","上网卡发展量","3g发展量","4g发展量","宽带发展量","2g发展积分"  ,"上网卡发展积分","3g发展积分","4g发展积分","固网发展积分","宽带续费积分","集团专租线积分"	,"质态积分","裸机销售奖励积分"	,"沃易购众筹积分"	,"营业厅自提积分"	,"MINI厅积分","2次分配积分","手厅推广积分 ","小微渠道积分","销售原始积分合计"	,"渠道调节销售积分","质态区域调节积分","区域调节销售积分","总受理量"    ,"基础服务积分","服务积分","增值业务积分"  ,"受理原始积分合计"	,"服务调节受理积分","区域调节受理积分","老用户专享积分"	,"存费业务积分","自备机续约积分"	,"主副卡积分","流量语音包定制积分"	,"装维积分"	,"智慧沃家积分","维系服务积分","维系区域积分","维系原始积分合计"	,"业务单受理积分","投诉单受理积分","建单积分"  ,"话务积分"     ,"线上会话积分","2I2C积分"   ,"客服原始积分合计"	,"客服人员系数积分合计","客服区域积分合计",""            ,""          ]];
	
	var sql = "SELECT DEAL_DATE,"+getSelectSql();
	 


	if (regionCode != '') {
		sql += " AND GROUP_ID_1 = '" + regionCode + "'";
	}
	if (unitCode != '') {
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(name!=''){
		sql+=" AND USER_NAME like '%"+name+"%'";
	}
	if(user_role!=''){
		sql+=" AND USER_ROLE LIKE '%"+user_role+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1 ='"+code+"'";
	}else{
		var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and HR_NO in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	var orderBy=" ORDER BY GROUP_ID_1, UNIT_ID";
	sql += orderBy;
	showtext = '积分月汇总-'+time;
	downloadExcel(sql,title,showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////

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
