Ext.define('Admin.view.auth.Login', {
    extend: 'Admin.view.auth.AuthBase',
    xtype: 'login',
    reference: 'formLoginA', userCls: 'login-container-panel', cls: 'login-container-panel',
    //bodyPadding: 0,fullscreen:true,width:'100%',height:'100%',
    autoSize: true,
    defaults: { clearable: false },
    //controller: 'main',
    listeners: {
        activate: 'initViewLoginContainer',
        deactivate: 'deactiv',
        submit: 'onFormLoginSubmit'
    },
    requires: [
        'Ext.field.Checkbox',
        'Ext.field.Email',
        'Ext.field.Password',
        'Ext.layout.HBox'
    ],

    items: [
        {
            xtype: 'component', html: `
        <div id="x-logo-emonev"><div style="float:left;width:140px;"> <img src="resources/images/logo-tegal.png" width=180px></div><div style="float:left;"><h3 class="x-logo-text-emonev">SIMLABA</h3>
        <p class="x-logo-desc-emonev">Sistem Informasi, <br> Laporan Perkembangan Pembangunan <br/> Kota Tegal</p></div></div>`},
        {
            xtype: 'formpanel', padding: 20, width: 400, cls: 'login-panel', bodyCls: 'login-body-panel', id: 'form-login-portal-data', shadow: true,
            defaults: {
                margin: '0 0 10 0'
            },
            submitOnAction: false, method: 'post',jsonSubmit :true,
            items: [
                { html: '<h2 style="color:#a1a5b7!important;text-align:center;">LOGIN</h2>' },
                { xtype: "hiddenfield", fieldLabel: "p", name: "id", value: 0 },
                { xtype: "hiddenfield", fieldLabel: "p", name: "app", value: 'elaba' },
                { xtype: "textfield",listeners:{keydown:'eventKeydown'}, margin: '20 0 10 0', labelAlign: 'top', label: '<span style="color:#a1a5b7!important;font-weight:bold;">Username :</span>', name: "username", required: true, clearable: false, ui: 'logintext', cls: 'icon-textfield x-fa fa-user', placeholder: 'Username' },
                { xtype: "passwordfield",listeners:{keydown:'eventKeydown'}, margin: '20 0 20 0', labelAlign: 'top', label: '<span style="color:#a1a5b7!important;font-weight:bold;">Password :</span>', name: "password", required: true, clearable: false, ui: 'logintext', cls: 'icon-textfield x-fa fa-key', placeholder: 'Password' },
                {
                    xtype: 'containerfield', cls: 'field-captcha',
                    items: [
                        { xtype: "button", ui: "header linkbutton", iconCls: 'x-fa fa-sync putih', handler: 'genCaptcha' },
                        { xtype: "component", html: '<div id="captcha"></div>', margin: '0 0 0 30' },
                        { xtype: "textfield", listeners:{keydown:'eventKeydown'},labelAlign: 'top', label: '<span style="color:#a1a5b7 !important;font-weight:bold;">Kode Captcha :</span>', name: "captcha", required: true, clearable: false, ui: 'logintext', margin: '0 0 0 30', placeholder: 'Masukan kode captcha', width: 120 },
                    ]
                },

                {
                    xtype: 'button',
                    width: '100%',
                    text: 'Login',
                    iconAlign: 'right',
                    ui: 'soft-green',
                    handler: 'loginUp', iconCls: 'x-fa fa-key'
                }, {
                    layout: 'hbox',
                    items: [
                        { xtype: "button", text: 'Register', ui: "loginbtnmenu", handler: 'openRegisterForm' },
                        { xtype: "button", text: 'Lupa Password', ui: "loginbtnmenu", handler: 'openResetForm' },
                    ]
                }]
        },
        {
            xtype: 'formpanel', padding: 20, width: 450, cls: 'login-panel', bodyCls: 'login-body-panel', hidden: true, id: 'form-register-portal-data',jsonSubmit :true,
            defaults: {
                margin: '0 0 10 0',labelAlign:'top',
            },
            items: [
                { html: '<h2 style="color:#a1a5b7!important;text-align:center;">Pendaftaran Akun</h2>' },
                { xtype: "textfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">NIP (tanpa spasi):</span>', name: "username", required: true, clearable: false, ui: 'login-text'/*, listeners: { blur: 'getNip' }*/ },
                { xtype: "textfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">Nama :</span>', name: "display_name", required: true, clearable: false, ui: 'login-text' },
                {xtype: 'combobox',required:true,label: '<span style="color:#a1a5b7!important;font-weight:bold;">OPD</span>',placeholder: 'OPD ...', queryMode: 'local',valueField: 'id_sub_pd', displayField: 'nama_pd',
                    striped: true,multiSelect:true,name: 'opds',
                    store: {autoLoad: true,fields: ['id_pd', 'nama_pd'],
                        proxy: {
                            type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
                            url: REMOTE_URL + 'referensi/opd',
                            reader: { type: 'json' },
                        }
                    },
                },
                { xtype: "textfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">No. HP :</span>', name: "apps",value:["elaba"],hidden:true },
                { xtype: "passwordfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">Password :</span>', name: "passwordfield", required: true, clearable: false, ui: 'login-text' },
                { xtype: "emailfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">Email :</span>', name: "email", required: true, clearable: false, ui: 'login-text', validators: 'email'},
                { xtype: "textfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">No. HP :</span>', name: "no_telp", required: true, clearable: false, ui: 'login-text' },
                //{ xtype: "hiddenfield",  name: "role_id",value:"4", required: true },
                {
                    xtype: 'button',
                    width: '100%',
                    text: 'Daftar',
                    iconAlign: 'right',
                    ui: 'soft-green',
                    handler: 'registerUser', iconCls: 'x-fa fa-key'
                }, {
                    layout: 'hbox',
                    items: [
                        { xtype: "button", text: 'Login', ui: "loginbtnmenu", handler: 'openLoginForm' },
                        { xtype: "button", text: 'Lupa Password', ui: "loginbtnmenu", handler: 'openResetForm' },
                    ]
                }]
        },
        {
            xtype: 'formpanel', padding: 20, width: 400, cls: 'login-panel', bodyCls: 'login-body-panel', hidden: true, id: 'form-reset-password-portal-data',
            defaults: {
                margin: '0 0 10 0',labelAlign:'top',
            },jsonSubmit :true,
            items: [
                { html: '<h2 style="color:#a1a5b7!important;text-align:center;">Reset Password</h2>' },
                { xtype: "hiddenfield", fieldLabel: "p", name: "id", value: 0 },

                { xtype: "textfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">NIP / Username :</span>', name: "username", required: true, clearable: false, ui: 'login-text' },
                { xtype: "textfield", label: '<span style="color:#a1a5b7!important;font-weight:bold;">No. HP :</span>', name: "phone", required: true, clearable: false, ui: 'login-text' },
                {
                    xtype: 'button',
                    width: '100%',
                    text: 'Kirim',
                    iconAlign: 'right',
                    ui: 'soft-green',
                    handler: 'resetUser', iconCls: 'x-fa fa-key'
                }, {
                    layout: 'hbox',
                    items: [
                        { xtype: "button", text: 'Login', ui: "loginbtnmenu", handler: 'openLoginForm' },
                        { xtype: "button", text: 'Register', ui: "loginbtnmenu", handler: 'openRegisterForm' },
                    ]
                }]
        }

    ]
});