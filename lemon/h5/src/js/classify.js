require.config({
	paths: {
		"mui": "libs/mui.min",
		"picker": "libs/mui.picker.min"
	},
	shim: {
		"picker": {
			deps: ["mui"] //deps数组，表明该模块的依赖性
		}
	}
})

require(["mui", "picker"], function(mui, picker) {

	//全局变量

	var year = new Date().getFullYear();
	var month = new Date().getMonth() + 1;
	var day = new Date().getDate();
	var windowTime = year + '-' + (month < 10 ? "0" + month : month) + '-' + day; //显示的当前时间


	function init() {
		windowtime();
		getClassIfy();
		classTab();

	}

	//收支的tab
	function classTab() {
		let tabLis = [...document.querySelectorAll(".tab-list span")];

		//mmon 激活字符
		mui('.tab-list').on('tap', 'span', function() {
			for (var i = 0; i < tabLis.length; i++) {
				tabLis[i].classList.remove("active");
			}
			//classList.toggle 切换
// 			this.classList.toggle("active");
// 			this.classList.toggle("active");

			this.classList.add("active");
			getClassIfy() //取分类

		})


	}

	//获取用户的分类
	function getClassIfy() {
		let uid = localStorage.getItem("uid");
		let style = document.querySelector(".tab-list .active").innerHTML;
		// console.log(style);
		mui.ajax('/api/getClass', {
			data: {
				cify: style,
				uid: uid
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 3000, //超时时间设置为10秒；
			success: function(res) {
				console.log(res);
			}
		});
	}

	//设置显示系统时间
	function windowtime() {
		document.querySelector(".choose-time").innerHTML = windowTime;
	}





	init()


})
