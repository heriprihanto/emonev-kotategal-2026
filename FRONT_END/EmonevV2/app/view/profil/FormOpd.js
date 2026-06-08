Ext.define('Admin.view.profil.FormOpd', {
    extend: 'Ext.form.Panel',
    xtype:'form-profil-opd',id:'xprofil-form-profil-opd',margin: '10 0 0 0',jsonSubmit :true,

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.kinerja.Controller2'},
    bodyPadding: 50,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults:{clearable : false,labelAlign:'top'},

    items: [
        {xtype: 'combobox',required:true,label: 'OPD',placeholder: 'Pilih OPD ...', queryMode: 'local',valueField: 'id_sub_pd', displayField: 'nama_pd',
            striped: true,name: 'id_sub_pd',
            listeners: {
                change: function (combo, nV, oV,e) {
                    console.log(combo.getSelection().data);
                    var form = this.up('formpanel');
                    form.setRecord(combo.getSelection());
                }
            },
            store: {autoLoad: true,fields: ['id_pd', 'nama_pd'],
                proxy: {
                    type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
                    url: REMOTE_URL + 'pengaturan/profil-opd',
                    reader: { type: 'json' },
                }
            },
        },
        
        {xtype:'textfield',label:'Alamat:',name:'alamat',required:true},
        {xtype:'textfield',label:'No. Telp:',name:'telp',required:true},
        {xtype:'emailfield',label:'Email:',name:'email',required:true,validators: 'email'},
        {xtype:'textfield',label:'Nama Jabatan Pimpinan:',name:'jabatan_kepala',required:true},
        {xtype:'textfield',label:'Nama Pimpinan:',name:'nama_kepala',required:true},
        {xtype:'textfield',label:'NIP Pimpinan:',name:'nip_kepala',required:true},
        
    ],
    tbar: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Simpan',ui: "soft-green",handler: 'simpanOpd',iconCls: 'x-fa fa-paper-plane',margin: '0 0 0 30'} 
    ]

});
