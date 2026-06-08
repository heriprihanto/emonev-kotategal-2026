Ext.define('Admin.view.sipd.JobList', {
	extend: 'Ext.grid.Grid',xtype:'sipd-job-list',
	
	header: false,
    //fullscreen: true,
    striped:true,
	
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
            dataIndex: 'jenis',
            text: 'Modul',align:'left',
            width: 300
        },
        {
            dataIndex: 'tgl',
            text: 'Waktu',align:'left',
            width: 250,cell: {encodeHtml: false}
        },
        {
            dataIndex: 'tgl',
            text: 'Status',align:'left',
            width: 250,cell: {encodeHtml: false}
        },
        
   ],
   items: [{
            docked: 'top',
            xtype: 'toolbar',
            items: [
               // {xtype: 'button',ui : 'soft-red',text: '',tooltip:'Tutup', shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:0}, 
                {xtype: 'button',ui: "soft-cyan",shadow:true,margin: '0 5 0 5',shadow: 'true',text: 'Tarik Data',iconCls: 'x-fa fa-plus',handler: 'formJob_Show',mode:'add'}
            ]
        }]


});
