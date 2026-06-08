let rko_id_opd=0,
rko_tahun=vTAHUN,
rko_kd_urusan=0,
rko_kd_bidang=0,
rko_kd_unit=0,
rko_kd_sub=0,
rko_ket_program='',
rko_kd_prog=0,
rko_kd_keg=0,
rko_ket_kegiatan='',
rko_kd_urusan1=0,
rko_kd_bidang1=0,
rko_id_prog=0,
rko_nm_sub_unit='',rko_nm_unit='',
rko_kd_misi='',
rko_misi='',
rko_kd_tujuan='',
rko_tujuan='',
rko_kd_tujuan_indik='',
rko_tujuan_indik='',
rko_kd_sasaran='',
rko_sasaran='',
rko_user1='',rko_user2='',
rko_ref_kd_urusan=0,rko_kd_tahap=0,rko_id_tahap=0,
rko_ref_kd_bidang=0,rko_v1=0,rko_v2=0;
var rkoMap=null;

var xrkotahap=null,xrkoStore=null,xThis=null;

let isFS=0;

Ext.define('Admin.view.rko.Controller', {
	extend: 'Admin.base.ViewController',
	requires: [ 'Ext.Toast' ],	
	initTabItem:function () {
		Ext.getCmp('btnbalik-0909092kd0943').show();
		/*
		if (isAdmin == false) {
			this.getView().down('tabpanel').setActiveItem(1);
			Ext.fly('nama-opd-rko-module').update('<b>::: ' + vNAMA_OPD +' :::</b>');
			rko_id_opd = vUSER_INFO.id_opd;
			rko_kd_urusan = vUSER_INFO.kd_urusan;
			rko_kd_bidang = vUSER_INFO.kd_bidang;
			rko_kd_unit = vUSER_INFO.kd_unit;
			rko_kd_sub = vUSER_INFO.kd_sub;
			rko_nm_sub_unit = vNAMA_OPD;
			this.getStore('tahapanStore').load({
				params: {
					ptahun : vTAHUN,
					pid_sub_pd : rko_id_opd	
				}
			});
			xrkotahap=this.getStore('tahapanStore');
			this.getStore('personelStore').load({
				params: {
					ptahun : vTAHUN,
					pid_sub_pd : rko_id_opd	
				}
			});
			Ext.getCmp('btnbalik-0909092kd0943').hide();
		}*/
		xThis=this;
		console.log('isAdmin:'+isAdmin+' isUser:'+isUser);
	},

	init: function (grid) {
        if (Ext.os.is.Desktop) {
            Ext.getCmp('kegiatan-rko-list').el.on({
                scope: this,contextmenu: this.onContextMenu
            });
        }
    },
    destroy: function () {
        this.toolMenu = Ext.destroy(this.toolMenu);
        this.callParent();
	},
	onContextMenu: function (e) {
        var grid = Ext.getCmp('kegiatan-rko-list'),target = e.getTarget(grid.itemSelector),item;
        if (target) {
            e.stopEvent();
            item = Ext.getCmp(target.id);
            if (item) {this.updateMenu(item.getRecord(), item.el, e, 't-b?');}
        }
    },
	getMenu: function (lvl) {
        var menu = this.toolMenu,view = Ext.getCmp('kegiatan-rko-list');
		var cMenu = null;
		if (lvl == 3) {
			cMenu = view.menuSubKeg;
		} else if (lvl == 4) {
			cMenu = view.menuPekerj;
		} 
        this.toolMenu = menu = Ext.create(Ext.apply({ownerCmp: view},cMenu ));
        return menu;
    },

    onMenu: function (grid, context) {
		this.getViewModel().set('record', context.record.getData());
		this.getViewModel().set('recordTree', context.record);
		var menu = this.getMenu(context.record.get('lvl')); 
        menu.autoFocus = !context.event.pointerType;
        menu.showBy(context.tool.el, 'r-l?');
    },
	loadPersonel: function (q ,eOpts ) {
		q.combo.getStore().load({
			params: {
				ptahun : vTAHUN,
				pid_sub_pd : rko_id_opd
			}
		});
	},
	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
		Ext.fly('dt-entry__header_rko').update('<i class="x-fa fa-calendar-check" aria-hidden="true"></i>  RKO :: <small>' + records.record.data.nama_pd +' </small>');
		rko_id_opd = records.record.data.id_sub_pd;
		rko_nm_sub_unit = records.record.data.nm_sub_pd;
		
		this.getStore('personelStore').load({
			params: {
				ptahun : vTAHUN,
				pid_sub_pd : rko_id_opd	
			}
		});
		
		this.getStore('tahapanStore').load({
			params: {
				ptahun : vTAHUN,
				pid_sub_pd : rko_id_opd	
			}
		});
		xrkotahap=this.getStore('tahapanStore');
	},

	TahapList_itemClick:function (grid, records) {
		
		rko_kd_tahap = records.record.data.kd_tahap;
		rko_id_tahap =records.record.data.id;

		var isVerifAdmin=records.record.data.v1;
		if (isAdmin == false) {
			if (parseInt(isVerifAdmin) > 0){
				this.toastPesan('error','RKO sudah terkunci !!',1500);
				return false;
			}
			this.openPekerjaanList() ;
		}	else {
			this.openMenuVerifikasi();
		}	

		rko_v1 =records.record.data.v1;
		rko_v2 =records.record.data.v2;
		//rko_
				
	},
	openPekerjaanList: function() {
		this.getView().down('tabpanel').setActiveItem(2);
		this.getStore('kegiatanStore').load({
			params: {
				ptahun : vTAHUN,
				pid_sub_pd : rko_id_opd,
				pkd_tahap:	rko_kd_tahap
			}
		});
		xrkoStore=this.getStore('kegiatanStore');
	},

	hideActionSheet: function() {
        this.getView().actionsheet.hide();
    },
	openMenuVerifikasi: function() {
        var view = this.getView(),
            actionsheet = view.menuVerifikasi;

        if (!actionsheet.isComponent) {
            actionsheet.defaults = {
                handler: this.hideActionSheet,
                scope: this
            };

            actionsheet = view.actionsheet = Ext.Viewport.add(actionsheet);
        }

        actionsheet.show();
    },

	openRko: function() {
		this.openPekerjaanList();
		this.hideActionSheet();
	},
	verifikasiRko: function() {
		if (rko_v1 <1){this.toastPesan('error','RKO belum diverivikasi oleh OPD !',2000);return false}
		if (rko_v2 >0){this.toastPesan('error','RKO sudah diverifikasi !',2000);return false}	
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan verifikasi RKO ?',
            function (answer) {
                if (answer === 'yes'){
					this.verifyAction(rko_id_tahap,'v2');
				}
            },this);
	},
	batalRko: function() {	
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan membatalkan verifikasi RKO ?',
            function (answer) {
                if (answer === 'yes'){
					this.verifyAction(rko_id_tahap,'cancel');
				}
            },this);
	},

	verifyAction:function(idl,mtd){
		Ext.Ajax.request({
			url: REMOTE_URL +'rko/verifikasirko',jsonSubmit :true,
			scrollable: true,
			jsonData: {
				'id_tahap':idl,'method':mtd,'id_sub_pd':rko_id_opd
			},
			success: function(f,r,d) {
				xThis.toastPesan('success','RKO berhasil verifikasi !!', 2000);
				xrkotahap.reload();
			},
			failure: function(form, o) {
				var ermsg= JSON.parse(o.responseText);
					xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);	
			}
		},this);
	},
	
	formSubkeg_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			maximizable: true,
			title: 'Form Kegiatan',  shadow: 'true',width:550,height:'90%',scrollable: true,
			items:[{xtype:'rko-form-kegiatan'}],
		});
		dialog.show();
		var xmode=btn.mode;
		var rec =this.getViewModel().get('recordTree'); 
	},

	updateMap: function (rec) {
		let xlat = 0, xlng = 0;
		if (rec.get('frm_lat') == null) {
			xlat = -6.8730507; xlng = 109.1197931;
		} else {
			xlat = rec.get('frm_lat'); xlng = rec.get('frm_lng');
		}

		
		
		if (!rkoMap) {
			rkoMap = new L.map('form-maps-lokasi-rko', { 
				center: [xlat, xlng],
				zoom: 13
			});
		} else {
			rkoMap.remove();
			rkoMap = new L.map('form-maps-lokasi-rko', { 
				center: [xlat, xlng],
				zoom: 13
			});
		}
		
		
		var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		
		 
		rkoMap.addLayer(layer);
		rkoMap.addControl(L.control.search());
		var marker = L.marker([xlat, xlng]).addTo(rkoMap);
		marker.bindPopup('Alun Alun Kota Tegal');

		var nmarker = null;

		rkoMap.on("click", function (e) {
			//if (nmarker) {
			marker.remove();

			marker = new L.Marker([e.latlng.lat, e.latlng.lng]);
			marker.addTo(rkoMap);

			Ext.getCmp("frm_lat").setValue(e.latlng.lat.toString());
			Ext.getCmp("frm_lng").setValue(e.latlng.lng.toString());
			//console.log(parent.Ext.getCmp("frm_lng"));
		});
		
	},

	formPekerjaan_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			maximizable: true,
			title: 'Form Pekerjaan',  shadow: 'true',
			responsiveConfig: {
				'width < 800': {
					width:'95%',height:'90%',
				},
				'width >= 800': {
					width:'80%',height:'90%',
				}
			},
			scrollable: true,
			items:[{xtype:'rko-form-pekerjaan'}],
		});
		dialog.show();
		var xmode=btn.mode;
		var rec =this.getViewModel().get('recordTree');
		//dialog.down('formpanel').lookupName('sub_kegiatan').setValue(rec.get('sub_kegiatan'));
		dialog.down('formpanel').lookupName('id_subkegiatan').setValue(rec.get('idsubkegiatan'));
		dialog.down('formpanel').lookupName('id_sub_pd').setValue(rko_id_opd);
		dialog.down('formpanel').lookupName('tahun').setValue(vTAHUN);
		dialog.down('formpanel').lookupName('kd_tahap').setValue(rko_kd_tahap);

		if (xmode=='edit'){
			dialog.down('formpanel').setRecord(rec);
			
		}	
		this.updateMap(rec);
	},

	formSubkegiatan_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			maximizable: true,
			title: 'Sub Kegiatan',  shadow: 'true',width:500,height:500,scrollable: true,
			items:[{xtype:'rko-form-subkegiatan-rencana'}],
		});
		dialog.show();
		var xmode=btn.mode;
		var rec =this.getViewModel().get('recordTree');
		dialog.down('formpanel').setRecord(rec);
	},
	
	formRencana_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			maximizable: true,
			title: 'Rencana Pelaksanaan Pekerjaan',  shadow: 'true',width:500,height:'90%',scrollable: true,
			items:[{xtype:'rko-form-pekerjaan-rencana'}],
		});
		dialog.show();
		var xmode=btn.mode;
		var rec =this.getViewModel().get('recordTree');
		dialog.down('formpanel').setRecord(rec);		
		Ext.fly('detailPekerjaan09088623857874').update('<b>::: ' + rec.get('nama_pekerjaan') +' :::</b>');
	},
	formSipd_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			maximizable: true,
			title: 'Sinkronisasi Data DPA dengan SIPD',  shadow: 'true',width:500,height:480,scrollable: true,
			items:[{xtype:'rko-form-sipd'}],
			
		});
		dialog.show();
		var xForm=dialog.down('formpanel');
		this.genCaptcha();
	},

	genCaptcha: function () {
		document.getElementById("sipdcaptcharko").innerHTML = "Loading Captcha";
		
		Ext.Ajax.request({
			method: 'GET',
			url: REMOTE_URL + 'sipd/getcaptcha', 
			//params: {'token':xtoken,'app':'laba'},
			waitMsg: 'Loading...',
			success: function (response, request) {
				var r = Ext.decode(response.responseText); 
				//console.log(r.base64)	 
				document.getElementById("sipdcaptcharko").innerHTML = "";
				let imgc = document.createElement('img');
				imgc.src ="data:image/png;base64, "+r.base64;	
				document.getElementById("sipdcaptcharko").appendChild(imgc); 
				Ext.getCmp("sipdchaptchaidrko").setValue(r.id);
			},
			failure: function (conn, response, options, eOpts) {
				zTHIS.setModulView('login');
			}
		});

        
		
	},
	updateDpaSipd:function (btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'sipd/update-dpa-sipd',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						//params: {tahun : vTAHUN,kd_tahap : rko_kd_tahap,id_sub_pd:rko_id_opd},
						success: function(f,r,d) {	
							xrkoStore.reload();
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
	formVerifikasiPD_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			maximizable: true,
			title: 'Verifikasi RKO',  shadow: 'true',width:500,height:420,scrollable: true,
			items:[{xtype:'rko-form-verifikasi-opd'}],
		});
		dialog.show();
		var xForm=dialog.down('formpanel');

			Ext.Ajax.request({
				method: 'GET',
				url: REMOTE_URL + 'rko/getverify', params: {'id_sub_pd':rko_id_opd,'kd_tahap': rko_kd_tahap},waitMsg: 'Loading...',
				success: function (response, request) {
						var jsonData = Ext.decode(response.responseText);
						xForm.lookupName('pagu_kegiatan').setValue(jsonData.a);
						xForm.lookupName('pagu_pekerjaan').setValue(jsonData.b);
						selisih = Number(jsonData.a) - Number(jsonData.b);
						xForm.lookupName('s').setValue(selisih);
						xForm.lookupName('rencana_fisik').setValue(jsonData.c);
					},
					failure: function (conn, response, options, eOpts) {
						Ext.toast('Error', 'Error retrieve data !!');
					}
				});
	},
	
	simpanVerifikasiRkoOpd:function(btn){
			var form = btn.up().up('formpanel');
			var dialog=btn.up().up().up();
			var a=form.lookupName('pagu_kegiatan').getValue(),
			b=form.lookupName('pagu_pekerjaan').getValue(),
			s=form.lookupName('s').getValue(),c=form.lookupName('rencana_fisik').getValue();
			
			
			if (a != b || a == 0) {
				this.toastPesan('error','Data tidak valid !! <br>Cek kembali data anda ! pastikan anda sudah memasukan data pekerjaan dengan benar !!',2000);
				return false;
			}
			if (s != 0) {
				this.toastPesan('error','Data tidak valid !! <br>Cek kembali data anda ! pastikan anda sudah memasukan data pekerjaan dengan benar !!',2000);
				return false;
			}
			if (Number(c) < 100) {
				this.toastPesan('error','Data tidak valid !! <br>Cek kembali data anda ! pastikan anda sudah memasukan rencana data pekerjaan dengan benar !!',2000);
				return false;
			}
			

			form.submit({
				url: REMOTE_URL + 'rko/verifikasirko',
				scope:this,
				method: 'POST',waitMsg:'Simpan data...',
				params: {
					save: 'ok','id_sub_pd':rko_id_opd,'id_tahap':rko_id_tahap,'username':vUSER_INFO.username,'method':'v1','nm_opd':rko_nm_sub_unit
				},
				success: function() {
					xThis.toastPesan('success','RKO berhasil diverifikasi',2000);
					xrkotahap.reload();
					dialog.destroy();
					xThis.getView().down('tabpanel').setActiveItem(0);
				},
				failure: function(form, o) {
					var ermsg= JSON.parse(o.responseText);
					xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);	
					
								
				}
			});
	},

	simpanPekerjaanRencana: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'rko/save-rencana',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						//params: {tahun : vTAHUN,kd_tahap : rko_kd_tahap,id_sub_pd:rko_id_opd},
						success: function(f,r,d) {	
							xrkoStore.reload();
							xThis.toastPesan('success','Data Berhasil Disimpan  !!',2000);
							xDiag.destroy();
						},
						failure: function(form, o) {	
							var ermsg= JSON.parse(o.responseText);
							xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);	
							dialog.destroy();		
						}						
					});
        } else {
			this.toastPesan('error','Form tidak valid !!</h1><br/>koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},

	simpanPekerjaan: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'rko/save-pekerjaan',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						//params: {tahun : vTAHUN,kd_tahap : rko_kd_tahap,id_sub_pd:rko_id_opd},
						success: function(f,r,d) {	
							xrkoStore.reload();
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

	simpanSubkegiatan: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
		var xid=xForm.lookupName('idsubkegiatan').getValue();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'rko/update-subkegiatan/'+xid,
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',params: {tahun : vTAHUN,kd_tahap : vTAHAP},
						success: function(f,r,d) {	
							xrkoStore.reload();
							xThis.toastPesan('success','Data Berhasil Disimpan  !!',2000);
							xDiag.destroy();
						},
						failure: function(form, o) {	
							var ermsg= JSON.parse(o.responseText);
							xThis.toastPesan('error','Terjadi Kesalahan<br/><br/>'+ermsg.detail[0].msg,2000);	
						}						
					});
        } else {
			this.toastPesan('error','Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},
	hapusPekerjaan: function (btn) 
	{
		var rec =this.getViewModel().get('recordTree'); 
		let xUrl ='', xID='';
		lvl= rec.get('lvl');
		var xvc =this;
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan menghapus data ?',
        function (answer) {
            if (answer === 'yes'){            	
            	xvc.hapusGridData(REMOTE_URL +'rko/delete-pekerjaan/'+rec.get('id'),rec.get('id'),xrkoStore,xvc);
			}
        });
	},

	fullScreen:function(){
		var elem = document.getElementById("ext-viewport");
		if (isFS ==0) {
			if (elem.requestFullscreen) {elem.requestFullscreen();} else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen();} else if (elem.msRequestFullscreen) { elem.msRequestFullscreen();}
			Ext.getCmp("ext-maintoolbar-1").hide();Ext.getCmp("ext-footerview-1").hide();isFS=1;
		} else {
			if (document.exitFullscreen) {document.exitFullscreen();} else if (document.webkitExitFullscreen) { document.webkitExitFullscreen();} else if (document.msExitFullscreen) { document.msExitFullscreen();}
			Ext.getCmp("ext-maintoolbar-1").show();Ext.getCmp("ext-footerview-1").show();isFS=0;
		}
		let vpHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		this.getView().down('tabpanel').setHeight(vpHeight);

	},

	formPrint_Show: function (btn) {	
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			//maximizable: true,
			title: 'Cetak Laporan',  shadow: 'true',
			responsiveConfig: {
				'width < 800': {
					width:'95%',height:'90%',
				},
				'width >= 800': {
					width:550,height:370,
				}
			},
			standardSubmit: true,
			items:[{xtype:'rko-form-print'}],
		});
		dialog.show();

		xForm=dialog.down('formpanel');
		xForm.lookupName('pid_sub_pd').setValue(rko_id_opd);
		xForm.lookupName('puser').setValue(vUSER_INFO.display_name);
	},

	listRka_Show:function(btn){
		var rec =this.getViewModel().get('recordTree'); 

			Ext.fly('rko_detail_program_kegiatan_top_title').update(rec.get('nama_pekerjaan')); 
			this.getView().down('tabpanel').setActiveItem(2);
	},
	
	editSubkegiatan: function () {
		var lvl=arguments[0].record.data.lvl;
		if (lvl !=3) {return false;}
		this.editCell(arguments[0].columnIndex,REMOTE_URL + 'rko/update-subkegiatan/'+arguments[0].record.data.idsubkegiatan,arguments[0].record.data,this);
	},
	jenispaketChange:function (rg,nv,ov,o) {
		/*
		var xForm=rg.up().getForm();
		if (nv==1) {
			xForm.lookupName('tipe_swa').hide();
		} else {
		}*/
	},
	
	formDpa_Show:function (btn) {
		var dialog = Ext.create({
			xtype: 'dialog',closable:true,
			title: 'Update DPA',  shadow: 'true',width:300,height:200,scrollable: true,
			items:[{xtype:'rko-form-update-dpa'}],
		});
		dialog.show();
		var xmode=btn.mode;
		//var rec =this.getViewModel().get('recordTree'); 
	},

	updateDPA: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'rko/updatedpa',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',params: {tahun : vTAHUN,'id_sub_pd':rko_id_opd,'username':vNAMA_PENGGUNA,},
						success: function(f,r,d) {	
							xrkoStore.reload();
							xThis.toastPesan('success','DPA Berhasil Diupdate  !!<br>anggaran semula: '+r.sebelum+'<br>anggaran setelah :'+r.setelah,2000);
							//xDiag.destroy();
						},
						failure: function(form, o) {	
							xThis.toastPesan('error','Gagal simpan data '+o.error.message,2000);			
						}						
					});
        } else {
			xThis.toastPesan('error','>Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},
	auto100: function(t,e,o) {
		
		var xval=t._value;
		var xname=t.name;
		console.log(xname +'-->'+xval);
		var xform=t.up('formpanel');
		if (parseInt(xval) == 100) {
			if (xname=="jan") {
				xform.lookupName('feb').setValue(100);xform.lookupName('mar').setValue(100);xform.lookupName('apr').setValue(100);xform.lookupName('mei').setValue(100);xform.lookupName('jun').setValue(100);xform.lookupName('jul').setValue(100);xform.lookupName('agu').setValue(100);xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="feb") {
				xform.lookupName('mar').setValue(100);xform.lookupName('apr').setValue(100);xform.lookupName('mei').setValue(100);xform.lookupName('jun').setValue(100);xform.lookupName('jul').setValue(100);xform.lookupName('agu').setValue(100);xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="mar") {
				xform.lookupName('apr').setValue(100);xform.lookupName('mei').setValue(100);xform.lookupName('jun').setValue(100);xform.lookupName('jul').setValue(100);xform.lookupName('agu').setValue(100);xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="apr") {
				xform.lookupName('mei').setValue(100);xform.lookupName('jun').setValue(100);xform.lookupName('jul').setValue(100);xform.lookupName('agu').setValue(100);xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="mei") {
				xform.lookupName('jun').setValue(100);xform.lookupName('jul').setValue(100);xform.lookupName('agu').setValue(100);xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="jun") {
				xform.lookupName('jul').setValue(100);xform.lookupName('agu').setValue(100);xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="jul") {
				xform.lookupName('agu').setValue(100);xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="agu") {
				xform.lookupName('sep').setValue(100);xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="sep") {
				xform.lookupName('okt').setValue(100);xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="okt") {
				xform.lookupName('nov').setValue(100);xform.lookupName('des').setValue(100);
			} else if (xname=="nov") {
				xform.lookupName('des').setValue(100);
			} else if (xname=="jan_f") {
				xform.lookupName('feb_f').setValue(100);xform.lookupName('mar_f').setValue(100);xform.lookupName('apr_f').setValue(100);xform.lookupName('mei_f').setValue(100);xform.lookupName('jun_f').setValue(100);xform.lookupName('jul_f').setValue(100);xform.lookupName('agu_f').setValue(100);xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="feb_f") {
				xform.lookupName('mar_f').setValue(100);xform.lookupName('apr_f').setValue(100);xform.lookupName('mei_f').setValue(100);xform.lookupName('jun_f').setValue(100);xform.lookupName('jul_f').setValue(100);xform.lookupName('agu_f').setValue(100);xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="mar_f") {
				xform.lookupName('apr_f').setValue(100);xform.lookupName('mei_f').setValue(100);xform.lookupName('jun_f').setValue(100);xform.lookupName('jul_f').setValue(100);xform.lookupName('agu_f').setValue(100);xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="apr_f") {
				xform.lookupName('mei_f').setValue(100);xform.lookupName('jun_f').setValue(100);xform.lookupName('jul_f').setValue(100);xform.lookupName('agu_f').setValue(100);xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="mei_f") {
				xform.lookupName('jun_f').setValue(100);xform.lookupName('jul_f').setValue(100);xform.lookupName('agu_f').setValue(100);xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="jun_f") {
				xform.lookupName('jul_f').setValue(100);xform.lookupName('agu_f').setValue(100);xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="jul_f") {
				xform.lookupName('agu_f').setValue(100);xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="agu_f") {
				xform.lookupName('sep_f').setValue(100);xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="sep_f") {
				xform.lookupName('okt_f').setValue(100);xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="okt_f") {
				xform.lookupName('nov_f').setValue(100);xform.lookupName('des_f').setValue(100);
			} else if (xname=="nov_f") {
				xform.lookupName('des_f').setValue(100);
			} 

		} else {
			if (xname=="jan") {
				xform.lookupName('feb').setMinValue(xval);xform.lookupName('mar').setMinValue(xval);xform.lookupName('apr').setMinValue(xval);xform.lookupName('mei').setMinValue(xval);xform.lookupName('jun').setMinValue(xval);xform.lookupName('jul').setMinValue(xval);xform.lookupName('agu').setMinValue(xval);xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="feb") {
				xform.lookupName('mar').setMinValue(xval);xform.lookupName('apr').setMinValue(xval);xform.lookupName('mei').setMinValue(xval);xform.lookupName('jun').setMinValue(xval);xform.lookupName('jul').setMinValue(xval);xform.lookupName('agu').setMinValue(xval);xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="mar") {
				xform.lookupName('apr').setMinValue(xval);xform.lookupName('mei').setMinValue(xval);xform.lookupName('jun').setMinValue(xval);xform.lookupName('jul').setMinValue(xval);xform.lookupName('agu').setMinValue(xval);xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="apr") {
				xform.lookupName('mei').setMinValue(xval);xform.lookupName('jun').setMinValue(xval);xform.lookupName('jul').setMinValue(xval);xform.lookupName('agu').setMinValue(xval);xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="mei") {
				xform.lookupName('jun').setMinValue(xval);xform.lookupName('jul').setMinValue(xval);xform.lookupName('agu').setMinValue(xval);xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="jun") {
				xform.lookupName('jul').setMinValue(xval);xform.lookupName('agu').setMinValue(xval);xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="jul") {
				xform.lookupName('agu').setMinValue(xval);xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="agu") {
				xform.lookupName('sep').setMinValue(xval);xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="sep") {
				xform.lookupName('okt').setMinValue(xval);xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="okt") {
				xform.lookupName('nov').setMinValue(xval);xform.lookupName('des').setMinValue(xval);
			} else if (xname=="nov") {
				xform.lookupName('des').setMinValue(xval);
			} else if (xname=="jan_f") {
				xform.lookupName('feb_f').setMinValue(xval);xform.lookupName('mar_f').setMinValue(xval);xform.lookupName('apr_f').setMinValue(xval);xform.lookupName('mei_f').setMinValue(xval);xform.lookupName('jun_f').setMinValue(xval);xform.lookupName('jul_f').setMinValue(xval);xform.lookupName('agu_f').setMinValue(xval);xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="feb_f") {
				xform.lookupName('mar_f').setMinValue(xval);xform.lookupName('apr_f').setMinValue(xval);xform.lookupName('mei_f').setMinValue(xval);xform.lookupName('jun_f').setMinValue(xval);xform.lookupName('jul_f').setMinValue(xval);xform.lookupName('agu_f').setMinValue(xval);xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="mar_f") {
				xform.lookupName('apr_f').setMinValue(xval);xform.lookupName('mei_f').setMinValue(xval);xform.lookupName('jun_f').setMinValue(xval);xform.lookupName('jul_f').setMinValue(xval);xform.lookupName('agu_f').setMinValue(xval);xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="apr_f") {
				xform.lookupName('mei_f').setMinValue(xval);xform.lookupName('jun_f').setMinValue(xval);xform.lookupName('jul_f').setMinValue(xval);xform.lookupName('agu_f').setMinValue(xval);xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="mei_f") {
				xform.lookupName('jun_f').setMinValue(xval);xform.lookupName('jul_f').setMinValue(xval);xform.lookupName('agu_f').setMinValue(xval);xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="jun_f") {
				xform.lookupName('jul_f').setMinValue(xval);xform.lookupName('agu_f').setMinValue(xval);xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="jul_f") {
				xform.lookupName('agu_f').setMinValue(xval);xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="agu_f") {
				xform.lookupName('sep_f').setMinValue(xval);xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="sep_f") {
				xform.lookupName('okt_f').setMinValue(xval);xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="okt_f") {
				xform.lookupName('nov_f').setMinValue(xval);xform.lookupName('des_f').setMinValue(xval);
			} else if (xname=="nov_f") {
				xform.lookupName('des_f').setMinValue(xval);
			} 
		}
		
		
		
	},

	cariOPD:function(a,e,o){
		var searchValue=a.getValue();var xStore = this.getStore('opdStore');if (!Ext.isEmpty(xStore)) {xStore.clearFilter();if (!Ext.isEmpty(searchValue)) {var regEx  = new RegExp(searchValue, 'i'),fields = ['nama_pd'],i;xStore.filterBy(function (rec) {for (i = 0; i < fields.length; i++) {if (regEx.test(rec.get([fields[i]]))) {return true;}}});}}
	},
	clearOPD:  function(){var xStore = this.getStore('opdStore');if (!Ext.isEmpty(xStore)){xStore.clearFilter()}},
	cariKegiatan:function(a,e,o){
		var searchValue=a.getValue();var xStore = this.getStore('kegiatanStore');if (!Ext.isEmpty(xStore)) {xStore.clearFilter();if (!Ext.isEmpty(searchValue)) {var regEx  = new RegExp(searchValue, 'i'),fields = ['uraian'],i;xStore.filterBy(function (rec) {for (i = 0; i < fields.length; i++) {if (regEx.test(rec.get([fields[i]]))) {return true;}}});}}
	},
	clearCarikegiatan:  function(){var xStore = this.getStore('kegiatanStore');if (!Ext.isEmpty(xStore)){xStore.clearFilter()}},
	
});
