(function() {
  var imageCaptureSupported = false; // Unterstützt der Browser mediaCapture?
  $(document).bind("mobileinit", function() {
    // Seitenübergängeg aus Leistungsgründen abschalten
    $.extend($.mobile, { defaultPageTransition: 'none' });
    // Den Headern eingebetteter Listen einen Zurück-Button hinzufügen
    $.mobile.page.prototype.options.addBackBtn = true;
    $.mobile.page.prototype.options.backBtnText = 'Zurück';
  });

  var initPhoneGap = function() {
    if (!navigator.device || !navigator.device.capture) { return; }
    imageCaptureSupported = true;
    // Auf Android mit einer CSS-Klasse den Zurück-Button verbergen
    if (device.platform && device.platform == 'Android') {
      $('body').addClass('android'); // Verbirgt den Zurück-Button
    }
  };
  
  var initDevice = function() {
    // Wenn der Browser localStorage unterstützt
    if (typeof(window.localStorage) == 'object') {
      // Dem "Gefunden!"-Button einen Click-Handler hinzufügen
      $('.foundTartan').click(tartanFound);
      refreshTartans();
      addResetButton();
    }
    // Darauf warten, dass phonegap bereit ist (wird nur bei nativen Versionen ausgelöst)
    document.addEventListener('deviceready', initPhoneGap, false);
  };
  $(document).ready(initDevice);

  // Schnittstelle aktualisieren, um den aktuellen Stand der gefundenen Tartans 
  // wiederzugeben. Nutzt localStorage
  var refreshTartans = function() {
    // Tartan-Anzeige aktualisieren; alle eingebetteten Listen auf Änderungen prüfen
    $('ul.details').each(function() {
      var myID         = $(this).attr('id');
      var tartanKey    = 'found-' + myID;
      // Wurde dieser Tartan gefunden?                                       
      var foundValue   = localStorage.getItem(tartanKey);
      var isFound      = Boolean (foundValue);
      // Einige Klassen setzen, um den Gefunden-Status anzuzeigen
      $('#vendor-'+ myID).toggleClass('found', isFound);
      $('[data-url*="'+ myID +'"]').toggleClass('found', isFound);
      $('#'+tartanKey).closest('li').toggle(!isFound);
      // Wenn es für diesen Tartan in Local-Storage einen Wert gibt, der nicht
      // 'true' ist, ist es wahrscheinlich ein Pfad zu einem Foto!
      var hasPhoto     = (isFound && foundValue != 'true') || false;
      if (hasPhoto) {
        // Das Foto auf der richtigen Unterlisten-Seite anzeigen
        if (!$(this).find('.tartanImage').length) {
          var $tartanHolder = $('<p></p>').append($('<img>').attr({
            'src'     : foundValue,
            'class'   : 'tartanImage'
          })); 
          $(this).append('<li data-role="list-divider">Mein Bild des Tartans!</li>');
          $('<li></li>').append($tartanHolder).appendTo($(this));
        }
      }
    });
    // Die aktualisierten List-Views anzeigen.
    $('ul').each(function() {
      if ($(this).data('listview')) { $(this).listview('refresh'); }
    });
  };
  
  // Click-Handler für den "Gefunden!"-Button
  var tartanFound = function(event) {
    var tartanKey = $(event.currentTarget).attr('id');
    if(imageCaptureSupported) {
      // In unterstützenden Browsern (Scherz) oder nativen PhoneGap-
      // Apps ein Foto aufnehmen
      navigator.device.capture.captureImage(function(mediaFiles) {
        localStorage.setItem(tartanKey, mediaFiles[0].fullPath);
        refreshTartans();
      }, captureError, {limit:1});
    }
    else { // Andernfalls Local-Storage einen Eintrag hinzufügen
      localStorage.setItem(tartanKey, 'true');
      refreshTartans(); 
    }
  };
  // Fehler-Callback für captureImage
  var captureError = function(error) { console.log(error);  }

  // Ein Zurücksetzen-Button, über den Benutzer die Jagd neu beginnen kann!
  var addResetButton = function() {
    var $resetButton = $('<a></a>').attr('data-role','button').html('Neu anfangen!');
    $resetButton.click(function() {
      localStorage.clear();
      refreshTartans();
    });
    $resetButton.appendTo($('#booths'));
  };
})();