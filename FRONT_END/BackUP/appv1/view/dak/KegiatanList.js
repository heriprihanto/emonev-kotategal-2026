Ext.define('Admin.view.dak.KegiatanList',
				{
					extend: 'Ext.grid.Tree',id:'kegiatan-dak-list',
					xtype : 'kegiatan-dak-list',
					fullscreen: true,striped:true,columnLines:true,rowLines:true,margin: '0 5 0 5',
					requires: [
						'Ext.grid.plugin.CellEditing',
						'Ext.grid.plugin.Editable'
					],
					//rowNumbers : true,
					bind: {store: '{kegiatanStore}',selection: '{selectedNode}'},
					collapsible: false,useArrows: true,
					//listeners: {edit: 'updateData'},
					listeners: {
						childtap : 'KegiatanList_itemClick'
					},
					platformConfig: {desktop: {plugins: {gridcellediting: true}},'!desktop': {plugins: {grideditable: true}}},
					//rootVisible: true,
					columns : [
						{text : '<b>Aksi</b>',width: 40,cell: {tools: {menu: 'onMenu'}},locked: true,},
						
						{
								xtype: 'treecolumn',cell : {encodeHtml : false},locked: 'left',
								text: '<b>Bidang > Sub Bidang > Kegiatan > Rincian > Detail Rincian</b>',
								width: '40%',
								sortable: true,
								dataIndex: 'uraian',
								renderer : function(value, record) {
									var td = record.data;
									let scls='';
									if (td.lvl == 1) {
										scls='danger';
									} else if (td.lvl == 2) {
										scls='success';
									} else if (td.lvl == 3) {
										scls='warning';
									} else if (td.lvl == 4) {
										scls='info';
									} else if (td.lvl == 5) {
										scls='light';
									}

									return '<span class="badge2 bg-'+scls+'">' +value +'</span>';
									
								}
							},
							{
								text: '<b>Perencanaan</b>',
								columns :[
									{
										text: '<b>Pagu DAK</b>',
										dataIndex: 'pagu',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 140,editable: true
									},
									{
										text: '<b>Volume</b>',
										columns :[
											{text: 'Vol',dataIndex: 'volume',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 70,editable: true},
											{text: 'Satuan',dataIndex: 'satuan',align: 'left',width: 100,editable: true},
										]
										
									},
									{
										text: '<b>Penerima Manfaat</b>',
										columns :[
											{text: 'Jml',dataIndex: 'volume2',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 70,editable: true},
											{text: 'Satuan',dataIndex: 'satuan2',align: 'left',width: 100,editable: true},
										]
										
									},
								]							
							},
														
							
							{
								text: '<b>Mekanisme Pelaksanaan</b>',
								columns :[
									{text: '<b>Mekanisme</b>',dataIndex: 'mekanisme',width: 130,editable: true,
										editor:{ xtype: 'selectfield',name: 'mekanisme',
											options: [{text: 'Swakelola',value: 'Swakelola'},{text: 'Kontraktual',value: 'Kontraktual'}]
										},
									},
									{text: '<b>Nilai</b>',dataIndex: 'nilai',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 130,editable: true},
									{text: '<b>Metode <br>Pembayaran</b>',dataIndex: 'metode',width: 130,editable: true,
										editor:{ xtype: 'selectfield',name: 'metode',
											options: [{text: 'Sekaligus',value: 'Sekaligus'},{text: 'Bertahap',value: 'Bertahap'},{text: 'Lumpsum',value: 'Lumpsum'}]
									},
							},
								]
							},
							{
								text: '<b>Realisasi</b>',
								columns :[
									{text: '<b>Keuangan (Rp.)</b>',dataIndex: 'real_k',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 130,editable: true},
									{
										text: '<b>Fisik</b>',
										columns :[
											{text: '<b>Volume</b>',dataIndex: 'real_vol',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 80,editable: true},
											{text: '<b>Fisik (%)</b>',dataIndex: 'real_fisik',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 80,editable: true},
											
										]
										
									}, 
									{text: '<b>Penerima <br>Manfaat</b>',dataIndex: 'real_manfaat',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 80,editable: true},
									{text: '<b>Kesesuaian <br>DPA dng<br> Juknis</b>',dataIndex: 'sesuai',width: 100,editable: true,
										editor:{ xtype: 'selectfield',name: 'sesuai',
											options: [{text: 'Ya',value: 'Ya'},{text: 'Tidak',value: 'Tidak'}]
										},
									},
								]
								
							}, 
							
							
							{text: '<b>Permasalahan</b>',dataIndex: 'ket_masalah',width: 200},
					],
					items : [
							{docked : 'top',xtype : 'toolbar',
								//defaults : {height : '30px',style : {fontSize : '11px'}},
								items : [
									{xtype: 'button',ui : 'soft-red',text: '',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:1},
									{xtype: 'button',ui : 'soft-blue',text: 'Laporan',iconCls: 'x-fa fa-print',margin:'0 5 0 5',handler: 'formPrint_Show',reportName:'dak_opd',mode:'opd'},
									{xtype: 'button',ui : 'soft-green',text: 'Kirim Laporan',iconCls: 'x-fa fa-check',margin:'0 5 0 5',handler: 'formKirim_Show'},
									
									{xtype: 'textfield',label: 'Pencarian',width:250,reference:'x_text_cari_dak_kegiatan_list',margin:'0 5 0 25',
										listeners: {action: 'cariKegiatan',clearicontap: 'clearCarikegiatan'}
									},
									
									
								],
					}],
					menuKeg: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							{text : 'Tambah Rincian',iconCls : 'x-fa fa-plus',handler : 'formKeg_Show',mode:'edit'}, 
							{text : 'Edit',iconCls : 'x-fa fa-edit',handler : 'formKeg_Show',mode:'add',jenis:'1'}, 
							{text : 'Hapus',iconCls : 'x-fa fa-minus',handler : 'hapusKeg',mode:'add',jenis:'2'},
						]
					},
					


				});
