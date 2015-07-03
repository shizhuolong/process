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
    var action='family-planning-operation';
    
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
                                                xtype:'numberfield',
                                                id:'search_SSCS',
                                                fieldLabel: '手术次数'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_SSRQ',
                                                fieldLabel: '手术日期'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_SSLX_name',
                                                store:contraceptionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '手术类型'
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
                                                id:'search_SSJG_name',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '手术实施机构'
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

                    //手术次数
                    var search_SSCS=parent.Ext.getCmp('search_SSCS').getValue();
                    if(search_SSCS.toString()!=""){
                        search_SSCS=' +SSCS:'+search_SSCS;
                        data.push(search_SSCS);
                    }

                    //手术日期
                    //时间类型
                    var search_SSRQ=parent.Ext.getCmp('search_SSRQ').getValue();
                    var search_SSRQFormatValue=parent.Ext.getCmp('search_SSRQ').value;
                    if(search_SSRQ!="" && search_SSRQFormatValue!=undefined){
                        search_SSRQ=' +SSRQ:['+search_SSRQFormatValue+" TO "+search_SSRQFormatValue+"]";
                        data.push(search_SSRQ);
                    }

                    //手术类型
                    var search_SSLX_name=parent.Ext.getCmp('search_SSLX_name').getValue();
                    if(search_SSLX_name.toString()!=""){
                        search_SSLX_name=' +SSLX_name:'+search_SSLX_name;
                        data.push(search_SSLX_name);
                    }

                    //手术实施机构
                    var search_SSJG_name=parent.Ext.getCmp('search_SSJG_name').getValue();
                    if(search_SSJG_name.toString()!=""){
                        search_SSJG_name=' +SSJG_name:'+search_SSJG_name;
                        data.push(search_SSJG_name);
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
                    AdvancedSearchBaseModel.search(data, "FamilyPlanningOperation");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 100;
                };
                AdvancedSearchBaseModel.show('高级搜索','familyPlanningOperation', 800, 248, this.getItems(), this.callback);
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
                                                xtype:'numberfield',
                                                cls : 'attr',

                                                name: 'model.SSCS',
                                                fieldLabel: '手术次数',
                                                allowBlank: false,
                                                blankText : '手术次数不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.SSRQ',
                                                fieldLabel: '手术日期',
                                                allowBlank: false,
                                                blankText : '手术日期不能为空'
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
                                                store:contraceptionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SSLX.id',
                                                fieldLabel: '手术类型',
                                                allowBlank: false,
                                                blankText : '手术类型不能为空'

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
                                                hiddenName: 'model.SSJG.id',
                                                fieldLabel: '手术实施机构',
                                                allowBlank: false,
                                                blankText : '手术实施机构不能为空'

                                            }
                                          ]
                              }]
                          }    
                    ];
                return items;
            },
            
            show: function() {
                CreateBaseModel.getLabelWidth=function(){
                    return 100;
                };
                CreateBaseModel.show('添加计划生育手术', 'familyPlanningOperation', 800, 216, this.getItems());
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
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.SSCS',
                                                value: model.SSCS,
                                                fieldLabel: '手术次数',
                                                allowBlank: false,
                                                blankText : '手术次数不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.SSRQ',
                                                value: model.SSRQ,
                                                fieldLabel: '手术日期',
                                                allowBlank: false,
                                                blankText : '手术日期不能为空'
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
                                                store:contraceptionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SSLX.id',
                                                value: model.SSLXId,
                                                fieldLabel: '手术类型',
                                                allowBlank: false,
                                                blankText : '手术类型不能为空'

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
                                                hiddenName: 'model.SSJG.id',
                                                value: model.SSJGId,
                                                fieldLabel: '手术实施机构',
                                                allowBlank: false,
                                                blankText : '手术实施机构不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                serviceOrganizationTypeStore.load();
                contraceptionStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 100;
                };
                ModifyBaseModel.show('修改计划生育手术', 'familyPlanningOperation', 800, 216, this.getItems(model),model);
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
                                                value: model.SSCS,
                                                fieldLabel: '手术次数'
                                            },
                                            {
                                                value: model.SSRQ,
                                                fieldLabel: '手术日期'
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
                                                value: model.SSLX,
                                                fieldLabel: '手术类型'
                                            },
                                            {
                                                value: model.SSJG,
                                                fieldLabel: '手术实施机构'
                                            }
                                          ]
                              }]
                          }    
                 ];
                return items;
            },

            show: function(model) {
                DisplayBaseModel.getLabelWidth=function(){
                    return 100;
                };
                DisplayBaseModel.show('计划生育手术详细信息', 'familyPlanningOperation', 800, 216, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'RYBM_XM'},
 				{name: 'SSCS'},
 				{name: 'SSRQ'},
 				{name: 'SSLX'},
 				{name: 'SSJG'},
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
 				{header: "手术次数", width: 20, dataIndex: 'SSCS', sortable: true},
 				{header: "手术日期", width: 20, dataIndex: 'SSRQ', sortable: true},
 				{header: "手术类型", width: 20, dataIndex: 'SSLX', sortable: true},
 				{header: "手术实施机构", width: 20, dataIndex: 'SSJG', sortable: true},
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