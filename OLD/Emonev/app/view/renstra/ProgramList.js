Ext.define('Admin.view.renstra.ProgramList',{
	extend: 'Ext.grid.Grid',
	xtype: 'renstra-list-program-opd',id:'renstra-list-program-opd',
	//fullscreen: true,
	striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	//bind: {store: '{opdStore}',selection: '{selectedOpd}'},
	store: {
		autoLoad: true,
		fields: ["kodebidang","uraibidang","kodeprogram", "uraiprogram"],
		proxy: {
		  type: "rest",
		  cors: true,
		  useDefaultXhrHeader: false,
		  withCredentials: true,
		  url: REMOTE_URL + "renstra-ref-program-rpjmd",
		  reader: { type: "json" },
		},
	  },

	  selectable: {
		checkbox: true,
		mode:'simple'
	},
	
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Kode',
			dataIndex: 'kode_program',
			width: 180,cell: {encodeHtml: false},
			
		},
		{
			text: 'OPD',
			dataIndex: 'nm_program',
			width: '65%'
		},
		
		
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		items : [ 
	]
    }],
	listeners: {
		select : 'ProgramList_itemClick',
		deselect : 'ProgramList_itemClick'
	}
});
