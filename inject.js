(function (){
  if(location.pathname === '/BSWeb/'){
	const labelCm=document.createElement("label");
	labelCm.setAttribute("id", "labelCm");
	labelCm.setAttribute("class", "mt-1 mb-0 h6");
	document.querySelector("a[onclick]").before(labelCm);

	const strongCm=document.createElement("strong");
	strongCm.innerHTML = "容許值(公分)：";
	strongCm.setAttribute("id", "strongCm");
	document.querySelector("#labelCm").appendChild(strongCm);

	const inputCm=document.createElement("input");
	inputCm.setAttribute("type", "text");
	inputCm.setAttribute("class", "form-control border-form mt-1 mb-0 shadow-sm bg-fef1e4 mr-1");
	inputCm.setAttribute("id", "inputCm");
	inputCm.setAttribute("size", "2.5");
	inputCm.value = 1;
	document.querySelector("a[onclick]").before(inputCm);

	document.querySelector("#landno").setAttribute("size", "5");

	const btnCalculate=document.createElement("button");
	btnCalculate.onclick=function(event){
		event.preventDefault();
		var erro_msg='';
		var resSplit;
		$('#point_stext').show();
		var city=$('#city').find('option:selected').val();
		var town=$('#town').find('option:selected').val();
		var sect=$('#sect').find('option:selected').val();
		var city_name=$('#city').find('option:selected').text();
		var town_name=$('#town').find('option:selected').text();
		var sect_name=	 $('#sect').find('option:selected').text();
		var landno=$('#landno').val();
		var inputCm=$('#inputCm').val();
		
		if(city==''){
			alert('請選擇縣市');
			return;
		}
		if(town==''){
			alert('請選擇鄉鎮市區');
			return;
		}
		if(sect==''){
			alert('請選擇地段');
			return;
		}
		if(landno==''){
			alert('請輸入地號');
			return;
		}
		if( isNaN(inputCm) ){
			alert('容許值請輸入數字');
			return;
		}

		var url='https://easymap.land.moi.gov.tw/BSWeb/GetData_getParcelData';
		   $.ajax( {
			   	type : "POST",
				data:{type:'1',city:city,town:town,sectno:sect,landno:landno,city_name:city_name,town_name:town_name,sect_name:sect_name},
				// data:{type:'1',city:'B',town:'B24',sectno:'9109',landno:'1351',city_name:'臺中市',town_name:'大肚區',sect_name:'文昌段'},
			   	url: url,
			   	error : function(xhr) {
					//    hideSendMsg();
					alert('取得資料錯誤');
				},
				beforeSend : function() {
					erro_msg='';
					$.blockUI({ 
						message: $("<h4 style='text-align:center'><img src='images/loading.gif' /> <br/>'查詢中...'</h4>"), 
						css: { 
							top:  ($(window).height()) /2 + 'px', 
							left: ($(window).width()) /2 + 'px', 
							width: 'auto',
							color: '#F00000',
							background: 'none',
							border:'0px',
							opacity: 0.7
						},
						overlayCSS:  { 
							backgroundColor: 'rgb(236, 236, 236)', 
							opacity:         0.4, 
							cursor:          'wait' 
						} 				 
					});
				},
				success : function(response) {
					$.unblockUI();
					resSplit = response.split("//把所有點位加入陣列做新增，刪減操作");
					response = resSplit[0]
						+`var StraigtPointAttr = []; 
						var StraigtPointXY = [];
						var PointXY = [];
						var InOrderPointXY = [];
						var Cadastral_features = Cadastral_source.getFeatures();

					
						Cadastral_features.forEach( (f)=>{
							// console.log(f.get('ATTR')+'--'+f.getGeometry().getCoordinates()[0]+','+f.getGeometry().getCoordinates()[1]);
							PointXY.push(f.getGeometry().getCoordinates()[0]+','+f.getGeometry().getCoordinates()[1]);
						});

						map_Cadastral_source.getFeatures().forEach( (f)=>{
							if( f.get("COLOR") == "true" ){
								f.getGeometry().getCoordinates().forEach( (f2)=>{									
									InOrderPointXY[InOrderPointXY.length] = f2.filter( (val) => PointXY.includes( val[0]+','+val[1] ));
								});
							}
						});
						// console.log(InOrderPointXY);
						StraigtPointXYPush();
						var  createTextStyle2 = function(feature, resolution) {
							let fontColor = StraigtPointAttr.includes( feature.get('ATTR'))==true ? '#FF0000' : '#000000'; 
							var align = 'center';
							var baseline = 'middle';
							var offsetX = 0;var offsetY = -18;
							var weight = 'normal';
							var rotation = 0.0;
							var font = weight + ' ' + t_size2 + ' ' + 'Arial';
							var fillColor = 'black';
							var outlineColor = '#ffffff';
							var outlineWidth = 3;
							t_text2=s_text2==true?getText(feature, resolution):'';
							return new ol.style.Text({
								textAlign: align,textBaseline: baseline,
								font: font,text: t_text2,
								fill: new ol.style.Fill({color: fontColor }),
								stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
								offsetX: offsetX,
								offsetY: offsetY,
								rotation: rotation
							});
						};
						var CadastralStyleSelectFunction = function(feature, resolution) {
							return new ol.style.Style({
								image: icon,
								text: createTextStyle2(feature, resolution)
							});
						};
						var CadastralStyleUNSelectFunction = function(feature, resolution) {
							return new ol.style.Style({
								image: icon2,
								text: createTextStyle2(feature, resolution)
							});
						};
						Cadastral_features.forEach( (f)=>{
							if( StraigtPointXY.includes( (f.getGeometry().getCoordinates()[0]+','+f.getGeometry().getCoordinates()[1])) ){
								StraigtPointAttr.push(f?.get('ATTR'));
							}
							f.setStyle(CadastralStyleSelectFunction(f));
							send_point.push(f.get("ATTR"));
						});
						if(document.getElementById("btnRecover") != null){
							document.getElementById("btnRecover").remove();
						}
						const btnRecover=document.createElement("button");
						btnRecover.onclick=function(event){
							event.preventDefault();
							if( isNaN($('#inputCm').val()) ){
								alert('容許值請輸入數字');
								return;
							}
							StraigtPointXYPush();
							Cadastral_features.forEach( (f)=>{
								if( StraigtPointXY.includes( (f.getGeometry().getCoordinates()[0]+','+f.getGeometry().getCoordinates()[1])) ){
									StraigtPointAttr.push(f?.get('ATTR'));
								}
								if( send_point.includes( f.get("ATTR") ) ){
									f.setStyle( CadastralStyleSelectFunction(f) );
								}else{
									f.setStyle( CadastralStyleUNSelectFunction(f) );
								}
							});
						};
						btnRecover.innerHTML = "分歧點上色";
						btnRecover.setAttribute("class", "mt-1 mb-0 btn-c btn-outline-secondary border shadow-sm bg-FC905B");
						btnRecover.setAttribute("id", "btnRecover");
						btnRecover.setAttribute("style", "cursor: pointer;");
						document.querySelector("a").before(btnRecover);

						// document.querySelectorAll("div.clean-layer.ol-unselectable.ol-control")[1].removeEventListener('click', clean_layer_tool);
						// console.log(map.removeControl(mapExport_ctl));
						// console.log(document.querySelectorAll("div.clean-layer.ol-unselectable.ol-control"));

						function base_height(val,pre,next){
							let dx = next[0] - pre[0];
							let dy = next[1] - pre[1];
							let cross = Math.abs( dx * (val[1] - pre[1]) - dy * (val[0] - pre[0]) );
							return cross / Math.sqrt(dx*dx + dy*dy);
						}

						function StraigtPointXYPush(){
							StraigtPointXY = [];
							StraigtPointAttr = [];
							InOrderPointXY.forEach( (PolyPoint) =>{
								console.log(PolyPoint);
								PolyPoint.forEach(	(val, idx, array) =>{
									let pre = array[idx-1] || array[array.length - idx - 2];
									let next = array[idx+1] || array[1];
									// console.log(pre+'---'+val+'---'+next);
									if( base_height(val,pre,next) < ( $('#inputCm').val()/100 ) ){
										StraigtPointXY.push(val[0]+','+val[1]);
									}
								});
							});
						}`
						+resSplit[2];

					//    console.log(response);
					$("#div_result").html(response);
					if(erro_msg!=''){
						setTimeout("alert(erro_msg);",500);
						alert(erro_msg);
					}
					
				}
		   });

	};
	btnCalculate.innerHTML = "鑑界複丈規費試算";
	btnCalculate.setAttribute("class", "mt-1 mb-0 btn-c btn-outline-secondary border shadow-sm bg-FC905B");
	btnCalculate.setAttribute("style", "cursor: pointer;");
	
	document.querySelector("a[onclick]").before(btnCalculate);
	document.querySelector("a[onclick]").setAttribute("hidden", true);
  }
}());


