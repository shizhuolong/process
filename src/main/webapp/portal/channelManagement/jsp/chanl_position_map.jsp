<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%
	String log=(String) request.getParameter("log");
	String lat=(String) request.getParameter("lat");

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>渠道位置</title>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=LoQz3WDvhfXEVMZ53qowzIQP"></script>
<!-- script type="text/javascript" src="<%=request.getContextPath()%>/portal/index/js/index.js"></script-->

</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="log" value="<%=log%>">
	<input type="hidden" id="lat" value="<%=lat%>">
	<div  style="width:510px;height:300px;overflow:visible;">
		<div id="mapcontent" style="width:100%;height:100%;"></div>
	</div>
	<script type="text/javascript">
         $(function(){
        	 var log=$("#log").val();
        	 var lat=$("#lat").val();
        	 showChanlMap(log,lat);     
         });
         function showChanlMap(log,lat) {
        		var zsIcon = new BMap.Icon($("#ctx").val()+"/portal/index/images/location16.png", new BMap.Size(16,
        				16), {
        			offset : new BMap.Size(8, 8),
        			imageOffset : new BMap.Size(0, 0)
        		});
        		var map = new BMap.Map("mapcontent");
        		map.centerAndZoom(new BMap.Point(log, lat),15);
        		map.enableScrollWheelZoom();
        		var bdary = new BMap.Boundary();
        		bdary.get("云南省", function(rs) {
        			var count = rs.boundaries.length;
        			for (var i = 0; i < count; i++) {
        				var ply = new BMap.Polygon(rs.boundaries[i], {
        					strokeWeight : 2,
        					strokeColor : "#bfff00",
        					fillOpacity : 0.3,
        					fillColor : "#ba3f90"
        				}); //建立多边形覆盖物
        				map.addOverlay(ply);
        			}
        		});
        		

        	/*	var regions = [ "昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "普洱市", "临沧市",
        				"文山壮族苗族自治州 ", "红河哈尼族彝族自治州", "西双版纳", "楚雄彝族自治州", "大理白族自治州", "德宏",
        				"怒江傈僳族自治州", "迪庆藏族自治州" ];
        		for (var i = 0; i < regions.length; i++) {
        			bdary.get(regions[i], function(rs) {
        				var count = rs.boundaries.length;
        				for (var i = 0; i < count; i++) {
        					var ply = new BMap.Polygon(rs.boundaries[i], {
        						strokeWeight : 2,
        						strokeColor : "#bfff00",
        						fillOpacity : 0.3,
        						fillColor : "#ba3f90"
        					}); // 建立多边形覆盖物
        					map.addOverlay(ply);
        				}
        			});
        		}*/
        		
        		setInterval(function() {$(".anchorBL").hide();}, 50);
        		
        		
        		
        		if(log&&lat){
        			var pt = new BMap.Point(log,
							lat);
					var marker = new BMap.Marker(pt/*,{icon:zsIcon}*/);
					marker.addEventListener('click',function(e){
						var p=e.target;
						var lon=p.getPosition().lng;
						var lat=p.getPosition().lat;
						
						$.ajax({
							type : "POST",
							dataType : 'json',
							async : true,
							cache : false,
							url : $("#ctx").val()+"/index/index_getChanlPosition.action",
							data:{
								lat:lat,
								log:lon
							},
							success : function(chanl) {
								if(!chanl||chanl.length<=0) return;
								chanl=chanl[0];
								var h="<table>";
								h+="<tr>";
								h+="  <td style='width:60px;'>名称：</td><td>"+chanl["GROUP_ID_4_NAME"]+"</td>"
								h+="</tr>";
								h+="<tr>";
								h+="  <td>编码：</td><td>"+chanl["HQ_CHAN_CODE"]+"</td>"
								h+="</tr>";
								h+="<tr>";
								h+="  <td>地址：</td><td>"+chanl["CHNL_ADDR"]+"</td>"
								h+="</tr>";
								h+="</table>";
							
								var point = new BMap.Point(lon,lat);
								var opts = {
										title : "渠道信息" , // 信息窗口标题
										enableMessage:false//设置允许信息窗发送短息
								};
								var infoWindow = new BMap.InfoWindow(h,opts);  // 创建信息窗口对象 
								map.openInfoWindow(infoWindow,point); //开启信息窗口
								$('.chanlImg').onload = function (){
									infoWindow.redraw();
								}
							}
						});
					});
					map.addOverlay(marker);
        		}
        	}
    </script>
</body>
</html>