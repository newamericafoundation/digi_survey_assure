import * as cors from '@koa/cors';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as locale from 'koa-locale';
import * as logger from 'koa-logger';
import * as mount from 'koa-mount';
// import * as ratelimit from 'koa-ratelimit';
import * as serve from 'koa-static';
import { config } from './config';
import compositeGroupRouter from './http/router/compositeGroupRouter';
import compositeRouter from './http/router/compositeRouter';
import publicRouter from './http/router/publicRouter';
import questionGroupRouter from './http/router/questionGroupRouter';
import questionRouter from './http/router/questionRouter';
import settingRouter from './http/router/settingRouter';
import surveyGroupRouter from './http/router/surveyGroupRouter';
import surveyRouter from './http/router/surveyRouter';

const app = new Koa();

// tslint:disable-next-line
require('koa-qs')(app);

// Rate limiting
// Set to a maximum of 700 requests per IP every 30 seconds.
/*
app.use(ratelimit({
	driver: 'memory',
	db: new Map(),
	duration: 30000,
	errorMessage: 'Rate-limit reached: please slow down.',
	id: (ctx: Koa.Context) => ctx.ip,
	headers: {
		remaining: 'Rate-Limit-Remaining',
		reset: 'Rate-Limit-Reset',
		total: 'Rate-Limit-Total'
	},
	max: 700,
	disableHeader: false,
}));
*/

// Localization (Example: "Header: Accept-Language: en")
locale(app);

// Body Parsing
app.use(bodyParser());

// Logging
if (config.DEBUG === 'true' && config.NODE_ENV !== 'production') {
	app.use(logger());

	console.log('Starting server with config...', config);
}

// CORS
app.use(cors({
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, Accept-Language, Authorization, X-Requested-With, Content-Type, Accept',
	'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, PATCH, OPTIONS',
}));

// Static Delivery of Frontend
// This is relative to the API's build directory.
app.use(mount('/', serve(`${__dirname}/../../../frontend/build`)));

// API Routing
app.use(compositeGroupRouter.routes()).use(compositeGroupRouter.allowedMethods());
app.use(compositeRouter.routes()).use(compositeRouter.allowedMethods());
app.use(questionRouter.routes()).use(questionRouter.allowedMethods());
app.use(questionGroupRouter.routes()).use(questionGroupRouter.allowedMethods());
app.use(publicRouter.routes()).use(publicRouter.allowedMethods());
app.use(settingRouter.routes()).use(settingRouter.allowedMethods());
app.use(surveyRouter.routes()).use(surveyRouter.allowedMethods());
app.use(surveyGroupRouter.routes()).use(surveyGroupRouter.allowedMethods());

export const server = app.listen(config.PORT || 4000);
