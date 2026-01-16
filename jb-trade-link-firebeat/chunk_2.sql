DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Marie 25+20gm (1*10) (1x120) Rs10' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.9948, "discountedRate" = 8.99, 
      "orderMultiple" = 10, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 10, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Marie 25+20gm (1*10) (1x120) Rs10' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_40_' || gen_random_uuid(), 'Marie 25+20gm (1*10) (1x120) Rs10', 'c2', 'Parle', 8.9948, 8.99, 10, 12, 10, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Mazelo 198gm (1x24)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 104.17, "discountedRate" = 104.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Mazelo 198gm (1x24)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_41_' || gen_random_uuid(), 'Mazelo 198gm (1x24)', 'c2', 'Parle', 104.17, 104.17, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Melody Chocolate 195.5gm (1x32)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 104.17, "discountedRate" = 104.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 32, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Melody Chocolate 195.5gm (1x32)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_42_' || gen_random_uuid(), 'Melody Chocolate 195.5gm (1x32)', 'c2', 'Parle', 104.17, 104.17, 1, 1, 32, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Monaco 25+9.8gm (1*96) Mrp10' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.9948, "discountedRate" = 8.99, 
      "orderMultiple" = 12, "packetsPerCarton" = 8, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Monaco 25+9.8gm (1*96) Mrp10' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_43_' || gen_random_uuid(), 'Monaco 25+9.8gm (1*96) Mrp10', 'c2', 'Parle', 8.9948, 8.99, 12, 8, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Monaco 75gm (1x60) Mrp 25' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 22.4192, "discountedRate" = 22.42, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 60, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Monaco 75gm (1x60) Mrp 25' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_44_' || gen_random_uuid(), 'Monaco 75gm (1x60) Mrp 25', 'c2', 'Parle', 22.4192, 22.42, 1, 1, 60, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Monaco Cheesling Jar 150gm (1*30) Mrp 125' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 112.1073, "discountedRate" = 112.11, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 30, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Monaco Cheesling Jar 150gm (1*30) Mrp 125' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_45_' || gen_random_uuid(), 'Monaco Cheesling Jar 150gm (1*30) Mrp 125', 'c2', 'Parle', 112.1073, 112.11, 1, 1, 30, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Monaco Pizza 120gm (1*40) Mrp 70' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 62.7828, "discountedRate" = 62.78, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 40, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Monaco Pizza 120gm (1*40) Mrp 70' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_46_' || gen_random_uuid(), 'Monaco Pizza 120gm (1*40) Mrp 70', 'c2', 'Parle', 62.7828, 62.78, 1, 1, 40, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Monaco Sixer Jar 200gm (1*30) Mrp 150' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 134.5604, "discountedRate" = 134.56, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 30, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Monaco Sixer Jar 200gm (1*30) Mrp 150' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_47_' || gen_random_uuid(), 'Monaco Sixer Jar 200gm (1*30) Mrp 150', 'c2', 'Parle', 134.5604, 134.56, 1, 1, 30, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Murano Choco 75gm (1*48) Mrp 100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.6881, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 48, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Murano Choco 75gm (1*48) Mrp 100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_48_' || gen_random_uuid(), 'Murano Choco 75gm (1*48) Mrp 100', 'c2', 'Parle', 89.6881, 89.69, 1, 1, 48, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nice 75gm (1*80) Mrp 30' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 26.91, "discountedRate" = 26.91, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 80, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nice 75gm (1*80) Mrp 30' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_49_' || gen_random_uuid(), 'Nice 75gm (1*80) Mrp 30', 'c2', 'Parle', 26.91, 26.91, 1, 1, 80, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nutr Banana Cin Oat 75gm (1*60) Mrp 100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.6881, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 60, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nutr Banana Cin Oat 75gm (1*60) Mrp 100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_50_' || gen_random_uuid(), 'Nutr Banana Cin Oat 75gm (1*60) Mrp 100', 'c2', 'Parle', 89.6881, 89.69, 1, 1, 60, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nutr Choco Nut Oat 75gm (1*60) Mrp 100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.6881, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 60, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nutr Choco Nut Oat 75gm (1*60) Mrp 100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_51_' || gen_random_uuid(), 'Nutr Choco Nut Oat 75gm (1*60) Mrp 100', 'c2', 'Parle', 89.6881, 89.69, 1, 1, 60, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nutr Cran Nut Oat 75gm (1*60) Mrp 100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.6881, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 60, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nutr Cran Nut Oat 75gm (1*60) Mrp 100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_52_' || gen_random_uuid(), 'Nutr Cran Nut Oat 75gm (1*60) Mrp 100', 'c2', 'Parle', 89.6881, 89.69, 1, 1, 60, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nutri Crunch Cracker 200gm (1*20) Mrp 90' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 80.72, "discountedRate" = 80.72, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 20, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nutri Crunch Cracker 200gm (1*20) Mrp 90' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_53_' || gen_random_uuid(), 'Nutri Crunch Cracker 200gm (1*20) Mrp 90', 'c2', 'Parle', 80.72, 80.72, 1, 1, 20, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nutrivrunch Digestive 200gm (1*30) Mrp100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.69, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 30, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nutrivrunch Digestive 200gm (1*30) Mrp100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_54_' || gen_random_uuid(), 'Nutrivrunch Digestive 200gm (1*30) Mrp100', 'c2', 'Parle', 89.69, 89.69, 1, 1, 30, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Orange Bite 300gm (1*24)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 83.3714, "discountedRate" = 83.37, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Orange Bite 300gm (1*24)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_55_' || gen_random_uuid(), 'Orange Bite 300gm (1*24)', 'c2', 'Parle', 83.3714, 83.37, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Orange Bite 560gm (1*12)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 166.67, "discountedRate" = 166.67, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Orange Bite 560gm (1*12)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_56_' || gen_random_uuid(), 'Orange Bite 560gm (1*12)', 'c2', 'Parle', 166.67, 166.67, 1, 1, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Orange Cream 75gm (1*72) Mrp20' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 17.9444, "discountedRate" = 17.94, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 72, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Orange Cream 75gm (1*72) Mrp20' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_57_' || gen_random_uuid(), 'Orange Cream 75gm (1*72) Mrp20', 'c2', 'Parle', 17.9444, 17.94, 1, 1, 72, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Orange Kream 25gm (1*144) Mrp 9' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.0682, "discountedRate" = 8.07, 
      "orderMultiple" = 12, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Orange Kream 25gm (1*144) Mrp 9' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_58_' || gen_random_uuid(), 'Orange Kream 25gm (1*144) Mrp 9', 'c2', 'Parle', 8.0682, 8.07, 12, 12, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle G 21gm (1*360)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 4.48, "discountedRate" = 4.48, 
      "orderMultiple" = 30, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 30, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle G 21gm (1*360)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_59_' || gen_random_uuid(), 'Parle G 21gm (1*360)', 'c2', 'Parle', 4.48, 4.48, 30, 12, 30, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

