var editor='';
$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'addQuest'}).close();

	});
	 KindEditor.ready(function(K) {
		editor = K.create('#questCountent', {
			resizeType : 1,
			allowPreviewEmoticons : false,
			allowImageUpload : false,
			items : [ 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor',
					'bold', 'italic', 'underline', 'removeformat', '|',
					'justifyleft', 'justifycenter', 'justifyright',
					'insertorderedlist', 'insertunorderedlist', '|',
					'emoticons', 'image', 'link' ]
		});
	});
	$("#saveBtn").click(function(){
			addQuest();
	});
			
});

function addQuest(){
	var questName=$.trim($("#questName").val());
	var questCountent=editor.html();;
	var askTime = $.trim($("#askTime").val());
	var askName = $.trim($("#askName").val());
	var questType= "1";
	var fdId ="1";
	if(questName==''||questName==null){
		alert("问题名称不能为空");
		return;
	}
	if(questCountent ==''||questCountent==null){
		alert("问题描述不能为空");
		return;
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/qaManagement/qaManagement_addQuset.action",
		data:{
			"questName":questName,
			"questCountent":questCountent,
			"askName":askName,
			"askTime":askTime,
			"questType":questType,
			"fdId":fdId
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
			   		}
			var win = artDialog.open.origin;// 来源页面
			win.art.dialog({ id : 'addQuest' }).close();
			win.search(0);
	   	}
	});
}



