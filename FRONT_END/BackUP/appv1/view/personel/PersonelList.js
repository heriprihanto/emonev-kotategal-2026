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
                {text: 'Upload Foto',iconCls: 'x-fa fa-images',handler: 'onUploadForm'}             
                ]
            }
        },
    },
        {
            dataIndex: 'id',
            text: '#kdUrusan',hidden:true,
            width: 40
        },
        
        {
            dataIndex: 'nip',
            text: 'NIP',align:'left',
            width: 200,cell: {encodeHtml: false},
            renderer: function (value, record) {
                    var x=record.data;
                    return '<b>'+value+'</b>'
                }
        },
        {
            dataIndex: 'nama',
            text: 'Nama',align:'left',
            width: '45%',cell: {encodeHtml: false},
            renderer: function (value, record) {
                    var x=record.data;
                    return '<b>'+value+'</b>'
                }
        },
        {
            dataIndex: 'jabatan',
            text: 'Jabatan',align:'left',
            width: '300',cell: {encodeHtml: false}
        },
        
   ],
   items: [{
            docked: 'top',
            xtype: 'toolbar',
            items: [
                {xtype: 'button',ui : 'soft-red',text: '',tooltip:'Tutup', shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:0}, 
                {xtype: 'button',ui: "soft-cyan",shadow:true,margin: '0 5 0 5',shadow: 'true',text: 'Tambah',iconCls: 'x-fa fa-plus',handler: 'formPersonel_Show',mode:'add'}
            ]
        }]


});
