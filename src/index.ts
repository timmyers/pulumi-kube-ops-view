import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as kubeTypes from '@pulumi/kubernetes/types/input'
import { CustomResourceOptions } from '@pulumi/pulumi';
import MetricsServer from '@timmyers/pulumi-k8s-metrics-server';
import Deployment from './deployment';
// import Service from './service';
import Rbac from './rbac';

export interface MetricsServerArgs {
  namespace?: string;
  createMetricsServer?: boolean;
  rbac?: boolean; // Enable Role-based authentication
  apiService?: {
    create?: boolean;
  };
  hostNetwork?: {
    enabled?: boolean;
  };
  // podDisruptionBudget?: PodDisruptionBudgetArgs;
  image?:  {
    repository?: string;
    tag?: string;
    pullPolicy?: string;
  };
  replicas?: number;
  securityContext?: kubeTypes.core.v1.SecurityContext;
  // deployment: DeploymentArgs;
}

const defaults = (args: MetricsServerArgs): MetricsServerArgs => {
  if (args.namespace === undefined) {
    args.namespace = 'kube-system';
  }

  if (args.createMetricsServer === undefined) {
    args.createMetricsServer = true;
  }

  if (args.rbac === undefined) {
    args.rbac = true;
  }

  // if (args.apiService === undefined) {
  //   args.apiService = { create: true };
  // } else {
  //   if (args.apiService.create === undefined) args.apiService.create = true;
  // }

  // if (args.podDisruptionBudget === undefined) {
  //   args.podDisruptionBudget = { enabled: false };
  // }

  const imageTag = '19.9.0'

  if (args.image === undefined) {
    args.image = { 
      repository: 'hjacobs/kube-ops-view',
      tag: imageTag,
      pullPolicy: 'IfNotPresent',
    }
  } else {
    if (args.image.repository === undefined) args.image.repository = 'hjacobs/kube-ops-view';
    if (args.image.tag === undefined) args.image.tag = imageTag;
    if (args.image.pullPolicy === undefined) args.image.pullPolicy = 'IfNotPresent';
  }

  if (args.replicas === undefined) {
    args.replicas = 1;
  }

  if (args.securityContext === undefined) {
    args.securityContext = {};
  }

  return args;
}

export default class KubeOpsView extends pulumi.ComponentResource {
  public metricsServer: undefined | MetricsServer;
  public deployment: k8s.apps.v1.Deployment;
  public service: k8s.core.v1.Service;
  public apiService: undefined | k8s.apiregistration.v1beta1.APIService;
  public serviceAccount: undefined | k8s.core.v1.ServiceAccount;
  public clusterRole: undefined | k8s.rbac.v1.ClusterRole;

  public constructor(name: string, argsIn: MetricsServerArgs, opts?: pulumi.ComponentResourceOptions) {
    super('k8s:kube-ops-view', name, { }, opts);

    const defaultOptions: CustomResourceOptions = { parent: this };
    const args = defaults(argsIn);
    const { namespace, createMetricsServer, rbac } = args;

    this.metricsServer = undefined;
    if (args.createMetricsServer)  {
      this.metricsServer = new MetricsServer(name, {}, defaultOptions);
    }

    let rbacResource: Rbac|undefined = undefined;
    if (rbac) {
      rbacResource = new Rbac(name, {
        namespace,
      }, defaultOptions);
    }

    const deployment = new Deployment(name, {
      namespace,
      replicas: args.replicas,
      annotations: {},
      serviceAccountName: rbacResource ? rbacResource.serviceAccount.metadata.name: '',
      securityContext: args.securityContext,
      image: {
        repository: args.image.repository,
        tag: args.image.tag,
        pullPolicy: args.image.pullPolicy,
      },
    }, defaultOptions);

    // const service = new Service(name, {
    //   namespace: args.namespace,
    //   createApiService: args.apiService && args.apiService.create,
    //   port: 443,
    //   type: 'ClusterIP',
    // }, defaultOptions);

    // Register outputs
    this.deployment = deployment.deployment;
    // this.service = service.service;
    // this.apiService = service.apiService;
    this.serviceAccount = rbacResource ? rbacResource.serviceAccount : undefined;
    this.clusterRole = rbacResource ? rbacResource.clusterRole : undefined;

    this.registerOutputs({
      metricsServer: this.metricsServer,
      deployment: this.deployment,
      serviceAccount: this.serviceAccount,
      clusterRole: this.clusterRole,
    });
  }
};