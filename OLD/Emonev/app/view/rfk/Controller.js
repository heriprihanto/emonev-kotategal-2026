let rfk_id_opd = 0,rfk_id_pd=0,rfk_nama_pd=','
	rfk_tahun = vTAHUN,
	rfk_kd_urusan = 0,
	rfk_kd_bidang = 0,
	rfk_kd_unit = 0,
	rfk_kd_sub = 0,
	rfk_ket_program = '',
	rfk_kd_prog = 0,
	rfk_kd_keg = 0,
	rfk_ket_kegiatan = '',
	rfk_kd_urusan1 = 0,
	rfk_kd_bidang1 = 0,
	rfk_id_prog = 0,
	rfk_nm_sub_unit = '', rfk_nm_unit = '',
	rfk_kd_misi = '',
	rfk_misi = '',
	rfk_kd_tujuan = '',
	rfk_tujuan = '',
	rfk_kd_tujuan_indik = '',
	rfk_tujuan_indik = '',
	rfk_kd_sasaran = '',
	rfk_sasaran = '',

	rfk_ref_kd_urusan = 0,
	mLocked = 0, mbulan = 0, mstrbulan = '', midlapbulan = 0,
	rfk_ref_kd_bidang = 0;
var xThis = null;
var xrfkStoreMisi = null,
	xrfkStoreTujuan = null,
	xrfkStoreSasaran = null,
	xrfkStoreSasaranIndikator = null,
	xrfkStoreTujuanIndikator = null,
	xrfkStoreProgram = null,
	xrfkStoreProgramIndikator = null,
	xrfkStoreKegiatan = null,
	xrfkStoreKegiatanIndikator = null, xrfkStore = null, xrfkFotoStore = null;

let rfk_id_laporan = 0, rfk_islocked = 0, rfk_isverif = 0, rfk_bulanlap = 0, rfk_bulanakhir = 0, rfk_id_pekerjaan = 0, rfk_id_foto = 0;

let isFS2 = 0;
var idxRfkStore;

