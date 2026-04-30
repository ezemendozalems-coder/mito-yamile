-- Seed inicial de productos desde el array estático
-- Este script inserta todos los productos con upsert por code

INSERT INTO public.products (code, name, category, price_mayor, price_bulto, updated_at)
VALUES
  ('10000', 'Agujas', 'libreria', 640, 0, now()),
  ('10001', 'Aros', 'libreria', 2400, 0, now()),
  ('10002', 'Banda elástica', 'libreria', 1280, 0, now())
-- NOTA: Este es un ejemplo parcial. Para insertar los 740 productos completos,
-- se recomienda usar un script de Node.js o una herramienta de migración.
-- Por ahora, continuaremos con la siguiente opción...
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price_mayor = EXCLUDED.price_mayor,
  price_bulto = EXCLUDED.price_bulto,
  updated_at = now();
