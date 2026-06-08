Ext.define('Admin.view.mri.cee.Controller', {
	extend: 'Admin.base.ViewController',

	cariOPD: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['nama_pd'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariOPD: function () { var xStore = this.getStore('opdStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },
	
	cariIndikator: function (a, e, o) {
		var searchValue = a.getValue(); var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter(); if (!Ext.isEmpty(searchValue)) { var regEx = new RegExp(searchValue, 'i'), fields = ['tolok_ukur','slvl'], i; xStore.filterBy(function (rec) { for (i = 0; i < fields.length; i++) { if (regEx.test(rec.get([fields[i]]))) { return true; } } }); } }
	},
	clearCariIndikator: function () { var xStore = this.getStore('indikatorStore'); if (!Ext.isEmpty(xStore)) { xStore.clearFilter() } },
	
	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
			
		this.getStore('subPdStore').load({
			params: {
				ptahun : vTAHUN,
				pid_pd : capk_id_pd,
				//pkd_tahap:	capk_kd_tahap
			}
		});
	}
});
