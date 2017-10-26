var field=["BSS_2G","ESS_2G","NET_2G","CASHBACK_2G","IMPORT_2G","TOTAL_2G","BSS_3G","ESS_3G","NET_3G","CASHBACK_3G","IMPORT_3G","TOTAL_3G","BSS_4G","ESS_4G","NET_4G","CASHBACK_4G","IMPORT_4G","TOTAL_4G","BSS_NETWORK","ESS_NETWORK","NET_NETWORK","IMPORT_NETWORK","TOTAL_NETWORK","BSS_FLOW","ESS_FLOW","NET_FLOW","IMPORT_FLOW","TOTAL_FLOW","CHANL_SUBSIDY","MANUAL_ADJUSTMENT","OTHER","TOTAL","TOTAL_FEE"];
var title=[["组织架构","2G","","","","","","3G","","","","","","4G","","","","","","固网","","","","","融合","","","","","渠道补贴","手工佣金","紧密型外包的佣金","总计","含税"],
           ["","BSS系统","集中系统","网格系统","现返佣金","未支撑","2G合计","BSS系统","集中系统","网格系统","现返佣金","未支撑","3G合计","BSS系统","集中系统","网格系统","现返佣金","未支撑","4G合计","BSS系统","集中系统","网格系统","未支撑","固网合计","BSS系统","集中系统","网格系统","未支撑","融合合计","","","","",""]];
var report=null;
var qdate="";
var orderBy="";
var code="";
var orgLevel="";
var chnlName="";
var area_name="";
var hrIds="";
$(function(){
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		/*lock:1,*/
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" ORDER BY ROW_NAME "+type+" ";
			}else if(index>0){
				orderBy=" ORDER BY "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
			 $("#lch_DataBody").find("TR").each(function(row){
					$(this).find("TD").each(function(col){
						if(($(this).find("A").hasClass("sub_on"))||($(this).find("A").hasClass("sub_off"))){
							
						}else{
							var tn=getColumnName(field[col-1]);
							var text=$(this).text();
							code=$(this).parent().attr("row_id");
							orgLevel=$(this).parent().attr("orgLevel");
							area_name=$(this).parent().attr("row_name");
							$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tablecode='+field[col-1]+' level='+(orgLevel-1)+' area_name='+area_name+' comm_name='+tn+' code='+code+' chnlName='+chnlName+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
						}
					});
			 });
		},
		getSubRowsCallBack:function($tr){
			var preSql='';
			var where=' WHERE 1 = 1';
			var groupBy='';
			qdate = $("#mon").val();
			chnlName=$.trim($("#chnlName").val());
			var hrId=$("#hrId").val();
			var order='';
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
			    if(orgLevel==2){
			    	preSql="SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_0='"+code+"'";
					order=" ORDER BY T.GROUP_ID_1";
				}else if(orgLevel==3){
					preSql="SELECT T.UNIT_ID ROW_ID,T.UNIT_NAME ROW_NAME,";
					groupBy=" GROUP BY T.UNIT_ID,T.UNIT_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					order=" ORDER BY T.UNIT_ID";
				}else if(orgLevel==4){
					preSql="SELECT T.GROUP_ID_4 ROW_ID,T.GROUP_ID_4_NAME ROW_NAME,";
					groupBy=" GROUP BY T.GROUP_ID_4,T.GROUP_ID_4_NAME";
					where+=" AND T.UNIT_ID='"+code+"'";
					order=" ORDER BY T.GROUP_ID_4";
				}else{
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){
					preSql="SELECT T.GROUP_ID_0 ROW_ID,T.GROUP_ID_0_NAME ROW_NAME,";
					order=" ORDER BY T.GROUP_ID_0";
					groupBy=" GROUP BY T.GROUP_ID_0,T.GROUP_ID_0_NAME";
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==2){
					preSql="SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					preSql="SELECT T.UNIT_ID ROW_ID,T.UNIT_NAME ROW_NAME,";
					groupBy=" GROUP BY T.UNIT_ID,T.UNIT_NAME";
					hrIds=_jf_power(hrId,qdate);
					if(hrIds&&hrIds!=""){
						 where+=" AND T.HR_ID in("+hrIds+") ";
					}else{
						 where+=" AND 1=2 ";	 
					 }
				}else{
					return {data:[],extra:{}};
				}
			}	
			orgLevel++;
						
			if(chnlName!=''){
				where+=" AND T.GROUP_ID_4_NAME LIKE '%"+chnlName+"%'";
			}
			var sql = preSql+getSumSql()+" FROM PMRT.TAB_MRT_COMM_AGENT_REPORT PARTITION(P"+qdate+") T "+where+groupBy+order;
			if(orderBy!=''){
				sql="select * from( "+sql+") a "+orderBy;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		},
		afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").each(function(row){
				$(this).find("TD").each(function(col){
					if(($(this).find("A").hasClass("sub_on"))||($(this).find("A").hasClass("sub_off"))){
						
					}else{
						var tn=getColumnName(field[col-1]);
						var text=$(this).text();
						code=$(this).parent().attr("row_id");
						orgLevel=$(this).parent().attr("orgLevel");
						area_name=$(this).parent().attr("row_name");
						$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tablecode='+field[col-1]+' level='+(orgLevel-1)+' area_name='+area_name+' comm_name='+tn+' code='+code+' chnlName='+chnlName+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
					}
				});
		    });
		}
	});
    report.showSubRow();
    $("#lch_DataBody").find("TR").each(function(row){
		$(this).find("TD").each(function(col){
			if(($(this).find("A").hasClass("sub_on"))||($(this).find("A").hasClass("sub_off"))){
			}else{
				var tn=getColumnName(field[col-1]);
				var text=$(this).text();
				code=$(this).parent().attr("row_id");
				orgLevel=$(this).parent().attr("orgLevel");
				area_name=$(this).parent().attr("row_name");
				$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tablecode='+field[col-1]+' level='+(orgLevel-1)+' area_name='+area_name+' comm_name='+tn+' code='+code+' chnlName='+chnlName+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
			}
		});
    });
    //$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
	    $("#lch_DataBody").find("TR").each(function(row){
			$(this).find("TD").each(function(col){
				if(($(this).find("A").hasClass("sub_on"))||($(this).find("A").hasClass("sub_off"))){
					
				}else{
					var tn=getColumnName(field[col-1]);
					var text=$(this).text();
					code=$(this).parent().attr("row_id");
					orgLevel=$(this).parent().attr("orgLevel");
					area_name=$(this).parent().attr("row_name");
					$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tablecode='+field[col-1]+' level='+(orgLevel-1)+' area_name='+area_name+' comm_name='+tn+' code='+code+' chnlName='+chnlName+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
				}
			});
	 });
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
	});
});

