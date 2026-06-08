<!DOCTYPE HTML>
<html manifest="">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">

    <title>Admin</title>

    <!-- The line below must be kept intact for Sencha Cmd to build your application -->
    
    <script type="text/javascript">
      const BASE_URL = "",
        REMOTE_URL = "https://e-laba.tegalkota.go.id/simlaba2023/",
        REPORT_URL = "reportpreview.php",
        REPORT_URL2 = "https://e-laba.tegalkota.go.id/sakip/";
      let vUSER_INFO = JSON.parse(
        '{"username":"adminlaba","e_mail":"adminlaba@gmail.com","id":458,"role_id":27,"display_name":"Administrator Simlaba","id_instansi":0,"id_opd":1110,"kd_urusan":1,"kd_bidang":1,"kd_sub":1,"kd_unit":0,"nm_sub_unit":0,"nm_singkat":0,"nm_unit":0,"id_unit":0,"id_sub":0,"app_id":"5","role":"Admin","app_name":"laba","s_uuid":"b69dffea.2e5f.11eb.83c2.c72e28a80a6c","tahun":"2022","role_id_app":"2"}'
      );
      const BWSRwidth =
        window.innerWidth > 0 ? window.innerWidth : screen.width;
      const BWSRheight =
        window.innerHeight > 0 ? window.innerHeight : screen.height;
      const HeaderHeight = 180;
      const PanelCompHeight = BWSRheight - HeaderHeight;
      const csrf_value = "pSaYbpqjE36nNyFGl";
      let app_token = "b69dffea.2e5f.11eb.83c2.c72e28a80a6c";
      let vTAHUN = vUSER_INFO.tahun;
      let vUSER_OPD = vUSER_INFO.display_name,
        appVersion = "1.0",
        dateNow = "Selasa, 24 November 2021",
        ROLE_ID_APP = 2;
      let isAdmin = true;
      if (ROLE_ID_APP > 5) {
        isAdmin = false;
      }
      let isUser = !isAdmin,
        vKD_PERUBAHAN = 1,
        mkd_arsip = 1;
      const vTAHAP = 1;
      const logout_url = "";
      const profile_url = "";
      let vNAMA_OPD = "Badan XXXXX Tegal";
      let vNAMA_PENGGUNA = "Administrator";
      let vDASHBOARD_INFO = JSON.parse(
        '{"kotak1":185,"kotak2":185,"kotak3":2098,"kotak4":"804 M"}'
      );
      var userman_url = "";
    </script>

    <script id="microloader" data-app="0d3cea28-7502-430a-b593-bf6d3dc3cdd3" type="text/javascript" src="bootstrap.js"></script>
    <style>
        
      </style>
</head>
<body class="launching">
    <div class="container">
      <div id="loading-screen">
        <div class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </body>
</html>
