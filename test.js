import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import apiGateway = require('@aws-cdk/aws-apigateway');

import GitConfigProperty = CfnCodeRepository.GitConfigProperty;
import LMBaseStack from "./lm-base-stack";
import {StackConfiguration} from './configuration/stack-configuration';
import {Effect, Group, IRole, ManagedPolicy, PolicyDocument, PolicyStatement, Role, User} from '@aws-cdk/aws-iam';
import * as ec2 from "@aws-cdk/aws-ec2";
import {
    GatewayVpcEndpoint,
    GatewayVpcEndpointAwsService,
    IVpc,
    Peer,
    Port,
    SecurityGroup,
    SubnetType,
    Vpc
} from "@aws-cdk/aws-ec2";
import {
    CfnCodeRepository,
    CfnNotebookInstance,
    CfnNotebookInstanceLifecycleConfig
} from "@aws-cdk/aws-sagemaker";
import * as fs from "fs";
import {BlockPublicAccess, Bucket} from "@aws-cdk/aws-s3";
import {RemovalPolicy} from "@aws-cdk/core";
import {VpcLookupOptions} from "@aws-cdk/aws-ec2/lib/vpc-lookup";
import {IFunction} from "@aws-cdk/aws-lambda";
import {LambdaRestApi} from "@aws-cdk/aws-apigateway";

export class Comp2FileQualityStack extends LMBaseStack {
    private vpcId: any;
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        const lifecycleScriptPathOnStart = './lib/scripts/onStart.sh';
        const lifecycleScriptPathOnCreate = './lib/scripts/onCreate.sh';
        const lifeCycleName = 'Comp2FileQualityStackLifeCycle';

        let onStartScript = fs.readFileSync(lifecycleScriptPathOnStart, 'utf8');
        let onCreateScript = fs.readFileSync(lifecycleScriptPathOnCreate, 'utf8');


        // Override properties for local/sandbox deploys & region
        let properties: cdk.StackProps = {
            env: {
                region: StackConfiguration.region
            }
        };

         let  vpcLookupOptions :VpcLookupOptions = {
                vpcId:'vpc-06b8e561'
        };

        super(scope, id, properties);

        let vpc =  this.getVpc(this,vpcLookupOptions);
        console.log(vpc)



        let securityGroup = this.createSecurityGroup(this,vpc, false,'SecurityGroup');
        // securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(3306));
        // securityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(80));
        let securityRole = this.createSagemakerRole(this);
        let lambdaRole = this.createLambdaRole(this);
        let bucket = this.createS3Bucket(this);
        let notebookInstanceLifecycleConfig = this.createNotebookLifecycle(this, onStartScript, onCreateScript, lifeCycleName);
        this.createNotebook(this, securityGroup, securityRole, id, notebookInstanceLifecycleConfig.attrNotebookInstanceLifecycleConfigName,vpc);
        let lambdaHandler =this.createLambda(this,lambdaRole,'comp2FileQualityLambda.handler')
        let api = this.createApiGateway(this,lambdaHandler);
        let policyApi = this.configureApi('quality',api);
        policyApi.addMethod('POST');
        api.root.addProxy({
          defaultIntegration: new apiGateway.LambdaIntegration(lambdaHandler)
        })
        let s3BucketVpcGateway = this.configureVpcGateway(this ,vpc, 'S3VpcGateway');
    }


      getVpc(scope: any, vpcLookupOptions: VpcLookupOptions){
         return  ec2.Vpc.fromLookup(this,'VPC', vpcLookupOptions)
    }

    createSagemakerRole(scope: any) {
        return new Role(this, "sagemakerRole", {
            assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
            managedPolicies:[
            ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
            ],
            inlinePolicies: {
                smPolicy: new PolicyDocument({
                    statements: [new PolicyStatement({
                        effect: Effect.ALLOW,
                        actions: ["s3:*"],
                        resources: ["*"]
                    })],
                })
            }
        });
    }

    createLambdaRole(scope: any){
        return new Role(this, 'lambdaHandlerRole',{
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromManagedPolicyName(scope, 'global-deny', 'cloud-services/cloud-services-global-deny'),
                ManagedPolicy.fromManagedPolicyName(scope, 'shared-global-deny', 'cloud-services/cloud-services-shared-global-deny'),
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess')
            ],
        })
    }

    createSecurityGroup(scope: any, vpc: IVpc, trafficAllowed: boolean, name: string) {
        return new SecurityGroup(this, name, {
            vpc: vpc,
            description: "sales-comp-ml secruity- group",
            allowAllOutbound: trafficAllowed,
        });
    }

    createNotebookLifecycle(scope: any, lifecycleScriptPathOnStart: string, lifecycleScriptPathOnCreate: string, lifeCycleName: string,) {
        console.log(lifecycleScriptPathOnStart);
        console.log(lifecycleScriptPathOnCreate);

        return new CfnNotebookInstanceLifecycleConfig(
            this,
            lifeCycleName,
            {
                // notebookInstanceLifecycleConfigName: lifeCycleName,
                onStart: [{
                    content: cdk.Fn.base64(lifecycleScriptPathOnStart!)
                }]
                ,
                onCreate: [{
                        content: cdk.Fn.base64(lifecycleScriptPathOnCreate!)
                    }]
            }
        );
    }

    createNotebook(scope: any, securityGroup: SecurityGroup, securityRole: Role, id: string, lifeCycleName: string | undefined, vpc: IVpc) {
        console.log('SecurityGroup Subnet',vpc.privateSubnets[0].subnetId );
        return new CfnNotebookInstance(this, 'comp2FileQualityNotebook', {
            instanceType: 'ml.m5.xlarge',
            volumeSizeInGb: 5,
            securityGroupIds: [securityGroup.securityGroupId],
            subnetId: vpc.privateSubnets[0].subnetId,
            roleArn: securityRole.roleArn,
            // defaultCodeRepository: repositoryName,
            lifecycleConfigName: lifeCycleName
            // kmsKeyId: 'arn:aws:kms:us-east-1:448855094770:key/931729d1-7402-47ba-ac96-8e1b32ac3b77'
        })
    }
    createS3Bucket(scope:any){
        return new Bucket(this, 'comp2FileQualityBucket', {
            versioned: true,
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY

    });
    }
    createLambda(scope:any, role: IRole, handler:string) {
    return  new lambda.Function(this,'Comp2FileQualityHandler', {
      runtime: lambda.Runtime.PYTHON_3_6,// execution environment
      code: lambda.Code.asset('lambda'),  // code loaded from the "lambda" directory
      handler: handler,           // file is "sagemakerLambda", function is "handler"
      role: role
    });
    }
    createApiGateway(scope:any, lambdaHandler: IFunction){
     return   new apiGateway.LambdaRestApi(this, "Endpoint",{
      handler: lambdaHandler,
      cloudWatchRole:false,
      proxy:false,
      endpointTypes:[apiGateway.EndpointType.REGIONAL]
        });
    }
    configureApi(path: string,restApi: LambdaRestApi ){
       return restApi.root.addResource(path);

    }
    configureVpcGateway(scope:any, vpc: IVpc ,id: string){
        return new  GatewayVpcEndpoint(this, id,{
            service: GatewayVpcEndpointAwsService.S3,
            vpc: vpc,
            subnets: [{
                subnetType: SubnetType.PRIVATE
                }]
        })
    }
}
