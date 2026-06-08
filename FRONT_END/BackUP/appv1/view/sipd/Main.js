Ext.define('Admin.view.sipd.Main', {
    extend: 'Ext.Container',
    margin: '0 0 0 0', cls: 'container-modul', padding: 20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.sipd.ViewModel'},
	controller: {xclass: 'Admin.view.sipd.Controller'},
    xtype: 'sipd-mainview',
    requires: [
        // 'Ext.ux.google.Map'
    ],

    items: [
        {
            xtype: 'component',
            html: '<div class="dt-entry__header"><i class="x-fa fa-calendar-check" aria-hidden="true"></i> SINKRONISASI DATA SIPD  </div>',
        },
        {
            xtype: 'sipd-job-list',
        }
        
        /*
        {
            xtype: 'tabpanel', tabBar: { layout: { pack: 'start', overflow: 'scroller' } }, margin: '30 0 0 0', height: PanelCompHeight - 50,
            //cls:'tab-modulpanel-cl-hijau',
            //id:'tab-modulpanel-rencana-kinerja-0x8943fgtreu',
            items: [
                {
                    title: 'RPJPD', itemId: 'step-00', cls: 'card', 
                    //items:[{xtype:'renstra-opd-list'}]
                },
                {
                    title: 'RPJMD', itemId: 'step-0', cls: 'card', 
                    //items:[{xtype:'renstra-opd-list'}]
                },
                {
                    title: 'RENSTRA', itemId: 'step-1', cls: 'card', 
                    //items:[{xtype:'renstra-opd-list'}]
                },
                {
                    title: 'RKPD', itemId: 'step-2', cls: 'card', 
                    //items:[{xtype:'renstra-opd-list'}]
                },
                {
                    title: 'APBD', itemId: 'step-3', cls: 'card', 
                    //items:[{xtype:'renstra-opd-list'}]
                },

            ],
        }
            */
        

    ],
    
    dialogFormJob: {
        xtype: 'dialog',
        title: 'Sinkronisasi Data',

        closable: true,
        closeAction:'hide',

        bodyPadding: 20,
        width:400,height:250,
        items:[
            {xtype:'sipd-job-form'}
        ]
       
    },
    
});
