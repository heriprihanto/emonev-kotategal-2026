/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */

function slugify(text) {
    return text
      .toString() // Ensure the input is a string
      .normalize('NFD') // Decompose accented characters into base characters and diacritics
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing whitespace
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters (keep only alphanumeric, spaces, and hyphens)
      .replace(/\s+/g, '-') // Replace spaces with a single hyphen
      .replace(/-+/g, '-'); // Replace multiple consecutive hyphens with a single hyphen
  }

  
Ext.define('Admin.Application', {
    extend: 'Ext.app.Application',

    name: 'Admin',
    requires: ['Admin.*','Ext.Toast' ,'Ext.grid.*', 'Ext.Button','Ext.layout.*','Ext.tab.*','Ext.form.*','Ext.data.*','Ext.Responsive'],
    //defaultToken : 'login',

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
    }
});


