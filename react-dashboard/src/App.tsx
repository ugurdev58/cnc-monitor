import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

interface CncVeri {
  makine_id: string;
  zaman: string;
  sicaklik: number;
  titresim: number;
  devir: number;
  durum: 'calisiyor' | 'durus' | 'alarm';
}

interface Alarm {
  makine_id: string;
  mesaj: string;
  deger: number;
  zaman: string;
}

const DURUM_RENK: Record<string, string> = {
  calisiyor: '#22c55e',
  durus: '#f59e0b',
  alarm: '#ef4444',
};

const socket = io('http://localhost:3000');

export default function App() {
  const [veriler, setVeriler] = useState<CncVeri[]>([]);
  const [alarmlar, setAlarmlar] = useState<Alarm[]>([]);
  const [sonVeri, setSonVeri] = useState<CncVeri | null>(null);

  useEffect(() => {
    socket.on('cnc_veri', (veri: CncVeri) => {
      setSonVeri(veri);
      setVeriler(prev => [...prev.slice(-30), {
        ...veri,
        zaman: new Date(veri.zaman).toLocaleTimeString('tr-TR'),
      }]);
    });

    socket.on('cnc_alarm', (alarm: Alarm) => {
      setAlarmlar(prev => [alarm, ...prev.slice(0, 4)]);
    });

    return () => { socket.off('cnc_veri'); socket.off('cnc_alarm'); };
  }, []);

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif', color: '#f1f5f9' }}>
      
      {/* Başlık */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>CNC Makine İzleme Sistemi</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>Kapasitematik benzeri gerçek zamanlı dashboard</p>
      </div>

      {/* Durum kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Makine', deger: sonVeri?.makine_id ?? '-' },
          { label: 'Sıcaklık (°C)', deger: sonVeri?.sicaklik ?? '-' },
          { label: 'Titreşim', deger: sonVeri?.titresim ?? '-' },
          { label: 'Devir (RPM)', deger: sonVeri?.devir ?? '-' },
        ].map(({ label, deger }) => (
          <div key={label} style={{ background: '#1e293b', borderRadius: '10px', padding: '16px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#94a3b8' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>{deger}</p>
          </div>
        ))}
      </div>

      {/* Durum badge */}
      {sonVeri && (
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            background: DURUM_RENK[sonVeri.durum] + '22',
            color: DURUM_RENK[sonVeri.durum],
            border: `1px solid ${DURUM_RENK[sonVeri.durum]}44`,
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 500,
          }}>
            ● {sonVeri.durum.toUpperCase()}
          </span>
        </div>
      )}

      {/* Sıcaklık grafiği */}
      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
        <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 500 }}>Sıcaklık Takibi (son 30 ölçüm)</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={veriler}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="zaman" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={4} />
            <YAxis domain={[50, 110]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
            <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Alarm', fill: '#ef4444', fontSize: 11 }} />
            <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Uyarı', fill: '#f59e0b', fontSize: 11 }} />
            <Line type="monotone" dataKey="sicaklik" stroke="#38bdf8" strokeWidth={2} dot={false} name="Sıcaklık °C" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Devir grafiği */}
      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
        <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 500 }}>Devir Takibi (RPM)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={veriler}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="zaman" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={4} />
            <YAxis domain={[1800, 3200]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="devir" stroke="#a78bfa" strokeWidth={2} dot={false} name="Devir RPM" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alarm paneli */}
      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '20px' }}>
        <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 500 }}>Son Alarmlar</p>
        {alarmlar.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Henüz alarm yok</p>
        ) : (
          alarmlar.map((a, i) => (
            <div key={i} style={{
              background: '#ef444422',
              border: '1px solid #ef444444',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '8px',
              fontSize: '13px',
            }}>
              <span style={{ color: '#ef4444', fontWeight: 500 }}>⚠ {a.mesaj}</span>
              <span style={{ color: '#94a3b8', marginLeft: '12px' }}>{a.deger}°C</span>
              <span style={{ color: '#64748b', marginLeft: '12px' }}>{new Date(a.zaman).toLocaleTimeString('tr-TR')}</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
