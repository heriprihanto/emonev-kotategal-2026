Ext.define('Admin.view.kinerja.FormUpload', {
    extend: 'Ext.form.Panel',
    xtype:'form-kinerja-upload',

	cls: 'shadow',
	fullscreen: true,
    controller: {xclass: 'Admin.view.kinerja.ControllerUpload'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',

    items: [
        {xtype:"hiddenfield",name:"idindikator",label:"id"},
        {xtype:"hiddenfield",name:"tw",label:"tw"},
        {xtype:"filefield",clearable: false, label: "File", name: "userfile",labelAlign:'top'
            //listeners: {change : 'uploadFile'}
        },
    ],
    buttons: [
        {text: 'Tutup',ui: "soft-red",shadow:true, handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'},
        {xtype:'spacer'},
	    {text: 'Upload',ui: "soft-green",shadow:true,handler: 'uploadFile',iconCls: 'x-fa fa-upload'} 
    ]

});
