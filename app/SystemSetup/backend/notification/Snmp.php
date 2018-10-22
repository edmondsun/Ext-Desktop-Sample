#!/www/cgi-bin/php
<?
require_once('/www/lib/rms.php');
require_once('/www/api_v2/system/notify/snmp.php');

$snmp_arr   = array();
$output     = array();
$result_arr = array();

function POST_METHOD()
{
	if(!isset($_POST["op"])) {
        exit;
    }
	
    switch ($_POST["op"]) {                                                                                                                                                                                                                                        
    case 'set_snmp':            
	
		foreach ($_POST as $key => $value) {
			if($key != 'op') { 
				$snmp_arr[$key] = $value;
			}
		}
		
		$ret                   = set_snmp_setting($snmp_arr, $output);
		$result_arr["success"] = ($ret == 0) ? true : false;
		$result_arr["msg"]	   = $output;
		echo json_encode($result_arr);
		break;
		
	case 'download_mib':
	
		if (strncmp($_SERVER["HTTP_REFERER"], "https", 5) == 0) {
			header("Cache-Control: cache, must-revalidate");
			header("Pragma: public");
		} else {
			header('Pragma: no-cache');
		}
		
		$ret = download_mib_setting();
		exit;
		break;
	
	default:
		break;	
	}
}

function GET_METHOD()
{	
	switch ($_GET["op"]) {
	case 'download_mib':
	
		if (strncmp($_SERVER["HTTP_REFERER"], "https", 5) == 0) {
			header("Cache-Control: cache, must-revalidate");
			header("Pragma: public");
		} else {
			header('Pragma: no-cache');
		}
		
		$ret = download_mib_setting();
		exit;
		break;
	
	default:
		get_snmp_setting($snmp_arr);
		echo json_encode(array("success" => true, "data" => $snmp_arr), JSON_NUMERIC_CHECK);
		break;
	}
}

if (!isset($_SERVER['REQUEST_METHOD'])) {
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
