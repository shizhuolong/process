//自动生成的文件，请不要修改
    //用户状态
    var userStateStore=new Ext.data.Store({
        proxy : new parent.Ext.data.HttpProxy({
            url : contextPath+'/dictionary/dic!store.action?dic=userState&justCode=true'
        }),
        reader: new Ext.data.JsonReader({},
            Ext.data.Record.create([{
                name: 'value'
            },{
                name: 'text'
            }]))
    });
    //是否
    var choiceStore=new Ext.data.Store({
        proxy : new parent.Ext.data.HttpProxy({
            url : contextPath+'/dictionary/dic!store.action?dic=choice'
        }),
        reader: new Ext.data.JsonReader({},
            Ext.data.Record.create([{
                name: 'value'
            },{
                name: 'text'
            }]))
    });
    //语言
    var langStore=new Ext.data.Store({
        proxy : new parent.Ext.data.HttpProxy({
            url : contextPath+'/dictionary/dic!store.action?dic=lang&justCode=true'
        }),
        reader: new Ext.data.JsonReader({},
            Ext.data.Record.create([{
                name: 'value'
            },{
                name: 'text'
            }]))
    });
