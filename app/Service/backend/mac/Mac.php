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

require_once('/www/api_v2/service/mac.php');

function POST_METHOD()
{	
	$afp_arr    = array();
	$result_arr = array();
	$output_arr = array();
	
    switch ($_POST["op"]) { 
    case 'afp_set':
		
		foreach ($_POST as $key => $value) {
			if($key != 'op') { 
				$afp_arr[$key] = $value;
			}
		}
		
		$output_arr            = set_afp_setting($afp_arr);
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
	$chksum     = 0;
	$result_arr = array();
	$output_arr = array();

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
		default:
			break;
		}
	} else {
		$output_arr = get_afp_setting();
	}
	
	$chksum                = md5(json_encode($output_arr));
	$result_arr["success"] = $output_arr['status'];
	$result_arr["data"]    = $output_arr["data"];
	$result_arr["md5sum"]  = $chksum;
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