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

