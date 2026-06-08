Ext.define('Admin.view.main.ProgresReport', {
    extend: 'Ext.Container',
    xtype: 'dashboard-progres-report',
    height: "98%",
    width: "95%",
    items: [
        {
            xtype: "panel", header: false,
            shadow: true,
            top: 20,
            ui: "panel-widget-desktop",
            //cls:'panel-widget-desktop-cls',
            shadowCls: "shadow-white",
            bodyPadding: 15,
            width: "50%",
            right: 350,
            height: "100%",
            scrollable: 'vertical',
            items: [
                {
                    xtype: "component",
                    bind: {
                        html: `<h3 style="color:#ffffff;text-align:center">{nama_pd}</h3>`,
                    },
                    //html: 
                },
                {
                    xtype: "panel",
                    ui: "panel-widget-desktop-transparan",
                    defaultType: "panel",
                    layout: {
                        type: "hbox",
                    },
                    items: [
                        {
                            flex: 1,
                            height: "100%",
                            ui: "panel-widget-desktop-transparan",
                            bodyPadding: 10,
                            margin: "0 10 0 0",
                            items: [
                                {
                                    xtype: "component",
                                    html: `<h3 style="color:#ffffff;">Capaian Indikator Kinerja (%)</h3>`,
                                },

                                {
                                    xtype: 'chartsbarpanel', header: false,
                                    ui: "panel-widget-desktop-transparan",
                                    cls: "panel-widget-desktop-transparan",
                                    height: 150
                                },
                                {
                                    xtype: "component",
                                    html: `<br/><br/><h3 style="color:#ffffff;">Progres Keterisian Indikator</h3>`,
                                },
                                {
                                    xtype: "component",
                                    html: `<div class="contentWidget">
                                                                    <div class="device">
                                                                        <h5>Indikator Tujuan</h5>
                                                                        <div class="progress-container">
                                                                        <div class="progress-bar bg-danger" style="width: 20%;"></div>
                                                                        </div>
                                                                        <div class="progress-text">5/10 50%</div> 
                                                                    </div>
                                                                    </div>
                                                                    <div class="contentWidget">
                                                                    <div class="device">
                                                                        <h5>Indikator Sasaran</h5>
                                                                        <div class="progress-container">
                                                                        <div class="progress-bar bg-warning" style="width: 30%;"></div>
                                                                        </div>
                                                                        <div class="progress-text">5/10 50%</div> 
                                                                    </div>
                                                                    </div>
                                                                    
                                                                    <div class="contentWidget">
                                                <div class="device">
                                                    <h5>Indikator Program</h5>
                                                    <div class="progress-container">
                                                    <div class="progress-bar bg-info" style="width: 48%;"></div>
                                                    </div>
                                                    <div class="progress-text">5/10 50%</div> 
                                                </div>
                                                </div>
                                                <div class="contentWidget">
                                            <div class="device">
                                                <h5>Indikator Kegiatan</h5>
                                                <div class="progress-container">
                                                <div class="progress-bar bg-success" style="width: 75%;"></div>
                                                </div>
                                                <div class="progress-text">5/10 50%</div> 
                                            </div>
                                            </div>
                                            <div class="contentWidget">
                                                <div class="device">
                                                    <h5>Indikator Sub Kegiatan</h5>
                                                    <div class="progress-container">
                                                    <div class="progress-bar bg-nfo" style="width: 88%;"></div>
                                                    </div>
                                                    <div class="progress-text">5/10 50%</div> 
                                                </div>
                                                </div>`,
                                },


                            ],
                        },
                        {
                            flex: 1,
                            height: "100%",
                            ui: "panel-widget-desktop-transparan",
                            bodyPadding: 10,
                            margin: "0 10 0 0",
                            items: [
                                {
                                    xtype: "component",
                                    html: `<h3 style="color:#ffffff;">Realisasi Keuangan</h3>
                                                                  <h4 style="color:#ffffff;">Pagu Anggaran : Rp. 4.354.254.000,-</h4>

                                                                  <div class="contentWidget">
                                                                  <div class="device">
                                                                      <h5>Realisasi : Rp. 2.054.254.587,-</h5>
                                                                      <div class="progress-container">
                                                                      <div class="progress-bar bg-warning" style="width: 48%;"></div>
                                                                      </div>
                                                                      <div class="progress-text">50%</div> 
                                                                  </div>
                                                                  </div>
                                                                  <div style="height:50px"></div>
                                                                  `,
                                },
                                {
                                    xtype: "component",
                                    html: `<br/><br/><h3 style="color:#ffffff;">Progres Verifikasi Indikator</h3>`,
                                },
                                {
                                    xtype: "component",
                                    html: `<div class="contentWidget">
                                            <div class="device">
                                                <h5>Indikator Tujuan</h5>
                                                <div class="progress-container">
                                                <div class="progress-bar bg-danger" style="width: 20%;"></div>
                                                </div>
                                                <div class="progress-text">5/10 50%</div> 
                                            </div>
                                            </div>
                                            <div class="contentWidget">
                                            <div class="device">
                                                <h5>Indikator Sasaran</h5>
                                                <div class="progress-container">
                                                <div class="progress-bar bg-success" style="width: 90%;"></div>
                                                </div>
                                                <div class="progress-text">5/10 50%</div> 
                                            </div>
                                            </div>
                                            
                                            <div class="contentWidget">
                        <div class="device">
                            <h5>Indikator Program</h5>
                            <div class="progress-container">
                            <div class="progress-bar bg-info" style="width: 70%;"></div>
                            </div>
                            <div class="progress-text">5/10 50%</div> 
                        </div>
                        </div>
                        <div class="contentWidget">
                    <div class="device">
                        <h5>Indikator Kegiatan</h5>
                        <div class="progress-container">
                        <div class="progress-bar bg-warning" style="width: 48%;"></div>
                        </div>
                        <div class="progress-text">5/10 50%</div> 
                    </div>
                    </div>
                    <div class="contentWidget">
                        <div class="device">
                            <h5>Indikator Sub Kegiatan</h5>
                            <div class="progress-container">
                            <div class="progress-bar" style="width: 48%;"></div>
                            </div>
                            <div class="progress-text">5/10 50%</div> 
                        </div>
                        </div>`,
                                },



                            ],
                        },
                    ],
                },
            ],
        },
    ],
});