<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (!isset($_SESSION["USER"])) {
  if (isset($_POST["name"]) && isset($_POST["email"]) && isset($_POST["password"])
  && isset($_POST["sex"])) {
    if ($_POST["name"]!="" && $_POST["email"]!="" && $_POST["password"]!=""){
      $stmt = $sqli->prepare("select id from person where email=? LIMIT 1");
      $stmt->bind_param("s", $_POST["email"]);
      $stmt->execute();
      $stmt->store_result();
      if ($stmt->num_rows == 0) {
        $stmt = $sqli->prepare("insert into person (name, email, password, sex) values (?, ?, ? ,?)");
        $stmt->bind_param("sssi", $_POST["name"], $_POST["email"], sha1($_POST["email"].$shalt.$_POST["password"]), $_POST["sex"]);
        if ($stmt->execute()) {
          $output["success"] = true;
        }else{
          $output["error"] = $sqli->error;
        }
      }else{
        $output["error"] = "E-mail már használt";
      }
      $stmt->close();
    }else{
      $output["error"] = "Üresek a mezők";
    }
  }else{
    $output["error"] = "Hiányos mezők";
  }
}else{
  $output["error"] = "Már be vagy jelentkezve";
}

$sqli->close();
echo json_encode($output);

?>
