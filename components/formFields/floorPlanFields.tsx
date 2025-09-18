import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppSelector } from "@hooks/redux";
import { mapToOptions } from "@lib/utils/rangeAndDwellingObjToOptions";
import NoDataMessage from "../common/NoDataMessage";
import SystemRoutes from "@lib/constants/Routes";

export const floorPlanFields = (): CreateFormField[] => {
const {range , dwellingType} = useAppSelector((state) => state.types);
const rangeOptions = mapToOptions(range);
const dwellingTypeOptions = mapToOptions(dwellingType);
  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Luxury Villa",
      rules: [{ required: true, message: "Please enter the property name" }],
    },
    {
      label: "Image",
      name: "image",
      type: "image",
      rules: [{required : true , message:"Please upload image"}]
    },
    {
      label: "Range",
      name: "range",
      type: "select",
      options: rangeOptions,
      notFoundContent: (
        <NoDataMessage label="range" link={SystemRoutes.DWELLING_AND_RANGE} />
      ),
      placeholder: "Select range",
      rules: [{ required: true, message: "Please select a range" }],
    },
    {
      label: "Dwelling Type",
      name: "dwelling_type",
      type: "select",
      options: dwellingTypeOptions,
      notFoundContent: (
        <NoDataMessage
          label="dwelling type"
          link={SystemRoutes.DWELLING_AND_RANGE}
        />
      ),
      placeholder: "Select dwelling type",
      rules: [{ required: true, message: "Please select a dwelling type" }],
    },
    {
      label: "Beds",
      name: "beds",
      type: "number",
      placeholder: "4",
      rules: [{ required: true, message: "Please enter number of beds" }],
    },
    {
      label: "Baths",
      name: "bath",
      type: "number",
      placeholder: "3",
      rules: [{ required: true, message: "Please enter number of bathrooms" }],
    },
    {
      label: "Car Park",
      name: "car_park",
      type: "number",
      placeholder: "2",
      rules: [{ required: true, message: "Please enter car park spaces" }],
    },
    {
      label: "Width (m)",
      name: "width_meter",
      type: "number",
      placeholder: "15",
      rules: [{ required: true, message: "Please enter width in meters" }],
    },
    {
      label: "Depth (m)",
      name: "depth_meter",
      type: "number",
      placeholder: "20",
      rules: [{ required: true, message: "Please enter depth in meters" }],
    },
    {
      label: "Dwelling",
      name: "dwelling", 
      type: "number",
      placeholder: "1",
      rules: [{ required: true, message: "Please enter dwelling" }],
    },
    {
      label: "Garage",
      name: "garage",
      placeholder: "1",
      type: "number",
      rules: [{ required: true, message: "Please enter garage" }],
    },
    {
      label: "Porch",
      name: "porch",
      type: "number",
      placeholder: "1",
      rules: [{ required: true, message: "Please enter porch" }],
    },
    {
      label: "Alfresco",
      name: "alfresco",
      type: "number",
      placeholder: "1",
      rules: [{ required: true, message: "Please enter alfresco" }],
    },
    {
      label: "Total Sqft",
      name: "total_sqft",
      type: "number",
      placeholder: "3200",
      rules: [{ required: true, message: "Please enter total square feet" }],
    },
  ];
}
