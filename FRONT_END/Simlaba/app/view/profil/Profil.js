Ext.define('Admin.view.profil.Profil', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:'0 150 0 150',
    scrollable: true,
    //viewModel: {xclass: 'Admin.view.kinerja.ViewModel'},
	controller: {xclass: 'Admin.view.profil.Controller'},
	
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-user" aria-hidden="true"></i>  Profil </div>',
        },
      
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,height:PanelCompHeight,
            cls:'tab-modulpanel-cl-hijau',
            items: [		
                {title: 'Profil Pengguna' ,itemId: 'step-0',cls: 'card',
                    items:[{xtype:'form-profil-pengguna'}]
                },
               
                {title: 'Profil OPD' ,itemId: 'step-1',cls: 'card',
                    items:[{xtype:'form-profil-opd'}]
                },
                 /*
                {title: '.:: CASCADE ::.' ,itemId: 'step-2',cls: 'card',hidden:true,
                    items:[{xtype:'pekerjaan-dak-list'}]
                },
                
               */
            ],
        }
      
    ],
    listeners: {
        painted : 'initTabItem'
	}

});
