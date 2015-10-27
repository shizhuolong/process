var common_editor='';
$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'addCommonQuest'}).close();

	});
	 KindEditor.ready(function(K) {
		 common_editor = K.create('#common_quest_answer', {
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
			addCommonQuest();
	});
			
});

function addCommonQuest(){
	var questName=$.trim($("#common_quest_name").val());
	var questCountent=$.trim($("#common_quest_countent").val());
	var answerContent=common_editor.html();
	var askTime=$("#askTime").val();
	var answerTime=$("#answerTime").val();
	var askName=$("#askName").val();
	var answerName=$("#askName").val();
	var fdId='0';
	var questType='0';
	if(questName=='' ||questName==null){
		alert("常见问题名称不能为空！");
		return;
	}
	if(questCountent==''||questCountent==null){
		alert("常见问题描述不能为空！");
		return;
	}
	if(answerContent==''||answerContent==null){
		alert("常见问题答案不能为空！");
		return;
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/qaManagement/qaManagement_addCommonQuest.action",
		data:{
			"questName":questName,
			"questCountent":questCountent,
			"answerContent":answerContent,
			"askTime":askTime,
			"answerTime":answerTime,
			"askName":askName,
			"answerName":answerName,
			"fdId":fdId,
			"questType":questType
		},
	   	success:function(data){
	   		

	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
			   		}
			var win = artDialog.open.origin;// 来源页面
			win.art.dialog({ id : 'addCommonQuest' }).close();
			win.commonQuestList(0);
	   	
	   	}
	});
}



