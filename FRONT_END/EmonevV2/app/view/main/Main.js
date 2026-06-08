const appStore = Ext.create("Ext.data.Store", {
  fields: ["id", "name", "icon", "type"],
  data: [
    {
      id: "rpjpd-",
      name: "RPJPD",
      icon: "resources/icons/rpjpd.png",
      type: "rpjpd-mainview",
      roles : "admin"
    },
    {
      id: "rpjmd",
      name: "RPJMD",
      icon: "resources/icons/rpjmd.png",
      type: "rpjmd-mainview",
      roles : "admin"
    },
    {
      id: "renstra",
      name: "Renstra",
      icon: "resources/icons/renstra.png",
      type: "renstra-mainview",
      roles : "admin"
    },
    {
      id: "rkpd",
      name: "RKPD",
      icon: "resources/icons/rkpd.png",
      type: "rkpd-mainview",
      roles : "admin"
    },
    //{ id: 'pk_kota',   name: 'Perjanjian Kinerja Kota', icon: 'resources/icons/messages_80.png', type: 'rencana-kinerja-tahunan-kota' },
    {
      id: "pk_opd",
      name: "Rencana Kinerja",
      icon: "resources/icons/renkin.png",
      type: "rencana-kinerja-tahunan",
      roles : "admin,kaopd,useropd"
    },
    {
      id: "22",
      name: "Capaian Kinerja",
      icon: "resources/icons/kinerja.png",
      type: "kinerja-opd-mainview",
      roles : "admin,kaopd,useropd"
    },
    {
      id: "9",
      name: "Pengguna",
      icon: "resources/icons/personel.png",
      type: "personel-mainview",
      roles : "admin,kaopd"
    },
    {
      id: "10",
      name: "Dokumen Perencanaan",
      icon: "resources/icons/dokren.png",
      type: "dokren-mainview",
      roles : "admin,kaopd,useropd"
    },
    
    /*
    {
      id: "21",
      name: "Kinerja Kota",
      icon: "resources/icons/kinerjakota.png",
      type: "kinerja-kota-mainview",
    },
    */

   
    {
      id: "23",
      name: "Evaluasi Kinerja",
      icon: "resources/icons/evaluasi.png",
      type: "evaluasi-kinerja-kota-mainview",
      roles : "admin"
    },
    {
      id: "24",
      name: "Dana Alokasi Khusus",
      icon: "resources/icons/dak.png",
      type: "dak-opd-mainview",
      roles : "admin,kaopd,useropd"
    },
    {
      id: "25",
      name: "SDG's",
      icon: "resources/icons/sdgs.png",
      type: "sdgs-mainview",
      roles : "admin"
    },
    {
      id: "mri_11487poeyhqwt563ahyw68209",
      name: "Manajemen Risiko",
      icon: "resources/icons/risk.png",
      type: "mri-main-menu",
      roles : "admin"
    },
    {
      id: "29",
      name: "Laporan",
      icon: "resources/icons/report.png",
      type: "laporan-main-panel",
      roles : "admin"
    },
    {
      id: "11",
      name: "Pengaturan",
      icon: "resources/icons/settings.png",
      type: "pengaturan-mainview",
      roles : "admin"
    },
    {
      id: "115",
      name: "Sinkronisasi SIPD",
      icon: "resources/icons/sipd.png",
      type: "sipd-mainview",
      roles : "admin"
    },
  ],
});


