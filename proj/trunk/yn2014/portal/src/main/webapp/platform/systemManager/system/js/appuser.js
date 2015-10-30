

//orgId==1代表为根节点，不加过滤条件
var orgId="1";
var rootNodeID="root";
var rootNodeText="中国联通云南分公司";
var subordinate = false;

var securityNamespace = 'systemManager/system';
var namespace='security';
var action='user';
var treeId = '1001';

var roleSelector;
var moduleSelector;


//本页面特殊URL
var selectOrgStoreURL=contextPath+'/security/org!store.action?treeId=';
var selectRoleStoreURL=contextPath + '/security/app-role!query.action?recursion=true';
var selectModuleURL=contextPath + '/module/app-module!query.action?node=null&privilege=true&recursion=true';
//高级搜索
AdvancedSearchModel = function() {
    return {
        //搜索表单
        getItems : function(){
            var items=[{
                            xtype: 'textfield',
                            id:'search_username',
                            fieldLabel: '账号'
                        },
                        {
                            xtype: 'textfield',
                            id:'search_realName',
                            fieldLabel: '姓名'
                        },
                        {
                            xtype: 'checkbox',
                            id:'search_subordinate',
                            fieldLabel: '查询下级区域'
                        }
                    ];
            return items;
        },
        //点击搜索之后的回调方法
        callback : function(){               
                var data=[];
                var criteria=[];

                var search_username=parent.Ext.getCmp('search_username').getValue();
                if(search_username!=""){
                	criteria.push('username:eq:'+search_username);
                    search_username=' +username:'+search_username;
                    data.push(search_username);
                }

                var search_realName=parent.Ext.getCmp('search_realName').getValue();
                if(search_realName!=""){
                	criteria.push('realName:like:%'+search_realName+'%');
                    search_realName=' +realName:'+search_realName;
                    data.push(search_realName);
                }
                var search_subordinate=parent.Ext.getCmp('search_subordinate').getValue();
                subordinate = search_subordinate;

                AdvancedSearchBaseModel.search(data, "User",criteria);
        },
        
        show: function() {
            AdvancedSearchBaseModel.show('高级搜索',"user", 420, 170, this.getItems(), this.callback);
        }
    };
} ();

//修改模型信息
ModifyModel = function() {
    return {
        getItems: function(model) {
	    	var roleLoader = new parent.Ext.tree.TreeLoader({
	            dataUrl:selectRoleStoreURL
	        });
            var moduleLoader = new parent.Ext.tree.TreeLoader({
                dataUrl:selectModuleURL
            });
            roleSelector = new parent.Ext.ux.tree.CheckTreePanel({
                        title : '',
                        id : "roleSelector",
                        deepestOnly:'true',
                        rootVisible : false,
                        loader : roleLoader,
                        root : new Ext.tree.AsyncTreeNode({
                            text:'角色',
                            id : 'root',
                            expanded : true
                        })
             });
            roleSelector.reset=function(){
                this.clearValue();
            };
            roleLoader.on("load",function(){
                //在数据装载完成并展开树之后再设值
                roleSelector.getRootNode().expand(true,true);
                if(model.roles!=undefined && model.roles.toString().length>1){
                    roleSelector.setValue(model.roles);
				}
				roleSelector.bubbleCheck = 'none';
				roleSelector.cascadeCheck = 'all';
			});

			moduleSelector = new parent.Ext.ux.tree.CheckTreePanel( {
				title : '',
				id : "moduleSelector",
				deepestOnly : 'true',
				rootVisible : false,
				loader : moduleLoader,
				root : new Ext.tree.AsyncTreeNode( {
					text : '功能菜单',
					id : 'root',
					expanded : true
				})
			});
			moduleSelector.reset = function() {
				this.clearValue();
			};
			moduleLoader.on("load", function() {
					// 在数据装载完成并展开树之后再设值
					moduleSelector.getRootNode().expand(true, true);
					if (model.modules != undefined
							&& model.modules.toString().length > 1) {
						moduleSelector.setValue(model.modules);
					}
				
					moduleSelector.bubbleCheck = 'none';
					moduleSelector.cascadeCheck = 'all';
			});
            
            var items=[{
                            layout: 'form',
                            items:[

                                   {
                                        xtype: 'fieldset',
                                        id:'roleSelectorSet',
                                        title: '选择角色',
                                        collapsible: true,
                                        items: [roleSelector,{
                                            xtype: 'textfield',
                                            name: 'roles',
                                            id:'roles',
                                            hidden: true,
                                            hideLabel:true
                                        }]
                                    },
                                    {
                                        xtype: 'fieldset',
                                        id:'moduleSelectorSet',
                                        title: '选择模块',
                                        collapsible: true,
                                        items: [moduleSelector,{
                                            xtype: 'textfield',
                                            name: 'modules',
                                            id:'modules',
                                            hidden: true,
                                            hideLabel:true
                                        }]
                                    }
                                  ]
            }];
            return items;
        },

        show: function(model) {
            ModifyBaseModel.prepareSubmit=function() {
                parent.Ext.getCmp('roles').setValue(roleSelector.getValue());
                parent.Ext.getCmp('modules').setValue(moduleSelector.getValue());
                GridBaseModel.changeURL(contextPath, namespace, "app-user");
            }
            ModifyBaseModel.close=function(){
            	GridBaseModel.changeURL(contextPath, namespace, action);
            	this.dlg.close();
            }
            ModifyBaseModel.show('App权限划分', 'appUser', 800, 410, this.getItems(model),model);
        }
        
    };
} ();

