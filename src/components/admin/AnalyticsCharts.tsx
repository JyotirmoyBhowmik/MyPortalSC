"use client";

import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";

type TimeSeriesData = { date: string; views: number }[];
type DeviceData = { name: string; value: number }[];
type PageData = { name: string; value: number }[];

interface AnalyticsChartsProps {
    timeSeries: TimeSeriesData;
    deviceStats: DeviceData;
    topPages: PageData;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function AnalyticsCharts({ timeSeries, deviceStats, topPages }: AnalyticsChartsProps) {
    const formattedTimeSeries = useMemo(() => {
        return timeSeries.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }));
    }, [timeSeries]);

    return (
        <div className="space-y-6">
            {/* Time Series Chart */}
            <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-bold mb-6">Page Views (Last 30 Days)</h3>
                <div className="h-72 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedTimeSeries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                            <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#8b5cf6' }}
                                cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages Bar Chart */}
                <div className="glass rounded-xl p-6">
                    <h3 className="text-sm font-bold mb-6">Top Pages</h3>
                    <div className="h-64 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topPages} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <CartesianGrid stroke="#374151" strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} width={100} tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                    cursor={{ fill: '#374151', opacity: 0.4 }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Types Pie Chart */}
                <div className="glass rounded-xl p-6">
                    <h3 className="text-sm font-bold mb-6">Device Breakdown</h3>
                    <div className="h-64 w-full text-xs flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    label={({ name, percent = 0 }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {deviceStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
