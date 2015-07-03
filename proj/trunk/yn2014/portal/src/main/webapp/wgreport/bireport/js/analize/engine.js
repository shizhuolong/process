/************
 * 配置解析引擎
 */
function toString(o) {
	return dwr.util.toDescriptiveString(o, 3);
}
// engine
( function($) { 
	/**
	 * 分析配置,切换到liferay时isLifeRay为true
	 */
	var ANAConf = $.ANAConf = {
		isLifeRay:false,// 是否在liferay环境下
		context:null,// 项目名称
		rootContext:'',
		CMD:'/jsCmd',// js command servlet绝对路径
		FILEPATH:'/html/portlet/report/charts',// 文件下载访问url路径
		DOWNLOAD:'/fileDownload',// 文件下载url,参数:path(文件url路径),
		CHARTS:'/html/portlet/report/charts',// 图片访问路径
		FusionURL:'/html/portlet/report/fusioncharts/V3',
		LiferayURL:'/html/portlet/ext/dynamic_report',// liferay环境中的放置路径
		Images_file:'../css/ana/images-file',
		init:function(context){// 初始化函数
			this.context = context;
			if(this.isLifeRay){
				this.rootContext = this.LiferayURL;
				this.CHARTS = this.LiferayURL+this.CHARTS;
				this.FusionURL = this.LiferayURL+this.FusionURL;
				this.FILEPATH = this.LiferayURL+this.FILEPATH;
			}else{
				this.rootContext = '/'+this.context;
				this.CMD = '/'+this.context+this.CMD;
				this.DOWNLOAD = '/'+this.context+this.DOWNLOAD;
				this.CHARTS = '/'+this.context+this.CHARTS;
				this.FusionURL = '/'+this.context+this.FusionURL;
			}
		}
	};

	var _fusionMessages = {
			PBarLoadingText:'加载图形中,请稍后',
			XMLLoadingText:'获取数据中,请稍后',
			ParsingDataText:'正在解析数据,请稍后',
			ChartNoDataText:'没有数据显示',
			RenderingChartText:'正在渲染图形,请稍后',
			LoadDataErrorText:'数据加载错误',
			InvalidXMLText:'xml格式错误'
			};
	$._fusionMessage = (function(msgs){
		var _s = [];
		$.each(_fusionMessages,function(p,o){
			_s.push(p+'='+encodeURI(o));
		});
		return _s.join('&');
	})(_fusionMessages);
	/*
	 * 自定义错误
	 */
	/**
	 * 条件未初始化完成 参数： errorNum 错误编号 errorMsg 错误信息
	 */
	var UninitializedError = $.UninitializedError = function(errorNum, errorMsg) {
		if ($.isString(errorNum)) {
			errorMsg = errorNum;
			errorNum = null;
		}
		if (errorNum == null)
			errorNum = 1;
		this.ErrorNumber = errorNum;
		this.ErrorMessage = errorMsg;
	};
	/**
	 * 检测初始化状态，若未完成则抛出UninitializedError错误
	 * 检测el节点上的initialized标记，若initialized==false则表示未初始化完成
	 */
	$.checkInitialized = function(el, msg) {
		var flag = $(el).attr('initialized');
		if (flag == 'false') {
			throw new UninitializedError(msg);
		}
	};
	/*
	 * 命令定义
	 */
	$.COMMAND = {
		MENUTITLE :1,// 取当前标题
		DATA :2,// 取数据
		SELECT :3,// 取选项
		USERDATA :4,// 取用户数据(用户方案)
		USERDATAUPDATE:5,// 用户数据更新
		PICTURE:6,// 图形
		LOAD:7, // 下载
		TARGETUSER:8, // 目标客户群
		PERSONAL:9 // 用户个性化
	};

	var trim = $.trim;
	var functions = {};
	
	/**
	 * 默认函数
	 */
	
	function defaultBeforeSend(request){
		
	}
	function defaultComplete(request,string){
		
	}
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
			url:ANAConf.CMD,
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
	$.addInitFunc = function(key, func) {
		functions[key] = func;
	};
	$.getInitFunc = function(key) {
		return functions[key];
	};
	// trim并去除尾部(描述,...)
	$.formatName = function(name){
		//return $.isNullStr(name)?'':name.replace(/描述|处理|^\s+|\s+$/gi,'');
		return $.isNullStr(name)?'':name;
	};
	/**
	 * @param expression,context
	 */
	var templateExpr = $.templateExpr = '[id^=analize_template_]';
	$._ = function(expression, context) {
		context = $(context);
		if (!(context && context.size()))
			return $(expression);
		var ret = $( []);
		context.each( function() {
			var all = $(expression, this);
			var filters = $(templateExpr, this).find(expression);
			ret = ret.add(all.not(filters));
		});
		return ret;
	};
	// 渲染界面
	function render(root, data) {
		// data.templates为每一个实际template的配置数据
		$.each(data.templates, function() {
			// 获取id,templateid,通过templateid即modal执行注册的modal函数
				var template = this;
				var id = template.id;
				var key = template.templateid;
				var func = $.getInitFunc(key);
				if ($.isFunction(func)) {
					var fid = '#' + id;
					var context;
					if(root==id){
						context = $(fid);
					}else{
						context = $._(fid,root);
					}
				// 注册函数调用，
				// 上下文为根据id在$root范围内查找到的节点,
				// 参数为context上下文和配置数据。
				try{
					func.call(context, context, template, data);
				}catch(e){
					alert(e.toLocaleString());
				}
			}
		});
	}

	function resetScorllSize(root){
		var $root = $('#'+root);
		var isLiferay = $.ANAConf.isLifeRay;
		function resize(){
			var $scroll = $('#data.ana-scrollX',$root);
			$scroll.css('position','absolute');
			setTimeout(function(){
				var width = $root.width();
				$scroll.width(isLiferay?width-1:width-5);
				$scroll.css('position','relative');
			},10);
		}
		if(isLiferay)
			$root.parents('td:first').bind('navi_menu_resize',resize);
		else{
			$(window).resize(resize);
		}
		resize();
	}
	$.storeUserdata = function(data,res){
		// 将个性化数据存储进data中,供各个模板使用
		data.userdata = res;
	};
	$.analize = function(root, data) {
		// $.noConflict(true);// 将jQuery,$,让渡给原有的系统
		// 初始化conf
		ANAConf.init(data.appname);
		// 将所有的ana-img-button添加hover
		$(templateExpr+' .ana-img-button').mouseover(function(){
			$(this).addClass('hover');
		}).mouseout(function(){
			$(this).removeClass('hover');
		});

		// 2.加载用户个性化数据
		$.execute($.COMMAND.USERDATA, data.configid, function(res) {
			// 将个性化数据存储进data中,供各个模板使用
			$.storeUserdata(data,res);
			render(root, data);
			resetScorllSize(root);
		});
	};
})(jQuery);

