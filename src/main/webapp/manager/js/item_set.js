var id="";
var name="";
var dealDate="";
var ids;
$(function() {
	if(isHavingOper()){
		search();
		initItemTree();
		$("#searchBtn").click(function(){
			search();
			initItemTree();
		});
		$("#markBtn").click(function(){
			mark();
		});
	}
});

function isHavingOper(){
  if($("#orgLevel").val()==1){
	  return false;
  }
  var s="SELECT USERNAME FROM PMRT.CHNL_PERSON WHERE USERNAME='"+$("#username").val()+"'";
  var d=query(s);
  if(d!=null&&d.length>0){
	 return true;
  }
  return false;
}
function initItemTree(){
	//从用户登录信息中获取初始化根节点
	var setting = {
		async : {
			enable : true,////启用异步加载
			url : $("#ctx").val()+"/itemSet/item-set!listItem.action?dealDate="+dealDate,
			autoParam : ["id=id","name=name"]
		},
		check: {    
            enable: true,
        }, 
		callback:{
            onCheck:function(event,treeId,treeNode){
            	var isCheck=treeNode.checked;
            	id = treeNode.id;
				name = treeNode.name;
				if(isCheck){
					add(id,name);
				}else{
					del(id,name);
				}
            },
		}
	};
	var zNodes=[];
	$.fn.zTree.init($("#ztree"), setting, zNodes);
}

function search(){
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var lastMonth=$("#lastMonth").val();
	var sql="SELECT * FROM PMRT.TAB_MRT_INDEX_DEPLOY_MON WHERE DEAL_DATE="+dealDate+" AND GROUP_ID_1='"+regionCode+"' ORDER BY INSERT_TIME";
	var r=query(sql);
	var content="";
	if(r!=null&&r.length>0){
		if(lastMonth==dealDate){
			for(var i=0;i<r.length;i++){
				content+="<tr id='"+r[i].INDEX_ID+"' name='"+r[i].INDEX_NAME+"' operator='update'>"
				+"<td>"+r[i].INDEX_NAME+"</td>"
				+"<td><input style='border-radius:10px;' value='"+toPoint(r[i].KRI_WEIGHT)+"' type='text' id='weight'"+id+" name='weight'/></td>"
				+"<td><input style='border-radius:10px;' value='"+toPoint(r[i].MIN_PROP)+"' type='text' id='minRate'"+id+" name='minRate'/></td>"
				+"<td><input style='border-radius:10px;' value='"+r[i].MIN_VALUE+"' type='text' id='minScore'"+id+" name='minScore'/></td>"
				+"<td><input style='border-radius:10px;' value='"+toPoint(r[i].MAX_PROP)+"' type='text' id='maxRate'"+id+" name='maxRate'/></td>"
				+"<td><input style='border-radius:10px;' value='"+r[i].MAX_VALUE+"' type='text' id='maxScore'"+id+" name='score'/></td>"
				+"<td><input style='border-radius:10px;' value='"+r[i].FULL_MARKS+"' type='text' id='fullScore'"+id+" name='fullScore'/></td></tr>";
			}
			$("#saveDiv").show();
			$("#markBtn").show();
			$("#dataBody").empty().append($(content));	
		}else{
			for(var i=0;i<r.length;i++){
				content+="<tr><td>"+r[i].INDEX_NAME+"</td>"
				+"<td>"+r[i].KRI_WEIGHT+"</td>"
				+"<td>"+r[i].MIN_PROP+"</td>"
				+"<td>"+r[i].MIN_VALUE+"</td>"
				+"<td>"+r[i].MAX_PROP+"</td>"
				+"<td>"+r[i].MAX_VALUE+"</td>"
				+"<td>"+r[i].FULL_MARKS+"</td></tr>";
			}
		   $("#saveDiv").hide();
		   $("#markBtn").hide();
		   $("#dataBody").empty().append($(content));	
		}
	}else{
		if(lastMonth==dealDate){
			$("#saveDiv").show();
			$("#markBtn").hide();
		}else{
			$("#saveDiv").hide();
			$("#markBtn").hide();
		}
		$("#dataBody").empty();
	}
}

