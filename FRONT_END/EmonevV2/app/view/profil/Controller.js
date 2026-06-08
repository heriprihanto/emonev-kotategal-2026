Ext.define('Admin.view.profil.Controller', {
	extend: 'Admin.base.ViewController',

	initTabItem: function() {
        Ext.Ajax.request({
			url: REMOTE_URL + 'pengaturan/profil-user/'+vUSER_INFO.id,method:'GET',
			scope: this, waitMsg: 'Load Data ... ...', 
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				vDT = JSON.parse(response.responseText);	
				var xDataIndikatorModel = Ext.create('Admin.view.profil.FormUserModel');
				xDataIndikatorModel.set(obj);
				Ext.getCmp('xprofil-form-profil-pengguna').setRecord(xDataIndikatorModel);
			},
	   
			failure: function(response, opts) {
				Ext.toast({ message: 'Gagal Load data!', alignment: 'tc-tc', timeout: 2000 });
			}
		});
		/*
		Ext.Ajax.request({
			url: REMOTE_URL + 'pengaturan/profil-opd/'+vUSER_INFO.id,method:'GET', 
			scope: this, waitMsg: 'Load Data ... ...', 
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				vDT = JSON.parse(response.responseText);	
				var xDataIndikatorModel = Ext.create('Admin.view.profil.FormOpdModel');
				xDataIndikatorModel.set(obj);
				Ext.getCmp('xprofil-form-profil-opd').setRecord(xDataIndikatorModel);
			},
	   
			failure: function(response, opts) {
				Ext.toast({ message: 'Gagal Load data!', alignment: 'tc-tc', timeout: 2000 });
			}
		});
		*/
    },

	

	simpanUser: function (btn) {
		var xForm = Ext.getCmp('xprofil-form-profil-pengguna');
		var xDiag = btn.up().up().up();
		var xThis=this;
		var isChecked = xForm.lookupName('isChecked').getValue();
		if  (xForm.lookupName('isChecked').getValue() === true) {
			if (xForm.lookupName('password1').getValue() != xForm.lookupName('password2').getValue()) {
				xThis.toastPesan('error', 'Password tidak sama !!', 2000);
				return false;
			}
		} 
		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'pengaturan/update-profil-user',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
				success: function (f, r, d) {
					//xIndikatorStore.reload();
					xThis.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
					//xDiag.hide();
					//xThis.nextRecord();
				},
				failure: function (form, o) {
					var ermsg= JSON.parse(o.responseText);
					xThis.toastPesan('error', 'Terjadi Kesalahan <br/> <br/>' + ermsg.detail[0].msg, 2000);
				}
			});
		} else {
			this.toastPesan('error', 'Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
		}
	},

	simpanOpd: function (btn) {
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		var xThis=this;
		if (xForm.validate()) {
			xForm.submit({
				url: REMOTE_URL + 'pengaturan/update-profil-opd',
				scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
				success: function (f, r, d) {
					//xIndikatorStore.reload();
					xThis.toastPesan('success', 'Data Berhasil Disimpan  !!', 2000);
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



});
