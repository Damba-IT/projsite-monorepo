import { ObjectId, type Db, type Collection } from 'mongodb';
import PipelineService from './pipeline-service';
import type { ServiceResponse } from '../types';
import { GetBookingsParams, isValidBookingType } from '../types/booking';
export class BookingsService {
  static async getBookings(db: Db, params: GetBookingsParams, bookingType?: string): Promise<ServiceResponse> {
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

      const pipelines: { collectionName: string; collection: Collection; pipeline: any[] }[] = [];

      if (!bookingType || bookingType === "shipment") {
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
      }

      if (!bookingType || bookingType === "waste") {
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
          const wastePipeline = PipelineService.getNonShipmentPipeline("waste", wasteMatchConditions, "#8CE542");
          pipelines.push({
            collectionName: "waste_bookings",
            collection: db.collection("waste_bookings"),
            pipeline: wastePipeline
          });
        }
      }

      if (!bookingType || bookingType === "resource") {
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
        const resourcePipeline = PipelineService.getNonShipmentPipeline("resource", resourceMatchConditions, "#428AE5");
        pipelines.push({
          collectionName: "resource_bookings",
          collection: db.collection("resource_bookings"),
          pipeline: resourcePipeline
        });
      }

      if (pipelines.length === 0) {
        return { success: true, data: [] };
      }

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

  static async getBookingById(db: Db, bookingType: string, id: string): Promise<ServiceResponse> {
    try {
      if (!isValidBookingType(bookingType)) {
        return { success: false, error: "Invalid booking type" };
      }

      const collectionName = `${bookingType}_bookings`;
      const collection = db.collection(collectionName);

      const booking = await collection.findOne({ _id: new ObjectId(id) });
      if (!booking) {
        return { success: false, error: "Booking not found" };
      }

      return { success: true, data: booking };
    } catch (error: any) {
      console.error("Error in getBookingById:", error);
      return { success: false, error: error.message };
    }
  }
}