Ext.define('Admin.view.rencanakinerja.FormIndikator', {
	extend: 'Ext.form.Panel', 
	xtype: 'rencanakinerja-form-indikator',
	id: 'rencanakinerja-form-indikator',
	jsonSubmit: true,
	scrollable: 'vertical',
	bodyPadding: 20, 
	fullscreen: true,
	autoSize: true,
	defaults: { clearable: false },
	//viewModel: {xclass: 'Admin.view.personel.ViewModel'},
	//controller: {xclass: 'Admin.view.personel.Controller'},
	viewModel: {
		type: 'default',
		data: {
			btarget: 0,
			btargetx: 0,
			bidjenis: 0,
			brtw1: 0
		},
		formulas: {
			capkin: {
				get: function (get) {

					return get('x') * 2;
				}
			}
		},
	},
	items: [
		{ xtype: "hiddenfield", name: "id" },
		{ xtype: "hiddenfield", name: "idindikator" },
		{ xtype: "hiddenfield", name: "lvl" },
		{
			xtype: 'fieldset', margin: '15 0 0 0', cls: 'fieldset-bg-primary',
			items: [
				{ xtype: "component", html:`<div id="788y-ttw45-9htwe" class="badge2 bg-danger2" style="font-size:14px !important"> </div>` },
				{ xtype: "textfield", clearable: false, label: "Indikator", name: "tolok_ukur", readOnly: true, labelAlign: 'top' },
				{ xtype: "textareafield", flex: 1, clearable: false, label: "Definisi Operasional / Metadata", name: "ket", labelAlign: 'top' },

				{
					xtype: 'containerfield', defaults: { labelAlign: 'top' }, items: [
						
						{ xtype: "textfield", flex: 1, clearable: false, label: "Satuan", name: "satuan", readOnly: true },
						
						{
							xtype: 'checkbox',label: '&nbsp;',id:'checkbox_renkin_iku',
							boxLabel: 'IKU',
							name: 'iku', margin: '0 20',
							listeners: {
								change: function(checkbox, newValue, oldValue) {
									if (newValue) {
										checkbox.setValue('1'); // Set value to '1' when checked
									} else {
										checkbox.setValue('0'); // Set value to '0' when unchecked
									}
								}
							}
						},
						{
							xtype: 'selectfield', flex: 1, listeners: { change : 'setTipeData' }, flex: 1, margin: '0 20',
							name: 'tipedata',
							label: 'Tipe Data',
							options: [
								{ text: 'Numeric', value: 0 },
								{ text: 'Text', value: 1 }
							], required: true,
						},
						/*
						{
							xtype: 'selectfield', flex: 1, flex: 1, margin: '0 20',
							name: 'idjenis',
							label: 'Jenis',
							options: [
								{ text: 'Positif', value: 1 },
								{ text: 'Negatif', value: 2 }
							], required: true,
						},
						*/
						{
							xtype: 'selectfield', flex: 1,  flex: 1, margin: '0 20',
							name: 'idformula',
							label: 'Jenis Perhitungan',
							options: [
								{ text: 'Repetitif', value: 1 },
								{ text: 'Akumulatif', value: 2 },
								{ text: 'Progres Positif', value: 3 },
								{ text: 'progres Negatif', value: 4 }
							], required: true,
						},


					]
				},
				{
					xtype: 'containerfield', defaults: { labelAlign: 'top' },
					items: [

						{ xtype: "textfield", flex: 1, clearable: false, label: "Target (Renja " + vTAHUN + ")", name: "target_renja", required: true, flex: 1 },
						{ xtype: "textfield", flex: 1, clearable: false, label: "Target (DPA " + vTAHUN + ")", name: "target", required: true, margin: '0 20', flex	: 1 },
						{ xtype: "textfield", flex: 1, clearable: false, label: "Target (Renstra " + vTAHUN + ")", name: "target_rpj", required: true, margin: '0 20' ,flex: 1},
						{ xtype: "textfield", flex: 1, clearable: false, label: "Target Akhir Renstra", name: "target_akhir", required: true, margin: '0 20', flex: 1},
					]
				},
				{xtype: 'combobox',label: 'Tagging',placeholder: 'Tagging ...', name: 'tags',queryMode: 'local',valueField: 'tag', displayField: 'tag',striped: true,multiSelect:true,
					store: {autoLoad: true,fields: ['kodeurusan', 'urusan'],
						proxy: {
							type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
							url: REMOTE_URL + 'rencanakinerja/ref-tagging',reader: { type: 'json' },
						}
					},labelAlign: 'top'
				},
			]
		},

		{
			xtype: 'fieldset', title: `<b>TARGET PER TRIWULAN TAHUN ${vTAHUN}: </b>`, margin: '15 0 0 0', cls: 'fieldset-bg-danger',
			items: [
				{
					xtype: 'containerfield', defaults: { labelAlign: 'top' }, items: [
						{ label: 'Triwulan I', name: "tg_tw1", xtype: "textfield", flex: 1, clearable: false, required: true },
						{ label: 'Triwulan II', name: "tg_tw2", xtype: "textfield", flex: 1, clearable: false, required: true, margin: '0 20' },
						{ label: 'Triwulan III', name: "tg_tw3", xtype: "textfield", flex: 1, clearable: false, required: true, margin: '0 20' },
						{ label: 'Triwulan IV', name: "tg_tw4", xtype: "textfield", flex: 1, clearable: false, required: true, margin: '0 20' },
					]
				},
			]
		},

		{xtype:'fieldset',title:'<b>REALISASI TAHUN : </b>',margin:'15 0 0 0',cls:'fieldset-bg-warning', 
            items:[
                {xtype:'containerfield',defaults: {labelAlign:'top'},items:[
                    {label:xtahun1,name:"ck1",xtype:"textfield",flex: 1,clearable : false,required:true},
                    {label:xtahun2,name:"ck2",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                    {label:xtahun3,name:"ck3",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                    {label:xtahun4,name:"ck4",xtype:"textfield",flex: 1,clearable : false,required:true,margin: '0 20'},
                ]},
            ]
        },
		



	],
	tbar: [
		{ text: 'Kembali', ui: "soft-red", shadow: true, handler: function (btn) { Ext.getCmp('tab-modulpanel-rencana-kinerja-0x8943fgtreu').setActiveItem(3); }, iconCls: 'x-fa fa-times',margin:'0 15 0 15' },
		{ xtype: 'spacer' },
		{ text: 'Simpan', ui: "soft-green", shadow: true, handler: 'simpanData', iconCls: 'x-fa fa-save',margin:'0 15 0 0' }	
	]

});