//表格
GridBaseModel.modify=function(){
    var idList=GridBaseModel.getIdList();
    if(idList.length<1){
        parent.Ext.ux.Toast.msg('操作提示：','请选择要进行操作的记录');  
        return ;
    }
    if(idList.length==1){
        var id=idList[0];

        parent.Ext.Ajax.request({
            url : contextPath+'/'+namespace+'/app-user!retrieve.action?model.id='+id+GridBaseModel.extraModifyParameters()+'&time='+new Date().toString(),
            waitTitle: '请稍等',
            waitMsg: '正在检索数据……',
            method : 'POST',
            success : function(response,options){
                var data=response.responseText;
                //返回的数据是对象，在外层加个括号才能正确执行eval
                var model=eval('(' + data + ')');
                ModifyModel.show(model);
            }
        });
    }else{
        parent.Ext.ux.Toast.msg('操作提示：','只能选择一个要进行操作的记录！');  
    }
}
GridModel = function() {
    return {
        getFields: function(){
            var fields=[
			{name: 'id'},
			//{name: 'version'},
			{name: 'username'},
			{name: 'realName'},
			{name: 'phone'},
			{name: 'email'},
			{name: 'hrId'},
			{name: 'enabled'},
			{name: 'orgName'}
			//{name: 'roles'},
			//{name: 'positions'},
			//{name: 'des'}
		];
           return fields;     
        },
        getColumns: function(){
            var columns=[
			{header: "编号", width: 10, dataIndex: 'id', sortable: true},
			//{header: "版本", width: 10, dataIndex: 'version', sortable: true},
			{header: "账号", width: 20, dataIndex: 'username', sortable: true},
			{header: "姓名", width: 20, dataIndex: 'realName', sortable: true},
			{header:"联系电话", width: 20, dataIndex: 'phone', sortable: true},
			{header:"邮箱", width: 40, dataIndex: 'email', sortable: true},
			{header: "hr编码", width: 20, dataIndex: 'hrId', sortable: true},
			{header: "状态", width: 20, dataIndex: 'enabled', sortable: true},
            {header: "组织架构", width: 40, dataIndex: 'orgName', sortable: true}
			//{header: "拥有角色", width: 40, dataIndex: 'roles', sortable: true}
			//{header: "拥有岗位", width: 40, dataIndex: 'positions', sortable: true},
			//{header: "描述", width: 40, dataIndex: 'des', sortable: true,editor:new Ext.form.TextField()}
                        ];
            return columns;           
        },
        getGrid: function(){
            var pageSize=17;
            
            //添加特殊参数
            GridBaseModel.orgId=orgId;
            GridBaseModel.setStoreBaseParams=function(store){
                store.on('beforeload',function(store){
                   store.baseParams = {queryString:GridBaseModel.queryString,search:GridBaseModel.search,orgId:GridBaseModel.orgId,propertyCriteria:GridBaseModel.propertyCriteria,subordinate:subordinate};
                });
            };
            
            var commands=["updatePart","search"];
            var tips=['配置权限(C)','搜索(S)'];
            var callbacks=[GridBaseModel.modify,GridBaseModel.advancedsearch];
        
            var grid=GridBaseModel.getGrid(contextPath, namespace, action, pageSize, this.getFields(), this.getColumns(), commands,tips,callbacks,securityNamespace);   
     
            //设置标题
            grid.setTitle("已选中【"+rootNodeText+"】");
            
            return grid;
        }
    }
} ();
//左部树
TreeModel = function(){
    return{
        getTree: function(){
            TreeBaseModel.onClick=this.onClick;
            return TreeBaseModel.getTree(selectOrgStoreURL+treeId,rootNodeText,'root','user');
        },
        onClick: function(node, event) {
            node.expand(false, true);
            var id=node.id;
            var name=node.text;
            TreeModel.change(id,name);
            
            GridBaseModel.search=false;
            GridBaseModel.queryString="";
            GridBaseModel.propertyCriteria = "";
            subordinate = false;
            GridBaseModel.refresh();
        },
        change: function(id,name) {
            orgId=id;
            rootNodeID=id;
            rootNodeText=name;
            GridBaseModel.grid.setTitle('已选中【'+rootNodeText+'】');
            GridBaseModel.orgId=orgId;
            //只要点击左边的树就自动退出搜索模式
            GridBaseModel.search=false;
        }  
    }
}();
//树和表格
UserPanel = function() {
    return {
        show: function() {
        	 var tree=TreeModel.getTree();
             var frm = new Ext.Viewport({
                layout : 'border',
                items: [
                    {
                        region:'west',
                        width : 200,
                        labelWidth : 40,
                        labelAlign : 'right',
                        layout : 'form',
                        items:[
                                tree
                        ]
                    },
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
    UserPanel.show();
});