Ext.define('Admin.view.users.UserList', {
	extend: 'Ext.grid.Grid',xtype:'users-list',
	
	header: false,fullscreen: true,striped:true,
	
	bind: {store: '{userStore}',selection: '{selectedOpd}'},


	cls: 'shadow',
    
	rowNumbers: {
        text: 'No.',width:60
    },

	columns: [ 
        {dataIndex: 'id',text: '#id',hidden:true,width: 40},
            {dataIndex: 'username',text: 'Username / NIP',width: 200},
            {dataIndex: 'display_name',text: 'Nama',width: '20%'},
            {dataIndex: 'email',text:'Email',width: '15%'},
            {dataIndex: 'no_telp',text:'HP',width: '10%'},
            {dataIndex: 'opd',text:'OPD',width: '10%'},
            {dataIndex: 'role',text:'Role',width: 120},
            {text: 'Status',dataIndex: 'role_id',align: 'center',cell: {encodeHtml: false},width: 70,renderer: function(value, meta) { 
                            if (value === 0) { 
                                return '<b><i class="fa fa-close" style="color:red"></i></b>';
                            } else {  
                                return '<b><i class="fa fa-check" style="color:green"></i></b>';  
                                
                            }}
            
            },
            {text: '',width: 100,ignoreExport: true,align: 'center',
                cell: {
                    xtype: 'widgetcell',
                    widget: {
                        xtype: 'button',ui: 'action',text: '',iconCls: 'x-fa fa-tasks',height: '26px',style: {fontSize: '11px'},
                        menu: [
                            //{text: 'Aktifasi',iconCls: 'x-fa fa-check',handler: 'onAktifasi'},
                            {text: 'Aktivasi',iconCls: 'x-fa fa-pencil',handler: 'onEdit',mode:'edit'},
                            //{text: 'Deaktivasi',iconCls: 'x-fa fa-minus',handler:'onDeaktiv'},
                            {text: 'Hapus',iconCls: 'x-fa fa-minus',handler:'onHapus'},        
                        ]
                    }
                },
            },
            
	
        
   ],
   items: [{
            docked: 'top',
            xtype: 'toolbar',
            items: [
            {xtype: 'button',ui: "action",margin: '0 10 0 10',shadow: 'true',text: 'Tambah',iconCls: 'x-fa fa-plus',handler: 'formPersonel_Show',mode:'add'}
            ]
        }]


});
