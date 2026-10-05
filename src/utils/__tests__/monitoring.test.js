import { MetricsCollector, PerformanceAlerts } from '../monitoring';

describe('MetricsCollector', () => {
  let collector;

  beforeEach(() => {
    collector = new MetricsCollector();
  });

  it('should initialize default counters, histograms, and gauges', () => {
    const json = collector.exportJSON();
    expect(json.http_requests_total).toBeDefined();
    expect(json.http_requests_total.type).toBe('counter');
    expect(json.http_request_duration_ms).toBeDefined();
    expect(json.http_request_duration_ms.type).toBe('histogram');
    expect(json.memory_usage_mb).toBeDefined();
    expect(json.memory_usage_mb.type).toBe('gauge');
  });

  it('should increment counters accurately', () => {
    collector.incrementCounter('http_requests_total', { method: 'GET' });
    collector.incrementCounter('http_requests_total', { method: 'GET' });
    const json = collector.exportJSON();
    expect(json.http_requests_total.value).toBe(2);
  });

  it('should set gauge values', () => {
    collector.setGauge('memory_usage_mb', 64);
    const json = collector.exportJSON();
    expect(json.memory_usage_mb.value).toBe(64);
  });

  it('should calculate histogram statistics correctly in exportJSON', () => {
    collector.recordHistogram('http_request_duration_ms', 50);
    collector.recordHistogram('http_request_duration_ms', 150);
    collector.recordHistogram('http_request_duration_ms', 250);

    const json = collector.exportJSON();
    expect(json.http_request_duration_ms.count).toBe(3);
    expect(json.http_request_duration_ms.sum).toBe(450);
    expect(json.http_request_duration_ms.avg).toBe(150);
  });

  it('should generate valid Prometheus export output with correct histogram bucket counts', () => {
    collector.recordHistogram('http_request_duration_ms', 0.05); // <= 0.1, <= 0.5, etc.
    collector.recordHistogram('http_request_duration_ms', 200);  // <= 500, <= 1000

    const output = collector.exportPrometheus();
    expect(output).toContain('# HELP http_requests_total');
    expect(output).toContain('# TYPE http_request_duration_ms histogram');
    expect(output).toContain('http_request_duration_ms_bucket{le="0.1"} 1');
    expect(output).toContain('http_request_duration_ms_bucket{le="500"} 2');
    expect(output).toContain('http_request_duration_ms_sum 200.05');
    expect(output).toContain('http_request_duration_ms_count 2');
  });
});

describe('PerformanceAlerts', () => {
  let alertSystem;

  beforeEach(() => {
    alertSystem = new PerformanceAlerts({ pageLoad: 1000 });
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
    console.error.mockRestore();
  });

  it('should trigger alert when threshold exceeded', () => {
    alertSystem.checkPageLoad(2000);
    const activeAlerts = alertSystem.getAlerts();
    expect(activeAlerts.length).toBe(1);
    expect(activeAlerts[0].id).toBe('slow_page_load');
  });

  it('should clear alerts when requested', () => {
    alertSystem.checkPageLoad(2000);
    expect(alertSystem.getAlerts().length).toBe(1);
    alertSystem.clearAlerts();
    expect(alertSystem.getAlerts().length).toBe(0);
  });
});
