
// jquery.1.3函数,jsTree组件已使用,若切换成jquery.1.3,则去除此段/**与jquery-1.7.2.js有冲突,解决办法：isArray改为is_Array，clone改为_clone  (edit by suyi@20130522)**/
(function($){
	$.extend($.fn,{	
		live: function( type, fn ){
			$(document).bind( type,fn );
			return this;
		},
		
		die: function( type, fn ){
			$(document).unbind( type,fn );
			return this;
		}
	});
})(jQuery);
/*************
*通用函数(jQuery扩展)
*************/
( function($) {
	function typeOf(objClass) {// 判定数据类型
		if (objClass && objClass.constructor) {
			var strFun = objClass.constructor.toString();
			var className = strFun.substr(0, strFun.indexOf('('));
			className = className.replace('function', '');
			return className.replace(/(^\s*)|(\s*$)/ig, '').toLowerCase();
		}
		return (typeof (objClass)).toLowerCase();
	}
	function sformat(s) {
		return s.replace(/([\"\'\{\}\:\[\]\/\\])/g, "\\$1").replace(/[\n\r]/g,"");
	}
	function jsonSerialize(o) {// 将数据序列化成字符串
		if (o==undefined ||o == null)
			return null;
		var type = typeOf(o);
		switch (type) {
		case 'array': {
			var strArray = '[';
			for ( var i = 0; i < o.length; ++i) {
				var value = jsonSerialize(o[i]);
				strArray += value + ',';
			}
			if (strArray.charAt(strArray.length - 1) == ',') {
				strArray = strArray.substr(0, strArray.length - 1);
			}
			strArray += ']';
			return strArray;
		}
		case 'date': {
			return 'new Date(' + o.getTime() + ')';
		}
		case 'boolean':
		case 'function':
		case 'number': {
			return o;
		}
		case 'string': {
			return "\"" + sformat(o) + "\"";
		}
		default: {
			var serialize = '{';
			for ( var key in o) {
				var subserialize = jsonSerialize(o[key]);
				serialize += "\"" + key + "\"" + ' : ' + subserialize + ',';
			}
			if (serialize.charAt(serialize.length - 1) == ',') {
				serialize = serialize.substr(0, serialize.length - 1);
			}
			serialize += '}';
			return serialize;
		}
		}
	}
	function isObject(o){
		return o&&o.constructor;
	}
	/**
	 * 判定是否为字符串
	 * 
	 * @param o为输入
	 */
	function isString(o) {
		return typeOf(o) == "string";
	}
	/**
	 * 判定是否为空字符串
	 * 
	 * @param o为输入
	 */
	function isNullStr(o) {
		return !o || /^\s*$/.test(o);
	}
	function notNullStr(o) {
		return !isNullStr(o);
	}
	/**
	 * 判定是否为数组
	 * 
	 * @param o为输入
	 */
	function is_Array(o) {
		return typeOf(o) == "array";
	}
	/**
	 * 判定是否为数字
	 * 
	 * @param o为输入
	 */
	function isNumber(o) {
		return typeOf(o) == "number";
	}
	/**
	 * 判定是否为true或false
	 * 
	 * @param o为输入
	 */
	function isBoolean(o) {
		return typeOf(o) == "boolean";
	}
	/**
	 * 判定是否为Date(日期)
	 * 
	 * @param o为输入
	 */
	function isDate(o) {
		return typeOf(o) == "date";
	}
	/**
	 * javascript对象继承
	 */
	function inherits(subclass, superclass) {
		$.extend(subclass.prototype, superclass.prototype);
		subclass.prototype.parent = superclass.prototype;
	}
	/**
	 * 克隆任何javascript变量
	 * o:需复制的数据,
	 * deep(false/true) true时,表示深复制,默认true
	 */
	function _clone(o,deep){
		var result;
		if(deep != false)deep = true;
		if(deep)// (深复制)采用对象序列化与反序列化的技术
			result = eval('('+jsonSerialize(o)+')');
		else{
			if(isObject(o)){// 对象浅复制
				if(is_Array(o)){
					result = [];
					$.each(o,function(){
						result.push(this);
					});
				}else{
					result = {};
					$.each(o,function(p,o){
						result[p] = o;
					});
				}
			}else{// 其它
				result = o;
			}
		};
		return result;
	}
	
	/**
	 * 数据是否相等
	 */
	function equals(o1, o2) {
		var o1type = typeOf(o1);
		var o2type = typeOf(o2);
		if (o1type != o2type)
			return false;
		switch (o1type) {
		case 'boolean':
		case 'number':
		case 'string':
			return o1 == o2;
		default:
			return o1 == o2 || jsonSerialize(o1) == jsonSerialize(o2);
		}
	}
	/**
	 * 是否包含字符串
	 */
	function containsRegex(input, rex) {
		if (isNullStr(input) || isNullStr(rex))
			return false;
		else
			return input.search(rex) != -1;
	}

	/**
	 * 隐藏、显示选项,ie用替换成div的方式,其它用显示和隐藏的方式
	 */
	// 隐藏某个select中的option
	function hideOption(oldOption) {
		var re = oldOption;
		if($.browser.msie ){
			if (oldOption.tagName == 'OPTION') {
				var oldStr = oldOption.innerText;
				var newOption = document.createElement('<div' + oldOption.outerHTML
						.match(/(<\w*)([^>]*)(>)/)[2] + '>');
				newOption.innerText = oldStr;
				newOption.swapNode(oldOption);
				re = newOption;
			}
		}else 
			$(oldOption).hide();
		return re;
	}

	// 显示隐藏的某个select中的option
	function showOption(oldOption) {
		var re = oldOption;
		if($.browser.msie ){
			if (oldOption.tagName == 'DIV') {
				var oldStr = oldOption.innerText;
				var newOption = document
						.createElement('<option' + oldOption.outerHTML
								.match(/(<\w*)([^>]*)(>)/)[2] + '>');
				newOption.innerText = oldStr;
				newOption.swapNode(oldOption);
				re = newOption;
			}
		}else 
			$(oldOption).show();
		return re;
	}

	/**
	 * 构建html属性
	 */
	function htmlProperty(name, value) {
		return isNullStr(value) ? '' : ' ' + name + '="' + $.trim(value) + '"';
	}
	/**
	 * 将[{child:[columns,...],...}]转换为[{...},...]。 对于有child属性的,将child数组转换外层数组中,
	 * 对于元素不含child属性的,不转换,如[1,2,{}] to [1,2,{}] 参数: data 数组
	 * 返回新数组:若data非数组，则返回[data]
	 */
	function transFlatData(data,child) {
		if (!is_Array(data))
			return [ data ];
		child = child||'child';
		var result = [];
		$.each(data, function(index, o) {
			if ($.is_Array(o[child])&&o[child].length) {
				result = result.concat(transFlatData(o[child],child));
			} else {
				result.push(o);
			}
		});
		return result;
	}
	/*  
	*    mathRound(Dight,How):数值格式化函数，Dight要  
	*    格式化的  数字，How要保留的小数位数。  
	*/  
	function  mathRound(Dight,How){  
	   var _Dight=Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);  
	   return  _Dight;  
	}  
	// 取两个数组的交集
	function intersect(arr1,arr2){
		if(arr1&&arr2&&arr1.length&&arr2.length){// 可取交集的条件:arr1存在且元素个数>=1,arr2存在且元素个数>=1
			function f(srcArr,checkArr){
				return srcArr.filter(function(i,o){
					return checkArr.contains(o);
				});
			}
			return f(arr1,arr2).concat(f(arr2,arr1));
		}else
			return []; 
	}
	// 绑定函数到jQuery对象
	$.each( [ 'typeOf', 'sformat', 'jsonSerialize', 'isDate', 'isBoolean',
			'isNumber', 'isObject','is_Array', 'isString', 'isNullStr', 'inherits','_clone',
			'equals', 'hideOption', 'showOption', 'containsRegex',
			'htmlProperty', 'transFlatData','mathRound','intersect' ], function(i, o) {
		var s = '$["' + o + '"] = ' + o ;
		eval(s);
	});
	
	// 重新定义trim
	var _trim = $.trim;
	$.trim=function trim(s){
		return s==null?null:_trim(s+'');
	};
})(jQuery);
		

