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
    var action='pregnancy-info';
    
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
                                                id:'search_YLFFXX',
                                                fieldLabel: '育龄夫妇'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_RSZCSX_name',
                                                store:bornPolicyPropertyStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '妊娠政策属性'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_RSJG_name',
                                                store:pregnancyOutcomesStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '妊娠结果'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_RSZZJG_name',
                                                store:serviceOrganizationTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '终止妊娠机构'
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
                                                id:'search_RLYY_name',
                                                store:abortionReasonStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '人流原因'
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


                    //育龄夫妇
                    var search_YLFFXX=parent.Ext.getCmp('search_YLFFXX').getValue();
                    if(search_YLFFXX.toString()!=""){
                        search_YLFFXX=' +YLFFXX:'+search_YLFFXX;
                        data.push(search_YLFFXX);
                    }

                    //妊娠政策属性
                    var search_RSZCSX_name=parent.Ext.getCmp('search_RSZCSX_name').getValue();
                    if(search_RSZCSX_name.toString()!=""){
                        search_RSZCSX_name=' +RSZCSX_name:'+search_RSZCSX_name;
                        data.push(search_RSZCSX_name);
                    }

                    //妊娠结果
                    var search_RSJG_name=parent.Ext.getCmp('search_RSJG_name').getValue();
                    if(search_RSJG_name.toString()!=""){
                        search_RSJG_name=' +RSJG_name:'+search_RSJG_name;
                        data.push(search_RSJG_name);
                    }

                    //终止妊娠机构
                    var search_RSZZJG_name=parent.Ext.getCmp('search_RSZZJG_name').getValue();
                    if(search_RSZZJG_name.toString()!=""){
                        search_RSZZJG_name=' +RSZZJG_name:'+search_RSZZJG_name;
                        data.push(search_RSZZJG_name);
                    }

                    //人流原因
                    var search_RLYY_name=parent.Ext.getCmp('search_RLYY_name').getValue();
                    if(search_RLYY_name.toString()!=""){
                        search_RLYY_name=' +RLYY_name:'+search_RLYY_name;
                        data.push(search_RLYY_name);
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
                    AdvancedSearchBaseModel.search(data, "PregnancyInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 120;
                };
                AdvancedSearchBaseModel.show('高级搜索','pregnancyInfo', 800, 248, this.getItems(), this.callback);
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

                                                name: 'model.YLFFXX.id',
                                                fieldLabel: '育龄夫妇',
                                                allowBlank: false,
                                                blankText : '育龄夫妇不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',

                                                name: 'model.RSCX',
                                                fieldLabel: '妊娠次序（孕次）',
                                                allowBlank: false,
                                                blankText : '妊娠次序（孕次）不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',

                                                name: 'model.RSTC',
                                                fieldLabel: '妊娠胎次',
                                                allowBlank: false,
                                                blankText : '妊娠胎次不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.RSKSRQ',
                                                fieldLabel: '妊娠开始日期',
                                                allowBlank: false,
                                                blankText : '妊娠开始日期不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:bornPolicyPropertyStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.RSZCSX.id',
                                                fieldLabel: '妊娠政策属性',
                                                allowBlank: false,
                                                blankText : '妊娠政策属性不能为空'
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
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.RSZZRQ',
                                                fieldLabel: '妊娠终止日期',
                                                allowBlank: false,
                                                blankText : '妊娠终止日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:pregnancyOutcomesStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.RSJG.id',
                                                fieldLabel: '妊娠结果',
                                                allowBlank: false,
                                                blankText : '妊娠结果不能为空'

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
                                                hiddenName: 'model.RSZZJG.id',
                                                fieldLabel: '终止妊娠机构',
                                                allowBlank: false,
                                                blankText : '终止妊娠机构不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.RSZZJGMC',
                                                fieldLabel: '终止妊娠机构名称',
                                                allowBlank: false,
                                                blankText : '终止妊娠机构名称不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:abortionReasonStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.RLYY.id',
                                                fieldLabel: '人流原因',
                                                allowBlank: false,
                                                blankText : '人流原因不能为空'

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
                CreateBaseModel.show('添加妊娠信息', 'pregnancyInfo', 800, 280, this.getItems());
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
                                                name: 'model.YLFFXX.id',
                                                value: model.YLFFXX_id,
                                                fieldLabel: '育龄夫妇',
                                                allowBlank: false,
                                                blankText : '育龄夫妇不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.RSCX',
                                                value: model.RSCX,
                                                fieldLabel: '妊娠次序（孕次）',
                                                allowBlank: false,
                                                blankText : '妊娠次序（孕次）不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.RSTC',
                                                value: model.RSTC,
                                                fieldLabel: '妊娠胎次',
                                                allowBlank: false,
                                                blankText : '妊娠胎次不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.RSKSRQ',
                                                value: model.RSKSRQ,
                                                fieldLabel: '妊娠开始日期',
                                                allowBlank: false,
                                                blankText : '妊娠开始日期不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:bornPolicyPropertyStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.RSZCSX.id',
                                                value: model.RSZCSXId,
                                                fieldLabel: '妊娠政策属性',
                                                allowBlank: false,
                                                blankText : '妊娠政策属性不能为空'
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
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.RSZZRQ',
                                                value: model.RSZZRQ,
                                                fieldLabel: '妊娠终止日期',
                                                allowBlank: false,
                                                blankText : '妊娠终止日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:pregnancyOutcomesStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.RSJG.id',
                                                value: model.RSJGId,
                                                fieldLabel: '妊娠结果',
                                                allowBlank: false,
                                                blankText : '妊娠结果不能为空'

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
                                                hiddenName: 'model.RSZZJG.id',
                                                value: model.RSZZJGId,
                                                fieldLabel: '终止妊娠机构',
                                                allowBlank: false,
                                                blankText : '终止妊娠机构不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.RSZZJGMC',
                                                value: model.RSZZJGMC,
                                                fieldLabel: '终止妊娠机构名称',
                                                allowBlank: false,
                                                blankText : '终止妊娠机构名称不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:abortionReasonStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.RLYY.id',
                                                value: model.RLYYId,
                                                fieldLabel: '人流原因',
                                                allowBlank: false,
                                                blankText : '人流原因不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                bornPolicyPropertyStore.load();
                abortionReasonStore.load();
                serviceOrganizationTypeStore.load();
                pregnancyOutcomesStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 120;
                };
                ModifyBaseModel.show('修改妊娠信息', 'pregnancyInfo', 800, 280, this.getItems(model),model);
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
                                                value: model.YLFFXX_FNBM,
                                                fieldLabel: '育龄夫妇'
                                            },
                                            {
                                                value: model.RSCX,
                                                fieldLabel: '妊娠次序（孕次）'
                                            },
                                            {
                                                value: model.RSTC,
                                                fieldLabel: '妊娠胎次'
                                            },
                                            {
                                                value: model.RSKSRQ,
                                                fieldLabel: '妊娠开始日期'
                                            },
                                            {
                                                value: model.RSZCSX,
                                                fieldLabel: '妊娠政策属性'
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
                                                value: model.RSZZRQ,
                                                fieldLabel: '妊娠终止日期'
                                            },
                                            {
                                                value: model.RSJG,
                                                fieldLabel: '妊娠结果'
                                            },
                                            {
                                                value: model.RSZZJG,
                                                fieldLabel: '终止妊娠机构'
                                            },
                                            {
                                                value: model.RSZZJGMC,
                                                fieldLabel: '终止妊娠机构名称'
                                            },
                                            {
                                                value: model.RLYY,
                                                fieldLabel: '人流原因'
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
                DisplayBaseModel.show('妊娠信息详细信息', 'pregnancyInfo', 800, 280, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'YLFFXX_FNBM'},
 				{name: 'RSCX'},
 				{name: 'RSTC'},
 				{name: 'RSKSRQ'},
 				{name: 'RSZCSX'},
 				{name: 'RSZZRQ'},
 				{name: 'RSJG'},
 				{name: 'RSZZJG'},
 				{name: 'RSZZJGMC'},
 				{name: 'RLYY'},
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
 				{header: "育龄夫妇", width: 20, dataIndex: 'YLFFXX_FNBM', sortable: true},
 				{header: "妊娠次序（孕次）", width: 20, dataIndex: 'RSCX', sortable: true},
 				{header: "妊娠胎次", width: 20, dataIndex: 'RSTC', sortable: true},
 				{header: "妊娠开始日期", width: 20, dataIndex: 'RSKSRQ', sortable: true},
 				{header: "妊娠政策属性", width: 20, dataIndex: 'RSZCSX', sortable: true},
 				{header: "妊娠终止日期", width: 20, dataIndex: 'RSZZRQ', sortable: true},
 				{header: "妊娠结果", width: 20, dataIndex: 'RSJG', sortable: true},
 				{header: "终止妊娠机构", width: 20, dataIndex: 'RSZZJG', sortable: true},
 				{header: "终止妊娠机构名称", width: 20, dataIndex: 'RSZZJGMC', sortable: true},
 				{header: "人流原因", width: 20, dataIndex: 'RLYY', sortable: true},
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