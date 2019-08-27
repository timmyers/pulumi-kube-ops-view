<h1 align="center">🍹📈 pulumi-kube-ops-view</h1>

[![npm](https://img.shields.io/npm/v/@timmyers/pulumi-kube-ops-view.svg?style=popout)](https://www.npmjs.com/package/@timmyers/pulumi-kube-ops-view)
[![codecov](https://codecov.io/gh/timmyers/pulumi-kube-ops-view/branch/master/graph/badge.svg)](https://codecov.io/gh/timmyers/pulumi-kube-ops-view)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=timmyers/pulumi-kube-ops-view)](https://dependabot.com)

A [pulumi](https://www.pulumi.com) module for instantiating [Kubernetes Metrics Servers](https://github.com/kubernetes-incubator/kube-ops-view).

Aims to be a full-featured *pulumi native* alternative to the [helm chart](https://github.com/helm/charts/tree/master/stable/kube-ops-view). Currently only javascript/typescript are supported.  Other languages may follow.

## Usage

`yarn add @timmyers/pulumi-kube-ops-view`

```typescript
import KubeOpsView, { MetricsServerArgs } from '@timmyers/pulumi-kube-ops-view';

const args: MetricsServerArgs = {};
const metricsServer = new KubeOpsView('kube-ops-view', args);
```

The module exposes an interface `MetricsServerArgs`, which exposes many options that can be set, similar to the helm chart.

## Examples
Instantiate an EKS cluster in multiple AWS regions, and create a `kube-ops-view` in each.
```typescript
import * as aws from '@pulumi/aws';
import KubeOpsView from '@timmyers/pulumi-kube-ops-view';

const regions: aws.Region[] = [
  'us-west-2', // Oregon
  'eu-central-1', // Frankfurt
];

regions.forEach((region): void => {
  const provider = new aws.Provider(`provider-${region}`, { region });
  const defaultOpts: pulumi.ComponentResourceOptions = { provider };
  const cluster = new eks.Cluster(`cluster-${region}`, {}, defaultOpts);

  const k8sDefaultOpts = { providers: { kubernetes: cluster.provider } };
  const metricsServer = new KubeOpsView(name, {}, k8sDefaultOpts);
});
```

## Development
### Installation
Clone the repo, then:
`yarn`

### Running tests
`yarn test`

_More coming soon_