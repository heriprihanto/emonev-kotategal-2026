Ext.define('Admin.view.kinerja.FormSimda', {
    extend: 'Ext.form.Panel',
    reference: 'formSimdaCapkin',xtype:'form-simda-capkin',

	cls: 'shadow',
	fullscreen: true,
    controller: {xclass: 'Admin.view.kinerja.Controller'},
    bodyPadding: 10,autoSize: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelWidth: 100,labelSeparator: ''
    },

    items: [
        { xtype: 'selectfield',margin:'0 15 0 15',name: 'pbulan',
            label: 'Bulan',value:'1',
                options: [
                    {text:'1. Januari',value:'1'},
                    {text:'2. Februari',value:'2'},
                    {text:'3. Maret',value:'3'},
                    {text:'4. April',value:'4'},
                    {text:'5. Mei',value:'5'},
                    {text:'6. Juni',value:'6'},
                    {text:'7. Juli',value:'7'},
                    {text:'8. Agustus',value:'8'},
                    {text:'9. September',value:'9'},
                    {text:'10.Oktober',value:'10'},
                    {text:'11.November',value:'11'},
                    {text:'12.Desember',value:'12'}
                ],required: true
        },
        {xtype:"textfield",clearable : false,label:"Tahun",name:"ptahun",value:vTAHUN,margin:'0 15 0 15'},
    ],
    buttons: [
        //{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-close'},
        //{xtype:'spacer'},
	    {text: 'Proses',ui: "confirm",handler: 'updateSimda',iconCls: 'x-fa fa-check'} 
    ]

});
