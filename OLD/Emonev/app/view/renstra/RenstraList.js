Ext.define('Admin.view.renstra.RenstraList',
				{
					extend: 'Ext.grid.Tree',id:'renstra-cascading-list',
					xtype : 'renstra-list',
					fullscreen: true,striped:true,columnLines:true,margin: '0 5 0 5',
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
					bind: {store: '{renstraStore}',selection: '{selectedNode}'},
					collapsible: false,useArrows: true,
					//listeners: {childtap : 'onMenu'},
					//platformConfig: {desktop: {plugins: {gridcellediting: true}},'!desktop': {plugins: {grideditable: true}}},
					//rootVisible: true,
					columns : [
						{text: 'id', dataIndex: 'id',hidden: true},		
						{text : '<b>Aksi</b>',width: 40,cell: {tools: {menu: 'onMenu'}}},			
							{
								xtype: 'treecolumn',cell : {encodeHtml : false},
								text: '<b>Tujuan > Sasaran > Program > Kegiatan > Subkegiatan</b>',
								width: '80%',
								sortable: true,
								dataIndex: 'uraian',
								
								renderer : function(value, record) {
									var td = record.data;
									if (Number(td.lvl) === 1) {
										return '<span class="badge2 bg-danger"> '+td.kd_tujuan +': ' + td.uraian +'</span>';
									} else if (Number(td.lvl) === 2) {
										return '<span class="badge2 bg-success"> '+ td.kd_tujuan +'.'+td.kd_sasaran+': ' + td.uraian +'</span>';
									} else if (Number(td.lvl) === 3) {
										return '<span class="badge2 bg-warning"> '+td.kode_program +': ' + td.uraian +'</span>';
									} else if (Number(td.lvl) ===  4) {
										return '<span class="badge2 bg-info"> '+td.uraian+': ' + td.sasaran +'</span>';
									} 
										else if (Number(td.lvl) ===  5) {
										return td.kd_program+': ' + td.nm_program;
									} 
								}
								
							},
							
							
						],
					items : [
						{docked : 'top',xtype : 'toolbar',
								//defaults : {height : '30px',style : {fontSize : '11px'}},
								items : [
									{xtype: 'button',ui : 'soft-green',text: 'Tambah Tujuan',iconCls: 'x-fa fa-plus',margin:'0 5 0 5',
									handler: 'formTree_Show',mode:'add',mform:'tujuan'
									},
									{xtype: 'textfield',label: 'Pencarian',width:250,margin:'0 5 0 25',
										listeners: {action: 'cari',clearicontap: 'clearCari'}
									},
								],
							}		
					],
					menuL1: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							{text : 'Indikator Tujuan',handler : 'listIndikator_Show',mode:'add',mform:'tujuan'},
							{text : 'Tambah Sasaran',handler : 'formTree_Show',mode:'add',mform:'sasaran'},
							{text : 'Edit Tujuan',handler : 'formTree_Show',mode:'edit',mform:'tujuan'}, 
							{text : 'Hapus Tujuan',handler : 'hapusTree',mode:'edit',mform:'tujuan'},  
							
						]
					},
					menuL2: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							{text : 'Indikator Sasaran',handler : 'listIndikator_Show',mode:'add',mform:'sasaran'},
							{text : 'Tambah Program',handler : 'formTree_Show',mode:'add',mform:'program'},
							{text : 'Edit Sasaran',handler : 'formTree_Show',mode:'edit',mform:'sasaran'}, 
							{text : 'Hapus Sasaran',handler : 'hapusTree',mode:'edit',mform:'sasaran'},    
						]
					},
					menuL3: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							{text : 'Tambah Kegiatan',handler : 'formTree_Show',mode:'add',jenis:'1'},
							{text : 'Indikator Program',handler : 'listIndikator_Show',mode:'edit',jenis:'1'}, 
							//{text : 'Edit Tujuan',handler : 'formTree_Show',mode:'edit',jenis:'1'}, 
							{text : 'Hapus Kegiatan',handler : 'hapusTree',mode:'edit',jenis:'1'},  
						]
					},
					menuL4: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							{text : 'Tambah Program',handler : 'formTree_Show',mode:'add',jenis:'1'},
							{text : 'Indikator Sasaran',handler : 'listIndikator_Show',mode:'edit',jenis:'1'}, 
							{text : 'Edit Sasaran',handler : 'formTree_Show',mode:'edit',jenis:'1'}, 
							{text : 'Hapus Sasaran',handler : 'hapusTree',mode:'edit',jenis:'1'},  
						]
					},
					menuL5: {
						xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
						items: [
							//{text : 'Tambah Program',iconCls : 'x-fa fa-plus',handler : 'formTree_Show',mode:'add',jenis:'1'},
							{text : 'Indikator Program',handler : 'listIndikator_Show',mode:'edit',jenis:'1'}, 
							{text : 'Edit Program',handler : 'formTree_Show',mode:'edit',jenis:'1'}, 
							{text : 'Hapus Program',handler : 'hapusTree',mode:'edit',jenis:'1'},  
						]
					},
					


				});
