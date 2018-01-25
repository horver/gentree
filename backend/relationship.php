<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  if (isset($_POST["husbandId"]) && isset($_POST["wifeId"]) && isset($_POST["begin"]) && isset($_POST["end"])) {
    if ($_POST["begin"]!="" && $_POST["end"]!=""){
      $stmt = $sqli->prepare("select * from relationship where husband_id=? and wife_id=? LIMIT 1");
      $stmt->bind_param("ii", $_POST["husbandId"], $_POST["wifeId"]);
      $stmt->execute();
      $stmt->store_result();
      if ($stmt->num_rows == 0) {
        //Az elöző házasság lezárása
        $stmt = $sqli->prepare("update relationship set divorce='".date('Y-m-d')."' where (husband_id=? or wife_id=?) and divorce is null");
        $stmt->bind_param("ii", $_POST["husbandId"], $_POST["wifeId"]);
        if ($stmt->execute()) {
          $stmt = $sqli->prepare("insert into relationship (husband_id, wife_id, marrige, divorce) values (?, ?, ?, ?)");
          $stmt->bind_param("iiss", $_POST["husbandId"], $_POST["wifeId"], $_POST["begin"], $_POST["end"]=="-1"?null:$_POST["end"]);
          if ($stmt->execute()) {        
            $output["success"] = true;
          }else{
            $output["error"] = $sqli->error;
          }
        }else{
          $output["error"] = $sqli->error;
        }
      }else{
        $output["error"] = "Már eltároltuk ezt a házasságot";
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
