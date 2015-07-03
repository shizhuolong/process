function graphProcessTrace(options) {

	var hisMap = null;
    var _defaults = {
        srcEle: this,
        processInstanceId: $(this).attr('pid')
    };
    var opts = $.extend(true, _defaults, options);

    // 处理使用js跟踪当前节点坐标错乱问题
    $('#changeImg').live('click', function () {
        $('#workflowTraceDialog').dialog('close');
        if ($('#imgDialog').length > 0) {
            $('#imgDialog').remove();
        }
        $('<div/>', {
            'id': 'imgDialog',
            title: '红色为当前节点',
            html: "<img src="+path+"'/processTrace/process-trace!readResource.action?pid=" + opts.processInstanceId + "' />"
        }).appendTo('body').dialog({
                modal: true,
                resizable: false,
                dragable: false,
                width: document.documentElement.clientWidth * 0.9,
                height: document.documentElement.clientHeight * 0.9
            });
    });
    
    
    $('#hideHisTip').live('click',function(){
    	 $('.activity-his-rocord').qtip().toggle();
    });
    
    
    $('#replayAuditHistory').live('click',function(){
    	
    	$('#hideHisTip').text("显示/隐藏-历史记录");
    	
    	var hisDivContent = "";
    	$.each(hisMap,function(i,v){
    		var startTime =this.createTime;
    		var endTime = this.submitTime;
    	    var dealer = this.assigneeName;
    		var divKey = this.actNodeKey;
    		var actNodeName = this.actNodeName;
    		var passOrNot = this.passOrNot ? "同意" : "不同意";
    		var taskDesc = this.taskDesc ;
    		var originalCss = $('#'+divKey).css('border');
    		
    		window.setTimeout(function(){
    			
    	    var tipContent = "<table class='need-border'>";
    	    	tipContent += "<tr style='font-size:2'><td class='label'>环节&nbsp;</td><td>" + actNodeName +"</td></tr>";
                tipContent += "<tr style='font-size:2'><td class='label'>处理人&nbsp;</td><td>" + dealer +"</td></tr>";
                tipContent += "<tr style='font-size:2'><td class='label'>接收时间&nbsp;</td><td>" + startTime +"</td></tr>";
                tipContent += "<tr style='font-size:2'><td class='label'>提交时间&nbsp;</td><td>" + endTime +"</td></tr>";
                tipContent += "<tr style='font-size:2'><td class='label'>审批意见&nbsp;</td><td><font color=red>" + passOrNot +"</font></td></tr>";
                tipContent += "<tr style='font-size:2'><td class='label'>审批备注&nbsp;</td><td>" + taskDesc+"</td></tr>";
                tipContent += "<tr style='font-size:2'><td colspan=2>-----------------------------</td></tr>";
                tipContent += "</table>";
             
                hisDivContent +=tipContent;
                
    		 var qtipConfig = {
    				 id: divKey+i,
    				 content: {
    				        text: tipContent
    				 },
    				 position: {
    	                    at: 'bottom center',
    	                    adjust: {
    	                        x: 3
    	                    }
    	                },
    	            style: {   
    	                    width:500
    	                }
    		} ;
    		
    		 
       		 var qtipHisConfig = {
    				 content: {
    				        text: hisDivContent
    				 },
    				 position: {
    	                    at: 'top right',
    	                    adjust: {
    	                        x: 3
    	                    }
    	                },
    	            style: {   
    	                    width: 500
    	                }
    		} ;
       		 
       		 
    		var qtips = $('#'+divKey).qtip(qtipConfig);
//    		var qtipHis = $('.activity-his-rocord').qtip(qtipHisConfig);
    		
    			$('#'+divKey).css('border','5px solid blue');
    			$('#'+divKey).qtip().show();
    			
    			$('#'+divKey).qtip({
    				  api: {
    				    onContentUpdate: function() { this.updateWidth(); },
    				    onContentLoad:  function() { this.updateWidth(); },
    				    beforeContentLoad: function() { this.updateWidth(); }
    				    }
    				  });
    			
    			
//    			$('.activity-his-rocord').qtip().show();
    			window.setTimeout(function(){
    				$('#'+divKey).css('border',originalCss);
        			$('#'+divKey).qtip().hide();
    			},1000);
    		},1500*(i));
    	});
    });

    // 获取图片资源
    var imageUrl = path+"/workflow/work-flow!loadByProcessInstance.action?processInstanceId=" + opts.processInstanceId + "&resourceType=image";
    $.getJSON(path+'/processTrace/process-trace!traceProcess.action?pid=' + opts.processInstanceId, function (data) {

        var positionHtml = "";
        var infos = data.activityInfos;
        // 生成图片
        var varsArray = new Array();
        $.each(infos, function (i, v) {
        	if(v.his){ //历史节点
        		hisMap = v.his;
        	} else {
        		var $positionDiv = $('<div/>', {
                    'class': 'activity-attr' ,'id':v.taskDefId+"_"+"attr"
                }).css({
                        position: 'absolute',
                        left: (v.x - 1),
                        top: (v.y - 1),
                        width: (v.width - 2),
                        height: (v.height - 2),
                        backgroundColor: 'black',
                        opacity: 0,
                        zIndex: $.fn.qtip.zindex - 1
                    });

                // 节点边框
                var $border = $('<div/>', {
                    'class': 'activity-attr-border','id':v.taskDefId	
                }).css({
                        position: 'absolute',
                        left: (v.x - 25),
                        top: (v.y - 1),
                        width: (v.width - 4),
                        height: (v.height - 3),
                        zIndex: $.fn.qtip.zindex - 2
                    });

            
                if (v.hisActiviti) {
                    $border.addClass('ui-corner-all-12').css({
                        border: '3px solid green'
                    });
                }
                if (v.currentActiviti) {
                    $border.addClass('ui-corner-all-12').css({
                        border: '3px solid red'
                    });
                }
                
                positionHtml += $positionDiv.outerHTML() + $border.outerHTML();
                varsArray[varsArray.length] = v.vars;
        		
        	}
            
        });

        
        hisRecordDiv = $('<div/>', {
            'class': 'activity-his-rocord'
        }).css({
                position: 'absolute',
                left: 900,
                top: 20,
                width: 10,
                height: 10,
                backgroundColor: 'black',
                opacity: 0,
                zIndex: $.fn.qtip.zindex - 1
            });
        positionHtml+=hisRecordDiv.outerHTML();
        
        
        if ($('#workflowTraceDialog').length == 0) {
            $('<div/>', {
                id: 'workflowTraceDialog',
                title: '<button id="changeImg">查看流转图</button>',
                html: "<div><img src='" + imageUrl + "' style='position:absolute; left:44px; top:40px;' />" +
                    "<div id='processImageBorder'>" +
                    positionHtml +
                    "</div>" +
                    "</div>"
            }).appendTo('body');
        } else {
            $('#workflowTraceDialog img').attr('src', imageUrl);
            $('#workflowTraceDialog #processImageBorder').html(positionHtml);
        }

        // 设置每个节点的data
        $('#workflowTraceDialog .activity-attr').each(function (i, v) {
            $(this).data('vars', varsArray[i]);
        });

        // 打开对话框
        $('#workflowTraceDialog').dialog({
            modal: true,
            resizable: false,
            dragable: false,
            open: function () {
            	var displayText = "播放审批过程";
//                $('#workflowTraceDialog').dialog('option', 'title', '<button id="replayAuditHistory">'+displayText+'</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="hideHisTip"></button><font color=red>说明：红色为任务当前所处节点，绿色为历史流经节点</font>'); //<button id="changeImg">查看流转图</button>
                $('#workflowTraceDialog').dialog('option', 'title', '<button id="replayAuditHistory">'+displayText+'</button><font color=red>说明：红色为任务当前所处节点</font>&nbsp;&nbsp;<font color=green>绿色为历史流经节点</font>'); //<button id="changeImg">查看流转图</button>
                $('#workflowTraceDialog').css('padding', '0.2em');
                $('#workflowTraceDialog .ui-accordion-content').css('padding', '0.2em').height($('#workflowTraceDialog').height() - 75);

                $('.activity-attr').qtip({
                    content: function () {
                        var vars = $(this).data('vars');
                        var tipContent = "<table class='need-border'>";
                        $.each(vars, function (varKey, varValue) {
                        	 if (varValue) {
                        		 if(varKey.substr(0,varKey.length-2)=="mutilApproveRecord"){
                         	    	tipContent += "<tr style='font-size:2'><td class='label'>环节</td><td>" + this.actNodeName +"</td></tr>";
                                    tipContent += "<tr style='font-size:2'><td class='label'>处理人</td><td>" + this.assineeName +"</td></tr>";
                                    tipContent += "<tr style='font-size:2'><td class='label'>接收时间</td><td>" + this.recieveTime +"</td></tr>";
                                    tipContent += "<tr style='font-size:2'><td class='label'>提交时间</td><td>" + this.submitTime +"</td></tr>";
                                    tipContent += "<tr style='font-size:2'><td class='label'>审批意见</td><td>" + this.passOrNot +"</td></tr>";
                                    tipContent += "<tr style='font-size:2'><td class='label'>审批备注</td><td>" + this.taskDesc +"</td></tr>";
                        			tipContent += "<tr style='font-size:2'><td colspan='2'>------------------------</td></tr>";
                        		 
                        		 } else {
                        			 tipContent += "<tr style='font-size:2'><td class='label'>" + varKey  + "</td><td>" + varValue + "<td/></tr>";
                        		}
                        	 }
                        });
                        tipContent += "</table>";
                        return tipContent;
                    },
                    position: {
                        at: 'bottom left',
                        adjust: {
                            x: 3
                        }
                    },
                    style: {   
                        width: 500
                    }
                });
                // end qtip
            },
            close: function () {
                $('#workflowTraceDialog').remove();
            },
            width: document.documentElement.clientWidth * 0.9,
            height: document.documentElement.clientHeight * 0.9
        });

    });
}
