Ext.define('Admin.view.kinerja.FormFmis', {
    extend: 'Ext.form.Panel',
    xtype:'form-kinerja-fmis',

	cls: 'shadow',
	fullscreen: true,
    controller: {xclass: 'Admin.view.kinerja.Controller2'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',

    items: [
        {xtype: 'containerfield',required: true,defaults: {flex: 1},
        items: [
                { xtype: 'selectfield',
                    name: 'ptw',margin: '0 20',
                    label: 'Triwulan',value:'1',
                    options: [
                        {text: 'I (Satu)',value: '1'},
                        {text: 'II (Dua)',value: '2'},
                        {text: 'III (Tiga)',value: '3'},{text: 'IV (Empat)',value: '4'}
                    ],required: true,
                },
            
                { xtype: "textfield", clearable: false, label: "Tahun", name: "ptahun", value: vTAHUN, width: 300, margin: '0 5' },
                
            ]
        },
    ],
    buttons: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Kirim',ui: "soft-green",handler: 'kirimLaporan',iconCls: 'x-fa fa-paper-plane'} 
    ]

});
