Ext.define('Admin.model.RfkFotoModel', {
	extend: 'Ext.data.Model',
	fields: ['id', 'filename', 'jenis','ket','Kd_2','Kd_3'],
	proxy: {
		type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
			url: REMOTE_URL + 'rfk/fotolist',
			//listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini  </h1><br/>', timeout: 2000});}}
		},
		sortInfo: {field: 'nomor_pekerjaan', direction: 'ASC'},
});
