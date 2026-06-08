Ext.define('Admin.view.dashboard.Timeline', {
    extend: 'Ext.Panel',
    xtype: 'timeline',bodyCls:'dashboard-panel-transparan',cls:'dashboard-panel-transparan',
    shadow:true,
    requires: [
       
        'Ext.Responsive'
    ],

    height: 450,

    platformConfig: {
        phone: {
            height: 400
        }
    },

    bodyPadding: 15,
    layout: 'vbox',
    //title: 'Tahapan',

    

    items: [{xtype:'component',html:` 
    <h2 style="color: #39ae99;">Tahapan Satu Data Indonesia </h2>
    <div class="panel-body">
    <div class="content main no-bottom">
      <div style="margin-top: 20px">
        <div class="row">
          <div class="col-md-12">
            <div class="portaldata-timeline">
              <div class="row">
                <div></div>
                <div class="col-md-3 col-sm-12 timeline active">
                  <div class="timeline-content">
                    <h4 class="title">Perencanaan</h4>
                    <p class="description">`+vJADWAL[0].tgl11+` s/d `+vJADWAL[0].tgl22+`</p>


                  </div>
                  <div class="border">
                    <div class="arrow-left"></div>
                    <i class="x-fa fa-circle"></i>
                    <div class="arrow-right"></div>
                  </div>
                  <span class="timeline-icon">
                    <i class="fa x-fa fa-address-book"></i>
                  </span>
                </div>
                <div class="col-md-3 col-sm-12 timeline active">
                  <span class="timeline-icon">
                    <i class="x-fa fa fa-align-justify"></i>
                  </span>
                  <div class="border">
                    <div class="arrow-left"></div>
                    <i class="x-fa fa-circle"></i>
                    <div class="arrow-right"></div>
                  </div>
                  <div class="timeline-content">
                    <h4 class="title">Pengumpulan Data</h4>
                    <p class="description">`+vJADWAL[1].tgl11+` s/d `+vJADWAL[1].tgl22+`</p>


                  </div>
                </div>
                <div class="col-md-3 col-sm-12 timeline active">
                  <div class="timeline-content">
                    <h4 class="title">Pemeriksaan Data</h4>
                    <p class="description">`+vJADWAL[2].tgl11+` s/d `+vJADWAL[2].tgl22+`</p>


                  </div>
                  <div class="border">
                    <div class="arrow-left"></div>
                    <i class="x-fa fa-circle"></i>
                    <div class="arrow-right"></div>
                  </div>
                  <span class="timeline-icon">
                    <i class="x-fa fa fa-align-justify"></i>
                  </span>
                </div>
                <div class="col-md-3 col-sm-12 timeline active">
                  <span class="timeline-icon">
                    <i class="x-fa fa fa-globe"></i>
                  </span>
                  <div class="border">
                    <div class="arrow-left"></div>
                    <i class="x-fa fa-circle"></i>
                    <div class="arrow-right"></div>
                  </div>
                  <div class="timeline-content">
                    <h4 class="title">Penyebarluasan Data</h4>
                    <p class="description">`+vJADWAL[3].tgl11+` s/d `+vJADWAL[3].tgl22+`</p>


                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`}]
});