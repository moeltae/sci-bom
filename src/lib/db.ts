import { PrismaClient } from "../../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export interface CreateExperimentData {
  name: string;
  description: string;
  status?: string;
  estimatedCost: number;
  actualCost?: number;
}

export interface CreateBomItemData {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  supplier?: string;
  catalog?: string;
}

export class DatabaseService {
  // Experiment operations
  static async createExperiment(data: CreateExperimentData) {
    return await prisma.experiment.create({
      data,
      include: {
        bomItems: true,
      },
    });
  }

  static async getExperiments() {
    return await prisma.experiment.findMany({
      include: {
        bomItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getExperiment(id: string) {
    return await prisma.experiment.findUnique({
      where: { id },
      include: {
        bomItems: true,
      },
    });
  }

  static async updateExperiment(
    id: string,
    data: Partial<CreateExperimentData>
  ) {
    return await prisma.experiment.update({
      where: { id },
      data,
      include: {
        bomItems: true,
      },
    });
  }

  static async deleteExperiment(id: string) {
    return await prisma.experiment.delete({
      where: { id },
    });
  }

  // BOM Item operations
  static async createBomItem(experimentId: string, data: CreateBomItemData) {
    return await prisma.bomItem.create({
      data: {
        ...data,
        experimentId,
      },
    });
  }

  static async createBomItems(
    experimentId: string,
    items: CreateBomItemData[]
  ) {
    return await prisma.bomItem.createMany({
      data: items.map((item) => ({
        ...item,
        experimentId,
      })),
    });
  }

  static async getBomItems(experimentId: string) {
    return await prisma.bomItem.findMany({
      where: { experimentId },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  static async updateBomItem(id: string, data: Partial<CreateBomItemData>) {
    return await prisma.bomItem.update({
      where: { id },
      data,
    });
  }

  static async deleteBomItem(id: string) {
    return await prisma.bomItem.delete({
      where: { id },
    });
  }

  // Utility methods
  static async getExperimentStats() {
    const experiments = await prisma.experiment.findMany({
      include: {
        bomItems: true,
      },
    });

    return experiments.map((exp) => ({
      ...exp,
      materialCount: exp.bomItems.length,
      totalEstimatedCost: exp.bomItems.reduce(
        (sum, item) => sum + (item.estimatedCost || 0),
        0
      ),
    }));
  }
}
