<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $stmt = $sqli->prepare("select id from person where email like ? LIMIT 1");
  $stmt->bind_param("s", $_POST["email"]);
  if ($stmt->execute()) {
    $stmt->store_result();
    if ($stmt->num_rows == 0) {
      $sqli->autocommit(false);
      //Személy beszúrása
      $stmt = $sqli->prepare("insert into person (name, email, password, sex, born, death, bornplace, job, prename, comment, father_id, mother_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      $stmt->bind_param("sssissssssii", $_POST["name"], $_POST["email"], sha1($_POST["email"].$shalt.$_POST["password"]),
                        $_POST["sex"], $_POST["born"], $_POST["death"]=="-1"?null:$_POST["death"],
                        $_POST["bornplace"], $_POST["job"], $_POST["prename"], $_POST["comment"],
                        $_POST["fatherId"]=="NaN"?null:$_POST["fatherId"], $_POST["motherId"]=="NaN"?null:$_POST["motherId"]);
      if (!$stmt->execute()) {
        $output["error"] = $sqli->error;
      }else{
        $personId = $sqli->insert_id;
        if (isset($_POST["pastPlaces"])) {
          //Korábbi lakhelyek beszúrása
          $stmt = $sqli->prepare("insert into living (person_id, place_id, begin, end, street) values (?, ?, ?, ?, ?)");
          foreach ($_POST["pastPlaces"] as $key => $place) {
            $stmt->bind_param("iisss", $personId, $place["id"], $place["begin"], $place["end"], $place["street"]);
            if (!$stmt->execute()) {
              $output["error"] = $sqli->error;
              $sqli->rollback();
            }
          }
        }
        //Aktuális lakhely beszúrása
        $stmt = $sqli->prepare("insert into living (person_id, place_id, begin, street) values (?, ?, ?, ?)");
        $stmt->bind_param("iiss", $personId, $_POST["place"]["id"], $_POST["place"]["begin"], $_POST["place"]["street"]);
        if (!$stmt->execute()) {
          $output["error"] = $sqli->error;
          $sqli->rollback();
        }
      }
      $sqli->commit();
      $output["success"] = true;
    }else{
       $output["error"] = "Már eltároltuk ezt a személyt";
    }
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
