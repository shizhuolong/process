

//orgId==1代表为根节点，不加过滤条件
var orgId="1";
var rootNodeID="root";
var rootNodeText="中国联通云南分公司";
var subordinate = false;

var securityNamespace = 'systemManager/system';
var namespace='security';
var action='user';
var treeId = '1001';
var positionRootId = 0;

var roleSelector;
var positionSelector;


//本页面特殊URL
var selectOrgStoreURL=contextPath+'/security/org!store.action?treeId=';
var selectRoleStoreURL=contextPath + '/security/role!store.action?recursion=true';
var selectPositionURL=contextPath + '/security/position!store.action?recursion=false';
var selectUserGroupURL=contextPath + '/security/user-group!store.action';
var resetURL=contextPath+'/'+namespace+'/'+action+'!reset.action';

var positionUrl = contextPath+'/common/commonParam_qryPositionsById.action';
 
var positionStore=new Ext.data.Store({
    proxy : new parent.Ext.data.HttpProxy({
        url : positionUrl+'?parentId='+positionRootId
    }),
    reader: new Ext.data.JsonReader({},
        Ext.data.Record.create([{
            name: 'id'
        },{
            name: 'text'
        }]))
});

var data=[['正式员工','0'],['紧密外包','1'],['派遣人员','2']];
var userTypeStore = new Ext.data.SimpleStore({
	fields: ['text', 'value'],
	data : data
});

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
                        /*new TreeSelector('search_orgName','',selectOrgStoreURL,rootNodeID,rootNodeText,"组织架构名称",'model.org.id','95%'),
                        {
                            xtype:'textfield',
                            name: 'model.org.id',
                            id:'model.org.id',
                            hidden: true,
                            hideLabel:true
                        }*/
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
               /* var search_orgName=parent.Ext.getCmp('search_orgName').getValue();
                if(search_orgName!=""){
                    search_orgName=' +org_orgName:'+search_orgName;
                    data.push(search_orgName);
                }*/

                AdvancedSearchBaseModel.search(data, "User",criteria);
        },
        
        show: function() {
            AdvancedSearchBaseModel.show('高级搜索',"user", 420, 170, this.getItems(), this.callback);
        }
    };
} ();
//添加模型信息
CreateModel = function() {
    return {
        getItems: function() {
            orgSelector=new TreeSelector('model.org.name','',selectOrgStoreURL,rootNodeID,rootNodeText,"组织架构",'model.org.id','95%');
           
            var roleLoader = new parent.Ext.tree.TreeLoader({
                dataUrl:selectRoleStoreURL
            });
            roleSelector = new parent.Ext.ux.tree.CheckTreePanel({
                        title : '',
                        id : "roleSelector",
                        bubbleCheck:'none' ,
                        cascadeCheck:'all',
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
             
            var positionLoader = new parent.Ext.tree.TreeLoader({
                dataUrl:selectPositionURL
            });
            positionSelector = new parent.Ext.ux.tree.CheckTreePanel({
                        title : '',
                        id : "positionSelector",
                        bubbleCheck:'none' ,
                        cascadeCheck:'all',
                        deepestOnly:'true',
                        rootVisible : false,
                        loader : positionLoader,
                        root : new Ext.tree.AsyncTreeNode({
                            text:'岗位',
                            id : 'root',
                            expanded : true
                        })
             });
             positionSelector.reset=function(){
                 this.clearValue();
             };
             var userGroupLoader = new parent.Ext.tree.TreeLoader({
                dataUrl:selectUserGroupURL
            });
            userGroupSelector = new parent.Ext.ux.tree.CheckTreePanel({
                        title : '',
                        id : "userGroupSelector",
                        rootVisible : false,
                        loader : userGroupLoader,
                        root : new Ext.tree.AsyncTreeNode({
                            text:'用户组',
                            id : 'root',
                            expanded : true
                        })
             });
             userGroupSelector.reset=function(){
                 this.clearValue();
             };
             var items=[{
                            layout: 'form',
                            items:[{
                                        xtype: 'fieldset',
                                        id:'baseInfo',
                                        title: '基本信息',
                                        collapsible: true,
                                        defaults: {
                                            allowBlank: false,
                                            anchor: '95%'
                                        },
                                        items: [
                                            {
                                            layout:'column',
                                            defaults: {width: 250},
                                            items:[{
                                                columnWidth:.5,
                                                layout: 'form',
                                                defaultType: 'textfield',
                                                defaults: {
                                                    allowBlank: false,
                                                    anchor:"90%"
                                                },

                                                 items: [{
                                                            cls : 'attr',
                                                            name: 'model.username',
                                                            fieldLabel: '账号',
                                                            blankText : '账号不能为空'
                                                        },
                                                        {
                                                            cls : 'attr',
                                                            name: 'model.realName',
                                                            fieldLabel: '姓名',
                                                            blankText : '姓名不能为空'
                                                        },{
                                                        	cls : 'attr',
                                                            name: 'model.phone',
                                                            fieldLabel: '联系电话',
                                                            blankText : '联系电话不能为空',
                                                            regex:/^((13[0-2])|(145)|(15[5-6])|(18[5-6])|(176)|(166))\d{8}$/,
                                                            regexText:'联系电话格式不正确'
                                                        },
                                                        {
                                                            cls : 'attr',
                                                            name: 'model.hrId',
                                                            fieldLabel: 'hr编码',
                                                            blankText : 'hr编码不能为空'
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            store:userStateStore,
                                                            emptyText:'请选择',
                                                            mode:'remote',
                                                            valueField:'value',
                                                            displayField:'text',
                                                            triggerAction:'all',
                                                            forceSelection: true,
                                                            editable:       false,
                                                            cls : 'attr',
                                                            hiddenName: 'model.enabled',
                                                            fieldLabel: '状态',
                                                            allowBlank: false,
                                                            blankText : '状态不能为空'
                                                        },
                                                        {
                                                        	id:'oaComNameHidden',
                                                        	name:'model.oaComName',
                                                            xtype: 'hidden'
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            store:positionStore,
                                                            emptyText:'请选择',
                                                            mode:'remote',
                                                            valueField:'id',
                                                            displayField:'text',
                                                            triggerAction:'all',
                                                            forceSelection: true,
                                                            editable:       false,
                                                            cls : 'attr',
                                                            hiddenName: 'model.oaComId',
                                                            fieldLabel: '分公司',
                                                            allowBlank: true,
                                                            //blankText : '分公司不能为空',
                                                            listeners : {
                                                                'select' : function(combo,record){
                                                                	parent.Ext.getCmp('oaComNameHidden').setValue(this.getRawValue());
                                                                    var departName = parent.Ext.getCmp('departName');
                                                                    departName.enable();
                                                                    departName.reset();
                                                                    departName.store.proxy = new Ext.data.HttpProxy( {
                                                                        url : positionUrl+'?parentId=' + this.getValue()
                                                                    });
                                                                    departName.store.load();
                                                                }
                                                            }
                                                        },
                                                        {
                                                        	id:'oaJobNameHidden',
                                                        	name:'model.oaJobName',
                                                            xtype: 'hidden'
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            store:new Ext.data.Store( {
                                                                proxy : new Ext.data.HttpProxy( {
                                                                    url : positionUrl
                                                                }),
                                                                reader : new Ext.data.JsonReader({},
                                                                        Ext.data.Record.create([{
                                                                            name: 'id'
                                                                        },{
                                                                            name: 'text'
                                                                        }])
                                                                )
                                                            }),
                                                            id:'jobName',
                                                            emptyText:'请选择',
                                                            mode:'remote',
                                                            valueField:'id',
                                                            displayField:'text',
                                                            triggerAction:'all',
                                                            forceSelection: true,
                                                            editable:       false,
                                                            cls : 'attr',
                                                            hiddenName: 'model.oaJobId',
                                                            fieldLabel: '职位',
                                                            allowBlank: true,
                                                            blankText : '职位不能为空',
                                                            listeners : {
                                                                'select' : function(combo,record){
                                                                	parent.Ext.getCmp('oaJobNameHidden').setValue(this.getRawValue());
                                                                }
                                                            }
                                                        }]
                                            },{
                                                columnWidth:.5,
                                                layout: 'form',
                                                defaultType: 'textfield',
                                                defaults: {
                                                    allowBlank: false,
                                                    anchor:"90%"
                                                },

                                                items: [{
                                                            cls : 'attr',
                                                            id:'password',
                                                            name: 'model.password',
                                                            fieldLabel: '密码',
                                                            blankText : '密码不能为空',
                                                            inputType : 'password'
                                                        },
                                                        {
                                                            cls : 'attr',
                                                            name: 'confirmPassword',
                                                            id: 'confirmPassword',
                                                            fieldLabel: '确认密码',
                                                            blankText : '确认密码不能为空',
                                                            inputType : 'password'
                                                        },{
                                                        	cls : 'attr',
                                                            name: 'model.email',
                                                            fieldLabel: '邮箱',
                                                            allowBlank:true,
                                                            regex:/^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,
                                                            regexText:'邮箱格式不正确'
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            store:userTypeStore,
                                                            emptyText:'请选择',
                                                            mode:'local',
                                                            valueField:'value',
                                                            displayField:'text',
                                                            triggerAction:'all',
                                                            forceSelection: true,
                                                            editable:       false,
                                                            cls : 'attr',
                                                            hiddenName: 'model.userType',
                                                            fieldLabel: '用户类型',
                                                            allowBlank: false,
                                                            blankText : '用户类型不能为空'
                                                        },
                                                        orgSelector,
                                                        {
                                                            xtype:'textfield',
                                                            name: 'model.org.id',
                                                            id:'model.org.id',
                                                            hidden: true,
                                                            hideLabel:true
                                                        },
                                                        {
                                                        	id:'oaDepNameHidden',
                                                        	name:'model.oaDepName',
                                                            xtype: 'hidden'
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            store:new Ext.data.Store( {
                                                                proxy : new Ext.data.HttpProxy( {
                                                                    url : positionUrl
                                                                }),
                                                                reader : new Ext.data.JsonReader({},
                                                                        Ext.data.Record.create([{
                                                                            name: 'id'
                                                                        },{
                                                                            name: 'text'
                                                                        }])
                                                                )
                                                            }),
                                                            id:'departName',
                                                            emptyText:'请选择',
                                                            mode:'remote',
                                                            valueField:'id',
                                                            displayField:'text',
                                                            triggerAction:'all',
                                                            forceSelection: true,
                                                            editable:       false,
                                                            cls : 'attr',
                                                            hiddenName: 'model.oaDepId',
                                                            fieldLabel: '部门',
                                                            allowBlank: true,
                                                            blankText : '部门不能为空',
                                                            listeners : {
                                                                'select' : function(combo,record){
                                                                	parent.Ext.getCmp('oaDepNameHidden').setValue(this.getRawValue());
                                                                    var jobName = parent.Ext.getCmp('jobName');
                                                                    jobName.enable();
                                                                    jobName.reset();
                                                                    jobName.store.proxy = new Ext.data.HttpProxy( {
                                                                        url : positionUrl+'?parentId=' + this.getValue()
                                                                    });
                                                                    jobName.store.load();
                                                                }
                                                            }
                                                        }]
                                                    }]
                                        },
                                        {
                                            xtype:'textfield',
                                            allowBlank: true,
                                            name: 'model.des',
                                            fieldLabel: '备注',
                                            anchor:"95%"
                                    }]
                                },{
                                    xtype: 'fieldset',
                                    id:'userGroupSelectorSet',
                                    title: '选择用户组',
                                    collapsible: true,
                                    items: [
                                        userGroupSelector,{
                                        xtype: 'textfield',
                                        name: 'userGroups',
                                        id:'userGroups',
                                        hidden: true,
                                        hideLabel:true
                                    }]
                                },{
                                    xtype: 'fieldset',
                                    id:'roleSelectorSet',
                                    title: '选择角色',
                                    collapsible: true,
                                    items: [
                                        roleSelector,{
                                        xtype: 'textfield',
                                        name: 'roles',
                                        id:'roles',
                                        hidden: true,
                                        hideLabel:true
                                    }]
                                }/*{
                                    xtype: 'fieldset',
                                    id:'positionSelectorSet',
                                    title: '选择岗位',
                                    collapsible: true,
                                    items: [
                                        positionSelector,{
                                        xtype: 'textfield',
                                        name: 'positions',
                                        id:'positions',
                                        hidden: true,
                                        hideLabel:true
                                    }]
                                }*/]
                }];
            return items;
        },

        show: function() {
            //指定是否应该提交数据的规则
            CreateBaseModel.shouldSubmit=function(){
                var password=parent.Ext.getCmp('password').getValue();
                var confirmPassword=parent.Ext.getCmp('confirmPassword').getValue();
                if(confirmPassword!=password){
                    parent.Ext.MessageBox.alert('提示', "密码输入不一致");
                    return false;
                }else{
                    parent.Ext.getCmp('roles').setValue(roleSelector.getValue());
                    //parent.Ext.getCmp('positions').setValue(positionSelector.getValue());
                    parent.Ext.getCmp('userGroups').setValue(userGroupSelector.getValue());
                    return true;
                }
            };
            CreateBaseModel.show('添加用户', 'user', 800, 460, this.getItems());
        }
    };
} ();
//修改模型信息
ModifyModel = function() {
    return {
        getItems: function(model) {
            var orgSelector=new TreeSelector('model.org.name',model.orgName,selectOrgStoreURL,rootNodeID,rootNodeText,"组织架构",'model.org.id','95%');
            
            var roleLoader = new parent.Ext.tree.TreeLoader({
                dataUrl:selectRoleStoreURL
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
                roleSelector.bubbleCheck='none';
                roleSelector.cascadeCheck='all';
            });
            
            var positionLoader = new parent.Ext.tree.TreeLoader({
                dataUrl:selectPositionURL
            });
            positionSelector = new parent.Ext.ux.tree.CheckTreePanel({
                        title : '',
                        id : "positionSelector",
                        deepestOnly:'true',
                        rootVisible : false,
                        loader : positionLoader,
                        root : new Ext.tree.AsyncTreeNode({
                            text:'岗位',
                            id : 'root',
                            expanded : true
                        })
             });
            positionSelector.reset=function(){
                this.clearValue();
            };
            positionLoader.on("load",function(){
                //在数据装载完成并展开树之后再设值
                positionSelector.getRootNode().expand(true,true);
                if(model.positions!=undefined && model.positions.toString().length>1){
                    positionSelector.setValue(model.positions);
                }
                positionSelector.bubbleCheck='none';
                positionSelector.cascadeCheck='all';
            });
            
             var userGroupLoader = new parent.Ext.tree.TreeLoader({
                dataUrl:selectUserGroupURL
            });
            userGroupSelector = new parent.Ext.ux.tree.CheckTreePanel({
                        title : '',
                        id : "userGroupSelector",
                        rootVisible : false,
                        loader : userGroupLoader,
                        root : new Ext.tree.AsyncTreeNode({
                            text:'用户组',
                            id : 'root',
                            expanded : true
                        })
             });
             userGroupSelector.reset=function(){
                 this.clearValue();
             };                 
            userGroupLoader.on("load",function(){
                userGroupSelector.setValue(model.userGroups);
            });
             var items=[{
                            layout: 'form',
                            items:[{
                                        xtype: 'fieldset',
                                        id:'baseInfo',
                                        title: '基本信息',
                                        collapsible: true,
                                        defaults: {
                                            allowBlank: false,
                                            anchor: '95%'
                                        },
                                        items: [{
                                                layout:'column',
                                                defaults: {width: 250},
                                                items:[{
                                                    columnWidth:.5,
                                                    layout: 'form',
                                                    defaultType: 'textfield',
                                                    defaults: {
                                                        allowBlank: false,
                                                        anchor:"90%"
                                                    },

                                                     items: [{
                                                                readOnly:true,
                                                                fieldClass:'detail_field',
                                                                name: 'model.username',
                                                                value: model.username,
                                                                fieldLabel: '账号'
                                                            },{
                                                                xtype:'textfield',
                                                                name: 'model.realName',
                                                                value: model.realName,
                                                                fieldLabel: '姓名',
                                                                allowBlank: false,
                                                                blankText : '姓名不能为空'
                                                            },{
                                                            	 xtype:'textfield',
                                                                name: 'model.phone',
                                                                value: model.phone,
                                                                fieldLabel: '联系电话',
                                                                allowBlank: false,
                                                                blankText : '联系电话不能为空',
                                                                regex:/^((13[0-2])|(145)|(15[5-6])|(18[5-6])|(176)|(166))\d{8}$/,
                                                                regexText:'联系电话格式不正确'
                                                            },{
                                                                xtype:'textfield',
                                                                name: 'model.hrId',
                                                                value: model.hrId,
                                                                fieldLabel: 'hr编码',
                                                                allowBlank: false,
                                                                blankText : 'hr编码不能为空'
                                                            },
                                                            {
                                                            	id:'oaComIdHiddenEdit',
                                                            	name:'model.oaComId',
                                                                xtype: 'hidden',
                                                                value:model.oaComId
                                                            },
                                                            {
                                                            	id:'oaComNameHiddenEdit',
                                                            	name:'model.oaComName',
                                                                xtype: 'hidden',
                                                                value:model.oaComName
                                                            },
                                                            {
                                                            	 id:'comNameEdit',
                                                                 xtype: 'combo',
                                                                 store:positionStore,
                                                                 emptyText:'请选择',
                                                                 mode:'remote',
                                                                 valueField:'id',
                                                                 displayField:'text',
                                                                 triggerAction:'all',
                                                                 forceSelection: true,
                                                                 editable:       false,
                                                                 cls : 'attr',
                                                                 value: model.oaComName,
                                                                 fieldLabel: '分公司',
                                                                 allowBlank: true,
                                                                 blankText : '分公司不能为空',
                                                                 listeners : {
                                                                    'select' : function(combo,record){
                                                                        var departName = parent.Ext.getCmp('depNameEdit');
                                                                        departName.enable();
                                                                        departName.reset();
                                                                        departName.store.proxy = new Ext.data.HttpProxy( {
                                                                            url : positionUrl+'?parentId=' + this.getValue()
                                                                        });
                                                                        departName.store.load();
                                                                    	parent.Ext.getCmp('oaComNameHiddenEdit').setValue(parent.Ext.get('comNameEdit').dom.value);
                                                                    	parent.Ext.getCmp('oaComIdHiddenEdit').setValue(this.getValue());
                                                                    	//alert(parent.Ext.getCmp('oaComNameHiddenEdit').getValue());
                                                                    }
                                                                }
                                                            },
                                                            {
                                                            	id:'oaJobIdHiddenEdit',
                                                            	name:'model.oaJobId',
                                                                xtype: 'hidden',
                                                                value:model.oaJobId
                                                            },
                                                            {
                                                            	id:'oaJobNameHiddenEdit',
                                                            	name:'model.oaJobName',
                                                                xtype: 'hidden',
                                                                value:model.oaJobName
                                                            },
                                                            {
                                                            	 id:'jobNameEdit',
                                                                 xtype: 'combo',
                                                                 store:new Ext.data.Store( {
                                                                     proxy : new Ext.data.HttpProxy( {
                                                                         url : positionUrl+'?parentId='+model.oaDepId
                                                                     }),
                                                                     reader : new Ext.data.JsonReader({},
                                                                             Ext.data.Record.create([{
                                                                                 name: 'id'
                                                                             },{
                                                                                 name: 'text'
                                                                             }])
                                                                     )
                                                                 }),
                                                                 emptyText:'请选择',
                                                                 mode:'remote',
                                                                 valueField:'id',
                                                                 displayField:'text',
                                                                 triggerAction:'all',
                                                                 forceSelection: true,
                                                                 editable:       false,
                                                                 cls : 'attr',
                                                                 //hiddenName: 'model.oaComId',
                                                                 value: model.oaJobName,
                                                                 fieldLabel: '职位',
                                                                 allowBlank: true,
                                                                 blankText : '职位不能为空',
                                                                 listeners : {
                                                                    'select' : function(combo,record){
                                                                    	parent.Ext.getCmp('oaJobNameHiddenEdit').setValue(parent.Ext.get('jobNameEdit').dom.value);
                                                                    	parent.Ext.getCmp('oaJobIdHiddenEdit').setValue(this.getValue());
                                                                    	//alert(parent.Ext.getCmp('oaComNameHiddenEdit').getValue());
                                                                    }
                                                                }
                                                            }]
                                                },{
                                                    columnWidth:.5,
                                                    layout: 'form',
                                                    defaultType: 'textfield',
                                                    defaults: {
                                                        allowBlank: false,
                                                        anchor:"90%"
                                                    },

                                                    items: [orgSelector,
                                                            {
                                                                xtype:'textfield',
                                                                value: model.orgId,
                                                                name: 'model.org.id',
                                                                id:'model.org.id',
                                                                hidden: true,
                                                                hideLabel:true
                                                            },{
                                                                id:'state',
                                                                xtype: 'combo',
                                                                store:userStateStore,
                                                                emptyText:'请选择',
                                                                mode:'remote',
                                                                valueField:'value',
                                                                displayField:'text',
                                                                triggerAction:'all',
                                                                forceSelection: true,
                                                                editable:       false,
                                                                cls : 'attr',
                                                                hiddenName: 'model.enabled',
                                                                value: model.enabled,
                                                                fieldLabel: '状态',
                                                                allowBlank: false,
                                                                blankText : '状态不能为空'
                                                            },{
                                                            	xtype:'textfield',
                                                            	value: model.email,
                                                                name: 'model.email',
                                                                fieldLabel: '邮箱',
                                                                allowBlank:true,
                                                                regex:/^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,
                                                                regexText:'邮箱格式不正确'
                                                            },
                                                            {
                                                                xtype: 'combo',
                                                                store:userTypeStore,
                                                                emptyText:'请选择',
                                                                mode:'local',
                                                                valueField:'value',
                                                                displayField:'text',
                                                                triggerAction:'all',
                                                                forceSelection: true,
                                                                editable:false,
                                                                cls : 'attr',
                                                                hiddenName: 'model.userType',
                                                                fieldLabel: '用户类型',
                                                                value: model.userType,
                                                                allowBlank: false,
                                                                blankText : '用户类型不能为空'
                                                            },
                                                            {
                                                            	id:'oaDepIdHiddenEdit',
                                                            	name:'model.oaDepId',
                                                                xtype: 'hidden',
                                                                value:model.oaDepId
                                                            },
                                                            {
                                                            	id:'oaDepNameHiddenEdit',
                                                            	name:'model.oaDepName',
                                                                xtype: 'hidden',
                                                                value:model.oaDepName
                                                            },
                                                            {
                                                            	 id:'depNameEdit',
                                                                 xtype: 'combo',
                                                                 store:new Ext.data.Store( {
                                                                     proxy : new Ext.data.HttpProxy( {
                                                                         url : positionUrl+'?parentId='+model.oaComId
                                                                     }),
                                                                     reader : new Ext.data.JsonReader({},
                                                                             Ext.data.Record.create([{
                                                                                 name: 'id'
                                                                             },{
                                                                                 name: 'text'
                                                                             }])
                                                                     )
                                                                 }),
                                                                 emptyText:'请选择',
                                                                 mode:'remote',
                                                                 valueField:'id',
                                                                 displayField:'text',
                                                                 triggerAction:'all',
                                                                 forceSelection: true,
                                                                 editable:       false,
                                                                 cls : 'attr',
                                                                 //hiddenName: 'model.oaComId',
                                                                 value: model.oaDepName,
                                                                 fieldLabel: '部门',
                                                                 allowBlank: true,
                                                                 blankText : '部门不能为空',
                                                                 listeners : {
                                                                    'select' : function(combo,record){
                                                                        var jobName = parent.Ext.getCmp('jobNameEdit');
                                                                        jobName.enable();
                                                                        jobName.reset();
                                                                        jobName.store.proxy = new Ext.data.HttpProxy( {
                                                                            url : positionUrl+'?parentId=' + this.getValue()
                                                                        });
                                                                        jobName.store.load();
                                                                    	//parent.Ext.getCmp('oaDepNameHiddenEdit').setValue(parent.Ext.get('comNameEdit').dom.value);
                                                                    	parent.Ext.getCmp('oaDepNameHiddenEdit').setValue(this.getRawValue());
                                                                    	parent.Ext.getCmp('oaDepIdHiddenEdit').setValue(this.getValue());
                                                                    	//alert(parent.Ext.getCmp('oaComNameHiddenEdit').getValue());
                                                                    }
                                                                 }
                                                            }]
                                                }]
                                            },
                                            {
                                                xtype:'textfield',
                                                allowBlank: true,
                                                name: 'model.des',
                                                value: model.des,
                                                fieldLabel: '备注',
                                                anchor:"95%"
                                            }
                                        ]
                                    },{
                                        xtype: 'fieldset',
                                        id:'userGroupSelectorSet',
                                        title: '选择用户组',
                                        collapsible: true,
                                        items: [userGroupSelector,{
                                            xtype: 'textfield',
                                            name: 'userGroups',
                                            id:'userGroups',
                                            hidden: true,
                                            hideLabel:true
                                        }]
                                    },{
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
                                    }/*,{
                                        xtype: 'fieldset',
                                        id:'positionSelectorSet',
                                        title: '选择岗位',
                                        collapsible: true,
                                        items: [positionSelector,{
                                            xtype: 'textfield',
                                            name: 'positions',
                                            id:'positions',
                                            hidden: true,
                                            hideLabel:true
                                        }]
                                    }*/]
                }];
            return items;
        },

        show: function(model) {
            ModifyBaseModel.prepareSubmit=function() {
                parent.Ext.getCmp('roles').setValue(roleSelector.getValue());
                //parent.Ext.getCmp('positions').setValue(positionSelector.getValue());
                parent.Ext.getCmp('userGroups').setValue(userGroupSelector.getValue());
                if("启用"==parent.Ext.getCmp('state').getValue()){
                    parent.Ext.getCmp('state').setValue("true");
                }
                if("停用"==parent.Ext.getCmp('state').getValue()){
                    parent.Ext.getCmp('state').setValue("false");
                }
            }
            ModifyBaseModel.show('修改用户', 'user', 800, 410, this.getItems(model),model);
        }
    };
} ();
//用户导出单独处理
function exportUser(){
	
	var orgId=GridBaseModel.orgId;
	var search=subordinate;
	var userName='';
	var realName='';
	var w=GridBaseModel.propertyCriteria;
	//alert(search);
	if(w!=''){
		var w=w.split(",");
		for(var i=0;i<w.length;i++){
			if(w[i].substring(0,"username:eq:".length)=="username:eq:"){
				userName=w[i].substring("username:eq:".length);
			}
			if(w[i].substring(0,"realName:like:".length)=="realName:like:"){
				realName=w[i].substring("realName:like:".length);
			}
		}
	}
	
	var header=[["账号","姓名","联系电话","邮箱",
	             "hr编码","状态","组织架构"]];
	var fileName="用户信息";
	var sql="SELECT U.USERNAME,U.REALNAME,             "+
			"U.PHONE,U.EMAIL,U.HR_ID,                  "+
			"DECODE(U.ENABLED,1,'启用','停用')ENABLED, "+
			"O.ORGNAME                                 "+
			"FROM portal.apdp_User u                   "+
			"join portal.apdp_org o               "+
			"on u.org_id = o.id                        ";
	/*sql+=" SELECT o.orgname,                                                  ";
	sql+="        u.username,                                                 ";
	sql+="        u.realname,                                                 ";
	sql+="        u.password,                                                 ";
	sql+="        u.des,                                                      ";
	sql+="        r.rolename rolelist,                  ";
	sql+="        '' grouplist,                                               ";
	sql+="        '' postlist,                                                ";
	sql+="        case u.accountexpired                                       ";
	sql+="          when 0 then                                               ";
	sql+="           'N'                                                      ";
	sql+="          else                                                      ";
	sql+="           'Y'                                                      ";
	sql+="        end accountexpired,                                         ";
	sql+="        case u.accountlocked                                        ";
	sql+="          when 0 then                                               ";
	sql+="           'N'                                                      ";
	sql+="          else                                                      ";
	sql+="           'Y'                                                      ";
	sql+="        end accountlocked,                                          ";
	sql+="        case u.credentialsexpired                                   ";
	sql+="          when 0 then                                               ";
	sql+="           'N'                                                      ";
	sql+="          else                                                      ";
	sql+="           'Y'                                                      ";
	sql+="        end credentialsexpired,                                     ";
	sql+="        case u.enabled                                              ";
	sql+="          when 0 then                                               ";
	sql+="           'N'                                                      ";
	sql+="          else                                                      ";
	sql+="           'Y'                                                      ";
	sql+="        end enabled,                                                ";
	sql+="        u.phone,                                                    ";
	sql+="        u.email,                                                    ";
	sql+="        u1.username username1,                                                ";
	sql+="        u.id,                                                       ";
	sql+="        u.createtime,                                               ";
	sql+="        u.updatetime,                                               ";
	sql+="        u.version,                                                  ";
	sql+="        u.hr_id                                                     ";
	sql+="   FROM portal.apdp_User u                                          ";
	sql+="   left join portal.apdp_org o                                      ";
	sql+="   on u.org_id=o.id                                                 ";
	sql+="   left join portal.apdp_User u1                                    ";
	sql+="   on u1.id=u.id                                                    ";
	sql+="   left join (                                                      ";
	sql+="        select max(ur.userid) userid                                ";
	sql+="    ,PODS.my_raoth_concat(PODS.raothObj(r.rolename, ',')) rolename  ";
	sql+="        from                                                        ";
	sql+="              portal.apdp_user_role ur,                             ";
	sql+="              portal.apdp_role r                                    ";
	sql+="       where ur.roleid=r.id                                         ";
	sql+="       group by ur.userid                                           ";
	sql+="   ) r on                                                           ";
	sql+="   r.userid=u.id                                                    ";
	sql+="  where U.ENABLED=1 ";*/
	/*if(search==true||search=='true'){
		sql+="   and u.org_id in (select t.id                                     ";
		sql+="                       from portal.apdp_org t                       ";
		sql+="                      start with t.id = '"+orgId+"'                         ";
		sql+="                     connect by prior t.id = t.parent_id)           ";
	}else{
		sql+="   and u.org_id ='"+orgId+"'  ";
	}*/
	if(userName!=''){
		sql+="    and u.username = '"+userName+"'                             ";
	}
	if(realName!=''){
		sql+="    and u.realname like '"+realName+"'                          ";
	}
	downloadExcel(sql,header,fileName);
}
//获取数据
function downloadExcel(sql,header,fileName){
	var headerStr=[];
	for(var i=0;i<header.length;i++){
		headerStr[i]=header[i].join(",");
	}
	headerStr=headerStr.join("||");
	
	var form = $("<form>");  
	form.attr('style','display:none');  
	form.attr('target','');  
	form.attr('method','post');  
	form.attr('action',$("#ctx").val()+"/devIncome/devIncome_export.action?only="+(new Date()).valueOf());  
	  
	var fileNameInput = $('<input>');  
	fileNameInput.attr('type','hidden');  
	fileNameInput.attr('name','fileName');  
	fileNameInput.attr('value',fileName); 
	var tableTitleInput = $('<input>');
	tableTitleInput.attr('type','hidden');  
	tableTitleInput.attr('name','tableTitle');  
	tableTitleInput.attr('value',headerStr); 
	var sqlInput = $('<input>');
	sqlInput.attr('type','hidden');  
	sqlInput.attr('name','sql');  
	sqlInput.attr('value',sql); 
	$('body').append(form);  
	form.append(fileNameInput);
	form.append(tableTitleInput);
	form.append(sqlInput);   
	form.submit();  
	form.remove();  
}
//表格
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
            
            var commands=["create","updatePart","search","export","reset"];
            var tips=['增加(C)','修改(U)','高级搜索(S)','导出(E)',"重置密码(Z)"];
            var callbacks=[GridBaseModel.create,GridBaseModel.modify,GridBaseModel.advancedsearch,/*GridBaseModel.exportData*/exportUser,GridModel.reset];
        
            var grid=GridBaseModel.getGrid(contextPath, namespace, action, pageSize, this.getFields(), this.getColumns(), commands,tips,callbacks,securityNamespace);   
     
            //设置标题
            grid.setTitle("已选中【"+rootNodeText+"】");
            
            return grid;
        },
        reset: function(){
            var idList=GridBaseModel.getIdList();
            if(idList.length<1){
                parent.Ext.ux.Toast.msg('操作提示：','请选择要进行操作的记录');  
                return ;
            }
            parent.Ext.MessageBox.confirm("操作提示：","确实要对所选的用户执行密码重置操作吗？",function(button,text){
                if(button == "yes"){
                    parent.Ext.Msg.prompt('操作提示', '请输入重置密码:', function(btn, text){
                        if (btn == 'ok'){
                                if(text.toString()==null||text.toString().trim()==""){
                                    parent.Ext.ux.Toast.msg('操作提示：','密码不能为空'); 
                                }else{
                                     GridModel.resetPassword(idList.join(','),text);
                                }
                        };
                    });
                }
            });
        },
        resetPassword: function(ids,password){
            parent.Ext.Ajax.request({
                url : resetURL+'?time='+new Date().toString(),
                waitTitle: '请稍等',
                waitMsg: '正在重置密码……',
                params : {
                    ids : ids,
                    password : password
                },
                method : 'POST',
                success : function(response,opts){
                    var data=response.responseText;
                    parent.Ext.ux.Toast.msg('操作提示：','{0}',data);  
                }
            });
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