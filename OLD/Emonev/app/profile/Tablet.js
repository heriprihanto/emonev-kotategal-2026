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
        profil: 'Admin.view.profil.Profil',
        kinerja: 'Admin.view.kinerja.Kinerja',
        kinerjakota: 'Admin.view.kinerjakota.Kinerjakota',
        dak: 'Admin.view.dak.Dak',
        pelaporan_kinerja: 'Admin.view.pelaporankinerja.Main',
        evaluasi_kinerja: 'Admin.view.evaluasikinerja.Main',
        renstra: 'Admin.view.renstra.Renstra'
    },

    isActive: function () {
        return !Ext.platformTags.phone;
    }
});
