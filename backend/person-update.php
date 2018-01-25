<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $stmt = $sqli->prepare("select id from person where email like ? LIMIT 1");
  $stmt->bind_param("s", $_POST["email"]);
  if ($stmt->execute()) {
    $result = $stmt->get_result();
    $person = $result->fetch_assoc();
    if ($person["id"] == $_POST["personId"]) {
      $sqli->autocommit(false);
      //Lakhelyek törlése
      $stmt = $sqli->prepare("delete from living where person_id=?");
      $stmt->bind_param("i", $_POST["personId"]);
      if ($stmt->execute()) {
        //A személy módósítása
        $stmt = $sqli->prepare("update person set name=?, email=?, password=?, sex=?, born=?, death=?, bornplace=?, job=?, prename=?,
                                comment=?, father_id=?, mother_id=? where id=?");
        $stmt->bind_param("sssissssssiii", $_POST["name"], $_POST["email"], sha1($_POST["email"].$shalt.$_POST["password"]),
                          $_POST["sex"], $_POST["born"], $_POST["death"]=="-1"?null:$_POST["death"],
                          $_POST["bornplace"], $_POST["job"], $_POST["prename"], $_POST["comment"],
                          $_POST["fatherId"]=="NaN"?null:$_POST["fatherId"], $_POST["motherId"]=="NaN"?null:$_POST["motherId"], $_POST["personId"]);
        if ($stmt->execute()) {
          //Lakhelyek újra beszúrása
          if (isset($_POST["pastPlaces"])) {
            //Korábbi lakhelyek beszúrása
            $stmt = $sqli->prepare("insert into living (person_id, place_id, begin, end, street) values (?, ?, ?, ?, ?)");
            foreach ($_POST["pastPlaces"] as $key => $place) {
              $stmt->bind_param("iisss", $_POST["personId"], $place["id"], $place["begin"], $place["end"], $place["street"]);
              if (!$stmt->execute()) {
                $output["error"] = $sqli->error;
                $sqli->rollback();
              }
            }
          }
          //Aktuális lakhely beszúrása
          $stmt = $sqli->prepare("insert into living (person_id, place_id, begin, street) values (?, ?, ?, ?)");
          $stmt->bind_param("iiss", $_POST["personId"], $_POST["place"]["id"], $_POST["place"]["begin"], $_POST["place"]["street"]);
          if (!$stmt->execute()) {
            $output["error"] = $sqli->error;
            $sqli->rollback();
          }
          $sqli->commit();
          $output["success"] = true;
        }else{
          $output["error"] = $sqli->error;
          $sqli->rollback();
        }
      }else{
        $output["error"] = $sqli->error;
      }
    }else{
       $output["error"] = "Ez az email már foglalt!";
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
