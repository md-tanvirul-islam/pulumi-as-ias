import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";


const newVpc = new aws.ec2.Vpc("main", {
    cidrBlock: "10.0.0.0/16",
    instanceTenancy: "default",
    tags: {
        name: "tan-vpc",
        createBy: "tanvir",
        env: "dev",
        platform: "Pulumi"
    }
})

export const vpcId = newVpc.id