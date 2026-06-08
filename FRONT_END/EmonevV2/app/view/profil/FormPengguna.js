Ext.define('Admin.view.profil.FormPengguna', {
    extend: 'Ext.form.Panel',
    xtype:'form-profil-pengguna',id:'xprofil-form-profil-pengguna',margin: '10 0 0 0',jsonSubmit :true,

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.profil.Controller'},
    bodyPadding: 30,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults:{clearable : false,labelAlign:'top'},viewModel: true,


    items: [
        {xtype:'numberfield',label:'Username :',name:'id',value:vUSER_INFO.id,hidden:true},
        {xtype:'textfield',label:'Username :',name:'username',value:vUSER_INFO.username,readOnly:true},
        {xtype:'textfield',label:'Nama :',name:'display_name',value:vUSER_INFO.display_name},
        {xtype:'textfield',label:'Email :',name:'email',value:vUSER_INFO.email},
        {xtype:'textfield',label:'Nomor HP :',name:'no_telp',value:vUSER_INFO.no_telp},
        {
            xtype: 'checkboxfield',name: 'isChecked',
            label: 'Ganti Password',
            reference: 'isChecked'
        }, 
        {xtype:'passwordfield',label:'Password : (Kosongkan jika tidak akan mengganti password, Isi password baru jika akan mengganti password)',name:'password1',
            bind: {disabled: '{!isChecked.checked}',required: '{isChecked.checked}'}},
        {xtype:'passwordfield',label:'Konfirmasi Password :',name:'password2',bind: {disabled: '{!isChecked.checked}',required: '{isChecked.checked}'}},        
    ],
    tbar: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Simpan',ui: "soft-green",handler: 'simpanUser',iconCls: 'x-fa fa-paper-plane',margin: '0 0 0 30'} 
    ]

});
