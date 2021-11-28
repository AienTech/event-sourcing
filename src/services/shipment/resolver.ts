import { Query, Resolver } from 'type-graphql';
import ShipmentModel from './graphql';
import ShipmentSchema from './schema';

@Resolver(() => ShipmentModel)
export default class ShipmentResolver {
	@Query(() => [ShipmentModel])
	async shipments(): Promise<ShipmentModel[]> {
		return ShipmentSchema.find();
	}
}
