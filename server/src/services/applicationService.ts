import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function approveApplication(id: number) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const newLease = await prisma.lease.create({
    data: {
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rent: application.property.pricePerMonth,
      deposit: application.property.securityDeposit,
      propertyId: application.propertyId,
      tenantCognitoId: application.tenantCognitoId,
    },
  });

  await prisma.property.update({
    where: { id: application.propertyId },
    data: {
      tenants: {
        connect: { cognitoId: application.tenantCognitoId },
      },
    },
  });

  const updated = await prisma.application.update({
    where: { id },
    data: { status: "Approved", leaseId: newLease.id },
    include: {
      property: true,
      tenant: true,
      lease: true,
    },
  });

  return updated;
}
