var nowData = [];
var title=[["账期","地市","商品名称","子商品名称","用户状态","用户状态变更时间","销户标识","证件类型","证件号码","用户ID","用户号码","是否本期新发展","是否在网","是否异网","是否二次充值","入网时间","销户时间","是否累计现金缴费","最后一次缴费方式ID","最后一次缴费方式名称","首次缴费时间","首次缴费金额","累计缴费金额","累计缴费次数","实时余额","回访人","回访时间","回访失败","回访成功","其他原因"]];
var field=["ACCT_DATE","AREA_DESC","PRODUCT_MAIN","PRODUCT_NAME","USER_STATUS_DESC","UPDATE_TIME","REMOVE_FLAG","CERT_TYPE_DESC","CERT_NUMBER","USER_ID","DEVICE_NUMBER","IS_THIS_DEV","IS_INNET","IS_ECT","IS_TWO_PAY","INNET_DATE","CLOSE_DATE","IS_CASH_CHARGE","PAYMENT_ID","PAYMENT_NAME","PAYMENT_TIME_FIRST","PAYMENT_FEE_FIRST","PAYMENT_FEE_LJ","PAYMENT_NUM","BALANCE","VISIT_NAME","VISIT_TIME","FAIL_VISIT","SUCC_VISIT","OTHER_CAUSE"];

