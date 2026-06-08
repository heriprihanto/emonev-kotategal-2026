let pers_id_sub_pd=0,
pers_tahun=vTAHUN,
pers_nm_sub_unit='',pers_nm_unit='';

var xpersonelStore=null;


Ext.define('Admin.view.personel.Controller', {
	extend: 'Admin.base.ViewController',

	initTabItem:function () {
		xThis=this;
	},
	
	OpdList_itemClick:function (grid, records) {
		this.getView().down('tabpanel').setActiveItem(1);
		Ext.fly('dt-entry__header_personel').update('<i class="x-fa fa-user" aria-hidden="true"></i> Data Pengguna :: ' + records.record.data.nama_pd +'');
		pers_id_sub_pd = records.record.data.id_sub_pd;
		
		this.getStore('personelStore').load({
			params: {
				ptahun : vTAHUN,
				pid_sub_pd : records.record.data.id_sub_pd
			}
		});
		xpersonelStore=this.getStore('personelStore');
	},

	formPersonel_Show:function (btn) {
		
		var dialog = Ext.create({
			xtype: 'dialog',
			title: 'Data Personel',  shadow: 'true',width:500,height:460,
			items:[
				{xtype:'personel-form'}
			],
			

		});
		dialog.show();
		dialog.down('formpanel').lookupName('id_sub_pd').setValue(pers_id_sub_pd);
		
		var xmode=btn.mode;
		if (xmode == 'edit') {
			var cell = btn.up().up().up(),rec = cell.getRecord();var form = dialog.down('formpanel');
			form.setRecord(rec);
		}
		
	},

	simpanData: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=btn.up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'personel/save-data',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						//params: {tahun : vTAHUN,kd_tahap : rko_kd_tahap,id_sub_pd:rko_id_opd},
						success: function(f,r,d) {	
							xpersonelStore.reload();
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

	hapusData: function (btn) 
	{
		
		var cell = btn.up().up().up(),rec = cell.getRecord();
		var xUrl = REMOTE_URL +'personel/delete/'+rec.get('id');
		var xvc =this;
		Ext.Msg.confirm('Konfirmasi', 'Apakah anda akan menghapus data ?',
        function (answer) {
            if (answer === 'yes'){            	
            	xvc.hapusGridData(xUrl,rec.get('id'),xpersonelStore,xvc);
			}
        });
	},
	

});
