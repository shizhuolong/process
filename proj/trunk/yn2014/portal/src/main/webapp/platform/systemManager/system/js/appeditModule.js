

//添加模型信息
var currentNode;
var currentId="-1";
var currentName="功能菜单";

var modulePropertyCriteriaPre="parentModule.id:eq:";
var propertyCriteria=modulePropertyCriteriaPre+currentId;
var rootPropertyCriteria="parentModule.english:eq:root";

var securityNamespace = 'systemManager/system';
var namespace='module';
var action='app-module';

var treeDataUrl=contextPath+'/'+namespace+'/'+action+'!query.action';
        

//新增菜单
CreateModel = function() {
    return {
        getItems: function() {
             var items = [{
                        layout: 'form',
                        defaults: {
                            anchor:"90%"
                        },
                        items:[{
                                    xtype:'textfield',
                                    readOnly:true,
                                    disabled:true,
                                    fieldClass:'detail_field',
                                    value:currentName,
                                    fieldLabel: '上级模块'
                                },{
                                    xtype:'textfield',
                                    inputType:'hidden',
                                    name:'model.parentModule.id',
                                    value:currentId
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.english',
                                    maxLength:50,
                                    fieldLabel: '模块KEY',
                                    allowBlank: false,
                                    blankText : '模块KEY不能为空'
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.url',
                                    maxLength:200,
                                    fieldLabel: '应用地址'
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.chinese',
                                    maxLength:50,
                                    fieldLabel: '模块中文名称',
                                    allowBlank: false,
                                    blankText : '中文名称不能为空'
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.orderNum',
                                    maxLength:50,
                                    fieldLabel: '模块顺序',
                                    allowBlank: false,
                                    blankText : '顺序不能为空'
                                }]
                }];
            return items;
        },
        show: function() {
        	 CreateBaseModel.shouldSubmit=function(){
                 /*var password=parent.Ext.getCmp('password').getValue();
                 var confirmPassword=parent.Ext.getCmp('confirmPassword').getValue();
                 if(confirmPassword!=password){
                     parent.Ext.MessageBox.alert('提示', "密码输入不一致");
                     return false;
                 }else{
                     parent.Ext.getCmp('roles').setValue(roleSelector.getValue());
                     parent.Ext.getCmp('positions').setValue(positionSelector.getValue());
                     parent.Ext.getCmp('userGroups').setValue(userGroupSelector.getValue());
                     return true;
                 }*/
        		 return true;
             };
             CreateBaseModel.createSuccess=function(form, action){
            	 GridBaseModel.refresh();
            	 TreeModel.refreshTree(true);
             };
            CreateBaseModel.show( '新增菜单', 'editModule', 500, 300, this.getItems());
        }
    };
} ();

