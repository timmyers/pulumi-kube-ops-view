#!/bin/sh -l

sed -i 's/localhost/server/g' /kubeconfig/kubeconfig.yaml
export PULUMI_CONFIG_PASSPHRASE=hello
export KUBECONFIG=/kubeconfig/kubeconfig.yaml

pulumi login --local
pulumi stack init test || pulumi stack select test
pulumi preview
# pulumi up -y --skip-preview