var editor = null;

$(function() {

	$("#cancelBtn").click(function() {
		window.parent.window.art.dialog({
			id : 'bullEditDialog'
		}).close();
	});
	$("#addBtn").click(
			function() {
				var oldUrls = "";
				var oldNames = "";
				$("#oldAttachs").find(".attachFlag").each(function() {
					if ($(this).text().length > 0) {
						if (oldNames.length > 0) {
							oldNames += "&&";
							oldUrls += "&&";
						}
						oldNames += $(this).text();
						oldUrls += $(this).attr("myhref");
					}
				});
				var id = art.dialog.data('id');
				$("INPUT[name=id]").val(id);
				$("INPUT[name=oldNames]").val(oldNames);
				$("INPUT[name=oldUrls]").val(oldUrls);
				$("textarea[name=content]").text(editor.html());
				if (editor.html().length <= 0) {
					alert("公告内容不能为空！");
					return;
				}
				if ($("INPUT[name='bullName']").val().length <= 0) {
					alert("公告标题不能为空！");
					return;
				}
				$("INPUT[name='file']").each(
						function() {
							$(this).next().val(
									$(this).val()
											.substring(
													$(this).val().lastIndexOf(
															"\\") + 1));
						});
				$("#bullForm").submit();
			});
});

KindEditor.ready(function(K) {
			editor = K.create('textarea[name="content"]', {
				autoHeightMode : true,
				uploadJson : $("#ctx").val()
						+ '/bullManagement/bullManager_uploadfile.action',
				filePostName : 'image',
				afterCreate : function() {
					this.loadPlugin('autoheight');
				}
			});

			var id = art.dialog.data('id');
			if (null != id && id.length > 0) {
				var bullName = art.dialog.data('bullName');
				var isTop = art.dialog.data('isTop');
				var isManage = art.dialog.data('isManage');
				var isShow = art.dialog.data('isShow');
				var content = art.dialog.data('content');
				var attachmentsUrl = art.dialog.data('attachmentsUrl');
				var attachmentsNames = art.dialog.data('attachmentsNames');
				var isAlert = art.dialog.data('isAlert');
				// 初始化
				$("#bullName").val(bullName);
				$("INPUT[name=oldUrls0]").val(attachmentsUrl);
				if (isTop == '1') {
					$("#isTop").val('1');
					$("#isTop").find("option[value='1']")
							.attr("selected", true);
				} else {
					$("#isTop").val('0');
					$("#isTop").find("option[value='0']")
							.attr("selected", true);
				}
				if (isShow == '1') {
					$("#isShow").val('1');
					$("#isShow").find("option[value='1']").attr("selected",
							true);
				} else {
					$("#isShow").val('0');
					$("#isShow").find("option[value='0']").attr("selected",
							true);
				}
				if (isManage == '1') {
					$("#isManage").val('1');
					$("#isManage").find("option[value='1']").attr("selected",
							true);
				} else {
					$("#isManage").val('0');
					$("#isManage").find("option[value='0']").attr("selected",
							true);
				}
				if (isAlert == '1') {
					$("#isAlert").val('1');
					$("#isAlert").find("option[value='1']")
							.attr("selected", true);
				} else {
					$("#isAlert").val('0');
					$("#isAlert").find("option[value='0']")
							.attr("selected", true);
				}
				editor.html(content);

				if (attachmentsNames.length > 0) {
					var atts = attachmentsNames.split("&&");
					var attUrls = attachmentsUrl.split("&&");
					var i = atts.length;
					i = i > attUrls.length ? attUrls.length : i;
					var oa = "";
					for (var j = 0; j < i; j++) {
						oa += "<a target='_blank' class='attachFlag' myhref='"
								+ attUrls[j]
								+ "' href='"
								+ $("#ctx").val()
								+ "/bullManagement/bullManager_downfile.action?downUrl="
								+ attUrls[j]
								+ "&downName="
								+ encodeURI(encodeURI(atts[j]))
								+ "' >"
								+ atts[j]
								+ "</a>&nbsp;<a href='javascript:void(0);' onclick='deleteOldAttach(this)' >删除</a><br/>";
					}
					$("#oldAttachs").empty().append($(oa));
				}

			}
		});
function addMore() {
	var $files = $("#files");
	var f = '<input class="default-text-input wper60" style="margin:5px;" id="file" name="file"  type="file" /><input type="hidden" name="fileName" /><a href="javascript:void(0);" onclick="deleteThis(this)">删除</a><br/>';
	$files.append($(f));
}
function deleteThis(t) {
	$(t).prev().prev().remove();
	$(t).prev().remove();
	$(t).next().remove();
	$(t).remove();
}
function deleteOldAttach(t) {
	$(t).prev().prev().remove();
	$(t).prev().remove();
	$(t).next().remove();
	$(t).remove();
}