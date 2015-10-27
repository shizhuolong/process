var common_editor='';
$(function(){
	/*KindEditor.ready(function(K) {
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
	});*/
	
	
	/*查询常用问题列表*/
	commonQuestList();
	
	var userName = $("#userName").val();
	if(userName=='admin'){
		$("#comm_quest_add").show();
	}else{
		$("#comm_quest_add").hide();
	}
	
	/*$("#add_comment_quest_button").click(function(){
		$("#common_quest_name").attr("value","");
		$("#common_quest_countent").attr("value","");
		$("#common_quest_answer").attr("value","");
		$("#add_comment_quest").show();
		
		
	});*/
	/*$("#cancleBtn").click(function(){
		$("#common_quest_name").attr("value","");
		$("#common_quest_countent").attr("value","");
		$("#common_quest_answer").attr("value","");
		$("#add_comment_quest").hide();
	});*/
	$("#user_quest_add").click(function(){
		addQuset();
	});
	$("#comm_quest_add").click(function(){
		addCommonQuset();
	});
	$("#show_commonDataBody").click(function(){
		/*show_commonDataBody();*/
		$("#questDataBody").hide();
		$("#commonDataBody").show();
		commonQuestList(0);
	});
	$("#show_dataBody").click(function(){
		$("#commonDataBody").hide();
		$("#questDataBody").show();
		search(0);
	});
	/*$("#saveBtn").click(function(){
		addCommonQuest();
	});*/
});

//查询常见问题列表
function commonQuestList(pageNumber){
	var questType ='0';
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/qaManagement/qaManagement_commonQuestList.action",
		data:{
			"questType":questType
		},
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var content=""; 
	   		$.each(data,function(i,n){ 
	   			content+="<div class='common_data_list'>" +
	   					"	<h4 class='common_data_list_title'>问题&nbsp;&nbsp;"+isNull(n['QUEST_NAME'])+"</h4>" +
	   					"	<span class='common_data_list_content'>描述&nbsp;&nbsp;&nbsp;"+isNull(n['QUEST_CONTENT'])+"</span><br/>" +
	   					"	<span class='common_data_list_answer'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+isNull(n['ANSWER_CONTENT'])+"</span>" +
	   					"</div>";
	   		});
	   		if(content!=null){
	   			$("#commonQuest").empty().html(content);
	   			$(".common_data_list_title").css({"margin":"5px 0 15px 20px","font-family":"arial","font-size":"14px","color":"#000000"});
	   			$(".common_data_list_content").css({"margin":"5px 0 10px 20px","font-family":"楷体","font-size":"12px","color":"#000000","color":"#696969"});
				$(".common_data_list_answer").css({"margin":"5px 0 5px 30px","font-family":"arial tahoma","font-size":"12px","color":"#000000"});
				$(".common_data_list").css({"border-bottom":"solid 1px #B0C4DE","margin":"0 0 30px 14px","width":"90%"});
	   		}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
	
}

