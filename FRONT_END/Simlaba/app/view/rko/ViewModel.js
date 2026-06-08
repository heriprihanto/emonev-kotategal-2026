Ext.define('Admin.view.rko.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null
	},
	stores: {
		opdStore: {
			model: 'Admin.model.RkoOpdModel',autoLoad: true
		},
		kegiatanStore: {
			model: 'Admin.model.RkoKegiatanModel',type: 'tree',rootVisible: false,autoLoad: false, 
			root: {text: 'Root',id: 'data',expanded: true,children : []},
		},
		pekerjaanStore: {
			model: 'Admin.model.RkoPekerjaanModel',autoLoad: false
		},
		personelStore: {
			model: 'Admin.model.RkoPersonelModel',autoLoad: false
		},
		tahapanStore: {
			model: 'Admin.model.RkoTahapModel',autoLoad: false
		},
	}
	
});
