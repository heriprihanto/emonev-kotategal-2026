let tools_id_opd=0,
tools_tahun=vTAHUN,
tools_kd_urusan=0,
tools_kd_bidang=0,
tools_kd_unit=0,
tools_kd_sub=0,
tools_nm_sub_unit='',tools_nm_unit='';

var xpersonelStore=null;


Ext.define('Admin.view.pengaturan.Controller', {
	extend: 'Admin.base.ViewController',

	initTabItem:function () {
		if (isAdmin == false) {
			
		}

		xThis=this;
	},

	editUser: function (btn) {

		var dialog = Ext.create({
			xtype: 'dialog',
			title: 'Pengaturan Hak Akses Pengguna', shadow: 'true',
			width: 550, height: 600,
			items: [
				{ xtype: 'form-hak-akses-user' }
			],
		});
		dialog.show();
		var form = dialog.down('formpanel');
		var cell = btn.up().up().up(), rec = cell.getRecord();
		form.setRecord(rec);
		Ext.getCmp('pengaturan-user-roles-list').getStore().load({
			params:{
				'userid':9990
			}
		})

	},

	simpanUser: function (btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'pengaturan/updateuser',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						success: function(f,r,d) {	
							xThis.getStore('userStore').reload();
							xThis.toastPesan('success','Data Berhasil Disimpan  !!',2000);
							xDiag.destroy();
						},
						failure: function(form, o) {	
							var ermsg= JSON.parse(o.responseText);
							xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);			
						}						
					});
        } else {
			this.toastPesan('error','Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},
	
	onActionSearch:function(a,e,o){
		var searchValue=a.getValue();
		var xStore = this.getStore('userStore');		
	
			if (!Ext.isEmpty(xStore)) {
				xStore.clearFilter();

				if (!Ext.isEmpty(searchValue)) {
					var regEx  = new RegExp(searchValue, 'i'),
						fields = ['display_name','namaopd','nip','email','no_telp'],
						i;
					xStore.filterBy(function (rec) {
						for (i = 0; i < fields.length; i++) {
							if (regEx.test(rec.get([fields[i]]))) {
								return true;
							}
						}
					});
				}
			}
	},
	onClearIconTapSearch:  function(){
			 var xStore = this.getStore('userStore');
				if (!Ext.isEmpty(xStore)){
					xStore.clearFilter()
				}
	
       
	},

	aktivasi: function (btn) {	
		var cell = btn.up().up().up(), rec = cell.getRecord();

		Ext.Ajax.request({
			url: REMOTE_URL+'pengguna/aktivasi',
			params: {
				'method':'delete','id':rec.get('id'),'is_active':rec.get('role_id'),'username':rec.get('username'),'no_telp':rec.get('no_telp'),
			},
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				console.dir(obj);
				xThis.toastPesan('success','User Berhasil Diaktivasi !! ::', 2000);
				store.reload();
			},
	   
			failure: function(response, opts) {
				xThis.toastPesan('error','Gagal aktivasi user !', 2000);
			}
		});
	},
	reset: function (btn) {	
		var cell = btn.up().up().up(), rec = cell.getRecord();
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan mereset password ?',
        function (answer) {
            if (answer === 'yes'){            	
            	Ext.Ajax.request({
					url: REMOTE_URL+'pengaturan/reset_password/'+rec.get('id'),method:'post',
					/*params: {
						'method':'delete','id':rec.get('id'),'salt':rec.get('salt'),'username':rec.get('username'),'no_telp':rec.get('no_telp'),
					},*/
					success: function(response, opts) {
						var obj = Ext.decode(response.responseText);
						console.dir(obj);
						xThis.toastPesan('success','Password User Berhasil Direset !! ::', 2000);
						xThis.getStore('userStore').reload();
					},
			   
					failure: function(response, opts) {
						xThis.toastPesan('error','Gagal reset password !', 2000);
					}
				});
			}
        });
	},
	hapus: function (btn) {	
		var cell = btn.up().up().up(), rec = cell.getRecord();
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan mereset password ?',
        function (answer) {
            if (answer === 'yes'){            	
            	Ext.Ajax.request({
					url: REMOTE_URL+'pengaturan/delete-user/'+rec.get('id'),method:'delete',
					/*params: {
						'method':'delete','id':rec.get('id'),'salt':rec.get('salt'),'username':rec.get('username'),'no_telp':rec.get('no_telp'),
					},*/
					success: function(response, opts) {
						var obj = Ext.decode(response.responseText);
						console.dir(obj);
						xThis.toastPesan('success','Password User Berhasil Dihapus !! ::', 2000);
						xThis.getStore('userStore').reload();
					},
			   
					failure: function(response, opts) {
						xThis.toastPesan('error','Gagal hapus user !', 2000);
					}
				});
			}
        });
	},
	onOpdSelect: function (t,v,o) {
		console.log(v.data.nm_sub_unit);
		tools_nm_sub_unit = v.data.nm_sub_unit;
		//Ext.getCmp("frm_assets_kecamatan").setValue(v.data.kec);
	},

});
