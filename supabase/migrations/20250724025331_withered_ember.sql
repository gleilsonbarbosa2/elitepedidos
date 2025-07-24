/*
  # Remover produtos específicos da Loja 2

  1. Produtos Removidos
    - Remove "Açaí 1kg - Loja 2" 
    - Remove "Açaí 300ml - Loja 2"
    - Remove "Açaí 500ml - Loja 2"
    
  2. Segurança
    - Remove apenas produtos com nomes específicos
    - Mantém outros produtos intactos
    - Operação segura e reversível
*/

-- Remover produtos específicos da Loja 2
DELETE FROM store2_products 
WHERE name IN (
  'Açaí 1kg - Loja 2',
  'Açaí 300ml - Loja 2', 
  'Açaí 500ml - Loja 2'
);

-- Log da operação
DO $$
BEGIN
  RAISE NOTICE 'Produtos específicos removidos da Loja 2: Açaí 1kg, 300ml e 500ml';
END $$;