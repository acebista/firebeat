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

