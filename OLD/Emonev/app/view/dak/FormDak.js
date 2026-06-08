Ext.define('Admin.view.dak.FormDak', {
    extend: 'Ext.form.Panel',
    xtype:'form-dak-kinerja',id:'form-dak-kinerja',jsonSubmit :true,

	cls: 'shadow',
	fullscreen: true,
    ///controller: {xclass: 'Admin.view.dak.Controller'},
    bodyPadding: 20,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
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
        {xtype:"numberfield",name:"id",hidden:true},
        {xtype:"numberfield",name:"bulan",hidden:true},
        {xtype:"numberfield",name:"id_sub_pd",hidden:true},
        {xtype:'containerfield',items:[
            {xtype:"textfield",clearable : false,label:"",name:"t1_kode",readOnly:true,width:50,required:true},
            {xtype:"textfield",flex: 1,clearable : false,label:"Bidang",name:"t1_nama",required: true,margin: '0 20'},
            {xtype:"textfield",clearable : false,label:"",name:"t2_kode",readOnly:true,width:50,required:true},
            {xtype:"textfield",flex: 1,clearable : false,label:"Sub Bidang",name:"t2_nama",required: true,margin: '0 20'},
        ]},

        {xtype:'containerfield',items:[
            {xtype:"textfield",clearable : false,label:"",name:"t3_kode",readOnly:true,width:50,required:true},
            {xtype:"textfield",flex: 1,clearable : false,label:"Kegiatan",name:"t3_nama",required: true,margin: '0 20'},
            {xtype:"textfield",clearable : false,label:"",name:"t4_kode",readOnly:true,width:50,required:true},
            {xtype:"textfield",flex: 1,clearable : false,label:"Rincian",name:"t4_nama",required: true,margin: '0 20'},
        ]},
        {xtype:'containerfield',items:[
            {xtype:"textfield",clearable : false,label:"",name:"t5_kode",readOnly:true,width:50,required:true},
            {xtype:"textfield",flex: 1,clearable : false,label:"Detail Rincian",name:"t5_nama",required: true,margin: '0 20'},
           
        ]},
        {xtype:'containerfield',items:[
            {xtype:'fieldset',flex:1,title:'<b>PERENCANAAN : </b>',margin:'15 0 0 0',cls:'fieldset-bg-success',items:[
                {xtype:"numberfield",clearable : false,label:"Pagu",name:"pagu",required:true},
                {xtype:'containerfield',items:[
                    {xtype:"numberfield",clearable : false,label:"Volume",name:"volume",flex:1,required:true},
                    {xtype:"textfield",clearable : false,label:"Satuan",name:"satuan",flex:1,margin:'0 5 0 5',required:true},
                ]},

                {xtype:"component",html:'Penerima Manfaat : ',margin:'15 0 10 0'},
                {xtype:'containerfield',items:[
                    {xtype:"numberfield",clearable : false,label:"Volume",name:"volume2",flex:1,required:true},
                    {xtype:"textfield",clearable : false,label:"Satuan",name:"satuan2",flex:1,margin:'0 5 0 5',required:true},
                ]},
                {xtype:'containerfield',items:[
                    { xtype: 'selectfield',labelAlign:'top', label:'Mekanisme Pelaksanaan',name: 'mekanisme',flex:1,required:true,
											options: [{text: 'Swakelola',value: 'Swakelola'},{text: 'Kontraktual',value: 'Kontraktual'}]
										},
                    
                    { xtype: 'selectfield',labelAlign:'top',label:'Metode Pembayaran',name: 'metode',margin:'0 5 0 10',flex:1,required:true,
                                        options: [{text: 'Sekaligus',value: 'Sekaligus'},{text: 'Bertahap',value: 'Bertahap'},{text: 'Lumpsum',value: 'Lumpsum'}]
                                },                    
                ]},
                {xtype:"numberfield",clearable : false,label:"Nilai",name:"nilai",required:true},
                {xtype:"textfield",clearable : false,label:"Lokasi",name:"lokasi",required:true},
                
            ]},
            
            {xtype:'fieldset',flex:1,title:'<b>REALISASI : </b>',margin:'15 0 0 20',cls:'fieldset-bg-warning',items:[
                {xtype:"numberfield",labelAlign:'top',clearable : false,label:"Realisasi Keuangan",name:"real_k",required:true},
                {xtype:'containerfield',items:[
                    {xtype:"numberfield",labelAlign:'top', clearable : false,label:"Realisasi Fisik",name:"real_fisik",flex:1,required:true},
                    {xtype:"numberfield",labelAlign:'top', clearable : false,label:"Realisasi Volume",name:"real_vol",flex:1,margin:'0 5 0 10',required:true},
                ]},
                {xtype:'containerfield',items:[
                    {xtype:"numberfield",clearable : false,labelAlign:'top',label:"Realisasi Penerima Manfaat",name:"real_manfaat",flex:1,required:true},
                    { xtype: 'selectfield',name: 'sesuai',labelAlign:'top',label:'Kesesuaian DPA dng Juknis',flex:1,required:true,margin:'0 5 0 10',
											options: [{text: 'Ya',value: 'Ya'},{text: 'Tidak',value: 'Tidak'}]
					},
                ]},

                {xtype: 'selectfield',name: 'masalah',label:'Kodefikasi Permasalahan',labelAlign:'top',
                    options: [
                        {value: '1',text: '1.Permasalahan terkait dengan Peraturan Perundangan'},
                        {value: '2',text: '2.Permasalahan terkait dengan Petunjuk Teknis'},
                        {value: '3',text: '3.Permasalahan terkait dengan Rencana Kerja Anggaran SKPD'},
                        {value: '4',text: '4.Permasalahan terkait dengan DPA-SKPD'},
                        {value: '5',text: '5.Permasalahan terkait dengan SK Penetapan Pelaksanaan Kegiatan'},
                        {value: '6',text: '6.Permasalahan terkait dengan Pelaksanaan Tender Pekerjaan Kontrak'},
                        {value: '7',text: '7.Permasalahan terkait dengan Persiapan Pekerjaan Swakelola'},
                        {value: '8',text: '8.Permasalahan terkait dengan Penerbitan SP2D'},
                        {value: '9',text: '9.Permasalahan terkait dengan Pelaksanaann Pekerjaan Kontrak '},
                        {value: '10',text: '10.Permasalahan terkait dengan Pelaksanaan Pekerjaan Swakelola'},
                    ]
                },
                {xtype: 'textfield',name: 'ket_masalah',label:'Keterangan Permasalahan',labelAlign:'top'}
                
            ]}
            
        ]},
        /*
        
        {xtype:"hiddenfield",name:"lvl"},
        {xtype:'containerfield',items:[
            {xtype:"textfield",clearable : false,label:"",name:"kd_l1",readOnly:true,width:50},
            {xtype:"textfield",flex: 1,clearable : false,label:"Bidang",name:"nm_l1",required: true,margin: '0 20'},
            {xtype:"textfield",clearable : false,label:"",name:"kd_l2",readOnly:true,width:50},
            {xtype:"textfield",flex: 1,clearable : false,label:"Sub Bidang",name:"nm_l2",required: true,margin: '0 20'},
        ]},

        {xtype:'containerfield',items:[
            {xtype:"textfield",clearable : false,label:"",name:"kd_l3",readOnly:true,width:50},
            {xtype:"textfield",flex: 1,clearable : false,label:"Kegiatan",name:"nm_l3",required: true,margin: '0 20'},
            {xtype:"textfield",clearable : false,label:"",name:"kd_l4",readOnly:true,width:50},
            {xtype:"textfield",flex: 1,clearable : false,label:"Rincian",name:"nm_l4",required: true,margin: '0 20'},
        ]},
        {xtype:'containerfield',items:[
            {xtype:"textfield",clearable : false,label:"",name:"kd_l5",readOnly:true,width:50},
            {xtype:"textfield",flex: 1,clearable : false,label:"Detail Rincian",name:"nm_l5",required: true,margin: '0 20'},
           
        ]},
        {xtype:'fieldset',title:'<b>PERENCANAAN : </b>',margin:'15 0 0 0',cls:'fieldset-bg-success',items:[
            {xtype:'containerfield',items:[
                {xtype:"numberfield",clearable : false,label:"Pagu DAK",name:"pagu_dak",width:150},
                {xtype:"numberfield",clearable : false,label:"Pagu RK",name:"pagu",width:150,margin: '0 20'},
                {xtype:"textfield",clearable : false,label:"Volume",name:"volume",width:150,margin: '0 20'},
                {xtype:"textfield",clearable : false,label:"Satuan",name:"satuan",width:150,margin: '0 20'},
                
            ]},
            {xtype:'containerfield',items:[
                {xtype:"textfield",clearable : false,label:"Penerima Manfaat",name:"volume2",width:150},
                {xtype:"textfield",clearable : false,label:"Satuan",name:"satuan2",width:150,margin: '0 20'},
                {xtype: 'selectfield',label:'Mekanisme',name: 'mekanisme',margin: '0 20',width:150,
				    options: [{text: 'Swakelola',value: 'Swakelola'},{text: 'Kontraktual',value: 'Kontraktual'}]
				},
                {xtype:"numberfield",clearable : false,label:"Nilai Kontrak / Swakelola",name:"nilai",width:150,margin: '0 20'},
            ]},
        ]},
        
        {xtype:'fieldset',title:'<b>REALISASI : </b>',margin:'15 0 0 0',cls:'fieldset-bg-warning',items:[
            {xtype:'containerfield',items:[
                {xtype:"numberfield",clearable : false,label:"Keuangan",name:"real_k",width:150},
                {xtype:"numberfield",clearable : false,label:"Fisik",name:"real_fisik",width:150,margin: '0 20'},
                {xtype:"textfield",clearable : false,label:"Volume",name:"real_vol",width:150,margin: '0 20'},
                {xtype:"textfield",clearable : false,label:"Penerima Manfaat",name:"real_manfaat",width:150,margin: '0 20'},
                { xtype: 'selectfield',name: 'metode',label:'Metode Pembayaran',width:150,margin: '0 20',
					options: [{text: 'Sekaligus',value: 'Sekaligus'},{text: 'Bertahap',value: 'Bertahap'},{text: 'Lumpsum',value: 'Lumpsum'}]
				},
            ]},
        ]},
        
        */
    ],
    
    bbar: [
        {xtype: 'button',ui : 'soft-red',text: 'Tutup',iconCls: 'x-fa fa-window-close',margin:'0 5 0 5',handler:function(btn){btn.up().up().up().up().up().hide();},destIdx:2}, 
        {xtype:'spacer'},
        { text: '', ui : 'soft-red', handler: 'prevRecord', iconCls: 'x-fa fa-backward' },
        { text: '', ui : 'soft-red', handler: 'nextRecord', iconCls: 'x-fa fa-forward' },
	    {text: 'Simpan',ui: "soft-green",handler: 'simpanData',iconCls: 'x-fa fa-save'} 
    ]

});
