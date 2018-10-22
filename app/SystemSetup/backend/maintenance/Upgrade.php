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
require_once('/www/api_v2/system/maintenance/upgrade.php');

$ret		= '';
$fw_arr     = array();
$output     = array();
$result_arr = array();

function POST_METHOD()
{

		
	if(!isset($_POST["op"])) {
        exit;
    }
	
	switch ($_POST["op"]) { 
	case 'fw_upload':
		$fw_arr["filename"]    = $_FILES["upgrade_file"]["name"];
		$fw_arr["tmp_name"]    = $_FILES["upgrade_file"]["tmp_name"];
		$ret                   = set_fw_upload_setting($fw_arr, $output, $_FILES);
		
		$result_arr["success"] = ($ret == 0) ? true : false;
		$result_arr["name"]    = $_FILES["upgrade_file"]["name"];
		$result_arr["state"]   = $output["state"];
		
		echo json_encode($result_arr, JSON_NUMERIC_CHECK);
		break;
		
	case 'fw_upgrade': 
		set_fw_upgrade_setting($fw_arr, $output);
		
		$result_arr["success"]  = true;
		$result_arr["msg"]      = $output["msg"];
		$result_arr["filename"] = $output["filename"];
		$result_arr["state"]    = $output["state"];
		$result_arr["progress"] = $output["progress"];
		echo json_encode($result_arr, JSON_NUMERIC_CHECK);
		break;
	default:
		echo "none";
		break;	
	}
}

function GET_METHOD()
{
}

switch ($_SERVER['REQUEST_METHOD']) {
case 'POST':
	POST_METHOD();
	break;
	
case 'GET':
	GET_METHOD();
	break;
	
default:
	echo "Request";
	break;
}
?>
