Ext.define('Admin.view.dashboard.KotakAtas', {
    extend: 'Ext.Panel',
    xtype: 'kotak-atas',
	cls: 'body-transparan',userCls: 'body-transparan',
	bodyCls:'body-transparan',
   
    requires: [
        'Ext.Responsive'
    ],
    layout: 'vbox',

    items: [{xtype:'component',userCls: 'body-transparan',cls: 'body-transparan',
    html:`
    <div class="row-dashboard">
				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-blue order-card">
						<div class="card-body">
							<h6 class="text-white">Program RPJMD</h6>
							<h2 class="text-end text-white">
								<span>`+DASHBOARD_INFO.jml1+`</span>
							</h2>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-green order-card">
						<div class="card-body">
							<h6 class="text-white">Program RKPD</h6>
							<h2 class="text-end text-white">
								<span>`+DASHBOARD_INFO.jml2+`</span>
							</h2>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-yellow order-card">
						<div class="card-body">
							<h6 class="text-white">Total Anggaran</h6>
							<h2 class="text-end text-white">
								<span>`+DASHBOARD_INFO.jml3+`</span>
							</h2>

						</div>
					</div>
				</div>

				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-blue order-card">
						<div class="card-body">
							<h6 class="text-white">Serapan Anggaran</h6>
							<h2 class="text-end text-white">
								<span>`+DASHBOARD_INFO.jml4+`</span>
							</h2>

						</div>
					</div>
				</div>

				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-green order-card">
						<div class="card-body">
							<h6 class="text-white">IKU Kota</h6>
							<h2 class="text-end text-white">
								<span>`+DASHBOARD_INFO.jml5+`</span>
							</h2>

						</div>
					</div>
				</div>

				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-red order-card">
						<div class="card-body">
							<h6 class="text-white">Subkegiatan</h6>
							<h2 class="text-end text-white">
								<span>`+DASHBOARD_INFO.jml6+`</span>
							</h2>

						</div>
					</div>
				</div>

			</div> 
    `}]
});