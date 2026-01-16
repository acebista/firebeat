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

