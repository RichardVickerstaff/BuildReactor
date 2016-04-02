define([
	'core/services/request',
	'rx'
], function (request, Rx) {
	'use strict';

	var CircleciBuild = function (id, settings) {
		this.id = id;
		this.name = id.split('/')[1];
		this.group = id.split('/')[0];
		this.update = update;
    this.token = settings.password;
	};

	var update = function () {
		var self = this;
    return getBuildDetails(self)
      .map(function (buildDetails) {
        return createBuild(self, buildDetails);
      });
	};

	var getBuildDetails = function (self, limit) {
		return request.json({
      url: 'https://circleci.com/api/v1/project/' + self.group + '/' + self.name + '?circle-token=' + self.token
		});
	};

	var isNotRunning = function (build) {
    return !isRunning(build);
	};

	var isRunning = function (build) {
    return build['status'] === 'running' ||
           build['status'] === 'queued';
	};

	var isLastFoo = function (builds) {
    return isBroken(builds.filter(isNotRunning)[0]);
	};

	var isBroken = function (build) {
    return build.status !== 'success' &&
           build.status !== 'fixed';
	};

	var createBuild = function (self, response) {
		var result = {
			id: self.id,
			name: self.name,
			group: self.group,
      webUrl: response[0].build_url,
			isBroken: isLastFoo(response),
			isRunning: isRunning(response[0]),
			changes: [{
				name: response[0].committer_name,
				message: response[0].subject
			}]
		};
		return result;
	};

	return CircleciBuild;
});
