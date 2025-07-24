/*
  # Sincronizar produtos da Loja 2 com produtos principais

  1. Limpeza
    - Remove todos os produtos existentes da tabela `store2_products`
    
  2. Sincronização
    - Copia todos os produtos ativos da tabela `pdv_products`
    - Mantém os mesmos códigos e nomes (sem prefixos)
    - Preserva todas as configurações originais
    
  3. Resultado
    - Loja 2 terá exatamente os mesmos produtos do atendimento principal
    - Sincronização completa entre as duas lojas
*/

-- Primeiro, limpar todos os produtos existentes da Loja 2
DELETE FROM store2_products;

-- Copiar todos os produtos ativos da tabela principal para a Loja 2
INSERT INTO store2_products (
  code,
  name,
  category,
  is_weighable,
  unit_price,
  price_per_gram,
  image_url,
  stock_quantity,
  min_stock,
  is_active,
  barcode,
  description,
  created_at,
  updated_at
)
SELECT 
  code,                    -- Mantém o código original
  name,                    -- Mantém o nome original
  category,
  is_weighable,
  unit_price,
  price_per_gram,
  image_url,
  stock_quantity,
  min_stock,
  is_active,
  barcode,
  description,
  now() as created_at,
  now() as updated_at
FROM pdv_products 
WHERE is_active = true
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  is_weighable = EXCLUDED.is_weighable,
  unit_price = EXCLUDED.unit_price,
  price_per_gram = EXCLUDED.price_per_gram,
  image_url = EXCLUDED.image_url,
  stock_quantity = EXCLUDED.stock_quantity,
  min_stock = EXCLUDED.min_stock,
  is_active = EXCLUDED.is_active,
  barcode = EXCLUDED.barcode,
  description = EXCLUDED.description,
  updated_at = now();