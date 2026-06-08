Ext.define('Admin.view.kinerja.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
		selectedOpd: null,selectedProgram:null,selectedKegiatan:null,selectedNode:null,
		tempData: {
			tahun :2026,
            capk_id_pd : 0, capk_is_pd : 0, capk_id_sub_pd : 0, capk_id_indikator : 0, capk_indikator_lvl : 0,
			capk_tahun : vTAHUN, capk_nm_pd : '', capk_nm_sub_pd : '',
			capk_ref_kd_urusan : 0, capk_kd_tahap : 1, capk_id_tahap : 0, capk_id_subkegiatan : 0, capk_id_program : 0,
			capk_ref_kd_bidang : 0, capk_v1 : 0, capk_v2 : 0, capk_current_tw : 0, capk_current_tw_locked : 0,capk_id_laporan:0,
			xcapkintahap : null, xcapkinStore : null, xThis : null,isFSC : 0,
			idxIndikatorStore :null, 
			xIndikatorStore: null,idxIndikatorKotaStore : null,xIndikatorKotaStore :null
        },
        headerTitle: 'Rencana Kinerja',
		current_tw: 1
	},
	formulas: {
        // otomatis hitung persen TW aktif
        capkinPersen(get) {
            const tw = get('current_tw');
            const tv = get(`formData.ck_tw${tw}`);
            const tg = get('formData.target');
            const formula = get('formData.idformula');
            const tipe = get('formData.tipedata');

            if (!tg) return 0;

            if (tipe == 1) return tv === tg ? 100 : 0;

            return formula == 1
                ? (tv / tg) * 100
                : ((tg - (tv - tg)) / tg) * 100;
        }
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
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
				},
				sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: true
		},
		subPdStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'kinerja/subpd',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
				},
				sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: false
		},
		twStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'kinerja/laporantw',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
				},
				sortInfo: {field: 'tw', direction: 'ASC'},autoLoad: false
		},
		indikatorKotaStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'kinerjakota/indikator',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
				},
				sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: false
		},
		indikatorStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'kinerja/indikator',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
				},
				sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: false
		},
		anggaranStore: {
			fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
			proxy: {
				type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'kinerja/anggaran',
					reader: {
						type: 'json',
						rootProperty: 'data',
					},
					writer: {
						type: 'json'
					},
					listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
				},
				sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: false
		},
		opdVerifikasiStore: {
			fields: ['id', 'idmisi', 'tujuan', 'Kd_1', 'Kd_2', 'Kd_3'],
			proxy: {
				type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
				url: REMOTE_URL + 'kinerja/opdverified',
				reader: {
					type: 'json',
					rootProperty: 'data',
				}
			},
			sortInfo: { field: 'id_sub_pd', direction: 'ASC' }, autoLoad: false
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
