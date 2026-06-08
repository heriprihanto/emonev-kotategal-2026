Ext.define('Admin.view.rfk.Rfk', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,id:'container-rko-mainview',
    scrollable: true,
    viewModel: {xclass: 'Admin.view.rfk.ViewModel'},
	controller: {xclass: 'Admin.view.rfk.Controller'},
    requires: [
        'Ext.dataview.DataView'
    ],
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_rfk"><i class="x-fa fa-chart-line" aria-hidden="true"></i> RFK (Realisasi Fisik dan Keuangan)</div>',
        },
        
        {
            xtype:'tabpanel',id:'rfk_tabpanel_00548799paosie',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,cls:'tab-modulpanel-cl-hijau',height:PanelCompHeight,
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'opd-rfk-list'}]
                },
                
                {title: '.:: CASCADE ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[{xtype:'bulan-rfk-list'}]
                },
                {title: '.:: CASCADE ::.' ,itemId: 'step-2',cls: 'card',hidden:true,
                    items:[{xtype:'rfk-opd-pekerjaan'}]
                },
                {title: '.:: MAPPING ::.' ,itemId: 'step-3',cls: 'card',hidden:true,
                   // items:[{xtype:'rfk-mapping-fmis'}]
                },
                {title: '.:: MAPPING ::.' ,itemId: 'step-4',cls: 'card',hidden:true,
                  //  items:[{xtype:'rfk-opd-serapan-anggaran'}]
                },
            ],
        }
      
    ],
    menuVerifikasi: {
        xtype: 'actionsheet',side: 'left',
        items: [
                {text: 'Buka',iconCls: 'x-fa fa-folder-open',handler: 'openPekerjaan',ui:'soft-green',shadow:true,margin:'250 10 10 10'},
                {text: 'Verifikasi',iconCls: 'x-fa fa-check',handler: 'verifikasiLaporan',ui:'soft-blue',shadow:true,margin:'10 10 10 10'},
				{text: 'Batalkan Verifikasi',iconCls: 'x-fa fa-unlink',handler:'batalLaporan',ui:'soft-purple',shadow:true,margin:'10 10 10 10'},   
				{text: 'Hapus',iconCls: 'x-fa fa-minus',handler:'hapusLaporan',ui:'soft-red',shadow:true,margin:'10 10 10 10'}, 
        ]
    },
    listeners: {
        painted : 'initTabItem'
	},

    dialogKontrak: {
        xtype: 'dialog',
        title: 'Update RFK',
        closable: true,maximizable: true,closeAction:'hide',
        shadow: 'true',height:'97%',width:'80%',
        items:[
            {xtype:'form-kontrak'}
        ],
    },

    dialogFoto: {
        xtype: 'dialog',
        title: 'Update Foto Pekerjaan',
        closable: true,maximizable: true,closeAction:'hide',
        shadow: 'true',height:300,width:'60%',
        items:[
            {xtype:'rfk-form-upload'}
        ],
    },


});
