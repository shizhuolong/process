/**
 * @author xuxuejiang
 * 自营厅评价(旗舰、标准、小型)js
 */	
$(function() {
		//自营厅评价(旗舰、标准、小型)
		queryDataByType();
		$("#byTypeSearchBtn").click(function(){
			queryDataByType();
		});
		$("#byTypeDownBtn").click(function(){
			downDataByType();
		});
		
		//按厅类型汇总
		queryDataByCount();
		$("#countTypeSearchBtn").click(function(){
			queryDataByCount();
		});
		$("#countTypeDownBtn").click(function(){
			downDataByCount();
		});
		
		//导出明细
		$("#deatilDownBtn").click(function(){
			downDataDetail();
		});
});

/**
 * 自营厅评价(旗舰、标准、小型)
 */	
function queryDataByType(){
	//表頭
	var columns=getCols();
	//获得sql
	var sql = getSqlbyHallType();
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	
	var content="<tbody>";
	$.each(data,function(i,n){
		content+="<tr>"
			+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['HQ_COUNT'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['A1'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['A2'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['B1'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['B2'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['C1'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['C2'])+"</td>"
		content+="</tr>";
	});
	content+="</tr></tbody>";
	var table = columns+content;
	if(content != "") {
		$("#dataGrodByType").empty().html(table);
	}else {
		$("#dataGrodByType").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
	}
}

/**
 * 自营厅评价(旗舰、标准、小型)下载
 */
function downDataByType(){
	var datebyType = $("#datebyType").val();
	var chnlTypebyType =$("#chnlTypebyType").val();
	var	title=[
			["自营厅评价("+chnlTypebyType+")","","","","","","",""],
			["州市","厅数","A1","A2","B1","B2","C1","C2"]
	       ];

	var sql = getSqlbyHallType();
	var showtext = "自营厅评价("+chnlTypebyType+")-("+datebyType+")";
	downloadExcel(sql,title,showtext);
}
/**
 * 获得自营厅评价(旗舰、标准、小型)的sql
 * @returns {String}
 */
function getSqlbyHallType(){
	//賬期
	var datebyType = $("#datebyType").val();
	//厅类型
	var chnlTypebyType =$("#chnlTypebyType").val();
	
	//把显示标题修改成选中厅类型展示
	$("#titleByType").html("自营厅评价("+chnlTypebyType+")");
	
	var region  = $("#region").val();
	var orgLevel= $("#orgLevel").val();
	var sql =   " SELECT NVL(GROUP_ID_1_NAME, '总计') GROUP_ID_1_NAME,              "+
				"        COUNT(HQ_CHAN_CODE) HQ_COUNT                               "+
				"        ,COUNT(CASE WHEN RANK ='A1' THEN HQ_CHAN_CODE END)    A1   "+
				"        ,COUNT(CASE WHEN RANK ='A2' THEN HQ_CHAN_CODE END)    A2   "+
				"        ,COUNT(CASE WHEN RANK ='B1' THEN HQ_CHAN_CODE END)    B1   "+
				"        ,COUNT(CASE WHEN RANK ='B2' THEN HQ_CHAN_CODE END)    B2   "+
				"        ,COUNT(CASE WHEN RANK ='C1' THEN HQ_CHAN_CODE END)    C1   "+
				"        ,COUNT(CASE WHEN RANK ='C2' THEN HQ_CHAN_CODE END)    C2   "+
				"   FROM PMRT.TB_MRT_BUS_EVALUATE_MON_NEW                           "+
				"  WHERE DEAL_DATE = '"+datebyType+"'                               "+
				"    AND CHNL_TYPE = '"+chnlTypebyType+"'                           ";
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	sql+="  GROUP BY GROUPING SETS(DEAL_DATE,(DEAL_DATE, GROUP_ID_1_NAME))   ";
	return sql;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function queryDataByCount(){

	//表頭
	var columns=getCols();
	//获得sql
	var sql = getSqlByHallCount();
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	
	var content="<tbody>";
	$.each(data,function(i,n){
		content+="<tr>"
			+"<td>"+isNull(n['CHNL_TYPE'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['HQ_COUNT'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['A1'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['A2'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['B1'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['B2'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['C1'])+"</td>"
			+"<td class='numberStyle'>"+isNull(n['C2'])+"</td>"
		content+="</tr>";
	});
	content+="</tr></tbody>";
	var table = columns+content;
	if(content != "") {
		$("#dataGrodByCount").empty().html(table);
	}else {
		$("#dataGrodByCount").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
	}

}

function getSqlByHallCount(){
	//賬期
	var datebyCount = $("#datebyCount").val();
	
	var region  = $("#region").val();
	var orgLevel= $("#orgLevel").val();
	
	var sql =   " SELECT NVL(CHNL_TYPE,'合计')   CHNL_TYPE                             "+
				"       ,COUNT(HQ_CHAN_CODE)  HQ_COUNT                                 "+
				"       ,COUNT(CASE WHEN RANK ='A1' THEN HQ_CHAN_CODE END)         A1  "+
				"       ,COUNT(CASE WHEN RANK ='A2' THEN HQ_CHAN_CODE END)         A2  "+
				"       ,COUNT(CASE WHEN RANK ='B1' THEN HQ_CHAN_CODE END)         B1  "+
				"       ,COUNT(CASE WHEN RANK ='B2' THEN HQ_CHAN_CODE END)         B2  "+
				"       ,COUNT(CASE WHEN RANK ='C1' THEN HQ_CHAN_CODE END)         C1  "+
				"       ,COUNT(CASE WHEN RANK ='C2' THEN HQ_CHAN_CODE END)         C2  "+
				" FROM  PMRT.TB_MRT_BUS_EVALUATE_MON_NEW                               "+
				"   WHERE DEAL_DATE='"+datebyCount+"'                                  ";
				
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	sql+=" GROUP BY GROUPING SETS (DEAL_DATE,(DEAL_DATE,CHNL_TYPE))             ";
	return sql;
}


function downDataByCount(){
	var datebyCount = $("#datebyCount").val();
	var	title=[
			["自营厅评价(按厅类型汇总)","","","","","","",""],
			["厅类型","厅数","A1","A2","B1","B2","C1","C2"]
	       ];

	var sql = getSqlByHallCount();
	var showtext = "自营厅评价(按厅类型汇总)-("+datebyCount+")";
	downloadExcel(sql,title,showtext);

}
/////////////////////////////////////////////////////////////////////////////////////////////////


function downDataDetail(){
	var date = $("#datebyType").val();
	var chnlType = $("#chnlTypebyType").val();
	var title=[
				["州市","营业厅","渠道编码","厅类型","位置得分","","厅面积","","收入","","服务受理量","","申诉率","","总销量","","终端","","最后得分","等级"],
				["","","","","位置","得分","面积","得分","收入","得分","服务受理量","得分","申诉率","得分","总销量","得分","终端","得分","",""]
	           ];
	
	var sql=" SELECT GROUP_ID_1_NAME,                  "+
			"        BUS_NAME,                         "+
			"        HQ_CHAN_CODE,                     "+
			"        CHNL_TYPE,                        "+
			"        BUS_ADDRES,                       "+
			"        ADDRES_SCORE,                     "+
			"        AREA,                             "+
			"        AREA_SCORE,                       "+
			"        INCOME_NUM,                       "+
			"        INCODE_SCORE,                     "+
			"        SERVICE_NUM,                      "+
			"        SERVICE_SCORE,                    "+
			"        APPEAL_NUM,                       "+
			"        APPEAL_SCORE,                     "+
			"        ALL_DEV,                          "+
			"        ALL_DEV_SCORE,                    "+
			"        TERMINAL_NUM,                     "+
			"        TERMINAL_SCORE,                   "+
			"        ALL_SCORE,                        "+
			"        RANK                              "+
			"   FROM PMRT.TB_MRT_BUS_EVALUATE_MON_NEW  "+
			"  WHERE DEAL_DATE = '"+date+"'            "+
			"  AND CHNL_TYPE = '"+chnlType+"'          "+
			"  ORDER BY ALL_SCORE DESC                 ";
	var showtext = "自营厅评价明细("+chnlType+")-("+date+")";
	downloadExcel(sql,title,showtext);
	
}
//表头(公共方法)
function getCols(){
	var cols ="<thead>" +
				"<tr>" +
				"<th>分公司</th>" +
				"<th>厅数</th>" +
				"<th>A1</th>" +
				"<th>A2</th>" +
				"<th>B1</th>" +
				"<th>B2</th>" +
				"<th>C1</th>" +
				"<th>C2</th>" +
			"</tr>" +
			"</thead>";
	return cols;
}

/**
 * 公共查询方法
 * @param sql
 * @returns {Array}
 */
function load(sql){
	var ls=[];
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
           "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			ls=data;
	   		}
	    }
	});
	return ls;
}
/**
 * 获取给定日期的前七天dealDate格式为20160101(即：年月日)
 */
function getDate(dealDate){
	//var dealDate ="20161001"
	var yearStr=dealDate.substr(0,4);
	var monStr=dealDate.substr(4,2);
	var dayStr=dealDate.substr(6);
	//创建给定的时间对象
	var date = new Date(yearStr,monStr,dayStr,0,0,0);
	var year = date.getFullYear();
	//给设置时间减去7天
	date.setDate(date.getDate() - 7); 
	var month = date.getMonth();
	if(month<=0){
		month= 12;
		year--;
	}
	var day = date.getDate();
	var contrastDate =year+""+(month<10?"0"+month:""+month)+"" + (day<10?"0"+day:""+day); 
	return contrastDate;
} 

function isNull(obj){
	if(obj == undefined) {
		return "&nbsp;";
	}else if(obj == null){
		return "&nbsp;";
	}else if(obj == ''){
		if(obj==0){
			return obj;
		}else{
			return "&nbsp;";	
		}
	}else{
		return obj;
	}
}

