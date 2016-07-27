var nowData = [];

var title=[["地市"	 ,"基层单元" ,"人员姓名" ,"hr编码","角色类型" ,"发展量"  ,""            ,""        ,""        ,""          ,"销售积分"    ,""              		,""          ,""          ,""            ,""            ,""              		,""        ,""                		,""              		,""              		,""          ,""                		,""                		,""                		,""                		,"受理积分"    ,""            ,""        ,""              ,""                		,""                		,""                		,"维系积分"     		,""            ,""              		,""          ,""                  		,""        	,""            ,""            ,""            ,""                		,"客服积分"      ,""              ,""          ,""             ,""               ,""                		,""                    		,""                		,"总积分"      ,"总积分金额"],
		   [""    	 ,""         ,""         ,""      ,""         ,"2g发展量","上网卡发展量","3g发展量","4g发展量","宽带发展量","2g发展积分"  ,"上网卡发展<br/>积分","3g发展积分","4g发展积分","固网发展积分","宽带续费积分","集团专租线<br/>积分"	,"质态积分","裸机销售<br/>奖励积分"	,"沃易购众筹<br/>积分"	,"营业厅自提<br/>积分"	,"MINI厅积分","销售原始<br/>积分合计"	,"渠道调节<br/>销售积分","质态区域<br/>调节积分","区域调节<br/>销售积分","总受理量"    ,"基础服务积分","服务积分","增值业务积分"  ,"受理原始<br/>积分合计"	,"服务调节<br/>受理积分","区域调节<br/>受理积分","老用户专享<br/>积分"	,"存费业务积分","自备机续约<br/>积分"	,"主副卡积分","流量语音包<br/>定制积分"	,"装维积分"	,"智慧沃家积分","维系服务积分","维系区域积分","维系原始<br/>积分合计"	,"业务单受理积分","投诉单受理积分","建单积分"  ,"话务积分"     ,"线上会话积分"   ,"客服原始<br/>积分合计"	,"客服人员系数<br/>积分合计","客服区域积分<br/>合计",""            ,""          ]];
 var field=["AREA_NAME","UNIT_NAME","USER_NAME","HR_NO" ,"USER_ROLE","G2SLL"   ,"SWSLL"       ,"G3SLL"   ,"G4SLL"   ,"KDSLL"     ,"G2JF"        ,"SWJF"		   		,"G3JF"      ,"G4JF"      ,"GWJF"        ,"KDXFJF"      ,"JTZZSRJF"      		,"ZTJF"    ,"LJJL_JF"         		,"WYG_JF"        		,"ZTD_JF"        		,"MINI_JF"   ,"HJXSJF"          		,"HQ_ALLJF"        		,"ZTUNITJF"        		,"UNIT_ALLJF"      		,"ALLSLL"      ,"BASE_SLJF"   ,"FW_JF"   ,"ZZYW_JF"       ,"SL_ALLJF"        		,"SL_SVR_ALL_CRE"  		,"UNIT_SL_ALLJF"   		,"LYHZX_JF"      		,"CFYW_JF"     ,"ZBJXY_JF"      		,"ZFK_JF"    ,"LLBDZ_JF"          		,"ZW_JF"     ,"ZHWJ_JF"     ,"WX_SVR_CRE"  ,"WX_UNIT_CRE" ,"WX_CRE"          		,"ACCSL_JF"      ,"ACCTS_JF"      ,"ACCJD_JF"  ,"ACCHW_JF"     ,"ACCLINE_JF"     ,"SERVICE_JF"      		,"SERVICE_HR_JF"       		,"SERVICE_UNIT_JF" 		,"ALL_JF"      ,"ALL_JF_MONEY"];
 var orderBy = '';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		lock:5,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN},{array:[22,23,30,32,41,42,48,50,51,52],css:{color:'red'}}],
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
	var regionName=$("#regionName").val();
	var hrId=$("#hrId").val();
	var orgName=$("#orgName").val();
	var unitName=$("#unitName").val();
	var name=$.trim($("#name").val());
