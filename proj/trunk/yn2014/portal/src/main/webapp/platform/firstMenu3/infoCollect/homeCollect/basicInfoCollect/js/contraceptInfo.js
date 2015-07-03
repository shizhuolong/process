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
    var action='contracept-info';
    
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
                                                id:'search_BYKSRQ',
                                                fieldLabel: '避孕开始日期'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_BYZK_name',
                                                store:contraceptionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '避孕状况'
                                            },
                                            {
                                                id:'search_BYSSJG',
                                                fieldLabel: '避孕实施机构'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_BYZZRQ',
                                                fieldLabel: '避孕终止日期'
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
                                                id:'search_BYZZJG',
                                                fieldLabel: '避孕终止实施机构'
                                            },
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

                    //避孕开始日期
                    //时间类型
                    var search_BYKSRQ=parent.Ext.getCmp('search_BYKSRQ').getValue();
                    var search_BYKSRQFormatValue=parent.Ext.getCmp('search_BYKSRQ').value;
                    if(search_BYKSRQ!="" && search_BYKSRQFormatValue!=undefined){
                        search_BYKSRQ=' +BYKSRQ:['+search_BYKSRQFormatValue+" TO "+search_BYKSRQFormatValue+"]";
                        data.push(search_BYKSRQ);
                    }

                    //避孕状况
                    var search_BYZK_name=parent.Ext.getCmp('search_BYZK_name').getValue();
                    if(search_BYZK_name.toString()!=""){
                        search_BYZK_name=' +BYZK_name:'+search_BYZK_name;
                        data.push(search_BYZK_name);
                    }

                    //避孕实施机构
                    var search_BYSSJG=parent.Ext.getCmp('search_BYSSJG').getValue();
                    if(search_BYSSJG.toString()!=""){
                        search_BYSSJG=' +BYSSJG:'+search_BYSSJG;
                        data.push(search_BYSSJG);
                    }

                    //避孕终止日期
                    //时间类型
                    var search_BYZZRQ=parent.Ext.getCmp('search_BYZZRQ').getValue();
                    var search_BYZZRQFormatValue=parent.Ext.getCmp('search_BYZZRQ').value;
                    if(search_BYZZRQ!="" && search_BYZZRQFormatValue!=undefined){
                        search_BYZZRQ=' +BYZZRQ:['+search_BYZZRQFormatValue+" TO "+search_BYZZRQFormatValue+"]";
                        data.push(search_BYZZRQ);
                    }

                    //避孕终止实施机构
                    var search_BYZZJG=parent.Ext.getCmp('search_BYZZJG').getValue();
                    if(search_BYZZJG.toString()!=""){
                        search_BYZZJG=' +BYZZJG:'+search_BYZZJG;
                        data.push(search_BYZZJG);
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
                    AdvancedSearchBaseModel.search(data, "ContraceptInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 120;
                };
                AdvancedSearchBaseModel.show('高级搜索','contraceptInfo', 800, 280, this.getItems(), this.callback);
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

                                                name: 'model.BYCX',
                                                fieldLabel: '避孕措施次序',
                                                allowBlank: false,
                                                blankText : '避孕措施次序不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.BYKSRQ',
                                                fieldLabel: '避孕开始日期',
                                                allowBlank: false,
                                                blankText : '避孕开始日期不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:contraceptionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.BYZK.id',
                                                fieldLabel: '避孕状况',
                                                allowBlank: false,
                                                blankText : '避孕状况不能为空'
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
                                                name: 'model.BYSSJG',
                                                fieldLabel: '避孕实施机构',
                                                allowBlank: false,
                                                blankText : '避孕实施机构不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.BYZZRQ',
                                                fieldLabel: '避孕终止日期',
                                                allowBlank: false,
                                                blankText : '避孕终止日期不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.BYZZJG',
                                                fieldLabel: '避孕终止实施机构',
                                                allowBlank: false,
                                                blankText : '避孕终止实施机构不能为空'

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
                CreateBaseModel.show('添加避孕信息', 'contraceptInfo', 800, 248, this.getItems());
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
                                                name: 'model.BYCX',
                                                value: model.BYCX,
                                                fieldLabel: '避孕措施次序',
                                                allowBlank: false,
                                                blankText : '避孕措施次序不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.BYKSRQ',
                                                value: model.BYKSRQ,
                                                fieldLabel: '避孕开始日期',
                                                allowBlank: false,
                                                blankText : '避孕开始日期不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:contraceptionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.BYZK.id',
                                                value: model.BYZKId,
                                                fieldLabel: '避孕状况',
                                                allowBlank: false,
                                                blankText : '避孕状况不能为空'
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
                                                name: 'model.BYSSJG',
                                                value: model.BYSSJG,
                                                fieldLabel: '避孕实施机构',
                                                allowBlank: false,
                                                blankText : '避孕实施机构不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.BYZZRQ',
                                                value: model.BYZZRQ,
                                                fieldLabel: '避孕终止日期',
                                                allowBlank: false,
                                                blankText : '避孕终止日期不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.BYZZJG',
                                                value: model.BYZZJG,
                                                fieldLabel: '避孕终止实施机构',
                                                allowBlank: false,
                                                blankText : '避孕终止实施机构不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                contraceptionStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 120;
                };
                ModifyBaseModel.show('修改避孕信息', 'contraceptInfo', 800, 248, this.getItems(model),model);
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
                                                value: model.BYCX,
                                                fieldLabel: '避孕措施次序'
                                            },
                                            {
                                                value: model.BYKSRQ,
                                                fieldLabel: '避孕开始日期'
                                            },
                                            {
                                                value: model.BYZK,
                                                fieldLabel: '避孕状况'
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
                                                value: model.BYSSJG,
                                                fieldLabel: '避孕实施机构'
                                            },
                                            {
                                                value: model.BYZZRQ,
                                                fieldLabel: '避孕终止日期'
                                            },
                                            {
                                                value: model.BYZZJG,
                                                fieldLabel: '避孕终止实施机构'
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
                DisplayBaseModel.show('避孕信息详细信息', 'contraceptInfo', 800, 248, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'RYBM_XM'},
 				{name: 'BYCX'},
 				{name: 'BYKSRQ'},
 				{name: 'BYZK'},
 				{name: 'BYSSJG'},
 				{name: 'BYZZRQ'},
 				{name: 'BYZZJG'},
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
 				{header: "避孕措施次序", width: 20, dataIndex: 'BYCX', sortable: true},
 				{header: "避孕开始日期", width: 20, dataIndex: 'BYKSRQ', sortable: true},
 				{header: "避孕状况", width: 20, dataIndex: 'BYZK', sortable: true},
 				{header: "避孕实施机构", width: 20, dataIndex: 'BYSSJG', sortable: true},
 				{header: "避孕终止日期", width: 20, dataIndex: 'BYZZRQ', sortable: true},
 				{header: "避孕终止实施机构", width: 20, dataIndex: 'BYZZJG', sortable: true},
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