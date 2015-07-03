/**
 * @author dengxianwei
 */
//添加滚轮事件
$.fn.extend({
	mousewheel:function(Func){
		return this.each(function(){
			var _self = this;
		    _self.D = 0;//滚动方向
			if($.browser.msie||$.browser.safari){
			   _self.onmousewheel=function(){_self.D = event.wheelDelta;event.returnValue = false;Func && Func.call(_self);};
			}else{
			   _self.addEventListener("DOMMouseScroll",function(e){
					_self.D = e.detail>0?-1:1;
					e.preventDefault();
					Func && Func.call(_self);
			   },false); 
			}
		});
	}
});

$.fn.extend({
	jscroll:function(j){
		return this.each(function(){
			j = j || {}
			j.Bar = j.Bar||{};//滚动条属性
			j.Btn = j.Btn||{};//滚动条按钮属性
			j.Bar.Bg = j.Bar.Bg||{};//滚动条滚轴背景
			j.Bar.Bd = j.Bar.Bd||{};//滚动滚轴边框颜色
			j.Btn.Bg = j.Btn.Bg||{};//上按钮背景
			var jun = { W:"15px"
						,Bg:"#FFFFFF"
						,Bar:{  Pos:"default"
								,Bd:{Out:"#B5B5B5",Hover:"#A4A4A4"}
								,Bg:{Out:"#E2EAFF",Hover:"#D1D9EE",Focus:"#C0C8DD"}}
						,Btn:{  btn:true
								,Bg:{Out:"#CCCCCC",Hover:"#CCCCCC",Focus:"AAAAAA"}}
						,Fn:function(){}}
			j.W = j.W||jun.W;
			j.Bg = j.Bg||jun.Bg;
				j.Bar.Pos = j.Bar.Pos||jun.Bar.Pos;
					j.Bar.Bd.Out = j.Bar.Bd.Out||jun.Bar.Bd.Out;
					j.Bar.Bd.Hover = j.Bar.Bd.Hover||jun.Bar.Bd.Hover;
					j.Bar.Bg.Out = j.Bar.Bg.Out||jun.Bar.Bg.Out;
					j.Bar.Bg.Hover = j.Bar.Bg.Hover||jun.Bar.Bg.Hover;
					j.Bar.Bg.Focus = j.Bar.Bg.Focus||jun.Bar.Bg.Focus;
				j.Btn.btn = j.Btn.btn!=undefined?j.Btn.btn:jun.Btn.btn;
					j.Btn.Bg.Out = j.Btn.Bg.Out||jun.Btn.Bg.Out;
					j.Btn.Bg.Hover = j.Btn.Bg.Hover||jun.Btn.Bg.Hover;
					j.Btn.Bg.Focus = j.Btn.Bg.Focus||jun.Btn.Bg.Focus;
			j.Fn = j.Fn||jun.Fn;  //获取所需属性的
			var _self = this;
			
			$(_self).css({overflow:"hidden",position:"relative",padding:"0px"});
			var dw = $(_self).width(), dh = $(_self).height();//获取div的长度和宽度
			var sw = j.W ? parseInt(j.W) : 21; //滚动条的宽度
			var sl = dw - sw;//除去滚动条宽度之后的宽度，即内容的宽度
			var aa = dh - sw;//除去滚动条宽度之后的宽度，即内容的高度
			var bw = j.Btn.btn==true ? sw : 0;//是否显示箭头按钮
			if($(_self).children(".jscroll-c").height()==null){
				//添加内容框(div)
				$(_self).wrapInner("<div class='jscroll-c' style='top:0px;z-index:9999;zoom:1;position:relative;'></div>");
		//		$(_self).children(".jscroll-c").prepend("<div style='height:0px;overflow:hidden'></div>");
				//添加竖向滚动条
				$(_self).append("<div class='jscroll-e' unselectable='on' style='height:100%;top:0px;right:0;-moz-user-select:none;position:absolute;overflow:hidden;z-index:10000;'><div class='jscroll-u'></div><div class='jscroll-h'  unselectable='on' style=''></div><div class='jscroll-d' style='position:absolute;bottom:0px;width:100%;left:0;overflow:hidden'></div></div>");
				//添加横向滚动条
				//$(_self).append("<div class='jscroll-s' unselectable='on' style='width:96%;bottom:0px;left:0;-moz-user-select:none;position:absolute;overflow:hidden;z-index:10000;'><div class='jscroll-l' style='position:absolute;bottom:0px;height:100%;left:0;background:blue;overflow:hidden'></div><div class='jscroll-g' unselectable='on' style='height:100%;background:green;position:absolute;left:0;-moz-user-select:none;border:1px solid'></div><div class='jscroll-r' style='position:absolute;bottom:0px;height:100%;right:0;background:blue;overflow:hidden'></div></div>");
			}
			var jscrollc = $(_self).children(".jscroll-c");
			
			var jscrolle = $(_self).children(".jscroll-e");
			var jscrollu = jscrolle.children(".jscroll-u");
			var jscrollh = jscrolle.children(".jscroll-h");
			var jscrolld = jscrolle.children(".jscroll-d");
			
			var jscrolls = $(_self).children(".jscroll-s");
			var jscrolll = jscrolls.children(".jscroll-l");
			var jscrollg = jscrolls.children(".jscroll-g");
			var jscrollr = jscrolls.children(".jscroll-r");
			
		//	if($.browser.msie){document.execCommand("BackgroundImageCache", false, true);}//解决ie6下的图片缓存问题
			//定义内容的css
		//	jscrollc.css({"padding-right":sw,"padding-bottom":sw});
			//定义竖向滚动条的css
			jscrolle.css({width:sw,background:j.Bg});
			jscrollh.css({top:bw,width:sw});
	//		jscrollh.css({top:bw,background:j.Bar.Bg.Out,"background-image":j.BgUrl,width:sw-2});
			jscrollu.css({height:bw});
			jscrolld.css({height:bw});
			//定义横向滚动条的css
			jscrolls.css({height:sw,background:j.Bg});
			jscrollg.css({left:bw,background:j.Bar.Bg.Out,"border":j.Bar.Bd.Out,height:sw-2});
			jscrolll.css({width:bw,background:j.Btn.Bg.Out});
			jscrollr.css({width:bw,background:j.Btn.Bg.Out});
	
			//获取div中内容实际的长度和宽度
			var sch = jscrollc.height();
			var bb = jscrollc.width();
			//根据div实际内容的长度和宽度决定 要不要显示滚动条
			var curT = 0,allowS=false,curV = 0,allowT = false;
			var Stime,Ttime,Sp=0,Tp=0,Isup=0,Isleft=0;
			if(sch<=dh){
				jscrollc.css({padding:0});
				jscrolle.css({display:"none"});
				jscrolls.css({width:"100%"});
			}else{
				jscrolle.css({display:"block"});
				allowS=true;
			}
			if(bb<=dw){
				jscrollc.css({padding:0});
				jscrolls.css({display:"none"});
				jscrolle.css({height:"100%"});
			}else{
				jscrolls.css({display:"block"});
				allowT=true;
			}
			//至少有一个滚动条显示了，但是X或者Y 的长度小于 Height-bw
			if(allowS && !allowT){
				if(bb>dw-bw){
					jscrolls.css({display:"block",width:"96%"});
					jscrolle.css({height:"100%"});
					allowT = true;
				}
			}
			if(!allowS && allowT){
				if(sch>dh-bw){
					jscrolle.css({display:"block",height:"96%"});
					jscrolls.css({width:"96%"});
					allowS = true;
				}
			}
			//如果当前没有一个滚动条显示出来，那么内容div应该还原
			if(!allowS && !allowT){
				jscrollc.css({left:"0px",top:"0px"});
			}
			//计算滑块的大小
			var sh = 0;
			var cc = 0;
			if(allowS && allowT){
				sh=(dh-3*bw)*(dh-bw) / sch;
				cc=(dw-3*sw)*(dw-sw) / bb;
				
			}else if(allowS && !allowT){
				sh=(dh-2*bw)*dh / sch;
			}else if(!allowS && allowT){
				cc=(dw-2*sw)*dw / bb;
			}
			sh = parseInt(sh);
			cc = parseInt(cc);
			if(sh<10){sh=10;}
			if(cc<10){cc=10;}
			jscrollh.height(sh);
			jscrollg.width(cc);
			//滚动时候跳动幅度
			var wh = sh/20;
			var dd = cc/20;
			//处理鼠标经过时滚动条各个部分颜色变化
			jscrollh.hover(function(){
				if(Isup==0)
					$(this).css({"border-color":j.Bar.Bd.Hover});
			},function(){
				if(Isup==0)
					$(this).css({"border-color":j.Bar.Bd.Out});
			});
			jscrollu.hover(function(){
				if(Isup==0)$(this).css({});
			},function(){
				if(Isup==0)
					$(this).css({});
			});
			jscrolld.hover(function(){
				if(Isup==0)
					$(this).css({});
			},function(){
				if(Isup==0)
					$(this).css({})
			});
			jscrollg.hover(function(){
				if(Isleft==0)
					$(this).css({"border-color":j.Bar.Bd.Hover});
			},function(){
				if(Isleft==0)
					$(this).css({"border-color":j.Bar.Bd.Out});
			});
			jscrolll.hover(function(){
				if(Isleft==0)$(this).css({});
			},function(){
				if(Isleft==0)
					$(this).css({});
			});
			jscrollr.hover(function(){
				if(Isleft==0)
					$(this).css({});
			},function(){
				if(Isleft==0)
					$(this).css({})
			});
			//如果默认 初始位置不是顶端，这个模块摒弃这个功能
/*			if(j.Bar.Pos!="default"){
			curT=dh-sh-bw;//滚动条空白区域大小
			setT();
			}
*/			
			//竖向滚动条事件绑定
			jscrollh.bind("mousedown",function(e){
				j['Fn'] && j['Fn'].call(_self);
				Isup=1;
				jscrollh.css({})//按下滚动条时背景图片
				var pageY = e.pageY ,t = parseInt($(this).css("top"));
				$(document).mousemove(function(e2){
					 curT =t+ e2.pageY - pageY;//pageY浏览器可视区域鼠标位置，screenY屏幕可视区域鼠标位置
						setT();
				});
				$(document).mouseout(function(){
					Isup=0;
					jscrollh.css({})
					$(document).unbind();
				});
				$(document).mouseup(function(){
					Isup=0;
					jscrollh.css({})
					$(document).unbind();
				});
				return false;
			});
			jscrollu.bind("mousedown",function(e){
			j['Fn'] && j['Fn'].call(_self);
				Isup=1;
				jscrollu.css({})
				_self.timeSetT("u");
				$(document).mouseup(function(){
					Isup=0;
					jscrollu.css({})
					$(document).unbind();
					clearTimeout(Stime);
					Sp=0;
				});
				$(document).mouseout(function(){
					Isup=0;
					jscrollu.css({})
					$(document).unbind();
					clearTimeout(Stime);
					Sp=0;
				});
				return false;
			});
			jscrolld.bind("mousedown",function(e){
			j['Fn'] && j['Fn'].call(_self);
				Isup=1;
				jscrolld.css({})
				_self.timeSetT("d");
				$(document).mouseup(function(){
					Isup=0;
					jscrolld.css({})
					$(document).unbind();
					clearTimeout(Stime);
					Sp=0;
				});
				$(document).mouseout(function(){
					Isup=0;
					jscrolld.css({})
					$(document).unbind();
					clearTimeout(Stime);
					Sp=0;
				});
				return false;
			});
			//横向滚动条事件绑定
			jscrollg.bind("mousedown",function(e){
			j['Fn'] && j['Fn'].call(_self);
				Isleft=1;
				jscrollg.css({background:j.Bar.Bg.Focus})
				var pageX = e.pageX ,t = parseInt($(this).css("left"));
				$(document).mousemove(function(e2){
					 curV =t+ e2.pageX - pageX;
						setV();
				});
				$(document).mouseout(function(){
					Isleft=0;
					jscrollg.css({background:j.Bar.Bg.Out,"border-color":j.Bar.Bd.Out})
					$(document).unbind();
				});
				$(document).mouseup(function(){
					Isleft=0;
					jscrollg.css({background:j.Bar.Bg.Out,"border-color":j.Bar.Bd.Out})
					$(document).unbind();
				});
				return false;
			});
			jscrolll.bind("mousedown",function(e){
			j['Fn'] && j['Fn'].call(_self);
				Isleft=1;
				jscrolll.css({background:j.Btn.Bg.Focus})
				_self.timeSetT("l");
				$(document).mouseup(function(){
					Isleft=0;
					jscrolll.css({background:j.Btn.Bg.Out})
					$(document).unbind();
					clearTimeout(Ttime);
					Tp=0;
				});
				$(document).mouseout(function(){
					Isleft=0;
					jscrolll.css({background:j.Btn.Bg.Out})
					$(document).unbind();
					clearTimeout(Ttime);
					Tp=0;
				});
				return false;
			});
			jscrollr.bind("mousedown",function(e){
			j['Fn'] && j['Fn'].call(_self);
				Isleft=1;
				jscrollr.css({background:j.Btn.Bg.Focus})
				_self.timeSetT("r");
				$(document).mouseup(function(){
					Isleft=0;
					jscrollr.css({background:j.Btn.Bg.Out})
					$(document).unbind();
					clearTimeout(Ttime);
					Tp=0;
				});
				$(document).mouseup(function(){
					Isleft=0;
					jscrollr.css({background:j.Btn.Bg.Out})
					$(document).unbind();
					clearTimeout(Ttime);
					Tp=0;
				});
				return false;
			});
			
			//值设定 
			_self.timeSetT = function(d){
				var self=this;
				if(d=="u"){
					curT-=wh;
				}else if(d=="d"){
					curT+=wh;
				}else if(d=="l"){
					curV-=dd;
				}else{
					curV+=dd;
				}
				if(d=="u"||d=="d"){
					setT();
					Sp+=2;
				}
				else{
					setV();
					Tp+=2;
				}
				var t1 =500 - Sp*50;
				var t2 =500 - Tp*50;
				if(t1<=0){t1=0};
				if(t2<=0)t2=0;
				if(d=="u"||d=="d")Stime = setTimeout(function(){self.timeSetT(d);},t1);
				else Ttime = setTimeout(function(){self.timeSetT(d);},t2);
			}
			//滚动条空白处事件
			jscrolle.bind("mousedown",function(e){
					j['Fn'] && j['Fn'].call(_self);
							curT = curT + e.pageY - jscrollh.offset().top - sh/2;
							asetT();
							return false;
			});
			function asetT(){				
						if(curT<bw){curT=bw;}
						if(curT>dh-sh-bw){curT=dh-sh-bw;}
						jscrollh.stop().animate({top:curT},100);
						var scT = -((curT-bw)*sch/(dh-2*bw));
						jscrollc.stop().animate({top:scT},1000);
			};
			jscrolls.bind("mousedown",function(e){
					j['Fn'] && j['Fn'].call(_self);
							curV = curV + e.pageX - jscrollg.offset().left - cc/2;
							asetV();
							return false;
			});
			function asetV(){				
						if(curV<bw){curV=bw;}
						if(curV>dw-cc-bw){curV=dw-cc-bw;}
						jscrollg.stop().animate({left:curV},100);
						var scV = -((curV-bw)*bb/(dw-2*bw));
						jscrollc.stop().animate({left:scV},1000);
			};
			//用于滚动条定位的
			function setT(){				
						if(curT<bw){curT=bw;}
						var scT =0;
						if(allowS && allowT){
							if(curT>dh-sh-2*bw){curT=dh-sh-2*bw;}
							scT = -((curT-bw)*sch/(dh-3*bw));
						}else if(allowS && !allowT){
							if(curT>dh-sh-bw){curT=dh-sh-bw;}
							scT = -((curT-bw)*sch/(dh-2*bw));
						}else if(!allowS && allowT){
							if(curT>dh-sh-bw){curT=dh-sh-bw;}
							scT = -((curT-bw)*sch/(dh-2*bw));
						}
						jscrollh.css({top:curT});
						jscrollc.css({top:scT});
			};
			function setV(){				
						if(curV<bw){curV=bw;}
						var scV =0;
						if(allowS && allowT){
							if(curV>dw-cc-2*bw){curV=dw-cc-2*bw;}
							scV =  -((curV-bw)*bb/(dw-3*bw));
						}else if(allowS && !allowT){
							if(curV>dw-cc-bw){curV=dw-cc-bw;}
							scV =  -((curV-bw)*bb/(dw-2*bw));
						}else if(!allowS && allowT){
							if(curV>dw-cc-bw){curV=dw-cc-bw;}
							scV =  -((curV-bw)*bb/(dw-2*bw));
						}
						jscrollg.css({left:curV});
						jscrollc.css({left:scV});
			};
			$(_self).mousewheel(function(){
					if(allowS!=true) return;
					j['Fn'] && j['Fn'].call(_self);
						if(this.D>0){curT-=wh;}else{curT+=wh;};
						setT();
			})

		});
	}
});