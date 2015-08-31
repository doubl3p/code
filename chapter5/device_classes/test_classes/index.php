<?php require_once('device.php'); ?>
<?php require_once('device_classes.php'); ?>
<!DOCTYPE html>
<html>
<head>
  <title>Geräteklassen-Tester</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
<h1>Geräteklassen-Tester</h1>
<div id="testform">
  <form method="post" action="<?php print $_SERVER['PHP_SELF']; ?>" id="useragentform">
    <p>Diesen User-Agent-String testen:</p>
    <input type="text" name="useragent" id="useragent_field" value="<?php print $user_agent; ?>" /><br />
    <input type="submit" name="submit" value="User-Agent testen" id="submit" />
  </form>
</div>

<div id="devicedata">
  <h2>Geräteklassendaten</h2>
  <p><strong>Geräte-ID</strong>: '<?php print $device->id; ?>'</p>
  <p><strong>Geräteklasse:</strong> <?php if(isset($device_class)): ?>'<?php print $device_class; ?>'<?php endif; ?></p>

</div>
</body>
</html>