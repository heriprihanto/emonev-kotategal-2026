Ext.define('Admin.profile.Tablet', {
    extend: 'Ext.app.Profile',

    requires: [
        'Admin.view.*'
    ],

    // Map tablet/desktop profile views to generic xtype aliases:
    //
    views: {
        pengaturan: 'Admin.view.pengaturan.Pengaturan',  
        personel: 'Admin.view.personel.Personel',
        rko: 'Admin.view.rko.Rko',
        rfk: 'Admin.view.rfk.Rfk',
		laporan: 'Admin.view.laporan.Laporan',
        profil: 'Admin.view.profil.Profil'
       
    },

    isActive: function () {
        return !Ext.platformTags.phone;
    }
});
