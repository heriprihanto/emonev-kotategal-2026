Ext.define('Admin.model.UserModel', {
	extend: 'Ext.data.Model',
	fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
	proxy: {
		type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
			url: REMOTE_URL + 'pengaturan/userlist',
			reader: {
				type: 'json',
				rootProperty: 'data',
			},
			writer: {
                type: 'json'
            },
			listeners : {exception : function(proxy, response, operation) {Ext.toast({message: 'Error Koneksi Database , Refresh Halaman Ini', timeout: 2000});}}
		},
		sortInfo: {field: 'id', direction: 'ASC'},
});
