Ext.define('Admin.view.rencanakinerja.Main', {
    extend: 'Ext.Container',
    margin: '0 0 0 0', cls: 'container-modul', padding: 20,
    scrollable: true,
    viewModel: { xclass: 'Admin.view.rencanakinerja.ViewModel' },
    controller: { xclass: 'Admin.view.rencanakinerja.Controller' },
    xtype: 'rencana-kinerja-tahunan',

    items: [
        {
            xtype: 'component',
            html: '<div class="dt-entry__header" id="dt-entry__header_rencana_kinerja_opd"><i class="x-fa fa-calendar-check" aria-hidden="true"></i> Rencana Kinerja </div>',
        },

        {
            xtype: 'tabpanel', tabBar: { layout: { pack: 'start', overflow: 'scroller' } }, margin: '30 0 0 0', height: PanelCompHeight - 50,
            //cls:'tab-modulpanel-cl-hijau',
            id: 'tab-modulpanel-rencana-kinerja-0x8943fgtreu',
            items: [
                {
                    title: '.:: OPD ::.', itemId: 'step-0', cls: 'card', hidden: true,
                    items: [{ xtype: 'opd-rencanacapkin-list' }]
                },

                
                {title: '.:: Triwulan ::.' ,itemId: 'step-0xx',cls: 'card',hidden:true,
                    items:[]
                },
                
                
                {
                    title: '.:: Sub OPD ::.', itemId: 'step-1xxcdsd', cls: 'card', hidden: true,
                    items: [
                        { xtype: 'rencanakinerja-cascading-list' }
                    ]
                },

                {
                    title: 'Tujuan / Sasaran', height: '100%', hidden: true,
                    items: [{ xtype: 'rencanakinerja-indikator-list' }],
                },


                {
                    title: '.:: Indikator ::.', itemId: 'step-2', cls: 'card', hidden: true,
                    bodyPadding: 40,
                    items: [{ xtype: 'rencanakinerja-form-indikator' }]
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
    dialogKinerja: {
        xtype: 'dialog',
        title: 'Indikator',
        closable: true,
        closeAction: 'onCancel',
        //defaultFocus: '#ok',
        //maximizable: true,
        maskTapHandler: 'onCancel',

        bodyPadding: 20,
        width: '80%', height: '80%',
        items: [
            /// {xtype:'rencanakinerja-form-indikator'}
        ]

    },
    dialogPrint: {
        xtype: 'dialog',
        title: 'Laporan',
        closable: true,closeAction:'hide',

        bodyPadding: 20,
        responsiveConfig: {
            'width < 800': {
                width: '95%', height: '90%',
            },
            'width >= 800': {
                width: 450, height: 370,
            }
        },
        items: [
            { xtype: 'rencana-capkin-form-print' }
        ]

    },

    dialogPersonel: {
        xtype: 'dialog',
        title: 'Form Penugasan',
        closable: true,closeAction:'hide',

        bodyPadding: 20,
        responsiveConfig: {
            'width < 800': {
                width: '95%', height: '90%',
            },
            'width >= 800': {
                width: 450, height: 370,
            }
        },
        items: [
            { xtype: 'rencana-capkin-form-personel' }
        ]

    },

    dialogVerifikasi: {
        xtype: 'dialog',
        title: 'Submit Rencana Kinerja',
        closable: true,closeAction:'hide',

        bodyPadding: 20,
        width: 500, height: 450,
        items: [
            { xtype: 'rencana-kinerja-form-verifikasi' }
        ]

    },
    menuVerifikasi: {
        xtype: 'actionsheet', side: 'left',
        items: [
            { text: 'Buka', iconCls: 'x-fa fa-folder-open', handler: 'openRko', ui: 'soft-green', shadow: true, margin: '250 10 10 10' },
            { text: 'Verifikasi', iconCls: 'x-fa fa-check', handler: 'verifikasiRko', ui: 'soft-purple', shadow: true, margin: '10 10 10 10' },
            { text: 'Batalkan Verifikasi', iconCls: 'x-fa fa-unlink', handler: 'batalRko', ui: 'soft-red', shadow: true, margin: '10 10 10 10' },
        ]
    },
});
