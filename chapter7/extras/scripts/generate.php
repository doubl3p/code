<?php
require_once('config.php');
require_once('inc/tartan.inc');

/**
 * Einige erforderliche Formularelemente ($_POST) prüfen.
 * Wenn alle gesetzt und OK sind, TRUE liefern.
 *
 * @return Boolean
 */
function tartan_form_ready() {
  if (   is_array($_POST)
      && sizeof($_POST)
      && array_key_exists('colors', $_POST)
      && is_array($_POST['colors'])
      && array_key_exists('name', $_POST)) {
    return TRUE;
  }
  return FALSE;
}

/**
 * Auf Basis der Formularwerte ein LyzaTartan-Objekt erstellen und füllen.
 *
 * @return LyzaTartan
 */
function populate_tartan() {
  $sett = array();
  for($i=0; $i < sizeof($_POST['colors']); $i++) {
    // Übermittelte leere Werte prüfen
    if ($_POST['colors'][$i] && $_POST['sizes'][$i]) {
      $sett[] = array('color' => $_POST['colors'][$i],
                      'count' => $_POST['sizes'][$i]);
    }
  }
  $name = stripslashes($_POST['name']);
  // Ein neues LyzaTartan-Objekt aus den Formularwerten aufbauen.
  $tartan = new LyzaTartan($name);
  $tartan->setSett($sett);
  if (isset($_POST['tartan_info'])) {
    $tartan->setDescription(strip_tags(stripslashes($_POST['tartan_info'])));
  }
  return $tartan;
}

/**
 * Dateisystemelemente für diesen Tartan erstellen:
 * Das Bild, die HTML-Datei, die XML-Datendatei.
 *
 * @param LyzaTartan $tartan    ein gefülltes LyzaTartan-Objekt
 */
function generate_tartan($tartan) {
  $xml = $tartan->writeXML();
  $tartan->setTargetWidth(200);
  $tartan->writeImage();
  $tartan->writeHTML();
}

if (tartan_form_ready()) {
  $tartan = populate_tartan();
  generate_tartan($tartan);
  if (array_key_exists('HTTP_X_REQUESTED_WITH', $_SERVER) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
    // jQuery Mobile sendet diesen HTTP-Header, wenn Ressourcen über XHR (AJAX) angefordert werden
    echo $tartan->getPublicPath();
  } else {
    // Für Browser, die JS/XHR nicht unterstützen
    // Ein vollständiger Redirect an die neu erstellte Tartan-HTML-Datei
    header('Location:' . $tartan->getPublicPath());
    exit();
  }
}