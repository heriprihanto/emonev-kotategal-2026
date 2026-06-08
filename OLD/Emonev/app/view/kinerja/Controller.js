let capk_id_pd=0,capk_id_sub_pd=0,capk_id_indikator=0,capk_indikator_lvl=0,
capk_tahun=vTAHUN,capk_nm_pd='',capk_nm_sub_pd='',
capk_ref_kd_urusan=0,capk_kd_tahap=1,capk_id_tahap=0,capk_id_subkegiatan=0,capk_id_program=0,
capk_ref_kd_bidang=0,capk_v1=0,capk_v2=0,capk_current_tw = 0,capk_current_tw_locked=0;

var xcapkintahap=null,xcapkinStore=null,xThis=null;

let isFSC=0;
var idxIndikatorStore;var xIndikatorStore;var idxIndikatorKotaStore;var xIndikatorKotaStore;
const heightTabpanel2=PanelCompHeight-10;
//var xDataIndikatorModel;

Ext.define('Admin.view.kinerja.Controller', {
	extend: 'Admin.base.ViewController',

	init: function() {
        console.log("KINERJA INIT");
		//xDataIndikatorModel = Ext.create('Admin.view.kinerja.FormModel');
    },

	destroy: function() {
        Ext.destroy(this.dialogUpload);
        this.callParent();
    },

    onCancel: function(button) {
        console.log('onCancel');
        this.dialogUpload.hide();
    },

	simpanSubkegiatanAnggaran: function (sender, record) {
		//this.editGridCell(arguments[0].columnIndex,REMOTE_URL + 'kinerja/update-subkegiatan-anggaran',arguments[0].record.data,this.getStore('anggaranStore'));
		const colIdx=arguments[0].columnIndex;
		Ext.Ajax.request({
			url: REMOTE_URL+'kinerja/update-realisasi-anggaran/'+colIdx,method:'POST',
			//params: {'method':'save',,
			jsonData:arguments[0].record.data,
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				xThis.toastPesanR('success','Data Berhasil Disimpan !! ::', 2000);
			},
	   
			failure: function(response, opts) {
				xThis.toastPesanR('error','Gagal simpan data, mohon koreksi lagi !',2000);
				 
			}
		});
	},

	setTipeData:function () {
		var tform= Ext.getCmp('form-indikator-kinerja-capkin');
		const ptarget = tform.lookupName('tipedata').getValue();
		if (Number(ptarget) ==0) {
			tform.lookupName('ck_tw1').setInputType('number');
			tform.lookupName('ck_tw2').setInputType('number');
			tform.lookupName('ck_tw3').setInputType('number');
			tform.lookupName('ck_tw4').setInputType('number');
			tform.lookupName('target').setInputType('number');
			tform.lookupName('target_akhir').setInputType('number');
			tform.lookupName('target_renja').setInputType('number');
			tform.lookupName('target_rpj').setInputType('number');
			tform.lookupName('ck1').setInputType('number');
			tform.lookupName('ck2').setInputType('number');
			tform.lookupName('ck3').setInputType('number');
			tform.lookupName('ck4').setInputType('number');
			tform.lookupName('ck5').setInputType('number');
			
		} else {
			tform.lookupName('ck_tw1').setInputType('text');
			tform.lookupName('ck_tw2').setInputType('text');
			tform.lookupName('ck_tw3').setInputType('text');
			tform.lookupName('ck_tw4').setInputType('text');
			tform.lookupName('target').setInputType('text');
			tform.lookupName('target_akhir').setInputType('text');
			tform.lookupName('target_renja').setInputType('text');
			tform.lookupName('target_rpj').setInputType('text');
			tform.lookupName('ck1').setInputType('text');
			tform.lookupName('ck2').setInputType('text');
			tform.lookupName('ck3').setInputType('text');
			tform.lookupName('ck4').setInputType('text');
			tform.lookupName('ck5').setInputType('text');
		}

		//console.log(tform.lookupName('ck_tw2').getDataType())
	},

	//hitungCapkin:function (th,nv,ov,eo) {
	hitungCapkin:function (th,ee,eo) {
		console.log(th.name);
		var tform= Ext.getCmp('form-indikator-kinerja-capkin');
		const ptarget = tform.lookupName('target').getValue();
		const ptargetx = tform.lookupName('target_akhir').getValue();
		const pidjenis = tform.lookupName('idjenis').getValue();
		if (capk_current_tw==1) {
			const nv = tform.lookupName('ck_tw1').getValue();
			tform.lookupName('ck_tw1_ps').setValue(this.hitungCapkinBy(nv,ptarget,pidjenis));
			tform.lookupName('ck_tw1_psx').setValue(this.hitungCapkinBy(nv,ptargetx,pidjenis));
			tform.lookupName('ck5').setValue(nv);
		} else if (capk_current_tw==2) {
			const nv = tform.lookupName('ck_tw2').getValue();
			tform.lookupName('ck_tw2_ps').setValue(this.hitungCapkinBy(nv,ptarget,pidjenis));
			tform.lookupName('ck_tw2_psx').setValue(this.hitungCapkinBy(nv,ptargetx,pidjenis));
			tform.lookupName('ck5').setValue(nv);
		} else if (capk_current_tw==3) {
			const nv = tform.lookupName('ck_tw3').getValue();
			tform.lookupName('ck_tw3_ps').setValue(this.hitungCapkinBy(nv,ptarget,pidjenis));
			tform.lookupName('ck_tw3_psx').setValue(this.hitungCapkinBy(nv,ptargetx,pidjenis));
			tform.lookupName('ck5').setValue(nv);
		} else if (capk_current_tw==4) {
			const nv = tform.lookupName('ck_tw4').getValue();
			tform.lookupName('ck_tw4_ps').setValue(this.hitungCapkinBy(nv,ptarget,pidjenis));
			tform.lookupName('ck_tw4_psx').setValue(this.hitungCapkinBy(nv,ptargetx,pidjenis));
			tform.lookupName('ck5').setValue(nv);
		} 
		
	},

	hitungCapkinBy:function (tv,tg,jen) {
		if (jen==1){
			return ((Number(tv)/Number(tg))*100);
		}else {
			return ((Number(tg)-(Number(tv)-Number(tg)))/Number(tg))*100;
		}
	},


	initTabItem:function () {
		if (isAdmin == false) {
			this.getView().down('tabpanel').setActiveItem(1);
			Ext.fly('nama-opd-rfk-module').update('<b>::: ' + vNAMA_OPD +' :::</b>');
			capk_id_opd = vUSER_INFO.id_opd;
			capk_kd_urusan = vUSER_INFO.kd_urusan;
			capk_kd_bidang = vUSER_INFO.kd_bidang;
			capk_kd_unit = vUSER_INFO.kd_unit;
			capk_kd_sub = vUSER_INFO.kd_sub;
			
			this.getStore('kegiatanStore').load({
				params: {
					ptahun : vTAHUN,
					pid_sub_pd : capk_id_opd,
					pkd_tahap:	capk_kd_tahap
				}
			});
			xcapkinStore=this.getStore('kegiatanStore');
		}

		xThis=this;
	},

	renderChecklist:function(value, record) {
		let scls='';
		if (value == 1) {
			return '<i class="x-fa fa-check" style="color:orange" aria-hidden="true"></i>';
		}else if (value == 2) {
			return '<i class="x-fa fa-check" style="color:green" aria-hidden="true"></i><i class="x-fa fa-check" style="color:green" aria-hidden="true"></i>';
		} else {
			return '<i class="x-fa fa-minus" style="color:red" aria-hidden="true"></i>';
		} 
		
		
	},

	
	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
		
		//Ext.fly('psub-pd-sdlsldsldksldksldksldks').update('<b>::: ' + records.record.data.nama_pd +' :::</b>');
		Ext.fly('dt-entry__header_capkin_opd').update('<i class="x-fa fa-calendar-check" aria-hidden="true"></i> Capaian Kinerja ' + records.record.data.nama_pd +'');
		
		capk_id_pd = records.record.data.id_pd;
		capk_nm_pd = records.record.data.nama_pd;
		
		/*
		capk_kd_urusan = records.record.data.kd_urusan;
		capk_kd_bidang = records.record.data.kd_bidang;
		capk_kd_unit = records.record.data.kd_unit;
		capk_kd_sub = records.record.data.kd_sub;
		*/
		
		this.getStore('subPdStore').load({
			params: {
				ptahun : vTAHUN,
				pid_pd : capk_id_pd,
				//pkd_tahap:	capk_kd_tahap
			}
		});
		xcapkinStore=this.getStore('kegiatanStore');
		this.getStore('twStore').load({
			params: {
				ptahun : vTAHUN,
				pid_pd : capk_id_pd,
				//pkd_tahap:	capk_kd_tahap
			}
		});
		xThis=this;
	},

	TwList_itemClick:function (grid, records) {
		capk_current_tw = records.record.data.tw;
		capk_current_tw_locked = Number(records.record.data.locked);
		if (ROLE_ID_APP > 3) {
			Ext.getCmp('btn_verifikasi_lap_kinerjapd').setHidden(true)
		} else {
			Ext.getCmp('btn_verifikasi_lap_kinerjapd').setHidden(false)
		}
		if (records.record.data.locked==1 && ROLE_ID_APP > 3) {
			return false;
		} else {

			this.getView().down('tabpanel').setActiveItem(2);
			var tform = Ext.getCmp('form-indikator-kinerja-capkin');
			let stateReq1=false,stateDisable1=false,stateReq2=false,stateDisable2=false,stateReq3=false,stateDisable3=false,stateReq4=false,stateDisable4=false;
			
			if (capk_current_tw==1){
				stateReq1=true;stateDisable1=false;
				stateReq2=false;stateDisable2=true;
				stateReq3=false;stateDisable3=true;
				stateReq4=false;stateDisable4=true;	
			} else if (capk_current_tw==2){
				stateReq1=false;stateDisable1=true;
				stateReq2=true;stateDisable2=false;
				stateReq3=false;stateDisable3=true;
				stateReq4=false;stateDisable4=true;	
			} else if (capk_current_tw==3){
				stateReq1=false;stateDisable1=true;
				stateReq2=false;stateDisable2=true;
				stateReq3=true;stateDisable3=false;
				stateReq4=false;stateDisable4=true;	
			} else if (capk_current_tw==4){
				stateReq1=false;stateDisable1=true;
				stateReq2=false;stateDisable2=true;
				stateReq3=false;stateDisable3=true;
				stateReq4=true;stateDisable4=false;	
			}

			tform.lookupName('ck_tw1').setRequired(stateReq1);
			tform.lookupName('ck_tw1_ps').setRequired(stateReq1);
			tform.lookupName('ck_tw1_psx').setRequired(stateReq1);
			
			tform.lookupName('ck_tw2').setRequired(stateReq2);
			tform.lookupName('ck_tw2_ps').setRequired(stateReq2);
			tform.lookupName('ck_tw2_psx').setRequired(stateReq2);

			tform.lookupName('ck_tw3').setRequired(stateReq3);
			tform.lookupName('ck_tw3_ps').setRequired(stateReq3);
			tform.lookupName('ck_tw3_psx').setRequired(stateReq3);

			tform.lookupName('ck_tw4').setRequired(stateReq4);
			tform.lookupName('ck_tw4_ps').setRequired(stateReq4);
			tform.lookupName('ck_tw4_psx').setRequired(stateReq4);
			
			tform.lookupName('ck_tw1').setDisabled(stateDisable1);
			tform.lookupName('ck_tw1_ps').setDisabled(stateDisable1);
			tform.lookupName('ck_tw1_psx').setDisabled(stateDisable1);
			tform.lookupName('up1').setDisabled(stateDisable1);
			tform.lookupName('ms1').setDisabled(stateDisable1);

			tform.lookupName('ck_tw2').setDisabled(stateDisable2);
			tform.lookupName('ck_tw2_ps').setDisabled(stateDisable2);
			tform.lookupName('ck_tw2_psx').setDisabled(stateDisable2);
			tform.lookupName('up2').setDisabled(stateDisable2);
			tform.lookupName('ms2').setDisabled(stateDisable2);

			tform.lookupName('ck_tw3').setDisabled(stateDisable3);
			tform.lookupName('ck_tw3_ps').setDisabled(stateDisable3);
			tform.lookupName('ck_tw3_psx').setDisabled(stateDisable3);
			tform.lookupName('up3').setDisabled(stateDisable3);
			tform.lookupName('ms3').setDisabled(stateDisable3);

			tform.lookupName('ck_tw4').setDisabled(stateDisable4);
			tform.lookupName('ck_tw4_ps').setDisabled(stateDisable4);
			tform.lookupName('ck_tw4_psx').setDisabled(stateDisable4);
			tform.lookupName('up4').setDisabled(stateDisable4);
			tform.lookupName('ms4').setDisabled(stateDisable4);
		}
		
	},


	SubOpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(3);
		
		//Ext.fly('PpllrimcmrhpowmmuryPomemrxgebxPLplddr').update('<b>::: ' + records.record.data.nama_pd +' :::</b>');
		Ext.fly('dt-entry__header_capkin_opd').update('<i class="x-fa fa-calendar-check" aria-hidden="true"></i> Capaian Kinerja ' + records.record.data.nama_pd +'');
		
		capk_id_sub_pd = records.record.data.id_sub_pd;
		//capk_id_pd = records.record.data.id_pd;
		/*
		capk_kd_urusan = records.record.data.kd_urusan;
		capk_kd_bidang = records.record.data.kd_bidang;
		capk_kd_unit = records.record.data.kd_unit;
		capk_kd_sub = records.record.data.kd_sub;
		*/
		
		this.getStore('indikatorStore').load({
			params: {
				ptahun : vTAHUN,
				pid_pd : capk_id_pd,
				pid_sub_pd : capk_id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});
		xIndikatorStore=this.getStore('indikatorStore');

		this.getStore('anggaranStore').load({
			params: {
				ptahun : vTAHUN,
				pid_pd : capk_id_pd,
				pid_sub_pd : capk_id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});


	},

	prevRecord: function () {
		nxRecord = xIndikatorStore.getAt(idxIndikatorStore - 1);
		//console.log('Rec :'+nxRecord+'Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		idxIndikatorStore = idxIndikatorStore - 1;
		idIndikator=nxRecord.get('idindikator');
		console.log('IDX='+idxIndikatorStore+', IDINDIKATOR : '+idIndikator);
		this.updateFormNRecord(idxIndikatorStore,idIndikator);
	},
	nextRecord: function () {		
		nxRecord = xIndikatorStore.getAt(idxIndikatorStore + 1);
		//console.log('Rec :'+nxRecord+'Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		idxIndikatorStore = idxIndikatorStore + 1;
		//
		idIndikator=nxRecord.get('idindikator');
		console.log('IDX='+idxIndikatorStore+', IDINDIKATOR : '+idIndikator);
		this.updateFormNRecord(idxIndikatorStore,idIndikator);
	},

	updateFormNRecord: function (xIndex,xidindikator) {
		var DXTHIS = this;
		
		Ext.Ajax.request({
			url: REMOTE_URL + 'kinerja/getindikator/'+xidindikator,method:'GET',
			scope: this, waitMsg: 'Load Data ... ...', 
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				vDT = JSON.parse(response.responseText);	
				var xDataIndikatorModel = Ext.create('Admin.view.kinerja.FormModel');
				xDataIndikatorModel.set(obj);
				var tform=Ext.getCmp('form-indikator-kinerja-capkin');
				tform.setRecord(xDataIndikatorModel);
				//vID=xData.get('id');
				tform.lookupName('id').setValue(obj.idindikator);
				Ext.fly('form-capkin-opd-title-009099').update(obj.tolok_ukur);
				capk_id_indikator=obj.idindikator;
				const xtags=obj.xtags;	
				const lvl=obj.lvl;
				console.log(lvl);

				if (Number(lvl) > 6){
					tform.lookupName('ck_tw1_ps').setMaxValue(100);
					tform.lookupName('ck_tw2_ps').setMaxValue(100);
					tform.lookupName('ck_tw3_ps').setMaxValue(100);
					tform.lookupName('ck_tw4_ps').setMaxValue(100);
				} else {
					tform.lookupName('ck_tw1_ps').setMaxValue(1000000);
					tform.lookupName('ck_tw2_ps').setMaxValue(1000000);
					tform.lookupName('ck_tw3_ps').setMaxValue(1000000);
					tform.lookupName('ck_tw4_ps').setMaxValue(1000000);
				}
				
				DXTHIS.setTipeData();
				/*
				if (xtags !=null) {
					const xtagarr= xtags.split(','); //replace("{","[").replace("}","]");
					tform.lookupName('tagss').setValue(xtagarr);
				} else {
					tform.lookupName('tagss').setValue("");
				}
				*/
				//tform.lookupName('tags').setValue(["Indikator Makro","Prioritas Nasional"]);
			},
	   
			failure: function(response, opts) {
				Ext.toast({ message: 'Gagal Load data!', alignment: 'tc-tc', timeout: 2000 });
			}
		});
		
		//tform.lookupName('tags').setValueCollection('{"Satu","Dua","Tiga"}');

		var tform = Ext.getCmp('form-indikator-kinerja-capkin');
		if (isAdmin == false) {
			tform.lookupName('tipedata').setHidden(true);
		} else {
			tform.lookupName('tipedata').setHidden(false);
		}
		
	},


	indikatorList_itemClick:function (grid, records) {
		const xidindikator = records.record.get('idindikator');
		this.getView().down('tabpanel').setActiveItem(4);
		//Ext.getCmp('form-indikator-kinerja-capkin').setRecord(records.record);
		idxIndikatorStore = xIndikatorStore.indexOf(records.record);
		Ext.fly('form-capkin-opd-title-009099').update(records.record.data.tolok_ukur);
		this.updateFormNRecord(idxIndikatorStore,xidindikator);
		
	},

	indikatorKotaList_itemClick:function (grid, records) {
		const xidindikator = records.record.get('idindikator');
		this.getView().down('tabpanel').setActiveItem(1);
		//Ext.getCmp('form-indikator-kinerja-capkin').setRecord(records.record);
		idxIndikatorKotaStore = this.getStore('indikatorKotaStore').indexOf(records.record);
		Ext.fly('form-capkin-kota-title-009099').update(records.record.data.tolok_ukur);
		this.updateFormNRecord(idxIndikatorKotaStore,xidindikator);
		
	},

	cekValiIndikator: function (form) {

		
	},

	simpanData: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		var lvl = xForm.lookupName('lvl').getValue();
		
		if (Number(lvl)>6) {
			console.log(Number(xForm.lookupName('ck_tw1').getValue()));
			console.log(Number(xForm.lookupName('ck_tw2').getValue()));
			console.log(Number(xForm.lookupName('ck_tw3').getValue()));

			if (Number(capk_current_tw==2)) {
				if (Number(xForm.lookupName('ck_tw2').getValue()) < Number(xForm.lookupName('ck_tw1').getValue())) {
					this.toastPesan('error', 'Indikator Subkegiatan Lebih Kecil Dari Triwulan Sebelumnya', 2000);
					return false;
				}
			} 
			if (Number(capk_current_tw==3)) {
				if (Number(xForm.lookupName('ck_tw3').getValue()) < Number(xForm.lookupName('ck_tw2').getValue())) {
					this.toastPesan('error', 'Indikator Subkegiatan Lebih Kecil Dari Triwulan Sebelumnya', 2000);
					return false;
				}   
			}
			if (Number(capk_current_tw==4)) {
				if (Number(xForm.lookupName('ck_tw4').getValue()) < Number(xForm.lookupName('ck_tw3').getValue())) {
					this.toastPesan('error', 'Indikator Subkegiatan Lebih Kecil Dari Triwulan Sebelumnya', 2000);
					return false;
				} 
			}
		}


		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/save-data',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { 'tahun': vTAHUN,'tw':capk_current_tw },
				success: function (f, r, d) {
					console.log(f);
					xIndikatorStore.reload();
					xThis.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					//xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					var ermsg= JSON.parse(o.responseText);
					xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);	
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	updateSimda: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/update-realisasi-keuangan',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { 'tahun': vTAHUN,'tw':capk_current_tw,'pid_sub_pd':capk_id_sub_pd },
				success: function (f, r, d) {
					xThis.getStore('anggaranStore').reload();
					xThis.toastPesan('success', 'Data Berhasil Ditransfer  !!', 2000);
					//xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					xThis.toastPesan('error', 'Gagal simpan data ' + o.error.message, 2000);
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	

	fullScreen: function () {
		var elem = document.getElementById("tab-modulpanel-kinerja-0x8i7510u5");
		if (isFS2 == 0) {
			if (elem.requestFullscreen) { elem.requestFullscreen(); } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
			//Ext.getCmp("ext-maintoolbar-1").hide(); Ext.getCmp("ext-footerview-1").hide(); isFS2 = 1;
		} else {
			if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } else if (document.msExitFullscreen) { document.msExitFullscreen(); }
			//Ext.getCmp("ext-maintoolbar-1").show(); Ext.getCmp("ext-footerview-1").show(); isFS2 = 0;
		}
		let vpHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		//this.getView().down('tabpanel').setHeight(vpHeight);

	},
	
	formPrint_Show: function (btn) {	
		const xmode=btn.xmode;
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
			items:[{xtype:'capkin-form-print'}],
		});
		dialog.show();

		xForm=dialog.down('formpanel');
		if (capk_id_sub_pd==0) {
			xForm.lookupName('pid_sub_pd').setValue(capk_id_pd);
		} else {
			xForm.lookupName('pid_sub_pd').setValue(capk_id_sub_pd);
		}
		
		xForm.lookupName('pid_pd').setValue(capk_id_pd);
		
		xForm.lookupName('ispd').setValue(btn.ispd);
		if (xmode=='opd') {
			xForm.lookupName('report_name').setOptions (
			[
				{text:'1. Evaluasi Hasil Renja PD (Form E.81)',value:'eval_renja',ispd:1},
                {text:'2. Surat Pengantar Laporan',value:'pengantar_eval_renja'},
                {text:'3. Capaian Kinerja PD',value:'capaian_kinerja_pd',ispd:1},
                {text:'4. Capaian IKU',value:'capaian_iku_pd',ispd:1},
                {text:'5. Evaluasi Hasil Renstra PD',value:'eval_renstra',ispd:1},
                {text:'6. Capaian Kinerja Tahunan  (Form 1 LKPJ)',value:'lkpj_capkin'},
                {text:'7. Tingkat Kesesuaian Indikator  (Form 2 LKPJ)',value:'lkpj_kesesuaian'}
				
            ]);
			xForm.lookupName('report_name').setValue('eval_renja');
		} else {
			xForm.lookupName('report_name').setOptions (
			[
				{text:'1. Pengiriman Laporan Triwulanan',value:'rekap_kirimlap_tw'},
				{text:'2. Progres Pelaporan Triwulan',value:'progres_laporan'},
				{text:'3. Rekap Capaian Kinerja PD',value:'rekap_capkin'},
				{text:'4. Evaluasi Hasil RKPD',value:'eval_rkpd'},
				{text:'5. Capaian Program',value:'capaian_program'},
				{text:'6. Capaian IKU Kota',value:'capaian_iku_kota'},
				{text:'7. Capaian IKU Perangkat Daerah',value:'capaian_iku_pd'},
				{text:'8. Tingkat Kesesuaian Indikator',value:'tingkat_kesesuaian'},
				
			
			]);
		}
		/*
		var rptnama='dalev/'+btn.rptName;
		
		xForm.lookupName('kd_urusan').setValue(dalev_kd_urusan);
		xForm.lookupName('kd_bidang').setValue(dalev_kd_bidang);
		xForm.lookupName('kd_unit').setValue(dalev_kd_unit);
		xForm.lookupName('kd_pd').setValue(dalev_kd_pd);
		*/
	},
	formVerifikasi_Show:function (btn) {
		
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Verifikasi laporan',  shadow: 'true',width:600,height:500,
			items:[
				{xtype:'form-kinerja-verifikasi'}
			],
			

		});
		//dialog.down('formpanel').setRecord(rec);
		if (capk_current_tw_locked > 0) {
			dialog.show();
			var form = dialog.down('formpanel');
			form.lookupName('tw').setValue(capk_current_tw);
			form.lookupName('id_pd').setValue(capk_id_pd);
		}
		
	},

	

	formKirim_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Kirim Laporan',  shadow: 'true',width:350,height:350,
			items:[
				{xtype:'form-kinerja-kirim'}
			],
		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var xFormKirim = dialog.down('formpanel');
		xFormKirim.lookupName('tw').setValue(capk_current_tw);
		//form.lookupName('pbulan').setValue(mbulan);
		Ext.Ajax.request({
			url: REMOTE_URL + 'kinerja/getjmlindikator',method:'GET',
			params:{'id_pd':capk_id_pd,'tw':capk_current_tw},
			scope: this, waitMsg: 'Load Data ... ...', 
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				vDT = JSON.parse(response.responseText);	
				//xFormKirim.lookupName('id').setValue(xIndex);
				xFormKirim.lookupName('jml_indikator').setValue(obj.jm1);
				xFormKirim.lookupName('jml_kosong').setValue(obj.jm2);
			},
	   
			failure: function(response, opts) {
				Ext.toast({ message: 'Gagal Load data!', alignment: 'tc-tc', timeout: 2000 });
			}
		});
	},

	formUpload_Show: function(grid, info) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Upload Data Dukung',  shadow: 'true',width:350,height:260,
			items:[
				{xtype:'form-kinerja-upload'}
			],
			

		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');
		form.lookupName('idindikator').setValue(capk_id_indikator);
		form.lookupName('tw').setValue(capk_current_tw);
    },

	formSimda_Show: function(grid, info) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Update Serapan Anggaran',  shadow: 'true', width: 450, height: 620,
			items:[
				{xtype:'form-sipd-penatausahaan'}
			],
			

		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');

		form.lookupName('idskpd').setValue(capk_id_pd);
		form.lookupName('idunit').setValue(capk_id_sub_pd);
		form.lookupName('idsubunit').setValue(capk_id_sub_pd);
		form.lookupName('nm_opd').setValue(capk_nm_sub_pd);
		this.genCaptcha();
    },
	genCaptcha: function () {
		document.getElementById("sipdcaptcha").innerHTML = "Loading Captcha";
		
		Ext.Ajax.request({
			method: 'GET',
			url: REMOTE_URL + 'sipd/getcaptcha', 
			//params: {'token':xtoken,'app':'laba'},
			waitMsg: 'Loading...',
			success: function (response, request) {
				var r = Ext.decode(response.responseText); 
				//console.log(r.base64)	 
				document.getElementById("sipdcaptcha").innerHTML = "";
				let imgc = document.createElement('img');
				imgc.src ="data:image/png;base64, "+r.base64;	
				document.getElementById("sipdcaptcha").appendChild(imgc); 
				Ext.getCmp("sipdchaptchaid").setValue(r.id);
			},
			failure: function (conn, response, options, eOpts) {
				zTHIS.setModulView('login');
			}
		});

        
		
	},

	updateRealKeu: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		//Ext.Ajax.setTimeout(480000);
		var JTH = this;

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'sipd/update-realkeu',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...',
				timeout :  480000,
				success: function (f, r, d) {
					Ext.Msg.alert('Update Data', 'Data Realisasi Keuangan Berhasil Diupdate  !!<br><br>Bulan Ini : '+new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(r.bulanini))+'<br><br>Total s.d bulan ini : '+ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(r.total)));
					JTH.getStore('pekerjaanStore').reload();
					JTH.genCaptcha();
				},
				failure: function (form, o) {
					JTH.genCaptcha();
					var ermsg= JSON.parse(o.responseText);
					Ext.Msg.alert('Error', '<span class="badge2 bg-danger">Gagal sinkronisasi data dengan Smart Bakueda !! kemungkinan disebabkan : <br>- Username / Password Salah<br>- Aplikasi sedang offline <br>- Terjadi error pada aplikasi</span>');
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
			this.genCaptcha();
		}
		
	},

	

	formLapTw_Show: function (btn){
		var max_id0 = parseInt(this.getMaxID(this.getStore('twStore'), 'tw'));
		var max_id = max_id0 + 1;
		var isLocked = 0;
		if (max_id0 > 0) {
			var r = this.getStore('twStore').find('tw', max_id0);
			var d = this.getStore('twStore').getAt(r);
			isLocked = d.get('locked');
		}


		if (isLocked == 0 && max_id > 1) {
			this.toastPesan('error', 'Laporan bulan lalu belum dikirim !!', 2000);
			return false;
		}

		var dialog = Ext.create({
			xtype: 'dialog',
			title: 'Buat Laporan Evaluasi Renja', shadow: 'true',
			controller: {xclass: 'Admin.view.kinerja.Controller'},
			responsiveConfig: {
				'width < 800': {
					width: '95%', height: '90%',
				},
				'width >= 800': {
					width: 300, height: 210,
				}
			},
			items: [
				{ xtype: 'formpanel',bodyPadding:10,jsonSubmit :true,
				
					items:[
						{xtype:'numberfield',name:'tahun',value:vTAHUN,hidden:true},
						{xtype:'numberfield',name:'id_pd',value:capk_id_pd,hidden:true},
						{xtype:'numberfield',name:'tw',value:max_id,hidden:true},
						{xtype: 'selectfield',labelAlign:'top',flex:1,label:'Triwulan',name:'twx',disabled:true,value:max_id,
							options: [{text:'Triwulan I (Satu)',value:'1'},
							{text:'Triwulan II (Dua)',value:'2'},
							{text:'Triwulan III (Tiga)',value:'3'},
							{text:'Triwulan IV (Empat)',value:'4'}
							]
						}
					],
					
				}
			],
			bbar: [
				{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().destroy();},iconCls: 'x-fa fa-window-close'}
				,{xtype:'spacer'},
				{text: 'Proses',ui: "soft-green",shadow:true,handler: 'buatLaporanTw',iconCls: 'x-fa fa-save'} 
			]
		});
		dialog.show();
		var form = dialog.down('formpanel');
		//form.lookupName('twx').setValue(max_id);
		
	},

	buatLaporanTw: function (btn) {
		var form = btn.up().up().down('formpanel');
		var dialog = btn.up().up();
		var tw = form.lookupName('tw').getValue();


		if (form.validate()) {
			//Ext.toast('Form is valid!');
			form.submit({
				url: REMOTE_URL + 'kinerja/create-laporantw',
				scope: this,
				method: 'POST',
				waitMsg: 'Prosesing ... ...',
				
				success: function (f, r, d) {
					xThis.toastPesan('success', 'Data Berhasil Disimpan !!', 2000);
					xThis.getStore('twStore').reload(); 
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

	cariOPD: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['nama_pd'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariOPD: function () { var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },
	
	cariIndikator: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['tolok_ukur','slvl'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariIndikator: function () { var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },
	
	
});
