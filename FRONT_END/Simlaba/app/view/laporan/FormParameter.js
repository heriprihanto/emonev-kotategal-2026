Ext.define('Admin.view.laporan.FormParameter',{
	extend: 'Ext.form.Panel',xtype:'form_parameter_laporan',
	scrollable: 'vertical',
	id:'formParameterLaporan0905k9234',
	cls: 'personnelview',bodyPadding:20,margin:'10 10 10 10',standardSubmit: true,
	requires: [],
	defaults: { labelAlign:'top',},
	//viewModel: {xclass: 'Dalev.view.laporan.ViewModel'},
	//controller: {xclass: 'Dalev.view.laporan.ViewController'},
	items: [
		{xtype: 'hiddenfield',name: 'report_name'},
		{xtype: 'hiddenfield',name: 'puser',value:vUSER_INFO.display_name},
		{xtype: 'hiddenfield',name: 'id'},
		{docked : 'top',items : [ {html : '<div class="alert alert-success" id="ppa094kfr1imwh"><b>PARAMETER<b></div>'} ]},
		
		{xtype: 'combobox',margin: '0 20',editable:false,
	    	label: 'OPD',
            placeholder: 'OPD ...',name: 'pid_sub_pd',width:400,
			queryMode: 'local',
            valueField: 'id_sub_pd',displayField: 'nama_pd',value:vUSER_INFO.id_opd,
			store: {autoLoad: true,fields: ['id', 'tag'],
				proxy: {
					type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
					url: REMOTE_URL + 'ref/ref-opd',
					reader: { type: 'json' },
				}
			},
			floatedPicker: {},forceSelection: true,striped:true,
        },
		//{ xtype: "textfield", margin: '0 20 5', label: "Periode RPJM", clearable: false, name: "periode", value: '2020 - 2024 ', width: 200,readOnly:true },
		{xtype: 'containerfield',label: '',defaults: {required: true,labelAlign:'top',},
			items: [
					{ xtype: 'selectfield',name: 'ptahun',margin: '0 20 5',width:200,label: 'Pilih Tahun',value:'1',
						options: [{text: '2025',value: '2025'},{text: '2024',value: '2024'},{text: '2023',value: '2023'},{text: '2022',value: '2022'}],required: true,value:vTAHUN
					},
					{ xtype: 'selectfield',
                                name: 'pbulan',margin: '0 20',
                                label: 'Bulan',value:'1',
                                options: [
                                  {text:'Januari',value:'1'},{text:'Februari',value:'2'},{text:'Maret',value:'3'},{text:'April',value:'4'},{text:'Mei',value:'5'},{text:'Juni',value:'6'},{text:'Juli',value:'7'},{text:'Agustus',value:'8'},{text:'September',value:'9'},{text:'Oktober',value:'10'},{text:'November',value:'11'},{text:'Desember',value:'12'}
                                ],required: true
                    },
				]
		},
		
		
		
		
        
		{xtype: 'containerfield',label: '',defaults: {required: true,labelAlign:'top',},
			items: [
					{ xtype: "textfield", margin: '0 20 5', label: "Footer", clearable: false, name: "pfooter", value: 'Tegal, ' + Ext.Date.format(new Date(), 'd F Y'), width: 300 },
					
					{xtype: 'selectfield',name: 'format', label: 'Format',labelWidth:60, value: 'html',
						options: [
							{ text: 'Web', value: 'html' },{ text: 'PDF', value: 'pdf' }, { text: 'XLS', value: 'xls' }, { text: 'DOCX', value: 'docx' },
						], required: true, width: 150
					},
					
				]
		},
		
		//{xtype:'button',text: 'Preview',margin: '10 20 25 20',ui: "confirm",handler: 'onPrintPreview',iconCls: 'x-fa fa-print'} 
		
		
		
	],
	buttons: [{text: 'Tampilkan',margin: '5 150 5 20',ui: "soft-blue",shadow:true,handler: function(btn) {
		var form = btn.up('formpanel');
		var reportName = form.lookupName('report_name').getValue();
		form.lookupName('puser').setValue(vUSER_INFO.display_name);
		form.el.set({"target": "Laporan_iframe"});
		form.el.set({"action": REPORT_URL});
		if (form.validate()) {
			form.submit();		
		} else {
			Ext.toast('Form tidak valid, mohon koreksi lagi !');
		}
		
	},iconCls: 'x-fa fa-print'} ]
});
