import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as kubeTypes from '@pulumi/kubernetes/types/input'

// interface PDBDisabled { enabled: false };
// interface PDBEnabled { enabled: true, config: kubeTypes.policy.v1beta1.PodDisruptionBudget };

// export type PodDisruptionBudgetArgs = PDBDisabled | PDBEnabled;

export interface DeploymentArgs {
  namespace: pulumi.Input<string>;
  replicas: pulumi.Input<number>;
  annotations: pulumi.Input<{[key: string]: string}>;
  serviceAccountName: pulumi.Input<string>;
  securityContext: kubeTypes.core.v1.SecurityContext;
  image: {
    repository: pulumi.Input<string>;
    tag: pulumi.Input<string>;
    pullPolicy: pulumi.Input<string>;
  };
}

export default class Deployment extends pulumi.ComponentResource {
  public deployment: k8s.apps.v1.Deployment;
  public podDisruptionBudget: undefined | k8s.policy.v1beta1.PodDisruptionBudget;

  public constructor(name: string, args: DeploymentArgs, opts?: pulumi.ComponentResourceOptions) {
    super('k8s:kube-ops-view:deployment', name, { }, opts);

    const defaultOptions: pulumi.CustomResourceOptions = { parent: this };
    const { namespace, replicas, annotations, serviceAccountName, 
            securityContext, image } = args;
    const labels = { app: name };
    const port = 8080;
    const probe: kubeTypes.core.v1.Probe = { httpGet: { path: '/health', port } };

    this.deployment = new k8s.apps.v1.Deployment(`${name}-deployment`, {
      metadata: { namespace, labels },
      spec: {
        selector: {
          matchLabels: labels,
        },
        replicas,
        template: {
          metadata: { labels, annotations },
          spec: {
            serviceAccountName,
            containers: [{
              name: 'kube-ops-view',
              securityContext,
              image: `${image.repository}:${image.tag}`,
              imagePullPolicy: image.pullPolicy,
              ports: [{ containerPort: 8080 }],
              livenessProbe: probe,
              readinessProbe: probe,
            }],
          },
        },
      }
    }, defaultOptions);

    // Register outputs
    this.registerOutputs({
      deployment: this.deployment,
    });
  }
}