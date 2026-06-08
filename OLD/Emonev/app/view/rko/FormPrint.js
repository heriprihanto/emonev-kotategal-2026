Ext.define('Admin.view.rko.FormPrint', {
    extend: 'Ext.form.Panel',
    xtype:'rko-form-print',standardSubmit: true,

	cls: 'shadow',
    fullscreen: true,
    viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	controller: {xclass: 'Admin.view.rko.Controller'},
   
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
        { xtype: 'selectfield',name: 'report_name',margin: '0 20',label: 'Pilih Laporan',
                options: [
                //{text:'RKO (Semua)',value:'rko_all'},
                {text:'Bagian I-III (Visi Misi, Alokasi Anggaran, Struktur Organisasi)',value:'rko1'},{text:'Bagian IV (Tabel Program dan Kegiatan yang dilaksanakan)',value:'rko4'},{text:'Bagian V (Paket Pekerjaan dan Jadwal Pelaksanaan)',value:'rko5'},{text:'Bagian VI (Rencana Pengeluaran Anggaran)',value:'rko6'},{text:'Bagian VII (Target Fisik Kegiatan yang dilaksanakan)',value:'rko7'},{text:'Bagian VIII (Penutup)',value:'rko8'}
                ],required: true
        },
        {xtype: 'containerfield',required: true,defaults: {flex: 1,labelAlign:'top'},
            items: [
                { xtype: "textfield", clearable: false, label: "Tahun", name: "ptahun", value: vTAHUN, margin: '0 20' },
                {
                    xtype: 'selectfield', margin: '0 20',name: 'tahap',
                    label: 'Anggaran', value: '1',
                    options: [
                        { text: 'Murni', value: '1' }, { text: 'Pergeseran', value: '2' },{ text: 'Perubahan', value: '3' }
                    ], required: true
                },
            ]
        },
        
           {xtype: 'containerfield', required: true, defaults: { flex: 1,labelAlign:'top' },
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'format', margin: '0 20',
                        label: 'Format', value: 'pdf',
                        options: [
                            { text: 'PDF', value: 'pdf' }, { text: 'XLS', value: 'xls' }, { text: 'DOCX', value: 'docx' }, { text: 'HTML', value: 'html' }
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
				var reportName = form.lookupName('report_name').getValue();
				form.el.set({"target": "Laporan_iframe"});
				form.el.set({"action": REPORT_URL});
				if (form.validate()) {
					form.submit();		
				} else {
					Ext.toast('Form tidak valid, mohon koreksi lagi !');
				}
				
			}, iconCls: 'x-fa fa-print'}]
});
