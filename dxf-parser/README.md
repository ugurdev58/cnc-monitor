# DXF Parça Koordinat Dönüştürücü

CAD/DXF dosyalarından parça geometrisini ayrıştıran, koordinatları robot besleme formatına çeviren araç.

Tezmaksan'ın **RoboCAM** sisteminin temel mantığını taklit eder — DXF dosyasındaki parça koordinatlarını okuyup robota gönderilebilecek JSON formatına dönüştürür.

## Kullanım

```bash
python3 dxf_parser.py dosya.dxf
python3 dxf_parser.py dosya.dxf > output.json
```

## Desteklenen Geometriler

| Tip | Açıklama |
|-----|----------|
| LWPOLYLINE | Dikdörtgen ve çokgen parçalar |
| CIRCLE | Dairesel delikler |
| LINE | Kesim çizgileri |

## Örnek Çıktı

```json
{
  "parca_id": "P001",
  "tip": "DIKDORTGEN",
  "baslangic": {"x": 0.0, "y": 0.0},
  "boyut": {"genislik": 100.0, "yukseklik": 50.0},
  "merkez": {"x": 50.0, "y": 25.0}
}
```

## RoboCAM Bağlantısı

Tezmaksan'ın RoboCAM yazılımı aynı prensibi kullanır: DXF dosyasından parça konumlarını otomatik seçip robota gönderir. Bu araç o mantığın Python implementasyonudur.

## Gereksinimler

```bash
pip install ezdxf
```
