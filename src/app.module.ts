import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB_KEY } from './app.constants';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      subscriptions: {
        'subscriptions-transport-ws': true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    { provide: PUB_SUB_KEY, useValue: new RedisPubSub() },
    AppResolver,
    AppService,
  ],
})
export class AppModule {}
