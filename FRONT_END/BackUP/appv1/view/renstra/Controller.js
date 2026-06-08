Ext.define('Admin.view.renstra.Controller', {
	extend: 'Admin.base.ViewController',

	init: function () {
		console.log("KINERJA INIT");
		//xDataIndikatorModel = Ext.create('Admin.view.kinerja.FormModel');
	},

	OpdList_itemClick: function (grid, records) {
		const id_pd = records.record.data.id_pd;
		window.open(`https://monevrkpd.tegalkota.go.id/birt_report/preview?__report=report/renstra/renstra_pd.rptdesign&id_pd=${id_pd}`)
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
