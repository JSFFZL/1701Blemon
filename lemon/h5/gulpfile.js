var gulp = require("gulp");

var webserver = require("gulp-webserver");


gulp.task("ser",function(){
	return gulp.src("./src/")
	.pipe(webserver({
		open:true,
		port:8089,
		livereload:true,
		proxies:[
			{source:"/api/login",target:"http://localhost:3000/api/login"},
			{source:"/api/getBill",target:"http://localhost:3000/api/getBill"},
			{source:"/api/deltBill",target:"http://localhost:3000/api/deltBill"},
			{source:"/api/getClass",target:"http://localhost:3000/api/getClass"}
		]
	}))
})