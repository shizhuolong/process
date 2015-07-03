

//添加模型信息
var currentNode;
var currentId="-1";
var currentName="功能菜单";

var modulePropertyCriteriaPre="parentModule.id:eq:";
var commandPropertyCriteriaPre="module.id:eq:";
var propertyCriteria=modulePropertyCriteriaPre+currentId;
var rootPropertyCriteria="parentModule.english:eq:root";

var securityNamespace = 'systemManager/system';
var namespace='module';
var action='edit-module';

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
                                    value:currentId.substr(7)
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.english',
                                    maxLength:50,
                                    fieldLabel: '模块英文名称',
                                    allowBlank: false,
                                    blankText : '英文名称不能为空'
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
            	 currentNode.parentNode.reload();
                 GridBaseModel.refresh();
             };
            CreateBaseModel.show( '新增菜单', 'editModule', 500, 300, this.getItems());
        }
    };
} ();

ModifyModel = function() {
    return {
        show: function(model) {
                if(action=='edit-module'){
                    ModuleModifyModel.show(model,true);
                }
                if(action=='edit-command'){
                    CommandModifyModel.show(model,true);
                }
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
                                    fieldLabel: '模块英文名称',
                                    allowBlank: false,
                                    blankText : '英文名称不能为空'
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

        show: function(model) {
            ModifyBaseModel.modifySuccess=function(form, action){
                TreeModel.refreshTree();
                GridBaseModel.refresh();
            };
            ModifyBaseModel.show( '修改模块', 'editModule', 500, 300, this.getItems(model),model);
        }
    };
} ();
//修改命令
CommandModifyModel = function() {
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
                                    value: model.module,
                                    fieldLabel: '父模块'
                                },{
                                    xtype:'textfield',
                                    readOnly:true,
                                    disabled:true,
                                    cls : 'attr',
                                    name: 'model.english',
                                    value: model.english,
                                    maxLength:50,
                                    fieldLabel: '命令英文名称'
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.chinese',
                                    value: model.chinese,
                                    maxLength:50,
                                    fieldLabel: '命令中文名称'
                                },{
                                    xtype:'textfield',
                                    cls : 'attr',
                                    name: 'model.orderNum',
                                    value: model.orderNum,
                                    maxLength:50,
                                    fieldLabel: '命令顺序'
                                }]
                }];
            return items;
        },

        show: function(model) {
            ModifyBaseModel.modifySuccess=function(form, action){
                TreeModel.refreshTree();
                GridBaseModel.refresh();
            };
            ModifyBaseModel.show('修改命令', 'editCommand', 500, 200, this.getItems(model),model);
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
				{header: "英文名称", width: 20, dataIndex: 'english', sortable: true},
				{header: "顺序号", width: 20, dataIndex: 'orderNum', sortable: true,editor:new Ext.form.TextField()},
				{header: "是否显示", width: 20, dataIndex: 'display', sortable: true}
                        ];
            return columns;           
        },
        getGrid: function(){
            var pageSize=14;

            //修改单个属性回调
            GridBaseModel.updateAttrSuccess=function(response, opts){
                TreeModel.refreshTree();
                GridBaseModel.refresh();
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
                
            var commands=["create","updatePart"];
            var tips=['新增(C)','修改(U)'];
            var callbacks=[GridBaseModel.create,GridBaseModel.modify];

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
        getTree: function(){
            TreeBaseModel.onClick=this.onClick;
            var tree = TreeBaseModel.getTree(treeDataUrl, currentName, "root", 'module');
            currentNode=TreeBaseModel.root;
            return tree;
        },
        refreshTree: function(){
            //重新加载当前节点
            currentNode.reload();
        },
        select: function(node, event, callback){     
            if(node.id.toString()=='root'){
                GridBaseModel.grid.setTitle("已选中【"+currentName+"】");
                GridBaseModel.propertyCriteria=rootPropertyCriteria;
                GridBaseModel.changeURL(contextPath, namespace, action);
                if(typeof(callback)=='function'){
                    callback();
                }
                return;
            }        
            var type=node.id.toString().split("-")[0];
            var id=node.id.toString().split("-")[1];
            
            //如果当前选择了模块，则需要刷新表格
            //如果当前选中了命令，则忽略刷新表格
            if(type=='module'){
                currentNode=node;                
                currentId=node.id;
                currentName=node.text;
                node.expand(false, true, function(){                    
                    if(currentNode.childNodes[0] && currentNode.childNodes[0].id.toString().split("-")[0]=='command'){
                        //切换到命令
                        action='edit-command';
                        propertyCriteria=commandPropertyCriteriaPre+id;                        
                    }else{
                        //切换到模块
                        action='edit-module';
                        propertyCriteria=modulePropertyCriteriaPre+id;
                    }     
                    GridBaseModel.grid.setTitle("已选中【"+currentName+"】");
                    GridBaseModel.propertyCriteria=propertyCriteria;
                    GridBaseModel.changeURL(contextPath, namespace, action);
                    if(typeof(callback)=='function'){
                        callback();
                    }
                },this);  
            }
        },
        onClick: function(node, event) {   
            TreeModel.select(node, event, function(){
                GridBaseModel.refresh();
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
                        TreeModel.getTree(),
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