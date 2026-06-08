Ext.define('Admin.view.dashboard.GrafikTw', {
    extend: 'Ext.Panel',
    xtype: 'grafik-tw',bodyCls:'body-transparan',

    requires: [
        'Ext.Responsive',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.series.Series',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.series.Line'
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
        {xtype:'component',html:'<h6>Capaian Kinerja Per Triwulan</h6>'},
        {xtype:'panel',layout: 'fit',
            items:[
                {
                    //theme: 'Default',
                    colors: [
                        '#aed581','#6aa5db','#ee929c','#fdbf00'
                    ],
                    height:400,
                    xtype: 'cartesian',
                    shadow: 'true',
                    reference: 'chart-2',
                    insetPadding: '20 10',
                    store: {
                        fields: ['nama_pd_singkat','cap_iku', 'cap_program', 'cap_subkegiatan'],
                            proxy: {
                                type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
                                    url: REMOTE_URL + 'dashboard-kinerja-tw',
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
                       
                        series: [
                           
                            {
                                type: 'line',
                                xField: 'tw',
                                yField: 'cap_iku',title:'Capaian IKU',
                                smooth: true,
                                style: {
                                    lineWidth: 2
                                },
                                marker: {
                                    radius: 4
                                },
                                highlight: {
                                    fillStyle: '#000',
                                    radius: 5,
                                    lineWidth: 2,
                                    strokeStyle: '#fff'
                                }
                            }, {
                                type: 'line',
                                xField: 'tw',
                                yField: 'cap_program',title:'Capaian Program',
                                smooth: true,
                                style: {
                                    lineWidth: 2
                                },
                                marker: {
                                    radius: 4
                                },
                                highlight: {
                                    fillStyle: '#000',
                                    radius: 5,
                                    lineWidth: 2,
                                    strokeStyle: '#fff'
                                }
                            }, {
                                type: 'line',
                                xField: 'tw',
                                yField: 'cap_subkegiatan',title:'Capaian Sub Kegiatan',
                                smooth: true,
                                style: {
                                    lineWidth: 2
                                },
                                marker: {
                                    radius: 4
                                },
                                highlight: {
                                    fillStyle: '#000',
                                    radius: 5,
                                    lineWidth: 2,
                                    strokeStyle: '#fff'
                                }
                            }, {
                                type: 'line',
                                xField: 'tw',
                                yField: 'serapan_anggaran',title:'Serapan Anggaran',
                                smooth: true,
                                style: {
                                    lineWidth: 2
                                },
                                marker: {
                                    radius: 4
                                },
                                highlight: {
                                    fillStyle: '#000',
                                    radius: 5,
                                    lineWidth: 2,
                                    strokeStyle: '#fff'
                                }
                            },
                        ],
                        axes: [{
                            type: 'numeric',
                            position: 'left',
                            fields: ['cap_iku', 'cap_program', 'cap_subkegiatan'],
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
                            fields: 'tw',
                            //label: {rotate: {degrees: -45}},
                            style: {
                                textPadding: 0,fontSize:'10px' 
                            },
                        }]
                }
            ]
            
        }
    ]
});