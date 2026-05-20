import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { interval } from 'rxjs';

export interface CncVeri {
  makine_id: string;
  zaman: string;
  sicaklik: number;
  titresim: number;
  devir: number;
  durum: 'calisiyor' | 'durus' | 'alarm';
}

@Injectable()
export class CncService implements OnModuleInit {
  private veriler: CncVeri[] = [];

  constructor(
    @Inject('MQTT_CLIENT') private readonly mqttClient: ClientProxy,
  ) {}

  onModuleInit() {
    interval(2000).subscribe(() => {
      const veri = this.sahteVeriUret('CNC-001');
      this.veriler.push(veri);
      this.mqttClient.emit('fabrika/cnc/1/veri', veri);

      if (veri.sicaklik > 85) {
        this.mqttClient.emit('fabrika/cnc/1/alarm', {
          makine_id: veri.makine_id,
          mesaj: 'Yüksek sıcaklık alarmı',
          deger: veri.sicaklik,
          zaman: veri.zaman,
        });
      }
    });
  }

  private sahteVeriUret(makineId: string): CncVeri {
    const sicaklik = 60 + Math.random() * 40;
    return {
      makine_id: makineId,
      zaman: new Date().toISOString(),
      sicaklik: Math.round(sicaklik * 10) / 10,
      titresim: Math.round(Math.random() * 10) / 10,
      devir: Math.round(2000 + Math.random() * 1000),
      durum: sicaklik > 90 ? 'alarm' : sicaklik > 80 ? 'durus' : 'calisiyor',
    };
  }

  sonVerileriGetir(limit = 50): CncVeri[] {
    return this.veriler.slice(-limit);
  }
}
