// src/services/PipelineService.ts
class PipelineService {
  // Build the base match conditions for the aggregation
  static buildMatchConditions(
    type: string,
    projectId: string,
    startDate: string,
    endDate: string,
    zones?: string[],
    subProjects?: string[],
    contractors?: string[],
    resources?: string[],
    requestStatus?: string,
    isConfirmed: boolean = true
  ) {
    const baseMatchConditions: any = {
      project_id: projectId,
      "date_range.from": { $gte: new Date(startDate) },
      "date_range.to": { $lte: new Date(endDate) }
    };

    if (zones && zones.length > 0) {
      baseMatchConditions["unloading_zone_id"] = { $in: zones };
    }
    if (subProjects && subProjects.length > 0) {
      baseMatchConditions["sub_project_id"] = { $in: subProjects };
    }
    if (resources && resources.length > 0) {
      baseMatchConditions["resources"] = { $in: resources };
    }

    let matchConditions: any = {};
    if (type === 'shipment') {
      matchConditions["shipment_legs"] = { $elemMatch: baseMatchConditions };
      matchConditions["is_small_parcel"] = { $ne: true };
    } else {
      matchConditions = baseMatchConditions;
    }

    if (contractors && contractors.length > 0) {
      matchConditions["contractor_id"] = { $in: contractors };
    }
    if (requestStatus) {
      matchConditions["request_status"] = requestStatus;
    }
    matchConditions['is_deleted'] = false;
    matchConditions['is_confirmed'] = isConfirmed ? { $ne: false } : { $eq: false };

    return matchConditions;
  }

  // Helper: perform a lookup with unwind.
  static performLookupAndUnwind(
    fromCollection: string,
    localField: string,
    foreignField: string,
    lookupAs: string,
    localFieldAlias: string,
    pipeline: any[] = [],
    noDefaultMatch: boolean = false,
    canHaveMissingLocalField: boolean = false
  ) {
    const letObj: any = canHaveMissingLocalField
      ? { [localFieldAlias]: { $ifNull: [`$${localField}`, null] } }
      : { [localFieldAlias]: `$${localField}` };

    const matchStage = {
      $match: {
        $expr: { $eq: [`$${foreignField}`, { $toObjectId: `$$${localFieldAlias}` }] }
      }
    };

    const lookupPipeline = [
      {
        $lookup: {
          from: fromCollection,
          let: letObj,
          pipeline: noDefaultMatch !== true ? [matchStage, ...pipeline] : pipeline,
          as: lookupAs
        }
      }
    ];
    if (fromCollection !== "resource") {
      lookupPipeline.push({
        $unwind: { path: `$${lookupAs}`, preserveNullAndEmptyArrays: true }
      });
    }
    return lookupPipeline;
  }

