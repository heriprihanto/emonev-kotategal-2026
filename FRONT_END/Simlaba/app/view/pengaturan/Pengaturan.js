Ext.define('Admin.view.pengaturan.Pengaturan', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    
    viewModel: {xclass: 'Admin.view.pengaturan.ViewModel'},
	controller: {xclass: 'Admin.view.pengaturan.Controller'},
	listeners: {painted : 'initTabItem'},
    
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-cog" aria-hidden="true"></i> Pengaturan</div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,cls:'tab-modulpanel',height:PanelCompHeight,
            items: [		
                {title: '.:: Pengguna ::.' ,itemId: 'step-0',cls: 'card',
                    items:[{xtype:'pengaturan-user-list'}]
                },
                
                {title: '.:: OPD ::.' ,itemId: 'step-1',cls: 'card',
                    //items:[{xtype:'tahap-dak-list'}]
                },
                /*
                {title: '.:: CASCADE ::.' ,itemId: 'step-2',cls: 'card',hidden:true,
                    items:[{xtype:'kegiatan-dak-list'}]
                },
                */
            ],
        }
      
    ]
});
