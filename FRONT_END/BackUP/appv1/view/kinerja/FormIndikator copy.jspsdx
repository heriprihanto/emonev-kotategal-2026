Ext.define('Admin.view.kinerja.FormIndikator', {
    extend: 'Ext.form.Panel',
    reference: 'formIndikatorKinerja',xtype:'form-indikator-kinerja-capkin',id:'form-indikator-kinerja-capkin',jsonSubmit :true,

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

    viewModel: {
        type: 'default',
        data: {
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
        {xtype:"hiddenfield",name:"idindikator"},
        {xtype:"hiddenfield",name:"lvl"},
        {xtype:"textfield",clearable : false,label:"Indikator",name:"tolok_ukur",readOnly:true},
        {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
            {xtype: 'selectfield',flex:1,listeners: {blur : 'setTipeData'},flex:1,
                    name: 'tipedata',
                    label: 'Tipe Data',
                    options: [
                        {text: 'Numeric',value: 0},
                        {text: 'Text',value: 1}
                    ],required: true,
            },
            {xtype: 'selectfield',flex:1,listeners: {blur : 'hitungCapkin'},flex:1,
                    name: 'idjenis',
                    label: 'Jenis',
                    options: [
                        {text: 'Positif',value: '1'},
                        {text: 'Negatif',value: '2'}
                    ],required: true,
            },
            
            {xtype: 'combobox',label: 'Tagging',placeholder: 'Tagging ...', name: 'tags',queryMode: 'local',valueField: 'tag', displayField: 'tag',striped: true,multiSelect:true,margin: '0 20',flex:8,
                store: {autoLoad: true,fields: ['kodeurusan', 'urusan'],
                    proxy: {
                        type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
                        url: REMOTE_URL + 'kinerja/ref-tagging',reader: { type: 'json' },
                    }
                },
            },
        ]},
        {xtype:'containerfield',defaults: {labelAlign:'top'},
        items:[
            {xtype:"textfield",flex: 1,clearable : false,label:"Satuan",name:"satuan",readOnly:true},
            {xtype:"textfield",flex: 1,clearable : false,label:"Target (Renja "+vTAHUN+")",name:"target_renja",required: true,margin: '0 20'},
            {xtype:"textfield",flex: 1,clearable : false,label:"Target (DPA "+vTAHUN+")",name:"target",required: true,margin: '0 20',listeners: {blur : 'hitungCapkin'}},
            {xtype:"textfield",flex: 1,clearable : false,label:"Target (Renstra "+vTAHUN+")",name:"target_rpj",required: true,margin: '0 20'},
            {xtype:"textfield",flex: 1,clearable : false,label:"Target Akhir Renstra",name:"target_akhir",required: true,margin: '0 20',listeners: {blur : 'hitungCapkin'}},
        ]},
        
        
        {xtype:'fieldset',title:'<b>REALISASI KINERJA TAHUN : </b>',margin:'15 0 0 0',cls:'fieldset-bg-success', 
            items:[
                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                    {label:xtahun1,name:"ck1",xtype:"textfield",flex: 1,clearable : false,required:true},
                    {label:xtahun2,name:"ck2",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                    {label:xtahun3,name:"ck3",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                    {label:xtahun4,name:"ck4",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                    {label:xtahun5,name:"ck5",xtype:"textfield",flex: 1,clearable : false,required:true,readOnly:true,margin: '0 20'},
                ]},
            ]
        },
        {xtype:'component',html:'<b>REALISASI KINERJA TAHUN '+vTAHUN+' PER TRIWULAN : </b>',margin:'15 0 0 0'},

                {xtype:'fieldset',title:'<b>Triwulan I </b>',margin:'15 0 0 0',cls:'fieldset-bg-danger',
                        items:[
                            {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                ///{label:"Target",name:"tg_tw1",xtype:"textfield",flex: 1,clearable : false},
                                {label:"Realisasi",name:"ck_tw1",xtype:"textfield",width: 200,clearable : false,required:true,listeners: {blur : 'hitungCapkin'}},
                                {label:"Tingkat Capaian Kinerja (%)",name:"ck_tw1_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                                {label:"Tingkat Capaian Kinerja Renstra (%)",name:"ck_tw1_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                                {xtype:"displayfield",encodeHtml : false,height:50,margin:'0 20 0 20',name:'file1s',
                                    renderer: function (value, field) {
                                        console.log(value.length);
                                        if (Number(value.length) >0)
                                        {
                                            return '<a href="'+REMOTE_URL+'../files/'+value+'" target="_blank"><i class="x-fa fa-download" aria-hidden="true"></i> Data Dukung</a>';
                                        } else {
                                            return '';
                                        }
                                    }
                                },
                                {label:"File",name:"file1",xtype:"hiddenfield"},
                                {xtype:"button",ui:"soft-red",height:50,iconCls : 'x-fa fa-upload',text:'Upload Data Dukung',margin:'0 20 0 20',handler:'formUpload_Show',tw:1},
                                
                            ]},
                            
                            {label:"Analisa Capaian Kinerja",labelAlign:'top',name:"ms1",xtype:"textareafield",flex: 1,clearable : false},
                            {label:"Rekomendasi",name:"up1",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false},
                        ]
                },
                {xtype:'fieldset',title:'<b>Triwulan II </b>',margin:'15 0 0 0',bodyPadding:12, cls:'fieldset-bg-warning', 
                items:[
                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                        {label:"Realisasi",name:"ck_tw2",xtype:"textfield",width: 200,clearable : false,required:true,listeners: {blur : 'hitungCapkin'}},
                        {label:"Tingkat Capaian Kinerja (%)",name:"ck_tw2_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                        {label:"Tingkat Capaian Kinerja Renstra (%)",name:"ck_tw2_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                        {xtype:"displayfield",encodeHtml : false,height:50,margin:'0 20 0 20',name:'file2s',
                                    renderer: function (value, field) {
                                        console.log(value.length);
                                        if (Number(value.length) >0)
                                        {
                                            return '<a href="'+REMOTE_URL+'../files/'+value+'" target="_blank"><i class="x-fa fa-download" aria-hidden="true"></i> Data Dukung</a>';
                                        } else {
                                            return '';
                                        }
                                    }
                                },
                        {label:"File",name:"file2",xtype:"hiddenfield"},
                        {xtype:"button",ui:"soft-red",height:50,iconCls : 'x-fa fa-upload',text:'Upload Data Dukung',margin:'0 20 0 20',handler:'formUpload_Show',tw:2},
                    ]},
                    {label:"Analisa Capaian Kinerja",labelAlign:'top',name:"ms2",xtype:"textareafield",flex: 1,clearable : false},
                    {label:"Rekomendasi",name:"up2",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false},
                    ]
                },
                {xtype:'fieldset',title:'<b>Triwulan III </b>',margin:'15 0 0 0',bodyPadding:12, cls:'fieldset-bg-primary', 
                items:[
                        {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                            {label:"Realisasi",name:"ck_tw3",xtype:"textfield",width: 200,clearable : false,required:true,listeners: {blur : 'hitungCapkin'}},
                            {label:"Tingkat Capaian Kinerja (%)",name:"ck_tw3_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                            {label:"Tingkat Capaian Kinerja Renstra (%)",name:"ck_tw3_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                            {xtype:"displayfield",encodeHtml : false,height:50,margin:'0 20 0 20',name:'file3s',
                                    renderer: function (value, field) {
                                        console.log(value.length);
                                        if (Number(value.length) >0)
                                        {
                                            return '<a href="'+REMOTE_URL+'../files/'+value+'" target="_blank"><i class="x-fa fa-download" aria-hidden="true"></i> Data Dukung</a>';
                                        } else {
                                            return '';
                                        }
                                    }
                                },
                                {label:"File",name:"file3",xtype:"hiddenfield"},
                            {xtype:"button",ui:"soft-red",height:50,iconCls : 'x-fa fa-upload',text:'Upload Data Dukung',margin:'0 20 0 20',handler:'formUpload_Show',tw:3},
                        ]},
                        {label:"Analisa Capaian Kinerja",labelAlign:'top', name:"ms3",xtype:"textareafield",flex: 1,clearable : false},
                        {label:"Rekomendasi",name:"up3",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false},
                ]
                },
                {xtype:'fieldset',title:'<b>Triwulan IV </b>',margin:'15 0 0 0',bodyPadding:12, cls:'fieldset-bg-success', 
                items:[
                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                        {label:"Realisasi",name:"ck_tw4",xtype:"textfield",width: 200,clearable : false,required:true,listeners: {blur : 'hitungCapkin'}},
                        {label:"Tingkat Capaian Kinerja (%)",name:"ck_tw4_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                        {label:"Tingkat Capaian Kinerja Renstra (%)",name:"ck_tw4_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true},
                        {xtype:"displayfield",encodeHtml : false,height:50,margin:'0 20 0 20',name:'file4s',
                                    renderer: function (value, field) {
                                        console.log(value.length);
                                        if (Number(value.length) >0)
                                        {
                                            return '<a href="'+REMOTE_URL+'../files/'+value+'" target="_blank"><i class="x-fa fa-download" aria-hidden="true"></i> Data Dukung</a>';
                                        } else {
                                            return '';
                                        }
                                    }
                                },
                                {label:"File",name:"file4",xtype:"hiddenfield"},
                        {xtype:"button",ui:"soft-red",height:50,iconCls : 'x-fa fa-upload',text:'Upload Data Dukung',margin:'0 20 0 20',handler:'formUpload_Show',tw:4},
                    ]},
                    {label:"Analisa Capaian Kinerja",labelAlign:'top',name:"ms4",xtype:"textareafield",flex: 1,clearable : false},
                    {label:"Rekomendasi",name:"up4",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false},
                ]
                },

        {xtype:'fieldset',title:'Realisasi Provinsi Jawa Tengah Tahun : ',margin:'15 0 0 0',cls:'fieldset-bg-primary', 
            items:[
                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                    {label:xtahun1,name:"cp1",xtype:"textfield",flex: 1,clearable : false},
                    {label:xtahun2,name:"cp2",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                    {label:xtahun3,name:"cp3",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                    {label:xtahun4,name:"cp4",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                    {label:xtahun5,name:"cp5",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                ]},
            ]
        },

        {xtype:'fieldset',title:'Realisasi Nasional Tahun : ',margin:'15 0 0 0',cls:'fieldset-bg-primary', 
            items:[
                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                    {label:xtahun1,name:"cn1",xtype:"textfield",flex: 1,clearable : false},
                    {label:xtahun2,name:"cn2",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                    {label:xtahun3,name:"cn3",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                    {label:xtahun4,name:"cn4",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                    {label:xtahun5,name:"cn5",xtype:"textfield",flex: 1,clearable : false,margin: '0 20'},
                ]},
            ]
        },        
       
        
        
    ],
    tbar : [ 
        {xtype: 'button',ui : 'soft-red',text: 'Tutup',shadow:true,iconCls: 'x-fa fa-window-close',margin:'0 5 0 5',handler: 'onBalik',destIdx:3}, 
        { text: '', ui: "decline",shadow:true, handler: 'prevRecord', iconCls: 'x-fa fa-backward' },
        { text: '', ui: "decline",shadow:true, handler: 'nextRecord', iconCls: 'x-fa fa-forward' },
        {xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand'},
        {xtype: 'button',ui : 'soft-green',shadow:true,text: 'Simpan',iconCls: 'x-fa fa-save',margin:'0 5 0 5',handler: 'simpanData',destIdx:1}, 
        {xtype:'spacer'},
        {xtype:'component',html:'<div id="form-capkin-opd-title-009099"></div'},
        
    ],
    bbar: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        {xtype:'spacer'},
	    {text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanData',iconCls: 'x-fa fa-save'} 
    ]

});
