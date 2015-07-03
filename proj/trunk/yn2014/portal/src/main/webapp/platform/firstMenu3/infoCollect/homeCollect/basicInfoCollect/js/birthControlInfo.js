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
    var action='birth-control-info';
    
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
                                                id:'search_JHLX_name',
                                                store:planTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '计划类型'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_FFRQ',
                                                fieldLabel: '发放日期'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_ZCYJ_name',
                                                store:policyBasisStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '政策依据'
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


                    //育龄夫妇
                    var search_YLFFXX=parent.Ext.getCmp('search_YLFFXX').getValue();
                    if(search_YLFFXX.toString()!=""){
                        search_YLFFXX=' +YLFFXX:'+search_YLFFXX;
                        data.push(search_YLFFXX);
                    }

                    //计划类型
                    var search_JHLX_name=parent.Ext.getCmp('search_JHLX_name').getValue();
                    if(search_JHLX_name.toString()!=""){
                        search_JHLX_name=' +JHLX_name:'+search_JHLX_name;
                        data.push(search_JHLX_name);
                    }

                    //发放日期
                    //时间类型
                    var search_FFRQ=parent.Ext.getCmp('search_FFRQ').getValue();
                    var search_FFRQFormatValue=parent.Ext.getCmp('search_FFRQ').value;
                    if(search_FFRQ!="" && search_FFRQFormatValue!=undefined){
                        search_FFRQ=' +FFRQ:['+search_FFRQFormatValue+" TO "+search_FFRQFormatValue+"]";
                        data.push(search_FFRQ);
                    }

                    //政策依据
                    var search_ZCYJ_name=parent.Ext.getCmp('search_ZCYJ_name').getValue();
                    if(search_ZCYJ_name.toString()!=""){
                        search_ZCYJ_name=' +ZCYJ_name:'+search_ZCYJ_name;
                        data.push(search_ZCYJ_name);
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
                    AdvancedSearchBaseModel.search(data, "BirthControlInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.show('高级搜索','birthControlInfo', 800, 248, this.getItems(), this.callback);
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
                                                xtype: 'combo',
                                                store:planTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.JHLX.id',
                                                fieldLabel: '计划类型',
                                                allowBlank: false,
                                                blankText : '计划类型不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FFRQ',
                                                fieldLabel: '发放日期',
                                                allowBlank: false,
                                                blankText : '发放日期不能为空'
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
                                                store:policyBasisStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.ZCYJ.id',
                                                fieldLabel: '政策依据',
                                                allowBlank: false,
                                                blankText : '政策依据不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.ZZRQ',
                                                fieldLabel: '终止日期',
                                                allowBlank: false,
                                                blankText : '终止日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:programTerminationReasonStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.ZZYY.id',
                                                fieldLabel: '终止原因',
                                                allowBlank: false,
                                                blankText : '终止原因不能为空'

                                            }
                                          ]
                              }]
                          }    
                    ];
                return items;
            },
            
            show: function() {
                CreateBaseModel.show('添加生育计划信息', 'birthControlInfo', 800, 216, this.getItems());
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
                                                xtype: 'combo',
                                                store:planTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.JHLX.id',
                                                value: model.JHLXId,
                                                fieldLabel: '计划类型',
                                                allowBlank: false,
                                                blankText : '计划类型不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FFRQ',
                                                value: model.FFRQ,
                                                fieldLabel: '发放日期',
                                                allowBlank: false,
                                                blankText : '发放日期不能为空'
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
                                                store:policyBasisStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.ZCYJ.id',
                                                value: model.ZCYJId,
                                                fieldLabel: '政策依据',
                                                allowBlank: false,
                                                blankText : '政策依据不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.ZZRQ',
                                                value: model.ZZRQ,
                                                fieldLabel: '终止日期',
                                                allowBlank: false,
                                                blankText : '终止日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:programTerminationReasonStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.ZZYY.id',
                                                value: model.ZZYYId,
                                                fieldLabel: '终止原因',
                                                allowBlank: false,
                                                blankText : '终止原因不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                policyBasisStore.load();
                planTypeStore.load();
                programTerminationReasonStore.load();
                ModifyBaseModel.show('修改生育计划信息', 'birthControlInfo', 800, 216, this.getItems(model),model);
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
                                                value: model.JHLX,
                                                fieldLabel: '计划类型'
                                            },
                                            {
                                                value: model.FFRQ,
                                                fieldLabel: '发放日期'
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
                                                value: model.ZCYJ,
                                                fieldLabel: '政策依据'
                                            },
                                            {
                                                value: model.ZZRQ,
                                                fieldLabel: '终止日期'
                                            },
                                            {
                                                value: model.ZZYY,
                                                fieldLabel: '终止原因'
                                            }
                                          ]
                              }]
                          }    
                 ];
                return items;
            },

            show: function(model) {
                DisplayBaseModel.show('生育计划信息详细信息', 'birthControlInfo', 800, 216, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'YLFFXX_FNBM'},
 				{name: 'JHLX'},
 				{name: 'FFRQ'},
 				{name: 'ZCYJ'},
 				{name: 'ZZRQ'},
 				{name: 'ZZYY'},
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
 				{header: "计划类型", width: 20, dataIndex: 'JHLX', sortable: true},
 				{header: "发放日期", width: 20, dataIndex: 'FFRQ', sortable: true},
 				{header: "政策依据", width: 20, dataIndex: 'ZCYJ', sortable: true},
 				{header: "终止日期", width: 20, dataIndex: 'ZZRQ', sortable: true},
 				{header: "终止原因", width: 20, dataIndex: 'ZZYY', sortable: true},
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