const heightTabpanel2 = PanelCompHeight - 10;
//var xDataIndikatorModel;

Ext.define('Admin.view.kinerja.Controller', {
	extend: 'Admin.base.ViewController',

	parseApiFailureMessage: function (o) {
		//console.log(o.responseText);
		var xx = o.responseText;
		
		var raw = '';
		try {
			if (o && o.responseText) {
				raw = o.responseText;
			} else if (o && o.response && o.response.responseText) {
				raw = o.response.responseText;
			} else if (o && typeof o.getResponseText === 'function') {
				raw = o.getResponseText() || '';
			}
		} catch (e0) {}
		if (!raw && o && o.error && o.error.message) {
			return o.error.message;
		}
		if (!raw) {
			//console.log(raw)
			return 'Terjadi kesalahan, silakan coba lagi.';
		}

		try {
			var ermsg = Ext.decode(raw);
			/*
			if (ermsg && ermsg.detail && Ext.isArray(ermsg.detail) && ermsg.detail[0] && ermsg.detail[0].msg) {
				console.log(ermsg.detail[0].msg)
				return ermsg.detail[0].msg;
			}
			if (ermsg && ermsg.msg) {
				return ermsg.msg;
			}
			if (ermsg && ermsg.message) {
				return ermsg.message;
			}
				*/
				return ermsg.detail[0].msg;
		} catch (e1) {}
		return 'Terjadi kesalahan, silakan coba lagi.';
	},

	escapeRegExp: function (s) {
		return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	},

	init: function () {
		console.log("KINERJA INIT");
		const vm = this.getViewModel();

        vm.set('tempData', {
            id_sub_pd: 0,
            role_id: vUSER_INFO?.role_id || 0
        });
		
	},

	destroy: function () {
		Ext.destroy(this.dialogUpload);
		this.callParent();
	},

	onCancel: function (button) {
		console.log('onCancel');
		this.dialogUpload.hide();
	},

	simpanSubkegiatanAnggaran: function (sender, record) {
		//this.editGridCell(arguments[0].columnIndex,REMOTE_URL + 'kinerja/update-subkegiatan-anggaran',arguments[0].record.data,this.getStore('anggaranStore'));
		const colIdx = arguments[0].columnIndex;
		Ext.Ajax.request({
			url: REMOTE_URL + 'kinerja/update-realisasi-anggaran/' + colIdx, method: 'POST',
			scope:this,
			//params: {'method':'save',,
			jsonData: arguments[0].record.data,
			success: function (response, opts) {
				var obj = Ext.decode(response.responseText);
				this.toastPesanR('success', 'Data Berhasil Disimpan !! ::', 2000);
			},

			failure: function (response, opts) {
				this.toastPesanR('error', 'Gagal simpan data, mohon koreksi lagi !', 2000);

			}
		});
	},

	setTipeData: function (mthis, newValue, oldValue, eOpts) {
		var tform = Ext.getCmp('form-indikator-kinerja-capkin');
		const ptarget = newValue; //tform.lookupName('tipedata').getValue();
		

		const fields = [
			'tg_tw1', 'tg_tw2', 'tg_tw3', 'tg_tw4', 'ck_tw1', 'ck_tw2', 'ck_tw3', 'ck_tw4',
			'target', 'target_akhir', 'target_renja', 'target_rpj'
		];
		

		const inputType = Number(ptarget) === 0 ? 'number' : 'text';

		fields.forEach(function (name) {
			var field = tform.lookupName(name);
			if (field && field.setInputType) {
				field.setInputType(inputType);
			}
		});

		
		
		
		
		
	},

	//hitungCapkin:function (th,nv,ov,eo) {
	hitungCapkin: function (th, ee, eo) {
		console.log(th.name);
		const dx = this.getVarData();
		var tform = Ext.getCmp('form-indikator-kinerja-capkin');
		const ptarget = tform.lookupName('target').getValue();
		const ptargetx = tform.lookupName('target_akhir').getValue();
		const pidformula = tform.lookupName('idformula').getValue();
		const ptipedata = tform.lookupName('tipedata').getValue();
		const tw = dx.capk_current_tw;
		const fieldBase = `ck_tw${tw}`;

		const ptargettw = tform.lookupName(`tg_tw${tw}`).getValue();

		if (![1, 2, 3, 4].includes(tw)) return; // validasi jika tw tidak sesuai

		const ckValue = tform.lookupName(`ck_tw${tw}`).getValue();

		// set hasil perhitungan
		tform.lookupName(`ck_tw${tw}_ps`).setValue(this.hitungCapkinBy(ckValue, ptarget, pidformula,ptipedata));
		tform.lookupName(`ck_tw${tw}_psx`).setValue(this.hitungCapkinBy(ckValue, ptargetx, pidformula,ptipedata));
		tform.lookupName(`ck_tgtw${tw}_ps`).setValue(this.hitungCapkinBy(ckValue, ptargettw, pidformula,ptipedata));
		tform.lookupName('ck5').setValue(ckValue);
	},

	hitungCapkinPerTw: function (ptw) {

	},

	hitungCapkinBy: function (tv, tg, xformula,xtipedata) {
		if (xtipedata == 1) {
			if (tv == tg) {
				return 100;
			} else {
				return 0;
			}
		} else {
			var tgn = Number(tg);
			var tvn = Number(tv);
			if (!tgn) {
				return 0;
			}
			if (tgn == 0) {
				return 0;
			}
			if (xformula < 4) {
				return (tvn / tgn) * 100;
			} else if (xformula == 4) {
				return ((tgn - (tvn - tgn)) / tgn) * 100;
			}
		}
	},

	hitungCapkinByTahun: function (tv, tg, xformula,xtipedata) {
		if (xtipedata == 1) {
			if (tv == tg) {
				return 100;
			} else {
				return 0;
			}
		} else {
			var tgn = Number(tg);
			var tvn = Number(tv);
			if (!tgn) {
				return 0;
			}
			if (xformula < 4) {
				return (tvn / tgn) * 100;
			} else if (xformula == 4) {
				return ((tgn - (tvn - tgn)) / tgn) * 100;
			}
		}
	},


	initTabItem: function () {
		if (isAdmin == false) {
			this.getView().down('tabpanel').setActiveItem(1);
			Ext.fly('nama-opd-rfk-module').update('<b>::: ' + vNAMA_OPD + ' :::</b>');

			
			this.setVarData({
				capk_id_opd : vUSER_INFO.id_opd
			});
			
			const d = this.getVarData();
			

			this.getStore('kegiatanStore').load({
				params: {
					ptahun: vTAHUN,
					pid_sub_pd: d.capk_id_opd,
					pkd_tahap: d.capk_kd_tahap
				}
			});
			this.setState('xcapkinStore', this.getStore('kegiatanStore'));
		}

		xThis = this;
	},

	renderChecklist: function (value, record) {
		let scls = '';
		const icons = {
			1: '<i class="x-fa fa-check" style="color:orange" aria-hidden="true"></i>',
			2: '<i class="x-fa fa-check" style="color:green" aria-hidden="true"></i><i class="x-fa fa-check" style="color:green" aria-hidden="true"></i>',
			default: '<i class="x-fa fa-minus" style="color:red" aria-hidden="true"></i>'
		};

		return icons[value] || icons.default;
	},


	OpdList_itemClick: function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);

		//Ext.fly('psub-pd-sdlsldsldksldksldksldks').update('<b>::: ' + records.record.data.nama_pd +' :::</b>');
		Ext.fly('dt-entry__header_capkin_opd').update('<i class="x-fa fa-calendar-check" aria-hidden="true"></i> Capaian Kinerja ' + records.record.data.nama_pd + '');

		this.setVarData({
			tahun : vTAHUN,
			capk_id_pd : records.record.data.id_pd,
			capk_is_pd : records.record.data.is_pd,
			capk_nm_pd : records.record.data.nama_pd,
			capk_id_sub_pd: records.record.data.id_sub_pd,
			xcapkinStore : this.getStore('kegiatanStore')
		});

		

		const dx = this.getVarData();
		
		this.getStore('twStore').load({
			params: {
				ptahun: dx.tahun,
				pid_pd: dx.capk_id_pd,
				pid_sub_pd: dx.capk_id_sub_pd,
				//pkd_tahap:	capk_kd_tahap
			}
		});

		

		xThis = this;
	},

	

	TwList_itemClick: function (grid, records) {
		const rec = records.record.data;
		const mLocked = rec.locked;
		

		this.setVarData({
			capk_current_tw : rec.tw,
			capk_current_tw_locked : Number(rec.locked),
			capk_id_laporan : rec.id
		});

		const dx = this.getVarData();

		//const btnVerifikasi = Ext.getCmp('btn_verifikasi_lap_kinerjapd');
		//btnVerifikasi.setHidden(ROLE_ID_APP > 3);

		if (rec.locked == 1 && ROLE_ID_APP > 3) return false;

		if (ROLE_ID_APP > 3) {
			
			if (mLocked > 0) {
				this.toastPesan('error', 'Laporan bulan ' + mstrbulan + ' sudah terkunci !!', 1500);
				return false;
			}
			
			this.openSubPdList(dx.tahun, dx.capk_id_pd, dx.capk_current_tw);
			
		} else {
			//this.openMenuVerifikasi();
			this.openSubPdList(dx.tahun, dx.capk_id_pd, dx.capk_current_tw);
		}

		/*

		// Jika data terkunci dan bukan admin
		
		*/
		console.log('Count:', this.getStore('subPdStore').getCount());
	},

	openSubPdList: function (ptahun, pidpd, ptw) {
		const dx = this.getVarData();
		this.getView().down('tabpanel').setActiveItem(3);
		this.getStore('indikatorStore').load({
			params: {
				ptahun: dx.tahun,
				pid_pd: dx.capk_id_pd,
				pid_sub_pd: dx.capk_id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});
		this.setVarData({
			xIndikatorStore : this.getStore('indikatorStore')
		});
		

		this.getStore('anggaranStore').load({
			params: {
				ptahun:dx.tahun,
				pid_pd: dx.capk_id_pd,
				pid_sub_pd: dx.capk_id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});
	},

	setStateFormIndikator: function (ptw) {
		console.log('Triwulan : ' + ptw);
		
		var tform = Ext.getCmp('form-indikator-kinerja-capkin');
		var allTriwulan = [1, 2, 3, 4];

		const dx = this.getVarData();
		const lvl = Number(dx.capk_indikator_lvl);
		console.log (`Level ${lvl}`);

		const fieldsa = [
			'ck_tgtw1_ps','ck_tw1_ps','ck_tgtw2_ps','ck_tw2_ps','ck_tgtw3_ps','ck_tw3_ps','ck_tgtw4_ps','ck_tw4_ps'
		];
		
		fieldsa.forEach(function (name) {
			var field = tform.lookupName(name);
			if (field && field.setInputType) {
				if (lvl==7) {
					field.setMaxValue(100);
				} else {
					field.setMaxValue(1000);
				}
			}
		});

		
		
	
		allTriwulan.forEach(function (tw) {
			var fields = [
				'ck_tw' + tw, 
				'ck_tw' + tw + '_ps', 
				'ck_tw' + tw + '_psx', 
				'ck_tgtw' + tw + '_ps', 
				'up' + tw, 
				'ms' + tw,
				'ket' + tw,
				'file' + tw,
				'tl' + tw,
				'tg_tw' + tw
			];

			
	
			fields.forEach(function (name) {
				var field = tform.lookupName(name);
				if (field) {
					if (tw === ptw) {
						// Triwulan aktif → aktif & wajib
						if (field.setRequired) field.setRequired(true);
						if (field.setDisabled) field.setDisabled(false);
					} else {
						// Triwulan lain → nonaktif & tidak wajib
						if (field.setRequired) field.setRequired(false);
						if (field.setDisabled) field.setDisabled(true);
					}

					

				}
			});
		});

		

	},
	


	openMenuVerifikasi: function () {
		
		var view = this.getView(),
			actionsheet = view.menuVerifikasi;

		if (!actionsheet.isComponent) {
			actionsheet.defaults = {
				handler: this.hideActionSheet,
				scope: this
			};

			actionsheet = view.actionsheet = Ext.Viewport.add(actionsheet);
		}

		actionsheet.show();
	},

	
	
	prevRecord: function () {
		if (!xIndikatorStore || idxIndikatorStore <= 0) {
			return;
		}
		var newIdx = idxIndikatorStore - 1;
		var nxRecord = xIndikatorStore.getAt(newIdx);
		if (!nxRecord) {
			return;
		}
		idxIndikatorStore = newIdx;
		idIndikator = nxRecord.get('id');
		this.updateFormNRecord(idxIndikatorStore, idIndikator);
	},
	nextRecord: function () {
		if (!xIndikatorStore || idxIndikatorStore >= xIndikatorStore.getCount() - 1) {
			return;
		}
		var newIdx = idxIndikatorStore + 1;
		var nxRecord = xIndikatorStore.getAt(newIdx);
		if (!nxRecord) {
			return;
		}
		idxIndikatorStore = newIdx;
		idIndikator = nxRecord.get('id');
		this.updateFormNRecord(idxIndikatorStore, idIndikator);
	},

	updateFormNRecord: function (xIndex, xidindikator) {
		//var DXTHIS = this;
		Ext.getCmp('btn-simpan-capaian-kinerja-xt67-utfek').setDisabled(true);
		const dx = this.getVarData();
		var me = this;

		this.getFetchData(`${REMOTE_URL}kinerja/getindikator/${xidindikator}`,{method:'GET'}).then(function (data) {
			var obj = Ext.decode(data);
	
			var xDataIndikatorModel = Ext.create('Admin.view.kinerja.FormModel');
			xDataIndikatorModel.set(obj);
	
			var tform = Ext.getCmp('form-indikator-kinerja-capkin');
				tform.setRecord(xDataIndikatorModel);
				//vID=xData.get('id');
				tform.lookupName('id').setValue(obj.idindikator);
				Ext.fly('form-capkin-opd-title-009099').update(`<span class="badge bg-info" style="font-size:14px;color:#404040; max-width: 1200px;  !important">${obj.tolok_ukur}</span>`);
				capk_id_indikator = obj.id;
				const xtags = obj.xtags;
				const lvl = obj.lvl;

				if (Number(lvl) > 6) {
					var i;
					for (i = 1; i <= 4; i++) {
						var field = tform.lookupName('ck_tw' + i + '_ps');
						if (field && field.setMaxValue) {
							field.setMaxValue(100);
						}
					}
				} else {
					var j;
					for (j = 1; j <= 4; j++) {
						var field2 = tform.lookupName('ck_tw' + j + '_ps');
						if (field2 && field2.setMaxValue) {
							field2.setMaxValue(1000000);
						}
					}
				}
				

				me.setTipeData();
				me.setStateFormIndikator(dx.capk_current_tw);
				Ext.getCmp('btn-simpan-capaian-kinerja-xt67-utfek').setDisabled(false);
				tform.lookupName('id_indikator').setValue(xDataIndikatorModel.get('id'));
				tform.lookupName('tw').setValue(dx.capk_current_tw);
	
		}).catch(function (err) {
			console.error('Error:', err);
			Ext.getCmp('btn-simpan-capaian-kinerja-xt67-utfek').setDisabled(false);
		});
		
		var tform = Ext.getCmp('form-indikator-kinerja-capkin');
		if (isAdmin == false) {
			tform.lookupName('tipedata').setHidden(true);
		} else {
			tform.lookupName('tipedata').setHidden(false);
		}

	},


	indikatorList_itemClick: function (grid, records) {
		const dx = this.getVarData();
		const xidindikator = records.record.get('id');
		xIndikatorStore = dx.xIndikatorStore;
		idxIndikatorStore = xIndikatorStore.indexOf(records.record);

		const ROLE_ID = Number(vUSER_INFO.role_id);

		
		if (ROLE_ID === 11 || ROLE_ID === 12) {
			this.openFormVerifikasiIndikator(xidindikator);
		} else {
			this.getView().down('tabpanel').setActiveItem(4);
			Ext.fly('form-capkin-opd-title-009099').update(records.record.data.tolok_ukur);
			this.updateFormNRecord(idxIndikatorStore, xidindikator);
			Ext.fly('788y-ttw45-9htwe-kinerjaopdxxx').update(records.record.data.slvl);
			const itemId = dx.capk_current_tw -1;
			const thisItem = Ext.getCmp('cmp-accordion-capkin-opd-tw').items.getAt(itemId);
			thisItem.expand(); 
		}

		this.setVarData({
			capk_indikator_lvl : records.record.get('lvl')
		});
			
		//this.openFormVerifikasiIndikator(xidindikator);

	},

	openFormVerifikasiIndikator: function (pidindikator) {
		var view = this.getView(),
			dialogVerifikasiIndikatorX = this.dialogVerifikasiIndikatorX;
		const dx = this.getVarData();

		if (!dialogVerifikasiIndikatorX) {
			dialogVerifikasiIndikatorX = Ext.apply({
				ownerCmp: view
			}, view.dialogVerifikasiIndikatorX);

			this.dialogVerifikasiIndikatorX = dialogVerifikasiIndikatorX = Ext.create(dialogVerifikasiIndikatorX);
		}
		dialogVerifikasiIndikatorX.show();

		this.getFetchData(`${REMOTE_URL}kinerja/getindikator/${pidindikator}`,{method:'GET'}).then(function (data) {
			var obj = Ext.decode(data);
	
			var xDataIndikatorModel = Ext.create('Admin.view.kinerja.FormModel');
			xDataIndikatorModel.set(obj);
	
			var tform = dialogVerifikasiIndikatorX.down('formpanel');
			tform.setRecord(xDataIndikatorModel);
			tform.getViewModel().set('formData', obj);
	
			tform.lookupName('tw').setValue(dx.capk_current_tw);
			tform.lookupName('id_indikator').setValue(obj.id_parent);
	
		}).catch(function (err) {
			console.error('Error:', err);
		});
		
		
	},


	indikatorKotaList_itemClick: function (grid, records) {
		const xidindikator = records.record.get('id');
		this.getView().down('tabpanel').setActiveItem(1);
		//Ext.getCmp('form-indikator-kinerja-capkin').setRecord(records.record);
		idxIndikatorKotaStore = this.getStore('indikatorKotaStore').indexOf(records.record);
		Ext.fly('form-capkin-kota-title-009099').update(records.record.data.tolok_ukur);
		this.updateFormNRecord(idxIndikatorKotaStore, xidindikator);

	},

	cekValiIndikator: function (form) {


	},

	simpanData: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		var lvl = xForm.lookupName('lvl').getValue();
		const dx = this.getVarData();


		if (Number(lvl) > 6) {
			var currentTw = Number(dx.capk_current_tw);

			if (currentTw > 1) {
				var currentVal = Number(xForm.lookupName('ck_tw' + currentTw).getValue());
				var prevVal = Number(xForm.lookupName('ck_tw' + (currentTw - 1)).getValue());

				if (currentVal < prevVal) {
					this.toastPesan(
						'error',
						'Indikator Subkegiatan Lebih Kecil Dari Triwulan Sebelumnya',
						2000
					);
					return false;
				}
			}
		}


		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/save-data',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { 'tahun': vTAHUN, 'tw': dx.capk_current_tw },
				success: function (f, r, d) {
					//console.log(f);
					this.getStore('indikatorStore').reload();
					this.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					//xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					this.toastPesan('error', 'Terjadi Kesalahan<br/><br/>' + this.parseApiFailureMessage(o), 2000);
				}
			});
		} else {
			console.log(xForm.getErrors()); 
			this.toastPesan('error', 'Form tidak valid.<br/>Periksa kembali isian yang wajib diisi.', 2000);
		}
	},

	simpanDataVerifikasi: function (btn) {
		const dx = this.getVarData();
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		var lvl = xForm.lookupName('lvl').getValue();


		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/save-data-verifikasi',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { 'tahun': vTAHUN, 'tw': dx.capk_current_tw },
				success: function (f, r, d) {
					//console.log(f);
					this.getStore('indikatorStore').reload();
					this.toastPesan('success', 'Data Berhasil Diverifikasi  !!', 2000);
					xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					this.toastPesan('error', 'Terjadi Kesalahan<br/><br/>' + this.parseApiFailureMessage(o), 2000);
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid.<br/>Periksa kembali isian yang wajib diisi.', 2000);
		}
	},

	updateSimda: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		const dx = this.getVarData();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/update-realisasi-keuangan',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { 'tahun': vTAHUN, 'tw': dx.capk_current_tw, 'pid_sub_pd': dx.capk_id_sub_pd },
				success: function (f, r, d) {
					this.getStore('anggaranStore').reload();
					this.toastPesan('success', 'Data Berhasil Ditransfer  !!', 2000);
					//xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					this.toastPesan('error', 'Gagal simpan data: ' + this.parseApiFailureMessage(o), 2000);
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid.<br/>Periksa kembali isian yang wajib diisi.', 2000);
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
		const dx = this.getVarData();
		const xmode = btn.xmode;
		var dialog = Ext.create({
			xtype: 'dialog', closable: true,
			//maximizable: true,
			title: 'Cetak Laporan', shadow: 'true',
			responsiveConfig: {
				'width < 800': {
					width: '95%', height: '90%',
				},
				'width >= 800': {
					width: 450, height: 370,
				}
			},

			standardSubmit: true,
			items: [{ xtype: 'capkin-form-print' }],
		});
		dialog.show();

		xForm = dialog.down('formpanel');
		xForm.lookupName('pid_pd').setValue(dx.capk_id_pd);
		
		if (dx.capk_id_sub_pd == 0) {
			xForm.lookupName('pid_sub_pd').setValue(dx.capk_id_pd);
		} else {
			xForm.lookupName('pid_sub_pd').setValue(dx.capk_id_sub_pd);
		}

		

		xForm.lookupName('ispd').setValue(btn.ispd);
		if (xmode == 'opd') {
			xForm.lookupName('report_name').setOptions(
				[	
					{ text: '1. Capaian Kinerja PD Triwulanan', value: 'capaian_kinerja_pd', ispd: 1 },
					{ text: '2. Capaian Kinerja PD Final', value: 'capaian_kinerja_pd_final', ispd: 1 },
					{ text: '3. Evaluasi Hasil Renja PD (Form E.81)', value: 'eval_renja', ispd: 1 },
					{ text: '4. Surat Pengantar Laporan', value: 'pengantar_eval_renja' },
					{ text: '5. Capaian IKU', value: 'capaian_iku_pd', ispd: 1 },
					/*
					{ text: '5. Evaluasi Hasil Renstra PD', value: 'eval_renstra', ispd: 1 },
					{ text: '6. Capaian Kinerja Tahunan  (Form 1 LKPJ)', value: 'lkpj_capkin' },
					{ text: '7. Tingkat Kesesuaian Indikator  (Form 2 LKPJ)', value: 'lkpj_kesesuaian' }
					 */

				]);
			xForm.lookupName('report_name').setValue('capaian_kinerja_pd');
		} else {
			xForm.lookupName('report_name').setOptions(
				[
					{ text: '1. Pengiriman Laporan Triwulanan', value: 'rekap_kirimlap_tw' },
					{ text: '2. Progres Pelaporan Triwulan', value: 'progres_laporan' },
					{ text: '3. Rekap Capaian Kinerja PD Triwulanan', value: 'rekap_capkinsubkeg' },
					{ text: '4. Rekap Capaian Kinerja PD', value: 'rekap_capkin' },
					{ text: '5. Evaluasi Hasil RKPD', value: 'eval_rkpd' },
					{ text: '6. Capaian Program', value: 'capaian_program' },
					{ text: '7. Capaian IKU Kota', value: 'capaian_iku_kota' },
					{ text: '8. Capaian IKU Perangkat Daerah', value: 'capaian_iku_pd' },
					{ text: '9. Tingkat Kesesuaian Indikator', value: 'tingkat_kesesuaian' },


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
	formVerifikasi_Show: function (btn) {
		/*
		var dialog = Ext.create({
			xtype: 'dialog', closable: true,
			title: 'Verifikasi laporan', shadow: 'true', width: 600, height: 500,
			items: [
				{ xtype: 'form-kinerja-verifikasi' }
			],


		});
		//dialog.down('formpanel').setRecord(rec);
		if (capk_current_tw_locked > 0) {
			dialog.show();
			var form = dialog.down('formpanel');
			form.lookupName('tw').setValue(capk_current_tw);
			form.lookupName('id_pd').setValue(capk_id_pd);
		}
			*/

	},



	formKirim_Show: function (btn) {
		 
		const dx = this.getVarData();
		if (Number(dx.capk_is_pd) != 1) {
			this.toastPesan('error', 'Submit oleh Perangkat Daerah Induk !', 2000);
			return false;
		}
		
		var view = this.getView();

		var xdialog =  view.add({
			xtype: 'dialog',
			title: 'Submit Capaian Kinerja',
			bodyPadding: 20,closable: true,closeToolText : 'Tutup',
			width: 500, height: 750,
			items: [
				{ xtype:'form_kinerja_kirim_opd' }
			], 
		});

		xdialog.show();
		var tform =  xdialog.down('formpanel');
		tform.lookupName('verifikasi').setHidden(!isAdmin);
		tform.lookupName('ptw').setValue(dx.capk_current_tw);
		tform.lookupName('ptw').setReadOnly(true);
		tform.lookupName('id_sub_pd').setValue(dx.capk_id_sub_pd);
		tform.lookupName('id_pd').setValue(dx.capk_id_pd);
		

		let jml_indikator = 0;
		let jml_indikator_isi = 0;
		
		this.getStore('opdVerifikasiStore').load({
			params: {
				"id_pd": dx.capk_id_pd
			},
			callback: function(records, operation, success) {
				
				Ext.Array.each(records, function(record, index){
					//console.log(index);
					//console.log(record.get('nama_pd'));
					jml_indikator = jml_indikator + Number(record.get('jml_indikator'));
					jml_indikator_isi = jml_indikator_isi + Number(record.get('jml_indikator_isi'));
				});
				
				tform.lookupName('jml_indikator').setValue(jml_indikator);
				tform.lookupName('jml_indikator_isi').setValue(jml_indikator_isi);
			},
		});
		if (ROLE_ID_APP > 3) {
			tform.lookupName('mode').setValue(1);
		} else {
			tform.lookupName('mode').setValue(2);
		}
	},

	kirimLaporan: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		var jm = xForm.lookupName('jml_indikator').getValue();

		const a = Number(xForm.lookupName('jml_indikator').getValue());
		const b = Number(xForm.lookupName('jml_indikator_isi').getValue());
		const c = a-b;
		if (a !=  b) {
			this.toastPesan('error', `Terjadi Kesalahan<br/><br/> Ada ${c} indikator belum di entri`, 2000);
			return false;
		}



		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/submit-laporan',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
				
				success: function (f, r, d) {
					this.getView().down('tabpanel').setActiveItem(0);
					this.getStore('opdStore').reload();
					xDiag.destroy();
				},
				failure: function (form, o) {
					this.toastPesan('error', 'Terjadi Kesalahan<br/><br/>' + this.parseApiFailureMessage(o), 2000);
					xDiag.destroy();
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid.<br/>Periksa kembali isian yang wajib diisi.', 2000);
		}
	},

	formUpload_Show: function (grid, info) {

		var view = this.getView(),
			dialogUpload = this.dialogUpload;

		if (!dialogUpload) {
			dialogUpload = Ext.apply({
				ownerCmp: view
			}, view.dialogUpload);

			this.dialogUpload = dialogUpload = Ext.create(dialogUpload);
		}

		dialogUpload.show();

		const dx = this.getVarData();
		var form = dialogUpload.down('formpanel');
		form.lookupName('idindikator').setValue(typeof capk_id_indikator !== 'undefined' ? capk_id_indikator : dx.capk_id_indikator);
		form.lookupName('tw').setValue(dx.capk_current_tw);
	},

	uploadFile: function (t, n, o, e) {
		var fTHIS=this;
		var xForm = t.up('formpanel');
		
		xForm.submit({
			url: `${REMOTE_URL}kinerja/uploadevidence`,
			scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
			params: { 'tahun': vTAHUN},
			cors :true,
			//headers: {'Authorization': 'Bearer '+XAPITOKEN},
			success: function (f, r, d) {
				//console.log(r.success + r.msg + r.xresp);
				//if (parseInt(r.xresp) > 0) {
					console.log(r);
					xForm.up().hide();
					x_name_file_rd_uploaded = r.stored_filename;
					x_name_file_uploaded = r.original_filename;

					const xtw = Number(xForm.lookupName('tw').getValue());
					const form = Ext.getCmp('form-indikator-kinerja-capkin');

					if (xtw >= 1 && xtw <= 4) {
						const fileField = form.lookupName(`file${xtw}`);
						const fileNameField = form.lookupName(`file${xtw}s`);
						
						if (fileField && fileNameField) {
							fileField.setValue(r.stored_filename);
							fileNameField.setValue(r.stored_filename);
						}
					}
			
			},
			failure: function (form, o) {
				this.toastPesan('error', 'Gagal upload file: ' + this.parseApiFailureMessage(o), 2000);
			}
		});
	

	},

	formSimda_Show: function (grid, info) {
		const dx = this.getVarData();
		var dialog = Ext.create({
			xtype: 'dialog', closable: true,
			title: 'Update Serapan Anggaran', shadow: 'true', width: 450, height: 620,
			items: [
				{ xtype: 'form-sipd-penatausahaan' }
			],


		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');

		form.lookupName('idskpd').setValue(dx.capk_id_pd);
		form.lookupName('idunit').setValue(dx.capk_id_sub_pd);
		form.lookupName('idsubunit').setValue(dx.capk_id_sub_pd);
		form.lookupName('nm_opd').setValue(dx.capk_nm_sub_pd || capk_nm_sub_pd);
		this.genCaptcha();
	},
	genCaptcha: function () {
		document.getElementById("sipdcaptcha").innerHTML = "Loading Captcha";
		var me = this;

		Ext.Ajax.request({
			method: 'GET',
			url: REMOTE_URL + 'sipd/getcaptcha',
			//params: {'token':xtoken,'app':'laba'},
			waitMsg: 'Loading...',
			scope: me,
			success: function (response, request) {
				var r = Ext.decode(response.responseText);
				//console.log(r.base64)	 
				document.getElementById("sipdcaptcha").innerHTML = "";
				let imgc = document.createElement('img');
				imgc.src = "data:image/png;base64, " + r.base64;
				document.getElementById("sipdcaptcha").appendChild(imgc);
				Ext.getCmp("sipdchaptchaid").setValue(r.id);
			},
			failure: function (conn, response, options, eOpts) {
				if (this && Ext.isFunction(this.setModulView)) {
					this.setModulView('login');
				}
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
				timeout: 480000,
				success: function (f, r, d) {
					Ext.Msg.alert('Update Data', 'Data Realisasi Keuangan Berhasil Diupdate  !!<br><br>Bulan Ini : ' + new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(r.bulanini)) + '<br><br>Total s.d bulan ini : ' + new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(r.total)));
					JTH.getStore('pekerjaanStore').reload();
					JTH.genCaptcha();
				},
				failure: function (form, o) {
					JTH.genCaptcha();
					Ext.Msg.alert('Error', '<span class="badge2 bg-danger">Gagal sinkronisasi data dengan Smart Bakueda !! kemungkinan disebabkan : <br>- Username / Password Salah<br>- Aplikasi sedang offline <br>- Terjadi error pada aplikasi</span><br/><br/>' + Ext.String.htmlEncode(JTH.parseApiFailureMessage(o)));
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid.<br/>Periksa kembali isian yang wajib diisi.', 2000);
			this.genCaptcha();
		}

	},



	formLapTw_Show: function (btn) {
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

		var view = this.getView(),
			dialogFormTriwulan = this.dialogFormTriwulan;

		if (!dialogFormTriwulan) {
			dialogFormTriwulan = Ext.apply({
				ownerCmp: view
			}, view.dialogFormTriwulan);

			this.dialogFormTriwulan = dialogFormTriwulan = Ext.create(dialogFormTriwulan);
		}

		dialogFormTriwulan.show();
		var form = dialogFormTriwulan.down('formpanel');
		//form.lookupName('id_pd').setValue(capk_id_pd);
		form.lookupName('id_sub_pd').setValue(this.getVarData().capk_id_sub_pd);
		form.lookupName('tw').setValue(max_id);
		form.lookupName('twx').setValue(max_id);
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
					this.toastPesan('success', 'Laporan berhasil dibuat !!', 2000);
					//console.log(this.getStore('twStore'));
					this.getStore('twStore').reload();
					dialog.hide();
				},
				failure: function (form, o) {
					this.toastPesan('error', 'Terjadi Kesalahan<br/><br/>' + this.parseApiFailureMessage(o), 2000);
					dialog.hide();
				}

			});

		} else {
			Ext.toast('Form tidak valid, mohon koreksi lagi !');
		}
	},

	hapusLaporan: function () {
		//if (rfk_bulanlap != rfk_bulanakhir) { this.toastPesan('error', 'Pembatalan laporan hanya pada laporan bulan terakhir !', 1500); return false; }
		//if (rfk_islocked > 0) { this.toastPesan('error', 'Laporan sudah terkunci, batalkan verifikasi dahulu !', 1500); return false; }
		const ZStore = this.getStore('twStore');
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan menghapus laporan ?',
			function (answer) {
				if (answer === 'yes') {
					
					Ext.Ajax.request({
						url: `${REMOTE_URL}kinerja/deletelaporan/${this.getVarData().capk_id_laporan}`,
						method :'DELETE',
						scope : this,
						success: function(response, opts) {
							var obj = Ext.decode(response.responseText);
							//console.dir(obj);
							this.toastPesan('success','Data Berhasil Dihapus !! ::', 2000);
							this.getStore('twStore').reload();
						},
				   
						failure: function(response, opts) {
							this.toastPesan('error','Hapus gagal, mohon koreksi lagi !', 2000);
						}
					});
				}
			}, this);
	},

	cariOPD: function (a, e, o) {
		var me = this;
		var searchValue = a.getValue();
		var xStore = this.getStore('opdStore');
		if (!Ext.isEmpty(xStore)) {
			xStore.clearFilter();
			if (!Ext.isEmpty(searchValue)) {
				var regEx = new RegExp(me.escapeRegExp(searchValue), 'i');
				var fields = ['nama_pd'];
				var i;
				xStore.filterBy(function (rec) {
					for (i = 0; i < fields.length; i++) {
						if (regEx.test(rec.get([fields[i]]))) {
							return true;
						}
					}
				});
			}
		}
	},
	clearCariOPD: function () { var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },

	cariIndikator: function (a, e, o) {
		var me = this;
		var searchValue = a.getValue();
		var xStore = this.getStore('indikatorStore');
		if (!Ext.isEmpty(xStore)) {
			xStore.clearFilter();
			if (!Ext.isEmpty(searchValue)) {
				var regEx = new RegExp(me.escapeRegExp(searchValue), 'i');
				var fields = ['tolok_ukur', 'slvl'];
				var i;
				xStore.filterBy(function (rec) {
					for (i = 0; i < fields.length; i++) {
						if (regEx.test(rec.get([fields[i]]))) {
							return true;
						}
					}
				});
			}
		}
	},
	clearCariIndikator: function () { var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },


});
