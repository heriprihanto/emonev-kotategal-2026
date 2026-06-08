Ext.define('Admin.view.rencanakinerja.ProgramKegiatanSubkegiatanTreeList',
	{
		extend: 'Ext.grid.Tree', id: 'rencanakinerja-programkegiatansubkegiatan-list',
		xtype: 'rencanakinerja-programkegiatansubkegiatan-list',
		fullscreen: true, striped: true, columnLines: true, rowLines: true, margin: '0 5 0 5',
		/*requires: [
			'Ext.grid.plugin.CellEditing',
			'Ext.grid.plugin.Editable'
		],*/
		requires: ['Admin.plugin.CellEditing'], markDirty: true,
		plugins: { cellediting: true },
		
		//rowNumbers : true,
		bind: { store: '{programKegiatanStore}' },
		collapsible: false, useArrows: true,
		//listeners: {childtap : 'onMenu'},
		//platformConfig: {desktop: {plugins: {gridcellediting: true}},'!desktop': {plugins: {grideditable: true}}},
		//rootVisible: true,
		columns: [
			//{text : '<b>Aksi</b>',width: 40,cell: {tools: {menu: 'onMenu'}}},
			{ text: 'id', dataIndex: 'id', hidden: true },
			{
				xtype: 'treecolumn', cell: { encodeHtml: false },
				text: '<b>Program / Kegiatan / Subkegiatan</b>',
				width: '45%',
				sortable: true,
				dataIndex: 'uraian',
				
				renderer : function(value, record) {
					var td = record.data;
					if (td.lvl == 5) {
						return '<span class="badge2 bg-danger2">' + td.uraian +'</span>';
					} else if (td.lvl == 6) {
						return '<span class="badge2 bg-success2a">' + td.uraian +'</span>';
					} else if (td.lvl == 7) {
						return '<span class="badge2 bg-warning2">' + td.uraian +'</span>';
					}
					
				}
			},

			{
				text: '<b>Outcome / Output</b>',
				dataIndex: 'outcome',width: 300
			},

			
			{
				text: '<b>Pagu Anggaran</b>',
				dataIndex: 'anggaran',align: 'right',width: 170,renderer: Ext.util.Format.numberRenderer('0,0')
			},

			{
				width: 50,
				hideable: false,
		
				cell: {
					tools: {
						edit: {
							iconCls: 'x-fa fa-user orange icon-mg',
							tooltip :'Form Penugasan',
							handler: 'formPenugasan_Show',mode:'edit'
						},
					}
				}
			},
			
			{
				text: '<b>PPTK</b>',
				dataIndex: 'nama_pptk',width: 270
			},
			
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
					/*
					{ xtype: 'button', ui: 'soft-green', shadow: true, text: 'Update DPA', handler: 'formSipd_Show', iconCls: 'x-fa fa-download', margin: '0 10 0 10' }, {
						xtype: 'button', ui: 'soft-cyan', shadow: true, text: 'Cetak RKO', handler: 'formPrint_Show', iconCls: 'x-fa fa-print', margin: '0 10 0 10'
					},
					{ xtype: 'button', ui: 'soft-blue', shadow: true, text: 'Verifikasi OPD', handler: 'formVerifikasiPD_Show', iconCls: 'x-fa fa-check', margin: '0 10 0 10' },
					*/
					{xtype:'spacer'},
					{
						xtype: 'textfield', label: 'Pencarian', width: 250, margin: '0 5 0 25',
						listeners: { action: 'cariKegiatan', clearicontap: 'clearCarikegiatan' }
					},


				],
			},

		],

		listeners: {
			childtap: 'ProgramKegiatanList_itemClick'
		}

	});
