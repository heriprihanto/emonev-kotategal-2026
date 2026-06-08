Ext.define('Admin.view.kinerja.Kinerja', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.kinerja.ViewModel'},
	controller: {xclass: 'Admin.view.kinerja.Controller'},
    xtype:'kinerja-opd-mainview',
	
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_capkin_opd"><i class="x-fa fa-calendar-check" aria-hidden="true"></i> Capaian Kinerja </div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',
            //shadow:true,border:true,
            height:PanelCompHeight-50,
            //cls:'tab-modulpanel-cl-hijau',
            id:'tab-modulpanel-kinerja-0x8i7510u5',
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'opd-capkin-list'}]
                },
               
                {title: '.:: Triwulan ::.' ,itemId: 'step-0xx',cls: 'card',hidden:true,
                    items:[{xtype:'tw-capkin-list'}]
                },
                
                
                {title: '.:: Sub OPD ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[]
                },
                 
                
                {title: '.:: Indikator ::.' ,itemId: 'step-2',cls: 'card',hidden:true,
                    items:[{xtype:'indikator-capkin-list'}]
                },
                
                {title: '.:: Form ::.' ,itemId: 'step-3',cls: 'card',hidden:true,
                    items:[{xtype:'form-indikator-kinerja-capkin'}]
                },
                {title: '.:: Realisasi Anggaran ::.' ,itemId: 'step-3xx',cls: 'card',hidden:true,
                    items:[{xtype:'serapan-anggaran-capkin-list'}]
                },
                
               
            ],
        }
            
      
    ],
    
    dialogFormTriwulan: {
        xtype: 'dialog',
        title: 'Laporan Triwulan',
        closable: true,closeAction: 'hide',closeToolText : 'Tutup',
        bodyPadding: 20,
        responsiveConfig: {
            'width < 800': {
                width: '95%', height: '90%',
            },
            'width >= 800': {
                width: 300, height: 210,
            }
        },
        items: [
            { xtype: 'formpanel',bodyPadding:10,jsonSubmit :true,
            
                items:[
                    {xtype:'numberfield',name:'tahun',value:vTAHUN,hidden:true},
                    //{xtype:'numberfield',name:'id_pd',value:0,hidden:true},
                    {xtype:'numberfield',name:'id_sub_pd',value:0,hidden:true},
                    {xtype:'numberfield',name:'tw',value:0,hidden:true},
                    {xtype: 'selectfield',labelAlign:'top',flex:1,label:'Triwulan : ',name:'twx',readOnly:true,value:1,
                        options: [{text:'Triwulan I (Satu)',value:1},
                        {text:'Triwulan II (Dua)',value:2},
                        {text:'Triwulan III (Tiga)',value:3},
                        {text:'Triwulan IV (Empat)',value:4}
                        ]
                    }
                ],
                
            }
        ],
        bbar: [
            //{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().hide();},iconCls: 'x-fa fa-window-close'}
            {xtype:'spacer'},
            {text: 'Proses',ui: "soft-green",shadow:true,handler: 'buatLaporanTw',iconCls: 'x-fa fa-save'} 
        ]
       
    },

    dialogUpload: {
        xtype: 'dialog',
        closable: true,closeAction: 'hide',closeToolText : 'Tutup',
        title: 'Upload Bukti Dukung',
        bodyPadding: 20,
        responsiveConfig: {
            'width < 800': {
                width: '95%', height: '90%',
            },
            'width >= 800': {
                width: 400, height: 210,
            }
        },
        items: [
            { xtype: 'form-kinerja-upload' }
        ], 
    },

    menuVerifikasi: {
        xtype: 'actionsheet',side: 'left',
        items: [
                {text: 'Buka',iconCls: 'x-fa fa-folder-open',handler: 'openSubPdList',ui:'soft-green',shadow:true,margin:'250 10 10 10'},
                {text: 'Verifikasi',iconCls: 'x-fa fa-check',handler: 'verifikasiLaporan',ui:'soft-blue',shadow:true,margin:'10 10 10 10'},
				{text: 'Batalkan Verifikasi',iconCls: 'x-fa fa-unlink',handler:'batalLaporan',ui:'soft-purple',shadow:true,margin:'10 10 10 10'},   
				{text: 'Hapus',iconCls: 'x-fa fa-minus',handler:'hapusLaporan',ui:'soft-red',shadow:true,margin:'10 10 10 10'}, 
        ]
    },

    menuVerifikasiIndikator: {
        xtype: 'actionsheet',side: 'left',
        items: [
                {text: 'Buka',iconCls: 'x-fa fa-folder-open',handler: 'openSubPdList',ui:'soft-green',shadow:true,margin:'250 10 10 10'},
                {text: 'Verifikasi',iconCls: 'x-fa fa-check',handler: 'verifikasiLaporan',ui:'soft-blue',shadow:true,margin:'10 10 10 10'},
				//{text: 'Batalkan Verifikasi',iconCls: 'x-fa fa-unlink',handler:'batalLaporan',ui:'soft-purple',shadow:true,margin:'10 10 10 10'},   
				//{text: 'Hapus',iconCls: 'x-fa fa-minus',handler:'hapusLaporan',ui:'soft-red',shadow:true,margin:'10 10 10 10'}, 
        ]
    },

    dialogVerifikasiIndikatorX: {
        xtype: 'dialog',
        title: 'Verifikasi Indikator Kinerja',
        bodyPadding: 20,closable: true,closeAction: 'hide',closeToolText : 'Tutup',
        maximizable: true,
        width: 650, height: 800,
        items: [
            { xtype:'form_capkin_verifikasi_indikator_kinerja' }
        ], 
    },

    dialogSubmitLaporan: {
        
    },
   
});
