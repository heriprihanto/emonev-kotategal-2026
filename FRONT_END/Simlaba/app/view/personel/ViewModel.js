Ext.define('Admin.view.personel.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null
	},
	stores: {
		opdStore: {
			model: 'Admin.model.PersonelOpdModel',autoLoad: true
		},
		personelStore: {
			model: 'Admin.model.PersonelModel',autoLoad: false
		},
	}
	
});
