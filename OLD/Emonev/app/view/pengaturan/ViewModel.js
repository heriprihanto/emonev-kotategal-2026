Ext.define('Admin.view.pengaturan.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null
	},
	stores: {
		opdStore: {
			model: 'Admin.model.UserOpdModel',autoLoad: true
		},
		userStore: {
			model: 'Admin.model.UserModel',autoLoad: true
		},
	}
	
});
