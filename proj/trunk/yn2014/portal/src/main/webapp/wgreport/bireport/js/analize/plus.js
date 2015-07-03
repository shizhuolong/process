/****************
 * 常用插件
 */
/**
 * 居中
 */
( function($) {
	/**
	 * jquery center插件
	 */
	$.fn.center = function(f) {   
	    return this.each(function(){   
	        var p = f===false?document.body:this.parentNode;   
	        if ( p.nodeName.toLowerCase()!= "body" && $.css(p,"position") == 'static' )   
	            p.style.position = 'relative';   
	        var s = this.style;   
	        s.position = 'absolute';   
	        if(p.nodeName.toLowerCase() == "body")   
	            var w=$(window);   
	        if(!f || f == "horizontal") {   
	            s.left = "0px";   
	            if(p.nodeName.toLowerCase() == "body") {   
	                var clientLeft = w.scrollLeft() - 10 + (w.width() - parseInt($.css(this,"width")))/2;   
	                s.left = Math.max(clientLeft,0) + "px";   
	            }else if(((parseInt($.css(p,"width")) - parseInt($.css(this,"width")))/2) > 0)   
	                s.left = ((parseInt($.css(p,"width")) - parseInt($.css(this,"width")))/2) + "px";   
	        }   
	        if(!f || f == "vertical") {   
	            s.top = "0px";   
	            if(p.nodeName.toLowerCase() == "body") {   
	                var clientHeight = w.scrollTop() - 10 + (w.height() - parseInt($.css(this,"height")))/2;   
	                s.top = Math.max(clientHeight,0) + "px";   
	            }else if(((parseInt($.css(p,"height")) - parseInt($.css(this,"height")))/2) > 0)   
	                s.top = ((parseInt($.css(p,"height")) - parseInt($.css(this,"height")))/2) + "px";   
	        }   
	    });   
	};  
	
	/* 拖动插件 
	 * @see ui.draggable
	 */
	$.fn.DssDrag = function(options){
		var $handle;
		var self = this;
		if(options&&options.handle){
			$handle = $(options.handle,this);
		}else{
			$handle = $(this);
		}
		$handle.css('cursor','move');
		return this.draggable(options);
	};
})(jQuery);


/**
 * 浮动层
 */
