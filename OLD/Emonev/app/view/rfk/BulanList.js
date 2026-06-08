Ext.define('Admin.view.rfk.BulanList', {
	extend: 'Ext.grid.Grid',xtype:'bulan-rfk-list',id:'bulan-rfk-list',
	//height:450,	maxHeight:450,
	fullscreen: true,striped:true,
    header: false,
    selectable: {rows: false,cells: true},
	bind: {
		store: '{lapbulananStore}',
	},

	listeners: {
        childtap : 'onItemBulandblclick'
        //cellselection:'onItemBulandblclick'
	},

	cls: 'shadow',
	

	columns: [ {
        dataIndex: 'bulan',
        text: 'No',
        width: 50
    },
    	
	{
        dataIndex: 'str_bulan',
        text: 'Bulan',
        width: 300
    },
    {
        dataIndex: 'tgl_buat',
        text: 'Tgl Buat',align:'left',formatter: 'date("d M Y H:i")',
		width: 150
    },
	{
        dataIndex: 'tgl_kirim',
        text: 'Tgl Kirim',align:'left',formatter: 'date("d M Y H:i")',
		width: 150
    },{
        dataIndex: 'tgl_verify',
        text: 'Tgl Verifikasi',align:'left',formatter: 'date("d M Y H:i")',
		width: 150
    },
    /*
	{
        width: 40,
        cell: {
            tools: {
                menu: 'onMenu'
            }
        }
    }
	*/
    
    ],
   items: [
    {docked: 'top',xtype: 'toolbar',defaults:{height: '30px',style: {fontSize: '11px'}},
        items: [
		{
            xtype: 'button',ui : 'soft-red',shadow:true,
            text: '--',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',
            handler: 'onBalik',destIdx:0,id:'btnbalik-0p0s84jdusm3o'
        },
		{
            xtype: 'button',ui : 'soft-green',shadow:true,
            text: 'Buat Laporan RFK',iconCls: 'x-fa fa-cubes',
            handler: 'onFormBuatLap'
        },
        {
            xtype: 'button',ui : 'facebook',shadow:true,
            text: 'Mapping Subkegiatan',iconCls: 'x-fa fa-cubes',margin:'0 5 0 5',
            handler: 'mappingList_Show'
        },
		{xtype: 'spacer'},
		{
            xtype : 'button',shadow:true,
            ui : 'soft-cyan',
            text : '',
            iconCls : 'x-fa fa-print',handler : 'formPrint_Show',text:'Laporan'
		},
		
		
        
        ]
    }],

    toolContextMenu: {
        xtype: 'menu',anchor: true,padding: 10,minWidth: 300,viewModel: {},
        items: [
            {text : 'Indikator Tujuan',handler : 'listIndikator_Show',mode:'add',mform:'tujuan'},
            {text : 'Tambah Sasaran',handler : 'formTree_Show',mode:'add',mform:'sasaran'},
            {text : 'Edit Tujuan',handler : 'formTree_Show',mode:'edit',mform:'tujuan'}, 
            {text : 'Hapus Tujuan',handler : 'hapusTree',mode:'edit',mform:'tujuan'},  
            
        ]
    },


});
