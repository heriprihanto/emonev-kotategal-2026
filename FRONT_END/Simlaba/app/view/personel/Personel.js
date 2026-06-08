Ext.define('Admin.view.personel.Personel', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.personel.ViewModel'},
	controller: {xclass: 'Admin.view.personel.Controller'},
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_personel"><i class="x-fa fa-user" aria-hidden="true"></i> Data Personel</div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,cls:'tab-modulpanel-cl-biru',height:PanelCompHeight,
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'personel-opd-list'}]
                },
                
                {title: '.:: CASCADE ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[{xtype:'personel-name-list'}]
                },
            ],
        }
      
    ],
    listeners: {
        painted : 'initTabItem'
	}
});
