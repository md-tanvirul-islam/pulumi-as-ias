import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";


const customTag = {
    createBy: "tanvir",
    env: "dev",
    platform: "Pulumi"
};

const vpc = new aws.ec2.Vpc("main", {
    cidrBlock: "10.0.0.0/16",
    instanceTenancy: "default",
    tags: {
        Name: "tan-vpc",
        ...customTag
    }
});

const igw = new aws.ec2.InternetGateway("internet-gateway", {
    tags: {
        Name: "tag-igw",
        ...customTag
    }
});

const attachIgw = new aws.ec2.InternetGatewayAttachment("internet-gateway-attachment", {
    internetGatewayId: igw.id,
    vpcId: vpc.id
});

const publicSubnet = new aws.ec2.Subnet("public-subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "ap-southeast-1a",
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "tan-public-subnet",
        ...customTag
    }
});

const publicRouteTable = new aws.ec2.RouteTable("route-table", {
    vpcId: vpc.id,
    routes: [
        {
            cidrBlock: "0.0.0.0/0",
            gatewayId: igw.id
        }
    ],
    tags: {
        Name: "route-table",
        ...customTag
    }
});

const publicRouteTableAssociation = new aws.ec2.RouteTableAssociation("route-table-association", {
    subnetId: publicSubnet.id,
    routeTableId: publicRouteTable.id
});

const publicSecurityGroup = new aws.ec2.SecurityGroup("security-group", {
    vpcId: vpc.id,
    description: "Allow SSH and HTTP",
    ingress: [
        {
            protocol: "tcp",
            fromPort: 22,
            toPort: 22,
            cidrBlocks: ["0.0.0.0/0"]
        },
        {
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"]
        }
    ],
    egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"]
    }],
    tags: {
        Name: "public-security-group",
        ...customTag
    }
});

// const bastionInstance = new aws.ec2.Instance("instance-1", {
//     ami: "ami-01938df366ac2d954",
//     instanceType: "t2.micro",
//     subnetId: publicSubnet.id,
//     associatePublicIpAddress: true,
//     vpcSecurityGroupIds: [publicSecurityGroup.id],
//     tags: {
//         Name: "Bastion",
//         ...customTag
//     }
// })

const instances = [];

for (let i = 1; i <= 3; i++) {
    const instance = new aws.ec2.Instance("instance",
        {
            ami: "ami-01938df366ac2d954",
            instanceType: "t2.micro",
            subnetId: publicSubnet.id,
            associatePublicIpAddress: true,
            privateIp: `10.0.1.${5 + i}`,
            keyName: "tan-key",
            tags: {
                Name: `instance-${i}`,
                ...customTag
            }
        },
        {
            dependsOn: [publicRouteTableAssociation, publicSubnet]
        }
    );

    instances.push(instance);
}

const instancesPublicIps = instances.map(instance => instance.publicIp);
const instancesPrivateIps = instances.map(instance => instance.privateIp);

export const vpcId = vpc.id
export const igwId = igw.id
export const publicSubnetId = publicSubnet.id
export const publicRouteTableId = publicRouteTable.id
export const publicSecurityGroupId = publicSecurityGroup.id
// export const bastionInstanceId = bastionInstance.id
export const publicIps = instancesPublicIps;
export const privateIps = instancesPrivateIps;