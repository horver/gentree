<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  if (isset($_POST["country"]) && isset($_POST["city"])) {
    if ($_POST["country"]!="" && $_POST["city"]!=""){
      $stmt = $sqli->prepare("select id from place where country=? and city=? LIMIT 1");
      $stmt->bind_param("ss", $_POST["country"], $_POST["city"]);
      $stmt->execute();
      $stmt->store_result();
      if ($stmt->num_rows == 0) {
        $stmt = $sqli->prepare("insert into place (country, city) values (?, ?)");
        $stmt->bind_param("ss", $_POST["country"], $_POST["city"]);
        if ($stmt->execute()) {
          $output["success"] = true;
        }else{
          $output["error"] = $sqli->error;
        }
      }else{
        $output["error"] = "Már eltároltuk ezt a lakhelyet!";
      }
      $stmt->close();
    }else{
      $output["error"] = "Üresek a mezők";
    }
  }else{
    $output["error"] = "Hiányos mezők";
  }
}else{
  $output["error"] = "Nononono";
}

$sqli->close();
echo json_encode($output);

?>
