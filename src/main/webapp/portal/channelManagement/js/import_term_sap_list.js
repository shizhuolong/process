var nowData = [];
var title=[["订单号","行项目号","订单类型","订单类型描述","订单日期","订单时间","客户号","客户名称","销售组织","省分公司","省分名称","地市公司","地市名称","仓库(营业厅)","仓库名称","运营模式","运营模式描述","ESS渠道编码","ESS渠道名称","商品号","商品名称","存费送费/无线标识","型号","网络制式","自身品牌","数量","串码","物料类型","物料组","物料组名称","集团定位","自营代办","经营模式","采购来源","颜色","手机号","POS单号","ESS单号","付款标识","销售单价","建议零售价","订单总价","收入","含税总价","折扣金额","成本","毛利率","毛利额","合约销售价","合约结算价","是否新用户","2G/3G标识","合约套餐","合约惠机标识","收银编号","收银姓名","导购员编号","导购员名称","资费包","销退单原订单号","旧机回收金额","回收旧机编码","编码描述","旧机串码","供应商","供应商商品码","商品码描述","B2C订单编号","B2C电商单号"]];
var field=["ORDER_NO","ID","ORDER_TYPE","ORDER_TYPE_DESC","DEAL_DATE","ORDER_TIME","CUST_ID","CUST_NAME","SALE_DEPART","PROVINCE_COM","PROVINCE_COM_NAME","CITY_COM","CITY_COM_NAME","WAREHOUSE","WAREHOUSE_NAME","OPERATION_MODE","OPERATION_MODE_NAME","DEPART_ID","DEPART_NAME","PRODUCT_ID","PRODUCT_NAME","CFSF_WIRELESS","VERSION","NETWORK","BRAND_NAME","QTY","IMEI","MATERIEL_TYPE","MATERIEL_SORT","MATERIEL_SORT_NAME","GROUP_POSITION","SELF_AGENT","BUSINESS_MODE","ORDER_SOURCE","COLOR","PHONENO","POS_NO","ESS_NO","PAY_WAY","PRICE","RETAIL_PRICE","TOTAL","IMCOME","TOTAL_TAX","DISCOUNT","COST","MARGIN_RATE","MARGIN","CONTRACT_PRICE","COMTRACT_SETTLE_PRICE","IS_NEW_USER","IS_2G3G","CONTRACT_PRODUCT","IS_CONTRACT_PRODUCT","CASHIER_CODE","CACHIER_NAME","GUIDE_CODE","GUIDE_NAME","TARIFF_PACKAGE","RETURN_ORDER_NO","RETURN_TOTAL","RETURN_MACHINE_CODE","CODE_DESC","RETURN_IMEI","VENDOR","VENDOR_PRODUCT_CODE","PRODUCT_CODE_DESC","B2C_ORDER_NO","B2C_EC_NO"];
var report = null;
var totalCount=0;

$(function() {
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {

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
	var username=$("#username").val();
	var sql="SELECT * FROM PMRT.TB_OPERATE_IMPORT_TERM_TEMP WHERE IN_USER_NAME='"+username+"'";
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	if(cdata && cdata.length) {
		totalCount = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(totalCount);
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

function importToResult(){
	if(totalCount>0){
		if(confirm("确认导入？")){
			$("#confirmBtn").hide();
			$.ajax({
				type:"POST",
				dataType:'json',
				async:true,
				cache:false,
				url:$("#ctx").val()+"/channelManagement/importTerm_importToResult.action",
			   	success:function(data){
			   		if(data&&data.ok){
			   			alert("已经成功入库!");
			   		}else{
			   			alert("入库失败,请重试!");
			   			$("#confirmBtn").show();
			   		}
			    }
			});
		}
	}else{
		alert("没有要入库的数据,请先导入!");
	}
  }
 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_term_sap.jsp";
 }