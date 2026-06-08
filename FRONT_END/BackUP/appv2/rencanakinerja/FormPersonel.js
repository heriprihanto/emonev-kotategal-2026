Ext.define('Admin.view.rencanakinerja.FormPersonel', {
    extend: 'Ext.form.Panel',
    xtype:'rencana-capkin-form-personel',
    jsonSubmit: true,

	cls: 'shadow',
    fullscreen: true,
    scrollable: true,
    bodyPadding: 10,
    //standardSubmit : true,
    //target:'_blank',
    defaults: {labelAlign:'top'},

    items:[
        { xtype: "numberfield", name: "id_sub_pd",hidden:true},
        { xtype: "numberfield", name: "id_pd",hidden:true},
        { xtype: "numberfield", name: "lvl",hidden:true},
        { xtype: "textfield", name: "id_parent",hidden:true},

        { xtype: "component",margin: '10 0 10 0', html:`<div id="788y-rencana-kinerja-form-personel" class="badge2 bg-danger2" style="font-size:14px;text-wrap: wrap; !important"> </div>` },

        {xtype: 'combobox',margin: '25 0 10 0',
            label: 'KPA / PPTK',
            placeholder: 'Pilih Pengguna ...', name: 'nip_pptk',
            //triggerAction: 'query', queryParam: 'nama',
            queryMode: 'local',
            valueField: 'username', displayField: 'display_name',
            //value:vUSER_INFO.id_opd,
            store: {
                    fields: ['id', 'nip', 'nama'],
                    proxy: {
                        type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
                            url: REMOTE_URL + 'rencanakinerja/personel',
                            reader: {
                                type: 'json',
                            },
                        },
                        sortInfo: {field: 'id', direction: 'ASC'},
                    autoLoad: false,
            },
            floatedPicker: {}, forceSelection: true, striped: true,
        },
        {xtype: 'combobox',
            label: 'Operator',
            placeholder: 'Pilih Pengguna ...', name: 'nip_ops',
            //triggerAction: 'query', queryParam: 'nama',
            queryMode: 'local',
            valueField: 'username', displayField: 'display_name',
            store: {
                    fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
                    proxy: {
                        type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
                            url: REMOTE_URL + 'rencanakinerja/personel',
                            reader: {
                                type: 'json',
                                //rootProperty: 'data',
                            },
                        },
                        sortInfo: {field: 'id', direction: 'ASC'},
                    autoLoad: false,
            },
            floatedPicker: {}, forceSelection: true, striped: true,
            //listeners: {select: 'onComboOpdSelect'}
        },
            
    ],
    buttons: [
        {xtype:'spacer'},
        {text: 'Simpan', ui: "soft-cyan",shadow:true, 
			handler: 'simpanPersonel', iconCls: 'x-fa fa-save'}]

});
