Ext.define('Admin.view.personel.OpdList', {
	extend: 'Ext.grid.Grid',xtype:'personel-opd-list',
	
	//height:620,
	//maxHeight:450,
	header: false,fullscreen: true,striped:true,
	plugins: [ {
		type: 'gridcolumnresizing'
	} ],
	bind: {store: '{opdStore}',selection: '{selectedOpd}'},

	listeners: {
		childtap : 'OpdList_itemClick'
	},

	cls: 'shadow',
	

	columns: [ {
        text: 'id',
        dataIndex: 'id_sub_pd',
        hidden: true
    },
    {
        text: 'Kode',
        dataIndex: 'kode',
        align: 'right',width: 200,cell: {encodeHtml: false},
        
    },
    {
        text: 'OPD',
        dataIndex: 'nama_pd',
        width: '50%'
    },

    {
        text: 'Jumlah Personel',
        dataIndex: 'jm_person',
        width: 200
    },
   
    
   ],
   items: [
    {docked: 'top',xtype : 'toolbar',bodyPadding:20,
    items : [ 
        
        {xtype:'spacer'},
        
        {xtype: 'textfield',width:250,placeholder:'Pencarian ...',
            listeners: {action: 'cariOPD',clearicontap: 'clearCariOPD'}
        },
]
}],


});
