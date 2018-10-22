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

require_once('/www/api_v2/system/net/network.php');

function POST_METHOD()
{
	$route_arr = array();
	$output    = "";
	$ret       = 0;

	switch ($_POST["op"]) {
		case 'nic_static_route_add':
			$route_arr["dst_addr"] = isset($_POST["dst_addr"])? $_POST["dst_addr"] : "";
			$route_arr["mask"]     = isset($_POST["mask"])? $_POST["mask"] : "";
			$route_arr["gateway"]  = isset($_POST["gateway"])? $_POST["gateway"] : "";
			$route_arr["metric"]   = isset($_POST["metric"])? $_POST["metric"] : 1;
			$route_arr["stack"]    = isset($_POST["ipv6"])? STACK_IPV6 : STACK_IPV4;
			$route_arr["iface"]    = isset($_POST["iface"])? $_POST["iface"] : "";

			$ret = add_static_route($route_arr, $output);
			break;

		case 'nic_static_route_del':
			$route_arr["id"]   = isset($_POST["id"])?  $_POST["id"] : "";
			$route_arr["stack"] = isset($_POST["ipv6"])? STACK_IPV6 : STACK_IPV4;

			$ret = del_static_route($route_arr, $output);
			break;

		case 'nic_static_route_edit':
			$route_arr["id"]       = isset($_POST["id"])? $_POST["id"] : "";
			$route_arr["dst_addr"] = isset($_POST["dst_addr"])? $_POST["dst_addr"] : "";
			$route_arr["mask"]     = isset($_POST["mask"])? $_POST["mask"] : "";
			$route_arr["gateway"]  = isset($_POST["gateway"])? $_POST["gateway"] : "";
			$route_arr["metric"]   = isset($_POST["metric"])? $_POST["metric"] : 1;
			$route_arr["stack"]    = isset($_POST["ipv6"])? STACK_IPV6 : STACK_IPV4;
			$route_arr["iface"]    = isset($_POST["iface"])? $_POST["iface"] : "";

			$ret = edit_static_route($route_arr, $output);
			break;

		default:
			break;
	}

	$result_arr = array();
	$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
	$result_arr["msg"]     = $output;
	echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

function GET_METHOD()
{
	$route_arr = array();
	$ret = 0;

	$route_arr = get_all_route_settings();

	$result_arr = array();
	$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
	$result_arr["data"]    = $route_arr;
	echo json_encode($result_arr, JSON_NUMERIC_CHECK);
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