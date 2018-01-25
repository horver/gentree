<?php

$db = "gentree";
$dbUser = "root";
$dbPass = "";
$dbHost = "localhost";

$shalt = "ErxSa";
$sqli = new mysqli($dbHost, $dbUser, $dbPass, $db);

header('Content-Type: text/html; charset=utf-8');
session_start();

if ($sqli->connect_errno)
    echo "Failed to connect to MySQL: ".$sqli->connect_errno." ".$sqli->connect_error;

if (isset($_GET["exit"]))
  unset($_SESSION["USER"]);

?>
