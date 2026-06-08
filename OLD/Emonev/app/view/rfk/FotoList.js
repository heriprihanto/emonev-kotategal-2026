Ext.define('Admin.view.rfk.TujuanList',
				{
					extend: 'Ext.panel.Panel',
					height: 450,layout: 'fit',
					xtype : 'rfk-foto-list',
					cls : 'personnelview',
					requires: [
						'Ext.dataview.DataView'
					],
					
					tbar: {
						items : [
                            {xtype: 'button',ui : 'decline',text: '--',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:2},
							{xtype: 'button',ui : 'action',text:'Upload Foto',handler: 'formUploadFoto_Show',iconCls: 'x-fa fa-image',margin:'0 10 0 10'},
							{xtype: 'button',ui : 'soft-red',text:'Hapus Foto',handler: 'hapusFoto',iconCls: 'x-fa fa-minus',margin:'0 10 0 10'},		
						],
					},
				
					items: [
					{xtype: 'dataview',
						inline: true,
						ui: 'default',
						reference: 'dataview',
						itemTpl: '<div class="dataview-multisort-item">' +
									'<img draggable="false" src="https://e-laba.tegalkota.go.id/api2022/assets/upload/images/{filename}" width="350"/>' +
									'<h3>{jenis}</h3>' +
								'</div>',
                        bind: {store: '{fotoStore}',selection: '{selectedPhoto}'},
                        /*
						store: {
							autoLoad: true,
							sortOnLoad: true,
							fields: ['kd_tujuan', 'tujuan'],
							proxy: {
								type: 'ajax',
								url: REMOTE_URL + 'sdgs/tujuan'
							}
						},
                        */
						listeners: {
							childtap: 'fotoClicked'
						},
					}],
					

				});
