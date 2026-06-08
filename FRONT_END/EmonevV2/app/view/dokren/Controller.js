
Ext.define('Admin.view.dokren.Controller', {
	extend: 'Admin.base.ViewController',

	init: function () {
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

	kembali:function (btn) {
		this.getView().down('tabpanel').setActiveItem(0);
	},
	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
		
		
		//Ext.fly('psub-dokumen-0098893893ujd92').update('<b>::: ' + records.record.data.nama_pd +' :::</b>');
		
		dokren_id_pd = records.record.data.id_pd;
		/*
		capk_kd_urusan = records.record.data.kd_urusan;
		capk_kd_bidang = records.record.data.kd_bidang;
		capk_kd_unit = records.record.data.kd_unit;
		capk_kd_sub = records.record.data.kd_sub;
		*/
		
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
        var view = this.getView(),
            dialogUpload = this.dialogUpload;

        if (!dialogUpload) {
            dialogUpload = Ext.apply({
                ownerCmp: view
            }, view.dialogUpload);

            this.dialogUpload = dialogUpload = Ext.create(dialogUpload);
        }

        dialogUpload.show();
		dokren_id_dok=info.record.get('id_dok');
		dokren_id=info.record.get('idf');

    },
	
	uploadFile: function (t, n, o, e) {
		var fTHIS=this;
		
		var xForm = t.up('formpanel');
		var xDiag=t.up().up().up();
		
		xForm.submit({
			url: REMOTE_URL + 'dokren/uploadberkas',
			scope: this, method: 'POST', waitMsg: 'Prosesing ... ...', 
			params: { 'tahun': vTAHUN, 
			'pid_pd': dokren_id_pd,
			'pid':dokren_id,
			'pid_dok':dokren_id_dok},
			cors :true,
			headers: {
				'Authorization': 'Bearer '+XAPITOKEN
				},
			success: function (f, r, d) {

				fTHIS.getStore('dokumenStore').reload();
				fTHIS.toastPesan('success','File berhasil diupload   !!',2000);
				xDiag.hide();
			},
			failure: function (form, o) {
				fTHIS.toastPesan('error','Upload File','Gagal upload file!',2000);
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
					width:450,height:250,
				}
			},
			
			standardSubmit: true,
			items:[{xtype:'dokumen-form-print'}],
		});
		dialog.show();
	},

	cariOPD: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['nama_pd'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariOPD: function () { var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },

	cariIndikator: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['tolok_ukur', 'slvl'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariIndikator: function () { var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },


});
