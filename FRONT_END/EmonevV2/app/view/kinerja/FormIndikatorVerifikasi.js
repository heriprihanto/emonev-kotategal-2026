Ext.define('Admin.view.kinerja.FormIndikatorVerifikasi', {
    extend: 'Ext.form.Panel',
    xtype:'form_capkin_verifikasi_indikator_kinerja',
    //id:'form-indikator-kinerja-verifikasi-capkin',
    jsonSubmit :true,

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.tablet.capkin.Controller'},
    bodyPadding: 20,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelAlign:'top'
        //labelWidth: 100,labelSeparator: ''
    },
    requires: [
        'Ext.panel.Collapser'
    ],


    viewModel: {
        type: 'default',
        data: {
            formData : {},
            btarget: 0,
            btargetx: 0,
            bidjenis: 0,
            brtw1:0
        },
        formulas: {
            capkin: {
                get: function(get) {

                    return get('x') * 2;
                }
            }
        },
    },


    items: [
        {xtype:"hiddenfield",name:"id"},
        {xtype:"textfield",name:"id_indikator",hidden:true},
        {xtype:"hiddenfield",name:"lvl"},
        {xtype:"numberfield",name:"tw",hidden:true},
        {xtype:"component", bind: {html:`<table class="table table-striped table-bordered">
            <tr><td style="text-align:right;width:200px;"><strong>Indikator :</strong></td><td>{formData.tolok_ukur}</td></tr>
            <tr><td style="text-align:right"><strong>Satuan :</strong></td><td>{formData.satuan}</td></tr>
            <tr><td style="text-align:right"><strong>Target Tahunan :</strong></td><td>{formData.target}</td></tr>
            <tr><td style="text-align:right"><strong>Target Triwulan I :</strong></td><td>{formData.target}</td></tr>
            <tr><td style="text-align:right"><strong>Realisasi Triwulan II :</strong></td><td>{formData.target}</td></tr>
            <tr><td style="text-align:right"><strong>% Realisasi Triwulan II :</strong></td><td>{formData.target}</td></tr>
            <tr><td style="text-align:right"><strong>% Realisasi Tahun ${vTAHUN} :</strong></td><td>{formData.target}</td></tr>
            <tr><td style="text-align:right"><strong>% Bukti Dukung :</strong></td><td></td></tr>
            </table>`} },
        
        {
            xtype: 'selectfield',width: 200,
            name: 'verif1', 
            label: 'Status Verifikasi',
            options: [
                { text: 'Verifikasi', value: 1 },
                { text: 'Tolak', value: 0 }
            ], required: true,
        },
        {xtype:"textareafield",name:"ket",label:"Keterangan",height:100},
        {xtype:"textareafield",name:"up",label:"Faktor Pendukung",height:100},
        {xtype:"textareafield",name:"ms",label:"Faktor Penghambat",height:100},
        {xtype:"textareafield",name:"tl",label:"Tindak Lanjut",height:100},
        {xtype:"textareafield",name:"note1",label:"Catatan Verifikator",height:100},
    ],
    /*
    tbar : [ 
        {xtype: 'button',ui : 'soft-red',text: 'Tutup',shadow:true,iconCls: 'x-fa fa-window-close',margin:'0 25 0 5',handler: 'onBalik',destIdx:3}, 
        { text: '', ui: "soft-blue",shadow:true, handler: 'prevRecord', iconCls: 'x-fa fa-backward' },
        { text: '', ui: "soft-blue",shadow:true, handler: 'nextRecord', iconCls: 'x-fa fa-forward' },
        //{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand'},
        {xtype: 'button',ui : 'soft-green',shadow:true,text: 'Simpan',id:'btn-simpan-capaian-kinerja-xt67-utfek',iconCls: 'x-fa fa-save',margin:'0 5 0 25',handler: 'simpanData',destIdx:1}, 
        {xtype:'spacer'},
        {xtype:'component',html:'<div id="form-capkin-opd-title-009099"></div'},
        
    ],
    */
    bbar: [
        //{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().up().hide();},iconCls: 'x-fa fa-times'},
        {xtype:'spacer'},
	    {text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanDataVerifikasi',iconCls: 'x-fa fa-save'} 
    ]

});
