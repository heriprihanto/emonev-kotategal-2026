Ext.define('Admin.view.main.BarChart', {
    extend: 'Ext.Panel',
    xtype: 'chartsbarpanel',
    ui: "panel-widget-desktop-transparan",
    cls: "panel-widget-desktop-transparan",
    layout: 'fit',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.series.Bar'
    ],


    iconCls: 'x-fa fa-bar-chart',

    items: [{
        xtype: 'cartesian', shadow: 'true',
        background: ' transparent !important',
        //innerPadding: '0 20',
        colors: [
            '#ffffff'
        ],

        store: {
            autoLoad: true, fields: ['kodeurusan', 'urusan'],
            proxy: {
                type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
                url: REMOTE_URL + 'pubapi/chartkinerja', reader: { type: 'json' },
            }
        },

        axes: [{
            type: 'category',
            fields: [
                'xvalue'
            ],
            //hidden: true,
            position: 'bottom',
            label: {
                color: '#ffffff',
                font: '10px Arial'
            }
        }, {
            type: 'numeric',
            fields: [
                'yvalue'
            ],

            hidden: true,
            position: 'left'
        }],

        series: [{
            type: 'bar',
            xField: 'xvalue',
            yField: [
                'yvalue'
            ],
            style: {
                opacity: 1
            },
            highlightCfg: {
                opacity: 0.5,
                strokeStyle: 'black'
            },


            label: {
                field: 'yvalue',
                display: 'over'
            },
        }],
        platformConfig: {
            phone: {
                // On a phone the whole view becomes a vertical strip of charts,
                // which makes it impossible to scroll the view if touch action
                // started on a chart. So we use a custom touchAction config.
                touchAction: {
                    panX: true,
                    panY: true
                }
            },
            '!phone': {
                interactions: {
                    type: 'panzoom',
                    zoomOnPanGesture: true
                }
            }
        }
    }]
});