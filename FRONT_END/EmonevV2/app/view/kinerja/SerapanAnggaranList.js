Ext.define('Admin.view.kinerja.SerapanAnggaranList',
				{
					extend : 'Ext.grid.Grid',
					xtype : 'serapan-anggaran-capkin-list',
					cls : 'personnelview',fullscreen: true,striped:true,columnLines:true,rowLines:true,
					requires: ['Admin.plugin.CellEditing'], markDirty: true,
					plugins: {cellediting: true},

					bind: {
						store: '{anggaranStore}'
					},
					listeners: {
						edit: 'simpanSubkegiatanAnggaran'
					},
					columns : [
						
						{
				            text: 'id',
				            dataIndex: 'id',
				            hidden: true
				        },
												
				        {
				            text: 'Program',
				            dataIndex: 'program',
				            width: '20%'
						},
						{
				            text: 'Kegiatan',
				            dataIndex: 'kegiatan',
				            width: '20%'
						},
						{
				            text: 'Sub Kegiatan',
				            dataIndex: 'subkegiatan',
				            width: '35%'
						},
						
						{
							text: 'Anggaran',
							columns : [
								{
									text: 'Renja '+vTAHUN,
									dataIndex: 'pagu_renja',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								
								{
									text: 'DPA '+vTAHUN,
									dataIndex: 'anggaran',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'S.d Akhir Renstra '+vTAHUN,
									dataIndex: 'pagu_akhir_renstra',editable:true,
									width: 150,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								
							]
						},
						{
				            text: 'Realisasi / Serapan Anggaran Tahun ' + vTAHUN,
							columns : [
								{
									text: 'Realisasi S.d <br/>Thn '+ (vTAHUN-1),
									dataIndex: 'pagu_capaian_lalu',editable:true,
									width: 150,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Jan',
									dataIndex: 'bln1',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Feb',
									dataIndex: 'bln2',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Mar',
									dataIndex: 'bln3',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Apr',
									dataIndex: 'bln4',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Mei',
									dataIndex: 'bln5',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Jun',
									dataIndex: 'bln6',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Jul',
									dataIndex: 'bln7',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Agu',
									dataIndex: 'bln8',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Sep',
									dataIndex: 'bln9',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Okt',
									dataIndex: 'bln10',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Nov',
									dataIndex: 'bln11',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								{
									text: 'Des',
									dataIndex: 'bln12',editable:true,
									width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
								},
								
								
							]
						},
						{
							text: 'Total',
							dataIndex: 'total_real',
							width: 120,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
						},
						{
							text: '%',
							dataIndex: 'total',
							width: 120,align: 'right',
							renderer : function(value, record) {
								var td = record.data;
								return ((td.total_real/td.anggaran)*100);
								
							}
						},
						/*
						{
							text: 'Jenis',
							dataIndex: 'tipe',
							width: 100,editable: true,clearable:false,
							editor:{ xtype: 'selectfield',
								options: [{text: 'Akumulatif',value: 1},{text: 'Non Akumulatif',value: 2}]
							},
							renderer : function(value, record) {
								var td = record.data;
								if (td.tipe == 1) {
									return 'Akumulatif';
								} else  {
									return 'Non Akumulatif';
								}
								
							}
						},
						*/
						
						/*
						{text: 'Keterangan',dataIndex: 'ket',width: 200,editable: true,editor: {xtype: 'textareafield',height:80}},
						{text: 'Permasalahan',dataIndex: 'masalah',width: 200,editable: true,editor: {xtype: 'textareafield',height:80}},
						{text: 'Upaya',dataIndex: 'upaya',width: 200,editable: true,editor: {xtype: 'textareafield',height:80}},
						*/
					],
					items : [
						{
							docked : 'top',
							xtype : 'toolbar',
							defaults : {height : '30px',style : {fontSize : '11px'}},
							items : [ 
								{xtype: 'button',ui : 'soft-red',text: 'Kembali',shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:3}, 
								{xtype: 'button',ui : 'soft-blue',text:'Update Serapan Anggaran',shadow:true,handler: 'formSimda_Show',iconCls: 'x-fa fa-sync',margin:'0 10 0 10'},
							]
						} 
					],

				});
