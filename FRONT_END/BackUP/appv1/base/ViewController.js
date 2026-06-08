Ext.define('Admin.base.ViewController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.basexviewcontroller',
	requires: [ 'Ext.Toast' ],	

	getFetchData : function (url,options = {}) {
		return new Ext.Promise(function (resolve, reject) {
			Ext.Ajax.request({
				url: url,
				method: options.method || 'POST',
				params: options.params || {},
				//jsonData: options.params || null,
				success: function (response) {
					resolve(response.responseText);
				},
   
				failure: function (response) {
					reject({
						status: response.status,
						response: response.responseText
					});
				}
			});
		});
	},

	slugify : function (text) {
		return text
		  .toString() // Ensure the input is a string
		  .normalize('NFD') // Decompose accented characters into base characters and diacritics
		  .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
		  .toLowerCase() // Convert to lowercase
		  .trim() // Remove leading/trailing whitespace
		  .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters (keep only alphanumeric, spaces, and hyphens)
		  .replace(/\s+/g, '-') // Replace spaces with a single hyphen
		  .replace(/-+/g, '-'); // Replace multiple consecutive hyphens with a single hyphen
	},

	onBalik: function(btn) {
		this.getView().down('tabpanel').setActiveItem(btn.destIdx);
	},
	toastPesan: function(tipe,msg,timeout) {
		if (tipe=='error'){
			Ext.toast({alignment:'c-c',shadow:false,message: '<div class="alert alert-danger"><h3><i class="x-fa fa-exclamation-circle" aria-hidden="true"></i>  '+msg+'</h3></div>', timeout: timeout});
		} else {
			Ext.toast({alignment:'c-c',shadow:false,message: '<div class="alert alert-success"><h3><i class="x-fa fa-check-circle" aria-hidden="true"></i>  '+msg+'</h3></div>', timeout: timeout});
		}
			
	},
	toastPesanR: function(tipe,msg,timeout) {
		if (tipe=='error'){
			Ext.toast({alignment:'t-t',shadow:false,message: '<div class="alert alert-danger"><h3><i class="x-fa fa-exclamation-circle" aria-hidden="true"></i>  '+msg+'</h3></div>', timeout: timeout});
		} else {
			Ext.toast({alignment:'t-t',shadow:false,message: '<div class="alert alert-success"><h3><i class="x-fa fa-check-circle" aria-hidden="true"></i>  '+msg+'</h3></div>', timeout: timeout});
		}
			
	},
	myToast: function (tipe,judul,msg,timeout) {
		let clsT='',clsiconT='';
		if (tipe=='error'){
			clsT="bg-danger";clsiconT="fa-exclamation-circle";
		} else {
			clsT="bg-success";clsiconT="fa-check-circle";
		}

		Ext.toast({ message: `<div class="toast-bs `+clsT+`">
			<i class="x-fa `+clsiconT+`" aria-hidden="true" style="font-style: normal;font-size:28px;margin-right:10px;margin-top:10px;float:left;vertical-align: middle;"></i>
			<h3 style="text-align:center;margin-top:10px;">`+judul+`</h3><p style="text-align:center;margin-left:15px;">`+msg+`</p></div>`, 
			alignment: 'tc-tc',shadow:false, timeout: timeout });
                        
	},

	toastPesanS: function(tipe,msg,timeout) {
		if (tipe=='error'){
			Ext.toast({alignment:'t-t',shadow:false,message: '<div class="alerttoast alert-danger"><i class="x-fa fa-exclamation-circle" aria-hidden="true"></i>  '+msg+'</div>', timeout: timeout});
		} else {
			Ext.toast({alignment:'t-t',shadow:false,message: '<div class="alerttoast alert-success"><i class="x-fa fa-check-circle" aria-hidden="true"></i>  '+msg+'</div>', timeout: timeout});
		}
			
	},

	onPanelPainted: function() {
		var GV=this.getView();
		var dialog = Ext.create({xtype: 'dialog',title: 'Pilih tahapan',  shadow: 'true',width:280,height:230,
			items:[{xtype:'formpanel',bodyPadding:20, items:[
				{ xtype: 'selectfield',margin: '0 5',name: 'tahun',label: 'Tahun',value:vTAHUN,
                            options: [{text:'2020',value:2020},{text:'2021',value:2021},{text:'2022',value:2022},{text:'2023',value:2023},{text:'2024',value:2024},],required: true
				},
				{ xtype: 'selectfield',margin: '0 5',name: 'kd_perubahan',label: 'Tahapan',value:mkd_arsip,
                            options: [{text:'Murni',value:1},{text:'Perubahan',value:2}],required: true
				},
				],
				buttons: [{text: 'OK',ui: "action",
					handler: function(btn) {
						var xForm=btn.up('formpanel'),xDiag=btn.up().up().up(),fKd_perubahan=xForm.lookupName('kd_perubahan').getValue(),fTahun=xForm.lookupName('tahun').getValue();
						vTAHUN=fTahun;mkd_arsip=fKd_perubahan;xDiag.destroy();  
						GV.setActiveItem(0);
				},
				iconCls: 'x-fa fa-check'} ]
			}],
		});
		dialog.show();
	},
	openFormTahapan: function() {
		var dialog = Ext.create({xtype: 'dialog',title: 'Pilih tahapan',  shadow: 'true',width:280,height:230,
			items:[{xtype:'formpanel',bodyPadding:20, items:[
				{ xtype: 'selectfield',margin: '0 5',name: 'tahun',label: 'Tahun',value:vTAHUN,
                            options: [{text:'2020',value:2020},{text:'2021',value:2021},{text:'2022',value:2022},{text:'2023',value:2023},{text:'2024',value:2024},],required: true
				},
				{ xtype: 'selectfield',margin: '0 5',name: 'kd_perubahan',label: 'Tahapan',value:mkd_arsip,
                            options: [{text:'Murni',value:1},{text:'Perubahan',value:2}],required: true
				},
				],
				buttons: [{text: 'OK',ui: "action",
					handler: function(btn) {
						var xForm=btn.up('formpanel'),xDiag=btn.up().up().up(),fKd_perubahan=xForm.lookupName('kd_perubahan').getValue(),fTahun=xForm.lookupName('tahun').getValue();
						vTAHUN=fTahun;mkd_arsip=fKd_perubahan;xDiag.destroy();  
				},
				iconCls: 'x-fa fa-check'} ]
			}],
		});
		dialog.show();
	},

	simpanFormData:function(url, form,store,funcSukses) {
			if (form.validate()) {
            form.submit({
						url: url,
						scope:this,
						method: 'POST',
						waitMsg:'Prosesing ... ...',
						params: {'save': 'ok','method':'save'},
						success: function(f,r,d) {
							Ext.toast({message: '<br/><h1>Data Berhasil Disimpan !!</h1><br/><br/>  ', timeout: 2000});
							store.reload();
							funcSukses();  
						},
						failure: function(form, o) {
							Ext.toast({message: '<br/><h1>Error !!</h1><br/><br/>  '+o.error, timeout: 2000});	
						}
						
					});
			
        } else {
			Ext.toast({message: '<b>Form tidak valid !!</b><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', timeout: 6000});
        }
		
	},
	
	hapusGridData:function(url, pid,pStore,pscope) {
		Ext.Ajax.request({
			url: url,method:'delete',
			scope : this,
			params: {
				'method':'delete',id:pid
			},
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				//console.dir(obj);
				this.toastPesan('success','Data Berhasil Dihapus !! ::', 2000);
				pStore.reload();
			},
	   
			failure: function(response, opts) {
				this.toastPesan('error','Hapus gagal, mohon koreksi lagi !', 2000);
			}
		});
	},
	
	hapusGridDataRow:function(url, idX,grid,scope) {
		Ext.Ajax.request({
			url: url,
			scope : this,
			params: {
				'method':'delete',id:idX
			},
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				//console.dir(obj);
				this.toastPesan('success','Data Berhasil Dihapus !! ::', 2000);
				grid.getStore().reload();
			},
	   
			failure: function(response, opts) {
				this.toastPesan('error','Hapus gagal, mohon koreksi lagi !', 2000);
			}
		});
	},

	hapusItemList:function(url, idX,scope) {
		Ext.Ajax.request({
			url: url,
			scope : this,
			params: {
				'method':'delete',id:idX
			},
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				//console.dir(obj);
				this.toastPesan('success','Data Berhasil Dihapus !! ::', 2000);
			},
	   
			failure: function(response, opts) {
				this.toastPesan('error','Hapus gagal, mohon koreksi lagi !', 2000);
				//return false;
			}
		});
	},


	editGridCapkin:function(colIdx,url, xData,xSTORE) {
		Ext.Ajax.request({
			url: url,method:'POST',
			params: {'method':'save','colIdx':colIdx},
			jsonData:xData,
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				xThis.toastPesan('success','Data Berhasil Disimpan !! ::', 2000);
				xSTORE.reload();
			},
	   
			failure: function(response, opts) {
				xThis.toastPesan('error','Gagal simpan data, mohon koreksi lagi !',2000);;
			}
		});
	},
	editCell:function(colIdx,url, xData,scope) {
		Ext.Ajax.request({
			url: url,method:'POST',
			params: {'method':'save','colIdx':colIdx},
			jsonData:xData,
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				scope.toastPesanR('success','Data Berhasil Disimpan !! ::', 2000);
			},
	   
			failure: function(response, opts) {
				scope.toastPesanR('error','Gagal simpan data, mohon koreksi lagi !',2000);
				 
			}
		});
	},
	editGridCell:function(colIdx,url, xData,xSTORE,scope) {
		Ext.Ajax.request({
			url: url,method:'POST',
			params: {'method':'save','colIdx':colIdx},
			jsonData:xData,
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				scope.toastPesanS('success','Data Berhasil Disimpan ', 2000);
				if (xSTORE != false) {
					xSTORE.reload();
				}
			},
	   
			failure: function(response, opts) {
				scope.toastPesanS('error','Gagal simpan data, mohon koreksi lagi !',2000);
				 
			}
		});
	},
	
	editGrid:function(url, xData) {
		Ext.Ajax.request({
			url: url,method:'POST',
			params: {'method':'save'},
			jsonData:xData,
			success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				Ext.toast({message: ':: Data Berhasil Disimpan !! ::', timeout: 2000});
			},
	   
			failure: function(response, opts) {
				 Ext.toast('<h1>Gagal simpan data, mohon koreksi lagi !</h1>');
			}
		});
	},
	
	getMaxID : function(sStore,sField) {
	    var maxId = 0;
	    if (sStore.getCount() > 0) {
	        maxId = sStore.getAt(0).get(sField);
	        sStore.each(function(recA) {
	            maxId = Math.max(maxId, recA.get(sField));
	        });
	        return maxId;
	    } else {
	        return 0;
	    }
	},
	onActionSearchOPD:function(a,e,o){
		var searchValue=a.getValue();
		var xStore = this.getStore('opdStore');		
	
			if (!Ext.isEmpty(xStore)) {
				xStore.clearFilter();

				if (!Ext.isEmpty(searchValue)) {
					var regEx  = new RegExp(searchValue, 'i'),
						fields = ['nm_unit'],
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
	onClearIconTapSearchOPD:  function(){
			 var xStore = this.getStore('opdStore');
				if (!Ext.isEmpty(xStore)){
					xStore.clearFilter()
				}
	
       
	},
	opdStoreReload:  function(){
		this.getStore('opdStore').reload();
	},
	
	renderProgresBar(value) {
		let pbClass = 'bg-danger';
	  
		if (value >= 50 && value < 60) {
		  pbClass = 'bg-warning';
		} else if (value >= 60 && value < 80) {
		  pbClass = 'bg-info';
		} else if (value >= 80) {
		  pbClass = 'bg-success';
		}
	  
		return `
		  ${value}% 
		  <div class="progress-bar-td" style="height:8px;">
			<div 
			  class="progress-bar ${pbClass}" 
			  role="progressbar" 
			  style="width:${value}%;" 
			  aria-valuenow="${value}" 
			  aria-valuemin="0" 
			  aria-valuemax="100">
			</div>
		  </div>
		`;
	  }

});
