# Yoga Grapql API deployed to AWS EKS with Pulumi

## Description
This project creates a Grapql API using the graphql-yoga server. The source code for the API is in the `app` directory. I set the the yoga server run in the default port 4000.
To IoC python code to deploy this application to AWS EKS is located in the `pulumi` directory.

## How to deploy to AWS EKS?

1. Obtain AWS keys from IAM and configre in your local host: 
```
$ export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
$ export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
```

2. Clone this in your local host: `git clone https://github.com/marianobeccaria/my-yoga-grapql-sample.git`

3. Change directories to: `cd pulumi`

4. Edit file `Pulumi.dev.yaml` and change it to the desired AWS region. In my case it will deploy to `us-east-2`

5. Run `pulumi preview` to see preview of updates to the resources that will be deployed in the stack

6. Run `pulumi up` to create and update the resources in a stack

**NOTE**: If you get the following error `ModuleNotFoundError` related to some of the modules being imported, you may have to install the following modules in the `venv`:
```
$ venv/bin/pip install pulumi
$ venv/bin/pip install pulumi_awsx
$ venv/bin/pip install pulumi_eks
$ venv/bin/pip install pulumi_kubernetes
```
7. After a all resources are created and `pulumi up` successful run,  you should be able to use the cluster `kubeconfig` to run `kubctl` locally from the command line:
```
$ pulumi stack output kubeconfig > kubeconfig.yml
$ KUBECONFIG=./kubeconfig.yml kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
deployment-e11b4beb-6558f6796f-mdvq4   1/1     Running   0          5h48m
deployment-e11b4beb-6558f6796f-w56wp   1/1     Running   0          5h48m
```
To obtain the endpoint for the LoadBalancer that was created, list the Services with the following command:
```
$ KUBECONFIG=./kubeconfig.yml kubectl get services
NAME               TYPE           CLUSTER-IP      EXTERNAL-IP                                                              PORT(S)        AGE
kubernetes         ClusterIP      10.100.0.1      <none>                                                                   443/TCP        7h20m
service-3ec98e8f   LoadBalancer   10.100.205.30   a3a81044444444444444444445777fdb-997733442.us-east-2.elb.amazonaws.com   80:31684/TCP   5h30m
```

8. Then, from a browser, you should be able to access the youga grapql server use the LB endpoint like this:
```
http://a3a81044444444444444444445777fdb-997733442.us-east-2.elb.amazonaws.com/graphql

NOTE: make sure to include /grpahql at the end
```

## References
### Graphql
https://the-guild.dev/graphql/yoga-server/tutorial/basic
https://javascript.plainenglish.io/building-graphql-server-with-node-js-c31ee3f54761
https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e

### Pulumi
https://www.pulumi.com/docs/clouds/aws/get-started/
https://www.pulumi.com/docs/clouds/aws/guides/eks/#overview

