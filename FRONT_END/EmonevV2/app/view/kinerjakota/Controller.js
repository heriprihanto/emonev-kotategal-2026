var idxIndikatorKotaStore;var xIndikatorKotaStore;

Ext.define('Admin.view.kinerjakota.Controller', {
	extend: 'Admin.base.ViewController',
	init: function() {
        console.log("KINERJA INIT");
		xIndikatorKotaStore=this.getStore('indikatorStore');
    },

	indikatorList_itemClick:function (grid, records) {
		const xidindikator = records.record.get('idindikator');
		this.getView().down('tabpanel').setActiveItem(1);
		//Ext.getCmp('form-indikator-kinerja-capkin-kota').setRecord(records.record);
		idxIndikatorKotaStore = xIndikatorKotaStore.indexOf(records.record);
		Ext.fly('form-capkin-opd-title-009099xcvtypok').update(records.record.data.tolok_ukur);
		this.updateFormNRecord(idxIndikatorKotaStore,xidindikator);
		
	},

	updateFormNRecord: function (xIndex,xidindikator) {
		
		Ext.Ajax.request({
			url: REMOTE_URL + 'kinerja/getindikator/'+xidindikator,method:'GET',
			scope: this, waitMsg: 'Load Data ... ...', 
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				vDT = JSON.parse(response.responseText);	
				var xDataIndikatorModel = Ext.create('Admin.view.kinerjakota.FormModel');
				xDataIndikatorModel.set(obj);
				Ext.getCmp('form-indikator-kinerja-capkin-kota').setRecord(xDataIndikatorModel);
				//vID=xData.get('id');
				Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('id').setValue(xIndex);
				Ext.fly('form-capkin-opd-title-009099').update(obj.tolok_ukur);
				capk_id_indikator=obj.idindikator;
				const xtags=obj.xtags;	
				const lvl=obj.lvl;
				console.log(lvl);

				if (Number(lvl) > 6){
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw1_ps').setMaxValue(100);
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw2_ps').setMaxValue(100);
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw3_ps').setMaxValue(100);
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw4_ps').setMaxValue(100);
				} else {
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw1_ps').setMaxValue(10000);
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw2_ps').setMaxValue(10000);
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw3_ps').setMaxValue(10000);
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('ck_tw4_ps').setMaxValue(10000);
				}
				
				if (xtags !=null) {
					const xtagarr= xtags.split(','); //replace("{","[").replace("}","]");
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('tagss').setValue(xtagarr);
				} else {
					Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('tagss').setValue("");
				}
				
				//Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('tags').setValue(["Indikator Makro","Prioritas Nasional"]);
			},
	   
			failure: function(response, opts) {
				Ext.toast({ message: 'Gagal Load data!', alignment: 'tc-tc', timeout: 2000 });
			}
		});
		
		//Ext.getCmp('form-indikator-kinerja-capkin-kota').lookupName('tags').setValueCollection('{"Satu","Dua","Tiga"}');
		
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
			items:[{xtype:'capkin-form-print'}],
		});
		dialog.show();

		xForm=dialog.down('formpanel');
		xForm.lookupName('pid_sub_pd').setValue(0);
		xForm.lookupName('pid_pd').setValue(0);
		xForm.lookupName('report_name').setValue(btn.rptname);
		xForm.lookupName('ispd').setValue(1);
		/*
		var rptnama='dalev/'+btn.rptName;
		
		xForm.lookupName('kd_urusan').setValue(dalev_kd_urusan);
		xForm.lookupName('kd_bidang').setValue(dalev_kd_bidang);
		xForm.lookupName('kd_unit').setValue(dalev_kd_unit);
		xForm.lookupName('kd_pd').setValue(dalev_kd_pd);
		*/
	},

	
	
});
