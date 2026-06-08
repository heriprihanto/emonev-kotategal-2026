Ext.define('Admin.view.renstra.FormTujuan', {
	extend: 'Ext.form.Panel',xtype:'renstra-form-tujuan',
	scrollable: 'vertical',
	//reference: 'formElemenDataPerencanaan',
	controller: {xclass: 'Admin.view.renstra.Controller'},
    bodyPadding: 20,fullscreen:true,
	autoSize: true,
	defaults:{clearable : false},
	items: [
	
			{xtype:"textfield",label:"tahap",name:"kd_tahap",value:0},
			{xtype:"textfield",label:"id",name:"id",value:''},
			{xtype:"textfield",label:"pd",name:"id_sub_pd",value:0},

			
			{xtype:"hiddenfield",fieldLabel:"p",name:"mform",value:'tujuan'},
			{xtype: 'numberfield',name: 'kd_tujuan',label: '<b>Nomor</b>',required:true,width:250},
			{xtype: 'textareafield',name: 'tujuan',label: '<b>Tujuan</b>',required:true},
			{xtype: 'combobox',required:true,label: '<b>Sasaran RPJMD : </b>',placeholder: 'Sasaran RPJMD ...', queryMode: 'local',valueField: 'kode', displayField: 'sasaran',
						striped: true,name: 'kd_sasaran_rpjmd',
						store: {autoLoad: true,fields: ['kode', 'sasaran'],
							proxy: {
								type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
								url: REMOTE_URL + 'renstra-sasaran-rpjmd',
								reader: { type: 'json' },
							}
						},
			},
			//{xtype: 'numberfield',name: 'kd_tujuan_rpjmd',label: '<b>Nomor</b>'},
			//{xtype: 'numberfield',name: 'kd_sasaran_rpjmd',label: '<b>Nomor</b>'},
			{xtype: 'combobox',required:true,label: '<b>Bidang Urusan : </b>',placeholder: 'Bidang Urusan ...', name: 'bidang_urusan',queryMode: 'local',valueField: 'kode_bidang_urusan', displayField: 'bidang_urusan_alias',
					striped: true,multiSelect:true,
					store: {autoLoad: true,fields: ['id', 'bidang_urusan_alias'],
						proxy: {
							type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
							url: REMOTE_URL + 'renstra-ref-bidang-urusan',
							reader: { type: 'json' },
						}
					},
			},
			{xtype: 'textareafield',name: 'keterangan',required:true,label: 'Keterangan'},

		
	],
	buttons: [
	{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'}
	,{xtype:'spacer'}
	,{text: 'Simpan',ui: "action",handler: 'simpanData',iconCls: 'x-fa fa-save'} 
]
	
});