Ext.define("Admin.view.main.Main", {
  extend: "Ext.Container",
  xtype: "mainview",
  cls: "desktop-background",

  layout: "fit",
  controller: "main",
  viewModel: {
    type: "mainviewmodel",
  },

  items: [
    {
      // Kontainer untuk desktop itu sendiri
      xtype: "container",
      id: "mainDesktopContainer",
      hidden: true,
      itemId: "desktop",
      layout: "hbox",
      style: "padding: 10px;",
      items: [
        {
          xtype: "dataview",width:400,
          id: "iconDesktopList1",
          store: appStore,
          inline: true,
          style: "padding: 16px;background-color: transparent;",
          itemTpl: [
            '<div class="desktop-icon">',
            ' <img src="{icon}"/>',
            ' <div class="desktopicontitle">{name}</div>',
            "</div>",
          ].join(""),
          listeners: {
            childtap: "openApp",
          },
        },
       
        {
          xtype: "dashboard-progres-report"
        },
      ],
    },
    {
      // Taskbar di bagian bawah
      xtype: "toolbar",
      shadow: true,
      id: "desktopTaskbarTop",
      hidden: true,
      docked: "top",
      height: 45,
      width: 600,
      cls: "topnav", // CSS Class untuk taskbar

      items: [
        {
          xtype: "component",
          reference: "logo",
          userCls: "main-logo",
          html: `<h3 style="font-family:Papyrus,fantasy;font-size:20px;margin-top:2px;font-weight:bold;text-align: left;color: #fff;
                text-shadow:0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #f09,0 0 82px #f09,0 0 92px #f09,0 0 102px #f09,0 0 151px #f09;">e-Monev Kota Tegal</h3>`,
        },
        { xtype: "spacer" },
        "->",
       
        {
          xtype: "button",
          bind: { text:'{display_name}'},
          responsiveConfig: {
            "width < 800": { hidden: true },
            "width >= 1000": { hidden: false },
          },
          ui: "headerbutton",
          reference: "detailtoggle2",
          iconCls: "x-fa fa-user",
          menu: [
            {
              text: "Profil Pengguna",
              iconCls: "x-fa fa-smile",
              type: "sipd-mainview",
              handler : 'openFormProfil',
            },
            {
              text: "Panduan",
              iconCls: "x-fa fa-question",
              href: "panduan.html",
            },
            {
              text: "Pengaturan",
              iconCls: "x-fa fa-cog",
              handler: "menuClick",
              mview: "pengaturan",
              role: "admin",
            },
            {
              text: "Keluar",
              iconCls: "x-fa fa-window-close",
              handler: "logOut",
              ui: "soft-red",
            },
          ],
        },
       
      ],
    },
    {
      // Taskbar di bagian bawah
      xtype: "toolbar",
      shadow: true,
      id: "desktopTaskbar",
      hidden: true,
      docked: "bottom",
      height: 45,
      cls: "taskbar", // CSS Class untuk taskbar
      style: "background-color: transparent;",

      items: [
       
        { xtype: "spacer" },
        {
          xtype: "container",
          id: "taskButtonsPanel",
          layout: { type: "hbox", align: "center" },
          scrollable: "horizontal",
          flex: 1,
          padding: "10 10 10 10",
          //html: '<div style="font-size: 14px; color: #333; padding-left: 10px; line-height: 35px;">Tampilan aplikasi yang sedang berjalan</div>'
        },
        { xtype: "spacer" },
        {
          // Jam di pojok kanan
          xtype: "component",
          cls: "taskbar-clock",
          style: "font-weight: bold;",
          html: Ext.Date.format(new Date(), "H:i"),
          listeners: {
            // Update jam setiap menit
            beforerender: function (cmp) {
              setInterval(function () {
                cmp.setHtml(Ext.Date.format(new Date(), "H:i"));
              }, 60000);
            },
          },
        },
      ],
    },
  ],

  /*
  startMenu: {
    xtype: "panel",
    floated: true,
    hidden: true,
    shadow: true,
    cls: "app-window",
    width: 360,
    height: 420,
    
    layout: "vbox",
    items: [
      {
        title: "Panel 1",
        height: 50,
        margin: "0 10 0 0",
        html: "Atas",
      },
      {
        title: "Panel 2",
        height: 300,
        margin: "0 10 0 0",
        layout: "hbox",
        items: [
          {
            title: "Panel 1",
            width: 100,
            margin: "0 10 0 0",
            defaults: {
              xtype: "button",
              margin: "10 0",
              width: "100%",
            },
            items: [
              {
                text: "Toggle left menu",
                handler: "toggleLeft",
              },
              {
                text: "Toggle right menu",
                handler: "toggleRight",
              },
              {
                text: "Toggle top menu",
                handler: "toggleTop",
              },
              {
                text: "Toggle bottom menu",
                handler: "toggleBottom",
              },
            ],
          },
          {
            title: "Panel 2",
            width: 100,
            margin: "0 10 0 0",
            html: "Kanan",
          },
        ],
      },
    ],
  },
  */
});
