Ext.define('Admin.view.rfk.GridOpdView',{
	extend: 'Ext.grid.Grid',
	xtype: 'grid-opd-rfk-view',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	/*
	bind: {
		store: '{opdStore}',selection: '{selectedOpd}'
	},
	*/
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Kode',
			dataIndex: 'id',
			align: 'right',width: 100,cell: {encodeHtml: false},
			
		},
		{
			text: 'OPD',
			dataIndex: 'nm_unit',
			width: 400
		},
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,defaults : {height : '30px',style : {fontSize : '11px'}},
		items : [ 
			{xtype: 'textfield',label: 'Cari',width:250,reference:'x_text_cari_opd_sakip',
				listeners: {action: 'cariOPD',clearicontap: 'clearOPD'}
			},

			{xtype: 'button',ui : 'confirm',text: 'Pilih Tahun',iconCls: 'x-fa fa-clock',margin:'0 5 0 5',handler: 'openFormTahapan'},
		
	
	]
    }],
	listeners: {
		//childdoubletap : 'onItemOpd_DblClick',cellselection : 'onItemCellSelected'
		childtap : 'onItemOpd_DblClick'
	}
});
