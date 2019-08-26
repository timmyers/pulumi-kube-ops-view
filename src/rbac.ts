import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as kubeTypes from '@pulumi/kubernetes/types/input'

export interface RbacArgs {
  namespace?: string;
}

export default class Rbac extends pulumi.ComponentResource {
  public serviceAccount: k8s.core.v1.ServiceAccount;
  public clusterRole: k8s.rbac.v1.ClusterRole;

  public constructor(name: string, args: RbacArgs, opts?: pulumi.ComponentResourceOptions) {
    super('k8s:kube-ops-view:rbac', name, { }, opts);

    const defaultOptions: pulumi.CustomResourceOptions = { parent: this };
    const labels = { app: name };

    const clusterRoleRules: kubeTypes.rbac.v1.PolicyRule[] = [{
      apiGroups: [''],
      resources: ['nodes', 'pods'],
      verbs: ['list'],
    }, {
      apiGroups: ['metrics.k8s.io'],
      resources: ['nodes', 'pods'],
      verbs: ['get', 'list'],
    }];

    this.clusterRole = new k8s.rbac.v1.ClusterRole(`${name}-clusterRole`, {
      metadata: {
        name: 'kube-ops-view',
        labels,
      },
      rules: clusterRoleRules,
    }, defaultOptions);

    this.serviceAccount = new k8s.core.v1.ServiceAccount(`${name}-serviceAccount`, {
      metadata: {
        name: 'kube-ops-view',
        labels,
      },
    }, defaultOptions);

    const clusterRoleBinding = new k8s.rbac.v1.ClusterRoleBinding(`${name}-clusterrolebinding`, {
      metadata: {
        labels,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
        name: this.clusterRole.metadata.name,
      },
      subjects: [{
        kind: 'ServiceAccount',
        name: this.serviceAccount.metadata.name,
        namespace: args.namespace,
      }]
    }, defaultOptions);

    this.registerOutputs({
      serviceAccount: this.serviceAccount,
      clusterRole: this.clusterRole,
    });
  }
}