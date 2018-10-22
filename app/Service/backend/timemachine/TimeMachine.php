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

require_once('/www/api_v2/service/time_machine.php');
	
function GET_METHOD_FORMAT_OUT($input_arr)
{
	$chksum        = 0;
	$output_arr    = array();
	$tmp_merge_arr = array();
	$result_arr    = array();
	$tmp_compose   = count($input_arr);
	
	$tmp_merge_arr[] = $input_arr[0];

	if ($tmp_compose >= 2) {			
		for ($i=1, $j=0; $j <= $tmp_compose - 2; $j++, $i++) {
			$tmp_merge_arr[] = $input_arr[$i];
		}
		
		$output_arr            = $tmp_merge_arr;
		$result_arr["success"] = isset($output_arr) ? 'true' : 'false';
		$result_arr["data"]    = $output_arr;
		$chksum                = md5(json_encode($output_arr));
		$result_arr["md5sum"]  = $chksum;
		echo json_encode($result_arr, JSON_NUMERIC_CHECK);
		
	} else {
		$output_arr            = $tmp_merge_arr;
		$result_arr["success"] = $output_arr[0]['status'];
		$result_arr["data"]    = $output_arr[0]["data"];
		$chksum                = md5(json_encode($output_arr[0]));
		$result_arr["md5sum"]  = $chksum;
		echo json_encode($result_arr, JSON_NUMERIC_CHECK);
	}
}	 

function POST_METHOD()
{	
	$time_machine_arr = array();
	$result_arr       = array();
	$output_arr       = array();
	
    	switch ($_POST["op"]) { 
    	case 'afp_general_write':
			foreach ($_POST as $key => $value) {
				if($key != 'op') { 
					$time_machine_arr[$key] = $value;
				}
			}
			
			$output_arr            = set_time_machine_general_setting($time_machine_arr);
			$result_arr["success"] = $output_arr['status'];
			$result_arr["msg"]     = $output_arr["msg"];
			echo json_encode($result_arr, JSON_NUMERIC_CHECK);
    		break;
			
    	case 'afp_access_perm_write':
			foreach ($_POST as $key => $value) {
				if($key != 'op') { 
					$time_machine_arr[$key] = $value;
				}
			}
			
			$output_arr            = set_time_machine_access_perm_setting($time_machine_arr);
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
	$tmp_exe_func;
	$tmp_output_arr = array();
	$request_arr    = array();

	foreach ($_GET as $key => $value) {
		switch($key) {
		case 'op':
			$request_arr = explode("+",$value);
			$request_arr = array_unique($request_arr);
			break;
			
		default:
			break;
		}
	}
	
	foreach ($request_arr as $key => $value) {
		switch ($value) {
		case 'afp_general_read':
			$tmp_exe_func     = get_time_machine_general_setting();
			$tmp_output_arr[] = $tmp_exe_func;
			break;
			
		case 'afp_access_perm_read':
			$tmp_exe_func     = get_time_machine_access_perm_setting();
			$tmp_output_arr[] = $tmp_exe_func;
			break;

		default:
			break;	
		}
	}
	
	GET_METHOD_FORMAT_OUT($tmp_output_arr);
	
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
