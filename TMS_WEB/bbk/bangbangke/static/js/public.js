var basePath = "http://115.230.126.83:8082/";
		basePath = "http://211.144.92.199:8081/";
		basePath = "http://192.168.1.112:8089/";
		 basePath = "https://bbk.benchensoft.com/";

function getCode(){
	
}

//得到时间组合
function getDateTime(nTypeFlag,dateStr) {
	var tNowTime = dateStr?new Date(dateStr):new Date();
	var myYear = ';' + tNowTime.getFullYear() + ';';
	var myMonth = ';' + (tNowTime.getMonth() + 1 - 0) + ';';
	var myDay = ';' + tNowTime.getDate() + ';';
	var myHour = ';' + tNowTime.getHours() + ';';
	var myMinu = ';' + tNowTime.getMinutes() + ';';
	var mySecond = ';' + tNowTime.getSeconds() + ';';
	var myWeek = tNowTime.getDay();
	if(myMonth.length < 4) myMonth = '0' + myMonth;
	if(myDay.length < 4) myDay = '0' + myDay;
	if(myHour.length < 4) myHour = '0' + myHour;
	if(myMinu.length < 4) myMinu = '0' + myMinu;
	if(mySecond.length < 4) mySecond = '0' + mySecond;

	var cNewTimeStr;
	switch(nTypeFlag) {
		case 0:
			cNewTimeStr = myYear + '-' + myMonth + '-' + myDay;
			break;
		case 1:
			cNewTimeStr = myYear + myMonth + myDay;
			break;
		case 2:
			cNewTimeStr = myHour + ':' + myMinu + ':' + mySecond;
			break;
		case 3:
			cNewTimeStr = myHour + myMinu + mySecond;
			break;
		case 4:
			cNewTimeStr = myYear + myMonth + myDay + myHour + myMinu + mySecond;
			break;
		case 5:
			cNewTimeStr = myYear + '年' + myMonth + '月' + myDay + '日';
			break;
		case 6:
			cNewTimeStr = myYear;
			break;
		case 7:
			cNewTimeStr = myYear + '-' + myMonth;
			break;
		case 8: //得到上一个月的今天
			var date = getDateTime(0);
			var arr = date.split('-');
			var year = arr[0]; //获取当前日期的年份
			var month = arr[1]; //获取当前日期的月份
			var day = arr[2]; //获取当前日期的日
			var days = new Date(year, month, 0);
			days = days.getDate(); //获取当前日期中月的天数
			var year2 = year;
			var month2 = parseInt(month) - 1;
			if(month2 == 0) {
				year2 = parseInt(year2) - 1;
				month2 = 12;
			}
			var day2 = day;
			var days2 = new Date(year2, month2, 0);
			days2 = days2.getDate();
			if(day2 > days2) {
				day2 = days2;
			}
			if(month2 < 10) {
				month2 = '0' + month2;
			}
			cNewTimeStr = year2 + '-' + month2 + '-' + day2;
			break;
		case 9: //得到下一个月的今天
			var date = getDateTime(0);
			var arr = date.split('-');
			var year = arr[0]; //获取当前日期的年份
			var month = arr[1]; //获取当前日期的月份
			var day = arr[2]; //获取当前日期的日
			var days = new Date(year, month, 0);
			days = days.getDate(); //获取当前日期中的月的天数
			var year2 = year;
			var month2 = parseInt(month) + 1;
			if(month2 == 13) {
				year2 = parseInt(year2) + 1;
				month2 = 1;
			}
			var day2 = day;
			var days2 = new Date(year2, month2, 0);
			days2 = days2.getDate();
			if(day2 > days2) {
				day2 = days2;
			}
			if(month2 < 10) {
				month2 = '0' + month2;
			}

			var t2 = year2 + '-' + month2 + '-' + day2;
			return t2;
			break;
		case 10: //昨日日期
			//获取前一天日期
			return before(getDateTime(0));

			function before(d) {
				d = new Date(d);
				d = +d - 10006060 / 3 * 24;
				d = new Date(d);
				//return d;
				//格式化
				var year = ";" + d.getFullYear() + ";";
				var month = ";" + (d.getMonth() + 0 + 1) + ";";
				var day = ";" + d.getDate() + ";";
				if(year.length < 4) {
					year = "0" + year;
				}
				if(month.length < 4) {
					month = "0" + month;
				}
				if(day.length < 4) {
					day = "0" + day;
				}
				var datestr = year + "-" + month + "-" + day;
				datestr = datestr.replace(/;/g, "");
				return datestr;

			}
			break;
		case 11: //明日日期
			//获取后一天日期
			return after(getDateTime(0));

			function after(d) {
				d = new Date(d);
				d = +d + 10006060 / 3 * 24;
				d = new Date(d);
				//return d;
				//格式化
				var year = ";" + d.getFullYear() + ";";
				var month = ";" + (d.getMonth() + 0 + 1) + ";";
				var day = ";" + d.getDate() + ";";
				if(year.length < 4) {
					year = "0" + year;
				}
				if(month.length < 4) {
					month = "0" + month;
				}
				if(day.length < 4) {
					day = "0" + day;
				}
				var datestr = year + "-" + month + "-" + day;
				datestr = datestr.replace(/;/g, "");
				return datestr;
				// return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();

			}

			break;
		case 12: //本周起始日期
			return getWeekStartDate()

			function getWeekStartDate() {
				var now = new Date(); //当前日期
				var nowDayOfWeek = now.getDay(); //今天本周的第几天
				var nowDay = now.getDate(); //当前日
				var nowMonth = now.getMonth(); //当前月
				var nowYear = now.getYear(); //当前年
				nowYear += (nowYear < 2000) ? 1900 : 0; //

				var lastMonthDate = new Date(); //上月日期
				lastMonthDate.setDate(1);
				lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
				var lastYear = lastMonthDate.getYear();
				var lastMonth = lastMonthDate.getMonth();

				var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
				return formatDate(weekStartDate);
			}

			break;
		case 13: //本周结束日期
			return getWeekEndDate()

			function getWeekEndDate() {
				var now = new Date(); //当前日期
				var nowDayOfWeek = now.getDay(); //今天本周的第几天
				var nowDay = now.getDate(); //当前日
				var nowMonth = now.getMonth(); //当前月
				var nowYear = now.getYear(); //当前年
				nowYear += (nowYear < 2000) ? 1900 : 0; //

				var lastMonthDate = new Date(); //上月日期
				lastMonthDate.setDate(1);
				lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
				var lastYear = lastMonthDate.getYear();
				var lastMonth = lastMonthDate.getMonth();
				var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
				return formatDate(weekEndDate);
			}

			break;
		case 14: //本月开始日期
			return getMonthStartDate()

			function getMonthStartDate() {
				var now = new Date(); //当前日期
				var nowDayOfWeek = now.getDay(); //今天本周的第几天
				var nowDay = now.getDate(); //当前日
				var nowMonth = now.getMonth(); //当前月
				var nowYear = now.getYear(); //当前年
				nowYear += (nowYear < 2000) ? 1900 : 0; //

				var lastMonthDate = new Date(); //上月日期
				lastMonthDate.setDate(1);
				lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
				var lastYear = lastMonthDate.getYear();
				var lastMonth = lastMonthDate.getMonth();
				var monthStartDate = new Date(nowYear, nowMonth, 1);
				return formatDate(monthStartDate);
			}

			break;

		case 15: //本月结束日期
			return getMonthEndDate();

			function getMonthEndDate() {
				var now = new Date(); //当前日期
				var nowDayOfWeek = now.getDay(); //今天本周的第几天
				var nowDay = now.getDate(); //当前日
				var nowMonth = now.getMonth(); //当前月
				var nowYear = now.getYear(); //当前年
				nowYear += (nowYear < 2000) ? 1900 : 0; //

				var lastMonthDate = new Date(); //上月日期
				lastMonthDate.setDate(1);
				lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
				var lastYear = lastMonthDate.getYear();
				var lastMonth = lastMonthDate.getMonth();
				//获得某月的天数
				function getMonthDays(myMonth) {
					var monthStartDate = new Date(nowYear, myMonth, 1);
					var monthEndDate = new Date(nowYear, myMonth + 1, 1);
					var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
					return days;
				}
				var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
				return formatDate(monthEndDate);
			}

			break;
		case 16:
			cNewTimeStr = myYear + '/' + myMonth + '/' + myDay + ' ' + myHour + ':' + myMinu + ':' + mySecond;
			break;
		case 17:
			cNewTimeStr = myYear + '/' + myMonth + '/' + myDay;
			break;
		case 18:
			cNewTimeStr = getWeek(myWeek);
			function getWeek(num){
				switch (num){
					case 0:
						return "星期日";
						break;
					case 1:
						return "星期一";
						break;
					case 2:
						return "星期二";
						break;
					case 3:
						return "星期三";
						break;
					case 4:
						return "星期四";
						break;
					case 5:
						return "星期五";
						break;
					case 6:
						return "星期六";
						break;
					default:
						return "";
						break;
				}
			}
			break;
		case 19:
			cNewTimeStr = myMonth + '/' + myDay;
			break;
		default:
			cNewTimeStr = myYear + '/' + myMonth + '/' + myDay + ' ' + myHour + ':' + myMinu + ':' + mySecond;
			break;
	}
	function formatDate(date) {
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();

		if(mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if(myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		return(myyear + "-" + mymonth + "-" + myweekday);
	}
	cNewTimeStr = cNewTimeStr.replace(/;/g, "");

	return cNewTimeStr;
}
//case 12,13的规整函数

//设置字符串类型的本地缓存
function setStorage(objName, objValue) {
	var sto = window.localStorage;
	if(sto)
		sto.setItem(objName, objValue);
}
//读取字符串类型的本地缓存
function getStorage(objName) {
	var ret = '';
	var sto = window.localStorage;
	if(sto)
		ret = sto.getItem(objName);
	return ret;
}

//清除本地缓存，如没指定名称则为清空所有缓存
function clearStorage(objName) {
	var sto = window.localStorage;
	if(sto) {
		if(objName)
			sto.removeItem(objName);
		else
			sto.clear();
	}
}
//设置Json类型的本地缓存
function setStorJson(objName, json) {
	if(json)
		setStorage(objName, JSON.stringify(json));
}
//读取Json类型的本地缓存
function getStorJson(objName) {
	var ret = null;
	var str = getStorage(objName);
	if(str)
		ret = JSON.parse(str);
	return ret;
}
// 从URL上获得参数
function getPar(par) {
	//获取当前URL
	var local_url = document.location.href;
	local_url = decodeURI(local_url);
	//获取要取得的get参数位置
	var get = local_url.indexOf(par + "=");
	if(get == -1) {
		return "";
	}
	//截取字符串
	var get_par = local_url.slice(par.length + get + 1);
	//判断截取后的字符串是否还有其他get参数
	var nextPar = get_par.indexOf("&");
	if(nextPar != -1) {
		get_par = get_par.slice(0, nextPar);
	}
	return get_par;
}
function getDateJson(){
 		var _json = [];
 		var _today = new Date();
 		var _year = _today.getFullYear();
 		var _month = _today.getMonth() + 1;
    var _day = _today.getDate();
    var _hour = _today.getHours();
    for(var i=0;i<3;i++){
    		var _yearJson = {
    			"name":(parseInt(_year)+i)+"年",
				"value":(parseInt(_year)+i),
				"child":[]
    		}
    		_json.push(_yearJson);
    		if(i==0){
    			for(var j=_month;j<13;j++){
	    			var _monthJson = {
		    			"name":(j<10)?("0"+j+"月"):(j+"月"),
						"value":(j<10)?("0"+j):j,
						"child":[]
		    		}
		    		_json[i].child.push(_monthJson);
		    		var _dayNum = getDaysInOneMonth((parseInt(_year)+i),j);
		    		if(j==_month){
		    			for(var m=_day;m<_dayNum+1;m++){
			    			var _dayJson = {
				    			"name":(m<10)?("0"+m+"日"):(m+"日"),
								"value":(m<10)?("0"+m):m,
								"child":[]
				    		}
			    			_json[i].child[j-_month].child.push(_dayJson);
			    			if(m==_day){
			    				for(var n=_hour;n<24;n++){
					    			var _hourJson = {
						    			"name":(n<10)?("0"+n+"时"):(n+"时"),
										"value":(n<10)?("0"+n+""):(n+"")
						    		}
					    			_json[i].child[j-_month].child[m-_day].child.push(_hourJson);
					    		}
			    			}else{
			    				for(var n=0;n<24;n++){
					    			var _hourJson = {
						    			"name":(n<10)?("0"+n+"时"):(n+"时"),
										"value":(n<10)?("0"+n+""):(n+"")
						    		}
					    			_json[i].child[j-_month].child[m-_day].child.push(_hourJson);
					    		}
			    			}
			    			
			    		}
		    		}else{
		    			for(var m=1;m<_dayNum+1;m++){
			    			var _dayJson = {
				    			"name":(m<10)?("0"+m+"日"):(m+"日"),
								"value":(m<10)?("0"+m):m,
								"child":[]
				    		}
			    			_json[i].child[j-_month].child.push(_dayJson);
			    			for(var n=0;n<24;n++){
				    			var _hourJson = {
					    			"name":(n<10)?("0"+n+"时"):(n+"时"),
									"value":(n<10)?("0"+n+""):(n+"")
					    		}
				    			_json[i].child[j-_month].child[m-1].child.push(_hourJson);
				    		}
			    		}
		    		}
		    		
	    		}
    		}else{
    			for(var j=1;j<13;j++){
	    			var _monthJson = {
		    			"name":(j<10)?("0"+j+"月"):(j+"月"),
						"value":(j<10)?("0"+j):j,
						"child":[]
		    		}
		    		_json[i].child.push(_monthJson);
		    		var _dayNum = getDaysInOneMonth((parseInt(_year)+i),j);
		    		for(var m=1;m<_dayNum+1;m++){
		    			var _dayJson = {
			    			"name":(m<10)?("0"+m+"日"):(m+"日"),
							"value":(m<10)?("0"+m):m,
							"child":[]
			    		}
		    			_json[i].child[j-1].child.push(_dayJson);
		    			for(var n=0;n<24;n++){
			    			var _hourJson = {
				    			"name":(n<10)?("0"+n+"时"):(n+"时"),
								"value":(n<10)?("0"+n+""):(n+"")
				    		}
			    			_json[i].child[j-1].child[m-1].child.push(_hourJson);
			    		}
		    		}
	    		}
    		}
    		
    		
    }
    return _json;
 	}
 	function getDaysInOneMonth(year, month){  
	  month = parseInt(month, 10);  
	  var d= new Date(year, month, 0);  
	  return d.getDate();  
	}