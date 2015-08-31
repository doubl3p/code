<?php

/**
 * Entspricht der Wert, den dieses Gerät für die Fähigkeit $capability liefert $value?
 * Zum Vergleich den angegebenen Operator $comparison oder standardmäßig '===' nutzen,
 * um den Wert des aktuellen Geräts mit dem zu prüfenden $value zu vergleichen.
 *
 * @param string $capability        Name der zu prüfenden Fähigkeit
 * @param string $comparison        Vergleichtsoperator
 * @param string $value             Der Wert, mit dem wir vergleichen wollen
 */
function device_match($capability, $comparison, $value) {
  global $device;
  if (!$device) {
    return FALSE;
  }
  $device_value = $device->getCapability($capability);
  switch ($comparison) {
    case '==':
    case '===':
      return ($device_value === $value);
    case '!=':
    case '!==':
      return ($device_value !== $value);
    case '>=':
      return ($device_value >= $value);
    case '<=':
      return ($device_value <= $value);
    case '>':
      return ($device_value > $value);
    case '<':
      return ($device_value < $value);
    case 'LIKE':
      return (strpos($device_value, $value) !== FALSE);
    case 'NOT LIKE':
      return (strpos($device_value, $value) === FALSE);
    default:
      return FALSE;
  }
}

$device_class = NULL;