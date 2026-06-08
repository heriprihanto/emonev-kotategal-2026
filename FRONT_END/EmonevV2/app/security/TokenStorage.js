Ext.define('Admin.security.TokenStorage', {
    singleton: true,
    storageKey: 'emonev-jwt-2026-p076d-ds345-0986',

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
							console.log("SAVE SESSION");
							var vm =  ths.getViewModel(); 
							vm.set('username', r.userdata.username);
							vm.set('nm_sub_unit', r.userdata.nm_sub_unit);
							vm.set('display_name', r.userdata.display_name);
							vm.set('nama_pd', r.nama_pd);
						
							vUSER_INFO=r.userdata;							
							//xDiag.destroy();
							/*
                            ths.getView().removeAll() ;								
							ths.setModulView('dashboard');
                            ths.redirectTo('dashboard');
							Ext.getCmp("xMainToolbar").show();
        					Ext.getCmp("xMainFooter").show();
							console.log(vUSER_INFO);
							console.log(parseInt(vUSER_INFO.id_instansi));
							ROLE_ID_APP = r.userdata.role_id;
							*/
							Ext.getCmp("mainDesktopContainer").setHidden(false);
							Ext.getCmp("desktopTaskbarTop").setHidden(false);
							Ext.getCmp("desktopTaskbar").setHidden(false);
							ROLE_ID_APP = vUSER_INFO.role_id;
							
							if (ROLE_ID_APP > 3){ isAdmin=false; } else {isAdmin=true;}
							if (ROLE_ID_APP > 3){ isUser=true; } else {isUser=false;}
							vNAMA_OPD = r.userdata.nm_sub_pd;
							Ext.Ajax.setDefaultHeaders({'Authorization': 'Bearer '+ XAPITOKEN});
							//Ext.Ajax.setExtraParams({'username':vUSER_INFO.username,'nama_user':vUSER_INFO.display_name,'roleid':vUSER_INFO.role_id,'role':vUSER_INFO.role,'id_sub_pd':vUSER_INFO.id_sub_pd,'idpd':vUSER_INFO.id_instansi,'token':r.token});
							Ext.Ajax.setCors(true);
							
							//Ext.Ajax.setWithCredentials(true);					
    },
});