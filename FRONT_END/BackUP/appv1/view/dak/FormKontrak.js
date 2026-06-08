Ext.define('Admin.view.dak.FormKontrak', {
    extend: 'Ext.form.Panel',
    xtype:'form-dak-kinerja-kontrak',id:'form-dak-kinerja-kontrak',

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.tablet.capkin.Controller'},
    bodyPadding: 20,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        //labelWidth: 100,labelSeparator: ''
        labelAlign:'top'
    },

    

    items: [
        {xtype:"hiddenfield",name:"id"},
        
        {xtype:"hiddenfield",name:"lvl"},
        {xtype:'containerfield',defaults: {labelAlign:'top'},
            items:[
            {xtype:"textfield",clearable : false,label:"Nomor Kontrak",name:"no_kontrak",width:150},
            {xtype:"datefield",clearable : false,label:"Tanggal Kontrak",name:"tgl_kontrak",required: true,margin: '0 20',width:150},
            {xtype:"textfield",flex: 1,clearable : false,label:"Jangka Waktu",name:"jangka_waktu",required: true,margin: '0 20'},
            {xtype:"numberfield",flex: 1,clearable : false,label:"Nilai",name:"nilai",required: true,margin: '0 20'},
            {xtype:"textfield",flex: 1,clearable : false,label:"ID Kontrak LKPP",name:"id_lkpp",required: true,margin: '0 20'},
        ]},
        {xtype:"textfield",clearable : false,label:"Judul Kontrak",name:"judul_kontrak"},
        {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
            {xtype:"textfield",flex:1,clearable : false,label:"Nama Perusahaan",name:"nama_perusahaan"},
            {xtype:"textfield",flex:1,clearable : false,label:"Bentuk Perusahaan",name:"bentuk_perusahaan",required: true,margin: '0 20'},
        ]},
        {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
            {xtype:"textfield",flex:1,clearable : false,label:"Alamat Perusahaan",name:"alamat_perusahaan"},
            {xtype:"textfield",flex:1,clearable : false,label:"Nama Pimpinan Perusahaan",name:"nama_pimpinan_perusahaan",required: true,margin: '0 20'},
        ]},

    ],
    
    bbar: [
        {xtype: 'button',ui : 'soft-red',text: 'Tutup',iconCls: 'x-fa fa-window-close',margin:'0 5 0 5',handler:function(btn){btn.up().up().up().up().up().hide();},destIdx:2}, 
        {xtype:'spacer'},
	    {text: 'Simpan',ui: "soft-green",handler: 'simpanKontrak',iconCls: 'x-fa fa-save'} 
    ]

});
