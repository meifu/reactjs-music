var React = require('react');

var SideContent = React.createClass({
	loadCategoriesFromServer: function() {
		// console.log('ttt: ' + this.props.url);
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				var categories = [];
				for (var category in data) {
					categories.push(category);
				}
				console.log('cat: ' + categories);
				this.setState({categoryData: categories});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		console.log('this state1 ' + this.props.currentCtg);
		return {categoryData: []};
	},
	componentDidMount: function() {
		console.log('componentDidMount');
		this.loadCategoriesFromServer();
		// setInterval(this.loadCategoriesFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			<div className="side">
				<h2>Categories</h2>
				<Category ctgData={this.state.categoryData} curCtg={this.props.currentCtg} />
			</div>
		);
	}
});

var Category = React.createClass({
	// getInitialState: function() {
		// return {current: 'energetic'}
	// },
	handleClick: function(e) {
		e.preventDefault();
		// this.setState({current: $(e.target).data('ctg')});
		console.log('oooooooo: ' + $(e.target).data('ctg'));
	},
	render: function() {
		console.log('this state2 ' + this.props.curCtg);
		var currentCtgName = this.props.curCtg;
		var listNodes = this.props.ctgData.map(function(ctgName, i){
			// console.log('category render ' + this.state.current);
			if (currentCtgName == ctgName) {
				console.log('current obj found!!!');
				return (
					<li key={i} className="current"><a href="#" data-ctg={ctgName}>
					{ctgName}
					</a></li>
				);
			} else {
				return (
					<li key={i}><a href="#" onClick={this.handleClick} data-ctg={ctgName}>
					{ctgName}
					</a></li>
				);
			}
			
		});
		return (
			<ul onClick={this.handleClick}>
				{listNodes}
			</ul>
		);
	}
});

var MainContent = React.createClass({
	loadArtistsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleNewArtistSubmit: function(newArtist) {
		//submit to the server
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: newArtist,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(data) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadArtistsFromServer();
	},
	render: function() {
		return (
			<div id="mainContent">
				<ArtistBox data={this.state.data} />
				<AddNewArtistForm onAddFormSubmit={this.handleNewArtistSubmit} />
			</div>
		);
	}
});

var ArtistBox = React.createClass({
	render: function() {

		var artistNodes = this.props.data.map(function(artist, i){
			return (
				<div className="artistBox" key={i}>
					<p className="artistName">{artist.name}</p>
					<p className="trackName">{artist.track}</p>
					<ArtistTracks trackYtb={artist.youtube} />
				</div>
			);
		});
		return (
			<div>
			{artistNodes}
			</div>
		);
	}
});

var ArtistTracks = React.createClass({
	render: function() {
		var youtubeLink = "http://www.youtube.com/apiplayer?video_id=" + this.props.trackYtb + "&version=3";
		return (
			<div>
				<iframe width="560" height="315" src={youtubeLink} frameBorder="0" allowFullScreen></iframe>
			</div>
		);
	}
});

var AddNewArtistForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var name = this.refs.artistName.getDOMNode().value.trim();
		// var pic = this.refs.artistPic.getDOMNode().value.trim();
		var pic = "http://placehold.it/350x150";
		var track = this.refs.artistTrack.getDOMNode().value.trim();
		if (!name) {
			return;
		}
		// send request to the server
		this.props.onAddFormSubmit({name: name, pic: pic, tracks: [track]});

		this.refs.artistName.getDOMNode().value = '';
		this.refs.artistPic.getDOMNode().value = '';
		this.refs.artistTrack.getDOMNode().value = '';
		return;
	},
	render: function() {
		return (
			<form className="" onSubmit={this.handleSubmit}>
				<label htmlFor="artistName">Artist Name</label>
				<input type="text" id="artistName" ref="artistName" /><br/>
				<label htmlFor="ytbId">youtube id:</label>
				<input type="text" id="ytbId" ref="trackId" /><br/>
				<label>Track Name:</label>
				<input type="text" ref="artistTrack" /><br/>
				<input type="submit" value="Post" />
			</form>
		)
	}
});

var OutWrap = React.createClass({
	getInitialState: function() {
		return ({current: 'energetic'})
	},
	render: function() {
		return (
			<div>
				<SideContent url="_musicData.json" pollInterval={2000} currentCtg={this.state.current} />
				<MainContent url="_energetic_artistBox.json" />
			</div>
		)
	}
});

// React.renderComponent(
// 	<SideContent url="categories.json" pollInterval={2000} />,
// 	document.getElementById('aside')
// );

// React.renderComponent(
// 	<MainContent url="energetic_artistBox.json" />,
// 	document.getElementById('mainContent')
// );

React.render(
	<OutWrap />,
	document.getElementById('outerWrap')
);