( function($) {
	var Layer = $.Layer = function(el, options) {
		this.el = el;
		this.options = $.extend({},this.options, options);
		// 创建tabs
		this.init();
	};
	var uid = 0;
	function wrapId(id){
		return id+'-'+uid;
	}
	// 扩展原型
	$.extend(Layer.prototype, {
		layer :null,
		el :null,
		showOne:false,
		options : {
			container:null,
			initShow:true,// 初始化后是否直接显示
			// 函数
			onclose : function(event) {
			},
			oncreate : function(event) {
			},
			onshow : function(event) {
			},
			onhide : function(event) {
			},
			position :null,

			// html
			title :"",
			content :"",
			// css
			containerClass :'dssLayer',
			titleClass :'dssLayer-title',
			contentClass :'dssLayer-content',
			closeClass :'dssLayer-close',

			// 不需变
			_id :'dssLayer',
			_titleid :'dssLayer-title',
			_contentid :'dssLayer-content',
			_closeid :'dssLayer-close'
		},
		init : function() {
			var opt = this.options;
			opt._id = wrapId(opt._id);
			opt._titleid = wrapId(opt._titleid);
			opt._contentid = wrapId(opt._contentid);
			opt._closeid = wrapId(opt._closeid);
			uid++;
			
			this.createLayer();
			this.bindEvents();
			if(opt.initShow)
				this.show();
		},
		getLayer : function() {
			return this.layer;
		},
		createLayer : function() {
			var opt = this.options;
			var s = [];
			s.push('<div id="' ,opt._id ,'" class="' ,opt.containerClass,'">');
			s.push('<iframe class="layerframe" frameborder="0"/>');
			s.push('<div class="layermain">');
			s.push('<div id="' ,opt._titleid ,'" class="' ,opt.titleClass ,'">' ,
					'<div id="',opt._titleid,'_name"></div>', 
					'<div id="', opt._closeid , '" class="' , opt.closeClass, '"></div>',
					'</div>',
					'<div id="' , opt._contentid, '" class="' , opt.contentClass , '">',
					'</div>');
			s.push('</div>');
			s.push('</div>');
			var $layer = $(s.join('')).hide();
			
			
			$(opt.container||document.body).append($layer);
			this.layer = $layer.get(0);
			// 设入标题
			$(this.getTitle()).html(opt.title);
			// 设入内容
			$(this.getContent()).html(opt.content);
			// 拖动支持
			$(this.getLayer()).DssDrag({handle:"div#"+opt._titleid});
			this.oncreate();
		},

		bindEvents : function() {
			var self = this, opt = this.options;
			$('#' + opt._closeid, self.layer).click( function(event) {
				self.close(event);
			}).mouseover( function() {
				$(this).css('cursor', 'pointer');
			});
		},
		oncreate : function(event) {
			var self = this;
			this.widHeight(500, 300);
			/*
			 * 调用创建后的函数
			 */
			this.call(this.options.oncreate, event);
		},
		open : function() {
			var opt = this.options;
			this.call(opt.onopen);
			$(this.layer).show();
		},
		close : function(event) {
			var opt = this.options;
			this.call(opt.onclose, event);
			this.hide();
		},
		show : function(func) {
			var self = this;
			$(this.layer).show('fast', function() {
				if(!self.showOne){
					self.css();
					self.position();
					self.showOne = true;
				}else{
					self.css();
				}
				self.call(func);
			});
			self.call(self.options.onshow);
		},
		hide : function(func) {
			var self = this;
			$(this.layer).hide('fast', function() {
				self.call(func);
			});
			self.call(self.options.onhide);
		},
		remove : function() {
			this.call(this.options.onremove);
			$(this.layer).remove();
			if(this.el)
				this.el.layer = null;
			this.el = null;
			this.layer = null;
		},
		call : function(func, event) {
			var result = null;
			if ($.isFunction(func))
				result = func.apply(this, [ event || window.event ]
						.concat(Array.prototype.slice.call(arguments, 2)));
			return result;
		},
		css:function(){
			var self = this;
			var $layermain = $('.layermain',self.layer);
			var $iframe = $('.layerframe',self.layer);
			var $layer = $(self.layer);
			width = $layermain.width()+2;
			height = $layermain.height()+2;
			$iframe.attr('width',width);
			$iframe.attr('height',height);
			$layer.width(width);
			$layer.height(height);
		},
		widHeight:function(width,height){
			var $layermain = $('.layermain',this.layer);
			var $content = $(this.getContent());
			var $title = $(this.getTitle());
			
			
			width = $.isNumber(width)?width+'px':width;
			height = $.isNumber(height)?height+'px':height;
			// set width
			if(width){
				$title.width(width);
				$content.width(width);
			}
			// set height
			if(height){
				$layermain.height(height);
			}
			this.css();
		},
		position : function() {
			var position = this.options.position;
			if ($.isFunction(position))
				this.call(position);
			else {
				this.positionNative();
			}
			this.call(this.options.onposition);
		},
		positionNative : function() {
			var offset = $(this.el).offset();
			$(this.layer).css( {
				top :offset.top,
				left :offset.left
			});
		},
		center : function(cssOption) {
			var self = this;
//			setTimeout(function(){
				$(self.layer).center(false);
//			},10);
		},
		getEl : function() {
			return this.el;
		},
		getLayer : function() {
			return this.layer;
		},
		getTitle : function() {
			return $('#' + this.options._titleid+"_name", this.layer).get(0);
		},
		setTitle :function(html){
			var $title = $(this.getTitle());
			if($.isFunction(html))
				html.call(this,$title);
			else
				$title.html(html);
		},
		setContent:function(html){
			var $content = $(this.getContent());
			if($.isFunction(html))
				html.call(this,$content);
			else
				$content.html(html);
		},
		getContent : function() {
			return $('#' + this.options._contentid, this.layer).get(0);
		}
	});

	$.fn.Layer = function(options) {
		options = options || {};
		return this.each( function() {
			new Layer(this, options);
		});
	};
})(jQuery);
/**
 * 多选框 onCertain:点击确定时的回调函数 onCancel:点击取消时的回调函数
 */
