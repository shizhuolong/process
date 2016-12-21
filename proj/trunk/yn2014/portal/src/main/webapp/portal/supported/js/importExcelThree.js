var businessKey="";
$(function() {
	businessKey=art.dialog.data('businessKey');//退回拟稿人的数据重导后保留init_id
});
/*
*数据导入
*/
function importExcel(){
	var pay_address=$("#pay_address").val();
	var url = $("#ctx").val()+"/threeSupported/three-supported!importExcel.action?businessKey="+businessKey+"&pay_address="+encodeURI(encodeURI(pay_address));
	$('#importForm').form('submit', {   
	    url:url,   
	    onSubmit: function(){   
	      var pay_address=$("#pay_address").val();
	      if(pay_address==""){
	    	  art.dialog.alert("请选择数据去向!");
	    	  return false;
	      }
	      return checkOptions();
	    },   
	    success:function(data){
	    	var win = artDialog.open.origin;//来源页面
	    	$.messager.progress('close');
	    	 var data = eval('(' + data + ')');  
		    if(data!=""&&null!=data){
		    	win.art.dialog({
		    		title:"上传失败",
		    		icon:'error',
		    		content:data,
		    		width:'530px',
		    		height:'240px',
		    		lock:true,
		    		ok: function () {
						win.art.dialog({id: 'importExcelDailog'}).close();
						//调用父页面的search方法，刷新列表
						//win.search(0);
		   		    }
		    	});
		    }else{
		    	win.art.dialog({
		   			title: '提示',
		   		    content: '上传成功',
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	//var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'importExcelDailog'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
		    }
	    }   
	});  
} 

/**校验**/
function checkOptions(){
	var $file=$(':file');
	var allow = new Array('xls'); //允许的拓展名
	var flag = 1;
	$.each($file,function() {
		var file = $(this);
		if(null==file.val() || ''==file.val()){
			art.dialog.alert("请选择上传文件!");
			flag = 0;
		}else{
			var ext=file.val().split('.').pop().toLowerCase(); 
			if(jQuery.inArray(ext, allow) == -1) {
				//$.messager.alert('警告','请选择xls文件!');
				art.dialog.alert("请选择xls文件!");
				flag = 0;
			} 
		}
	});
	if(flag==1) {
		$.messager.progress({interval:30,text:'数据正在上传中，请稍等。。。。'});  
		return true;
	}else {
		return false;
	}
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

