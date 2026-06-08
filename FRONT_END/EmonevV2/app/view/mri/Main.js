Ext.define('Admin.view.mri.Main', {
    extend: 'Ext.Container',
    xtype: 'mri-main-menu',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    requires: ['Ext.list.Tree','Ext.data.TreeStore','Ext.panel.Collapser','Ext.layout.Card'],
    viewModel: {xclass: 'Admin.view.mri.ViewModel'},
    controller: {xclass: 'Admin.view.mri.Controller'},
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-book" aria-hidden="true"></i> Manajemen Risiko</div>',
        },
        
        {
            xtype:'container',margin:'30 0 0 0',
           //cls:'tab-modulpanel-cl-orange',
            height:PanelCompHeight,layout: {type: 'vbox',align: 'stretch'},defaultType: 'panel',scrollable: true,
            items:[
            {docked: 'left',scrollable: true,
                collapsible: 'left',
                width: 300,
                resizable: {split: true,edges: 'east'},
                items: [
                    
                    {xtype: 'treelist',margin:'25 5 5 5', bodyPadding: 10,
                        reference: 'navigationTreeMri',
                        scrollable: true,
                        bind: {store:'{navItems}'},
                            
                        expanderFirst: false,
                        expanderOnly: false,singleExpand: true,
                        
                        listeners: {
                            itemclick: 'onNavigationItemClick'
                        }
                        
                    }
                ]
            },
            {   xtype:'container',id:'mri-main-container',
                flex: 1,
                resizable: {split: true},
                
            },
            ]
        }
      
    ]
});