( function($) {
	var SelectLayer = $.SelectLayer = function(el, options) {
		this.el = el;
		this.options = $.extend({},this.options, this.optionsExtend,options);
		// 创建tabs
		this.init();
	};
	$.fn.SelectLayer = function(options) {
		options = options || {};
		return this.each( function() {
			new SelectLayer(this, options);
		});
	};
	// 继承Layer
	$.inherits(SelectLayer, $.Layer);
	// 扩展
	$
			.extend(
					SelectLayer.prototype,
					{
						cache:null,
						optionsExtend : {
							title :'&nbsp;',
							content :'&nbsp;',
							contentClass:'ana_select_content',
							// class
							tableClass :'ana_select'
						},
						show:function(func){
							this.parent.show.call(this,func);
							var $content = $(this.getContent());
							var sfrom = $('#selectFrom', $content).html();
							var sto = $('#selectTo', $content).html();
							this.cache = {sfrom:sfrom,sto:sto};
						},
						oncreate : function(event) {
							/*
							 * 调用创建后的函数
							 */
							this.call(this.options.oncreate, event);
						},
						/**
						 * 重置选项数据 参数: data 为全集 selected 为选中项的code
						 */
						resetData : function(data, selected) {
							this.widHeight(560);
							function button(id, value) {
								return '<span><input id="'
										+ id
										+ '" type="button" class="ana-button" value="'
										+ value + '"/></span>';
							}
							function select(id) {
								return '<div class="select"><span class="select"><select class="multiple" id="' + id + '" multiple ></select></span></div>';
							}
							function moveOptionTo(from, to, context, all) {
								var sFrom = $(from, context);
								var sTo = $(to, context);
								if (all)
									sTo.append(sFrom.find('option:visible'));
								else {
									sTo.append(sFrom.find('option:visible:selected'));
								}
							}
							function moveUp(selectDom, context) {
								var sel = $(selectDom,context);
							    var so = $("option:visible:selected",sel);
							    if(so.size()){
							      so.each(function(){
							          $(this).prev('option:visible').before($(this));
							      });
							    }
							}
							function moveDown(selectDom, context){
								var sel = $(selectDom,context);
								var alloptions = $("option:visible",sel);
							    var so = alloptions.filter(":selected");
							    
							    if(so.size()&&so.get(so.length-1).index!=alloptions.length-1){
							      for(var i=so.length-1;i>=0;i--)
							      {
							        var item = $(so.get(i));
							        item.insertAfter(item.next());
							      }
							    }

							}
							var $content = $(this.getContent());
							var s = [];
							s
									.push(
											'<table class="',
											this.options.tableClass,
											'">',
											'<tr><td>',
											'<input class="ana-input ana-input-match" id="matchFrom" type="text" />',
											// 左选框
											select('selectFrom'),
											'</td><td align="center">',
											// 中间按钮
											button('addAll', '全部添加'),
											'<br/><br/>',
											button('add', '添加'),
											'<br/><br/>',
											button('remove', '删除'),
											'<br/><br/>',
											button('removeAll', '全部删除'),
											'</td><td>',
											'<input class="ana-input ana-input-match" id="matchTo" type="text" />',
											// 右选框
											select('selectTo'),
											'</td><td align="center">',
											// 右边按钮
											button('up', '上移'),
											'<br/><br/>',
											button('down', '下移'),
											'</td><tr>',
											'<tr><td colspan="4" align="center">',
											// 底部按钮
											button('certain', '确定'),
											button('cancel', '取消'),
											'</td><tr>', '</table>');
							
							// 展示
							$content.html(s.join(''));
							// 根据data,selected构建显示内容框
							var optsHtml = null;
							if($.isArray(data)){// array形式,需要构建options
								var opts = [];
								$.each(data, function() {
									var value = $.trim(this[0]);
									var text = $.trim(this[1]);
									opts.push('<option value="', value,
											'" title="', text, '">', text,
											'</option>');
								});
								optsHtml = opts.join('');
							}else{// 直接是html的形式
								optsHtml = data;
							}
							$('#selectFrom', $content).append(optsHtml);
							// 选中默认项
							if ($.isArray(selected)&&selected.length) {
								selected = $.map(selected, function(o) {
									return '[value=' + o + ']';
								});
								$('#selectFrom option', $content).filter(
										selected.join(',')).appendTo(
										$('#selectTo', $content));
							}
							/* 注入事件 */
							var self = this;
							function matchEvent(event) {
								// 捕获enter code事件
								var code = event.keyCode||event.which;
								if(code==13){
									var $selects = $(this).parent().find('select');
									var value = $.trim(this.value);
									// 显示所有选项
									$selects.children().each(function(){
										$.showOption(this);
									});
									if(value!='')
										$selects.children().each(function(i,o){
											if(!$.containsRegex(o.text,value)){
												$.hideOption(o);
											}
										});
								}
								return false;
							}
							$('input[id^=match]', $content).each(function(event){
								var dom = this;
								var doMatch = null;
								$(dom).keypress(function(){
									if(doMatch){
										// 取消上一次调用
										clearTimeout(doMatch);
									}
									doMatch = setTimeout(function(){
										doMatch = null;
										matchEvent.call(dom,event);
									},500);
								});
							});
							// 鼠标事件
							// 全部添加事件
							$('#addAll', $content).click(
									function(event) {
										moveOptionTo('#selectFrom',
												'#selectTo', $content, true);
									});
							// 添加事件
							$('#add', $content).click(
									function(event) {
										moveOptionTo('#selectFrom',
												'#selectTo', $content, false);
									});
							// 删除事件
							$('#remove', $content)
									.click(
											function(event) {
												moveOptionTo('#selectTo',
														'#selectFrom',
														$content, false);
											});
							// 全部删除事件
							$('#removeAll', $content).click(
									function(event) {
										moveOptionTo('#selectTo',
												'#selectFrom', $content, true);
									});
							// 上移事件
							$('#up', $content).click( function(event) {
								moveUp('#selectTo', $content);
							});
							// 下移事件
							$('#down', $content).click( function(event) {
								moveDown('#selectTo', $content);
							});
							// 确定事件
							$('#certain', $content).click(
									function(event) {
										var res = [];
										var matchDom = $('#matchTo'.$content);
										matchDom.val('');
										matchEvent.call(matchDom,event);
										$('#selectTo option', $content)
												.each( function() {
													res.push( {
														value :this.value,
														text :this.text
													});
												});
										self.certain(event, res);
									});
							// 取消事件
							$('#cancel', $content).click( function(event) {
								self.cancel(event);
							});
							// 关闭
							$('#' + self.options._closeid, self.layer)
							.unbind('click')
							.click( function(event) {
								self.cancel(event);
							});
						},
						clearMatch:function(){
							var $content = $(this.getContent());
							$('input[id^=match]', $content).each(function(){
								var $this = $(this);
								if(!$.isNullStr($this.val()))
									$this.val('').keyup();
							});
						},
						/**
						 * 取消，关闭
						 */
						cancel : function(event) {
							this.call(this.options.oncancel, event);
							this.close(event);
							var $content = $(this.getContent());
							var cache = this.cache;
							$('#selectFrom', $content).html(cache.sfrom);
							$('#selectTo', $content).html(cache.sto);
							$('input[id^=match]', $content).val('');
						},
						positionNative : function() {
							this.center();
						},
						/**
						 * 确定,关闭
						 */
						certain : function(event, res) {
							this.clearMatch();
							var result = this.call(this.options.oncertain, event, res);
							if(result!=false){
								this.close(event);
							}
						}
					});
})(jQuery);
/*
 * 表格
 */