function search(pageNumber){
	var answerName = $("#userName").val();
	var answerTime = $("#dealDate").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/qaManagement/qaManagement_qaList.action",
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var content="";
	   		$.each(data,function(i,n){
				content+="<div class='quest'>" +
						"	<h2><span><a class='quest_title' askId='"+isNull(n['ID'])+"' askName='"+isNull(n['ASK_NAME'])+"' askTime='"+isNull(n['ASK_TIEM'])+"' answerName='"+answerName+"' answerTime='"+answerTime+"'onclick='showAnswerDetail(this);'>"+isNull(n['QUEST_NAME'])+"</a></span></h2>" +
						"	<span class='quest_countent'>&nbsp;&nbsp;&nbsp;"+isNull(n['QUEST_CONTENT'])+"</span>" +
						"	<div style='height:20px;'>" +
						"		<span class='userName'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+isNull(n['ASK_NAME'])+"&nbsp;"+isNull(n['ASK_TIEM'])+"</span> "+
						"		<span class='showAnswer'>" +
						"			<a askId='"+isNull(n['ID'])+"' askName='"+isNull(n['ASK_NAME'])+"' askTime='"+isNull(n['ASK_TIEM'])+"' answerName='"+answerName+"' answerTime='"+answerTime+"' onclick='showAnswer(this);'>回复</a>&nbsp;|&nbsp;" +
						"			<a askId='"+isNull(n['ID'])+"' askName='"+isNull(n['ASK_NAME'])+"' askTime='"+isNull(n['ASK_TIEM'])+"' answerName='"+answerName+"' answerTime='"+answerTime+"' onclick='showAnswerDetail(this);'>查看回复</a>" +
						"		</span>" +
						"	</div>" +
						"</div>";
			});
			if(content != "") {
				$("#userQuest").empty().html(content);
				$(".quest_title").css({"margin":"5px 0 5px 20px","font-family":"楷体","font-size":"16px","color":"#000000"});
				$(".quest_countent").css({"margin":"5px 0 5px 30px","font-family":"arial tahoma","font-size":"12px","color":"#000000"});
				$(".quest_title").mouseover(function(){
					$(this).css('color','#8fde62');
				});
				$(".quest_title").mouseout(function(){
					$(this).css('color','#000000');
				});
				$(".quest").css({"border-radius":"5px","width":"80%","margin":"0 0 21px 50px","border-bottom":"solid 1px #B0C4DE"});
				$(".userName").css("float","left");
				$(".showAnswer").css("float","right");
				$(".showAnswer A").css("text-decoration","none");
			}else {
				$("#userQuest").empty().html("<tr><td colspan='6'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function showAnswerDetail(even){
	$(even).parent().parent().parent().parent().find(".answer").empty();
	$(even).parent().parent().parent().parent().find(".answerDetail").empty();
	/*count=0;
	count+=1;*/
	var answerName=$(even).attr("answerName");
	var answerTime=$(even).attr("answerTime");
	var askName=$(even).attr("askName");
	var askTime=$(even).attr("askTime");
	var fdId=$(even).attr("askId");
	var userName=$("#userName").val();
	/*if(count==1){*/
		var answerDetail=
			"<div class='answerDetail'>" +
			/*"	<div class='answerDetail'>                                                                               "+
			"		<div class='answerAreaDetail'>                                                                        "+
			"			 <textarea style='margin-top:4px'; class='answerContentDetail' name='contentDetail' placeholder='请输入回复内容'></textarea>   "+
			"		</div>                                                                                          "+
			"		<div class='userMessageDetail'>" +
			"			<a  style='margin: 0 50px'class='default-btn fLeft ml10 answerButton'  askId='"+fdId+"' askName='"+askName+"' askTime='"+askTime+"' answerName='"+answerName+"' answerTime='"+answerTime+"' onclick='addAnswer(this);'>提 交</a>"+
			"		</div> " +
			"	</div>" +
			"	<div class='showAnswerDetail'>";*/
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/qaManagement/qaManagement_answerDetail.action",
			data:{
				"fdId":fdId
		   	}, 
		   	success:function(data){
		   		if(data.msg) {
		   			alert(data.msg);
		   			return;
		   		}
		   		answerDetail+="<div class='answerTable'>";
		   		$.each(data,function(i,n){
		   			if(isNull("ANSWER_NAME")==userName){
		   				answerDetail+="<div  class='answerContent'><span class='answerText'>&nbsp;&nbsp;<a fdId='"+fdId+"' name='"+isNull(n['ANSWER_NAME'])+"' onclick='addDetailAnswer(this)'>"+isNull(n['ANSWER_NAME'])+"</a >："+isNull(n['ANSWER_CONTENT'])+"</span></div>";
		   			}else{
		   				answerDetail+="<div  class='answerContent'><span cla<span='answerText'>&nbsp;&nbsp;<a fdId='"+fdId+"' name='"+isNull(n['ANSWER_NAME'])+"' onclick='addDetailAnswer(this)'>"+isNull(n['ANSWER_NAME'])+"</a>&nbsp;回复&nbsp;<a fdId='"+fdId+"' name='"+isNull(n['ASK_NAME'])+"' onclick='addDetailAnswer(this)'>"+isNull(n['ASK_NAME'])+"</a>："+isNull(n['ANSWER_CONTENT'])+"</span></div>";
		   			}
				});
		   		/*answerDetail+="</div>";*/
		   		answerDetail+="</div></div>";
				if(answerDetail != "") {
					$(even).parent().parent().parent().append(answerDetail);
					$(".answerContentDetail").css({"margin-left":"20px","padding-left":"20px","resize":"none","width":"644px","height":"30px","max-width":"1000px","max-height":"100px"});
					$(".showAnswerDetail").css({"width":"704px"});
					$(".answerDetail").css({"width":"704px","background":"#F0F0F0"});
					$(".answerTable").find("td").css({"padding-left":"5px","padding-right":"5px"});
					$(".answerContent").find("td").css({"padding-left":"5px","padding-right":"5px","width":"auto","float":"left"});
					$(".answerText").css({"font-family":"arial tahoma","font-size":"12px","margin-top":"8px"});
					$(".answerButton").css({"float":"right","margin-right":"50px"});
					$(".userMessageDetail").css({"height":"30px"});
				}else {
					$("#dataBody").empty().html("<tr><td colspan='6'>暂无数据</td></tr>");
				}
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
			   alert("加载数据失败！");
		    }
		});
}



