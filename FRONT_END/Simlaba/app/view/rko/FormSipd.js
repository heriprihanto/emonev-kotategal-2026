Ext.define('Admin.view.rko.FormSipd', {
    extend: 'Ext.form.Panel',
    reference: 'formSimda',xtype:'rko-form-sipd',jsonSubmit :true,id:'rko-form-sipd-0098oiwoej64jaje',
    //standardSubmit: true,

	cls: 'shadow',
	fullscreen: true,
    controller: {xclass: 'Admin.view.rko.Controller'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelAlign:'top'
    },
    

    items: [
        
       
        {xtype:'fieldset',title:'<b>Informasi Pengguna SIPD Penatausahaan</b>', cls:'fieldset-bg-warning', 
            items:[
                {xtype:"textfield",clearable : false,label:"Username",name:"username",required:true},
                {xtype:"textfield",clearable : false,label:"Password",name:"password",required:true},
                
                {
                    xtype: 'containerfield', cls: 'field-captcha',
                    items: [
                        { xtype: "button", ui: "header linkbutton", iconCls: 'x-fa fa-sync putih', handler: 'genCaptcha' },
                        { xtype: "component", html: '<div id="sipdcaptcharko"></div>', margin: '10 10 10 30' },
                    ]
                },
                {xtype:"textfield",clearable : false,label:"ID",name:"chaptchaid",required:true,id:'sipdchaptchaidrko',hidden:true},
                {xtype:"textfield",clearable : false,label:"Chaptcha",name:"chaptcha",required:true},
            ]
        },
        
        
        
        {xtype:"numberfield",clearable : false,label:"idsubunit",name:"id_sub_pd",hidden:true},
        {xtype:"textfield",clearable : false,label:"OPD",name:"nm_opd",hidden:true},

    ],
    buttons: [
        {text: 'Batal', ui: 'soft-red',shadow:true, handler: function (btn) { btn.up().up().up().destroy(); }, iconCls: 'x-fa fa-window-close'}, 
        { xtype: 'spacer' },
        {text: 'Proses', ui: "soft-green",shadow:true, iconCls: 'x-fa fa-print',handler: 'updateDpaSipd' }
        
                ]
});