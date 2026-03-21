/**
 * Advanced Monitoring & Observability
 * Prometheus metrics, performance tracking, custom dashboards
 */

/**
 * Metrics collector - Prometheus compatible
 */
export class MetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.initializeMetrics();
  }

  initializeMetrics() {
    // Counter metrics
    this.defineCounter('http_requests_total', 'Total HTTP requests');
    this.defineCounter('api_errors_total', 'Total API errors');
    this.defineCounter('form_submissions_total', 'Total form submissions');
    this.defineCounter('page_views_total', 'Total page views');

    // Histogram metrics
    this.defineHistogram('http_request_duration_ms', 'HTTP request duration');
    this.defineHistogram('db_query_duration_ms', 'Database query duration');
    this.defineHistogram('component_render_time_ms', 'Component render time');

    // Gauge metrics
    this.defineGauge('active_users', 'Active user count');
    this.defineGauge('memory_usage_mb', 'Memory usage in MB');
    this.defineGauge('bundle_size_kb', 'Bundle size in KB');
  }

  defineCounter(name, help) {
    this.metrics.set(name, {
      type: 'counter',
      help,
      value: 0,
      labels: new Map(),
    });
  }

  defineHistogram(name, help) {
    this.metrics.set(name, {
      type: 'histogram',
      help,
      buckets: [0.1, 0.5, 1, 5, 10, 50, 100, 500, 1000],
      values: [],
    });
  }

  defineGauge(name, help) {
    this.metrics.set(name, {
      type: 'gauge',
      help,
      value: 0,
    });
  }

  /**
   * Increment counter
   */
  incrementCounter(name, labels = {}) {
    const metric = this.metrics.get(name);
    if (metric && metric.type === 'counter') {
      const labelKey = JSON.stringify(labels);
      if (!metric.labels.has(labelKey)) {
        metric.labels.set(labelKey, 0);
      }
      metric.labels.set(labelKey, metric.labels.get(labelKey) + 1);
      metric.value++;
    }
  }

  /**
   * Record histogram value
   */
  recordHistogram(name, value) {
    const metric = this.metrics.get(name);
    if (metric && metric.type === 'histogram') {
      metric.values.push(value);
    }
  }

  /**
   * Set gauge value
   */
  setGauge(name, value) {
    const metric = this.metrics.get(name);
    if (metric && metric.type === 'gauge') {
      metric.value = value;
    }
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus() {
    let output = '';

    for (const [name, metric] of this.metrics) {
      output += `# HELP ${name} ${metric.help}\n`;
      output += `# TYPE ${name} ${metric.type}\n`;

      if (metric.type === 'counter') {
        for (const [labels, value] of metric.labels) {
          output += `${name}${labels} ${value}\n`;
        }
        output += `${name}_total ${metric.value}\n`;
      } else if (metric.type === 'gauge') {
        output += `${name} ${metric.value}\n`;
      } else if (metric.type === 'histogram') {
        const sum = metric.values.reduce((a, b) => a + b, 0);
        const count = metric.values.length;
        const avg = count > 0 ? sum / count : 0;

        for (const bucket of metric.buckets) {
          const bucketCount = metric.values.filter(v => v <= bucket).length;
          output += `${name}_bucket{le="${bucket}"} ${bucketCount}\n`;
        }
        output += `${name}_bucket{le="+Inf"} ${count}\n`;
        output += `${name}_sum ${sum}\n`;
        output += `${name}_count ${count}\n`;
        output += `${name}_avg ${avg}\n`;
      }
    }

    return output;
  }

  /**
   * Get all metrics as JSON
   */
  exportJSON() {
    const data = {};
    for (const [name, metric] of this.metrics) {
      data[name] = {
        type: metric.type,
        help: metric.help,
        ...(() => {
          if (metric.type === 'counter') {
            return { value: metric.value, labels: Object.fromEntries(metric.labels) };
          } else if (metric.type === 'gauge') {
            return { value: metric.value };
          } else if (metric.type === 'histogram') {
            return {
              values: metric.values,
              sum: metric.values.reduce((a, b) => a + b, 0),
              count: metric.values.length,
              avg: metric.values.length > 0 ? metric.values.reduce((a, b) => a + b, 0) / metric.values.length : 0,
            };
          }
        })(),
      };
    }
    return data;
  }
}

/**
 * Global metrics instance
 */
export const metrics = new MetricsCollector();

/**
 * Performance observer for Core Web Vitals
 */
export function setupPerformanceObserver() {
  if ('web-vital' in window) {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.recordHistogram('lcp_ms', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          metrics.setGauge('cls_score', clsScore);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstInput = entries[0];
      metrics.recordHistogram('fid_ms', firstInput.processingDuration);
    }).observe({ type: 'first-input', buffered: true });
  }
}

/**
 * Track page load timing
 */
export function trackPageLoadTiming() {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    metrics.recordHistogram('page_load_time_ms', pageLoadTime);
    metrics.recordHistogram('connect_time_ms', connectTime);
    metrics.recordHistogram('render_time_ms', renderTime);
  });
}

/**
 * Monitor memory usage
 */
export function monitorMemoryUsage() {
  if (performance.memory) {
    setInterval(() => {
      const memoryUsage = performance.memory.usedJSHeapSize / 1048576; // Convert to MB
      metrics.setGauge('memory_usage_mb', Math.round(memoryUsage));
    }, 5000); // Every 5 seconds
  }
}

/**
 * Create performance alerts
 */
export class PerformanceAlerts {
  constructor(thresholds = {}) {
    this.thresholds = {
      pageLoad: 3000,
      apiResponse: 1000,
      memoryUsage: 100,
      errorRate: 0.05,
      ...thresholds,
    };
    this.alerts = [];
  }

  checkPageLoad(duration) {
    if (duration > this.thresholds.pageLoad) {
      this.createAlert('slow_page_load', `Page load took ${duration}ms (threshold: ${this.thresholds.pageLoad}ms)`, 'warning');
    }
  }

  checkApiResponse(duration) {
    if (duration > this.thresholds.apiResponse) {
      this.createAlert('slow_api_response', `API request took ${duration}ms (threshold: ${this.thresholds.apiResponse}ms)`, 'warning');
    }
  }

  checkMemoryUsage(usage) {
    if (usage > this.thresholds.memoryUsage) {
      this.createAlert('high_memory_usage', `Memory usage: ${usage}MB (threshold: ${this.thresholds.memoryUsage}MB)`, 'critical');
    }
  }

  checkErrorRate(rate) {
    if (rate > this.thresholds.errorRate) {
      this.createAlert('high_error_rate', `Error rate: ${(rate * 100).toFixed(2)}% (threshold: ${(this.thresholds.errorRate * 100).toFixed(2)}%)`, 'critical');
    }
  }

  createAlert(id, message, severity = 'warning') {
    const alert = {
      id,
      message,
      severity,
      timestamp: new Date().toISOString(),
    };

    this.alerts.push(alert);

    // Send to monitoring service
    console.warn(`[ALERT ${severity.toUpperCase()}]`, message);

    // In production, would send to Sentry/DataDog
    if (severity === 'critical') {
      this.escalate(alert);
    }
  }

  escalate(alert) {
    // Would trigger PagerDuty, Slack, etc.
    console.error('[ESCALATED]', alert);
  }

  getAlerts() {
    return this.alerts;
  }

  clearAlerts() {
    this.alerts = [];
  }
}

export const alerts = new PerformanceAlerts();
