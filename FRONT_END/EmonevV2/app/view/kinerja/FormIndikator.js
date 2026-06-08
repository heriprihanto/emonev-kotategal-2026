Ext.define('Admin.view.kinerja.FormIndikator', {
    extend: 'Ext.form.Panel',
    xtype:'form-indikator-kinerja-capkin',id:'form-indikator-kinerja-capkin',jsonSubmit :true,

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
        
        {
			xtype: 'fieldset', margin: '15 0 0 0', cls: 'fieldset-bg-primary',
			items: [
				{ xtype: "component", html:`<div id="788y-ttw45-9htwe-kinerjaopdxxx" class="badge2 bg-danger2" style="font-size:14px !important"> </div>` },
				{ xtype: "textfield", clearable: false, label: "Indikator", name: "tolok_ukur", readOnly: true, labelAlign: 'top' },
				{ xtype: "textareafield", flex: 1, clearable: false, label: "Definisi Operasional / Metadata", name: "ket", labelAlign: 'top' , readOnly: true },

				{
					xtype: 'containerfield', defaults: { labelAlign: 'top' }, items: [
						
						{ xtype: "textfield", flex: 1, clearable: false, label: "Satuan", name: "satuan", readOnly: true },
						{ xtype: "textfield", flex: 1, clearable: false, label: "Target (DPA " + vTAHUN + ")", name: "target", required: true, margin: '0 20', flex	: 1 , readOnly: true },
						{ xtype: "textfield", flex: 1, clearable: false, label: "Target (Renstra " + vTAHUN + ")", name: "target_rpj", required: true, margin: '0 20' ,flex: 1,hidden:true},
						{ xtype: "textfield", flex: 1, clearable: false, label: "Target Akhir Renstra", name: "target_akhir", required: true, margin: '0 20', flex: 1,hidden:true},
                        {
							xtype: 'checkbox',label: '&nbsp;', readOnly: true ,disabled:true,
							boxLabel: 'IKU',
							name: 'iku', margin: '0 20'
						},
						{
							xtype: 'selectfield', flex: 1, listeners: { change : 'setTipeData' }, flex: 1, margin: '0 20',
							name: 'tipedata', readOnly:true,
							label: 'Tipe Data',
							options: [
								{ text: 'Numeric', value: 0 },
								{ text: 'Text', value: 1 }
							], required: true,
                            //readOnly: true ,
						},
						
						{
							xtype: 'selectfield', flex: 1, flex: 1, margin: '0 20',hidden:true,
							name: 'idjenis',readOnly:true,
							label: 'Jenis',
							options: [
								{ text: 'Positif', value: 1 },
								{ text: 'Negatif', value: 2 }
							]
						},
						
						{
							xtype: 'selectfield', flex: 1,  flex: 1, margin: '0 20',
							name: 'idformula',readOnly:true,
							label: 'Jenis Perhitungan',
							options: [
								{ text: 'Repetitif', value: 1 },
								{ text: 'Akumulatif', value: 2 },
								{ text: 'Progres Positif', value: 3 },
								{ text: 'Progres Negatif', value: 4 }
							], required: true,
                            //readOnly: true ,
						},


					]
				},
				
				{xtype: 'combobox',label: 'Tagging',placeholder: 'Tagging ...', name: 'tags',queryMode: 'local',valueField: 'tag', displayField: 'tag',striped: true,multiSelect:true,
					store: {autoLoad: true,fields: ['kodeurusan', 'urusan'],
						proxy: {
							type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
							url: REMOTE_URL + 'rencanakinerja/ref-tagging',reader: { type: 'json' },
						}
					},labelAlign: 'top'
				},
			]
		},

        {xtype:'component',html:'<b>REALISASI KINERJA TAHUN '+vTAHUN+' PER TRIWULAN : </b>',margin:'15 0 0 0'},

        {xtype: 'accordion',id:'cmp-accordion-capkin-opd-tw',
            ui: 'panel-red-gradient',

            defaults: {
                xtype: 'panel',
                bodyPadding: 10
            },
            
       
            items: [
                {
                    title: '<span style="color:#404040"><b>Triwulan I</b></span>',ui: 'panel-red-gradient',
                    collapsible : true,titleCollapse :true,
                    items:[
                        {xtype:'fieldset',margin:'-5 0 0 0',cls:'fieldset-bg-danger',
                            items:[
                                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                    {label:"Target Tw I",name:"tg_tw1",xtype:"textfield",width: 200,clearable : false,readOnly:true},
                                    {label:"Realisasi",name:"ck_tw1",xtype:"textfield",width: 200,clearable : false,required:true,margin:'0 20 0 20',listeners: {blur : 'hitungCapkin'}},
                                    {
                                        xtype: 'selectfield', width: 170,hidden:true,
                                        name: 'ck_tw1x',
                                        label: 'Realisasi',
                                        options: [
                                            { text: 'Belum Tercapai', value: 0 },
                                            { text: 'Tercapai ', value: 100 }
                                        ],
                                    },
                                    {label:"Tingkat Capaian Tw I",name:"ck_tgtw1_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                    {label:`Tingkat Capaian Tahun ${vTAHUN}`,name:"ck_tw1_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                    {label:"Tingkat Capkin Renstra (%)",name:"ck_tw1_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,hidden:true},
                                    
                                ]},
                                {label:"Bukti Dukung (link bukti dukung yang disimpan di penyimpanan cloud google drive, one live, dropbox, dll) ",name:"file1",xtype:"textfield",required:true,clearable : false,labelAlign:'top',margin:'0 20 0 0'},
                                //{label:"component",html:''},
                                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                    {label:"Keterangan",labelAlign:'top',name:"ket1",xtype:"textareafield",flex: 1,clearable : false},
                                    {label:"Faktor Pendukung",name:"up1",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                ]},
                                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                    {label:"Faktor Penghambat",labelAlign:'top',name:"ms1",xtype:"textareafield",flex: 1,clearable : false},
                                    {label:"Tindak Lanjut OPD",name:"tl1",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                ]},
                                
                            ]
                    },
                    ]
                }, 
                {
                    title: '<span style="color:#404040"><b>Triwulan II</b></span>',ui: 'panel-red-gradient',
                    collapsible : true,titleCollapse :true,
                    items:[
                        {xtype:'fieldset',margin:'-5 0 0 0',bodyPadding:12, cls:'fieldset-bg-warning', 
                            items:[
                                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                    {label:"Target Tw II",name:"tg_tw2",xtype:"textfield",width: 200,clearable : false,readOnly:true},
                                    {label:"Realisasi",name:"ck_tw2",xtype:"textfield",width: 200,clearable : false,required:true,margin:'0 20 0 20',listeners: {blur : 'hitungCapkin'}},
                                    {label:"% Capkin Tw II",name:"ck_tgtw2_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                    {label:`% Capkin Tahun ${vTAHUN}`,name:"ck_tw2_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                    {label:"Tingkat Capkin Renstra (%)",name:"ck_tw2_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,hidden:true},
                                    ]},
                                    {label:"Bukti Dukung (link bukti dukung yang disimpan di penyimpanan cloud google drive, one live, dropbox, dll) ",name:"file2",xtype:"textfield",clearable : false,required:true, labelAlign:'top',margin:'0 20 0 0'},
                                    //{label:"component",html:''},
                                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                        {label:"Keterangan",labelAlign:'top',name:"ket2",xtype:"textareafield",flex: 1,clearable : false},
                                        {label:"Faktor Pendukung",name:"up2",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                    ]},
                                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                        {label:"Faktor Penghambat",labelAlign:'top',name:"ms2",xtype:"textareafield",flex: 1,clearable : false},
                                        {label:"Tindak Lanjut OPD",name:"tl2",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                    ]},
                                ]
                        },
                    ]
                }, 
                {
                    title: '<span style="color:#404040"><b>Triwulan III</b></span>',ui: 'panel-red-gradient',
                    collapsible : true,titleCollapse :true,
                    items:[
                        {xtype:'fieldset',margin:'-5 0 0 0',bodyPadding:12, cls:'fieldset-bg-primary', 
                            items:[
                                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                        {label:"Target Tw III",name:"tg_tw3",xtype:"textfield",width: 200,clearable : false,readOnly:true},
                                        {label:"Realisasi",name:"ck_tw3",xtype:"textfield",width: 200,clearable : false,required:true,margin:'0 20 0 20',listeners: {blur : 'hitungCapkin'}},
                                        {label:"% Capkin Tw III",name:"ck_tgtw3_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                        {label:`% Capkin Tahun ${vTAHUN}`,name:"ck_tw3_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                        {label:"Tingkat Capkin Renstra (%)",name:"ck_tw3_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,hidden:true},
                                        
                                    ]},
                                    {label:"Bukti Dukung (link bukti dukung yang disimpan di penyimpanan cloud google drive, one live, dropbox, dll) ",name:"file3",xtype:"textfield",clearable : false,required:true, labelAlign:'top',margin:'0 20 0 0'},
                                    //{label:"component",html:''},
                                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                        {label:"Keterangan",labelAlign:'top',name:"ket3",xtype:"textareafield",flex: 1,clearable : false},
                                        {label:"Faktor Pendukung",name:"up3",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                    ]},
                                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                        {label:"Faktor Penghambat",labelAlign:'top',name:"ms3",xtype:"textareafield",flex: 1,clearable : false},
                                        {label:"Tindak Lanjut OPD",name:"tl3",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                    ]},
                            ]
                            },
                    ]
                }, 
                {
                    title: '<span style="color:#404040"><b>Triwulan IV</b></span>',ui: 'panel-red-gradient',
                    collapsible : true,titleCollapse :true,
                    items:[
                        {xtype:'fieldset',margin:'-5 0 0 0',bodyPadding:12, cls:'fieldset-bg-success', 
                            items:[
                                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                    {label:"Target Tw IV",name:"tg_tw4",xtype:"textfield",width: 200,clearable : false,readOnly:true},
                                    {label:"Realisasi",name:"ck_tw4",xtype:"textfield",width: 200,clearable : false,required:true,margin:'0 20 0 20',listeners: {blur : 'hitungCapkin'}},
                                    {label:"% Capkin Tw IV",name:"ck_tgtw4_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                    {label:`% Capkin Tahun ${vTAHUN}`,name:"ck_tw4_ps",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,readOnly:true},
                                    {label:"Tingkat Capkin Renstra (%)",name:"ck_tw4_psx",xtype:"numberfield",width: 200,clearable : false,margin:'0 20 0 20',required:true,hidden:true},
                                    
                                ]},
                                {label:"Bukti Dukung (link bukti dukung yang disimpan di penyimpanan cloud google drive, one live, dropbox, dll) ",name:"file4",xtype:"textfield",clearable : false,required:true, labelAlign:'top',margin:'0 20 0 0'},
                                    //{label:"component",html:''},
                                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                        {label:"Keterangan",labelAlign:'top',name:"ket4",xtype:"textareafield",flex: 1,clearable : false},
                                        {label:"Faktor Pendukung",name:"up4",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                    ]},
                                    {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                                        {label:"Faktor Penghambat",labelAlign:'top',name:"ms4",xtype:"textareafield",flex: 1,clearable : false},
                                        {label:"Tindak Lanjut OPD",name:"tl4",labelAlign:'top',xtype:"textareafield",flex: 1,clearable : false,margin:'0 20 0 20'},
                                    ]},
                            ]
                            },
                    ]
                }
            ]
        } ,


        {
            xtype: 'panel', margin: '30 0 0 0',
            ui: 'panel-blue',
            //docked: 'right',
            bodyPadding: 20,
            collapsed : true ,
            collapsible : true,titleCollapse :true,
            //width: '50%',
            title: 'Realisasi Tahun Lalu',
            collapsible: {
                direction: 'top',
                dynamic: true
            },
            items: [    
                {xtype:'fieldset',title:'',margin:'15 0 0 0',cls:'fieldset-bg-primary', 
                    items:[
                        {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                            {label:xtahun1,name:"ck1",xtype:"textfield",flex: 1,clearable : false,required:true},
                            {label:xtahun2,name:"ck2",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                            {label:xtahun3,name:"ck3",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                            {label:xtahun4,name:"ck4",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                            {label:xtahun4,name:"ck5",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20',hidden:true  },
                        ]},
                    ]
                },
        
                
            ]
        },

        {
            xtype: 'panel', margin: '20 0 0 0',
            ui : 'panel-yellow',  
            //docked: 'right',
            bodyPadding: 20,
            collapsed : true ,
            collapsible : true,titleCollapse :true,
            title: 'Provinsi & Nasional',
            collapsible: {
                direction: 'top',
                dynamic: true
            },
            items: [    
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
            ]
        },

        
         

        
        
    ],
    tbar : [ 
        {xtype:'component',width:'70%',html:'<div id="form-capkin-opd-title-009099"></div'},
        {xtype:'spacer'},
        
        { text: '', ui: "soft-blue",shadow:true, handler: 'prevRecord', tooltip:'Ke data sebelumnya',iconCls: 'x-fa fa-backward' },
        { text: '', ui: "soft-blue",shadow:true, handler: 'nextRecord', tooltip:'ke data selanjutnya', iconCls: 'x-fa fa-forward' },
        //{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand'},
        {xtype: 'button',ui : 'soft-green',shadow:true,text: 'Simpan',tooltip:'Simpan Data', id:'btn-simpan-capaian-kinerja-xt67-utfek',iconCls: 'x-fa fa-save',margin:'0 5 0 25',handler: 'simpanData',destIdx:1}, 
        {xtype: 'button',ui : 'soft-red',text: '',tooltip:'Tutup', shadow:true,iconCls: 'x-fa fa-window-close',margin:'0 25 0 5',handler: 'onBalik',destIdx:3}, 
        
        
    ],
    bbar: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        {xtype:'spacer'},
	    //{text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanData',iconCls: 'x-fa fa-save'} 
    ]

});
