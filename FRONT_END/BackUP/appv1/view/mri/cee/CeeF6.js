Ext.define('Admin.view.mri.cee.CeeF6', {
    extend: 'Ext.Container',
    xtype: 'mri-cee-f6',

    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    //viewModel: {xclass: 'Admin.view.rfk.ViewModel'},
	//controller: {xclass: 'Admin.view.rfk.Controller'},
    
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-chart-line" aria-hidden="true"></i> RTP atas CEE (Form 6)</div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,cls:'tab-modulpanel-cl-hijau',height:PanelCompHeight,
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    //items:[{xtype:'opd-rfk-list'}]
                },
                
                
            ],
        }
      
    ],
});