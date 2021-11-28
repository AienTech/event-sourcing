import { resolve } from 'path';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import Mongoose from 'mongoose';
import { config } from 'dotenv';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ShipmentResolver } from './services/shipment';
import Logger from './util/log';
import Context from './util/context';

async function startServer() {
	config({
		path: resolve(__dirname, '..', '.env'),
		debug: process.env.NODE_ENV === 'development',
	});

	const { MONGODB_URL } = process.env;

	const schema = await buildSchema({
		resolvers: [ShipmentResolver],
		emitSchemaFile: true,
	});

	try {
		Logger.info('Trying to connect to mongodb...');
		await Mongoose.connect(MONGODB_URL as string, {});

		Logger.info('Mongodb is connected successfully');
		const server = new ApolloServer({
			schema,
			context: () => ({}),
			plugins: [
				ApolloServerPluginLandingPageGraphQLPlayground({
					title: 'Event Sourcing Test',
				}),
			],
		});

		const app = express();

		await server.start();
		await server.applyMiddleware({
			app,
		});

		app.use((req, _res, next) => {
			Context.bind(req);
			next();
		});

		const PORT = process.env.PORT;

		app.listen(PORT, () => {
			Logger.info(`server is running on PORT ${PORT}`);
		});
	} catch (e) {
		Logger.error(e);
	}
}

startServer();
