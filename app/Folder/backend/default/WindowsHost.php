<?php
require_once '/www/api_v2/folder/winhost.php';
require_once '/www/api_v2/folder/folder.php';

function POST_METHOD() {

	$ret = 0;
	$output = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
		case 'add_network_host':
			$share_name = (isset($_POST['share_name'])) ? $_POST['share_name'] : NUll;
			$rpath = (isset($_POST['rpath'])) ? $_POST['rpath'] : NULL;
			$domain_arr = (isset($_POST['domain_arr'])) ? json_decode($_POST['domain_arr']) : array();
			$ret = set_network_host($share_name, $rpath, $domain_arr, $output);
			break;

		case 'remove_network_host':
			$share_name = (isset($_POST['share_name'])) ? $_POST['share_name'] : NUll;
			$rpath = (isset($_POST['rpath'])) ? $_POST['rpath'] : NULL;
			$remove_arr = (isset($_POST['remove_arr'])) ? json_decode($_POST['remove_arr']) : array();
			$ret = remove_network_host($share_name, $rpath, $remove_arr, $output);

			break;
		default:
			break;
		}
	} else {
		$ret = -1;
		$output = xlt('invalid_value');
	}

	$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
	$result_arr["msg"] = $output;
	echo json_encode($result_arr, JSON_BIGINT_AS_STRING);
}

function GET_METHOD() {
	$result_arr = array();
	$data_arr = array();
	$ret = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {

		case "get_network_host":
			// $share_name = isset($_GET['share_name'])?$_GET['share_name']:NULL;
			$share_path = isset($_GET['share_path']) ? $_GET['share_path'] : NULL;
			$data_arr = get_network_host($share_path);
			break;
		// $data_arr = get_network_host($share_name);

		case "get_list_folder":
			$abs_path = isset($_GET['abs_path']) ? $_GET['abs_path'] : '';
			$service_type = isset($_GET['service_type']) ? $_GET['service_type'] : 'samba';

			list_folder($abs_path, $service_type, $data_arr);
			break;
		default:
			break;
		}
	} else {
		// $dedup_arr = get_dedup();
	}

	$chksum = md5(json_encode($host_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$data_arr = NULL;
		$data_arr = array();
	}

	$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
	$result_arr["data"] = $data_arr;
	$result_arr["md5sum"] = $chksum;
	echo json_encode($result_arr, JSON_BIGINT_AS_STRING);
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

header('Content-Type: application/json; charset=utf-8');
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);

// HTTP/1.0
header('Pragma: no-cache');
?>