var name="";
var dealDate="";
var mark_type="";
$(function() {
	if(isHavingOper()){
		mark_type=$("#mark_type").val();
		search();
		$("#searchBtn").click(function(){
			search();
		});
		$("#mark_type").change(function(){
			mark_type=$(this).val();
			search();
		});
	}
});

function isHavingOper(){
  if($("#orgLevel").val()!=3){
	  return false;
  }
  var s="SELECT USERNAME FROM PMRT.VIEW_MRT_UNIT_PERSON WHERE USERNAME='"+$("#username").val()+"'";
  var d=query(s);
  if(d!=null&&d.length>0){
	 return true;
  }
  return false;
}

function search(){
	dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var lastMonth=$("#lastMonth").val();
	var sql="SELECT * FROM PMRT.TAB_MRT_CHNL_UNIT_EVAL_MON"+
	" WHERE USER_CODE=2 AND USER_TYPE="+mark_type+" AND STATUS=1 AND DEAL_DATE="+dealDate+" AND UNIT_ID='"+code+"'";
	var r=query(sql);
	var content="";
	if(r!=null&&r.length>0){
		if(lastMonth==dealDate){
			for(var i=0;i<r.length;i++){
				content+="<tr hr_id='"+r[i].HR_ID+"'>"
				+"<td>"+isNull(r[i].DEAL_DATE)+"</td>"
				+"<td>"+isNull(r[i].GROUP_ID_1_NAME)+"</td>"
				+"<td>"+isNull(r[i].UNIT_NAME)+"</td>"
				+"<td>"+isNull(r[i].HR_ID)+"</td>"
				+"<td>"+isNull(r[i].NAME)+"</td>"
				+"<td>"+isNull(r[i].INDEX_NAME)+"</td>"
				+"<td><input style='border-radius:10px;' value='"+toPoint(isNull(r[i].KRI_WEIGHT))+"' type='text' name='weight'/></td>"
				+"<td><input style='border-radius:10px;' value='"+isNull(r[i].KPI_SCORE)+"' type='text' name='score'/></td></tr>";
			}
			$("#saveDiv").show();
			$("#dataBody").empty().append($(content));	
		}else{
			for(var i=0;i<r.length;i++){
				content+="<tr><td>"+r[i].DEAL_DATE+"</td>"
				+"<td>"+r[i].GROUP_ID_1_NAME+"</td>"
				+"<td>"+r[i].UNIT_NAME+"</td>"
				+"<td>"+r[i].NAME+"</td>"
				+"<td>"+r[i].INDEX_NAME+"</td>"
				+"<td>"+r[i].KRI_WEIGHT+"</td>" +
			    +"<td>"+r[i].KPI_SCORE+"</td></tr>";
			}
		   $("#saveDiv").hide();
		   $("#dataBody").empty().append($(content));	
		}
	}else{
		if(lastMonth==dealDate){
			$("#saveDiv").show();
		}else{
			$("#saveDiv").hide();
		}
		$("#dataBody").empty();
	}
}

function save(){
	var dataString="";
	var weight="";
	var score=0;
	var isPass=true;
	$("#dataBody").find("tr").each(function(index){
		weight=$.trim($(this).find("td:eq(6)").find("input").val());
		score=$.trim($(this).find("td:eq(7)").find("input").val());
		var name=$(this).find("td:eq(4)").text();
		if(!check(weight)||!check(score)){
			alert("非法输入，输入不能为空且需是数字或小数！");
			isPass=false;
			return false;
		}
		if(!checkWeight(parseFloat(weight))){
			alert(name+"的权重之和不能超过50%！");
			isPass=false;
			return false;
		}
		if(parseFloat(score)>parseFloat(weight)){
			alert(name+"的得分不能大于权重！");
			isPass=false;
			return false;
		}
		if(index==0){
			dataString+=$(this).attr("hr_id")+"|"+weight+"|"+score;
		}else{
			dataString+=","+$(this).attr("hr_id")+"|"+weight+"|"+score;
		}
	});
	if(!isPass){
		return;
	}
	
	$.ajax({ 
        type: "POST", 
        url: $("#ctx").val()+"/itemSet/item-set!saveMark.action", 
        dataType: "json",
        async: false,
		data:{
			dealDate:dealDate,
			dataString:dataString,
			index_type:mark_type
		},
		 success:function(data){
			alert(data.msg);
			search();
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
		} 
	});  
}

function checkWeight(sumWeight){
	var regionCode=$("#regionCode").val();
	var sql="SELECT SUM(REPLACE(KRI_WEIGHT,'%')) TOTAL FROM PMRT.TAB_MRT_INDEX_DEPLOY_MON WHERE INDEX_TYPE="+mark_type+" AND DEAL_DATE="+dealDate+" AND GROUP_ID_1='"+regionCode+"'";
    var d=query(sql);
    var total=0;
    if(d!=null&&d.length>0&&d[0]!="null"){
    	total=parseFloat(d[0].TOTAL);
    }
    if(total+sumWeight>50){
    	return false;
    }
	return true;
}

function check(text) {
    var result = true;
    if(text==""){
    	return false;
    }
    if (!isNumberOrDouble(text)) {
        return false;
    }
    return true;
}
function isNumberOrDouble(e) { 
    var re = /^\d+(?=\.{0,1}\d+$|$)/;
    if (!re.test(e)) { 
 	   return false;
    } 
    return true;
} 

function change(){
	search();
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function toPoint(percent){
    var str=percent.replace("%","");
    return str;
}
