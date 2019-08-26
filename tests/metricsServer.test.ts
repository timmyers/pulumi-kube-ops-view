
import KubeOpsView from '../src';

test('Metrics server is deployed by default', () => {
  const opsView = new KubeOpsView('kube-ops-view', {});
  expect(opsView.metricsServer).toBeDefined();
});

test('Metrics server is not deployed when set not to', () => {
  const opsView = new KubeOpsView('kube-ops-view', { createMetricsServer: false });
  expect(opsView.metricsServer).toBeUndefined();
});