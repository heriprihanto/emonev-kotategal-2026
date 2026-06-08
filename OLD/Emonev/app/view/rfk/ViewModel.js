Ext.define('Admin.view.rfk.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null,selectedPhoto:null,
		a1: 0,r1: 0,r2: 0,r3:0
	},
	stores: {
		opdStore: {
			model: 'Admin.model.RfkOpdModel',autoLoad: true
		},
		lapbulananStore: {
			model: 'Admin.model.RfkBulanModel',autoLoad:false
		},
		/*
		pekerjaanStore: {
			model: 'Admin.model.RfkPekerjaanModel',autoLoad: false
		},
		*/
		pekerjaanStore: {
			//model: 'Admin.model.RfkPekerjaanModel',
			fields: ['id', 'nama_dokumen'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'rfk/',
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini  </h1><br/>', timeout: 2000});}}
				},
			type: 'tree',rootVisible: false,autoLoad: false, 
			root: {text: 'Root',id: 'data',expanded: true,children : []},
		},
		/*
		pekerjaanStore: {
			model: 'Admin.model.RfkPekerjaanModel',autoLoad: false, 
			groupField: 'progkeg',
    		sorters: ['id'],

		},
		*/
		mappingStore: {
			model: 'Admin.model.FmisModel'
		},
		mapping2Store: {
			model: 'Admin.model.Fmis2Model'
		},
		fotoStore: {
			model: 'Admin.model.RfkFotoModel',autoLoad: false
		},
		anggaranStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'rfk/realkeuangan',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
				},
				sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: false,
				groupers: ['program', 'kegiatan'],
				

		},
	}
	
});
