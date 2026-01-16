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

