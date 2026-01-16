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

