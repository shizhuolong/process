var maxWidth="";
var isScroll=false;
var modiLeft;

var topmenu = "";
var scroll = "";

var targetx = 200;//一次滚动距离
var dx;
var a=null;

$(function(){

	
	UI_select();
	mutiSelect();
	
	
	quick_lunch();
	quickAutosize();
	topMenu();
	
	if($(".menu li#index").hasClass("on")){
		$(".nav-panel").hide();
		$(".work-content").css("margin-left","0px")
	}
	
	$(".right-btn ul li").hover(
		function(){$(this).parent().find(".on").removeClass("on");$(this).addClass("on")},
		function(){$(this).removeClass("on")}
	)
	
	$(".table-normal tr").hover(
		function(){$(this).addClass("hover")},
		function(){$(this).removeClass("hover")}
	)
	
	$("#con-close").click(				 
		function(){ $(this).parent().parent().hide()}
	)
	$("#con-open").click(				 
		function(){ $(this).next().show()}
	)
	
	$("#layout-2").click(				 
		function(){
			$(".nav-panel").show();
			$(".work-content").css("margin-left","200px")
		}
	)
	$("#layout-1").click(				 
		function(){
			$(".nav-panel").hide();
			$(".work-content").css("margin-left","0px")
		}
	)
	$("#scroll").mousedown(function(evt){
		isScroll=true;
		evt=(evt)?evt:((window.event)?window.event:null);
		if(evt.offsetX){
			modiLeft=parseInt(evt.offsetX)
		}else{
			modiLeft=parseInt(evt.layerX)
		}
	});
	document.mouseup=function(){
		isScroll=false;
	}
	document.mousemove=function(evt){
		evt=(evt)?evt:((window.event)?window.event:null);
		var scrollBar = document.getElementById(scrollBar);
		if(evt && isScroll){
			scroll.style.left=parseInt(evt.clientX)-parseInt(scrollBar.offsetLeft)-modiLeft+"px";
			if(parseInt(scroll.style.left)<0){scroll.style.left=0+"px"}
			if(parseInt(scroll.style.left)>570){scroll.style.left=570+"px"}
			topmenu.scrollLeft=parseInt(scroll.style.left)*((maxWidth-600)/570);
		}
	}
	
});