// 对模板操作的公用类
( function($) {
	/**
	 * trim函数,去除字符串两边空格
	 */
	var trim = $.trim;
	var isNullStr = $.isNullStr;
	/**
	 * 初始化函数，供页面组织引擎调用
	 */
	// 模型渲染及对象
	function Template(){}
	$.Template = Template;
	/**
	 * Template对象含下列数据: 变量: context,当前template的节点，后续操作都以此为上下文
	 * template,当前template所需的配置数据 data,当前应用相关的所有配置化数据 函数:
	 * addNOWPosition():添加当前位置 getKeys():获得应用的关键词
	 * getKeyById(keyid)：获得对应keyid的关键词 addKEYS():添加应用的关键词
	 * addConditions():添加当前template的条件 bindEvents():绑定当前template的事件
	 */
	$
			.extend(
					Template.prototype,
					{
						context :null,
						template :null,
						data :null,
						/**
						 * 获取template文档节点的表达式
						 */
						templateExpr :$.templateExpr,
						/**
						 * 调用引擎中的过滤子template中的相同节点
						 * 
						 * expression 查询表达式
						 */
						_ : function(expression, context) {
							return $._(expression, context || this.context);
						},
						init : function() {
							// 初始化默认值对象,提供给系统默认值存储
							this.defualts = {};
							// 绑定当前对象
							$(this.context).data('templateData',this);
							this.initBefore();
							this.addKEYS();
							this.addConditions();
							this.bindEvents();
							this.initPersonal();
							this.initAfter();
						},
						initBefore : function() {},
						initAfter : function() {},
						initPersonal : function() {
							var content = this.getPersonalContent();
							if(content){
								this.setPersonal(content);
							}else{
								this.renderPersonal(this.defualts);
							}
						},
						/**
						 * 将系统默认值存储
						 */
						saveDefaults:function(key,obj){
							this.defualts[key] = obj;
						},
						/**
						 * 设置当前个性化数据
						 * data:方案数据,当前应用的所有个性化数据
						 */
						setPersonal:function(data){
							var d = null;
							if(data){
								var templateId = this.template.id;
								d = data[templateId];
							}
							this.renderPersonal(d);
						},
						/**
						 * 渲染方案数据,子层最好覆盖
						 * data:当前template的数据个性化数据
						 */
						renderPersonal:function(data){
							if(data)
								this.renderCondition(data.conditions);
						},
						getPersonalData:function(){
							var userdata = this.getUserdata();
							var schemes = userdata.schemes;
							var result = null;
							if(schemes){
								result = schemes.personal;
							}
							return result;
						},
						getPersonalContent:function(){
							var personal = this.getPersonalData();
							var result = null;
							if(personal){
								result = personal.content;
							}
							return result;
						},
						/**
						 * 子类不能覆盖,根据flags数组调用相应函数 getPersonal_[flag] 若不存在,则忽略
						 */
						getPersonal:function(flags){
							var self = this;
							var templateId = this.template.id;
							var personal = {};
							var contents = this.getPersonalContent();
							var _contents = (contents)?contents[templateId]:null;
							var defualts = this.defualts;
							$.each(flags,function(i,o){
								var name = o[0];
								if(o[1]){
									var funcName = 'getPersonal_'+name;
									var func = self[funcName];
									if($.isFunction(func))
										personal[name] = func.call(self);
								}else{// 尝试加载上次值,若没有,尝试加载默认值
									if(_contents){
										personal[name] = _contents[name];
									}else{
										personal[name] = defualts[name];
									}
								}
							});
							var re = {};
							re[templateId] = personal;
							return re;
						},
						/**
						 * 获取个性化条件
						 */
						getPersonal_conditions:function(){
							var self = this;
							return this.conditions(null,false,true).map(function(o){
								var def = null;
								if(o.showtype=='hidden'||(o.showtype=='input'&&self.isDateFormat(o.format))){// 对于隐藏值或日期,取系统的默认条件
									def = o.defaultCondition;
								}else 
									def = $.isArray(o.orginValue)?o.orginValue.join(','):o.orginValue;
								return {key:o.metaid,def:def};
							});
						},
						
						/**
						 * 选项注入和条件默认值
						 */
						renderCondition:function(array){
							var condom = this.conditionDom();
							var arr = [];
							if($.isArray(array))
								arr = $.clone(array,true);// 进行克隆,避免影响原有数据
							if(condom){
								$('[showtype]',condom).each(function(){
									var metaid = $(this).attr('metaid');
									var showtype = $(this).attr('showtype');
									var d = null;
									d = arr.get(function(index,o){
									return o&&o.key&&o.key==metaid;
									});
									if(d){// 移除
										arr.remove(d);
										this.def = d.def;
									}
									$(this).trigger('initData',[d]);// 触发初始化函数
								});
							}
						},
						getUserdata:function(){
							return this.data.userdata;
						},
						/**
						 * 取得当前应用所用的关键词
						 */
						getKeys : function() {
							return this.data.keys;
						},
						/**
						 * 取得元数据
						 */
						getMetas : function() {
							return this.data.metas;
						},
						/**
						 * 取得选项
						 */
						getSelects : function() {
							return this.data.selects;
						},
						/**
						 * 通过键值获取数据对象
						 */
						getBy : function(name, value, dataFunc) {
							var result;
							var keys = dataFunc.call(this);
							$.each(keys, function() {
								if (trim(this[name]) == value) {
									result = this;
									return true;
								}
							});
							return result;
						},
						/**
						 * 取得特定id的关键词
						 */
						getKeyById : function(keyid) {
							return this.getBy.call(this, 'meta_id', keyid,
									this.getKeys);
						},
						/**
						 * 取得特定id的元数据
						 */
						getMetaById : function(metaid) {
							return this.getBy.call(this, 'id', metaid,
									this.getMetas);
						},
						/**
						 * 取得特定id的select
						 */
						getSelectById : function(selectid) {
							return this.getBy.call(this, 'id', selectid,
									this.getSelects);
						},
						/**
						 * 构建html属性
						 */
						htmlProperty :$.htmlProperty,
						/**
						 * 添加关键词
						 */
						addKEYS : function() {
							var self = this;
							// 1.配置中是否有关键词？有，渲染，无：将节点隐藏
							var keyids = this.template.keys;
							if (keyids && keyids.length > 0) {// 循环keyids
								var keyDom = self._("#ana-key");
								if(!keyDom.size())return;
								var s = [];
								var tips = [];
								$.each(keyids,
									function() {
										var o = self.getKeyById(this);
										if (!o)
											return true;
										s.push(
											"<a href='javascript:void(0);'>",
											trim(o.meta_name),
											"</a>&emsp;");
										tips.push(o);
									});
								keyDom.html(
										"关键词&nbsp;" + s.join(""));
								// 初始化提示
								$('a',keyDom).each(function(index){
									$(this).tooltip({
										track:true,
									    showURL: false, 
									    opacity: 0.8, 
									    fade: 250 ,
									    bodyHandler:function(){
											var _html = tips[index].meta_des;
											return _html?trim(_html):'无说明';
										}
									});
								});
								// 显示
								keyDom.show();
							}else{
								self._("#ana-key").hide();
							}
						},
						conditionName : function(condition, meta) {
							var name = isNullStr(condition.name) ? meta.cnname
									: condition.name;
							return $.formatName(name);
						},
						renderButton:function(id, value) {
							return '<span><input id="'+id+'" value="'+value
							+'" type="button" class="ana-button"'
							+'/></span>';
						},
						
						/**
						 * 最大、最小化
						 */
						minMax:function(max){
							// 激发父类的最大最小化
							var pTemplate = this.getParent();
							if(pTemplate)
								pTemplate.minMax(max);
						},
						/**
						 * 获取jQuery对象,不存在返回null
						 */
						dom:function(expression,context){
							var dom = this._(expression,context);
							return dom.size()>0?dom:null;
						},
						/**
						 * 获取条件节点的jQuery对象
						 */
						conditionDom:function(){
							return this.dom('#ana-conditions');
						},
						/**
						 * 添加条件
						 */
						addConditions : function() {
							var self = this;
							var conDom = this.conditionDom();
							if(!conDom)
								return false;
							// 每行条件数
							var perTr = this.template.maxSizePerRow||3;	
							// 直接显示的行数
							var trsCNT = 2;
							// 获取条件名称
							var getConditionName = self.conditionName;
							// 根据id获取meta
							var getMetaById = self.getMetaById;
							// 渲染按钮
							var button = self.renderButton;
							// condeition defualts存储
							var defualts = [];
							// 存储条件的默认值对象
							this.saveDefaults('conditions', defualts);
							// 保存默认值到存储对象
							function saveDef(metaid,def){
								defualts.push({key:metaid,def:def});
							}
							/**
							 * 预置属性,提供条件渲染使用
							 */
							function getConditionShow(condition, meta) {
								var r = self.htmlProperty;
								var s = [];
								s.push('<input');
								s.push(r('type','text'));
								s.push(r('style','display:none;'));
								s.push(
										r('metaid', condition.metaid),
										r('showtype', condition.showtype),
										r('defaultCondition', condition.def),
										r('inputtype', condition.inputtype),
										r('selectid', condition.selectid),
										r('format', condition.format),
										r('joinid', condition.joinid),
										r('auth_code', condition.auth_code),// 增加权限限定属性,20100129 add by lanws
										r('conditionName', getConditionName.call(self,
												condition, meta))
										// 附加条件名称，供多选项框等使用
								);
								s.push('/>');
								saveDef(condition.metaid,condition.def);
								return s.join('');
							}
							// 将所有的条件转换为td字符串
							var conditions = self.template.conditions;
							var nArr = [];
							var userdata = this.getUserdata();
							var region_code = userdata.region;// 地市代码
							//alert(region_code);
							var city_code = userdata.city;// 区县代码
							var group_code = userdata.group; //网格代码
							var net_code = userdata.net;
							var cursor = -1;
							
							var auth_region = region_code&&region_code!='-1'?region_code:null;
							var auth_city = city_code&&city_code!='-1'?city_code:null;
							var auth_group = group_code&&group_code!='-1'?group_code:null;
							var auth_net = net_code&&net_code!='-1'?net_code:null;


							function Auth(name,auth){// 是否要限制权限,有返回代码
								if(!auth)return null;
								if(/lnet_code|region_code/i.test(name)){
									return auth_region;
								}else if(/area_code|city_code/i.test(name)){
									return auth_city;
								}else if(/sofc_code/i.test(name)){
									return auth_group;
								}else if(/grid_code/i.test(name)){
									return auth_net;
								}else
									return null;
							}
							$.each(conditions,function(index,o){
								var id = o.metaid;
								var con = getMetaById.call(self, id);
								if (!con)
									return true;
								// 测试权限字段
//								var nauth = Auth(con.name,o.auth);
//								if(nauth!=null){
//									if(o.showtype=='hidden'&&o.def!=nauth)
//										o.def = '-99999';// 不应该有数据
//									else{
//										o.showtype = 'hidden';
//										o.def = nauth;
//									}
//								}
								/*改为权限多值判定20100129 by lanws*/
								var nauth = Auth(con.name,o.auth);
								if(nauth!=null){
									var authArr = nauth.split(',');// nauth多值，以,分隔
									var new_authArr; // 最终的权限限定数据代码数组
									if(o.def){// 有权限限定值
										var defArr = o.def.split(',');// 配置时默认值[def]多值，以,分隔
										// 取authArr和defArr的交集
										new_authArr = $.intersect(authArr,defArr);// 参考common.jquery.js中intersect方法
									}else
										new_authArr = authArr;
									
									var new_authArr_len = new_authArr.length;
									if(new_authArr_len==0){// 无值,不显示
										o.showtype='hidden';
										o.def = o.auth_code = '-99999';// 无数据
									}else if(new_authArr_len==1){// 只有一个数据,不显示,设定值
										o.showtype='hidden';
										o.def = o.auth_code = new_authArr[0];// 设定值
									}else{// 多个值
										o.auth_code = new_authArr.join(',');// 以','分隔
									}
								}
								//////
								var conName = getConditionName.call(self,o,con);
								var conValue = getConditionShow(o, con);
								// 若要隐藏
								if(o.showtype == 'hidden'){
									if(cursor==-1){
										nArr.push({value:conValue});
										cursor++;
									}else{// 叠加到前一个
										nArr[cursor].value += conValue;
									}
								}else{
									// 查看前一个的name是否存在
									if(cursor==-1){// 不存在前一个值
										nArr.push({name:conName,value:conValue});
										cursor++;
									}else if(nArr[cursor].name){// 存在前一个值且存在名称
										nArr.push({name:conName,value:conValue});
										cursor++;
									}else{// 存在前一个值
										nArr[cursor] = {name:conName,value:nArr[cursor].value+conValue};
									}
								}
							});
							var consArr = [];
							$.each(nArr,function(index,o){
								var name  = this.name;
								var value = this.Value;
								var tmp = '<th><span>'+this.name+':</span></th>';
								tmp += '<td>'+this.value+'</td>';
								consArr.push(tmp);
							});

							var consArrLen= consArr.length;
							var directVal = perTr*trsCNT;// 子集结束量
							// 取直接显示的子集
							var directCons = consArr.slice(0, directVal);
							// 取间接显示的子集
							var indirectCons = consArr.slice(directVal);
							var directLen = directCons.length;
							var indirectLen = indirectCons.length;
							// 实际总行数
							var directTrCNT = parseInt(directLen/perTr); 
							directVal = directLen%perTr;// 最后行的差量
							
							if(directVal!=0){
								directTrCNT += 1;
								directVal = perTr - directVal;
							}
							
							var showMore = indirectLen>0; // 是否显示更多
							var insertIndex = 0;
							var insertPos = 0;
							// 插入tr
							for(var i=1,imax=directTrCNT+1;i<imax;i++){// 在最后一行添加 更多 列,其它行添加空列
								if(directTrCNT==i){// 最后一行
									var butVal = '<a id="more-condition-button" href="javascript:;" ><i style="font-size:13px;font-weight:bold;">更多...</i></a>';//button.call(this,'more-condition-button','更多');
									if(directVal!=0&&directTrCNT>1){// 如果存在差量
										directCons.push('<td colSpan="'+2*directVal+'">&nbsp;</td>');
									}
									if(showMore)directCons.push('<td style="text-align:center;" >'+butVal+'</td>');
								}else{
									insertPos = i*perTr + insertIndex;
									if(showMore)directCons.splice(insertPos, 0, '<td>&nbsp;</td></tr><tr>');
									else directCons.splice(insertPos, 0, '</tr><tr>');
									insertIndex++;
								}
							}
							
							
							function formConshtml(arr){
								return ['<table class="ana-tbl-form" cellpadding="0" cellspacing="0">',
								    '<tr>',
								    arr.join(''),
								    '</tr>',
									'</table>'
								].join('');
							}
							var $container = $('#ana-tbl-form-conditon',conDom);
							$container.html(formConshtml(directCons));
							conDom.show();

							// 构建更多显示层
							function MORE(){
								if(!showMore)return;
								var mperTr = 2;
								var minsertIndex = 0;
								var minsertPos = 0;
								// 实际总行数
								var indirectTrCNT = parseInt(indirectLen/mperTr); 
								var indirectVal = indirectLen%mperTr;// 最后行的差量
								if(indirectVal!=0){
									indirectTrCNT += 1;
									indirectVal = mperTr - indirectVal;
								}
								for(var j=1,jmax=indirectTrCNT+1;j<jmax;j++){
									if(indirectTrCNT!=j){
										minsertPos = j*mperTr + minsertIndex;
										indirectCons.splice(minsertPos, 0, '</tr><tr>');
										minsertIndex++;
									}
								}
								
								$('#more-condition-button',conDom).Layer({
									title:'更多条件',
									initShow:false,
									container:conDom,
									content:'<div id="ana-more-conditons ana-scrollY" style="height:280px;">'
										+formConshtml(indirectCons)+'</div>'
										+'<div style="text-align:center;">'+button('certain','确定')+'</div>',
									oncreate:function(){
										this.getEl().layer = this;
										var _this = this;
										$('#certain',this.getContent()).click(function(){
											_this.close();
										});
										this.widHeight(600,'auto');
									},
									position:function(){
										this.center();
									}
								});
								
							}
							MORE();
							// 注入事件
							if(showMore){
								$('#more-condition-button',conDom).click(function(){
									this.layer.show();
								});
							}
							// 初始化条件
							this.conditionAreaInit();
						},
						/**
						 * 条件初始化
						 */
						conditionAreaInit : function() {
							var self = this;
							var doms = self._('input[showtype]:hidden');
							function copyAttr(from, to) {
								$.each( [ 'metaid', 'showtype', 'inputtype',
										'joinid', 'auth_code',// 增加权限限定属性auth_code,20100129 add by lanws
										'conditionName', 'format','defaultCondition'
										], function() {
									var value = $(from).attr(this);
									if (!isNullStr(value))
										$(to).attr(this,value);
								});
							}
							/*
							 * 获取数据
							 */
//							function getData(dom, callback, condArray,toHtml) {
							function getData(dom, callback, selfCode,toHtml) {// 多值权限更改,20100129 modify by lanws
								var $this = this;
								// 取得select数据
								var select = self.getSelectById.call(self,
										$(dom).attr('selectid'));
								if (!select)
									return false;
								var query = trim(select.query);
								// 判定query是否为select语句,若不是,则直接转换并返回
								// if(!/(\(*\s*)*select/gi.test(query)){
								if (/^\s*fixed\s*$/i.test(select.option_type)) {
									if ($.isFunction(callback)) {
										var res = [];
										$.each(query.split(','), function() {
											res.push(this.split(':'));
										});
										// 调用回调函数
										callback.call($this, res);
									}
									return false;
								}

								var conditions = [];
								var joinid = $(dom).attr('joinid');
								if (!isNullStr(joinid)) {
									var joinDom = [];
									$.each(joinid.split(','),
										function() {
											joinDom.push('[showtype][metaid=' + this + ']');
										});
									try {
										conditions = self.conditions(joinDom.join(","), false,true);
									} catch (e) {
										if (e instanceof $.UninitializedError) {// 等待完成初始化
											setTimeout( function() {
//												getData.call($this, dom, callback,condArray);
												getData.call($this, dom, callback,selfCode);// 多值权限更改,20100129 modify by lanws
											}, 10);
											return false;
										}
									}
								}

//								if($.isArray(condArray))
//									conditions = conditions.concat(condArray);
								// 多值权限更改,20100129 modify by lanws
								// 取auth_code
								var auth_code = $(dom).attr('auth_code');	
								var selfCodeArr; // 自身代码
								if(auth_code&&selfCode){// 若有自身代码和权限代码
									var sCodeArr = selfCode.split(',');
									var authCodeArr = auth_code.split(',');
									// selfCodeArr = 上述两者的交集
									selfCodeArr = $.intersect(sCodeArr,authCodeArr);
								}else if(auth_code){// 只有权限限定代码
									// selfCodeArr = auth_code的数组,','分隔
									selfCodeArr = auth_code.split(',');
								}else if(selfCode){// 只有selfCode
									selfCodeArr = selfCode.split(',');
								}
								if(selfCodeArr){// 若有自身代码限定
									var selfVs;
									var metaid = $(dom).attr('metaid');// 元数据id
									if(selfCodeArr.length)
										selfVs = selfCodeArr;
									else
										selfVs = ['-99999'];// 无数据
									conditions = conditions.concat({metaid:metaid,type:'eq',value:selfVs});
								}
								/////////
								// 若级联顶端有一个全部或者选择多项,则子端不触发取值,提示先选择全部之外的选项
								var name = $(dom).attr('conditionName');
								var showType = $(dom).attr('showtype');
								var msg = null;
								var isMsg = false;
								$.each(conditions,function(index,o){
									if(o.value==null||o.value.length>1){
										/*
										if(['selectMany'].contains(showType)){
//											msg = '请先选择['+o.conditionName+']中的一项(非"全部"选项)后,再选择['+name+']';
											return true;
										}else {
											isMsg = true;
											msg = false;
										}
										*/
										return false;
									}
								});
								toHtml = toHtml?true:false;
								// 减少传输的数据
								conditions = conditions.map(function(o){
									return {metaid:o.metaid,value:o.value,type:o.type};
								});
								if(isMsg){
									callback.call($this,msg,true);
								}else{
									$.execute($.COMMAND.SELECT, {
										query :query,
										conditions :conditions,
										toHtml:toHtml
									}, function(res) {
										callback.call($this, res,false);
									},function(){
										self.addMessage({msg:'正在更新['+name+']选项',storeDom:'#ana-img-buttons'});
									},function(){
										self.removeMessage({msg:'正在更新['+name+']选项',storeDom:'#ana-img-buttons'});
									});
								}
							}
							/**
							 * 级联绑定函数
							 */
							function cascadeFunction(cascadeFunc, bindName) {
								var _this = this;
								var joinid = $(this).attr('joinid');
								if (!isNullStr(joinid)) {
									var arr = joinid.split(',');
									// 取最后一个(当前条件的上级)
									self._(
										'[showtype][metaid=' + arr[arr.length - 1] + ']')
											.bind(
											bindName,
											function() {
												if ($.isFunction(cascadeFunc))
													cascadeFunc.call(_this);
											});
								}
							}
							/*
							 * 直接级联点绑定函数
							 */
							function cascade(func) {
								cascadeFunction.call(this, function() {
									$(this).attr('dataChanged', 'true');
									// 触发间接级联事件
										$(this).trigger('indirect');
										if ($.isFunction(func))
											func.call(this, this);
									}, 'join');
							}
							/*
							 * 间接级联点绑定函数
							 */
							function cascadeIndirect(func) {
								cascadeFunction.call(this,function() {
									$(this).attr('dataChanged', 'true');
									if ($.isFunction(func))
										func.call(this, this);
								}, 'indirect');
							}
							// 设置input框和hidden框的默认值
							function setDefaultValue(){
								var def = this.def;
								this.def = null;
								if(!isNullStr(def)){
									// 处理格式化format
									var format = $(this).attr('format');
									var value;
									if(self.isDateFormat(format)&&/\$date(\(.+\))?([\-\+]\d+)?/.test(def)){// 测试def为$date-1的形式,$date(first)-1
										var mat = self.dateFormats(format);
										var d = new Date();// 取当前的时间
										var lastChar = mat[0].charAt(mat[0].length-1);
										
										function _gfirst(date){// 取得对应日期的首月或首天
											var _d = date;
											if(lastChar=='M'){
												_d = (_d.format('yyyy')+'01').toDate('yyyyMM');
											}else if(lastChar=='d'){
												_d = (_d.format('yyyyMM')+'01').toDate('yyyyMMdd');
											}
											return _d;
										}
										
										// 对指定标记的处理
										if(/$date(\(.+\))([\-\+]\d+)?/.test(def)){
											if(/$date(\(first\))([\-\+]\d+)?/.test(def)){// 取首月/天
												d = _gfirst(d);
											} else if(/$date(\(last\))([\-\+]\d+)?/.test(def)){// 取末月/天
												// 先取下月/年的首天/月
												if(lastChar=='M'){
													d = d.addYears(1);
												}else if(lastChar=='d'){
													d = d.addMonths(1);
												}
												d = _gfirst(d);
												// 首月/天-1
												if(lastChar=='M'){
													d = d.addMonths(-1);
												}else if(lastChar=='d'){
													d = d.addDays(-1);
												}
											}
										}
										
										var delema;
										if(/\$date(\(.+\))?\+\d+/.test(def)){
											delema = '+';
										}else if(/\$date(\(.+\))?\-\d+/.test(def)){
											delema = '-';
										}
										if(delema){
											var arr = def.split(delema);
											var num = parseInt(delema+arr[1]);
											if(lastChar=='M'){
												d = d.addMonths(num);
											}else if(lastChar=='d'){
												d = d.addDays(num);
											}else if(lastChar=='y'){
												d = d.addYears(num);
											}
										}

										value = d.format(mat[0]);
									}else{
										value = def;
									}
									this.value = value;
									
								}
							}
							var radioIndex = 0;
							// 多值权限更改,20100129 modify by lanws
							function authInit(dom){// 多选项
								var auth_code = $(dom).attr('auth_code');
								if(auth_code){
									dom._values = ['-99999'];
									$(dom).val('请选择');
								}else{
									dom._values = [];
									$(dom).val('全部');
								}
							}
							doms.each( function() {
								var dom = this;// 隐藏的值
								var showtype = $(dom).attr('showtype');
								switch (showtype) {
								case 'selectOne':
									// 构建select,拷贝属性
									$('<select class="single"/>')
									//.wrap('<span class="select" />')
									.insertAfter(dom)
									.bind('initData',function(event,data){// 数据初始化
										$(this).attr('initialized','false');
										$(this).attr('dataChanged','true');
										// 触发第一次取值,当为级联子级时，不触发
										if (isNullStr($(this).attr('joinid'))) {
											$(this).trigger('getData');
										}
									})
									// 注入取值函数
									.bind('getData',
										function(event,data) {
											var _this = this;
											getData.call(
											this,
											dom,
											function(res,isMsg) {
												var s = [];
												// 根据多值权限设定代码，判定是否能加全部选项
												// 多值权限更改,20100129 modify by lanws
												var auth_code = $(_this).attr('auth_code');
												if(auth_code){// 添加请选择
//													s.push('<option value="-99999">请选择</option>');
												}else
													s.push('<option value="@null">全部</option>');
												///////////
												if(isMsg){
													if($.isString(res)){// 提示消息
														alert(res);
													}
												}else{
													if($.isString(res)){
														s.push(res);
													}else{
														$.each(res,
															function() {
																var value = trim(this[0]);
																var text = trim(this[1]);
																s.push(
																'<option value="',
																value,
																'" title="',
																text,
																'">',
																text,
																'</option>');
															}
														);
													}
												}
												var $this = $(_this);
												$this.html(s.join(''));
												setTimeout(function(){// 让ie6有足够的时间渲染完成再注入选项
													var def = _this.def;
													_this.def = null;
													if(!isNullStr(def)){// 如果有默认值,选中默认值
														$this.val(def.split(',')[0]);
													}
													// 初始化完成
													$this.attr('initialized','true');
													$this.attr('dataChanged','false');
													/**
													 * 级联顶端
													 */
													if (isNullStr($this.attr('joinid'))) {
													//	 触发change事件
														$this.change();
													}
												},10);
												},null,false);
											})
											// 写入change事件
											.change( function() {
												// 触发join事件(级联)
												$(this).trigger('join');
											})
											.each(function() {
												copyAttr(dom,this);
												// 设置初始化未完成标记
												$(this).attr('initialized','false');
												$(this).attr('dataChanged','true');
												// 对级联上级注入直接级联事件
												cascade.call(this,function() {
													$(this).trigger('getData');
												});
												// 对级联上级注入间接级联事件
												cascadeIndirect.call(this,function() {
													// 对于select框，清空
													// 多值权限更改,20100129 modify by lanws
													if($(this).attr('auth_code'))
														$(this).html('<option value="-99999">请选择</option>');
													else
														$(this).html('<option value="@null">全部</option>');
												});
												

												// 多值权限更改,20100129 modify by lanws
												if($(this).attr('auth_code'))
													$(this).html('<option value="-99999">请选择</option>');
												else
													$(this).html('<option value="@null">全部</option>');
											});
									break;
								case 'selectMany':
									// 构建input,拷贝属性
									$('<input class="ana-input ana-input-img"/>')
									.each(function() {
										copyAttr(dom,this);
										// 设置初始化未完成标记
										$(this).attr('initialized','false');
										$(this).attr('dataChanged','true');

										authInit(this);// 初始化
										// 对级联上级注入直接级联事件
										cascade.call(this,function() {
											authInit(this);// 初始化
										});
										// 对级联上级注入间接级联事件
										cascadeIndirect.call(this,function() {
											authInit(this);// 初始化
										});
									})
									.insertAfter(dom)
									// 是否有默认值，对默认值进行翻译?
									.bind('initData',function(event,data){
										// 设置初始化未完成标记
										$(this).attr('initialized','false');
										$(this).attr('dataChanged','true');
										var def = this.def;
										//alert('['+$(this).attr('conditionName')+']:'+this.def);
										if(!isNullStr(def)){
											var _this = this;
											var metaid = $(this).attr('metaid');
											// 进行翻译
											getData.call(this,dom,
											function(res){
												var s  = [];
												var v = [];
												$.each(res,function(index,o){
													v.push(trim(o[0]));
													s.push(trim(o[1]));
												});
												_this._values = v;
												_this.value = s.join(',');
												// 初始化完成
												$(_this).attr('initialized','true');
												// 触发join事件(级联)
												$(_this).trigger('join');
											},
//											[{metaid:metaid,type:'eq',value:def.split(',')}],false);
											def,false);// 多值权限更改,20100129 modify by lanws
										}else{
											authInit(this);// 初始化
											// 初始化完成
											$(this).attr('initialized','true');
											// 触发join事件(级联)
											$(this).trigger('join');
										}
									})
									// 注入取值函数
									.bind('getData',
									function(event,data) {
										var $this = $(this);
										var _this = this;
										getData.call(this,dom,function(res,isMsg) {
											// 重置多选框数据
											if(isMsg){
												if($.isString(res)){// 提示消息
													alert(res);
												}
											}else{
												var layer = _this.layer;
												if (!layer) {
													$this.SelectLayer( {
														title :"请选择  "+ $this.attr('conditionName'),
														container:$('#'+self.data.root).get(0),
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
															if (isNullStr(_val))
																authInit(el);
															else 
																el.value = _val;
															if (!$.equals(el._values,values)) {
																el._values = values;
																el.title = _val;
																// 触发join事件(级联)
																$(el).trigger('join');
															}
														}
													});
													layer = _this.layer;
												} 
												var def = _this.def;
												_this.def = null;
												if(!isNullStr(def))
													def = def.split(',');
												
												layer.resetData(res,def);
												layer.show();
											} 

											// 初始化完成
											$(this).attr('initialized','true');
											$(this).attr('dataChanged','false');
										},null,false);
									})
									// 写入click事件
									.click(function() {
										var dataChanged = $(this).attr('dataChanged');
										if (dataChanged == 'true') {// 调用重新取值
											$(this).trigger('getData');
										} else if(this.layer){
											this.layer.show();
										}
									});
									break;
								case 'radio':
									$('<div></div>')
									.each(function(){
										copyAttr(dom,this);
										// 设置初始化未完成标记
										$(this).attr('initialized','false');
										$(this).attr('dataChanged','true');
									})
									.insertAfter(dom)
									.bind('initData',function(event,data){
										// 设置初始化未完成标记
										$(this).attr('initialized','false');
										$(this).attr('dataChanged','true');
										// 触发第一次取值,当为级联子级时，不触发
										if (isNullStr($(this).attr('joinid'))) {
											$(this).trigger('getData');
										} 
									})
									.bind('getData',function(event,data,isMsg){
										var $this = $(this);
										var _this = this;
										getData.call(this,dom,function(res) {
											var name = 'ana_radio_'+ radioIndex++;
											var s=[];
											// 根据多值权限设定代码，判定是否能加全部选项
											// 多值权限更改,20100129 modify by lanws
											var auth_code = $(_this).attr('auth_code');
											if(auth_code){// 添加请选择
//												s.push('<input type="radio"  name="',name,'" value="-99999"/>请选择');
											}else
												s.push('<input type="radio"  name="',name,'" value="@null"/>全部');
											
											if(isMsg){
												if($.isString(res))
													alert(res);
											}else{
												if($.isString(res)){
													s.push(res);
												}else{
													$.each(res,function(){
														s.push('<input type="radio" name="',name,'" value="',trim(this[0]),'"/>');
														s.push(trim(this[1]));
													});
												}
												$this.html(s.join(''));
												var value = $this.attr('value');
												// 给radio注入事件
												$(':radio',$this).click(function(){
													var v = $(this).val();
													if(v!=value){
														$this.attr('value',v);
														value = v;
														$this.change();
													}
												});
												
												function checkDom(_dom){
													_dom.attr('checked',true);
													value = _dom.val();
													$this.attr('value',value);
												}
												var defDom = null;

												var def = _this.def;
												_this.def = null;
												if(!isNullStr(def))
													defDom = $(':radio[value='+def+']',$this);
												else
													defDom = $(':radio:first',$this);
												checkDom(defDom);
											}
											// 初始化完成
											$this.attr('initialized','true');
											$this.attr('dataChanged','false');
											/**
											 * 级联顶端
											 */
											if (isNullStr($this.attr('joinid'))) {
												// 触发change事件
												$this.change();
											}
										},null,false);
									})
									.change(function(){
										// 触发join事件(级联)
										$(this).trigger('join');
									})
									.each(function(){
										// 对级联上级注入直接级联事件
										cascade.call(this,function() {
											$(this).trigger('getData');
										});
										// 对级联上级注入间接级联事件
										cascadeIndirect.call(this,function() {
											// 对于radio组，清空
											if($(this).attr('auth_code')){// 添加请选择
												$(this).html('<input type="radio"  value="-99999" checked/>请选择');
											}else
												$(this).html('<input type="radio" value="@null" checked/>全部');
										});
										
										if($(this).attr('auth_code')){// 添加请选择
											$(this).html('<input type="radio"  value="-99999" checked/>请选择');
										}else
											$(this).html('<input type="radio" value="@null" checked/>全部');

									})
									;
									break;
								case 'hidden':// 隐藏条件
									$('<input type="hidden" />')
									.each(function(){
										copyAttr(dom,this);
									})
									.insertAfter(dom)
									.bind('initData',function(){
										// def使用完毕后会被清空
										this.def = $(this).attr('defaultCondition');
										setDefaultValue.call(this);
										$(this).trigger('join');
									});
									break;
								case 'input':
								default:
									// 构建input,拷贝属性
									$('<input  class="ana-input"/>')
									.each(function() {
										copyAttr(dom,this);
										// 设置初始化未完成标记
										$(this).attr('initialized','false');
										$(this).attr('dataChanged','true');
										// 处理格式化format
										var format = $(this).attr('format');
										if (self.isDateFormat(format)) {
											var mat = self.dateFormats(format);
											// 设置默认值
											// 注入日历控件
											$(this)
											.attr('readOnly',true)
											.addClass('Wdate')
											.click(function() {
												var fmt = mat[0];
												WdatePicker({startDate :fmt,dateFmt :fmt,skin:'whyGreen'});
											});
										}
										// 处理默认值
	
									}).insertAfter(dom)
									// 写入默认值
									.bind('initData',function(event,data){
										// 设置初始化未完成标记
										$(this).attr('initialized','false');
										$(this).attr('dataChanged','true');
										setDefaultValue.call(this);
										$(this).attr('initialized','true');
										$(this).attr('dataChanged','false');
										$(this).trigger('join');
									});
									break;
								}
							})
							.remove();
						},
						/**
						 * <p>format是否是满足date格式</p>
						 * @param format
						 *  		格式字符串
						 * @return true/false 
						 */
						isDateFormat:function(format){
							return /^\$date\:.*$/i.test(format);
						},
						/**
						 * <p>对date抽取其中具体的格式</p>
						 * @param format
						 *  		格式字符串
						 * @return [格式1,格式2]
						 */
						dateFormats:function(format){
							var mat = format.match(/[ymdhs\-]{4,}/gi);
							var defaultFormat = 'yyyyMM';
							if (!mat|| mat.length == 0)
								mat = [defaultFormat,defaultFormat ];
							else if (mat.length == 1)
								mat.push(mat[0]);
							return mat;
						},
						/**
						 * 绑定事件
						 */
						bindEvents : function() {},
						/**
						 * 取得可见的template文档节点(context的子节点)
						 */
						getTemplateDom:function(context){
							return this._(this.templateExpr,context);
						},
						/**
						 * 取得父template
						 */
						getParent:function(){
							return this.getTemplateData(this.getParentDom());
						},
						/**
						 * 取得父template文档节点
						 */
						getParentDom:function(){
							return this.context.parents(this.templateExpr).filter(':first');
						},
						
						/**
						 * 由template文档节点取得其上的数据
						 */
						getTemplateData:function(templateDom){
							return $(templateDom).data('templateData');
						},
						/**
						 * 添加消息 opt:{msg:...,storeDom:...[,layerClass:...]}
						 */
						addMessage:function(opt){
							var $Dom = this._(opt.storeDom);
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
						},
						/**
						 * 移除消息 opt:{msg:...,storeDom:...}
						 */
						removeMessage:function(opt){
							var $Dom = this._(opt.storeDom);
							var messageLayer = $Dom.data('messageLayer');
							if(messageLayer)
								messageLayer.remove(opt.msg);
						},
						flush:function(){
							this.flushdata();
							this.flushchild();
						},
						/**
						 * <p>触发直接子template的flush</p>
						 */
						flushchild : function() {
							var self = this;
							var templateDom = this.getTemplateDom();
							templateDom.each(function(){
								var templateData = self.getTemplateData(this);
								templateData.flush();
							});
						},
						/**
						 * <p>触发当前template的刷新</p>
						 */
						flushdata : function() {},
						/**
						 * <p>将值按照特定格式转换</p>
						 */
						toFormat:function(value,format){
							var result = value;
							if(isNullStr(value))return result;
							if(this.isDateFormat(format)){
								var mat = this.dateFormats(format);
								result = value.toDate(mat[0]).format(mat[1]);
							}
							return result;
						},
						/**
						 * 取当前template的条件
						 */
						conditions : function(context, delteNull,detailInfo) {
							var self = this;
							var condom = this.conditionDom();
							context = context ? this.dom(context,condom) :  this.dom('[showtype]',condom);
							if(!context)return [];
							
							var nativeConditions = [];
							delteNull = delteNull == false ? false : true;
							
							function push(value,orginValue,type,info) {
								if ($.isString(value)) {
									value = [ value ];
								}
								if (value) {
									var newvalue = [];
									$.each(value, function(index, o) {
										if (o && o.indexOf('@null') == -1) {
											newvalue.push(o);
										}
									});
									value = newvalue;
								}
								if (!value || value.length == 0) {
									if (delteNull)
										return;
									else
										value = null;
								}
								var c = $.extend(info,{
										type :type,
										value :value
								});
								if( detailInfo ){
									c.orginValue = orginValue;
								}
								nativeConditions.push( c );
							}
							function getInfo($from) {
								var attrs = null;
								if(!detailInfo){
									attrs = ['metaid'];
								}else{
									attrs = [ 'metaid', 'showtype', 'inputtype',
									          'joinid', 'conditionName', 
									          'format','defaultCondition'];
								};
								var re = {};
								$.each(attrs, function() {
									re[this] = $from.attr(this);
								});
								return re;
							}
							function fomatValue(value,type,format,delema){
								if(!isNullStr(value)){
									var values;
									if(delema)
										values = value.split(delema);
									else
										values = [value];
									value = values.map(function(_value){
										_value = self.toFormat(_value,format);
											if (type == 'contain')
												_value = '%' + _value + '%';
											else if (type == 'begin_with')
												_value = '%' + _value;
											else if (type == 'end_with')
												_value = _value + '%';
										return _value;
									});
								}
								return value;
							}
							context.each( function() {
								var $this = $(this);
								// 检测条件是否初始化完毕
								var conName = $this.attr('conditionName');
								var format = $this.attr('format');
								$.checkInitialized(this, '条件未初始化完成');
								var showtype = $this.attr('showtype');
								var type = $this.attr('inputtype');
								var value,orginValue;
								if (showtype == 'radio') {
									value = orginValue = $this.attr('value');
								} else if ('hidden'==showtype) {
									orginValue = $this.val();
									value = fomatValue(orginValue,type,format,',');
								} else if ('input'==showtype) {
									orginValue = $this.val();
									value = fomatValue(orginValue,type,format);
								} else if (showtype == 'selectMany') {
									value = orginValue = this._values;
								} else
									value = orginValue = $this.val();
								push(value,orginValue,type||'eq',getInfo($this));
							});
							return nativeConditions;
						},
						/**
						 * 获取条件
						 */
						getConditions : function(context,deleteNull,detailInfo) {
							var result = [];
							var pTemplate = this.getParent();
							var conditions;
							if(pTemplate){// 获取父template的条件
								conditions = pTemplate.getConditions(context,deleteNull,detailInfo);
								result = result.concat(conditions);
							}
							// 取得自身的条件
							conditions = this.conditions(context,deleteNull,detailInfo);
							result = result.concat(conditions);
						// 返回结果
						return result;
					},
					/**
					 * 将[{metaid:...,childColumns:[...],name:...},...]转换成[{id:'...',name:'中文名称',child:[columns,...]}]
					 */
					transFields : function(columns) {
						var fields = null;
						var self = this;
						if (columns && columns.length) {
							fields = [];
							function gname(id,name){
								if(isNullStr(name)){
									var m = self.getMetaById(id);
									if(!m)return '';
									name = m.cnname;
									if(isNullStr(name))
										name = '';
								}
								return $.formatName(name);
							}
							$.each(columns,function(index,o){
								var id = isNullStr(o.metaid)?'columnid':o.metaid;
								var name = gname(id,o.name);
								var child = self.transFields(o.childColumns);
								fields.push({
										id:id,
										name:name,
										child:child
								});
							});
						}
						return fields;
					},

					/**
					 * 根据id获得对应的中文名称,若有单位,叠加单位
					 */
					columnsNameById:function(ids){
						if(!$.isArray(ids))return [];
						var self = this;
						return ids.map(function(o){
							var m = self.getMetaById(o);
							var name = $.formatName(m.cnname);
							// 查看元数据中是否有单位
							return isNullStr(m.unit)?name:(name+'('+trim(m.unit)+')');
						});
					}
			});
})(jQuery);
