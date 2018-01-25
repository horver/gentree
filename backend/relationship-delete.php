<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $stmt = $sqli->prepare("delete from relationship where id=?");
  $stmt->bind_param("i", $_POST["id"]);
  if (!$stmt->execute()){
    $sqli->rollback();
    $output["error"] = $sqli->error;
  }else{
    $output["success"] = true;
  }
  $stmt->close();
}else{
  $output["error"] = "Nonono";
}

$sqli->close();
echo json_encode($output);

?>
