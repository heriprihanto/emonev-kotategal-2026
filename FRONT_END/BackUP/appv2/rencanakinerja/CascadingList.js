Ext.define('Admin.view.rencanakinerja.CascadingList',
				{
					extend: 'Ext.tab.Panel',
					xtype : 'rencanakinerja-cascading-list',
					id : 'rencanakinerja-tab-cascading-list-idx',
					height: '100%',

					defaults: {
						scrollable: true,
						userSelectable: {
							bodyElement: true
						}
					},
					//cls: 'custom-tab',
					border :true,

					items: [
						{
							title: 'Tujuan / Sasaran',height : '100%',
							items: [{xtype:'rencanakinerja-tujuansasaran-list'}],
						}, 
						{
							title: 'Program / Kegiatan / Subkegiatan',height : '100%',
							items: [{xtype:'rencanakinerja-programkegiatansubkegiatan-list'}],
						},
						
					]
					
				});