  static lookupForZoneDetails(localField: string) {
    return [
      { $addFields: { localFieldObjectId: { $toObjectId: `$${localField}` } } },
      {
        $lookup: {
          from: "unloading_zone",
          let: { localFieldValue: "$localFieldObjectId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$localFieldValue"] } } },
            { $project: { unloading_zone_name: 1, zone_color: 1 } }
          ],
          as: "zone_details"
        }
      },
      { $unwind: { path: "$zone_details", preserveNullAndEmptyArrays: true } }
    ];
  }

  static lookupForSubProjectDetails(localField: string) {
    const subProjectLookupPipeline = [{ $project: { sub_project_name: 1 } }];
    return this.performLookupAndUnwind("sub_project", localField, "_id", "sub_project_details", "sub_project_id", subProjectLookupPipeline);
  }

  static lookupForResourceDetails(localField: string) {
    const resourcesLookupPipeline = [
      {
        $match: {
          $expr: {
            $in: [
              "$_id",
              {
                $map: {
                  input: { $ifNull: ["$$resource_ids", []] },
                  as: "id",
                  in: { $toObjectId: "$$id" }
                }
              }
            ]
          }
        }
      },
      { $project: { resource_pattern: 1 } }
    ];
    return this.performLookupAndUnwind("resource", localField, "_id", "resource_details", "resource_ids", resourcesLookupPipeline, true);
  }

  static lookupForSupplierDetails(localField: string) {
    return [
      { $addFields: { localFieldObjectId: { $toObjectId: `$${localField}` } } },
      {
        $lookup: {
          from: "company",
          localField: "localFieldObjectId",
          foreignField: "_id",
          as: "supplier_details"
        }
      },
      {
        $addFields: {
          shipment_supplier_name: { $arrayElemAt: ["$supplier_details.company_name", 0] }
        }
      },
      { $unwind: { path: "$supplier_details", preserveNullAndEmptyArrays: true } }
    ];
  }

  static lookupForContractorDetails(localField: string) {
    return [
      { $addFields: { localFieldObjectId: { $toObjectId: `$${localField}` } } },
      {
        $lookup: {
          from: "company",
          localField: "localFieldObjectId",
          foreignField: "_id",
          as: "contractor_details"
        }
      },
      {
        $addFields: {
          contractor_name: { $arrayElemAt: ["$contractor_details.company_name", 0] }
        }
      },
      { $unwind: { path: "$contractor_details", preserveNullAndEmptyArrays: true } }
    ];
  }

  static lookupForUserDetails(localField: string) {
    const usersLookupPipeline = [
      {
        $match: {
          $expr: {
            $cond: {
              if: { $ne: ["$$responsible_person", null] },
              then: { $eq: ["$clerk_user_id", "$$responsible_person"] },
              else: false
            }
          }
        }
      }
    ];
    return this.performLookupAndUnwind("users", localField, "_id", "user_details", "responsible_person", usersLookupPipeline, true, true);
  }

  // Returns the shipment aggregation pipeline.
  static getShipmentPipeline(matchConditions: any) {
    return [
      { $match: matchConditions },
      {
        $set: {
          shipment_legs_with_index: {
            $map: {
              input: { $range: [0, { $size: "$shipment_legs" }] },
              as: "index",
              in: {
                index: "$$index",
                leg: { $arrayElemAt: ["$shipment_legs", "$$index"] }
              }
            }
          }
        }
      },
      { $unwind: "$shipment_legs_with_index" },
      {
        $set: {
          shipment_legs: "$shipment_legs_with_index.leg",
          shipment_legs_index: "$shipment_legs_with_index.index"
        }
      },
      { $match: { "shipment_legs.project_id": matchConditions.project_id } },
      ...this.lookupForZoneDetails("shipment_legs.unloading_zone_id"),
      ...this.lookupForSubProjectDetails("shipment_legs.sub_project_id"),
      ...this.lookupForResourceDetails("shipment_legs.resources"),
      ...this.lookupForSupplierDetails("shipment_supplier"),
      ...this.lookupForContractorDetails("contractor_id"),
      ...this.lookupForUserDetails("responsible_person"),
      {
        $project: {
          _id: 1,
          bookingType: "shipment",
          info: 1,
          unbooked: 1,
          is_confirmed: 1,
          shipment_status: "$shipment_legs.shipment_status",
          request_status: 1,
          rejection_reason: 1,
          backgroundColor: { $ifNull: ["$zone_details.zone_color", "rgb(211, 211, 211)"] },
          unloadingZoneName: "$zone_details.unloading_zone_name",
          start: "$shipment_legs.date_range.from",
          end: "$shipment_legs.date_range.to",
          allDay: "$shipment_legs.date_range.isAllDay",
          location: "$shipment_legs.location.formatted_address",
          ntm_data_provided: 1,
          subProjectName: "$sub_project_details.sub_project_name",
          resourceIcons: "$resource_details.resource_pattern",
          shipmentSupplierName: "$supplier_details.company_name",
          contractorName: "$contractor_details.company_name",
          email: "$user_details.email",
          phoneNumber: "$user_details.phone_number",
          firstName: "$user_details.first_name",
          lastName: "$user_details.last_name",
          image: "$user_details.image",
          package: 1,
          shipmentLegIndex: "$shipment_legs_index",
          shipment_direction: "$shipment_legs.shipment_direction",
          is_small_parcel: 1,
          booking_importer_id: 1,
          created_by_service: 1
        }
      }
    ];
  }

  // Returns a common pipeline for both waste and resource bookings.
  // For resource bookings, an extra lookup is added.
  static getNonShipmentPipeline(
    bookingType: "waste" | "resource",
    matchConditions: any,
    backgroundColor: string
  ) {
    const pipeline = [
      { $match: matchConditions },
      ...this.lookupForSubProjectDetails("sub_project_id"),
      ...this.lookupForContractorDetails("contractor_id"),
      ...this.lookupForUserDetails("responsible_person")
    ];
    if (bookingType === "resource") {
      pipeline.push(...this.lookupForResourceDetails("resources"));
    }
    pipeline.push({
      $project: {
        _id: 1,
        bookingType: bookingType,
        start: "$date_range.from",
        end: "$date_range.to",
        allDay: "$date_range.isAllDay",
        info: 1,
        is_confirmed: 1,
        subProjectName: "$sub_project_details.sub_project_name",
        ...(bookingType === "resource"
          ? { resourceIcons: "$resource_details.resource_pattern" }
          : {}),
        contractorName: "$contractor_details.company_name",
        email: "$user_details.email",
        phoneNumber: "$user_details.phone_number",
        firstName: "$user_details.first_name",
        lastName: "$user_details.last_name",
        image: "$user_details.image",
        request_status: 1,
        ...(bookingType === "waste"
          ? { status: 1, waste_management_type: 1, waste_service: 1 }
          : {}),
        backgroundColor: backgroundColor,
        ntm_data_provided: 1,
        rejection_reason: 1,
        created_by_service: 1
      }
    });
    return pipeline;
  }
}
export default PipelineService;