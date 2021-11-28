import * as Mongoose from 'mongoose';
import ShipmentModel from './graphql';

const ShipmentSchema: Mongoose.Schema = new Mongoose.Schema(
	{},
	{ timestamps: true },
);
export default Mongoose.model<ShipmentModel>('Shipment', ShipmentSchema);
