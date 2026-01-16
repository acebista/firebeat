-- SMART PRODUCT SYNC
UPDATE companies SET "isActive" = true WHERE id IN ('c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7');

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Black Bourboon Choco 100gm (1*36) Mrp65' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 58.2967, "discountedRate" = 58.3, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 36, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.016Z"}'
    WHERE name = 'Black Bourboon Choco 100gm (1*36) Mrp65' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_0_' || gen_random_uuid(), 'Black Bourboon Choco 100gm (1*36) Mrp65', 'c2', 'Parle', 58.2967, 58.3, 1, 1, 36, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.016Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Black Bourboon Vanilla 100gm(1*36) Mrp65' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 58.2967, "discountedRate" = 58.3, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 36, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Black Bourboon Vanilla 100gm(1*36) Mrp65' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_1_' || gen_random_uuid(), 'Black Bourboon Vanilla 100gm(1*36) Mrp65', 'c2', 'Parle', 58.2967, 58.3, 1, 1, 36, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Butter 20-20 25+5gm (1*144) Mrp 9' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.0682, "discountedRate" = 7.66, 
      "orderMultiple" = 12, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Butter 20-20 25+5gm (1*144) Mrp 9' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_2_' || gen_random_uuid(), 'Butter 20-20 25+5gm (1*144) Mrp 9', 'c2', 'Parle', 8.0682, 7.66, 12, 12, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Butter Cookies 200gm (1*50) Mrp 60' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 53.8219, "discountedRate" = 53.82, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 50, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Butter Cookies 200gm (1*50) Mrp 60' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_3_' || gen_random_uuid(), 'Butter Cookies 200gm (1*50) Mrp 60', 'c2', 'Parle', 53.8219, 53.82, 1, 1, 50, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Cashew 20-20 200gm (1x50) Mrp 70' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 62.7828, "discountedRate" = 62.78, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 50, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Cashew 20-20 200gm (1x50) Mrp 70' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_4_' || gen_random_uuid(), 'Cashew 20-20 200gm (1x50) Mrp 70', 'c2', 'Parle', 62.7828, 62.78, 1, 1, 50, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Cashew 20-20 60gm (1*144) Mrp20' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 17.9444, "discountedRate" = 17.05, 
      "orderMultiple" = 12, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Cashew 20-20 60gm (1*144) Mrp20' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_5_' || gen_random_uuid(), 'Cashew 20-20 60gm (1*144) Mrp20', 'c2', 'Parle', 17.9444, 17.05, 12, 12, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Cashew 20-20 75gm (1*72) Mrp25' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 22.4305, "discountedRate" = 21.31, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Cashew 20-20 75gm (1*72) Mrp25' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_6_' || gen_random_uuid(), 'Cashew 20-20 75gm (1*72) Mrp25', 'c2', 'Parle', 22.4305, 21.31, 1, 6, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Cream 105gm(1case*72pc) Mrp20' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 18.0009, "discountedRate" = 18, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 72, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Chocolate Cream 105gm(1case*72pc) Mrp20' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_7_' || gen_random_uuid(), 'Chocolate Cream 105gm(1case*72pc) Mrp20', 'c2', 'Parle', 18.0009, 18, 1, 1, 72, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Ellachi Gold 75gm (1x72) Mrp20' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 18.0009, "discountedRate" = 18, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 72, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Ellachi Gold 75gm (1x72) Mrp20' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_8_' || gen_random_uuid(), 'Ellachi Gold 75gm (1x72) Mrp20', 'c2', 'Parle', 18.0009, 18, 1, 1, 72, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Ellachi Kream 25+12.5gm (1*144) Mrp10' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.9948, "discountedRate" = 8.99, 
      "orderMultiple" = 12, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Ellachi Kream 25+12.5gm (1*144) Mrp10' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_9_' || gen_random_uuid(), 'Ellachi Kream 25+12.5gm (1*144) Mrp10', 'c2', 'Parle', 8.9948, 8.99, 12, 12, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Gauva Candy 280gm (1*24)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 83.3714, "discountedRate" = 83.37, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Gauva Candy 280gm (1*24)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_10_' || gen_random_uuid(), 'Gauva Candy 280gm (1*24)', 'c2', 'Parle', 83.3714, 83.37, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Gauva Candy 840gm (1*12 Jars)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 250.0464, "discountedRate" = 250.05, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Gauva Candy 840gm (1*12 Jars)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_11_' || gen_random_uuid(), 'Gauva Candy 840gm (1*12 Jars)', 'c2', 'Parle', 250.0464, 250.05, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Gauva Chilli 700gm (1*12 Jars)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 208.3946, "discountedRate" = 208.39, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Gauva Chilli 700gm (1*12 Jars)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_12_' || gen_random_uuid(), 'Gauva Chilli 700gm (1*12 Jars)', 'c2', 'Parle', 208.3946, 208.39, 1, 1, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s American Butter 200gm (1*36) Mrp100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.6881, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 36, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s American Butter 200gm (1*36) Mrp100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_13_' || gen_random_uuid(), 'H&s American Butter 200gm (1*36) Mrp100', 'c2', 'Parle', 89.6881, 89.69, 1, 1, 36, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Bourbon 60gm (1x120) Mrp20' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 17.94, "discountedRate" = 17.94, 
      "orderMultiple" = 12, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Bourbon 60gm (1x120) Mrp20' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_14_' || gen_random_uuid(), 'H&s Bourbon 60gm (1x120) Mrp20', 'c2', 'Parle', 17.94, 17.94, 12, 10, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Bourbon 30gm (1x12 Jars) Mrp10' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.97, "discountedRate" = 8.97, 
      "orderMultiple" = 25, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 25, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Bourbon 30gm (1x12 Jars) Mrp10' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_15_' || gen_random_uuid(), 'H&s Bourbon 30gm (1x12 Jars) Mrp10', 'c2', 'Parle', 8.97, 8.97, 25, 12, 25, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Cf Murano 75gm (1*48) Mrp100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.69, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 48, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Cf Murano 75gm (1*48) Mrp100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_16_' || gen_random_uuid(), 'H&s Cf Murano 75gm (1*48) Mrp100', 'c2', 'Parle', 89.69, 89.69, 1, 1, 48, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&S CF Choco and Hazel 60g (1*48) Mrp. 100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.69, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 48, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&S CF Choco and Hazel 60g (1*48) Mrp. 100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_17_' || gen_random_uuid(), 'H&S CF Choco and Hazel 60g (1*48) Mrp. 100', 'c2', 'Parle', 89.69, 89.69, 1, 1, 48, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Choco 412.5gm (1*12) Mrp250' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 224.2146, "discountedRate" = 224.21, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Choco 412.5gm (1*12) Mrp250' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_18_' || gen_random_uuid(), 'H&s Choco 412.5gm (1*12) Mrp250', 'c2', 'Parle', 224.2146, 224.21, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Choco Roll 125gm (1*48) Mrp125' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 112.1073, "discountedRate" = 112.11, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 48, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Choco Roll 125gm (1*48) Mrp125' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_19_' || gen_random_uuid(), 'H&s Choco Roll 125gm (1*48) Mrp125', 'c2', 'Parle', 112.1073, 112.11, 1, 1, 48, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

