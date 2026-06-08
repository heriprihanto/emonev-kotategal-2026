Ext.define('Admin.view.rfk.FormPrint', {
    extend: 'Ext.form.Panel',
    xtype:'rfk-form-print',standardSubmit: true,

	cls: 'shadow',
    fullscreen: true,
    viewModel: {xclass: 'Admin.view.rfk.ViewModel'},
	controller: {xclass: 'Admin.view.rfk.Controller'},
   
    bodyPadding: 10,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelAlign:'top',
    },

    items:[
        
        { xtype: "numberfield", name: "pid_sub_pd",hidden:true },
        {xtype: 'hiddenfield',name: 'puser',value:vUSER_INFO.display_name},
        { xtype: 'selectfield',name: 'report_name',margin: '0 20',label: 'Pilih Dokumen',
                options: [
                    {text:'RFK 1',value:'rfk1'},{text:'RFK 2',value:'rfk2'},{text:'RFK 3',value:'rfk3'},
                ],required: true,value:'rfk1'
        },
        {xtype: 'containerfield',required: true,defaults: {flex: 1,labelAlign:'top',},
            items: [
                { xtype: "numberfield", clearable: false, label: "Tahun", name: "ptahun", value: vTAHUN, margin: '0 20' },
                { xtype: 'selectfield',
                                name: 'pbulan',margin: '0 20',
                                label: 'Bulan',value:'1',
                                options: [
                                  {text:'Januari',value:1},
                                  {text:'Februari',value:2},
                                  {text:'Maret',value:3},
                                  {text:'April',value:4},
                                  {text:'Mei',value:5},
                                  {text:'Juni',value:6},
                                  {text:'Juli',value:7},
                                  {text:'Agustus',value:8},
                                  {text:'September',value:9},
                                  {text:'Oktober',value:10},
                                  {text:'November',value:11},
                                  {text:'Desember',value:12}
                                ],required: true
                    },
            ]
        },
        
           {xtype: 'containerfield', required: true, defaults: { flex: 1 ,labelAlign:'top',},
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'format', margin: '0 20',
                        label: 'Format', value: 'pdf',
                        options: [
                            { text: 'PDF', value: 'pdf' }, { text: 'HTML', value: 'html' }, { text: 'XLS', value: 'xls' }, { text: 'DOCX', value: 'docx' }
                        ], required: true
                    },
    
                    { xtype: "textfield", margin: '0 20', label: "Footer", clearable: false, name: "pfooter", value: 'Tegal, ' + Ext.Date.format(new Date(), 'd F Y'), width: 300 }
    
                ]
            },
            
    ],
    buttons: [
        {text: 'Batal', ui: 'soft-red',shadow:true, handler: function (btn) { btn.up().up().up().destroy(); }, iconCls: 'x-fa fa-window-close'},
        { xtype: 'spacer' },
        {text: 'Tampilkan', ui: "soft-cyan",shadow:true, 
			handler: function(btn) {
				var form = btn.up('formpanel');
				var reportName = 'elaba/'+form.lookupName('report_name').getValue();
				form.el.set({"target": "Laporan_iframe"});
				form.el.set({"action": REPORT_URL});
				if (form.validate()) {
					form.submit();		
				} else {
					Ext.toast('Form tidak valid, mohon koreksi lagi !');
				}
				
			}, iconCls: 'x-fa fa-print'}]

});
