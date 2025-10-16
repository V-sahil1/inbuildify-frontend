
export interface Question {
  id: string;
  type: "radio" | "input" | "paragraph" | "textArea";
  label?: string; // Optional for type 'paragraph'
  name?: string; // Required for 'radio', 'input', 'textArea'
  note?: string; // Extra note text
  warning?: string; // Text for the shaded warning block
  // Specific properties for types
  placeholder?: string; // For type 'input' or 'textArea'
}



export const CONTRACT_QUESTIONS: Question[] = [
  {
    id: "header_1",
    type: "paragraph",
    label: "CHECKLIST BEFORE SIGNING THIS LEGALLY BINDING CONTRACT",
  },
  {
    id: "question_1",
    type: "radio",
    label:
      "If the cost of the building work is more than $16,000, has an insurance policy or certificate of currency for domestic building insurance covering your project been issued and provided to you?",
    name: "q1_insurance",
    note: "(Note: If not, the Contract is conditional upon you receiving either an insurance policy or a certificate of currency for domestic building insurance.)",
  },
  {
    id: "question_2",
    type: "radio",
    label:
      "If this Contract is conditional upon you receiving written approval for finance, have you obtained such approval?",
    name: "q2_finance_approval",
  },
  {
    id: "question_3",
    type: "radio",
    label:
      "Have you appointed a private building surveyor or has a municipal building surveyor been engaged?",
    name: "q3_surveyor_engaged",
    note: "(Note: If not, you will need to choose and engage a building surveyor before your building work starts so that a building permit can be issued for your building work.)",
  },
  {
    id: "warning_1",
    type: "paragraph",
    warning:
      "If you answer ‘NO’ to any of the following questions that apply to your building project, you are not ready to sign the contract:",
  },
  {
    id: "question_4",
    type: "radio",
    label: "Have you had this contract long enough to read and understand it?",
    name: "q4_understood_contract",
  },
  {
    id: "question_5",
    type: "radio",
    label:
      "Have you been provided with evidence that the builder named in this contract is registered with the Victorian Building Authority?",
    name: "q5_builder_registered",
  },
  {
    id: "question_6",
    type: "radio",
    label: "Are the price and progress payments clearly stated?",
    name: "q6_payments_clear",
  },
  {
    id: "question_7",
    type: "radio",
    label: "Do you understand how the price is calculated and may be varied?",
    name: "q7_price_varied",
  },
  {
    id: "question_8",
    type: "radio",
    label:
      "Has the builder assessed the suitability of the site for the proposed works? If tests are necessary, have they been carried out?",
    name: "q8_site_suitability",
  },
  {
    id: "question_9",
    type: "radio",
    label:
      "If a deposit is payable, is it within the legal limit? The maximum under the Domestic Building Contracts Act 1995 is: 1. 10% if the price is less than $20,000, or 2. 5% if the price is $20,000 or more.",
    name: "q9_deposit_limit",
  },
  {
    id: "question_10",
    type: "radio",
    label:
      "Is the work shown and described clearly in the contract, plans and specifications and any other relevant documents (such as engineering computations or soil report)?",
    name: "q10_work_clear",
  },
  {
    id: "question_11",
    type: "radio",
    label:
      "Are your special requirements or standards of finish included in the plans and specifications?",
    name: "q11_finish_standards",
  },
  {
    id: "question_12",
    type: "radio",
    label:
      "Are the commencement date and completion date clearly stated or capable of being worked out?",
    name: "q12_dates_clear",
  },
  {
    id: "question_13",
    type: "radio",
    label: "Do you understand the procedure for extensions of time?",
    name: "q13_extension_time",
  },
  {
    id: "question_14",
    type: "radio",
    label:
      "Are any ‘provisional sums’ or ‘prime cost items’ clearly stated in the schedules and understood by you?",
    name: "q14_provisional_sums",
  },
  {
    id: "question_15",
    type: "radio",
    label:
      "Do you understand the procedure for variations of plans and specifications?",
    name: "q15_variations_proc",
  },
  {
    id: "question_16",
    type: "radio",
    label:
      "Do you understand the circumstances in which you can end the contract?",
    name: "q16_end_contract",
  },
  {
    id: "question_17",
    type: "radio",
    label:
      "Did your builder give you a copy of the Domestic Building Consumer Guide?",
    name: "q17_consumer_guide_given",
  },
  {
    id: "question_18",
    type: "input",
    label:
      "If yes, insert the date on which you were given a copy of this guide dd/mm/yyyy",
    name: "q18_guide_date",
    placeholder: "dd/mm/yyyy",
  },
  {
    id: "question_19",
    type: "radio",
    label:
      "Have you read the Domestic Building Consumer Guide and the related information at consumer.vic.gov.au/buildingguide?",
    name: "q19_guide_read",
  },
];

export const dummyPurchaserData = {
    name: "John Wick",
    address: "asdfg, Sydney, VIC, 30003",
    phone: "01234567823",
    email: "johnwick@gmail.com",
  };
  
  export const dummyBuilderData = {
    name: "My Home",
    address: "45 Tallis Circuit, Truganina, VIC, 3029",
    phone: "0406166577",
    email: "ms@insimplify.com.au",
  };