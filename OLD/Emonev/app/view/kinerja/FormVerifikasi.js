Ext.define('Admin.view.kinerja.FormVerifikasi', {
    extend: 'Ext.form.Panel',
    xtype:'form-kinerja-verifikasi',jsonSubmit :true,


	cls: 'shadow',
	fullscreen: true,
    controller: {xclass: 'Admin.view.kinerja.Controller2'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    items: [
        {xtype: 'containerfield',required: true,defaults: {flex: 1},
        items: [
                { xtype: 'selectfield',labelAlign:'top',
                    name: 'tw',margin: '0 20',
                    label: 'Triwulan',value:'1',
                    options: [
                        {text: 'I (Satu)',value: '1'},
                        {text: 'II (Dua)',value: '2'},
                        {text: 'III (Tiga)',value: '3'},{text: 'IV (Empat)',value: '4'}
                    ],required: true,
                },
                { xtype: 'selectfield',labelAlign:'top',
                    name: 'locked',margin: '0 20',
                    label: 'Status',value:1,
                    options: [
                        {text: 'Buka Laporan',value: 0},
                        {text: 'Verifikasi',value: 1},
                        {text: 'Batalkan Verifikasi',value: 0},
                    ],required: true,
                },
            
                { xtype: "numberfield",labelAlign:'top', clearable: false, label: "Tahun", name: "tahun", value: vTAHUN, width: 300, margin: '0 5' },
                { xtype: "numberfield",labelAlign:'top',hidden:true, clearable: false, label: "Tahun", name: "id_pd", width: 300, margin: '0 5' },
               
                
            ]
        },
        { xtype: "textareafield", labelAlign:'top',required: true,clearable: false, label: "Catatan", name: "tl_tw", margin: '0 5' },
        { xtype: "textareafield", labelAlign:'top',required: true,clearable: false, label: "Tindak lanjut yang diperlukan dalam Renja tahun berikutnya", name: "tl_n", margin: '0 5' },
    ],
    buttons: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Verifikasi',ui: "soft-green",handler: 'verifikasiLaporan',iconCls: 'x-fa fa-check'} 
    ]

});
