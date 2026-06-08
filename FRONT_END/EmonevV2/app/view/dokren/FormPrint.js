Ext.define('Admin.view.dokren.FormPrint', {
    extend: 'Ext.form.Panel',
    xtype:'dokumen-form-print',standardSubmit: true,

	cls: 'shadow',
    fullscreen: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelWidth: 100,
        labelSeparator: ''
    },

    items:[
      
        { xtype: "hiddenfield", name: "report_name",value:"rekap_dokren"},
   
           {xtype: 'containerfield', required: true, defaults: { flex: 1 },
                items: [
                    {
                        xtype: 'selectfield',labelAlign:"top",
                        name: '__format', margin: '0 20',
                        label: 'Format', value: 'pdf',
                        options: [
                            { text: 'PDF', value: 'pdf' }, { text: 'XLS', value: 'xlsx' }, { text: 'DOCX', value: 'docx' }, { text: 'HTML', value: 'html' }
                        ], required: true
                    },
    
                    { xtype: "textfield",labelAlign:"top", margin: '0 20', label: "Footer", clearable: false, name: "pfooter", value: 'Tegal, ' + Ext.Date.format(new Date(), 'd F Y'), width: 300 }
    
                ]
            },
            
    ],
    buttons: [{text: 'Tampilkan', ui: "soft-cyan",shadow:true, 
        handler: function(btn) {
            var form = btn.up('formpanel');
            var reportNameStr = slugify(form.lookupName('report_name').getValue());
            //console.log(reportNameStr)
            form.el.set({"target": `_${reportNameStr}Iframe`});
            form.el.set({"action": REPORT_URL + reportNameStr});
            if (form.validate()) {
                form.submit();		
            } else {
                Ext.toast('Form tidak valid, mohon koreksi lagi !');
            }
            
        }, iconCls: 'x-fa fa-print'}]

});
