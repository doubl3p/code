(function() {
  var imageCaptureSupported = false; // Browser unterstützt mediaCaptuer?
  $(document).bind("mobileinit", function() {
    // Seitenübergänge zur Leistungsverbesserung abschalten
    $.extend($.mobile, { defaultPageTransition: 'none' });
    // Den Headern der eingebetteten Unterlisten einen Zurück-Button hinzufügen
    $.mobile.page.prototype.options.addBackBtn = true;
    $.mobile.page.prototype.options.backBtnText = 'Zurück';
  });

  var initPhoneGap = function() {
    if (!navigator.device || !navigator.device.capture) { return; }
    imageCaptureSupported = true;
    // Auf einer nativen Android-Plattform den Button über CSS verbergen
    if (device.platform && device.platform == 'Android') {
      $('body').addClass('android'); // Das verbirgt den Zurück-Button
    }
  };
  
  var initDevice = function() {
    // Wenn der Browser localStorage unterstützt
    if (typeof(window.localStorage) == 'object') {
      // Dem Gefunden-Butten einen Click-Handler hinzufügen
      $('.foundTartan').click(tartanFound);
      refreshTartans();
      addResetButton();
    }
    // Überwachen, ob Phonegap bereit ist (wird nur bei nativen Versionen ausgelöst)
    document.addEventListener('deviceready', initPhoneGap, false);
  };
  $(document).ready(initDevice);

  // Die Schnittstelle aktualisieren, um den aktuellen Status von tartans-found anzuzeigen
  // Nutzt localStorage
  var refreshTartans = function() {
    // Tartan-Anzeige auffrischen; eingebettete Listen auf Änderungen prüfen
    $('ul.details').each(function() {
      var myID         = $(this).attr('id');
      var tartanKey    = 'found-' + myID;
      // Wurde dieser Tartan bereits gefunden?
      var foundValue   = localStorage.getItem(tartanKey);
      var isFound      = Boolean (foundValue);
      // Einige Klassen setzen, die anzeigen, dass ein Tartan gefunden wurde
      $('#vendor-'+ myID).toggleClass('found', isFound);
      $('[data-url*="'+ myID +'"]').toggleClass('found', isFound);
      $('#'+tartanKey).closest('li').toggle(!isFound);
      // Gibt es für diesen Tartan einen Wert in LocalStorage, der nicht 
      // 'true' ist, ist das wahrscheinlich der Pfad zu einem Foto!
      var hasPhoto     = (isFound && foundValue != 'true') || false;
      if (hasPhoto) {
        // Dieses Foto auf der entsprechenden Unterlisten-»Seite« anzeigen
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
    // Die aktualisierten List-Views auffrischen 
    $('ul').each(function() {
      if ($(this).data('listview')) { $(this).listview('refresh'); }
    });
  };
  
  // Click-Handler für den "Gefunden!"-Button
  var tartanFound = function(event) {
    var tartanKey = $(event.currentTarget).attr('id');
    if(imageCaptureSupported) {
      // In unterstützenden Browsern (klar doch) oder nativen PhoneGap-App
      // ein Foto machen lassen
      navigator.device.capture.captureImage(function(mediaFiles) {
        localStorage.setItem(tartanKey, mediaFiles[0].fullPath);
        refreshTartans();
      }, captureError, {limit:1});
    }
    else { // Andernfalls LocalStorage einen Eintrag hinzufügen
      localStorage.setItem(tartanKey, 'true');
      refreshTartans(); 
    }
  };
  // Fehler-Callback für captureImage
  var captureError = function(error) { console.log(error);  }

  // Ein Zurücksetzen-Button, damit der Benutzer die Jagd von vorne beginnen kann!
  var addResetButton = function() {
    var $resetButton = $('<a></a>').attr('data-role','button').html('Neu anfangen!');
    $resetButton.click(function() {
      localStorage.clear();
      refreshTartans();
    });
    $resetButton.appendTo($('#booths'));
  };
})();