function add(id,name) {
	var lastMonth=$("#lastMonth").val();
	if(dealDate==lastMonth){
			var content="<tr id='"+id+"' name='"+name+"' operator='add'>"
			+"<td>"+name+"</td>"
			+"<td><input style='border-radius:10px;' type='text' id='weight'"+id+" name='weight'/></td>"
			+"<td><input style='border-radius:10px;' type='text' id='minRate'"+id+" name='minRate'/></td>"
			+"<td><input style='border-radius:10px;' type='text' id='minScore'"+id+" name='minScore'/></td>"
			+"<td><input style='border-radius:10px;' type='text' id='maxRate'"+id+" name='maxRate'/></td>"
			+"<td><input style='border-radius:10px;' type='text' id='maxScore'"+id+" name='score'/></td>"
			+"<td><input style='border-radius:10px;' type='text' id='fullScore'"+id+" name='fullScore'/></td></tr>";
		  $("#dataBody").append($(content));	
	}
}
function save(){
	var treeObj=$.fn.zTree.getZTreeObj("ztree");
    var nodes=treeObj.getCheckedNodes(true);
	if(!nodes||nodes.length<=0){
		alert("请先选择指标！");
		return;
	}
	var dataString="";
	var weight="";
	var minRate="";
	var minScore="";
	var maxRate="";
	var maxScore="";
	var fullScore="";
	var sumWeight=0;
	var isPass=true;
	var operator="";
	$("#dataBody").find("tr").each(function(index){
		operator=$(this).attr("operator");
		weight=$.trim($(this).find("td:eq(1)").find("input").val());
		minRate=$.trim($(this).find("td:eq(2)").find("input").val());
		minScore=$.trim($(this).find("td:eq(3)").find("input").val());
		maxRate=$.trim($(this).find("td:eq(4)").find("input").val());
		maxScore=$.trim($(this).find("td:eq(5)").find("input").val());
		fullScore=$.trim($(this).find("td:eq(6)").find("input").val());
		if(!check(weight)||!check(minRate)||!check(minScore)||!check(maxRate)||!check(maxScore)||!check(fullScore)){
			alert("非法输入，输入不能为空且需是数字或小数！");
			isPass=false;
			return false;
		}
		if(parseFloat(minRate)>parseFloat(maxRate)){
			alert("最大百分比不能小于最小百分比！");
			isPass=false;
			return false;
		}
		if(parseFloat(minScore)>parseFloat(maxScore)){
			alert("得分不能小于最小得分！");
			isPass=false;
			return false;
		}
		if(parseFloat(maxScore)>parseFloat(weight)||parseFloat(minScore)>parseFloat(weight)){
			alert("得分不能大于权重！");
			isPass=false;
			return false;
		}
		if(parseFloat(minScore)>parseFloat(fullScore)||parseFloat(maxScore)>parseFloat(fullScore)){
			alert("满分不能小于最小得分与得分！");
			isPass=false;
			return false;
		}
		sumWeight+=parseFloat(weight);
		if(index==0){
			dataString+=operator+"|"+$(this).attr("id")+"|"+$(this).attr("name")+"|"+weight+"|"+minRate+"|"+minScore+"|"+maxRate+"|"+maxScore+"|"+fullScore;
		}else{
			dataString+=","+operator+"|"+$(this).attr("id")+"|"+$(this).attr("name")+"|"+weight+"|"+minRate+"|"+minScore+"|"+maxRate+"|"+maxScore+"|"+fullScore;
		}
	});
	if(!isPass){
		return;
	}
	if(sumWeight>50){
		alert("权重之和不能超过50%");
		return;
	}
	
	$.ajax({ 
        type: "POST", 
        url: $("#ctx").val()+"/itemSet/item-set!save.action", 
        dataType: "json",
        async: false,
		data:{
			dealDate:dealDate,
			dataString:dataString
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
function del(id,name){
	var lastMonth=$("#lastMonth").val();
	if(dealDate!=lastMonth){
		return;
	}
	$("#"+id).remove();
	$.ajax({ 
        type: "POST", 
        url: $("#ctx").val()+"/itemSet/item-set!del.action", 
        dataType: "json",
        async: false,
		data:{
			dealDate:dealDate,
			id:id
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

function change(){
	search();
	initItemTree();
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

//提交审批
function mark(){
	var regionCode=$("#regionCode").val();
	var sql="SELECT STATUS FROM PMRT.TAB_MRT_CHNL_UNIT_EVAL_MON WHERE DEAL_DATE='"+dealDate+"' AND GROUP_ID_1='"+regionCode+"' AND STATUS=1";
	var r=query(sql);
	if(r!=null&&r.length>0){
		alert(dealDate+"账期工单已生成，请勿重复生成！");
		return;
	}
	if(confirm("请先确定指标配置不再更改,确定生成工单?")){
		$.ajax({ 
	        type: "POST", 
	        url: $("#ctx").val()+"/itemSet/item-set!mark.action", 
	        dataType: "json",
	        async: false,
	        data:{
				dealDate:dealDate
			},
			success:function(data){
				alert(data.msg);
				$("#markBtn").hide();
	    	},
	    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
	            alert(errorThrown); 
			} 
		});  
	}
}