var field=["GK_LEAVE_NOW","GK_LEAVE_LS","GK_LEAVE_RATE","GK_OFF_NOW","GK_OFF_LS","GK_OFF_RATE","GK_PASSAGE_NOW","GK_PASSAGE_LS","GK_PASSAGE_RATE","GK_PREDEM_NOW","GK_PREDEM_LS","GK_PREDEM_RATE","GK_OWESTOP_NOW","GK_OWESTOP_LS","GK_OWESTOP_RATE","GK_PHONE_01_NOW","GK_PHONE_01_LS","GK_PHONE_01_RATE","GK_PHONE_02_NOW","GK_PHONE_02_LS","GK_PHONE_02_RATE","ADDR_ERROR_NOW","ADDR_ERROR_LS","ADDR_ERROR_RATE"];
var title=[
           ["组织机构","离网用户数","","","主动离网用户数","","","在途工单数","","","预拆用户数","","","欠费停机用户数","","","装宽带送手机融合业务，零元开卡未捆绑群组数","","","用手机业务送宽带融合业务，零元开宽带未捆绑群组数","","","宽带装机地址不合规用户数","",""],
           ["","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比"]
          ];

var report=null;
$(function(){
	 //listRegions();
	 var orderBy="";
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		/*lock:1,*/
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" ORDER BY ROW_NAME "+type;
			}else if(index>0){
				orderBy=" ORDER BY "+field[index-1]+" "+type;
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var dealDate = $("#dealDate").val();
			var where=' WHERE T.DEAL_DATE = '+dealDate;
			var code='';
			var orgLevel='';
			/*var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var hqCode =$.trim($("#hqCode").val());
			var HrCode =$.trim($("#HrCode").val());*/
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField="SELECT T.GROUP_ID_1 AS  ROW_ID,T.GROUP_ID_1_NAME AS ROW_NAME,";
					where+=" AND T.LEVELS=2 ";
				}else if(orgLevel==3){
					preField="SELECT T.UNIT_ID AS  ROW_ID,T.UNIT_NAME AS ROW_NAME,";
					where+=" AND T.LEVELS=3 AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){
					preField="SELECT T.HR_ID AS  ROW_ID,T.NAME AS ROW_NAME,";
					where+=" AND T.LEVELS=4 AND T.UNIT_ID='"+code+"'";
				}else if(orgLevel==5){
					preField="SELECT T.HQ_CHAN_CODE AS  ROW_ID,T.GROUP_ID_4_NAME AS ROW_NAME,";
					where+=" AND T.LEVELS=5 AND T.HR_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示地市
					preField="SELECT '云南省' AS ROW_NAME,'86000' AS ROW_ID,";
					where+=" AND T.LEVELS=1";
				}else if(orgLevel==2){//市,进去看营服
					preField="SELECT T.GROUP_ID_1 AS  ROW_ID,T.GROUP_ID_1_NAME AS ROW_NAME,";
					where+=" AND T.LEVELS=2 AND T.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心,进去看渠道
					preField="SELECT T.UNIT_ID AS  ROW_ID,UNIT_NAME AS ROW_NAME,";
					where+=" AND T.LEVELS=3 AND T.UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			/*if(regionCode!=''){
				where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
			}
			if(unitCode!=''){
				where+=" AND T.UNIT_ID = '"+unitCode+"'";
			}
			if(hqCode!=''){
				where+=" AND T.HQ_CHAN_CODE = '"+hqCode+"'";
			}
			if(hqCode!=''){
				where+=" AND T.HR_ID = '"+hqCode+"'";
			}
			*/
			var sql =preField+getSql()+where;
			
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		//$(".page_count").width($("#lch_DataHead").width());
	});
});


/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var dealDate = $("#dealDate").val();
	
	/*var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqCode =$.trim($("#hqCode").val());
	var HrCode =$.trim($("#HrCode").val());*/
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	
	var sql=" SELECT T.DEAL_DATE, T.GROUP_ID_1_NAME, T.UNIT_NAME,T.NAME, T.GROUP_ID_4_NAME, "+getSql()+"WHERE T.DEAL_DATE = "+dealDate;
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		sql += " AND GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		sql += " AND UNIT_ID='" + code + "' ";
	} else {
		
	}
	/*if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID = '"+unitCode+"'";
	}
	if(hqCode!=''){
		sql+=" AND T.HQ_CHAN_CODE = '"+hqCode+"'";
	}
	if(hqCode!=''){
		sql+=" AND T.HR_ID = '"+hqCode+"'";
	}*/
	
	sql+=orderBy;
	showtext = '宽带月预警总表' + dealDate;
	var title=[
	           ["账期","地市","应付中心","渠道经理","渠道名称","离网用户数","","","主动离网用户数","","","在途工单数","","","预拆用户数","","","欠费停机用户数","","","装宽带送手机融合业务，零元开卡未捆绑群组数","","","用手机业务送宽带融合业务，零元开宽带未捆绑群组数","","","宽带装机地址不合规用户数","",""],
	           ["","","","","","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比","当月","上月","环比"]
	          ];
	downloadExcel(sql,title,showtext);
}


