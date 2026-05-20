import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class CncGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket başlatıldı');
  }

  veriGonder(veri: any) {
    this.server.emit('cnc_veri', veri);
  }

  alarmGonder(alarm: any) {
    this.server.emit('cnc_alarm', alarm);
  }
}
