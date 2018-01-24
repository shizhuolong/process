var report;
var qdate="";
var orderBy="";
var code="";
var orgLevel="";
var area_name="";
$(function(){
	var field=["ROW_NAME","DEVELOPER_NAME","DEVELOPER_ID","STROECODE" ,"STROENAME" ,"TDC_NAME" ,"TDC_PHONE" ,"DD" ,"XL" ,"XS" ,"XX"];
	var title=[["州市","发展人","发展人编码","二维码编码","二维码名称","二维码联系人","二维码对应手机","订单量","销量","线上","线下"]];
	$("#searchBtn").click(function(){
		report.showSubRow();
		 $("#lch_DataBody").find("TR").each(function(row){
				$(this).find("TD").each(function(col){
					if(($(this).find("A").hasClass("sub_on"))||($(this).find("A").hasClass("sub_off"))){
						
					}else{
						var tn=getColumnName(field[col]);
						var text=$(this).text();
						code=$(this).parent().attr("row_id");
						orgLevel=$(this).parent().attr("orgLevel");
						area_name=$(this).parent().attr("row_name");
						if(tn!=null){
							$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tn='+tn+' level='+(orgLevel-1)+' area_name='+area_name+' code='+code+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
						}
					}
				});
		 });
	});
	report=new LchReport({
		title:title,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID","ROW_NAME"],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			report.showSubRow();
			 $("#lch_DataBody").find("TR").each(function(row){
					$(this).find("TD").each(function(col){
						if(($(this).find("A").hasClass("sub_on"))||($(this).find("A").hasClass("sub_off"))){
							
						}else{
							var tn=getColumnName(field[col]);
							var text=$(this).text();
							code=$(this).parent().attr("row_id");
							orgLevel=$(this).parent().attr("orgLevel");
							area_name=$(this).parent().attr("row_name");
							if(tn!=null){
								$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tn='+tn+' level='+(orgLevel-1)+' area_name='+area_name+' code='+code+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
							}
						}
					});
			 });
		},
		getSubRowsCallBack:function($tr){
			var region =$("#region").val();
			var code=$("#code").val();
			var orgLevel="";
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var dealDate=$("#dealDate").val();
			var stroeCode=$("#stroeCode").val();
			var where=" WHERE DEAL_DATE="+dealDate;
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			if(unitCode!=''){
				where+= " AND UNIT_ID ='"+unitCode+"'";
			}
			if(stroeCode!=''){
				where+= " AND STROECODE ='"+stroeCode+"'";
			}
			
			//权限
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				if(orgLevel==2){
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,orgLevel);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=1;
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID='"+code+"'";
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(where,orgLevel);
				orgLevel++;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		},
		afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").each(function(row){
				$(this).find("TD").each(function(col){
					if(($(this).find("A").hasClass("sub_on"))||($(this).find("A").hasClass("sub_off"))){
						
					}else{
						var tn=getColumnName(field[col]);
						var text=$(this).text();
						code=$(this).parent().attr("row_id");
						orgLevel=$(this).parent().attr("orgLevel");
						area_name=$(this).parent().attr("row_name");
						if(tn!=null){
							$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tn='+tn+' level='+(orgLevel-1)+' area_name='+area_name+' code='+code+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
						}
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
				var tn=getColumnName(field[col]);
				var text=$(this).text();
				code=$(this).parent().attr("row_id");
				orgLevel=$(this).parent().attr("orgLevel");
				area_name=$(this).parent().attr("row_name");
				if(tn!=null){
					$(this).empty().html('<a onclick="openDetail(this)" style="color:blue;cursor:pointer;" class="data" tn='+tn+' level='+(orgLevel-1)+' area_name='+area_name+' code='+code+' qdate='+qdate+' detail_name="'+area_name+'—'+tn+'明细">'+text+'</a>');
				}
			}
		});
    });
    ///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function openDetail(obj){
	var level=$(obj).attr("level");
	var code=$(obj).attr("code");
	var qdate = $("#dealDate").val();
	var tn = $(obj).attr("tn");
	var is_pay = "";
	if(tn=="销量"){
		is_pay = "xl";
	}
	var area_name=$(obj).attr("area_name");
	var url=$("#ctx").val()+"/report/reportNew/jsp/Qrcode_detail.jsp?level="+level+"&code="+code+"&qdate="+qdate+"&isPayLj="+is_pay;
	window.parent.openWindow(area_name,null,url);
}	

function getColumnName(tbcode){
	var tn = "";
	if(tbcode == 'DD') {
		tn = "订单";
	}else if(tbcode == 'XL') {
		tn = "销量";
	}else{
		tn = null;
	}
	return tn;
}	

function getSql(where,orgLevel){
	var dealDate=$("#dealDate").val();
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' DEVELOPER_ID,'--' DEVELOPER_NAME,'--' STROECODE,'--' STROENAME,'--' TDC_NAME, '--' TDC_PHONE,";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
	}else if(orgLevel==2){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,'--' DEVELOPER_ID,'--' DEVELOPER_NAME,'--' STROECODE,'--' STROENAME,'--' TDC_NAME, '--' TDC_PHONE,";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
	}else if(orgLevel==3){
		preSql="SELECT deal_date,group_id_1_name,unit_name, HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME,DEVELOPER_ID,DEVELOPER_NAME,STROECODE,STROENAME,TDC_NAME,TDC_PHONE,";
		groupBy=" GROUP BY deal_date,group_id_1_name,unit_name, HQ_CHAN_CODE,HQ_CHAN_NAME,DEVELOPER_ID,DEVELOPER_NAME,STROECODE,STROENAME,TDC_NAME,TDC_PHONE";
	}
	var sql=preSql+
	"sum(dd) DD,"+
    "sum(XL) XL,"+
    "sum(XS) XS ,"+
    "sum(XX) XX "+
    "FROM pmrt.tab_mrt_tdc_dev_detail "+
	where+groupBy;
	return sql;
}

function downsAll() {
	var region =$("#region").val();
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();
	var stroeCode=$("#stroeCode").val();
	var where=" WHERE DEAL_DATE="+dealDate;
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	if(stroeCode!=''){
		where+= " AND STROECODE ='"+stroeCode+"'";
	}
	//权限
	if(orgLevel==2){
		where+= " AND GROUP_ID_1 ='"+code+"'";
	}
	if(orgLevel==3){
		where+= " AND UNIT_ID ='"+code+"'";
	}
	if(orgLevel>=4){
		where+= " AND 1 =2 ";
	}
	var downsql = getSql(where,3);
	var title=[["账期","地市","营服名称","渠道编码","渠道名称","发展人","发展人编码","二维码编码","二维码名称","二维码联系人","二维码对应手机","订单量","销量","线上","线下"]];
	showtext = "二维码清单列表明细";
	downloadExcel(downsql,title,showtext);
}