package main

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/ec2"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {

	customTag := pulumi.StringMap {
		"name" : pulumi.String("tan-vpc"),
		"env" : pulumi.String("test"),
		"IaSPlatform" : pulumi.String("Pulumi"),
	}

	pulumi.Run(func(ctx *pulumi.Context) error {
		_, err := ec2.NewVpc(ctx, "main", &ec2.VpcArgs{
			CidrBlock: pulumi.String("10.0.0.0/16"),
			Tags: customTag,
		})
		if err != nil {
			return err
		}
		return nil
	})
}
