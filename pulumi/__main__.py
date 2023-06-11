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

# Export the cluster's kubeconfig.
pulumi.export("kubeconfig", cluster.kubeconfig)
# Export Output for ECR repository URL
pulumi.export("url", repository.url)