Ext.define('Admin.model.RfkPekerjaanModel', {
	extend: 'Ext.data.Model',
	fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
	proxy: {
		type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
			url: REMOTE_URL + 'rfk/data',
			listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini  </h1><br/>', timeout: 2000});}}
		},
		sortInfo: {field: 'nomor_pekerjaan', direction: 'ASC'},
});
