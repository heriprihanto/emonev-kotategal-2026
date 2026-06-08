Ext.define('Admin.view.renstra.FormTujuanIndikator', {
	extend: 'Ext.form.Panel',xtype:'renstra-form-tujuan-indikator',
	scrollable: 'vertical',
	//reference: 'formElemenDataPerencanaan',
	controller: {xclass: 'Admin.view.renstra.Controller'},
    bodyPadding: 20,fullscreen:true,
	autoSize: true,
	defaults:{clearable : false},
	items: [
	
			{xtype:"hiddenfield",label:"p",name:"id",value:0},
			{xtype:"hiddenfield",label:"p",name:"kd_tujuan",value:0},
			{xtype:"hiddenfield",label:"p",name:"mform",value:'indikatortujuan'},
			{xtype: 'combobox',required:true,label: '<b>Indikator : </b>',placeholder: 'Indikator ...', name: 'id_indikator',queryMode: 'local',valueField: 'id', displayField: 'tolok_ukur',
						striped: true,
						store: {autoLoad: true,fields: ['kodeurusan', 'urusan'],
							proxy: {
								type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
								url: REMOTE_URL + 'ref-indikator',
								reader: { type: 'json' },
							}
						},
			},
			{xtype: 'textfield',name: 'indikator',label: '<b>Indikator</b>',required:true},
			
			{xtype:'containerfield',defaults:{clearable : false},
				items:[
					{xtype: 'numberfield',name: 'nomor',label: '<b>Nomor</b>',required:true,width:120},
					{xtype: 'textfield',name: 'satuan',label: '<b>Satuan </b>',margin:'0 0 0 20',required:true,width:200},
					{xtype: 'selectfield',name: 'status',label: '<b>Status</b>', required:true,margin:'0 0 0 20',width:200,
							options: [
								{text: 'Positif',value: '1'}, 
								{text: 'Negatif',value: '2'},
								{text: 'Kumulatif',value: '0'},
							]
					},
				]
			},
			
			{xtype: 'textareafield',name: 'ket',label: '<b>Keterangan</b>',required:true},
			{xtype: 'textareafield',name: 'formula',label: '<b>Formula</b>',required:true},
			{xtype: 'combobox',required:true,label: '<b>Tagging : </b>',placeholder: 'Tagging ...', name: 'tags',queryMode: 'local',valueField: 'tag', displayField: 'tag',
						striped: true,multiSelect:true,
						store: {autoLoad: true,fields: ['kodeurusan', 'urusan'],
							proxy: {
								type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
								url: REMOTE_URL + 'ref-tagging',
								reader: { type: 'json' },
							}
						},
			},
			{xtype:"textfield",label:"Kondisi Awal",name:"t0"},
			{xtype:"textfield",label:"Target "+xtahun1,name:"t1"},
			{xtype:"textfield",label:"Target "+xtahun2,name:"t2"},
			{xtype:"textfield",label:"Target 2022",name:"t3"},
			{xtype:"textfield",label:"Target 2023",name:"t4"},
			{xtype:"textfield",label:"Target 2024",name:"t5"},
			
			
		
	],
	buttons: [
	{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'}
	,{xtype:'spacer'}
	,{text: 'Simpan',ui: "action",handler: 'simpanData',iconCls: 'x-fa fa-save'} 
]
	
});
