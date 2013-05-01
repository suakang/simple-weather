(function($){
	var	Forecast,
		Forecasts;

	var	SearchView,
		ForecastView,
		ForecastItemView;

	var	forecasts,
		searchView,
		forecastView;

	// This pulls data from Weather Underground
	// Then parse the data so that we can work with it
	// Also, it validates to have zip code numbers for sending to WU
	Forecast = Backbone.Model.extend({
		url: function(){
			return 'http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/' + this.get('zip') + '.json';
		},

		parse: function(data, xhr) {
			// Stores the data we want to work with
			// in a more convinient way to access it.
			// observation becomes an object {};
			var observation = data.current_observation
			return {
				id: observation.display_location.zip,
				url: observation.icon,
				state: observation.display_location.state_name,
				zip: observation.display_location.zip,
				city: observation.display_location.city,
				temp: observation.temp_f
				}
		},

		sync: function(method, model, options) {

			options.dataType = 'jsonp';
			return Backbone.sync(method, model, options);
		},

		validate: function(options) {
			if (!options.zip) {
				// If not exist, return string to enter the zip code
				return 'please enter your zip code';
			}
		}
	});

	//Contains a list/array of of individual Forecast items.
	Forecasts = Backbone.Collection.extend({
		model: Forecast
	});

	SearchView = Backbone.View.extend({
		events: {
			'click #search': 'addZip'
		},

		initialize: function() {
			this.collection.on('add', this.clear, this);
			//this = searchView object
		},

		addZip: function(e) {
			e.preventDefault();

			// this initialize our Forecast model
			// calls all the methods within Forecast
			this.model = new Forecast();

			this.model.on('error', this.toggleError, this);

			if ( this.model.set({ zip: this.$('#zip').val() })) {
				this.collection.add(this.model);
				this.toggleError();
			}
		},

		clear: function() {
			this.$('#zip').val('');
		},

		toggleError: function(model, error) {
			this.$('.alert').text(error).toggle(!!error)
		}
	});

	ForecastView = Backbone.View.extend({
		events: {
			'click .delete': 'destroy'
		},

		initialize: function(){
			this.collection.on('add', this.render, this);
			this.collection.on('remove', this.remove, this);
		},

		render: function(model) {
			var view = new ForecastItemView({ id: model.get('zip'), model: model });
			this.$('tbody').append(view.el).closest('table').fadeIn('slow');
		},

		remove: function(model) {
			$( '#' + model.get('zip') ).remove();

			// !this.collection.length says
			// if collection is empty, fade out #el, defined below
			// forecastView = new ForecastView();
			if (!this.collection.length) {
				this.$el.fadeOut('slow');
			}
		},

		destroy: function(e) {
			var id = $(e.currentTarget).closest('tr').attr('id')
			var model = this.collection.get(id);

			this.collection.remove(model);

		}


	});

	ForecastItemView = Backbone.View.extend({
		tagName: 'tr', 
		template: _.template( $.trim( $('#forecast-template').html() ) ),

		initialize: function() {
			_.bindAll(this, 'render');
			// fetch calls the Forecast.sync method,
			// pulling out data from WU
			this.model.fetch({success: this.render});
		},

		render: function(model) {
			var content = this.template(model.toJSON());
			this.$el.html(content);
			return this;
		}

	});

	forecasts = new Forecasts();
	searchView = new SearchView({
		el: $('#weather'), 
		collection: forecasts 
	});

	ForecastView = new ForecastView({
		el: $('#output'),
		collection: forecasts
	});

})(jQuery);