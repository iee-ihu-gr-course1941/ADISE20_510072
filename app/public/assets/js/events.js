window.addEventListener(
	"load",
	function (e) {
		$("#copyright-year").html(new Date().getFullYear());
		window.app.ui.gotToHash(window.location.hash);
	},
	false
);

window.addEventListener(
	"hashchange",
	function (e) {
		e.preventDefault();
		window.app.ui.hashRenderer(window.location.hash);
	},
	false
);
