/*
*数据导入
*/
function importExcel(){
	var url = $("#ctx").val()+"/channel/import-channel!importToTemp.action";
	$('#importForm').form('submit', {   
	    url:url,
	    onSubmit: function(){   
	    	return checkOptions();
		},
	    success:function(data){
	    	var win = artDialog.open.origin;//来源页面
	    	$.messager.progress('close');
	    	var data = eval(data);
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

