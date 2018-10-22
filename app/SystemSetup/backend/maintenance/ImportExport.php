#!/www/cgi-bin/php
<?
require_once('/www/lib/globals.php');
require_once('/www/lib/template.php');
require_once('/www/lib/rms.php');
require_once('/www/lib/config.php');

error_reporting(0); //ignore all warning/error message for download.
if ($_POST) {
	if (isset($_POST["op"])) {
		$output = "";
		switch($_POST["op"]) {
			case 'import_cfg':
				if (isset($_FILES["cfg_file"]["tmp_name"]) && is_uploaded_file($_FILES['cfg_file']['tmp_name'])) {
					if ( move_uploaded_file($_FILES["cfg_file"]["tmp_name"], TMP.IMP_CONFIG_TAR_GZ) == TRUE ) {
						$ret = nas_cfg_import(TMP.IMP_CONFIG_TAR_GZ);
						if ($ret < 0)
							$output = xlt('imp_fail');
						else
							$output = xlt('imp_ok');
					}
				}
				break;
			case 'export_cfg':
				// do the export
				$fileName = nas_cfg_export();
				$completeFilePath = "/tmp/$fileName";

				if ( strncmp($_SERVER["HTTP_REFERER"], "https", 5) == 0 ) {
					header("Cache-Control: cache, must-revalidate");
					header("Pragma: public");
				} else {
					header('Pragma: no-cache');
				}
				header('Content-type: text/plain');
				header("Content-Disposition: attachment; filename=\"" . $fileName . "\"" );
				header('Content-Length: '.(string)(filesize($completeFilePath)));  //get the correct lenght of file after converted to dos format
				$fd=fopen($completeFilePath,'rb');
				if ( $fd ) {
					while(!feof($fd)) {
						$str = fgets($fd, 4096);
						print($str);
						flush();
					}
					fclose($fd);
					unlink($completeFilePath);
					exit;
				}
				break;
		}
	}
	$result_arr = array();
	$result_arr["success"]	= ($ret==0) ? true : false;
	$result_arr["msg"] = $output;
	echo json_encode($result_arr);
}

?>