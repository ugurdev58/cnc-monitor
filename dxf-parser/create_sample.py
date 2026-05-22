import ezdxf

# Örnek DXF dosyası oluştur (CNC parça simülasyonu)
doc = ezdxf.new('R2010')
msp = doc.modelspace()

# Parça 1 - Dikdörtgen parça
msp.add_lwpolyline([(0, 0), (100, 0), (100, 50), (0, 50)], close=True)

# Parça 2 - Dairesel delik
msp.add_circle((50, 25), radius=10)

# Parça 3 - Başka bir dikdörtgen
msp.add_lwpolyline([(150, 0), (250, 0), (250, 80), (150, 80)], close=True)

# Parça 4 - L şekli
msp.add_lwpolyline([(300, 0), (400, 0), (400, 30), (350, 30), (350, 80), (300, 80)], close=True)

doc.saveas('sample_parca.dxf')
print("sample_parca.dxf oluşturuldu!")
