(function () {
  
  var CacheManager = window.CacheManager = function (pageSelector) {
    this.page = $(pageSelector);
  };

  var proto = {};

  proto.ensureFreshContent = function (selector, updateURL) {
    if (!window.applicationCache) return;

    this.selector  = selector;
    this.updateURL = updateURL;
    
    this.addAppCacheListeners();
    
    this.page.live('pageshow', $.proxy(this.checkCache, this));
  };

  proto.addAppCacheListeners = function () {
    var appCache = window.applicationCache,
        showCached = $.proxy(this.showCached, this);
    
    // Wenn es nichts zu aktualisieren gibt, zeigen wir die gecachte Version an
    // Beachten Sie, dass einige davon ausgelöst werden könnten. In unserem Fall ist
    // es allerdings kein Problem, wenn der Handler mehrfach aufgerufen wird.
    appCache.addEventListener('cached', showCached, false);
    appCache.addEventListener('error', showCached, false);
    appCache.addEventListener('noupdate', showCached, false);
    appCache.addEventListener('obsolete', showCached, false);

    // Aber! Wenn wir eine Aktualisierung erkennen wollen, Cache auswechseln und anzeigen.
    appCache.addEventListener('updateready', $.proxy(this.updateCache, this), false);

    // Weiter im Text... 
    // Das umschifft einige Probleme mit den Listenern & jQM auf einigen Geräten.
    // Beachten Sie auch die Anmerkung in checkCache()
    appCache.__listenersAdded = true;

  };

  proto.checkCache = function () {
    var appCache = window.applicationCache;
    
    // Beachten Sie die Anmerkungen in addAppCacheListeners()
    // Bei einigen Geräten scheint das applicationCache-Objekt unter jQM überschrieben zu werden,
    // wenn neue Seiten initialisiert werden. Wir müssen die Event-Listener also neu initialisieren.
    // Das ist zwar nicht ideal, aber wir können auf dem applicationCache-Objekt selbst prüfen.
    if (!appCache.__listenersAdded) this.addAppCacheListeners();

    try {
      if (appCache.status != appCache.UNCACHED) {
        // Den Inhalt verbergen, bis wir wissen, dass es der neueste ist
        $.mobile.showPageLoadingMsg();
        $(this.selector).hide();
        appCache.update();
      }
    } catch (e) {
      // Bei einem Fehlschlag einfach die gecachten Daten anzeigen.
      this.showCached();
    }
  };

  proto.showCached = function (evt) {
    $(this.selector).show();
    $.mobile.hidePageLoadingMsg();
  };

  proto.updateCache = function (evt) {
    var self = this;

    // Ein AJAX-Request mit dem die aktualisierten dynamischen Daten abgerufen werden
    $.get(self.updateURL, function(data) {
      $(self.selector).html(data).show();
      $.mobile.hidePageLoadingMsg();    
      $(self.selector).listview().listview('refresh');
    });

    try {
      window.applicationCache.swapCache();
    } catch (e) {}

  };

  CacheManager.prototype = proto;

}());
