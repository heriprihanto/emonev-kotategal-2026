Ext.define('Admin.view.evaluasikinerja.Main', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.evaluasikinerja.ViewModel'},
	controller: {xclass: 'Admin.view.evaluasikinerja.Controller'},
	
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_capkin_opd"><i class="x-fa fa-calendar-check" aria-hidden="true"></i> Evaluasi Kinerja </div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,height:PanelCompHeight,
            cls:'tab-modulpanel-cl-merah',id:'tab-modulpanel-evaluasi-kinerja-0x8i7510u5',
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'evaluasikinerja-opd-list'}]
                },
               
                {title: '.:: Triwulan ::.' ,itemId: 'step-0xx',cls: 'card',hidden:true,
                    //items:[{xtype:'tw-capkin-list'}]
                },
                
                
                
               
            ],
        }
            
      
    ],
    /*
    dialogUpload: {
        xtype: 'dialog',
        title: 'Upload Dokumen',

        closable: true,
        closeAction:'onCancel',
        //defaultFocus: '#ok',
        //maximizable: true,
        maskTapHandler: 'onCancel',

        bodyPadding: 20,
        width:400,height:250,
        items:[
            {xtype:'form-kinerja-upload'}
        ]
       
    },
    */
});
