Ext.define('Admin.view.laporan.Laporan', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    requires: ['Ext.list.Tree','Ext.data.TreeStore','Ext.panel.Collapser','Ext.layout.Card'],
    viewModel: {xclass: 'Admin.view.laporan.ViewModel'},
    controller: {xclass: 'Admin.view.laporan.Controller'},
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-book" aria-hidden="true"></i> Laporan</div>',
        },
        
        {
            xtype:'container',margin:'30 0 0 0',shadow:true,border:true,cls:'tab-modulpanel-cl-orange',height:PanelCompHeight,layout: {type: 'vbox',align: 'stretch'},defaultType: 'panel',scrollable: true,
            items:[
                {docked: 'left',scrollable: true,
                width:'40%',
                resizable: {split: true,edges: 'east'},
                items: [
                    {xtype: 'component',html : '<div class="alert alert-success"><b>Jenis Laporan<b></div>'},
                    {xtype: 'treelist',margin:'25 5 5 5', bodyPadding: 10,
                        reference: 'navigationTreeLaporan',
                        scrollable: true,
                        bind: {store:'{navItems}'},
                            
                        expanderFirst: false,
                        expanderOnly: false,singleExpand: true,
                        
                        listeners: {
                            itemclick: 'onNavigationItemClick',selectionchange: 'onNavigationTreeSelectionChange'
                        }
                        
                    }
                ]
            },
            {
                flex: 1,resizable: {split: true},
                items:[{xtype:'form_parameter_laporan'}]
            },
            ]
        }
      
    ]
});
