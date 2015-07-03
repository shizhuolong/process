/**
 * 
 * APDPlat - Application Product Development Platform
 * Copyright (c) 2013, 杨尚川, yang-shangchuan@qq.com
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

    var namespace='infoCollect/homeCollect/basicInfoCollect';
    var action='pregnancy-eugenic';
    
    //高级搜索
    AdvancedSearchModel = function() {
        return {
            //搜索表单
            getItems : function(){
                var items=[
                          {
                              layout:'column',
                              items:[{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      anchor:"90%"
                                  },

                                   items: [
                                            {
                                                id:'search_RYBM',
                                                fieldLabel: '人员'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_SCRQ',
                                                fieldLabel: '孕前优生筛查时间'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_SCJG_name',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '孕前优生筛查结果'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_SCJIG_name',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '孕前优生筛查机构'
                                            }
                                          ]
                              },{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      anchor:"90%"
                                  },

                                  items: [
                                            {
                                                id:'search_ownerUser_ownerUser',
                                                fieldLabel: '数据所有者名称'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_createTime',
                                                fieldLabel: '创建时间'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_updateTime',
                                                fieldLabel: '上一次更新时间'
                                            }
                                          ]
                              }]
                          }                
                        ];
                return items;
            },
            //点击搜索之后的回调方法
            callback : function(){               
                    var data=[];


                    //人员
                    var search_RYBM=parent.Ext.getCmp('search_RYBM').getValue();
                    if(search_RYBM.toString()!=""){
                        search_RYBM=' +RYBM:'+search_RYBM;
                        data.push(search_RYBM);
                    }

                    //孕前优生筛查时间
                    //时间类型
                    var search_SCRQ=parent.Ext.getCmp('search_SCRQ').getValue();
                    var search_SCRQFormatValue=parent.Ext.getCmp('search_SCRQ').value;
                    if(search_SCRQ!="" && search_SCRQFormatValue!=undefined){
                        search_SCRQ=' +SCRQ:['+search_SCRQFormatValue+" TO "+search_SCRQFormatValue+"]";
                        data.push(search_SCRQ);
                    }

                    //孕前优生筛查结果
                    var search_SCJG_name=parent.Ext.getCmp('search_SCJG_name').getValue();
                    if(search_SCJG_name.toString()!=""){
                        search_SCJG_name=' +SCJG_name:'+search_SCJG_name;
                        data.push(search_SCJG_name);
                    }

                    //孕前优生筛查机构
                    var search_SCJIG_name=parent.Ext.getCmp('search_SCJIG_name').getValue();
                    if(search_SCJIG_name.toString()!=""){
                        search_SCJIG_name=' +SCJIG_name:'+search_SCJIG_name;
                        data.push(search_SCJIG_name);
                    }

                    //数据所有者名称
                    var search_ownerUser_ownerUser=parent.Ext.getCmp('search_ownerUser_ownerUser').getValue();
                    if(search_ownerUser_ownerUser.toString()!=""){
                        search_ownerUser_ownerUser=' +ownerUser_ownerUser:'+search_ownerUser_ownerUser;
                        data.push(search_ownerUser_ownerUser);
                    }

                    //创建时间
                    //时间类型
                    var search_createTime=parent.Ext.getCmp('search_createTime').getValue();
                    var search_createTimeFormatValue=parent.Ext.getCmp('search_createTime').value;
                    if(search_createTime!="" && search_createTimeFormatValue!=undefined){
                        search_createTime=' +createTime:['+search_createTimeFormatValue+" TO "+search_createTimeFormatValue+"]";
                        data.push(search_createTime);
                    }

                    //上一次更新时间
                    //时间类型
                    var search_updateTime=parent.Ext.getCmp('search_updateTime').getValue();
                    var search_updateTimeFormatValue=parent.Ext.getCmp('search_updateTime').value;
                    if(search_updateTime!="" && search_updateTimeFormatValue!=undefined){
                        search_updateTime=' +updateTime:['+search_updateTimeFormatValue+" TO "+search_updateTimeFormatValue+"]";
                        data.push(search_updateTime);
                    }
                    AdvancedSearchBaseModel.search(data, "PregnancyEugenic");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 120;
                };
                AdvancedSearchBaseModel.show('高级搜索','pregnancyEugenic', 800, 248, this.getItems(), this.callback);
            }
        };
    } ();
    //添加模型信息
    CreateModel = function() {
        return {
            getItems: function() {
                 var items = [
                          {
                              layout:'column',
                              items:[{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      anchor:"90%"
                                  },

                                   items: [
                                            {
                                                cls : 'attr',

                                                name: 'model.RYBM.id',
                                                fieldLabel: '人员',
                                                allowBlank: false,
                                                blankText : '人员不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.SCRQ',
                                                fieldLabel: '孕前优生筛查时间',
                                                allowBlank: false,
                                                blankText : '孕前优生筛查时间不能为空'
                                            }
                                          ]
                              },{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      anchor:"90%"
                                  },

                                  items: [
                                            {
                                                xtype: 'combo',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SCJG.id',
                                                fieldLabel: '孕前优生筛查结果',
                                                allowBlank: false,
                                                blankText : '孕前优生筛查结果不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SCJIG.id',
                                                fieldLabel: '孕前优生筛查机构',
                                                allowBlank: false,
                                                blankText : '孕前优生筛查机构不能为空'

                                            }
                                          ]
                              }]
                          }    
                    ];
                return items;
            },
            
            show: function() {
                CreateBaseModel.getLabelWidth=function(){
                    return 120;
                };
                CreateBaseModel.show('添加孕前优生信息', 'pregnancyEugenic', 800, 184, this.getItems());
            }
        };
    } ();
    //修改模型信息
    ModifyModel = function() {
        return {
            getItems: function(model) {
                var items = [
                          {
                              layout:'column',
                              items:[{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      anchor:"90%"
                                  },

                                   items: [
                                            {
                                                cls : 'attr',
                                                name: 'model.RYBM.id',
                                                value: model.RYBM_id,
                                                fieldLabel: '人员',
                                                allowBlank: false,
                                                blankText : '人员不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.SCRQ',
                                                value: model.SCRQ,
                                                fieldLabel: '孕前优生筛查时间',
                                                allowBlank: false,
                                                blankText : '孕前优生筛查时间不能为空'
                                            }
                                          ]
                              },{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      anchor:"90%"
                                  },

                                  items: [
                                            {
                                                xtype: 'combo',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SCJG.id',
                                                value: model.SCJGId,
                                                fieldLabel: '孕前优生筛查结果',
                                                allowBlank: false,
                                                blankText : '孕前优生筛查结果不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SCJIG.id',
                                                value: model.SCJIGId,
                                                fieldLabel: '孕前优生筛查机构',
                                                allowBlank: false,
                                                blankText : '孕前优生筛查机构不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                serviceOrganizationTypeStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 120;
                };
                ModifyBaseModel.show('修改孕前优生信息', 'pregnancyEugenic', 800, 184, this.getItems(model),model);
            }
        };
    } ();
    //显示模型详细信息
    DisplayModel = function() {
        return {
            getItems: function(model) {
                 var items=[
                          {
                              layout:'column',
                              items:[{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      readOnly:true,
                                      fieldClass:'detail_field',
                                      anchor:"90%"
                                  },

                                   items: [
                                            {
                                                value: model.RYBM_XM,
                                                fieldLabel: '人员'
                                            },
                                            {
                                                value: model.SCRQ,
                                                fieldLabel: '孕前优生筛查时间'
                                            }
                                          ]
                              },{
                                  columnWidth:.5,
                                  layout: 'form',
                                  defaultType: 'textfield',
                                  defaults: {
                                      readOnly:true,
                                      fieldClass:'detail_field',
                                      anchor:"90%"
                                  },

                                  items: [
                                            {
                                                value: model.SCJG,
                                                fieldLabel: '孕前优生筛查结果'
                                            },
                                            {
                                                value: model.SCJIG,
                                                fieldLabel: '孕前优生筛查机构'
                                            }
                                          ]
                              }]
                          }    
                 ];
                return items;
            },

            show: function(model) {
                DisplayBaseModel.getLabelWidth=function(){
                    return 120;
                };
                DisplayBaseModel.show('孕前优生信息详细信息', 'pregnancyEugenic', 800, 184, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'RYBM_XM'},
 				{name: 'SCRQ'},
 				{name: 'SCJG'},
 				{name: 'SCJIG'},
 				{name: 'ownerUser_username'},
 				{name: 'id'},
 				{name: 'createTime'},
 				{name: 'updateTime'},
 				{name: 'version'}
			];
               return fields;     
            },
            getColumns: function(){
                var columns=[
 				{header: "人员", width: 20, dataIndex: 'RYBM_XM', sortable: true},
 				{header: "孕前优生筛查时间", width: 20, dataIndex: 'SCRQ', sortable: true},
 				{header: "孕前优生筛查结果", width: 20, dataIndex: 'SCJG', sortable: true},
 				{header: "孕前优生筛查机构", width: 20, dataIndex: 'SCJIG', sortable: true},
 				{header: "数据所有者名称", width: 20, dataIndex: 'ownerUser_username', sortable: true},
 				{header: "编号", width: 20, dataIndex: 'id', sortable: true},
 				{header: "创建时间", width: 20, dataIndex: 'createTime', sortable: true},
 				{header: "上一次更新时间", width: 20, dataIndex: 'updateTime', sortable: true},
 				{header: "更新次数", width: 20, dataIndex: 'version', sortable: true}
                            ];
                return columns;           
            },
            show: function(){
                var pageSize=17;

                var commands=["create","delete","updatePart","retrieve","search","query","export"];
                var tips=['增加(C)','删除(R)','修改(U)','详细(D)','高级搜索(S)','显示全部(A)','导出(E)'];
                var callbacks=[GridBaseModel.create,GridBaseModel.remove,GridBaseModel.modify,GridBaseModel.detail,GridBaseModel.advancedsearch,GridBaseModel.showall,GridBaseModel.exportData];
            
                GridBaseModel.show(contextPath, namespace, action, pageSize, this.getFields(), this.getColumns(), commands, tips, callbacks);
            }
        }
    } ();
    Ext.onReady(function(){
        GridModel.show();
    });