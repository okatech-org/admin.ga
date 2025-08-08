-- CreateTable
CREATE TABLE "public"."domain_configs" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "subdomain" TEXT,
    "applicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dnsRecords" TEXT NOT NULL,
    "deploymentConfig" TEXT NOT NULL,
    "sslCertificate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "domain_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deployment_logs" (
    "id" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deployment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "domain_configs_domain_key" ON "public"."domain_configs"("domain");

-- AddForeignKey
ALTER TABLE "public"."deployment_logs" ADD CONSTRAINT "deployment_logs_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."domain_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
