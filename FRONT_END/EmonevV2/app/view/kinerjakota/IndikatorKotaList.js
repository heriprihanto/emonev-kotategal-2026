Ext.define('Admin.view.kinerja.IndikatorKotaList',
	{
		extend : 'Ext.grid.Grid',
		xtype : 'indikator-capkinkota-list',
		cls : 'personnelview',fullscreen: true,striped:true,columnLines:true,rowLines:true,
		requires: ['Admin.plugin.CellEditing'], markDirty: true,
		plugins: {cellediting: true},

		bind: {
			store: '{indikatorKotaStore}'
		},
		rowNumbers: {
			text: 'No.',width:80
		},
		columns : [
			
			{
				text: 'id',
				dataIndex: 'id',
				hidden: true
			},
			
			{
				text: 'Tujuan / Sasaran',width: '250',
				dataIndex: 'slvl',cell : {encodeHtml : false},
				renderer : function(value, record) {
					var td = record.data;
					let scls='';
					if (td.lvl == 1) {
						scls='info';
					} else if (td.lvl == 2) {
						scls='warning';
					} 
					return '<span class="badge2 bg-'+scls+'">' + td.slvl +'</span>';
					
				}
			}, 
			{
				text: 'Indikator',
				dataIndex: 'tolok_ukur',
				width: '35%'
			},
			{text: 'Satuan',dataIndex: 'satuan',width: 80,editable: true,editable:true},
			{
				text: 'Target',
				columns : [
					{text: 'Tahun '+vTAHUN,dataIndex: 'target',width: 100,align: 'right'},
					{text: 'Renstra',dataIndex: 'target_rpj',width: 100,align: 'right'},
					{text: 'Akhir Renstra',dataIndex: 'target_akhir',width: 100,align: 'right'},
				]
			},
			{text: 'Realisasi Tahun',
				columns : [
					{
						text: xtahun1,
						dataIndex: 'ck1',
						width: 80,align: 'right',
					},
					{
						text: xtahun2,
						dataIndex: 'ck2',
						width: 80,align: 'right',
					},
					{
						text: xtahun3,
						dataIndex: 'ck3',
						width: 80,align: 'right',
					},
					{
						text: xtahun4,
						dataIndex: 'ck4',
						width: 80,align: 'right',
					},
					{
						text: xtahun5,
						dataIndex: 'ck5',
						width: 80,align: 'right',
					},
				]
			},
			{
				text: 'Realisasi Kinerja Per Triwulan Tahun '+vTAHUN,
				columns : [
					{
						text: 'Tw I',
						dataIndex: 'ck_tw1',
						width: 80,align: 'right',
					},
					{
						text: 'Tw II',
						dataIndex: 'ck_tw2',
						width: 80,align: 'right',
					},
					{
						text: 'Tw III',
						dataIndex: 'ck_tw3',
						width: 80,align: 'right',
					},
					{
						text: 'Tw IV',
						dataIndex: 'ck_tw4',
						width: 80,align: 'right',
					},
					
				]
			},
			{
				text: 'Jenis',
				dataIndex: 'jenis',
				width: 100,editable: true,clearable:false,
				editor:{ xtype: 'selectfield',
					options: [{text: 'Positif',value: 1},{text: 'Negatif',value: 2}]
				},
				renderer : function(value, record) {
					var td = record.data;
					if (td.idjenis == 1) {
						return 'Positif';
					} else  {
						return 'Negatif';
					}
					
				}
			},
			
			/*
			{
				text: 'Jenis',
				dataIndex: 'tipe',
				width: 100,editable: true,clearable:false,
				editor:{ xtype: 'selectfield',
					options: [{text: 'Akumulatif',value: 1},{text: 'Non Akumulatif',value: 2}]
				},
				renderer : function(value, record) {
					var td = record.data;
					if (td.tipe == 1) {
						return 'Akumulatif';
					} else  {
						return 'Non Akumulatif';
					}
					
				}
			},
			*/
			
			/*
			{text: 'Keterangan',dataIndex: 'ket',width: 200,editable: true,editor: {xtype: 'textareafield',height:80}},
			{text: 'Permasalahan',dataIndex: 'masalah',width: 200,editable: true,editor: {xtype: 'textareafield',height:80}},
			{text: 'Upaya',dataIndex: 'upaya',width: 200,editable: true,editor: {xtype: 'textareafield',height:80}},
			*/
		],
		items : [
			{
					docked : 'top',
					xtype : 'toolbar',
					/*
					defaults : {height : '30px',style : {fontSize : '11px'}},
					*/
					
					items : [ 
						//{xtype: 'button',ui : 'soft-red',text: 'Kembali',shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:1,style : {fontSize : '11px'}}, 
						
						//{xtype: 'button',ui : 'soft-green',text: 'Realisasi Anggaran',shadow:true,iconCls: 'x-fa fa-book',margin:'0 5 0 5',handler: 'onBalik',destIdx:5,style : {fontSize : '11px'}},
						//{xtype: 'button',ui : 'soft-blue',text:'Laporan',shadow:true,handler: 'formPrint_Show',iconCls: 'x-fa fa-print',margin:'0 10 0 10',style : {fontSize : '11px'},xmode:'opd'},
						{xtype:'spacer'},
						{xtype: 'textfield',width:250,placeholder:'Pencarian ...',
							listeners: {action: 'cariIndikator',clearicontap: 'clearCariIndikator'}
						},	
						{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand'},								
					]
				} ],
		listeners: {
			//edit: 'simpanProgramIndikator'
			//childtap : 'indikatorKotaList_itemClick'
		},

	});
