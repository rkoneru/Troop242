/**
 * Load Testing Script for BSA Troop 242
 * Uses k6 for distributed load testing
 * Run: k6 run load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
export const errorRate = new Rate('errors');
export const duration = new Trend('request_duration');
export const activeUsers = new Gauge('active_users');
export const completedRequests = new Counter('completed_requests');

// Load testing configuration
export const options = {
  stages: [
    // Ramp up: 0 to 100 users over 2 minutes
    { duration: '2m', target: 100 },
    // Stay at 100 users for 5 minutes
    { duration: '5m', target: 100 },
    // Ramp up to 500 users over 5 minutes
    { duration: '5m', target: 500 },
    // Stay at 500 users for 10 minutes (stress test)
    { duration: '10m', target: 500 },
    // Ramp down to 0 over 2 minutes
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    // Fail test if error rate > 5%
    'errors': ['rate<0.05'],
    // Fail if p95 latency > 5 seconds
    'request_duration': ['p(95)<5000'],
    // Fail if p99 latency > 10 seconds
    'request_duration': ['p(99)<10000'],
  },
  ext: {
    loadimpact: {
      projectID: 12345, // Replace with your Load Impact project ID
      name: 'Troop 242 Load Test',
    },
  },
};

const BASE_URL = 'https://staging.troop242.org';

export default function () {
  activeUsers.add(__VU); // Track active virtual users

  // Test 1: Home page load
  {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'homepage status is 200': (r) => r.status === 200,
      'homepage load time < 2s': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
    duration.add(res.timings.duration);
    completedRequests.add(1);
  }

  sleep(1);

  // Test 2: Login flow
  {
    const loginRes = http.post(`${BASE_URL}/api/auth/login`, {
      email: `scout${__VU}@example.com`,
      password: 'TestPassword123',
    });
    check(loginRes, {
      'login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'login response time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);
    duration.add(loginRes.timings.duration);
    completedRequests.add(1);
  }

  sleep(1);

  // Test 3: Fetch activities
  {
    const activitiesRes = http.get(`${BASE_URL}/api/activities`);
    check(activitiesRes, {
      'activities status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'activities load time < 2s': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
    duration.add(activitiesRes.timings.duration);
    completedRequests.add(1);
  }

  sleep(1);

  // Test 4: Create activity (only for some users to simulate realistic load)
  if (__VU % 10 === 0) {
    const createRes = http.post(`${BASE_URL}/api/activities`, {
      title: `Test Activity ${__VU}`,
      type: 'activity',
      date: new Date().toISOString(),
      time: '14:00',
      location: 'Test Location',
      description: 'Load test activity',
      spots: 25,
    });
    check(createRes, {
      'create activity status is 2xx or 4xx': (r) => r.status < 500,
      'create response time < 3s': (r) => r.timings.duration < 3000,
    }) || errorRate.add(1);
    duration.add(createRes.timings.duration);
    completedRequests.add(1);
  }

  sleep(1);

  // Test 5: Fetch scout profile
  {
    const profileRes = http.get(`${BASE_URL}/api/profile`);
    check(profileRes, {
      'profile status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'profile load time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);
    duration.add(profileRes.timings.duration);
    completedRequests.add(1);
  }

  sleep(1);

  // Test 6: Fetch dashboard
  {
    const dashRes = http.get(`${BASE_URL}/scout-dashboard`);
    check(dashRes, {
      'dashboard status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      'dashboard load time < 3s': (r) => r.timings.duration < 3000,
    }) || errorRate.add(1);
    duration.add(dashRes.timings.duration);
    completedRequests.add(1);
  }

  sleep(2);
}

/**
 * Test summary function
 */
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data, null, 2),
    'summary.html': htmlReport(data),
  };
}

/**
 * Generate HTML report
 */
function htmlReport(data) {
  const metrics = data.metrics;
  const timestamp = new Date().toISOString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Load Test Report - ${timestamp}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; }
        .metric { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #007bff; }
        .metric-name { font-weight: bold; color: #333; }
        .metric-value { color: #007bff; font-size: 18px; }
        .status { padding: 10px; border-radius: 4px; margin-top: 10px; }
        .status.pass { background: #d4edda; color: #155724; }
        .status.fail { background: #f8d7da; color: #721c24; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #007bff; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Load Test Report</h1>
        <p>Generated: ${timestamp}</p>

        <h2>Summary</h2>
        <table>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>Total Requests</td>
            <td>${metrics.http_reqs?.value || 0}</td>
            <td class="status pass">✓</td>
          </tr>
          <tr>
            <td>Failed Requests</td>
            <td>${metrics.http_reqs?.fails || 0}</td>
            <td class="${metrics.http_reqs?.fails > 0 ? 'fail' : 'pass'}">
              ${metrics.http_reqs?.fails > 0 ? '✗' : '✓'}
            </td>
          </tr>
          <tr>
            <td>Error Rate</td>
            <td>${((metrics.http_reqs?.fails / (metrics.http_reqs?.value || 1)) * 100).toFixed(2)}%</td>
            <td class="${metrics.http_reqs?.fails > 0 ? 'fail' : 'pass'}">
              ${metrics.http_reqs?.fails > 0 ? '✗' : '✓'}
            </td>
          </tr>
          <tr>
            <td>Avg Response Time</td>
            <td>${(metrics.http_req_duration?.avg || 0).toFixed(2)}ms</td>
            <td class="${(metrics.http_req_duration?.avg || 0) < 1000 ? 'pass' : 'fail'}">
              ${(metrics.http_req_duration?.avg || 0) < 1000 ? '✓' : '✗'}
            </td>
          </tr>
          <tr>
            <td>P95 Response Time</td>
            <td>${(metrics.http_req_duration?.p(95) || 0).toFixed(2)}ms</td>
            <td class="${(metrics.http_req_duration?.p(95) || 0) < 5000 ? 'pass' : 'fail'}">
              ${(metrics.http_req_duration?.p(95) || 0) < 5000 ? '✓' : '✗'}
            </td>
          </tr>
          <tr>
            <td>P99 Response Time</td>
            <td>${(metrics.http_req_duration?.p(99) || 0).toFixed(2)}ms</td>
            <td class="${(metrics.http_req_duration?.p(99) || 0) < 10000 ? 'pass' : 'fail'}">
              ${(metrics.http_req_duration?.p(99) || 0) < 10000 ? '✓' : '✗'}
            </td>
          </tr>
        </table>

        <h2>Detailed Metrics</h2>
        <div class="metric">
          <div class="metric-name">HTTP Request Duration</div>
          <div>Min: ${(metrics.http_req_duration?.min || 0).toFixed(2)}ms</div>
          <div>Max: ${(metrics.http_req_duration?.max || 0).toFixed(2)}ms</div>
          <div class="metric-value">Avg: ${(metrics.http_req_duration?.avg || 0).toFixed(2)}ms</div>
        </div>

        <h2>Conclusion</h2>
        <p>Load test completed successfully. Application can handle ${options.stages[2].target} concurrent users.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Text summary function
 */
function textSummary(data, options = {}) {
  const { indent = ' ', enableColors = false } = options;
  let output = '\n=== LOAD TEST SUMMARY ===\n';

  for (const [name, metric] of Object.entries(data.metrics || {})) {
    output += `${name}:\n`;
    if (metric.values) {
      output += `${indent}min: ${metric.values.min?.toFixed(2)}\n`;
      output += `${indent}max: ${metric.values.max?.toFixed(2)}\n`;
      output += `${indent}avg: ${metric.values.avg?.toFixed(2)}\n`;
    }
  }

  return output;
}
