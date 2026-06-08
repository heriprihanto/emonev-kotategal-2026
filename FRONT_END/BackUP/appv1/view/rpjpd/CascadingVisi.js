Ext.define('Admin.view.rpjpd.CascadingVisi',
	{
		extend: 'Ext.grid.Tree', id: 'rpjpd-cascading-visi-misi',
		xtype: 'rpjpd-cascading-visi-misi',
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
		bind: { store: '{rpjpdStore}' },
		collapsible: false, useArrows: true,
		//listeners: {childtap : 'onMenu'},
		//platformConfig: {desktop: {plugins: {gridcellediting: true}},'!desktop': {plugins: {grideditable: true}}},
		//rootVisible: true,
		columns: [
			//{text : '<b>Aksi</b>',width: 40,cell: {tools: {menu: 'onMenu'}}},
			{ text: 'id', dataIndex: 'id', hidden: true },
			{
				xtype: 'treecolumn', cell: { encodeHtml: false },
				text: '<b>Visi Daerah / Misi Daerah / Sasaran Pokok</b>',
				width: '70%',
				sortable: true,
				dataIndex: 'uraian',
				
				renderer : function(value, record) {
					var td = record.data;
					if (td.lvl == 1) {
						return '<span class="badge2 bg-danger2">' + td.uraian +'</span>';
					} else if (td.lvl == 2) {
						return '<span class="badge2 bg-success2a">' + td.uraian +'</span>';
					} else if (td.lvl == 3) {
						return '<span class="badge2 bg-warning2">' + td.uraian +'</span>';
					}
					
				}
			},

			
			/*
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
					//{ xtype: 'button', ui: 'soft-red', shadow: true, text: '', iconCls: 'x-fa fa-backward', margin: '0 5 0 5', handler: 'onBalik', destIdx: 1 },
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
