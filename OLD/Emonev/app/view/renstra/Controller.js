
var rensOpd=null,xrenstraStore=null,rensItem=null;
let renstXform;
Ext.define('Admin.view.renstra.Controller', {
	extend: 'Admin.base.ViewController',

	initTabItem:function () {
		xThis=this;
	},

	init: function (grid) {
		if (Ext.os.is.Desktop) {
			Ext.getCmp('renstra-cascading-list').el.on({
				scope: this,
				contextmenu: this.onContextMenu
			});
		}
		
	},

	destroy: function () {
		this.toolMenu = Ext.destroy(this.toolMenu);
		this.callParent();
	},
	onContextMenu: function (e) {
		var grid = Ext.getCmp('renstra-cascading-list'),
			target = e.getTarget(grid.itemSelector),
			item;

		if (target) {
			e.stopEvent();

			item = Ext.getCmp(target.id);
			if (item) {
				this.updateMenu(item.getRecord(), item.el, e, 't-b?');
			}
		}
	},


	getMenu: function (lvl) {
		var menu = this.toolMenu, view = Ext.getCmp('renstra-cascading-list');
		var cMenu = null;
		if (lvl == 1) {
			cMenu = view.menuL1;
		} else if (lvl == 2) {
			cMenu = view.menuL2;
		} else if (lvl == 3) {
			cMenu = view.menuL3;
		} else if (lvl == 4) {
			cMenu = view.menuL4;
		}

		this.toolMenu = menu = Ext.create(Ext.apply({
			ownerCmp: view
		}, cMenu));
		return menu;
	},

	onMenu: function (grid, context) {
		this.getViewModel().set('record', context.record.getData());
		this.getViewModel().set('recordTree', context.record);
		var menu = this.getMenu(context.record.get('lvl'));
		menu.autoFocus = !context.event.pointerType;
		menu.showBy(context.tool.el, 'r-l?');
	},
	
	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
		
		Ext.fly('renstra-opd-title').update('<b>::: ' + records.record.data.nama_pd +' :::</b>');
		rensOpd = records.record.data;
		
		
		this.getStore('renstraStore').load({
			params: {
				ptahun : vTAHUN,
				pid_pd : rensOpd.id_pd,
				pkd_tahap:	1
			}
		});
		xrenstraStore=this.getStore('renstraStore');
		
	},

	formTree_Show: function (btn) {	
		var xmode=btn.mode;
		var mform=btn.mform;
		
		var rec =this.getViewModel().get('recordTree'); 
	
		let wid=0; let hei=0; var form_xtype=null; let judul ='';let lvl=0;

		if (xmode=='edit'){
			lvl= rec.get('lvl');
		} else {
			if (rec) {
				lvl= rec.get('lvl')+1;
			}
			
		}
			switch(mform) {
				case "tujuan":
				  wid='60%'; hei='90%'; form_xtype='renstra-form-tujuan'; judul ='Renstra PD - Tujuan';
				  break;
				case "sasaran":
				  wid='60%'; hei='90%'; form_xtype='renstra-form-sasaran'; judul ='Renstra PD - Sasaran';
				  break;
				case "program":
					wid='80%'; hei='90%'; form_xtype='renstra-form-program'; judul ='Renstra PD - Program';
				  break;
				default:
				  text = "I have never heard of that fruit...";
			}
		
		var view = this.getView();
		var dialog = Ext.create({
			xtype: 'dialog',
			maximizable: true,
			title: judul,  shadow: 'true',width:wid,height:hei,
			items:[{xtype:form_xtype}],
		});
		if (xmode=='edit'){dialog.down('formpanel').setRecord(rec);}
		dialog.show();


		switch(mform) {
			case "tujuan":
				dialog.down('formpanel').lookupName('kd_tujuan').setValue(rec.get('kd_tujuan'));
			break;
			case "sasaran":
				dialog.down('formpanel').lookupName('kd_tujuan').setValue(rec.get('kd_tujuan'));
			break;
			case "program":
				dialog.down('formpanel').lookupName('kd_tujuan').setValue(rec.get('kd_tujuan'));
				dialog.down('formpanel').lookupName('kd_sasaran').setValue(rec.get('kd_sasaran'));
				dialog.down('formpanel').lookupName('kd_tahap').setValue(rec.get('kd_tahap'));
				dialog.down('formpanel').lookupName('id_sub_pd').setValue(rec.get('id_sub_pd'));
				dialog.down('formpanel').lookupName('sasaran').setValue(rec.get('sasaran'));
				console.log(rec.parentNode.data.bidang_urusan);
				Ext.getCmp('renstra-list-program-opd').getStore().load({params:{
					kd_tujuan:rec.parentNode.data.kd_tujuan,
					id_sub_pd:rec.parentNode.data.id_sub_pd,
					kd_tahap:rec.parentNode.data.kd_tahap,
				}})
			  break;
			default:
			  text = "I have never heard of that fruit...";
		}
		
	},

	
	
	simpanData: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
						
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'renstra-simpan-data',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						//params:{'id_pd':rensOpd.id_pd},
						success: function(f,r,d) {	
							xrenstraStore.reload();
							xThis.toastPesan('success','Data Berhasil Disimpan  !!',2000);
							xDiag.destroy();
						},
						failure: function(form, o) {	
							xThis.toastPesan('error','Gagal simpan data '+o.error.message,2000);			
						}						
					});
        } else {
			xThis.toastPesan('error','Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},

	listIndikator_Show: function (btn) {
		Ext.getCmp("renstra-tab-panel-009o0934lw").setActiveItem(3);
		var rec =this.getViewModel().get('recordTree'); 
		rensItem = rec; 
		lvl= rec.get('lvl');
		let xid=0;
		mform=btn.mform;
		renstXform = mform;
		var pmdata=null;

		switch(mform) {
			case "tujuan":
				Ext.fly('detailRenstraIndikator').update('<b>:: Tujuan : ' + rec.get('uraian')+'</b>');
				//dialog.down('formpanel').lookupName('kd_tujuan').setValue(rec.get('kd_tujuan'));
				//xRpjmdIdParent = rec.get('id_tujuan');
				//xRpjmdLevel=3;
				pmdata=[Number(rec.get('id_tahap')),Number(rec.get('id_pd')),Number(rec.get('kd_tujuan'))];
			break;
			case "sasaran":
				Ext.fly('detailRenstraIndikator').update('<b>:: Sasaran : ' + rec.get('uraian')+'</b>');
			break;
			case "Apple":
			  text = "How you like them apples?";
			  break;
			default:
			  text = "I have never heard of that fruit...";
		}

		console.log(rec);
		
		this.getStore('indikatorStore').load({
			params: {
				ptahun : vTAHUN,
				mform:mform,
				params : Ext.JSON.encode(pmdata),
			}
		});
		
		
	},


	formIndikator_Show: function (btn) {	
		var xmode=btn.mode;
		var mform=renstXform;
		
		
	
		let wid=0; let hei=0; var form_xtype=null; let judul ='';let lvl=0;

			switch(mform) {
				case "tujuan":
				  wid='60%'; hei='90%'; form_xtype='renstra-form-tujuan-indikator'; judul ='Renstra PD - Indikator Tujuan';
				  break;
				case "sasaran":
				 wid='60%'; hei='90%'; form_xtype='renstra-form-sasaran-indikator'; judul ='Renstra PD - Indikator Sasaran';
				  break;
				case "Apple":
				  text = "How you like them apples?";
				  break;
				default:
				  text = "I have never heard of that fruit...";
			}
		
		var view = this.getView();
		var dialog = Ext.create({
			xtype: 'dialog',
			maximizable: true,
			title: judul,  shadow: 'true',width:wid,height:hei,
			items:[{xtype:form_xtype}],
		});

		//Ext.apply({ownerCmp: view}, dialog);
		
		if (xmode=='edit'){
			var cell = btn.up().up().up(),rec = cell.getRecord();
			dialog.down('formpanel').setRecord(rec);
			dialog.down('formpanel').lookupName('tags').setValue(this.renderTagsC(rec.get('tags')));	
			//dialog.down('formpanel').lookupName('tags').setValue(["A","B","C"]);
		}
		dialog.show();
		
		
		switch(mform) {
			case "tujuan":
				dialog.down('formpanel').lookupName('kd_tujuan').setValue(rensItem.get('kd_tujuan'));
			break;
			case "sasaran":
				dialog.down('formpanel').lookupName('kd_tujuan').setValue(rec.get('kd_tujuan'));
			break;
			case "Apple":
			  text = "How you like them apples?";
			  break;
			default:
			  text = "I have never heard of that fruit...";
		}
		
		
	},

	renderTags : function(value) { 
		const obj = value.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '').split(",");
		str='';
		for (let i = 0; i < obj.length; i++) {
			str += '<span class="label2 label-success">'+obj[i] + '</span>, ';
		}
		return str;
	},
	renderTagsC : function(value, meta) { 
		return [value.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '')]; 
	},

	ProgramList_itemClick:function (grid, records) {

		var selectedData = grid.getSelections();
		var rrIdPd = [];
		selectedData.forEach(function (rec) {
			rrIdPd.push(rec.get("kode_program"));
		});
		grid.up('formpanel').lookupName('programs').setValue(rrIdPd); 
	}

});
