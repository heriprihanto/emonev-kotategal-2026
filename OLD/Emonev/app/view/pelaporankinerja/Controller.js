Ext.define('Admin.view.pelaporankinerja.Controller', {
	extend: 'Admin.base.ViewController',

	destroy: function() {
        Ext.destroy(this.dialogUpload);
        this.callParent();
    },

    onCancel: function(button) {
        console.log('onCancel');
        this.dialogUpload.hide();
    },

	kembali:function (btn) {
		this.getView().down('tabpanel').setActiveItem(0);
	},

	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);	
		
		Ext.fly('psub-dokumen-laporan-0098893893ujd92').update('<b>::: ' + records.record.data.nama_pd +' :::</b>');
		
		dokren_id_pd = records.record.data.id_pd;
		
		this.getStore('dokumenStore').load({
			params: {
				ptahun : vTAHUN,
				pid_pd : dokren_id_pd,
				//pkd_tahap:	capk_kd_tahap
			}
		});
		xdokrenStore=this.getStore('dokumenStore');
		xThis=this;
	},
	formUpload_Show: function(grid, info) {
		console.log(info)
        var view = this.getView(),
            dialogUpload = this.dialogUpload;

        if (!dialogUpload) {
            dialogUpload = Ext.apply({
                ownerCmp: view
            }, view.dialogUpload);

            this.dialogUpload = dialogUpload = Ext.create(dialogUpload);
        }

        dialogUpload.show();
		dialogUpload.down('formpanel').lookupName('id_pd').setValue(dokren_id_pd);
		dialogUpload.down('formpanel').lookupName('tahun').setValue(info.record.data.rtahun);

    },

	uploadFile: function (btn) {
		var fTHIS=this;
		
		var xForm = btn.up('formpanel');
		var xDiag = btn.up().up().up();
		const tahun = xForm.lookupName('tahun').getValue();
		const idpd = xForm.lookupName('id_pd').getValue();

		xForm.submit({
			url: REMOTE_URL + `/sakip/uploadberkas/${tahun}/${idpd}`,
			scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
			cors :true,
			headers: {
				'Authorization': 'Bearer '+XAPITOKEN
				},
			success: function (f, r, d) {
				/*

				console.log(r.success + r.msg + r.xresp);
				if (parseInt(r.xresp) > 0) {

					xForm.up().hide();
					x_name_file_rd_uploaded = r.fname;
					x_name_file_uploaded = r.fnameori;
					
					xdokrenStore.reload();
				} else {
					fTHIS.myToast('error','Upload File','Gagal upload file!',2000);

				}
				*/
				fTHIS.getStore('dokumenStore').reload();
				xForm.up().hide();
			},
			failure: function (form, o) {
				//fTHIS.myToast('error','Upload File','Gagal upload file!',2000);
				fTHIS.getStore('dokumenStore').reload();
				xForm.up().hide();
			}
		});
	

	},
	hapusDokumen: function(grid, info)  {
		var xStore = this.getStore('dokumenStore');
		var xUrl = REMOTE_URL +'dokren/hapusdokumen';
		var xvc =this;
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan menghapus data ?',
        function (answer) {
            if (answer === 'yes'){            	
            	//xvc.hapusGridData(xUrl,info.record.get('idf'),xStore);
				Ext.Ajax.request({
					url:  REMOTE_URL +'sakip/hapusdokumenlaporan',
					params: {
						'pidf':info.record.get('idf')
					},
					success: function(response, opts) {
						Ext.toast('Data Berhasil Dihapus !! ::');
						xStore.reload();
					},
			   
					failure: function(response, opts) {
						Ext.toast('Hapus gagal, mohon koreksi lagi !');
					}
				});
			}
        });
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
			items:[{xtype:'dokumen-form-print'}],
		});
		dialog.show();
	},


});
