let _token = false;
function getToken() {
  _token = false;
  for (var i in localStorage) {
    if (
      i.indexOf("auth") != -1 ||
      i == "sipd-konfigurasi" ||
      i == "sipd-konfigurasi-unit-set"
    ) {
      var item = localStorage.getItem(i);
      if (!_token) {
        _token = {};
      }
      item = JSON.parse(item);
      for (var i in item) {
        _token[i] = item[i];
      }
    }
  }
  console.log("_token", _token);
}
function en(data) {
  return btoa(btoa(data));
}

function makeid(z) {
  let P = "";
  const N = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    G = N.length;
  let O = 0;
  for (; O < z; ) ((P += N.charAt(Math.floor(Math.random() * G))), (O += 1));
  return P;
}

function makeNUMBER(z) {
  return Math.floor(Math.random() * z);
}

function x_api_key2() {
  var time = new Date();
  time = Math.ceil((time.getTime() + 5000000) / 1000);
  // time = Math.ceil(time.getTime()/1000);

  var key = {
    sidx: en(_token.user_id),
    sidl: en(_token.level_id),
    sidd: en(_token.daerah_id),
    idd: en(_token.daerah_id),
  };
  var key_1 =
    CryptoJS.SHA1(
      CryptoJS.MD5(window.navigator.userAgent).toString(),
    ).toString() + CryptoJS.MD5("kdx" + _token.daerah_id).toString();
  var key_2 = CryptoJS.SHA1(
    "T#2Kc&us" + CryptoJS.MD5("mDx" + _token.daerah_id).toString(),
  ).toString();
  var apiKey = {
    token: makeid(15),
    id_daerah: _token.daerah_id,
    tahun: _token.tahun,
    id_app: makeNUMBER(1e5),
    is_app: 1,
    secret_key: en(JSON.stringify(key)),
    security_key:
      _token.daerah_id +
      "|" +
      _token.tahun +
      "|" +
      btoa(time) +
      "|" +
      makeid(10) +
      "|" +
      makeNUMBER(1e5),
    token_key_1: key_1,
    token_key_2: key_2,
  };
  var ret = en(JSON.stringify(apiKey));

  return ret;
}

function getAjax(url, formData) {
  getToken();
  const xhr = new XMLHttpRequest();

  //xhr.open('POST', 'https://sipd-ri.kemendagri.go.id/api/renja/sub_bl/list_skpd', true);
  xhr.open("POST", url, true);
  xhr.responseType = "json";
  xhr.setRequestHeader("X-API-KEY", x_api_key2());
  xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Handle the server response
      console.log(xhr.responseText);
    }
  };
  xhr.send(formData);
  return JSON.stringify(xhr.responseJSON);
}

getToken();

const xHeader = { "X-API-KEY": x_api_key2(), "X-ACCESS-TOKEN": _token.token };

function validasi_hibah(xtahun, xidusulan, xHeader) {
  return xHeader;
}
