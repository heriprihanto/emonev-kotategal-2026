/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Admin.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.mainviewmodel',

    data: {
        name: 'Admin',

        loremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        selectedOpd: null,selKegiatan:null,
		selectedProgram:null,selectedKegiatan:null,selectedNode:null,
		firstname: "",
        lastname: "",
        username: "",
        email: "",
        phone: "",opd:"",nm_sub_unit:"",display_name:"",
        activated: 0,
        role: 0,
		x: 0,y:0,z:0,db_item1:0,db_item2:0,db_item3:0,db_item4:0,
		bl_modal:0.4,bl_jasa:0.35,bl_pegawai:0.25
    },
    barChartStore: {
        fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
        proxy: {
            type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
                url: REMOTE_URL + 'kinerja/opd',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                },
                },
            sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: true
    },

    barChartKinerjaStore: {
        fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
        proxy: {
            type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
                url: REMOTE_URL + 'pubapi/chartkinerja',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                },
                },
            sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: true
    },

    //TODO - add data, formulas and/or methods to support your view
});
