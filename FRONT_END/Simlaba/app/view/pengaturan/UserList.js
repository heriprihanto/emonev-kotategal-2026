Ext.define('Admin.view.pengaturan.UserlList', {
	extend: 'Ext.grid.Grid',xtype:'pengaturan-user-list',
	
	header: false,fullscreen: true,striped:true,
	
	bind: {store: '{userStore}',selection: '{selectedOpd}'},
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
                {text: 'Edit',iconCls: 'x-fa fa-edit',handler: 'editUser',mode:'edit'},
                {text: 'Reset Password',iconCls: 'x-fa fa-sync',handler: 'reset'},
				{text: 'Hapus',iconCls: 'x-fa fa-minus',handler: 'hapus'}             
                ]
            }
        },
    },
    {dataIndex: 'id',text: '#id',hidden:true,width: 40},
    {dataIndex: 'username',text: 'Username / NIP',width: 180},
	{dataIndex: 'display_name',text: 'Nama',width: '20%'},
	{dataIndex: 'email',text:'Email',width: '15%',editable:true},
	{dataIndex: 'no_telp',text:'No. HP',width: '10%',editable:true},
	{dataIndex: 'namaopd',text:'OPD',width: '20%',editable:true},    
    {dataIndex: 'active',text:'Aktif',width: '80',cell : {encodeHtml : false},
        renderer : function(value, record) {
            var td = record.data;
            if (Number(td.active) == 1) {
                return '<span class="badge2 bg-success"><b>v</b></span>';
            } else {
                return '<span class="badge2 bg-danger"><b>x</b></span>';
            } 
            
        }
    },   
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
