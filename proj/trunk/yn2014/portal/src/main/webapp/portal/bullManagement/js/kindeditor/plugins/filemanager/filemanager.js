KindEditor.plugin('filemanager', function (K) {
    var self = this, name = 'filemanager',
        fileManagerJson = K.undef(self.fileManagerJson, self.basePath + 'php/file_manager_json.php'),
        imgPath = self.pluginsPath + name + '/images/',
        lang = self.lang(name + '.');
    function makeFileTitle(filename, filesize, datetime) {
        return filename + ' (' + Math.ceil(filesize / 1024) + 'KB, ' + datetime + ')';
    }
    function bindTitle(el, data) {
        if (data.is_dir) {
            el.attr('title', data.filename);
        } else {
            el.attr('title', makeFileTitle(data.filename, data.filesize, data.datetime));
        }
    }
    self.plugin.filemanagerDialog = function (options) {
        var width = K.undef(options.width, 650),
            height = K.undef(options.height, 510),
            dirName = K.undef(options.dirName, ''),
            viewType = K.undef(options.viewType, 'VIEW').toUpperCase(), // "LIST" or "VIEW"
            clickFn = options.clickFn;
        var html = [
            '<div style="padding:10px 20px;">',
        // header start
            '<div class="ke-plugin-filemanager-header">',
        // left start
            '<div class="ke-left">',
            '<img class="ke-inline-block" name="moveupImg" src="' + imgPath + 'go-up.gif" width="16" height="16" border="0" alt="" /> ',
            '<a class="ke-inline-block"  name="moveupLink" href="javascript:;">' + lang.moveup + '</a>',
            '<div style="display:none;" class="ke-inline-block" name="refreshLink" id="fileRefresh">刷新</div>',
            '</div>',
        // right start
            '<div class="ke-right">',
            lang.viewType + ' <select class="ke-inline-block" name="viewType">',
            '<option value="VIEW">' + lang.viewImage + '</option>',
            '<option value="LIST">' + lang.listImage + '</option>',
            '</select> ',
            lang.orderType + ' <select class="ke-inline-block" name="orderType">',
            '<option value="NAME">' + lang.fileName + '</option>',
            '<option value="SIZE">' + lang.fileSize + '</option>',
            '<option value="TYPE">' + lang.fileType + '</option>',
            '</select>',
            '</div>',
            '<div class="ke-clearfix"></div>',
            '</div>',
        // body start
            '<div class="ke-plugin-filemanager-body"></div>',
            '</div>'
        ].join('');
        var dialog = self.createDialog({
            name: name,
            width: width,
            height: height,
            title: self.lang(name),
            body: html
        }),
        div = dialog.div,
        bodyDiv = K('.ke-plugin-filemanager-body', div),
        moveupImg = K('[name="moveupImg"]', div),
        moveupLink = K('[name="moveupLink"]', div),
        refreshLink = K('[name="refreshLink"]', div),
        viewServerBtn = K('[name="viewServer"]', div),
        viewTypeBox = K('[name="viewType"]', div),
        orderTypeBox = K('[name="orderType"]', div);
        function reloadPage(path, order, func) {
            var param = 'path=' + path + '&order=' + order + '&dir=' + dirName;
            dialog.showLoading(self.lang('ajaxLoading'));
            K.ajax(K.addParam(fileManagerJson, param + '&' + new Date().getTime()), function (data) {
                dialog.hideLoading();
                func(data);
            });
        }
        var elList = [];
        function bindEvent(el, result, data, createFunc) {
            var fileUrl = K.formatUrl(result.current_url + data.filename, 'absolute'),
                dirPath = encodeURIComponent(result.current_dir_path + data.filename + '/');
            if (data.is_dir) {
                el.click(function (e) {
                    reloadPage(dirPath, orderTypeBox.val(), createFunc);
                });
            } else if (data.is_photo) {
                el.click(function (e) {
                    clickFn.call(this, fileUrl, data.filename);
                });
            } else {
                el.click(function (e) {
                    clickFn.call(this, fileUrl, data.filename);
                });
            }
            elList.push(el);
        }
        function createCommon(result, createFunc) {
            // remove events
            K.each(elList, function () {
                this.unbind();
            });
            moveupLink.unbind();
            refreshLink.unbind();
            viewTypeBox.unbind();
            orderTypeBox.unbind();
            // add events
            refreshLink.click(function(){
            	reloadPage(result.current_dir_path, orderTypeBox.val(), createFunc);
            });
            if (result.current_dir_path) {
                moveupLink.click(function (e) {
                    reloadPage(result.moveup_dir_path, orderTypeBox.val(), createFunc);
                });
                
            }
            function changeFunc() {
                if (viewTypeBox.val() == 'VIEW') {
                    reloadPage(result.current_dir_path, orderTypeBox.val(), createView);
                } else {
                    reloadPage(result.current_dir_path, orderTypeBox.val(), createList);
                }
            }
            viewTypeBox.change(changeFunc);
            orderTypeBox.change(changeFunc);
            bodyDiv.html('');
        }
        function createList(result) {
            createCommon(result, createList);
            var table = document.createElement('table');
            table.className = 'ke-table';
            table.cellPadding = 0;
            table.cellSpacing = 0;
            table.border = 0;
            bodyDiv.append(table);
            var fileList = result.file_list;
            for (var i = 0, len = fileList.length; i < len; i++) {
                var data = fileList[i], row = K(table.insertRow(i));
                row.mouseover(function (e) {
                    K(this).addClass('ke-on');
                })
                .mouseout(function (e) {
                    K(this).removeClass('ke-on');
                });
                var iconUrl = imgPath + (data.is_dir ? 'folder-16.gif' : 'file-16.gif'),
                    img = K('<img src="' + iconUrl + '" width="16" height="16" alt="' + data.filename + '" align="absmiddle" />'),
                    cell0 = K(row[0].insertCell(0)).addClass('ke-cell ke-name').append(img).append(document.createTextNode(' ' + data.filename));
                if (!data.is_dir || data.has_file) {
                    row.css('cursor', 'pointer');
                    cell0.attr('title', data.filename);
                    bindEvent(cell0, result, data, createList);
                } else {
                    cell0.attr('title', lang.emptyFolder);
                }
                K(row[0].insertCell(1)).addClass('ke-cell ke-size').html(data.is_dir ? '-' : Math.ceil(data.filesize / 1024) + 'KB');
                K(row[0].insertCell(2)).addClass('ke-cell ke-datetime').html(data.datetime);
            }
        }
        function createView(result) {
        	curPath=result.current_dir_path;
            createCommon(result, createView);
            var fileList = result.file_list;
            for (var i = 0, len = fileList.length; i < len; i++) {
                var data = fileList[i],
                    div = K('<div class="ke-inline-block ke-item"  style="position:relative;"></div>');
                bodyDiv.append(div);
                //                var photoDiv = K('<div class="ke-inline-block ke-photo"></div>')
                //                    .mouseover(function(e) {
                //                        K(this).addClass('ke-on');
                //                    })
                //                    .mouseout(function(e) {
                //                        K(this).removeClass('ke-on');
                //                    });
                var photoDiv = K('<div class="ke-inline-block ke-photo"></div>');
                div.append(photoDiv);
                div.mouseover(function (e) {
                    K(this).children().eq(0).addClass('ke-on');
                    //data.is_photo &&
                    K(this).children().eq(2).css("display", "block");
                })
                .mouseout(function (e) {
                    K(this).children().eq(0).removeClass('ke-on');
                    //data.is_photo && 
                    K(this).children().eq(2).css("display", "none");
                });
                //div.append(photoDiv);
                var fileUrl = result.current_url + data.filename,
                    iconUrl = data.is_dir ? imgPath + 'folder-64.gif' : (data.is_photo ? fileUrl : imgPath + 'file-64.gif');
                var img = K('<img src="' + iconUrl + '" width="80" height="80" alt="' + data.filename + '" />');
                if (!data.is_dir || data.has_file) {
                    photoDiv.css('cursor', 'pointer');
                    bindTitle(photoDiv, data);
                    bindEvent(photoDiv, result, data, createView);
                } else {
                    photoDiv.attr('title', lang.emptyFolder);
                }
                photoDiv.append(img);
                div.append('<div class="ke-name" title="' + data.filename + '">' + data.filename + '</div>');
               // if (data.is_photo) {//如果是图片
                    var _span = K('<span class="xl_span" path="'+result.current_url + data.filename+'" data-url="' + K.formatUrl(result.current_url + data.filename, 'absolute') + '" style="position:absolute;display:none;width:102px;background:#0690d2;color:#FFF;text-align:center; cursor: pointer;line-height:20px;bottom:-3px;left:0;">删除</span>');
                    div.append(_span);
                //}
            }
            K(".xl_span").click(function () {
                var $this = K(this);
                if (!confirm("确定删除？")) {
                    return false;
                }
                $.post(rootPath+'/file/delImg', { url: $this.attr("path")}, function (res) {
                    res.ok? $this.parent().remove() : alert("删除失败");
                    if (K(".ke-plugin-filemanager-body").children().length < 1) { K(".ke-plugin-filemanager-body").html("没有文件") }
                })
            })
        }
        viewTypeBox.val(viewType);
        reloadPage('', orderTypeBox.val(), viewType == 'VIEW' ? createView : createList);
        return dialog;
    }

});