Ext.define('Admin.view.kinerja.FormUpload', {
    extend: 'Ext.form.Panel',
    xtype:'form-kinerja-upload',

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.kinerja.ControllerUpload'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',

    items: [
        {xtype:"hiddenfield",name:"idindikator",label:"id"},
        {xtype:"numberfield",name:"tw",label:"tw", hidden:true},
        /*
        {xtype:"component",html:`<h3>Upload Bukti Dukung Capaian Kinerja</h3>
            <ul>
            <li>File yang diupload adalah dokumentasi proses / hasil pelaksanaan kegiatan</li>
            <li>Contoh .............</li>
            <li>File (.pdf, .jpg, .jpeg) maksimal 2 MB</li></ul>`},
        */
        {xtype:"filefield",required:true, clearable: false, label: "File", name: "file",labelAlign:'top',placeholder: "Pilih file untuk diupload",
            //listeners: {change : 'uploadFile'}
        },
        {xtype:"component",html:`File (.pdf, .jpg, .jpeg) maksimal 2 MB`}
    ],
    buttons: [
        //{text: 'Tutup',ui: "soft-red",shadow:true, handler:function(btn){btn.up().up().up().hide();},iconCls: 'x-fa fa-window-close'},
        {xtype:'spacer'},
	    {text: 'Upload',ui: "soft-green",shadow:true,handler: 'uploadFile',iconCls: 'x-fa fa-upload'} 
    ]

});
