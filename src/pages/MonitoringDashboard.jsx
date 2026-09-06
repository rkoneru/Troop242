/**
 * Monitoring Dashboard
 * Real-time metrics and observability for admins
 * Prometheus metrics, performance tracking, alerts
 */

import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Activity, Zap } from 'lucide-react';
import { metrics, alerts } from '../utils/monitoring';

export default function MonitoringDashboard() {
  const [metricsData, setMetricsData] = useState(null);
  const [alertsList, setAlertsList] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics display
      setMetricsData(metrics.exportJSON());
      setAlertsList(alerts.getAlerts());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (!metricsData) {
    return <div className="p-4">Loading metrics...</div>;
  }

  const httpRequests = metricsData.http_requests_total?.value || 0;
  const errorCount = metricsData.api_errors_total?.value || 0;
  const errorRate = httpRequests > 0 ? ((errorCount / httpRequests) * 100).toFixed(2) : 0;
  const memoryUsage = metricsData.memory_usage_mb?.value || 0;
  const pageViews = metricsData.page_views_total?.value || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Monitoring Dashboard</h1>
        <select
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
          className="input"
        >
          <option value={1000}>1s refresh</option>
          <option value={5000}>5s refresh</option>
          <option value={10000}>10s refresh</option>
          <option value={30000}>30s refresh</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="HTTP Requests"
          value={httpRequests}
          icon={<Activity size={24} />}
          trend="+12%"
          color="blue"
        />
        <MetricCard
          title="Error Rate"
          value={`${errorRate}%`}
          icon={<AlertCircle size={24} />}
          trend={errorCount > 0 ? 'warning' : 'good'}
          color={errorRate > 5 ? 'red' : 'green'}
        />
        <MetricCard
          title="Memory Usage"
          value={`${memoryUsage}MB`}
          icon={<Zap size={24} />}
          trend="stable"
          color="orange"
        />
        <MetricCard
          title="Page Views"
          value={pageViews}
          icon={<TrendingUp size={24} />}
          trend="+8%"
          color="purple"
        />
      </div>

      {/* Alerts Section */}
      {alertsList.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <h2 className="font-bold text-lg mb-3">⚠️ Active Alerts ({alertsList.length})</h2>
          <div className="space-y-2">
            {alertsList.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3 rounded ${
                  alert.severity === 'critical'
                    ? 'bg-red-100 text-red-800 border-l-4 border-red-600'
                    : 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{alert.id}</span>
                  <span className="text-sm">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PerformanceMetrics metricsData={metricsData} />
        <HistogramChart metricsData={metricsData} />
      </div>

      {/* Prometheus Export */}
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">📤 Prometheus Metrics Export</h3>
        <button
          onClick={() => {
            const prometheus = metrics.exportPrometheus();
            const blob = new Blob([prometheus], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `metrics-${new Date().toISOString()}.txt`;
            a.click();
          }}
          className="btn-primary mb-3"
        >
          Download Prometheus Format
        </button>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-auto max-h-64">
          {metrics.exportPrometheus().split('\n').slice(0, 20).join('\n')}...
        </pre>
      </div>

      {/* Health Check */}
      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
        <h3 className="font-bold">✅ System Health</h3>
        <div className="mt-2 space-y-1 text-sm">
          <HealthCheck
            label="API Response Time"
            status={metricsData.http_request_duration_ms?.avg < 500}
          />
          <HealthCheck
            label="Error Rate"
            status={errorRate < 5}
          />
          <HealthCheck
            label="Memory Usage"
            status={memoryUsage < 100}
          />
          <HealthCheck
            label="Page Load Time"
            status={metricsData.page_load_time_ms?.avg < 3000}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, color }) {
  return (
    <div className={`card p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-xs mt-1 text-gray-500">{trend}</p>
        </div>
        <div className={`text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );
}

function PerformanceMetrics({ metricsData }) {
  return (
    <div className="card p-4">
      <h3 className="font-bold mb-4">⚡ Performance Metrics</h3>
      <div className="space-y-3 text-sm">
        <MetricRow
          label="Avg Page Load"
          value={`${metricsData.page_load_time_ms?.avg?.toFixed(0) || 0}ms`}
          good={metricsData.page_load_time_ms?.avg < 3000}
        />
        <MetricRow
          label="Avg API Response"
          value={`${metricsData.http_request_duration_ms?.avg?.toFixed(0) || 0}ms`}
          good={metricsData.http_request_duration_ms?.avg < 500}
        />
        <MetricRow
          label="Avg Component Render"
          value={`${metricsData.component_render_time_ms?.avg?.toFixed(0) || 0}ms`}
          good={metricsData.component_render_time_ms?.avg < 50}
        />
        <MetricRow
          label="Form Submissions"
          value={metricsData.form_submissions_total?.value || 0}
          good={true}
        />
      </div>
    </div>
  );
}

function HistogramChart({ metricsData }) {
  // Bolt Optimization: Perform a single linear pass over the values array
  // instead of 4 separate .filter() passes, avoiding O(4N) traversals and array allocations per render.
  const values = metricsData.http_request_duration_ms?.values || [];
  let lt100 = 0;
  let b100to500 = 0;
  let b500to1000 = 0;
  let gt1000 = 0;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v < 100) lt100++;
    else if (v < 500) b100to500++;
    else if (v < 1000) b500to1000++;
    else gt1000++;
  }

  const total = metricsData.http_request_duration_ms?.count || 1;

  return (
    <div className="card p-4">
      <h3 className="font-bold mb-4">📈 Request Distribution</h3>
      <div className="space-y-3">
        <HistogramBar label="<100ms" count={lt100} total={total} />
        <HistogramBar label="100-500ms" count={b100to500} total={total} />
        <HistogramBar label="500-1000ms" count={b500to1000} total={total} />
        <HistogramBar label=">1000ms" count={gt1000} total={total} />
      </div>
    </div>
  );
}

function MetricRow({ label, value, good }) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${good ? 'text-green-600' : 'text-red-600'}`}>
        {value}
      </span>
    </div>
  );
}

function HistogramBar({ label, count, total }) {
  const percentage = (count / Math.max(total, 1)) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-sm text-gray-600">{label}</span>
      <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-right text-sm font-semibold">{count}</span>
    </div>
  );
}

function HealthCheck({ label, status }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${status ? 'bg-green-600' : 'bg-red-600'}`} />
      <span>{label}</span>
      <span className="ml-auto text-sm font-semibold">{status ? '✓' : '✗'}</span>
    </div>
  );
}
