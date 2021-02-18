layui.use(['layer', 'jquery'], function() {
	var $ = layui.$,
		layer = layui.layer;

	/^http(s*):\/\//.test(location.href) || layer.alert('请先部署到 localhost 下再访问', {
		icon: 2
	});

	router = layui.router();
	var musicId = router.search.musicId;

	$.ajax({
		url: "https://autumnfish.cn/song/url?id=" + musicId,
		type: "get",
		async: false,
		success: function(response) {
			if (response == null || response == "")
				layer.alert("不可用，请更换关键词", {
					icon: 2
				});
			var song_url = response.data[0].url;
			parent.$('#music_play').attr('src', song_url)
		}
	});
	//获取封面
	$.ajax({
		url: "https://autumnfish.cn/song/detail?ids=" + musicId,
		type: "get",
		async: false,
		success: function(response) {
			var songpic_url = response.songs[0].al.picUrl
			$('#SongPicBig').attr('src', songpic_url);
			$('#SongPicBig').css('animation', 'rotation 45s linear infinite');
			$('#music_title').text(response.songs[0].name);
			$('#musican').text(response.songs[0].ar[0].name);
			$('#zj').text(response.songs[0].al.name);
		}
	});

	//获取歌词
	$.ajax({
		url: "https://autumnfish.cn/lyric?id=" + musicId,
		type: "get",
		async: false,
		success: function(response) {
			var lrcJSON = {};
			var lrcStr = response.lrc.lyric;
			var row = lrcStr.split("\n"); // [00:00.20]词：吴剑中
			var time, lrc, obj;
			for (var i = 0; i < row.length - 1; i++) {
				time = row[i].split(']')[0] + ']';
				lrc = row[i].split(']')[1];
				createJson(lrcJSON, time, lrc);
			}
			console.log(lrcJSON);
			var lrcTime = []; //歌词对应的时间数组
			var ul = parent.$("#lrclist")[0]; //获取ul

			var i = 0;
			$.each(lrcJSON, function(key, value) { //遍历lrc
				lrcTime[i++] = parseFloat(key.substr(1, 3)) * 60 + parseFloat(key.substring(4, 10)); //00:00.000转化为00.000格式
				ul.innerHTML += "<li><p>" + lrcJSON[key] + "</p></li>"; //ul里填充歌词
			});
			lrcTime[lrcTime.length] = lrcTime[lrcTime.length - 1] + 3; //如不另加一个结束时间，到最后歌词滚动不到最后一句


			var $li = parent.$("#lrclist>li"); //获取所有li
			var isLocked = false; //当拖动进度条的时候锁定，防止拖动进度条时audio时间改变出现冲突
			var currentLine = 0; //当前播放到哪一句了
			var currentTime; //当前播放的时间
			var audio = parent.$("#music_play")[0];
			var ppxx; //保存ul的translateY值

			audio.ontimeupdate = function() { //audio时间改变事件
				if (isLocked == false) {
					isLocked = true;
					currentTime = audio.currentTime;
					for (n = -8, len = lrcTime.length; n <= 8; n++) { //将可视部分的所有其他歌词设置为默认
						if (currentLine + n < len - 1) {
							$li.get(currentLine + n).className = "";
							//console.log(" clear" + currentLine + n);

						} else break;
					}

					for (j = 0, len = lrcTime.length; j < len; j++) {

						if (currentTime <= lrcTime[j + 1] && currentTime >= lrcTime[j]) {
							currentLine = j;
							ppxx = 180 - (currentLine * 32); //越大越往上
							ul.style.transform = "translateY(" + ppxx + "px)";

							$li.get(currentLine - 1).className = "";
							//console.log("on" + currentLine);
							$li.get(currentLine).className = "on";
							break;
						}
					}
					isLocked = false;
				}

			};

		}
	});

	
		var audio = $("#music_play")[0];
		audio.onplay = function(){
			$('#SongPicBig').css('animation', 'rotation 45s linear infinite')
		}
		audio.onpause = function(){
			$('#SongPicBig').css("animation","");
		}

	//获取评论
	// $.ajax({
	// 	url: "https://autumnfish.cn/comment/hot?type=0&id=" + musicId,
	// 	type: "get",
	// 	success: function(response) {
	// 		console.log(response.hotComments);

	// 	}
	// })

	// 参数：json = json对象 ，prop = 属性，val = 值
	function createJson(json, prop, val) {
		// 如果 val 被忽略
		if (typeof val === "undefined") {
			// 删除属性
			delete json[prop];
		} else {
			// 添加 或 修改
			json[prop] = val;
		}
	}
});
