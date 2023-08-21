<%@ Page Language="C#" ResponseEncoding="UTF-8" %>

<%@ Import Namespace="System.IO" %>
<!DOCTYPE html>
<script runat="server">
  public string host;
  public string baseUrl;
  public string baseRoute;
  public string basePath;
  public string dataServer;
  public FileInfo fi;
  string appJsHash;
  string baseCompany;
  string buildVersion;
  void Page_Load(object o, EventArgs e)
  {

    host = Request.Url.Scheme + "://" + Request.Url.Authority;
    baseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/";
    basePath = Request.ApplicationPath.TrimEnd('/') + "/" + "application/";
    baseRoute = host.Remove(host.Length - 1) + basePath;
    dataServer = System.Configuration.ConfigurationManager.AppSettings["dataServer"];
    if (System.Configuration.ConfigurationManager.AppSettings["dataServerSameAsVueServer"] == "1")
    {
      dataServer = host + "/" + dataServer;
    }
    fi = new FileInfo(Server.MapPath("~/Scripts/Bundle/Application.js"));

    Response.Cache.SetExpires(DateTime.UtcNow.AddDays(-1));
    Response.Cache.SetValidUntilExpires(false);
    Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
    Response.Cache.SetCacheability(HttpCacheability.NoCache);
    Response.Cache.SetNoStore();

    appJsHash = Server.UrlEncode(fi.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss"));

    baseCompany = System.Configuration.ConfigurationManager.AppSettings["Company"] ?? "MG";

    try
    {
      buildVersion = File.ReadAllText(Server.MapPath("~/BuildVersion.txt"));
    }
    catch { }
  }
</script>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="cache-control" content="max-age=0" />
  <meta http-equiv="cache-control" content="no-cache" />
  <meta http-equiv="expires" content="-1" />
  <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
  <meta http-equiv="pragma" content="no-cache" />
  <title></title>
  <script>
    window.baseUrl = `<%=baseUrl%>`;
    window.basePath = `<%=basePath%>`;
    window.baseRoute = `<%=baseRoute%>`;
    window.dataServer = `<%=dataServer%>`;
    window.baseCompany = `<%=baseCompany%>`;
    window.signalR = {};
    window.ui = {};
    window.auth = {};
    window.menu = [];
    window.menuRight = {};
    window.viewVersion = `<%=buildVersion%>`;
  </script>

  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Google Fonts -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Font/Inter/Inter.css" />
  <link rel="stylesheet" href="<%=baseUrl%>Content/Font/Manrope/Manrope.css" />
  <link rel="stylesheet" href="<%=baseUrl%>Content/Font/Sarabun/Sarabun.css" />
  <!-- Icon Mango -->
  <link rel="icon" href="<%=baseUrl%>Content/Images/Logo/mango_icon.ico" type="image/x-icon">
  <link rel="shortcut icon" href="<%=baseUrl%>Content/Images/Logo/mango_icon.ico" type="image/x-icon">
  <!-- Bootstrap 3.3.7 -->
  <link href="<%=baseUrl%>Content/Library/bower_components/bootstrap/dist/css/bootstrap.css" rel="stylesheet" />
  <!-- Font Awesome -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Library/bower_components/font-awesome/css/font-awesome.min.css">
  <!-- Font Awesome 5.9.0 -->
  <link href="<%=baseUrl%>Content/Other/font-awesome-5.9.0/css/all.min.css" rel="stylesheet" />
  <!-- Ionicons -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Library/bower_components/Ionicons/css/ionicons.min.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Library/bower_components/select2/dist/css/select2.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Library/dist/css/AdminLTE.min.css">
  <!-- Mango Skin (Based on AdminLTE) -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Site-Skin.css" />
  <!-- Mango Style -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Site.css?version_time=<%=Server.UrlEncode(appJsHash) %>" />
  <link rel="stylesheet" href="<%=baseUrl%>Content/Helper.css?version_time=<%=Server.UrlEncode(appJsHash) %>" />
  <!-- Hover Style -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Other/hover-master/css/hover-min.css" />
  <!-- Jquery Confirm -->
  <link rel="stylesheet" href="<%=baseUrl%>Scripts/Others/JqueryConfirm/dist/jquery-confirm.min.css" />
  <!-- Notify Toastr -->
  <link rel="stylesheet" href="<%=baseUrl%>Scripts/Others/Notify/toastr.css" />
  <!-- Animate.css -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/Other/animate.css" />
  <!-- iCheck for checkboxes and radio inputs -->
  <link rel="stylesheet" href="<%=baseUrl%>Content/icheck-material.min.css" />
  <!-- Base URL -->
  <base href="<%=baseUrl %>" />
</head>

<body class="hold-transition skin-black fixed sidebar-mini sidebar-collapse">
  <div id="firstLoading">
    <div class="loading">
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
    </div>
  </div>
  <div id="app">
    <router-view></router-view>
  </div>

  <!-- jQuery 3 -->
  <script src="<%=baseUrl%>Content/Library/bower_components/jquery/dist/jquery.min.js"></script>
  <!-- jQuery UI 1.11.4 -->
  <script src="<%=baseUrl%>Content/Library/bower_components/jquery-ui/jquery-ui.min.js"></script>
  <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
  <script>$.widget.bridge('uibutton', $.ui.button);</script>
  <!-- Bootstrap 3.3.7 -->
  <script src="<%=baseUrl%>Content/Library/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <!-- Select2 -->
  <script src="<%=baseUrl%>Content/Library/bower_components/select2/dist/js/select2.full.min.js"></script>
  <!-- Slimscroll -->
  <script src="<%=baseUrl%>Content/Library/bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
  <!-- FastClick -->
  <script src="<%=baseUrl%>Content/Library/bower_components/fastclick/lib/fastclick.js"></script>
  <!-- AdminLTE App -->
  <script src="<%=baseUrl%>Content/Library/dist/js/adminlte.js"></script>
  <!-- JQuery Confirm -->
  <script src="<%=baseUrl%>Scripts/Others/JqueryConfirm/dist/jquery-confirm.min.js"></script>
  <!-- Toastr JS -->
  <script src="<%=baseUrl%>Scripts/Others/Notify/toastr.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/lodash.core.js"></script>
  <!-- Linq JS -->
  <script src="<%=baseUrl%>Scripts/Others/LinqJS/jslinq.min.js"></script>
  <!-- Date Momemt JS -->
  <script src="<%=baseUrl%>Scripts/Others/moment.min.js"></script>
  <!-- Axios -->
  <script src="<%=baseUrl%>Scripts/Others/Service/axios.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/Service/xtools.js"></script>
  <!-- Mango JS -->
  <script src="<%=baseUrl%>Scripts/Others/decimal.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/Pagination/Pagination.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/Service/alert-service.js?version_time=<%=Server.UrlEncode(appJsHash) %>"></script>
  <!-- Tiny MCE 4.7.13 JS -->
  <script src="<%=baseUrl%>Scripts/Others/tinymce_4.7.13/tinymce/js/tinymce/tinymce.min.js"></script>
  <!-- SignalR JS -->
  <script src="<%=baseUrl%>Scripts/Others/jquery.signalR-2.3.0.js"></script>
  <script src="<%=dataServer %>SignalR/Hubs"></script>

  <script>$.connection.hub.url = window.dataServer + 'signalr';</script>
  <script src="<%=baseUrl%>Scripts/Others/iwc-all.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/signalr-patch.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/iwc-signalr.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/MangoSignalR.js"></script>
  <script src="<%=baseUrl%>Scripts/Others/data-center.js"></script>

  <script>
    window.Decimal = Decimal
    window.moment = moment
    window.$linq = $linq
    window.$ = $
    window.$xt = $xt
    window.$notify = $notify
    window.queryString = $xt.queryString
    window.$msg = $msg
    window.Pagination = Pagination
    window.signalR = signalR
    window.platformCodeData = platformCodeData
    window.moduleCodeData = moduleCodeData
    window.statusCode = statusCode
    window.statusCodeData = statusCodeData
  </script>

  <!-- Application.js (Run App) -->
  <script src="<%=baseUrl%>Scripts/bundle/Application.js?version_time=<%=Server.UrlEncode(appJsHash) %>"></script>
</body>
</html>
