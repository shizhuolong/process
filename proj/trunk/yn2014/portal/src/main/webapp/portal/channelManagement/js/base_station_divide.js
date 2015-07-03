var group_id_1 = "";
var station_addr_code = "";
var pageSize = 5;
$(function() {
	group_id_1 = art.dialog.data('group_id_1');
	station_addr_code = art.dialog.data('station_addr_code');
	listUnit(0);
	$("#searchBtn").click(function(){
		listUnit(0);
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'stationDivideDialog'}).close();

	});
	$("#saveBtn").click(function(){
		if($('input:radio:checked').length<=0) {
			art.dialog.alert("请选择基站划分的营服中心!");
			return false;
		}
		var unit_id = $('input:radio:checked').val()
		var unit_name = $('input:radio:checked').attr("unit_name");
		art.dialog.confirm('您确定要进行该操作吗？',function(){
			$.ajax({
				type:"POST",
				dataType:'json',
				cache:false,
				url:$("#ctx").val()+"/channelManagement/baseStation_saveDivideStation.action",
				data:{
					"unit_id":unit_id,
					"unit_name":unit_name,
					"station_addr_code":station_addr_code
			   	}, 
			   	success:function(data){
			   		art.dialog({
			   			title: '提示',
			   		    content: data.msg,
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
			   		    	var win = artDialog.open.origin;//来源页面
							win.art.dialog({id: 'stationDivideDialog'}).close();
							//调用父页面的search方法，刷新列表
							win.search(0);
			   		    }
			   		});
			   	}
			});
		},function(){
			art.dialog.tips('执行取消操作');
		});
	});
});

function listUnit(pageNumber) {
	pageNumber = pageNumber + 1;
	var unit_name = $.trim($("#unit_name").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/baseStation_listUnit.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "group_id_1" : group_id_1,
           "unit_name":unit_name
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
	   			initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>" +
					"<input type='radio' name='ckUnit' unit_name='"+n['UNIT_NAME']+"' value='"+n['UNIT_ID']+"'>" +
				"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				content+="</tr>";
			});
			if(content != "") {
				$("#unitDatas").empty().html(content);
			}else {
				$("#unitDatas").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
			}
	   	}
	});
}

function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
      callback: listUnit,
      items_per_page:pageSize,
      link_to:"###",
      prev_text: '上页',       //上一页按钮里text  
	   next_text: '下页',       //下一页按钮里text  
	   num_display_entries: 3, 
	   num_edge_entries: 0
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

