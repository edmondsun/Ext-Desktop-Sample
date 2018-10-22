#!/www/cgi-bin/php
<?
require_once('/www/api_v2/account/account.php');
	 
function POST_METHOD()
{	
	$account_arr    = array();
	$result_arr = array();
	$output_arr = array();
	
    switch ($_POST["op"]) { 
    case 'rysnc_set':
		
		foreach ($_POST as $key => $value) {
			if($key != 'op') { 
				$account_arr[$key] = $value;
			}
		}
		
		$output_arr            = set_account_setting($account_arr);
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
	$chksum              = 0;
	$msg                 = '';
	$status              = false;
	$result_arr          = array();
	$output_arr          = array();
	$tmp_data_arr        = array();
	$tmp_data_arr_user   = array();
	$tmp_data_arr_domain = array();
	
	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
		
		case 'account_item':
			$account_type = $_GET["account"];
			$status = list_account($account_type, $output_arr, $msg, $args);
			print_r($output_arr);
			break;
		}
	} else {
		$status = list_account(NULL, $tmp_data_arr, $msg, $args);
		
		for($i = 0; $i < count($tmp_data_arr['user']); $i++) {
			$tmp_data_arr_user[] = array( 
										  'name' => $tmp_data_arr['user'][$i]
									    );
		}
		
		for($i = 0; $i < count($tmp_data_arr['domain_user']); $i++) {
			$tmp_data_arr_domain[] = array( 
										  'name' => $tmp_data_arr['domain_user'][$i]
									    );
		}
		
		$output_arr[] = array( 
							  'user'  => $tmp_data_arr_user,
							  'domain_user' => $tmp_data_arr_domain
						    );
	}
	
	$chksum                = md5(json_encode($output_arr));
	$result_arr["success"] = $status;
	$result_arr["data"]    = $output_arr;
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

header('Content-Type: application/json; charset=utf-8');
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');
?>