Ext.define('Admin.view.dashboard.IkuPD', {
    extend: 'Ext.Panel',
    xtype: 'iku-pd',bodyCls:'body-transparan',

    requires: [
        'Ext.Responsive',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.PanZoom'
    ],

    height: 450,

    platformConfig: {
        phone: {
            height: 300
        }
    },

    bodyPadding: 15,
    layout: 'vbox',
//    title: 'Network',

    

    items: [
        {xtype:'component',html:'<h6>Capaian Kinerja Perangkat Daerah</h6>'},
        {xtype:'panel',layout: 'fit',
            items:[
                {
                    //theme: 'Default',
                    colors: [
                        '#6aa5dc',
                '#fdbf00',
                '#ee929d'
                    ],
                    height:400,
                    xtype: 'cartesian',
                    shadow: 'true',
                    reference: 'chart',
                    insetPadding: '20 10',
                    store: {
                        fields: ['nama_pd_singkat','cap_tujuan','cap_sasaran', 'cap_program', 'cap_subkegiatan'],
                            proxy: {
                                type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
                                    url: REMOTE_URL + 'dashboard-kinerja-pd',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data',
                                    },
                                    writer: {
                                        type: 'json'
                                    },
                                    //listeners : {exception : function(proxy, response, operation) {Ext.toast({message: '<br/><h1> Error Koneksi Database , Refresh Halaman Ini </h1><br/>', timeout: 2000});}}
                                },
                                sortInfo: {field: 'id_sub_pd', direction: 'ASC'},autoLoad: true
                    },
                    //legend: true,
                    legend: {
                        type: 'sprite',
                        docked: 'top',
                        marker: {
                            size: 12
                        }
                    },
                        interactions: [{
                            type: 'panzoom',
                            axes: {
                                left: {
                                    allowPan: false,
                                    allowZoom: false
                                },
                                bottom: {
                                    allowPan: true,
                                    allowZoom: true
                                }
                            },
                            modeToggleButton: {
                                width: 240,
                                defaults: {
                                    flex: 1,
                                    ui: 'action'
                                },
                                items: [{
                                    iconCls: 'x-fa fa-arrows-alt',
                                    text: 'Pan',
                                    value: 'pan'
                                }, {
                                    iconCls: 'x-fa fa-search-plus',
                                    text: 'Zoom',
                                    value: 'zoom'
                                }]
                            }
                        }],
                        series: [{
                            type: 'bar',
                            xField: 'nama_pd_singkat',
                            yField: ['cap_tujuan','cap_sasaran', 'cap_program','cap_kegiatan', 'cap_subkegiatan'],
                            title: ['Tujuan','Sasaran', 'Program','Kegiatan', 'Sub Kegiatan'],
                            stacked: false,
                            style: {
                                minGapWidth: 15
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: 'onBarTipRender'
                            },
                        }],
                        axes: [{
                            type: 'numeric',
                            position: 'left',
                            fields: ['cap_tujuan','cap_sasaran', 'cap_program','cap_kegiatan', 'cap_subkegiatan'],
                            grid: {
                                even: {
                                    lineWidth: 1
                                },
                                odd: {
                                    stroke: '#fff'
                                }
                            },
                        }, {
                            type: 'category',grid:true,
                            position: 'bottom',
                            fields: 'nama_pd_singkat',
                            label: {rotate: {degrees: -45}},
                            style: {
                                textPadding: 0,fontSize:'10px' 
                            },
                        }]
                }
            ]
            
        }
    ]
});