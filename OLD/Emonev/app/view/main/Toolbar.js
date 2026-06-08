Ext.define('Admin.view.main.Toolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maintoolbar',shadow:true,id:'xMainToolbar',
    margin:'10 20 15 20',

    requires: [
        'Ext.Button',
        'Ext.Img',
        'Ext.SegmentedButton'
    ],

    items: [
        {
            xtype: 'component',
            reference: 'logo',
            userCls: 'main-logo',
            html: `<h3 style="font-family:Papyrus,fantasy;font-size:20px;margin-top:2px;font-weight:bold;text-align: left;color: #fff;
            text-shadow:0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #f09,0 0 82px #f09,0 0 92px #f09,0 0 102px #f09,0 0 151px #f09;">e-Monev</h3>`
        }, 

    {xtype: 'segmentedbutton',ui: 'headerbutton',
        responsiveConfig: {
            'width < 800': {hidden: true},
            'width >= 1000': {hidden: false}
        },
        items: [
            {text: 'Beranda',iconCls: 'x-fa fa-home',handler : 'menuClick',mview:'dashboard',ui: 'headerbutton',}, 
            {text: 'Perencanaan',iconCls : 'x-fa fa-file-archive',ui: 'headerbutton',
                menu :[
                    {text: 'Dokumen Perencanaan',iconCls : 'x-fa fa-asterisk',href : 'https://monevrkpd.tegalkota.go.id/dokren/unggah/',mview:'dokumen'},
                    {text: 'Personel',iconCls : 'x-fa fa-asterisk',ui: 'headerbutton',handler : 'menuClick',mview:'personel'},
                    {text: 'Indikator',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'indikator'},
                    {text: 'RPJMD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'rpjmd'},
                    {text: 'Renstra PD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'renstra'},
                    //{text: 'RKPD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'rkpd'},
                    {text: 'Rencana Kinerja Tahunan',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'renja'},
                    //{text: 'DPA',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'dpa'},
                    

                ]
            },

            {text: 'Kinerja',iconCls : 'x-fa fa-chart-line',ui: 'headerbutton',
                menu : [
                    {text : 'Kinerja Pemda',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'kinerjakota'},
                    {text : 'Kinerja Perangkat Daerah',iconCls : 'x-fa fa-asterisk',role:'user',tahapan:'1',handler : 'menuClick',mview:'kinerja'},
                    {text : 'Pelaporan Kinerja',iconCls : 'x-fa fa-asterisk',role:'user',tahapan:'1',handler : 'menuClick',mview:'pelaporan_kinerja'},
                    {text : 'Evaluasi Kinerja',iconCls : 'x-fa fa-asterisk',role:'user',tahapan:'1',handler : 'menuClick',mview:'evaluasi_kinerja'},
                    {text : 'Dana Alokasi Khusus',iconCls : 'x-fa fa-asterisk',role:'user',tahapan:'1',handler : 'menuClick',mview:'dak'},   
                    {text : 'SDGs',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'sdgs'},
                    {text : 'Rencana Aksi Daerah (RAD)',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'rad'},
                ]
            },
            {text: 'MRI',iconCls : 'x-fa fa-chart-line',ui: 'headerbutton',
                menu : [
                    {text : 'Beranda MRI',iconCls : 'x-fa fa-home',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-dashboard'},
                    {text : 'Lingkungan Pengendalian',iconCls : 'x-fa fa-angle-right',menu:[
                        {text : 'CEE Dokumen (F1B)',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-cee-f1b'},
                        {text : 'Simpulan CEE (F1C)',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-cee-f1c'},
                        {text : 'RTP PI (F6)',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-cee-f6'},
                    ]},
                    {text : 'Penetapan Risiko',iconCls : 'x-fa fa-angle-right',menu:[
                        {text : 'Sasaran Pemda',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-sasaran-pemda'},
                        {text : 'Sasaran OPD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-sasaran-opd'},
                        {text : 'Kegiatan OPD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-kegiatan-opd'},
                    ]},
                    {text : 'Identifikasi Risiko',iconCls : 'x-fa fa-angle-right',menu:[
                        {text : 'RSO Strategis Pemda',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-rso-strategis-pemda'},
                        {text : 'RSO Strategis OPD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-rso-strategis-opd'},
                        {text : 'ROO Operasional OPD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-roo-operasional-opd'},
                    ]},
                    {text : 'Analis Risiko',iconCls : 'x-fa fa-angle-right',menu:[
                        {text : 'Quisioner',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-quisioner'},
                        {text : 'Hasil Quisioner',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-hasil-quisioner'}
                    ]},
                    {text : 'Kegiatan Pengendalian',iconCls : 'x-fa fa-angle-right',menu:[
                        {text : 'Kegiatan Pengendalian (F7)',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-kegiatan-pengendalian'},
                        {text : 'Informasi & Komunikasi (F8)',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'mri-informasi-komunikasi'},
                        {text : 'Pemantauan (F9)',role:'admin',iconCls : 'x-fa fa-asterisk',tahapan:'1',handler : 'menuClick',mview:'mri-pemantauan'},
                        {text : 'Risk Even (F10)',role:'admin',iconCls : 'x-fa fa-asterisk',tahapan:'1',handler : 'menuClick',mview:'mri-risk-even'},
                    ]},
                    {text : 'Laporan',iconCls : 'x-fa fa-book',handler : 'menuClick',mview:'mri-laporan'},
                    
                ]
            },
            {text: 'Laporan',iconCls: 'x-fa fa-book',ui: 'headerbutton',handler : 'menuClick',mview:'laporan'},
        ]
    },
    
	'->', 
	{
            xtype: 'button',bind: { text:'{display_name}'}, 
            responsiveConfig: {'width < 800': {hidden: true},'width >= 1000': {hidden: false}},
			ui: 'headerbutton',
			reference: 'detailtoggle',
			iconCls: 'x-fa fa-user',			
			menu : [
				{text : 'Profil Pengguna',iconCls : 'x-fa fa-smile',handler : 'menuClick',mview:'profil'},
                {text : 'Panduan',iconCls : 'x-fa fa-question',href : 'panduan.html'},
                {text : 'Pengaturan',iconCls : 'x-fa fa-cog',handler : 'menuClick',mview:'pengaturan',role:'admin'},
				{text : 'Keluar',iconCls : 'x-fa fa-window-close',handler:'logOut'},
			]
    },

    {xtype: 'button',iconCls: 'x-fa fa-bars',text:'menu',
        responsiveConfig: {
            'width > 800': {hidden: true},
            'width <= 1000': {hidden: false}
        },
        ui: 'headerbutton',
        //reference: 'detailtoggle',
        menu : [
            {text: 'Beranda',iconCls: 'x-fa fa-home',handler : 'menuClick',mview:'dashboard',ui: 'headerbutton',}, 
           
            {text: 'Dokumen Perencanaan',iconCls : 'x-fa fa-asterisk',handler : 'menuClick',mview:'dokumen'},
                    {text: 'Personel',iconCls : 'x-fa fa-asterisk',ui: 'headerbutton',handler : 'menuClick',mview:'personel'},
                    {text: 'Indikator',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'indikator'},
                    {text: 'RPJMD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'rpjmd'},
                    {text: 'Renstra PD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'renstra'},
                    //{text: 'RKPD',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'rkpd'},
                    {text: 'Rencana Kinerja Tahunan',iconCls : 'x-fa fa-asterisk',role:'admin',tahapan:'1',handler : 'menuClick',mview:'renja'},
                    {text : 'Kinerja Pemda',iconCls : 'x-fa fa-angle-right',role:'admin',tahapan:'1',handler : 'menuClick',mview:'kinerjakota'},
                    {text : 'Kinerja Perangkat Daerah',iconCls : 'x-fa fa-angle-right',role:'user',tahapan:'1',handler : 'menuClick',mview:'kinerja'},
                    {text : 'Dana Alokasi Khusus',iconCls : 'x-fa fa-angle-right',role:'admin',tahapan:'1',handler : 'menuClick',mview:'dak'},   
                    {text : 'SDGs',iconCls : 'x-fa fa-angle-right',role:'admin',tahapan:'1',handler : 'menuClick',mview:'sdgs'},
                    {text : 'Rencana Aksi Daerah (RAD)',iconCls : 'x-fa fa-angle-right',role:'admin',tahapan:'1',handler : 'menuClick',mview:'rad'},

            {text: 'Laporan',iconCls: 'x-fa fa-book',ui: 'headerbutton',handler : 'menuClick',mview:'laporan'},
            {text : 'Profil Pengguna',iconCls : 'x-fa fa-smile',handler : 'menuClick',mview:'profil'},
                {text : 'Panduan',iconCls : 'x-fa fa-question',href : 'panduan.html'},
                {text : 'Pengaturan',iconCls : 'x-fa fa-cog',handler : 'menuClick',mview:'pengaturan',role:'admin'},
				{text : 'Keluar',iconCls : 'x-fa fa-window-close',handler:'logOut'},
        ]   
    },
    
	
	]
});
