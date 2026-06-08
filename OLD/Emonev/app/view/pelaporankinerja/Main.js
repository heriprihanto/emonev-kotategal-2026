Ext.define('Admin.view.pelaporankinerja.Main', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.pelaporankinerja.ViewModel'},
	controller: {xclass: 'Admin.view.pelaporankinerja.Controller'},
	
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_capkin_opd"><i class="x-fa fa-calendar-check" aria-hidden="true"></i> Pelaporan Kinerja </div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,height:PanelCompHeight,
            cls:'tab-modulpanel-cl-merah',id:'tab-modulpanel-laporan-kinerja-0x8i7510u5',
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'pelaporankinerja-opd-list'}]
                },
               
                {title: '.:: Triwulan ::.' ,itemId: 'step-0xx',cls: 'card',hidden:true,
                    items:[{xtype:'pelaporan-dokumen-list'}]
                },
                
                
                
               
            ],
        }
            
      
    ],
    dialogUpload: {
        xtype: 'dialog',
        title: 'Upload Dokumen',

        closable: true,
        maskTapHandler: 'onCancel',

        bodyPadding: 20,
        width:400,height:200,
        items:[
            {xtype:'form-dokumen-laporan-upload'}
        ]
       
    },
});
