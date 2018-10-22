#!/www/cgi-bin/php
<?
require_once('/www/lib/system_lib.php');

header('Content-Type: application/json; charset=utf-8');

if ( isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST') ) {
	$output = xlt('info_change_ng');
	$ret = false;
	if (isset($_REQUEST["op"])) {
		switch($_REQUEST["op"]) {
			case "set_mode":
				$mode = (isset($_REQUEST['mode']))? $_REQUEST['mode'] : APPMODE_GENERIC;
				set_appmode($mode);
				$output = xlt('info_change_ok');
				$ret = true;
				break;
		}
	}
	$result_arr = array();
	$result_arr["success"] = $ret;
	$result_arr["msg"] = $output;
	echo json_encode($result_arr);
} else {
	$mode = (get_appmode() != "") ? get_appmode() : APPMODE_GENERIC;
	$modearr["mode"] = $mode;
	echo json_encode(array("success" => true, "data" => $modearr), JSON_NUMERIC_CHECK);
}

header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" ); 
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');
?>
