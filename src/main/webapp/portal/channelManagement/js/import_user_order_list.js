var nowData = [];
var title=[["订单号","省分","地市","区县","门店","渠道编码","代理商","连锁级别","顶级代理商","顶级代理商编码","集团客户标识","集团应用类别","集团客户名称","集团ID","集团级别","操作员工号","操作员姓名","渠道类型","渠道属性","用户类型","订单标识","返销订单","服务号码","业务类型","业务子类型","订单类型","订单状态","用户名称","证件号码","营业受理金额","押金金额","预存金额","竣工时间","应收金额","实收金额","减免费用","推荐人姓名","推荐人编码(ID)","推荐人编码(CODE)","推荐人部门编码","推荐人部门名称","预付费标志","首账单模式","担保类型","协议编码","单位名称","信贷模式名称","协议费率","主产品套餐名称","活动编码","活动名称","USIM号","终端串号","换机原损串号","终端类型","品牌型号","终端机型","铺货标志","活动终端补贴","活动预存话费","终端款","成本价","市场零售价","活动协议期限","固网预存金额","冻结存款金额","冻结存款流水号","主产品套餐编码","终端型号编码","终端机型编码","核查方式","公允价值调整额","每月分摊金额","担保减免预存","活动类型"]];
var field=["ORDER_NO","PROVINCE","REGION","AREA","DEPART","QD_CODE","AGENT","LS_LEVEL","TOP_AGENT","TOP_AGENT_CODE","JT_KH_FLAG","JT_YY_TYPE","JT_KH_NAME","JT_ID","JT_TYPE","OPERATE_ACCOUNT","OPERATE_NAME","QD_TYPE","CHNL_TYPE","USER_TYPE","WORK_FLAG","FX_WORK","NUM","BUS_TYPE","BUS_SON_TYPE","WORK_TYPE","WORK_STATUS","USER_NAME","CRED_NO","YYSLJ","YJJE","YCJE","DEAL_DATE","YSJE","SSJE","JMFY","TJR_NAME","TJR_ID","TJR_CODE","TJR_DEP_CODE","TJR_DEP","YFF_FLAG","SZDMS","DB_TYPE","XY_CODE","UNIT_NAME","XD_NAME","XYFL","PRODUCT_NAME","ACTIVITY_CODE","ACTIVITY_NAME","USIM","TERMINAL_NUMBER","HJYSCH","TERMINAL_TYPE","BRAND_TYPE","TERMINAL_JX","PH_FLAG","HD_TER_BT","HD_YC_HF","ZDK","CBJ","M_LSJ","ACT_XYQX","GWYCJ","DJCKJ","DJCK_NO","ZCP_CODE","ZDXH_CODE","ZDJX_CODE","HCFS","GYJZ","MYFT","DBJM","ACTIVITY_TYPE"];
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
	var sql="SELECT * FROM PMRT.TB_USER_ORDER_DETAIL_TEMP WHERE IN_USER_NAME='"+username+"'";
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
				url:$("#ctx").val()+"/channelManagement/userOrder_importToResult.action",
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
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_user_order.jsp";
 }