/**
 * FinPro Service Index
 * 
 * Exports all FinPro aggregation services:
 * - TripStockService: Truck loading/unloading/reconciliation
 * - TripClosureService: Formal trip closure with validation
 * - FinProAggregationService: Pre-FinPro batch generation
 */

export { TripStockService } from './TripStockService';
export type {
    TripLoad,
    TripUnload,
    TripClosure,
    StockReconciliationRow,
    LoadTruckInput,
    UnloadTruckInput
} from './TripStockService';

export { TripClosureService } from './TripClosureService';
export type {
    CloseTripInput,
    CloseTripResult
} from './TripClosureService';

export { FinProAggregationService } from './FinProAggregationService';
export type {
    FinProBatch,
    FinProBatchLine,
    BatchType,
    GenerateBatchesInput,
    GenerateBatchesResult,
    FinProExport,
    FinProExportInvoice
} from './FinProAggregationService';
