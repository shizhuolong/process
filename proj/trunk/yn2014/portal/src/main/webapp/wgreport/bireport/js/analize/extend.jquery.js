/*******
*原型扩展
********/
( function($) {
	var arr = [];
	
	/*
	 * Array数组原型扩展
	 */ 
	$.extend(Array.prototype, {
		/**
		 *  查询对象在数组中的位置,未找到返回-1
		 */
		indexOf:function(obj){
			var index = -1;
			$.each(this,function(i,o){
				if($.equals(o, obj)){
					index = i;
					return false;
				}
			});
			return index;
		},
		/**
		 * 是否包含数据
		 */
		contains : function(obj) {
			return this.indexOf(obj) > -1;
		},
		/**
		 * 过滤数组 <br/> 参数: <br />
		 * func 过滤函数function(index,o) index:在当前数组中的序号,o:值
		 * 若函数返回true,则保留,否则抛去
		 */
		filter : function(func) {
			var newArr = [];
			$.each(this,function(index, o) {
				if (func.call(o, index, o) == true)
					newArr.push(o);
			});
			return newArr;
		},
		/**
		 * 根据过滤函数获取第一个找到的数据
		 */
		get:function(callback){
			var value = null;
			$.each(this,function(index,o){
				if(callback.call(o,index,o) == true){
					value = o;
					return false;
				};
			});
			return value;
		},
		/**
		 * 将原数组转换为新数组
		 */
		map:function(func){
			var newArr = [];
			$.each(this,function(index,o){
				newArr.push(func.call(o,o,index));
			});
			return newArr;
		},
		/**
		 * 移除第index项数据
		 */
		removeByIndex:function(index){
			if(index>-1&&index<this.length)
				this.splice(index,1);
		},
		/**
		 * 移除数据,存在则移除
		 */
		remove:function(obj){ 
			this.removeByIndex(this.indexOf(obj));  
			 return this;
		}
	});
	/*
	 * String字符串原型扩展
	 */
	$.extend(String.prototype,{
		/**
		 * <p>将字符串按指定格式转换为Date</p>
		 * @param format(String) 
		 * 			转换格式
		 */
		toDate : function(format) {
		    if (format == null) format = 'yyyy-MM-dd hh:mm:ss';
		      var o = {
		         'y+' : 'y',
		         'M+' : 'M',
		         'd+' : 'd',
		         'h+' : 'h',
		         'm+' : 'm',
		         's+' : 's'
		     };
		     var result = {
		         'y' : '',
		         'M' : '',
		         'd' : '',
		         'h' : '00',
		         'm' : '00',
		         's' : '00'
		      };
		     var tmp = format;
		     for (var k in o) {
		          if (new RegExp('(' + k + ')').test(format)) {
		              result[o[k]] = this.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
		          }
		     }
		     if(!result['d'])// 当日期没有时,月份会被-1,此时应重置日期
		    	 result['d'] = 1;
		      return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);
		  }
	});
	/*
	 * Date扩展
	 */
	$.extend(Date,{
		daysInMonth:function(year,month){
		    if(month == 2){
		        if(year % 4 == 0 && year % 100 != 0)
		            return 29;
		        else
		            return 28;
		    }
		    else if((month <= 7 && month % 2 == 1) || (month > 7 && month % 2 == 0))
		        return 31;
		    else
		        return 30;
		},
		isLeepYear:function(year){
		    return (year % 4 == 0 && year % 100 != 0)
		}
	});
	/*
	 * Date原型扩展
	 */
	$.extend(Date.prototype,{
		add:function(milliseconds){
		    var m = this.getTime() + milliseconds;
		    return new Date(m);
		},
		addSeconds:function(second){
		    return this.add(second * 1000);
		},
		addMinutes:function(minute){
		    return this.addSeconds(minute*60);
		},
		addHours:function(hour){
		    return this.addMinutes(60*hour);
		},

		addDays:function(day){
		    return this.addHours(day * 24);
		},

		addMonth:function(){
		    var m = this.getMonth();
		    if(m == 11)return new Date(this.getFullYear() + 1,1,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
		    
		    var daysInNextMonth = Date.daysInMonth(this.getFullYear(),this.getMonth() + 1);
		    var day = this.getDate();
		    if(day > daysInNextMonth){
		        day = daysInNextMonth;
		    }
		    return new Date(this.getFullYear(),this.getMonth() + 1,day,this.getHours(),this.getMinutes(),this.getSeconds());    
		},

		subMonth:function(){
		    var m = this.getMonth();
		    if(m == 0)return new Date(this.getFullYear() -1,11,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
		    var day = this.getDate();
		    var daysInPreviousMonth = Date.daysInMonth(this.getFullYear(),this.getMonth());
		    if(day > daysInPreviousMonth){
		        day = daysInPreviousMonth;
		    }
		    return new Date(this.getFullYear(),this.getMonth() - 1,day,this.getHours(),this.getMinutes(),this.getSeconds());
		},

		addMonths:function(addMonth){
		    var result = this;
		    if(addMonth > 0){
		        while(addMonth > 0){
		            result = result.addMonth();
		            addMonth -- ;
		        }
		    }else if(addMonth < 0){
		        while(addMonth < 0){
		            result = result.subMonth();
		            addMonth ++ ;
		        }
		    }else{
		        result = this;
		    }
		    return result;
		},

		addYears:function(year){
		    return new Date(this.getFullYear() + year,this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
		},
		/**
		 * <p>按指定格式format格式化Date</p>
		 * @param format(String) 
		 * 				指定格式，默认为'YYYY-MM-dd hh:mm:ss'
		 */
		format:function(format){
			 if(format==null)format="YYYY-MM-dd hh:mm:ss";
			 var o = {
			  "M+" :  this.getMonth()+1,  //month
			  "d+" :  this.getDate(),     //day
			  "h+" :  this.getHours(),    //hour
		      "m+" :  this.getMinutes(),  //minute
		      "s+" :  this.getSeconds(), //second
		      "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
		      "S"  :  this.getMilliseconds() //millisecond
			  };
			  
			  if(/(y+)/.test(format)) {
			    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
			  }
			 
			  for(var k in o) {
			    if(new RegExp("("+ k +")").test(format)) {
			      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
			    }
			  }
			 return format;
		}
	});
	
})(jQuery);