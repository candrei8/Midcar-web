-- Migración GEO (WS3): columna opcional `faqs` en blog_posts
-- Permite adjuntar preguntas frecuentes a cada guía → bloque Q&A visible + FAQPage schema.
-- SEGURA Y REVERSIBLE: columna nullable, no afecta a posts existentes (quedan con faqs = NULL).
-- Formato esperado: array JSON de objetos { "pregunta": "...", "respuesta": "..." }

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS faqs jsonb;

COMMENT ON COLUMN public.blog_posts.faqs IS
  'Array de {pregunta, respuesta} para el bloque FAQ visible + FAQPage schema de la guía (GEO). Opcional.';

-- Reversión (si hiciera falta):
-- ALTER TABLE public.blog_posts DROP COLUMN IF EXISTS faqs;
