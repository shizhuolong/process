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
    var action='maternity-child-relation-info';
    
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
                                                id:'search_FNRYBM',
                                                fieldLabel: '妇女人员'
                                            },
                                            {
                                                id:'search_ZNXM',
                                                fieldLabel: '子女姓名'
                                            },
                                            {
                                                id:'search_ZNSFHM',
                                                fieldLabel: '子女身份号码'
                                            },
                                            {
                                                id:'search_ZNRYBM',
                                                fieldLabel: '子女人员编号'
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
                                                xtype: 'combo',
                                                id:'search_ZNXB_name',
                                                store:sexStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '性别'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_SYBZ_name',
                                                store:birthRemarksStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '生育备注'
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


                    //妇女人员
                    var search_FNRYBM=parent.Ext.getCmp('search_FNRYBM').getValue();
                    if(search_FNRYBM.toString()!=""){
                        search_FNRYBM=' +FNRYBM:'+search_FNRYBM;
                        data.push(search_FNRYBM);
                    }

                    //子女姓名
                    var search_ZNXM=parent.Ext.getCmp('search_ZNXM').getValue();
                    if(search_ZNXM.toString()!=""){
                        search_ZNXM=' +ZNXM:'+search_ZNXM;
                        data.push(search_ZNXM);
                    }

                    //子女身份号码
                    var search_ZNSFHM=parent.Ext.getCmp('search_ZNSFHM').getValue();
                    if(search_ZNSFHM.toString()!=""){
                        search_ZNSFHM=' +ZNSFHM:'+search_ZNSFHM;
                        data.push(search_ZNSFHM);
                    }

                    //子女人员编号
                    var search_ZNRYBM=parent.Ext.getCmp('search_ZNRYBM').getValue();
                    if(search_ZNRYBM.toString()!=""){
                        search_ZNRYBM=' +ZNRYBM:'+search_ZNRYBM;
                        data.push(search_ZNRYBM);
                    }

                    //与父母血缘关系
                    var search_XYGX_name=parent.Ext.getCmp('search_XYGX_name').getValue();
                    if(search_XYGX_name.toString()!=""){
                        search_XYGX_name=' +XYGX_name:'+search_XYGX_name;
                        data.push(search_XYGX_name);
                    }

                    //性别
                    var search_ZNXB_name=parent.Ext.getCmp('search_ZNXB_name').getValue();
                    if(search_ZNXB_name.toString()!=""){
                        search_ZNXB_name=' +ZNXB_name:'+search_ZNXB_name;
                        data.push(search_ZNXB_name);
                    }

                    //生育备注
                    var search_SYBZ_name=parent.Ext.getCmp('search_SYBZ_name').getValue();
                    if(search_SYBZ_name.toString()!=""){
                        search_SYBZ_name=' +SYBZ_name:'+search_SYBZ_name;
                        data.push(search_SYBZ_name);
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
                    AdvancedSearchBaseModel.search(data, "MaternityChildRelationInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 120;
                };
                AdvancedSearchBaseModel.show('高级搜索','maternityChildRelationInfo', 800, 280, this.getItems(), this.callback);
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

                                                name: 'model.FNRYBM.id',
                                                fieldLabel: '妇女人员',
                                                allowBlank: false,
                                                blankText : '妇女人员不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.ZNXM',
                                                fieldLabel: '子女姓名',
                                                allowBlank: false,
                                                blankText : '子女姓名不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.ZNCSRQ',
                                                fieldLabel: '子女出生日期',
                                                allowBlank: false,
                                                blankText : '子女出生日期不能为空'
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
                                                hiddenName: 'model.ZNZJLX.id',
                                                fieldLabel: '子女证件类型',
                                                allowBlank: false,
                                                blankText : '子女证件类型不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.ZNZJHM',
                                                fieldLabel: '子女证件号码',
                                                allowBlank: false,
                                                blankText : '子女证件号码不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.ZNSFHM',
                                                fieldLabel: '子女身份号码',
                                                allowBlank: false,
                                                blankText : '子女身份号码不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.ZNRYBM.id',
                                                fieldLabel: '子女人员编号',
                                                allowBlank: false,
                                                blankText : '子女人员编号不能为空'
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
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',

                                                name: 'model.ZNHC',
                                                fieldLabel: '孩次',
                                                allowBlank: false,
                                                blankText : '孩次不能为空'
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
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.ZNTC',
                                                fieldLabel: '胎次',
                                                allowBlank: false,
                                                blankText : '胎次不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:sexStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.ZNXB.id',
                                                fieldLabel: '性别',
                                                allowBlank: false,
                                                blankText : '性别不能为空'

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
                                                hiddenName: 'model.ZCSX.id',
                                                fieldLabel: '出生政策属性',
                                                allowBlank: false,
                                                blankText : '出生政策属性不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:birthRemarksStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SYBZ.id',
                                                fieldLabel: '生育备注',
                                                allowBlank: false,
                                                blankText : '生育备注不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.DSLZRQ',
                                                fieldLabel: '独生子女领证日期',
                                                allowBlank: false,
                                                blankText : '独生子女领证日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:birthHealthStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.CSJKZK.id',
                                                fieldLabel: '子女出生健康状况',
                                                allowBlank: false,
                                                blankText : '子女出生健康状况不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:childSurvivalStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SFCH.id',
                                                fieldLabel: '是否存活',
                                                allowBlank: false,
                                                blankText : '是否存活不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:childHealthStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.DQJKZK.id',
                                                fieldLabel: '子女当前健康状况',
                                                allowBlank: false,
                                                blankText : '子女当前健康状况不能为空'

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
                CreateBaseModel.show('添加生育及子女关系信息', 'maternityChildRelationInfo', 800, 408, this.getItems());
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
                                                name: 'model.FNRYBM.id',
                                                value: model.FNRYBM_id,
                                                fieldLabel: '妇女人员',
                                                allowBlank: false,
                                                blankText : '妇女人员不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.ZNXM',
                                                value: model.ZNXM,
                                                fieldLabel: '子女姓名',
                                                allowBlank: false,
                                                blankText : '子女姓名不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.ZNCSRQ',
                                                value: model.ZNCSRQ,
                                                fieldLabel: '子女出生日期',
                                                allowBlank: false,
                                                blankText : '子女出生日期不能为空'
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
                                                hiddenName: 'model.ZNZJLX.id',
                                                value: model.ZNZJLXId,
                                                fieldLabel: '子女证件类型',
                                                allowBlank: false,
                                                blankText : '子女证件类型不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.ZNZJHM',
                                                value: model.ZNZJHM,
                                                fieldLabel: '子女证件号码',
                                                allowBlank: false,
                                                blankText : '子女证件号码不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.ZNSFHM',
                                                value: model.ZNSFHM,
                                                fieldLabel: '子女身份号码',
                                                allowBlank: false,
                                                blankText : '子女身份号码不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.ZNRYBM.id',
                                                value: model.ZNRYBM_id,
                                                fieldLabel: '子女人员编号',
                                                allowBlank: false,
                                                blankText : '子女人员编号不能为空'
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
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.ZNHC',
                                                value: model.ZNHC,
                                                fieldLabel: '孩次',
                                                allowBlank: false,
                                                blankText : '孩次不能为空'
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
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.ZNTC',
                                                value: model.ZNTC,
                                                fieldLabel: '胎次',
                                                allowBlank: false,
                                                blankText : '胎次不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:sexStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.ZNXB.id',
                                                value: model.ZNXBId,
                                                fieldLabel: '性别',
                                                allowBlank: false,
                                                blankText : '性别不能为空'

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
                                                hiddenName: 'model.ZCSX.id',
                                                value: model.ZCSXId,
                                                fieldLabel: '出生政策属性',
                                                allowBlank: false,
                                                blankText : '出生政策属性不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:birthRemarksStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SYBZ.id',
                                                value: model.SYBZId,
                                                fieldLabel: '生育备注',
                                                allowBlank: false,
                                                blankText : '生育备注不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.DSLZRQ',
                                                value: model.DSLZRQ,
                                                fieldLabel: '独生子女领证日期',
                                                allowBlank: false,
                                                blankText : '独生子女领证日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:birthHealthStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.CSJKZK.id',
                                                value: model.CSJKZKId,
                                                fieldLabel: '子女出生健康状况',
                                                allowBlank: false,
                                                blankText : '子女出生健康状况不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:childSurvivalStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SFCH.id',
                                                value: model.SFCHId,
                                                fieldLabel: '是否存活',
                                                allowBlank: false,
                                                blankText : '是否存活不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:childHealthStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.DQJKZK.id',
                                                value: model.DQJKZKId,
                                                fieldLabel: '子女当前健康状况',
                                                allowBlank: false,
                                                blankText : '子女当前健康状况不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                birthHealthStore.load();
                sexStore.load();
                childSurvivalStore.load();
                documentTypeStore.load();
                bornPolicyPropertyStore.load();
                bloodRelationshipWithParentsStore.load();
                childHealthStore.load();
                birthRemarksStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 120;
                };
                ModifyBaseModel.show('修改生育及子女关系信息', 'maternityChildRelationInfo', 800, 408, this.getItems(model),model);
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
                                                value: model.FNRYBM_XM,
                                                fieldLabel: '妇女人员'
                                            },
                                            {
                                                value: model.ZNXM,
                                                fieldLabel: '子女姓名'
                                            },
                                            {
                                                value: model.ZNCSRQ,
                                                fieldLabel: '子女出生日期'
                                            },
                                            {
                                                value: model.ZNZJLX,
                                                fieldLabel: '子女证件类型'
                                            },
                                            {
                                                value: model.ZNZJHM,
                                                fieldLabel: '子女证件号码'
                                            },
                                            {
                                                value: model.ZNSFHM,
                                                fieldLabel: '子女身份号码'
                                            },
                                            {
                                                value: model.ZNRYBM_XM,
                                                fieldLabel: '子女人员编号'
                                            },
                                            {
                                                value: model.XYGX,
                                                fieldLabel: '与父母血缘关系'
                                            },
                                            {
                                                value: model.ZNHC,
                                                fieldLabel: '孩次'
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
                                                value: model.ZNTC,
                                                fieldLabel: '胎次'
                                            },
                                            {
                                                value: model.ZNXB,
                                                fieldLabel: '性别'
                                            },
                                            {
                                                value: model.ZCSX,
                                                fieldLabel: '出生政策属性'
                                            },
                                            {
                                                value: model.SYBZ,
                                                fieldLabel: '生育备注'
                                            },
                                            {
                                                value: model.DSLZRQ,
                                                fieldLabel: '独生子女领证日期'
                                            },
                                            {
                                                value: model.CSJKZK,
                                                fieldLabel: '子女出生健康状况'
                                            },
                                            {
                                                value: model.SFCH,
                                                fieldLabel: '是否存活'
                                            },
                                            {
                                                value: model.DQJKZK,
                                                fieldLabel: '子女当前健康状况'
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
                DisplayBaseModel.show('生育及子女关系信息详细信息', 'maternityChildRelationInfo', 800, 408, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'FNRYBM_XM'},
 				{name: 'ZNXM'},
 				{name: 'ZNCSRQ'},
 				{name: 'ZNZJLX'},
 				{name: 'ZNZJHM'},
 				{name: 'ZNSFHM'},
 				{name: 'ZNRYBM_XM'},
 				{name: 'XYGX'},
 				{name: 'ZNHC'},
 				{name: 'ZNTC'},
 				{name: 'ZNXB'},
 				{name: 'ZCSX'},
 				{name: 'SYBZ'},
 				{name: 'DSLZRQ'},
 				{name: 'CSJKZK'},
 				{name: 'SFCH'},
 				{name: 'DQJKZK'},
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
 				{header: "妇女人员", width: 20, dataIndex: 'FNRYBM_XM', sortable: true},
 				{header: "子女姓名", width: 20, dataIndex: 'ZNXM', sortable: true},
 				{header: "子女出生日期", width: 20, dataIndex: 'ZNCSRQ', sortable: true},
 				{header: "子女证件类型", width: 20, dataIndex: 'ZNZJLX', sortable: true},
 				{header: "子女证件号码", width: 20, dataIndex: 'ZNZJHM', sortable: true},
 				{header: "子女身份号码", width: 20, dataIndex: 'ZNSFHM', sortable: true},
 				{header: "子女人员编号", width: 20, dataIndex: 'ZNRYBM_XM', sortable: true},
 				{header: "与父母血缘关系", width: 20, dataIndex: 'XYGX', sortable: true},
 				{header: "孩次", width: 20, dataIndex: 'ZNHC', sortable: true},
 				{header: "胎次", width: 20, dataIndex: 'ZNTC', sortable: true},
 				{header: "性别", width: 20, dataIndex: 'ZNXB', sortable: true},
 				{header: "出生政策属性", width: 20, dataIndex: 'ZCSX', sortable: true},
 				{header: "生育备注", width: 20, dataIndex: 'SYBZ', sortable: true},
 				{header: "独生子女领证日期", width: 20, dataIndex: 'DSLZRQ', sortable: true},
 				{header: "子女出生健康状况", width: 20, dataIndex: 'CSJKZK', sortable: true},
 				{header: "是否存活", width: 20, dataIndex: 'SFCH', sortable: true},
 				{header: "子女当前健康状况", width: 20, dataIndex: 'DQJKZK', sortable: true},
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