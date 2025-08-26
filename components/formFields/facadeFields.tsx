
import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { CreateFormField } from "../common/Models/CreateFormModel";
import { useAppSelector } from "@hooks/redux";


export const facadeFields = (): CreateFormField[] => {
  const filters = useAppSelector((state: any) => state.floorPlan.filters);

  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Luxury Villa",
      rules: [{ required: true, message: "Please enter the property name" }],
    },
    {
      label: "Image URL",
      name: "image",
      type: "text",
      placeholder: "https://example.com/floorplans/villa.png",
      rules: [{ required: true, message: "Please provide an image URL" }],
    },
    {
      label: "Dwelling Type",
      name: "dwelling_type",
      type: "select",
      options: enumArrayToOptions(filters?.dwellingTypes),
      placeholder: "Select dwelling type",
      rules: [{ required: true, message: "Please select a dwelling type" }],
    },
    {
      label: "Standard",
      name: "standard",
      type: "checkbox",
      placeholder: "1",
    },
    {
      label: "Upgrade",
      name: "upgrade",
      type: "checkbox",
      placeholder: "1",
    },
  ];
}
