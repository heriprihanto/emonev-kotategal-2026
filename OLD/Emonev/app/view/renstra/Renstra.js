Ext.define('Admin.view.renstra.Renstra', {
    extend: 'Ext.Container',
    margin: '0 0 0 0',cls:'container-modul',padding:20,
    scrollable: true,
    viewModel: {xclass: 'Admin.view.renstra.ViewModel'},
	controller: {xclass: 'Admin.view.renstra.Controller'},
	
    items: [
        {
            xtype: 'component',
            html:'<div class="dt-entry__header"><i class="x-fa fa-calendar-check" aria-hidden="true"></i>  RENSTRA </div>',
        },
      
        {
            xtype:'tabpanel',tabBar: {layout: {pack: 'start',overflow: 'scroller'}},margin:'30 0 0 0',shadow:true,border:true,height:PanelCompHeight,
            cls:'tab-modulpanel-cl-merah',
            items: [		
                {title: '.:: OPD ::.' ,itemId: 'renstrapd-step-0',cls: 'card',hidden:true,
                    items:[{xtype:'renstra-list-opd'}]
                },
                
                {title: '.:: CASCADE ::.' ,itemId: 'renstrapd-step-1',cls: 'card',hidden:true,
                    items:[
                        {docked : 'top',xtype : 'toolbar',
								//defaults : {height : '30px',style : {fontSize : '11px'}},
								items : [
									{xtype: 'button',ui : 'decline',text: '',iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:0},
                                    {
                                        xtype: 'component',
                                        html:'<div id="renstra-opd-title">Dinas A</div>',
                                    },								
								],
					    },
                       
                      
                        {xtype:'tabpanel',height:PanelCompHeight,id:'renstra-tab-panel-009o0934lw',
                                items: [		
                                    {title: 'Cascading' ,itemId: 'renstra-step-0',cls: 'card',
                                        items:[{xtype:'renstra-list'}]
                                    },
                                    {title: 'Permasalahan' ,itemId: 'renstra-step-1',cls: 'card'},
                                    {title: 'Strategi' ,itemId: 'renstra-step-2',cls: 'card'},
                                    {title: 'Arah Kebijakan' ,itemId: 'renstra-step-3',cls: 'card'},
                                    {title: 'Isu Strategis' ,itemId: 'renstra-step-4',cls: 'card'},
                                    {title: 'Indikator' ,itemId: 'renstra-step-5',cls: 'card',hidden:true,
                                        items:[{xtype:'renstra-indikator-list'}]
                                    },
                                ]
                    }
                ]
                }
                
            
            ],
        }
      
    ],




    dialogForm: {
        xtype: 'dialog',
        title: 'Indikator',
        closable: true,
        closeAction:'hide',
        defaultFocus: '#ok',
        maximizable: true,
        bodyPadding: 20,
        //maxWidth: 200,
        width:'90%',height:'90%',
       // items:[{xtype:'rpjmd-form-indikator'}],
        
    },
    listeners: {
        painted : 'initTabItem'
	}
});
