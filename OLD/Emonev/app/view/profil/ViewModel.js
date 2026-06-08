Ext.define('Admin.view.profil.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null
	},
	stores: {
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
		}
	}
	
});
