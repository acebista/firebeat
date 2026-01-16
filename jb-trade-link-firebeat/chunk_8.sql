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

