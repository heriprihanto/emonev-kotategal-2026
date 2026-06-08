Ext.define('Admin.view.dak.FormDakMap', {
    extend: 'Ext.form.Panel',
    xtype:'form-dak-kinerja-map',id:'form-dak-kinerja-map',

	cls: 'shadow',
	fullscreen: true,
    //controller: {xclass: 'Admin.view.tablet.capkin.Controller'},
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
        formulas: {
            capkin: {
                get: function(get) {

                    return get('x') * 2;
                }
            }
        },
    },


    items: [
        {xtype:"textfield",name:"geoloca",id:"geoloca_dak"},
        {xtype:"hiddenfield",name:"id"},        
        {xtype:"component",id:'cmp_map_form_dak',html:`
        <div id="map_dak" style="  z-index: 100000000;height:200px"></div>
`},
        
        
    ],
    
    bbar: [
        {xtype:'spacer'},
	    {text: 'Simpan',ui: "soft-green",handler: 'simpanData',iconCls: 'x-fa fa-save'} 
    ]

});
