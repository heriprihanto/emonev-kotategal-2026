
var mTHIS = null;
var zTHIS = null;
let XAPITOKEN = '';
const windowRegistry = {};
Ext.define('Admin.view.main.MainController', {
  extend: 'Admin.base.ViewController',

  alias: 'controller.main',
  requires: [
    'Ext.MessageBox', 'Admin.security.TokenStorage'
  ],

  showNavigation: false,

  initView: function (e, e, o) {
    //mTHIS = this; zTHIS = this;
  },

  onLaunch: function () {
    mTHIS = this; zTHIS = this;
    var view = this.getView();
    console.log(
      "%cHERI PRIHANTO ",
      "background:#cf5151;padding:10px;font-size:20px;color:white;border-radius:10px;"
    );
    console.log(view);

    Ext.Ajax.setCors(true);
    this.restoreSession();

    var xtoken = Admin.security.TokenStorage.retrieve();
    Ext.Ajax.request({
      method: 'GET',
      url: REMOTE_URL + 'kinerja/dashboardinfo',
      scope: this,
      waitMsg: 'Loading...',
      headers: {
        'Authorization': 'Bearer ' + xtoken
      },
      success: function (response, request) {
        var r = Ext.decode(response.responseText);
        var vm =  this.getViewModel(); 
				vm.set('paguanggaranopd', r[0].pagu);
        vm.set('realisasiopd', r[0].realisasi);
        vm.set('persenrealisasi', ((Number(r[0].realisasi)/Number(r[0].pagu))*100));

      }
    });
    /*
    const toolboxWidget = document.getElementById("toolboxWidget");
    let isDragging = false;
    let offsetX, offsetY;

    toolboxWidget.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - toolbox.offsetLeft;
      offsetY = e.clientY - toolbox.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        toolbox.style.left = (e.clientX - offsetX) + "px";
        toolbox.style.top = (e.clientY - offsetY) + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
    */
  },
  
  createAppWindow: function (cfg) {
    var DTHS = this;
    const win = Ext.create('Ext.Panel', Ext.apply({
      xtype: 'panel',
      floated: true,
      modal: false,
      shadow: true,
      width: '90%', //Math.min(900, Ext.Viewport.getWindowWidth()*0.9),
      height: '80%', //Math.min(600, Ext.Viewport.getWindowHeight()*0.85),
      left: 10 + Ext.Number.randomInt(0, 50),
      top: 30 + Ext.Number.randomInt(0, 50),
      cls: 'app-window',
      draggable: true,
      resizable: {
        edges: 'all'
      },
      layout: 'fit',
      header: {
        title: cfg.title || 'Window',
        userCls: 'app-window-header',
        items: [{
          xtype: 'segmentedbutton',
          ui: 'plain',
          userCls: 'app-segmentedbutton-header',
          items: [
            { iconCls: 'x-fa fa-minus', tooltip: 'Minimize', handler: minimize ,ui:'soft-purple'},
            { iconCls: 'x-fa fa-square', tooltip: 'Maximize / Restore', handler: toggleMaximize ,ui:'soft-green'},
            { iconCls: 'x-fa fa-times', tooltip: 'Close', handler: close ,ui:'soft-red'}
          ]
        }]
      }
    }, cfg));

    let maximized = false;
    function minimize() {
      win.hide();
      DTHS.updateTaskButton(win._taskButton, false);
    }
    function toggleMaximize() {
      const tbHeight = 50; //taskbar.getHeight();
      if (!maximized) {
        win._preBounds = {
          width: win.getWidth(), height: win.getHeight(), left: win.getLeft(), top: win.getTop()
        };
        win.setLeft(0); win.setTop(0);
        win.setWidth(Ext.Viewport.getWindowWidth());
        win.setHeight(Ext.Viewport.getWindowHeight() - tbHeight);
        maximized = true;
      } else {
        const b = win._preBounds || {};
        if (b.width) { win.setWidth(b.width); }
        if (b.height) { win.setHeight(b.height); }
        if (Ext.isNumber(b.left)) { win.setLeft(b.left); }
        if (Ext.isNumber(b.top)) { win.setTop(b.top); }
        maximized = false;
      }
    }
    function close() {
      const id = win._appId;
      if (id && windowRegistry[id]) {
        delete windowRegistry[id];
      }
      if (win._taskButton) {
        Ext.getCmp('taskButtonsPanel').remove(win._taskButton, true);
      }
      win.removeAll(true,true);
      win.destroy();
      
    }

    win.on('show', function () { DTHS.bringToFront(win); DTHS.updateTaskButton(win._taskButton, true); });
    win.on('activate', function () { DTHS.bringToFront(win); });

    return win;
  },

  updateTaskButton: function (btn, active) {
    if (!btn) return;
    btn.setPressed(active);
  },

  ensureWindowFor: function (app) {
    var DTHS = this;
    let win = windowRegistry[app.id];
    if (!win) {
      // Buat konten berdasarkan jenis app
      let inner;

      inner = { xtype: app.type };


      win = this.createAppWindow({
        title: `<span style="color:whitesmoke">${app.name}</span>`,
        items: [inner]
      });
      win._appId = app.id;

      // Tambahkan tombol taskbar

      const btn = Ext.create('Ext.Button', {
        text: app.name,
        ui: 'taskbarbutton',
        icon: app.icon,
        enableToggle: true,
        pressed: true,
        margin: '0 2 0 2',
        //cls: 'task-button',
        handler: function () {
          if (win.isHidden()) { win.show(); } else { win.hide(); }
          DTHS.updateTaskButton(btn, !win.isHidden());
          if (!win.isHidden()) DTHS.bringToFront(win);
        }
      });
      win._taskButton = btn;
      Ext.getCmp('taskButtonsPanel').add(btn);


      windowRegistry[app.id] = win;
    }
    return win;
  },

  bringToFront: function (win) {
    // Bawa ke depan saat diaktifkan
    if (win && win.setZIndex) {
      const max = Ext.Component.zIndex;
      win.setZIndex(max + 10);
    }
  },

  openApp: function (view, location) {

    //alert ("AAAAAAAAAA");
    let rolename="";
    const role_id = vUSER_INFO.role_id;
    if (role_id< 4) {
      rolename ="admin";
    } else if (role_id===4) {
      rolename="kaopd";
    } else if (role_id>4) {
      rolename="useropd";
    } 
    const roles = location.record.data.roles;
    var exists = roles
        .split(',')
        .map(r => r.trim())
        .includes(rolename);

    if (exists) {
      const rec = location && location.record;
      if (rec) {
        const win = this.ensureWindowFor(rec.data);
        win.show();
        this.bringToFront(win);
      }
      this.hideStartMenu();
    }
    

  },
  ToggleshowStartMenu: function () {
    var view = this.getView(),
      startMenu = this.startMenu;
    if (startMenu) {
      if (startMenu.isHidden()) this.showStartMenu(); else this.hideStartMenu();
    } else {
      this.showStartMenu();
    }
  },
  showStartMenu: function () {
    var view = this.getView(),
      startMenu = this.startMenu;

    if (!startMenu) {
      startMenu = Ext.apply({
        ownerCmp: view
      }, view.startMenu);

      this.startMenu = startMenu = Ext.create(startMenu);
    }
    const tb = Ext.getCmp('desktopTaskbar');
    startMenu.setLeft(10);
    startMenu.setBottom(tb.getHeight() + 8);
    startMenu.show();

  },
  hideStartMenu: function () {
    var view = this.getView(),
      startMenu = this.startMenu;
    if (startMenu) {
      startMenu.hide();
    }
  },


  restoreSession: async function() {
    
    var xtoken = Admin.security.TokenStorage.retrieve();
    XAPITOKEN = xtoken;
    if (xtoken) {
      Ext.Viewport.setMasked({
        xtype: 'loadmask',
        message: 'Load data...'
      });

      try {
        const res = await fetch(`${REMOTE_URL}auth/getjwt`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${xtoken}`
          }
        });

          // handle HTTP error (penting di fetch)
          if (!res.ok) {
              throw new Error('HTTP error ' + res.status);
          }

          const r = await res.json();

          // simpan session (scope zTHIS tetap dipakai)
          Admin.security.TokenStorage.saveSession(zTHIS, r);

          // role logic
          if (r.roleid == 1) {
              isAdmin = true;
              isVerif = true;
              isProdusenData = false;

          } else if (r.roleid == 2 || r.roleid == 3) {
              isAdmin = true;
              isVerif = true;
              isProdusenData = false;

          } else if (r.roleid > 3) {
              isAdmin = false;
              isVerif = false;
              isProdusenData = true;
          }

      } catch (e) {
          console.error(e);
          this.openLoginForm();
      } finally {
        Ext.Viewport.setMasked(false);
      }
      

      /*
      Ext.Ajax.request({
        method: 'GET',
        url: REMOTE_URL + 'auth/getjwt',
        scope: this,
        waitMsg: 'Loading...',
        headers: {
          'Authorization': 'Bearer ' + xtoken
        },
        success: function (response, request) {
          var r = Ext.decode(response.responseText);
          Admin.security.TokenStorage.saveSession(zTHIS, r);
          if (r.roleid == 1) {
            isAdmin = true; isVerif = true; isProdusenData = false;
          } else if (r.roleid == 2 || r.roleid == 3) {
            isAdmin = false; isVerif = true; isProdusenData = false;
          } else if (r.roleid == 6) {
            isAdmin = false; isVerif = false; isProdusenData = true;
          }

        },
        failure: function (conn, response, options, eOpts) {          
          this.openLoginForm(); //setModulView('login');
        }
      });
      */
      

    } else {
      //this.setModulView('login');
      this.openLoginForm();
    }

  },

  

  menuClick: function (btn) {
    var xtype = btn.mview;
    var role = btn.role;
    if (isAdmin == false && role == 'admin') { return false; }
    if (xtype != undefined) {
      this.redirectTo(xtype);
    }
  },

  /*
  routes: {
    //':node': 'setCurrentView'
  },

  listen: {
    controller: {
      '#': {
        unmatchedroute: 'setCurrentView'
      }
    }
  },

  setModulView: function (hashTag) {
    var view = this.getView();
    hashTag = (hashTag || '').toLowerCase();
    item = view.child('component[routeId=' + hashTag + ']');
    if (!item) {
      item = { xtype: hashTag, routeId: hashTag };
    }
    view.setActiveItem(item);
  },

  setCurrentView: function (hashTag) {
    var xtoken = Admin.security.TokenStorage.retrieve();
    hashTag = (hashTag || '').toLowerCase();
    const xmenu = ["pengaturan"];


    if (xtoken) {
      if (isAdmin == false && xmenu.indexOf(hashTag) > -1) {
        this.redirectTo('dashboard');
        return false;
      } else {
        this.setModulView(hashTag)
      }

    } else {
      this.setModulView('login')
    }



  },

  config: {
    showNavigation: true
  },



  collapsedCls: 'main-nav-collapsed',

  goToDashboard: function () {
    this.redirectTo('dashboard');
  },

  goToRegister: function () {
    this.redirectTo('register');
  },

  hideToolbar: function () {
    Ext.getCmp("xMainToolbar").hide();
    Ext.getCmp("xMainFooter").hide();
  },
  showToolbar: function () {
    Ext.getCmp("xMainToolbar").show();
    Ext.getCmp("xMainFooter").show();
  },

  

  deactiv: function () {
    Ext.getCmp("xMainToolbar").show();
    Ext.getCmp("xMainFooter").show();
  },
  */
  initViewLoginContainer: function () {
    this.genCaptcha();
  },
  logOut: function (e, e, o) {
    //this.setModulView('login');
    Admin.security.TokenStorage.clear();
    window.location.reload();

  },

  onFormLoginSubmit: function (t, r, e, o) {
    e.preventDefault();
  },
  eventKeydown: function (t, e, o) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.loginUp();
    }
  },

  openLoginForm: function () {
    Ext.getCmp("mainDesktopContainer").setHidden(true);
    Ext.getCmp("desktopTaskbarTop").setHidden(true);
    Ext.getCmp("desktopTaskbar").setHidden(true);
    //Ext.getCmp("iconDesktopList1").setHidden(true);
    //Ext.getCmp("iconDesktopList2").setHidden(true);
    //Ext.getCmp("iconDesktopList3").setHidden(true);

    hashTag = 'login';
    var view = this.getView();
    hashTag = (hashTag || '').toLowerCase();
    item = view.child('component[routeId=' + hashTag + ']');
    if (!item) {
      item = { xtype: hashTag, routeId: hashTag };
    }
    view.setActiveItem(item);
  },

  loginUp: function (btn) {
    var xForm = Ext.getCmp('form-login-portal-data');

    var deferred = new Ext.Deferred();

    var captcInput = xForm.lookupName('captcha').getValue();

    if (captcInput != captchaCode) {
      this.toastPesan('error', 'Kode Captcha Tidak Sesuai !!</h1>', 2000);
      return false;
    }

    if (xForm.validate()) {
      xForm.submit({
        url: REMOTE_URL + 'auth/login',
        scope: this, method: 'POST', waitMsg: 'Prosesing ... ...',
        success: function (f, r, d) {
          if (r.token) {
            XAPITOKEN = r.token;
            Admin.security.TokenStorage.saveSession(zTHIS, r);
            //zTHIS.redirectTo('dashboard');
            Admin.security.TokenStorage.save(r.token);
            deferred.resolve(r);
            window.location.reload();
          }
          else {
            this.toastPesan('error', 'Login Gagal !!!<br/>', 2000);
            deferred.reject(r);
          }


        },
        failure: function (f, o) {
          console.log(o.responseText);
          var ermsg = JSON.parse(o.responseText);

          this.toastPesan('error', 'Login Gagal !!! <br/><br/>' + ermsg.detail.msg, 2000);
        }
      }
      );
    } else {
      this.toastPesan('error', 'Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
    }
  },

  registerUser: function (btn) {
    var xForm = btn.up('formpanel');
    var xDiag = xForm.up().up().up().up();

    if (xForm.validate()) {
      xForm.submit({
        url: REMOTE_URL + 'auth/register',
        scope: this, method: 'POST', waitMsg: 'Prosesing ... ...',
        success: function (f, r, d) {
          this.toastPesan('success', 'Registrasi Berhasil !!', 2000);
          Ext.getCmp('panelLoginRegister0pos0d99dir').setActiveItem(0);

        },
        failure: function (f, o) {
          console.log(o.responseText);
          var ermsg = JSON.parse(o.responseText);
          this.toastPesan('error', 'Registrasi Gagal !!! <br/><br/>' + ermsg.detail[0].msg, 2000);
        }
      });
    } else {
      this.toastPesan('error', 'Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
    }
  },

  getNip: function (t, e, o) {
    var nip = t.getValue(), xForm = t.up('formpanel');
    console.log(nip);
    Ext.Ajax.request({
      url: REMOTE_URL + 'simpeg-getnip', method: 'GET', waitMsg: 'Loading .. . ',
      params: {
        'nip': nip,
      },
      success: function (response, opts) {
        var obj = Ext.decode(response.responseText);
        xForm.lookupName('opd').setValue(obj.opd);
        xForm.lookupName('display_name').setValue(obj.nama);
        xForm.lookupName('id_instansi').setValue(obj.id_sub_pd);
      },

      failure: function (response, opts) {
        Ext.toast('Error System !!');
      }
    });
  },

  resetUser: function (btn) {
    var xForm = btn.up('formpanel');
    var xDiag = xForm.up().up().up().up();


    if (xForm.validate()) {
      xForm.submit({
        url: REMOTE_URL + 'auth/reset-user',
        scope: this, method: 'POST', waitMsg: 'Prosesing ... ...',
        success: function (f, r, d) {
          zTHIS.toastPesan('success', 'Reset password Berhasil !!', 2000);
        },
        failure: function (f, o) {

          this.toastPesan('error', 'Reset Password Gagal !!! <br/>Username / No HP salah !!', 5000);
        }
      });
    } else {
      this.toastPesan('error', 'Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ', 2000);
    }
  },
  initViewLogin: function (e, e, o) {
    this.genCaptcha();
  },

  genCaptcha: function () {
    document.getElementById('captcha').innerHTML = "";
    var charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    var lengthOtp = 5;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {

      var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "cvscaptcha";
    canv.class = "mycaptcha";
    canv.width = 120;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "32px Georgia";

    ctx.strokeStyle = "#a1a5b7";
    ctx.strokeText(captcha.join(""), 0, 30);
    //storing captcha so that can validate you can save it somewhere else according to your specific requirements
    captchaCode = captcha.join("");
    document.getElementById("captcha").appendChild(canv);
  },
  openRegisterForm: function (btn) {
    Ext.getCmp("form-register-portal-data").setHidden(false);
    Ext.getCmp("form-login-portal-data").setHidden(true);
    Ext.getCmp("form-reset-password-portal-data").setHidden(true);
  },

  
  openResetForm: function (btn) {
    Ext.getCmp("form-login-portal-data").setHidden(true);
    Ext.getCmp("form-reset-password-portal-data").setHidden(false);
    Ext.getCmp("form-register-portal-data").setHidden(true);
  },

  openFormProfil: function (btn) {
    console.log('OPEN PROFIL');
    var view = this.getView();

		view.add({
			xtype: 'dialog',
			title: 'Profil Pengguna',
			closable: true,
			closeToolText : 'Tutup',
			defaultFocus: '#ok',
			maximizable: false,
			maskTapHandler: 'onCancel',
			bodyPadding: 20,
			maxWidth: 700,
			width:700,height:850,top:30,left :100,
			items:[
				{xtype:'profil-opd-mainform'}
			]
		}).show();
  },

});