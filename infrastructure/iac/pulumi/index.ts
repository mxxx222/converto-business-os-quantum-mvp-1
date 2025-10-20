import * as pulumi from "@pulumi/pulumi";

// Basic Pulumi stack config for environments; extend with cloud resources as needed.
const config = new pulumi.Config();
const environment = config.get("environment") || "dev";
const renderService = config.get("renderService") || "api-gateway";

export const stack = pulumi.getStack();
export const env = environment;
export const targetService = renderService;

// Placeholder outputs; in production, add providers (AWS/GCP/Azure) and
// model Render infra with custom providers or REST calls from CI.
export const outputs = {
  environment,
  renderService,
};


