var nowData = [];
var title=[["分公司","订单号","营业厅","营业厅编码","供应商","供应商编码","操作工号","发展人信息","终端品牌","终端型号","用户号码","终端串号","终端价格","","毛利分配","","","","是否调价销售","受理时间","订单类型","操作"],
           ["","","","","","","","","","","","","进货价","零售价","销售毛利合计","营业厅毛利","营销成本","营业厅利润","","","","",""]];
var field=["GROUP_ID_1_NAME","ORDER_CODE","YYT_HQ_NAME","YYT_CHAN_CODE","SUP_HQ_NAME","SUP_HQ_CODE","OPERATOR_ID","DEVELOPER_ID","ZD_BRAND","ZD_TYPES","SERVICE_NUM","ZD_IEMI","IN_PRICE","OUT_PRICE","SALE_ML","YYT_ML","YX_COST","YYT_PROFIT","IS_CHANGE_PRICE","ACC_TIME","IS_BACK","OPERATOR"];
var report = null;
var downSql="";
var role="ROLE_MANAGER_RESOURCEMANAGER_ZDZY_ZDGL_SALES_MANAGER_LIST_UPDATEPART";
$(function() {
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		$("#addTd").remove();
	}else{
		if(!isGrantedNew(role)){
			$("#addTd").remove();
		}
	}
	$("#zd_iemi").change(function(){
		initOthersByZd($.trim($(this).val()));
	});
	$("#is_change_price").change(function(){
		if($(this).val()=="是"){
			$("#service_num").removeAttr("readonly");
			$("#out_price").removeAttr("readonly");
		}else{
			$("#service_num").attr("readonly","readonly");
			$("#out_price").attr("readonly","readonly");
		}
	});
	$("#out_price").change(function(){
		 var in_price=$("#in_price").val();
		 var out_price=$.trim($("#out_price").val());
		 if(parseInt(out_price)<parseInt(in_price)){
			 $("#out_price").val("");
			 return;
		 }
	   	 var sale_ml=out_price-in_price;
    	 $('#sale_ml').val(sale_ml);
    	 $('#yyt_ml').val(sale_ml*0.5);
    	 $('#yx_cost').val(sale_ml*0.25);
    	 $('#yyt_profit').val(sale_ml*0.25);
	});
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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
	var orgLevel=$("#orgLevel").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var order_type=$("#order_type").val();
	var hallName=$("#hallName").val();
	var s_zd_iemi=$("#s_zd_iemi").val();
	var sql="";
	var field1=["GROUP_ID_1_NAME","ORDER_CODE","YYT_HQ_NAME","YYT_CHAN_CODE","SUP_HQ_NAME","SUP_HQ_CODE","OPERATOR_ID","DEVELOPER_ID","ZD_BRAND","ZD_TYPES","SERVICE_NUM","ZD_IEMI","IN_PRICE","OUT_PRICE","SALE_ML","YYT_ML","YX_COST","YYT_PROFIT","IS_CHANGE_PRICE","ACC_TIME"];
	if(orgLevel==1||!isGrantedNew(role)||order_type!='0'){
		sql="SELECT '' OPERATOR,"+field1.join(",")+",CASE WHEN IS_BACK='0' THEN '销售单' WHEN IS_BACK='1' THEN '换机单' WHEN IS_BACK='2' THEN '退货单' ELSE '销售单' END IS_BACK FROM PMRT.TAB_MRT_YYT_ZD_ORDER WHERE 1=1";
	}else{//销售订单
		sql="SELECT '<a style=\"color:blue;cursor:hand;\" order_code='|| ORDER_CODE ||' onclick=\"changeMobile($(this));\">换机</a>&nbsp;<a style=\"color:blue;cursor:hand;\" order_code='|| ORDER_CODE ||' onclick=\"back($(this));\">退货</a>' OPERATOR,"+field1.join(",")+",CASE WHEN IS_BACK='0' THEN '销售单' WHEN IS_BACK='1' THEN '换机单' WHEN IS_BACK='2' THEN '退货单' ELSE '销售单' END IS_BACK FROM PMRT.TAB_MRT_YYT_ZD_ORDER WHERE 1=1";
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(order_type!=''){
		sql+=" AND IS_BACK='"+order_type+"'";
		if(order_type=='0'){//销售单
			sql+=" AND SUBSTR(ACC_TIME,0,8) BETWEEN "+startDate+" AND "+endDate;
		}
	}
	if(hallName!=''){
		sql+=" AND YYT_HQ_NAME LIKE '%"+hallName+"%'";
	}
	if(s_zd_iemi!=''){
		sql+=" AND ZD_IEMI LIKE '%"+s_zd_iemi+"%'";
	}
	sql+=" ORDER BY CREATE_TIME DESC";
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
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

 function exportData(){
	var showtext = '销售终端';
	var field1=["GROUP_ID_1_NAME","ORDER_CODE","YYT_HQ_NAME","YYT_CHAN_CODE","SUP_HQ_NAME","SUP_HQ_CODE","OPERATOR_ID","DEVELOPER_ID","ZD_BRAND","ZD_TYPES","SERVICE_NUM","ZD_IEMI","IN_PRICE","OUT_PRICE","SALE_ML","YYT_ML","YX_COST","YYT_PROFIT","IS_CHANGE_PRICE","ACC_TIME"];
	downSql="SELECT "+field1.join(",")+",CASE WHEN IS_BACK='0' THEN '销售单' WHEN IS_BACK='1' THEN '换机单' WHEN IS_BACK='2' THEN '退货单' ELSE '销售单' END IS_BACK FROM PMRT.TAB_MRT_YYT_ZD_ORDER WHERE 1=1";
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var order_type=$("#order_type").val();
	var hallName=$("#hallName").val();
	var s_zd_iemi=$("#s_zd_iemi").val();
	if(regionCode!=''){
		downSql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(order_type!=''){
		downSql+=" AND IS_BACK='"+order_type+"'";
		if(order_type=='0'){//销售单
			downSql+=" AND SUBSTR(ACC_TIME,0,8) BETWEEN "+startDate+" AND "+endDate;
		}
	}
	if(hallName!=''){
		downSql+=" AND YYT_HQ_NAME LIKE '%"+hallName+"%'";
	}
	if(s_zd_iemi!=''){
		downSql+=" AND ZD_IEMI LIKE '%"+s_zd_iemi+"%'";
	}
	var title=[["分公司","订单号","营业厅","营业厅编码","供应商","供应商编码","操作工号","发展人信息","终端品牌","终端型号","用户号码","终端串号","终端价格","","毛利分配","","","","是否调价销售","受理时间","订单类型"],
	           ["","","","","","","","","","","","","进货价","零售价","销售毛利合计","营业厅毛利","营销成本","营业厅利润","","",""]];
	downloadExcel(downSql,title,showtext);
 }
 
 function back(obj){
	 $("#saveBtn").show();
	 var order_code=obj.attr("order_code");
	 var sql="SELECT * FROM PMRT.TAB_MRT_YYT_ZD_ORDER WHERE ORDER_CODE='"+order_code+"' AND IS_BACK=0";
	 var r=query(sql);
	 if(r!=null&&r.length>0){
		 $("#order_code").val(isNull(order_code));
		 $("#is_back").val("2");
		 $("#zd_iemi").val(isNull(r[0].ZD_IEMI));
		 $("#group_id_1").val(isNull(r[0].GROUP_ID_1));
    	 $("#group_id_1_name").val(isNull(r[0].GROUP_ID_1_NAME));
    	 $("#yyt_hq_name").val(isNull(r[0].YYT_HQ_NAME));
    	 $("#yyt_chan_code").val(isNull(r[0].YYT_CHAN_CODE));
    	 $("#sup_hq_name").val(isNull(r[0].SUP_HQ_NAME));
    	 $("#sup_hq_code").val(isNull(r[0].SUP_HQ_CODE));
    	 $("#zd_brand").val(isNull(r[0].ZD_BRAND));
    	 $("#zd_types").val(isNull(r[0].ZD_TYPES));
    	 $("#is_change_price").val(isNull(r[0].IS_CHANGE_PRICE));
         $("#service_num").val(isNull(r[0].SERVICE_NUM));
       	 $("#developer_id").val(isNull(r[0].DEVELOPER_ID));
       	 $('#sale_ml').val(isNull(r[0].SALE_ML));
    	 $('#yyt_ml').val(isNull(r[0].YYT_ML));
    	 $('#yx_cost').val(isNull(r[0].YX_COST));
    	 $('#yyt_profit').val(isNull(r[0].YYT_PROFIT));
    	 $('#in_price').val(isNull(r[0].IN_PRICE));
    	 $('#out_price').val(isNull(r[0].OUT_PRICE));
      	 $("#operator_id").val(r[0].OPERATOR_ID);
     var date = new Date();
   	 $("#acc_time").val(date.pattern("yyyyMMdd HH:mm"));
   	 $("#addDiv").show();
   	 $('#addDiv').dialog({
   			title : '终端退货',
   			width : 700,
   			height : 500,
   			closed : false,
   			cache : false,
   			modal : false,
   			maximizable : true,
   			onClose:function(){
   				$("#addDiv").hide();
   			}
   	});
   }
 }
 var old_zd_iemi="";
 function changeMobile(obj){
	 $("#saveBtn").show();
	 var order_code=obj.attr("order_code");
	 var sql="SELECT * FROM PMRT.TAB_MRT_YYT_ZD_ORDER WHERE ORDER_CODE='"+order_code+"' AND IS_BACK=0";
	 var r=query(sql);
	 if(r!=null&&r.length>0){
		 $("#order_code").val(isNull(order_code));
		 $("#is_back").val("1");
		 $("#zd_iemi").val(isNull(r[0].ZD_IEMI));
		 old_zd_iemi=isNull(r[0].ZD_IEMI);
		 $("#old_zd_iemi").val(isNull(r[0].ZD_IEMI));
		 $("#group_id_1").val(isNull(r[0].GROUP_ID_1));
    	 $("#group_id_1_name").val(isNull(r[0].GROUP_ID_1_NAME));
    	 $("#yyt_hq_name").val(isNull(r[0].YYT_HQ_NAME));
    	 $("#yyt_chan_code").val(isNull(r[0].YYT_CHAN_CODE));
    	 $("#sup_hq_name").val(isNull(r[0].SUP_HQ_NAME));
    	 $("#zd_brand").val(isNull(r[0].ZD_BRAND));
    	 $("#zd_types").val(isNull(r[0].ZD_TYPES));
    	 $("#sale_ml").val(isNull(r[0].SALE_ML));
    	 $("#yyt_ml").val(isNull(r[0].YYT_ML));
    	 $("#yx_cost").val(isNull(r[0].YX_COST));
    	 $("#yyt_profit").val(isNull(r[0].YYT_PROFIT));
    	 $("#is_change_price").val(isNull(r[0].IS_CHANGE_PRICE));
         $("#service_num").val(r[0].SERVICE_NUM);
       	 $("#developer_id").val(r[0].DEVELOPER_ID);
         $("#in_price").val(r[0].IN_PRICE);
      	 $("#out_price").val(r[0].OUT_PRICE);
         $("#operator_id").val(r[0].OPERATOR_ID);
     var date = new Date();
   	 $("#acc_time").val(date.pattern("yyyyMMdd HH:mm"));
   	 $("#addDiv").show();
   	 $('#addDiv').dialog({
   			title : '换机',
   			width : 700,
   			height : 500,
   			closed : false,
   			cache : false,
   			modal : false,
   			maximizable : true,
   			onClose:function(){
   				$("#addDiv").hide();
   			}
   	});
   }
 }
 
 function initOthersByZd(zd_iemi){
	 var s="SELECT ZD_IEMI FROM PMRT.TAB_MRT_YYT_ZD_ORDER WHERE ZD_IEMI = '"+zd_iemi+"' AND IS_BACK='0'";//IS_BACK=0代表已销售
	 var d=query(s);
	 if(d!=null&&d.length>0){
		 alert("该终端串码已销售！");
		 return;
	 }
	 var sql=" SELECT GROUP_ID_1,GROUP_ID_1_NAME,YYT_HQ_NAME,YYT_CHAN_CODE,SUP_HQ_NAME,SUP_HQ_CODE,ZD_BRAND,ZD_TYPES,IN_PRICE,OUT_PRICE,SUP_HQ_CODE FROM PMRT.TAB_MRT_YYT_ZD_BASE WHERE ZD_IEMI='"+zd_iemi+"' AND STATUS=2 AND IS_BACK=0";//STATUS审核通过的，IS_BACK=1代表退货 0可销售、1已销售 2已退库
     var r=query(sql);
     if(r!=null&&r.length>0){
    	 $("#group_id_1").val(isNull(r[0].GROUP_ID_1));
    	 $("#group_id_1_name").val(isNull(r[0].GROUP_ID_1_NAME));
    	 $("#yyt_hq_name").val(isNull(r[0].YYT_HQ_NAME));
    	 $("#yyt_chan_code").val(isNull(r[0].YYT_CHAN_CODE));
    	 $("#sup_hq_name").val(isNull(r[0].SUP_HQ_NAME));
    	 $("#sup_hq_code").val(isNull(r[0].SUP_HQ_CODE));
    	 $("#zd_brand").val(isNull(r[0].ZD_BRAND));
    	 var zd_types=r[0].ZD_TYPES;
    	 $("#zd_types").val(isNull(r[0].ZD_TYPES));
    	 var in_price=isNull(r[0].IN_PRICE);
    	 var out_price=isNull(r[0].OUT_PRICE);
    	 var sale_ml=out_price-in_price;
    	 $('#in_price').val(in_price);
    	 $('#out_price').val(out_price);
    	 $('#sale_ml').val(sale_ml);
    	 $('#yyt_ml').val(sale_ml*0.5);
    	 $('#yx_cost').val(sale_ml*0.25);
    	 $('#yyt_profit').val(sale_ml*0.25);
     }else{
    	/* $("#zd_iemi").val("");*/
    	 $("#group_id_1").val("");
       	 $("#group_id_1_name").val("");
       	 $("#yyt_hq_name").val("");
       	 $("#yyt_chan_code").val("");
       	 $("#sup_hq_name").val("");
       	 $("#sup_hq_code").val("");
       	 $("#zd_brand").val("");
       	 $("#zd_types").val("");
       	 $("#in_price").val("");
       	 $("#out_price").val("");
         $("#sale_ml").val("");
       	 $("#yyt_ml").val("");
       	 $("#yx_cost").val("");
       	 $("#yyt_profit").val("");
       	 $("#is_change_price").val("否");
         $("#service_num").val("");
       	 $("#developer_id").val("");
    	 alert("终端串号有误！");
     }
 }
 
 function add(){
	 $("#order_code").val("");//新增清空订单编号
	 $("#is_back").val("0");//普通新增
	 $("#zd_iemi").val("");
	 $("#group_id_1").val("");
   	 $("#group_id_1_name").val("");
   	 $("#yyt_hq_name").val("");
   	 $("#yyt_chan_code").val("");
   	 $("#sup_hq_name").val("");
   	 $("#sup_hq_code").val("");
   	 $("#zd_brand").val("");
   	 $("#zd_types").val("");
   	 $("#in_price").val("");
   	 $("#out_price").val("");
     $("#sale_ml").val("");
   	 $("#yyt_ml").val("");
   	 $("#yx_cost").val("");
   	 $("#yyt_profit").val("");
   	 $("#is_change_price").val("否");
   	 $("#service_num").attr("readonly","readonly");
	 $("#out_price").attr("readonly","readonly");
	 $("#service_num").val("");
   	 $("#developer_id").val("");
   	 $("#operator_id").val("");
     var date = new Date();
	 $("#acc_time").val(date.pattern("yyyyMMdd HH:mm"));
	 initDevelopInfo();
	 $("#addDiv").show();
	 $("#saveBtn").show();
	 $('#addDiv').dialog({
			title : '新增销售终端',
			width : 700,
			height : 500,
			closed : false,
			cache : false,
			modal : false,
			maximizable : true,
			onClose:function(){
				$("#addDiv").hide();
			}
	});
 }
 
 function initDevelopInfo(){
	 var username=$("#username").val();
	 var s="SELECT USER_CODE,DEVELOPER FROM PORTAL.TAB_PORTAL_GRP_MAG_MON WHERE username ='"+username+"' AND DEAL_DATE=TO_CHAR(SYSDATE,'YYYYMM')";
	 var d=query(s);
	 if(d!=null&&d.length>0){
		 $("#developer_id").val(d[0].DEVELOPER);
		 $("#operator_id").val(d[0].USER_CODE);
	 }
 }
 
 function save(){
		var url = $("#ctx").val()+'/salesManager/sales-manager!save.action';
		$("#saveBtn").hide();
		$('#addForm').form('submit',{
			url:url,
			dataType:"json",
			async: false,
			type: "POST", 
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
		    		return false;
				}
				if($("#zd_iemi").val()==""){
					alert("终端编号不能为空！");
					return false;
				}
				if($("#out_price").val()==""){
					alert("零售价不能为空！");
					return false;
				}
				if($("#sale_ml").val()==""){
					alert("销售毛利不能为空！");
					return false;
				}
				if($("#yyt_hq_name").val()==""){
					alert("营业厅不能为空！");
					return false;
				}
				if($("#operator_id").val()==""){
					alert("营业员工位不能为空！");
					return false;
				}
				if(isNaN($("#developer_id").val())){
					alert("发展人编码必须是数字！");
					return false;
				}
				if($("#is_change_price").val()=="1"){
					if($("#service_num").val()==""){
						alert("用户号码不能为空！");
						return false;
					}
				}
				if($("#is_back").val()=="1"){//换机
					if($("#zd_iemi").val()==old_zd_iemi){//防止换机,未修改直接保存
						return false;
					}
				}
				 //去除可编辑元素文本的空格
				 $("#service_num").val($.trim($("#service_num").val()));
				 $("#developer_id").val($.trim($("#developer_id").val()));
				 $("#operator_id").val($.trim($("#operator_id").val()));
				 $("#out_price").val($.trim($("#out_price").val()));
			},
			success:function(data){
				var d = $.parseJSON(data);
				if(d.state=="1"){
					alert(d.msg);
					$('#addDiv').dialog('close');
					$("#addDiv").hide();
					window.location.href=$("#ctx").val()+'/salesManager/sales-manager!callPre.action'
					//search(0);
				}else{
					alert(d.msg);
				}
			}
		});
	}
 
 Date.prototype.pattern=function(fmt) {
	  var o = {
	  "M+" : this.getMonth()+1, //月份
	  "d+" : this.getDate(), //日
	  "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
	  "H+" : this.getHours(), //小时
	  "m+" : this.getMinutes(), //分
	  "s+" : this.getSeconds(), //秒
	  "q+" : Math.floor((this.getMonth()+3)/3), //季度
	  "S" : this.getMilliseconds() //毫秒
	  };
	  var week = {
	  "0" : "/u65e5",
	  "1" : "/u4e00",
	  "2" : "/u4e8c",
	  "3" : "/u4e09",
	  "4" : "/u56db",
	  "5" : "/u4e94",
	  "6" : "/u516d"
	  };
	  if(/(y+)/.test(fmt)){
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	  }
	  if(/(E+)/.test(fmt)){
	    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
	  }
	  for(var k in o){
	    if(new RegExp("("+ k +")").test(fmt)){
	      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	    }
	  }
	  return fmt;
	}
 
 function isNull(obj){
		if(obj == undefined || obj == null || obj == '') {
			return "&nbsp;";
		}
		return obj;
 }
 