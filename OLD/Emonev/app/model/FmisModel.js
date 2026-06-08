Ext.define('Admin.model.FmisModel', {
	extend: 'Ext.data.Model',
	fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
	proxy: {
		type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
			url: REMOTE_URL + 'renja/fmis',
			listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini... ', timeout: 2000});}}
		},
		sortInfo: {field: 'kode_program', direction: 'ASC'},
});
