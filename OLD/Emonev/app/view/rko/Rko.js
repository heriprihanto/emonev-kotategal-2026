Ext.define('Admin.view.rko.Rko', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',
    //padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	controller: {xclass: 'Admin.view.rko.Controller'},
	listeners: {
        painted : 'initTabItem'
	},
    responsiveConfig: {
        'width > 800': {padding:20},
        'width <= 1000': {padding:0}
    },
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_rko"><i class="x-fa fa-calendar-check" aria-hidden="true"></i>  RKO (Rencana Kerja Operasional)</div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,cls:'tab-modulpanel-cl-merah',
            responsiveConfig: {
                'width > 800': {height:PanelCompHeight},
                'width <= 1000': {height:500}
            },
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'opd-rko-list'}]
                },
                {title: '.:: OPD ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[{xtype:'tahapan-rko-list'}]
                },
                {title: '.:: CASCADE ::.' ,itemId: 'step-2',cls: 'card',hidden:true,
                    items:[{xtype:'kegiatan-rko-list'}]
                },
                
            ],
        }
      
    ],
    menuVerifikasi: {
        xtype: 'actionsheet',side: 'left',
        items: [
            {text: 'Buka',iconCls: 'x-fa fa-folder-open',handler: 'openRko',ui:'soft-green',shadow:true,margin:'250 10 10 10'},
            {text: 'Verifikasi',iconCls: 'x-fa fa-check',handler: 'verifikasiRko',ui:'soft-purple',shadow:true,margin:'10 10 10 10'},
			{text: 'Batalkan Verifikasi',iconCls: 'x-fa fa-unlink',handler:'batalRko',ui:'soft-red',shadow:true,margin:'10 10 10 10'}, 
        ]
    },
});
