#!/www/cgi-bin/php
<?
header('Content-Type: application/json; charset=utf-8');
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');

require_once('/www/api_v2/system/maintenance/system.php');

function POST_METHOD()
{
	$output = "";
	$reset_option = (isset($_POST["op"]))? $_POST["op"]: "reboot";
	$ret = reset_to_default($reset_option, $output);

	$result_arr            = array();
	$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
	$result_arr["msg"]     = $output;
	echo json_encode($result_arr);
}

function GET_METHOD()
{
	switch ($_GET["op"]) {
	default:
		echo json_encode(array("success" => TRUE, "data" => array()), JSON_NUMERIC_CHECK);
		break;
	}
}

if (isset($_SERVER['REQUEST_METHOD']) == FALSE) {
	exit;
}

switch ($_SERVER['REQUEST_METHOD']) {
	case 'POST':
		POST_METHOD();
		break;

	case 'GET':
		GET_METHOD();
		break;

	default:
		break;
}
?>