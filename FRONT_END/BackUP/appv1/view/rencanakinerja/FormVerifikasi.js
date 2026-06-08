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
        {xtype:"numberfield", name: "jml_indikator",label:"Jumlah Indikator",readOnly:true},
        {xtype:"numberfield", name: "jml_indikator_isi",label:"Jumlah Indikator Ter Isi",readOnly:true},
            
    ],
    buttons: [
        {xtype:'spacer'},
        {text: 'Submit', ui: "soft-cyan",shadow:true, 
			handler: 'simpanVerifikasi', iconCls: 'x-fa fa-save'}]

});
