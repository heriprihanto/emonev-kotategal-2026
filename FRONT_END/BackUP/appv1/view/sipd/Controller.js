Ext.define('Admin.view.sipd.Controller', {
	extend: 'Admin.base.ViewController',

	initTabItem:function () {
		
	},
	formJob_Show: function(btn) {
		var view = this.getView(),
			dialogFormJob = this.dialogFormJob;

		if (!dialogFormJob) {
			dialogFormJob = Ext.apply({
				ownerCmp: view
			}, view.dialogFormJob);

			this.dialogFormJob = dialogFormJob = Ext.create(dialogFormJob);
		}
		dialogFormJob.show();
	},

	prosesJob: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'sipd/startjob',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						//params: {tahun : vTAHUN,kd_tahap : rko_kd_tahap,id_sub_pd:rko_id_opd},
						success: function(f,r,d) {	
							//xpersonelStore.reload();
							this.toastPesan('success','Job Sinkronisasi Data Dimulai  !!',2000);
							xDiag.hide();
						},
						failure: function(form, o) {	
							var ermsg= JSON.parse(o.responseText);
							this.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);			
						}						
					});
        } else {
			this.toastPesan('error','Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},

});
