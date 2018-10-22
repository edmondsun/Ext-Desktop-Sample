#!/www/cgi-bin/php
<?
/**************************************************************************************************
 *
 * File name:
 *			Notification_center.php
 * 
 * Post:
 *		Function name:
 *			set_notify_center
 *		Input:	
 *			@param string  $_POST["info"]			[Information]
 * 			@param string  $_POST["warning"]		[Warning]
 * 			@param string  $_POST["error"]			[Error]
 * 			@param string  $_POST["backup_event"]	[Backup event]
 *      Output:
 *     	 	@param string  $output					[Json format]
 * Get:
 *		Function name:
 *			get_notify_center
 *      Output:
 *     	 	@param data array:
 *				@param   info
 *				@param   warning
 *				@param   error
 *				@param   backup_event
 *************************************************************************************************/
require_once('/www/api_v2/system/notify/notification_center.php');

$notify_arr = array();

if ( isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST') ) {
	
	if(!isset($_POST["op"])) {
        return;
    }
	$notify_arr = array();
    switch ($_POST["op"]) {                                                                                                                                                                                                                                        
    case 'set_notify_center':            

		if (isset($_POST["info"])) {
			$notify_arr["info"] = ($_POST["info"] == 1) ? 1 : 0;
		}
		
		if (isset($_POST["warning"])) {
			$notify_arr["warning"] = ($_POST["warning"] == 1) ? 1 : 0;
		}
		
		if (isset($_POST["error"])) {
			$notify_arr["error"] = ($_POST["error"] == 1) ? 1 : 0;
		}
		
		if (isset($_POST["backup_event"])) {
			$notify_arr["backup_event"] = ($_POST["backup_event"] == 1) ? 1 : 0;
		}
		break;

	default:
		break;	
	}

	$ret                    = set_notify_center($notify_arr, $output);
	$result_arr             = array();
	$result_arr["success"]	= ($ret==0) ? true : false;
	$result_arr["msg"]		= $output;

	echo json_encode($result_arr);
} else {
	$notify_arr = array();
	get_notify_center($notify_arr);

	echo json_encode(array("success" => true, "data" => $notify_arr), JSON_NUMERIC_CHECK);
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