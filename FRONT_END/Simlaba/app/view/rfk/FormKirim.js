Ext.define('Admin.view.rfk.FormKirim', {
	extend: 'Ext.form.Panel', xtype: 'form-kirim',
	scrollable: 'vertical',
	reference: 'formKirim',
	controller: { xclass: 'Admin.view.rfk.Controller' },jsonSubmit :true,
	bodyPadding: 20, fullscreen: true,
	autoSize: true,
	defaults: { clearable: false ,labelAlign:'top'},
	items: [
		{ html: '<div class="alert alert-danger"> Sebelum klik tombol kirim laporan, pastikan data yang dientri sudah benar dan lengkap. Sistem akan mengunci modul ini setelah laporan dikirim !</div>' },
		{
			xtype: 'containerfield',defaults: { clearable: false ,labelAlign:'top'}, items: [
				{
					xtype: 'selectfield', label: 'Bulan', name: 'tbulan', value: 1, required: true, disabled: true,
					options: [{ text: 'Januari', value: '1' },
					{ text: 'Februari', value: '2' },
					{ text: 'Maret', value: '3' },
					{ text: 'April', value: '4' }
						, { text: 'Mei', value: '5' }
						, { text: 'Juni', value: '6' }
						, { text: 'Juli', value: '7' }
						, { text: 'Agustus', value: '8' }
						, { text: 'September', value: '9' }
						, { text: 'Oktober', value: '10' }
						, { text: 'November', value: '11' }
						, { text: 'Desember', value: '12' }]
				},
				{ xtype: 'textfield',label: 'Tanggal Kirim Laporan', name: 'tanggal', required: true, value: Ext.Date.format(new Date(), 'Y-m-d'), readOnly: true ,margin:'0 0 0 20'},
			]
		},

		{ xtype: 'numberfield', label: 'Bulan', name: 'bulan', hidden: true },
		{ xtype: 'numberfield', label: 'IdPD', name: 'id_sub_pd' , hidden: true},
		{ xtype: 'numberfield', label: 'idLaporan', name: 'id_laporan' , hidden: true},
		{ xtype: 'numberfield', label: 'Tahun', name: 'tahun' , hidden: true},

		{ xtype: 'numberfield', label: 'Realisasi Keuangan (SIPD)', name: 'fmis',value:0,readOnly:true },
		{ xtype: 'numberfield', label: 'Realisasi Keuangan Per Pekerjaan', name: 'rkeu' ,value:0,readOnly:true},
	],
	buttons: [
		{
			text: 'Batal', ui: 'soft-red',shadow:true, handler: function (btn) { btn.up().up().up().destroy(); }, iconCls: 'x-fa fa-window-close'
		}
		, { xtype: 'spacer' },
		{
			text: 'Kirim Laporan', ui: "soft-green",shadow:true, handler: 'simpanKirimLaporan', iconCls: 'x-fa fa-paper-plane'
		}]

});
