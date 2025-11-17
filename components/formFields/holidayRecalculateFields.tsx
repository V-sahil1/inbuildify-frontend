import InputSwitch from '../common/InputSwitch';

export const holidayRecalculateFields = () => {
  return [
    {
      key: 'workflow',
      name: 'region',
      label: 'Recalculate the estimated dates for existing workflow jobs',
      type: 'custom' as const,
      render: () => <InputSwitch label="" name="region" />,
    },
    {
      key: 'construction',
      name: 'region',
      label: 'Recalculate the estimated dates for existing construction jobs',
      type: 'custom' as const,
      render: () => <InputSwitch label="" name="region" />,
    },
    {
      key: 'reason',
      name: 'region',
      label: 'Capture reason for rebooking and include in rebooking email',
      type: 'custom' as const,
      render: () => (
        <InputSwitch
          label=""
          description="The reason captured will be included in all the rebooking emails and sent to the respective suppliers."
          name="region"
        />
      ),
    },
    {
      key: 'confirmed',
      name: 'region',
      label: 'Recalculate the dates for confirmed booking',
      type: 'custom' as const,
      render: () => <InputSwitch label="" name="region" />,
    },
  ];
};