function openDetail(obj){
	var tablecode=$(obj).attr("tablecode");
	var comm_name=$(obj).attr("comm_name");
	var level=$(obj).attr("level");
	var code=$(obj).attr("code");
	var chnlName=$(obj).attr("chnlName");
	var qdate=$("#mon").val();
	var area_name=$(obj).attr("area_name");
	var url=$("#ctx").val()+"/report/devIncome/jsp/comm_manage_detail.jsp?tablecode="+tablecode+"&comm_name="+encodeURI(encodeURI(comm_name))+"&level="+level+"&code="+code+"&chnlName="+chnlName+"&qdate="+qdate+"&hrIds="+hrIds;
	window.parent.openWindow(area_name,null,url);
}

function getColumnName(tbcode){
	var tn = "";
	if(tbcode == 'BSS_2G') {
		tn = "2G—BSS系统";
	}else if(tbcode == 'ESS_2G') {
		tn = "2G—集中系统";
	}else if(tbcode == 'NET_2G') {
		tn = "2G—网格系统";
	}else if(tbcode == 'CASHBACK_2G') {
		tn = "2G-现返";
	}else if(tbcode == 'IMPORT_2G') {
		tn = "2G—未支撑";
	}else if(tbcode == 'TOTAL_2G') {
		tn = "2G-合计";
	}else if(tbcode == 'BSS_3G'){
		tn = "3G—BSS系统";
	}else if(tbcode == 'ESS_3G') {
		tn = "3G—集中系统";
	}else if(tbcode == 'NET_3G') {
		tn = "3G—网格系统";
	}else if(tbcode == 'CASHBACK_3G') {
		tn = "3G-现返";
	}else if(tbcode == 'IMPORT_3G') {
		tn="3G—未支撑";
	}else if(tbcode == 'TOTAL_3G') {
		tn = "3G-合计";
	}else if(tbcode == 'BSS_4G'){
		tn = "4G—BSS系统";
	}else if(tbcode == 'ESS_4G') {
		tn = "4G—集中系统";
	}else if(tbcode == 'NET_4G') {
		tn = "4G—网格系统";
	}else if(tbcode == 'CASHBACK_4G') {
		tn = "4G-现返";
	}else if(tbcode == 'IMPORT_4G') {
		tn="4G—未支撑";
	}else if(tbcode == 'TOTAL_4G') {
		tn = "4G-合计";
	}else if(tbcode == 'BSS_NETWORK') {
		tn = "固网—BSS系统";
	}else if(tbcode == 'ESS_NETWORK') {
		tn = "固网—ESS系统";
	}else if(tbcode == 'NET_NETWORK') {
		tn = "固网—网格系统";
	}else if(tbcode == 'IMPORT_NETWORK') {
		tn = "固网—未支撑";
	}else if(tbcode == 'TOTAL_NETWORK') {
		tn = "固网-合计";
	}else if(tbcode == 'BSS_FLOW') {
		tn = "融合—BSS系统";
	}else if(tbcode == 'ESS_FLOW') {
		tn = "融合—集中系统";
	}else if(tbcode == 'NET_FLOW') {
		tn = "融合—网格系统";
	}else if(tbcode == 'IMPORT_FLOW') {
		tn = "融合—未支撑";
	}else if(tbcode == 'TOTAL_FLOW') {
		tn = "融合-合计";
	}else if(tbcode == 'CHANL_SUBSIDY') {
		tn = "渠道补贴";
	}else if(tbcode == 'OTHER'){
		tn = "其他";
	}else if(tbcode == 'TOTAL') {
		tn = "总计";
	}else if(tbcode == 'MANUAL_ADJUSTMENT'){
		tn = "手工佣金";
	}else{
		tn="含税";
	}
	return tn;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY T.GROUP_ID_1,T.UNIT_ID,T.GROUP_ID_4";
	var chnlName=$.trim($("#chnlName").val());
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	//权限
	if(orgLevel==1){
		where+=" AND T.GROUP_ID_0='"+code+"'";
	}else if(orgLevel==2){
		where+=" AND T.GROUP_ID_1='"+code+"'";
	}else{
		 if(hrIds&&hrIds!=""){
			 where+=" AND HR_ID in("+hrIds+") ";
		 }else{
			 where+=" AND 1=2 ";	 
		 }
	}
	if(chnlName!=''){
		where+=" AND T.GROUP_ID_4_NAME LIKE '%"+chnlName+"%'";
	}
	var title=[["地市","营服","渠道","渠道编码","渠道属性1","渠道属性2","渠道属性3","渠道属性4","帐期","2G","","","","","","3G","","","","","","4G","","","","","","固网","","","","","融合","","","","","渠道补贴","手工佣金","紧密型外包的佣金","总计","含税"],
		           ["","","","","","","","","","BSS系统","集中系统","网格系统","现返佣金","未支撑","2G合计","BSS系统","集中系统","网格系统","现返佣金","未支撑","3G合计","BSS系统","集中系统","网格系统","现返佣金","未支撑","4G合计","BSS系统","集中系统","网格系统","未支撑","固网合计","BSS系统","集中系统","网格系统","未支撑","融合合计","","","","",""]];
	var sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.DEV_CHNL_ID,T.CHN_CDE_1_NAME,T.CHN_CDE_2_NAME,T.CHN_CDE_3_NAME,T.CHN_CDE_4_NAME,T.BILLINGCYCLID,"+field.join(",")+" FROM PMRT.TAB_MRT_COMM_AGENT_REPORT PARTITION(P"+qdate+") T "+where+orderBy;
	showtext = '佣金汇总月报' + qdate;
	downloadExcel(sql,title,showtext);
}

function getSumSql(orgLevel){
  var s="";
	for(var i=0;i<field.length;i++){
		if(s.length>0){
			s+=",";
		}
		s+="SUM(NVL(T."+field[i]+",0)) AS "+field[i];
	}
	return s;
}
