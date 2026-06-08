Ext.define('Admin.view.pelaporankinerja.FormUpload', {
    extend: 'Ext.form.Panel',
    xtype:'form-dokumen-laporan-upload',

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.tablet.capkin.Controller'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',

    items: [
        {xtype:"filefield",clearable: false, label: "File", name: "file"},
        {xtype:"numberfield",name:"id_pd",hidden:true},
        {xtype:"numberfield",name:"tahun",hidden:true},
    ],
    buttons: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Tutup',ui: "soft-red",handler: 'onCancel',iconCls: 'x-fa fa-window-close'} ,
        {xtype:'spacer'},
        {text: 'Upload',ui: "soft-green",handler: 'uploadFile',iconCls: 'x-fa fa-upload'} 
    ]

});