//条件
	var sql = "SELECT "+getSelectSql();
	if(regionName!=''){
		sql+=" AND GROUP_ID_1 = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" AND UNIT_ID = '"+unitName+"'";
	}
	if(name!=''){
		sql+=" AND USER_NAME like '%"+name+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and AREA_NAME ='"+orgName+"'";
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
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
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
		"     G2JF, 					"+    //--  2G发展积分
		"     SWJF, 					"+    //--  上网卡发展积分
		"     G3JF, 					"+    //--  3G发展积分
		"     G4JF, 					"+    //--  4G发展积分
		"     GWJF, 					"+    //--  固网发展积分
		"     KDXFJF, 					"+    //--  宽带续费积分
		"     JTZZSRJF, 				"+    //-- 集团专租线积分
		"     ZTJF, 					"+    //--  质态积分
		"     LJJL_JF, 					"+    //--  裸机销售奖励积分
		"     WYG_JF, 					"+    //--  沃易购众筹积分
		"     ZTD_JF, 					"+    //--  营业厅自提积分
		"     MINI_JF, 					"+    //--  MINI厅积分
		"     HJXSJF, 					"+    //--  合计销售积分
		"     HQ_ALLJF, 				"+    //-- 渠道调节销售积分
		"     ZTUNITJF, 				"+    //-- 质态区域调节积分
		"     UNIT_ALLJF, 				"+    //-- 区域调节销售积分
		"     ALLSLL, 					"+    //--  总受理量
		"     BASE_SLJF, 				"+    //--  基础服务积分
		"     FW_JF, 					"+    //-- 服务积分
		"     ZZYW_JF, 					"+    //-- 增值业务积分
		"     SL_ALLJF, 				"+    //-- 总受理积分
		"     SL_SVR_ALL_CRE, 			"+    //--  服务调节受理积分
		"     UNIT_SL_ALLJF, 			"+    //-- 区域调节受理积分
		"     LYHZX_JF, 				"+    //-- 老用户专享积分
		"     CFYW_JF, 					"+    //-- 存费业务积分
		"     ZBJXY_JF, 				"+    //-- 自备机续约积分
		"     ZFK_JF, 					"+    //--  主副卡积分
		"     LLBDZ_JF, 				"+    //-- 流量语音包定制积分
		"     ZW_JF, 					"+    //-- 装维积分
		"     ZHWJ_JF, 					"+    //-- 智慧沃家积分
		"     WX_SVR_CRE, 				"+    //-- 维系服务积分
		"     WX_UNIT_CRE, 				"+    //--  维系区域积分
		"     WX_CRE, 					"+    //--  维系积分
		"     ACCSL_JF, 				"+    //--  业务单受理积分
		"     ACCTS_JF, 				"+    //--  投诉单受理积分
		"     ACCJD_JF, 				"+    //--  建单积分
		"     ACCHW_JF, 				"+    //--  话务积分
		"     ACCLINE_JF, 				"+    //--  线上会话积分
		"     SERVICE_JF, 				"+    //--  客服原始积分合计
		"     SERVICE_HR_JF, 			"+    //--  客服人员系数积分合计
		"     SERVICE_UNIT_JF, 			"+    //--  客服区域积分合计
		"     ALL_JF, 					"+    //--  总积分
		"     ALL_JF_MONEY 				"+    //--  总积分金额
		"FROM PMRT.TB_JCDY_JF_ALL_MON   "+    
		" WHERE DEAL_DATE = '"+time+"'";
	return sql;
}

function listRegions() {                                        
	var sql = "SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE  T WHERE 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and t.GROUP_ID_1='"+regionCode+"'";
	}else{
		sql+=" and 1=2";
	}
	sql+=" ORDER BY T.GROUP_ID_1";
	//排序
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}

