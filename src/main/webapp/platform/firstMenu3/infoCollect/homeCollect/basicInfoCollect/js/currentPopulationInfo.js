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
    var action='current-population-info';
    
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
                                                id:'search_LCD',
                                                fieldLabel: '流出地'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_LCRQ',
                                                fieldLabel: '流出时间'
                                            },
                                            {
                                                id:'search_LRD',
                                                fieldLabel: '流入地'
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
                                                id:'search_LRRQ',
                                                fieldLabel: '流入时间'
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

                    //流出地
                    var search_LCD=parent.Ext.getCmp('search_LCD').getValue();
                    if(search_LCD.toString()!=""){
                        search_LCD=' +LCD:'+search_LCD;
                        data.push(search_LCD);
                    }

                    //流出时间
                    //时间类型
                    var search_LCRQ=parent.Ext.getCmp('search_LCRQ').getValue();
                    var search_LCRQFormatValue=parent.Ext.getCmp('search_LCRQ').value;
                    if(search_LCRQ!="" && search_LCRQFormatValue!=undefined){
                        search_LCRQ=' +LCRQ:['+search_LCRQFormatValue+" TO "+search_LCRQFormatValue+"]";
                        data.push(search_LCRQ);
                    }

                    //流入地
                    var search_LRD=parent.Ext.getCmp('search_LRD').getValue();
                    if(search_LRD.toString()!=""){
                        search_LRD=' +LRD:'+search_LRD;
                        data.push(search_LRD);
                    }

                    //流入时间
                    //时间类型
                    var search_LRRQ=parent.Ext.getCmp('search_LRRQ').getValue();
                    var search_LRRQFormatValue=parent.Ext.getCmp('search_LRRQ').value;
                    if(search_LRRQ!="" && search_LRRQFormatValue!=undefined){
                        search_LRRQ=' +LRRQ:['+search_LRRQFormatValue+" TO "+search_LRRQFormatValue+"]";
                        data.push(search_LRRQ);
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
                    AdvancedSearchBaseModel.search(data, "CurrentPopulationInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 130;
                };
                AdvancedSearchBaseModel.show('高级搜索','currentPopulationInfo', 800, 248, this.getItems(), this.callback);
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

                                                name: 'model.LCD',
                                                fieldLabel: '流出地',
                                                allowBlank: false,
                                                blankText : '流出地不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.LCRQ',
                                                fieldLabel: '流出时间',
                                                allowBlank: false,
                                                blankText : '流出时间不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FHRQ',
                                                fieldLabel: '返回时间',
                                                allowBlank: false,
                                                blankText : '返回时间不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:currentReasonsStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.LDYY.id',
                                                fieldLabel: '流动原因',
                                                allowBlank: false,
                                                blankText : '流动原因不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.LRD',
                                                fieldLabel: '流入地',
                                                allowBlank: false,
                                                blankText : '流入地不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.LRRQ',
                                                fieldLabel: '流入时间',
                                                allowBlank: false,
                                                blankText : '流入时间不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.LKRQ',
                                                fieldLabel: '离开时间',
                                                allowBlank: false,
                                                blankText : '离开时间不能为空'
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
                                                store:alimonyPaymentWayStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.LDJTGX.id',
                                                fieldLabel: '流动家庭户关系',
                                                allowBlank: false,
                                                blankText : '流动家庭户关系不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.HYZMHM',
                                                fieldLabel: '婚育证明号码',
                                                allowBlank: false,
                                                blankText : '婚育证明号码不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.HYZMYXRQ',
                                                fieldLabel: '婚育证明有效期',
                                                allowBlank: false,
                                                blankText : '婚育证明有效期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:whetherPaySocialfeesStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SFJNFYF.id',
                                                fieldLabel: '是否缴纳社会抚养费',
                                                allowBlank: false,
                                                blankText : '是否缴纳社会抚养费不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:alimonyPaymentWayStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.FYFJNFS.id',
                                                fieldLabel: '抚养费缴纳方式',
                                                allowBlank: false,
                                                blankText : '抚养费缴纳方式不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.JSYZRQ',
                                                fieldLabel: '计生验证日期',
                                                allowBlank: false,
                                                blankText : '计生验证日期不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.GAYZRQ',
                                                fieldLabel: '公安验证日期',
                                                allowBlank: false,
                                                blankText : '公安验证日期不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.GSYZRQ',
                                                fieldLabel: '工商验证日期',
                                                allowBlank: false,
                                                blankText : '工商验证日期不能为空'

                                            }
                                          ]
                              }]
                          }    
                    ];
                return items;
            },
            
            show: function() {
                CreateBaseModel.getLabelWidth=function(){
                    return 130;
                };
                CreateBaseModel.show('添加流动人口信息', 'currentPopulationInfo', 800, 376, this.getItems());
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
                                                name: 'model.LCD',
                                                value: model.LCD,
                                                fieldLabel: '流出地',
                                                allowBlank: false,
                                                blankText : '流出地不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.LCRQ',
                                                value: model.LCRQ,
                                                fieldLabel: '流出时间',
                                                allowBlank: false,
                                                blankText : '流出时间不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FHRQ',
                                                value: model.FHRQ,
                                                fieldLabel: '返回时间',
                                                allowBlank: false,
                                                blankText : '返回时间不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:currentReasonsStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.LDYY.id',
                                                value: model.LDYYId,
                                                fieldLabel: '流动原因',
                                                allowBlank: false,
                                                blankText : '流动原因不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.LRD',
                                                value: model.LRD,
                                                fieldLabel: '流入地',
                                                allowBlank: false,
                                                blankText : '流入地不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.LRRQ',
                                                value: model.LRRQ,
                                                fieldLabel: '流入时间',
                                                allowBlank: false,
                                                blankText : '流入时间不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.LKRQ',
                                                value: model.LKRQ,
                                                fieldLabel: '离开时间',
                                                allowBlank: false,
                                                blankText : '离开时间不能为空'
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
                                                store:alimonyPaymentWayStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.LDJTGX.id',
                                                value: model.LDJTGXId,
                                                fieldLabel: '流动家庭户关系',
                                                allowBlank: false,
                                                blankText : '流动家庭户关系不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.HYZMHM',
                                                value: model.HYZMHM,
                                                fieldLabel: '婚育证明号码',
                                                allowBlank: false,
                                                blankText : '婚育证明号码不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.HYZMYXRQ',
                                                value: model.HYZMYXRQ,
                                                fieldLabel: '婚育证明有效期',
                                                allowBlank: false,
                                                blankText : '婚育证明有效期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:whetherPaySocialfeesStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SFJNFYF.id',
                                                value: model.SFJNFYFId,
                                                fieldLabel: '是否缴纳社会抚养费',
                                                allowBlank: false,
                                                blankText : '是否缴纳社会抚养费不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:alimonyPaymentWayStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.FYFJNFS.id',
                                                value: model.FYFJNFSId,
                                                fieldLabel: '抚养费缴纳方式',
                                                allowBlank: false,
                                                blankText : '抚养费缴纳方式不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.JSYZRQ',
                                                value: model.JSYZRQ,
                                                fieldLabel: '计生验证日期',
                                                allowBlank: false,
                                                blankText : '计生验证日期不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.GAYZRQ',
                                                value: model.GAYZRQ,
                                                fieldLabel: '公安验证日期',
                                                allowBlank: false,
                                                blankText : '公安验证日期不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.GSYZRQ',
                                                value: model.GSYZRQ,
                                                fieldLabel: '工商验证日期',
                                                allowBlank: false,
                                                blankText : '工商验证日期不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                whetherPaySocialfeesStore.load();
                alimonyPaymentWayStore.load();
                currentReasonsStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 130;
                };
                ModifyBaseModel.show('修改流动人口信息', 'currentPopulationInfo', 800, 376, this.getItems(model),model);
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
                                                value: model.LCD,
                                                fieldLabel: '流出地'
                                            },
                                            {
                                                value: model.LCRQ,
                                                fieldLabel: '流出时间'
                                            },
                                            {
                                                value: model.FHRQ,
                                                fieldLabel: '返回时间'
                                            },
                                            {
                                                value: model.LDYY,
                                                fieldLabel: '流动原因'
                                            },
                                            {
                                                value: model.LRD,
                                                fieldLabel: '流入地'
                                            },
                                            {
                                                value: model.LRRQ,
                                                fieldLabel: '流入时间'
                                            },
                                            {
                                                value: model.LKRQ,
                                                fieldLabel: '离开时间'
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
                                                value: model.LDJTGX,
                                                fieldLabel: '流动家庭户关系'
                                            },
                                            {
                                                value: model.HYZMHM,
                                                fieldLabel: '婚育证明号码'
                                            },
                                            {
                                                value: model.HYZMYXRQ,
                                                fieldLabel: '婚育证明有效期'
                                            },
                                            {
                                                value: model.SFJNFYF,
                                                fieldLabel: '是否缴纳社会抚养费'
                                            },
                                            {
                                                value: model.FYFJNFS,
                                                fieldLabel: '抚养费缴纳方式'
                                            },
                                            {
                                                value: model.JSYZRQ,
                                                fieldLabel: '计生验证日期'
                                            },
                                            {
                                                value: model.GAYZRQ,
                                                fieldLabel: '公安验证日期'
                                            },
                                            {
                                                value: model.GSYZRQ,
                                                fieldLabel: '工商验证日期'
                                            }
                                          ]
                              }]
                          }    
                 ];
                return items;
            },

            show: function(model) {
                DisplayBaseModel.getLabelWidth=function(){
                    return 130;
                };
                DisplayBaseModel.show('流动人口信息详细信息', 'currentPopulationInfo', 800, 376, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'RYBM_XM'},
 				{name: 'LCD'},
 				{name: 'LCRQ'},
 				{name: 'FHRQ'},
 				{name: 'LDYY'},
 				{name: 'LRD'},
 				{name: 'LRRQ'},
 				{name: 'LKRQ'},
 				{name: 'LDJTGX'},
 				{name: 'HYZMHM'},
 				{name: 'HYZMYXRQ'},
 				{name: 'SFJNFYF'},
 				{name: 'FYFJNFS'},
 				{name: 'JSYZRQ'},
 				{name: 'GAYZRQ'},
 				{name: 'GSYZRQ'},
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
 				{header: "流出地", width: 20, dataIndex: 'LCD', sortable: true},
 				{header: "流出时间", width: 20, dataIndex: 'LCRQ', sortable: true},
 				{header: "返回时间", width: 20, dataIndex: 'FHRQ', sortable: true},
 				{header: "流动原因", width: 20, dataIndex: 'LDYY', sortable: true},
 				{header: "流入地", width: 20, dataIndex: 'LRD', sortable: true},
 				{header: "流入时间", width: 20, dataIndex: 'LRRQ', sortable: true},
 				{header: "离开时间", width: 20, dataIndex: 'LKRQ', sortable: true},
 				{header: "流动家庭户关系", width: 20, dataIndex: 'LDJTGX', sortable: true},
 				{header: "婚育证明号码", width: 20, dataIndex: 'HYZMHM', sortable: true},
 				{header: "婚育证明有效期", width: 20, dataIndex: 'HYZMYXRQ', sortable: true},
 				{header: "是否缴纳社会抚养费", width: 20, dataIndex: 'SFJNFYF', sortable: true},
 				{header: "抚养费缴纳方式", width: 20, dataIndex: 'FYFJNFS', sortable: true},
 				{header: "计生验证日期", width: 20, dataIndex: 'JSYZRQ', sortable: true},
 				{header: "公安验证日期", width: 20, dataIndex: 'GAYZRQ', sortable: true},
 				{header: "工商验证日期", width: 20, dataIndex: 'GSYZRQ', sortable: true},
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