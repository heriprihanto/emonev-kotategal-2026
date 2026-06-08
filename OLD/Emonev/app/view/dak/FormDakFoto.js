Ext.define('Admin.view.dak.FormDakFoto', {
    extend: 'Ext.Panel',
    xtype:'form-dak-kinerja-foto',id:'form-dak-kinerja-foto',

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.dak.Controller'},
    bodyPadding: 20,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        //labelWidth: 100,labelSeparator: ''
    },

    viewModel: {
        type: 'default',
        data: {
            btarget: 0,
            btargetx: 0,
            bidjenis: 0,
            brtw1:0
        },
    },


    items: [
    {
        xtype: 'grid',height:400,
        columns:[
            {text: 'Data Dukung',dataIndex: 'volume2',align: 'left',width:'80%'},
			{text: 'Hapus',dataIndex: 'satuan2',align: 'left',width:100},
        ]
       
    }],
    
    tbar: [
        {xtype: 'button',ui : 'soft-red',text: 'Tutup',iconCls: 'x-fa fa-window-close',margin:'0 5 0 5',handler:function(btn){btn.up().up().up().up().up().hide();},destIdx:2}, 
        {xtype:'spacer'},
	    {text: 'Upload Data Dukung',ui: "soft-green",handler: 'formUpload_Show',iconCls: 'x-fa fa-image'} 
    ]

});
