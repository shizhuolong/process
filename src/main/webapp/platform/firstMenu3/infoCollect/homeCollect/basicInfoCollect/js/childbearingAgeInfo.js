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
    var action='childbearing-age-info';
    
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
                                                id:'search_ZFRYBM',
                                                fieldLabel: '丈夫人员'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_FNHYZK_name',
                                                store:marriageStateStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '妇女婚姻状况'
                                            },
                                            {
                                                xtype: 'combo',
                                                id:'search_ZFHYZK_name',
                                                store:marriageStateStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'text',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                fieldLabel: '丈夫婚姻状况'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                id:'search_FNCHRQ',
                                                fieldLabel: '妇女初婚日期'
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
                                                id:'search_FNHBRQ',
                                                fieldLabel: '婚姻变更日期'
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

                    //丈夫人员
                    var search_ZFRYBM=parent.Ext.getCmp('search_ZFRYBM').getValue();
                    if(search_ZFRYBM.toString()!=""){
                        search_ZFRYBM=' +ZFRYBM:'+search_ZFRYBM;
                        data.push(search_ZFRYBM);
                    }

                    //妇女婚姻状况
                    var search_FNHYZK_name=parent.Ext.getCmp('search_FNHYZK_name').getValue();
                    if(search_FNHYZK_name.toString()!=""){
                        search_FNHYZK_name=' +FNHYZK_name:'+search_FNHYZK_name;
                        data.push(search_FNHYZK_name);
                    }

                    //丈夫婚姻状况
                    var search_ZFHYZK_name=parent.Ext.getCmp('search_ZFHYZK_name').getValue();
                    if(search_ZFHYZK_name.toString()!=""){
                        search_ZFHYZK_name=' +ZFHYZK_name:'+search_ZFHYZK_name;
                        data.push(search_ZFHYZK_name);
                    }

                    //妇女初婚日期
                    //时间类型
                    var search_FNCHRQ=parent.Ext.getCmp('search_FNCHRQ').getValue();
                    var search_FNCHRQFormatValue=parent.Ext.getCmp('search_FNCHRQ').value;
                    if(search_FNCHRQ!="" && search_FNCHRQFormatValue!=undefined){
                        search_FNCHRQ=' +FNCHRQ:['+search_FNCHRQFormatValue+" TO "+search_FNCHRQFormatValue+"]";
                        data.push(search_FNCHRQ);
                    }

                    //婚姻变更日期
                    //时间类型
                    var search_FNHBRQ=parent.Ext.getCmp('search_FNHBRQ').getValue();
                    var search_FNHBRQFormatValue=parent.Ext.getCmp('search_FNHBRQ').value;
                    if(search_FNHBRQ!="" && search_FNHBRQFormatValue!=undefined){
                        search_FNHBRQ=' +FNHBRQ:['+search_FNHBRQFormatValue+" TO "+search_FNHBRQFormatValue+"]";
                        data.push(search_FNHBRQ);
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
                    AdvancedSearchBaseModel.search(data, "ChildbearingAgeInfo");
            },
            
            show: function() {
                AdvancedSearchBaseModel.getLabelWidth=function(){
                    return 140;
                };
                AdvancedSearchBaseModel.show('高级搜索','childbearingAgeInfo', 800, 280, this.getItems(), this.callback);
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

                                                name: 'model.ZFRYBM.id',
                                                fieldLabel: '丈夫人员',
                                                allowBlank: false,
                                                blankText : '丈夫人员不能为空'
                                            },
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
                                                hiddenName: 'model.FNHYZK.id',
                                                fieldLabel: '妇女婚姻状况',
                                                allowBlank: false,
                                                blankText : '妇女婚姻状况不能为空'
                                            },
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
                                                hiddenName: 'model.ZFHYZK.id',
                                                fieldLabel: '丈夫婚姻状况',
                                                allowBlank: false,
                                                blankText : '丈夫婚姻状况不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FNCHRQ',
                                                fieldLabel: '妇女初婚日期',
                                                allowBlank: false,
                                                blankText : '妇女初婚日期不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FNHBRQ',
                                                fieldLabel: '婚姻变更日期',
                                                allowBlank: false,
                                                blankText : '婚姻变更日期不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',

                                                name: 'model.XYNH',
                                                fieldLabel: '现有男孩数',
                                                allowBlank: false,
                                                blankText : '现有男孩数不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',

                                                name: 'model.XYNVH',
                                                fieldLabel: '现有女孩数',
                                                allowBlank: false,
                                                blankText : '现有女孩数不能为空'
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
                                                name: 'model.FNDSLZRQ',
                                                fieldLabel: '妇女领独生子女证日期',
                                                allowBlank: false,
                                                blankText : '妇女领独生子女证日期不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.ZFDSLZRQ',
                                                fieldLabel: '丈夫领独生子女证日期',
                                                allowBlank: false,
                                                blankText : '丈夫领独生子女证日期不能为空'

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
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.JRXTRQ',
                                                fieldLabel: '进入日期',
                                                allowBlank: false,
                                                blankText : '进入日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:reasonOfEnterWISStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.JRXTYY.id',
                                                fieldLabel: '进入原因',
                                                allowBlank: false,
                                                blankText : '进入原因不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.TCXTRQ',
                                                fieldLabel: '退出日期',
                                                allowBlank: false,
                                                blankText : '退出日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:reasonOfExitWISStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.TCXTYY.id',
                                                fieldLabel: '退出原因',
                                                allowBlank: false,
                                                blankText : '退出原因不能为空'

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
                CreateBaseModel.show('添加育龄夫妇信息', 'childbearingAgeInfo', 800, 376, this.getItems());
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
                                                name: 'model.ZFRYBM.id',
                                                value: model.ZFRYBM_id,
                                                fieldLabel: '丈夫人员',
                                                allowBlank: false,
                                                blankText : '丈夫人员不能为空'
                                            },
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
                                                hiddenName: 'model.FNHYZK.id',
                                                value: model.FNHYZKId,
                                                fieldLabel: '妇女婚姻状况',
                                                allowBlank: false,
                                                blankText : '妇女婚姻状况不能为空'
                                            },
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
                                                hiddenName: 'model.ZFHYZK.id',
                                                value: model.ZFHYZKId,
                                                fieldLabel: '丈夫婚姻状况',
                                                allowBlank: false,
                                                blankText : '丈夫婚姻状况不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FNCHRQ',
                                                value: model.FNCHRQ,
                                                fieldLabel: '妇女初婚日期',
                                                allowBlank: false,
                                                blankText : '妇女初婚日期不能为空'
                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.FNHBRQ',
                                                value: model.FNHBRQ,
                                                fieldLabel: '婚姻变更日期',
                                                allowBlank: false,
                                                blankText : '婚姻变更日期不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.XYNH',
                                                value: model.XYNH,
                                                fieldLabel: '现有男孩数',
                                                allowBlank: false,
                                                blankText : '现有男孩数不能为空'
                                            },
                                            {
                                                xtype:'numberfield',
                                                cls : 'attr',
                                                name: 'model.XYNVH',
                                                value: model.XYNVH,
                                                fieldLabel: '现有女孩数',
                                                allowBlank: false,
                                                blankText : '现有女孩数不能为空'
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
                                                name: 'model.FNDSLZRQ',
                                                value: model.FNDSLZRQ,
                                                fieldLabel: '妇女领独生子女证日期',
                                                allowBlank: false,
                                                blankText : '妇女领独生子女证日期不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.ZFDSLZRQ',
                                                value: model.ZFDSLZRQ,
                                                fieldLabel: '丈夫领独生子女证日期',
                                                allowBlank: false,
                                                blankText : '丈夫领独生子女证日期不能为空'

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
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.JRXTRQ',
                                                value: model.JRXTRQ,
                                                fieldLabel: '进入日期',
                                                allowBlank: false,
                                                blankText : '进入日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:reasonOfEnterWISStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.JRXTYY.id',
                                                value: model.JRXTYYId,
                                                fieldLabel: '进入原因',
                                                allowBlank: false,
                                                blankText : '进入原因不能为空'

                                            },
                                            {
                                                xtype:'datefield',
                                                format:"Y-m-d",
                                                editable:false,
                                                cls : 'attr',
                                                name: 'model.TCXTRQ',
                                                value: model.TCXTRQ,
                                                fieldLabel: '退出日期',
                                                allowBlank: false,
                                                blankText : '退出日期不能为空'

                                            },
                                            {
                                                xtype: 'combo',
                                                store:reasonOfExitWISStore,
                                                emptyText:'请选择',
                                                mode:'remote',
                                                valueField:'value',
                                                displayField:'text',
                                                triggerAction:'all',
                                                forceSelection: true,
                                                editable:       false,
                                                cls : 'attr',
                                                hiddenName: 'model.TCXTYY.id',
                                                value: model.TCXTYYId,
                                                fieldLabel: '退出原因',
                                                allowBlank: false,
                                                blankText : '退出原因不能为空'

                                            }
                                          ]
                              }]
                          }    
                   ];
                return items;
            },

            show: function(model) {
                marriageStateStore.load();
                reasonOfEnterWISStore.load();
                reasonOfExitWISStore.load();
                contraceptionStore.load();
                ModifyBaseModel.getLabelWidth=function(){
                    return 140;
                };
                ModifyBaseModel.show('修改育龄夫妇信息', 'childbearingAgeInfo', 800, 376, this.getItems(model),model);
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
                                                value: model.ZFRYBM_XM,
                                                fieldLabel: '丈夫人员'
                                            },
                                            {
                                                value: model.FNHYZK,
                                                fieldLabel: '妇女婚姻状况'
                                            },
                                            {
                                                value: model.ZFHYZK,
                                                fieldLabel: '丈夫婚姻状况'
                                            },
                                            {
                                                value: model.FNCHRQ,
                                                fieldLabel: '妇女初婚日期'
                                            },
                                            {
                                                value: model.FNHBRQ,
                                                fieldLabel: '婚姻变更日期'
                                            },
                                            {
                                                value: model.XYNH,
                                                fieldLabel: '现有男孩数'
                                            },
                                            {
                                                value: model.XYNVH,
                                                fieldLabel: '现有女孩数'
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
                                                value: model.FNDSLZRQ,
                                                fieldLabel: '妇女领独生子女证日期'
                                            },
                                            {
                                                value: model.ZFDSLZRQ,
                                                fieldLabel: '丈夫领独生子女证日期'
                                            },
                                            {
                                                value: model.BYZK,
                                                fieldLabel: '避孕状况'
                                            },
                                            {
                                                value: model.BYKSRQ,
                                                fieldLabel: '避孕开始日期'
                                            },
                                            {
                                                value: model.JRXTRQ,
                                                fieldLabel: '进入日期'
                                            },
                                            {
                                                value: model.JRXTYY,
                                                fieldLabel: '进入原因'
                                            },
                                            {
                                                value: model.TCXTRQ,
                                                fieldLabel: '退出日期'
                                            },
                                            {
                                                value: model.TCXTYY,
                                                fieldLabel: '退出原因'
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
                DisplayBaseModel.show('育龄夫妇信息详细信息', 'childbearingAgeInfo', 800, 376, this.getItems(model));
            }
        };
    } ();       
    //表格
    GridModel = function() {
        return {
            getFields: function(){
                var fields=[
 				{name: 'FNRYBM_XM'},
 				{name: 'ZFRYBM_XM'},
 				{name: 'FNHYZK'},
 				{name: 'ZFHYZK'},
 				{name: 'FNCHRQ'},
 				{name: 'FNHBRQ'},
 				{name: 'XYNH'},
 				{name: 'XYNVH'},
 				{name: 'FNDSLZRQ'},
 				{name: 'ZFDSLZRQ'},
 				{name: 'BYZK'},
 				{name: 'BYKSRQ'},
 				{name: 'JRXTRQ'},
 				{name: 'JRXTYY'},
 				{name: 'TCXTRQ'},
 				{name: 'TCXTYY'},
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
 				{header: "丈夫人员", width: 20, dataIndex: 'ZFRYBM_XM', sortable: true},
 				{header: "妇女婚姻状况", width: 20, dataIndex: 'FNHYZK', sortable: true},
 				{header: "丈夫婚姻状况", width: 20, dataIndex: 'ZFHYZK', sortable: true},
 				{header: "妇女初婚日期", width: 20, dataIndex: 'FNCHRQ', sortable: true},
 				{header: "婚姻变更日期", width: 20, dataIndex: 'FNHBRQ', sortable: true},
 				{header: "现有男孩数", width: 20, dataIndex: 'XYNH', sortable: true},
 				{header: "现有女孩数", width: 20, dataIndex: 'XYNVH', sortable: true},
 				{header: "妇女领独生子女证日期", width: 20, dataIndex: 'FNDSLZRQ', sortable: true},
 				{header: "丈夫领独生子女证日期", width: 20, dataIndex: 'ZFDSLZRQ', sortable: true},
 				{header: "避孕状况", width: 20, dataIndex: 'BYZK', sortable: true},
 				{header: "避孕开始日期", width: 20, dataIndex: 'BYKSRQ', sortable: true},
 				{header: "进入日期", width: 20, dataIndex: 'JRXTRQ', sortable: true},
 				{header: "进入原因", width: 20, dataIndex: 'JRXTYY', sortable: true},
 				{header: "退出日期", width: 20, dataIndex: 'TCXTRQ', sortable: true},
 				{header: "退出原因", width: 20, dataIndex: 'TCXTYY', sortable: true},
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