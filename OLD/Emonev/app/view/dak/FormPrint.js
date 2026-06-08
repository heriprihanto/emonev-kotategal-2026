Ext.define('Admin.view.dak.FormPrint', {
    extend: 'Ext.form.Panel',
    xtype:'dak-form-print',standardSubmit: true,

	cls: 'shadow',
    fullscreen: true,
    controller: {xclass: 'Admin.view.dak.Controller'},
    bodyPadding: 10,
    scrollable: true,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {
        labelWidth: 100,
        labelSeparator: ''
    },

    items:[
        { xtype: "numberfield", name: "pid_sub_pd",hidden:true},
        {xtype: 'textfield',name: 'puser',value:vNAMA_PENGGUNA,hidden:true},
        
        { xtype: 'selectfield',labelAlign:'top',
            name: 'report_name',margin: '0 20',required: true,
            label: 'Laporan',
            options: [
                {text: '1. Dak Fisik',value:'dak_fisik_all'},
                {text: '2. Dak Non Fisik',value:'dak_nonfisik_all'},
                {text: '3. Rekap Per OPD',value:'dak_rekap_per_opd'},
                {text: '4. Rekap Per Bidang',value:'dak_rekap_perbidang'},
                {text: '5. Rekap Pengiriman Laporan',value:'dak_rekap_kirim'},
            ],
        },
       
        {xtype: 'containerfield',required: true,defaults: {flex: 1,labelAlign:'top'},
        items: [
                { xtype: 'selectfield',
                    name: 'pbulan',margin: '0 20',
                    label: 'Bulan',value:'1',
                    options: [
                            {text:'Januari',value:'1'},
							{text:'Februari',value:'2'},
							{text:'Maret',value:'3'},
							{text:'April',value:'4'},
							{text:'Mei',value:'5'},
							{text:'Juni',value:'6'},
							{text:'Juli',value:'7'},
							{text:'Agustus',value:'8'},
							{text:'September',value:'9'},
							{text:'Oktober',value:'10'},
							{text:'November',value:'11'},
							{text:'Desember',value:'12'},
                    ],required: true,
                },
            
                { xtype: "textfield", clearable: false, label: "Tahun", name: "ptahun", value: vTAHUN,margin: '0 20' },
                
            ]
        },
           
           {xtype: 'containerfield', required: true, defaults: { flex: 1,labelAlign:'top' },
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'format', margin: '0 20',
                        label: 'Format', value: 'pdf',
                        options: [
                            { text: 'PDF', value: 'pdf' }, { text: 'XLS', value: 'xls' }, { text: 'DOCX', value: 'docx' }, { text: 'Web', value: 'html' }
                        ], required: true
                    },
    
                    { xtype: "textfield", margin: '0 20', label: "Footer", clearable: false, name: "pfooter", value: 'Tegal, ' + Ext.Date.format(new Date(), 'd F Y')}
    
                ]
            },
            
    ],
    buttons: [{text: 'Preview', ui: "soft-blue", 
			handler: function(btn) {
				var form = btn.up('formpanel');
				var reportName = form.lookupName('report_name').getValue();
				form.el.set({"target": "_blank"});
				form.el.set({"action": REPORT_URL});
				if (form.validate()) {
					form.submit();		
				} else {
					Ext.toast('Form tidak valid, mohon koreksi lagi !');
				}
				
			}, iconCls: 'x-fa fa-print'}]

});
