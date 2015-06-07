define(function (require) {
	require('lib/jquery/jquery-2.1.3.min');
	require([
		'lib/json2',
		'lib/bootstrap.min',
		'lib/qrcode.min'
	]);
	
	window.ko = require('lib/knockout-min');
	window.io = require('lib/socket.io');
    window.purl = require('lib/purl');
    
	require([
		'./scripts/app/Util',
		'./scripts/app/Config',
		'./scripts/app/Logger',
		'./scripts/app/SocketProxy',
		'./scripts/app/PlayerModel',
		'./scripts/app/GameViewStateMachine',
		'./scripts/app/GameViewModel',
		'./scripts/app/BoardGameMain'
	]);
});