
	var map = new BMap.Map("allmap");
	var token = getStorage("appToken");
	var _userMobile = getStorage("userMobile");
	map.centerAndZoom("上海", 11);
	map.enableScrollWheelZoom(true);
	var opts = {
		width : 250,     // 信息窗口宽度
		height: 100,     // 信息窗口高度
		enableMessage:true//设置允许信息窗发送短息
	};
	function bdGEO(){
		map.clearOverlays(); 
		var _start = $("#start").val();
		var _end = $("#end").val();
		
		mui.ajax({
	  		url:basePath+"api/SpecialLine/SpecialLineWhere",
	  		headers:{'Authorization':token},
	  		contentType: "application/json",
	    data: {
	    		Starting_ground: _start,
      		Destination: _end,
	    },
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
	      		var _mapCenter = _start?_start:"上海"
	      		map.centerAndZoom(_mapCenter, 11);
	      		map.enableScrollWheelZoom(true);
	      		getMap(data.data);
		    }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
		
		}
		function getMap(data){
			var myGeo = new BMap.Geocoder();
			for(var i=0;i<data.length;i++){
				geocodeSearch(data[i].Company_address,data[i]);
			}
			
			function geocodeSearch(add,obj){
				myGeo.getPoint(add, function(point){
					if (point) {
						
						var address = new BMap.Point(point.lng, point.lat);
						addMarker(address,obj);
					}
				}, "合肥市");
			}
			// 编写自定义函数,创建标注
			function addMarker(point,obj){
				var content = obj;
				var marker = new BMap.Marker(point);
				map.addOverlay(marker);       // 将标注添加到地图中
				addClickHandler(content,marker);
			}
		
			
		}
	
	function addClickHandler(content,marker){
		marker.addEventListener("click",function(e){
			openInfo(content,e)}
		);
	}
	function openInfo(content,e){
		var p = e.target;
		var _info = '<div class="d-flex flex-column bg-white">'
									+ '<div style="font-size:18px;" class="font-size-18 margin-b-6">'+content.Company+'</div>'
									+ '<div style="font-size:13px;" class="margin-b-2">'+content.Starting_ground+'至'+content.Destination+'专线</div>'
									+ '<div style="font-size:13px;" class="margin-b-2">电话：'+content.Contact_information+'</div>'
									+ '<div style="font-size:13px;">公司地址：'+content.Company_address+'</div>'
								+ '</div>'
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow(_info,opts);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	}
	