Ext.define('Admin.view.rfk.Controller', {
	extend: 'Admin.base.ViewController',

	/*
	init: function(grid) {
        if (Ext.os.is.Desktop) {
            Ext.getCmp('bulan-rfk-list').el.on({
                scope: this,
                contextmenu: this.onContextMenu
            });
        }
    },

    destroy: function() {
        this.toolMenu = Ext.destroy(this.toolMenu);

        this.callParent();
    },

    getMenu: function() {
        var menu = this.toolMenu,
            view = Ext.getCmp('bulan-rfk-list');

        if (!menu) {
            this.toolMenu = menu = Ext.create(Ext.apply({
                ownerCmp: view
            }, view.toolContextMenu));
        }

        return menu;
    },

    updateMenu: function(record, el, e, align) {
        var menu = this.getMenu();

        this.getViewModel().set('record', record.getData());
        menu.autoFocus = !e.pointerType;
        menu.showBy(el, align);
    },

    onContextMenu: function(e) {
        var grid = Ext.getCmp('bulan-rfk-list'),
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

    onMenu: function(grid, context) {
        this.updateMenu(context.record, context.tool.el, context.event, 'r-l?');
    },
	*/


	initTabItem: function () {
		/*
		Ext.getCmp('btnbalik-0p0s84jdusm3o').show();
		if (isAdmin == false) {
			this.getView().down('tabpanel').setActiveItem(1);
			Ext.fly('nama-opd-rfk-module').update('<b>::: ' + vNAMA_OPD + ' :::</b>');
			rfk_id_opd = vUSER_INFO.id_opd;
			rfk_kd_urusan = vUSER_INFO.kd_urusan;
			rfk_kd_bidang = vUSER_INFO.kd_bidang;
			rfk_kd_unit = vUSER_INFO.kd_unit;
			rfk_kd_sub = vUSER_INFO.kd_sub;

			this.getStore('lapbulananStore').load({
				params: {
					ptahun: vTAHUN,
					pid_sub_pd: rfk_id_opd
				}
			});
			x_bulan_store = this.getStore('lapbulananStore');
			Ext.getCmp('btnbalik-0p0s84jdusm3o').hide();
		}
		*/
		xThis = this;
	},
	OpdList_itemClick: function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
		Ext.fly('dt-entry__header_rfk').update('<i class="x-fa fa-chart-line" aria-hidden="true"></i> RFK (Realisasi Fisik dan Keuangan) :: <small>' + records.record.data.nama_pd + '</small>');
		rfk_id_pd= records.record.data.id_pd;
		rfk_id_opd = records.record.data.id_sub_pd;
		rfk_nama_pd = records.record.data.nama_pd;

		this.getStore('lapbulananStore').load({
			params: {
				ptahun: vTAHUN,
				pid_sub_pd: rfk_id_opd
			}
		});
		x_bulan_store = this.getStore('lapbulananStore');

	},


	onFormBuatLap: function (btn) {

		var max_id0 = parseInt(this.getMaxID(this.getStore('lapbulananStore'), 'bulan'));
		var max_id = max_id0 + 1;
		var isLocked = 0;
		if (max_id0 > 0) {
			var r = this.getStore('lapbulananStore').find('bulan', max_id0);
			var d = this.getStore('lapbulananStore').getAt(r);
			isLocked = d.get('lock');
		}


		if (isLocked == 0 && max_id > 1) {
			this.toastPesan('error', 'Laporan bulan lalu belum dikirim !!', 2000);
			return false;
		}

		var dialog = Ext.create({
			xtype: 'dialog',
			title: 'Buat Laporan RFK Bulanan', shadow: 'true',
			responsiveConfig: {
				'width < 800': {
					width: '95%', height: '90%',
				},
				'width >= 800': {
					width: 300, height: 210,
				}
			},
			items: [
				{ xtype: 'form-bulan' }
			],
		});
		dialog.show();
		var form = dialog.down('formpanel');


		form.lookupName('bulan').setValue(max_id);
		form.lookupName('tbulan').setValue(max_id);

	},

	onBuatLapBulanan: function (btn) {
		var form = btn.up().up('formpanel');
		var dialog = btn.up().up().up();
		var tbulan = form.lookupName('tbulan').getValue();


		if (form.validate()) {
			//Ext.toast('Form is valid!');
			form.submit({
				url: REMOTE_URL + 'rfk/createlapbulanan',
				scope: this,
				method: 'POST',
				waitMsg: 'Prosesing ... ...',
				params: {
					'save': 'ok', 'method': 'save',
					tahun: vTAHUN,
					username: vUSER_INFO.display_name,
					pid_sub_pd: rfk_id_opd
				},
				success: function (f, r, d) {
					xThis.toastPesan('success', 'Data Berhasil Disimpan !!', 2000);
					x_bulan_store.reload(); dialog.destroy();
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

	onItemBulandblclick: function (grid, records) {
		mLocked = records.record.data.lock;
		mbulan = records.record.data.bulan;
		mstrbulan = records.record.data.str_bulan;
		midlapbulan = records.record.data.id;
		mlaporanlocked = records.record.data.lock;
		mkd_perubahan = records.record.data.kd_perubahan;

		rfk_id_laporan = records.record.data.id;
		rfk_islocked = records.record.data.lock;
		rfk_isverif = records.record.data.verified;
		rfk_bulanlap = records.record.data.bulan;
		rfk_bulanakhir = parseInt(this.getMaxID(this.getStore('lapbulananStore'), 'bulan'));

		if (isAdmin == false) {
			if (mLocked > 0) {
				this.toastPesan('error', 'Laporan bulan ' + mstrbulan + ' sudah terkunci !!', 1500);
				return false;
			}
			this.openPekerjaanList(vTAHUN, rfk_id_opd, mbulan);
		} else {
			this.openMenuVerifikasi();
			//this.onMenu();
		}



		//console.log(grid);
	},

	hideActionSheet: function () {
		this.getView().actionsheet.hide();
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
		
		/*
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,modal:true,
			maximizable: true,
			title: 'Menu',  shadow: 'true',width:400,height:400,scrollable: true,
			//items:[{xtype:'rko-form-kegiatan'}],
		});
		dialog.show();
		*/
	},
	openPekerjaan: function () {
		this.openPekerjaanList(vTAHUN, rfk_id_opd, mbulan); this.hideActionSheet();
	},
	openPekerjaanList: function (tahun, idpd, bulan) {
		this.getView().down('tabpanel').setActiveItem(2);
		this.getStore('pekerjaanStore').load({
			params: {
				pid_sub_pd: idpd,
				ptahun: tahun,
				pbulan: bulan
			}
		});

		xrfkStore = this.getStore('pekerjaanStore');

		this.getStore('anggaranStore').load({
			params: {
				ptahun : tahun,
				pid_pd : idpd,
				pid_sub_pd : idpd
				//pkd_tahap:	capk_kd_tahap
			}
		});


	},

	fullScreen: function () {
		var elem = document.getElementById("ext-viewport");
		if (isFS2 == 0) {
			if (elem.requestFullscreen) { elem.requestFullscreen(); } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
			Ext.getCmp("ext-maintoolbar-1").hide(); Ext.getCmp("ext-footerview-1").hide(); isFS2 = 1;
		} else {
			if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } else if (document.msExitFullscreen) { document.msExitFullscreen(); }
			Ext.getCmp("ext-maintoolbar-1").show(); Ext.getCmp("ext-footerview-1").show(); isFS2 = 0;
		}
		let vpHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		this.getView().down('tabpanel').setHeight(vpHeight);

	},

	formPrint_Show: function (btn) {
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
			items: [{ xtype: 'rfk-form-print' }],
		});
		dialog.show();

		xForm = dialog.down('formpanel');
		xForm.lookupName('pid_sub_pd').setValue(rfk_id_opd);
		xForm.lookupName('puser').setValue(vUSER_INFO.display_name);
		/*
		var rptnama='dalev/'+btn.rptName;
		
		xForm.lookupName('kd_urusan').setValue(dalev_kd_urusan);
		xForm.lookupName('kd_bidang').setValue(dalev_kd_bidang);
		xForm.lookupName('kd_unit').setValue(dalev_kd_unit);
		xForm.lookupName('kd_pd').setValue(dalev_kd_pd);
		*/
	},



	updatePekerjaan: function () {
		this.editCell(arguments[0].columnIndex, REMOTE_URL + 'rfk/updatepekerjaan', arguments[0].record.data);
	},


	formKirimLap_Show: function (btn) {
		

		var dialog = Ext.create({
			xtype: 'dialog',
			title: 'Kirim Laporan', shadow: 'true',
			responsiveConfig: {
				'width < 800': {
					width: '95%', height: '90%',
				},
				'width >= 800': {
					width: 450, height: 440,
				}
			},
			items: [
				{ xtype: 'form-kirim' }
			],


		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');
		form.lookupName('tbulan').setValue(mbulan);
		form.lookupName('bulan').setValue(mbulan);
		form.lookupName('id_sub_pd').setValue(rfk_id_opd);
		form.lookupName('tahun').setValue(vTAHUN);
		form.lookupName('id_laporan').setValue(rfk_id_laporan);

		Ext.Ajax.request({
			method: 'GET',
			url: REMOTE_URL + 'rfk/getverify', params: {'id_sub_pd':rfk_id_opd,'bulan': mbulan,'tahun': vTAHUN},waitMsg: 'Loading...',
			success: function (response, request) {
					var jsonData = Ext.decode(response.responseText);
					//xForm.lookupName('pagu_kegiatan').setValue(jsonData[0].a);
					form.lookupName('fmis').setValue(jsonData.realkeu);
					form.lookupName('rkeu').setValue(jsonData.realpek);
				},
				failure: function (conn, response, options, eOpts) {
					Ext.toast('Error', 'Error retrieve data !!');
				}
			});


	},
	simpanKirimLaporan: function (btn) {
		var form = btn.up().up('formpanel');
		var dialog = btn.up().up().up();
		fmis=form.lookupName('fmis').getValue(),
		rpek=form.lookupName('rkeu').getValue();
		if (fmis != rpek) {
			this.toastPesan('error','Data tidak valid !! <br>Cek kembali data anda ! pastikan anda sudah memasukan data realisasi keuangan dengan benar !!',2000);
			return false;
		}
		var JTH = this;
		if (form.validate()) {
			form.submit({
				url: REMOTE_URL + 'rfk/kirimlaporan',
				scope: this,
				method: 'POST',
				waitMsg: 'Prosesing ... ...',
				success: function (f, r, d) {
					JTH.toastPesan('success', 'Laporan berhasil dikirim !!', 1500);
					x_bulan_store.reload(); dialog.destroy();
					Ext.getCmp('rfk_tabpanel_00548799paosie').setActiveItem(1);
				},
				failure: function (form, o) {
					JTH.toastPesan('error', 'Laporan belum sesuai ! <br><br>' + o.error, 1500);
				}

			});

		} else {
			this.toastPesan('error', 'Form tidak valid, mohon koreksi lagi !', 1500);
		}
	},

	formSimda_Show: function (btn) {

		var dialog = Ext.create({
			xtype: 'dialog', closable: true,
			title: 'Sinkronisasi Data SIPD', shadow: 'true', width: 450, height: 620,
			items: [
				{ xtype: 'form-simda' }
			],


		});
		//dialog.down('formpanel').setRecord(rec);
		dialog.show();
		var form = dialog.down('formpanel');
		form.lookupName('f_bulan').setValue(mbulan);

		form.lookupName('idskpd').setValue(rfk_id_pd);
		form.lookupName('idunit').setValue(rfk_id_opd);
		form.lookupName('idsubunit').setValue(rfk_id_opd);
		form.lookupName('nm_opd').setValue(rfk_nama_pd);
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
	padLeadingZeros:function (num, size) {
		var s = num + "";
		while (s.length < size) s = "0" + s;
		return s;
	},
	lastday:function (y, m) {
		return new Date(parseInt(y), parseInt(m), 0).getDate();
	},
	gantiBulan: function ( thiss, newValue, oldValue, eOpts) {
		var form = Ext.getCmp('form-simda-0098oiwoej64jaje');
		const ptahun = form.lookupName('ptahun').getValue();
		var intbln = newValue;
			const tglakhir = this.padLeadingZeros(this.lastday(ptahun, intbln), 2);
			const rtgl = "2024-01-01 - 2024-" + intbln + "-" + tglakhir;
			form.lookupName('tgl_1').setValue(ptahun+"-01-01");
			form.lookupName('tgl_2').setValue(ptahun+"-" + intbln + "-" + tglakhir);
			form.lookupName('tgl_range').setValue(rtgl);
	},
	

	verifikasiLaporan: function () {
		if (rfk_islocked < 1) { this.toastPesan('error', 'Laporan belum dikirim oleh OPD !', 1000); return false }
		if (rfk_isverif > 0) { return false }
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan verifikasi laporan ?',
			function (answer) {
				if (answer === 'yes') {
					this.verifyAction(rfk_id_laporan, 'verify');
				}
			}, this);
	},
	batalLaporan: function () {
		if (rfk_bulanlap != rfk_bulanakhir) { this.toastPesan('error', 'Pembatalan laporan hanya pada laporan bulan terakhir !', 1500); return false; }
		if (rfk_islocked < 1) { this.toastPesan('error', 'Laporan belum diverifikasi !', 1500); return false }
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan membatalkan verifikasi laporan ?',
			function (answer) {
				if (answer === 'yes') {
					this.verifyAction(rfk_id_laporan, 'batal');
				}
			}, this);
	},
	hapusLaporan: function () {
		if (rfk_bulanlap != rfk_bulanakhir) { this.toastPesan('error', 'Pembatalan laporan hanya pada laporan bulan terakhir !', 1500); return false; }
		if (rfk_islocked > 0) { this.toastPesan('error', 'Laporan sudah terkunci, batalkan verifikasi dahulu !', 1500); return false; }
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan menghapus laporan ?',
			function (answer) {
				if (answer === 'yes') {
					//this.verifyAction(rfk_id_laporan, 'hapus');
					this.hapusGridData(REMOTE_URL +'rfk/delete-rfk/'+rfk_id_laporan,rfk_id_laporan,x_bulan_store,this);
				}
			}, this);
	},

	verifyAction: function (idl, mtd) {
		Ext.Ajax.request({
			url: REMOTE_URL + 'rfk/verifikasilaporan/'+mtd+'/'+idl,method: 'POST',
			success: function (f, r, d) {
				xThis.toastPesan('success', 'Laporan berhasil disimpan !!', 2000);
				x_bulan_store.reload(); 
			},
			failure: function (form, o) {
				xThis.toastPesan('error', 'Terjadi kesalahan, hubungi administrator !', 2000);

			}
		}, this);
	},
	testToast: function () {
		this.toastPesan('error', 'PESAAAAAAAAA', 1000);
	},
	cariOPD: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['nama_pd','kode'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearOPD: function () { var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },
	cariKegiatan: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('kegiatanStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['uraian'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCarikegiatan: function () { var xStore = this.getStore('kegiatanStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },


	openFormRealisasi: function (t, l, e) {
		if (l.record.data.lvl < 4) { return false; }
		//console.log(l.record.data);
		//console.log(t);
		//rec = l.getRecord();
		var view = this.getView(), dialogKontrak = this.dialogKontrak;
		if (!dialogKontrak) {
			dialogKontrak = Ext.apply({ ownerCmp: view }, view.dialogKontrak);
			this.dialogKontrak = dialogKontrak = Ext.create(dialogKontrak);
		}
		//var form = dialogKontrak.down('formpanel');form.setRecord(l.record);
		Ext.getCmp('tabpanelrfk1-form-rfk').setRecord(l.record);
		Ext.getCmp('tabpanelrfk1-form-kontrak').setRecord(l.record);
		Ext.getCmp('tabpanelrfk1-form-uploadfoto').setRecord(l.record);
		dialogKontrak.show();

		idxRfkStore = xrfkStore.indexOf(l.record);
		rfk_id_pekerjaan = l.record.get('id_pekerjaan');
		Ext.getCmp('x-dataview-foto-rfk').getStore().load({
			params: {
				pid_pekerjaan: rfk_id_pekerjaan,
			}
		});
		/*
		this.getStore('fotoStore').load({
			params: {
				pid_pekerjaan: rfk_id_pekerjaan,
			}
		});*/
		xrfkFotoStore = Ext.getCmp('x-dataview-foto-rfk').getStore();
		Ext.getCmp('tabpanelrfk1-form-rfk').lookupName('keuangan_total').setMaxValue(l.record.data.pagu_anggaran);
	},

	formKontrak_Show: function (btn) {
		var cell = btn.up().up().up(), rec = cell.getRecord();

		var view = this.getView(), dialogKontrak = this.dialogKontrak;

		if (!dialogKontrak) {
			dialogKontrak = Ext.apply({ ownerCmp: view }, view.dialogKontrak);
			this.dialogKontrak = dialogKontrak = Ext.create(dialogKontrak);
		}
		//var form = dialogKontrak.down('formpanel');
		//form.setRecord(rec);
		dialogKontrak.show();



	},

	simpanRfk: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'rfk/save-rfk',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { tahun: vTAHUN },
				success: function (f, r, d) {
					xrfkStore.reload();
					xThis.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					//xDiag.hide();
					xThis.nextRecord();
				},
				failure: function (form, o) {
					xThis.toastPesan('error', 'Gagal simpan data ' + o.error.message, 2000);
				}
			});
		} else {
			xThis.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
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

	simpanKontrak: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'rfk/kontrak',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { tahun: vTAHUN },
				success: function (f, r, d) {
					xrfkStore.reload();
					xThis.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					//xDiag.hide();
				},
				failure: function (form, o) {
					xThis.toastPesan('error', 'Gagal simpan data ' + o.error.message, 2000);
				}
			});
		} else {
			xThis.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	mappingList_Show: function (btn) {
		this.getStore('mappingStore').load({
			params: {
				pid_sub_pd: rfk_id_opd
			}
		});
		this.getStore('mapping2Store').load({
			params: {
				pid_sub_pd: rfk_id_opd
			}
		});
		this.getView().down('tabpanel').setActiveItem(3);
	},
	updateMapping: function () {
		this.editGridCell(arguments[0].columnIndex, REMOTE_URL + 'renja/updatemapping', arguments[0].record.data, this.getStore('mappingStore'));
	},

	formUpload_Show: function (btn) {
		var cell = btn.up().up().up(), rec = cell.getRecord();
		this.getView().down('tabpanel').setActiveItem(4);
		rfk_id_pekerjaan = rec.get('id_pekerjaan');
		this.getStore('fotoStore').load({
			params: {
				pid_pekerjaan: rec.get('id_pekerjaan'),
			}
		});
		xrfkFotoStore = this.getStore('fotoStore');
	},

	formUploadFoto_Show: function (btn) {
		//var cell = btn.up().up().up(),rec = cell.getRecord();

		var view = this.getView(), dialogFoto = this.dialogFoto;

		if (!dialogFoto) {
			dialogFoto = Ext.apply({ ownerCmp: view }, view.dialogFoto);
			this.dialogFoto = dialogFoto = Ext.create(dialogFoto);
		}
		var form = dialogFoto.down('formpanel');
		form.lookupName('id_pekerjaan').setValue(rfk_id_pekerjaan);
		dialogFoto.show();
	},

	uploadFoto: function (btn) {
		var form = btn.up().up('formpanel');
		var dialog = btn.up().up().up();

		if (form.validate()) {
			//Ext.toast('Form is valid!');
			form.submit({
				url: REMOTE_URL + 'rfk/uploadfoto',
				scope: this,
				method: 'POST',
				waitMsg: 'Prosesing ... ...',
				params: {
					'save': 'ok',
					tahun: vTAHUN, username: vUSER_INFO.display_name,
					id_sub_pd: rfk_id_opd, id_laporan: midlapbulan
				},
				success: function (f, r, d) {
					//console.log(r);
					this.toastPesan('success', 'Foto berhasil diupload !!', 1500);
					//xrfkFotoStore.reload(); 
					//dialog.hide();
					Ext.getCmp('x-dataview-foto-rfk').getStore().load({
						params: {
							pid_pekerjaan: rfk_id_pekerjaan,
						}
					});
				},
				failure: function (form, o) {
					this.toastPesan('error', 'Gagal Upload Foto ! <br><br>' + o.error, 1500);
				}

			});

		} else {
			this.toastPesan('error', 'Form tidak valid, mohon koreksi lagi !', 1500);
		}
	},

	fotoClicked: function (t, l, o) {
		var dt = l.record.data;
		rfk_id_foto = dt.id;
		Ext.Msg.confirm('Hapus Data', 'Apakah anda akan menghapus foto ini ?',
			function (answer) {
				if (answer === 'yes') {
					Ext.Ajax.request({
						url: REMOTE_URL + 'rfk/hapusfoto/' + rfk_id_foto,
						params: {
							'method':'delete','id':rfk_id_foto
						},
						success: function(response, opts) {
							var obj = Ext.decode(response.responseText);
							//console.dir(obj);
							xThis.toastPesan('success','Data Berhasil Dihapus !! ::', 2000);
							Ext.getCmp('x-dataview-foto-rfk').getStore().load({
								params: {
									pid_pekerjaan: rfk_id_pekerjaan,
								}
							});
						},
				   
						failure: function(response, opts) {
							xThis.toastPesan('error','Hapus gagal, mohon koreksi lagi !', 2000);
						}
					});
				}
			});
	},

	hapusFoto: function (btn) {
		//var idfoto =this.getViewModel().get('selectedPhoto'); 
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan menghapus data ?',
			function (answer) {
				if (answer === 'yes') {
					xThis.hapusGridData(REMOTE_URL + 'rfk/hapusfoto/' + rfk_id_foto, rfk_id_foto, xrfkFotoStore);
					//console.log(idfoto);
				}
			});
	},

	prevRecord: function () {
		nxRecord = xrfkStore.getAt(idxRfkStore - 1);
		//console.log('Rec :'+nxRecord+'Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		idxRfkStore = idxRfkStore - 1;
		if (Number(nxRecord.data.lvl) < 4) {
			this.prevRecord();
		} else {
			this.updateFormNRecord(nxRecord);
			rfk_id_pekerjaan = nxRecord.data.id_pekerjaan;			
			//console.log('Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		}
	},
	nextRecord: function () {		
		nxRecord = xrfkStore.getAt(idxRfkStore + 1);
		//console.log('Rec :'+nxRecord+'Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		idxRfkStore = idxRfkStore + 1;
		if (Number(nxRecord.data.lvl) < 4) {
			this.nextRecord();
		} else {
			this.updateFormNRecord(nxRecord);
			rfk_id_pekerjaan = nxRecord.data.id_pekerjaan;			
			//console.log('Level: '+ nxRecord.data.lvl+' , id:'+idxRfkStore+ ' ,');
		}
	},

	

	updateFormNRecord: function (xrec) {
		Ext.getCmp('tabpanelrfk1-form-rfk').setRecord(xrec);
		Ext.getCmp('tabpanelrfk1-form-kontrak').setRecord(xrec);
		Ext.getCmp('tabpanelrfk1-form-uploadfoto').setRecord(xrec);
		Ext.getCmp('x-dataview-foto-rfk').getStore().load({
			params: {
				pid_pekerjaan: xrec.get('id_pekerjaan'),
			}
		});
		xrfkFotoStore = Ext.getCmp('x-dataview-foto-rfk').getStore();
	},

	saveRealKeu: function (sender, record) {
		const lvl =arguments[0].record.data.lvl;
		if (Number(lvl) != 3) {
			return false;
		}
		const colIdx = arguments[0].columnIndex;
		Ext.Ajax.request({
			url: REMOTE_URL+'rfk/update-real-keu-m/'+colIdx,method:'POST',
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

});