var orderBy="";
var report = null;
var downSql="";
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
$(function() {
	listServiceNames();
	report = new LchReport({
		title : [["外呼记录"].concat(title[0])],
		field : [""].concat(field),
		rowParams : ["ORDER_NO"],//第一个为rowId
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};  
		},
		orderCallBack : function(index, type) {
			orderBy = " ORDER BY " + field[--index] + " " + type + " ";
			search(0);
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

function initCombobox(){
	$("#outbound").combobox({  
        valueField: 'id',  
        textField: 'name',  
       /* editable:false,*/
        url:path+"/combobox/combobox!listCombobox.action",  
        mode: 'remote',  
        hasDownArrow: false,  
        /*queryParams: {name:'11'},*/
        onBeforeLoad: function (parm) {  
            var value = $(this).combobox('getValue');  
            if (value) {  
                parm.name = value;  
                return true;  
            }  
            return false;  
        }  
    }); 
}

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var dealDate=$("#dealDate").val();
   	var isFirst=$("#isFirst").val();
	var serviceName=$("#serviceName").val();
	var userId=$("#userId").val();
	var serviceNumber=$("#serviceNumber").val();
	var sql="SELECT ORDER_NO,"+field.join(",")+" FROM PODS.TAB_ODS_DWDDK_USER PARTITION(P"+dealDate+") WHERE 1=1";
	var s;
    if(orgLevel!=1){
		s=query("SELECT userid FROM PORTAL.TAB_PORTAL_2I2C_TEAM WHERE userid="+userId);
	    if(s!=null&&s.length>0){
			 sql+=" AND USERID='"+userId+"'"; 
	    }else{
	    	 sql+=" AND GROUP_ID_1='"+region+"'";    	
	    }
	}
	if(isFirst){
		sql+=" AND IS_PAY_LJ='"+isFirst+"'";
	}
	if(serviceNumber){
		sql+=" AND DEVICE_NUMBER='"+serviceNumber+"'";
	}
	
	//排序
	if (orderBy != '') {
		sql ="SELECT * FROM ("+sql+")"+ orderBy;
	}
	downSql=sql;
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	if(total<=0) return ;
	if(orgLevel!=1){
		if(s!=null&&s.length>0){
			$("#lch_DataBody").find("TR").each(function(){
				var $oper=$(this).find("TD:eq(0)");
				var orderNo=$oper.parent().attr("ORDER_NO");
				var $a=$("<a href='javascript:void(0);' onclick='showVisit(\""+orderNo+"\")'>查看</a>");
				$oper.empty().html($a);
			});
		}else{
			$("#lch_DataBody").find("TR").each(function(){
				var $oper=$(this).find("TD:eq(0)");
				$oper.empty();
			});
		}
	}else{
		$("#lch_DataBody").find("TR").each(function(){
			var $oper=$(this).find("TD:eq(0)");
			$oper.empty();
		});
	}
}

function addVisit(orderNo){
	var outbound=$("#outbound").combobox('getText');
	var outid=$("#outbound").combobox('getValue');
	var remark=$("#remark").val();
	var other_cause=$("#other_cause").val();
	if(isNaN(outid)){
		alert("输入不正确,需从下拉列表中选择！");
		return;
	}
	var sql="INSERT INTO PODS.TAB_ODS_2I2C_REMARK SELECT SYSDATE,'"+orderNo+"','"+outbound+"','"+remark+"','"+other_cause+"','2' FROM DUAL";
	var d=query(sql);
	art.dialog({id:'d'+orderNo}).close();
	showVisit(orderNo);
}

function listOutBounds(){
	var sql = "SELECT DISTINCT T.OUT_NAME FROM PODS.TAB_ODS_2I2C_OUTBOUND T WHERE T.IS_TYPE=2 AND T.OUT_NAME IS NOT NULL";
	var h = '';
	var d=query(sql);
	if (d) {
		for (var i = 0; i < d.length; i++) {
			h += '<option value="' + d[i].OUT_NAME + '">' + d[i].OUT_NAME + '</option>';
		}
	} 
	return h;
}

function showVisit(orderNo){
	var d=query("select * from PODS.TAB_ODS_2I2C_REMARK where order_no='"+orderNo+"' order by insert_time desc");
	
	if(d==null) d=[];
	
	var h="";
	
	h+="<table style='margin-top:12px;' class='lch_DataBody'><tr>";
	h+="<td>外呼状态<input class='easyui-combobox' id='outbound'/></td></tr>";
	h+="<tr><td>其他原因<textarea cols=20 rows=2 id='other_cause'></textarea></td>";
	h+="<tr><td>外呼描述<textarea cols=20 rows=2 id='remark'></textarea></td>";
	h+="<tr><td><a class='default-btn  mr10' href='#' onclick='addVisit(\""+orderNo+"\")' id='addBtn'>添加</a></td>";
	h+="</tr></table>";
	
	h+="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
	+"<table><thead class='lch_DataHead'><tr><th>外呼时间</th><th>外呼状态</th><th>外呼描述</th><th>其他原因</th></tr></thead><tbody class='lch_DataBody'>";
	for(var i=0;i<d.length;i++){
		h=h+"<tr><td>"+isNull(d[i]["INSERT_TIME"])+"</td><td>"+isNull(d[i]["OUTBOUND"])+"</td><td>"+isNull(d[i]["REMARK"])+"</td><td>"+isNull(d[i]["OTHER_CAUSE"])+"</td></tr>";
	}
	if(d.length==0){
		h+="<tr><td colspan=4>暂无记录</td></tr>";
	}
	h+="</tbody>"
	+"</table>";
	
	art.dialog({
		title: '外呼记录',
		id:'d'+orderNo,
		content: h,
		padding: 0,
		lock:true
	});
	initCombobox();
}

function exportAll(){
	var title=[["订单编码","账期","地市","商品名称","子商品名称","用户状态","用户状态变更时间","销户标识","证件类型","证件号码","用户ID","用户号码","是否本期新发展","是否在网","是否异网","是否二次充值","入网时间","销户时间","是否累计现金缴费","最后一次缴费方式ID","最后一次缴费方式名称","首次缴费时间","首次缴费金额","累计缴费金额","累计缴费次数","实时余额","回访人","回访时间","回访失败","回访成功","其他原因"]];
	downloadExcel(downSql,title,"订单明细-未首充");
}
function listServiceNames(){
	var $serviceName = $("#serviceName");
	var sql = "SELECT DISTINCT T.SERVICE_NAME FROM PODS.TAB_ODS_2I2C_LEAD_DAY T WHERE T.SERVICE_NAME IS NOT NULL ";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].SERVICE_NAME
					+ '" selected >'
					+ d[0].SERVICE_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].SERVICE_NAME + '">' + d[i].SERVICE_NAME + '</option>';
			}
		}
		var $h = $(h);
		$serviceName.empty().append($h);
	} else {
		alert("获取人员状态失败");
	}
}
function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}