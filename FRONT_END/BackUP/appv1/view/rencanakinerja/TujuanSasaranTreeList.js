Ext.define('Admin.view.rencanakinerja.TujuanSasaranTreeList',
	{
		extend: 'Ext.grid.Tree', 
		xtype: 'rencanakinerja-tujuansasaran-list',id: 'rencanakinerja-tujuansasaran-list',
		fullscreen: true, striped: true, columnLines: true, rowLines: true, margin: '0 5 0 5',
		/*requires: [
			'Ext.grid.plugin.CellEditing',
			'Ext.grid.plugin.Editable'
		],*/
		requires: ['Admin.plugin.CellEditing'], markDirty: true,
		plugins: { cellediting: true },
		listeners: {
			edit: 'editSubkegiatan'
		},
		//rowNumbers : true,
		bind: { store: '{tujuanSasaranStore}', selection: '{selectedNode}' },
		collapsible: false, useArrows: true,
		//listeners: {childtap : 'onMenu'},
		//platformConfig: {desktop: {plugins: {gridcellediting: true}},'!desktop': {plugins: {grideditable: true}}},
		//rootVisible: true,
		columns: [
			//{text : '<b>Aksi</b>',width: 40,cell: {tools: {menu: 'onMenu'}}},
			{ text: 'id', dataIndex: 'id', hidden: true },
			{
				xtype: 'treecolumn', cell: { encodeHtml: false },
				text: '<b>Tujuan / Sasaran</b>',
				width: '70%',
				sortable: true,
				dataIndex: 'uraian',
				renderer : function(value, record) {
					var td = record.data;
					if (td.lvl == 3) {
						return '<span class="badge2 bg-success2a">' + td.uraian +'</span>';
					} else if (td.lvl == 4) {
						return '<span class="badge2 bg-warning2">' + td.uraian +'</span>';
					} 
					
				}
			},


			/*
			{
				text: '<b>Jumlah Pekerjaan</b>',
				dataIndex: 'persen',align: 'right',width: 70
			},
			
			{
				text: '<b>%</b>',
				dataIndex: 'persen',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 70
			},
			*/
		],
		items: [
			{
				docked: 'top', xtype: 'toolbar',margin: '10 0 10 0',
				responsiveConfig: {
					'width > 800': { hidden: false },
					'width <= 1000': { hidden: true }
				},
				items: [
					{ xtype: 'button', ui: 'soft-red', shadow: true, text: '', iconCls: 'x-fa fa-backward', margin: '0 5 0 5', handler: 'onBalik', destIdx: 0 },
					{ xtype: 'button', ui: 'soft-blue', text: 'Laporan', shadow: true, handler: 'formPrint_Show', iconCls: 'x-fa fa-print', margin: '0 10 0 10', style: { fontSize: '11px' }, xmode: 'opd' },

					//{ xtype: 'button', ui: 'soft-green', text: 'Kirim Laporan', shadow: true, iconCls: 'x-fa fa-paper-plane', margin: '0 5 0 5', handler: 'formKirim_Show', destIdx: 0 },
					{ xtype: 'button', ui: 'soft-purple', text: 'Submit Rencana Kinerja', id: 'btn_verifikasi_lap_rencanakinerjapd', shadow: true, iconCls: 'x-fa fa-paper-plane', margin: '0 5 0 5', handler: 'formVerifikasi_Show', mode:1,destIdx: 0},
					
					{ xtype: 'button', ui: 'soft-green', text: 'Verifikasi BAPPERIDA', id: 'btn_verifikasi_lap_rencanakinerjapd_bappeda', shadow: true, iconCls: 'x-fa fa-check', margin: '0 5 0 5', handler: 'formVerifikasi_Show',mode:2, destIdx: 0},
					

					{xtype:'spacer'},

					{
						xtype: 'textfield', label: 'Pencarian', width: 250, margin: '0 5 0 25',
						listeners: { action: 'cariKegiatan', clearicontap: 'clearCarikegiatan' }
					},


				],
			},

		],

		listeners: {
			childtap: 'TujuanSasaranList_itemClick'
		}

	});
