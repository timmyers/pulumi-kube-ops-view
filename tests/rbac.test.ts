
import KubeOpsView from '../src';

test('RBAC resources are created by default', () => {
  const server = new KubeOpsView('kube-ops-view', {});

  expect(server.serviceAccount).toBeDefined();
  expect(server.clusterRole).toBeDefined();
});

test('RBAC resources are not created if option is set', () => {
  const server = new KubeOpsView('kube-ops-view', {
    rbac: false,
  });

  expect(server.serviceAccount).toBeUndefined();
  expect(server.clusterRole).toBeUndefined();
});
