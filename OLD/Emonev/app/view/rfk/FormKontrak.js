Ext.define('Admin.view.rfk.FormKontrak', {
    extend: 'Ext.Panel',
    reference: 'formKontrak', xtype: 'form-kontrak',jsonSubmit :true,

    cls: 'shadow',
    fullscreen: true,
    viewModel: { xclass: 'Admin.view.rfk.ViewModel' },
    controller: { xclass: 'Admin.view.rfk.Controller' },
    bodyPadding: 20, autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults:{labelAlign:'top',clearable : false}, 
    requires: [
        'Ext.layout.Fit'
    ], layout: 'fit',

    items: [
        {
            xtype: 'tabpanel', tabBar: { layout: { pack: 'start', overflow: 'scroller' } },
            items: [
                {
                    title: '.:: RFK', scrollable: true,
                    
                    items: [{
                        xtype: 'formpanel', id: 'tabpanelrfk1-form-rfk', scrollable: true,jsonSubmit :true,
                        items: [
                            { xtype: "textfield", label: "p", name: "id",hidden:true },
                            { xtype: "textfield", label: "p", name: "id_pekerjaan",hidden:true },
                            { xtype: "textfield", label: "p", name: "id_realisasi",hidden:true },
                            //{ xtype: "textfield", label: "Nama Subkegiatan", name: "nm_sub_kegiatan", readOnly: true },
                            
                            
                            {xtype:'fieldset',cls:'fieldset-bg-info', 
                                items:[{
                                    xtype: 'containerfield', layout: 'hbox', defaults: { flex: 1, clearable: false,labelAlign:'top' },
                                    items: [
                                        { xtype: "textfield", label: "Nama Pekerjaan", name: "nama_pekerjaan", readOnly: true, margin: '0 20 0 0',flex:3 },
                                    { xtype: "numberfield", label: "Anggaran", name: "pagu_anggaran", required: true,clearable: false,flex:1,bind: '{a1}'},
                                       
                                    ]
                                },]
                            },
                            
                            {xtype:'fieldset',cls:'fieldset-bg-danger', 
                                items:[{
                                    xtype: 'containerfield', layout: 'hbox', defaults: { flex: 1, clearable: false,labelAlign:'top' },label: "<b>Realisasi Keuangan (Rp.)</b>",labelWidth:200,
                                    items: [
                                        
                                        { xtype: "numberfield",ui: "input-readonly", label: "s.d bulan lalu (Rp.)", name: "keuangan_lalu",required: true ,readOnly: true, margin: '0 20 0 0',bind: '{r1}'},
                                        { xtype: "numberfield", label: "Bulan Ini (Rp.)", name: "keuangan", required: true, margin: '0 20 0 0' ,bind: '{r2}'},
                                        { xtype: "numberfield", label: "Total (Rp.)", name: "keuangan_total",required: true ,readOnly: true,bind: '{r1 + r2}'},
                                    ]
                                },]
                            },
                            {xtype:'fieldset',cls:'fieldset-bg-success', 
                                items:[
                                    {
                                        xtype: 'containerfield', layout: 'hbox', defaults: { flex: 1, clearable: false ,labelAlign:'top'},label: "<b>Realisasi Fisik (%)</b>",labelWidth:200,
                                        items: [
                                            
                                            { xtype: "numberfield", label: "Realisasi Fisik Bulan lalu (%)", name: "fisik_lalu",readOnly: true, required: true, margin: '0 20 0 0' },
                                            { xtype: "numberfield", label: "Realisasi Fisik Bulan ini (%)", name: "fisik",maxValue:100, required: true, margin: '0 20 0 0' },
                                            { xtype: "component", html: ""},
                                        ]
                                    },
                                ]
                            },
                            
                            {xtype:'fieldset',cls:'fieldset-bg-warning', 
                                items:[
                                    { xtype: "textfield", label: "Permasalahan", name: "masalah",clearable: false ,labelAlign:'top'},
                                    { xtype: "textfield", label: "Upaya", name: "upaya" ,clearable: false,labelAlign:'top'},
                                    {xtype:'component',html:'<br/>'}]
                            },
                            
                        ],
                        bbar: [
                            {text: 'Tutup', ui: 'soft-red',shadow:true, handler: function (btn) { btn.up().up().up().up().up().up().hide(); }, iconCls: 'x-fa fa-window-close',margin:'5 5 5 5'},
                            { xtype: 'spacer' },
                            { text: 'Simpan', ui: "soft-green",shadow:true, handler: 'simpanRfk', iconCls: 'x-fa fa-save' ,margin:'5 5 5 5'}
                        ],
                    }]
                },
                {
                    title: '.:: Kontrak / SPK', scrollable: true,
                    items: [{
                        xtype: 'formpanel', id: 'tabpanelrfk1-form-kontrak', scrollable: true,jsonSubmit :true,
                        items: [
                            { xtype: "hiddenfield", fieldLabel: "p", name: "id_pekerjaan" },
                            {
                                xtype: 'containerfield', layout: 'hbox', defaults: { flex: 1, clearable: false ,labelAlign:'top',},
                                items: [
                                    { xtype: "textfield", label: "Nama PPK", name: "nama_ppk", required: true, margin: '0 20 0 0' },
                                    { xtype: "textfield", label: "Nama PPTK", name: "nama_pptk", required: true },
                                ]
                            },
                            {
                                xtype: 'containerfield', layout: 'hbox', defaults: { flex: 1, clearable: false,labelAlign:'top', },
                                items: [
                                    { xtype: "textfield", label: "Nama Ketua Pokja / Pejabat Pengadaan", name: "nama_pokja", required: true, margin: '0 20 0 0' },
                                    { xtype: "textfield", label: "Nama Ketua PPHP", name: "nama_pphp", required: true },
                                ]
                            },
                            {
                                xtype: 'containerfield', layout: 'hbox',
                                defaults: { flex: 1,labelAlign:'top', clearable: false },
                                items: [
                                    { xtype: "numberfield", label: "Pagu Anggaran", name: "pagu_anggaran", readonly: true, margin: '0 20 0 0' },
                                    { xtype: "numberfield", label: "HPS", name: "hps", required: true },
                                ]
                            },
                            {
                                xtype: 'containerfield', layout: 'hbox',
                                defaults: { flex: 1, clearable: false ,labelAlign:'top',},
                                items: [
                                    { xtype: "numberfield", label: "Nilai Kontrak", name: "nilai_kontrak", readonly: true, margin: '0 20 0 0' },
                                    { xtype: "numberfield", label: "Sisa Anggaran", name: "sisa_anggaran", readOnly: true },
                                ]
                            },
                            {
                                xtype: 'containerfield', layout: 'hbox', defaults: { flex: 1, clearable: false,labelAlign:'top', },
                                items: [
                                    { xtype: "textfield", label: "Nama Penyedia", name: "nama_penyedia", required: true, margin: '0 20 0 0' },
                                    { xtype: "textfield", label: "Alamat Penyedia", name: "alamat_penyedia", required: true },
                                ]
                            },
                            {
                                xtype: 'containerfield', layout: 'hbox', defaults: { flex: 1, clearable: false,labelAlign:'top', },
                                items: [
                                    { xtype: "textfield", label: "Nama Direktur", name: "nama_direktur", required: true, margin: '0 20 0 0' },
                                    { xtype: "textfield", label: "NPWP Penyedia", name: "npwp_penyedia", required: true },
                                ]
                            },

                            {
                                xtype: 'containerfield', layout: 'hbox',defaults: {clearable: false,labelAlign:'top', },
                                items: [
                                    { xtype: "textfield", label: "Nomor Pengadaan/ Kontrak/ SPK", name: "nomor_kontrak", required: true, margin: '0 20 0 0', width: 250 },
                                    { xtype: "datefield", label: "Tanggal ", name: "tgl_kontrak1", required: true, margin: '0 20 0 0', width: 100, dataType: { dateWriteFormat: 'Y-m-d' } },
                                    { xtype: "datefield", label: "s/d", name: "tgl_kontrak2", required: true, width: 100, dataType: { dateWriteFormat: 'Y-m-d' } },
                                ]
                            },
                            {
                                xtype: 'containerfield', layout: 'hbox',defaults: {clearable: false,labelAlign:'top', },
                                items: [
                                    { xtype: "textfield", label: "Nomor SPMK", name: "nomor_spmk", required: true, margin: '0 20 0 0', width: 250 },
                                    { xtype: "datefield", label: "Tanggal ", name: "tgl_spmk1", required: true, margin: '0 20 0 0', width: 100, dataType: { dateWriteFormat: 'Y-m-d' } },
                                    { xtype: "datefield", label: "s/d", name: "tgl_spmk2", required: true, width: 100, dataType: { dateWriteFormat: 'Y-m-d' } },
                                ]
                            },
                            {
                                xtype: 'containerfield', layout: 'hbox',defaults: {clearable: false,labelAlign:'top', },
                                items: [
                                    { xtype: "datefield", label: "Tgl Adendum", placeholder: 'Tanggal Adendum jika ada', name: "tgl_adendum", margin: '0 20 0 0', width: 150, dataType: { dateWriteFormat: 'Y-m-d' } },
                                    { xtype: "datefield", label: "Tgl Serah Terima I", name: "tgl_terima1", margin: '0 20 0 0', width: 150, dataType: { dateWriteFormat: 'Y-m-d' } },
                                    { xtype: "datefield", label: "Tgl Serah Terima II", name: "tgl_terima2", width: 150, dataType: { dateWriteFormat: 'Y-m-d' } },
                                ]
                            },
                            {
                                xtype: 'selectfield', margin: '0 20 0 0', width: 300,labelAlign:'top',
                                name: 'status', label: 'Status :',
                                options: [
                                    { text: 'Selesai', value: '1' }, { text: 'Dalam Proses', value: '2' }, { text: 'Tidak Dilaksanakan', value: '3' }], required: true
                            },

                            { xtype: 'component', margin: '15 0 0 0', html: `<b>Klik Peta Lokasi Pelaksanaan Pekerjaan :<b>`, },
                            { xtype: "textfield", label: "Lokasi", name: "lokasi", required: true, margin: '0 20 0 0', id: "frm_rko_lokasi" },

                            { xtype: 'component', height: 300, html: `<div id="peta-assets-xvbgtsporqh"><iframe style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;width: 100%;height: 100%;display:flex; flex-direction:column; justify-content:center;align-items: center;border:none;" scrolling="no" id="maps-form-assets" name="maps-form-assets" src="` + REMOTE_URL + `maps/mappekerjaan"></iframe></div>`, },
                            {
                                xtype: 'containerfield', layout: 'hbox',
                                defaults: { clearable: false },
                                items: [
                                    { xtype: "textfield", label: "Latitude", name: "lat", id: "frm_lat", width: 300 },
                                    { xtype: "textfield", label: "Longitude", name: "lng", id: "frm_lng", width: 300 },
                                ]
                            },

                        ],
                        bbar: [
                            { xtype: 'spacer' },
                            { text: 'Simpan', ui: "soft-green", handler: 'simpanKontrak', iconCls: 'x-fa fa-save' }
                        ],
                    }]
                },
                {
                    title: '.:: Upload Foto', layout:'fit',
                    items: [
                        {
                            xtype: 'formpanel', id: 'tabpanelrfk1-form-uploadfoto', fullscreen:true,
                            items: [
                                { xtype: "hiddenfield", name: "id_pekerjaan" },
                                {
                                    xtype: 'containerfield', layout: 'hbox',
                                    defaults: { clearable: false,labelAlign:'left' },
                                    items: [
                                        {
                                            xtype: 'selectfield', name: 'jenis', margin: '0 20', label: '', placeholder: 'Pilih Jenis File', required: true,
                                            options: [
                                                { text: 'Cover Buku Kontrak', value: 'Cover Kontrak' }, { text: 'Foto 0%', value: '0 %' }, { text: 'Foto 25%', value: '25 %' }, { text: 'Foto 50%', value: '50 %' }, { text: 'Foto 75%', value: '75 %' }, { text: 'Foto 100%', value: '100 %' },
                                            ], value: '0'
                                        },
                                        { xtype: "filefield",placeholder: 'Pilih Foto', clearable: false, label: "", name: "fotofile", margin: '0 20', accept: 'image/*',required: true, },
                                        { xtype: "button",text: 'Upload', ui: "action", handler: 'uploadFoto', iconCls: 'x-fa fa-upload' }
                                    ]
                                },
                                { xtype: "component", html: "<hr>" },
                                { xtype: 'hiddenfield', name: 'puser', value: vUSER_INFO.display_name },
                                {
                                    xtype: 'dataview',scrollable: true,
                                    id:'x-dataview-foto-rfk',
                                    inline: true,
                                    ui: 'default',
                                    reference: 'dataview',
                                    itemTpl: '<div class="dataview-multisort-item">' +
                                        '<img draggable="false" src="' + REMOTE_URL + 'assets/upload/images/{filename}" width="250"/>' +
                                        '<h3>{jenis}</h3>' +
                                        '</div>',
                                    //bind: { store: '{fotoStore}', selection: '{selectedPhoto}' },
                                    store: {
                                        fields: ['id', 'filename', 'jenis','ket','Kd_2','Kd_3'],
                                        proxy: {
                                            type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
                                                url: REMOTE_URL + 'rfk/fotolist',
                                                //listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini  </h1><br/>', timeout: 2000});}}
                                            },
                                    },

                                    listeners: {
                                        childdoubletap: 'fotoClicked'
                                    },
                                }

                            ],
                            
                        },
                    ]
                },
            ]
        }

    ],

    /*
    bbar: [
        {xtype:'spacer'},
        {text: 'Simpan',ui: "soft-green",handler: 'simpanKontrak',iconCls: 'x-fa fa-save'} 
    ],
    */
    tbar: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().hide();},iconCls: 'x-fa fa-window-close'},
        { text: '', ui: "soft-red",shadow:true, handler: 'prevRecord', iconCls: 'x-fa fa-backward' },
        { text: '', ui: "soft-red",shadow:true, handler: 'nextRecord', iconCls: 'x-fa fa-forward' },
        { xtype: 'spacer' },
        { text: '', ui: "soft-red",shadow:true, handler: function (btn) { btn.up().up().up().hide(); }, iconCls: 'x-fa fa-window-close' }
    ]

});
