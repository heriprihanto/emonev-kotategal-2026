Ext.define('Admin.view.kinerja.Controller2', {
	extend: 'Admin.base.ViewController',


	kirimLaporan: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/kirim-laporan',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { 'tahun': vTAHUN,'tw':capk_current_tw,'id_pd':capk_id_pd,'user':vUSER_INFO.username,'nama_pd':capk_nm_pd },
				success: function (f, r, d) {
					//xIndikatorStore.reload();
					xThis.toastPesan('success', 'Laporan Berhasil Dikirim  !!', 2000);
					xDiag.destroy();
					//xThis.nextRecord();
					xThis.getView().down('tabpanel').setActiveItem(0);
				},
				failure: function (form, o) {
					var ermsg= JSON.parse(o.responseText);
					xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);	
				}
			});
		} else {
			xThis.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	verifikasiLaporan: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();

		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'kinerja/verifikasi-laporan',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', params: { tahun: vTAHUN },
				success: function (f, r, d) {
					xThis.toastPesan('success', 'Laporan Berhasil Diverifikasi  !!', 2000);
					xDiag.destroy();
					//xThis.nextRecord();
					xThis.getStore('twStore').reload();
					xThis.getStore('opdStore').reload();
				},
				failure: function (form, o) {
					var ermsg= JSON.parse(o.responseText);
					xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);	
				}
			});
		} else {
			xThis.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

});
