const { controllers } = require("./controllers");

const routes = [
	// Users
	{
		action: "/register",
		handler: controllers.Users.register.bind(controllers.Users),
	},
	{
		action: "/login",
		handler: controllers.Users.login.bind(controllers.Users),
	},
	{
		action: "/logout",
		handler: controllers.Users.logout.bind(controllers.Users),
	},
	{
		action: "/password/change",
		handler: controllers.Users.changePassword.bind(controllers.Users),
	},
	{
		action: "/name/change",
		handler: controllers.Users.changeName.bind(controllers.Users),
	},
	{
		action: "/profile",
		handler: controllers.Users.profile.bind(controllers.Users),
	},
	// Stats
	{
		action: "/scoreboard",
		handler: controllers.Stats.scoreboard.bind(controllers.Stats),
	},
	// Games
	{
		action: "/games",
		handler: controllers.Games.games.bind(controllers.Games),
	},
	{
		action: "/game/create",
		handler: controllers.Games.createGame.bind(controllers.Games),
	},
	{
		action: "/game/join",
		handler: controllers.Games.joinGame.bind(controllers.Games),
	},
];

module.exports = routes;
