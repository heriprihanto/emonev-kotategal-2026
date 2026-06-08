
Ext.define('Admin.view.rencanakinerja.Controller', {
	extend: 'Admin.base.ViewController',

	tempData: null,

	init: function () {
		if (!this.tempData) {
			this.tempData = {};
		}
		this.tempData.id_sub_pd = 0;
		this.tempData.role_id = vUSER_INFO.role_id;
		//console.log("KINERJA INIT");
		//xDataIndikatorModel = Ext.create('Admin.view.kinerja.FormModel');
	},


	renderChecklist: function (value, record) {
		const td = record.data;
		const v1= Number(td.v1), v2=Number(td.v2);
		if (v1 == 0) {
			return '<i class="x-fa fa-minus" style="color:red" aria-hidden="true"></i>';
		}
		else if (v1 == 1 && v2 == 0) {
			return '<i class="x-fa fa-check" style="color:green" aria-hidden="true"></i><i class="x-fa fa-check" style="color:red" aria-hidden="true"></i>';
		} 
		else if (v1 == 1 && v2 == 1) {
			return '<i class="x-fa fa-check" style="color:green" aria-hidden="true"></i><i class="x-fa fa-check" style="color:green" aria-hidden="true"></i> ';
		} 
	},



	OpdList_itemClick: function (grid, records) {

		

		
		this.tempData.id_pd = records.record.data.id_pd;
		this.tempData.is_pd = records.record.data.is_pd;
		this.tempData.id_sub_pd = records.record.data.id_sub_pd;
		this.tempData.nm_pd = records.record.data.nama_pd;
		this.tempData.kodeopd = records.record.data.kode;
		this.tempData.v1 = records.record.data.v1;
		this.tempData.v2 = records.record.data.v2;

		if (this.tempData.v1 == 1) {
			if (isAdmin == false) {
				return false;
			}
		}

		this.getView().down('tabpanel').setActiveItem(1);

		//if (vUSER_INFO.role_id > 10) {}

		xThis = this;

		this.getView().down('tabpanel').setActiveItem(2);

		Ext.fly('dt-entry__header_rencana_kinerja_opd').update('<i class="x-fa fa-calendar-check" aria-hidden="true"></i> Rencana Kinerja ' + records.record.data.nama_pd + '');

		console.log(this.tempData.id_sub_pd);

		this.getStore('tujuanSasaranStore').load({
			params: {
				ptahun: vTAHUN,
				pid_pd: this.tempData.id_pd,
				pkode_pd: this.tempData.kodeopd,
				pid_sub_pd: this.tempData.id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});

		this.getStore('programKegiatanStore').load({
			params: {
				ptahun: vTAHUN,
				pid_pd: this.tempData.id_pd,
				pkode_pd: this.tempData.kodeopd,
				pid_sub_pd: this.tempData.id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});



	},


	SubOpdList_itemClick: function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(2);

		Ext.fly('dt-entry__header_rencana_kinerja_opd').update('<i class="x-fa fa-calendar-check" aria-hidden="true"></i> Rencana Kinerja ' + records.record.data.nama_pd + '');

		this.tempData.id_sub_pd = records.record.data.id_sub_pd;
		console.log(this.tempData.id_sub_pd);


		this.getStore('tujuanSasaranStore').load({
			params: {
				ptahun: vTAHUN,
				pid_pd: this.tempData.id_pd,
				pkode_pd: this.tempData.kodeopd,
				pid_sub_pd: this.tempData.id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});

		this.getStore('programKegiatanStore').load({
			params: {
				ptahun: vTAHUN,
				pid_pd: this.tempData.id_pd,
				pkode_pd: this.tempData.kodeopd,
				pid_sub_pd: this.tempData.id_sub_pd
				//pkd_tahap:	capk_kd_tahap
			}
		});


	},

	TujuanSasaranList_itemClick: function (grid, records) {
		Ext.getCmp('tab-modulpanel-rencana-kinerja-0x8943fgtreu').setActiveItem(3);

		this.getStore('indikatorStore').load({
			params: {
				'ptahun': vTAHUN,
				'pid': records.record.data.id,
				'plvl': records.record.data.lvl,
				'pjn': 'tujuansasaran'
			}
		});

		this.tempData.tabid = 0;
		this.tempData.lvl = records.record.data.lvl;
		this.tempData.parent = records.record.data.uraian;
	},

	ProgramKegiatanList_itemClick: function (grid, records) {

		colIdx = records.columnIndex;
		if (colIdx < 2) {
			Ext.getCmp('tab-modulpanel-rencana-kinerja-0x8943fgtreu').setActiveItem(3);


			this.getStore('indikatorStore').load({
				params: {
					'ptahun': vTAHUN,
					'pid': records.record.data.id,
					'plvl': records.record.data.lvl,
					'pjn': 'progkeg'
				}
			});

			this.tempData.tabid = 1;
			this.tempData.lvl = records.record.data.lvl;
			this.tempData.parent = records.record.data.uraian;
		}

	},

	IndikatorList_itemClick: function (grid, records) {

		Ext.getCmp('tab-modulpanel-rencana-kinerja-0x8943fgtreu').setActiveItem(4);
		this.updateFormNRecord(0, records.record.data.id);

		Ext.fly('788y-ttw45-9htwe').update(this.tempData.parent);
	},

	onBalikParent: function (btn) {
		Ext.getCmp('tab-modulpanel-rencana-kinerja-0x8943fgtreu').setActiveItem(2);
	},

	openFormIndikator: function (grid, info) {
		Ext.getCmp('tab-modulpanel-rencana-kinerja-0x8943fgtreu').setActiveItem(4);
		this.updateFormNRecord(0, info.record.data.id);

		Ext.fly('788y-ttw45-9htwe').update(this.tempData.parent);
	},

	updateFormNRecord: function (xIndex, xidindikator) {
		var DXTHIS = this;

		Ext.Ajax.request({
			url: REMOTE_URL + 'rencanakinerja/getindikator/' + xidindikator, method: 'GET',
			scope: this, waitMsg: 'Load Data ... ...',
			success: function (response, opts) {
				const obj = Ext.decode(response.responseText);
				vDT = JSON.parse(response.responseText);
				const xDataIndikatorModel = Ext.create('Admin.view.rencanakinerja.FormModel');
				xDataIndikatorModel.set(obj);
				const tform = Ext.getCmp('rencanakinerja-form-indikator');
				tform.setRecord(xDataIndikatorModel);
				//vID=xData.get('id');
				tform.lookupName('id').setValue(obj.idindikator);
				//Ext.fly('form-capkin-opd-title-009099').update(obj.tolok_ukur);

			},

			failure: function (response, opts) {
				Ext.toast({ message: 'Gagal Load data!', alignment: 'tc-tc', timeout: 2000 });
			}
		});


	},

	validateTarget: function (jnFormula, tipeData, arrTarget) {
		console.log(arrTarget.tw1);
		console.log(arrTarget.target);
		/*
		if (jnFormula == 1) {
			const values = Object.values(arrTarget);
			const allEqual = values.every(v => v === values[0]);

			if (allEqual) {
				return true;
			} else {
				return false;
			}
		} else if (jnFormula == 2) {
			const jmlTarget = Number(arrTarget.tw1) + Number(arrTarget.tw2) + Number(arrTarget.tw3) + Number(arrTarget.tw4);
			if (Number(jmlTarget) != Number(arrTarget.target)) {
				return false;
			} else {
				return true;
			}
		} else if (jnFormula == 3) {
			const jmlTarget = Number(arrTarget.tw1) + Number(arrTarget.tw2) + Number(arrTarget.tw3) + Number(arrTarget.tw4);
			if (Number(jmlTarget) != Number(arrTarget.target)) {
				return false;
			} else {
				return true;
			}
		} else if (jnFormula == 4) {
			const jmlTarget = Number(arrTarget.tw1) + Number(arrTarget.tw2) + Number(arrTarget.tw3) + Number(arrTarget.tw4);
			if (Number(jmlTarget) != Number(arrTarget.target)) {
				return false;
			} else {
				return true;
			}
		}
			*/
		if (jnFormula == 2) {
			const jmlTarget = Number(arrTarget.tw1) + Number(arrTarget.tw2) + Number(arrTarget.tw3) + Number(arrTarget.tw4);
			if (Number(jmlTarget) != Number(arrTarget.target)) {
				return false;
			} else {
				return true;
			}
		}
	},

	simpanData: function (btn) {
		const xForm = btn.up('formpanel');

		/*
		if (ikuval == true) {
			xForm.lookupName('iku').setValue(1);
		} else {
			xForm.lookupName('iku').setValue(0);
		}*/

		if (this.validateTarget(xForm.lookupName('idformula').getValue(), xForm.lookupName('tipedata').getValue(), {
			'target': xForm.lookupName('target').getValue(),
			'tw1': xForm.lookupName('tg_tw1').getValue(),
			'tw2': xForm.lookupName('tg_tw2').getValue(),
			'tw3': xForm.lookupName('tg_tw3').getValue(),
			'tw4': xForm.lookupName('tg_tw4').getValue()
		}) == false) {
			this.toastPesan('error', 'Jumlah target triwulan tidak sama dengan target tahunan', 2000);
			return false;
		}



		if (xForm.validate()) {
			const ikuval = Ext.getCmp('checkbox_renkin_iku').getValue();
			console.log(`IKU : ${ikuval} XXX`);
			xForm.submit({
				url: REMOTE_URL + 'rencanakinerja/savedata',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...',
				success: function (f, r, d) {
					this.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					this.getStore('indikatorStore').reload();
					Ext.getCmp('tab-modulpanel-rencana-kinerja-0x8943fgtreu').setActiveItem(3);
				},
				failure: function (form, o) {
					var ermsg = JSON.parse(o.responseText);
					this.toastPesan('error', 'Terjadi Kesalahan<br/><br/>' + ermsg.detail[0].msg, 2000);
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	setTipeData: function (thx, newValue, oldValue, eOpts) {
		var tform = Ext.getCmp('rencanakinerja-form-indikator');
		const fields = [
			'tg_tw1', 'tg_tw2', 'tg_tw3', 'tg_tw4',
			'target', 'target_akhir', 'target_renja', 'target_rpj'
		];

		const inputType = Number(newValue) === 0 ? 'number' : 'text';

		fields.forEach(name => {
			const field = tform.lookupName(name);
			if (field) field.setInputType(inputType);
		});
	},

	hidePrintForm: function () {

	},

	formPrint_Show: function (btn) {
		const xmode = btn.xmode;
		var view = this.getView(),
			dialogPrint = this.dialogPrint;

		if (!dialogPrint) {
			dialogPrint = Ext.apply({
				ownerCmp: view
			}, view.dialogPrint);

			this.dialogPrint = dialogPrint = Ext.create(dialogPrint);
		}
		dialogPrint.show();
		var xForm = dialogPrint.down('formpanel');

		xForm = dialogPrint.down('formpanel');
		

		xForm.lookupName('pid_pd').setValue(this.tempData.id_pd);
		xForm.lookupName('pid_sub_pd').setValue(this.tempData.id_sub_pd);

		xForm.lookupName('ispd').setValue(btn.ispd);
		if (xmode == 'kota') {
			xForm.lookupName('report_name').setOptions(
				[
					{ text: 'Progres Pengisian Rencana Kinerja', value: 'progres_rencana_kinerja' },
					//{ text: 'Rekap Rencana Kinerja PD', value: 'rekap_rencana_kinerja' },
					{ text: 'Rekap IKU OPD', value: 'iku_opd_all' }
					

				]);
			
		} else {
			xForm.lookupName('report_name').setOptions(
				[
					{ text: 'Rencana Kinerja PD', value: 'rencana_kinerja_pd', ispd: 1 },
					//{ text: 'Rencana Kinerja Tahunan', value: 'rkt_pd', ispd: 1 },
					{ text: 'Indikator Kinerja Utama (IKU) OPD', value: 'iku_pd', ispd: 1 },
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

	

	formPenugasan_Show: function (grid, info) {
		var view = this.getView(),
			dialogPersonel = this.dialogPersonel;

		if (!dialogPersonel) {
			dialogPersonel = Ext.apply({
				ownerCmp: view
			}, view.dialogPersonel);

			this.dialogPersonel = dialogPersonel = Ext.create(dialogPersonel);
		}
		dialogPersonel.show();
		var xForm = dialogPersonel.down('formpanel');

		xForm.lookupName('nip_pptk').getStore().load({
			params: {
				"id_sub_pd": this.tempData.id_sub_pd
			}
		});

		xForm.lookupName('nip_ops').getStore().load({
			params: {
				"id_sub_pd": this.tempData.id_sub_pd
			}
		});

		Ext.fly('788y-rencana-kinerja-form-personel').update(info.record.data.uraian);
		xForm.lookupName('id_parent').setValue(info.record.get('id'))
		xForm.lookupName('lvl').setValue(info.record.get('lvl'))

	},


	cariOPD: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['nama_pd'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariOPD: function () { var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },

	cariIndikator: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['tolok_ukur', 'slvl'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariIndikator: function () { var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },

	simpanPersonel: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'rencanakinerja/save-personel',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...',
				//params: {tahun : vTAHUN,kd_tahap : rko_kd_tahap,id_sub_pd:rko_id_opd},
				success: function (f, r, d) {
					
					this.getStore('programKegiatanStore').reload();
					this.getStore('tujuanSasaranStore').reload();
					this.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					xDiag.hide();
				},
				failure: function (form, o) {
					var ermsg = JSON.parse(o.responseText);
					this.toastPesan('error', 'Terjadi Kesalahan<br/><br/>' + ermsg.detail[0].msg, 2000);
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	formVerifikasi_Show: function (btn) {
		if (Number(this.tempData.is_pd) != 1) {
			this.toastPesan('error', 'Submit oleh Perangkat Daerah Induk !', 2000);
			return false;
		}
		if (Number(btn.mode) == 2) {
			if (this.tempData.v1 == 0) {
				return false;
			}
		}
		var view = this.getView(),
			dialogVerifikasi = this.dialogVerifikasi;

		if (!dialogVerifikasi) {
			dialogVerifikasi = Ext.apply({
				ownerCmp: view
			}, view.dialogVerifikasi);

			this.dialogVerifikasi = dialogVerifikasi = Ext.create(dialogVerifikasi);
		}
		dialogVerifikasi.show();
		var xForm = dialogVerifikasi.down('formpanel');
		xForm.lookupName('id_sub_pd').setValue(this.tempData.id_sub_pd);
		xForm.lookupName('id_pd').setValue(this.tempData.id_pd);
		xForm.lookupName('v1').setValue(this.tempData.v1);
		xForm.lookupName('v2').setValue(this.tempData.v2);
		xForm.lookupName('mode').setValue(btn.mode);

		/*
		this.getFetchData(`${REMOTE_URL}rencanakinerja/get_form_verifikasi`,{params :{id_sub_pd:this.tempData.id_sub_pd}}).then(function (content) {
			
			var dtx = JSON.parse(content);
			xForm.lookupName('jml_indikator').setValue(dtx.jml_indikator);
			xForm.lookupName('jml_indikator_isi').setValue(dtx.jml_indikator_isi);

		});
		*/

		let jml_indikator = 0;
		let jml_indikator_isi = 0;
		
		this.getStore('opdVerifikasiStore').load({
			params: {
				"id_pd": this.tempData.id_pd
			},
			callback: function(records, operation, success) {
				
				Ext.Array.each(records, function(record, index){
					//console.log(index);
					//console.log(record.get('nama_pd'));
					jml_indikator = jml_indikator + Number(record.get('jml_indikator'));
					jml_indikator_isi = jml_indikator_isi + Number(record.get('jml_indikator_isi'));
				});
				
				xForm.lookupName('jml_indikator').setValue(jml_indikator);
				xForm.lookupName('jml_indikator_isi').setValue(jml_indikator_isi);
			},
		});
		
	},

	simpanVerifikasi: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		const a = Number(xForm.lookupName('jml_indikator').getValue());
		const b = Number(xForm.lookupName('jml_indikator_isi').getValue());
		const c = a-b;
		if (a !=  b) {
			this.toastPesan('error', `Terjadi Kesalahan<br/><br/> Ada ${c} indikator belum di entri`, 2000);
			return false;
		}

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'rencanakinerja/save-verifikasi-opd',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...',
				//params: {tahun : vTAHUN,kd_tahap : rko_kd_tahap,id_sub_pd:rko_id_opd},
				success: function (f, r, d) {
					
					//this.getStore('programKegiatanStore').reload();
					//
					this.toastPesan('success', 'Rencana Kinerja Berhasil Di Submit  !!', 2000);
					xDiag.hide();
					this.getView().down('tabpanel').setActiveItem(0);
					this.getStore('opdStore').reload();
				},
				failure: function (form, o) {
					var ermsg = JSON.parse(o.responseText);
					this.toastPesan('error', 'Terjadi Kesalahan<br/><br/>' + ermsg.detail[0].msg, 2000);
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

});
