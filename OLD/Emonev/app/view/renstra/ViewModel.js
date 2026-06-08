Ext.define('Admin.view.renstra.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedData: null,selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null
	},
	stores: {
		renstraStore:{
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
				proxy: {
					type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
						url: REMOTE_URL + 'renstra',
						//listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini...  </h1><br/>', timeout: 2000});}}
					},
			//sortInfo: {field: 'id', direction: 'ASC'},
			type: 'tree',autoLoad: false, 
			rootVisible: false,
			root: {text: 'Root',id: 'data',expanded: true,children : []},
		},

		opdStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
				url: REMOTE_URL + 'kinerja/opd',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini </h1><br/>', timeout: 2000});}}
				},
				sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: true
		},
		indikatorStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'renstra-indikator',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<h3> Error Koneksi Database , Refresh Halaman Ini </h3>', timeout: 2000});}}
				},
				sortInfo: {field: 'id', direction: 'ASC'},autoLoad: false
		},
		/*
		kegiatanStore: {
			model: 'Admin.model.CapkinKegiatanModel',type: 'tree',rootVisible: false,autoLoad: false, 
			root: {text: 'Root',id: 'data',expanded: true,children : []},
		},
		indProgramStore: {
			model: 'Admin.model.CapkinIndikatorProgramModel'
		},
		indKegiatanStore: {
			model: 'Admin.model.CapkinIndikatorKegiatanModel'
		},
		indSubKegiatanStore: {
			model: 'Admin.model.CapkinIndikatorSubKegiatanModel'
		},
		refindProgramStore: {
			model: 'Admin.model.RefIndikatorProgramModel'
		},
		*/
	}
	
});
