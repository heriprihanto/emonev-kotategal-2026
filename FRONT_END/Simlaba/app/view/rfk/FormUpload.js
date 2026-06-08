Ext.define('Admin.view.rfk.FormUpload', {
    extend: 'Ext.form.Panel',
    xtype:'rfk-form-upload',

	cls: 'shadow',
    fullscreen: true,
    //viewModel: {xclass: 'Admin.view.rfk.ViewModel'},
	//controller: {xclass: 'Admin.view.rfk.Controller'},
   
    bodyPadding: 10,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelWidth: 100,
        labelSeparator: ''
    },

    items:[
        
        { xtype: "hiddenfield", name: "id_pekerjaan" },
        {xtype: 'hiddenfield',name: 'puser',value:vUSER_INFO.display_name},
        { xtype: 'selectfield',name: 'jenis',margin: '0 20',label: 'Pilih Jenis',required:true,
                options: [
                    {text:'Cover Buku Kontrak',value:'Cover Kontrak'},{text:'Foto 0%',value:'0 %'},{text:'Foto 25%',value:'25 %'},{text:'Foto 50%',value:'50 %'},{text:'Foto 75%',value:'75 %'},{text:'Foto 100%',value:'100 %'},
                ],value:'0'
        },
        { xtype: "filefield", clearable: false, label: "File Foto", name: "fotofile",margin: '0 20',accept:'image/*'},
                
        
            
    ],
    buttons: [{text: 'Upload', ui: "action", handler: 'uploadFoto', iconCls: 'x-fa fa-upload'}]

});
