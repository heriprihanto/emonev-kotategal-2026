Ext.define('Admin.view.dashboard.DashboardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dashboard',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Boolean'
    ],

    stores: {
        /*
        rfkData: {
            autoLoad: true,
            model: 'Admin.model.MultiDataXY',
            proxy: {
                type: 'api',
                url: REMOTE_URL +'chartrfk'
            }
        },
        ranking: {
            autoLoad: true,
            fields: [
                {
                    type: 'int',
                    name: 'id'
                },
                {
                    type: 'string',
                    name: 'nm_sub_pd'
                },
                {
                    type: 'string',
                    name: 'r_fisik'
                },
            ],
            proxy: {
                type: 'api',
                url: REMOTE_URL+'chartrfk/ranking'
            }
        }
        */
    }
});
