$(function(){
	//显示密码1
	$("#showPassword1").on("click",function(){
		if($("#password1").attr("type")=="password"){
			$("#password1").attr("type","text");
			$("#showPassword1").css("background-position","-1.41rem 0.02rem");
		}else{
			$("#password1").attr("type","password");
			$("#showPassword1").css("background-position","-1.15rem 0.02rem");
		}
	});
	//显示密码2
	$("#showPassword2").on("click",function(){
		if($("#password2").attr("type")=="password"){
			$("#password2").attr("type","text");
			$("#showPassword2").css("background-position","-1.41rem 0.02rem");
		}else{
			$("#password2").attr("type","password");
			$("#showPassword2").css("background-position","-1.15rem 0.02rem");
		}
	});
	
	//获取验证码
	$("#code").on("click",function(){
		var disabled = $("#code").attr("disabled");
		var countdown=60;  
    var _generate_code = $("#code");
    if(disabled=="true"){  
      return false;  
    }
    //手机号正则
		var reg = /^1[3|4|5|7|8][0-9]{9}$/;
		var phoneNum = $("#phone").val();
		var phoneReg = reg.test(phoneNum);
		if(!phoneNum){
			alert("手机号不能为空");
			return false;
		}
		if(!phoneReg){
			alert("手机号格式有误");
			return false;
		}
    mui.ajax({
	  		url:basePath+'api/User/VerificationCode',
//	  		headers:{'Authorization':'zhaojianzhoajian'},
	    data: {
	    		phone: phoneNum,
			  type: "2",
	    },
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      settime();
	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
    function settime() {  
      if (countdown == 0) {
      		_generate_code.attr("disabled",false);
        _generate_code.text("重新获取");  
        countdown = 60;  
        return false;  
      } else { 
      		_generate_code.attr("disabled",true);
        _generate_code.text("重新发送(" + countdown + ")");  
        countdown--;  
      }  
      setTimeout(function() {  
        settime();  
      },1000);  
    }
	});
	
	//更换密码
	$("#submit").on("click",function(){
		//手机号正则
		var reg = /^1[3|4|5|7|8][0-9]{9}$/;
		var phoneNum = $("#phone").val();
		var passwordNum1 = $("#password1").val();
		var passwordNum2 = $("#password2").val();
		var phoneReg = reg.test(phoneNum);
		var codeNum = $("#codeNum").val();
		
		if(!phoneNum){
			alert("手机号不能为空");
			return false;
		}
		if(!phoneReg){
			alert("手机号格式有误");
			return false;
		}
		if(!codeNum){
			alert("验证码不能为空");
			return false;
		}
		if(!passwordNum1){
			alert("新密码不能为空");
			return false;
		}
		if(!passwordNum2){
			alert("确认密码不能为空");
			return false;
		}
		if(passwordNum1!=passwordNum2){
			alert("密码不一致");
			return false;
		}
		mui.ajax({
	  		url:basePath+'api/User/ForgotPassword',
	    data: {
	    		phone: phoneNum,
			  password: passwordNum1,
			  verificationCode:codeNum
	    },
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      alert("重置成功");
		      	mui.openWindow({
						url:'../login/login.html'
					});
	      }else{
	      	alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
	})
});
