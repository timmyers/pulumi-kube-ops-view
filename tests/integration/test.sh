#!/bin/sh -l

export PULUMI_CONFIG_PASSPHRASE=hello
export KUBECONFIG=./kubeconfig.yaml

pulumi login --local
pulumi stack init test || pulumi stack select test
pulumi preview