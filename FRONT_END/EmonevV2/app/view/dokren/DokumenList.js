Ext.define('Admin.view.dokren.DokumenList',{
	extend: 'Ext.grid.Grid',
	xtype: 'dokumen-dokumen-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	bind: {
		store: '{dokumenStore}',selection: '{selectedOpd}'
	},
	
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Nama Dokumen',
			dataIndex: 'dokumen',
			width: 350,cell: {encodeHtml: false},
			
		},
		{
			text: 'Berkas',
			dataIndex: 'filename_o',
			width: 250,cell: {encodeHtml: false},
			renderer : function(value, record) {
				var td = record.data;
				if (td.lng > 0) {
					return '<span class="badge2 bg-info"><a href="'+REMOTE_URL+'../files/'+td.filename+'" target="_blank">'+td.filename_o+'</a></span>';
				}
				
			}
		},
		{
			width: 70,
			hideable: false,text: 'Upload',
	
			cell: {
				tools: {
					approve: {
						iconCls: 'x-fa fa-upload green',
						handler: 'formUpload_Show'
					}
				}
			}
		}
		
	],
	items: [
		{docked: 'top',html:'<div class="alert alert-success" id="psub-dokumen-0098893893ujd92"></div>',
	},
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		items : [{xtype: 'button',ui:'soft-red',text: '',handler:'kembali',iconCls: 'x-fa fa-backward',}, ]
    }],
	listeners: {
		//childtap : 'OpdList_itemClick'
	}
});
