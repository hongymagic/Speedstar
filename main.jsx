var React           = require('react');
var PlaybackControl = require('./src/PlaybackControl.jsx');
var $               = require('jquery');

console.log('Speedstar extension loaded');

$(function () {
	console.log('Speedstar extension running');
	var observer;

	// Render playback controls on to the document, in a given container.
	function initialise(container, video) {
		var $container = $(container);
		var $video     = $(video);

		React.render(
			<PlaybackControl video={video} />,
			container,
			function () {
				setTimeout(function () {
					$container
						.offset($video.offset())
						.css({
							'zIndex': 1000
						});
				}, 3000);
			}
		);
	}

	function check() {
		var video = $('video');
		var container;

		if (video.length > 0 && observer) {
			observer.disconnect();

			// Create a React container element in the document
			container = document.createElement('div');
			container.id = 'nps-container';
			$('body').append(container);

			initialise(container, video.get(0));
		}
	}

	// Observe any DOM mutations and detect perfect condition for playback
	// controls to load.
	observer = new MutationObserver(check);
	observer.observe(document.body, {
		childList: true,
		attributes: false,
		characterData: false,
		subtree: true,
		attributeOldValue: false,
		characterDataOldValue: false
	});
});
