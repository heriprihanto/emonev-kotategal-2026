Ext.define('Admin.view.rko.TahapList',
				{
					extend: 'Ext.grid.Grid',id:'tahapan-rko-list',
					xtype : 'tahapan-rko-list',
					fullscreen: true,striped:true,columnLines:true,rowLines:true,margin: '0 5 0 5',
					listeners: {
						childtap : 'TahapList_itemClick'
					},
					bind: {store: '{tahapanStore}',selection: '{selectedNode}'},
					collapsible: false,useArrows: true,
				
					columns : [
						{text: 'Kode', dataIndex: 'kd_tahap',width:80},		
						{text: '<b>Tahap Anggaran</b>',dataIndex: 'nm_tahap',width: 250}, 
						{text: '<b>Verifikasi</b>',width: 200,
						columns : [
							{text: 'OPD', dataIndex: 'v1',align:'center',cell: {encodeHtml: false},
							renderer:function (value,record) {
								if (parseInt(value) > 0) {return '<i class="x-fa fa-check" style="color:green"></i>';} else {return '<i class="x-fa fa-times" style="color:red"></i>';}
							}},	
							{text: 'Bag.PBJ', dataIndex: 'v2',align:'center',cell: {encodeHtml: false},
							renderer:function (value,record) {
								if (parseInt(value) > 0) {return '<i class="x-fa fa-check" style="color:green"></i>';} else {return '<i class="x-fa fa-times" style="color:red"></i>';}
							}},		
						]}, 
						
					],
					items : [
							{docked : 'top',xtype : 'toolbar',
								items : [
									{xtype: 'button',ui : 'soft-red',shadow:true,text: '',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',hidden:isUser,handler: 'onBalik',destIdx:0,id:'btnbalik-0909092kd0943'},
								],
					}],
					

				});
