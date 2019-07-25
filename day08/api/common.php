<?php 
		/*
		链接MySQL数据库
	*/
		// 设置utf-8字符编码格式;
	header("Content-Type: text/html; charset=utf-8");
	// 服务器的名字
	$servername = "localhost";
	// Mysql用户名
	$username = "root";
	// Mysql密码
	$password = "root";
	// 需要连接的数据库名字
	$db_name = "motou";
	//  创建连接
	$conn = new mysqli($servername, $username, $password, $db_name);
	// 检测连接
	if ($conn->connect_error) {
		die("连接失败：" . $conn->connect_error);
	}
	
	function trimall($str){ // 清除空格函数
	    $qian=array(" ","　","\t","\n","\r");
	    return str_replace($qian, '', $str);   
	}
 ?>