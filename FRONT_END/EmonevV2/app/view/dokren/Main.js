Ext.define('Admin.view.dokren.Main', {
    extend: 'Ext.Container',
    margin: '0 0 0 0', cls: 'container-modul', padding: 20,
    scrollable: true,
    viewModel: { xclass: 'Admin.view.dokren.ViewModel' },
    controller: { xclass: 'Admin.view.dokren.Controller' },
    xtype: 'dokren-mainview',
    requires: [
        // 'Ext.ux.google.Map'
    ],

    items: [
        {
            xtype: 'component',
            html: '<div class="dt-entry__header"><i class="x-fa fa-book" aria-hidden="true"></i> DOKUMEN PERENCANAAN  </div>',
        },
        
        {
            xtype: 'tabpanel', tabBar: { layout: { pack: 'start', overflow: 'scroller' } }, margin: '30 0 0 0', height: PanelCompHeight - 50,
            //cls:'tab-modulpanel-cl-hijau',
            //id:'tab-modulpanel-rencana-kinerja-0x8943fgtreu',
            items: [
                {
                    title: '.:: OPD ::.', itemId: 'step-0', cls: 'card', hidden: true,
                    items:[{xtype:'opd-dokren-list'}]
                },
                {title: '.:: CASCADE ::.' ,itemId: 'step-1',cls: 'card',hidden:true,
                    items:[{xtype:'dokumen-dokumen-list'}]
                },


            ],
        }
        

    ],
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
            {xtype:'form-dokumen-upload'}
        ]
       
    },
});
