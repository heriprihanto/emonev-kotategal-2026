Ext.define('Admin.view.rko.FormKegiatan', {
	extend: 'Ext.form.Panel',xtype:'rko-form-kegiatan',
	scrollable: true,
	reference: 'formRkoKegiatan',
    bodyPadding: 10,
	autoSize: true,
    defaults:{clearable : false},
    //viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	//controller: {xclass: 'Admin.view.rko.Controller'},
	items: [
		{html:'<div class="alert alert-danger" id="detailProgramKegiatanRekening"> </div>'},
			{xtype:"hiddenfield",fieldLabel:"p",name:"id_pekerjaan",value:0},
			
            {xtype: 'containerfield',layout: 'hbox',
				defaults: {clearable : false},
				items: [
					{xtype:"numberfield",label:"Nomor",name:"nomor_pekerjaan",value:0,reference:'nomor_pekerjaan',margin: '0 20 0 0',width:50},
                    {xtype:"textfield",label:"Nama Pekerjaan",name:"nama_pekerjaan",required: true,width:'100%'},
				]
			},
			
	],
	buttons: [
        {text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},destIdx:2,iconCls: 'x-fa fa-close'},
        {xtype:'spacer'},
        {text: 'Simpan',ui: "confirm",handler: 'simpanKegiatan',iconCls: 'x-fa fa-save'} 
    ]
	
	
});