function initMenu(){
	topmenu = document.getElementById("top_menu");
	scroll = document.getElementById("scroll");
	maxWidth=topmenu.getElementsByTagName("ul")[0].getElementsByTagName("li").length*105;
}
function moveLeft(){
	
	var le=parseInt(topmenu.scrollLeft);
	if(le>200){
		targetx=parseInt(topmenu.scrollLeft)-200;
	}else{
		targetx=parseInt(topmenu.scrollLeft)-le-1
	}
	scLeft();
}
function moveRight(){
	var le=parseInt(topmenu.scrollLeft)+200;
	var maxL=maxWidth-600;
	if(le<maxL){
	targetx=parseInt(topmenu.scrollLeft)+200;
	}
	else{targetx=maxL}
	scRight();
}
function scLeft(){

	dx=parseInt(topmenu.scrollLeft)-targetx;
	topmenu.scrollLeft-=dx*.3;
	scroll.style.left=parseInt(topmenu.scrollLeft)*(570/(maxWidth-600))+"px";
	if(parseInt(scroll.style.left)<0){scroll.style.left=0+"px"}
	if(parseInt(scroll.style.left)>570){scroll.style.left=570+"px"}
	clearScroll=setTimeout(scLeft,50);
	if(dx*.3<1){clearTimeout(clearScroll)}
}
function scRight(){
	
	dx=targetx-parseInt(topmenu.scrollLeft);
	topmenu.scrollLeft += dx*.3;
	scroll.style.left=parseInt(topmenu.scrollLeft)*(570/(maxWidth-600))+"px";
//	$("#scroll").attr("style","left:"+parseInt(topmenu.scrollLeft)*(573/(maxWidth-600))+"px");
	if(parseInt(scroll.style.left)<0){scroll.style.left=0+"px"}
	if(parseInt(scroll.style.left)>=570){scroll.style.left=570+"px"}
	a=setTimeout(scRight,50);
	if(dx*.3<1){clearTimeout(a)}
}
function parent_tb_remove() {	
	var p=$(window.parent.document);
	p.find("#TB_imageOff").unbind("click");
	p.find("#TB_closeWindowButton").unbind("click");
	p.find("#TB_window").fadeOut("fast",function(){p.find('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	p.find("#TB_load").remove();
	p.find(".thickboxonshow").removeClass("thickboxonshow");
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		p.find("body","html").css({height: "auto", width: "auto"});
		p.find("html").css("overflow","");
	}
	p.onkeydown = "";
	p.onkeyup = "";
	return false;
}

function mutiSelect(){
	$(".theOptions li input").attr("checked","");
	$(".mutiSelect").click(function(e){
		e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
		$(this).find(".theOptions").slideDown("fast");
		
	})
	$(".theOptions li input").click(function(){
		//alert($(this).val());
		var target=$(this).attr("class");
		//alert(target);
		if($(this)[0].checked){
			//alert("checked");
			$(this).parent().parent().parent().find(".tmp").remove();
			$(this).parent().parent().parent().find(".ct").append("<span class=\""+target+"\">"+$(this).val()+",</span>")
		}
		else{
			//alert("hasnot");
			$(this).parent().parent().parent().find(".ct ."+target).remove();
		}
	})
	$(document).click(function(){
		$(".mutiSelect .theOptions").hide();
	})
}

function UI_select(){
	$(".UI_select").each(function(){
		var ct=$(this).find("ul");
		var title=$(this).find(".UI_select_til");
		ct.click(function(e){
			e=e||window.event;
			e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
		});
		title.click(function(e){
			e=e||window.event;
			e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
		});
		$(document).click(function(){
			ct.hide();
		})
		title.click(function(){
			ct.toggle();
			ct.find("li").click(function(){
				title.html($(this).html());
				ct.hide();
			});
			ct.find("li").hover(function(){$(this).css("background-color","#eee")},function(){$(this).css("background-color","#FEFCE7")});
		})	
	})

}


function autosize(){
	$(".nav-panel").height($(window).height()-$(".top-panel").height());
	//$(".work-content #ifm01").height($(window).height()-$(".top-panel").height());

}





function topMenu(){
	$(".menu li").click(function(){
		
		$(this).parent().find(".on").removeClass("on");
		$(this).addClass("on");
		var menu_id=$(this).attr("id");
		if($(this).attr("id")=="index"){
			$(".nav-panel").hide();
			$(".work-content").css("margin-left","0px")
			$("#ifm01").attr("src",$(this).attr("thelink"));
		}else{
			var t=$("#menu"+menu_id).html();
			             $(".content-panel .nav-panel").empty();
			 $(".content-panel .nav-panel").append(t);
			uid.tree_nav.init();
			$(".content-panel .nav-panel").show();
			            var firstpage=$(".content-panel .nav-panel .tree-content .root").find(".node").get(0);
			var firstlink=($(firstpage).attr("thelink"));
			$(".work-content").css("margin-left","200px");
			    $("#ifm01").attr("src",firstlink);
		
		}
		initMenu();
	})
}


function quick_lunch(){
	$(".quick .quick-til").click(function(e){
		e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
		var ct=$(this).parent().find(".quick-ct");
		if(ct.css("display")!="block"){
			ct.slideDown("fast");
		}
		else{
			ct.slideUp("fast");
		}
	});
	$(document).click(function(){
		$(".quick-ct").slideUp("fast");
		//$(window.parent.document).find(".quick-ct").slideUp("fast");
	})

}

function quickAutosize(){
	
	$(".quick .quick-ct").each(function(){
		if($(this).find("li").length<=0){return}
		$(this).find("li").each(function(){
			$(this).css("width","auto");
			$(this).hover(
				function(){
					$(this).addClass("bg")
				},
				function(){
					$(this).removeClass("bg")
				}
			)
		})
		$(this).css("visibility","hidden").show().width(800);
		
		var tempWidth = $(this).find("li").eq(0).find("a")[0].clientWidth;
		

		$(this).width(tempWidth+20);
		$(this).hide().css("visibility","visible");
		if($(this).find("li").length<=0){$(this).width($(this).parent().find("input").eq(0).width()).height(5)}
		//alert($(this).width());
		var ctwidth=tempWidth;
		$(this).find("li").each(function(){
			$(this).css("width","auto");
			$(this).width(ctwidth);
		})
		var totalH=$(this).find("li").length*24;
		//$(this).find("li").length*24>400?totalH=400:totalH=$(this).find("li").length*24>400;
		if(totalH>400){
			$(this).height(400);
			$(this).css("overflow","auto");
			var w=$(this).width()+38;
			$(this).width(w)
		}
		else{
			//$(this).css("overflow","auto");
			$(this).height(totalH);
		}
		
		
	})
}


/*--flash map--*/
$(function(){
	$("#flash01").attr("width",$(".map_box").width()-$(".value").width()-10).attr("height",$(".value").height()+8);
		$(".root .node").each(function(i){
			$(this).find("span a").attr("tabid","node"+i)
		})
	
})
