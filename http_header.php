#!/www/cgi-bin/php
<?
$http = array();
foreach($_SERVER as $key => $val) {
    if (strncmp($key, "HTTP", 4) == 0) {
        $http[$key] = $val;
    }
}
$output = json_encode($http);
echo $output;
?>