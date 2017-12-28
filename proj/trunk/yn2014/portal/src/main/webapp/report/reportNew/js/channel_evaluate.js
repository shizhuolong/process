var report;
$(function(){
	var field=["ROW_NAME","ZY_NUM","ZY_MANAGE_NUM","ZY_ONE_MANAGE_NUM","ZY_NEW_APP_PERSON","ZY_SR_KD_TB","ZY_NET_4G_ACCT","ZY_MOB_ACCT_NUM","ZY_NET_4G_STL","SH_CHNL_NUM","SH_NEW_NUM","SH_AVG_DEV_NUM","SH_NEW_APP_PERSON","SH_SR_KD_TB","SH_NET_4G_ACCT","SH_MOB_ACCT_NUM","SH_NET_4G_STL","DZ_MANAGE_NUM","DZ_ALL_MANAGE_NUM","DZ_MANAGE_ZB","DZ_2I2C_ZH","DZ_NEW_APP_PERSON","DZ_NET_4G_ACCT","DZ_MOB_ACCT_NUM","DZ_NET_4G_STL"];
	var title=[["分公司","自营厅","","","","","","","","社会实体渠道","","","","","","","","电子渠道","","","","","","",""],
			   ["","营厅数量（1）","业务办理笔数（2）","平均单厅业务办理笔数（2）/(1)","新入网用户手厅APP渗透率","宽带收入累计同比","4G网络出账用户数（3）","移动网出账用户数（4）","4G网络用户渗透率","渠道数量","今年累计发展数","平均单店用户发展量","新入网用户手厅APP渗透率","宽带收入累计同比","4G网络出账用户数（3）","移动网出账用户数（4）","4G网络用户渗透率","本月电子渠道业务办理笔数（1）","全渠道业务办理笔数（2）","电子渠道业务办理笔数占比","2I2C业务转化率","新入网用户手厅APP渗透率","4G网络出账用户数（3）","移动网出账用户数（4）","4G网络用户渗透率"]];
	$("#searchBtn").click(function(){
		report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	});
	report=new LchReport({
		title:title,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var region =$("#region").val();
			var code=$("#code").val();
			var orgLevel="";
			var regionCode=$("#regionCode").val();
			var dealDate=$("#dealDate").val();
			var where=" WHERE DEAL_DATE="+dealDate;
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			//权限
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				if(orgLevel==2){
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND GROUP_ID_1='"+code+"'";
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
		}
	});
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function getSql(where,orgLevel){
	var dealDate=$("#dealDate").val();
	var sql = "";
	if(orgLevel==1){
		sql=" SELECT GROUP_ID_1 ROW_ID" +
		" ,GROUP_ID_1_NAME ROW_NAME"+
		" ,ZY_NUM                          "+
		" ,ZY_MANAGE_NUM                   "+
		" ,ZY_ONE_MANAGE_NUM               "+
		" ,ZY_NEW_APP_PERSON               "+
		" ,ZY_SR_KD_TB                     "+
		" ,ZY_NET_4G_ACCT                  "+
		" ,ZY_MOB_ACCT_NUM                 "+
		" ,ZY_NET_4G_STL                   "+
		" ,SH_CHNL_NUM                     "+
		" ,SH_NEW_NUM                      "+
		" ,SH_AVG_DEV_NUM                  "+
		" ,SH_NEW_APP_PERSON               "+
		" ,SH_SR_KD_TB                     "+
		" ,SH_NET_4G_ACCT                  "+
		" ,SH_MOB_ACCT_NUM                 "+
		" ,SH_NET_4G_STL                   "+
		" ,DZ_MANAGE_NUM                   "+
		" ,DZ_ALL_MANAGE_NUM               "+
		" ,DZ_MANAGE_ZB                    "+
		" ,DZ_2I2C_ZH                      "+
		" ,DZ_NEW_APP_PERSON               "+
		" ,DZ_NET_4G_ACCT                  "+
		" ,DZ_MOB_ACCT_NUM                 "+
		" ,DZ_NET_4G_STL                   "+
		" FROM PMRT.VIEW_CHNL_ASSESS_MON "+
		where;
	}else if(orgLevel==2){
		sql=" SELECT UNIT_ID ROW_ID" +
		" ,UNIT_NAME ROW_NAME"+
		" ,ZY_NUM                          "+
		" ,ZY_MANAGE_NUM                   "+
		" ,ZY_ONE_MANAGE_NUM               "+
		" ,ZY_NEW_APP_PERSON               "+
		" ,ZY_SR_KD_TB                     "+
		" ,ZY_NET_4G_ACCT                  "+
		" ,ZY_MOB_ACCT_NUM                 "+
		" ,ZY_NET_4G_STL                   "+
		" ,SH_CHNL_NUM                     "+
		" ,SH_NEW_NUM                      "+
		" ,SH_AVG_DEV_NUM                  "+
		" ,SH_NEW_APP_PERSON               "+
		" ,SH_SR_KD_TB                     "+
		" ,SH_NET_4G_ACCT                  "+
		" ,SH_MOB_ACCT_NUM                 "+
		" ,SH_NET_4G_STL                   "+
		" ,DZ_MANAGE_NUM                   "+
		" ,DZ_ALL_MANAGE_NUM               "+
		" ,DZ_MANAGE_ZB                    "+
		" ,DZ_2I2C_ZH                      "+
		" ,DZ_NEW_APP_PERSON               "+
		" ,DZ_NET_4G_ACCT                  "+
		" ,DZ_MOB_ACCT_NUM                 "+
		" ,DZ_NET_4G_STL                   "+
		" FROM PMRT.VIEW_CHNL_ASSESS_DETAIL_MON  "+
		where;
	}
	return sql;
}

function downsAll() {
	var region =$("#region").val();
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	var dealDate=$("#dealDate").val();
	var where=" WHERE DEAL_DATE="+dealDate;
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(orgLevel==1){//省
		
	}else if(orgLevel==2){//市
		where+=" AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){//营服
		where+=" AND UNIT_ID='"+code+"'";
	}
	var title=[["地市名称","营服名称","自营厅","","","","","","","","社会实体渠道","","","","","","","","电子渠道","","","","","","",""],
			   ["","","营厅数量（1）","业务办理笔数（2）","平均单厅业务办理笔数（2）/(1)","新入网用户手厅APP渗透率","宽带收入累计同比","4G网络出账用户数（3）","移动网出账用户数（4）","4G网络用户渗透率","渠道数量","今年累计发展数","平均单店用户发展量","新入网用户手厅APP渗透率","宽带收入累计同比","4G网络出账用户数（3）","移动网出账用户数（4）","4G网络用户渗透率","本月电子渠道业务办理笔数（1）","全渠道业务办理笔数（2）","电子渠道业务办理笔数占比","2I2C业务转化率","新入网用户手厅APP渗透率","4G网络出账用户数（3）","移动网出账用户数（4）","4G网络用户渗透率"]];
	var downsql=" SELECT GROUP_ID_1_NAME" +
	" ,UNIT_NAME"+
	" ,ZY_NUM                          "+
	" ,ZY_MANAGE_NUM                   "+
	" ,ZY_ONE_MANAGE_NUM               "+
	" ,ZY_NEW_APP_PERSON               "+
	" ,ZY_SR_KD_TB                     "+
	" ,ZY_NET_4G_ACCT                  "+
	" ,ZY_MOB_ACCT_NUM                 "+
	" ,ZY_NET_4G_STL                   "+
	" ,SH_CHNL_NUM                     "+
	" ,SH_NEW_NUM                      "+
	" ,SH_AVG_DEV_NUM                  "+
	" ,SH_NEW_APP_PERSON               "+
	" ,SH_SR_KD_TB                     "+
	" ,SH_NET_4G_ACCT                  "+
	" ,SH_MOB_ACCT_NUM                 "+
	" ,SH_NET_4G_STL                   "+
	" ,DZ_MANAGE_NUM                   "+
	" ,DZ_ALL_MANAGE_NUM               "+
	" ,DZ_MANAGE_ZB                    "+
	" ,DZ_2I2C_ZH                      "+
	" ,DZ_NEW_APP_PERSON               "+
	" ,DZ_NET_4G_ACCT                  "+
	" ,DZ_MOB_ACCT_NUM                 "+
	" ,DZ_NET_4G_STL                   "+
	" FROM PMRT.VIEW_CHNL_ASSESS_DETAIL_MON  "+	where;
	showtext = "渠道评价表";
	downloadExcel(downsql,title,showtext);
}