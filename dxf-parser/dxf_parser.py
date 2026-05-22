import ezdxf
import json
import sys
from datetime import datetime

def parse_dxf(dosya_yolu):
    try:
        doc = ezdxf.readfile(dosya_yolu)
    except Exception as e:
        return {"hata": f"DXF dosyası okunamadı: {str(e)}"}

    msp = doc.modelspace()
    parcalar = []
    parca_no = 1

    for entity in msp:
        parca = None

        if entity.dxftype() == 'LWPOLYLINE':
            noktalar = []
            for nokta in entity.get_points():
                noktalar.append({"x": round(float(nokta[0]), 3), "y": round(float(nokta[1]), 3)})

            x_ler = [n["x"] for n in noktalar]
            y_ler = [n["y"] for n in noktalar]

            parca = {
                "parca_id": f"P{parca_no:03d}",
                "tip": "DIKDORTGEN" if len(noktalar) == 4 else "POLIGON",
                "noktalar": noktalar,
                "baslangic": {"x": min(x_ler), "y": min(y_ler)},
                "boyut": {
                    "genislik": round(max(x_ler) - min(x_ler), 3),
                    "yukseklik": round(max(y_ler) - min(y_ler), 3)
                },
                "merkez": {
                    "x": round((max(x_ler) + min(x_ler)) / 2, 3),
                    "y": round((max(y_ler) + min(y_ler)) / 2, 3)
                }
            }

        elif entity.dxftype() == 'CIRCLE':
            merkez = entity.dxf.center
            parca = {
                "parca_id": f"P{parca_no:03d}",
                "tip": "DAIRE",
                "merkez": {"x": round(merkez.x, 3), "y": round(merkez.y, 3)},
                "yaricap": round(entity.dxf.radius, 3),
                "baslangic": {
                    "x": round(merkez.x - entity.dxf.radius, 3),
                    "y": round(merkez.y - entity.dxf.radius, 3)
                },
                "boyut": {
                    "genislik": round(entity.dxf.radius * 2, 3),
                    "yukseklik": round(entity.dxf.radius * 2, 3)
                }
            }

        elif entity.dxftype() == 'LINE':
            p1 = entity.dxf.start
            p2 = entity.dxf.end
            parca = {
                "parca_id": f"P{parca_no:03d}",
                "tip": "CIZGI",
                "baslangic": {"x": round(p1.x, 3), "y": round(p1.y, 3)},
                "bitis": {"x": round(p2.x, 3), "y": round(p2.y, 3)},
                "uzunluk": round(((p2.x-p1.x)**2 + (p2.y-p1.y)**2)**0.5, 3)
            }

        if parca:
            parcalar.append(parca)
            parca_no += 1

    sonuc = {
        "dosya": dosya_yolu,
        "tarih": datetime.now().isoformat(),
        "toplam_parca": len(parcalar),
        "parcalar": parcalar,
        "robot_komutu": "HAZIR",
        "aciklama": "RoboCAM benzeri koordinat ciktisi - robot besleme formati"
    }

    return sonuc


if __name__ == "__main__":
    dosya = sys.argv[1] if len(sys.argv) > 1 else "sample_parca.dxf"
    sonuc = parse_dxf(dosya)
    print(json.dumps(sonuc, ensure_ascii=False, indent=2))
