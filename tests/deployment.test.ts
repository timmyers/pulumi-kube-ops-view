
import KubeOpsView from '../src';

test('Namespace defaults to kube-system', () => {
  const server = new KubeOpsView('kube-ops-view', {});

  server.deployment.metadata.namespace.apply(namespace => {
    expect(namespace).toBe('kube-system');
  });
});

test('Namespace option works as expected', () => {
  const server = new KubeOpsView('kube-ops-view', { namespace: 'default' });

  server.deployment.metadata.namespace.apply(namespace => {
    expect(namespace).toBe('default');
  });
});

test('Image details will default', () => {
  const server = new KubeOpsView('kube-ops-view', {
    image: {},
  });

  expect(server.deployment).toBeDefined();
});