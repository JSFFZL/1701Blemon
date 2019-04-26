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

	//缓存的UID 
	var uid;
	var sum = 0; //花费总金额
	var income = 0; //收入总金额
	var picker;
	var popPicker;

	var year = new Date().getFullYear();
	var month = new Date().getMonth() + 1;
	var windowTime = year + '-' + (month < 10 ? "0" + month : month); //显示的当前时间
	// var windowTime = year + '-' + month; //显示的当前时间

	document.querySelector(".timer").innerHTML = windowTime;
	// console.log(windowTime);

	function init() {
		lisClik();
		login();
		user();
		exit();
		timer();
		yearOrmonth();
		addBill();

		//实例化 时间插件
		picker = new mui.DtPicker({
			"type": "month" //完整日期视图(年月日时分)
		});

		//实例化 选择器插件
		popPicker = new mui.PopPicker();

		//设置展示的值
		popPicker.setData([{
				value: 'year',
				text: '年'
			},
			{
				value: 'month',
				text: '月'
			}
		]);




	}

	//业务逻辑

	//选择时间
	function timer() {
		document.querySelector(".timer").addEventListener("tap", function() {
			//显示日期插件
			picker.show(function(t) {
				let ym = document.querySelector(".yearTimer").innerHTML;
				if (ym == "年") {
					let time = t.y.text; //获取选择的时间
					document.querySelector(".timer").innerHTML = time;
					getBill()
				}else{
					let time = t.y.text + "-" + t.m.text; //获取选择的时间
					document.querySelector(".timer").innerHTML = time;
					getBill()
				}



			})
		})
	}

	//选择 年/月
	function yearOrmonth() {
		document.querySelector(".yearTimer").addEventListener("tap", function() {
			//通过自定义属性获取自定义属性
			let tYear = document.querySelector("[data-id='title-y']");
			let tMonth = document.querySelector("[data-id='title-m']");

			let dYear = document.querySelector("[ data-id=picker-y]");
			let dMonth = document.querySelector("[ data-id=picker-m]");

			// console.log(dYear);

			//显示 年/月 选择器
			popPicker.show(function(ym) {
				// 				console.log(ym[0].text); //
				// 				console.log(ym[0].value); //
				document.querySelector(".yearTimer").innerHTML = ym[0].text;
				
				if (ym[0].text == "年") {
					// 视图的title
					tMonth.style.display = "none";
					tYear.style.width = "100%";

					//视图的数据
					dYear.style.width = "100%";
					dMonth.style.display = "none";
					document.querySelector(".timer").innerHTML = year; //系统年
					getBill()
				} else {
					// 视图的title
					tMonth.style.display = "inline-block";
					tYear.style.width = "50%";
					//视图的数据
					dYear.style.width = "50%";
					dMonth.style.display = "inline-block";
					document.querySelector(".timer").innerHTML = windowTime; //系统年/月
					getBill()
				}
			})
		})
	}



	//获取当前用户的账单信息
	function getBill() {
		let t = document.querySelector(".timer").innerHTML;
		uid = localStorage.getItem("uid");
		console.log(uid);
		sum = 0; //花费总金额
		income = 0; //收入总金额
		mui.ajax('/api/getBill', {
			data: {
				uid: uid,
				time: t
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(res) {
				if (res.data.length === 0) {
					document.querySelector(".billTils").style.display = "block";
					document.querySelector(".list").style.display = "none";
				} else {
					document.querySelector(".billTils").style.display = "none";
					document.querySelector(".list").style.display = "block";
					var str = '';
					res.data.forEach(function(item) {
						if (item.style == '支出') {
							sum += (item.money) * 1
						} else {
							income += (item.money) * 1
						}
						str +=
							`<li class="mui-table-view-cell li">
									<div class="mui-slider-right mui-disabled">
										<a class="mui-btn mui-btn-red delete" data-id="${item._id}">删除</a>
									</div>
									<div class="mui-slider-handle bill-item">
										<dl>
											<dt>
												<span class="${item.icon}"></span>
											</dt>
											<dd>
												<p class="classify">${item.classify}</p>
												<p>${item.time}</p>
											</dd>
										</dl>
										<span class="${item.style=="支出" ? 'red' : 'green'}">${item.money}</span>
									</div>
								</li>`
					})
					document.querySelector(".list").innerHTML = str;
				}
				document.querySelector(".money").innerHTML = sum; //花费
				document.querySelector(".income").innerHTML = income; //收入

			}
		});
	}

	//判断用户是否登录
	function user() {
		uid = localStorage.getItem("uid");
		if (uid) {
			document.querySelector(".wrapper").style.display = "block"; //显示账单
			document.querySelector(".login").style.display = "none";
			getBill(); //获取账单
		} else {
			document.querySelector(".wrapper").style.display = "none"; //
			document.querySelector(".login").style.display = "block"; //显示登录
		}
	}

	//退出用户登录
	function exit() {
		document.querySelector(".exit").addEventListener("tap", function() {
			// console.log(this);
			mui.confirm('您确定要退出吗？', '提示', ['确认', '取消'], function(e) {
				if (e.index === 0) {
					localStorage.removeItem("uid");
					setTimeout(function() {
						user()
					}, 1000)
				}
			}, 'div')

		})
	}



	function login() {
		document.querySelector(".loginBtn").addEventListener("tap", function() {
			mui.ajax('/api/login', {
				data: {
					username: document.querySelector(".txt").value,
					password: document.querySelector(".pwd").value
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(res) {
					console.log(res);

					//登录不成功 res.msg
					//登录成功 res.name

					if (res.code === 1) {
						localStorage.setItem("uid", res.data.id);
						mui.toast("欢迎 " + res.data.name + "！");
						document.querySelector(".wrapper").style.display = "block";
						document.querySelector(".login").style.display = "none";
						getBill(); //获取账单
					} else if (res.code === 3) {
						mui.toast(res.msg);
						document.querySelector(".wrapper").style.display = "none";
						document.querySelector(".login").style.display = "block";
					}
				}
			});
		})
	}
	//删除账单的点击事件

	function lisClik() {
		//mmon 代码激活
		mui('.list').on('tap', '.delete', function() {
			var _this = this;
			var li = _this.parentNode.parentNode;
			mui.confirm('您确定要删除此账单？', '提示', ['确认', '取消'], function(e) {
				console.log(e.index);
				let id = _this.getAttribute("data-id");
				if (e.index === 0) {
					//删除的接口 ajax 删除dom 节点
					mui.ajax('/api/deltBill', {
						data: {
							id: id
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: function(data) {
							//删除节点
							_this.parentNode.parentNode.remove();
							getBill() //获取一下账单
						}
					});
				} else {
					setTimeout(function() {
						mui.swipeoutClose(li);
					}, 0);

				}

			})
			// console.log(this);
		})
	}
	
	// 跳转添加账单页面
	function addBill(){
		document.querySelector(".fixe").addEventListener("tap",function(){
			location.href = "../html/classify.html"
		})
	}

	init()


})
