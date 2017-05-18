$(function() {
	initData();
	$("input").keyup(function(){
		var jf_2cfp;
		var sum=0;
		$("#dataBody").find("tr").each(function(index){
			if(index==0){
				jf_2cfp=$.trim($(this).find("td:eq(6)").find("input[name='jf_2cfp']").val());
			}else{
				jf_2cfp=$.trim($(this).find("td:eq(2)").find("input[name='jf_2cfp']").val());
			}
			if(jf_2cfp==""){//录入积分为空时，默认修改成0
				jf_2cfp="0";
			}
			sum+=parseFloat(jf_2cfp);
		});
		$("#jf_total").text(sum.toFixed(2));
		var zdmlfx_jf=$("#save").attr("zdmlfx_jf");
		if(sum>zdmlfx_jf){
			alert("录入总积分不能大于所得积分！");
		}
	});
});

function initData(){
	var dealDate=art.dialog.data('dealDate');
	var area=art.dialog.data('area');
	var channel_name=art.dialog.data('channel_name');
	var channel_id=art.dialog.data('channel_id');
	var zdmlfx_jf=art.dialog.data('zdmlfx_jf');
	var csql="SELECT count(*) count,SUM(JF_2CFP) jf_total FROM PMRT.TAB_MRT_TS_R_CBSS_2CFP WHERE CHANNEL_ID='"+channel_id+"' AND DEAL_DATE='"+dealDate+"'";
	var r=query(csql);
	var count;
	var jf_total;
	if(r&&r[0].COUNT>0){
		count=r[0].COUNT;
		jf_total=r[0].JF_TOTAL;
		if(jf_total==null||typeof(jf_total)=="undefined"){
			jf_total=0;
		}
		var tbody="<tbody id='dataBody' style='text-align:center;'>";
		var sql="SELECT * FROM PMRT.TAB_MRT_TS_R_CBSS_2CFP WHERE CHANNEL_ID='"+channel_id+"' AND DEAL_DATE='"+dealDate+"'";
		r=query(sql);
		for(var i=0;i<r.length;i++){
			tbody+="<tr>";
			if(i==0){
				tbody+="<td style='font-size:20px;bold;' rowspan='"+count+"'>"+area+"</td><td style='font-size:20px;bold;' rowspan='"+count+"'>"+channel_name+"</td><td style='font-size:20px;bold;' rowspan='"+count+"'>"+channel_id+"</td><td style='font-size:20px;bold;' rowspan='"+count+"'>"+zdmlfx_jf+"</td>";
				tbody+="<td>"+r[i].NAME+"</td><td>"+isNull(r[i].USER_CODE)+"</td><td><input style='border-radius:10px;' name='jf_2cfp' value='"+isNull(r[i].JF_2CFP)+"'/><input type='hidden' name='hr_id' value='"+isNull(r[i].HR_ID)+"'/><input type='hidden' name='f_hr_id' value='"+isNull(r[i].F_HR_ID)+"'/></td>";
				tbody+="<td style='color:red;font-size:20px;bold;' id='jf_total' rowspan='"+count+"'>"+jf_total+"</td>";
				tbody+="<td rowspan='"+count+"'><a id=\"save\" style=\"color:red;background-color:yellow;font-size:20px;\" channel_id='"+channel_id+"' zdmlfx_jf='"+r[i].ZDMLFX_JF+"' ry_num='"+r[i].RY_NUM+"' onclick=\"save(this);\">保存</a></td>";
			}else{
				tbody+="<td>"+r[i].NAME+"</td><td>"+isNull(r[i].USER_CODE)+"</td><td><input style='border-radius:10px;' name='jf_2cfp' value='"+isNull(r[i].JF_2CFP)+"'/><input type='hidden' name='hr_id' value='"+isNull(r[i].HR_ID)+"'/><input type='hidden' name='f_hr_id' value='"+isNull(r[i].F_HR_ID)+"'/></td>";
			}
			tbody+="</tr>";
	 	}
		tbody+="</tbody>";
		var thead="<thead><tr><th>地市</th><th>营业厅<br/>名称</th><th>渠道<br/>编号</th><th>厅当月终端毛<br/>利分享积分额度</th><th>营业员姓名</th><th>营业员工号</th><th>营业员二次<br/>分配所得积分</th><th>录入总和</th><th>&nbsp;操作&nbsp;</th></tr></thead>";
		$("#dataTable").empty().append($(thead+tbody));
	}else{
		alert("该营业厅没有营业员！");
		return;
	}
}

function save(obj){
	var channel_id=$(obj).attr("channel_id");
	var zdmlfx_jf=$(obj).attr("zdmlfx_jf");
	var ry_num=$(obj).attr("ry_num");
	var dataString="";
	var sum=0;
	var user_code;
	var jf_2cfp;
	var hr_id;
	var f_hr_id;
	var flag=true;
	$("#dataBody").find("tr").each(function(index){
		if(index==0){
			user_code=$(this).find("td:eq(5)").text();
			jf_2cfp=$.trim($(this).find("td:eq(6)").find("input[name='jf_2cfp']").val());
			hr_id=$(this).find("td:eq(6)").find("input[name='hr_id']").val();
			f_hr_id=$.trim($(this).find("td:eq(6)").find("input[name='f_hr_id']").val());
		}else{
			user_code=$(this).find("td:eq(1)").text();
			jf_2cfp=$.trim($(this).find("td:eq(2)").find("input[name='jf_2cfp']").val());
			hr_id=$(this).find("td:eq(2)").find("input[name='hr_id']").val();
			f_hr_id=$.trim($(this).find("td:eq(2)").find("input[name='f_hr_id']").val());
		}
		if(jf_2cfp==""){//录入积分为空时，默认修改成0
			jf_2cfp="0";
		}
		if(user_code!=""){
			if(isNaN(jf_2cfp)){
				alert("请输入数字！");
				flag=false;
				return;
			}
			if(hr_id==f_hr_id){//店长
				if(jf_2cfp>(zdmlfx_jf*0.4)){
					alert("店长所得不能高于40%！");
					flag=false;
					return;
				}
				if(jf_2cfp>(zdmlfx_jf/ry_num*3)){
					alert("店长所得不能高于厅人均的3倍！");
					flag=false;
					return;
				}
			}
			sum+=parseFloat(jf_2cfp);
			if(index==0){
				dataString+=user_code+"-"+jf_2cfp
			}else{
				dataString+=","+user_code+"-"+jf_2cfp
			}
		}
	});
	
	if(flag!=true){
	  return;	
	}
	if(sum>zdmlfx_jf){
		alert("录入总积分不能大于所得积分！");
		return;
	}
	if(sum==0){
		alert("请录入积分！");
		return;
	}
	
	 $.ajax({ 
	        type: "POST", 
	        url: $("#ctx").val()+"/cbss/cbss!save.action", 
	        dataType: "json",
	        async: false,
			data:{
				channel_id:channel_id,
				dataString:dataString
			},
			 success:function(data){
				 if(data.ok=="false"){
					 alert(data.msg);
				 }else{
					 alert("保存成功！");
				 }
	    	},
	    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
	            alert(errorThrown); 
			} 
		});  
}

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "&nbsp;";
	}
	return obj;
}