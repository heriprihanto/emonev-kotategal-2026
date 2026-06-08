Ext.define('Admin.view.kinerja.FormKirim', {
    extend: 'Ext.form.Panel',
    xtype:'form_kinerja_kirim_opd',
    id:'form_kinerja_kirim_opd',
    jsonSubmit :true,

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.kinerja.Controller2'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {labelAlign:'top'},

    items: [
        { xtype: "numberfield", name: "mode",hidden:true},
        { xtype: "numberfield", name: "v1",hidden:true},
        { xtype: "numberfield", name: "v2",hidden:true},
        { xtype: "numberfield", name: "tahun",hidden:true, value:vTAHUN},
        { xtype: "numberfield", name: "id_sub_pd",hidden:true},
        { xtype: "numberfield", name: "id_pd",hidden:true},
        {xtype: 'containerfield',required: true,defaults: {flex: 1,labelAlign:'top'},
            items: [
                { xtype: 'selectfield',
                    name: 'ptw',
                    label: 'Triwulan',value:'1',
                    options: [
                        {text: 'I (Satu)',value: 1},
                        {text: 'II (Dua)',value: 2},
                        {text: 'III (Tiga)',value: 3},{text: 'IV (Empat)',value: 4}
                    ],required: true,
                },
            
                { xtype: "numberfield", clearable: false, label: "Tahun", name: "ptahun", value: vTAHUN,  margin: '0 20' },
                
            ]
        },
        {xtype:"containerfield",defaults: {labelAlign:'top'},items:[
            {xtype:"numberfield", name: "jml_indikator",label:"Jumlah Indikator",readOnly:true,flex:1},
            {xtype:"numberfield", name: "jml_indikator_isi",label:"Jumlah Indikator Ter Isi",readOnly:true,flex:1,margin:'0 15'},
         
        ]},
        { xtype: 'selectfield',flex:1,
            name: 'verifikasi',
            label: 'Status',value:'1',
            options: [
                {text: 'Batalkan Verifikasi OPD',value: 2},
                {text: 'Tidak Diverifikasi',value: 0},
                {text: 'Verifikasi',value: 1},
            ],required: true,
        },
        //{ xtype: "numberfield", clearable: false, label: "Jumlah Lebih Rendah dari Tw sebelumnya", name: "jml_error", margin: '0 20' ,maxValue:0,readOnly:true},
        {xtype:"grid",height:'65%',id:"gridopdlistverifikasiKinerja",
            bind: {
                store: '{opdVerifikasiStore}',
            },
            columns: [
                {
                    text: 'Perangkat Daerah / Sub Perangkat Daerah',
                    dataIndex: 'nama_pd',
                    width: '70%'
                },
                {
                    text: '%',
                    dataIndex: 'persen_isi',
                    width: 100,align: 'right'
                },
            ]

        }
    ],
    buttons: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Submit',ui: "soft-green",handler: 'kirimLaporan',iconCls: 'x-fa fa-paper-plane'} 
    ]

});
