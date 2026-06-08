Ext.define('Admin.view.personel.PersonelList', {
	extend: 'Ext.grid.Grid',xtype:'personel-name-list',
	
	header: false,fullscreen: true,striped:true,
	
	bind: {store: '{personelStore}',selection: '{selectedOpd}'},


	cls: 'shadow',
    
	rowNumbers: {
        text: 'No.',width:60
    },

	columns: [ 
        {text: '',width: 50,ignoreExport: true,align: 'center',
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'button',ui: 'transparanbutton',arrow:false,
                text: '',iconCls: 'x-fa fa-bars',height: '26px',style: {fontSize: '11px'},
                //handler:'onEditRealisasi'
                menu: [
                {text: 'Edit',iconCls: 'x-fa fa-edit',handler: 'formPersonel_Show',mode:'edit'},
                {text: 'Hapus',iconCls: 'x-fa fa-minus',handler: 'hapusData'},
                {text: 'Reset Password',iconCls: 'x-fa fa-sync',handler: 'reset'},           
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
                {xtype: 'button',ui : 'soft-red',text: '',tooltip:'Tutup', shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:0}, 
                {xtype: 'button',ui: "soft-cyan",shadow:true,margin: '0 5 0 5',shadow: 'true',text: 'Tambah',iconCls: 'x-fa fa-plus',handler: 'formPersonel_Show',mode:'add'},
                {xtype:'spacer'},
                {xtype: 'combobox',placeholder: 'Pilih OPD ...', name: 'opds',queryMode: 'local',valueField: 'id_sub_pd', displayField: 'nama_pd',
                    striped: true,width : 450,
                    store: {autoLoad: true,fields: ['id', 'tag'],
                        proxy: {
                            type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
                            url: REMOTE_URL + 'pengguna/ref-opd',
                            reader: { type: 'json' },
                        }
                    },
                },
            ]
        }]


});
