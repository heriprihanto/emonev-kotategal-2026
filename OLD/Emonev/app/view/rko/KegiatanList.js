Ext.define('Admin.view.rko.KegiatanList',
				{
					extend: 'Ext.grid.Tree',id:'kegiatan-rko-list',
					xtype : 'kegiatan-rko-list',
					fullscreen: true,striped:true,columnLines:true,rowLines:true,margin: '0 5 0 5',
					/*requires: [
						'Ext.grid.plugin.CellEditing',
						'Ext.grid.plugin.Editable'
					],*/
					requires: ['Admin.plugin.CellEditing'], markDirty: true,
					plugins: {cellediting: true},
					listeners: {
						edit: 'editSubkegiatan'
					},
					//rowNumbers : true,
					bind: {store: '{kegiatanStore}',selection: '{selectedNode}'},
					collapsible: false,useArrows: true,
					//listeners: {childtap : 'onMenu'},
					//platformConfig: {desktop: {plugins: {gridcellediting: true}},'!desktop': {plugins: {grideditable: true}}},
					//rootVisible: true,
					columns : [
						{text : '<b>Aksi</b>',width: 40,cell: {tools: {menu: 'onMenu'}}},
						{text: 'id', dataIndex: 'id',hidden: true},						
							{
								xtype: 'treecolumn',cell : {encodeHtml : false},
								text: '<b>Program > Kegiatan > Sub Kegiatan > Pekerjaan</b>',
								width: '40%',
								sortable: true,
								dataIndex: 'uraian',
								renderer : function(value, record) {
									var td = record.data;
									if (td.lvl == 1) {
										return '<span class="badge2 bg-danger">' + td.uraian +'</span>';
									} else if (td.lvl == 2) {
										return '<span class="badge2 bg-success">' + td.uraian +'</span>';
									} else if (td.lvl == 3) {
										return '<span class="badge2 bg-warning">' + td.uraian +'</span>';
									} else if (td.lvl == 4) {
										return td.uraian;
									}
									
								}
							},
														
							{
								text: '<b>Anggaran</b>',
								dataIndex: 'anggaran',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 150
							}, 
							{
								text: '<b>Total Entri</b>',
								dataIndex: 'dt_entri',align: 'right',width: 150,cell : {encodeHtml : false},
								renderer : function(value, record) {
									var td = record.data;
									
									if (td.lvl == 3) {
										if (Number(td.anggaran) != Number(td.dt_entri)) {
											return '<span class="label2 label-danger">' + Ext.util.Format.number(td.dt_entri,'0,0') +'</span>';
										} else {
											return Ext.util.Format.number(td.dt_entri,'0,0') ;
										}
									}
								}
							}, 
							{
								text: '<b>PPK</b>',
								dataIndex: 'nama_ppk',width: 150
							},
							{
								text: '<b>PPTK</b>',
								dataIndex: 'nama_pptk',width: 150,
							},
							{
								text: '<b>Target Fisik (%)</b>',
								columns:[
									{text: 'Jan',dataIndex: 'jan_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Feb',dataIndex: 'feb_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Mar',dataIndex: 'mar_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Apr',dataIndex: 'apr_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Mei',dataIndex: 'mei_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Jun',dataIndex: 'jun_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Jul',dataIndex: 'jul_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Agu',dataIndex: 'agu_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Sep',dataIndex: 'sep_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Okt',dataIndex: 'okt_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Nov',dataIndex: 'nov_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Des',dataIndex: 'des_f',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
								]
							}, 
							{
								text: '<b>Target Keuangan (%)</b>',
								columns:[
									{text: 'Jan',dataIndex: 'jan',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Feb',dataIndex: 'feb',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Mar',dataIndex: 'mar',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Apr',dataIndex: 'apr',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Mei',dataIndex: 'mei',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Jun',dataIndex: 'jun',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Jul',dataIndex: 'jul',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Agu',dataIndex: 'agu',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Sep',dataIndex: 'sep',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Okt',dataIndex: 'okt',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Nov',dataIndex: 'nov',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
									{text: 'Des',dataIndex: 'des',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 65}, 
								]
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
					items : [
							{docked : 'top',xtype : 'toolbar',
								responsiveConfig: {
									'width > 800': {hidden: false},
									'width <= 1000': {hidden: true}
								},
								items : [
									{xtype: 'button',ui : 'soft-red',shadow:true,text: '',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:1},
									{xtype: 'button',ui : 'soft-green',shadow:true,text:'Update DPA',handler: 'formSipd_Show',iconCls: 'x-fa fa-download',margin:'0 10 0 10'},									{
									xtype: 'button',ui : 'soft-cyan',shadow:true,text:'Cetak RKO',handler: 'formPrint_Show',iconCls: 'x-fa fa-print',margin:'0 10 0 10'},
									{xtype: 'button',ui : 'soft-blue',shadow:true,text:'Verifikasi OPD',handler: 'formVerifikasiPD_Show',iconCls: 'x-fa fa-check',margin:'0 10 0 10'},
									
									{xtype: 'textfield',label: 'Pencarian',width:250,margin:'0 5 0 25',
										listeners: {action: 'cariKegiatan',clearicontap: 'clearCarikegiatan'}
									},
									
									
								],
							},
							{docked : 'top',xtype : 'toolbar',
								responsiveConfig: {
									'width > 800': {hidden: true},
									'width <= 1000': {hidden: false}
								},
								items : [
									{xtype: 'button',ui : 'decline',text: '',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:1},
									{xtype: 'button',ui : 'action',text: 'menu',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',
										menu:[
											{text:'Cetak RKO',handler: 'formPrint_Show',iconCls: 'x-fa fa-print',margin:'0 10 0 10'},
											{text:'Verifikasi OPD',handler: 'formVerifikasiPD_Show',iconCls: 'x-fa fa-check',margin:'0 10 0 10'},
												
										]
									},
									
									
									
								],
							}
						],
					menuSubKeg: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							{text : 'Tambah Pekerjaan',iconCls : 'x-fa fa-plus',handler : 'formPekerjaan_Show',mode:'add',jenis:'1'}, 
							{text : 'Edit Subkegiatan',iconCls : 'x-fa fa-plus',handler : 'formSubkegiatan_Show',mode:'edit',jenis:'1'}, 
						]	
					},
					menuPekerj: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							{text : 'Edit',iconCls : 'x-fa fa-pencil-alt',handler : 'formPekerjaan_Show',mode:'edit'}, 
							{text : 'Hapus',iconCls : 'x-fa fa-minus',handler : 'hapusPekerjaan'},
							{text : 'Rencana',iconCls : 'x-fa fa-tasks',handler : 'formRencana_Show'},
						]
					},


				});
