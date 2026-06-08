Ext.define('Admin.view.kinerja.FormKirim', {
    extend: 'Ext.form.Panel',
    xtype:'form_kinerja_kirim_opd',jsonSubmit :true,

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.kinerja.Controller2'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',

    items: [
        { xtype: "numberfield",name:"id_sub_pd",hidden:true},
        {xtype: 'containerfield',required: true,defaults: {flex: 1},
        items: [
                { xtype: 'selectfield',readOnly:true,labelAlign:'top',
                    name: 'tw',margin: '0 20',
                    label: 'Triwulan',value:'1',
                    options: [
                        {text: 'I (Satu)',value: 1},
                        {text: 'II (Dua)',value: 2},
                        {text: 'III (Tiga)',value: 3},{text: 'IV (Empat)',value: 4}
                    ],required: true,
                },
            
                { xtype: "numberfield",labelAlign:'top', clearable: false, label: "Tahun", name: "tahun", value: vTAHUN, width: 300, margin: '0 5',readOnly:true },
                
            ]
        },
        { xtype: "numberfield",labelAlign:'top', clearable: false, label: "Jumlah Indikator", name: "jml_indikator", margin: '0 20',readOnly:true },
        { xtype: "numberfield", labelAlign:'top',clearable: false, label: "Jumlah Indikator Belum Diisi", name: "jml_kosong", margin: '0 20' ,maxValue:0,readOnly:true},
        //{ xtype: "numberfield", clearable: false, label: "Jumlah Lebih Rendah dari Tw sebelumnya", name: "jml_error", margin: '0 20' ,maxValue:0,readOnly:true},
    ],
    buttons: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Submit',ui: "soft-green",handler: 'kirimLaporan',iconCls: 'x-fa fa-paper-plane'} 
    ]

});
