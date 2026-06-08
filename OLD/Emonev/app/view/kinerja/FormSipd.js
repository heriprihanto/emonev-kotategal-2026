Ext.define('Admin.view.rfk.FormSipd', {
    extend: 'Ext.form.Panel',
    reference: 'formSimda',xtype:'form-sipd-penatausahaan',jsonSubmit :true,id:'form-sipd-penatausahaan',
    //standardSubmit: true,

	cls: 'shadow',
	fullscreen: true,
    controller: {xclass: 'Admin.view.kinerja.Controller'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelAlign:'top'
    },
    

    items: [
        {xtype:'fieldset',cls:'fieldset-bg-info', 
            items:[
                { xtype: 'selectfield',margin:'0 15 0 15',
                    name: 'f_bulan',
                    label: 'Bulan',
                    options: [
                        {text:'Januari',value:1},{text:'Februari',value:2},{text:'Maret',value:3},{text:'April',value:4},{text:'Mei',value:5},{text:'Juni',value:6},{text:'Juli',value:7},{text:'Agustus',value:8},{text:'September',value:9},{text:'Oktober',value:10},{text:'November',value:11},{text:'Desember',value:12}
                    ],required: true,
                    listeners:{
                        //change:'gantiBulan'
                    }
                },
                {xtype:"numberfield",clearable : false,label:"Tahun",name:"ptahun",value:vTAHUN,margin:'0 15 0 15'},
            ]
        },
       
        {xtype:'fieldset',title:'<b>Informasi Pengguna SIPD Penatausahaan</b>', cls:'fieldset-bg-warning', 
            items:[
                {xtype:"textfield",clearable : false,label:"Username",name:"username",required:true},
                {xtype:"textfield",clearable : false,label:"Password",name:"password",required:true},
                
                {
                    xtype: 'containerfield', cls: 'field-captcha',
                    items: [
                        { xtype: "button", ui: "header linkbutton", iconCls: 'x-fa fa-sync putih', handler: 'genCaptcha' },
                        { xtype: "component", html: '<div id="sipdcaptcha"></div>', margin: '10 10 10 30' },
                    ]
                },
                {xtype:"textfield",clearable : false,label:"ID",name:"chaptchaid",required:true,id:'sipdchaptchaid',hidden:true},
                {xtype:"textfield",clearable : false,label:"Chaptcha",name:"chaptcha",required:true},
            ]
        },
        
        
        {xtype:"textfield",clearable : false,label:"Tgl1",name:"tgl_1",hidden:true},
        {xtype:"textfield",clearable : false,label:"Tgl2",name:"tgl_2",hidden:true},
        {xtype:"textfield",clearable : false,label:"Tglrange",name:"tgl_range",hidden:true},
        {xtype:"textfield",clearable : false,label:"Tgl laporan",hidden:true,name:"tgl_laporan",value:Ext.Date.format(new Date(), 'Y-m-d')},
        {xtype:"numberfield",clearable : false,label:"idskpd",name:"idskpd",hidden:true},
        {xtype:"numberfield",clearable : false,label:"idunit",name:"idunit",hidden:true},
        {xtype:"numberfield",clearable : false,label:"idsubunit",name:"idsubunit",hidden:true},
        {xtype:"textfield",clearable : false,label:"OPD",name:"nm_opd",hidden:true},

    ],
    buttons: [
        {text: 'Batal', ui: 'soft-red',shadow:true, handler: function (btn) { btn.up().up().up().destroy(); }, iconCls: 'x-fa fa-window-close'}, 
        { xtype: 'spacer' },
        {text: 'Proses', ui: "soft-green",shadow:true, iconCls: 'x-fa fa-print',handler: 'updateRealKeu' }
        
                ]
});