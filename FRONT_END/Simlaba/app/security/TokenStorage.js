Ext.define('Admin.security.TokenStorage', {
    singleton: true,
    storageKey: 'laba-jwt-nnjo09098disTrecpsd',

    clear: function () {
        localStorage.removeItem(this.storageKey);
    },

    retrieve: function() {
        return localStorage.getItem(this.storageKey);
    },

    save: function (token) {
        localStorage.setItem(this.storageKey, token);
    },

    saveSession: function (ths,r) {         
							//XAPITOKEN=r.token;
							var vm =  ths.getViewModel(); 
							vm.set('username', r.userdata.username);
							vm.set('nm_sub_unit', r.userdata.nm_sub_unit);
							vm.set('display_name', r.userdata.display_name);
						
							vUSER_INFO=r.userdata;							
							//xDiag.destroy();
                            ths.getView().removeAll() ;								
							ths.setModulView('dashboard');
                            ths.redirectTo('dashboard');
							Ext.getCmp("xMainToolbar").show();
        					Ext.getCmp("xMainFooter").show();
							console.log(vUSER_INFO);
							console.log(parseInt(vUSER_INFO.id_instansi));
							ROLE_ID_APP = r.userdata.role_id;
							if (ROLE_ID_APP > 3){ isAdmin=false; } else {isAdmin=true;}
							if (ROLE_ID_APP > 3){ isUser=true; } else {isUser=false;}
							vNAMA_OPD = r.userdata.nm_sub_pd;
							Ext.Ajax.setDefaultHeaders({'Authorization': 'Bearer '+ XAPITOKEN});
							//Ext.Ajax.setExtraParams({'username':vUSER_INFO.username,'nama_user':vUSER_INFO.display_name,'roleid':vUSER_INFO.role_id,'role':vUSER_INFO.role,'id_sub_pd':vUSER_INFO.id_sub_pd,'idpd':vUSER_INFO.id_instansi,'token':r.token});
							Ext.Ajax.setCors(true);
							
							//Ext.Ajax.setWithCredentials(true);					
    },
});