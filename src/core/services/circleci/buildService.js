define([
	'core/services/buildServiceBase',
	'core/services/circleci/circleciBuild',
	'core/services/request',
	'mout/object/mixIn'
], function (BuildServiceBase, CircleciBuild, request, mixIn) {

	'use strict';

	var CircleciBuildService = function (settings) {
		mixIn(this, new BuildServiceBase(settings, CircleciBuildService.settings()));
		this.Build = CircleciBuild;
		this.availableBuilds = availableBuilds;
	};

	CircleciBuildService.settings = function () {
		return {
			typeName: 'Circleci',
			baseUrl: 'circleci',
			icon: 'src/core/services/circleci/icon.png',
			logo: 'src/core/services/circleci/logo.png',
			defaultConfig: {
				baseUrl: 'circleci',
				name: '',
				projects: [],
				password: '',
				updateInterval: 60
			}
		};
	};

	var availableBuilds = function () {
		return request.json({
			url: 'https://circleci.com/api/v1/projects',
			data: { 'token': this.settings.password },
			parser: function (response) {
				return {
					items: response.map(function (repo) {
						return {
              id: repo.username + '/' + repo.reponame,
							name: repo.reponame,
              group: repo.username,
							isDisabled: false
						};
					})
				};
			}
		});
	};

	return CircleciBuildService;
});
