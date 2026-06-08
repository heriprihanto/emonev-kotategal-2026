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
					{text: '<b>A. PERENCANAAN</b>',leaf: false,iconCls: 'x-fa fa-book',expanded: true,
						children: [
							{text:'<b>I. Perencanaan Kota</b>',leaf: false,expanded: true,
								children: [
									{text: '1. RPJMD',leaf: true,reportName:'rpjmd',mID:7},
									{text: '2. Rencana Kinerja Tahunan',leaf: true,reportName:'rkt_kota',mID:111},
									{text: '3. Indikator Kinerja Utama',leaf: true,reportName:'iku_kota',mID:113},
									{text: '4. Indikator Kinerja Daerah',leaf: true,reportName:'iku_kota',mID:113},
									{text: '5. Perjanjian Kinerja',leaf: true,reportName:'pk_kota',mID:114},
									{text: '6. SK Indikator Kinerja Utama',leaf: true,reportName:'sk_iku_kota',mID:115},
									{text: '7. Keterkaitan RPJMD dan Program',leaf: true,reportName:'rpjmd2',mID:7},
									{text: '8. Matriks Indikator',leaf: true,reportName:'matrix',mID:7},
									{text: '9. Pohon Kinerja',leaf: true,reportName:'report/pohon_kota',mID:116,birt:false},
									
								]
							},
							{text: '<b>II. Perencanaan Perangkat Daerah</b>',leaf: false,iconCls: 'x-fa fa-angle-right',expanded: true,
								children: [
									{text: '1. Renstra',leaf: true,reportName:'renstra',mID:1},
									{text: '2. Rencana Kinerja Tahunan',leaf: true,reportName:'rkt',mID:2},
									{text: '3. Indikator Kinerja Utama',leaf: true,reportName:'iku',mID:3},
									{text: '4. Perjanjian Kinerja',leaf: true,reportName:'pk',mID:4},
									{text: '5. SK Indikator Kinerja Utama',leaf: true,reportName:'sk_iku',mID:5},
									{text: '6. Sasaran Kinerja Pegawai (SKP)',leaf: true,reportName:'skp',mID:44},
									{text: '7. Matriks Indikator',leaf: true,reportName:'matrixpd',mID:1},
									{text: '8. Matriks Indikator Kinerja Individu',leaf: true,reportName:'matrixiki',mID:44},
									{text: '9. Program Pendukung RPJMD',leaf: true,reportName:'programpd',mID:44},
									{text: '10.Pohon Kinerja',leaf: true,reportName:'report/pohon_kota',mID:116,birt:false},
									
								]
							},
							
						]
					},
					{text: '<b>B. CAPAIAN KINERJA</b>',leaf: false,iconCls: 'x-fa fa-book',expanded: true,
						children: [
							{text: '<b>I. Capaian Kinerja Kota</b>',leaf: false,iconCls: 'x-fa fa-angle-right',expanded: true,
								children: [
									{text: '1. Evaluasi RKPD',leaf: true,reportName:'eval_rkpd',mID:22},
									{text: '2. Evaluasi RPJMD',leaf: true,reportName:'capaian_iku_kota',mID:22},
									
									{text: '3. Capaian IKU',leaf: true,reportName:'capaian_iku_kota',mID:22},
									{text: '4. Capaian IKD',leaf: true,reportName:'capaian_iku_kota',mID:22},
									{text: '5. Capaian Per Program',leaf: true,reportName:'capaian_program',mID:22},
									{text: '6. Capaian Per Bidang Urusan',leaf: true,reportName:'capaian_iku_kota',mID:22},
									{text: '7. Tingkat Kesesuaian Indikator',leaf: true,reportName:'capaianiks',mID:12},
									{text: '8. Pagu dan Realisasi Anggaran',leaf: true,reportName:'realisasi_anggaran_kota',mID:22},
									{text: '9. Analisis Pencapaian Sasaran Triwulanan',reportName:'analisa_capkin_tw_kota',leaf: true,mID:22},
									{text: '10.Analisis Pencapaian Sasaran Tahunan',reportName:'analisa_capkin_tahunan_kota',leaf: true,mID:22},
									{text: '11.Efisiensi dan Efektifitas Kinerja',reportName:'efisiensi_kota',leaf: true,mID:22},
									{text: '12.Capaian Kinerja Indikator',reportName:'capaian_indikator_kota',leaf: true,mID:22},
									//{text: 'Rencana Aksi',reportName:'capaian/renaksi_kota',leaf: true,mID:22},
									//{text: 'LKjIP',leaf: true,reportName:'capaian/lkjip_kota',prefReport:true,mID:22},
									
								]
							},
							{text: '<b>I. Capaian Kinerja Perangkat Daerah</b>',leaf: false,iconCls: 'x-fa fa-angle-right',expanded: true,
								children: [
									{text: '1. Evaluasi Hasil Renja',leaf: true,reportName:'eval_renja',mID:13},
									{text: '2. Capaian IKU',leaf: true,reportName:'capaian_iku_pd',mID:11},
									{text: '3. Evaluasi Renstra PD',leaf: true,reportName:'eval_renstra',mID:12},
									{text: '4. Pagu dan Realisasi Anggaran',leaf: true,reportName:'realisasi_anggaran',mID:13},
									{text: '5. Analisis Pencapaian Sasaran Triwulanan',leaf: true,reportName:'analisa_capkintw',mID:14},
									{text: '6. Analisis Pencapaian Sasaran Tahunan',leaf: true,reportName:'analisa_capkinth',mID:14},
									{text: '7. Efisiensi dan Efektifitas Kinerja',leaf: true,reportName:'efisiensi',mID:15},
									{text: '8. Rencana Aksi',leaf: true,reportName:'renaksi_opd',mID:17},
									{text: '9. Capaian Kinerja Indikator',reportName:'capaian_iku_pd',leaf: true,mID:13},
									//{text: 'LKjIP',leaf: true,reportName:'capaian/lkjip',prefReport:true,mID:16},
									
									//{text: 'Prestasi',leaf: true,reportName:'capaian/prestasi',mID:11},
									//{text: 'Penilaian SKP',leaf: true,reportName:'capaian/skp',mID:11},

																	]
							},

						]
				},
				{text: '<b>C. REKAPITULASI</b>',leaf: false,iconCls: 'x-fa fa-book',expanded: true,
					children: [
						{text : '1. Progres Pelaporan ',reportName:'rekap_bulanan'},
						{text : '2. Capaian Kinerja Per OPD',reportName:'rekap_kirimlap'},
						
					]
				}
				]
			}
		},

		
	}
	
});
