/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
var mTHIS=null;
var zTHIS=null;
let XAPITOKEN='';
Ext.define('Admin.view.main.MainController', {
    extend: 'Admin.base.ViewController',

    alias: 'controller.main',
    requires: [
        'Ext.MessageBox', 'Admin.security.TokenStorage'
    ],
	
    showNavigation: false,
    initView: function(e,e,o) {
        mTHIS=this;zTHIS=this;
    },

    onLaunch: function() {
        Ext.Ajax.setCors(true);
        this.restoreSession();
    },

    restoreSession: function() {
        var xtoken =  Admin.security.TokenStorage.retrieve();
		XAPITOKEN=xtoken;
            if (xtoken) {
                Ext.Ajax.request({
                   method: 'GET',
                   url: REMOTE_URL +'auth/getjwt', 
				   //params: {'token':xtoken,'app':'laba'},
				   waitMsg: 'Loading...',
				   headers: {
					'Authorization': 'Bearer '+xtoken
					},
                    success: function (response, request) {
                            var r = Ext.decode(response.responseText); 
                            Admin.security.TokenStorage.saveSession(zTHIS,r); 
							if (r.roleid == 1) {
								isAdmin=true;isVerif=true;isProdusenData=false;
							} else if (r.roleid == 2 || r.roleid == 3) {
								isAdmin=false;isVerif=true;isProdusenData=false;
							} else if (r.roleid == 6) {
								isAdmin=false;isVerif=false;isProdusenData=true;
							} 
							
                        },
                        failure: function (conn, response, options, eOpts) {
                            zTHIS.setModulView('login');
                        }
                    });
                console.log(xtoken);
                
            } else {
                this.setModulView('login');
            }
        
        //r= JSON.parse('{"status":201,"success":true,"userdata":{"tahun":"2021","id":"1","email":"admin@admin.com","username":"admin","nama":"Admin","roleid":"1","idpd":"1"},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjEzNTY5OTk1MjQsIm5iZiI6MTM1NzAwMDAwMCwidWlkIjoiYWRtaW4iLCJuYW1hIjoiQWRtaW5pc3RyYXRvciJ9.UQ7j4pXTa-60ru_x2Bt_EWkrfvpm6XUutkugiJsBWx4"}'); 
        //Admin.security.TokenStorage.saveSession(zTHIS,r); 
    },

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'setCurrentView'
            }
        }
    },
	
	menuClick:function(btn){
		var xtype=btn.mview;
		var role=btn.role;
		if (isAdmin==false && role=='admin' ) {return false;}
		if (xtype != undefined) {
			this.redirectTo( xtype );
		}
	},

    routes: {
        ':node': 'setCurrentView'
    },

    setModulView: function (hashTag) {
        var view = this.getView();
        hashTag = (hashTag || '').toLowerCase();
        item = view.child('component[routeId=' + hashTag + ']');
         if (!item) {
             item = {xtype: hashTag,routeId: hashTag};
         }
        view.setActiveItem(item);  
    },

    setCurrentView: function (hashTag) {
            var xtoken =  Admin.security.TokenStorage.retrieve();            
                hashTag = (hashTag || '').toLowerCase();
			const xmenu = ["pengaturan"];

		
                if (xtoken) {
					if (isAdmin==false && xmenu.indexOf(hashTag) > -1) {
						this.redirectTo('dashboard');
						return false;
					} else {
						this.setModulView(hashTag)
					}
                    
                } else {
                    this.setModulView('login')
                }
           

              // this.setModulView(hashTag)
                
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

    initViewLoginContainer: function () {
        Ext.getCmp("xMainToolbar").hide();
        Ext.getCmp("xMainFooter").hide();
		this.genCaptcha();
    },

    deactiv: function () {
        Ext.getCmp("xMainToolbar").show();
        Ext.getCmp("xMainFooter").show();
    },

	logOut: function(e,e,o) {
        this.setModulView('login');
        Admin.security.TokenStorage.clear();
        //window.location.replace("https://e-laba.tegalkota.go.id/simlaba2023/");

    },

	onFormLoginSubmit: function(t, r, e, o) {
		e.preventDefault();
	},
	eventKeydown:function(t,e,o){
        //e.preventDefault();
        //console.log(e);
        if (e.keyCode==13){
            e.preventDefault();
            this.loginUp();
        }
    },

    loginUp: function(btn) {
		//var xForm=btn.up('formpanel');
		var xForm= Ext.getCmp('form-login-portal-data'); 
		//var xDiag=xForm.up().up().up().up();
		var deferred = new Ext.Deferred();
		
		var captcInput=xForm.lookupName('captcha').getValue();

		if (captcInput != captchaCode) {
			this.toastPesan('error','Kode Captcha Tidak Sesuai !!</h1>',2000);	
			return false;
		}
		
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'auth/login',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						success: function(f,r,d) {
							if (r.token) {  
								XAPITOKEN=r.token;							
								Admin.security.TokenStorage.saveSession(zTHIS,r); 						
								//zTHIS.redirectTo('dashboard');
								Admin.security.TokenStorage.save(r.token);
                    			deferred.resolve(r);
							} 
							else {
								zTHIS.toastPesan('error','Login Gagal !!!<br/>',2000);
								deferred.reject(r);	
							}		
							
							
						},
						failure: function(f, o) {	
							console.log(o.responseText);
							var ermsg= JSON.parse(o.responseText);

							zTHIS.toastPesan('error','Login Gagal !!! <br/><br/>'+ermsg.detail.msg,2000);	
						}						
					}
					);
        } else {
			zTHIS.toastPesan('error','Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},

	registerUser: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=xForm.up().up().up().up();
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'auth/register',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						success: function(f,r,d) {
							zTHIS.toastPesan('success','Registrasi Berhasil !!',2000); 
							Ext.getCmp('panelLoginRegister0pos0d99dir').setActiveItem(0);
                            
						},
						failure: function(f, o) {	
							console.log(o.responseText);
							var ermsg= JSON.parse(o.responseText);

							zTHIS.toastPesan('error','Registrasi Gagal !!! <br/><br/>'+ermsg.detail[0].msg,2000);	
						}								
					});
        } else {
			zTHIS.toastPesan('error','Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},

	getNip: function(t,e,o) {
		var nip=t.getValue(),xForm = t.up('formpanel');
		console.log(nip);
		Ext.Ajax.request({
			url: REMOTE_URL+'simpeg-getnip',method:'GET',waitMsg:'Loading .. . ',
			params: {
				'nip': nip,
			},
			success: function(response, opts) {				
				var obj = Ext.decode(response.responseText);
				xForm.lookupName('opd').setValue(obj.opd);
				xForm.lookupName('display_name').setValue(obj.nama);		
				xForm.lookupName('id_instansi').setValue(obj.id_sub_pd);			
			},
	   
			failure: function(response, opts) {
				Ext.toast('Error System !!');
			}
		});
	},

	resetUser: function(btn) {
		var xForm=btn.up('formpanel');
		var xDiag=xForm.up().up().up().up();
		
				
		if (xForm.validate()) {
            xForm.submit({
						url: REMOTE_URL +'auth/reset-user',
						scope:this,method: 'POST',waitMsg:'Prosesing ... ...',
						success: function(f,r,d) {
							zTHIS.toastPesan('success','Reset password Berhasil !!',2000); 
						},
						failure: function(f, o) {
							/*
							var res = Ext.decode(o.responseText).msg;
							var msgstr='';
							Object.keys(res).forEach(function(k){
								msgstr = msgstr + k + ' : ' +res[k] +'<br/>';
							});*/
							zTHIS.toastPesan('error','Reset Password Gagal !!! <br/>Username / No HP salah !!',5000);		
						}						
					});
        } else {
			zTHIS.toastPesan('error','Form tidak valid !!</h1><br/><br/> koreksi lagi isian form, kemungkinan ada yang belum diisi , <br/> atau salah pengisian  ',2000);	
        }
	},
	initViewLogin: function(e,e,o) {
        this.genCaptcha();
    },

	genCaptcha: function() {
		document.getElementById('captcha').innerHTML = "";
			var charsArray ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
			var lengthOtp = 5;
			var captcha = [];
			for (var i = 0; i < lengthOtp; i++) {
				//below code will not allow Repetition of Characters
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
	openRegisterForm: function(btn) {
		Ext.getCmp("form-register-portal-data").setHidden(false);
		Ext.getCmp("form-login-portal-data").setHidden(true);
		Ext.getCmp("form-reset-password-portal-data").setHidden(true);
	},
	openLoginForm: function(btn) {
		Ext.getCmp("form-register-portal-data").setHidden(true);
		Ext.getCmp("form-reset-password-portal-data").setHidden(true);
		Ext.getCmp("form-login-portal-data").setHidden(false);
	},
	openResetForm: function(btn) {
		Ext.getCmp("form-login-portal-data").setHidden(true);
		Ext.getCmp("form-reset-password-portal-data").setHidden(false);
		Ext.getCmp("form-register-portal-data").setHidden(true);
	},
});