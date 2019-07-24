<?php
	include 'common.php';
	/*
		$method 必须传入的参数,表示需要执行的操作
		$method 传入的值为 'select' 字符串时会执行查询操作
		$table 查询表的所有字段
		$start 查询字段的开始位置
		$length 查询字段的长度
	*/
	$method = isset($_GET['method']) ? $_GET['method'] : false;
	$table = isset($_GET['table']) ? trimall($_GET['table']) : false;
	$start = isset($_GET['start']) ? trimall($_GET['start']) : false;
	$length = isset($_GET['length']) ? trimall($_GET['length']) : false;
	$id = isset($_GET['id']) ? trimall($_GET['id']) : false;
	if($method == 'select') { // 执行查询
		if($table) $sql = "select * from $table";
		if($table && $length) $sql = "select * from $table limit $start, $length";
		if($table && $id) $sql = "select * from $table where id = $id";
		$result = $conn->query($sql);
		// 收集数据
		if($result) { // 如果执行sql语句正常则进行结果收集
			$row = $result->fetch_all(MYSQLI_ASSOC);
			if(count($row)) { // 如果收集到的数组不是空数组
				echo json_encode($row); // 返回查询结果
			} else {
				echo 0; // 表示查询的数据问空
			}
		} else {
			echo '["query error"]'; // 表示查询出错
		}
	}


	/*
		购物车接口
	*/
	$id = isset($_GET['id']) ? trimall($_GET['id']) : false;
	$num = isset($_GET['num']) ? trimall($_GET['num']) : false;
	if($method == 'cart') {
		if($id) $sql = "select * from cart where id = $id";
		$result = $conn->query($sql);
		if($result) {
			$row = $result->fetch_all(MYSQLI_ASSOC);
			if(count($row)) { 
				// 如果收集到的数组不是空数组,表示该商品已经在购物车中只需修改数量
				/*
					获取原有的数量
					修改原有数量
				*/
				$sql4 = "select num from cart where id = $id";
				$res2 = $conn->query($sql4);
				if($res2) {
					$row = $res2->fetch_all(MYSQLI_ASSOC);
					$n = $row[0]['num'] + $num;
					// 修改数据
					$sql3 = "update cart set num = $n where id = $id";
					$ok = $conn->query($sql3);
					if($ok) {
						echo $ok; // 加入购物车成功
					}
				}
			} else { 
			// 表示查询的数据问空,即购物车没有该商品那么进行插入数据
				$sql2 = "insert into cart (id,img,title,old_price,new_price) 
				select id, img, title, old_price, new_price from list_goodslist where id=$id";
				$res = $conn->query($sql2);
				if($res) {
					// 执行数量的更新
					$sql3 = "update cart set num = $num where id = $id";
					$ok = $conn->query($sql3);
					if($ok) {
						echo $ok; // 加入购物车成功
					}
				}
			}
		} else {
			echo '["query error"]'; // 表示查询出错
		}
	}

	/*
		$method 传入的值为 'delete' 字符串时会执行删除操作
		$table 表示需要操作的表
		$conditions 表示删除的条件
	*/ 
	if($method == 'delete') {
		$sql = "delete from $table where id = $id";
		$result = $conn->query($sql);
		if($result) {
			echo 1; // 删除成功
		} else {
			echo 0; // 删除失败
		}
	}
?>