const routes = require("./routes");

module.exports = async (req, session) => {
	let resp = {
		error: false,
		desc: "",
		resp: null,
	};

	if (typeof req.action === "undefined") {
		resp.error = true;
		resp.desc = "action is required";
		return resp;
	}

	resp.action = String(req.action).trim();

	const route = routes.find((o) => o.action === resp.action);
	if (typeof route === "undefined" || typeof route.handler === "undefined") {
		resp.error = true;
		resp.desc = "action not implemented";
		return resp;
	}

	let handlerResp = await route.handler(req.payload, session).catch((e) => {
		resp.error = true;
		resp.desc = "internal server error";
		return resp;
	});

	resp.error = handlerResp.error;
	resp.desc = handlerResp.desc;
	resp.resp = handlerResp.resp;

	if (typeof req.mid !== "undefined") {
		resp.rmid = req.mid;
	}

	return resp;
};
