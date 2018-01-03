$(function(){
	var pageNumber =1;
	var pageSize = 10;
	var url=$("#ctx").val()+"/channel/renew-channel!findByIds.action";
	var id=$("#uu_id").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:url,
		data:{
			"resultMap.page":pageNumber,
	        "resultMap.rows":pageSize,
	        id:id
		},
		success:function(data){
			if(data!=null&&data!=""){
				var content="";
		   		$.each(data.rows,function(i,n){
					content+="<tr>"
					+"<td><input readonly='readonly' style='border-style:none' value="+isNull(n['HQ_CHAN_CODE'])+"></td>"
	                +"<td><input readonly='readonly' style='border-style:none' value="+isNull(n['HQ_CHAN_NAME'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['START_MONTH'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['END_MONTH'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['HZ_YEAR'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['ASSESS_TARGET'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['YSDZ_XS'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['ZX_BT'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['HZ_MS'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['FW_FEE'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['RATE_THREE'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['RATE_SIX'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['RATE_NINE'])+"></td>"
	                +"<td><input style='border-style:none' value="+isNull(n['RATE_TWELVE'])+"></td>"
	                +"<td style='border-style:none; margin:0; padding: 0px;'><input type='hidden' style='border-style:none' value="+isNull(n['ID'])+"></td>"
	                +"</tr>";
				});
		   		if(content != "") {
					$("#dataBody").empty().html(content);
				}else {
					$("#dataBody").empty().html("<tr><td colspan='14'>暂无数据</td></tr>");
				}
			}
		}
	});
	$("#save").click(function(){
		save();
	})
});

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function save(){
	var str ="";
	$("#dataBody").find("tr").each(function(){
        var tdArr = $(this).children();
        var hq_chan_code = tdArr.eq(0).find('input').val();
        var hq_chan_name = tdArr.eq(1).find('input').val();
        var start_month = tdArr.eq(2).find('input').val();
        var end_month = tdArr.eq(3).find('input').val();
        var hz_year = tdArr.eq(4).find('input').val();
        var assess_target = tdArr.eq(5).find('input').val();
        var ysdz_xs = tdArr.eq(6).find('input').val();
        var zx_bt = tdArr.eq(7).find('input').val();
        var hz_ms = tdArr.eq(8).find('input').val();
        var fw_fee = tdArr.eq(9).find('input').val();
        var rate_three = tdArr.eq(10).find('input').val();
        var rate_six = tdArr.eq(11).find('input').val();
        var rate_nine = tdArr.eq(12).find('input').val();
        var rate_twelve = tdArr.eq(13).find('input').val();
        var uu_id = tdArr.eq(14).find('input').val();
        str += hz_year+ ","+end_month+","+assess_target+","+rate_three+","+rate_six+","+
        rate_nine+","+rate_twelve+","+ysdz_xs+","+zx_bt+","+hz_ms+","+fw_fee+","+uu_id+"|"
    });
	var url = $("#ctx").val()+"/channel/renew-channel!renewBatch.action";
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:url,
		data:{
			param:str
		},
		success:function(data){
			if(data==null||data=="")
			art.dialog({
			    title: '成功',
			    content: '批量续签成功！',
			    icon: 'succeed',
			    ok: function(){
			        this.title('警告').content('两秒后将关闭！').lock().time(2);
			        return false;
			    }
			});
		}
	})
}