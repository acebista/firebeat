# User Compensation Feature - Testing Guide

**Status**: Ready for QA  
**Time**: 20 minutes  
**Prerequisite**: Database migration completed

## Quick Test Summary

### Part 1: User Management - Fixed Plan
1. Go to **Admin** → **User Management**
2. Click **"Add User Profile"**
3. Fill: Name, Email, Phone, Role: Sales
4. Scroll to **Compensation**:
   - Plan Type: **Fixed / Salary**
   - Base Salary (₹): **25000**
5. Click **"Create Profile"**
6. ✅ Verify in Supabase: comp_plan_type='fixed', base_salary=25000

### Part 2: User Management - Commission Plan
1. Edit existing salesperson
2. Go to **Compensation**:
   - Plan Type: **Commission**
   - Base Salary (₹): **15000**
3. Click **"Update Profile"**
4. ✅ Verify in Supabase: comp_plan_type='commission', base_salary=15000

### Part 3: HR Panel
1. Go to **Admin** → **Compensation Calculator**
2. ✅ Page loads without 400 error
3. Set date range
4. Filter by salesperson
5. ✅ Compensation data appears

## Detailed Tests

### Test: Form Validation
- Empty name → Error appears ✅
- Invalid email → Error appears ✅
- Negative salary → Error appears ✅
- Valid data → Saves successfully ✅

### Test: Data Persistence
- Create user with compensation
- Edit without changing compensation
- ✅ Compensation fields unchanged
- Edit compensation, save
- ✅ New values appear in database

### Test: HR Panel Calculations
For fixed plan user:
- ✅ Commission = 0
- ✅ Payout = Base Salary only

For commission plan user:
- ✅ Commission calculated from sales
- ✅ Payout = Base Salary + Commission

## Verification Checklist

### User Management ✅
- [ ] Create user with fixed plan
- [ ] Edit user to commission plan  
- [ ] Data saves to database

### HR Panel ✅
- [ ] No 400 errors
- [ ] Filters work
- [ ] Data displays

### Compensation ✅
- [ ] Form validation works
- [ ] Data persists correctly
- [ ] Calculations appear correct

## Troubleshooting

**Issue**: "Compensation section not visible"  
→ Scroll down in modal

**Issue**: "HR Panel shows 400 error"  
→ Run database migration SQL

**Issue**: "Values don't save"  
→ Check browser console for errors

**Status**: All tests passing = Ready to deploy ✅
