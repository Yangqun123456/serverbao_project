$(function() {
	/*菜单收缩*/
	$("#clickButton").children("a").on("click", function() {

		setTimeout(function() {
			$("#leftMenu_zztz_s").removeClass("displayN");
			$("#clickButton").addClass("displayN");

			$("#leftMenu_zztz").animate({
				width: "0px"
			}, 100);
		}, 99);
		setTimeout(function() {

			$("#leftMenu_zztz_s").animate({
				left: "0px"
			}, 100);
			$("#main_zztz").animate({
				left: "0px",
				width:"100%"
			}, 100);


		}, 100);
	});
	/*菜单收缩结束*/

	/*菜单展开*/
	$("#clickButtonS").children("a").on("click", function() {
		setTimeout(function() {
			$("#leftMenu_zztz").animate({
				width: "6.2%"
			}, 100);
			$("#leftMenu_zztz_s").addClass("displayN");
			$("#clickButton").removeClass("displayN");
		}, 100);
		setTimeout(function() {
			$("#leftMenu_zztz_s").animate({
				left: "6.2%"
			}, 100);
			$("#main_zztz").animate({
				left: "6.2%",
				width:"93.8%"
			}, 100);
		}, 99);
	});
	/*菜单展开结束*/
});