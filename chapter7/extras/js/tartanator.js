(function () {
  var $page, $colorList, $submitFormBtn, $sizeInputUI, $colorInputUI, $nameInput, $sizeSlider;

  $page = $('[data-role="page"]');

  // Ausgelöst, nachdem die Seite im DOM erstellt wurde (über Ajax oder normal), 
  // aber bevor alle Widgets eine Gelegenheit hatten, das enthaltene Markup zu verbessern. 
  // - Wir zeigen nur einen Satz von Eingabeelementen an und ermöglichen mehrere Eingaben
  //   mir dem "Farbe hinzufügen"-Button
  $page.live('pagecreate', function () {
    $.ajaxSettings.traditional = true;
    $('.colorset:not(:first)').remove();
    buildAddButton();
  });

  // Ausgelöst, nachdem die jQuery Mobile DOM-Elemente initialisiert wurden
  $page.live('pageinit', init);

  function init () {
    $colorList     = $('#colorlist');
    $submitFormBtn = $('#buildtartan').parents('.ui-btn');
    $sizeInputUI   = $('.size-input');
    $sizeSlider    = $sizeInputUI.find('input');
    $colorInputUI  = $('.color-input');
    $nameInput     = $('#tartan_name');

    $submitFormBtn.add('.color-input label').hide();
    $('#color-0 option').each(styleColorListItem);
    setColorSelectStyle();

    $colorList.click(onColorListChange);
    $sizeSlider.change(onStitchSizeChange);
    $colorInputUI.change(onColorSelectChange);
  }

  // Den Formular-Handler nur einmal ergänzen: Wenn das DOM bereit ist.
  $(function () {
    $('#tartanator_form').submit(onFormSubmit);
  });

  // Jeder Zeile im angepassten jQO-Select-Menü einen Farbhinweis hinzufügen
  function styleColorListItem (index, value) {
    var hex    = $(this).val();
    if (hex) {
      $('#color-0-menu li a').eq(index).css('borderLeft', '25px solid ' + hex);
    }
  }

  // Den Farbe hinzufügen-Button erstellen und dem DOM hinzufügen
  // Das ist der Button, der der "Liste" die Farbe/Größe-Kombinationen
  // für die Elemente des Tartan-Muster hinzufügt
  function buildAddButton() {
    if ($('#add-color-container').length) { return true; }
    var li = $('<li></li>').attr({
      'data-role' : 'fieldcontain',
      'id'        : 'add-color-container'
    });
    var button = $('<input type="button">').attr({
      'name'      : 'addcolor',
      'data-role' : 'button',
      'value'     : 'Diese Farbe hinzufügen',
      'data-icon' : 'plus'
    });
    button.click(onAddColor);
    $('#tartanator_form_list').append(li.append(button));
  }

  // Wenn der Benutzer auf den "Farbe hinzufügen"-Button klickt
  function onAddColor (evt) {
    var form   = $(this).closest('form'),
        select = form.find('select'),
        name   = select.find(':selected').text(),
        hex    = select.val(),
        size   = form.find('.size-input input').val();
    if (hex && size) { // Alles in Ordnung
      addColor(name, size, hex);
      onColorListChange();
    } else {
     $.mobile.changePage( "dialogs/size-color-required.html", {
       transition: "pop",
       reverse: false,
       role: 'dialog'
      });	
    }
    return false;
  }

  // Die Farbe hinzufügen: Das DOM mit der neuen Farbe aktualisieren
  // Verborgene Felder erstellen und einfügen, die die Werte für das Formular enthalten
  function addColor (colorName, colorSize, colorValue) {
    var colorItem = [
      '<li data-role="button" data-icon="delete" style="background:', colorValue,
      '; color:', (isDarkColor(colorValue) ? '#fff' : '#000'),
      '">', colorName, ' (', colorSize + ')',
      '<input type="hidden" name="colors[]" value="', colorValue, '">',
      '<input type="hidden" name="sizes[]" value="', colorSize, '">',
      '<a data-role="button"></a>',
      '</li>'].join('');
    $colorList.append(colorItem);
    $colorInputUI.find('select').val('').selectmenu('refresh');
    $sizeInputUI.find('input').slider('refresh');
    onColorListChange();
  }

  // Aufgerufen, wenn sich die Liste der hinzugefügten Farbe/Größe-Kombinationen ändert,
  // d.h., wenn eine neue eingefügt oder eine vorhandene gelöscht wird
  function onColorListChange (deleteClickEvent) {
    var $li;
    if (deleteClickEvent) $li = $(deleteClickEvent.target).closest('li').remove();
    $submitFormBtn[$colorList.find('li').length ? 'show' : 'hide']();
    $colorList.listview('refresh'); 
    setColorSelectStyle();
  }
  
  // Der Benutzer hat den Wert der Stichanzahl geändert; nur gerade Werte gestatten
  function onStitchSizeChange(changeEvent) {
    var current_val = parseInt($sizeSlider.val(), 10);
    if (current_val % 2 == 1) {
      $sizeSlider.val(current_val + 1);
    }
  }

  // Das Formular absenden
  function onFormSubmit () {
    var url, $form;
    if (!$nameInput.val() || !$colorList.find('li').length) {
     $.mobile.changePage( "dialogs/tartan-data-required.html", {
       transition: "pop",
       reverse: false,
       role: 'dialog'
      });	
      return false;
    }
    
    // jQMs automatische Ajax-Navigation verarbeitet Umleitungen nicht gut.
    // Mit unserer eigenen Formularübersendung überschreiben
    // Bei Ajax-Requests antwortet der Server mit der URL des erstellten Tartans
    $form = $(this);
    $.post($form.attr('action'), $form.serialize(),  function (url) {
      $.mobile.changePage(url);
    });

    return false;
  }
  
  // Wenn eine Farbe in der Auswahlliste ausgewählt wird
  function onColorSelectChange() {
    setColorSelectStyle();
  }

  // Setzt die Hintergrundfarbe des Auswahl-Widgets auf den gewählten Farbewert
  function setColorSelectStyle() {
    var backgroundHex = $colorInputUI.find('select').val();
    $colorInputUI.find('.ui-btn').css({
      'background': backgroundHex || '',
      'color'     : isDarkColor(backgroundHex) ? '#fff' : '#000'
    });
  }

  // Auf Basis eines Hex-Wertes (ein String) grob berechnen, ob schwarz oder
  // weiß als Kontrastfarbe verwendet werden soll
  function isDarkColor (hex) {
    var sum;
    if (!hex) return false;
    hex = (hex + '').match(/[^#]+/)[0];
    if (hex.length == 3) hex += hex;
    sum = parseInt(hex.substr(0,2), 16) + parseInt(hex.substr(2,2), 16) + parseInt(hex.substr(4,2), 16);
    return (sum / 3) < 128;
  }

}());