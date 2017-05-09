$(function() {
	initData();
});

function initData(){
	var dealDate=art.dialog.data('dealDate');
	var area=art.dialog.data('area');
	var channel_name=art.dialog.data('channel_name');
	var channel_id=art.dialog.data('channel_id');
	var zdmlfx_jf=art.dialog.data('zdmlfx_jf');
	var csql="SELECT count(*) count FROM PMRT.TAB_MRT_TS_R_CBSS_2CFP WHERE CHANNEL_ID='"+channel_id+"' AND DEAL_DATE='"+dealDate+"'";
	var r=query(csql);
	var count;
	if(r&&r[0].COUNT>0){
		count=r[0].COUNT;
		var tbody="<tbody style='text-align:center;'>";
		var sql="SELECT * FROM PMRT.TAB_MRT_TS_R_CBSS_2CFP WHERE CHANNEL_ID='"+channel_id+"' AND DEAL_DATE='"+dealDate+"'";
		r=query(sql);
		for(var i=0;i<r.length;i++){
			tbody+="<tr>";
			if(i==0){
				tbody+="<td style='font-size:20px;bold;' rowspan='"+count+"'>"+area+"</td><td style='font-size:20px;bold;' rowspan='"+count+"'>"+channel_name+"</td><td style='font-size:20px;bold;' rowspan='"+count+"'>"+channel_id+"</td><td style='font-size:20px;bold;' rowspan='"+count+"'>"+zdmlfx_jf+"</td>";
				tbody+="<td>"+r[i].NAME+"</td><td>"+isNull(r[i].USER_CODE)+"</td><td><input style='border-radius:10px;' value='"+isNull(r[i].JF_2CFP)+"'/></td>";
				tbody+="<td><a style=\"color:blue;\" channel_id='"+channel_id+"' user_code='"+r[i].USER_CODE+"' zdmlfx_jf='"+r[i].ZDMLFX_JF+"' ry_num='"+r[i].RY_NUM+"' onclick=\"save(this);\">保存</a></td>";
			}else{
				tbody+="<td>"+r[i].NAME+"</td><td>"+isNull(r[i].USER_CODE)+"</td><td><input style='border-radius:10px;' value='"+isNull(r[i].JF_2CFP)+"'/></td>";
				tbody+="<td><a style=\"color:blue;\" channel_id='"+channel_id+"' user_code='"+r[i].USER_CODE+"' zdmlfx_jf='"+r[i].ZDMLFX_JF+"' ry_num='"+r[i].RY_NUM+"' onclick=\"save(this);\">保存</a></td>";
			}
			tbody+="</tr>";
	 	}
		tbody+="</tbody>";
		var thead="<thead><tr><th>地市</th><th>营业厅名称</th><th>渠道编号</th><th>厅当月终端毛利分享积分额度</th><th>营业员姓名</th><th>营业员工号</th><th>营业员二次分配所得积分</th><th>&nbsp;操作&nbsp;</th></tr></thead>";
		$("#dataTable").empty().append($(thead+tbody));
	}else{
		alert("该营业厅没有营业员！");
		return;
	}
}

function save(obj){
	var channel_id=$(obj).attr("channel_id");
	var user_code=$(obj).attr("user_code");
	var zdmlfx_jf=$(obj).attr("zdmlfx_jf");
	var ry_num=$(obj).attr("ry_num");
	var jf_2cfp=$.trim($(obj).parent().prev().find("input").val());
	if(jf_2cfp==""){
		alert("所得积分不能为空！");
		return;
	}
	if(isNaN(jf_2cfp)){
		alert("请输入数字！");
		return;
	}
	if(jf_2cfp>(zdmlfx_jf*0.4)){
		alert("店长所得不能高于40%！");
		return;
	}
	if(jf_2cfp>(zdmlfx_jf/ry_num*3)){
		alert("店长所得不能高于厅人均的3倍！");
		return;
	}
	 $.ajax({ 
	        type: "POST", 
	        url: $("#ctx").val()+"/cbss/cbss!save.action", 
	        dataType: "json",
	        async: false,
			data:{
				channel_id:channel_id,
				user_code:user_code,
				jf_2cfp:jf_2cfp
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
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}