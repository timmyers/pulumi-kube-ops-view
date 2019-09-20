import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';

export interface ServiceArgs {
  namespace: pulumi.Input<string>;
  port: pulumi.Input<number>;
  type: pulumi.Input<string>;
}

export default class Service extends pulumi.ComponentResource {
  public service: k8s.core.v1.Service;

  public constructor(name: string, args: ServiceArgs, opts?: pulumi.ComponentResourceOptions) {
    super('k8s:kube-ops-view:service', name, { }, opts);

    const defaultOptions: pulumi.CustomResourceOptions = { parent: this };

    this.service = new k8s.core.v1.Service(`${name}-service`, {
      metadata: {
        namespace: args.namespace,
        labels: {
          app: name,
        }
      },
      spec: {
        ports: [{
          port: args.port,
          protocol: 'TCP',
          targetPort: 'https'
        }],
        selector: {
          app: name,
        },
        type: args.type,
      },
    }, defaultOptions);

    this.registerOutputs({
      service: this.service,
    });
  }
}