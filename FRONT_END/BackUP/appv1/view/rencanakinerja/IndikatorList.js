Ext.define('Admin.view.rencanakinerja.IndikatorList', {
	extend: 'Ext.grid.Grid',
	xtype: 'rencanakinerja-indikator-list',
	//fullscreen: true,
	height: '75%',
	striped: true, margin: '0 5 0 5',
	requires: [],
	rowNumbers: true, columnLines: true, rowLines: true,

	bind: {
		store: '{indikatorStore}'
	},

	itemConfig: {
		collapsed: false,
		body: {
			tpl: `<div class="defops-desc">: {ket}</div>
			</div>`
		}
	},

	columns: [

		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		/*
		{
			width: 45,
			hideable: false,
	
			cell: {
				tools: {
					approve: {
						iconCls: 'x-fa fa-edit icon-hijau icon-48',
						text:'Rencana Kinerja',
						handler: 'openFormIndikator',
						tooltip: 'Edit Rencana Kinerja',
					}
				}
			}
		},
		*/
		/*
		{
			text: 'Nomor',
			dataIndex: 'nomor',
			width: 60,cell: {encodeHtml: false},
			
		},*/
		{
			text: 'Indikator',
			dataIndex: 'tolok_ukur',
			width: '40%'
		},
		{
			text: 'Satuan',
			dataIndex: 'satuan',
			width: 150
		},

		{
			text: `Target`,
			columns: [
				{
					text: `Renstra`,
					dataIndex: 'target_rpj',
					width: 100
				},
				{
					text: `Renja`,
					dataIndex: 'target_renja',
					width: 100
				},
				{
					text: `DPA`,
					dataIndex: 'target',
					width: 100
				},
				{
					text: `Akhir Renstra`,
					dataIndex: 'target_akhir',
					width: 100
				},

			]

		},
		{
			text: 'Target Triwulan',
			columns: [
				{
					text: 'Tw I',
					dataIndex: 'tg_tw1',
					width: 150
				},
				{
					text: 'Tw II',
					dataIndex: 'tg_tw1',
					width: 150
				},
				{
					text: 'Tw III',
					dataIndex: 'tg_tw1',
					width: 150
				},
				{
					text: 'Tw IV',
					dataIndex: 'tg_tw1',
					width: 150
				},
			]
		},


	],

	items: [
		{
			docked: 'top',
			xtype: 'toolbar',
			defaults: {
				height: '30px',
				style: {
					fontSize: '11px'
				}
			},
			items: [
				{ xtype: 'button', ui: 'soft-red', text: 'Kembali', shadow: true, iconCls: 'x-fa fa-backward', margin: '0 5 0 5', handler: 'onBalikParent', destIdx: 0 },
			]
		}],

	listeners: {
		childtap: 'IndikatorList_itemClick'
	}


});
