Ext.define('Admin.view.laporan.Controller', {
	extend: 'Admin.base.ViewController',
	init:function(){
		//this.callParent();
	},

	onNavigationItemClick: function (tree, info) {
        if (info.select) {
        }
    },

	filterOpdCombo:function(combo, newValue, oldValue) {
		Ext.getCmp('opdx8899iTRSJKaksComboField').getStore().filter(
			[
				{
					property : 'id_pd',
					value    : newValue
				}
			]
		)
	},

	onNavigationTreeSelectionChange: function (tree, node) {
		Ext.fly('ppa094kfr1imwh').update('<b>'+node.get('text')+'</b>');
		reportName = node.get('reportName');
		var xForm= Ext.getCmp('formParameterLaporan0905k9234');
		var mID=node.get('mID');
		
		xForm.lookupName('report_name').setValue(reportName);
		/*
		this.hideAllEl();
		switch(mID) {
			case 7:
				//xForm.lookupName('idOpd').show();
			break;
			case 1:
				xForm.lookupName('idOpd').show();
			break;
			case 2:
				xForm.lookupName('idOpd').show();
				xForm.lookupName('id_arsip').show();
			  break;
			case 3:
				xForm.lookupName('idOpd').show();
			  break;
			case 4:
				xForm.lookupName('idOpd').show();xForm.lookupName('eselon').show();xForm.lookupName('id_pejabat').show();xForm.lookupName('id_arsip').show();
				XFILTER_PERSONEL=0;
			case 44:
				xForm.lookupName('idOpd').show();xForm.lookupName('id_pejabat').show();xForm.lookupName('id_arsip').show();
				
				//xForm.lookupName('eselon').show();
				XFILTER_PERSONEL=1;
			case 5:
				xForm.lookupName('idOpd').show();
				break;
			case 6:
				xForm.lookupName('idOpd').show();
				break;
			
			case 11:
				xForm.lookupName('idOpd').show();
				xForm.lookupName('eselon').setValue(2);xForm.lookupName('id_pejabat').setValue(1);xForm.lookupName('id_arsip').setValue(1);xForm.lookupName('tw').setValue(1);
				break;
			case 12:
				xForm.lookupName('idOpd').show();
				xForm.lookupName('eselon').setValue(2);xForm.lookupName('id_pejabat').setValue(1);xForm.lookupName('id_arsip').setValue(1);xForm.lookupName('tw').setValue(1);
				break;
			case 13:
				xForm.lookupName('idOpd').show();
				xForm.lookupName('tw').show();
				xForm.lookupName('id_arsip').show();
				break;
			case 14:
				xForm.lookupName('idOpd').show();
				xForm.lookupName('tw').show();
				xForm.lookupName('id_arsip').show();
				break;
			case 15:
				xForm.lookupName('idOpd').show();
				xForm.lookupName('tw').show();
				xForm.lookupName('id_arsip').show();
				break;
			//xForm.lookupName('eselon').show();xForm.lookupName('id_pejabat').show();xForm.lookupName('id_arsip').show();xForm.lookupName('tw').show();
			case 16:
				xForm.lookupName('idOpd').show();
				//xForm.lookupName('bab').show();
				break;
			case 17:
				xForm.lookupName('idOpd').show();xForm.lookupName('eselon').show();xForm.lookupName('id_pejabat').show();xForm.lookupName('id_arsip').show();
				xForm.lookupName('tw').show();xForm.lookupName('eselon').setValue(2);
				break;
			case 22:
				xForm.lookupName('id_arsip').show();
				xForm.lookupName('tw').show();
				break;
			default:
			  // code block
		  }
		  */
    },
});
