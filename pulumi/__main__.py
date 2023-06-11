"""An AWS Python Pulumi program"""

import pulumi
import pulumi_awsx as awsx
import pulumi_eks as eks
import pulumi_kubernetes as kubernetes

# Create an ECR repository and image for grapql yoga server api
app_name = "graphql-yoga-api"
repository = awsx.ecr.Repository("my-repo")
image = awsx.ecr.Image("graphql-yoga-image",
    repository_url=repository.url,
    path="../app")

# Create an EKS cluster with the default configuration.
cluster = eks.Cluster("cluster")
cluster_provider = kubernetes.Provider("clusterProvider",
    kubeconfig=cluster.kubeconfig,
    enable_server_side_apply=True)

# Creates the Deployment for app
deployment = kubernetes.apps.v1.Deployment("deployment",
    metadata=kubernetes.meta.v1.ObjectMetaArgs(
        labels={
            "appClass": app_name,
        },
    ),
    spec=kubernetes.apps.v1.DeploymentSpecArgs(
        replicas=2,
        selector=kubernetes.meta.v1.LabelSelectorArgs(
            match_labels={
                "appClass": app_name,
            },
        ),
        template=kubernetes.core.v1.PodTemplateSpecArgs(
            metadata=kubernetes.meta.v1.ObjectMetaArgs(
                labels={
                    "appClass": app_name,
                },
            ),
            spec=kubernetes.core.v1.PodSpecArgs(
                containers=[kubernetes.core.v1.ContainerArgs(
                    name=app_name,
                    image=image.image_uri,
                    ports=[kubernetes.core.v1.ContainerPortArgs(
                        name="yoga-api-port",
                        container_port=4000,
                    )],
                )],
            ),
        ),
    ),
    opts=pulumi.ResourceOptions(provider=cluster_provider))

# Creates the Servie for the Loadbalancer. The app will be availbel in port 80
service = kubernetes.core.v1.Service("service",
    metadata=kubernetes.meta.v1.ObjectMetaArgs(
        labels={
            "appClass": app_name,
        },
    ),
    spec=kubernetes.core.v1.ServiceSpecArgs(
        type="LoadBalancer",
        selector={
            "appClass": app_name,
        },
        ports=[kubernetes.core.v1.ServicePortArgs(
            port=80,
            target_port=4000,
        )],
    ),
    opts=pulumi.ResourceOptions(provider=cluster_provider))

# Export the cluster's kubeconfig.
pulumi.export("kubeconfig", cluster.kubeconfig)
# Export Output for ECR repository URL
pulumi.export("ECR repo url", repository.url)
# Export the k8s LoadBalancer url
#pulumi.export("K8s LoadBalancer url", service.status.load_balancer.ingress[0].hostname)