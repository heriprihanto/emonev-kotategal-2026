Ext.define('Admin.view.main.Toolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maintoolbar',shadow:true,
    margin:'10 20 15 20',

    requires: [
        'Ext.Button',
        'Ext.Img',
        'Ext.SegmentedButton'
    ],

    items: [
        

    {xtype: 'segmentedbutton',ui: 'headerbutton',
        responsiveConfig: {
            'width < 800': {hidden: true},
            'width >= 1000': {hidden: false}
        },
        items: [
            {text: 'Beranda',iconCls: 'x-fa fa-home',handler : 'menuClick',mview:'dashboard',ui: 'headerbutton',}, 
           
            {text: 'Personel',iconCls: 'x-fa fa-user',ui: 'headerbutton',handler : 'menuClick',mview:'personel'},
            {text: 'RKO',iconCls: 'x-fa fa-file-archive',ui: 'headerbutton',handler : 'menuClick',mview:'rko'},
           
            {text: 'RFK',iconCls: 'x-fa fa-chart-line',ui: 'headerbutton',handler : 'menuClick',mview:'rfk'},
            {text: 'Laporan',iconCls: 'x-fa fa-book',ui: 'headerbutton',handler : 'menuClick',mview:'laporan'},
        ]
    },
    
	'->', 
	{
            xtype: 'button',bind: { text:'{display_name}'}, 
            responsiveConfig: {'width < 800': {hidden: true},'width >= 1000': {hidden: false}},
			ui: 'headerbutton',
            cls :'neonbutton',
			reference: 'detailtoggle',
			iconCls: 'x-fa fa-user',			
			menu : [
				{text : 'Profil Pengguna',iconCls : 'x-fa fa-smile',handler : 'menuClick',mview:'profil'},
                {text : 'Panduan',iconCls : 'x-fa fa-question',href : 'panduan.html'},
                {text : 'Pengaturan',iconCls : 'x-fa fa-cog',handler : 'menuClick',mview:'pengaturan',role:'admin'},
				{text : 'Keluar',iconCls : 'x-fa fa-window-close',handler:'logOut'},
			]
    },

    {xtype: 'button',iconCls: 'x-fa fa-bars',text:'menu',
        responsiveConfig: {
            'width > 800': {hidden: true},
            'width <= 1000': {hidden: false}
        },
        ui: 'headerbutton',
        //reference: 'detailtoggle',
        menu : [
            {text: 'Beranda',iconCls: 'x-fa fa-home',handler : 'menuClick',mview:'dashboard',ui: 'headerbutton',}, 
           
            {text: 'Personel',iconCls: 'x-fa fa-user',ui: 'headerbutton',handler : 'menuClick',mview:'personel'},
            {text: 'RKO',iconCls: 'x-fa fa-file-archive',ui: 'headerbutton',handler : 'menuClick',mview:'rko'},
           
            {text: 'RFK',iconCls: 'x-fa fa-chart-line',ui: 'headerbutton',handler : 'menuClick',mview:'rfk'},
            {text: 'Laporan',iconCls: 'x-fa fa-book',ui: 'headerbutton',handler : 'menuClick',mview:'laporan'},
            {text : 'Profil Pengguna',iconCls : 'x-fa fa-smile',handler : 'menuClick',mview:'profil'},
                {text : 'Panduan',iconCls : 'x-fa fa-question',href : 'panduan.html'},
                {text : 'Pengaturan',iconCls : 'x-fa fa-cog',handler : 'menuClick',mview:'pengaturan',role:'admin'},
				{text : 'Keluar',iconCls : 'x-fa fa-window-close',handler:'logOut'},
        ]   
    },
    
	
	]
});
