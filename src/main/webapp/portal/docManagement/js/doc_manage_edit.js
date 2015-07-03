		
		$(function(){
			var id=art.dialog.data('id');
			if(null!=id&&id.length>0){
				var description=art.dialog.data('DESCRIPTION');
				var oldName=art.dialog.data('OLDNAME');
				var isValid=art.dialog.data('ISVALID');
				var newName=art.dialog.data('NEWNAME');
				// 初始化
				$("#oldName0").val(oldName);
				$("#id").val(id);
				$("#oldName").val(oldName);
				$("#description").val(description);
				$("INPUT[name=newName]").val(newName);
				if(isValid=='1'){
					$("#isValid").val('1');
					$("#isValid").find("option[value='1']").attr("selected",true);
				}else{
					$("#isValid").val('0');
					$("#isValid").find("option[value='0']").attr("selected",true);
				}
			}
			
			$("#cancelBtn").click(function(){
				window.parent.window.art.dialog({ id: 'docDialog' }).close();
			});
			$("#addBtn").click(function(){
				
				if($("INPUT[type='file']").val().length<=0&&(id==null||id.length<=0)){
					alert("请选择文件");
					return;
				}
				var fileName=$("INPUT[type='file']").val().substring($(this).val().lastIndexOf("\\")+1);
				var suffix=fileName.substring(fileName.lastIndexOf(".")+1);
				var allow="zip,rar,gz,tar,apk,pxl,ipa,doc,docx,xlsx,xls,txt,ppt,pptx,pdf,png,jpg,gif";
				if(allow.lastIndexOf(suffix)<0){
					alert(suffix+"类型的文件不允许上传,请选择允许的文件类型");
					return;
				}
				$("#oldName").val(fileName);
				$("#docForm").submit();
			});
		});
		
		
		