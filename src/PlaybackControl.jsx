var React = require('react/addons');
var cx    = React.addons.classSet;

var PlaybackControl;
module.exports = PlaybackControl = React.createClass({
	displayName: 'PlaybackControl',

	statics: {
		rates: [0.5, 1, 1.25, 1.5, 2, 4, 8]
	},

	propTypes: {
		delay: React.PropTypes.number,
		video: function (props, name) {
			if (!(props[name] instanceof HTMLVideoElement)) {
				return new Error('Expected a video element as video property.');
			}
		}
	},

	getDefaultProps: function () {
		return {
			delay: 3500
		};
	},

	getInitialState: function () {
		return {
			rate: this.props.video.playbackRate || 1,
			hidden: false,
			timeoutId: undefined
		};
	},

	componentDidMount: function () {
		// When mouse move is detected, show the controls then wait 3 seconds
		// before hiding it again
		window.addEventListener('mousemove', this.onMouseMove);

		// Run it on startup
		this.queueDisappearance();
	},

	componentWillUnmount: function () {
		window.removeEventListener('mousemove', this.onMouseMove);
	},

	getControlClassSet: function () {
		return cx({
			hidden: this.state.hidden
		});
	},

	queueDisappearance: function () {
		if (this.state.timeoutId) {
			clearTimeout(this.state.timeoutId);
		}

		this.state.timeoutId = setTimeout(function () {
			this.setState({ hidden: true });
		}.bind(this), this.props.delay);
	},

	onMouseMove: function () {
		this.setState({ hidden: false }, this.queueDisappearance);
	},

	onChangeRate: function (rate, event) {
		this.setState({ rate: rate }, function () {
			this.props.video.playbackRate = rate;
		}.bind(this));
	},

	render: function () {
		var controls = PlaybackControl.rates.map(function (rate) {
			var props = {
				key: ['rate', rate].join(),
				disabled: rate === this.state.rate,
				onClick: this.onChangeRate.bind(this, rate)
			};

			return (
				<button {...props}>
					{'x' + rate}
				</button>
			);
		}.bind(this));

		return (
			<nav id='nps-controls' className={this.getControlClassSet()}>
				{controls}
			</nav>
		);
	}
});