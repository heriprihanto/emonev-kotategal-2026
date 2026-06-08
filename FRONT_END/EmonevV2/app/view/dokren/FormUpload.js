Ext.define('Admin.view.dokren.FormUpload', {
    extend: 'Ext.form.Panel',
    xtype:'form-dokumen-upload',

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.tablet.capkin.Controller'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',

    items: [
        {xtype:"filefield",clearable: false, label: "File", name: "userfile",labelAlign:'top',
            listeners: {
               // change : 'uploadFile' 
            }
        },
    ],
    buttons: [
       
	    {text: 'Tutup',ui: "soft-red",handler: 'onCancel',iconCls: 'x-fa fa-times'},
        {xtype:'spacer'},
        {text: 'Upload',ui: "soft-green",handler: 'uploadFile',iconCls: 'x-fa fa-upload'},
    ]

});
