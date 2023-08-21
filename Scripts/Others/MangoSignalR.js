let signalR = (clientMethods, start) => {
  clientMethods = clientMethods || {};
  let defaultClientMethods = {
    displayMsg: function (msg) {
      console.log(msg);
    },
    welcomeMessage: function (text) {
      console.log(text);
    },
    logout: function () {
      window.location = window.baseUrl //+ 'Api/public/Logout?all=false';
    },
    displaySessionOn: function (sessionsOn, sessionsMax) {
      //vuec.$set(vuec.userOnline, 'current', sessionsOn || 0)
      //vuec.$set(vuec.userOnline, 'max', sessionsMax || 0)
    }
  };

  $linq(Object.keys(clientMethods)).foreach(x => {
    defaultClientMethods[x] = clientMethods[x];
  });
  let hubProxy = SJ.iwc.SignalR;

  let reHub = hubProxy.getHubProxy('socketHub', {
    client: defaultClientMethods
  });
  let signalrObj = {
    check_session_loop: null,
    check_state_loop: null,
    start: function (fn) {
      hubProxy.start().done(function () {
        console.log('started');
        if (fn) {
          fn();
        }

        //if (start) {
        //  start();
        //}
      });
    },
    check_session: function (fn) {
      //reHub.server.userOnlineStatus($dtl.cookies.get('mg_global_auth_token2') || '', document.title, navigator.userAgent).done(function () {
      //  if (fn) {
      //    fn();
      //  }
      //});
      //console.log('session checked in ' + new Date());
    },
    check_notifi: function () {
      //reHub.server.notificationCheck();
    }
  };

  hubProxy.on('connected', function () {
    console.log('connected owned ' + hubProxy.isConnectionOwner());
    if (hubProxy.isConnectionOwner()) {
      signalrObj.check_session(function () {
        //signalrObj.check_notifi();
      });

      if (start) {
        start();
      }

    }
    if (!signalrObj.check_session_loop && hubProxy.isConnectionOwner()) {
      console.log('start sync this connection');
      signalrObj.check_session_loop = setInterval(function () { signalrObj.check_session() }, 60000);
    } else {
      if (signalrObj.check_session_loop) {
        clearInterval(signalrObj.check_session_loop);
      }
      signalrObj.check_session_loop = null;
    }


  });

  hubProxy.on('disconnected', function () {
    console.log('disconnected')
    if (signalrObj.check_session_loop) {
      clearInterval(signalrObj.check_session_loop);
      signalrObj.check_session_loop = null;
      // console.log('end sync this connection')
    }
    if (hubProxy.isConnectionOwner()) {
      if (!signalrObj.check_state_loop) {
        signalrObj.check_state_loop = setInterval(function () {
          if (hubProxy.getState() == 4) {
            console.log('try to connect again');
            signalrObj.start();
          } else {
            clearInterval(signalrObj.check_state_loop);
            signalrObj.check_state_loop = null;
            console.log('clear reconnect');
          }
        }, 30000);
      }
    } else {
      if (signalrObj.check_state_loop) {
        clearInterval(signalrObj.check_state_loop);
        signalrObj.check_state_loop = null;
        console.log('clear reconnect');
      }
    }
  });

  signalrObj.start(function () {
    if (!hubProxy.isConnectionOwner()) {
      signalrObj.check_session(function () {
        //signalrObj.check_notifi();
      });
    }
  });

  return { reHub, hubProxy };
}
