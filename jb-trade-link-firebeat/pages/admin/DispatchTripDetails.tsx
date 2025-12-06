import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Package, Printer } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui/Elements';
import { Order, DispatchTrip } from '../../types';
import { OrderService, TripService } from '../../services/db';
import toast from 'react-hot-toast';

export const DispatchTripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<DispatchTrip | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) refreshData();
  }, [id]);

  const refreshData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const t = await TripService.getById(id);
      if (t) {
        setTrip(t);
        if (t.orderIds.length > 0) {
            const tripOrders = await OrderService.getOrdersByIds(t.orderIds);
            setOrders(tripOrders);
        } else {
            setOrders([]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    if (!trip) return;
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    if(!window.confirm("Remove this order from the trip? It will return to approved dispatch pool.")) return;

    try {
        await TripService.removeOrder(trip.id, orderId, trip, order);
        refreshData();
    } catch (e) {
        console.error(e);
        toast.error("Failed to remove order");
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    if (!trip) return;
    try {
        await TripService.update(trip.id, { status: newStatus });
        setTrip(prev => prev ? { ...prev, status: newStatus } : null);
        // When dispatching to delivery, ensure linked orders reflect the dispatch status
        if (newStatus === 'out_for_delivery' && orders.length > 0) {
            await Promise.all(
              orders.map(o => OrderService.updateStatus(o.id, 'dispatched'))
            );
        }
    } catch (e) {
        toast.error("Failed to update status");
    }
  };

  // TEMPORARY: Toggle all orders between completed/unfinished
  const handleToggleAllOrdersCompletion = async () => {
    if (orders.length === 0) {
      toast.error("No orders to toggle");
      return;
    }

    const allDelivered = orders.every(o => o.status === 'delivered');
    const newStatus = allDelivered ? 'dispatched' : 'delivered';

    try {
      await Promise.all(
        orders.map(o => OrderService.updateStatus(o.id, newStatus))
      );
      
      // Refresh orders to reflect new status
      const updatedOrders = await OrderService.getOrdersByIds(orders.map(o => o.id));
      setOrders(updatedOrders as Order[]);
      
      toast.success(`${updatedOrders.length} orders marked as ${newStatus === 'delivered' ? 'COMPLETED' : 'UNFINISHED'}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle order completion");
    }
  };

  // TEMPORARY: Toggle individual order completion
  const handleToggleOrderCompletion = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newStatus = order.status === 'delivered' ? 'dispatched' : 'delivered';

    try {
      await OrderService.updateStatus(orderId, newStatus);
      
      // Update local state with proper type casting
      const updatedOrders = orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o
      );
      setOrders(updatedOrders);
      
      toast.success(`Order marked as ${newStatus === 'delivered' ? 'COMPLETED' : 'UNFINISHED'}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle order");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading Trip Details...</div>;
  if (!trip) return <div className="p-6 text-red-500">Trip not found.</div>;

  // Group orders by route (mock route logic for now as Order doesn't always have routeName)
  const loadingSheet = orders.reduce((acc, order) => {
    const route = order.customerName ? order.customerName.charAt(0) : 'Unsorted'; // Mock grouping
    if (!acc[route]) {
        acc[route] = { count: 0, amount: 0, orders: [] };
    }
    acc[route].count += 1;
    acc[route].amount += order.totalAmount;
    acc[route].orders.push(order);
    return acc;
  }, {} as Record<string, { count: number, amount: number, orders: Order[] }>);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/dispatch')} className="p-2 hover:bg-gray-200 rounded-full">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Trip Details 
            <span className="text-base font-normal text-gray-500 font-mono">#{trip.id.slice(0,8)}</span>
          </h2>
          <p className="text-sm text-gray-600">{trip.deliveryDate}</p>
        </div>
        <div className="ml-auto flex gap-2">
            {trip.status === 'draft' && (
                <Button onClick={() => handleStatusChange('ready_for_packing')}>Mark Ready for Packing</Button>
            )}
            {trip.status === 'ready_for_packing' && (
                <Button onClick={() => handleStatusChange('packed')}>Mark Packed</Button>
            )}
            {trip.status === 'packed' && (
                <Button onClick={() => handleStatusChange('out_for_delivery')}>Mark Out for Delivery</Button>
            )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 bg-white">
           <div className="bg-indigo-100 p-3 rounded-full">
              <Truck className="h-6 w-6 text-indigo-600" />
           </div>
           <div>
              <p className="text-sm text-gray-600">Delivery Person</p>
              <p className="font-bold text-black">{trip.deliveryPersonName}</p>
              <p className="text-xs text-gray-500">{trip.vehicleName}</p>
           </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 bg-white">
           <div className="bg-green-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
           </div>
           <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-bold text-black">{trip.totalOrders}</p>
              <p className="text-xs text-gray-500">Assigned</p>
           </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 bg-white">
           <div className="bg-yellow-100 p-3 rounded-full">
              <span className="text-xl font-bold text-yellow-700">₹</span>
           </div>
           <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="font-bold text-black">₹{trip.totalAmount.toLocaleString()}</p>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Order List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Assigned Orders</h3>
            {orders.length > 0 && trip.status !== 'draft' && (
              <Button
                size="sm"
                onClick={handleToggleAllOrdersCompletion}
                className={orders.every(o => o.status === 'delivered') 
                  ? 'bg-amber-500 hover:bg-amber-600' 
                  : 'bg-green-600 hover:bg-green-700'}
              >
                {orders.every(o => o.status === 'delivered') ? '↩️ Mark Unfinished' : '✓ Mark All Completed'}
              </Button>
            )}
          </div>
          <Card className="overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Order #</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Amount</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   {orders.map(order => (
                     <tr key={order.id} className={`hover:bg-gray-50 ${order.status === 'delivered' ? 'bg-green-50' : ''}`}>
                        <td className="px-4 py-2 whitespace-nowrap text-xs font-mono text-gray-700">{order.id.slice(0,8)}...</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-black font-medium">{order.customerName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <Badge color={order.status === 'delivered' ? 'green' : 'blue'}>
                            {order.status === 'delivered' ? '✓ DONE' : 'PENDING'}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium text-black">₹{order.totalAmount}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-right space-x-2 flex justify-end gap-1">
                           {trip.status === 'draft' && (
                               <button onClick={() => handleRemoveOrder(order.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Remove</button>
                           )}
                           {trip.status !== 'draft' && (
                               <button 
                                 onClick={() => handleToggleOrderCompletion(order.id)}
                                 className={`text-xs font-medium px-2 py-1 rounded ${
                                   order.status === 'delivered'
                                     ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                     : 'bg-green-100 text-green-700 hover:bg-green-200'
                                 }`}
                                 title="Toggle order completion (temporary)"
                               >
                                 {order.status === 'delivered' ? '↩️ Undo' : '✓ Done'}
                               </button>
                           )}
                        </td>
                     </tr>
                   ))}
                   {orders.length === 0 && (
                     <tr><td colSpan={5} className="p-4 text-center text-gray-500">No orders assigned.</td></tr>
                   )}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
            <strong>ℹ️ Temporary Feature:</strong> Use these buttons to manually toggle order completion status. This will be replaced with automatic completion logic based on delivery confirmations.
          </div>
        </div>

        {/* Right: Loading Sheet Preview */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-800">Loading Sheet Preview</h3>
             <Button size="sm" variant="outline"><Printer className="h-4 w-4 mr-1" /> Print</Button>
           </div>
           
           <Card className="p-6 bg-white border-2 border-gray-200 border-dashed min-h-[300px]">
              <div className="text-center mb-6 border-b border-gray-100 pb-4">
                 <h2 className="text-lg font-bold text-black">LOADING MANIFEST</h2>
                 <p className="text-sm text-gray-600">Date: {trip.deliveryDate}</p>
                 <p className="text-sm text-gray-600">{trip.deliveryPersonName} - {trip.vehicleName}</p>
              </div>

              <div className="space-y-6">
                 {Object.keys(loadingSheet).length === 0 ? (
                   <div className="text-center text-gray-400 py-10">Assign orders to generate manifest</div>
                 ) : Object.entries(loadingSheet).map(([route, data]: [string, { count: number, amount: number, orders: Order[] }]) => (
                    <div key={route}>
                       <div className="flex justify-between items-center mb-2 bg-gray-50 p-2 rounded">
                          <span className="font-bold text-sm text-black">Group {route}</span>
                          <span className="text-xs text-gray-600">{data.count} Orders</span>
                       </div>
                       <div className="pl-4 space-y-1">
                          {data.orders.map(o => (
                             <div key={o.id} className="flex justify-between text-xs text-gray-700">
                                <span>{o.customerName}</span>
                                <span>₹{o.totalAmount}</span>
                             </div>
                          ))}
                          <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-100 mt-1 text-black">
                             <span>Subtotal</span>
                             <span>₹{data.amount.toLocaleString()}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-4 border-t-2 border-gray-800 flex justify-between items-center">
                 <span className="text-lg font-bold text-black">GRAND TOTAL</span>
                 <span className="text-lg font-bold text-black">₹{trip.totalAmount.toLocaleString()}</span>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
