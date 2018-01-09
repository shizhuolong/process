$(function() {
	
    $( "#serachText" ).autocomplete({
        source:function(request,response){
		    $.ajax({
		    	type: "POST",
		        url: $("#ctx").val()+"/school/school-manager!listSchoolName.action",
		        dataType: "json",
		        data: {
		          rowNum: 10,
		          schoolName: request.term
		        },
		        success: function( data ) {
		        	if(data!=null&&data!=""){
		        	response( $.map( data, function( item ) {
		                return {
		                  label: item.SCHOOL_NAME+"("+item.CAMPUS+")",
		                  value: item.SCHOOL_NAME,
		                  id:item.ID
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
        	$("#uuid").val(ui.item.id);
        }   
    });
    
    $("#secachBtn").click(function(){
    	var uuid = $("#uuid").val();
    	var url = $("#ctx").val()+"/school/school-manager!findSchoolByID.action";
    	$.ajax({
    		url:url,
    		type:"POST",
    		dataType:"json",
    		data:{
    			id:uuid
    		},
    		success:function(data){
    			var data = eval(data);
    			var south_lng = data.SOUTH_LNG;
    			var south_lat = data.SOUTH_LAT;
    			var east_lng = data.EAST_LNG;
    			var east_lat = data.EAST_LAT;
    			var north_lng = data.NORTH_LNG;
    			var north_lat = data.NORTH_LAT;
    			var west_lng = data.WEST_LNG;
    			var west_lat = data.WEST_LAT;
    			var schoolName = data.SCHOOL_NAME;
    			map.clearOverlays();  //清除地图上所有覆盖物
    			var south = addPoint(south_lng,south_lat);
    			var east = addPoint(east_lng,east_lat);
    			var north = addPoint(north_lng,north_lat);
    			var west = addPoint(west_lng,west_lat);
    			/*var polygon = new BMap.Polygon([south,east,north,west],
    			{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
    			map.addOverlay(polygon);*/
    			var errMessage = "";
    			if(south==null){
    				errMessage+="南经纬度为空 ";
    			}
    			if(east==null){
    				errMessage+="东经纬度为空 ";
    			}
    			if(north==null){
    				errMessage+="北经纬度为空 ";
    			}
    			if(west==null){
    				errMessage+="西经纬度为空 ";
    			}
    			if(errMessage!=""){
    				alert(schoolName+": "+errMessage);
    			}
    		}
    	});
    });
});

function addMarker(point){
	var marker = new BMap.Marker(point);
	map.centerAndZoom(point, 15);
	map.addOverlay(marker);
}

function addPoint(lng,lat){
	if(typeof(lng) == "undefined"||typeof(lat) == "undefined"){
		return null;
	}	
	var point = new BMap.Point(lng,lat);
	addMarker(point);
	return point;
}

