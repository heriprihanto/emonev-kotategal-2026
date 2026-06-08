Ext.define('Admin.view.pengaturan.UserRolesList', {
	extend: 'Ext.grid.Grid',xtype:'pengaturan-user-roles-list',
	id:'pengaturan-user-roles-list',
	header: false,
    //fullscreen: true,striped:true,
	
	//bind: {store: '{userStore}',selection: '{selectedOpd}'},
    store: {autoLoad: false,fields: ['kodeurusan', 'urusan'],
        proxy: {
            type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
            url: REMOTE_URL + 'pengaturan-user-roles-list',
            reader: { type: 'json' },
        }
    },
	requires: ['Admin.plugin.CellEditing','Ext.grid.plugin.Editable'], markDirty: true,
	listeners: {edit: 'updateUser'},plugins: {cellediting: true},

	cls: 'shadow',
    
	rowNumbers: {
        text: 'No.',width:60
    },

	columns: [ 
        {text: '',width: 100,ignoreExport: true,align: 'center',
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'button',
                text: '',iconCls: 'x-fa fa-bars',height: '26px',style: {fontSize: '11px'},
                //handler:'onEditRealisasi'
                menu: [
                {text: 'Hak Akses',iconCls: 'x-fa fa-edit',handler: 'editUser',mode:'edit'},
                {text: 'Reset Password',iconCls: 'x-fa fa-refresh',handler: 'reset'},
				{text: 'Hapus',iconCls: 'x-fa fa-minus',handler: 'reset'}             
                ]
            }
        },
    },
    {dataIndex: 'id',text: '#id',hidden:true,width: 40},
    {dataIndex: 'username',text: 'Username / NIP',width: 180},
	{dataIndex: 'display_name',text: 'Nama',width: '20%'},
	{dataIndex: 'email',text:'Email',width: '15%',editable:true},
	{dataIndex: 'no_telp',text:'No. HP',width: '10%',editable:true},
	    
   ],
   items: [{
            docked: 'top',
            xtype: 'toolbar',
            items: [
			
            {xtype: 'button',ui: "action",margin: '0 10 0 10',shadow: 'true',text: 'Tambah',iconCls: 'x-fa fa-plus',handler: 'formPersonel_Show',mode:'add'},
			{xtype: 'textfield',label: 'Cari',width:250,reference:'x_text_cari_opd',listeners: {action: 'onActionSearch',clearicontap: 'onClearIconTapSearch'}},
            ]
        }]


});
