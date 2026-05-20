import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CncService } from './cnc.service';
import { CncController } from './cnc.controller';
import { CncGateway } from './cnc.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: { url: 'mqtt://localhost:1883' },
      },
    ]),
  ],
  providers: [CncService, CncGateway],
  controllers: [CncController],
})
export class CncModule {}
