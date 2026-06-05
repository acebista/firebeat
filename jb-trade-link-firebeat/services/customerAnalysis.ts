import { Customer, Order } from '../types';

// ============================================================
// CUSTOMER ANALYSIS ENGINE
// Computes RFM scores, gap analysis, churn risk, tiers
// All client-side from orders + customers data
// ============================================================

export interface CustomerMetrics {
    customerId: string;
    customerName: string;
    routeName: string;
    isActive: boolean;
    hasGps: boolean;

    // Order Metrics
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    maxOrderValue: number;
    minOrderValue: number;
    avgItemsPerOrder: number;
    firstOrderDate: string | null;
    lastOrderDate: string | null;
    daysSinceLastOrder: number | null;
    customerTenureDays: number;

    // Frequency & Gap
    avgGapDays: number | null;
    medianGapDays: number | null;
    shortestGap: number | null;
    longestGap: number | null;
    expectedNextOrderDate: string | null;
    daysOverdue: number | null;
    missedOrderCount: number;
    regularityScore: number | null; // 0-1, 1=perfectly regular

    // Financial
    currentOutstanding: number;
    creditLimit: number;
    creditUtilization: number;
    totalDiscount: number;
    paymentPreference: string;
    cashRatio: number;

    // RFM
    rfmR: number; // 1-5
    rfmF: number;
    rfmM: number;
    rfmSegment: string;
    rfmSegmentColor: string;

    // Tier
    tier: string;
    tierIcon: string;

    // Churn
    churnRisk: 'low' | 'medium' | 'high' | 'critical';
    churnScore: number; // 0-100

    // Salesperson
    primarySalesperson: string;
    primarySalespersonId: string;

    // GPS
    gpsCompliance: number; // % of orders with GPS
    ordersWithGps: number;
    ordersWithoutGps: number;

    // Enterprise CRM Metrics (Salesforce Level)
    abcClassification: 'A' | 'B' | 'C'; // Revenue concentration
    revenueMomentum: number; // % change in last 90d vs 180-90d
    brandPenetrationCount: number; // Unique companies/brands bought
    totalAvailableBrands: number; // Global unique brands
    missingOpportunityBrand: string | null; // Top missing brand for cross-sell
    profileCompleteness: number; // % of core fields filled (0-100)

    // Daily Action Logic
    suggestedActionScore: number; // Rank for today (0-100)
    suggestedActionType: 'Recovery' | 'Growth' | 'Relationship' | 'Stable';
}

export interface AnalysisSummary {
    totalCustomers: number;
    activeCustomers: number;
    orderingThisMonth: number;
    dormantCount: number;
    newThisMonth: number;
    avgOrderValue: number;
    totalRevenueMTD: number;
    gpsComplianceRate: number;
    segmentDistribution: Record<string, number>;
    tierDistribution: Record<string, number>;
    churnDistribution: Record<string, number>;
    abcDistribution: Record<string, number>;
}

function daysBetween(d1: string, d2: string): number {
    return Math.abs(Math.round((new Date(d1).getTime() - new Date(d2).getTime()) / (1000 * 60 * 60 * 24)));
}

