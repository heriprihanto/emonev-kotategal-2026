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
   items: [{
        docked: 'top',
        items: [
				{xtype: 'textfield',margin: '0 40 0 30',label: 'Cari',width:250,reference:'x_text_cari',
					listeners: {
						action: 'onActionSearch',
						clearicontap: 'onClearIconTapSearch'
					}
				}
        ]
    }]


});
