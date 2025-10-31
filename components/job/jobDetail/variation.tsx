import {
  IconChevronDown,
  IconCurrencyDollar,
  IconPencil,
  IconSettings,
  IconCheck,
} from '@tabler/icons-react';
import { Button, Dropdown, Tag } from 'antd';
import { useState } from 'react';
type Variation = {
  id: string;
  status: string;
  amount: number;
  selectedVariations: {
    key: string;
    additional: string;
    siteCost: string;
    cost: string;
    drawingChanges: boolean;
    quantity: number;
    price: number;
    total: number;
    isNew: boolean;
  };
};
type VariationProps = {
  data: Variation[];
};
const Variation: React.FC<VariationProps> = ({ data }) => {
  const items = [
    {
      key: '1',
      label: 'Create',
    },
    {
      key: '2',
      label: 'Edit',
    },
    {
      key: '3',
      label: 'Delete',
    },
  ];
  const initialValue = [
    {
      title: 'Create Variation',
      option: [
        {
          label: 'Edit Variation',
          onclick: () => {},
          color: 'bg-green-700',
        },
      ],
      text: 'Created By Murthy Muthuswamy on 14-08-2023 (edited by Murthy Muthuswamy on 14-08-2023)',
      state: true,
      visible: true,
    },
    {
      title: 'Approve Variation',
      option: [
        {
          label: 'Approve',
          onclick: index => {
            setStatus('Approved');

            setstep(prev =>
              prev.map((obj, i) => {
                if (i === index) {
                  return { ...obj, option: [] };
                }
                return obj;
              })
            );
          },
          color: 'bg-green-700',
        },
      ],
      text: 'Approved By Murthy Muthuswamy on 14-08-2023',
      state: false,
      visible: false,
    },
    {
      title: 'Send Variation to Customer',
      option: [
        {
          label: 'eSign',
          onclick: () => {},
          color: 'bg-blue',
        },
        {
          label: 'Send',
          onclick: () => {},
          color: 'bg-green-700',
        },
        {
          label: 'Skip',
          onclick: () => {},
        },
      ],
      text: 'Variation sent to customer by Murthy Muthuswamy on 14-08-2023',
      state: false,
      visible: false,
    },
    {
      title: 'Upload signed variation',
      option: [
        {
          label: 'Upload Document',
          onclick: () => {},
          color: 'bg-green-700',
        },
        {
          label: 'Mark as Received',
          onclick: () => {},
          color: 'bg-blue',
        },
      ],
      text: 'Signed variation uploaded by  Murthy Muthuswamy on 14-08-2023',
      state: false,
      visible: false,
    },
    {
      title: 'Price included in contract?',
      option: [
        {
          label: 'Yes',
          onclick: () => {},
          color: 'bg-green-700',
        },
        {
          label: 'No',
          onclick: () => {},
          color: 'bg-blue',
        },
      ],
      text: 'Price inclusion status updated by  Murthy Muthuswamy on 14-08-2023',
      state: false,
      visible: false,
    },
    {
      title: 'Send invoice to customer',
      option: [
        {
          label: 'Generate Invoice',
          onclick: () => {},
          color: 'bg-blue',
        },
        {
          label: 'Send',
          onclick: () => {},
          color: 'bg-green-700',
        },
        {
          label: 'Skip',
          onclick: () => {},
        },
      ],
      text: 'Invoice sent to customer by  Murthy Muthuswamy on 14-08-2023',
      state: false,
      visible: false,
    },
    {
      title: 'Send Extension Notice to Customer',
      option: [
        {
          label: 'Generate Notice',
          onclick: () => {},
          color: 'bg-blue',
        },
        {
          label: 'Send',
          onclick: () => {},
          color: 'bg-green-700',
        },
        {
          label: 'Skip',
          onclick: () => {},
        },
      ],
      text: 'Extension notice sent to customer by  Murthy Muthuswamy on 14-08-2023',
      state: false,
      visible: false,
    },
  ];
  const [status, setStatus] = useState(data[0].status);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setstep] = useState(initialValue);
  return (
    <div className="p-3">
      <div className="flex flex-col sm:flex-row sm:justify-between border-b-2 p-3 ">
        <div className="flex gap-2">
          {data[0].id}
          <IconPencil size={20} />
        </div>
        <div className="flex gap-2">
          <Button type="primary" className="text-sm">
            Create Another Variation
          </Button>
          <Dropdown menu={{ items }}>
            <Button className="text-sm">
              More Activities
              <IconChevronDown />
            </Button>
          </Dropdown>
          <Button className="pt-1" icon={<IconSettings />}></Button>
        </div>
      </div>
      <div className=" mx-10 sm:mx-40 md:mx-80 lg:mx-100 mt-20">
        <div className="flex justify-between">
          <div className="text-xs font-bold">STATUS</div>
          <div className="text-xs font-bold">AMOUNT</div>
        </div>
        <div className="flex justify-between">
          <div>
            {' '}
            <Tag className={`${status === 'Approved' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              {status}
            </Tag>
          </div>
          <div className="text-lg font-extrabold flex">
            <IconCurrencyDollar />
            {data[0].amount}
          </div>
        </div>
        <div className="relative">
          <div
            style={{ zIndex: 2 }}
            className="absolute top-0 bottom-0 border border-gray-400 w-0 left-9"
          ></div>
          <div className="flex flex-col mt-20 gap-4">
            {step.map((item, index) => {
              return (
                <div
                  style={{ zIndex: 3 }}
                  className={`flex flex-col gap-2 sm:flex-row sm:justify-between border ${activeIndex == index ? 'border-primary' : 'border-border-color'} bg-card-color p-20  shadow-lg`}
                >
                  <div className="flex gap-6">
                    <div>
                      <div
                        className={`${item.visible ? 'text-font-color border-primary' : 'text-font-color-400 border-border-color'} ${item.state ? 'bg-green-700 border-none text-white' : ''} flex items-center justify-center border  rounded-full w-8 h-8`}
                      >
                        {' '}
                        {item.state ? <IconCheck size={20} /> : index + 1}
                      </div>
                    </div>
                    <div>
                      <div
                        className={`content-start ${item.visible ? 'text-font-color border-primary' : 'text-font-color-400 border-border-color'} `}
                      >
                        {item.title}
                      </div>
                      {item.visible && <div className="text-blue text-xs">{item?.text}</div>}
                    </div>
                  </div>
                  {item.visible && (
                    <div className="flex gap-1 ml-[55px] sm:ml-0">
                      {item?.option.map(op => (
                        <Button
                          size="small"
                          type={op?.color ? 'primary' : 'default'}
                          className={`variation text-xs p-2 
                                            ${op?.color ? `border-none text-white ${op?.color} ` : 'border-blue text-font-color bg-card-color '}
                                            ${op?.color ? (op?.color === 'bg-green-700' ? 'hover:!bg-green-700' : 'hover:!bg-blue') : 'hover:!border-blue !text-blue'} `}
                          onClick={() => {
                            setActiveIndex(index + 1);
                            setstep(prev =>
                              prev.map((obj, i) => {
                                if (i === index) {
                                  return { ...obj, state: true };
                                }
                                if (i === index + 1) {
                                  return { ...obj, visible: true };
                                }
                                return obj;
                              })
                            );
                            op?.onclick(index);
                          }}
                        >
                          {op.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Variation;
