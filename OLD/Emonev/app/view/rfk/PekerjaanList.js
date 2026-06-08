Ext.define('Admin.view.rfk.PekerjaanList', {
	//extend: 'Ext.grid.Grid',
    extend: 'Ext.grid.Tree',
    xtype:'rfk-opd-pekerjaan',
	//height:450,	maxHeight:450,
	fullscreen: true,striped:true,columnLines:true,rowLines:true,stateful: true,
	header: false,
	requires: ['Admin.plugin.CellEditing','Ext.grid.plugin.Editable'], markDirty: true,
	plugins: {cellediting: true},
	listeners: {
        //edit: 'updatePekerjaan'
        childdoubletap:'openFormRealisasi',
        edit: 'saveRealKeu'
    },
	bind: {store: '{pekerjaanStore}',selection: '{selectedPekerjaan}'},grouped: true,
    
	selectable: {rows: false,cells: true},

    //plugins: {cellediting: true},
    //platformConfig: {desktop: {plugins: {gridcellediting: true}},'!desktop': {plugins: {grideditable: true}}},
					

    cls: 'shadow',
    variableHeights: true,

    columns: [ 
     /*   
	{text: '',width: 70,ignoreExport: true,align: 'center',locked: true,
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'button',ui: 'confirm',
                text: '',iconCls: 'x-fa fa-bars',height: '26px',style: {fontSize: '11px'},
                //handler:'onEditRealisasi'
                menu: [
					//{text: 'Realisasi',iconCls: 'x-fa fa-gear',handler: 'onEditRealisasi'},
					{text: 'Data Kontrak / SPK',iconCls: 'x-fa fa-calendar-alt',handler:'formKontrak_Show'},
					{text: 'Upload Foto',iconCls: 'x-fa fa-camera',handler: 'formUpload_Show'}            
                ]
            }
        },
    },
    */
   
    {
        xtype: 'treecolumn',cell : {encodeHtml : false},
        text: '<b>Program > Kegiatan > Sub Kegiatan > Pekerjaan</b>',
        width: '40%',
        sortable: true,
        dataIndex: 'uraian',
        renderer : function(value, record) {
            var td = record.data;
            if (td.lvl == 1) {
                return '<span class="badge2 bg-danger">' + td.uraian +'</span>';
            } else if (td.lvl == 2) {
                return '<span class="badge2 bg-success">' + td.uraian +'</span>';
            } else if (td.lvl == 3) {
                return '<span class="badge2 bg-warning">' + td.uraian +'</span>';
            } else if (td.lvl == 4) {
                return td.uraian;
            }
            
        }
    },
    /*
    {
        text: 'Program / Kegiatan',hidden:true,
        dataIndex: 'progkeg',
        flex: 1,

        // Adjust the header text when grouped by this column:
        groupHeaderTpl: '{columnName}: {value:htmlEncode}'
    },
    {
        text: 'ID',width: 60,
        dataIndex: 'id',
    },
    {
        text: 'Subkegiatan',width: 350,
        dataIndex: 'nm_sub_kegiatan',
    },
    {
        text: 'Pekerjaan',width: 350,
        dataIndex: 'nama_pekerjaan',
    },
    */
    {
        dataIndex: 'anggaran',
        text: 'Pagu Anggaran',
        align: 'right',
        renderer: Ext.util.Format.numberRenderer('0,0'),width: 135
    },
	{dataIndex: 'fisik',text: 'Realisasi<br/>Fisik',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00'),width: 70,editable:true,editor:{xtype:'numberfield',maxValue:100}},
	{
        text: 'Realisasi Keuangan',
		columns: [ 
			{dataIndex: 'keuangan',text: 'Bulan Ini',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115},
            //{dataIndex: 'keuangan_total',text: 'Total',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115},
            {dataIndex: 'keuangan_total',text: 'Total',align: 'right',cell : {encodeHtml : false},width: 115,renderer : function(value, record) {
                var td = record.data;
                
                if (td.lvl == 3) {
                    if (Number(td.realisasi_fmistotal) != Number(td.keuangan_total)) {
                        return '<span class="badge2 bg-danger">' + Ext.util.Format.number(td.keuangan_total,'0,0') +'</span>';
                    } else {
                        return Ext.util.Format.number(td.keuangan_total,'0,0') ;
                    }
                }
            }},
            {dataIndex: 'realisasi_fmistotal',text: 'Total (SIPD)',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115},

		]
    },
    
    {
        text: 'Permasalahan dan Upaya Pemecahan Masalah',
		columns: [ 
			{dataIndex: 'masalah',text: 'Permasalahan',width: 170,editable:true,editor:{xtype:'textareafield'}},
			{dataIndex: 'upaya',text: 'Upaya Pemecahan Masalah',width: 170,editable:true,editor:{xtype:'textareafield'}},
		]
    },
    {
        text: 'Realisasi Keuangan (SIPD)',
		columns: [ 
            
			{dataIndex: 'rjan',text: 'Jan',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rfeb',text: 'Feb',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rmar',text: 'Mar',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rapr',text: 'Apr',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rmei',text: 'Mei',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rjun',text: 'Jun',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rjul',text: 'Jul',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'ragu',text: 'Agu',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rsep',text: 'Sep',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rokt',text: 'Okt',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rnov',text: 'Nov',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            {dataIndex: 'rdes',text: 'Des',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 115,editable:true},
            
		]
    },
    
    
	
    
    ],
    items: [
        {docked: 'top',xtype: 'toolbar',defaults:{style: {fontSize: '11px'}},
            responsiveConfig: {
                'width > 800': {hidden: false},
                'width <= 1000': {hidden: true}
            },
                items: [
                {xtype: 'button',ui : 'soft-red',shadow:true,text: '--',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:1},
                /*
                {
                    xtype: 'button',ui : 'decline',
                    text: 'Update dari Simda',iconCls: 'x-fa fa-cubes',
                    handler: 'formSimda_Show'
                },
               
                {
                    xtype: 'button',ui : 'action',
                    text: 'Mapping FMIS',iconCls: 'x-fa fa-cubes',
                    handler: 'mappingList_Show'
                },
                 */
                
                //{xtype: 'button',ui : 'soft-green',shadow:true,text:'Update dari Smart Bakeuda',handler: 'formSimda_Show',iconCls: 'x-fa fa-download',margin:'0 10 0 10'},	

                {xtype: 'button',ui : 'soft-green-2',shadow:true,text:'Update Realisasi Keuangan',handler: 'formSimda_Show',iconCls: 'x-fa fa-sync',margin:'0 10 0 10'},
                {
                    xtype: 'button',ui: 'soft-purple',shadow:true,
                    text: 'Kirim Laporan',iconCls: 'x-fa fa-paper-plane',
                    handler: 'formKirimLap_Show',margin:'0 20 0 20'
                },
                {xtype: 'spacer'},
                {xtype: 'textfield',placeholder: 'Pencarian ...',width:250,reference:'x_text_cari_rfk_pekerjaan',labelAlign:'left',
                    listeners: {action: 'cariPekerjaan',clearicontap: 'clearPekerjaan'}
                },
                {
                    xtype : 'button',margin:'0 20 0 20',shadow:true,
                    ui : 'soft-cyan',
                    text : 'Laporan',
                    iconCls : 'x-fa fa-print',handler : 'formPrint_Show',
                },
            ]},

            {docked: 'top',xtype: 'toolbar',defaults:{style: {fontSize: '11px'}},
            responsiveConfig: {
                'width > 800': {hidden: true},
                'width <= 1000': {hidden: false}
            },
                items: [
                {xtype: 'button',ui : 'soft-red',shadow:true,text: '--',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:1},
                
                {
                    xtype: 'button',ui:'soft-green',
                    text: 'menu',iconCls: 'x-fa fa-tasks',
                    menu:[
                        /*
                        {text: 'Update dari Simda',iconCls: 'x-fa fa-cubes',
                            handler: 'formSimda_Show'
                        },*/
                        {xtype: 'button',ui : 'soft-green',shadow:true,text:'Update dari Smart Bakeuda',handler: 'formSimda_Show',iconCls: 'x-fa fa-download',margin:'0 10 0 10'},	
                        
                        {text: 'Kirim Laporan',iconCls: 'x-fa fa-paper-plane',ui:'soft-purple',shadow:true,
                            handler: 'formKirimLap_Show',margin:'0 20 0 20'
                        },
                        {xtype: 'spacer'},
                        {text : 'Laporan',ui : 'soft-cyan',shadow:true,
                            iconCls : 'x-fa fa-print',handler : 'formPrint_Show',
                        },
                    ]
                },
                
            ]},
        
	]


});
