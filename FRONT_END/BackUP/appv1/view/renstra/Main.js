Ext.define('Admin.view.renstra.Main', {
    extend: 'Ext.Container',
    margin: '0 0 0 0', cls: 'container-modul', padding: 20,
    scrollable: true,
    viewModel: { xclass: 'Admin.view.renstra.ViewModel' },
    controller: { xclass: 'Admin.view.renstra.Controller' },
    xtype: 'renstra-mainview',
    requires: [
        // 'Ext.ux.google.Map'
    ],

    items: [
        {
            xtype: 'component',
            html: '<div class="dt-entry__header"><i class="x-fa fa-calendar-check" aria-hidden="true"></i> RENCANA STRATEGIS PERANGKAT DAERAH  </div>',
        },
        
        {
            xtype: 'tabpanel', tabBar: { layout: { pack: 'start', overflow: 'scroller' } }, margin: '30 0 0 0', height: PanelCompHeight - 50,
            //cls:'tab-modulpanel-cl-hijau',
            //id:'tab-modulpanel-rencana-kinerja-0x8943fgtreu',
            items: [
                {
                    title: '.:: OPD ::.', itemId: 'step-0', cls: 'card', hidden: true,
                    items:[{xtype:'renstra-opd-list'}]
                },

                {
                    title: '.:: Triwulan ::.', itemId: 'step-0xx', cls: 'card', hidden: true,
                    // items:[{xtype:'subpd-rencanacapkin-list'}]
                },


                {
                    title: '.:: Sub OPD ::.', itemId: 'step-1', cls: 'card', hidden: true,
                    //items:[{xtype:'subpd-capkin-list'}]
                },


                {
                    title: '.:: Indikator ::.', itemId: 'step-2', cls: 'card', hidden: true,
                    //items:[{xtype:'indikator-capkin-list'}]
                },

                {
                    title: '.:: Form ::.', itemId: 'step-3', cls: 'card', hidden: true,
                    //items:[{xtype:'form-indikator-kinerja-capkin'}]
                },
                {
                    title: '.:: Realisasi Anggaran ::.', itemId: 'step-3xx', cls: 'card', hidden: true,
                    //items:[{xtype:'serapan-anggaran-capkin-list'}]
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
