$(function() {
	var schoolName = $("#schoolName").val();
	$("#school_name").val(schoolName);
	
	$("#pioneer_name").change(function(){
    	artDialog.data("pioneer_name", $("#pioneer_name").val());
    });
    $("#pioneer_phone").change(function(){
    	artDialog.data("pioneer_phone", $("#pioneer_phone").val());
    });
    $("#pioneer_class").change(function(){
    	artDialog.data("pioneer_class", $("#pioneer_class").val());
    });
});