( function($) {
	var htmlProperty = $.htmlProperty;
	function tag(tagName, data, properties) {
		var s = [];
		s.push('<', tagName);
		if (properties)
			$.each(properties, function(p, o) {
				s.push(htmlProperty(p, o));
			});
		s.push('>');
		s.push(data);
		s.push('</', tagName, '>');
		return s.join('');
	}
	var Tables = $.Tables = function(options) {
		this.options = $.extend({},this.options, options);
		this.init();
	};
	// 扩展方法
	$.extend(Tables.prototype, {
		options : {
			// 数据
			head :null,
			data :null,
			foot :null,
			evenClass:'even',
			oddClass:'odd',
			hoverClass:'hover',
			clickClass:'selected',
			container:null,
			// 排序函数:function(flag,num,callback) flag:标识(defualt/asc/desc),num:最后一行标题的列序号,
			// 若isOrderDelay=true,则callback在函数里必须被调用,否则不能正常使用排序(因需要延迟更改效果)。callback无参数
			// 若函数存在,则支持最后一行标题的点击,否则点击无效
			orderCallback:null,
			isOrderDelay:false,
			defualtOrders:[],// [[1,'default'],[2,'asc'],[3,'desc'],...]
			orderClickClass:'order-column-click',
			// class
			tableClass :'table-normal'
		},
		headCount:0,// 标题 行数
		max :1000,
		init : function() {
		},
		call : function(func, event) {
			var result = null;
			if ($.isFunction(func))
				result = func.apply(this, [ event || window.event ]
						.concat(Array.prototype.slice.call(arguments, 2)));
			return result;
		},
		render:function(){
			var opt = this.options;
			var $dom = $(this.renderTableHtml());
			var result = $dom.get(0);
			var $alltrs = $('tr',$dom);
			var headMaxIndex = this.headCount?this.headCount-1:0;
			var flags = ['default','asc','desc'];
			// 处理标题
			// 列排序(最后一行标题)
			if($.isFunction(opt.orderCallback)){
				var $orderColumn = null;
				var $orderHead = $alltrs.filter(':eq('+headMaxIndex+')').find('>th');
				function addClickClass($column){
					if(!$column.hasClass(opt.orderClickClass))
						$column.addClass(opt.orderClickClass);
				}
				$orderHead.each(function(index,o){
					var $column = $(this);
					this.title = '可点击排序';
					var defaultOrder = opt.defualtOrders.get(function(){
						return this[0] == index;
					});
					var flagIndex = 0;
					if(defaultOrder){
						flagIndex = flags.indexOf(defaultOrder[1]);
						if(flagIndex==-1){
							flagIndex = 0;
						}else{
							$orderColumn = $column;
						}
					}
					
					$column.addClass('order-column-'+flags[flagIndex]);// 为所有的column添加order-column-default类
					var len = flags.length;
					// 填入order div
					$column
					.click(function(){
						if($orderColumn!=$column){// 处理上一个order column样式
							flagIndex = 1;
							if($orderColumn)// 移除上次orderColumn的clickClass
								$orderColumn.removeClass();
						}else{
							flagIndex++;
							if(flagIndex>len-1)
								flagIndex = 0;
						}
						addClickClass($column);
						// 调用orderCallback
						var flag = flags[flagIndex];
						opt.orderCallback.call($dom,flag,index);
					});

					
				});
			}
			// 处理数据
			//var $trs = $alltrs.filter(':gt('+headMaxIndex+')');
			var $trs = $('tbody tr',$dom);
			if($trs.size()){
				if(opt.evenClass)
					$trs.filter(':even').addClass(opt.evenClass);
				if(opt.oddClass)
					$trs.filter(':odd').addClass(opt.oddClass);
				if(opt.hoverClass){
					$trs.mouseover(function(){
						$(this).addClass(opt.hoverClass);
					}).mouseout(function(){
						$(this).removeClass(opt.hoverClass);
					});
				}
				if(opt.clickClass){
					$trs.click(function(){
						$(this).toggleClass(opt.clickClass);
					});
				}
			}
			this.call(opt.oncreate);
			return result;
		},
		renderTableHtml : function() {
			var opt = this.options;
			return [ '<table class="', opt.tableClass, '">',
					this.renderHeadHtml(), this.renderBodyHtml(),
					this.renderFootHtml(), '</table>' ].join('');
		},
		renderHeadHtml : function() {
			var self = this;
			var head = this.options.head;
			var s = [];
			s.push('<thead>');
			function render(array) {
				if ($.typeOf(array) != 'array' || array.length == 0)
					return '';
				self.headCount++;// 行数+1
				// 修改最大长度
				self.max = array.length;
				// 下一行数据
				var next = [];
				var hasnext = false;
				var sd = $.map(array, function(o) {
					var result;
					if ($.typeOf(o) == 'array') {
						if (o.length > 1 && $.typeOf(o[1]) == 'array'
								&& o[1].length > 0) {
							hasnext = true;
							next = next.concat(o[1]);
							result = tag('th', o[0], {
								colspan :o[1].length,
								align:'center'
							});
						} else {
							next.push('');
							result = tag('th', o[0],{
								align:'center'
							});
						}
					} else {
						next.push('');
						result = tag('th', o,{
							align:'center'
						});
					}
					return result;
				});
		return '<tr>'+sd.join('')+'</tr>' + (hasnext ? render(next) : '');
	}
	s.push(render(head));
	s.push('</thead>');
	return s.join('');
},
renderBodyHtml : function() {
	var s = [];
	var max = this.max - 1;
	s.push('<tbody>');
	$.each(this.getData(), function(index) {
		s.push('<tr>');
		$.each(this, function(index, o) {
			if (index > max)
				return false;
			var tdAttr = {
				align:'left'	
			}, data;
			if (o == null) {
				tdAttr.align = 'center';
				data = '';
			} else if ($.isNumber(o)) {
				tdAttr.align = 'right';
				data = o;
			} else{
				if(o.attr){
					data = o.data;
					if(data == null){
						tdAttr.align = 'center';
						data = '-';
					}else if($.isNumber(data))
						tdAttr.align = 'right';
					tdAttr = $.extend(tdAttr,o.attr);
				}else
					data = o;
			}
			// 放入td
			s.push(tag('td', data, tdAttr));
		});
		s.push('</tr>');
	});
	
	s.push('</tbody>');
	return s.join('');
},
renderFootHtml : function() {
//	var s = [];
//	s.push('<tfoot>');
//	s.push('</tfoot>');
//	return s.join('');
	return '';
},
/**
 * 绑定事件
 */
bindEvents : function() {

},
/**
 * 设置头 参数: head array数组,元素为 [当前名称,其涵盖的子行array]或者是 当前名称 示例:[['收入类',[...]],...]
 */
setHead : function(head) {
	this.options.head = head;
},
/**
 * 设置数据 参数: data array数组,元素为 array [o1,o2,o3,...],每个元素表示一行数据
 */
setData : function(data) {
	this.options.data = data;
},
/**
 * 获得数据
 */
getData : function() {
	return this.options.data;
}
	});
})(jQuery);

