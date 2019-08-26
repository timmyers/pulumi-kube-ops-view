#!/bin/sh -l

export PULUMI_CONFIG_PASSPHRASE=hello
pulumi login --local
pulumi stack init test || pulumi stack select test
pulumi up -y --skip-preview