function median(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(arr: number[]): number {
    if (arr.length < 2) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// Assign RFM segment name based on scores
function getRfmSegment(r: number, f: number, m: number): { name: string; color: string } {
    if (r >= 4 && f >= 4 && m >= 4) return { name: '🏆 Champion', color: 'amber' };
    if (r >= 4 && f >= 3 && m >= 3) return { name: '💪 Loyal', color: 'emerald' };
    if (r >= 4 && f <= 2) return { name: '🌟 Potential', color: 'blue' };
    if (r >= 4 && f === 1 && m === 1) return { name: '🆕 New', color: 'cyan' };
    if (r <= 2 && f >= 3 && m >= 3) return { name: '⚠️ At Risk', color: 'orange' };
    if (r === 3 && f <= 2) return { name: '🔄 Sleepy', color: 'yellow' };
    if (r <= 2 && f <= 2 && m <= 2) return { name: '💀 Lost', color: 'red' };
    if (r <= 2 && f <= 2) return { name: '😴 Hibernating', color: 'gray' };
    return { name: '📊 Regular', color: 'indigo' };
}

// Compute quintile for RFM scoring (1-5)
function computeQuintiles(values: number[], higher_is_better: boolean): Map<number, number> {
    const sorted = [...new Set(values)].sort((a, b) => a - b);
    const result = new Map<number, number>();
    if (sorted.length === 0) return result;

    values.forEach(v => {
        const rank = sorted.indexOf(v);
        const percentile = rank / Math.max(sorted.length - 1, 1);
        let quintile = Math.ceil(percentile * 5) || 1;
        if (!higher_is_better) quintile = 6 - quintile; // Reverse for recency
        result.set(v, Math.max(1, Math.min(5, quintile)));
    });
    return result;
}

export function analyzeCustomers(
    customers: Customer[],
    orders: Order[],
    allProducts: any[] = []
): { metrics: CustomerMetrics[]; summary: AnalysisSummary } {
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);
    const thisMonth = today.substring(0, 7); // "YYYY-MM"

    // Global Brand Stats
    const globalBrands = new Set(allProducts.map(p => p.companyId || p.companyName).filter(Boolean));
    const totalAvailableBrands = globalBrands.size;

    // Group orders by customer
    const ordersByCustomer = new Map<string, Order[]>();
    orders.forEach(order => {
        if (order.status === 'cancelled') return;
        const list = ordersByCustomer.get(order.customerId) || [];
        list.push(order);
        ordersByCustomer.set(order.customerId, list);
    });

    // Pre-compute values for RFM quintiles
    const allRecency: { id: string; val: number }[] = [];
    const allFrequency: { id: string; val: number }[] = [];
    const allMonetary: { id: string; val: number }[] = [];

    // First pass: compute raw values
    const rawMetrics = new Map<string, {
        recency: number; frequency: number; monetary: number;
        custOrders: Order[];
    }>();

    customers.forEach(cust => {
        const custOrders = (ordersByCustomer.get(cust.id) || [])
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const lastDate = custOrders.length > 0 ? custOrders[custOrders.length - 1].date : null;
        const recency = lastDate ? daysBetween(today, lastDate) : 9999;

        // Last 90 days for frequency/monetary
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const recent90 = custOrders.filter(o => new Date(o.date) >= ninetyDaysAgo);
        const frequency = recent90.length;
        const monetary = recent90.reduce((s, o) => s + o.totalAmount, 0);

        rawMetrics.set(cust.id, { recency, frequency, monetary, custOrders });
        allRecency.push({ id: cust.id, val: recency });
        allFrequency.push({ id: cust.id, val: frequency });
        allMonetary.push({ id: cust.id, val: monetary });
    });

    // Compute quintiles
    const rQuintiles = computeQuintiles(allRecency.map(r => r.val), false); // lower recency = better
    const fQuintiles = computeQuintiles(allFrequency.map(r => r.val), true);
    const mQuintiles = computeQuintiles(allMonetary.map(r => r.val), true);

    // Compute lifetime revenue for tier classification
    const lifetimeRevenues: { id: string; val: number }[] = [];
    customers.forEach(cust => {
        const custOrders = ordersByCustomer.get(cust.id) || [];
        lifetimeRevenues.push({ id: cust.id, val: custOrders.reduce((s, o) => s + o.totalAmount, 0) });
    });
    lifetimeRevenues.sort((a, b) => b.val - a.val);
    const totalCusts = lifetimeRevenues.length;

    const tierMap = new Map<string, { tier: string; icon: string }>();
    lifetimeRevenues.forEach((item, idx) => {
        const pct = (idx + 1) / totalCusts;
        if (pct <= 0.05) tierMap.set(item.id, { tier: 'Platinum', icon: '👑' });
        else if (pct <= 0.20) tierMap.set(item.id, { tier: 'Gold', icon: '🥇' });
        else if (pct <= 0.50) tierMap.set(item.id, { tier: 'Silver', icon: '🥈' });
        else tierMap.set(item.id, { tier: 'Bronze', icon: '🥉' });
    });

    // ABC Analysis: Sort by lifetime revenue descending
    const sortedForABC = [...lifetimeRevenues].sort((a, b) => b.val - a.val);
    const totalLifetimeRevenue = sortedForABC.reduce((s, o) => s + o.val, 0);
    let runningRevenue = 0;
    const abcMap = new Map<string, 'A' | 'B' | 'C'>();
    sortedForABC.forEach(item => {
        runningRevenue += item.val;
        const cumulativePct = totalLifetimeRevenue > 0 ? (runningRevenue / totalLifetimeRevenue) * 100 : 100;
        if (cumulativePct <= 80) abcMap.set(item.id, 'A');
        else if (cumulativePct <= 95) abcMap.set(item.id, 'B');
        else abcMap.set(item.id, 'C');
    });

    // Group items by company for cross-sell discovery
    const segmentBrandRevenue = new Map<string, Map<string, number>>();

    // Summary counters
    let orderingThisMonth = 0;
    let dormantCount = 0;
    let newThisMonth = 0;
    let totalMtdRevenue = 0;
    let totalOrdersWithGps = 0;
    let totalOrdersCount = 0;
    const segmentDist: Record<string, number> = {};
    const tierDist: Record<string, number> = {};
    const churnDist: Record<string, number> = {};
    const abcDist: Record<string, number> = { 'A': 0, 'B': 0, 'C': 0 };

    // Second pass: compute full metrics
    const metrics: CustomerMetrics[] = customers.map(cust => {
        const raw = rawMetrics.get(cust.id)!;
        const custOrders = raw.custOrders;
        const totalOrders = custOrders.length;
        const totalRevenue = custOrders.reduce((s, o) => s + o.totalAmount, 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const maxOrderValue = totalOrders > 0 ? Math.max(...custOrders.map(o => o.totalAmount)) : 0;
        const minOrderValue = totalOrders > 0 ? Math.min(...custOrders.map(o => o.totalAmount)) : 0;
        const avgItemsPerOrder = totalOrders > 0 ? custOrders.reduce((s, o) => s + (o.totalItems || 0), 0) / totalOrders : 0;

        const firstOrderDate = custOrders.length > 0 ? custOrders[0].date : null;
        const lastOrderDate = custOrders.length > 0 ? custOrders[custOrders.length - 1].date : null;
        const daysSinceLastOrder = lastOrderDate ? daysBetween(today, lastOrderDate) : null;
        const customerTenureDays = firstOrderDate && lastOrderDate ? daysBetween(firstOrderDate, today) : 0;

        // Gap analysis
        const gaps: number[] = [];
        for (let i = 1; i < custOrders.length; i++) {
            gaps.push(daysBetween(custOrders[i - 1].date, custOrders[i].date));
        }
        const avgGapDays = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
        const medianGapDays = gaps.length > 0 ? median(gaps) : null;
        const shortestGap = gaps.length > 0 ? Math.min(...gaps) : null;
        const longestGap = gaps.length > 0 ? Math.max(...gaps) : null;

        let expectedNextOrderDate: string | null = null;
        let daysOverdue: number | null = null;
        let missedOrderCount = 0;
        let regularityScore: number | null = null;

        if (lastOrderDate && avgGapDays && avgGapDays > 0) {
            const expected = new Date(lastOrderDate);
            expected.setDate(expected.getDate() + Math.round(avgGapDays));
            expectedNextOrderDate = expected.toISOString().split('T')[0];
            const overdue = daysBetween(expectedNextOrderDate, today);
            daysOverdue = new Date(expectedNextOrderDate) < todayDate ? overdue : null;
            missedOrderCount = daysOverdue ? Math.floor(daysOverdue / avgGapDays) : 0;
        }
        if (gaps.length >= 2 && avgGapDays && avgGapDays > 0) {
            regularityScore = Math.max(0, Math.min(1, 1 - (stdDev(gaps) / avgGapDays)));
        }

        // Financial
        const currentOutstanding = cust.currentOutstanding || 0;
        const creditLimit = cust.creditLimit || 0;
        const creditUtilization = creditLimit > 0 ? (currentOutstanding / creditLimit) * 100 : 0;
        const totalDiscount = custOrders.reduce((s, o) => s + (o.discount || 0), 0);

        const paymentCounts: Record<string, number> = {};
        let cashCount = 0;
        custOrders.forEach(o => {
            const pm = o.paymentMethod || o.paymentMode || 'Unknown';
            paymentCounts[pm] = (paymentCounts[pm] || 0) + 1;
            if (pm.toLowerCase() === 'cash') cashCount++;
        });
        const paymentPreference = Object.entries(paymentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
        const cashRatio = totalOrders > 0 ? (cashCount / totalOrders) * 100 : 0;

        // RFM
        const rfmR = rQuintiles.get(raw.recency) || 1;
        const rfmF = fQuintiles.get(raw.frequency) || 1;
        const rfmM = mQuintiles.get(raw.monetary) || 1;
        const segment = getRfmSegment(rfmR, rfmF, rfmM);

        // Tier
        const tierInfo = tierMap.get(cust.id) || { tier: 'Bronze', icon: '🥉' };

        // Churn risk
        let churnScore = 0;
        if (daysSinceLastOrder !== null && avgGapDays && avgGapDays > 0) {
            const gapRatio = daysSinceLastOrder / avgGapDays;
            if (gapRatio > 3) churnScore += 40;
            else if (gapRatio > 2) churnScore += 25;
            else if (gapRatio > 1.5) churnScore += 15;
        } else if (totalOrders === 0) {
            churnScore += 30;
        }
        if (rfmR <= 2) churnScore += 20;
        if (rfmF <= 2) churnScore += 10;
        if (regularityScore !== null && regularityScore < 0.3) churnScore += 15;
        if (totalOrders <= 1) churnScore += 10;
        churnScore = Math.min(100, churnScore);
        const churnRisk: CustomerMetrics['churnRisk'] = churnScore >= 70 ? 'critical' : churnScore >= 45 ? 'high' : churnScore >= 25 ? 'medium' : 'low';

        // Salesperson
        const spCounts: Record<string, { count: number; name: string }> = {};
        custOrders.forEach(o => {
            const sid = o.salespersonId || 'unknown';
            if (!spCounts[sid]) spCounts[sid] = { count: 0, name: o.salespersonName || 'Unknown' };
            spCounts[sid].count++;
        });
        const topSp = Object.entries(spCounts).sort((a, b) => b[1].count - a[1].count)[0];
        const primarySalesperson = topSp ? topSp[1].name : 'N/A';
        const primarySalespersonId = topSp ? topSp[0] : '';

        // GPS
        const ordersWithGps = custOrders.filter(o => o.GPS && o.GPS.trim() !== '').length;
        const ordersWithoutGps = totalOrders - ordersWithGps;
        const gpsCompliance = totalOrders > 0 ? (ordersWithGps / totalOrders) * 100 : 0;

        const hasGps = !!(cust.locationText && cust.locationText.trim() !== '') ||
            !!(cust.latitude && cust.longitude);

        // Enterprise: ABC Classification
        const abcClassification = abcMap.get(cust.id) || 'C';

        // Enterprise: Revenue Momentum (Last 90d vs Prev 90d)
        const ninetyDaysAgo = new Date(); ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const oneEightyDaysAgo = new Date(); oneEightyDaysAgo.setDate(oneEightyDaysAgo.getDate() - 180);
        const revLast90 = custOrders.filter(o => new Date(o.date) >= ninetyDaysAgo).reduce((s, o) => s + o.totalAmount, 0);
        const revPrev90 = custOrders.filter(o => new Date(o.date) >= oneEightyDaysAgo && new Date(o.date) < ninetyDaysAgo).reduce((s, o) => s + o.totalAmount, 0);
        const revenueMomentum = revPrev90 > 0 ? ((revLast90 - revPrev90) / revPrev90) * 100 : revLast90 > 0 ? 100 : 0;

        // Enterprise: Brand Penetration
        const customerBrands = new Set<string>();
        custOrders.forEach(o => {
            (o.items || []).forEach(item => {
                // If companyId is missing in order item, we'd need a lookup. 
                // Using a simplified heuristic: if productName is unique per brand
                // But for accurate cross-sell, we'll try to get companyId from item or a passed map
            });
        });
        // Note: For now, we'll track unique product brands if available in order items
        // Since we don't have companyId directly in OrderItem yet (based on types.ts check)
        // we'll use a hack of counting unique items or looking up if needed.
        // IMPROVEMENT: We'll assume for this analysis we want brands bought.
        const brandCount = new Set(custOrders.flatMap(o => (o.items || []).map(i => (i as any).companyId)).filter(Boolean)).size;

        // Enterprise: Profile Completeness
        let filled = 0; let totalFields = 5;
        if (cust.phone && cust.phone.length > 5) filled++;
        if (cust.routeName && cust.routeName.length > 2) filled++;
        if (cust.panNumber && cust.panNumber.length > 5) filled++;
        if (hasGps) filled++;
        if (cust.creditLimit && cust.creditLimit > 0) filled++;
        const profileCompleteness = (filled / totalFields) * 100;

        // Step 12: Daily Action Ranking Logic
        let actionScore = 0;
        let actionType: 'Recovery' | 'Growth' | 'Relationship' | 'Stable' = 'Stable';

        if (daysOverdue && daysOverdue > 0) {
            actionScore = 70 + Math.min(daysOverdue, 20);
            if (abcClassification === 'A') actionScore += 10;
            actionType = 'Recovery';
        } else if (churnRisk === 'critical' || churnRisk === 'high') {
            actionScore = 60 + (churnScore * 20);
            actionType = 'Recovery';
        } else if (abcClassification === 'B' && (totalAvailableBrands > 0 && brandCount / totalAvailableBrands < 0.3)) {
            actionScore = 50 + (1 - (brandCount / totalAvailableBrands)) * 30;
            actionType = 'Growth';
        } else if (totalOrders <= 3 && daysSinceLastOrder && daysSinceLastOrder > 10) {
            actionScore = 40 + Math.min(daysSinceLastOrder, 20);
            actionType = 'Relationship';
        }

        return {
            customerId: cust.id, customerName: cust.name, routeName: cust.routeName || '',
            isActive: cust.isActive, hasGps,
            totalOrders, totalRevenue, avgOrderValue, maxOrderValue, minOrderValue, avgItemsPerOrder,
            firstOrderDate, lastOrderDate, daysSinceLastOrder, customerTenureDays,
            avgGapDays, medianGapDays, shortestGap, longestGap,
            expectedNextOrderDate, daysOverdue, missedOrderCount, regularityScore,
            currentOutstanding, creditLimit, creditUtilization, totalDiscount,
            paymentPreference, cashRatio,
            rfmR, rfmF, rfmM, rfmSegment: segment.name, rfmSegmentColor: segment.color,
            tier: tierInfo.tier, tierIcon: tierInfo.icon,
            churnRisk, churnScore,
            primarySalesperson, primarySalespersonId,
            gpsCompliance, ordersWithGps, ordersWithoutGps,
            // Enterprise metrics
            abcClassification, revenueMomentum, brandPenetrationCount: brandCount,
            totalAvailableBrands, missingOpportunityBrand: null,
            profileCompleteness,
            suggestedActionScore: actionScore,
            suggestedActionType: actionType
        };
    });

    const activeCustomers = customers.filter(c => c.isActive).length;
    const allOrderValues = orders.filter(o => o.status !== 'cancelled').map(o => o.totalAmount);
    const avgOV = allOrderValues.length > 0 ? allOrderValues.reduce((a, b) => a + b, 0) / allOrderValues.length : 0;

    const summary: AnalysisSummary = {
        totalCustomers: customers.length,
        activeCustomers,
        orderingThisMonth,
        dormantCount,
        newThisMonth,
        avgOrderValue: avgOV,
        totalRevenueMTD: totalMtdRevenue,
        gpsComplianceRate: totalOrdersCount > 0 ? (totalOrdersWithGps / totalOrdersCount) * 100 : 0,
        segmentDistribution: segmentDist,
        tierDistribution: tierDist,
        churnDistribution: churnDist,
        abcDistribution: abcDist,
    };

    return { metrics, summary };
}
