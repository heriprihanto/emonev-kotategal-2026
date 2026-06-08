Ext.define('Admin.view.dak.FormUpload', {
    extend: 'Ext.form.Panel',
    xtype:'form-dak-formupload',

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.dak.ControllerUpload'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',

    items: [
        {xtype:"hiddenfield",name:"idindikator",label:"id"},
        {xtype:"hiddenfield",name:"tw",label:"tw"},
        {xtype:"textfield",name:"ket",label:"Keterangan",clearable: false,labelAlign:'top'},
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
