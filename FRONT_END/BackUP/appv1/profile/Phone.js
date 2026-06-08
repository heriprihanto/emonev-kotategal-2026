Ext.define('Admin.profile.Phone', {
    extend: 'Ext.app.Profile',

    requires: [
        'Admin.view.*'
    ],

    // Map phone profile views to generic xtype aliases:
    //
    views: {
        /*
        pengaturan: 'Admin.view.pengaturan.Pengaturan',  
        personel: 'Admin.view.personel.Personel',
        rko: 'Admin.view.rko.Rko',
        rfk: 'Admin.view.rfk.Rfk',
		laporan: 'Admin.view.laporan.Laporan',
        profil: 'Admin.view.profil.Profil',
        kinerja: 'Admin.view.kinerja.Kinerja',
        kinerjakota: 'Admin.view.kinerjakota.Kinerjakota',
        dak: 'Admin.view.dak.Dak',
        pelaporan_kinerja: 'Admin.view.pelaporankinerja.Main',
        evaluasi_kinerja: 'Admin.view.evaluasikinerja.Main',
        renstra: 'Admin.view.renstra.Renstra'
        */
    },

    isActive: function () {
        return Ext.platformTags.phone;
    },

    launch: function () {
        // Add a class to the body el to identify the phone profile so we can
        // override CSS styles easily. The framework adds x-phone so we could
        // use it but this way the app controls a class that is always present
        // when this profile isActive, regardless of the actual device type.
        Ext.getBody().addCls('phone');
    }
});
