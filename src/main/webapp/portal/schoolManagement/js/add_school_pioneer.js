$(function() {
    $( "#school_name" ).autocomplete({
        source:function(request,response){
		    $.ajax({
		    	type: "POST",
		        url: $("#ctx").val()+"/school/school-pioneer!listSchool.action",
		        dataType: "json",
		        data: {
		          schoolName: request.term
		        },
		        success: function( data ) {
		        	if(data!=null&&data!=""){
		        	response( $.map( data, function( item ) {
		                return {
		                  label: item.SCHOOL_NAME,
		                  value: item.SCHOOL_NAME,
		                  id:item.ID,
		                  campus:item.CAMPUS
		                }
		              }));
		        	}
		        }
		    });
        },
        minLength: 2,
        delay: 200,
        select: function( event, ui ) { // 选中某项时执行的操作
            // 存放选中选项的信息 
        	$("#school_id").val(ui.item.id);
        	$("#school_campus").val(ui.item.campus);
        }   
    });
    
    $("#school_name").change(function(){
    	artDialog.data("school_name", $("#school_name").val());
    	artDialog.data("school_id", $("#school_id").val());
    	artDialog.data("school_campus", $("#school_campus").val());
    });
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