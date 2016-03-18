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

	var getBuildDetails = function (self) {
		return request.json({
      url: 'https://circleci.com/api/v1/project/' + self.group + '/' + self.name + '?limit=1circle-token=' + self.token
		});
	};

	var isRunning = function (build) {
    return build[0]['status'] === 'running' ||
           build[0]['status'] === 'queued';
	};

	var isBroken = function (build) {
    return build[0].status !== 'success' &&
           build[0].status !== 'fixed';
	};

	var isErrored = function (build) {
		return false;
	};

	var createBuild = function (self, response) {
		var result = {
			id: self.id,
			name: self.name,
			group: self.group,
      webUrl: response[0].build_url,
			isBroken: isBroken(response),
			isRunning: isRunning(response),
			changes: [{
				name: response[0].committer_name,
				message: response[0].subject
			}]
		};
		return result;
	};

	//var createRunningBuild = function (self, runningBuild, previousBuild) {
		//var result = {
			//id: self.id,
			//name: self.name,
			//group: self.group,
      //webUrl: 'http://bbc.co.uk',
			//isBroken: isBroken(previousBuild),
			//isRunning: true,
			//changes: [{
				//name: runningBuild.committer_name,
				//message: runningBuild.message
			//}]
		//};
		//return result;
	//};

	return CircleciBuild;
});
