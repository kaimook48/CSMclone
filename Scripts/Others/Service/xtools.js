const axioscustom = axios.create();
axioscustom.defaults.baseURL = window.baseURL;
axioscustom.defaults.headers.post['X-Post-Back-Token'] = $('base').first().attr('postback') || '';
//axioscustom.defaults.headers.common['X-Mango-Auth'] = localStorage.getItem('mango_auth') || '';

const axioscustom2 = axios.create();
axioscustom2.defaults.headers.common['X-Mango-Auth'] = localStorage.getItem('mango_auth') || '';
axioscustom2.defaults.baseURL = window.dataServer;

const axioscustom3 = axios.create();
axioscustom3.defaults.headers.common['X-Customer-Auth'] = localStorage.getItem('customer_auth') || '';
axioscustom3.defaults.baseURL = window.dataServer;

const $queryString = (a => {
  if (a == '') return {};
  let b = {};
  for (let i = 0; i < a.length; ++i) {
    let p = a[i].split('=', 2);
    b[p[0]] = (p.length == 1) ? '' : decodeURIComponent(p[1].replace(/\+/g, ' '));
  }
  return b;
})(window.location.search.substr(1).split('&'));
const $_cookies = {
  set: function (cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  get: function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}
const $xtools = {
  isEmpty: function (x) {
    return x === undefined || x === null || x === '';
  },
  int(x) {
    return isNaN(parseInt(x)) ? 0 : parseInt(x);
  },
  dec(x, n) {
    if (isNaN(parseFloat(x))) return 0;
    n = isNaN(parseInt(n)) ? 6 : parseInt(n);
    let dc = new Decimal(x).toDP(n).toNumber();
    return dc;
  },
  async getLocal(url) {
    let error = null;
    let resp = await axioscustom.get(url);
    //console.log(resp)
    return resp.data;
  },
  async postLocalJson(url, data) {
    let error = null;
    let resp = null;
    resp = await axioscustom.post(url, data);
    //console.log(resp)
    return resp.data;
  },
  async postLocalForm(url, formdata) {
    let error = null;
    let resp = null;
    resp = await axioscustom.post(url, formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
    //console.log(resp)
    return resp.data;
  },
  async getServer(url) {
    let error = null;
    let resp = await axioscustom2.get(url);
    //console.log(resp)
    return resp.data;
  },
  async getCustomerServer(url) {
    let error = null;
    let resp = await axioscustom3.get(url);
    //console.log(resp)
    return resp.data;
  },
  async postServerJson(url, data) {
    let error = null;
    let resp = null;
    resp = await axioscustom2.post(url, data);
    //console.log(resp)
    return resp.data;
  },
  async postCustomerJson(url, data) {
    let error = null;
    let resp = null;
    resp = await axioscustom3.post(url, data);
    //console.log(resp)
    return resp.data;
  },
  async postServerForm(url, formdata) {
    let error = null;
    let resp = null;
    resp = await axioscustom2.post(url, formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
    //console.log(resp)
    return resp.data;
  },
  async postCustomerForm(url, formdata) {
    let error = null;
    let resp = null;
    resp = await axioscustom3.post(url, formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
    //console.log(resp)
    return resp.data;
  },
  isSeleted(data, index) {
    let c = Object.assign([], data);
    let idx = 0;
    $linq(c).foreach(x => {
      x.checked = index === idx;
      idx++;
    });
  },
  showResult(d, success_text, minimize) {
    if (d.success) {
      if (!$xtools.isEmpty(success_text)) {
        if (minimize) {
          $notify.success(success_text);
        }
        else {
          $alert('', success_text, 'success');
        }
      }
    } else {
      throw d.error;
    }
  },
  showError(err, ui) {
    let msg = err.toString();
    if ($xt.strStartWith(msg, '[ui_code]')) {
      msg = ui[msg.split(':')[1]] || msg;
    }

    $alert('', msg, 'danger');
  },
  strStartWith(str, strCompare) {
    str = str || '';
    str = str.toLowerCase();

    strCompare = strCompare || '';
    strCompare = strCompare.toLowerCase();

    return str.indexOf(strCompare) === 0;
  },
  strContains(str, strCompare) {
    str = str || '';
    str = str.toLowerCase();

    strCompare = strCompare || '';
    strCompare = strCompare.toLowerCase();

    return str.indexOf(strCompare) > -1;
  },
  checkEmpty(obj, props) {
    return $linq(props).any(x => $xtools.isEmpty(obj[x]));
  },
  formatNumber(x, n) {
    try {
      if ($xtools.isEmpty(x) || isNaN(parseFloat(x) || new Decimal(x).isNaN())) { return ''; }
      n = $xtools.isEmpty(n) || isNaN(parseInt(n)) ? 0 : parseInt(n);
      let nString = new Decimal(x).toDP(n).toString();
      let sp = nString.split('.');
      let fm = parseInt(sp[0]).toLocaleString('en-US');
      if (sp.length > 1) {
        fm = fm + '.' + sp[1].toString();
      }

      return fm
    } catch (err) {
      return ''
    }
  },
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  formatDate(d, f) {
    if ($xt.isEmpty(d) || !moment(d).isValid()) { return ''; }
    f = $xt.isEmpty(f) ? 'DD/MM/YYYY' : f;
    return moment(d).format(f);
  },
  queryString: $queryString,
  cookie: $_cookies
};

const $xt = $xtools;
