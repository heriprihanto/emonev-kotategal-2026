Ext.define('Admin.view.kinerja.SubpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'subpd-capkin-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	bind: {
		store: '{subPdStore}',selection: '{selectedOpd}'
	},
	
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Kode Sub PD',
			dataIndex: 'kode',
			width: 180,cell: {encodeHtml: false},
			
		},
		{
			text: 'Sub Perangkat Daerah',
			dataIndex: 'nama_pd',
			width: 400
		},
				
		
	],

	items : [
		{
			docked : 'top',
			items : [
			{
				html : '<div class="alert alert-success" id="psub-pd-sdlsldsldksldksldksldks"> </div>'
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
					{xtype: 'button',ui : 'soft-red',text: 'Kembali',shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:0}, 
					{xtype: 'button',ui : 'soft-blue',text:'Laporan',shadow:true,handler: 'formPrint_Show',iconCls: 'x-fa fa-print',margin:'0 10 0 10',style : {fontSize : '11px'},xmode:'opd'},
									
					{xtype: 'button',ui : 'soft-green',text: 'Kirim Laporan',shadow:true,iconCls: 'x-fa fa-paper-plane',margin:'0 5 0 5',handler: 'formKirim_Show',destIdx:0}, 
					{xtype: 'button',ui : 'soft-green',text: 'Verifikasi',id:'btn_verifikasi_lap_kinerjapd',shadow:true,iconCls: 'x-fa fa-check',margin:'0 5 0 5',handler: 'formVerifikasi_Show',destIdx:0,hidden:true}, 
					//{xtype: 'button',ui : 'action',text: 'Tambah',iconCls: 'x-fa fa-plus',margin:'0 5 0 5',handler: 'tambahIndikatorProgram',destIdx:1}, 
					//{xtype: 'button',ui : 'confirm',text: 'Permasalahan dan Upaya',iconCls: 'x-fa fa-minus',margin:'0 5 0 5',handler: 'openFormMasalahProgram'},	
				]
			} ],
	
	listeners: {
		childtap : 'SubOpdList_itemClick'
	}
});
