-- ============================================================================
-- BLOG TABLES FOR MIDCAR
-- Execute this SQL in your Supabase SQL Editor
-- ============================================================================

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  imagen_url TEXT,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  titulo VARCHAR(255) NOT NULL,
  extracto TEXT,
  contenido TEXT NOT NULL,
  imagen_principal TEXT,
  categoria_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  autor VARCHAR(100) DEFAULT 'MID Car',
  tags TEXT[] DEFAULT '{}',
  seo_titulo VARCHAR(255),
  seo_descripcion TEXT,
  seo_keywords TEXT,
  estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado', 'archivado')),
  destacado BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  fecha_publicacion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_estado ON blog_posts(estado);
CREATE INDEX IF NOT EXISTS idx_blog_posts_categoria ON blog_posts(categoria_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_fecha ON blog_posts(fecha_publicacion DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_destacado ON blog_posts(destacado) WHERE destacado = true;

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_activo ON blog_categories(activo);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
DROP POLICY IF EXISTS "Allow public read access to active categories" ON blog_categories;
CREATE POLICY "Allow public read access to active categories"
  ON blog_categories
  FOR SELECT
  USING (activo = true);

DROP POLICY IF EXISTS "Allow public read access to published posts" ON blog_posts;
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts
  FOR SELECT
  USING (estado = 'publicado');

-- ============================================================================
-- SAMPLE DATA - Default Categories
-- ============================================================================

INSERT INTO blog_categories (nombre, slug, descripcion, orden, activo) VALUES
  ('Consejos de Compra', 'consejos-compra', 'Guías y consejos para comprar tu coche de segunda mano', 1, true),
  ('Mantenimiento', 'mantenimiento', 'Tips de mantenimiento y cuidado de tu vehículo', 2, true),
  ('Noticias', 'noticias', 'Últimas noticias del sector automovilístico', 3, true),
  ('Guías', 'guias', 'Guías completas sobre vehículos y trámites', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SAMPLE BLOG POST (for testing)
-- ============================================================================

INSERT INTO blog_posts (
  slug,
  titulo,
  extracto,
  contenido,
  autor,
  tags,
  estado,
  destacado,
  fecha_publicacion,
  categoria_id
) VALUES (
  'comprar-vehiculo-segunda-mano-guia-completa',
  'Comprar un vehículo segunda mano: Guía completa',
  'Todo lo que debes saber para comprar un coche de segunda mano con confianza.',
  E'Comprar un vehículo de segunda mano puede ser una excelente decisión si sabes cómo hacerlo correctamente. Ya sea tu primer auto o si buscas una alternativa más económica, elegir bien puede ahorrarte muchos dolores de cabeza. En MID CAR, queremos ayudarte a tomar la mejor decisión y contarte por qué somos tu mejor aliado en este camino.\n\nComprar un auto usado tiene muchas ventajas frente a uno nuevo:\n\n- **Precio más accesible:** puedes encontrar modelos muy bien equipados por mucho menos.\n- **Menor depreciación:** un auto nuevo pierde valor rápidamente en sus primeros años; uno usado ya pasó esa etapa.\n- **Variedad:** tienes acceso a modelos y marcas que quizás nuevos estarían fuera de tu presupuesto.\n- **Costo de seguro más bajo:** al ser un vehículo con menor valor comercial, el seguro también suele ser más económico.\n\n## ¿Por qué elegir MID CAR?\n\nEn MID CAR nos especializamos en vehículos de ocasión de calidad. Todos nuestros coches pasan por una rigurosa revisión técnica y ofrecemos garantía en cada venta.\n\n### Nuestras ventajas:\n\n1. **Garantía incluida** en todos los vehículos\n2. **Financiación flexible** adaptada a tus necesidades\n3. **Historial verificado** de cada vehículo\n4. **Servicio post-venta** profesional\n\n¡Visítanos y encuentra tu coche ideal!',
  'MID Car',
  ARRAY['compra', 'consejos', 'segunda mano', 'guía'],
  'publicado',
  true,
  NOW(),
  (SELECT id FROM blog_categories WHERE slug = 'consejos-compra' LIMIT 1)
) ON CONFLICT (slug) DO NOTHING;
