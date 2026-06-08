Ext.define('Admin.view.rencanakinerja.FormVerifikasi', {
    extend: 'Ext.form.Panel',
    xtype:'rencana-kinerja-form-verifikasi',
    //id:'rencana-kinerja-form-verifikasi-x66767432938',
    jsonSubmit: true,

	cls: 'shadow',
    fullscreen: true,
    scrollable: true,
    bodyPadding: 10,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {labelAlign:'top'},

    items:[
        { xtype: "numberfield", name: "mode",hidden:true},
        { xtype: "numberfield", name: "v1",hidden:true},
        { xtype: "numberfield", name: "v2",hidden:true},
        { xtype: "numberfield", name: "tahun",hidden:true, value:2026},
        { xtype: "numberfield", name: "id_sub_pd",hidden:true},
        { xtype: "numberfield", name: "id_pd",hidden:true},
        {xtype:"containerfield",defaults: {labelAlign:'top'},items:[
            {xtype:"numberfield", name: "jml_indikator",label:"Jumlah Indikator",readOnly:true,flex:1},
            {xtype:"numberfield", name: "jml_indikator_isi",label:"Jumlah Indikator Ter Isi",readOnly:true,flex:1,margin:'0 15'},
         
        ]},
        {xtype:"grid",height:350,id:"gridopdlistverifikasi",
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
        {xtype:'spacer'},
        {text: 'Submit', ui: "soft-cyan",shadow:true, 
			handler: 'simpanVerifikasi', iconCls: 'x-fa fa-save'}]

});
