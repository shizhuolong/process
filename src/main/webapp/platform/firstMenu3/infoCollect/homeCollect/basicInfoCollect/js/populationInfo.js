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
    var action='population-info';
    
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
                                                id:'search_XM',
                                                fieldLabel: '姓名'
                                            },
                                            {
                                                id:'search_CYM',
                                                fieldLabel: '曾用名 '
                                            },
                                            {
                                                id:'search_GMSFHM',
                                                fieldLabel: '公民身份号码'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_XB_name',
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
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_CSRQ',
                                                fieldLabel: '出生日期'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_WHCD_name',
                                                store:educationalBackgroundStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '文化程度'
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
                                                id:'search_HKXZ_name',
                                                store:householdNatureStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '户口性质'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_MZ_name',
                                                store:nationStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '民族'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_HYZK_name',
                                                store:marriageStateStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '婚姻状况'
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


                    //姓名
                    var search_XM=parent.Ext.getCmp('search_XM').getValue();
                    if(search_XM.toString()!=""){
                        search_XM=' +XM:'+search_XM;
                        data.push(search_XM);
                    }

                    //曾用名 
                    var search_CYM=parent.Ext.getCmp('search_CYM').getValue();
                    if(search_CYM.toString()!=""){
                        search_CYM=' +CYM:'+search_CYM;
                        data.push(search_CYM);
                    }

                    //公民身份号码
                    var search_GMSFHM=parent.Ext.getCmp('search_GMSFHM').getValue();
                    if(search_GMSFHM.toString()!=""){
                        search_GMSFHM=' +GMSFHM:'+search_GMSFHM;
                        data.push(search_GMSFHM);
                    }

                    //性别
                    var search_XB_name=parent.Ext.getCmp('search_XB_name').getValue();
                    if(search_XB_name.toString()!=""){
                        search_XB_name=' +XB_name:'+search_XB_name;
                        data.push(search_XB_name);
                    }

                    //出生日期
                    //时间类型
                    var search_CSRQ=parent.Ext.getCmp('search_CSRQ').getValue();
                    var search_CSRQFormatValue=parent.Ext.getCmp('search_CSRQ').value;
                    if(search_CSRQ!="" && search_CSRQFormatValue!=undefined){
                        search_CSRQ=' +CSRQ:['+search_CSRQFormatValue+" TO "+search_CSRQFormatValue+"]";
                        data.push(search_CSRQ);
                    }

                    //文化程度
                    var search_WHCD_name=parent.Ext.getCmp('search_WHCD_name').getValue();
                    if(search_WHCD_name.toString()!=""){
                        search_WHCD_name=' +WHCD_name:'+search_WHCD_name;
                        data.push(search_WHCD_name);
                    }

                    //户口性质
                    var search_HKXZ_name=parent.Ext.getCmp('search_HKXZ_name').getValue();
                    if(search_HKXZ_name.toString()!=""){
                        search_HKXZ_name=' +HKXZ_name:'+search_HKXZ_name;
                        data.push(search_HKXZ_name);
                    }

                    //民族
                    var search_MZ_name=parent.Ext.getCmp('search_MZ_name').getValue();
                    if(search_MZ_name.toString()!=""){
                        search_MZ_name=' +MZ_name:'+search_MZ_name;
                        data.push(search_MZ_name);
                    }

                    //婚姻状况
                    var search_HYZK_name=parent.Ext.getCmp('search_HYZK_name').getValue();
                    if(search_HYZK_name.toString()!=""){
                        search_HYZK_name=' +HYZK_name:'+search_HYZK_name;
                        data.push(search_HYZK_name);
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
                    AdvancedSearchBaseModel.search(data, "PopulationInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 140;
                };
                AdvancedSearchBaseModel.show('高级搜索','populationInfo', 800, 312, this.getItems(), this.callback);
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

                                                name: 'model.XM',
                                                fieldLabel: '姓名',
                                                allowBlank: false,
                                                blankText : '姓名不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.CYM',
                                                fieldLabel: '曾用名 ',
                                                allowBlank: false,
                                                blankText : '曾用名 不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:nationalityStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.GJ.id',
                                                fieldLabel: '国籍',
                                                allowBlank: false,
                                                blankText : '国籍不能为空'
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
                                                hiddenName: 'model.ZJLX.id',
                                                fieldLabel: '证件类型',
                                                allowBlank: false,
                                                blankText : '证件类型不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.ZJHM',
                                                fieldLabel: '证件号码',
                                                allowBlank: false,
                                                blankText : '证件号码不能为空'
                                            },
                                            {
                                                cls : 'attr',

                                                name: 'model.GMSFHM',
                                                fieldLabel: '公民身份号码',
                                                allowBlank: false,
                                                blankText : '公民身份号码不能为空'
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
                                                hiddenName: 'model.XB.id',
                                                fieldLabel: '性别',
                                                allowBlank: false,
                                                blankText : '性别不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.CSRQ',
                                                fieldLabel: '出生日期',
                                                allowBlank: false,
                                                blankText : '出生日期不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.SWRQ',
                                                fieldLabel: '死亡日期',
                                                allowBlank: false,
                                                blankText : '死亡日期不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:educationalBackgroundStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.WHCD.id',
                                                fieldLabel: '文化程度',
                                                allowBlank: false,
                                                blankText : '文化程度不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:householdNatureStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.HKXZ.id',
                                                fieldLabel: '户口性质',
                                                allowBlank: false,
                                                blankText : '户口性质不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:nationStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.MZ.id',
                                                fieldLabel: '民族',
                                                allowBlank: false,
                                                blankText : '民族不能为空'
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
                                                store:marriageStateStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.HYZK.id',
                                                fieldLabel: '婚姻状况',
                                                allowBlank: false,
                                                blankText : '婚姻状况不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.DHHM',
                                                fieldLabel: '电话号码',
                                                allowBlank: false,
                                                blankText : '电话号码不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.YDDH',
                                                fieldLabel: '移动电话',
                                                allowBlank: false,
                                                blankText : '移动电话不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.DZYJ',
                                                fieldLabel: '电子邮件',
                                                allowBlank: false,
                                                blankText : '电子邮件不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.CSD',
                                                fieldLabel: '出生地',
                                                allowBlank: false,
                                                blankText : '出生地不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.GAHJD',
                                                fieldLabel: '户籍所在地（户口簿）',
                                                allowBlank: false,
                                                blankText : '户籍所在地（户口簿）不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.XJD',
                                                fieldLabel: '现居住地',
                                                allowBlank: false,
                                                blankText : '现居住地不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.GZDW',
                                                fieldLabel: '工作单位',
                                                allowBlank: false,
                                                blankText : '工作单位不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:householdTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.HLX.id',
                                                fieldLabel: '户类型',
                                                allowBlank: false,
                                                blankText : '户类型不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:relationshipWithHouseholdStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.YHZGX.id',
                                                fieldLabel: '与户主关系',
                                                allowBlank: false,
                                                blankText : '与户主关系不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:theOneChildConditionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SFDSZN.id',
                                                fieldLabel: '是否独生子女',
                                                allowBlank: false,
                                                blankText : '是否独生子女不能为空'

                                            }
                                          ]
                              }]
                          }    
                    ];
                return items;
            },
            
            show: function() {
                CreateBaseModel.getLabelWidth=function(){
                    return 140;
                };
                CreateBaseModel.show('添加全员人口基础信息', 'populationInfo', 896, 504, this.getItems());
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
                                                name: 'model.XM',
                                                value: model.XM,
                                                fieldLabel: '姓名',
                                                allowBlank: false,
                                                blankText : '姓名不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.CYM',
                                                value: model.CYM,
                                                fieldLabel: '曾用名 ',
                                                allowBlank: false,
                                                blankText : '曾用名 不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:nationalityStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.GJ.id',
                                                value: model.GJId,
                                                fieldLabel: '国籍',
                                                allowBlank: false,
                                                blankText : '国籍不能为空'
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
                                                hiddenName: 'model.ZJLX.id',
                                                value: model.ZJLXId,
                                                fieldLabel: '证件类型',
                                                allowBlank: false,
                                                blankText : '证件类型不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.ZJHM',
                                                value: model.ZJHM,
                                                fieldLabel: '证件号码',
                                                allowBlank: false,
                                                blankText : '证件号码不能为空'
                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.GMSFHM',
                                                value: model.GMSFHM,
                                                fieldLabel: '公民身份号码',
                                                allowBlank: false,
                                                blankText : '公民身份号码不能为空'
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
                                                hiddenName: 'model.XB.id',
                                                value: model.XBId,
                                                fieldLabel: '性别',
                                                allowBlank: false,
                                                blankText : '性别不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.CSRQ',
                                                value: model.CSRQ,
                                                fieldLabel: '出生日期',
                                                allowBlank: false,
                                                blankText : '出生日期不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.SWRQ',
                                                value: model.SWRQ,
                                                fieldLabel: '死亡日期',
                                                allowBlank: false,
                                                blankText : '死亡日期不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:educationalBackgroundStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.WHCD.id',
                                                value: model.WHCDId,
                                                fieldLabel: '文化程度',
                                                allowBlank: false,
                                                blankText : '文化程度不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:householdNatureStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.HKXZ.id',
                                                value: model.HKXZId,
                                                fieldLabel: '户口性质',
                                                allowBlank: false,
                                                blankText : '户口性质不能为空'
                                            },
                                            {
                                                xtype: 'combo',
                                                store:nationStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.MZ.id',
                                                value: model.MZId,
                                                fieldLabel: '民族',
                                                allowBlank: false,
                                                blankText : '民族不能为空'
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
                                                store:marriageStateStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.HYZK.id',
                                                value: model.HYZKId,
                                                fieldLabel: '婚姻状况',
                                                allowBlank: false,
                                                blankText : '婚姻状况不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.DHHM',
                                                value: model.DHHM,
                                                fieldLabel: '电话号码',
                                                allowBlank: false,
                                                blankText : '电话号码不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.YDDH',
                                                value: model.YDDH,
                                                fieldLabel: '移动电话',
                                                allowBlank: false,
                                                blankText : '移动电话不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.DZYJ',
                                                value: model.DZYJ,
                                                fieldLabel: '电子邮件',
                                                allowBlank: false,
                                                blankText : '电子邮件不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.CSD',
                                                value: model.CSD,
                                                fieldLabel: '出生地',
                                                allowBlank: false,
                                                blankText : '出生地不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.GAHJD',
                                                value: model.GAHJD,
                                                fieldLabel: '户籍所在地（户口簿）',
                                                allowBlank: false,
                                                blankText : '户籍所在地（户口簿）不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.XJD',
                                                value: model.XJD,
                                                fieldLabel: '现居住地',
                                                allowBlank: false,
                                                blankText : '现居住地不能为空'

                                            },
                                            {
                                                cls : 'attr',
                                                name: 'model.GZDW',
                                                value: model.GZDW,
                                                fieldLabel: '工作单位',
                                                allowBlank: false,
                                                blankText : '工作单位不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:householdTypeStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.HLX.id',
                                                value: model.HLXId,
                                                fieldLabel: '户类型',
                                                allowBlank: false,
                                                blankText : '户类型不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:relationshipWithHouseholdStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.YHZGX.id',
                                                value: model.YHZGXId,
                                                fieldLabel: '与户主关系',
                                                allowBlank: false,
                                                blankText : '与户主关系不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:theOneChildConditionStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.SFDSZN.id',
                                                value: model.SFDSZNId,
                                                fieldLabel: '是否独生子女',
                                                allowBlank: false,
                                                blankText : '是否独生子女不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                marriageStateStore.load();
                householdTypeStore.load();
                sexStore.load();
                documentTypeStore.load();
                nationalityStore.load();
                householdNatureStore.load();
                educationalBackgroundStore.load();
                theOneChildConditionStore.load();
                nationStore.load();
                relationshipWithHouseholdStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 140;
                };
                ModifyBaseModel.show('修改全员人口基础信息', 'populationInfo', 896, 504, this.getItems(model),model);
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
                                                value: model.XM,
                                                fieldLabel: '姓名'
                                            },
                                            {
                                                value: model.CYM,
                                                fieldLabel: '曾用名 '
                                            },
                                            {
                                                value: model.GJ,
                                                fieldLabel: '国籍'
                                            },
                                            {
                                                value: model.ZJLX,
                                                fieldLabel: '证件类型'
                                            },
                                            {
                                                value: model.ZJHM,
                                                fieldLabel: '证件号码'
                                            },
                                            {
                                                value: model.GMSFHM,
                                                fieldLabel: '公民身份号码'
                                            },
                                            {
                                                value: model.XB,
                                                fieldLabel: '性别'
                                            },
                                            {
                                                value: model.CSRQ,
                                                fieldLabel: '出生日期'
                                            },
                                            {
                                                value: model.SWRQ,
                                                fieldLabel: '死亡日期'
                                            },
                                            {
                                                value: model.WHCD,
                                                fieldLabel: '文化程度'
                                            },
                                            {
                                                value: model.HKXZ,
                                                fieldLabel: '户口性质'
                                            },
                                            {
                                                value: model.MZ,
                                                fieldLabel: '民族'
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
                                                value: model.HYZK,
                                                fieldLabel: '婚姻状况'
                                            },
                                            {
                                                value: model.DHHM,
                                                fieldLabel: '电话号码'
                                            },
                                            {
                                                value: model.YDDH,
                                                fieldLabel: '移动电话'
                                            },
                                            {
                                                value: model.DZYJ,
                                                fieldLabel: '电子邮件'
                                            },
                                            {
                                                value: model.CSD,
                                                fieldLabel: '出生地'
                                            },
                                            {
                                                value: model.GAHJD,
                                                fieldLabel: '户籍所在地（户口簿）'
                                            },
                                            {
                                                value: model.XJD,
                                                fieldLabel: '现居住地'
                                            },
                                            {
                                                value: model.GZDW,
                                                fieldLabel: '工作单位'
                                            },
                                            {
                                                value: model.HLX,
                                                fieldLabel: '户类型'
                                            },
                                            {
                                                value: model.YHZGX,
                                                fieldLabel: '与户主关系'
                                            },
                                            {
                                                value: model.SFDSZN,
                                                fieldLabel: '是否独生子女'
                                            }
                                          ]
                              }]
                          }    
                 ];
                return items;
            },

            show: function(model) {
                DisplayBaseModel.getLabelWidth=function(){
                    return 140;
                };
                DisplayBaseModel.show('全员人口基础信息详细信息', 'populationInfo', 896, 504, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'XM'},
 				{name: 'CYM'},
 				{name: 'GJ'},
 				{name: 'ZJLX'},
 				{name: 'ZJHM'},
 				{name: 'GMSFHM'},
 				{name: 'XB'},
 				{name: 'CSRQ'},
 				{name: 'SWRQ'},
 				{name: 'WHCD'},
 				{name: 'HKXZ'},
 				{name: 'MZ'},
 				{name: 'HYZK'},
 				{name: 'DHHM'},
 				{name: 'YDDH'},
 				{name: 'DZYJ'},
 				{name: 'CSD'},
 				{name: 'GAHJD'},
 				{name: 'XJD'},
 				{name: 'GZDW'},
 				{name: 'HLX'},
 				{name: 'YHZGX'},
 				{name: 'SFDSZN'},
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
 				{header: "姓名", width: 20, dataIndex: 'XM', sortable: true},
 				{header: "曾用名 ", width: 20, dataIndex: 'CYM', sortable: true},
 				{header: "国籍", width: 20, dataIndex: 'GJ', sortable: true},
 				{header: "证件类型", width: 20, dataIndex: 'ZJLX', sortable: true},
 				{header: "证件号码", width: 20, dataIndex: 'ZJHM', sortable: true},
 				{header: "公民身份号码", width: 20, dataIndex: 'GMSFHM', sortable: true},
 				{header: "性别", width: 20, dataIndex: 'XB', sortable: true},
 				{header: "出生日期", width: 20, dataIndex: 'CSRQ', sortable: true},
 				{header: "死亡日期", width: 20, dataIndex: 'SWRQ', sortable: true},
 				{header: "文化程度", width: 20, dataIndex: 'WHCD', sortable: true},
 				{header: "户口性质", width: 20, dataIndex: 'HKXZ', sortable: true},
 				{header: "民族", width: 20, dataIndex: 'MZ', sortable: true},
 				{header: "婚姻状况", width: 20, dataIndex: 'HYZK', sortable: true},
 				{header: "电话号码", width: 20, dataIndex: 'DHHM', sortable: true},
 				{header: "移动电话", width: 20, dataIndex: 'YDDH', sortable: true},
 				{header: "电子邮件", width: 20, dataIndex: 'DZYJ', sortable: true},
 				{header: "出生地", width: 20, dataIndex: 'CSD', sortable: true},
 				{header: "户籍所在地（户口簿）", width: 20, dataIndex: 'GAHJD', sortable: true},
 				{header: "现居住地", width: 20, dataIndex: 'XJD', sortable: true},
 				{header: "工作单位", width: 20, dataIndex: 'GZDW', sortable: true},
 				{header: "户类型", width: 20, dataIndex: 'HLX', sortable: true},
 				{header: "与户主关系", width: 20, dataIndex: 'YHZGX', sortable: true},
 				{header: "是否独生子女", width: 20, dataIndex: 'SFDSZN', sortable: true},
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