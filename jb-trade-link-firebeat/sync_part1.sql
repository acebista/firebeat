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
