function rowColSpan(id,len){
  //uniteTable(table1,53);//纵向合并列,ff有问题?
   if(len==undefined){
      len=$(''+id+' thead tr td').length/$(''+id+' thead tr').length;//获取总列数   
   }          
   //alert("id="+id+",len="+len)
   for(var i=1;i<=len;i++){ //纵向合并行
      _w_table_rowspan(''+id,i); 
   }
   
   for(var i=0;i<=len;i++){ //横向合并行
      _w_table_colspan(''+id,i); 
   }  
}
//函数说明：合并指定表格（表格id为_w_table_id）指定列（列数为_w_table_colnum）的相同文本的相邻单元格
//参数说明：_w_table_id 为需要进行合并单元格的表格的id。如在HTMl中指定表格 id="data" ，此参数应为 #data 
//参数说明：_w_table_colnum 为需要合并单元格的所在列。为数字，从最左边第一列为1开始算起。
function _w_table_rowspan(_w_table_id,_w_table_colnum){//（对应的table的id，要合并的列数）
    _w_table_firsttd = "";    
    _w_table_currenttd = "";   
    _w_table_SpanNum = 0;    
    _w_table_Obj = $(_w_table_id + " tr td:nth-child(" + _w_table_colnum + ")");  
    _w_table_Obj.each(function(i){   
         if(i==0){    
            _w_table_firsttd = $(this);   
            _w_table_SpanNum = 1;    
         }else{   
             _w_table_currenttd = $(this); 
             if(_w_table_firsttd.text()==_w_table_currenttd.text()){   
                 _w_table_SpanNum++;   
             //_w_table_currenttd.hide(); //remove();    
                 _w_table_firsttd.attr("rowSpan",_w_table_SpanNum);   
            }else{    
              _w_table_firsttd = $(this);  
                 _w_table_SpanNum = 1;  
           }  
       } 
     });    
}


//函数说明：合并指定表格（表格id为_w_table_id）指定行（行数为_w_table_rownum）的相同文本的相邻单元格
//参数说明：_w_table_id 为需要进行合并单元格的表格id。如在HTMl中指定表格 id="data" ，此参数应为 #data 
//参数说明：_w_table_rownum 为需要合并单元格的所在行。其参数形式请参考jQuery中nth-child的参数。
//          如果为数字，则从最左边第一行为1开始算起。
//          "even" 表示偶数行
//          "odd" 表示奇数行
//          "3n+1" 表示的行数为1、4、7、10.......
//参数说明：_w_table_maxcolnum 为指定行中单元格对应的最大列数，列数大于这个数值的单元格将不进行比较合并。
//          此参数可以为空，为空则指定行的所有单元格要进行比较合并。
function _w_table_colspan(_w_table_id,_w_table_rownum,_w_table_maxcolnum){
    if(_w_table_maxcolnum == void 0){_w_table_maxcolnum=0;}
    _w_table_firsttd = "";
    _w_table_currenttd = "";
    _w_table_SpanNum = 0;
    $(_w_table_id + " tr:nth-child(" + _w_table_rownum + ")").each(function(i){
        _w_table_Obj = $(this).children();
        _w_table_Obj.each(function(i){
        	//alert(i);
            if(i==0){
                _w_table_firsttd = $(this);
                _w_table_SpanNum = 1;
            }else if((_w_table_maxcolnum>0)&&(i>_w_table_maxcolnum)){
                return "";
            }else{
                _w_table_currenttd = $(this);
               //alert("B"+_w_table_firsttd.text().replace(/[\xa0]/gi, ""));
               //alert("B"+_w_table_currenttd.text().replace(/[\xa0]/gi, "") );
                if(_w_table_firsttd.text().replace(/[\xa0]/gi, "")==_w_table_currenttd.text().replace(/[\xa0]/gi, "")){
                    _w_table_SpanNum++;
                   // alert("colSpan"+_w_table_SpanNum);
                    _w_table_currenttd.remove(); //remove();hide()
                    _w_table_firsttd.attr("colSpan",_w_table_SpanNum);
                   // alert('do');
                }else{
                    _w_table_firsttd = $(this);
                    _w_table_SpanNum = 1;
                }
            }
        });
    });
}


 ///////////////不兼容火狐？////////////////////////////////  
     //   功能：合并表格  
     //   参数：tb－－需要合并的表格ID  
     //   参数：colLength－－需要对前几列进行合并，比如，  
     //   想合并前两列，后面的数据列忽略合并，colLength应为2  
     //   缺省表示对全部列合并  
     //   data:   2005.11.6  
     ///////////////////////////////////////////////  
     function uniteTable(tb,colLength){  
     //   检查表格是否规整  
     if   (!checkTable(tb)) return;  
     var   i=0;  
     var   j=0;  
     var   rowCount=tb.rows.length; //   行数  
     var   colCount=tb.rows[0].cells.length; //   列数  
     var   obj1=null;  
     var   obj2=null;  
     //   为每个单元格命名  
     for(i=0;i<rowCount;i++){  
         for   (j=0;j<colCount;j++){  
           tb.rows[i].cells[j].id="tb__"   +   i.toString()   +   "_"   +   j.toString();  
         }  
     }  
     //   逐列检查合并  
     for (i=0;i<colCount;i++){  
         if (i==colLength)   return;  
             obj1=document.getElementById("tb__0_"+i.toString())  
             for (j=1;j<rowCount;j++){  
                 obj2=document.getElementById("tb__"+j.toString()+"_"+i.toString());  
                 if (obj1.innerText   ==   obj2.innerText){  
                     obj1.rowSpan++;  
                     obj2.parentNode.removeChild(obj2);  
                 }else{  
                     obj1=document.getElementById("tb__"+j.toString()+"_"+i.toString());  
                 }  
             }  
         }  
     }  
      
     /////////////////////////////////////////  
     //   功能：检查表格是否规整  
     //   参数：tb－－需要检查的表格ID  
     //   data:   2005.11.6  
     /////////////////////////////////////////  
     function checkTable(tb){  
         if (tb.rows.length==0)   return false;  
             if (tb.rows[0].cells.length==0)   return false;  
             for(var   i=0;i<tb.rows.length;i++){  
                  if(tb.rows[0].cells.length != tb.rows[i].cells.length) return false;  
             }  
         return true;  
     } 
     
