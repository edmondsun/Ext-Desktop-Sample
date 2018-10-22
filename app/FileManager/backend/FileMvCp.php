#!/www/cgi-bin/php
<?php
require_once '/www/api_v2/file_manager/file_mvcp.php';

header('Content-Type: application/json; charset=utf-8');
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);

// HTTP/1.0
header('Pragma: no-cache');
/* For debugging */
if (isset($_SERVER['GET_STR'])) {
	parse_str($_SERVER['GET_STR'], $_GET);
}

if (isset($_SERVER['POST_STR'])) {
	parse_str($_SERVER['POST_STR'], $_POST);
}

function POST_METHOD() {
	$result_arr = array();
	$ret = 0;
	$output = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
		case 'move_dir_file':
			$sourceName = json_decode($_POST["sourceName"], TRUE);
			$destPath = isset($_POST["destPath"]) ? $_POST["destPath"] : "";
			$sourcePath = isset($_POST["sourcePath"]) ? $_POST["sourcePath"] : "";
			$overwrite = 1;
			$action = new coreutil("mv", "mv_status", $sourcePath, $sourceName, $destPath, $overwrite);
			$ret = $action->run_action($output);
			break;
		case 'copy_dir_file':
			$sourceName = json_decode($_POST["sourceName"], TRUE);
			$destPath = isset($_POST["destPath"]) ? $_POST["destPath"] : "";
			$sourcePath = isset($_POST["sourcePath"]) ? $_POST["sourcePath"] : "";
			$overwrite = 1;
			$action = new coreutil("cp", "cp_status", $sourcePath, $sourceName, $destPath, $overwrite);
			$action->run_action();
			$ret = $action->run_action($output);
			break;
		default:
			$ret = -1;
			$output = xlt('invalid_value');
			break;
		}
	} else {
		$ret = -1;
		$output = xlt('invalid_value');
	}

	$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
	$result_arr["msg"] = $output;
	echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

function GET_METHOD() {
	$result_arr = array();
	$file_arr = array();
	$ret = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
		default:
			break;
		}
	} else {
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