function showAnswer(even){
	$(even).parent().parent().parent().parent().find(".answer").empty();
	$(even).parent().parent().parent().parent().find(".answerDetail").empty();
	var answerName=$(even).attr("answerName");
	var answerTime=$(even).attr("answerTime");
	var askName=$(even).attr("askName");
	var askTime=$(even).attr("askTime");
	var askId=$(even).attr("askId");
	var num = $(even).attr("num");
		var answer=
			"<div class='answer'>                                                                               "+
			"	<div class='answerArea'>                                                                        "+
			"		 <textarea class='answerContent' name='content' placeholder='请输入回复内容'></textarea>   "+
			"	</div>                                                                                          "+
			"	<div class='userMessage'>" +
			"		<span>&nbsp;&nbsp;"+answerName+"&nbsp;&nbsp;"+answerTime+"&nbsp;&nbsp;</span>" +
			"		<input type='button' value='回复' class='answerButton' askId='"+askId+"' askName='"+askName+"'  answerName='"+answerName+"' answerTime='"+answerTime+"' onclick='addAnswer(this);'/>" +
			"	</div>       "+
			"</div>                                                                                             ";
			
			$(even).parent().parent().parent().append(answer);
			$(".answerContent").css({"margin-top":"20px","margin-left":"50px","resize":"none","width":"600px","height":"100px","max-width":"1000px","max-height":"100px"});
			$(".answerButton").css({"float":"right","margin-right":"50px"});
			$(".userMessage").css({"display":"block","margin-left":"24px","height":"24px"});
			$(".answer").css({"background":"#F0F0F0","margin":"0 0 0 12px"});
}

function addDetailAnswer(even){
	$(even).parent().parent().parent().find(".answerByName").empty();
	var askName = $(even).attr('name');
	var fdId =$(even).attr("fdId");
	var answerName = $("#userName").val();
	var answerTime = $("#dealDate").val();
	var answerArea = 
		"<div class='answerByName'>" +
		"	<div class='answerByNameArea'>" +
		"		<textarea class='answerByNameCount' name='answerByNameCount' placeholder='请输入回复内容'></textarea>" +
		"	<div>" +
		/*"	<div class='answerByNameMessage'>" +*/
		"		<button  class='default-btn fLeft ml10 answerByNameButton' style='margin: 0 50px'  askId='"+fdId+"' askName='"+askName+"' answerName='"+answerName+"' answerTime='"+answerTime+"' onclick='addAnswer(this)'>回复</button>" +
		/*"	</div>" +*/
		"</div>";
	$(even).parent().after(answerArea);
	$(".answerByName").css({"margin":"0 0 5px 20px"});
	$(".answerByNameCount").css({"resize":"none","width":"644px","height":"100px","max-width":"1000px","max-height":"100px"});
	$(".answerByNameButton").css({"float":"right","margin-right":"50px"});	
	$(".answerByNameCount").css({"margin-left":"20px"});
}


function addAnswer(even){
	var fdId=$(even).attr("askId");
	var answerName=$(even).attr("answerName");
	var answerTime=$(even).attr("answerTime");
	var askName=$(even).attr("askName");
	var questType="2";
	var answerContent=$(even).parent().parent().find("textarea").val();
	if(answerContent==''||answerContent==null){
		alert("问题回复不能为空!");
		return;
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/qaManagement/qaManagement_answerQuest.action",
		data:{
	           "fdId":fdId,
	           "answerName":answerName,
	           "answerTime":answerTime,
	           "askName":askName,
	           "questType":questType,
	           "answerContent":answerContent
		   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		$.each(data,function(i,n){ 
	   			
	   		});
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
	$(even).parent().parent().parent().find(".answer").hide();
	search(0);
}

function addQuset(){
	var userName= $("#userName").val();
	var dealDate=$("#dealDate").val();
	var url = $("#ctx").val()+"/portal/quest/jsp/add_user_quest.jsp?userName="+userName+"&dealDate="+dealDate;
	art.dialog.open(url,{
		id:'addQuest',
		lock:true,
		resize:false
	});
}

function addCommonQuset(){
	var userName= $("#userName").val();
	var dealDate=$("#dealDate").val();
	var url = $("#ctx").val()+"/portal/quest/jsp/add_common_quest.jsp?userName="+userName+"&dealDate="+dealDate;
	art.dialog.open(url,{
		id:'addCommonQuest',
		lock:true,
		resize:false
	});
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return " ";
	}
	return obj;
}



/*function addCommonQuest(){
	var questName=$.trim($("#common_quest_name").val());
	var questCountent=$.trim($("#common_quest_countent").val());
	var answerContent=common_editor.html();
	alert(answerContent);
	var askTime=$("#dealDate").val();
	var answerTime=$("#dealDate").val();
	var askName=$("#userName").val();
	var answerName=$("#userName").val();
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
	   			alert(data.msg);
	   			return;
	   		}
	   		$.each(data,function(i,n){ 
	   			
	   		});
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
	$("#add_comment_quest").hide();
	commonQuestList();
	
}*/
/*function show_questDataBody(){
	$("#questDataBody").css({"display":"block"});
	$("#commonDataBody").css({"display":"none"});
	$("#commonDataBody").hide();
	$("#questDataBody").show();
}
function show_commonDataBody(){
	$("#commonDataBody").css({"display":"block"});
	$("#questDataBody").css({"display":"none"});
	$("#questDataBody").hide();
	$("#commonDataBody").show();
}*/
