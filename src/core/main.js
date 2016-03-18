require([
	'core/config/localStore',
	'core/backgroundLogger',
	'core/badgeController',
	'core/messageHandlers',
	'core/notificationController',
	'core/config/serviceConfiguration',
	'core/config/viewConfiguration',
	'core/services/serviceController',
	'core/services/passwordExpiredHandler',

	'core/services/bamboo/buildService',
	'core/services/buildbot/buildService',
	'core/services/cctray/buildService',
	'core/services/cruisecontrol/buildService',
	'core/services/cruisecontrol.net/buildService',
	'core/services/cruisecontrol.rb/buildService',
	'core/services/go/buildService',
	'core/services/jenkins/buildService',
	'core/services/snap/buildService',
	'core/services/teamcity/buildService',
	'core/services/travis/buildService',
	'core/services/circleci/buildService'
], function (
	localStore,
	backgroundLogger,
	badgeController,
	messageHandlers,
	notificationController,
	serviceConfiguration,
	viewConfiguration,
	serviceController,
	passwordExpiredHandler,
	
	BambooService,
	BuildBotService,
	CctrayService,
	CruiseControlService,
	CruiseControlNetService,
	CruiseControlRBService,
	GoService,
	JenkinsService,
	SnapService,
	TeamCityService,
	TravisService,
	CircleciService
) {
	'use strict';

	serviceConfiguration.init();
	viewConfiguration.init();
	backgroundLogger();
	badgeController();
	notificationController.init({ timeout: 5000 });
	messageHandlers.init();

	serviceController.clear();
	serviceController.registerType(BambooService);
	serviceController.registerType(BuildBotService);
	serviceController.registerType(CctrayService);
	serviceController.registerType(CruiseControlService);
	serviceController.registerType(CruiseControlNetService);
	serviceController.registerType(CruiseControlRBService);
	serviceController.registerType(GoService);
	serviceController.registerType(JenkinsService);
	serviceController.registerType(SnapService);
	serviceController.registerType(TeamCityService);
	serviceController.registerType(TravisService);
	serviceController.registerType(CircleciService);

	serviceController.start(serviceConfiguration.changes);
});
