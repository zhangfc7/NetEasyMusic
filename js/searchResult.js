layui.use(['layer', 'jquery', 'table','util'], function() {
	var $ = layui.$,
		layer = layui.layer,
		table = layui.table,
		util = layui.util;
	/^http(s*):\/\//.test(location.href) || layer.alert('请先部署到 localhost 下再访问', {
		icon: 2
	});
	router = layui.router();
	var keyword = router.search.keyword;
	$('title').text('网易云音乐-搜索结果');
	//第一个实例
	table.render({
		elem: '#demo',
		height: 600,
		url: 'https://autumnfish.cn/search?keywords=' + keyword,
		parseData: function(res) { //res 即为原始返回的数据
			return {
				"code": 0, //解析接口状态
				"msg": res.message, //解析提示文本
				"count": res.result.songCount, //解析数据长度
				"data": res.result.songs //解析数据列表
			};
		},
		page: true,
		cols: [
			[{
					field: 'id',
					title: 'ID',
					width: 150,
				},
				{
					field: 'name',
					title: '音乐标题',
					width: 300
				},
				{
					templet: function(d) {
						return d.artists[0].name
					},
					title: '歌手',
					width: 300
				},
				{
					templet: function(d) {
						return d.album.name
					},
					title: '专辑',
					width: 300
				},
				{
					templet: function(d) {
						var timestamp = d.album.publishTime;
						return util.toDateString(timestamp,'yyyy-MM-dd')
					},
					title: '时间',
					sort : true,
					width: 300
				}
			]
		]
	});

	//监听行单击事件
	table.on('row(test)', function(obj) {
		var musicId = obj.data.id
		window.open("play.html#/musicId="+musicId);
		
	});
});
