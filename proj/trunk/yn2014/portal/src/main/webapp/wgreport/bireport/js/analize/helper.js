function toString(o) {
	return dwr.util.toDescriptiveString(o, 3);
}
/* 
 * 注意:此js不能和engine.js同时使用 
 * 
 */
(function($){
	var _fusionMessages = {
			PBarLoadingText:'加载图形中,请稍后',
			XMLLoadingText:'获取数据中,请稍后',
			ParsingDataText:'正在解析数据,请稍后',
			ChartNoDataText:'没有数据显示',
			RenderingChartText:'正在渲染图形,请稍后',
			LoadDataErrorText:'数据加载错误',
			InvalidXMLText:'xml格式错误'
			};
	var _fusionMessage = (function(msgs){
		var _s = [];
		$.each(_fusionMessages,function(p,o){
			_s.push(p+'='+encodeURI(o));
		});
		return _s.join('&');
	})(_fusionMessages);
	
	// 根据项目配置
	$.Project={
		isLifeRay:false,
		context:'portal',
		CMD:'/jsCmd',
		downURL:'/fileDownload',
		fusioncharts:'/fusioncharts',
		fusionMessage:_fusionMessage,
		LiferayURL:'/html/portlet/ext/dynamic_report',// liferay环境中的放置路径
		CHARTS:'/charts',// 图片访问路径
		rootContext:'',
		servletContext:'',
		resetScorllSize:function (root){
			var $root = $.isString(root)?$('#'+root):$(root);
			$('#comment-button',$root).hide();// 温州特定
			var isLiferay = this.isLifeRay;
			function resize(){
				var $scroll = $('.ana-scrollX',$root);
				$scroll.css('position','absolute');
				setTimeout(function(){
					var width = $root.width();
					$scroll.width(isLiferay?width-1:width-5);
					$scroll.css('position','relative');
				},10);
			}
			if(isLiferay)
				$root.parents('td[id^=column-]:first').bind('navi_menu_resize',resize);
			else{
				$(window).resize(resize);
			}
			resize();
		},
		init:function(){// 初始化函数
			if(this.isLifeRay){
				this.rootContext = this.LiferayURL;
				this.servletContext = '';
			}else{
				this.rootContext = '/'+this.context;
				this.servletContext = this.rootContext;
			}

			this.CMD = this.servletContext+this.CMD;
			this.downURL = this.servletContext+this.downURL;
			this.CHARTS = this.rootContext+this.CHARTS;
			this.fusioncharts = this.rootContext+this.fusioncharts;
		}
	};
	// 初始化
	$.Project.init();
	var CMD = $.Project.CMD;
	/**
	 * 默认函数
	 */
	
	function defaultBeforeSend(request){
		
	}
	function defaultComplete(request,string){
		
	}

	/**
	 * 添加消息 opt:{msg:...,storeDom:...[,layerClass:...]}
	 */
	$.addMessage=function(opt){
		var $Dom = $(opt.storeDom);
		var messageLayer = $Dom.data('messageLayer');
		if(messageLayer){
			messageLayer.add(opt.msg);
		}else{
			var $M = $.Message;
			messageLayer = new $M({
				container:$Dom.get(0),
				layerClass:opt.layerClass||'message'
			});
			messageLayer.add(opt.msg);
			$Dom.data('messageLayer',messageLayer);
		}
	};
	/**
	 * 移除消息 opt:{msg:...,storeDom:...}
	 */
	$.removeMessage=function(opt){
		var $Dom = $(opt.storeDom);
		var messageLayer = $Dom.data('messageLayer');
		if(messageLayer)
			messageLayer.remove(opt.msg);
	};
	
	/**
	 * cmdType:命令类型(参考$.COMMAND说明)
	 * cmdPara:传输到后台的参数 
	 * callback(FUNCTION)：成功后的回调函数,参数为 json data
	 * beforeSend:开始后台交互时执行的函数,参数为 XMLHttpRequest
	 * complete:后台返回后执行的函数,不论是否发生错误,XMLHttpRequest,sucess info
	 */
	$.execute = function(cmdType, cmdPara, callback,beforeSend,complete) {
		if ($.isFunction(cmdPara)) {
			callback = cmdPara;
			cmdPara = null;
		}
		var sendParagram = {
			url:CMD,
			type:'post',
//			timeout:100000,
			cache:true,
			dataType:'json',
			data:{
				cmd :cmdType,
				json :window.encodeURIComponent($.jsonSerialize(cmdPara))
			},
			beforeSend:beforeSend||defaultBeforeSend,
			complete:complete||defaultComplete,
			success:function(data) {
				if ($.isFunction(callback)) {
					try {
						callback.call(this, data);
					} catch (e) {
						alert(e);
					}
				}
			}
		};
		
		$.ajax(sendParagram);
	};
	
	
	
	
	function _execute(type,parameter,callback,msg,storeDom){
		$.execute(type,parameter,callback,function(){
			$.addMessage({msg:msg,storeDom:storeDom});
		},function(){
			$.removeMessage({msg:msg,storeDom:storeDom});
		});	
	}
	// 加载选项
	// 参数：
	// parameter = {queryKey:String(可选),query:String(可选):conditions:Array(可选)}
	// callback:Function(必须,用于渲染返回值)
	// 其中:
	// queryKey(WEB-INF/conf下*.sql中key)和query必须有一
	// query示例:
	//	select [code],[desc],[other其它字段] from table 
	//	where [parent](:字段类型)=? [and ...] [and] [code](:字段类型)=? [and 其它条件] 
	// 	order by [parent...],code
	// conditions = [{value:[String,String,...],
	//	type:String(eq|gt|ge|lt|le|ne|begin_with|end_with|contain,可选,默认eq)}]
	
	function loadSelect(parameter,callback,name,storeDom){
		_execute(3,parameter,callback,'正在加载'+(('['+name+']')||'')+'选项...',storeDom);
	}

	/**
	 * 加载单选项
	 * @param para Map/Array/Function isLocal=true时[[code,desc],...]
	 * @param dom 添加到的节点(Select标签)
	 * @param next 数据加载完成后的调用函数
	 * @param isLocal 是否是本地值，即可直接渲染的值
	 * @param fname 名称取值函数
	 * @param storeDom 进度信息放置节点
	 */ 
	function loadSingleSelect(para,dom,next,isLocal,fname,storeDom){
		var _nameFunc = $.isFunction(fname)?fname:function(){return "";};
		$(dom).each(function(){
			var _this = this;
			var _name = _nameFunc.call(this);
			function _render(res){
				var s = [];
				if(!$.isArray(res)){// 添加请选择项
					res = [];
				}
				res.unshift(['-999999','请选择']);
				$.each(res,function() {
					var value = $.trim(this[0]);
					var text = $.trim(this[1]);
					s.push(
					'<option value="',
					value,
					'" title="',
					text,
					'">',
					text,
					'</option>');
				});
				$(dom).html(s.join(''));
				
				if($.isFunction(next))next();
			}
			//_render();
			var _para = $.isFunction(para)?para.call(_this):para;
			if(isLocal){
				_render(para);
			}else{	
				loadSelect(para,_render,_name,storeDom);
			}
		});
	}

	/**
	 * 加载单选项  没有请选择
	 * @param para Map/Array/Function isLocal=true时[[code,desc],...]
	 * @param dom 添加到的节点(Select标签)
	 * @param next 数据加载完成后的调用函数
	 * @param isLocal 是否是本地值，即可直接渲染的值
	 * @param fname 名称取值函数
	 * @param storeDom 进度信息放置节点
	 */ 
	function loadSingleSelect01(para,dom,next,isLocal,fname,storeDom){
		var _nameFunc = $.isFunction(fname)?fname:function(){return "";};
		$(dom).each(function(){
			var _this = this;
			var _name = _nameFunc.call(this);
			function _render(res){
				var s = [];
				if(!$.isArray(res)){// 添加请选择项
					res = [];
				}
			
				$.each(res,function() {
					var value = $.trim(this[0]);
					var text = $.trim(this[1]);
					s.push(
					'<option value="',
					value,
					'" title="',
					text,
					'">',
					text,
					'</option>');
				});
				$(dom).html(s.join(''));
				
				if($.isFunction(next))next();
			}
//			_render();
			var _para = $.isFunction(para)?para.call(_this):para;
			if(isLocal){
				_render(para);
			}else{	
				loadSelect(para,_render,_name,storeDom);
			}
		});
	}

	/**
	 * 加载多选项
	 * @param para Map/Array/Function isLocal=true时[[code,desc],...]
	 * @param dom 添加到的节点
	 * @param next 数据加载完成后的调用函数
	 * @param isLocal 是否是本地值，即可直接渲染的值
	 * @param fname 名称取值函数
	 * @param storeDom 进度信息放置节点
	 */ 
	function loadManySelect(para,dom,next,isLocal,fname,storeDom){
		var _nameFunc = $.isFunction(fname)?fname:function(){return "";};
		$(dom).each(function(){
			var _dom = $(this);
			_dom.val('全部').attr('readOnly',true);
			var _name = _nameFunc.call(this);
			_dom.SelectLayer({
				title :"请选择 "+_name,
				initShow:false,
				oncreate : function() {
					this.getEl().layer = this;
					this.widHeight(500);
				},
				oncertain : function(event,res) {
					var texts = [];
					var values = [];
					var el = this.getEl();
					$.each(res,function() {
						texts.push(this.text);
						values.push(this.value);
					});
					var _val = texts.join(',');
					if ($.isNullStr(_val)){
						_val = '全部';
						values = null;
					}
					el.value = _val;
					if (!$.equals(el._values,values)) {
						el._values = values;
						el.title = _val;
						// 触发join事件(级联)
						$(el).trigger('join');
					}
				}
			});
			
			_dom.click(function(){
				var _this = this;
				var layer = _this.layer;
				if(_this._load)
					layer.show();
				else{
					var _para = $.isFunction(para)?para.call(_this):para;
					function _render(res) {
							_this._load = true;
							layer.resetData(res,_this.defaults);
							layer.show();
							if($.isFunction(next))next();
					}
					if(isLocal){
						_render(_para);
					}else{	
						loadSelect(_para,_render,_name,storeDom);
					}
				}
			});
		});
	}

	/**
	 * 获取条件
	 * @param _conDom 取值的节点,jQuery语法
	 * @param fname 取名称函数
	 * @param formats Array[页面格式,数据库格式] 日期格式
	 * @param deleteNull 是否空值
	 */
	function _gConditions(_conDom,fname,formats,deleteNull){
		_dom = $(_conDom);
		var _load = true;// 是否加载的阀值
		var _nameFunc = $.isFunction(fname)?fname:function(){return "条件";};
		if(!$.isArray(formats)){
			formats = ['yyyy-MM','yyyyMM'];
		}
		
		var nullValue = deleteNull==true?null:[null];
		// 收集条件
		var _conditions = [];
		_dom.each(function(){
			var $this = $(this);
			var _name = _nameFunc.call(this);
			var _continued = true;
			var tagType = this.type;
			var inputtype = $this.attr('inputtype');
			var validate = $this.attr('validate');
			inputtype = inputtype||'eq';
			var value = null;
			if(this.type=='checkbox'){
				value = this.checked?'1':'0';
			}else if($this.hasClass('ana-input-img')){
				value = this._values;
			}else{
				value = $(this).val();
			}
			
			if($.isArray(value));
			else if($.isNullStr(value)||value=='@null'){
				value = nullValue;
			}else {
				value = $.trim(value);
				// 检测值是否是数字
				if($this.hasClass('Wdate')){
					value = value.toDate(formats[0]).format(formats[1]);
				}else if(validate=='number'&&(!/^\d+(\.\d+)?$/.test(value))){
						_continued = false;
				}
				if(['contain','begin_with','end_with'].contains(inputtype)){
					switch(inputtype){
					case 'contain':
						value = '%'+value+'%';
						break;
					case 'end_with':
						value = value+'%';
						break;
					case 'begin_with':
					default:
						value = '%'+value;
						break;
					}
				}	
				value = [value];
			} 
			
			if(_continued){
				_conditions.push({type:inputtype||'eq',value:value});
			}else{
				alert(_name+'：值应为数值或不填');
				_load = false;
				return false;
			}
		});
		if(!_load)
			_conditions = null;
		return _conditions;
	}
	

	/**
	 * 渲染图形
	 */
	var _fusionchartURL = $.Project.fusioncharts+"/V3/"; 
	var _chartData = $.Project.CHARTS+"/";

	
	function _renderChart(chartSWF,data,dom,width,height,storeDom){
		var $dom = $(dom);
		var _dom = $dom.get(0);
		_execute(0,{type:data._type||5,data:data},function(res){
			var _F = FusionCharts;
			var myChart = new _F(_fusionchartURL+chartSWF+'?'+_fusionMessage, null,
						width||($dom.width()-2), height||($dom.height()-2));
	        myChart.setDataURL(_chartData+res[0]);
	        myChart.render(_dom);
		},'正在刷新图形...',storeDom);
	}

	/**
	 * 渲染数据表
	 */
	function _renderTable(dom,head,data){
		var _dom = $(dom);
		var $T = $.Tables;
		var _T = new $T({
			head:head,
			data:data,
			hoverClass:null,
			clickClass:null
		});
		var _Tdom = _T.render();
		_dom.html(_Tdom);
		return _Tdom;
	}
	
	function _downExcelByTemplate(parameter,callback,alias,storeDom){
		_execute(0,{type:8,data:parameter},function(res){
			var url = [$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(alias)?'':'&alias='+encodeURI(alias+'.xls')].join('');
			// 返回的excel绝对路径
//			window.open(url,'_blank');
			window.location.href = url;
			if($.isFunction(callback))
				callback.call(null,res);
		},'正在下载报表...',storeDom);
	}
	
	function _downExcelByValidation(parameter,callback,alias,storeDom){
		_execute(0,{type:10,data:parameter},function(res){
			var url = [$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(alias)?'':'&alias='+encodeURI(alias+'.xls')].join('');
			// 返回的excel绝对路径
//			window.open(url,'_blank');
			window.location.href = url;
			if($.isFunction(callback))
				callback.call(null,res);
		},'正在下载报表...',storeDom);
	}		function _downExcelByTemplate2(parameter,callback,alias,storeDom){		_execute(0,{type:8,data:parameter},function(res){			var url = [$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(alias)?'':'&alias='+encodeURI(encodeURI(alias+'.xls'))].join('');			// 返回的excel绝对路径//			window.open(url,'_blank');			window.location.href = url;			if($.isFunction(callback))				callback.call(null,res);		},'正在下载报表...',storeDom);	}
	
	
	$.Project.execute = _execute;
	$.Project.loadSelect = loadSelect;
	$.Project.loadSingleSelect = loadSingleSelect;
	$.Project.loadSingleSelect01 = loadSingleSelect01;
	$.Project.loadManySelect = loadManySelect;
	$.Project.getConditions = _gConditions;
	$.Project.renderChart = _renderChart;
	$.Project.renderTable = _renderTable;
	$.Project.downExcelByTemplate = _downExcelByTemplate;
	$.Project.downExcelByValidation = _downExcelByValidation;	$.Project.downExcelByTemplate2 = _downExcelByTemplate2;
})(jQuery);
