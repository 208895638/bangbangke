$(function(){
	//显示密码
	$("#showPassword").on("click",function(){
		if($("#password").attr("type")=="password"){
			$("#password").attr("type","text");
			$("#showPassword").css("background-position","-1.41rem 0.02rem");
		}else{
			$("#password").attr("type","password");
			$("#showPassword").css("background-position","-1.15rem 0.02rem");
		}
	});
	
	//登录
	$("#login").on("click",function(){
		//手机号正则
		var reg = /^1[3|4|5|7|8][0-9]{9}$/;
		var phoneNum = $("#phone").val();
		var passwordNum = $("#password").val();
		var phoneReg = reg.test(phoneNum);
		if(!phoneNum){
			alert("手机号不能为空");
			return false;
		}
		if(!phoneReg){
			alert("手机号格式有误");
			return false;
		}
		if(!passwordNum){
			alert("密码不能为空");
			return false;
		}
		mui.ajax({
	  		url:basePath+'api/User/Login',
	    data: {
	    		phone: phoneNum,
			  password: passwordNum,
	    },
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	      if(data.code=="200"){
	      		setStorage("appToken",data.data.token);
	      		setStorage("userMobile",data.data.mobile);
		      	mui.openWindow({
						url:'../home/home.html'
					});
	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
	});
	
	//忘记密码
	$("#forget").on("click",function(){
		mui.openWindow({
			url:'../forgetPassword/forgetPassword.html'
		});
	});
	//注册
	$("#register").on("click",function(){
		mui.openWindow({
			url:'../register/register.html'
		});
	});
	
})
