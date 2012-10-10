<?php
	//include_once("./resources/php/dBug.php");
	//header("Content-Type: text/html; charset=UTF-8");
	//header("Content-Type: text/javascript; charset=utf-8");
	header("Content-Type: application/json; charset=utf-8");
	
	//h htmlspecialchars
	$request = h($_REQUEST);
	
	if(isset($request['url'])){
		$url = $request['url'];
	} else {
		$url = 'mockdata3';
	}
	
	$url = str_replace([".", "/"], "", $url) . ".json";
	
	$json = file_get_contents($url,true);
	$data = json_decode($json);
	
	$output = "";
	
	if($url == 'mockdata1.json'){
		$output = $data -> {'id'} -> {$request['id']};
	} else if($url == 'mockdata2.json'){
		$output = $data -> {'no'} -> {$request['no']};
	} else if($url == 'mockdata3.json'){
		
		$id_arr = array();
		$params = $_SERVER['QUERY_STRING'];	
		$params = str_replace(["%5B%5D"], "", $params);
		$params = explode("&", $params);
		
		foreach ($params as $param) {
			$par = explode("=", $param);
			if ($par[0] == "id") array_push($id_arr, $par[1] - 1);
		}
		
		for ($i = 0; $i < count($id_arr); $i++) {
			$output[$i] = $data -> {'results'}[$id_arr[$i]];
		}
	} else {
		$output = $data;
	}
	
	$data -> {'results'} = $output;
	
	/*
	echo "<pre>";
	var_dump($data);
	echo "</pre>";
	*/
	
	//new dBug($data);
	echo json_encode($data);
	
	
	//htmlspecialchars
	function h($str){
		if(is_array($str)){
			return array_map("h",$str);
		}else{
			return htmlspecialchars($str,ENT_QUOTES);
		}
	}
?>