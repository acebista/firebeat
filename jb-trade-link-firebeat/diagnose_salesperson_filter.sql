-- Diagnostic queries for salesperson filter issue

-- 1. Check if there are ANY users in the database
SELECT COUNT(*) as total_users FROM users;

-- 2. Check all users with their roles
SELECT id, name, email, role, "isActive"
FROM users
ORDER BY role, name;

-- 3. Check specifically for sales users
SELECT id, name, email, role, "isActive"
FROM users
WHERE role = 'sales';

-- 4. Check for active sales users (what the filter uses)
SELECT id, name, email, role, "isActive"
FROM users
WHERE role = 'sales' AND "isActive" = true;

-- 5. Check all roles in the database
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- 6. If no sales users exist, here's how to create one:
/*
INSERT INTO users (id, name, email, phone, role, "isActive")
VALUES (
  gen_random_uuid()::text,
  'Test Salesperson',
  'sales@example.com',
  '9876543210',
  'sales',
  true
);
*/

-- 7. Or update an existing user to be a salesperson:
/*
UPDATE users
SET role = 'sales', "isActive" = true
WHERE email = 'your-user@example.com';
*/