///////////////////////////地市查询///////////////////////////////////////
/*function listRegions(){
    var sql=" SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE  T WHERE GROUP_ID_1 NOT IN('86000','16099') ";
    var orgLevel=$("#orgLevel").val();
    var code=$("#code").val();
    var region =$("#region").val();
    if(orgLevel==1){
        sql+="";
    }else if(orgLevel==2){
        sql+=" and T.GROUP_ID_1='"+code+"'";
    }else{
        sql+=" and T.GROUP_ID_1='"+region+"'";
    }
    sql+=" ORDER BY T.GROUP_ID_1"
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
        var $area = $("#regionCode");
        var $h = $(h);
        $area.empty().append($h);
        $area.change(function() {
            listUnits($(this).attr('value'));
        });
    } else {
        alert("获取地市信息失败");
    }
}

*//************查询营服中心***************//*
function listUnits(region){
    var $unit=$("#unitCode");
    var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1 ";
    if(region!=''){
        sql+=" AND T.GROUP_ID_1='"+region+"' ";
        //权限
        var orgLevel=$("#orgLevel").val();
        var code=$("#code").val();
        if(orgLevel==3){
            sql+=" and t.UNIT_ID='"+code+"'";
        }else if(orgLevel==4){
            sql+=" AND 1=2";
        }else{
        }
    }else{
        $unit.empty().append('<option value="" selected>请选择</option>');
        return;
    }

    sql+=" ORDER BY T.UNIT_ID"
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

*/
function getSql(){
	var sql =
			"	T.GK_LEAVE_NOW		    ,"+		//--当月离网用户数
			"	T.GK_LEAVE_LS			,"+		//--上月离网用户数
			"	T.GK_LEAVE_RATE		    ,"+		//--环比
			"	T.GK_OFF_NOW			,"+		//--当月主动离网用户数
			"	T.GK_OFF_LS			    ,"+		//--上月主动离网用户数
			"	T.GK_OFF_RATE			,"+		//--环比
			"	T.GK_PASSAGE_NOW		,"+		//--当月在途工单数
			"	T.GK_PASSAGE_LS		    ,"+		//--上月在途工单数
			"	T.GK_PASSAGE_RATE		,"+		//--环比
			"	T.GK_PREDEM_NOW		    ,"+		//--当月预拆用户数
			"	T.GK_PREDEM_LS		    ,"+		//--上月预拆用户数
			"	T.GK_PREDEM_RATE		,"+		//--环比
			"	T.GK_OWESTOP_NOW		,"+		//--当月欠费停机用户数
			"	T.GK_OWESTOP_LS		    ,"+		//--上月欠费停机用户数
			"	T.GK_OWESTOP_RATE		,"+		//--环比
			"	T.GK_PHONE_01_NOW		,"+		//--当月装宽带送手机融合业务，零元开卡未捆绑群组数
			"	T.GK_PHONE_01_LS		,"+		//--上月装宽带送手机融合业务，零元开卡未捆绑群组数
			"	T.GK_PHONE_01_RATE	    ,"+		//--环比
			"	T.GK_PHONE_02_NOW		,"+		//--当月用手机业务送宽带融合业务，零元开宽带未捆绑群组数
			"	T.GK_PHONE_02_LS		,"+		//--上月用手机业务送宽带融合业务，零元开宽带未捆绑群组数
			"	T.GK_PHONE_02_RATE	    ,"+		//--环比
			"	T.ADDR_ERROR_NOW		,"+		//--当月宽带装机地址不合规用户数
			"	T.ADDR_ERROR_LS		    ,"+		//--上月宽带装机地址不合规用户数
			"	T.ADDR_ERROR_RATE		 "+		//--环比
			" FROM  PMRT.TB_MRT_GK_ALLINFO_MON	T " ;
	return sql;
}

