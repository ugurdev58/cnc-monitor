import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CncModule } from './cnc/cnc.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL || 'mqtts://6f1c005795cb4abca83c5fbc8a9e9c26.s1.eu.hivemq.cloud:8883',
          username: process.env.MQTT_USERNAME || 'ugurq',
          password: process.env.MQTT_PASSWORD || 'Qwerty257',
          protocol: 'mqtts',
          rejectUnauthorized: false,
        },
      },
    ]),
    CncModule,
  ],
})
export class AppModule {}
