import { Module } from "@nestjs/common";
import { DashboardGateway } from "./dashboard.gateway";
import { RedisClientModule } from "../common/redis/redis-client.module";

@Module({
    imports: [RedisClientModule],
    providers: [DashboardGateway]
})
export class DashboardModule {}