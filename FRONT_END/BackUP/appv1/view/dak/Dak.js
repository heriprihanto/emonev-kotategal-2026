Ext.define('Admin.view.dak.Dak', {
    extend: 'Ext.Container',xtype:'dak-opd-mainview',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.dak.ViewModel'},
	controller: {xclass: 'Admin.view.dak.Controller'},
	requires: [
        'Ext.dataview.DataView',
    ],
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header" id="dt-entry__header_dak_opd"><i class="x-fa fa-calendar-check" aria-hidden="true"></i>  Laporan Pelaksanaan Dana Alokasi Khusus (DAK) </div>',
        },
      
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',height:PanelCompHeight,
            //cls:'tab-modulpanel-cl-merah',shadow:true,border:true,
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'step-0',cls: 'card',hidden:true,
                   items:[{xtype:'opd-dak-list'}]
                },
                
                {title: '.:: CASCADE ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[{xtype:'bln-dak-list'}]
                },
                
                {title: '.:: CASCADE ::.' ,itemId: 'step-2',cls: 'card',hidden:true,
                   items:[{xtype:'kegiatan-dak-list'}]
                },
                {title: '.:: CASCADE ::.' ,itemId: 'step-3',cls: 'card',hidden:true,
                   //items:[{xtype:'form-dak-kinerja'}]
                },
               
            ],
        }
      
    ],

    dialogFormDAK: {
        xtype: 'dialog',
        title: 'Dan Alokasi Khusus',
        closable: false,
        defaultFocus: '#ok',
        maximizable: true,
        maskTapHandler: 'onCancel',
        bodyPadding: 20,
        maxWidth: '95%',
        width:'95%',height:'97%',
        items:[
            {
                xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'0 0 0 0',height:'100%',
                items: [		
                    {title: '.:: Realisasi ::.' ,
                       items:[{xtype:'form-dak-kinerja'}]
                    },
                    
                    {title: '.:: Data Kontrak ::.' ,
                        items:[{xtype:'form-dak-kinerja-kontrak'}]
                    },
                    
                    {title: '.:: Data Dukung ::.' ,
                       items:[{xtype:'form-dak-kinerja-foto'}]
                    },
                    {title: '.:: Lokasi / Peta ::.' ,
                       items:[{xtype:'form-dak-kinerja-map'}]
                    },
                ],
            }
        ]
        
    },
});
