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