ModifyModel = function() {
    return {
        show: function(model) {
    		ModuleModifyModel.show(model,true);
        }
    };
} ();
//修改模块
ModuleModifyModel = function() {
    return {
        getItems: function(model) {
             var items = [{
                        layout: 'form',
                        defaults: {
                            anchor:"90%"
                        },
                        items:[{
                                    xtype:'textfield',
                                    readOnly:true,
                                    disabled:true,
                                    fieldClass:'detail_field',
                                    value: model.parentModule_chinese,
                                    fieldLabel: '上级模块'
                                },{
                                    xtype:'textfield',                                 
                                    cls : 'attr',
                                    name: 'model.english',
                                    value: model.english,
                                    maxLength:50,
                                    fieldLabel: '模块KEY',
                                    allowBlank: false,
                                    blankText : '模块KEY不能为空'
                                },{
                                    xtype:'textfield',                                  
                                    cls : 'attr',
                                    name: 'model.url',
                                    value: model.url,
                                    maxLength:200,
                                    fieldLabel: '应用地址'     
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.chinese',
                                    value: model.chinese,
                                    maxLength:50,
                                    fieldLabel: '模块中文名称',
                                    allowBlank: false,
                                    blankText : '中文名称不能为空'
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.orderNum',
                                    value: model.orderNum,
                                    maxLength:50,
                                    fieldLabel: '模块顺序',
                                    allowBlank: false,
                                    blankText : '顺序不能为空'
                                }, {
                                    xtype: 'combo',
                                    store:new Ext.data.SimpleStore({  
                                    	fields : ['name', 'code'],  
                                    	data : [['true',true], ['false',false]]}),
                                    displayField : "name",  
                                    valueField : "code",  
                                    triggerAction:'all',
                                    cls : 'attr',
                                    hiddenName: 'model.display',
                                    value: model.display,
                                    fieldLabel: '是否显示',
                                    mode : 'local' 
                                }]
                }];
            return items;
        },

        show: function(model,forceRefreshParentNode) {
            ModifyBaseModel.modifySuccess=function(form, action){
            	 //刷新表格
                GridBaseModel.refresh();
                //刷新树
                TreeModel.refreshTree(forceRefreshParentNode);
            };
            ModifyBaseModel.show( '修改模块', 'editModule', 500, 300, this.getItems(model),model);
        }
    };
} ();
//表格
GridModel = function() {
    return {
        getFields: function(){
            var fields=[
                            {name: 'id'},
			 				{name: 'version'},
							{name: 'chinese'},
							{name: 'english'},
							{name: 'orderNum'},
							{name: 'display'}
                    ];
           return fields;     
        },
        getColumns: function(){
            var columns=[
                            {header: "编号", width: 20, dataIndex: 'id', sortable: true},
			 				{header: "版本", width: 20, dataIndex: 'version', sortable: true},
							{header: "中文名称", width: 20, dataIndex: 'chinese', sortable: true,editor:new Ext.form.TextField()},
							{header: "模块KEY", width: 20, dataIndex: 'english', sortable: true},
							{header: "顺序号", width: 20, dataIndex: 'orderNum', sortable: true,editor:new Ext.form.TextField()},
							{header: "是否显示", width: 20, dataIndex: 'display', sortable: true} 
						];
            return columns;           
        },
        getGrid: function(){
        	var pageSize=14;

            //修改单个属性回调
            GridBaseModel.updateAttrSuccess=function(response, opts){
                GridBaseModel.refresh();
                TreeModel.refreshTree(false);
            };    
            //添加特殊参数
            GridBaseModel.storeURLParameter="?orderCriteria=orderNum:ASC";
            if(currentId==-1){
                GridBaseModel.propertyCriteria=rootPropertyCriteria;
                GridBaseModel.loadStore=function(){
                    //不加载表格
                }
            }else{
                GridBaseModel.propertyCriteria=propertyCriteria;
            }
            GridBaseModel.setStoreBaseParams=function(store){
                store.on('beforeload',function(store){
                   store.baseParams = {propertyCriteria:GridBaseModel.propertyCriteria};
                });
            };
            //删除数据命令回调
            GridBaseModel.removeSuccess=function(response,opts){
                GridBaseModel.refresh();
                TreeModel.refreshTree(false);
            };  
            var commands=["create","updatePart","delete"];
            var tips=['新增(C)','修改(U)','删除(R)'];
            var callbacks=[GridBaseModel.create,GridBaseModel.modify,GridBaseModel.remove];

            var grid=GridBaseModel.getGrid(contextPath, namespace, action, pageSize, this.getFields(), this.getColumns(), commands, tips, callbacks,securityNamespace);

            //设置标题
            grid.setTitle(" ");

            return grid;
        }
    }
} ();
//左部树
TreeModel = function(){
    return{
        getTreeWithContextMenu: function(){
            TreeBaseModel.onClick=this.onClick;
            TreeBaseModel.remove=this.remove;
            TreeBaseModel.modify=this.modify;    

            var create=true;
            var remove=true;
            var modify=true;
            var tree = TreeBaseModel.getTreeWithContextMenu(treeDataUrl+"?node=null", '功能菜单', 'root', 'module', create, remove, modify);
            currentNode=TreeBaseModel.root;
            return tree;
        },
        //当forceRefreshParentNode为true时表示需要强制刷新父节点
        refreshTree: function(forceRefreshParentNode){
        	if(!currentNode.isExpandable()){
                //当前节点是叶子节点（新添加的节点是当前节点的第一个子节点）
                if(currentNode.parentNode==null){
                    TreeBaseModel.root.reload();
                    TreeBaseModel.root.expand(false, true);
                }else{
                    //重新加载当前节点的父节点，这样才能把新添加的节点装载进来
                    currentNode.parentNode.reload(
                        // node loading is asynchronous, use a load listener or callback to handle results
                        function(){
                            //重新查找当前节点，因为已经重新加载过数据
                            currentNode=TreeBaseModel.tree.getNodeById(currentId);
                            //展开当前节点
                            currentNode.expand(false, true);
                        },
                    this);
                }
            }else{
                //重新加载当前节点
                currentNode.reload(
                    // node loading is asynchronous, use a load listener or callback to handle results
                    function(){
                        //展开当前节点
                        currentNode.expand(false, true);
                    },
                this);
            }
        },
        select: function(node,event){
            node.expand(false, true);
            currentNode=node;
            currentId=node.id.split("-")[1];
            currentName=node.text;
            GridBaseModel.grid.setTitle("已选中【"+currentName+"】");
            propertyCriteria=modulePropertyCriteriaPre+currentId;
            GridBaseModel.propertyCriteria=propertyCriteria;
        },
        onClick: function(node, event) {
            TreeModel.select(node, event);
            GridBaseModel.refresh();
        },
        remove: function() {
                if(currentNode.parentNode==TreeBaseModel.tree.getRootNode()){
                    parent.Ext.ux.Toast.msg('操作提示：','不能删除根节点');  
                    return;
                }
                //在删除当前节点之前记住父节点
                var parentNode=currentNode.parentNode;
                Ext.MessageBox.confirm("请确认","确实要删除【"+currentName+"】吗？",function(button,text){
                    if(button == "yes"){
                        parent.Ext.Ajax.request({
                            url : GridBaseModel.deleteURL+'?time='+new Date().toString(),
                            params : {
                                ids : currentId
                            },
                            method : 'POST',
                            success: function(response,options){
                                var data=response.responseText;
                                if("删除成功"==data){
                                    TreeModel.select(parentNode);
                                    GridBaseModel.refresh();
                                    TreeModel.refreshTree(true);
                                }else{
                                    parent.Ext.MessageBox.alert('提示', "删除失败！");
                                }
                            },
                            failure: function() {
                                alert("删除失败！");
                            }
                        });
                    }
                });
            },
        modify: function() {
                if(currentNode.parentNode==TreeBaseModel.tree.getRootNode()){
                    parent.Ext.ux.Toast.msg('操作提示：','不能修改根节点');  
                    return;
                }
                Ext.MessageBox.confirm("请确认","确实要修改【"+currentNode.text+"】吗？",function(button,text){
                    if(button == "yes"){
                        //query role detail info
                        parent.Ext.Ajax.request({
                                url : GridBaseModel.retrieveURL+currentId+'&time='+new Date().toString(),
                                method : 'POST',
                                success : function(response,options){
                                    var data=response.responseText;
                                    //返回的数据是对象，在外层加个括号才能正确执行eval
                                    var model=eval('(' + data + ')');
                                    ModifyModel.show(model,true);
                                }
                        });
                    }
                });
            }
    }
}(); 
//左边为树右边为表格的编辑视图
EditModuleForm = function() {
    return {
        show: function() {
                 var frm = new Ext.Viewport({
                    layout : 'border',
                    items: [
                        TreeModel.getTreeWithContextMenu(),
                        {
                            region:'center',
                            autoScroll:true,
                            layout: 'fit',
                            items:[GridModel.getGrid()]
                        }
                    ]
                });
        }
    };
} ();

Ext.onReady(function(){
    EditModuleForm.show();
});