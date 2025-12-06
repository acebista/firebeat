import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const SupabaseTest: React.FC = () => {
    const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
    const [message, setMessage] = useState('Testing connection...');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        try {
            // Test 1: Check if supabase client is initialized
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }

            // Test 2: Try to get session (should work even without auth)
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                throw new Error(`Session error: ${sessionError.message}`);
            }

            // Test 3: Try to query users table
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('count')
                .limit(1);

            const testResults = {
                clientInitialized: !!supabase,
                sessionCheck: sessionError ? 'Failed' : 'OK',
                sessionDetails: sessionData,
                usersTableAccess: usersError ? `Error: ${usersError.message}` : 'OK',
                usersTableError: usersError,
            };

            setDetails(testResults);

            if (usersError) {
                setStatus('error');
                setMessage(`Database connection issue: ${usersError.message}`);
            } else {
                setStatus('success');
                setMessage('Supabase connection successful!');
            }

        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Unknown error');
            setDetails({ error: error.toString() });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <div className={`p-6 rounded-lg shadow-lg ${status === 'testing' ? 'bg-blue-50 border-blue-200' :
                        status === 'success' ? 'bg-green-50 border-green-200' :
                            'bg-red-50 border-red-200'
                    } border-2`}>
                    <h1 className="text-2xl font-bold mb-4">
                        {status === 'testing' ? '🔄 Testing...' :
                            status === 'success' ? '✅ Success' :
                                '❌ Error'}
                    </h1>
                    <p className="text-lg mb-4">{message}</p>

                    {details && (
                        <div className="mt-4 p-4 bg-white rounded border">
                            <h2 className="font-bold mb-2">Details:</h2>
                            <pre className="text-xs overflow-auto">
                                {JSON.stringify(details, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="mt-6 space-y-2 text-sm">
                        <h3 className="font-bold">Supabase Configuration:</h3>
                        <p><strong>URL:</strong> https://qlosefnvwvmqeebfqdcg.supabase.co</p>
                        <p><strong>Key:</strong> {supabase ? 'Configured' : 'Missing'}</p>
                    </div>

                    <button
                        onClick={testConnection}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry Test
                    </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <h3 className="font-bold mb-2">⚠️ Common Issues:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Incorrect Supabase URL or API key</li>
                        <li>Database tables not created (run supabase_schema.sql)</li>
                        <li>RLS policies blocking access</li>
                        <li>Network/firewall issues</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
