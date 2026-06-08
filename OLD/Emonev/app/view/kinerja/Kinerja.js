Ext.define('Admin.view.kinerja.Kinerja', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.kinerja.ViewModel'},
	controller: {xclass: 'Admin.view.kinerja.Controller'},
	
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_capkin_opd"><i class="x-fa fa-calendar-check" aria-hidden="true"></i> Capaian Kinerja Perangkat Daerah </div>',
        },
        
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,height:PanelCompHeight,
            cls:'tab-modulpanel-cl-hijau',id:'tab-modulpanel-kinerja-0x8i7510u5',
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                    items:[{xtype:'opd-capkin-list'}]
                },
               
                {title: '.:: Triwulan ::.' ,itemId: 'step-0xx',cls: 'card',hidden:true,
                    items:[{xtype:'tw-capkin-list'}]
                },
                
                
                {title: '.:: Sub OPD ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[{xtype:'subpd-capkin-list'}]
                },
                 
                
                {title: '.:: Indikator ::.' ,itemId: 'step-2',cls: 'card',hidden:true,
                    items:[{xtype:'indikator-capkin-list'}]
                },
                
                {title: '.:: Form ::.' ,itemId: 'step-3',cls: 'card',hidden:true,
                    items:[{xtype:'form-indikator-kinerja-capkin'}]
                },
                {title: '.:: Realisasi Anggaran ::.' ,itemId: 'step-3xx',cls: 'card',hidden:true,
                    items:[{xtype:'serapan-anggaran-capkin-list'}]
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
