Ext.define('Admin.view.rencanakinerja.FormPrint', {
    extend: 'Ext.form.Panel',
    xtype:'rencana-capkin-form-print',standardSubmit: true,

	cls: 'shadow',
    fullscreen: true,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {labelAlign:'top'},

    items:[
        { xtype: "numberfield", name: "kd_tahap",hidden:true,value:0},
        { xtype: "numberfield", name: "pid_sub_pd",hidden:true},
        { xtype: "numberfield", name: "pid_pd",hidden:true},
        {xtype: 'hiddenfield',name: 'puser',value:vNAMA_PENGGUNA},
        //{ xtype: "hiddenfield", name: "report_name"},
        { xtype: "numberfield", name: "ispd",hidden:true},
        { xtype: 'selectfield',
            name: 'report_name',margin: '20 20',required: true,
            label: 'Laporan',
        },
        {xtype: 'containerfield',required: true,defaults: {flex: 1,labelAlign:'top'},
        items: [
            /*
                { xtype: 'selectfield',
                    name: 'ptw',margin: '0 20',
                    label: 'Triwulan',value:'1',
                    options: [
                        {text: 'I (Satu)',value: 1},
                        {text: 'II (Dua)',value: 2},
                        {text: 'III (Tiga)',value: 3},{text: 'IV (Empat)',value: 4}
                    ],required: true,
                },
            */
                { xtype: "numberfield", clearable: false, label: "Tahun", name: "ptahun", value: vTAHUN, margin: '0 20',flex:1},
                { xtype: 'selectfield',flex:1,
                    name: 'ptahap',margin: '0 20',
                    label: 'Tahapan',value:'1',
                    options: [
                        {text: 'APBD Murni',value: 1},
                        {text: 'APBD Perubahan',value: 2}
                    ],required: true,
                },
                
            ]
        },
           
           {xtype: 'containerfield', required: true, defaults: { flex: 1 ,labelAlign:'top'},
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'format', margin: '0 20',
                        label: 'Format', value: 'pdf',
                        options: [
                            { text: 'PDF', value: 'pdf' },{ text: 'WEB', value: 'html' },  { text: 'XLS', value: 'xls' }, { text: 'DOCX', value: 'docx' }, 
                        ], required: true
                    },
    
                    { xtype: "textfield", margin: '0 20', label: "Footer", clearable: false, name: "pfooter", value: 'Tegal, ' + Ext.Date.format(new Date(), 'd F Y'), width: 300 }
    
                ]
            },
            
    ],
    buttons: [
        //{text: 'Tutup',ui: "soft-red",shadow:true, handler:function(btn){btn.up().up().up().hide();},iconCls: 'x-fa fa-window-close'},
        {xtype:'spacer'},
        {text: 'Tampilkan', ui: "soft-cyan",shadow:true, 
			handler: function(btn) {
				var form = btn.up('formpanel');
				var reportNameStr = slugify(form.lookupName('report_name').getSelection().data.text);
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
