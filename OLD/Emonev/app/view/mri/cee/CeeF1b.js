Ext.define('Admin.view.mri.cee.CeeF1b', {
    extend: 'Ext.Container',
    xtype: 'mri-cee-f1b',

    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.mri.cee.ViewModel'},
	controller: {xclass: 'Admin.view.mri.cee.Controller'},
    
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-chart-line" aria-hidden="true"></i> CEE Berdasarkan Dokumen (Form 1.b)</div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,cls:'tab-modulpanel-cl-hijau',height:PanelCompHeight,
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'mri-cee-opd-list'}]
                },
                {title: '.:: OPD ::.' ,itemId: 'step-0x1',cls: 'card',hidden:true,
                    items:[{xtype:'mri-cee-f1b-list'}]
                },
                
            ],
        }
      
    ],
});
