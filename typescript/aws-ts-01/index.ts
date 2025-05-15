import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";


const customTag = {
    createBy: "tanvir",
    env: "dev",
    platform: "Pulumi"
};

const newVpc = new aws.ec2.Vpc("main", {
    cidrBlock: "10.0.0.0/16",
    tags: {
        Name: "tan-vpc",
        ...customTag
    }
});

const publicSubnet = new aws.ec2.Subnet("public-subnet", {
    vpcId: newVpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "ap-southeast-1a",
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "tan-public-subnet",
        ...customTag
    }
});

const ec2Instance1 = new aws.ec2.Instance("instance-1", {
    ami: "ami-01938df366ac2d954",
    instanceType: "t2.micro",
    subnetId: publicSubnet.id,
    associatePublicIpAddress: true,
    tags: {
        Name: "instance-1",
        ...customTag
    }
})

export const vpcId = newVpc.id
export const publicSubnetId = publicSubnet.id
export const ec2Instance1Id = ec2Instance1.id