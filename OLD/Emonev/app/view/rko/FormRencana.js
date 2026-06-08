Ext.define('Admin.view.rko.FormRencana', {
	extend: 'Ext.form.Panel',xtype:'rko-form-pekerjaan-rencana',jsonSubmit :true,
	scrollable: true,
	reference: 'formRkoPekerjaanRencana',
    bodyPadding: 5,
	autoSize: true,
    defaults:{clearable : false},
    viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	controller: {xclass: 'Admin.view.rko.Controller'},
	
	items: [
			{html:'<div class="alert alert-danger" id="detailPekerjaan09088623857874"> </div>'},
			{xtype:"hiddenfield",fieldLabel:"p",name:"id",value:0},		
			{xtype: 'containerfield',layout: 'hbox',
				items: [
					{xtype: 'displayfield',labelAlign:'left',textAlign:'right',label: 'Bulan ',value: 'Target Keuangan (%)',margin: '0 20 0 0'},
					{xtype: 'displayfield',labelAlign:'left',textAlign:'right',label: '',value: 'Target Fisik (%)',margin: '0 20 0 0'},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},label:"1. Januari :",labelAlign:'left',
				items: [
					{xtype:"numberfield",labelAlign:'left',name:"jan",required: true,margin: '0 20 0 0',reference:'bln1',maxValue:100,width:80,listeners: {blur: 'auto100'},},
					{xtype:"numberfield",labelAlign:'left',name:"jan_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'},},
					
				]
			},
			
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"2. Februari",
				items: [
					{xtype:"numberfield",name:"feb",required: true,margin: '0 20 0 0',reference:'bln2',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"feb_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"3. Maret : ",
				items: [
					{xtype:"numberfield",name:"mar",required: true,margin: '0 20 0 0',reference:'bln3',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"mar_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},

			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"4. April : ",
				items: [
					{xtype:"numberfield",name:"apr",required: true,margin: '0 20 0 0',reference:'bln4',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"apr_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"5. Mei : ",
				items: [
					{xtype:"numberfield",name:"mei",required: true,margin: '0 20 0 0',reference:'bln5',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"mei_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"6. Juni : ",
				items: [
					{xtype:"numberfield",name:"jun",required: true,margin: '0 20 0 0',reference:'bln6',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"jun_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"7. Juli : ",
				items: [
					{xtype:"numberfield",name:"jul",required: true,margin: '0 20 0 0',reference:'bln7',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"jul_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"8. Agustus : ",
				items: [
					{xtype:"numberfield",name:"agu",required: true,margin: '0 20 0 0',reference:'bln8',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"agu_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"9. September : ",
				items: [
					{xtype:"numberfield",name:"sep",required: true,margin: '0 20 0 0',reference:'bln9',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"sep_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"10.Oktober : ",
				items: [
					{xtype:"numberfield",name:"okt",required: true,margin: '0 20 0 0',reference:'bln10',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"okt_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"11.November : ",
				items: [
					{xtype:"numberfield",name:"nov",required: true,margin: '0 20 0 0',reference:'bln11',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"nov_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			{xtype: 'containerfield',layout: 'hbox',defaults: {clearable : false,textAlign:'right'},labelAlign:'left',label:"12.Desember : ",
				items: [
					{xtype:"numberfield",name:"des",required: true,margin: '0 20 0 0',reference:'bln12',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					{xtype:"numberfield",labelAlign:'left',name:"des_f",required: true,margin: '0 20 0 0',maxValue:100,width:80,listeners: {blur: 'auto100'}},
					
				]
			},
			
			
			
	],
	buttons: [
        {text: 'Batal',ui: "soft-red",shadow:true, handler:function(btn){btn.up().up().up().destroy();},destIdx:2,iconCls: 'x-fa fa-window-close'},
        {xtype:'spacer'},
        {text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanPekerjaanRencana',iconCls: 'x-fa fa-save'} 
    ]
	
});
