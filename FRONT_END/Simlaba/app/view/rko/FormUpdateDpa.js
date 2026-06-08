Ext.define('Admin.view.rko.FormUpdateDpa', {
    extend: 'Ext.form.Panel',
    xtype:'rko-form-update-dpa',

	cls: 'shadow',
    fullscreen: true,
    viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	controller: {xclass: 'Admin.view.rko.Controller'},
   
    bodyPadding: 10,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelWidth: 100,
        labelSeparator: ''
    },

    items:[
        
        { xtype: "hiddenfield", name: "pid_sub_pd" },
        {xtype: 'hiddenfield',name: 'puser',value:vUSER_INFO.display_name},
        { xtype: 'selectfield',name: 'kd_tahap',margin: '0 20',label: 'Pilih Tahap DPA',
            options: [
                {text:'APBD Murni',value:'4'},
                {text:'APBD Pergeseran',value:'5'},
                {text:'APBD Perubahan',value:'6'}
            ],required: true
        },
            
    ],
    buttons: [{text: 'Update', ui: "action", 
			handler: 'updateDPA', iconCls: 'x-fa fa-download'}]

});
