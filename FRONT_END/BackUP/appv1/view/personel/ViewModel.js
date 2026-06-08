Ext.define('Admin.view.personel.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null
	},
	stores: {
		opdStore: {
			model: 'Admin.view.personel.PersonelOpdModel',autoLoad: true
		},
		personelStore: {
			model: 'Admin.view.personel.PersonelModel',autoLoad: false
		},
	}
	
});
