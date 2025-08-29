"use server";

import { Prisma } from "@/lib/infra/prisma";

export default async function deletePortal(portalId: number) {
    try {
        // get portal_config
        const portalConfig = await Prisma.portal_config.findUnique({
            where: {
                id: portalId,
            },
        });

        if (!portalConfig) {
            return {
                success: false,
                error: "Portal config not found",
            };
        }

        // update the relation between portal_config and hotspots
        await Prisma.hotspot.updateMany({
            where: {
                portal_config_id: portalId,
            },
            data: {
                portal_config_id: null,
            },
        });

        // delete the portal_config
        await Prisma.portal_config.delete({
            where: {
                id: portalId,
            },
        });

        //TODO: delete the files from AWS S3 here, because we confirm the previous process was successful

        return {
            success: true,
            message: "Portal deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting portal:", error);
        // rollback the transaction
        return {
            success: false,
            error: "Failed to delete portal",
        };
    }
}