/*
 * 字段配置
 */
( function($) {
	function button(id, value) {
		return '<span><input id="' + id
				+ '" type="button" class="ana-button" value="' + value
				+ '"/></span>';
	}
	var FieldLayer = $.FieldLayer = function(el, options) {
		this.el = el;
		this.options = $.extend({},this.options, this.optionsExtend,options);
		// 创建tabs
		this.init();
	};
	$.fn.FieldLayer = function(options) {
		options = options || {};
		return this.each( function() {
			new FieldLayer(this, options);
		});
	};
	// 继承Layer
	$.inherits(FieldLayer, $.Layer);
	$
			.extend(
					FieldLayer.prototype,
					{
						// 当前选中的值
						currents : [],
						// 扩展配置
						optionsExtend : {
							title :'&nbsp;',
							content :'&nbsp;',
							defaults : [],// 默认选中的id数组
							data :null
						// columns
						// array,示例[{id:'...',name:'中文名称',child:[columns,...]}]
						},
						oncreate : function(event) {
							this.renderContent();
							this.widHeight(600,'auto');
							/*
							 * 调用创建后的函数
							 */
							this.call(this.options.oncreate, event);
						},
						/**
						 * 渲染内容
						 */
						renderContent : function() {
							var $content = $(this.getContent());
							var s = [];
							s
									.push('<div id="column_tree" class="column_tree ana-scroll"></div>');
							s
									.push(
											'<div id="column_tree_buttons" class="column_tree_buttons">',
											button('selectAll', '全选'), button(
													'cancelAll', '反选'), button(
													'defChecked', '默认'),
											button('certain', '确定'), button(
													'cancel', '取消'), '</div>');
							$content.html(s.join(''));
							var container = $('#column_tree', $content);
							var buttons = $('#column_tree_buttons', $content);

							// 构建选项(非树状)
							this.renderFlat(container, buttons);
							// 构建选项(树状)
							// this.renderTree(container,buttons);
							this.buttonEvents(container,buttons);
							this.checkDefaults();// 选中默认 ids
							this.currents = this.options.defaults;
							
							
							// 构建树
							// var tree = new
							// dhtmlXTreeObject(container.get(0),"100%","100%",0);
							// tree.loadJSONObject(this.getTreeData());
						},
						renderFlat : function(container, buttons) {
							var arr = this.getFlatData(this.options.data);
							var d = [];
							var temp;
							if(arr&&arr.length>0){
								$
										.each(
												arr,
												function(index, o) {
													if (index % 4 == 0) {
														temp = [];
														d.push(temp);
													}
													temp
															.push('<input name="_check" class="checkbox" type="checkbox" value="'
																	+ o.id
																	+ '">'
																	+ o.name);
												});
								var tbl = new $.Tables( {
									data :d,
									head :null
								});
								container.html(tbl.renderTableHtml());
							}
						},
						renderTree : function(container, buttons) {
							var d = this.getTreeData(this.options.data);
						},
						/**
						 * 绑定事件
						 */
						buttonEvents : function(container, buttons) {
							var self = this;
							$(':button', buttons).css('cursor', 'pointer');
							$('#selectAll', buttons).click(
									function() {
										$(':checkbox[name=_check]', container)
												.attr('checked', true);
									});
							$('#cancelAll', buttons).click(
									function() {
										$(':checkbox[name=_check]', container)
												.attr('checked', false);
									});
							$('#defChecked', buttons).click( function() {
								self.checkDefaults(container);
							});
							$('#certain', buttons).click(
									function(event) {
										var checkeds = [];
										$(':checkbox[name=_check]:checked',
												container).each( function() {
											checkeds.push(this.value);
										});
										self.currents = checkeds;
										self.certain(event, self.currents);
									});
							$('#cancel', buttons).click( function(event) {
								self.cancel(event);
							});
						},
						/**
						 * 选中默认项
						 */
						checkDefaults : function(container) {
							this.check(container, this.options.defaults);
						},
						check : function(container, ids) {
							if (!$.isArray(ids))
								return;
							var nids = $.clone(ids,true);
							$(':checkbox[name=_check]', container).each(
									function() {
										if (nids.contains(this.value)){
											nids.remove(this.value);
											this.checked = true;
										}else
											this.checked = false;
									});
						},
						/**
						 * 获得平行展示的数据,[obj,obj,...],若obj中有child则取其child中objs
						 */
						getFlatData : function(data) {
							return $.transFlatData(data);
						},
						/**
						 * 获得树状展示的数据
						 */
						getTreeData : function(data) {
							var result = null;
							return result;
						},
						/**
						 * 内部position
						 */
						positionNative : function() {
							var el = $(this.el);
							var layer = $(this.layer);
							var offset = el.offset();
							this.center( {
								top :offset.top
								//left :offset.left + el.width() - layer.width()
							});
						},
						show : function(func) {
							var $content = $(this.getContent());
							var container = $('#column_tree', $content);
							this.check(container, this.currents);
							this.parent.show.call(this, func);
						},
						/**
						 * 取消，关闭
						 */
						cancel : function(event) {
							this.call(this.options.oncancel, event);
							this.close(event);
						},
						/**
						 * 确定,关闭
						 */
						certain : function(event, res) {
							var result = this.call(this.options.oncertain, event, res);
							if(result!=false){
								this.close(event);
							}
						}
					});
})(jQuery);


