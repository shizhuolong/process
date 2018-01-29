$(function(){

});

function add(obj){
	var parent_node=$(obj).attr("parent_node");
	var school_id=$(obj).attr("school_id");
	var school_name=$(obj).attr("school_name");
	var school_campus=$(obj).attr("campus");
	var level=$(obj).attr("level");
	var url = $("#ctx").val()+"/portal/schoolManagement/jsp/add_school_head.jsp?school_name="+encodeURI(encodeURI(school_name));
		art.dialog.open(url,{
		title: "添加",
		width: 500,
        height: 250,
		ok: function () {
			var pioneer_name = art.dialog.data("pioneer_name");
			var pioneer_phone = art.dialog.data("pioneer_phone");
			var pioneer_class = art.dialog.data("pioneer_class");
			if(!(isPone(pioneer_phone))){
				alert("不是一个正确的电话号码！");
				return;
			}
			if(school_id==''||school_id==null||school_id==undefined){
				alert("学校名称错误！");
				return;
			}
			if(pioneer_name==''||pioneer_name==null||pioneer_name==undefined){
				alert("姓名不能为空！");
				return;
			}
			if(pioneer_class==''||pioneer_class==null||pioneer_class==undefined){
				alert("班级不能为空！");
				return;
			}
			$.ajax({
				type: "POST",
		        url: $("#ctx").val()+"/school/school-pioneer!addPioneer.action",
		        dataType: "json",
		        data: {
		        	"resultMap.school_id":school_id,
		        	"resultMap.school_name":school_name,
		        	"resultMap.school_campus":school_campus,
		        	"resultMap.pioneer_name":pioneer_name,
		        	"resultMap.pioneer_phone":pioneer_phone,
		        	"resultMap.pioneer_level":level,
		        	"resultMap.parent_node":parent_node,
		        	"resultMap.pioneer_class":pioneer_class
			    },success: function(data) {
			    	
			    },
			    err: function() {}
			});
		},
		cancel: true
	});
}

function addPioneer(){
	var url = $("#ctx").val()+"/portal/schoolManagement/jsp/add_school_pioneer.jsp";
	art.dialog.open(url,{
		title: "添加团长",
		width: 500,
        height: 250,
		lock: true,
		fixed: true,               
		ok: function () {
			var school_id = art.dialog.data("school_id");
			var school_name = art.dialog.data("school_name");
			var school_campus = art.dialog.data("school_campus");
			var pioneer_name = art.dialog.data("pioneer_name");
			var pioneer_phone = art.dialog.data("pioneer_phone");
			var pioneer_class = art.dialog.data("pioneer_class");
			if(!(isPone(pioneer_phone))){
				alert("不是一个正确的电话号码！");
				return;
			}
			if(school_id==''||school_id==null||school_id==undefined){
				alert("学校名称错误！");
				return;
			}
			if(pioneer_name==''||pioneer_name==null||pioneer_name==undefined){
				alert("姓名不能为空！");
				return;
			}
			if(pioneer_class==''||pioneer_class==null||pioneer_class==undefined){
				alert("班级不能为空！");
				return;
			}
			$.ajax({
				type: "POST",
		        url: $("#ctx").val()+"/school/school-pioneer!addHead.action",
		        dataType: "json",
		        data: {
		        	"resultMap.school_id":school_id,
		        	"resultMap.school_name":school_name,
		        	"resultMap.school_campus":school_campus,
		        	"resultMap.pioneer_name":pioneer_name,
		        	"resultMap.pioneer_phone":pioneer_phone,
		        	"resultMap.pioneer_class":pioneer_class
			    },success: function(data) {
			    	$("#list").treegrid('reload');
			    },
			    err: function() {}
			});
		},
		cancel: true
	});
}

//判断是否为手机号  
function isPone (pone) {  
  var reg=/^1\d{10}$/;  
  if (reg.test(pone)) {  
    return true;  
  } else {  
    return false;  
  }  
}