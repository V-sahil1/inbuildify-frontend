import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { Button, Checkbox, Drawer, Form, Input, message, Radio, Select } from 'antd';
import { useEffect } from 'react';

const { TextArea } = Input;
export const JobFormModel = ({ open, onClose, onSubmit, isEditing, initialValues }) => {
  const [form] = Form.useForm();
  const { dwellingTypeOptions } = useDwellingAndRangeHook({ type: 'dwellingType' });

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(initialValues);
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Drawer title="New Job Form" open={open} onClose={onClose} size="large">
      <div>
        <p className="text-lg font-medium">Location of building site</p>
        <Form onFinish={handleSubmit} form={form} layout="vertical">
          <Form.Item name="streetName" label="Street Name">
            <Input />
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="landDeveloper" label="Land Developer">
              <Input />
            </Form.Item>
            <Form.Item name="council" label="Council">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Form.Item name="titleVolume" label="Title Volume">
              <Input />
            </Form.Item>
            <Form.Item name="folio" label="Folio">
              <Input />
            </Form.Item>
            <Form.Item name="planSubdivision" label="Plan of Subdivision">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="siteFall" label="Site Fall">
              <Radio.Group
                options={[
                  { label: 'Under 1m', value: 'under_1_m' },
                  { label: '1-2 m', value: '1_2_m' },
                  { label: '2-3 m', value: '2_3_m' },
                  { label: 'Above 3 m', value: 'above_3_m' },
                ]}
              />
            </Form.Item>
            <Form.Item name="existingTree" label="Existing Trees">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="driveawayLocation" label="Driveway Location(when facing lot)">
              <Radio.Group
                options={[
                  { label: 'Front Left', value: 'front_left' },
                  { label: 'Front Right', value: 'front_right' },
                  { label: 'Rear/Side', value: 'rear_side' },
                ]}
              />
            </Form.Item>
            <Form.Item name="anySewerTie" label="Any Sewer Tie(Out of easements)">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="easements" label="Easements">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
            <Form.Item name="buildupAreaEasements" label="Buildup Area up to Easement">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <p className="text-lg font-medium">Build Zone</p>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="buildZone" label="Zone">
              <Select
                options={[
                  { label: 'North West', value: 'north_west' },
                  { label: 'South East', value: 'south_east' },
                  { label: 'North', value: 'north' },
                  { label: 'West', value: 'west' },
                ]}
              />
            </Form.Item>
            <Form.Item name="storyId" label="Storey">
              <Select options={dwellingTypeOptions} />
            </Form.Item>
          </div>
          <h3>Site Fill (Enter the values of maximum filledArea)</h3>
          <div className="grid grid-cols-3 gap-2">
            <Form.Item name="finishedSurfaceM" label="Finished Surface(m)">
              <Input />
            </Form.Item>
            <Form.Item name="existingSurfaceM" label="Existing Surface(m)">
              <Input />
            </Form.Item>
            <Form.Item name="filledAreaFailM" label="Fill(m)">
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="maxFillLocation" label="Max Fill Location (when facing lot)">
            <Select
              options={[
                { label: 'Front Left', value: 'front_left' },
                { label: 'Front Right', value: 'front_right' },
                { label: 'Rear Left', value: 'rear_left' },
                { label: 'Rear Right', value: 'rear_right' },
              ]}
            />
          </Form.Item>
          <h3>Site Fall (As per Engineering)</h3>
          <div className="grid grid-cols-3 gap-2">
            <Form.Item name="maxFinishedSurfaceM" label="Max Finished Surface (m)">
              <Input />
            </Form.Item>
            <Form.Item name="minFinishedSurfaceM" label="Min Finished Surface (m)">
              <Input />
            </Form.Item>
            <Form.Item name="engineeringFallM" label="Fall(m)">
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="fallType" label="Fall Type">
            <Select
              options={[
                { label: 'Front to Rear', value: 'front_to_rear' },
                { label: 'Rear to Front', value: 'rear_to_front' },
                { label: 'Diagonal Front to Rear', value: 'diagonal_front_to_rear' },
                { label: 'Diagonal Rear to Front', value: 'diagonal_rear_to_front' },
              ]}
            />
          </Form.Item>
          <p className="font-medium text-lg">Design Guidelines and Other Requiremets</p>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="ceilingHeight" label="Celling Height">
              <Input />
            </Form.Item>
            <Form.Item name="eavesLocation" label="Eaves Location">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="lotType" label="Lot Type">
              <Radio.Group
                options={[
                  { label: 'Under 300m2 (Small Lot Housing Code)', value: 'under_300_m2' },
                  { label: 'Over 300m2', value: 'over_300_m2' },
                ]}
              />
            </Form.Item>
            <Form.Item name="siteCoverageAllowed" label="Site Coverage Allowed">
              <Radio.Group
                options={[
                  { label: 'Less than 60%', value: 'less_then_60' },
                  { label: '60%', value: '60' },
                  { label: '70%', value: '70' },
                  { label: '80%', value: '80' },
                  { label: '90%', value: '90' },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="eavesSize" label="Eaves Size">
              <Radio.Group
                options={[
                  { label: '450 mm', value: '450 mm' },
                  { label: '600 mm', value: '600 mm' },
                ]}
              />
            </Form.Item>
            <Form.Item name="eavesReturn" label="Eaves Return">
              <Checkbox.Group
                options={[
                  { label: '2m', value: '2_m' },
                  { label: '3m', value: '3_m' },
                  { label: '4m', value: '4_m' },
                  { label: 'All Around', value: 'all_around' },
                  { label: 'Side Only(Facing Street Corner Lots )', value: 'side_only' },
                  { label: 'N/A', value: 'n_a' },
                ]}
              />
            </Form.Item>
          </div>
          <h3>Roof Type</h3>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="roofCovering" label="Roof Covering">
              <Checkbox.Group
                options={[
                  { label: 'Concrete Tiles', value: 'concrete_tiles' },
                  { label: 'Standard', value: 'standard' },
                  { label: 'Slimlie', value: 'slimlie' },
                  { label: 'Flat', value: 'flat' },
                  { label: 'Colorbond Roof', value: 'colorbond_roof' },
                  { label: 'With Blanket', value: 'with_blanket' },
                  { label: 'With Sarking', value: 'with_sarking' },
                ]}
              />
            </Form.Item>
            <Form.Item name="roofPitch" label="Roof Pitch">
              <Radio.Group
                options={[
                  { label: '15 degree', value: '15' },
                  { label: '18', value: '18' },
                  { label: '20', value: '20' },
                  { label: '22.5', value: '22.5' },
                  { label: '25', value: '25' },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="flatRoofPitch" label="Flat Roof Pitch">
              <Radio.Group options={[{ label: '5 degree', value: '5' }]} />
            </Form.Item>
            <Form.Item name="parapetWall" label="Parapet Wall">
              <Radio.Group
                options={[
                  { label: 'Front Only', value: 'front_only' },
                  { label: 'All Around', value: 'all_around' },
                  { label: 'N/A', value: 'n_a' },
                ]}
              />
            </Form.Item>
          </div>
          <p className="font-medium text-lg">CONSTRUCTION TYPE</p>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="singleStory" label="Single Storey">
              <Radio.Group
                options={[
                  { label: 'Brick', value: 'brick' },
                  { label: 'Hebel', value: 'hebel' },
                ]}
              />
            </Form.Item>
            <Form.Item name="doubleStoryGf" label="Double Storey GF">
              <Radio.Group
                options={[
                  { label: 'Brick', value: 'brick' },
                  { label: 'Hebel', value: 'hebel' },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="doubleStoryFf" label="Double Storey FF">
              <Radio.Group
                options={[
                  { label: 'Brick', value: 'brick' },
                  { label: 'Poly', value: 'poly' },
                  { label: 'Hebel', value: 'hebel' },
                ]}
              />
            </Form.Item>
            <Form.Item name="wallOverGarage" label="Wall over the Garage">
              <Radio.Group
                options={[
                  { label: 'Brick', value: 'brick' },
                  { label: 'Poly', value: 'poly' },
                  { label: 'Hebel', value: 'hebel' },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="wallOverLowerRoof" label="Wall over the lower roof or flashings">
              <Radio.Group
                options={[
                  { label: 'Poly', value: 'poly' },
                  { label: 'Xon Cladding', value: 'xon_cladding' },
                  { label: 'Weatherboard', value: 'weatherboard' },
                ]}
              />
            </Form.Item>
            <Form.Item name="allElectric" label="All electric">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="typeOfCooling" label="Type of cooling">
              <Input />
            </Form.Item>
            <Form.Item name="garageDoorType" label="Garage Door Type">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="connection" label="Connection">
              <Radio.Group
                options={[
                  { label: 'NBN', value: 'nbn' },
                  { label: 'Opticom', value: 'opticom' },
                ]}
              />
            </Form.Item>
            <Form.Item name="recycledWater" label="Recycled Water">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="extraRequirement" label="Extra Requirement">
              <Checkbox.Group
                options={[
                  { label: 'Rainwater Tank', value: 'rainwater_tank' },
                  { label: 'Solar Hot Water System', value: 'solar_hot_water_system' },
                  { label: 'Heat Pump', value: 'heat_pump' },
                ]}
              />
            </Form.Item>
            <Form.Item name="threePhase" label="3 Phase">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item name="driveway" label="Driveway">
            <Radio.Group
              options={[
                { label: 'By Client', value: 'by_client' },
                { label: 'By Builder', value: 'by_builder' },
              ]}
            />
          </Form.Item>
          <h3>Setback For Single Storey and Ground Floor </h3>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="frontWall" label="Front Wall">
              <Input />
            </Form.Item>
            <Form.Item name="betweenGarageBuilding" label="Between Garage & building line">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="garageSide" label="Garage Side">
              <Input />
            </Form.Item>
            <Form.Item name="otherSide" label="Other Side">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="rear" label="Rear">
              <Input />
            </Form.Item>
            <Form.Item name="allowedPorchEncroachment" label="Allowed Porch Encroachment">
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="boundryBuild" label="Boundary to Boundary Build">
            <Radio.Group
              options={[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]}
            />
          </Form.Item>
          <h3>Setback For Double Storey First Floor</h3>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="boundryConstruction" label="Boundary to Boundary Construction">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
            <Form.Item name="doubleStoryFrontWall" label="Front Wall">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="doubleStoryGarageSide" label="Garage Side">
              <Input />
            </Form.Item>
            <Form.Item name="doubleStoryOtherSide" label="Other Side">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="doubleStoryRear" label="Rear">
              <Input />
            </Form.Item>
            <Form.Item name="doubleStoryBalconyEncroachment" label="Balcony Encroachment">
              <Input />
            </Form.Item>
          </div>
          <h3>Additional Facade requests / Requirements</h3>
          <h4>Facade Material Requirements</h4>
          {/* todo table */}
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="raisedPorchFacade" label="Raised porch to facade with timber infill">
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="parapetWallsPitchRoof"
              label="Parapet walls with box gutter behind and pitched roof"
            >
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="parapetWallsTrayDeckRoof"
            label="Parapet walls with box gutter and tray deck roof"
          >
            <Radio.Group
              options={[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]}
            />
          </Form.Item>
          <h3>Sales Checklist</h3>
          <Form.Item name="conceptInspiration" valuePropName="checked">
            <Checkbox>
              Concept/Inspiration (Marked up in red pen only and scan in colour please)
            </Checkbox>
          </Form.Item>
          <Form.Item name="planSubdivisionEngineering" valuePropName="checked">
            <Checkbox>Plan of Subdivision and Engineering</Checkbox>
          </Form.Item>
          <Form.Item name="memorandumCommonProvisions" valuePropName="checked">
            <Checkbox>Memorandum of Common Provisions (MCP)</Checkbox>
          </Form.Item>
          <Form.Item name="developerGuidelines" valuePropName="checked">
            <Checkbox>
              Developer Guidelines (If not found only you may need to contact developers directly)
            </Checkbox>
          </Form.Item>
          <Form.Item name="conceptInspiration" valuePropName="checked">
            <Checkbox>
              Contract for Sale (Please note most of the above items can be found in the contract of
              sale)
            </Checkbox>
          </Form.Item>
          <Form.Item name="contactForSale" valuePropName="checked">
            <Checkbox>Variational List</Checkbox>
          </Form.Item>

          <p className="text-lg font-medium">Special Job Notes</p>
          <Form.Item name="specialJobNotes">
            <TextArea rows={3} className="!resize-none" />
          </Form.Item>
          <div className="flex gap-2 justify-end">
            <Button htmlType="submit" type="primary">
              Save
            </Button>
            <Button>Cancel</Button>
          </div>
        </Form>
      </div>
    </Drawer>
  );
};
