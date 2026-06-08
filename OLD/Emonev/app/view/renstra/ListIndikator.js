
Ext.define('Admin.view.renstra.ListIndikator',
				{
					extend : 'Ext.grid.Grid',
					xtype : 'renstra-indikator-list',id : 'renstra-indikator-list',
					cls : 'personnelview',fullscreen: true,
					requires : [],
					//rowNumbers : true,

					bind: {
						store: '{indikatorStore}',selection: '{selectedData}'
					},
					columns : [
						{
				            text: 'id',
				            dataIndex: 'id',
				            hidden: true
						},
						{
							text : '',
							width : 80,
							ignoreExport : true,
							align : 'center',
							cell : {
								xtype : 'widgetcell',
								widget : {
									xtype : 'button',
									ui : 'actiongridbutton',
									text : '',
									iconCls : 'x-fa fa-bars',
									height : '26px',
									style : {fontSize : '11px'},
									menu : [
									{text : 'Edit',iconCls : 'x-fa fa-edit',
										handler : 'formIndikator_Show',mode:'edit'
									}, 
									{text : 'Hapus',iconCls : 'x-fa fa-minus',
										handler : 'hapusTujuanIndikator'
									},
									]
								}
							},
						},
						
						{
				            text: 'No',width: '50',
				            dataIndex: 'nomor'
				        }, 
				        {
				            text: 'Uraian',
				            dataIndex: 'tolok_ukur',
				            width: '40%'
						},
						{
							text: 'Tagging',
							dataIndex: 'tags',
							width: 250,cell: {encodeHtml: false},
							renderer:'renderTags'
							/*			
							renderer: function(value, meta) { 
								if (value === 'true') { 
									return '<b><i class="fa fa-check" style="color:green"></i></b>';  
								} else {  
									return '-';
								}}*/
						},
				        {
				            text: 'Satuan',
				            dataIndex: 'satuan',
				            width: '6%'
				        },
						/*
				        {
				            text: 'Capaian n-2',
				            dataIndex: 't0',
				            width: '6%'
						},
						*/
						{
				            text: 'Target Tahun',
							columns : [
								{
									text: '2020',
									dataIndex: 't1',
									width: 120
								},
								
								{
									text: '2021',
									dataIndex: 't2',
									width: 120
								},
								{
									text: '2022',
									dataIndex: 't3',
									width: 120
								},
								{
									text: '2023',
									dataIndex: 't4',
									width: 120
								},
								{
									text: '2024',
									dataIndex: 't5',
									width: 120
								},
							]
						},
				       
				        
				        {
				            text: 'Keterangan',
				            dataIndex: 'keterangan',
				            width: '15%'
				        },
				        

					],
					items : [
						{
							docked : 'top',
							items : [ {
								html : '<div class="alert alert-success" id="detailRenstraIndikator" style="padding-top:10px;padding-bottom:10px;"> </div>'
							} ]
						},
							 {
								docked : 'top',
								xtype : 'toolbar',
								defaults : {
									height : '30px',
									style : {
										fontSize : '11px'
									}
								},
								items : [ 
									{xtype: 'button',ui : 'decline',text: 'Kembali',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: function(){Ext.getCmp("renstra-tab-panel-009o0934lw").setActiveItem(0);},destIdx:0},
									{
										xtype : 'button',
										ui : "action",
										margin : '0 20 0 20',
										text : 'Tambah',
										iconCls : 'x-fa fa-plus',
										handler : 'formIndikator_Show',mode:'add',mform:renstXform
									}]
							} ],

				});
