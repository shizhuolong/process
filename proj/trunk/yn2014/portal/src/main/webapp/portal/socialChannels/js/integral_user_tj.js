var field=["ALL_FEE","S_FEE","A_FEE","B_FEE","C_FEE","D_FEE","E_FEE","ALL_NUM","S_NUM","A_NUM","B_NUM","C_NUM","D_NUM","E_NUM","ALL_QD","S_QD","A_QD","B_QD","C_QD","D_QD","E_QD"];
var title=[["地域","分等分级社会渠道当期出账收入","","","","","","","分等分级社会渠道当期发展用户数","","","","","","","分等分级社会渠道当期渠道数","","","","","",""],
           ["","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增"]];
var report=null;
var qdate="";
var orderBy="";
$(function(){
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" ORDER BY ROW_NAME "+type+" ";
			}else if(index>0){
				orderBy=" ORDER BY "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where=' WHERE 1 = 1';
			var groupBy='';
			var order='';
			var code='';
			var orgLevel='';
			qdate = $("#month").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var hrId=$.trim($("#hrId").val());
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=" GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,";
					groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
					order=" ORDER BY GROUP_ID_1";
				}else if(orgLevel==3){
					preField=" UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,";
					groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
					where+=" AND GROUP_ID_1='"+code+"'";
					order=" ORDER BY UNIT_ID";
				}else if(orgLevel==4){
					preField=" GROUP_ID_4_NAME ROW_NAME,GROUP_ID_4 ROW_ID,";
					groupBy=" GROUP BY GROUP_ID_4,GROUP_ID_4_NAME";
					where+=" AND UNIT_ID='"+code+"'";
					order=" ORDER BY GROUP_ID_4";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省   展示省
					preField=" '云南省' ROW_NAME,'86000' ROW_ID,";
				}else if(orgLevel==2){//市
					preField=" GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,";
					groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服中心 
					preField=" UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,";
					groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
					where+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			if(regionCode!=''){
				where+=" AND GROUP_ID_1 = '"+regionCode+"'";
			}
			if(hrId!=''){
				where+=" AND HR_ID = '"+hrId+"'";
			}
			if(unitCode!=''){
				where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
			}
			var sql='SELECT '+preField+getSumField()+" PARTITION(P"+qdate+")"+where+groupBy+order;
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var preField=' DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,GROUP_ID_4_NAME,';
	var where=' WHERE 1 = 1';
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,GROUP_ID_4";
	var groupBy=" GROUP BY DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,GROUP_ID_4, GROUP_ID_4_NAME";
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hrId=$.trim($("#hrId").val());
	var fieldSql=getSumField();
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	} else if (orgLevel == 4) {//渠道
		where += " AND GROUP_ID_4='" + code + "' ";
	}else{
		where +=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hrId!=''){
		where+=" AND HR_ID = '"+hrId+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	var sql = 'SELECT ' + preField + fieldSql+" PARTITION(P"+qdate+")"+where+groupBy+orderBy;
	showtext = '分等分级社会渠道统计报表' + qdate;
	var title=[["账期","地市","营服中心","渠道","分等分级社会渠道当期出账收入","","","","","","","分等分级社会渠道当期发展用户数","","","","","","","分等分级社会渠道当期渠道数","","","","","",""],
	           ["","","","","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增","合计","S","A","B","C","D","新增"]];
	downloadExcel(sql,title,showtext);
}

function getSumField(){
 var fs = "SUM(ALL_FEE) ALL_FEE,"+  
	"SUM(S_FEE) S_FEE,    "+
	"SUM(A_FEE) A_FEE,    "+
	"SUM(B_FEE) B_FEE,    "+
	"SUM(C_FEE) C_FEE,    "+
	"SUM(D_FEE) D_FEE,    "+
	"SUM(E_FEE) E_FEE,    "+
	"SUM(ALL_NUM) ALL_NUM,"+  
	"SUM(S_NUM) S_NUM,    "+
	"SUM(A_NUM) A_NUM,    "+
	"SUM(B_NUM) B_NUM,    "+
	"SUM(C_NUM) C_NUM,    "+
	"SUM(D_NUM) D_NUM,    "+
	"SUM(E_NUM) E_NUM,    "+
	"SUM(ALL_QD) ALL_QD,  "+
	"SUM(S_QD) S_QD,      "+
	"SUM(A_QD) A_QD,      "+
	"SUM(B_QD) B_QD,      "+
	"SUM(C_QD) C_QD,      "+
	"SUM(D_QD) D_QD,      "+
	"SUM(E_QD) E_QD       "+
	"FROM PMRT.TAB_MRT_INTEGRAL_USER_TJ                                                                              ";  
	return fs;
}