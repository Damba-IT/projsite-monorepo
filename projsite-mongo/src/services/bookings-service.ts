// src/services/BookingsService.ts
import { ObjectId, type Db, type Collection } from 'mongodb';
import PipelineService from './pipeline-service';
import type { ServiceResponse } from '../types';

// Define the input and output types.
interface GetBookingsParams {
  project_id: string;
  startDate: string;
  endDate: string;
  zones?: string[];
  subProjects?: string[];
  contractors?: string[];
  resources?: string[];
  requestStatus?: string;
  isConfirmed?: boolean;
}

export class BookingsService {
  static async getBookings(db: Db, params: GetBookingsParams): Promise<ServiceResponse> {
    try {
      const {
        project_id,
        startDate,
        endDate,
        zones,
        subProjects,
        contractors,
        resources,
        requestStatus,
        isConfirmed = true
      } = params;

      if (!project_id || !startDate || !endDate) {
        return { success: false, error: "Missing required parameters" };
      }

      const projectObjectId = new ObjectId(project_id);
      const projectsCollection = db.collection("projects");
      const project = await projectsCollection.findOne({ _id: projectObjectId });
      
      if (!project) {
        return { success: false, error: "Project not found" };
      }

      const DEFAULT_WASTE_BOOKING_COLOR = "#8CE542";
      const DEFAULT_RESOURCE_BOOKING_COLOR = "#428AE5";
      const wasteBookingColor = project.settings?.waste_booking_color || DEFAULT_WASTE_BOOKING_COLOR;
      const resourceBookingColor = project.settings?.resource_booking_color || DEFAULT_RESOURCE_BOOKING_COLOR;

      // Build pipelines for different booking types.
      type PipelineConfig = { collectionName: string; collection: Collection; pipeline: any[] };
      const pipelines: PipelineConfig[] = [];

      // Shipment pipeline (if enabled)
      if (project.settings?.shipment_module !== false) {
        const shipmentMatchConditions = PipelineService.buildMatchConditions(
          "shipment",
          project_id,
          startDate,
          endDate,
          zones,
          subProjects,
          contractors,
          resources,
          requestStatus,
          isConfirmed
        );
        const shipmentPipeline = PipelineService.getShipmentPipeline(shipmentMatchConditions);
        pipelines.push({
          collectionName: "shipment_bookings",
          collection: db.collection("shipment_bookings"),
          pipeline: shipmentPipeline
        });
      }

      // Waste pipeline (if enabled)
      if (project.settings?.waste_module) {
        const wasteMatchConditions = PipelineService.buildMatchConditions(
          "waste",
          project_id,
          startDate,
          endDate,
          zones,
          subProjects,
          contractors,
          resources,
          requestStatus,
          isConfirmed
        );
        const wastePipeline = PipelineService.getNonShipmentPipeline("waste", wasteMatchConditions, wasteBookingColor);
        pipelines.push({
          collectionName: "waste_bookings",
          collection: db.collection("waste_bookings"),
          pipeline: wastePipeline
        });
      }

      // Resource pipeline (always included)
      const resourceMatchConditions = PipelineService.buildMatchConditions(
        "resource",
        project_id,
        startDate,
        endDate,
        zones,
        subProjects,
        contractors,
        resources,
        requestStatus,
        isConfirmed
      );
      const resourcePipeline = PipelineService.getNonShipmentPipeline("resource", resourceMatchConditions, resourceBookingColor);
      pipelines.push({
        collectionName: "resource_bookings",
        collection: db.collection("resource_bookings"),
        pipeline: resourcePipeline
      });

      if (pipelines.length === 0) {
        return { success: true, data: [] };
      }
      // Combine pipelines using $unionWith. We run the aggregation on the first collection.
      const basePipeline = [...pipelines[0].pipeline];
      for (let i = 1; i < pipelines.length; i++) {
        basePipeline.push({
          $unionWith: {
            coll: pipelines[i].collectionName,
            pipeline: pipelines[i].pipeline
          }
        });
      }

      const result = await pipelines[0].collection.aggregate(basePipeline).toArray();
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Error in getBookings:", error);
      return { success: false, error: error.message };
    }
  }
}
