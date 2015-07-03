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
    var action='parent-info';
    
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
                                                id:'search_MQXM',
                                                fieldLabel: '母亲姓名'
                                            },
                                            {
                                                id:'search_FQXM',
                                                fieldLabel: '父亲姓名'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_XYGX_name',
                                                store:bloodRelationshipWithParentsStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '与父母血缘关系'
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

                    //母亲姓名
                    var search_MQXM=parent.Ext.getCmp('search_MQXM').getValue();
                    if(search_MQXM.toString()!=""){
                        search_MQXM=' +MQXM:'+search_MQXM;
                        data.push(search_MQXM);
                    }

                    //父亲姓名
                    var search_FQXM=parent.Ext.getCmp('search_FQXM').getValue();
                    if(search_FQXM.toString()!=""){
                        search_FQXM=' +FQXM:'+search_FQXM;
                        data.push(search_FQXM);
                    }

                    //与父母血缘关系
                    var search_XYGX_name=parent.Ext.getCmp('search_XYGX_name').getValue();
                    if(search_XYGX_name.toString()!=""){
                        search_XYGX_name=' +XYGX_name:'+search_XYGX_name;
                        data.push(search_XYGX_name);
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
                    AdvancedSearchBaseModel.search(data, "ParentInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 110;
                };
                AdvancedSearchBaseModel.show('高级搜索','parentInfo', 800, 248, this.getItems(), this.callback);
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
                                                cls : 'attr',

                                                name: 'model.MQXM',
                                                fieldLabel: '母亲姓名',
                                                allowBlank: false,
                                                blankText : '母亲姓名不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.FQXM',
                                                fieldLabel: '父亲姓名',
                                                allowBlank: false,
                                                blankText : '父亲姓名不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:documentTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.MQZJLX.id',
                                                fieldLabel: '母亲证件类型',
                                                allowBlank: false,
                                                blankText : '母亲证件类型不能为空'
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
                                                cls : 'attr',
                                                name: 'model.MQZJHM',
                                                fieldLabel: '母亲证件号码',
                                                allowBlank: false,
                                                blankText : '母亲证件号码不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:documentTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.FQZJLX.id',
                                                fieldLabel: '父亲证件类型',
                                                allowBlank: false,
                                                blankText : '父亲证件类型不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.FQZJHM',
                                                fieldLabel: '父亲证件号码',
                                                allowBlank: false,
                                                blankText : '父亲证件号码不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:bloodRelationshipWithParentsStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.XYGX.id',
                                                fieldLabel: '与父母血缘关系',
                                                allowBlank: false,
                                                blankText : '与父母血缘关系不能为空'

                                            }
                                          ]
                              }]
                          }    
                    ];
                return items;
            },
            
            show: function() {
                CreateBaseModel.getLabelWidth=function(){
                    return 110;
                };
                CreateBaseModel.show('添加父母信息关系', 'parentInfo', 800, 248, this.getItems());
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
                                                cls : 'attr',
                                                name: 'model.MQXM',
                                                value: model.MQXM,
                                                fieldLabel: '母亲姓名',
                                                allowBlank: false,
                                                blankText : '母亲姓名不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.FQXM',
                                                value: model.FQXM,
                                                fieldLabel: '父亲姓名',
                                                allowBlank: false,
                                                blankText : '父亲姓名不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:documentTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.MQZJLX.id',
                                                value: model.MQZJLXId,
                                                fieldLabel: '母亲证件类型',
                                                allowBlank: false,
                                                blankText : '母亲证件类型不能为空'
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
                                                cls : 'attr',
                                                name: 'model.MQZJHM',
                                                value: model.MQZJHM,
                                                fieldLabel: '母亲证件号码',
                                                allowBlank: false,
                                                blankText : '母亲证件号码不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:documentTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.FQZJLX.id',
                                                value: model.FQZJLXId,
                                                fieldLabel: '父亲证件类型',
                                                allowBlank: false,
                                                blankText : '父亲证件类型不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.FQZJHM',
                                                value: model.FQZJHM,
                                                fieldLabel: '父亲证件号码',
                                                allowBlank: false,
                                                blankText : '父亲证件号码不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:bloodRelationshipWithParentsStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.XYGX.id',
                                                value: model.XYGXId,
                                                fieldLabel: '与父母血缘关系',
                                                allowBlank: false,
                                                blankText : '与父母血缘关系不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                documentTypeStore.load();
                bloodRelationshipWithParentsStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 110;
                };
                ModifyBaseModel.show('修改父母信息关系', 'parentInfo', 800, 248, this.getItems(model),model);
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
                                                value: model.MQXM,
                                                fieldLabel: '母亲姓名'
                                            },
                                            {
                                                value: model.FQXM,
                                                fieldLabel: '父亲姓名'
                                            },
                                            {
                                                value: model.MQZJLX,
                                                fieldLabel: '母亲证件类型'
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
                                                value: model.MQZJHM,
                                                fieldLabel: '母亲证件号码'
                                            },
                                            {
                                                value: model.FQZJLX,
                                                fieldLabel: '父亲证件类型'
                                            },
                                            {
                                                value: model.FQZJHM,
                                                fieldLabel: '父亲证件号码'
                                            },
                                            {
                                                value: model.XYGX,
                                                fieldLabel: '与父母血缘关系'
                                            }
                                          ]
                              }]
                          }    
                 ];
                return items;
            },

            show: function(model) {
                DisplayBaseModel.getLabelWidth=function(){
                    return 110;
                };
                DisplayBaseModel.show('父母信息关系详细信息', 'parentInfo', 800, 248, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'RYBM_XM'},
 				{name: 'MQXM'},
 				{name: 'FQXM'},
 				{name: 'MQZJLX'},
 				{name: 'MQZJHM'},
 				{name: 'FQZJLX'},
 				{name: 'FQZJHM'},
 				{name: 'XYGX'},
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
 				{header: "母亲姓名", width: 20, dataIndex: 'MQXM', sortable: true},
 				{header: "父亲姓名", width: 20, dataIndex: 'FQXM', sortable: true},
 				{header: "母亲证件类型", width: 20, dataIndex: 'MQZJLX', sortable: true},
 				{header: "母亲证件号码", width: 20, dataIndex: 'MQZJHM', sortable: true},
 				{header: "父亲证件类型", width: 20, dataIndex: 'FQZJLX', sortable: true},
 				{header: "父亲证件号码", width: 20, dataIndex: 'FQZJHM', sortable: true},
 				{header: "与父母血缘关系", width: 20, dataIndex: 'XYGX', sortable: true},
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