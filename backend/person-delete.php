<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $sqli->autocommit(false);
  //A személy gyerekeinél a szülőket NULLozuk.
  $stmt = $sqli->prepare("update person set father_id = null, mother_id = null where father_id=? or mother_id=?");
  $stmt->bind_param("ii", $_POST["id"], $_POST["id"]);
  if (!$stmt->execute()){
    $sqli->rollback();
    $output["error"] = $sqli->error;
  }else{
    //A személy lakhelyeit törli
    $stmt = $sqli->prepare("delete from living where person_id=?");
    $stmt->bind_param("i", $_POST["id"]);
    if (!$stmt->execute()) {
      $sqli->rollback();
      $output["error"] = $sqli->error;
    }else{
      //A személy házasságait törli
      $stmt = $sqli->prepare("delete from relationship where wife_id=? or husband_id=?");
      $stmt->bind_param("ii", $_POST["id"], $_POST["id"]);
      if (!$stmt->execute()) {
        $sqli->rollback();
        $output["error"] = $sqli->error;
      }else{
        //Törli a személyt
        $stmt = $sqli->prepare("delete from person where id=?");
        $stmt->bind_param("i", $_POST["id"]);
        if (!$stmt->execute()) {
          $sqli->rollback();
          $output["error"] = $sqli->error;
        }else{
          $sqli->commit();
          $output["success"] = true;
        }
      }
    }
  }
  $stmt->close();
}else{
  $output["error"] = "Nonono";
}

$sqli->close();
echo json_encode($output);

?>
