Ext.define('Admin.view.kinerjakota.Kinerjakota', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.kinerja.ViewModel'},
	controller: {xclass: 'Admin.view.kinerja.Controller'},
	
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-calendar-check" aria-hidden="true"></i>  Capaian Kinerja Kota </div>',
        },
      
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,height:PanelCompHeight,
            cls:'tab-modulpanel-cl-hijau',
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'indikator-capkinkota-list'}]
                },
                {title: '.:: OPD ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[{xtype:'form-indikator-kota-kinerja-capkin'}]
                }
            ],
        }
      
    ]
});
