/**
 * useFinPro Hook
 * 
 * React hooks for the FinPro aggregation system:
 * - useTripStock: Load/unload truck, view reconciliation
 * - useTripClosure: Close trips with validation
 * - useFinProBatches: Generate and manage FinPro batches
 */

import { useState, useCallback, useEffect } from 'react';
import {
    TripStockService,
    TripClosureService,
    FinProAggregationService,
    TripLoad,
    TripUnload,
    StockReconciliationRow,
    CloseTripResult,
    FinProBatch,
    GenerateBatchesResult,
    FinProExport
} from '../services/finpro';

// ============================================================================
// useTripStock Hook
// ============================================================================

export interface UseTripStockReturn {
    // State
    loads: TripLoad[];
    unloads: TripUnload[];
    reconciliation: StockReconciliationRow[];
    loading: boolean;
    error: string | null;
    isClosed: boolean;

    // Actions
    loadTruck: (items: Array<{ product_id: string; qty: number }>) => Promise<boolean>;
    unloadTruck: (items: Array<{ product_id: string; qty_unsold: number; qty_damaged: number; damage_reason?: string }>) => Promise<boolean>;
    autoGenerateLoads: () => Promise<boolean>;
    refreshReconciliation: () => Promise<void>;
}

export function useTripStock(tripId: string): UseTripStockReturn {
    const [loads, setLoads] = useState<TripLoad[]>([]);
    const [unloads, setUnloads] = useState<TripUnload[]>([]);
    const [reconciliation, setReconciliation] = useState<StockReconciliationRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClosed, setIsClosed] = useState(false);

    // Fetch initial data
    useEffect(() => {
        if (!tripId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [loadsData, unloadsData, closed, recon] = await Promise.all([
                    TripStockService.getTripLoads(tripId),
                    TripStockService.getTripUnloads(tripId),
                    TripStockService.isTripClosed(tripId),
                    TripStockService.getStockReconciliation(tripId)
                ]);
                setLoads(loadsData);
                setUnloads(unloadsData);
                setIsClosed(closed);
                setReconciliation(recon);
            } catch (e: any) {
                setError(e.message || 'Failed to load stock data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tripId]);

    const loadTruck = useCallback(async (items: Array<{ product_id: string; qty: number }>) => {
        if (isClosed) {
            setError('Cannot load: Trip is closed');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await TripStockService.loadTruck({ trip_id: tripId, items });
            setLoads(result);
            // Refresh reconciliation
            const recon = await TripStockService.getStockReconciliation(tripId);
            setReconciliation(recon);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to load truck');
            return false;
        } finally {
            setLoading(false);
        }
    }, [tripId, isClosed]);

    const unloadTruck = useCallback(async (items: Array<{ product_id: string; qty_unsold: number; qty_damaged: number; damage_reason?: string }>) => {
        if (isClosed) {
            setError('Cannot unload: Trip is closed');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await TripStockService.unloadTruck({ trip_id: tripId, items });
            setUnloads(result);
            // Refresh reconciliation
            const recon = await TripStockService.getStockReconciliation(tripId);
            setReconciliation(recon);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to unload truck');
            return false;
        } finally {
            setLoading(false);
        }
    }, [tripId, isClosed]);

    const autoGenerateLoads = useCallback(async () => {
        if (isClosed) {
            setError('Cannot auto-generate: Trip is closed');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const generated = await TripStockService.generateLoadsFromOrders(tripId);
            if (generated.items.length === 0) {
                setError('No items found in trip orders');
                return false;
            }
            const result = await TripStockService.loadTruck(generated);
            setLoads(result);
            const recon = await TripStockService.getStockReconciliation(tripId);
            setReconciliation(recon);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to auto-generate loads');
            return false;
        } finally {
            setLoading(false);
        }
    }, [tripId, isClosed]);

    const refreshReconciliation = useCallback(async () => {
        setLoading(true);
        try {
            const recon = await TripStockService.getStockReconciliation(tripId);
            setReconciliation(recon);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    return {
        loads,
        unloads,
        reconciliation,
        loading,
        error,
        isClosed,
        loadTruck,
        unloadTruck,
        autoGenerateLoads,
        refreshReconciliation
    };
}

// ============================================================================
// useTripClosure Hook
// ============================================================================

export interface UseTripClosureReturn {
    // State
    closurePreview: CloseTripResult | null;
    loading: boolean;
    error: string | null;

    // Actions
    previewClosure: () => Promise<void>;
    closeTrip: (forceClose?: boolean, varianceReason?: string) => Promise<boolean>;
}

export function useTripClosure(tripId: string): UseTripClosureReturn {
    const [closurePreview, setClosurePreview] = useState<CloseTripResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previewClosure = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const preview = await TripClosureService.previewClosure(tripId);
            setClosurePreview(preview);
        } catch (e: any) {
            setError(e.message || 'Failed to preview closure');
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    const closeTrip = useCallback(async (forceClose = false, varianceReason?: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await TripClosureService.closeTrip({
                tripId,
                forceClose,
                varianceApprovalReason: varianceReason
            });

            if (!result.success) {
                setError(result.error || 'Failed to close trip');
                setClosurePreview(result);
                return false;
            }

            setClosurePreview(result);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to close trip');
            return false;
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    return {
        closurePreview,
        loading,
        error,
        previewClosure,
        closeTrip
    };
}

// ============================================================================
// useFinProBatches Hook
// ============================================================================

export interface UseFinProBatchesReturn {
    // State
    batches: FinProBatch[];
    generateResult: GenerateBatchesResult | null;
    loading: boolean;
    error: string | null;

    // Actions
    generateBatches: (date: string, tripIds?: string[]) => Promise<boolean>;
    saveBatches: () => Promise<boolean>;
    loadBatches: (date: string) => Promise<void>;
    exportForFinPro: (date: string) => Promise<FinProExport | null>;
    markAsExported: (batchIds: string[], reference?: string) => Promise<boolean>;
    deleteBatches: (date: string) => Promise<boolean>;
}

export function useFinProBatches(): UseFinProBatchesReturn {
    const [batches, setBatches] = useState<FinProBatch[]>([]);
    const [generateResult, setGenerateResult] = useState<GenerateBatchesResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateBatches = useCallback(async (date: string, tripIds?: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const result = await FinProAggregationService.generateFinProBatches({ date, tripIds });
            setGenerateResult(result);

            if (!result.success) {
                setError(result.error || 'Failed to generate batches');
                return false;
            }

            setBatches(result.batches);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to generate batches');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const saveBatches = useCallback(async () => {
        if (batches.length === 0) {
            setError('No batches to save');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            await FinProAggregationService.saveBatches(batches);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to save batches');
            return false;
        } finally {
            setLoading(false);
        }
    }, [batches]);

    const loadBatches = useCallback(async (date: string) => {
        setLoading(true);
        setError(null);
        try {
            const loaded = await FinProAggregationService.getBatchesByDate(date);
            setBatches(loaded);
        } catch (e: any) {
            setError(e.message || 'Failed to load batches');
        } finally {
            setLoading(false);
        }
    }, []);

    const exportForFinPro = useCallback(async (date: string): Promise<FinProExport | null> => {
        setLoading(true);
        setError(null);
        try {
            const exportData = await FinProAggregationService.exportForFinPro(date);
            return exportData;
        } catch (e: any) {
            setError(e.message || 'Failed to export');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsExported = useCallback(async (batchIds: string[], reference?: string) => {
        setLoading(true);
        setError(null);
        try {
            await FinProAggregationService.markAsExported(batchIds, reference);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to mark as exported');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBatches = useCallback(async (date: string) => {
        setLoading(true);
        setError(null);
        try {
            await FinProAggregationService.deleteBatchesForDate(date);
            setBatches([]);
            setGenerateResult(null);
            return true;
        } catch (e: any) {
            setError(e.message || 'Failed to delete batches');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        batches,
        generateResult,
        loading,
        error,
        generateBatches,
        saveBatches,
        loadBatches,
        exportForFinPro,
        markAsExported,
        deleteBatches
    };
}

// ============================================================================
// useTripsReadyForClosure Hook
// ============================================================================

export interface UseTripsReadyForClosureReturn {
    tripIds: string[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useTripsReadyForClosure(): UseTripsReadyForClosureReturn {
    const [tripIds, setTripIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const ids = await TripClosureService.getTripsReadyForClosure();
            setTripIds(ids);
        } catch (e: any) {
            setError(e.message || 'Failed to fetch trips');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        tripIds,
        loading,
        error,
        refresh
    };
}
