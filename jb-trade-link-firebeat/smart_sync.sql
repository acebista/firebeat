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

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Fab 25gm Oraange 1*12 Mrp15' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 403.5908, "discountedRate" = 403.59, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Fab 25gm Oraange 1*12 Mrp15' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_20_' || gen_random_uuid(), 'H&s Fab 25gm Oraange 1*12 Mrp15', 'c2', 'Parle', 403.5908, 403.59, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Fab 25gm Vanilla 1*12 Mrp15' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 403.5908, "discountedRate" = 403.59, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Fab 25gm Vanilla 1*12 Mrp15' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_21_' || gen_random_uuid(), 'H&s Fab 25gm Vanilla 1*12 Mrp15', 'c2', 'Parle', 403.5908, 403.59, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Fab 25gm Straw 1*12 Mrp15' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 403.5908, "discountedRate" = 403.59, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Fab 25gm Straw 1*12 Mrp15' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_22_' || gen_random_uuid(), 'H&s Fab 25gm Straw 1*12 Mrp15', 'c2', 'Parle', 403.5908, 403.59, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Fab Choco 112gm (1x60) Mrp 65' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 58.308, "discountedRate" = 58.31, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 60, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Fab Choco 112gm (1x60) Mrp 65' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_23_' || gen_random_uuid(), 'H&s Fab Choco 112gm (1x60) Mrp 65', 'c2', 'Parle', 58.308, 58.31, 1, 1, 60, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'H&s Fab Straw 112gm (1x60) Mrp 65' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 58.308, "discountedRate" = 58.31, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 60, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'H&s Fab Straw 112gm (1x60) Mrp 65' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_24_' || gen_random_uuid(), 'H&s Fab Straw 112gm (1x60) Mrp 65', 'c2', 'Parle', 58.308, 58.31, 1, 1, 60, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Happy Happy 150g 1*36 Mrp50' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 44.8497, "discountedRate" = 42.61, 
      "orderMultiple" = 1, "packetsPerCarton" = 5, 
      "piecesPerPacket" = 36, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Happy Happy 150g 1*36 Mrp50' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_25_' || gen_random_uuid(), 'Happy Happy 150g 1*36 Mrp50', 'c2', 'Parle', 44.8497, 42.61, 1, 5, 36, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Happy Happy 60gm (1*96) Mrp 19' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 17.0404, "discountedRate" = 17.04, 
      "orderMultiple" = 12, "packetsPerCarton" = 8, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Happy Happy 60gm (1*96) Mrp 19' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_26_' || gen_random_uuid(), 'Happy Happy 60gm (1*96) Mrp 19', 'c2', 'Parle', 17.0404, 17.04, 12, 8, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Hide & Seek 121gm (1*72) Mrp 75' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 67.26, "discountedRate" = 67.26, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 72, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Hide & Seek 121gm (1*72) Mrp 75' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_27_' || gen_random_uuid(), 'Hide & Seek 121gm (1*72) Mrp 75', 'c2', 'Parle', 67.26, 67.26, 1, 1, 72, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Hide & Seek Jar 22gm (1*12) Mrp15' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 363.2611, "discountedRate" = 363.26, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Hide & Seek Jar 22gm (1*12) Mrp15' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_28_' || gen_random_uuid(), 'Hide & Seek Jar 22gm (1*12) Mrp15', 'c2', 'Parle', 363.2611, 363.26, 1, 1, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Imli Candy 280gm (1*24)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 83.3714, "discountedRate" = 83.37, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Imli Candy 280gm (1*24)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_29_' || gen_random_uuid(), 'Imli Candy 280gm (1*24)', 'c2', 'Parle', 83.3714, 83.37, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jam- In 150gm (1x30) Mrp70' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 62.7828, "discountedRate" = 62.78, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 30, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jam- In 150gm (1x30) Mrp70' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_30_' || gen_random_uuid(), 'Jam- In 150gm (1x30) Mrp70', 'c2', 'Parle', 62.7828, 62.78, 1, 1, 30, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kachha Mango 198gm (1x24)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 104.17, "discountedRate" = 104.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kachha Mango 198gm (1x24)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_31_' || gen_random_uuid(), 'Kachha Mango 198gm (1x24)', 'c2', 'Parle', 104.17, 104.17, 1, 1, 24, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Krack Jack 200gm (1*40) Mrp 90' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 80.72, "discountedRate" = 80.72, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 40, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Krack Jack 200gm (1*40) Mrp 90' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_32_' || gen_random_uuid(), 'Krack Jack 200gm (1*40) Mrp 90', 'c2', 'Parle', 80.72, 80.72, 1, 1, 40, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kream Gold Choco 333.3gm (1*12) Mrp100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.69, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kream Gold Choco 333.3gm (1*12) Mrp100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_33_' || gen_random_uuid(), 'Kream Gold Choco 333.3gm (1*12) Mrp100', 'c2', 'Parle', 89.69, 89.69, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Londan Darry 198gm (1x24)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 104.17, "discountedRate" = 104.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Londan Darry 198gm (1x24)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_34_' || gen_random_uuid(), 'Londan Darry 198gm (1x24)', 'c2', 'Parle', 104.17, 104.17, 1, 1, 24, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Magix Choco 60gm(1*144) Mrp15' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 12.5543, "discountedRate" = 12.55, 
      "orderMultiple" = 12, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Magix Choco 60gm(1*144) Mrp15' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_35_' || gen_random_uuid(), 'Magix Choco 60gm(1*144) Mrp15', 'c2', 'Parle', 12.5543, 12.55, 12, 12, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Mango Bite 280gm (1x24)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 83.3714, "discountedRate" = 83.37, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Mango Bite 280gm (1x24)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_36_' || gen_random_uuid(), 'Mango Bite 280gm (1x24)', 'c2', 'Parle', 83.3714, 83.37, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Mango Bite 560gm (1*12)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 166.67, "discountedRate" = 166.67, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Mango Bite 560gm (1*12)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_37_' || gen_random_uuid(), 'Mango Bite 560gm (1*12)', 'c2', 'Parle', 166.67, 166.67, 1, 1, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Mango Bite 750gm (1*12)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 208.33, "discountedRate" = 208.33, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Mango Bite 750gm (1*12)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_38_' || gen_random_uuid(), 'Mango Bite 750gm (1*12)', 'c2', 'Parle', 208.33, 208.33, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Marie 100gm (1*60pc) Mrp25' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 22.4192, "discountedRate" = 22.42, 
      "orderMultiple" = 10, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 10, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Marie 100gm (1*60pc) Mrp25' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_39_' || gen_random_uuid(), 'Marie 100gm (1*60pc) Mrp25', 'c2', 'Parle', 22.4192, 22.42, 10, 6, 10, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

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

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle-g 75+16gm (1*60) Mrp 19' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 17.0404, "discountedRate" = 17.04, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 60, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle-g 75+16gm (1*60) Mrp 19' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_60_' || gen_random_uuid(), 'Parle-g 75+16gm (1*60) Mrp 19', 'c2', 'Parle', 17.0404, 17.04, 1, 1, 60, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle-g Cinnamon 300gm (1*28) Mrp150' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 134.53, "discountedRate" = 134.53, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 28, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle-g Cinnamon 300gm (1*28) Mrp150' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_61_' || gen_random_uuid(), 'Parle-g Cinnamon 300gm (1*28) Mrp150', 'c2', 'Parle', 134.53, 134.53, 1, 1, 28, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle-g Cinnamon 93.75GX72P Mrp50' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 44.84304933, "discountedRate" = 44.84, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 72, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle-g Cinnamon 93.75GX72P Mrp50' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_62_' || gen_random_uuid(), 'Parle-g Cinnamon 93.75GX72P Mrp50', 'c2', 'Parle', 44.84304933, 44.84, 1, 1, 72, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle-g Gold 100gm (1*72) Mrp25' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 22.4305, "discountedRate" = 22.43, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle-g Gold 100gm (1*72) Mrp25' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_63_' || gen_random_uuid(), 'Parle-g Gold 100gm (1*72) Mrp25', 'c2', 'Parle', 22.4305, 22.43, 1, 6, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle-g Oats & Berri 93.75gm (1*72) Mrp50' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 44.843, "discountedRate" = 44.84, 
      "orderMultiple" = 1, "packetsPerCarton" = 3, 
      "piecesPerPacket" = 24, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle-g Oats & Berri 93.75gm (1*72) Mrp50' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_64_' || gen_random_uuid(), 'Parle-g Oats & Berri 93.75gm (1*72) Mrp50', 'c2', 'Parle', 44.843, 44.84, 1, 3, 24, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Rola.a Cola 300gm (1*24) Mrp 150' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 125, "discountedRate" = 125, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Rola.a Cola 300gm (1*24) Mrp 150' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_65_' || gen_random_uuid(), 'Rola.a Cola 300gm (1*24) Mrp 150', 'c2', 'Parle', 125, 125, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Rola.a Cola 800gm (1*12) Mrp 400' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 333.33, "discountedRate" = 333.33, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Rola.a Cola 800gm (1*12) Mrp 400' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_66_' || gen_random_uuid(), 'Rola.a Cola 800gm (1*12) Mrp 400', 'c2', 'Parle', 333.33, 333.33, 1, 1, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Royale 360gm (1*20) Mrp 200' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 179.4, "discountedRate" = 179.4, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 20, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Royale 360gm (1*20) Mrp 200' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_67_' || gen_random_uuid(), 'Royale 360gm (1*20) Mrp 200', 'c2', 'Parle', 179.4, 179.4, 1, 1, 20, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Rusk 182gm (1*36) Mrp 85' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 76.2298, "discountedRate" = 76.23, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 36, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Rusk 182gm (1*36) Mrp 85' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_68_' || gen_random_uuid(), 'Rusk 182gm (1*36) Mrp 85', 'c2', 'Parle', 76.2298, 76.23, 1, 1, 36, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Saunf Rusk 182gm (1*36) Mrp 85' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 76.2298, "discountedRate" = 76.23, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 36, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Saunf Rusk 182gm (1*36) Mrp 85' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_69_' || gen_random_uuid(), 'Saunf Rusk 182gm (1*36) Mrp 85', 'c2', 'Parle', 76.2298, 76.23, 1, 1, 36, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Saunf Rusk 546g (1*12) Mrp 250' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 224.22, "discountedRate" = 224.22, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Saunf Rusk 546g (1*12) Mrp 250' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_70_' || gen_random_uuid(), 'Saunf Rusk 546g (1*12) Mrp 250', 'c2', 'Parle', 224.22, 224.22, 1, 1, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Top 200gm (1*40) Mrp 60' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 53.8332, "discountedRate" = 53.83, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 40, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Top 200gm (1*40) Mrp 60' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_71_' || gen_random_uuid(), 'Top 200gm (1*40) Mrp 60', 'c2', 'Parle', 53.8332, 53.83, 1, 1, 40, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Monaco 300gm (1*20) Mrp 100' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 89.69, "discountedRate" = 89.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 20, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Monaco 300gm (1*20) Mrp 100' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_72_' || gen_random_uuid(), 'Monaco 300gm (1*20) Mrp 100', 'c2', 'Parle', 89.69, 89.69, 1, 1, 20, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Butter Cookies 150gm (1*50) Mrp 50' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 44.843, "discountedRate" = 42.6, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 50, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Butter Cookies 150gm (1*50) Mrp 50' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_73_' || gen_random_uuid(), 'Butter Cookies 150gm (1*50) Mrp 50', 'c2', 'Parle', 44.843, 42.6, 1, 1, 50, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nice 150gm (1*48) Mrp 60' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 53.83, "discountedRate" = 53.83, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 48, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nice 150gm (1*48) Mrp 60' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_74_' || gen_random_uuid(), 'Nice 150gm (1*48) Mrp 60', 'c2', 'Parle', 53.83, 53.83, 1, 1, 48, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle-g Oats & Berri 300gm (1*28) Mrp160' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 143.5, "discountedRate" = 143.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 28, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle-g Oats & Berri 300gm (1*28) Mrp160' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_75_' || gen_random_uuid(), 'Parle-g Oats & Berri 300gm (1*28) Mrp160', 'c2', 'Parle', 143.5, 143.5, 1, 1, 28, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nimbu Fresh 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 45.95, "discountedRate" = 45.95, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nimbu Fresh 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_76_' || gen_random_uuid(), 'Nimbu Fresh 250ml (1*16) Mrp 50', 'c7', 'Manakamana', 45.95, 45.95, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Lichee Drink 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 45.95, "discountedRate" = 45.95, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Lichee Drink 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_77_' || gen_random_uuid(), 'Lichee Drink 250ml (1*16) Mrp 50', 'c7', 'Manakamana', 45.95, 45.95, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Shikanji Masala 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 45.95, "discountedRate" = 45.95, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Shikanji Masala 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_78_' || gen_random_uuid(), 'Shikanji Masala 250ml (1*16) Mrp 50', 'c7', 'Manakamana', 45.95, 45.95, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Class Soda 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 45.95, "discountedRate" = 45.95, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Class Soda 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_79_' || gen_random_uuid(), 'Class Soda 250ml (1*16) Mrp 50', 'c7', 'Manakamana', 45.95, 45.95, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Peach Masti 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 45.95, "discountedRate" = 45.95, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Peach Masti 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_80_' || gen_random_uuid(), 'Peach Masti 250ml (1*16) Mrp 50', 'c7', 'Manakamana', 45.95, 45.95, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Mint Lemonade 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 45.95, "discountedRate" = 45.95, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Mint Lemonade 250ml (1*16) Mrp 50' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_81_' || gen_random_uuid(), 'Mint Lemonade 250ml (1*16) Mrp 50', 'c7', 'Manakamana', 45.95, 45.95, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nimbu Fresh 500ml (1*12) Mrp 85' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 77.5, "discountedRate" = 77.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nimbu Fresh 500ml (1*12) Mrp 85' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_82_' || gen_random_uuid(), 'Nimbu Fresh 500ml (1*12) Mrp 85', 'c7', 'Manakamana', 77.5, 77.5, 1, 12, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nimbu Fresh 1000ml (1*6) Mrp 130' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 119.17, "discountedRate" = 119.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nimbu Fresh 1000ml (1*6) Mrp 130' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_83_' || gen_random_uuid(), 'Nimbu Fresh 1000ml (1*6) Mrp 130', 'c7', 'Manakamana', 119.17, 119.17, 1, 6, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nimbu Fresh 2250ml (1*6) Mrp 270' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 254.5, "discountedRate" = 254.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nimbu Fresh 2250ml (1*6) Mrp 270' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_84_' || gen_random_uuid(), 'Nimbu Fresh 2250ml (1*6) Mrp 270', 'c7', 'Manakamana', 254.5, 254.5, 1, 6, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Class Soda 500ml (1*12) Mrp 70' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 64.17, "discountedRate" = 64.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Class Soda 500ml (1*12) Mrp 70' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_85_' || gen_random_uuid(), 'Class Soda 500ml (1*12) Mrp 70', 'c7', 'Manakamana', 64.17, 64.17, 1, 12, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Nimbu Fresh 250ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Nimbu Fresh 250ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_86_' || gen_random_uuid(), 'Free Nimbu Fresh 250ml', 'c7', 'Manakamana', 0, 0, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Lichee Drink 250ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Lichee Drink 250ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_87_' || gen_random_uuid(), 'Free Lichee Drink 250ml', 'c7', 'Manakamana', 0, 0, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Shikanji Masala 250ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Shikanji Masala 250ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_88_' || gen_random_uuid(), 'Free Shikanji Masala 250ml', 'c7', 'Manakamana', 0, 0, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Class Soda 250ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Class Soda 250ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_89_' || gen_random_uuid(), 'Free Class Soda 250ml', 'c7', 'Manakamana', 0, 0, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Peach Masti 250ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Peach Masti 250ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_90_' || gen_random_uuid(), 'Free Peach Masti 250ml', 'c7', 'Manakamana', 0, 0, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Mint Lemonade 250ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 16, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Mint Lemonade 250ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_91_' || gen_random_uuid(), 'Free Mint Lemonade 250ml', 'c7', 'Manakamana', 0, 0, 1, 16, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Nimbu Fresh 500ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Nimbu Fresh 500ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_92_' || gen_random_uuid(), 'Free Nimbu Fresh 500ml', 'c7', 'Manakamana', 0, 0, 1, 12, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Nimbu Fresh 1000ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Nimbu Fresh 1000ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_93_' || gen_random_uuid(), 'Free Nimbu Fresh 1000ml', 'c7', 'Manakamana', 0, 0, 1, 6, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Nimbu Fresh 2250ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Nimbu Fresh 2250ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_94_' || gen_random_uuid(), 'Free Nimbu Fresh 2250ml', 'c7', 'Manakamana', 0, 0, 1, 6, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Free Class Soda 500ml' AND "companyName" = 'Manakamana') THEN
    UPDATE products SET 
      "baseRate" = 0, "discountedRate" = 0, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Free Class Soda 500ml' AND "companyName" = 'Manakamana';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_95_' || gen_random_uuid(), 'Free Class Soda 500ml', 'c7', 'Manakamana', 0, 0, 1, 12, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Chilly 500gm (1*50) Mrp 350' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 284.44, "discountedRate" = 284.44, 
      "orderMultiple" = 1, "packetsPerCarton" = 50, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Chilly 500gm (1*50) Mrp 350' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_96_' || gen_random_uuid(), 'Jasmine Chilly 500gm (1*50) Mrp 350', 'c1', 'Jasmine Masala', 284.44, 284.44, 1, 50, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Chilly 200gm (1*10)(1*100) Mrp 150' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 113.76, "discountedRate" = 113.76, 
      "orderMultiple" = 10, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 100, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Chilly 200gm (1*10)(1*100) Mrp 150' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_97_' || gen_random_uuid(), 'Jasmine Chilly 200gm (1*10)(1*100) Mrp 150', 'c1', 'Jasmine Masala', 113.76, 113.76, 10, 10, 100, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Chilly 100gm (1*20)(1*200) Mrp 75' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 56.88, "discountedRate" = 56.88, 
      "orderMultiple" = 20, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 20, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Chilly 100gm (1*20)(1*200) Mrp 75' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_98_' || gen_random_uuid(), 'Jasmine Chilly 100gm (1*20)(1*200) Mrp 75', 'c1', 'Jasmine Masala', 56.88, 56.88, 20, 10, 20, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Chilly 25gm (1*25)(1*500) Mrp 25' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 18.79, "discountedRate" = 18.79, 
      "orderMultiple" = 25, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 25, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Chilly 25gm (1*25)(1*500) Mrp 25' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_99_' || gen_random_uuid(), 'Jasmine Chilly 25gm (1*25)(1*500) Mrp 25', 'c1', 'Jasmine Masala', 18.79, 18.79, 25, 20, 25, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Kasmiri Mirch 50gm (1*200) Mrp 120' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 81.27, "discountedRate" = 81.27, 
      "orderMultiple" = 1, "packetsPerCarton" = 200, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Kasmiri Mirch 50gm (1*200) Mrp 120' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_100_' || gen_random_uuid(), 'Jasmine Kasmiri Mirch 50gm (1*200) Mrp 120', 'c1', 'Jasmine Masala', 81.27, 81.27, 1, 200, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Mix Masala 500gm (1*50) Mrp 345' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 280, "discountedRate" = 280, 
      "orderMultiple" = 1, "packetsPerCarton" = 50, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Mix Masala 500gm (1*50) Mrp 345' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_101_' || gen_random_uuid(), 'Jasmine Mix Masala 500gm (1*50) Mrp 345', 'c1', 'Jasmine Masala', 280, 280, 1, 50, 1, true, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Mix Masala 200gm (1*10)(1*100) Mrp 140' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 111.99, "discountedRate" = 111.99, 
      "orderMultiple" = 10, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 10, "stockOut" = true, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Mix Masala 200gm (1*10)(1*100) Mrp 140' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_102_' || gen_random_uuid(), 'Jasmine Mix Masala 200gm (1*10)(1*100) Mrp 140', 'c1', 'Jasmine Masala', 111.99, 111.99, 10, 10, 10, true, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Mix Masala 100gm (1*20)(1*200) Mrp 70' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 56, "discountedRate" = 56, 
      "orderMultiple" = 20, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 20, "stockOut" = true, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Mix Masala 100gm (1*20)(1*200) Mrp 70' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_103_' || gen_random_uuid(), 'Jasmine Mix Masala 100gm (1*20)(1*200) Mrp 70', 'c1', 'Jasmine Masala', 56, 56, 20, 10, 20, true, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Mix Masala 25gm (1*25)(1*500) Mrp 25' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 18.79, "discountedRate" = 18.79, 
      "orderMultiple" = 25, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 25, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Mix Masala 25gm (1*25)(1*500) Mrp 25' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_104_' || gen_random_uuid(), 'Jasmine Mix Masala 25gm (1*25)(1*500) Mrp 25', 'c1', 'Jasmine Masala', 18.79, 18.79, 25, 20, 25, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Meat Masala 50gm (1*200) Mrp 70' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 47.5, "discountedRate" = 47.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 200, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Meat Masala 50gm (1*200) Mrp 70' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_105_' || gen_random_uuid(), 'Jasmine Meat Masala 50gm (1*200) Mrp 70', 'c1', 'Jasmine Masala', 47.5, 47.5, 1, 200, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Chicken Masala 50gm (1*200) Mrp 70' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 47.5, "discountedRate" = 47.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 200, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Chicken Masala 50gm (1*200) Mrp 70' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_106_' || gen_random_uuid(), 'Jasmine Chicken Masala 50gm (1*200) Mrp 70', 'c1', 'Jasmine Masala', 47.5, 47.5, 1, 200, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Momo Masala 50gm (1*200) Mrp 70' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 47.5, "discountedRate" = 47.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 200, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Momo Masala 50gm (1*200) Mrp 70' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_107_' || gen_random_uuid(), 'Jasmine Momo Masala 50gm (1*200) Mrp 70', 'c1', 'Jasmine Masala', 47.5, 47.5, 1, 200, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Turmeric 500gm (1*50) Mrp 315' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 258.5, "discountedRate" = 258.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 40, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Turmeric 500gm (1*50) Mrp 315' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_108_' || gen_random_uuid(), 'Jasmine Turmeric 500gm (1*50) Mrp 315', 'c1', 'Jasmine Masala', 258.5, 258.5, 1, 40, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Turmeric 200gm (1*10)(1*100) Mrp 125' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 103.4, "discountedRate" = 103.4, 
      "orderMultiple" = 10, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 10, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Turmeric 200gm (1*10)(1*100) Mrp 125' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_109_' || gen_random_uuid(), 'Jasmine Turmeric 200gm (1*10)(1*100) Mrp 125', 'c1', 'Jasmine Masala', 103.4, 103.4, 10, 10, 10, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Turmeric 100gm (1*20)(1*200) Mrp 65' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 51.7, "discountedRate" = 51.7, 
      "orderMultiple" = 20, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 20, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Turmeric 100gm (1*20)(1*200) Mrp 65' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_110_' || gen_random_uuid(), 'Jasmine Turmeric 100gm (1*20)(1*200) Mrp 65', 'c1', 'Jasmine Masala', 51.7, 51.7, 20, 10, 20, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Turmeric 25gm (1*25)(1*500) Mrp 25' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 18.8, "discountedRate" = 18.8, 
      "orderMultiple" = 25, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 25, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Turmeric 25gm (1*25)(1*500) Mrp 25' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_111_' || gen_random_uuid(), 'Jasmine Turmeric 25gm (1*25)(1*500) Mrp 25', 'c1', 'Jasmine Masala', 18.8, 18.8, 25, 20, 25, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nabil SF DIgestive 250 gm Mrp 250 (1*24)' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 220, "discountedRate" = 220, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nabil SF DIgestive 250 gm Mrp 250 (1*24)' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_112_' || gen_random_uuid(), 'Nabil SF DIgestive 250 gm Mrp 250 (1*24)', 'c4', 'Bimal Trade', 220, 220, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Gusto Donut - Caramel Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 35, "discountedRate" = 35, 
      "orderMultiple" = 24, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Gusto Donut - Caramel Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_113_' || gen_random_uuid(), 'Gusto Donut - Caramel Mrp 40 (1*24)(1*144)', 'c4', 'Bimal Trade', 35, 35, 24, 6, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Gusto Roll - Banana Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 35, "discountedRate" = 35, 
      "orderMultiple" = 24, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Gusto Roll - Banana Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_114_' || gen_random_uuid(), 'Gusto Roll - Banana Mrp 40 (1*24)(1*144)', 'c4', 'Bimal Trade', 35, 35, 24, 6, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Gusto Roll - Strawberry Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 35, "discountedRate" = 35, 
      "orderMultiple" = 24, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Gusto Roll - Strawberry Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_115_' || gen_random_uuid(), 'Gusto Roll - Strawberry Mrp 40 (1*24)(1*144)', 'c4', 'Bimal Trade', 35, 35, 24, 6, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Gusto Roll - Milk Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 35, "discountedRate" = 35, 
      "orderMultiple" = 24, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Gusto Roll - Milk Mrp 40 (1*24)(1*144)' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_116_' || gen_random_uuid(), 'Gusto Roll - Milk Mrp 40 (1*24)(1*144)', 'c4', 'Bimal Trade', 35, 35, 24, 6, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Amrapali Recharge 330 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 84.56232583, "discountedRate" = 84.56, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Amrapali Recharge 330 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_117_' || gen_random_uuid(), 'Amrapali Recharge 330 ML (1*24)', 'c6', 'Amrapali', 84.56232583, 84.56, 1, 24, 1, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Amrapali Kool Badam Drink 180 ML (1*48)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 64.1667675, "discountedRate" = 64.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 48, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Amrapali Kool Badam Drink 180 ML (1*48)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_118_' || gen_random_uuid(), 'Amrapali Kool Badam Drink 180 ML (1*48)', 'c6', 'Amrapali', 64.1667675, 64.17, 1, 48, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kool Mango 180ML (1*30)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 16.86668133, "discountedRate" = 16.87, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kool Mango 180ML (1*30)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_119_' || gen_random_uuid(), 'Kool Mango 180ML (1*30)', 'c6', 'Amrapali', 16.86668133, 16.87, 1, 30, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kool Apple Drink 180ML (1*30)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 16.86668133, "discountedRate" = 16.87, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kool Apple Drink 180ML (1*30)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_120_' || gen_random_uuid(), 'Kool Apple Drink 180ML (1*30)', 'c6', 'Amrapali', 16.86668133, 16.87, 1, 30, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kool Guava Drink 180ML (1*30)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 16.86668133, "discountedRate" = 16.87, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kool Guava Drink 180ML (1*30)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_121_' || gen_random_uuid(), 'Kool Guava Drink 180ML (1*30)', 'c6', 'Amrapali', 16.86668133, 16.87, 1, 30, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kool Pineapple Drink 180ML(1 *30)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 16.86668133, "discountedRate" = 16.87, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kool Pineapple Drink 180ML(1 *30)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_122_' || gen_random_uuid(), 'Kool Pineapple Drink 180ML(1 *30)', 'c6', 'Amrapali', 16.86668133, 16.87, 1, 30, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kool Litchi Drink 125ML (1*72)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 13.29164069, "discountedRate" = 13.29, 
      "orderMultiple" = 1, "packetsPerCarton" = 72, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kool Litchi Drink 125ML (1*72)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_123_' || gen_random_uuid(), 'Kool Litchi Drink 125ML (1*72)', 'c6', 'Amrapali', 13.29164069, 13.29, 1, 72, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO BLACK CURRANT 320 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.85, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO BLACK CURRANT 320 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_124_' || gen_random_uuid(), 'KOOL-COCO BLACK CURRANT 320 ML (1*24)', 'c6', 'Amrapali', 101.8519379, 101.85, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO MANGO DRINKS 320 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.85, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO MANGO DRINKS 320 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_125_' || gen_random_uuid(), 'KOOL-COCO MANGO DRINKS 320 ML (1*24)', 'c6', 'Amrapali', 101.8519379, 101.85, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO KIWI 320 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.85, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO KIWI 320 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_126_' || gen_random_uuid(), 'KOOL-COCO KIWI 320 ML (1*24)', 'c6', 'Amrapali', 101.8519379, 101.85, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO LITCHI DRINKS 320 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.85, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO LITCHI DRINKS 320 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_127_' || gen_random_uuid(), 'KOOL-COCO LITCHI DRINKS 320 ML (1*24)', 'c6', 'Amrapali', 101.8519379, 101.85, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO PINEAPPLE DRINKS 320 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.85, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO PINEAPPLE DRINKS 320 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_128_' || gen_random_uuid(), 'KOOL-COCO PINEAPPLE DRINKS 320 ML (1*24)', 'c6', 'Amrapali', 101.8519379, 101.85, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Hide & Seek 82.5gm (1*60) Mrp 50' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 44.843, "discountedRate" = 44.84, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Hide & Seek 82.5gm (1*60) Mrp 50' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_129_' || gen_random_uuid(), 'Hide & Seek 82.5gm (1*60) Mrp 50', 'c2', 'Parle', 44.843, 44.84, 1, 60, 1, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nutrivrunch Digestive 100gm (1*60) Mrp40' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 35.9, "discountedRate" = 35.9, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nutrivrunch Digestive 100gm (1*60) Mrp40' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_130_' || gen_random_uuid(), 'Nutrivrunch Digestive 100gm (1*60) Mrp40', 'c2', 'Parle', 35.9, 35.9, 1, 60, 1, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Ellachi Kream 30gm (1*144) Mrp9' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.0682, "discountedRate" = 8.07, 
      "orderMultiple" = 12, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Ellachi Kream 30gm (1*144) Mrp9' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_131_' || gen_random_uuid(), 'Ellachi Kream 30gm (1*144) Mrp9', 'c2', 'Parle', 8.0682, 8.07, 12, 12, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Ruchi Mango 180 ML (1*30)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 16.13, "discountedRate" = 16.13, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Ruchi Mango 180 ML (1*30)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_132_' || gen_random_uuid(), 'Ruchi Mango 180 ML (1*30)', 'c6', 'Amrapali', 16.13, 16.13, 1, 30, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Red Rhino 250 ML (1* 24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 64.17, "discountedRate" = 64.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Red Rhino 250 ML (1* 24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_133_' || gen_random_uuid(), 'Red Rhino 250 ML (1* 24)', 'c6', 'Amrapali', 64.17, 64.17, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Spray Lush Green 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Spray Lush Green 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_134_' || gen_random_uuid(), 'Aer Spray Lush Green 220ml - MRP 99 (1*24)', 'c3', 'Godrej', 137.868588, 124.08, 1, 24, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Spray Jasmine Delight 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Spray Jasmine Delight 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_135_' || gen_random_uuid(), 'Aer Spray Jasmine Delight 220ml - MRP 99 (1*24)', 'c3', 'Godrej', 137.868588, 124.08, 1, 24, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer spray musk - 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer spray musk - 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_136_' || gen_random_uuid(), 'Aer spray musk - 220ml - MRP 99 (1*24)', 'c3', 'Godrej', 137.868588, 124.08, 1, 24, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Spray Rose Blossom 220ml MRP 99 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Spray Rose Blossom 220ml MRP 99 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_137_' || gen_random_uuid(), 'Aer Spray Rose Blossom 220ml MRP 99 (1*24)', 'c3', 'Godrej', 137.868588, 124.08, 1, 24, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Spray Lavender Bloom 220ml MRP 99 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Spray Lavender Bloom 220ml MRP 99 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_138_' || gen_random_uuid(), 'Aer Spray Lavender Bloom 220ml MRP 99 (1*24)', 'c3', 'Godrej', 137.868588, 124.08, 1, 24, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'AER MATIC COMBI-VT VL BLM 210 ML (1*6)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 764.543988, "discountedRate" = 688.09, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'AER MATIC COMBI-VT VL BLM 210 ML (1*6)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_139_' || gen_random_uuid(), 'AER MATIC COMBI-VT VL BLM 210 ML (1*6)', 'c3', 'Godrej', 764.543988, 688.09, 1, 6, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'AER MATIC COMBI-PINK 210ML (1*6)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 764.543988, "discountedRate" = 688.09, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'AER MATIC COMBI-PINK 210ML (1*6)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_140_' || gen_random_uuid(), 'AER MATIC COMBI-PINK 210ML (1*6)', 'c3', 'Godrej', 764.543988, 688.09, 1, 6, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'AER MATIC COMBI-BLUE 210ML (1*6)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 764.543988, "discountedRate" = 688.09, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'AER MATIC COMBI-BLUE 210ML (1*6)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_141_' || gen_random_uuid(), 'AER MATIC COMBI-BLUE 210ML (1*6)', 'c3', 'Godrej', 764.543988, 688.09, 1, 6, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RICH CREAM 11 GM BURGUNDY - MINI PACK (1*10)(1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 20.893248, "discountedRate" = 18.39, 
      "orderMultiple" = 10, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"12","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'RICH CREAM 11 GM BURGUNDY - MINI PACK (1*10)(1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_142_' || gen_random_uuid(), 'RICH CREAM 11 GM BURGUNDY - MINI PACK (1*10)(1*240)', 'c3', 'Godrej', 20.893248, 18.39, 10, 240, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"12","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RICH CREAM 11GM NAT. BLACK - MINI PACK (1*10)(1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 20.893248, "discountedRate" = 18.39, 
      "orderMultiple" = 10, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"12","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'RICH CREAM 11GM NAT. BLACK - MINI PACK (1*10)(1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_143_' || gen_random_uuid(), 'RICH CREAM 11GM NAT. BLACK - MINI PACK (1*10)(1*240)', 'c3', 'Godrej', 20.893248, 18.39, 10, 240, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"12","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RICH CREAM DARK. BROWN INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 51.525288, "discountedRate" = 44.83, 
      "orderMultiple" = 10, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'RICH CREAM DARK. BROWN INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_144_' || gen_random_uuid(), 'RICH CREAM DARK. BROWN INR 37 (1*10)(1*240)', 'c3', 'Godrej', 51.525288, 44.83, 10, 240, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RICH CREAM NAT. BROWN INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 51.525288, "discountedRate" = 44.83, 
      "orderMultiple" = 10, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'RICH CREAM NAT. BROWN INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_145_' || gen_random_uuid(), 'RICH CREAM NAT. BROWN INR 37 (1*10)(1*240)', 'c3', 'Godrej', 51.525288, 44.83, 10, 240, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RICH CREAM NAT. BLACK INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 51.525288, "discountedRate" = 44.83, 
      "orderMultiple" = 10, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'RICH CREAM NAT. BLACK INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_146_' || gen_random_uuid(), 'RICH CREAM NAT. BLACK INR 37 (1*10)(1*240)', 'c3', 'Godrej', 51.525288, 44.83, 10, 240, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PHC BLACK- MRP 220 (1*90)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 306.369216, "discountedRate" = 269.6, 
      "orderMultiple" = 1, "packetsPerCarton" = 90, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"12","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'PHC BLACK- MRP 220 (1*90)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_147_' || gen_random_uuid(), 'PHC BLACK- MRP 220 (1*90)', 'c3', 'Godrej', 306.369216, 269.6, 1, 90, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"12","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NUPUR MEHANDI 500 GM MRP 230 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 320.29, "discountedRate" = 307.48, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"4","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NUPUR MEHANDI 500 GM MRP 230 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_148_' || gen_random_uuid(), 'NUPUR MEHANDI 500 GM MRP 230 (1*24)', 'c3', 'Godrej', 320.29, 307.48, 1, 24, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"4","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NUPUR MEHANDI 75 GM MRP-40 (1*180)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 55.699056, "discountedRate" = 51.24, 
      "orderMultiple" = 1, "packetsPerCarton" = 180, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NUPUR MEHANDI 75 GM MRP-40 (1*180)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_149_' || gen_random_uuid(), 'NUPUR MEHANDI 75 GM MRP-40 (1*180)', 'c3', 'Godrej', 55.699056, 51.24, 1, 180, 1, true, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Spray Cool Aqua 220ml (MRP 99)  (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Spray Cool Aqua 220ml (MRP 99)  (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_150_' || gen_random_uuid(), 'Aer Spray Cool Aqua 220ml (MRP 99)  (1*24)', 'c3', 'Godrej', 137.868588, 124.08, 1, 24, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NUPUR MEHANDI 150 GM (MRP 80)  (1*72)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 111.410316, "discountedRate" = 106.95, 
      "orderMultiple" = 1, "packetsPerCarton" = 72, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"4","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NUPUR MEHANDI 150 GM (MRP 80)  (1*72)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_151_' || gen_random_uuid(), 'NUPUR MEHANDI 150 GM (MRP 80)  (1*72)', 'c3', 'Godrej', 111.410316, 106.95, 1, 72, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"4","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'EXPERT EASY 5 MIN HAIR COLOUR-NAT BLACK (SELFIE) (1*10)(1*360)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 20.893248, "discountedRate" = 17.76, 
      "orderMultiple" = 10, "packetsPerCarton" = 360, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'EXPERT EASY 5 MIN HAIR COLOUR-NAT BLACK (SELFIE) (1*10)(1*360)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_152_' || gen_random_uuid(), 'EXPERT EASY 5 MIN HAIR COLOUR-NAT BLACK (SELFIE) (1*10)(1*360)', 'c3', 'Godrej', 20.893248, 17.76, 10, 360, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL BLUE 725 ML MRP-99 (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 144.14, "discountedRate" = 129.73, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL BLUE 725 ML MRP-99 (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_153_' || gen_random_uuid(), 'PROTEKT GERM FIGHT HANDWASH REFILL BLUE 725 ML MRP-99 (1*18)', 'c3', 'Godrej', 144.14, 129.73, 1, 18, 1, true, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL LIME & EUCALYPTUS 725 ML (MRP-99) (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 144.14, "discountedRate" = 129.73, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL LIME & EUCALYPTUS 725 ML (MRP-99) (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_154_' || gen_random_uuid(), 'PROTEKT GERM FIGHT HANDWASH REFILL LIME & EUCALYPTUS 725 ML (MRP-99) (1*18)', 'c3', 'Godrej', 144.14, 129.73, 1, 18, 1, true, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 100GM (SANDAL & TURMERIC) PO4 - NPR 160 (1*4)(1*36)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 36.364869, "discountedRate" = 30.91, 
      "orderMultiple" = 4, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 4, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 100GM (SANDAL & TURMERIC) PO4 - NPR 160 (1*4)(1*36)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_155_' || gen_random_uuid(), 'NO. 1 SOAP 100GM (SANDAL & TURMERIC) PO4 - NPR 160 (1*4)(1*36)', 'c3', 'Godrej', 36.364869, 30.91, 4, 36, 4, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 100GM (ROSEWATER & ALMOND) PO4 - NPR 160 (1*4)(1*36)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 36.364869, "discountedRate" = 30.91, 
      "orderMultiple" = 4, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 4, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 100GM (ROSEWATER & ALMOND) PO4 - NPR 160 (1*4)(1*36)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_156_' || gen_random_uuid(), 'NO. 1 SOAP 100GM (ROSEWATER & ALMOND) PO4 - NPR 160 (1*4)(1*36)', 'c3', 'Godrej', 36.364869, 30.91, 4, 36, 4, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT CHALK -MRP 20 (1*12)(1*360)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 29.12, "discountedRate" = 24.27, 
      "orderMultiple" = 12, "packetsPerCarton" = 360, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT CHALK -MRP 20 (1*12)(1*360)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_157_' || gen_random_uuid(), 'HIT CHALK -MRP 20 (1*12)(1*360)', 'c3', 'Godrej', 29.12, 24.27, 12, 360, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT CIK RED- 625 ML-MRP 260 (1*25)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 378.54, "discountedRate" = 340.69, 
      "orderMultiple" = 1, "packetsPerCarton" = 25, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT CIK RED- 625 ML-MRP 260 (1*25)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_158_' || gen_random_uuid(), 'HIT CIK RED- 625 ML-MRP 260 (1*25)', 'c3', 'Godrej', 378.54, 340.69, 1, 25, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT CIK  RED-400 ML- MRP 189 (1*36)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 275.17, "discountedRate" = 247.65, 
      "orderMultiple" = 1, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT CIK  RED-400 ML- MRP 189 (1*36)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_159_' || gen_random_uuid(), 'HIT CIK  RED-400 ML- MRP 189 (1*36)', 'c3', 'Godrej', 275.17, 247.65, 1, 36, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT FIK BLACK-400 ML-MRP 180 (1*36)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 262.068696, "discountedRate" = 235.86, 
      "orderMultiple" = 1, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT FIK BLACK-400 ML-MRP 180 (1*36)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_160_' || gen_random_uuid(), 'HIT FIK BLACK-400 ML-MRP 180 (1*36)', 'c3', 'Godrej', 262.068696, 235.86, 1, 36, 1, true, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT FIK BLACK-625 ML-MRP 250 (1*25)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 363.98, "discountedRate" = 327.58, 
      "orderMultiple" = 1, "packetsPerCarton" = 25, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT FIK BLACK-625 ML-MRP 250 (1*25)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_161_' || gen_random_uuid(), 'HIT FIK BLACK-625 ML-MRP 250 (1*25)', 'c3', 'Godrej', 363.98, 327.58, 1, 25, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT FIK BLACK-200 ML-MRP 115 (1*60)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 174.7090909, "discountedRate" = 152.87, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"12.5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT FIK BLACK-200 ML-MRP 115 (1*60)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_162_' || gen_random_uuid(), 'HIT FIK BLACK-200 ML-MRP 115 (1*60)', 'c3', 'Godrej', 174.7090909, 152.87, 1, 60, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"12.5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT CIK RED-200 ML-MRP 99 (1*60)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 144.14, "discountedRate" = 129.73, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT CIK RED-200 ML-MRP 99 (1*60)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_163_' || gen_random_uuid(), 'HIT CIK RED-200 ML-MRP 99 (1*60)', 'c3', 'Godrej', 144.14, 129.73, 1, 60, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RAT KILL 25 GM MRP 25 (1*12)(1*360)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 36.4, "discountedRate" = 30.33, 
      "orderMultiple" = 12, "packetsPerCarton" = 360, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'RAT KILL 25 GM MRP 25 (1*12)(1*360)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_164_' || gen_random_uuid(), 'RAT KILL 25 GM MRP 25 (1*12)(1*360)', 'c3', 'Godrej', 36.4, 30.33, 12, 360, 1, true, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT ANTI ROACH GEL - MRP 220 (1*30)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 320.29398, "discountedRate" = 280.26, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 5, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"12.5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'HIT ANTI ROACH GEL - MRP 220 (1*30)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_165_' || gen_random_uuid(), 'HIT ANTI ROACH GEL - MRP 220 (1*30)', 'c3', 'Godrej', 320.29398, 280.26, 1, 30, 1, false, true, false, true, 5, 1, 0, 0, '{"productDiscountPct":"12.5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GK FLASH COMBI - MRP 95 (1*60)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 138.31, "discountedRate" = 128.63, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'GK FLASH COMBI - MRP 95 (1*60)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_166_' || gen_random_uuid(), 'GK FLASH COMBI - MRP 95 (1*60)', 'c3', 'Godrej', 138.31, 128.63, 1, 60, 1, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GK FLASH REFILL 45ML (240) - MRP 85 (1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 123.75, "discountedRate" = 111.38, 
      "orderMultiple" = 1, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'GK FLASH REFILL 45ML (240) - MRP 85 (1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_167_' || gen_random_uuid(), 'GK FLASH REFILL 45ML (240) - MRP 85 (1*240)', 'c3', 'Godrej', 123.75, 111.38, 1, 240, 1, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GOODNIGHT NAT. NEEM AGARBATI - MRP 10 (1*12)(1*288)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 17.47, "discountedRate" = 13.98, 
      "orderMultiple" = 12, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 6, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'GOODNIGHT NAT. NEEM AGARBATI - MRP 10 (1*12)(1*288)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_168_' || gen_random_uuid(), 'GOODNIGHT NAT. NEEM AGARBATI - MRP 10 (1*12)(1*288)', 'c3', 'Godrej', 17.47, 13.98, 12, 24, 12, false, true, false, true, 6, 1, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GK MINI JUMBO PLAIN COIL - MRP 35 (1*60)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 50.96, "discountedRate" = 43.68, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"14.29","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'GK MINI JUMBO PLAIN COIL - MRP 35 (1*60)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_169_' || gen_random_uuid(), 'GK MINI JUMBO PLAIN COIL - MRP 35 (1*60)', 'c3', 'Godrej', 50.96, 43.68, 1, 60, 1, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"14.29","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'ParkAvenue Voyage 18ml Pocket Perfume MRP 60 (1*8)(1*80)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 83.56, "discountedRate" = 66.85, 
      "orderMultiple" = 8, "packetsPerCarton" = 80, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'ParkAvenue Voyage 18ml Pocket Perfume MRP 60 (1*8)(1*80)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_170_' || gen_random_uuid(), 'ParkAvenue Voyage 18ml Pocket Perfume MRP 60 (1*8)(1*80)', 'c3', 'Godrej', 83.56, 66.85, 8, 80, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'ParkAvenue Perfume Pocket Good Morning 18ml MRP 70 (1*8)(1*80)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 97.485552, "discountedRate" = 73.11, 
      "orderMultiple" = 8, "packetsPerCarton" = 80, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 7, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"25","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'ParkAvenue Perfume Pocket Good Morning 18ml MRP 70 (1*8)(1*80)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_171_' || gen_random_uuid(), 'ParkAvenue Perfume Pocket Good Morning 18ml MRP 70 (1*8)(1*80)', 'c3', 'Godrej', 97.485552, 73.11, 8, 80, 1, false, true, false, true, 7, 1, 0, 0, '{"productDiscountPct":"25","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GODREJ FAB LIQUID DETERGENT 1L POUCH - MRP 250 (1*12)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 227.275092, "discountedRate" = 211.37, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 6, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'GODREJ FAB LIQUID DETERGENT 1L POUCH - MRP 250 (1*12)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_172_' || gen_random_uuid(), 'GODREJ FAB LIQUID DETERGENT 1L POUCH - MRP 250 (1*12)', 'c3', 'Godrej', 227.275092, 211.37, 1, 12, 1, false, true, false, true, 6, 1, 0, 0, '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'EZEE 1000 GM- MRP 225 (1*12)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 327.579768, "discountedRate" = 311.2, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'EZEE 1000 GM- MRP 225 (1*12)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_173_' || gen_random_uuid(), 'EZEE 1000 GM- MRP 225 (1*12)', 'c3', 'Godrej', 327.579768, 311.2, 1, 12, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'EZEE 500 GM -MRP 120 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 174.712464, "discountedRate" = 165.98, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'EZEE 500 GM -MRP 120 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_174_' || gen_random_uuid(), 'EZEE 500 GM -MRP 120 (1*24)', 'c3', 'Godrej', 174.712464, 165.98, 1, 24, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'EZEE 2 KG POUCH - MRP 430 (1*6)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 626.040792, "discountedRate" = 594.74, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'EZEE 2 KG POUCH - MRP 430 (1*6)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_175_' || gen_random_uuid(), 'EZEE 2 KG POUCH - MRP 430 (1*6)', 'c3', 'Godrej', 626.040792, 594.74, 1, 6, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"5","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GODREJ FAB LIQUID DETERGENT 2L POUCH- MRP 500 (1*6)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 454.550184, "discountedRate" = 422.73, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'GODREJ FAB LIQUID DETERGENT 2L POUCH- MRP 500 (1*6)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_176_' || gen_random_uuid(), 'GODREJ FAB LIQUID DETERGENT 2L POUCH- MRP 500 (1*6)', 'c3', 'Godrej', 454.550184, 422.73, 1, 6, 1, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Power Pocket - Lemon Tangy Delight- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 90.52, "discountedRate" = 81.47, 
      "orderMultiple" = 6, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 6, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Power Pocket - Lemon Tangy Delight- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_177_' || gen_random_uuid(), 'Aer Power Pocket - Lemon Tangy Delight- MRP 65 (1*6) (1*120)', 'c3', 'Godrej', 90.52, 81.47, 6, 20, 6, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Power Pocket - Berry Rush- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 90.52, "discountedRate" = 81.47, 
      "orderMultiple" = 6, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 6, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Power Pocket - Berry Rush- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_178_' || gen_random_uuid(), 'Aer Power Pocket - Berry Rush- MRP 65 (1*6) (1*120)', 'c3', 'Godrej', 90.52, 81.47, 6, 20, 6, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Power Pocket - Floral Delight - MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 90.52, "discountedRate" = 81.47, 
      "orderMultiple" = 6, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 6, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Power Pocket - Floral Delight - MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_179_' || gen_random_uuid(), 'Aer Power Pocket - Floral Delight - MRP 65 (1*6) (1*120)', 'c3', 'Godrej', 90.52, 81.47, 6, 20, 6, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Power Pocket- lavenderBloom- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 90.52, "discountedRate" = 81.47, 
      "orderMultiple" = 6, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 6, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Power Pocket- lavenderBloom- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_180_' || gen_random_uuid(), 'Aer Power Pocket- lavenderBloom- MRP 65 (1*6) (1*120)', 'c3', 'Godrej', 90.52, 81.47, 6, 20, 6, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Power Pocket - Fresh Blossom- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 90.52, "discountedRate" = 81.47, 
      "orderMultiple" = 6, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 6, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Power Pocket - Fresh Blossom- MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_181_' || gen_random_uuid(), 'Aer Power Pocket - Fresh Blossom- MRP 65 (1*6) (1*120)', 'c3', 'Godrej', 90.52, 81.47, 6, 20, 6, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Power Pocket - Sea Breeze MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 90.52, "discountedRate" = 81.47, 
      "orderMultiple" = 6, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 6, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 4, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Power Pocket - Sea Breeze MRP 65 (1*6) (1*120)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_182_' || gen_random_uuid(), 'Aer Power Pocket - Sea Breeze MRP 65 (1*6) (1*120)', 'c3', 'Godrej', 90.52, 81.47, 6, 20, 6, false, true, false, true, 4, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Mix Masala 500gm (1*40) Mrp 325' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 264.11, "discountedRate" = 264.11, 
      "orderMultiple" = 1, "packetsPerCarton" = 20, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Mix Masala 500gm (1*40) Mrp 325' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_183_' || gen_random_uuid(), 'Jasmine Mix Masala 500gm (1*40) Mrp 325', 'c1', 'Jasmine Masala', 264.11, 264.11, 1, 20, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Mix Masala 200gm (1*10)(1*100) Mrp 130' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 105.65, "discountedRate" = 105.65, 
      "orderMultiple" = 10, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 10, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Mix Masala 200gm (1*10)(1*100) Mrp 130' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_184_' || gen_random_uuid(), 'Jasmine Mix Masala 200gm (1*10)(1*100) Mrp 130', 'c1', 'Jasmine Masala', 105.65, 105.65, 10, 10, 10, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Mix Masala 100gm (1*20)(1*200) Mrp 65' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 52.83, "discountedRate" = 52.83, 
      "orderMultiple" = 20, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 20, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Mix Masala 100gm (1*20)(1*200) Mrp 65' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_185_' || gen_random_uuid(), 'Jasmine Mix Masala 100gm (1*20)(1*200) Mrp 65', 'c1', 'Jasmine Masala', 52.83, 52.83, 20, 10, 20, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Roghni Mirch 100gm(1*80) Mrp 220' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 158.52, "discountedRate" = 158.52, 
      "orderMultiple" = 1, "packetsPerCarton" = 80, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Jasmine Roghni Mirch 100gm(1*80) Mrp 220' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_186_' || gen_random_uuid(), 'Jasmine Roghni Mirch 100gm(1*80) Mrp 220', 'c1', 'Jasmine Masala', 158.52, 158.52, 1, 80, 1, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Phaner Chocolate Pie 108gm(1*24) Mrp 140' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 118, "discountedRate" = 118, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Phaner Chocolate Pie 108gm(1*24) Mrp 140' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_187_' || gen_random_uuid(), 'Phaner Chocolate Pie 108gm(1*24) Mrp 140', 'c4', 'Bimal Trade', 118, 118, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nabil SF DIgestive 420gm Mrp 375 (1*24)' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 331.86, "discountedRate" = 331.86, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Nabil SF DIgestive 420gm Mrp 375 (1*24)' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_188_' || gen_random_uuid(), 'Nabil SF DIgestive 420gm Mrp 375 (1*24)', 'c4', 'Bimal Trade', 331.86, 331.86, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Anmol Veg Munch 175gm Mrp 90 (1*42)' AND "companyName" = 'Bimal Trade') THEN
    UPDATE products SET 
      "baseRate" = 71.43, "discountedRate" = 71.43, 
      "orderMultiple" = 1, "packetsPerCarton" = 42, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Anmol Veg Munch 175gm Mrp 90 (1*42)' AND "companyName" = 'Bimal Trade';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_189_' || gen_random_uuid(), 'Anmol Veg Munch 175gm Mrp 90 (1*42)', 'c4', 'Bimal Trade', 71.43, 71.43, 1, 42, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Orange Kream 25+12.5gm (1*144) Mrp10' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 8.99, "discountedRate" = 8.99, 
      "orderMultiple" = 12, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Orange Kream 25+12.5gm (1*144) Mrp10' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_190_' || gen_random_uuid(), 'Orange Kream 25+12.5gm (1*144) Mrp10', 'c2', 'Parle', 8.99, 8.99, 12, 12, 12, true, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Red Rhino 250 ML (1* 24) (FREE 24:1)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 64.17, "discountedRate" = 64.17, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Red Rhino 250 ML (1* 24) (FREE 24:1)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_191_' || gen_random_uuid(), 'Red Rhino 250 ML (1* 24) (FREE 24:1)', 'c6', 'Amrapali', 64.17, 64.17, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO BLACK CURRANT 320 ML (1*24) (FREE 4:1)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.8519379, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO BLACK CURRANT 320 ML (1*24) (FREE 4:1)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_192_' || gen_random_uuid(), 'KOOL-COCO BLACK CURRANT 320 ML (1*24) (FREE 4:1)', 'c6', 'Amrapali', 101.8519379, 101.8519379, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO MANGO DRINKS 320 ML (1*24) (FREE 4:1)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.8519379, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO MANGO DRINKS 320 ML (1*24) (FREE 4:1)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_193_' || gen_random_uuid(), 'KOOL-COCO MANGO DRINKS 320 ML (1*24) (FREE 4:1)', 'c6', 'Amrapali', 101.8519379, 101.8519379, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO KIWI 320 ML (1*24) (Free 4:1)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.8519379, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO KIWI 320 ML (1*24) (Free 4:1)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_194_' || gen_random_uuid(), 'KOOL-COCO KIWI 320 ML (1*24) (Free 4:1)', 'c6', 'Amrapali', 101.8519379, 101.8519379, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO STRAWBERRY 320 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.85, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO STRAWBERRY 320 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_195_' || gen_random_uuid(), 'KOOL-COCO STRAWBERRY 320 ML (1*24)', 'c6', 'Amrapali', 101.8519379, 101.85, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KOOL-COCO STRAWBERRY 320 ML (1*24) (FREE 4:1)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 101.8519379, "discountedRate" = 101.8519379, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'KOOL-COCO STRAWBERRY 320 ML (1*24) (FREE 4:1)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_196_' || gen_random_uuid(), 'KOOL-COCO STRAWBERRY 320 ML (1*24) (FREE 4:1)', 'c6', 'Amrapali', 101.8519379, 101.8519379, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"100","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'AER TWIST GEL - PETAL CRUSH PINK (MRP-425) (1*15)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 591.857388, "discountedRate" = 473.49, 
      "orderMultiple" = 1, "packetsPerCarton" = 15, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'AER TWIST GEL - PETAL CRUSH PINK (MRP-425) (1*15)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_197_' || gen_random_uuid(), 'AER TWIST GEL - PETAL CRUSH PINK (MRP-425) (1*15)', 'c3', 'Godrej', 591.857388, 473.49, 1, 15, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'AER TWIST GEL - COOL SURF BLUE (MRP-425) (1*15)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 591.857388, "discountedRate" = 473.49, 
      "orderMultiple" = 1, "packetsPerCarton" = 15, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'AER TWIST GEL - COOL SURF BLUE (MRP-425) (1*15)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_198_' || gen_random_uuid(), 'AER TWIST GEL - COOL SURF BLUE (MRP-425) (1*15)', 'c3', 'Godrej', 591.857388, 473.49, 1, 15, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'AER CLICK GEL - COOL SURF BLUE (MRP-320) (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 445.62906, "discountedRate" = 356.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'AER CLICK GEL - COOL SURF BLUE (MRP-320) (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_199_' || gen_random_uuid(), 'AER CLICK GEL - COOL SURF BLUE (MRP-320) (1*18)', 'c3', 'Godrej', 445.62906, 356.5, 1, 18, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'EZEE 1000 GM (1KG BOTTLE + 1 KG POUCH) (MRP 440) (1*6)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 640.600164, "discountedRate" = 576.54, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'EZEE 1000 GM (1KG BOTTLE + 1 KG POUCH) (MRP 440) (1*6)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_200_' || gen_random_uuid(), 'EZEE 1000 GM (1KG BOTTLE + 1 KG POUCH) (MRP 440) (1*6)', 'c3', 'Godrej', 640.600164, 576.54, 1, 6, 1, true, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Spray Mystic Musk 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Spray Mystic Musk 220ml - MRP 99 (1*24)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_201_' || gen_random_uuid(), 'Aer Spray Mystic Musk 220ml - MRP 99 (1*24)', 'c3', 'Godrej', 137.868588, 124.08, 1, 24, 1, true, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Car Fragrance 7.5gm Cool Aqua (1*60)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 117.19, 
      "orderMultiple" = 4, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 5, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Car Fragrance 7.5gm Cool Aqua (1*60)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_202_' || gen_random_uuid(), 'Aer Car Fragrance 7.5gm Cool Aqua (1*60)', 'c3', 'Godrej', 137.868588, 117.19, 4, 60, 1, false, true, false, true, 5, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Car Fragrance 7.5gm Musk After Smoke (1*60)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 117.19, 
      "orderMultiple" = 4, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 5, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Car Fragrance 7.5gm Musk After Smoke (1*60)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_203_' || gen_random_uuid(), 'Aer Car Fragrance 7.5gm Musk After Smoke (1*60)', 'c3', 'Godrej', 137.868588, 117.19, 4, 60, 1, false, true, false, true, 5, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Car Fragrance 7.5gm Rose Blossom (1*60)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 117.19, 
      "orderMultiple" = 4, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 5, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Car Fragrance 7.5gm Rose Blossom (1*60)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_204_' || gen_random_uuid(), 'Aer Car Fragrance 7.5gm Rose Blossom (1*60)', 'c3', 'Godrej', 137.868588, 117.19, 4, 60, 1, false, true, false, true, 5, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Matic  Spray Can Cool Surf Blue-210ml (MRP 315) (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 438.67278, "discountedRate" = 403.58, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Matic  Spray Can Cool Surf Blue-210ml (MRP 315) (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_205_' || gen_random_uuid(), 'Aer Matic  Spray Can Cool Surf Blue-210ml (MRP 315) (1*18)', 'c3', 'Godrej', 438.67278, 403.58, 1, 18, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Matic  Spray Can Petal Crush Pink-210ml (MRP 315) (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 438.67278, "discountedRate" = 403.58, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Matic  Spray Can Petal Crush Pink-210ml (MRP 315) (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_206_' || gen_random_uuid(), 'Aer Matic  Spray Can Petal Crush Pink-210ml (MRP 315) (1*18)', 'c3', 'Godrej', 438.67278, 403.58, 1, 1, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Matic  Spray Can Violet Valley Bloom-210ml (MRP 315) (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 438.67278, "discountedRate" = 403.58, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Aer Matic  Spray Can Violet Valley Bloom-210ml (MRP 315) (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_207_' || gen_random_uuid(), 'Aer Matic  Spray Can Violet Valley Bloom-210ml (MRP 315) (1*18)', 'c3', 'Godrej', 438.67278, 403.58, 1, 18, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Imli Candy 700gm (1*12)' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 206.49, "discountedRate" = 198.23, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"4","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Imli Candy 700gm (1*12)' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_208_' || gen_random_uuid(), 'Imli Candy 700gm (1*12)', 'c2', 'Parle', 206.49, 198.23, 1, 12, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"4","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RICH CREAM BURGUNDY INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 51.525288, "discountedRate" = 44.83, 
      "orderMultiple" = 10, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'RICH CREAM BURGUNDY INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_209_' || gen_random_uuid(), 'RICH CREAM BURGUNDY INR 37 (1*10)(1*240)', 'c3', 'Godrej', 51.525288, 44.83, 10, 240, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 50GM (LIME & ALOEVERA) - NPR 25 (1*216)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 22.723848, "discountedRate" = 19.32, 
      "orderMultiple" = 1, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 50GM (LIME & ALOEVERA) - NPR 25 (1*216)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_210_' || gen_random_uuid(), 'NO. 1 SOAP 50GM (LIME & ALOEVERA) - NPR 25 (1*216)', 'c3', 'Godrej', 22.723848, 19.32, 1, 36, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PROTEKT MR. MAGIC REFILL 9GM (1*360)(INR10)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 14.82786, "discountedRate" = 13.64, 
      "orderMultiple" = 1, "packetsPerCarton" = 216, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'PROTEKT MR. MAGIC REFILL 9GM (1*360)(INR10)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_211_' || gen_random_uuid(), 'PROTEKT MR. MAGIC REFILL 9GM (1*360)(INR10)', 'c3', 'Godrej', 14.82786, 13.64, 1, 216, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 75GM (ROSEWATER & ALMOND) PO4 - NPR 130 (1*216)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 29.545884, "discountedRate" = 24.62, 
      "orderMultiple" = 4, "packetsPerCarton" = 54, 
      "piecesPerPacket" = 4, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 75GM (ROSEWATER & ALMOND) PO4 - NPR 130 (1*216)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_212_' || gen_random_uuid(), 'NO. 1 SOAP 75GM (ROSEWATER & ALMOND) PO4 - NPR 130 (1*216)', 'c3', 'Godrej', 29.545884, 24.62, 4, 54, 4, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 50GM (ROSEWATER & ALMOND)  - NPR 25 (1*216)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 22.723848, "discountedRate" = 19.32, 
      "orderMultiple" = 12, "packetsPerCarton" = 216, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 50GM (ROSEWATER & ALMOND)  - NPR 25 (1*216)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_213_' || gen_random_uuid(), 'NO. 1 SOAP 50GM (ROSEWATER & ALMOND)  - NPR 25 (1*216)', 'c3', 'Godrej', 22.723848, 19.32, 12, 216, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 43GM (ROSEWATER & ALMOND)  - NPR 20 (1*216)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 18.18396, "discountedRate" = 15.46, 
      "orderMultiple" = 12, "packetsPerCarton" = 216, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 43GM (ROSEWATER & ALMOND)  - NPR 20 (1*216)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_214_' || gen_random_uuid(), 'NO. 1 SOAP 43GM (ROSEWATER & ALMOND)  - NPR 20 (1*216)', 'c3', 'Godrej', 18.18396, 15.46, 12, 216, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 43GM (LIME & ALOE)  - NPR 20 (1*216)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 18.18396, "discountedRate" = 15.46, 
      "orderMultiple" = 12, "packetsPerCarton" = 216, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 43GM (LIME & ALOE)  - NPR 20 (1*216)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_215_' || gen_random_uuid(), 'NO. 1 SOAP 43GM (LIME & ALOE)  - NPR 20 (1*216)', 'c3', 'Godrej', 18.18396, 15.46, 12, 216, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kamasutra Pocket Perfume Spark 18ML MRP 60 (1*8)(1*80)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 83.56, "discountedRate" = 66.85, 
      "orderMultiple" = 8, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 8, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Kamasutra Pocket Perfume Spark 18ML MRP 60 (1*8)(1*80)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_216_' || gen_random_uuid(), 'Kamasutra Pocket Perfume Spark 18ML MRP 60 (1*8)(1*80)', 'c3', 'Godrej', 83.56, 66.85, 8, 10, 8, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Parle g Royale 72gm (1*120) Mrp 40' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 35.87443946, "discountedRate" = 35.87, 
      "orderMultiple" = 1, "packetsPerCarton" = 120, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'Parle g Royale 72gm (1*120) Mrp 40' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_217_' || gen_random_uuid(), 'Parle g Royale 72gm (1*120) Mrp 40', 'c2', 'Parle', 35.87443946, 35.87, 1, 120, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'ParkAvenue Perfume Pocket Good Morning 18ml MRP 60 (1*8)(1*80)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 83.56, "discountedRate" = 66.85, 
      "orderMultiple" = 8, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 8, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'ParkAvenue Perfume Pocket Good Morning 18ml MRP 60 (1*8)(1*80)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_218_' || gen_random_uuid(), 'ParkAvenue Perfume Pocket Good Morning 18ml MRP 60 (1*8)(1*80)', 'c3', 'Godrej', 83.56, 66.85, 8, 10, 8, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 100GM (LIME & ALOEVERA) PO4 - NPR 160 (1*4)(1*36)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 36.364869, "discountedRate" = 30.91, 
      "orderMultiple" = 4, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 4, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'NO. 1 SOAP 100GM (LIME & ALOEVERA) PO4 - NPR 160 (1*4)(1*36)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_219_' || gen_random_uuid(), 'NO. 1 SOAP 100GM (LIME & ALOEVERA) PO4 - NPR 160 (1*4)(1*36)', 'c3', 'Godrej', 36.364869, 30.91, 4, 36, 4, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'CINTHOL BODY WASH LIME 200ML (1*30) MRP 120' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 167.109372, "discountedRate" = 155.41, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = true, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'CINTHOL BODY WASH LIME 200ML (1*30) MRP 120' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_220_' || gen_random_uuid(), 'CINTHOL BODY WASH LIME 200ML (1*30) MRP 120', 'c3', 'Godrej', 167.109372, 155.41, 1, 30, 1, true, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'CINTHOL BODY WASH ORIGINAL 200ML (1*30) MRP 120' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 167.109372, "discountedRate" = 155.41, 
      "orderMultiple" = 1, "packetsPerCarton" = 30, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}'
    WHERE name = 'CINTHOL BODY WASH ORIGINAL 200ML (1*30) MRP 120' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_221_' || gen_random_uuid(), 'CINTHOL BODY WASH ORIGINAL 200ML (1*30) MRP 120', 'c3', 'Godrej', 167.109372, 155.41, 1, 30, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.017Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT RAT GLUE PAD 25 GM (1*100) MRP60' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 87.356232, "discountedRate" = 78.62, 
      "orderMultiple" = 1, "packetsPerCarton" = 100, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'HIT RAT GLUE PAD 25 GM (1*100) MRP60' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_222_' || gen_random_uuid(), 'HIT RAT GLUE PAD 25 GM (1*100) MRP60', 'c3', 'Godrej', 87.356232, 78.62, 1, 100, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'HIT RAT GLUE PAD 50 GM (1*50) MRP120' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 174.712464, "discountedRate" = 157.24, 
      "orderMultiple" = 1, "packetsPerCarton" = 50, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'HIT RAT GLUE PAD 50 GM (1*50) MRP120' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_223_' || gen_random_uuid(), 'HIT RAT GLUE PAD 50 GM (1*50) MRP120', 'c3', 'Godrej', 174.712464, 157.24, 1, 50, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KS SPARK  AER 120ML (1*48) MRP 99' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'KS SPARK  AER 120ML (1*48) MRP 99' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_224_' || gen_random_uuid(), 'KS SPARK  AER 120ML (1*48) MRP 99', 'c3', 'Godrej', 137.868588, 124.08, 1, 1, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KS SURGE 120ML (1*48) MRP 99' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'KS SURGE 120ML (1*48) MRP 99' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_225_' || gen_random_uuid(), 'KS SURGE 120ML (1*48) MRP 99', 'c3', 'Godrej', 137.868588, 124.08, 1, 1, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'KS RUSH 120ML (1*48) MRP 99' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 137.868588, "discountedRate" = 124.08, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 2, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'KS RUSH 120ML (1*48) MRP 99' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_226_' || gen_random_uuid(), 'KS RUSH 120ML (1*48) MRP 99', 'c3', 'Godrej', 137.868588, 124.08, 1, 1, 1, false, true, false, true, 2, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PA EDP OUD 100ML (1*12) MRP 399' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 555.64812, "discountedRate" = 472.3, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 5, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'PA EDP OUD 100ML (1*12) MRP 399' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_227_' || gen_random_uuid(), 'PA EDP OUD 100ML (1*12) MRP 399', 'c3', 'Godrej', 555.64812, 472.3, 1, 1, 1, false, true, false, true, 5, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PA EDP SAMURAI 100ML (1*12) MRP 399' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 555.64812, "discountedRate" = 472.3, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 5, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'PA EDP SAMURAI 100ML (1*12) MRP 399' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_228_' || gen_random_uuid(), 'PA EDP SAMURAI 100ML (1*12) MRP 399', 'c3', 'Godrej', 555.64812, 472.3, 1, 1, 1, false, true, false, true, 5, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PA EDP KNIGHT 100ML (1*12) MRP 399' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 555.64812, "discountedRate" = 472.3, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 5, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'PA EDP KNIGHT 100ML (1*12) MRP 399' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_229_' || gen_random_uuid(), 'PA EDP KNIGHT 100ML (1*12) MRP 399', 'c3', 'Godrej', 555.64812, 472.3, 1, 1, 1, false, true, false, true, 5, 1, 0, 0, '{"productDiscountPct":"15","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GODREJ FAB LIQUID DETERGENT 3.2L POUCH- MRP 750 (1*4)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 681.82, "discountedRate" = 634.09, 
      "orderMultiple" = 1, "packetsPerCarton" = 4, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 6, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'GODREJ FAB LIQUID DETERGENT 3.2L POUCH- MRP 750 (1*4)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_230_' || gen_random_uuid(), 'GODREJ FAB LIQUID DETERGENT 3.2L POUCH- MRP 750 (1*4)', 'c3', 'Godrej', 681.82, 634.09, 1, 4, 1, false, true, false, true, 6, 1, 0, 0, '{"productDiscountPct":"7","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NO. 1 SOAP 100GM (ROSEWATER & ALMOND) - NPR 45 (1*144)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 40.907808, "discountedRate" = 34.09, 
      "orderMultiple" = 1, "packetsPerCarton" = 144, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'NO. 1 SOAP 100GM (ROSEWATER & ALMOND) - NPR 45 (1*144)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_231_' || gen_random_uuid(), 'NO. 1 SOAP 100GM (ROSEWATER & ALMOND) - NPR 45 (1*144)', 'c3', 'Godrej', 40.907808, 34.09, 1, 144, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni Herbal Cake 75gm (1*72) Mrp 10' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 7.3, "discountedRate" = 7.3, 
      "orderMultiple" = 1, "packetsPerCarton" = 72, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni Herbal Cake 75gm (1*72) Mrp 10' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_232_' || gen_random_uuid(), 'Dhoni Herbal Cake 75gm (1*72) Mrp 10', 'c5', 'Himgiri', 7.3, 7.3, 1, 72, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni Herbal Cake 150gm (1*60) Mrp 20' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 15.83, "discountedRate" = 15.83, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni Herbal Cake 150gm (1*60) Mrp 20' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_233_' || gen_random_uuid(), 'Dhoni Herbal Cake 150gm (1*60) Mrp 20', 'c5', 'Himgiri', 15.83, 15.83, 1, 60, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Himgiri No. 1 RoseTS 50gm (1*72) Mrp 20' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 15, "discountedRate" = 15, 
      "orderMultiple" = 1, "packetsPerCarton" = 3, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Himgiri No. 1 RoseTS 50gm (1*72) Mrp 20' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_234_' || gen_random_uuid(), 'Himgiri No. 1 RoseTS 50gm (1*72) Mrp 20', 'c5', 'Himgiri', 15, 15, 1, 3, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aura HS 10gm (1*288) Mrp 6' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 3.8, "discountedRate" = 3.8, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 48, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Aura HS 10gm (1*288) Mrp 6' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_235_' || gen_random_uuid(), 'Aura HS 10gm (1*288) Mrp 6', 'c5', 'Himgiri', 3.8, 3.8, 1, 6, 48, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni Kleen Phenyle 1000gm (1*12) Mrp 130' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 83.4, "discountedRate" = 83.4, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni Kleen Phenyle 1000gm (1*12) Mrp 130' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_236_' || gen_random_uuid(), 'Dhoni Kleen Phenyle 1000gm (1*12) Mrp 130', 'c5', 'Himgiri', 83.4, 83.4, 1, 12, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni Jumbo LS 200gm (1*36) Mrp 50' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 40.3, "discountedRate" = 40.3, 
      "orderMultiple" = 1, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni Jumbo LS 200gm (1*36) Mrp 50' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_237_' || gen_random_uuid(), 'Dhoni Jumbo LS 200gm (1*36) Mrp 50', 'c5', 'Himgiri', 40.3, 40.3, 1, 36, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Fizz DP 5000gm (1*4) (Bucket) Mrp 925' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 478.75, "discountedRate" = 478.75, 
      "orderMultiple" = 1, "packetsPerCarton" = 4, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Fizz DP 5000gm (1*4) (Bucket) Mrp 925' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_238_' || gen_random_uuid(), 'Fizz DP 5000gm (1*4) (Bucket) Mrp 925', 'c5', 'Himgiri', 478.75, 478.75, 1, 4, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni LS Combo(3+Free Dswh) 600gm (1*10) Mrp 150' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 121.5, "discountedRate" = 121.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni LS Combo(3+Free Dswh) 600gm (1*10) Mrp 150' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_239_' || gen_random_uuid(), 'Dhoni LS Combo(3+Free Dswh) 600gm (1*10) Mrp 150', 'c5', 'Himgiri', 121.5, 121.5, 1, 10, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni DP 500gm (1*24) Mrp 80' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 64.6, "discountedRate" = 64.6, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni DP 500gm (1*24) Mrp 80' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_240_' || gen_random_uuid(), 'Dhoni DP 500gm (1*24) Mrp 80', 'c5', 'Himgiri', 64.6, 64.6, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Saino Muttha Incense Sticks (1*50) Mrp 100' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 65, "discountedRate" = 65, 
      "orderMultiple" = 1, "packetsPerCarton" = 2, 
      "piecesPerPacket" = 50, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Saino Muttha Incense Sticks (1*50) Mrp 100' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_241_' || gen_random_uuid(), 'Saino Muttha Incense Sticks (1*50) Mrp 100', 'c5', 'Himgiri', 65, 65, 1, 2, 50, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Kasturi Muttha Incense Sticks (1*36) Mrp 100' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 70, "discountedRate" = 70, 
      "orderMultiple" = 1, "packetsPerCarton" = 2, 
      "piecesPerPacket" = 36, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Kasturi Muttha Incense Sticks (1*36) Mrp 100' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_242_' || gen_random_uuid(), 'Kasturi Muttha Incense Sticks (1*36) Mrp 100', 'c5', 'Himgiri', 70, 70, 1, 2, 36, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Tia Kasturi Mix Fruit Incense Sticks (1*72) Mrp 100' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 75, "discountedRate" = 75, 
      "orderMultiple" = 12, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Tia Kasturi Mix Fruit Incense Sticks (1*72) Mrp 100' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_243_' || gen_random_uuid(), 'Tia Kasturi Mix Fruit Incense Sticks (1*72) Mrp 100', 'c5', 'Himgiri', 75, 75, 12, 6, 12, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Xtraa Rose LS 200gm (1*24) Mrp 65' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 41.7, "discountedRate" = 41.7, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Xtraa Rose LS 200gm (1*24) Mrp 65' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_244_' || gen_random_uuid(), 'Xtraa Rose LS 200gm (1*24) Mrp 65', 'c5', 'Himgiri', 41.7, 41.7, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Xtraa Plus LS 200gm (1*24) Mrp 65' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 51.1, "discountedRate" = 51.1, 
      "orderMultiple" = 1, "packetsPerCarton" = 1, 
      "piecesPerPacket" = 24, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Xtraa Plus LS 200gm (1*24) Mrp 65' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_245_' || gen_random_uuid(), 'Xtraa Plus LS 200gm (1*24) Mrp 65', 'c5', 'Himgiri', 51.1, 51.1, 1, 1, 24, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni LS 1000gm (1*10) (4 Pcs FP) Mrp 250' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 180, "discountedRate" = 180, 
      "orderMultiple" = 1, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni LS 1000gm (1*10) (4 Pcs FP) Mrp 250' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_246_' || gen_random_uuid(), 'Dhoni LS 1000gm (1*10) (4 Pcs FP) Mrp 250', 'c5', 'Himgiri', 180, 180, 1, 10, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni LS 1500gm (1*6) (6 Pcs FP) Mrp 375' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 300, "discountedRate" = 300, 
      "orderMultiple" = 1, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni LS 1500gm (1*6) (6 Pcs FP) Mrp 375' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_247_' || gen_random_uuid(), 'Dhoni LS 1500gm (1*6) (6 Pcs FP) Mrp 375', 'c5', 'Himgiri', 300, 300, 1, 6, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Shova LS 200gm (1*24) Mrp 50' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 33.34, "discountedRate" = 33.34, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Shova LS 200gm (1*24) Mrp 50' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_248_' || gen_random_uuid(), 'Shova LS 200gm (1*24) Mrp 50', 'c5', 'Himgiri', 33.34, 33.34, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Fizz DP 200gm (1*50) Mrp 20' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 13.2, "discountedRate" = 13.2, 
      "orderMultiple" = 1, "packetsPerCarton" = 50, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Fizz DP 200gm (1*50) Mrp 20' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_249_' || gen_random_uuid(), 'Fizz DP 200gm (1*50) Mrp 20', 'c5', 'Himgiri', 13.2, 13.2, 1, 50, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Xtraa Active DP Daisy 750gm (1*25) Mrp 100' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 81.4, "discountedRate" = 81.4, 
      "orderMultiple" = 1, "packetsPerCarton" = 25, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Xtraa Active DP Daisy 750gm (1*25) Mrp 100' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_250_' || gen_random_uuid(), 'Xtraa Active DP Daisy 750gm (1*25) Mrp 100', 'c5', 'Himgiri', 81.4, 81.4, 1, 25, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Xtraa Dishwash Tub 500gm (1*18) Mrp 100' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 80, "discountedRate" = 80, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Xtraa Dishwash Tub 500gm (1*18) Mrp 100' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_251_' || gen_random_uuid(), 'Xtraa Dishwash Tub 500gm (1*18) Mrp 100', 'c5', 'Himgiri', 80, 80, 1, 18, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Tika LS 1000gm (1*10) (4 Pes FP) Mrp 250' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 165, "discountedRate" = 165, 
      "orderMultiple" = 1, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Tika LS 1000gm (1*10) (4 Pes FP) Mrp 250' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_252_' || gen_random_uuid(), 'Tika LS 1000gm (1*10) (4 Pes FP) Mrp 250', 'c5', 'Himgiri', 165, 165, 1, 10, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'GODREJ FAB 90 ML SACHET (1*72)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 13.750518, "discountedRate" = 13.75, 
      "orderMultiple" = 6, "packetsPerCarton" = 6, 
      "piecesPerPacket" = 12, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'GODREJ FAB 90 ML SACHET (1*72)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_253_' || gen_random_uuid(), 'GODREJ FAB 90 ML SACHET (1*72)', 'c3', 'Godrej', 13.750518, 13.75, 6, 6, 12, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Dhoni Kleen TC 500gm (1*12) Mrp 150' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 87.5, "discountedRate" = 87.5, 
      "orderMultiple" = 1, "packetsPerCarton" = 12, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Dhoni Kleen TC 500gm (1*12) Mrp 150' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_254_' || gen_random_uuid(), 'Dhoni Kleen TC 500gm (1*12) Mrp 150', 'c5', 'Himgiri', 87.5, 87.5, 1, 12, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aura BS Rose 100gm (1*72) Mrp 55' AND "companyName" = 'Himgiri') THEN
    UPDATE products SET 
      "baseRate" = 40, "discountedRate" = 40, 
      "orderMultiple" = 1, "packetsPerCarton" = 72, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Aura BS Rose 100gm (1*72) Mrp 55' AND "companyName" = 'Himgiri';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_255_' || gen_random_uuid(), 'Aura BS Rose 100gm (1*72) Mrp 55', 'c5', 'Himgiri', 40, 40, 1, 72, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'AER TWIST GEL - FRESH LUSH GREEN (MRP-425) (1*15)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 591.857388, "discountedRate" = 473.49, 
      "orderMultiple" = 1, "packetsPerCarton" = 15, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'AER TWIST GEL - FRESH LUSH GREEN (MRP-425) (1*15)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_256_' || gen_random_uuid(), 'AER TWIST GEL - FRESH LUSH GREEN (MRP-425) (1*15)', 'c3', 'Godrej', 591.857388, 473.49, 1, 15, 1, false, true, false, true, 0, 0, 0, 0, '{"productDiscountPct":"20","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RAT KILL 25 GM MRP 30 (1*12)(1*360)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 43.678116, "discountedRate" = 36.4, 
      "orderMultiple" = 12, "packetsPerCarton" = 360, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'RAT KILL 25 GM MRP 30 (1*12)(1*360)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_257_' || gen_random_uuid(), 'RAT KILL 25 GM MRP 30 (1*12)(1*360)', 'c3', 'Godrej', 43.678116, 36.4, 12, 360, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"16.67","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Himalayan Recharge 330 ML (1*24)' AND "companyName" = 'Amrapali') THEN
    UPDATE products SET 
      "baseRate" = 103.13171, "discountedRate" = 103.13, 
      "orderMultiple" = 1, "packetsPerCarton" = 24, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Himalayan Recharge 330 ML (1*24)' AND "companyName" = 'Amrapali';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_258_' || gen_random_uuid(), 'Himalayan Recharge 330 ML (1*24)', 'c6', 'Amrapali', 103.13171, 103.13, 1, 24, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PROTEKT MR. MAGIC HANDWASH 9GM COMBI MRP 40 (1*48)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 59.31144, "discountedRate" = 54.57, 
      "orderMultiple" = 1, "packetsPerCarton" = 48, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'PROTEKT MR. MAGIC HANDWASH 9GM COMBI MRP 40 (1*48)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_259_' || gen_random_uuid(), 'PROTEKT MR. MAGIC HANDWASH 9GM COMBI MRP 40 (1*48)', 'c3', 'Godrej', 59.31144, 54.57, 1, 48, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL BLUE 725 ML MRP-109 (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 158.688612, "discountedRate" = 142.82, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL BLUE 725 ML MRP-109 (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_260_' || gen_random_uuid(), 'PROTEKT GERM FIGHT HANDWASH REFILL BLUE 725 ML MRP-109 (1*18)', 'c3', 'Godrej', 158.688612, 142.82, 1, 18, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL LIME & EUCALYPTUS 725 ML (MRP-109) (1*18)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 158.688612, "discountedRate" = 142.82, 
      "orderMultiple" = 1, "packetsPerCarton" = 18, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'PROTEKT GERM FIGHT HANDWASH REFILL LIME & EUCALYPTUS 725 ML (MRP-109) (1*18)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_261_' || gen_random_uuid(), 'PROTEKT GERM FIGHT HANDWASH REFILL LIME & EUCALYPTUS 725 ML (MRP-109) (1*18)', 'c3', 'Godrej', 158.688612, 142.82, 1, 18, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"10","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Nutrivrunch Digestive 100gm (1*60) Mrp50' AND "companyName" = 'Parle') THEN
    UPDATE products SET 
      "baseRate" = 44.8539375, "discountedRate" = 44.85, 
      "orderMultiple" = 1, "packetsPerCarton" = 60, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Nutrivrunch Digestive 100gm (1*60) Mrp50' AND "companyName" = 'Parle';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_262_' || gen_random_uuid(), 'Nutrivrunch Digestive 100gm (1*60) Mrp50', 'c2', 'Parle', 44.8539375, 44.85, 1, 60, 1, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'NUPUR MEHANDI 65 GM MRP-40 (1*180)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 55.699056, "discountedRate" = 51.24, 
      "orderMultiple" = 1, "packetsPerCarton" = 180, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'NUPUR MEHANDI 65 GM MRP-40 (1*180)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_263_' || gen_random_uuid(), 'NUPUR MEHANDI 65 GM MRP-40 (1*180)', 'c3', 'Godrej', 55.699056, 51.24, 1, 180, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"8","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Jasmine Sabji Masala 200gm (1*10)(1*100) Mrp 125' AND "companyName" = 'Jasmine Masala') THEN
    UPDATE products SET 
      "baseRate" = 119.099175, "discountedRate" = 119.1, 
      "orderMultiple" = 10, "packetsPerCarton" = 10, 
      "piecesPerPacket" = 10, "stockOut" = false, 
      "isActive" = true, "discountEditable" = true, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Jasmine Sabji Masala 200gm (1*10)(1*100) Mrp 125' AND "companyName" = 'Jasmine Masala';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_264_' || gen_random_uuid(), 'Jasmine Sabji Masala 200gm (1*10)(1*100) Mrp 125', 'c1', 'Jasmine Masala', 119.099175, 119.1, 10, 10, 10, false, true, true, false, 0, 0, 0, 0, '{"productDiscountPct":null,"margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Aer Power Pocket - Assorted PO4- MRP 210 (1*4) (1*36)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 292.444452, "discountedRate" = 292.44, 
      "orderMultiple" = 1, "packetsPerCarton" = 36, 
      "piecesPerPacket" = 4, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = false, "secondaryDiscountPct" = 0, 
      "secondaryQualifyingQty" = 0, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"0","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'Aer Power Pocket - Assorted PO4- MRP 210 (1*4) (1*36)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_265_' || gen_random_uuid(), 'Aer Power Pocket - Assorted PO4- MRP 210 (1*4) (1*36)', 'c3', 'Godrej', 292.444452, 292.44, 1, 36, 4, false, true, false, false, 0, 0, 0, 0, '{"productDiscountPct":"0","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'RICH CREAM BLACK BROWN INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej') THEN
    UPDATE products SET 
      "baseRate" = 51.525288, "discountedRate" = 44.83, 
      "orderMultiple" = 10, "packetsPerCarton" = 240, 
      "piecesPerPacket" = 1, "stockOut" = false, 
      "isActive" = true, "discountEditable" = false, 
      "secondaryAvailable" = true, "secondaryDiscountPct" = 3, 
      "secondaryQualifyingQty" = 1, 
      "additionalSecondaryDiscountPct" = 0, 
      "additionalQualifyingQty" = 0, metadata = '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}'
    WHERE name = 'RICH CREAM BLACK BROWN INR 37 (1*10)(1*240)' AND "companyName" = 'Godrej';
  ELSE
    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)
    VALUES ('prod_sync_266_' || gen_random_uuid(), 'RICH CREAM BLACK BROWN INR 37 (1*10)(1*240)', 'c3', 'Godrej', 51.525288, 44.83, 10, 240, 1, false, true, false, true, 3, 1, 0, 0, '{"productDiscountPct":"13","margin":null,"syncedAt":"2026-01-16T03:56:29.018Z"}');
  END IF;
END $$;