function listUnits(regionName){
	var $unit=$("#unitName");
	var code=$("#code").val();
	/*var regionName=$("#regionName").val();*/
	var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1  ";
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			//sql+=" and t.AREA_NAME='"+orgName+"'";
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else{
			sql+=" and 1=2";
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	sql+=" ORDER BY T.UNIT_ID";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var hrId=$("#hrId").val();
	var orgName=$("#orgName").val();
	var unitName=$("#unitName").val();
	var name=$.trim($("#name").val());
	//var title=[["账期","地市","基层单元","人员姓名","hr编码","角色类型","2g发展量","上网卡发展量","3g发展量","4g发展量","宽带发展量","总受理量","2g发展积分","上网卡发展积分","3g发展积分","4g发展积分","固网发展积分","智慧沃家积分","宽带续费积分","集团专租线积分","质态积分","调节后质态积分","合计销售积分","渠道调节销售积分","区域调节销售积分","基础服务积分","服务积分","增值业务积分","总受理积分","服务调节受理积分","区域调节受理积分","老用户专享积分","存费业务积分","自备机续约积分","主副卡积分","流量语音包定制积分","维系积分","维系服务积分","维系区域积分","总积分","总积分金额"]];
	//var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","USER_NAME","HR_NO","USER_ROLE","G2SLL","SWSLL","G3SLL","G4SLL","KDSLL","ALLSLL","G2JF","SWJF","G3JF","G4JF","GWJF","ZHWJ_JF","KDXFJF","JTZZSRJF","ZTJF","ZTUNITJF","HJXSJF","HQ_ALLJF","UNIT_ALLJF","BASE_SLJF","FW_JF","ZZYW_JF","SL_ALLJF","SL_SVR_ALL_CRE","UNIT_SL_ALLJF","LYHZX_JF","CFYW_JF","ZBJXY_JF","ZFK_JF","LLBDZ_JF","WX_CRE","WX_SVR_CRE","WX_UNIT_CRE","ALL_JF","ALL_JF_MONEY"];
	var title=[["账期","地市"	 ,"基层单元" ,"人员姓名" ,"hr编码","角色类型" ,"发展量"  ,""            ,""        ,""        ,""          ,"销售积分"    ,""              ,""          ,""          ,""            ,""            ,""              ,""        ,""                ,""              ,""              ,""          ,""                ,""                ,""                ,""                ,"受理积分"    ,""            ,""        ,""              ,""                ,""                ,""                ,"维系积分"      ,""            ,""              ,""          ,""                  ,""        	,""            ,""            ,""            ,""                ,"客服积分"      ,""              ,""          ,""             ,""               ,""                ,""                    ,""                ,"总积分"      ,"总积分金额"],
			   ["",""    	 ,""         ,""         ,""      ,""         ,"2g发展量","上网卡发展量","3g发展量","4g发展量","宽带发展量","2g发展积分"  ,"上网卡发展积分","3g发展积分","4g发展积分","固网发展积分","宽带续费积分","集团专租线积分","质态积分","裸机销售奖励积分","沃易购众筹积分","营业厅自提积分","MINI厅积分","销售原始积分合计","渠道调节销售积分","质态区域调节积分","区域调节销售积分","总受理量"    ,"基础服务积分","服务积分","增值业务积分"  ,"受理原始积分合计","服务调节受理积分","区域调节受理积分","老用户专享积分","存费业务积分","自备机续约积分","主副卡积分","流量语音包定制积分","装维积分"	,"智慧沃家积分","维系服务积分","维系区域积分","维系原始积分合计","业务单受理积分","投诉单受理积分","建单积分"  ,"话务积分"     ,"线上会话积分"   ,"客服原始积分合计","客服人员系数积分合计","客服区域积分合计",""            ,""          ]];
	 var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","USER_NAME","HR_NO" ,"USER_ROLE","G2SLL"   ,"SWSLL"       ,"G3SLL"   ,"G4SLL"   ,"KDSLL"     ,"G2JF"        ,"SWJF"		   ,"G3JF"      ,"G4JF"      ,"GWJF"        ,"KDXFJF"      ,"JTZZSRJF"      ,"ZTJF"    ,"LJJL_JF"         ,"WYG_JF"        ,"ZTD_JF"        ,"MINI_JF"   ,"HJXSJF"          ,"HQ_ALLJF"        ,"ZTUNITJF"        ,"UNIT_ALLJF"      ,"ALLSLL"      ,"BASE_SLJF"   ,"FW_JF"   ,"ZZYW_JF"       ,"SL_ALLJF"        ,"SL_SVR_ALL_CRE"  ,"UNIT_SL_ALLJF"   ,"LYHZX_JF"      ,"CFYW_JF"     ,"ZBJXY_JF"      ,"ZFK_JF"    ,"LLBDZ_JF"          ,"ZW_JF"     ,"ZHWJ_JF"     ,"WX_SVR_CRE"  ,"WX_UNIT_CRE" ,"WX_CRE"          ,"ACCSL_JF"      ,"ACCTS_JF"      ,"ACCJD_JF"  ,"ACCHW_JF"     ,"ACCLINE_JF"     ,"SERVICE_JF"      ,"SERVICE_HR_JF"       ,"SERVICE_UNIT_JF" ,"ALL_JF"      ,"ALL_JF_MONEY"];
	 
	 var sql = "SELECT DEAL_DATE,"+getSelectSql();
	 


	if (regionName != '') {
		sql += " AND GROUP_ID_1 = '" + regionName + "'";
	}
	if (unitName != '') {
		sql += " AND UNIT_ID = '" + unitName + "'";
	}
	if(name!=''){
		sql+=" AND USER_NAME like '%"+name+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and AREA_NAME ='"+orgName+"'";
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
