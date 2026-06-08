/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Admin.Application', {
    extend: 'Ext.app.Application',

    name: 'Admin',
    requires: ['Admin.*','Ext.Toast' ,'Ext.grid.*', 'Ext.Button','Ext.layout.*','Ext.tab.*','Ext.form.*','Ext.data.*','Ext.Responsive'],
    defaultToken : 'login',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    mainView: 'Admin.view.main.Main',
    profiles: [
        'Phone',
        'Tablet'
    ],
    launch: function(profile) {
        
        //Ext.getBody().removeCls('loading');Ext.getBody().removeCls('loader');Ext.getBody().removeCls('loader.dot');
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.remove();
        this.getMainView().getController().onLaunch();
        this.callParent([profile]);
    },


    onAppUpdate: function () {
        window.location.reload();
        /*
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
        */
    }
});