/**
 * 分页操作面板,
 * el节点提供定位使用
 */
(function($){
	function button(id, value) {
//		return '<span><input id="' + id
//				+ '" type="button" class="ana-button" value="' + value
//				+ '"/></span>';
		return ['<span id="',id,'" class="page-img-button" title="',value,'">',
		        '</span>'].join('');
	}
	function input(id,value,title){
		return ['<span><input type="text" class="input" id="',id,'" value="',value,'" title="',title||'','"/></span>'].join('');
	}
	
	var PageLayer = $.PageLayer = function(el,options){
		this.el = el;
		this.options = $.extend({},this.options,options);
		this.init();
	};
	$.fn.PageLayer = function(options){
		return $(this).each(function(){
			new PageLayer(this,options);
		});
	};
	$.extend(PageLayer.prototype,{
		el:null,
		layer:null,
		page:1,
		current:1,// 当前页数
		total:1,// 总页数
		options:{
			count:0,// 总条数
			limit:0, // 每页条数
			page:-1,// 当前页数
			
			//functions
			go:function(opts){},
			oncreate:function(){},
			onshow:function(){},
			onhide:function(){},
			onremove:function(){},
			warn:function(info){alert(info);}
		},
		init:function(){
			this.create();
			this.show();
		},
		create:function(){
			var opt = this.options;
			var $layer = $('<div id="page-layer"></div>').appendTo(this.el||document.body);
			this.layer = $layer.get(0);
			this.reset();
			// 调用options中的oncreate函数
			this.call(opt.oncreate);
		},
		bindEvents:function(){
			var self = this;
			var opt = this.options;
			if(!opt.limit)return;
			var $layer = $(this.layer);
			function bHover(){
				$(this).toggleClass('hover');
			}
			$('.page-img-button',this.layer).mouseover(function(){
				$(this).addClass('hover');
			}).mouseout(function(){
				$(this).removeClass('hover');
			});
			self.getById('first').click(function(){
				self.go(1);
			});
			self.getById('prev').click(function(){
				self.go(self.current-1);
			});
			self.getById('next').click(function(){
				self.go(self.current+1);
			});
			self.getById('last').click(function(){
				self.go(self.total);
			});
			self.getById('goInput').keypress(function(event){
				// enter key
				if(event.keyCode==13){
					var val = $(this).val();
					if($.isNullStr(val))return false;
					val = parseInt(val);
					if(!val)return false;
					self.go(val);
				}
			});
			
		},
		// 转向到页面
		go:function(page){
			var self = this;
			var opt = this.options;
			if(page<1)
				page = 1;
			else if(page>self.total)
				page = self.total;
			if(self.current==page){
				return;
			}
			this.flush(page);
		},
		// 刷新数据
		flush:function(page){
			var self = this;
			var opt = this.options;
			self.current = page;
			var first = opt.limit*(page-1);// 第一条
			self.call(opt.go,{
				page:page,
				first:first,
				limit:opt.limit,
				callback:function(){
					self.getById('goInput').val(page);
					self.getById('current-page').text(page);
				}
			});
		},
		// 刷新当前页
		reflush:function(){
			var page = this.current<1?
					1:(this.current>this.total?
							this.total:this.current);
			this.flush(page);
		},
		/**
		 * 警告消息
		 */
		warn:function(info){
			this.call(this.options.warn,info);
		},
		getById:function(id){
			return $('#'+id,this.layer);
		},
		getLayer:function(){
			return this.layer;
		},
		show:function(){
			$(this.layer).show();
			// 调用options中的onshow函数
			this.call(this.options.onshow);
		},
		hide:function(){
			$(this.layer).hide();
			// 调用options中的onhide函数
			this.call(this.options.onhide);
		},
		remove:function(){
			$(this.layer).remove();
			// 调用options中的onremove函数
			this.call(this.options.onremove);
		},
		reset:function(options){
			this.options = $.extend({},this.options,options);
			var opt = this.options;
			var _page = parseInt(this.options.page);
			if(_page>0){
				this.page = _page;
			}else{
				this.page = 1;
			}
			
			this.current = opt.count?this.page:0;
			this.total = opt.count?1:0;
			var hasPage = opt.limit&&opt.limit<opt.count;
			var s = [];
			s.push('<div id="page-count">');
			s.push('<span>共',opt.count,'条</span>');
			if(hasPage){
				var page = parseInt(opt.count/opt.limit);
				if(opt.count%opt.limit)
					this.total = 1+page;
				else 
					this.total = page;
				s.push(
				'<span><i id="current-page">',this.current,'</i>/',this.total,'页</span>'
				//,'<span>每页',opt.limit,'条</span>'
				);
			}
			s.push('</div>');
			if(hasPage)
				s.push('<div id="page-button">',
				button('first','首页'),
				button('prev','上一页'),
				input('goInput',this.current,'转到'),
				button('next','下一页'),
				button('last','尾页'),
				'<span class="clear"/>',
				'</div>'
				);
			s.push('<span class="clear" ></span>');
			$(this.layer).html(s.join(''));
			if(hasPage)
				this.bindEvents();
		},
		/**
		 * 函数调用
		 */
		call:function(callback){
			var result = null;
			if ($.isFunction(callback))
				result = callback.apply(this,Array.prototype.slice.call(arguments, 1)||[]);
			return result;
		}
	});
})(jQuery);

