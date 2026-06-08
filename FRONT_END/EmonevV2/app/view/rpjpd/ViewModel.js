Ext.define('Admin.view.rpjpd.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],

	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null, selectedProgram: null, selectedKegiatan: null, selectedNode: null
	},
	stores: {
		rpjpdStore: {
			fields: ['id', 'idmisi', 'tujuan', 'Kd_1', 'Kd_2', 'Kd_3'],
			proxy: {
				type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
				url: REMOTE_URL + 'rencanakinerja/opd',
				reader: {
					type: 'json',
					rootProperty: 'data',
				},
				writer: {
					type: 'json'
				},
				listeners: { exception: function (proxy, response, operation) { Ext.toast({ message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000 }); } }
			},
			sortInfo: { field: 'id_sub_pd', direction: 'ASC' }, autoLoad: true
		},
		
	}

});
