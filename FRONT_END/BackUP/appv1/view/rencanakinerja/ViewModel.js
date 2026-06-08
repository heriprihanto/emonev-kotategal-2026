Ext.define('Admin.view.rencanakinerja.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],

	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null, selectedProgram: null, selectedKegiatan: null, selectedNode: null
	},
	stores: {
		opdStore: {
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
		subPdStore: {
			fields: ['id', 'idmisi', 'tujuan', 'Kd_1', 'Kd_2', 'Kd_3'],
			proxy: {
				type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
				url: REMOTE_URL + 'rencanakinerja/subpd',
				reader: {
					type: 'json',
					rootProperty: 'data',
				},
				writer: {
					type: 'json'
				},
				listeners: { exception: function (proxy, response, operation) { Ext.toast({ message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000 }); } }
			},
			sortInfo: { field: 'id_sub_pd', direction: 'ASC' }, autoLoad: false
		},

		tujuanSasaranStore: {
			//model: 'Admin.model.RfkPekerjaanModel',
			fields: ['id', 'nama_dokumen'],
			proxy: {
				type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
				url: REMOTE_URL + 'rencanakinerja/tujuansasaran',
				listeners: { exception: function (proxy, response, operation) { Ext.toast({ message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini  </h1><br/>', timeout: 2000 }); } }
			},
			type: 'tree', rootVisible: false, autoLoad: false,
			root: { text: 'Root', id: 'data', expanded: true, children: [] },
		},

		programKegiatanStore: {
			//model: 'Admin.model.RfkPekerjaanModel',
			fields: ['id', 'nama_dokumen'],
			proxy: {
				type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
				url: REMOTE_URL + 'rencanakinerja/kegiatanlist',
				listeners: { exception: function (proxy, response, operation) { Ext.toast({ message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini  </h1><br/>', timeout: 2000 }); } }
			},
			type: 'tree', rootVisible: false, autoLoad: false,
			root: { text: 'Root', id: 'data', expanded: true, children: [] },
		},


		
		indikatorStore: {
			fields: ['id', 'idmisi', 'tujuan', 'Kd_1', 'Kd_2', 'Kd_3'],
			proxy: {
				type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
				url: REMOTE_URL + 'rencanakinerja/indikatorlist',
				reader: {
					type: 'json',
					rootProperty: 'data',
				},
				writer: {
					type: 'json'
				},
				listeners: { exception: function (proxy, response, operation) { Ext.toast({ message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000 }); } }
			},
			sortInfo: { field: 'id_sub_pd', direction: 'ASC' }, autoLoad: false
		},
		
	}

});
