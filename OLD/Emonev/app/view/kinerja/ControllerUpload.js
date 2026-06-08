Ext.define('Admin.view.kinerja.ControllerUpload', {
	extend: 'Admin.base.ViewController',

	uploadFile: function (t, n, o, e) {
		var fTHIS=this;
		//alert(Ext.getCmp('x-form-userfile').files[0].size);
		//console.log(t);
		//let xfile = t.el.down('input[type=file]').dom.files[0];
		//var fileSize = Math.round((xfile.size / 1024));

		var xForm = t.up('formpanel');
		
		xForm.submit({
			url: REMOTE_URL + '../apidok/uploadevidence',
			scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
			params: { 'tahun': vTAHUN},
			cors :true,
			//headers: {'Authorization': 'Bearer '+XAPITOKEN},
			success: function (f, r, d) {
				console.log(r.success + r.msg + r.xresp);
				if (parseInt(r.xresp) > 0) {

					xForm.up().hide();
					x_name_file_rd_uploaded = r.fname;
					x_name_file_uploaded = r.fnameori;
					const xtw=xForm.lookupName('tw').getValue();
					if (xtw==1){
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file1').setValue(r.fname);
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file1s').setValue(r.fname);
					} else if (xtw==2){
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file2').setValue(r.fname);
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file2s').setValue(r.fname);
					} else if (xtw==3){
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file3').setValue(r.fname);
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file3s').setValue(r.fname);
					} else if (xtw==4){
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file4').setValue(r.fname);
						Ext.getCmp('form-indikator-kinerja-capkin').lookupName('file4s').setValue(r.fname);
					}
				} else {
					fTHIS.toastPesan('error','Gagal upload file!',2000);

				}
			},
			failure: function (form, o) {
				fTHIS.toastPesan('error','Gagal upload file!',2000);
			}
		});
	

	},

});
