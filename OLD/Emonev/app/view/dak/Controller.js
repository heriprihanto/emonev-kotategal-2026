let capdak_id_sub_pd=0,capdak_current_bln=0,capdak_id_pd=0;

var xDakKegiatanStore;
var idxDakKegiatanStore;

Ext.define('Admin.view.dak.Controller', {
	extend: 'Admin.base.ViewController',

	init: function (grid) {
        if (Ext.os.is.Desktop) {
            Ext.getCmp('kegiatan-dak-list').el.on({
                scope: this,contextmenu: this.onContextMenu
            });
        }
    },
    destroy: function () {
        this.toolMenu = Ext.destroy(this.toolMenu);
        this.callParent();
	},
	onContextMenu: function (e) {
        var grid = Ext.getCmp('kegiatan-dak-list'),target = e.getTarget(grid.itemSelector),item;
        if (target) {
            e.stopEvent();
            item = Ext.getCmp(target.id);
            if (item) {this.updateMenu(item.getRecord(), item.el, e, 't-b?');}
        }
    },
	getMenu: function (lvl) {
        var menu = this.toolMenu,view = Ext.getCmp('kegiatan-dak-list');
		var cMenu = null;
		if (lvl == 3) {
			cMenu = view.menuSubKeg;
		} else if (lvl == 4) {
			cMenu = view.menuPekerj;
		} 
        this.toolMenu = menu = Ext.create(Ext.apply({ownerCmp: view},cMenu ));
        return menu;
    },

    onMenu: function (grid, context) {
		this.getViewModel().set('record', context.record.getData());
		this.getViewModel().set('recordTree', context.record);
		var menu = this.getMenu(context.record.get('lvl')); 
        menu.autoFocus = !context.event.pointerType;
        menu.showBy(context.tool.el, 'r-l?');
    },
	

	renderChecklist:function(value, record) {
		let scls='';
		if (value == 1) {
			return '<i class="x-fa fa-check" style="color:green" aria-hidden="true"></i>';
		}else if (value == 2) {
			return '<i class="x-fa fa-check" style="color:green" aria-hidden="true"></i><i class="x-fa fa-check" style="color:green" aria-hidden="true"></i>';
		} else {
			return '<i class="x-fa fa-minus" style="color:red" aria-hidden="true"></i>';
		} 
		
		
	},
	
	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
		
		//Ext.fly('psub-pd-sdlsldsldksldksldksldks').update('<b>::: ' + records.record.data.nama_pd +' :::</b>');
		Ext.fly('dt-entry__header_dak_opd').update('<i class="x-fa fa-calendar-check" aria-hidden="true"></i> Laporan Dana Alokasi Khusus (DAK) ' + records.record.data.nama_pd +'');
		
		capdak_id_sub_pd = records.record.data.id_sub_pd;
		capdak_id_pd= records.record.data.id_sub_pd;
		
		this.getStore('blnStore').load({
			params: {
				'ptahun' : vTAHUN,
				'pid_sub_pd' : capdak_id_sub_pd,
			}
		});
		xThis=this;
	},

	BlnList_itemClick:function (grid, records) {
		capdak_current_bln = records.record.data.bulan;
		if  (Number(records.record.data.lock) > 0) {return false}
		this.getView().down('tabpanel').setActiveItem(2);
		this.getStore('kegiatanStore').load({
			params: {
				'tahun' : vTAHUN,
				'id_sub_pd' : capdak_id_sub_pd,
				'bulan':capdak_current_bln
			}
		});

		xDakKegiatanStore=this.getStore('kegiatanStore');
	},
	KegiatanList_itemClick:function (grid, records) {
		
		if (records.record.data.lvl < 5) {
			//this.getView().down('tabpanel').setActiveItem(3);
			return false;
			
		}
		/*
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			maximizable: true,
			title: 'Dana Alokasi Khusus',  shadow: 'true',
			width:'95%',height:'97%',
			standardSubmit: true,
			items:[
				
				{
					xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'0 0 0 0',height:'100%',
					items: [		
						{title: '.:: Realisasi ::.' ,
						   items:[{xtype:'form-dak-kinerja'}]
						},
						
						{title: '.:: Data Kontrak ::.' ,
							items:[{xtype:'form-dak-kinerja-kontrak'}]
						},
						
						{title: '.:: Foto ::.' ,
						   items:[{xtype:'form-dak-kinerja-foto'}]
						},
						{title: '.:: Lokasi / Peta ::.' ,
						   items:[{xtype:'form-dak-kinerja-map'}]
						},
					],
				}
			],
		});
		dialog.show();

		console.log(records.record);
		var form = Ext.getCmp('form-dak-kinerja'); //dialog.down('formpanel');
			form.setRecord(records.record);

			this.updateMap(records.record);
		*/

		var view = this.getView(),
		dialogFormDAK = this.dialogFormDAK;

        if (!dialogFormDAK) {
            dialogFormDAK = Ext.apply({
                ownerCmp: view
            }, view.dialogFormDAK);

            this.dialogFormDAK = dialogFormDAK = Ext.create(dialogFormDAK);
        }

        dialogFormDAK.show();
		var form = Ext.getCmp('form-dak-kinerja'); //dialog.down('formpanel');
			form.setRecord(records.record);

			this.updateMap(records.record);
	},

	updateMap: function (rec) {
		let xlat = 0, xlng = 0;
		if (rec.get('frm_lat') == null) {
			xlat = -6.8730507; xlng = 109.1197931;
		} else {
			xlat = rec.get('frm_lat'); xlng = rec.get('frm_lng');
		}
		
		if (!rkoMap) {
			rkoMap = new L.map('map_dak', { 
				center: [xlat, xlng],
				zoom: 13
			});
		} else {
			rkoMap.remove();
			rkoMap = new L.map('map_dak', { 
				center: [xlat, xlng],
				zoom: 13
			});
		}
		
		
		var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		
		 
		rkoMap.addLayer(layer);
		rkoMap.addControl(L.control.search());
		var marker = L.marker([xlat, xlng]).addTo(rkoMap);
		marker.bindPopup('Alun Alun Kota Tegal');

		var nmarker = null;
		const markers = [];
		
		rkoMap.on("click", function (e) {
			//if (nmarker) {
			marker.remove();

			marker = new L.Marker([e.latlng.lat, e.latlng.lng]);
			marker.addTo(rkoMap);

			//Ext.getCmp("geoloca_dak").setValue(e.latlng.lat.toString());
			//Ext.getCmp("frm_lng").setValue(e.latlng.lng.toString());

			Ext.getCmp("geoloca_dak").setValue(e.latlng);
		});
		
		
		Ext.getCmp("cmp_map_form_dak").setHeight(400);
		document.getElementById("map_dak").style.height = "0px";
		document.getElementById("map_dak").style.height = "400px";


	},

	

	prevRecord: function () {
		nxRecord = xDakKegiatanStore.getAt(idxDakKegiatanStore - 1);
		//console.log('Rec :'+nxRecord+'Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		idxDakKegiatanStore = idxDakKegiatanStore - 1;
		idIndikator=nxRecord.get('idindikator');
		console.log('IDX='+idxDakKegiatanStore+', IDINDIKATOR : '+idIndikator);
		this.updateFormNRecord(idxDakKegiatanStore,idIndikator);
	},
	nextRecord: function () {		
		nxRecord = xDakKegiatanStore.getAt(idxDakKegiatanStore + 1);
		//console.log('Rec :'+nxRecord+'Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		idxDakKegiatanStore = idxDakKegiatanStore + 1;
		//
		idIndikator=nxRecord.get('idindikator');
		console.log('IDX='+idxDakKegiatanStore+', IDINDIKATOR : '+idIndikator);
		this.updateFormNRecord(idxDakKegiatanStore,idIndikator);
	},

	updateFormNRecord: function (xIndex,xidindikator) {
		
		Ext.Ajax.request({
			url: REMOTE_URL + 'kinerja/getindikator/'+xidindikator,method:'GET',
			scope: this, waitMsg: 'Load Data ... ...', 
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				vDT = JSON.parse(response.responseText);	
				var xDataIndikatorModel = Ext.create('Admin.view.kinerja.FormModel');
				xDataIndikatorModel.set(obj);
				Ext.getCmp('form-indikator-kinerja-capkin').setRecord(xDataIndikatorModel);
				//vID=xData.get('id');
				Ext.getCmp('form-indikator-kinerja-capkin').lookupName('id').setValue(xIndex);
				Ext.fly('form-capkin-opd-title-009099').update(obj.tolok_ukur);
				capk_id_indikator=obj.idindikator;
				const xtags=obj.xtags;	
				const lvl=obj.lvl;
				console.log(lvl);

				if (Number(lvl) > 6){
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln1_ps').setMaxValue(100);
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln2_ps').setMaxValue(100);
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln3_ps').setMaxValue(100);
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln4_ps').setMaxValue(100);
				} else {
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln1_ps').setMaxValue(10000);
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln2_ps').setMaxValue(10000);
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln3_ps').setMaxValue(10000);
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('ck_bln4_ps').setMaxValue(10000);
				}
				
				if (xtags !=null) {
					const xtagarr= xtags.split(','); //replace("{","[").replace("}","]");
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('tagss').setValue(xtagarr);
				} else {
					Ext.getCmp('form-indikator-kinerja-capkin').lookupName('tagss').setValue("");
				}
				
				//Ext.getCmp('form-indikator-kinerja-capkin').lookupName('tags').setValue(["Indikator Makro","Prioritas Nasional"]);
			},
	   
			failure: function(response, opts) {
				Ext.toast({ message: 'Gagal Load data!', alignment: 'tc-tc', timeout: 2000 });
			}
		});
		
		//Ext.getCmp('form-indikator-kinerja-capkin').lookupName('tags').setValueCollection('{"Satu","Dua","Tiga"}');
		
	},


	


	simpanData: function (btn) {
		var xForm = Ext.getCmp('form-dak-kinerja');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'dak/save-data',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
				success: function (f, r, d) {
					xDakKegiatanStore.reload();
					xThis.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					//xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					xThis.toastPesan('error', 'Gagal simpan data ' + o.error.message, 2000);
				}
			});
		} else {
			xThis.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	simpanKontrak: function (btn) {
		var xForm = Ext.getCmp('form-dak-kinerja-kontrak');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'dak/save-kontrak',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
				success: function (f, r, d) {
					xDakKegiatanStore.reload();
					xThis.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					//xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					xThis.toastPesan('error', 'Gagal simpan data ' + o.error.message, 2000);
				}
			});
		} else {
			xThis.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	fullScreen: function () {
		/*
		var elem = document.getElementById("tab-modulpanel-kinerja-0090908");
		if (isFS2 == 0) {
			if (elem.requestFullscreen) { elem.requestFullscreen(); } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
			//Ext.getCmp("ext-maintoolbar-1").hide(); Ext.getCmp("ext-footerview-1").hide(); isFS2 = 1;
		} else {
			if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } else if (document.msExitFullscreen) { document.msExitFullscreen(); }
			//Ext.getCmp("ext-maintoolbar-1").show(); Ext.getCmp("ext-footerview-1").show(); isFS2 = 0;
		}
		let vpHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		//this.getView().down('tabpanel').setHeight(vpHeight);
		*/
	},
	
	
	formVerifikasi_Show:function (btn) {
		
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Verifikasi laporan',  shadow: 'true',width:550,height:660,
			items:[
				{xtype:'form-kinerja-verifikasi'}
			],
			

		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');
		//form.lookupName('pbulan').setValue(mbulan);
		
	},

	

	formKirim_Show:function (btn) {
		var DTHIS =this;
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan mengirim laporan bulan ini ?',
        function (answer) {
            if (answer === 'yes'){            	
            	Ext.Ajax.request({
					url: REMOTE_URL +'dak/send-report/'+capdak_id_sub_pd+'/'+capdak_current_bln,
					method:'POST',
					success: function(response, opts) {
						var obj = Ext.decode(response.responseText);
						//console.dir(obj);
						DTHIS.toastPesan('success','Laporan Berhasil Dikirim !! ::', 2000);
						//store.reload();
						DTHIS.getView().down('tabpanel').setActiveItem(1);
						DTHIS.getStore('blnStore').reload();
					},
			   
					failure: function(response, opts) {
						DTHIS.toastPesan('error','Gagal kirim laporan, mohon koreksi lagi !', 2000);
					}
				});
			}
        });
	},

	formUpload_Show: function(grid, info) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Upload Foto',  shadow: 'true',width:350,height:260,
			items:[
				{xtype:'form-dak-formupload'}
			],
			

		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');
		//form.lookupName('idindikator').setValue(capk_id_indikator);
		//form.lookupName('bln').setValue(capdak_current_bln);
    },

	formSimda_Show: function(grid, info) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Update Serapan Anggaran',  shadow: 'true',width:350,height:260,
			items:[
				{xtype:'form-simda-capkin'}
			],
			

		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');
    },

	

	formLapbln_Show: function (btn){
		var max_id0 = parseInt(this.getMaxID(this.getStore('blnStore'), 'bulan'));
		var max_id = max_id0 + 1;
		var isLocked = 0;
		if (max_id0 > 0) {
			var r = this.getStore('blnStore').find('bulan', max_id0);
			var d = this.getStore('blnStore').getAt(r);
			isLocked = d.get('lock');
		}


		if (isLocked == 0 && max_id > 1) {
			this.toastPesan('error', 'Laporan bulan lalu belum dikirim !!', 2000);
			return false;
		}

		var dialog = Ext.create({
			xtype: 'dialog',
			title: 'Buat Laporan Dana Alokasi Khusus', shadow: 'true',
			controller: {xclass: 'Admin.view.dak.Controller'},
			responsiveConfig: {
				'width < 800': {
					width: '95%', height: '90%',
				},
				'width >= 800': {
					width: 300, height: 210,
				}
			},
			items: [
				{ xtype: 'formpanel', padding:15,jsonSubmit:true,

				
					items:[
						{xtype:'numberfield',name:'id_sub_pd',value:capdak_id_sub_pd,hidden:true},
						{xtype:'numberfield',name:'tahun',value:vTAHUN,hidden:true},
						{xtype: 'selectfield',labelAlign:'left',flex:1,label:'Bulan',name:'bulan',
							options: [
							{text:'Januari',value:1},
							{text:'Februari',value:2},
							{text:'Maret',value:3},
							{text:'April',value:4},
							{text:'Mei',value:5},
							{text:'Juni',value:6},
							{text:'Juli',value:7},
							{text:'Agustus',value:8},
							{text:'September',value:9},
							{text:'Oktober',value:10},
							{text:'November',value:11},
							{text:'Desember',value:12},
							]
						}
					],
					
				}
			],
			bbar: [
				{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().destroy();},iconCls: 'x-fa fa-window-close'}
				,{xtype:'spacer'},
				{text: 'Proses',ui: "soft-green",shadow:true,handler: 'buatLaporanbln',iconCls: 'x-fa fa-save'} 
			]
		});
		dialog.show();
		var form = dialog.down('formpanel');
		form.lookupName('bulan').setValue(max_id);
	},

	buatLaporanbln: function (btn) {
		var form = btn.up().up().down('formpanel');
		var dialog = btn.up().up();
		var bln = form.lookupName('bulan').getValue();


		if (form.validate()) {
			//Ext.toast('Form is valid!');
			form.submit({
				url: REMOTE_URL + 'dak/createlapbulanan',
				scope: this,
				method: 'POST',
				waitMsg: 'Prosesing ... ...',
				success: function (f, r, d) {
					xThis.toastPesan('success', 'Data Berhasil Disimpan !!', 2000);
					xThis.getStore('blnStore').reload(); 
					dialog.destroy();
				},
				failure: function (form, o) {
					var ermsg= JSON.parse(o.responseText);
					xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);
					dialog.destroy();
				}

			});

		} else {
			Ext.toast('Form tidak valid, mohon koreksi lagi !');
		}
	},

	formVerifikasiPD_Show: function (btn) {
		
	},

	formPrint_Show: function (btn) {	
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			//maximizable: true,
			title: 'Cetak Laporan',  shadow: 'true',
			responsiveConfig: {
				'width < 800': {
					width:'95%',height:'90%',
				},
				'width >= 800': {
					width:450,height:370,
				}
			},
			
			standardSubmit: true,
			items:[{xtype:'dak-form-print'}],
		});
		dialog.show();

		xForm=dialog.down('formpanel');
		xForm.lookupName('pid_sub_pd').setValue(capdak_id_sub_pd);
		//xForm.lookupName('report_name').setValue(btn.reportName);
		if (btn.mode=='admin') {
			xForm.lookupName('report_name').setOptions(
				[
					{text: '1. Dak Fisik',value:'dak_fisik_all'},
					{text: '2. Dak Non Fisik',value:'dak_nonfisik_all'},
					{text: '3. Rekap Per OPD',value:'dak_rekap_per_opd'},
					{text: '4. Rekap Per Bidang',value:'dak_rekap_perbidang'},
					{text: '5. Rekap Pengiriman Laporan',value:'dak_rekap_kirim'},
				]
			)
		} else {
			xForm.lookupName('report_name').setOptions(
				[
					{text: '1. Dak OPD',value:'dak_opd'}
				]
			)
		}
	},

	cariOPD: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['nama_pd'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariOPD: function () { var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },
	
	cariIndikator: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['tolok_ukur','slvl'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariIndikator: function () { var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },
	
	
});
