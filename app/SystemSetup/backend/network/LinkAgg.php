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

require_once('/www/lib/rms.php');
require_once('/www/api_v2/system/net/linkagg.php');

$link_arr   = array();
$output_arr = array();
$result_arr = array();

function POST_METHOD()
{
    switch ($_POST["op"]) { 
    case 'nic_create_lag':

		foreach ($_POST as $key => $value) {
			if($key != 'op') { 
				$link_arr[$key] = $value;
			}
		}

		$output_arr = set_link_agg_setting($link_arr);
		$result_arr["success"] = $output_arr['status'];
		$result_arr["msg"]     = $output_arr["msg"];
		echo json_encode($result_arr, JSON_NUMERIC_CHECK);
    	break;
    default:
    	break;		
    }
}

function GET_METHOD()
{	
	switch ($_GET["op"]) {
	default:
		$output_arr = get_link_agg_setting();

		$result_arr["success"] = $output_arr['status'];
		$result_arr["data"]    = $output_arr["data"];
		echo json_encode($result_arr, JSON_NUMERIC_CHECK);
		break;
	}
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