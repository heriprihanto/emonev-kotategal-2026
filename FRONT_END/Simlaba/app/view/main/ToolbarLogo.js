Ext.define('Admin.view.main.ToolbarLogo', {
    extend: 'Ext.Toolbar',
    xtype: 'maintoolbarlogo',shadow:true,id:'xMainToolbarLogo',
    margin:'10 20 15 20',

    requires: [
        'Ext.Button',
    ],

    items: [
        {
            xtype: 'component',
            reference: 'logo',
            userCls: 'main-logo',
            html: `<h3 style="font-family:Papyrus,fantasy;font-size:20px;margin-top:2px;font-weight:bold;text-align: left;color: #fff;
            text-shadow:0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #f09,0 0 82px #f09,0 0 92px #f09,0 0 102px #f09,0 0 151px #f09;">Simlaba</h3>`
        }, 

	]
});
