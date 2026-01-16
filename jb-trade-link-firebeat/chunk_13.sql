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

