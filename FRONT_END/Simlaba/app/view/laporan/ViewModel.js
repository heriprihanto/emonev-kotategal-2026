Ext.define('Admin.view.laporan.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
	},
	stores: {
		navItems: {
            type: 'tree',
            rootVisible: true,
            root: {
                expanded: true,
                text: 'All',
                iconCls: 'x-fa fa-sitemap',
                children: [
					{text: 'RKO',leaf: false,iconCls: 'x-fa fa-book',expanded: false,
						children: [
							{text:'RKO (Semua)',reportName:'rko_all',iconCls: 'x-fa fa-file'},
							{text:'Bagian I-III (Visi Misi, Alokasi Anggaran, Struktur Organisasi)',reportName:'rko1',iconCls: 'x-fa fa-file'},
							{text:'Bagian IV (Tabel Program dan Kegiatan yang dilaksanakan)',reportName:'rko4',iconCls: 'x-fa fa-file'},
							{text:'Bagian V (Paket Pekerjaan dan Jadwal Pelaksanaan)',reportName:'rko5',iconCls: 'x-fa fa-file'},
							{text:'Bagian VI (Rencana Pengeluaran Anggaran)',reportName:'rko6',iconCls: 'x-fa fa-file'},
							{text:'Bagian VII (Target Fisik Kegiatan yang dilaksanakan)',reportName:'rko7',iconCls: 'x-fa fa-file'},
							{text:'Bagian VIII (Penutup)',reportName:'rko8',iconCls: 'x-fa fa-file'}
						]
					},
					{text: 'RFK',leaf: false,iconCls: 'x-fa fa-book',expanded: true,
						children: [
							{text:'RFK 1',reportName:'rfk1',iconCls: 'x-fa fa-file'},
							{text:'RFK 2',reportName:'rfk2',iconCls: 'x-fa fa-file'},
							{text:'RFK 3',reportName:'rfk3',iconCls: 'x-fa fa-file'},
						]
					},
					{text: 'Rekapitulasi',leaf: false,iconCls: 'x-fa fa-book',expanded: false,
						children: [
							{text : 'Rekap Bulanan',reportName:'rekap_bulanan',iconCls: 'x-fa fa-file',arrow:false},
							{text : 'Rekap Pengiriman Laporan',reportName:'rekap_kirimlap',iconCls: 'x-fa fa-file'},
							{text : 'Peringkat Realisasi',reportName:'peringkat',iconCls: 'x-fa fa-file'},
							{text : 'Laporan Deviasi',reportName:'deviasi',iconCls: 'x-fa fa-file'},
						]
					}
				]
			}
		},

		
	}
	
});
