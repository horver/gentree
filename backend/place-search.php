<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $stmt = $sqli->prepare("select * from place where city like ?");
  $stmt->bind_param("s", $city);
  $city = "%".$_POST["search"]."%";
  if ($stmt->execute()) {
    $result = $stmt->get_result();
    $output["places"] = array();
    while($output["places"][] = $result->fetch_assoc());
    array_pop($output["places"]);
    $output["success"] = true;
  }else{
    $output["error"] = $sqli->error;
  }
  $stmt->close();
}else{
  $output["error"] = "Nonono";
}

$sqli->close();
echo json_encode($output);

?>
