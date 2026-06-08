Ext.define('Admin.view.rko.FormPengadaan', {
	extend: 'Ext.form.Panel',xtype:'rko-form-pekerjaan',jsonSubmit :true,
	scrollable: true,
	reference: 'formRkoPekerjaan',
    bodyPadding: 15,
	autoSize: true,
    defaults:{clearable : false,labelWidth:200,labelTextAlign:'right'},
    viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	controller: {xclass: 'Admin.view.rko.Controller'},
	 requires: [
        'Ext.field.RadioGroup'
    ],
	items: [
		//{html:'<div class="alert alert-danger" id="detailProgramKegiatanRekening"> </div>'},
			{xtype:"textfield",fieldLabel:"p",name:"id",value:'0',hidden:true},	
			{xtype:"numberfield",fieldLabel:"p",name:"id_sub_pd",value:0,hidden:true},	
			{xtype:"numberfield",fieldLabel:"p",name:"kd_tahap",value:0,hidden:true},	
			{xtype:"numberfield",fieldLabel:"p",name:"tahun",value:0,hidden:true},			
			{xtype:"numberfield",label:"Nomor :",name:"nomor_pekerjaan",width:300,required:true},
			{xtype:"textfield",label:"IDS",name:"id_subkegiatan",value:'0',hidden:true},
			
			{xtype:"textfield",label:"Nama Pekerjaan :",name:"nama_pekerjaan",required: true,width:'100%'},
			{xtype:"textfield",label:"Keterangan :",name:"ket_pekerjaan",required: true,width:'100%'},
			{xtype: 'containerfield',layout: 'hbox',
				defaults: {flex: 1,clearable : false,labelWidth:200,labelTextAlign:'right'},
				items: [
					{xtype:"numberfield",label:"Anggaran :",name:"pagu_anggaran",value:0,required: true},
					{xtype:"textfield",label:"Volume :",name:"volume",required: true},
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,labelWidth:200,labelTextAlign:'right'},
				items: [
					{
						xtype: 'radiogroup', flex:1,
						label: 'Jenis Paket :',width: '100%',labelWidth:200,labelTextAlign:'right',
						items: [
							{ label: 'Penyedia',name: 'jenis_paket',reference: 'jenis_paket1', value: 1 },
							{ label: 'Swakelola',name: 'jenis_paket',reference: 'jenis_paket2', value: 2,checked:true},
						]
					}, 
					{ xtype: 'selectfield',flex:1,required:true,
						name: 'jenis_pengadaan', label: 'Jenis Pekerjaan :',
						options: [
						  {text:'Pengadaan Barang',value:1},{text:'Jasa Konsultasi',value:2},{text:'Jasa Lainnya',value:3},{text:'Konstruksi',value:4}
						]
					},

				]
			},
			
			
			{xtype: 'containerfield',layout: 'hbox',
				defaults: {clearable : false,labelWidth:200,labelTextAlign:'right'},hidden: true,bind: {hidden: '{jenis_paket1.checked}'},
				items: [
					{ xtype: 'selectfield',flex: 1,
					  name: 'tipe_swa', label: 'Tipe Swakelola :',
					  options: [
						{text:'Tipe 1',value:1},{text:'Tipe 2',value:2},{text:'Tipe 3',value:3},{text:'Tipe 4',value:4}
					  ]
					},
					{xtype:"textfield",flex: 2,label:"Penyelenggara Swakelola :",name:"penyelenggara_swa",},
				]
			},
			{xtype: 'containerfield',layout: 'hbox',
				defaults: {flex: 1,clearable : false,labelWidth:200,labelTextAlign:'right'},hidden: true,bind: {hidden: '{jenis_paket2.checked}'},
				items: [
					
					{ xtype: 'selectfield',width:300,
					  name: 'metode', label: 'Metode Pemilihan Penyedia :',
					  options: [
						{text:'Lelang',value:1},{text:'Seleksi Umum',value:2},{text:'Lelang Sederhana',value:3},{text:'Pengadaan Langsung',value:4},{text:'Penunjukan Langsung',value:5},{text:'E-Purchasing',value:6},{text:'Swakelola',value:7}
					  ],
					},
				]
			},

			
			
			{xtype: 'containerfield',layout: 'hbox',label:'Pelaksanaan Pekerjaan :',
				defaults: {flex: 1,clearable : false,labelWidth:200,labelTextAlign:'right'},
				items: [
					{ xtype: 'selectfield',name: 'awal_pelaksanaan',margin: '0 20',label: 'Awal :',
                                options: [
                                  {text:'Januari',value:1},{text:'Februari',value:2},{text:'Maret',value:3},{text:'April',value:4},{text:'Mei',value:5},{text:'Juni',value:6},{text:'Juli',value:7},{text:'Agustus',value:8},{text:'September',value:9},{text:'Oktober',value:10},{text:'November',value:11},{text:'Desember',value:12}
                                ],required: true
                    },
					{ xtype: 'selectfield',name: 'akhir_pelaksanaan',margin: '0 20',label: 'Akhir :',
                                options: [
                                  {text:'Januari',value:1},{text:'Februari',value:2},{text:'Maret',value:3},{text:'April',value:4},{text:'Mei',value:5},{text:'Juni',value:6},{text:'Juli',value:7},{text:'Agustus',value:8},{text:'September',value:9},{text:'Oktober',value:10},{text:'November',value:11},{text:'Desember',value:12}
                                ],required: true
                    },
				]
			},

			{xtype: 'containerfield',layout: 'hbox',label:'Pemilihan Penyedia :',hidden: true,bind: {hidden: '{jenis_paket2.checked}'},
				defaults: {flex: 1,clearable : false,labelWidth:200,labelTextAlign:'right'},
				items: [
					{ xtype: 'selectfield',name: 'awal_pemilihan',margin: '0 20',label: 'Awal :',
                                options: [
                                  {text:'Januari',value:1},{text:'Februari',value:2},{text:'Maret',value:3},{text:'April',value:4},{text:'Mei',value:5},{text:'Juni',value:6},{text:'Juli',value:7},{text:'Agustus',value:8},{text:'September',value:9},{text:'Oktober',value:10},{text:'November',value:11},{text:'Desember',value:12}
                                ],
                    },
					{ xtype: 'selectfield',name: 'akhir_pemilihan',margin: '0 20',label: 'Akhir :',
                                options: [
                                  {text:'Januari',value:1},{text:'Februari',value:2},{text:'Maret',value:3},{text:'April',value:4},{text:'Mei',value:5},{text:'Juni',value:6},{text:'Juli',value:7},{text:'Agustus',value:8},{text:'September',value:9},{text:'Oktober',value:10},{text:'November',value:11},{text:'Desember',value:12}
                                ],
                    },
				]
			},
			{xtype: 'containerfield',layout: 'hbox',label:'Pelaksanaan Kontrak :',hidden: true,bind: {hidden: '{jenis_paket2.checked}'},
			defaults: {flex: 1,clearable : false,labelWidth:200,labelTextAlign:'right'},
				items: [
					{ xtype: 'selectfield',name: 'awal_kontrak',margin: '0 20',label: 'Awal :',
                                options: [
                                  {text:'Januari',value:1},{text:'Februari',value:2},{text:'Maret',value:3},{text:'April',value:4},{text:'Mei',value:5},{text:'Juni',value:6},{text:'Juli',value:7},{text:'Agustus',value:8},{text:'September',value:9},{text:'Oktober',value:10},{text:'November',value:11},{text:'Desember',value:12}
                                ],
                    },
					{ xtype: 'selectfield',name: 'akhir_kontrak',margin: '0 20',label: 'Akhir :',
                                options: [
                                  {text:'Januari',value:1},{text:'Februari',value:2},{text:'Maret',value:3},{text:'April',value:4},{text:'Mei',value:5},{text:'Juni',value:6},{text:'Juli',value:7},{text:'Agustus',value:8},{text:'September',value:9},{text:'Oktober',value:10},{text:'November',value:11},{text:'Desember',value:12}
                                ],
                    },
				]
			},
			{xtype: 'combobox',label: '<b>Tagging : </b>',placeholder: 'Tagging ...', name: 'tags',queryMode: 'local',valueField: 'tag', displayField: 'tag',
				striped: true,multiSelect:true,
				store: {autoLoad: true,fields: ['id', 'tag'],
					proxy: {
						type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
						url: REMOTE_URL + 'renstra/ref-tagging',
						reader: { type: 'json' },
					}
				},
			},
			

			{xtype:'component',html: `<h3>Lokasi Pelaksanaan : </h3>`},
			

			{xtype: 'containerfield',layout: 'hbox',
			defaults: {flex: 1,clearable : false,labelWidth:200,labelTextAlign:'right'},
				items: [
					{
						xtype: "component",flex:2,
						height: 300,
						html: `<div  id="form-maps-lokasi-rko" style="height:300px;border-radius:10px;"></div>`,
					},
					{xtype: 'fieldset',flex:1,items:[
						{xtype:"textfield",label:"Lokasi",name:"lokasi",required: true,id:"frm_rko_lokasi"},
						{xtype:"textfield",label:"Latitude",name:"lat",id:"frm_lat",readOnly:true},
                    	{xtype:"textfield",label:"Longitude",name:"lng",id:"frm_lng",readOnly:true},
					]
					}
					
				]
			},
			
			{xtype: 'containerfield',layout: 'hbox',
                defaults: {flex: 1,clearable : false,labelWidth:200,labelTextAlign:'right'},
                items: [
                    
                ]
            },

			
            
			
			
			
	],
	bbar: [
        {text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().up().destroy();},destIdx:2,iconCls: 'x-fa fa-window-close'},
        {xtype:'spacer'},
        {text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanPekerjaan',iconCls: 'x-fa fa-save'} 
    ]
	
});
