#!/www/cgi-bin/php
<?
/**************************************************************************************************
 *
 * File name:
 *			Mail.php
 *
 * Post:
 *		Function name:
 *			set_mail_setting
 *		Input:
 *			@param string  $_POST["mail_type"]			[Mail type]
 * 			@param string  $_POST["mail_from"]			[Mail from]
 * 			@param string  $_POST["smtp_server"]		[Smtp server]
 * 			@param string  $_POST["auth_method"]		[Authentication method]
 * 			@param string  $_POST["account"]			[Account]
 * 			@param string  $_POST["password"]			[Password]
 * 			@param string  $_POST["mail_to_num"]		[Mail to number]
 * 			@param string  $_POST["mail_from_arr"]		[Mail from array]
 *      Output:
 *     	 	@param string  $output						[Json format]
 * Get:
 *		Function name:
 *			get_mail_setting
 *      Output:
 *     	 	@param string  $output						[Json format]
 			mail_from {
 				'mail_type','mail_from','smtp_server','auth_method','account','password'
 			}
 			mail_to {
			 	['mail_to'='aa@gmail.com', 'info'='','warning'='','error'='','backup_event'=''],
			 	['mail_to'='bb@gmail.com', 'info'='','warning'='','error'='','backup_event'=''],
			 	['mail_to'='bb@gmail.com', 'info'='','warning'='','error'='','backup_event'='']
			}
 *************************************************************************************************/
require_once('/www/api_v2/system/notify/mail.php');
if ( isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST') ) {
	$output = "";
	switch($_POST["op"]) {
		case 'set_mail':
			$mail_arr = array();
			$mail_arr["mail_type"]	= (isset($_POST["mail_type"]))? $_POST["mail_type"] : "";
			$mail_arr["mail_from"]	= (isset($_POST["mail_from"]))? $_POST["mail_from"] : "";
			$mail_arr["smtp_server"] = (isset($_POST["smtp_server"]))? $_POST["smtp_server"] : "";
			$mail_arr["auth_method"] = (isset($_POST["auth_method"]))? $_POST["auth_method"] : 0;
			$mail_arr["account"]	= (isset($_POST["account"]))? $_POST["account"] : "";
			$mail_arr["password"]	= (isset($_POST["password"]))? rtrim($_POST["password"]) : "";
			$mail_arr["mail_to_1"]	= (isset($_POST["mail_to_1"]))? $_POST["mail_to_1"] : "";
			$mail_arr["mail_to_2"]	= (isset($_POST["mail_to_2"]))? $_POST["mail_to_2"] : "";
			$mail_arr["mail_to_3"]	= (isset($_POST["mail_to_3"]))? $_POST["mail_to_3"] : "";
			$mail_arr["filter_1"]	= (isset($_POST["filter_1"]))? $_POST["filter_1"] : "";
			$mail_arr["filter_2"]	= (isset($_POST["filter_2"]))? $_POST["filter_2"] : "";
			$mail_arr["filter_3"]	= (isset($_POST["filter_3"]))? $_POST["filter_3"] : "";

			$ret = set_mail_setting($mail_arr, $output);
			break;
		case 'test_mail':
			$mail_arr["mail_to_arr"] = (isset($_REQUEST["mail_to_arr"]))? json_decode($_REQUEST["mail_to_arr"]): "";
			$mail_arr["mail_from"]	= (isset($_POST["mail_from"]))? $_POST["mail_from"] : "";
			$mail_arr["smtp_server"] = (isset($_POST["smtp_server"]))? $_POST["smtp_server"] : "";
			$mail_arr["auth_method"] = (isset($_POST["auth_method"]))? $_POST["auth_method"] : 0;
			$mail_arr["account"]	= (isset($_POST["account"]))? $_POST["account"] : "";
			$mail_arr["password"]	= (isset($_POST["password"]))? rtrim($_POST["password"]) : "";

			$ret = test_mail_send($mail_arr, $output);
			break;
		case 'add_mail':
		case 'del_mail':
			$mail_arr = (file_exists(MAIL_PATH))?parse_ini_file(MAIL_PATH):array();
			$mail_arr["mail_to_1"]	= (isset($_POST["mail_to_1"]))? $_POST["mail_to_1"] : $mail_arr["mail_to_1"];
			$mail_arr["mail_to_2"]	= (isset($_POST["mail_to_2"]))? $_POST["mail_to_2"] : $mail_arr["mail_to_2"];
			$mail_arr["mail_to_3"]	= (isset($_POST["mail_to_3"]))? $_POST["mail_to_3"] : $mail_arr["mail_to_3"];
			$mail_arr["filter_1"]	= (isset($_POST["filter_1"]))? $_POST["filter_1"] : $mail_arr["filter_1"];
			$mail_arr["filter_2"]	= (isset($_POST["filter_2"]))? $_POST["filter_2"] : $mail_arr["filter_2"];
			$mail_arr["filter_3"]	= (isset($_POST["filter_3"]))? $_POST["filter_3"] : $mail_arr["filter_3"];
			$ret = set_mail_setting($mail_arr, $output);
			break;
		default:
			$ret = 0;
			break;
	}

	$result_arr = array();
	$result_arr["success"]	= ($ret==0) ? true : false;
	$result_arr["msg"] = $output;
	echo json_encode($result_arr);
} else {
	$mail_from_arr	= array();
	$mail_to_arr	= array();
	get_mail_setting($mail_from_arr, $mail_to_arr);

	$mail_arr = array();
	$mail_arr["mail_from"]	= $mail_from_arr;
	$mail_arr["mail_to"]	= $mail_to_arr;
	echo json_encode(array("success" => true, "data" => $mail_arr), JSON_NUMERIC_CHECK);
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