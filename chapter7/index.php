<!DOCTYPE html> 
<html> 
	<head> 
	<meta charset="UTF-8" />
	<title>Der Tartanator</title> 

	<meta name="viewport" content="width=device-width, initial-scale=1"> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0rc1/jquery.mobile-1.0rc1.min.css" />
  <script src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
  <script type="text/javascript">
    // mobileinit muss gebunden werden, bevor die jQ Mobile-Bibliothek geladen wird
    $(document).bind('mobileinit',function(){
      $.mobile.selectmenu.prototype.options.nativeMenu = false;
    });
  </script>
  <script src="http://code.jquery.com/mobile/1.0rc1/jquery.mobile-1.0rc1.min.js"></script>
  <link rel="stylesheet" href="css/styles.css" />
</head> 
<body> 

<div data-role="page">
<div data-role="header" data-position="fixed">
  <h1>Der Tartanator</h1>
</div><!-- /header -->
<div data-role="header" data-theme="b" class="forrit">Bring forrit the tartan!</div>
<div data-role="content">	
   
<p>Der Tartanator ist eine gemeinschaftliche Einrichtung von Organisationen, Unternehmen und Einzelpersonen, deren Ziel die weltumspannende Pflege des schottischen Erbes und die Verbreitung der Kultur des schottischen <strong>Tartans</strong> ist.</p>
</div><!-- /Inhalt -->
<div data-role="footer" data-position="fixed">
  <div data-role="navbar">
    <ul>
    <li><a href="index.php" data-icon="info" class="ui-btn-active">Über uns</a></li>
    <li><a href="findevent.php" data-icon="star">Events</a></li>
    <li><a href="tartans.php" data-icon="grid">Tartans</a></li>
    </ul>
  </div><!-- /navbar -->
</div><!-- /Footer -->
</div><!--/Seite-->

</body>
</html>