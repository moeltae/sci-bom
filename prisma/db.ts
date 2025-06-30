import { PrismaClient } from "../generated/prisma";
import type {
  ExperimentUncheckedCreateWithoutItemsInput,
  ItemUncheckedCreateWithoutExperimentInput,
} from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type CreateExperimentData = ExperimentUncheckedCreateWithoutItemsInput;

export type CreateBomItemData = ItemUncheckedCreateWithoutExperimentInput;

export class DatabaseService {
  // Experiment operations
  static async createExperiment(data: CreateExperimentData) {
    return await prisma.experiment.create({
      data,
      include: {
        items: true,
      },
    });
  }

  static async getExperiments() {
    return await prisma.experiment.findMany({
      include: {
        items: true,
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
        items: true,
      },
    });
  }

  static async updateExperiment(
    id: string,
    data: Partial<Omit<CreateExperimentData, "userId">>
  ) {
    return await prisma.experiment.update({
      where: { id },
      data,
      include: {
        items: true,
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
    return await prisma.item.create({
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
    return await prisma.item.createMany({
      data: items.map((item) => ({
        ...item,
        experimentId,
      })),
    });
  }

  static async getBomItems(experimentId: string) {
    return await prisma.item.findMany({
      where: { experimentId },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  static async updateBomItem(id: string, data: Partial<CreateBomItemData>) {
    return await prisma.item.update({
      where: { id },
      data,
    });
  }

  static async deleteBomItem(id: string) {
    return await prisma.item.delete({
      where: { id },
    });
  }

  // Utility methods
  static async getExperimentStats() {
    const experiments = await prisma.experiment.findMany({
      include: {
        items: true,
      },
    });

    return experiments.map((exp) => ({
      ...exp,
      materialCount: exp.items.length,
      totalEstimatedCost: exp.items.reduce(
        (sum, item) => sum + (item.estimatedCostUSD || 0),
        0
      ),
    }));
  }
}
