// Include React 
var React = require('react');

// Here we include all of the sub-components
var Search = require('./Children/Search');
var Results = require('./Children/Results');
var SavedArticles = require('./Children/SavedArticles');

// Helper Function
var helpers = require('./utils/helpers.js');

// This is the main component. 
var Main = React.createClass({

	// Here we set a generic state associated with the number of clicks
	getInitialState: function(){
		return {
			searchTerm: "",
			Results: "",
			SavedArticles: [] /*Note how we added in this SavedArticles state variable*/
		}
	},	

	// This function allows childrens to update the parent.
	setTerm: function(term){
		this.setState({
			searchTerm: term
		})
	},

	// If the component changes (i.e. if a search is entered)... 
	componentDidUpdate: function(prevProps, prevState){

		if(prevState.searchTerm != this.state.searchTerm){
			console.log("UPDATED");

			// Run the query for the address
			helpers.runQuery(this.state.searchTerm)
				.then(function(data){
					if (data != this.state.Results)
					{
						console.log("Address", data);

						this.setState({
							Results: data
						})

						// After we've received the result... then post the search term to our SavedArticles. 
						helpers.postSavedArticles(this.state.searchTerm)
							.then(function(data){
								console.log("Updated!");

								// After we've done the post... then get the updated SavedArticles
								helpers.getSavedArticles()
									.then(function(response){
										console.log("Current SavedArticles", response.data);
										if (response != this.state.SavedArticles){
											console.log ("SavedArticles", response.data);

											this.setState({
												history: response.data
											})
										}
									}.bind(this))	
							}.bind(this)
						)
					}
				}.bind(this))
				
			}
	},

	// The moment the page renders get the History
	componentDidMount: function(){

		// Get the latest history.
		helpers.getHistory()
			.then(function(response){
				if (response != this.state.history){
					console.log ("History", response.data);

					this.setState({
						history: response.data
					})
				}
			}.bind(this))
	},

	// Here we render the function
	render: function(){

		return(

			<div className="container">

				<div className="row">

					<div className="jumbotron">
						<h2 className="text-center">Address Finder!</h2>
						<p className="text-center"><em>Enter a landmark to search for its exact address (ex: "Eiffel Tower").</em></p>
					</div>

					<div className="col-md-6">
					
						<Search setTerm={this.setTerm}/>

					</div>

					<div className="col-md-6">
				
						<Results address={this.state.Results} />

					</div>

				</div>

				<div className="row">

					<History history={this.state.history}/> 

				</div>

			</div>
		)
	}
});


module.exports = Main;