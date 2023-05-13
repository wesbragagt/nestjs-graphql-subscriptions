import { Inject } from '@nestjs/common';
import {
  Field,
  Query,
  Mutation,
  ObjectType,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB_KEY } from './app.constants';

@ObjectType()
class Ping {
  @Field(() => String)
  id: string;
}

@ObjectType()
class Pong {
  @Field(() => String)
  pingId: string;
}

const PONG_EVENT_NAME = 'pong_event';
const listOfPings = [];

@Resolver()
export class AppResolver {
  constructor(
    @Inject(PUB_SUB_KEY)
    private pubSub: RedisPubSub,
  ) {}
  @Query(() => [Ping])
  pingPong(): Promise<Ping[]> {
    return Promise.resolve(listOfPings);
  }

  @Mutation(() => Ping)
  async ping() {
    const pingId = Date.now().toString();

    this.pubSub.publish(PONG_EVENT_NAME, { pingId });

    return { id: pingId };
  }

  @Subscription(() => Pong, { resolve: (payload) => payload })
  async pong() {
    return this.pubSub.asyncIterator(PONG_EVENT_NAME);
  }
}