/**
 * 消息显示控件
 */
(function($){
	var Message = $.Message = function(options){
		this.options = $.extend({
			message:null,
			container:document.body,
			layerClass:'messages'
		},options);
		this.init();
	};
	$.extend(Message.prototype,{
		queue:null, /* message 队列 */// 对象属性不能在定义是初始化,否则在new时,多个实例的属性会指向同一个对象实例
		layer:null,
		index:0,
		updateTimeout:null,
		init:function(){
			this.queue = [];
			this.create();
			this.add(this.options.message);
		},
		/**
		 * 添加消息
		 */
		add:function(message){
			if(message){
				this.queue.push(message);
				// 添加完消息马上显示,即将index置为最后一个
				this.index = this.queue.length - 1;
				this.update();
			}
		},
		/**
		 * 移除一条消息
		 */
		remove:function(message){
			var self = this;
			setTimeout(function(){
				self.queue.remove(message);
				self.update();
			},500);
		},
		/**
		 * 创建显示层
		 */
		create:function(){
			var opt = this.options;
			var $layer = $([
			     '<div id="MessageLayer" style="display:none;" class="',opt.layerClass,'" >',
			     '</div>'
			 ].join(''));
			$layer.appendTo(opt.container);
			this.layer = $layer.get(0);
		},
		/**
		 * 展示显示层
		 */
		show:function(){
			$(this.layer).show();
		},
		hide:function(){
			$(this.layer).hide();
		},
		/**
		 * 更新消息
		 */
		update:function(){
			if(this.updateTimeout){
				clearTimeout(this.updateTimeout);
			}
			var self = this;
			var len = this.queue.length;
			if(!len){
				this.hide();return;
			}
			if(this.index>=len){// 到达最后,置为开始
				this.index = 0;
			}
			var message = this.queue[this.index++];
			$(this.layer).html(message);
			this.show();
			// 隔3秒显示下一条消息
//			this.updateTimeout = setTimeout(function(){
//				self.update();
//			},3000);
		}
	});
})(jQuery);

