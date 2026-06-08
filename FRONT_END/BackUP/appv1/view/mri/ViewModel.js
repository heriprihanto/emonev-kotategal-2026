Ext.define('Admin.view.mri.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [],
	
	//alias: 'viewmodel.renstra_viewmodel',
	data: {
	},
	stores: {
		navItems: {
            type: 'tree',
            rootVisible: true,
            root: {
                expanded: true,
                text: 'All',
                iconCls: 'x-fa fa-sitemap',
                children: [
						//{text: 'Beranda',iconCls: 'x-fa fa-home',handler : 'menuClick',mview:'dashboard',ui: 'headerbutton',}, 
						{text : 'Pengaturan',iconCls : 'x-fa fa-angle-right',mview:'parent',
							children:[
							{text : 'CEE Dokumen (F1B)',leaf:false,mview:'mri-cee-f1b'},
							{text : 'Simpulan CEE (F1C)',leaf:false,mview:'mri-cee-f1c'},
							{text : 'RTP PI (F6)',leaf:false,mview:'kinerjakota'},
						]},
						{text : 'Lingkungan Pengendalian',iconCls : 'x-fa fa-angle-right',mview:'parent',
							children:[
							{text : 'CEE Dokumen (F18)',leaf:false,mview:'kinerjakota'},
							{text : 'Simpulan CEE (F1C)',leaf:false,mview:'kinerjakota'},
							{text : 'RTP PI (F6)',leaf:false,mview:'kinerjakota'},
						]},
						{text : 'Penetapan Risiko',iconCls : 'x-fa fa-angle-right',mview:'parent',
							children:[
							{text : 'CEE Dokumen (F18)',leaf:false,mview:'kinerjakota'},
							{text : 'Simpulan CEE (F1C)',leaf:false,mview:'kinerjakota'},
							{text : 'RTP PI (F6)',leaf:false,mview:'kinerjakota'},
						]},
						
						{text : 'Identifikasi Risiko',iconCls : 'x-fa fa-angle-right',mview:'parent',
							children:[
							{text : 'CEE Dokumen (F18)',leaf:false,mview:'kinerjakota'},
							{text : 'Simpulan CEE (F1C)',leaf:false,mview:'kinerjakota'},
							{text : 'RTP PI (F6)',leaf:false,mview:'kinerjakota'},
						]},

						{text : 'Analisis Risiko',iconCls : 'x-fa fa-angle-right',mview:'parent',
							children:[
							{text : 'CEE Dokumen (F18)',leaf:false,mview:'kinerjakota'},
							{text : 'Simpulan CEE (F1C)',leaf:false,mview:'kinerjakota'},
							{text : 'RTP PI (F6)',leaf:false,mview:'kinerjakota'},
						]},
            
				]
			}
		},

		
	}
	
});
