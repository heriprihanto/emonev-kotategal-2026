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
							<i class="x-fa fa-briefcase float-start" aria-hidden="true"></i>
								<span>`+DASHBOARD_INFO.jml1+`</span>
							</h2>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-green order-card">
						<div class="card-body">
							<h6 class="text-white">Jumlah IKU</h6>
							<h2 class="text-end text-white">
								<i class="feather icon-tag float-start"></i>
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
								<i class="feather icon-repeat float-start"></i>
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
								<i class="feather icon-award float-start"></i>
								<span>`+DASHBOARD_INFO.jml4+`</span>
							</h2>

						</div>
					</div>
				</div>

				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-green order-card">
						<div class="card-body">
							<h6 class="text-white">Capaian IKU</h6>
							<h2 class="text-end text-white">
								<i class="feather icon-award float-start"></i>
								<span>`+DASHBOARD_INFO.jml5+`</span>
							</h2>

						</div>
					</div>
				</div>

				<div class="col-md-6 col-xl-2">
					<div class="card bg-c-red order-card">
						<div class="card-body">
							<h6 class="text-white">IKU Belum tercapai</h6>
							<h2 class="text-end text-white">
								<i class="feather icon-award float-start"></i>
								<span>`+DASHBOARD_INFO.jml6+`</span>
							</h2>

						</div>
					</div>
				</div>

			</div> 
    `}]
});