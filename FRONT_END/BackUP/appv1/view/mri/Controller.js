Ext.define('Admin.view.mri.Controller', {
	extend: 'Admin.base.ViewController',
	init:function(){
		//this.callParent();
	},

	onNavigationItemClick: function (tree, info) {
		console.log(info.node.data);
		var xview = Ext.getCmp('mri-main-container');
		var nview =  info.node.data.mview; 
		if (nview != 'parent') {
			xitem = xview.child('component[routeId=' + nview + ']');
			if (!xitem) {
				xitem = {xtype: nview,routeId: nview};
			}
			xview.setActiveItem(xitem);
		}
    },

});
