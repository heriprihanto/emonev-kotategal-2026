Ext.define("Admin.view.main.Main", {
  extend: "Ext.navigation.View",

  requires: ["Ext.Button", "Ext.list.Tree", "Ext.navigation.View"],

  controller: "main",
  viewModel: {
    type: "mainviewmodel",
  },
  navigationBar: false,
  cls: "main-container",
  /*
        platformConfig: {
            phone: {
                controller: 'phone-main'
            }
        },
    */
  items: [
    {
      xtype: "container",id:'xMainToolbar',
      docked: "top",
      layout: "hbox",
      items: [
        {
          xtype: "container",
          flex: 1,
          items: [
            {
              xtype: "maintoolbarlogo",
              userCls: "main-toolbar",
              height: 48,
              width: 180,
            },
          ],
        },
        { xtype: "container", flex: 1 },
        { xtype: "maintoolbar", userCls: "main-toolbar", height: 48, flex: 1 },
      ],
      //shadow: true
    },

    {
      xtype: "footerview",
      reference: "footerview",userCls: "main-toolbar",
      docked: "bottom",
      height: 45,
    },
  ],
  listeners: {
    initialize: "initView",
  },
});
