/** @jsx React.DOM */

var SideContent = React.createClass({
	loadCategoriesFromServer: function() {
		console.log('ttt: ' + this.props.url);
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({categoryData: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {categoryData: [], current: 'energetic'};
	},
	componentDidMount: function() {
		this.loadCategoriesFromServer();
		// setInterval(this.loadCategoriesFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			// <div className={this.state.current}>
			<div className="side">
				<h2>Categories</h2>
				<ul className={this.state.current}>
					{this.state.categoryData.map(function(ctg){
						return <Category key={ctg.id} ctgData={ctg} />;
					})}
				</ul>
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
		this.setState({current: $(e.target).data('ctg')});
		console.log('test: ' + $(e.target).data('ctg'));
	},
	render: function() {

		// var listNodes = this.props.ctgData.map(function(ctgName, i){
			// console.log('category render ' + this.state.current);
			return (
				<li><a href="#" onClick={this.handleClick} data-ctg={this.props.ctgData}>
				{this.props.ctgData}
				</a></li>
			// );
		// }.bind(this)); //要加這個bind(this)才有用噢!!!
		// return (
			// <ul className={this.state.current}>
			// <ul>
				// {listNodes}
			// </ul>
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

		var artistNodes = this.props.data.map(function(artist){
			return (
				<div className="artistBox">
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
		var youtubeLink = "//www.youtube.com/embed/" + this.props.trackYtb;
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
				<SideContent url="categories.json" pollInterval={2000} />
				<MainContent url="energetic_artistBox.json" />
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

React.renderComponent(
	<OutWrap />,
	document.getElementById('outerWrap')
);