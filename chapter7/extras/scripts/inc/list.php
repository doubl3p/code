<?php
/*
 * <li>-Elemente für die Tartans auf Basis der HTML-Dateien
 * im Verzeichnis mit dem Tartan-HTML dynamisch erstellen.
 */
require_once(dirname(__FILE__) . '/../config.php');
require_once(dirname(__FILE__) . '/tartan.inc');

$dir        = TARTAN_HTML_DIR;
$tartans    = array();
$list_items = array();

// Das Verzeichnis mit dem Tartan-HTML durchlaufen und .html-Dateien suchen
// Das Array $tartans mit diesen Daten aufbauen
if (is_dir($dir)) {
  if ($dh = opendir($dir)) {
    while (($file = readdir($dh)) !== false) {
      if (filetype($dir . $file) === 'file' && strpos($file, '.html') !== FALSE) {
        $tartans[] = substr($file, 0, -5);
      }
    }
    closedir($dh);
  }
}
foreach ($tartans as $base) {
  $tartan                     = new LyzaTartan();
  $tartan->fromXML($base);
  $base                       = $tartan->getBaseName();
  $display_name               = ucwords($tartan->name);
  $list_items[$display_name]  = '';
  // Die HTML-Ausgabe zusammenbauen
  $tartan_image = '';
  if (file_exists(TARTAN_IMAGE_DIR . $base . '-200.png')) {
    // Das Bild-Tag erstellen, wenn es ein Bild gibt
    $tartan_image = sprintf('<img src="%simages/%s-200.png" alt="%s" />',
      PUBLIC_TARTAN_DIR,
      $base,
      $display_name);
  }
  $list_items[$display_name] .= sprintf('<li id="tartan-%s"><a href="%s%s.html">%s<h3>%s</h3></a></li>',
    $base,
    PUBLIC_TARTAN_DIR,
    $base,
    $tartan_image,
    $display_name);
  unset($tartan);
}
ksort($list_items); // Das Array mit den Tartan-HTML-<li>-Elementen über den Schlüssel (angezeigter Name) sortieren

// Den aktuellen ersten Buchstaben der aufgeführten Tartans festhalten
$current_letter = '';
foreach($list_items as $display_name => $li) {
  $first_letter = substr($display_name, 0, 1);
  if ($first_letter != $current_letter) {
    // Wenn der erste Buchstabe dieses Tartans anders lautet, als der erste
    // Buchstabe des vorangehenden, einen Listentrenner mit dem neuen 
    // Buchstaben erstellen
    printf('<li role="list-divider">%s</li>', $first_letter);
    $current_letter = $first_letter;
  }
  print $li; // Alle <li>s im Array mit den Tartans ausgeben
}
?>