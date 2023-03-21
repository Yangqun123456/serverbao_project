$(document).ready(function() {
	//work_tool scroll start********************************
	var $scrollNum = 0;
	$(".iconUp").children("a").on("click", function() {
		if ($scrollNum <= 0 && $scrollNum > -5) {
			$scrollNum--;
			$(".iconDiv div:first-child").animate({
				marginTop: $scrollNum * 75 + "px"
			}, 250);
			if ($scrollNum <= -1 && $scrollNum > -5) {
				$(".iconDown").children("a").removeAttr("disabled");
			}

		}

		if ($scrollNum == -5) {
			$(this).attr("disabled", "disabled");
		}

	});

	$(".iconDown").children("a").on("click", function() {
		if ($scrollNum <= -1 && $scrollNum >= -5) {
			$scrollNum++;
			$(".iconDiv div:first-child").animate({
				marginTop: $scrollNum * 75 + "px"
			}, 250);
			if ($scrollNum <= -1 && $scrollNum > -5) {
				$(".iconUp").children("a").removeAttr("disabled");
			}
		}
		if ($scrollNum == 0) {
			$(this).attr("disabled", "disabled");
		}

	});
	//work_tool scroll end************************************


	


	var tabNum = 1; //数据分析序号初始值

	//数据分析TAB切换************************************
	$("#tabDIV ul li").children("a[class*='ATab']").bind("click", function() {
			var indexT = $(this).parent("li").index("#tabDIV ul li");
			$(this).parent("li").addClass("tabActive");
			$(this).parent("li").siblings().removeClass("tabActive");

		})
	//数据分析TAB切换结束************************************

	//删除数据分析************************************
	$("#tabDIV ul li").children("a.Aclose").bind("click", function() {
			var indexO = $(this).parent("li").index("#tabDIV ul li"); //a标签所在li的位置索引值
			var r = confirm("您还未保存，是否确认删除数据分析?");


			if (r == true) {
				if (indexO == 0) {
					if ($(this).parent("li").nextAll().length > 1) {
						if ($(this).parent("li").hasClass("tabActive")) {
							$(this).parent("li").next().addClass("tabActive");
							$(this).parent("li").next().siblings().removeClass("tabActive");
						}
						$("#tabDIV").nextAll().each(function(index) {
							if (index == indexO) {
								$(this).remove();
							}
						});
						$(this).parents("ul").children("li").each(function(index) {
							if (index == indexO) {
								$(this).remove();
							}
						});



					} else {
						alert("跳转到操作流程界面！");
						return false;
					}

				}
				if (indexO > 0) {
					if ($(this).parent("li").nextAll("li").length > 1) {
						if ($(this).parent("li").hasClass("tabActive")) {
							$(this).parent("li").next().addClass("tabActive");
							$(this).parent("li").next().siblings().removeClass("tabActive");
						}
					}
					if ($(this).parent("li").nextAll("li").length = 1) {
						if ($(this).parent("li").hasClass("tabActive")) {
							$(this).parent("li").prev().addClass("tabActive");
							$(this).parent("li").prev().siblings().removeClass("tabActive");
						}

					}

					$("#tabDIV").nextAll().each(function(index) {
						if (index == indexO) {
							$(this).remove();
						}
					});
					$(this).parents("ul").children("li").each(function(index) {
						if (index == indexO) {
							$(this).remove();
						}
					});

				}

			}
		})
		//删除数据分析结束************************************

	//新增数据分析************************************
	$("#addTable").bind("click", function() {
		$("#tabDIV ul li:eq(0)").clone(true).insertBefore($(this).parent("li")); //增加TAB按钮
		$("#blockTab").clone(true).appendTo("#main"); //增加TAB页
		tabNum++;
		$(this).parent("li").prev().children("a:eq(0)").text("数据分析" + tabNum); //修改TAB按钮内容
		$(this).parent("li").prev().addClass("tabActive"); //新增TAB按钮为选中状态
		$(this).parent("li").prev().siblings().removeClass("tabActive"); //新增TAB按钮的兄弟按钮为未选中状态

	});
	//新增数据分析结束************************************



});