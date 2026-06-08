Ext.define('Admin.view.dak.BlnList',{
	extend: 'Ext.grid.Grid',
	xtype: 'bln-dak-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	bind: {
		store: '{blnStore}',selection: '{selectedOpd}'
	},
	
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Bulan',
			dataIndex: 'str_bulan',
			width: 250,cell: {encodeHtml: false},
			
		},
		{
			text: 'User',
			dataIndex: 'user_buat',
			width: 250,cell: {encodeHtml: false},
			
		},
		{
			text: 'Tgl Buat',
			dataIndex: 'tgl_buat',formatter: 'date("d M Y H:i")',
			width: 180
		},
	
		{
			text: 'Tgl Kirim',
			dataIndex: 'tgl_kirim',formatter: 'date("d M Y H:i")',
			width: 180
		},
		{
			text: 'Tgl Verifikasi',
			dataIndex: 'tgl_verify',formatter: 'date("d M Y H:i")',
			width: 180
		},
		
		
		
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		defaults : {height : '30px',style : {fontSize : '11px'}},
		items : [ 
			{xtype: 'button',ui : 'soft-red',text: 'Kembali',shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:0}, 	
			{xtype: 'button',ui : 'soft-blue',text: 'Laporan',iconCls: 'x-fa fa-print',margin:'0 5 0 5',handler: 'formPrint_Show',reportName:'dak_opd',mode:'opd'},
									
			{xtype: 'button',ui : 'soft-green',text: 'Buat Laporan',shadow:true,iconCls: 'x-fa fa-plus',margin:'0 5 0 5',handler: 'formLapbln_Show',destIdx:0}, 
	]
    }],
	listeners: {
		childtap : 'BlnList_itemClick'
	}
});
